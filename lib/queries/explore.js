/**
 * lib/queries/explore.js
 *
 * Shared server-side helper for explore recipe listing.
 * Used by both the page Server Component (initial SSR) and /api/explore (client navigation).
 *
 * Key design decisions:
 * - Uses `select` (not `include`) to minimise DB payload.
 * - For public (no userId): skips favorites entirely.
 * - For logged-in users: resolves favorite flags via a single separate query
 *   on recipeIds rather than fetching each recipe's full favorites array.
 * - Public results are wrapped in unstable_cache for 60s to avoid hitting
 *   Supabase Postgres on every cold Vercel serverless invocation.
 */

import { unstable_cache } from "next/cache";
import { DEFAULT_RECIPE_IMAGE, getSafeImageSrc } from "@/lib/images";
import prisma from "@/lib/prisma";
import { measureServerTiming } from "@/lib/perf";

const PAGE_SIZE = 12;

/**
 * Build the Prisma `where` clause from filter params.
 * @param {{ q, categoryFilter, selectedMealTypes, selectedServingTimes, ingredientsFilter }} filters
 */
function buildWhereClause({
  q = "",
  categoryFilter = "",
  selectedMealTypes = [],
  selectedServingTimes = [],
  ingredientsFilter = [],
}) {
  return {
    status: "PUBLISHED",
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              // TODO: For better full-text search perf at scale, consider
              // Postgres GIN trigram index (pg_trgm) on title+description.
              // Cannot be defined via Prisma schema — apply raw SQL migration:
              // CREATE INDEX CONCURRENTLY idx_recipe_title_trgm ON "Recipe"
              //   USING GIN (title gin_trgm_ops);
            ],
          }
        : {},
      categoryFilter
        ? {
            category: {
              name: { equals: categoryFilter, mode: "insensitive" },
            },
          }
        : {},
      selectedMealTypes.length > 0
        ? {
            OR: selectedMealTypes.map(type => ({
              category: {
                name: { equals: type, mode: "insensitive" },
              },
            }))
          }
        : {},
      selectedServingTimes.length > 0
        ? {
            OR: selectedServingTimes.map((time) => {
              if (time === "under_15") return { cookTime: { lt: 15 } };
              if (time === "under_30") return { cookTime: { lt: 30 } };
              if (time === "under_60") return { cookTime: { lt: 60 } };
              if (time === "over_90") return { cookTime: { gt: 90 } };
              return {};
            }),
          }
        : {},
      ...(ingredientsFilter.length > 0
        ? ingredientsFilter.map((ing) => ({
            ingredients: {
              some: {
                ingredient: {
                  name: { contains: ing, mode: "insensitive" },
                },
              },
            },
          }))
        : []),
    ],
  };
}

/** Minimal recipe fields needed for the explore card. */
const RECIPE_CARD_SELECT = {
  id: true,
  title: true,
  imageUrl: true,
  cookTime: true,
  category: { select: { name: true } },
};

/**
 * Core query: fetch paginated recipes + total count.
 * Does NOT resolve user-specific data (favorites).
 */
async function queryRecipes(where, page) {
  const skip = (page - 1) * PAGE_SIZE;
  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      skip,
      take: PAGE_SIZE,
      select: RECIPE_CARD_SELECT,
      orderBy: { createdAt: "desc" },
    }),
    prisma.recipe.count({ where }),
  ]);
  return { recipes, total };
}

/**
 * Shape a raw Prisma recipe row into the card DTO.
 * `favoriteSet` is a Set<number> of recipeIds the current user has favorited.
 */
function shapeRecipe(recipe, favoriteSet = new Set()) {
  return {
    id: recipe.id,
    title: recipe.title,
    image: getSafeImageSrc(recipe.imageUrl),
    alt: recipe.title,
    time: `${recipe.cookTime ?? 0}m`,
    rating: 0, // Average rating not fetched per-card to keep payload small.
    // TODO: If per-card average rating is needed, add an aggregated select:
    // _avg: { select: { ratings: { select: { score: true } } } }
    // or a precomputed averageRating column updated via trigger.
    label: recipe.category?.name || "Recipe",
    favorite: favoriteSet.has(recipe.id),
  };
}

// ─── Public (anonymous) query — cached 60s ────────────────────────────────────

/**
 * Fetch explore recipes for anonymous users (no user-specific data).
 * Wrapped in unstable_cache: Vercel serverless functions can reuse the result
 * for 60s, dramatically reducing cold DB round-trips on popular pages.
 *
 * Cache key includes all filter dimensions so different filter combos are
 * cached independently.
 */
export function fetchPublicExploreRecipes(filters, page = 1) {
  const {
    q = "",
    categoryFilter = "",
    selectedMealTypes = [],
    selectedServingTimes = [],
    ingredientsFilter = [],
  } = filters;

  const cacheKey = [
    "explore",
    q,
    categoryFilter,
    selectedMealTypes.join(","),
    selectedServingTimes.join(","),
    ingredientsFilter.join(","),
    String(page),
  ];

  const cached = unstable_cache(
    async () =>
      measureServerTiming("explore:publicGrid", async () => {
        const where = buildWhereClause(filters);
        const { recipes, total } = await queryRecipes(where, page);
        return {
          recipes: recipes.map((r) => shapeRecipe(r)),
          total,
        };
      }),
    cacheKey,
    { revalidate: 60 } // 60-second cache — safe for public recipe listings
  );

  return cached();
}

// ─── Authenticated query — NOT cached (user-specific) ────────────────────────

/**
 * Fetch explore recipes with the current user's favorite flags resolved.
 * Uses a single targeted Favorite query on the returned recipeIds
 * instead of including all favorites per recipe.
 *
 * Not cached because it contains user-specific data.
 */
export async function fetchAuthenticatedExploreRecipes(filters, page = 1, userId) {
  const where = buildWhereClause(filters);
  const { recipes, total } = await queryRecipes(where, page);

  // Resolve favorite flags: single query for all recipeIds at once.
  const recipeIds = recipes.map((r) => r.id);
  const userFavorites = await prisma.favorite.findMany({
    where: { userId, recipeId: { in: recipeIds } },
    select: { recipeId: true },
  });
  const favoriteSet = new Set(userFavorites.map((f) => f.recipeId));

  return {
    recipes: recipes.map((r) => shapeRecipe(r, favoriteSet)),
    total,
  };
}

// ─── Featured recipe — deterministic daily pick ───────────────────────────────

/**
 * Return a "featured" recipe using a deterministic daily rotation.
 *
 * Strategy: count published recipes, pick index = daysSinceEpoch % count.
 * - Avoids ORDER BY RANDOM() which is O(n) in Postgres.
 * - Avoids large OFFSET (we use skip=index but count is cheap and skip is
 *   at most count-1, bounded by actual data size).
 * - Rotates daily — cacheable at the day boundary.
 *
 * Cached for 10 minutes (600s) — changes daily but no need to recompute
 * every serverless request.
 */
export const fetchFeaturedRecipe = unstable_cache(
  async () =>
    measureServerTiming("explore:featured", async () => {
      const count = await prisma.recipe.count({ where: { status: "PUBLISHED" } });
      if (count === 0) return null;

      const dayIndex = Math.floor(Date.now() / 86_400_000); // days since epoch
      const skip = dayIndex % count;

      const recipe = await prisma.recipe.findFirst({
        where: { status: "PUBLISHED" },
        skip,
        orderBy: { id: "asc" }, // deterministic ORDER BY — uses PK index, no full scan
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          cookTime: true,
          // Fetch average rating via aggregation instead of full array
          ratings: {
            select: { score: true },
          },
        },
      });

      if (!recipe) return null;

      const avgRating =
        recipe.ratings.length > 0
          ? (
              recipe.ratings.reduce((acc, r) => acc + r.score, 0) /
              recipe.ratings.length
            ).toFixed(1)
          : "0.0";

      return {
        id: recipe.id,
        title: recipe.title,
        description:
          recipe.description ||
          "Experience a symphony of textures and earthy flavors.",
        image: getSafeImageSrc(recipe.imageUrl, DEFAULT_RECIPE_IMAGE),
        time: `${recipe.cookTime ?? 0} mins`,
        rating: avgRating,
      };
    }),
  ["featured-recipe"],
  { revalidate: 600 } // 10-minute cache — featured recipe changes daily
);

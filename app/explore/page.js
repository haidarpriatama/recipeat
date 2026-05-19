import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import dynamic from "next/dynamic";
import FilterSidebar from "./FilterSidebar";
import ExploreGrid from "./ExploreGrid";
import { ArrowRight, Bell, Clock3, Globe, Star } from "lucide-react";
import {
  fetchFeaturedRecipe,
  fetchPublicExploreRecipes,
} from "@/lib/queries/explore";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { measureServerTiming } from "@/lib/perf";

export const metadata = {
  title: "Explore – Recipeat",
  description: "Discover new recipes and culinary inspiration.",
};

export const runtime = "nodejs";
export const preferredRegion = "sin1";

const SmartDiscovery = dynamic(
  () => import("@/components/SmartDiscovery/SmartDiscovery"),
  {
    loading: () => (
      <div className="mb-6 h-14 w-full animate-pulse rounded-xl bg-[#eff1f2]" />
    ),
  }
);

// Cache ingredients list for 5 minutes — changes rarely and is public data.
const fetchIngredients = unstable_cache(
  async () =>
    measureServerTiming("explore:ingredients", async () => {
      const rows = await prisma.ingredient.findMany({
        select: { name: true },
        take: 200,
        orderBy: { recipes: { _count: "desc" } },
      });
      return rows.map((r) => r.name);
    }),
  ["ingredients-list"],
  { revalidate: 300, tags: ["ingredients-list"] }
);

const EXPLORE_HERO_IMAGE = "";

// Default fallback for when no recipes exist in DB yet
const DEFAULT_FEATURED = {
  id: "",
  title: "Seasonal Harvest Buddha Bowl with Miso Dressing",
  description:
    "Experience a symphony of textures and earthy flavors curated by Chef Julian.",
  image: EXPLORE_HERO_IMAGE,
  time: "25 mins",
  rating: "5.0",
};

export default async function ExplorePage({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;

  // ── Parse filters from URL ────────────────────────────────────────────────
  const q = searchParams?.q || "";
  const selectedMealTypes = searchParams?.mealTypes
    ? searchParams.mealTypes.split(",").filter(Boolean)
    : [];
  const selectedServingTimes = searchParams?.servingTimes
    ? searchParams.servingTimes.split(",").filter(Boolean)
    : [];
  const ingredientsFilter = searchParams?.ingredients
    ? searchParams.ingredients.split(",").filter(Boolean)
    : [];
  const slotFilter = searchParams?.slot || "";
  const dateFilter = searchParams?.date || "";
  const page = parseInt(searchParams?.page || "1", 10);

  const filters = {
    q,
    categoryFilter: "",
    selectedMealTypes,
    selectedServingTimes,
    ingredientsFilter,
  };

  const [gridResult, featuredRecipe, ingredientsResult] = await Promise.allSettled([
    fetchPublicExploreRecipes(filters, page),
    fetchFeaturedRecipe(),
    fetchIngredients(),
  ]);

  const specialRecipeData =
    (featuredRecipe.status === "fulfilled" && featuredRecipe.value) ||
    DEFAULT_FEATURED;
  const availableIngredients =
    ingredientsResult.status === "fulfilled" ? ingredientsResult.value : [];

  const initialRecipes =
    gridResult.status === "fulfilled" ? gridResult.value.recipes : [];
  const initialTotal = gridResult.status === "fulfilled" ? gridResult.value.total : 0;

  if (gridResult.status === "rejected") {
    console.error("[explore] Failed to fetch initial recipes:", gridResult.reason);
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
      <main className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-12">
        <section className="relative mb-12 h-[320px] w-full overflow-hidden rounded-xl shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)] md:h-[380px]">
          <SafeImage
            src={specialRecipeData.image}
            alt={specialRecipeData.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            quality={70}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 max-w-2xl p-6 text-white md:p-8">
            <h1 className="mb-3 line-clamp-2 text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
              {specialRecipeData.title}
            </h1>
            <p className="mb-5 line-clamp-2 text-sm text-stone-200 md:line-clamp-3 md:text-base">
              {specialRecipeData.description}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              {specialRecipeData.id ? (
                <Link
                  href={`/recipes/${specialRecipeData.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-6 py-3 md:px-8 font-bold text-[#caffdc] transition-all hover:opacity-90"
                >
                  View Recipe
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-6 py-3 md:px-8 font-bold text-[#caffdc] transition-all hover:opacity-90"
                >
                  View Recipe
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-4 w-4" />
                  {specialRecipeData.time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#ffb800] text-[#ffb800]" />
                  {specialRecipeData.rating}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-12 lg:flex-row">
          <FilterSidebar
            selectedMealTypes={selectedMealTypes}
            selectedServingTimes={selectedServingTimes}
            searchParams={searchParams}
          />

          <section className="flex-1">
            <SmartDiscovery
              initialQuery={q}
              initialIngredients={ingredientsFilter}
              availableIngredients={availableIngredients}
            />

            <ExploreGrid
              slot={slotFilter}
              dateStr={dateFilter}
              initialRecipes={initialRecipes}
              initialTotal={initialTotal}
              initialPage={page}
            />
          </section>
        </div>
      </main>

      <footer className="mt-24 border-t border-[#abadae]/20 bg-[#eff1f2] px-6 py-12 md:px-12">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <span className="mb-6 block text-2xl font-bold tracking-tight text-[#006941]">Recipeat</span>
            <p className="mb-6 max-w-sm text-[#595c5d]">
              Redefining home cooking through seasonal inspiration and editorial-grade nutrition. Join our
              community of culinary curators.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-[#2c2f30]">Platform</h4>
            <ul className="space-y-4 font-medium text-[#595c5d]">
              <li><a className="transition-colors hover:text-[#006941]" href="#">Recipe Index</a></li>
              <li><a className="transition-colors hover:text-[#006941]" href="#">Meal Planner</a></li>
              <li><a className="transition-colors hover:text-[#006941]" href="#">Grocery Sync</a></li>
              <li><a className="transition-colors hover:text-[#006941]" href="#">Chef Program</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-[#2c2f30]">Resources</h4>
            <ul className="space-y-4 font-medium text-[#595c5d]">
              <li><a className="transition-colors hover:text-[#006941]" href="#">Help Center</a></li>
              <li><a className="transition-colors hover:text-[#006941]" href="#">Privacy Policy</a></li>
              <li><a className="transition-colors hover:text-[#006941]" href="#">Terms of Service</a></li>
              <li><a className="transition-colors hover:text-[#006941]" href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-screen-2xl flex-col justify-between gap-3 border-t border-[#abadae]/20 pt-8 text-xs font-bold uppercase tracking-widest text-[#595c5d] md:flex-row">
          <span>© 2025 Recipeat UI. All rights reserved.</span>
          <span>Designed for the Modern Kitchen</span>
        </div>
      </footer>
    </div>
  );
}

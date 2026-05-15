"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import FavoriteButton from "@/components/RecipeCard/FavoriteButton";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Star,
} from "lucide-react";

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm animate-pulse">
      <div className="relative h-56 bg-slate-200" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 h-5 w-3/4 rounded bg-slate-300" />
        <div className="mb-3 h-4 w-1/2 rounded bg-slate-200" />
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-4">
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-4 w-20 rounded bg-slate-200" />
          </div>
          <div className="h-4 w-4 rounded bg-slate-200" />
        </div>
      </div>
    </article>
  );
}

// ─── Recipe card ──────────────────────────────────────────────────────────────
function RecipeCard({ recipe, slot, dateStr }) {
  const params = new URLSearchParams();
  if (slot) params.set("slot", slot);
  if (dateStr) params.set("date", dateStr);
  const qs = params.toString();
  const destination = qs
    ? `/recipes/${recipe.id}?${qs}`
    : `/recipes/${recipe.id}`;

  return (
    <Link href={destination} className="block h-full">
      <article className="h-full group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-transparent bg-white shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)] transition-all hover:border-[#006941]/10">
        <div className="relative h-56">
          <SafeImage
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <FavoriteButton
            recipeId={recipe.id}
            initialFavorited={recipe.favorite}
            className="absolute right-4 top-4"
          />

          <div className="absolute bottom-4 left-4">
            <span className="rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
              {recipe.label}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-3 text-xl font-bold text-[#2c2f30] transition-colors group-hover:text-[#006941]">
            {recipe.title}
          </h3>

          <div className="mt-auto flex items-center justify-between text-[#595c5d]">
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {recipe.time}
              </span>
              <span className="inline-flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < (recipe.rating || 0)
                        ? "fill-[#ffb800] text-[#ffb800]"
                        : "text-[#abadae]"
                    }`}
                  />
                ))}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-[#006941] transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ExploreGrid({ slot, dateStr }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 12;
  const totalPages = Math.ceil(total / pageSize);

  // Build the API URL from current search params
  const buildApiUrl = useCallback(
    (params) => {
      const url = new URL("/api/explore", window.location.origin);
      for (const [key, value] of params.entries()) {
        url.searchParams.set(key, value);
      }
      return url.toString();
    },
    []
  );

  // Fetch recipes whenever search params change
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const fetchRecipes = async () => {
      try {
        const apiUrl = buildApiUrl(searchParams);
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) {
          setRecipes(data.recipes || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setRecipes([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchRecipes();
    return () => {
      cancelled = true;
    };
  }, [searchParams, buildApiUrl]);

  // Navigate to a page while preserving all other params
  const goToPage = (targetPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(targetPage));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const isTransitioning = isLoading || isPending;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-1 text-3xl font-extrabold tracking-tight">
            {searchParams.get("q") || searchParams.get("ingredients")
              ? "Search Results"
              : "Discover Flavors"}
          </h2>
          <p className="text-[#595c5d]">
            {isTransitioning ? (
              <span className="inline-block h-4 w-48 animate-pulse rounded bg-slate-200" />
            ) : (
              `${total} recipes found for your current selection`
            )}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {isTransitioning
          ? Array.from({ length: pageSize }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                slot={slot}
                dateStr={dateStr}
              />
            ))}
      </div>

      {/* Empty state */}
      {!isTransitioning && recipes.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center text-[#595c5d]">
          <span className="text-5xl">🍽️</span>
          <p className="text-lg font-semibold">No recipes found</p>
          <p className="text-sm">Try adjusting your filters or search query.</p>
        </div>
      )}

      {/* Pagination */}
      {!isTransitioning && totalPages > 1 && (
        <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => goToPage(Math.max(1, page - 1))}
            disabled={page <= 1 || isPending}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#abadae]/20 text-[#595c5d] transition-colors hover:bg-[#006941]/10 disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              disabled={isPending}
              style={page === i + 1 ? { color: "white" } : {}}
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors disabled:opacity-60 ${
                page === i + 1
                  ? "bg-[#006941]"
                  : "text-[#595c5d] hover:bg-[#006941]/10"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || isPending}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#abadae]/20 text-[#595c5d] transition-colors hover:bg-[#006941]/10 disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

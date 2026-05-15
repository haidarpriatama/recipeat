// dynamic is automatically set by Next.js because this page uses searchParams

import { Suspense } from "react";
import SafeImage from "@/components/ui/SafeImage";
import prisma from "@/lib/prisma";
import Link from "next/link";
import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import FilterSidebar from "./FilterSidebar";
import ExploreGrid from "./ExploreGrid";
import { ArrowRight, Bell, Clock3, Globe, Star } from "lucide-react";

export const metadata = {
  title: "Explore – Recipeat",
  description: "Discover new recipes and culinary inspiration.",
};

const SmartDiscovery = dynamic(
  () => import("@/components/SmartDiscovery/SmartDiscovery"),
  {
    loading: () => (
      <div className="mb-6 h-14 w-full animate-pulse rounded-xl bg-[#eff1f2]" />
    ),
  }
);




export default async function ExplorePage({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  const session = await auth();
  const userId = session?.user?.id;

  const query = searchParams?.q || "";
  const selectedMealTypes = searchParams?.mealTypes ? searchParams.mealTypes.split(",").filter(Boolean) : [];
  const selectedServingTimes = searchParams?.servingTimes ? searchParams.servingTimes.split(",").filter(Boolean) : [];
  const ingredientsFilter = searchParams?.ingredients ? searchParams.ingredients.split(",") : [];
  const slotFilter = searchParams?.slot || "";
  const dateFilter = searchParams?.date || "";

  let availableIngredients = [];
  let specialRecipeData = {
    id: "",
    title: "Seasonal Harvest Buddha Bowl with Miso Dressing",
    description: "Experience a symphony of textures and earthy flavors curated by Chef Julian. Freshly picked root vegetables meets silky fermented dressing.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTW3Cl9bj3m4KQymVuSqGCTkb_DiqKPFjNvng-3EOw10Ry8VXeNfQAC256wM3To0X6I9RqMZYUpVsp60bjXVlQlGcZCvGoDaJe0UKixOotAoazzHY4m6xXIdfjRI5agMytUlSCyetnVc1CxEw3-ql2pv3ZUM0rWEF2UE3gseIdsRdnpPN79o89TuOZl0GnwiCnoa2n8MSvuoMvoCuqRyExSjJySVR5QHDDUmvuqgHub2oJqxzSO1Xdl74HxWblhELbhINlMOu8h4uX",
    time: "25 mins",
    rating: "5.0",
  };

  try {
    const totalAllRecipesCount = await prisma.recipe.count();
    const randomSkip = totalAllRecipesCount > 0 ? Math.floor(Math.random() * totalAllRecipesCount) : 0;

    const [dbIngredients, randomRecipe] = await Promise.all([
      prisma.ingredient.findMany({
        select: { name: true, _count: { select: { recipes: true } } },
        take: 200,
        orderBy: { recipes: { _count: 'desc' } },
      }),
      totalAllRecipesCount > 0 ? prisma.recipe.findFirst({
        skip: randomSkip,
        where: { status: 'PUBLISHED' },
        include: { category: true, ratings: true }
      }) : null,
    ]);

    availableIngredients = dbIngredients.map((ingredient) => ingredient.name);

    if (randomRecipe) {
      const specialRating = randomRecipe.ratings && randomRecipe.ratings.length > 0
        ? (randomRecipe.ratings.reduce((acc, curr) => acc + curr.score, 0) / randomRecipe.ratings.length).toFixed(1)
        : "0.0";

      specialRecipeData = {
        id: randomRecipe.id,
        title: randomRecipe.title,
        description: randomRecipe.description || "Experience a symphony of textures and earthy flavors.",
        image: randomRecipe.imageUrl || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        time: `${randomRecipe.cookTime || 0} mins`,
        rating: specialRating,
      };
    }
  } catch (error) {
    console.error("Error fetching explore data:", error);
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
      <main className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-12">
        <section className="group relative mb-12 h-[450px] md:h-[500px] w-full overflow-hidden rounded-xl shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)]">
          <SafeImage
            src={specialRecipeData.image}
            alt={specialRecipeData.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 max-w-2xl p-8 md:p-10 text-white">
            <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight line-clamp-2">
              {specialRecipeData.title}
            </h1>
            <p className="mb-6 text-base md:text-lg text-stone-200 line-clamp-2 md:line-clamp-3">
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
          <FilterSidebar selectedMealTypes={selectedMealTypes} selectedServingTimes={selectedServingTimes} searchParams={searchParams} />

          <section className="flex-1">
            {/* Smart Discovery - search bar */}
            <SmartDiscovery
              initialQuery={query}
              initialIngredients={ingredientsFilter}
              availableIngredients={availableIngredients}
            />

            {/* Client-side grid with skeleton + pagination */}
            <Suspense fallback={
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <article key={i} className="flex h-full flex-col overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm animate-pulse">
                    <div className="relative h-56 bg-slate-200" />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-2 h-5 w-3/4 rounded bg-slate-300" />
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="h-4 w-16 rounded bg-slate-200" />
                          <div className="h-4 w-20 rounded bg-slate-200" />
                        </div>
                        <div className="h-4 w-4 rounded bg-slate-200" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            }>
              <ExploreGrid slot={slotFilter} dateStr={dateFilter} />
            </Suspense>
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
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#006941] shadow-sm"
                aria-label="Website"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#006941] shadow-sm"
                aria-label="Contact"
              >
                <Bell className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-[#2c2f30]">Platform</h4>
            <ul className="space-y-4 font-medium text-[#595c5d]">
              <li>
                <a className="transition-colors hover:text-[#006941]" href="#">
                  Recipe Index
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-[#006941]" href="#">
                  Meal Planner
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-[#006941]" href="#">
                  Grocery Sync
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-[#006941]" href="#">
                  Chef Program
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-[#2c2f30]">Resources</h4>
            <ul className="space-y-4 font-medium text-[#595c5d]">
              <li>
                <a className="transition-colors hover:text-[#006941]" href="#">
                  Help Center
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-[#006941]" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-[#006941]" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-[#006941]" href="#">
                  Contact Us
                </a>
              </li>
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

export const dynamic = "force-dynamic";

import Image from "next/image";
import prisma from "@/lib/prisma";
import Link from "next/link";
import SmartDiscovery from "@/components/SmartDiscovery/SmartDiscovery";
import { auth } from "@/lib/auth";
import FavoriteButton from "@/components/RecipeCard/FavoriteButton";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Globe,
  Heart,
  PlusCircle,
  Search,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Explore – Recipeat",
  description: "Discover new recipes and culinary inspiration.",
};

const FILTERS = {
  mealType: [
    { label: "Breakfast" },
    { label: "Lunch" },
    { label: "Dinner" },
  ],
};


const RECIPES = [
  {
    title: "Honey Glazed Salmon with Wild Asparagus",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaqVMxGkC0J2mMGTLfPuHneMbwXl55gvYVI9y7VFC9mLP7bH38-Wh37yzYSmGVfFlZJiye9_XeDVZr1sB2MNnmDX8z2z2b_yAiLgKfx-Bc6Omrd5bwDFgaz07F7Vi22mFTW9RDS1bVFmMggx2B3rqqiSoHTcT8ZrOOTr1rAKql1IfAPTVgBsN6FzA2h8KlS65S0zQqPhP-nX7kYL4TXPjLTacWEdXFca8bCd6FCwxxDNb4zln8tGJbBMIuVfmP7EXBT0mMIiQEdNHb",
    alt: "Pan-seared salmon with asparagus",
    time: "20m",
    rating: 5,
    label: "Dinner",
    favorite: true,
  },
  {
    title: "Crispy Chickpea & Kale Power Salad",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBkBXJj6V96CEHMlp-1HUE2bxX0skyARsVwVphmo2K8ISdGnQjrQ7weSbo6x4193qtGX_JpOcbpH9XBirr6ewndl_StgWH9QljvLhcLbgTeORdSUV6oQhwFFFOvD2wZAeP6YsndOwQcqYK95cG53gVCqAv6u1Vw7k45Rg36lxTytzPnF3nwfkgGbCYHB9HzFdgc686tffbqrINN2SnUkiTTcV5KPRBJ-aXJGBKjyWu6WEGw_HBHLGE74n34huLrKzf6OAAYM8bUW3G",
    alt: "Kale and chickpea salad bowl",
    time: "15m",
    rating: 4,
    label: "Vegan",
  },
  {
    title: "Artisan Sourdough Margherita Pizza",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANYdMcxH-k1Q9iqnxguwllBhZ__yqv7d8xOzulcXOx5Hn-Z2VUXQDLKdgvxVeW71UazftYmiK7M54HOgZSVAj7ExUA_53ZYAUJpL6_nbJPlANsvq4Ph8U803QLC4TM75H3tHa8BO3U0Qi6Y5sS4rbDUSFuKZiJ7RaWTJwRDSvAgmhVgUv-yq3ZI_Wiro6meyQ-Son_sFkXll9XQ8Fb0PSrkmZjdk5WsWj7f1vVoM4WVPxL9clV-v62cEFeAZSho_QBjhBMZ7A-bHhv",
    alt: "Margherita pizza with basil",
    time: "45m",
    rating: 5,
    label: "Italian",
  },
  {
    title: "Rainbow Fusion Bowl with Ginger Soy",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfj2KjEGeI4Wi4nSWKkKKc78boclluhCKxNsXguJDHuizDAeN0xK0TIj5ehYcRgx0RYRgCeiDGMXi_1lFDju3u36xzwekfqHOM5AKJuVkmmzRMjDteZwbSxon2d1-Ye1DL-Jmm06UocYWvw32OWFGbuqxdMiBvLMLZUue4D_MAYZiPR3Y_LFPjYhA6Q67xHcpyiMN5C203c65enGmIsubEqpKHQCQDGAnVa8YDS9muxBKiYPeV0m10Ys26OIBW5bXnCsBi8IHXMhyj",
    alt: "Colorful tofu and vegetable fusion bowl",
    time: "10m",
    rating: 0,
    label: "Lunch",
  },
  {
    title: "Herb-Roasted Poultry with Root Veloute",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9OB9DnbxggOSs4TxSOV_-SKhrVNKA-KRrYxLTs8t0aH7bvB6bR2vtAUANnOKO4rQtiItfLpJ7nWhqQoU9IxdY4-0B2tBqqWAmKBMQ-fAa36YkDg3A72DcN9E3O7EwK2HCiF_mgJo4aZslMgOy5dyHnVboWLdyoOILtmuMe5AFkUe5RK4CvzIbEp5fJVdBIafGoCMYEv9DkF5VqWpjgDBAtZvDZ9YL6xikEB3GFRqVEAf4WSTo9U8ksmnKz5uviIUfGdQxKlepUYvp",
    alt: "Roasted chicken with vegetables",
    time: "50m",
    rating: 5,
    label: "Dinner",
    favorite: true,
  },
  {
    title: "Garden Medley hors d'oeuvres",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzQndvPz-Q0UhK6-mEb7xKuz3XmROc6OK_W6PM9J010EbtOGI28cU20QwPG5mpwh2yGWwIq5PAR5Nbe5mWn9VfqWpQGBKmXq2bQMrW9paTKXKmDhMJhEjgKA-f_I49953dbNsAcP2TmXMSeLxjEr4ALzAWmaJXM7I6ifLHfm9uznwbsAfPQ3CQArzazEmIZzQob29aUtly4MaeDdMZOLKMZq0jks171DkkgGh1XVthsuKyO5FggHdUfNxgA8OFw_tzyANdFDrGgpeK",
    alt: "Vegetable appetizers assortment",
    time: "35m",
    rating: 0,
    label: "Snack",
  },
];

const SERVING_TIMES = [
  { label: "<15 min", value: "under_15" },
  { label: "<30 min", value: "under_30" },
  { label: "<60 min", value: "under_60" },
  { label: ">90 min", value: "over_90" },
];

function FilterSidebar({ selectedMealTypes = [], selectedServingTimes = [], searchParams = {} }) {
  return (
    <aside className="w-full space-y-10 lg:w-64 lg:flex-shrink-0">
      <div>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#006941]">Meal Type</h3>
        <div className="space-y-3">
          {FILTERS.mealType.map((item) => {
            const isSelected = selectedMealTypes.includes(item.label);
            const nextMealTypes = isSelected
              ? selectedMealTypes.filter((mealType) => mealType !== item.label)
              : [...selectedMealTypes, item.label];
            const params = new URLSearchParams(searchParams);

            if (nextMealTypes.length > 0) {
              params.set("mealTypes", nextMealTypes.join(","));
            } else {
              params.delete("mealTypes");
            }

            return (
              <Link key={item.label} href={`/explore?${params.toString()}`} className="group flex cursor-pointer items-center gap-3">
                <span className={`flex h-5 w-5 items-center justify-center rounded border ${
                  isSelected ? "border-[#006941] bg-[#006941]" : "border-[#abadae]/30 bg-white"
                }`}>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span className="font-medium text-[#595c5d] transition-colors group-hover:text-[#006941]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#006941]">Serving Time</h3>
        <div className="space-y-3">
          {SERVING_TIMES.map((item) => {
            const isSelected = selectedServingTimes.includes(item.value);
            const nextServingTimes = isSelected
              ? selectedServingTimes.filter((t) => t !== item.value)
              : [...selectedServingTimes, item.value];
            
            const params = new URLSearchParams(searchParams);

            if (nextServingTimes.length > 0) {
              params.set("servingTimes", nextServingTimes.join(","));
            } else {
              params.delete("servingTimes");
            }
            
            // Reset page on filter change
            params.delete("page");

            return (
              <Link key={item.label} href={`/explore?${params.toString()}`} className="group flex cursor-pointer items-center gap-3">
                <span className={`flex h-5 w-5 items-center justify-center rounded border ${
                  isSelected ? "border-[#006941] bg-[#006941]" : "border-[#abadae]/30 bg-white"
                }`}>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span className="font-medium text-[#595c5d] transition-colors group-hover:text-[#006941]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function RecipeCard({ recipe, slot, dateStr }) {
  const params = new URLSearchParams();
  if (slot) params.set('slot', slot);
  if (dateStr) params.set('date', dateStr);
  const qs = params.toString();
  const destination = qs ? `/recipes/${recipe.id}?${qs}` : `/recipes/${recipe.id}`;
  const cardContent = (
    <article className="h-full group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-transparent bg-white shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)] transition-all hover:border-[#006941]/10">
      <div className="relative h-56">
        <Image
          src={recipe.image}
          alt={recipe.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(min-width: 1280px) 26vw, (min-width: 768px) 40vw, 100vw"
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
                  className={`h-3.5 w-3.5 ${i < (recipe.rating || 0) ? "fill-[#ffb800] text-[#ffb800]" : "text-[#abadae]"}`}
                />
              ))}
            </span>
          </div>

          <ArrowRight className="h-4 w-4 text-[#006941] transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );

  if (recipe.id) {
    return <Link href={destination} className="block h-full">{cardContent}</Link>;
  }
  return cardContent;
}

export default async function ExplorePage({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  const session = await auth();
  const userId = session?.user?.id;

  const query = searchParams?.q || "";
  const categoryFilter = searchParams?.category || "";
  const slotFilter = searchParams?.slot || "";
  const dateFilter = searchParams?.date || "";
  const selectedMealTypes = searchParams?.mealTypes ? searchParams.mealTypes.split(",").filter(Boolean) : [];
  const selectedServingTimes = searchParams?.servingTimes ? searchParams.servingTimes.split(",").filter(Boolean) : [];
  const ingredientsFilter = searchParams?.ingredients ? searchParams.ingredients.split(",") : [];
  
  const page = parseInt(searchParams?.page || "1", 10);
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  let displayRecipes = [];
  let availableIngredients = [];
  let totalRecipesCount = 0;
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

    // Build the Prisma query filter
    const where = {
      AND: [
        query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        } : {},
        categoryFilter ? {
          category: { name: { equals: categoryFilter, mode: 'insensitive' } }
        } : {},
        selectedMealTypes.length > 0 ? {
          category: {
            name: { in: selectedMealTypes, mode: 'insensitive' }
          }
        } : {},
        selectedServingTimes.length > 0 ? {
          OR: selectedServingTimes.map((time) => {
            if (time === "under_15") return { cookTime: { lt: 15 } };
            if (time === "under_30") return { cookTime: { lt: 30 } };
            if (time === "under_60") return { cookTime: { lt: 60 } };
            if (time === "over_90") return { cookTime: { gt: 90 } };
            return {};
          })
        } : {},
        ingredientsFilter.length > 0 ? {
          ingredients: {
            some: {
              ingredient: {
                OR: ingredientsFilter.map(ing => ({
                  name: { contains: ing, mode: 'insensitive' }
                }))
              }
            }
          }
        } : {}
      ]
    };

    const [dbRecipes, dbIngredients, count, randomRecipe] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip,
        take: pageSize,
        include: { 
          category: true,
          favorites: userId ? { where: { userId } } : false,
          ratings: userId ? { where: { userId } } : false
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.ingredient.findMany({
        select: { name: true },
      }),
      prisma.recipe.count({ where }),
      totalAllRecipesCount > 0 ? prisma.recipe.findFirst({
        skip: randomSkip,
        include: { category: true, ratings: true }
      }) : null
    ]);
    totalRecipesCount = count;

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

    if (dbRecipes.length > 0) {
      displayRecipes = dbRecipes.map((recipe) => {
        const userRating = recipe.ratings && recipe.ratings.length > 0
          ? recipe.ratings[0].score
          : 0;
          
        return {
          id: recipe.id,
          title: recipe.title,
          image: recipe.imageUrl || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
          alt: recipe.title,
          time: `${recipe.cookTime}m`,
          rating: userRating,
          label: recipe.category?.name || "Recipe",
          favorite: recipe.favorites?.length > 0,
        };
      });
    } else if (!query && !categoryFilter && selectedMealTypes.length === 0 && ingredientsFilter.length === 0) {
      // Fallback to static data only if no search/filter is applied and DB is empty
      displayRecipes = RECIPES;
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    displayRecipes = RECIPES;
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
      <main className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-12">
        <section className="group relative mb-12 h-[450px] md:h-[500px] w-full overflow-hidden rounded-xl shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)]">
          <Image
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
            
            {/* INI DIA KOMPONEN SMART DISCOVERY YANG BARU */}
            <SmartDiscovery
              initialQuery={query}
              initialIngredients={ingredientsFilter}
              availableIngredients={availableIngredients}
            />

            {/* --- BAGIAN BAWAH (DISCOVER FLAVORS & RESEP) TETAP SAMA --- */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="mb-1 text-3xl font-extrabold tracking-tight">
                  {query || ingredientsFilter.length > 0 ? "Search Results" : "Discover Flavors"}
                </h2>
                <p className="text-[#595c5d]">{totalRecipesCount || displayRecipes.length} recipes found for your current selection</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {displayRecipes.map((recipe) => (
                <RecipeCard key={recipe.title} recipe={recipe} slot={slotFilter} dateStr={dateFilter} />
              ))}
            </div>

            {totalRecipesCount > pageSize && (
              <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
                <Link
                  href={`/explore?${new URLSearchParams({...searchParams, page: Math.max(1, page - 1)}).toString()}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#abadae]/20 text-[#595c5d] transition-colors hover:bg-[#006941]/10 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>

                {Array.from({ length: Math.ceil(totalRecipesCount / pageSize) }).map((_, i) => (
                  <Link
                    key={i + 1}
                    href={`/explore?${new URLSearchParams({...searchParams, page: i + 1}).toString()}`}
                    style={page === i + 1 ? { color: "white" } : {}}
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors ${
                      page === i + 1 ? "bg-[#006941]" : "text-[#595c5d] hover:bg-[#006941]/10"
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}

                <Link
                  href={`/explore?${new URLSearchParams({...searchParams, page: Math.min(Math.ceil(totalRecipesCount / pageSize), page + 1)}).toString()}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#abadae]/20 text-[#595c5d] transition-colors hover:bg-[#006941]/10 ${page >= Math.ceil(totalRecipesCount / pageSize) ? "pointer-events-none opacity-50" : ""}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
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

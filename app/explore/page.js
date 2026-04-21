import Image from "next/image";
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
} from "lucide-react";

const FILTERS = {
  mealType: [
    { label: "Breakfast", selected: true },
    { label: "Lunch" },
    { label: "Dinner", selected: true },
    { label: "Snacks" },
  ],
  dietary: [
    { label: "Vegan", active: true },
    { label: "Gluten-Free" },
    { label: "Keto", active: true },
    { label: "Low Carb" },
    { label: "Dairy-Free" },
  ],
  cuisines: ["Italian", "Mediterranean", "Japanese", "Mexican"],
};

const QUICK_ADD = [
  { label: "Eggs" },
  { label: "Spinach", added: true },
  { label: "Tomato" },
  { label: "Garlic", added: true },
  { label: "Onion" },
  { label: "Olive Oil" },
];

const RECIPES = [
  {
    title: "Honey Glazed Salmon with Wild Asparagus",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaqVMxGkC0J2mMGTLfPuHneMbwXl55gvYVI9y7VFC9mLP7bH38-Wh37yzYSmGVfFlZJiye9_XeDVZr1sB2MNnmDX8z2z2b_yAiLgKfx-Bc6Omrd5bwDFgaz07F7Vi22mFTW9RDS1bVFmMggx2B3rqqiSoHTcT8ZrOOTr1rAKql1IfAPTVgBsN6FzA2h8KlS65S0zQqPhP-nX7kYL4TXPjLTacWEdXFca8bCd6FCwxxDNb4zln8tGJbBMIuVfmP7EXBT0mMIiQEdNHb",
    alt: "Pan-seared salmon with asparagus",
    time: "20m",
    calories: "340 kcal",
    label: "Dinner",
    favorite: true,
  },
  {
    title: "Crispy Chickpea & Kale Power Salad",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBkBXJj6V96CEHMlp-1HUE2bxX0skyARsVwVphmo2K8ISdGnQjrQ7weSbo6x4193qtGX_JpOcbpH9XBirr6ewndl_StgWH9QljvLhcLbgTeORdSUV6oQhwFFFOvD2wZAeP6YsndOwQcqYK95cG53gVCqAv6u1Vw7k45Rg36lxTytzPnF3nwfkgGbCYHB9HzFdgc686tffbqrINN2SnUkiTTcV5KPRBJ-aXJGBKjyWu6WEGw_HBHLGE74n34huLrKzf6OAAYM8bUW3G",
    alt: "Kale and chickpea salad bowl",
    time: "15m",
    calories: "280 kcal",
    label: "Vegan",
  },
  {
    title: "Artisan Sourdough Margherita Pizza",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANYdMcxH-k1Q9iqnxguwllBhZ__yqv7d8xOzulcXOx5Hn-Z2VUXQDLKdgvxVeW71UazftYmiK7M54HOgZSVAj7ExUA_53ZYAUJpL6_nbJPlANsvq4Ph8U803QLC4TM75H3tHa8BO3U0Qi6Y5sS4rbDUSFuKZiJ7RaWTJwRDSvAgmhVgUv-yq3ZI_Wiro6meyQ-Son_sFkXll9XQ8Fb0PSrkmZjdk5WsWj7f1vVoM4WVPxL9clV-v62cEFeAZSho_QBjhBMZ7A-bHhv",
    alt: "Margherita pizza with basil",
    time: "45m",
    calories: "520 kcal",
    label: "Italian",
  },
  {
    title: "Rainbow Fusion Bowl with Ginger Soy",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfj2KjEGeI4Wi4nSWKkKKc78boclluhCKxNsXguJDHuizDAeN0xK0TIj5ehYcRgx0RYRgCeiDGMXi_1lFDju3u36xzwekfqHOM5AKJuVkmmzRMjDteZwbSxon2d1-Ye1DL-Jmm06UocYWvw32OWFGbuqxdMiBvLMLZUue4D_MAYZiPR3Y_LFPjYhA6Q67xHcpyiMN5C203c65enGmIsubEqpKHQCQDGAnVa8YDS9muxBKiYPeV0m10Ys26OIBW5bXnCsBi8IHXMhyj",
    alt: "Colorful tofu and vegetable fusion bowl",
    time: "10m",
    calories: "310 kcal",
    label: "Lunch",
  },
  {
    title: "Herb-Roasted Poultry with Root Veloute",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9OB9DnbxggOSs4TxSOV_-SKhrVNKA-KRrYxLTs8t0aH7bvB6bR2vtAUANnOKO4rQtiItfLpJ7nWhqQoU9IxdY4-0B2tBqqWAmKBMQ-fAa36YkDg3A72DcN9E3O7EwK2HCiF_mgJo4aZslMgOy5dyHnVboWLdyoOILtmuMe5AFkUe5RK4CvzIbEp5fJVdBIafGoCMYEv9DkF5VqWpjgDBAtZvDZ9YL6xikEB3GFRqVEAf4WSTo9U8ksmnKz5uviIUfGdQxKlepUYvp",
    alt: "Roasted chicken with vegetables",
    time: "50m",
    calories: "480 kcal",
    label: "Dinner",
    favorite: true,
  },
  {
    title: "Garden Medley hors d'oeuvres",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzQndvPz-Q0UhK6-mEb7xKuz3XmROc6OK_W6PM9J010EbtOGI28cU20QwPG5mpwh2yGWwIq5PAR5Nbe5mWn9VfqWpQGBKmXq2bQMrW9paTKXKmDhMJhEjgKA-f_I49953dbNsAcP2TmXMSeLxjEr4ALzAWmaJXM7I6ifLHfm9uznwbsAfPQ3CQArzazEmIZzQob29aUtly4MaeDdMZOLKMZq0jks171DkkgGh1XVthsuKyO5FggHdUfNxgA8OFw_tzyANdFDrGgpeK",
    alt: "Vegetable appetizers assortment",
    time: "35m",
    calories: "190 kcal",
    label: "Snack",
  },
];

function FilterSidebar() {
  return (
    <aside className="w-full space-y-10 lg:w-64 lg:flex-shrink-0">
      <div>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#006941]">Meal Type</h3>
        <div className="space-y-3">
          {FILTERS.mealType.map((item) => (
            <label key={item.label} className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                defaultChecked={item.selected}
                className="h-5 w-5 rounded border-[#abadae]/30 accent-[#006941]"
              />
              <span className="font-medium text-[#595c5d] transition-colors group-hover:text-[#006941]">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#006941]">Serving Time</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="5"
            max="120"
            defaultValue="45"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#e6e8ea] accent-[#006941]"
          />
          <div className="flex justify-between text-xs font-bold text-[#595c5d]">
            <span>Under 15m</span>
            <span>Max 2h</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#006941]">
          Dietary Preferences
        </h3>
        <div className="flex flex-wrap gap-2">
          {FILTERS.dietary.map((item) => (
            <span
              key={item.label}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                item.active
                  ? "border border-[#e4ede5] bg-[#f3fcf3] text-[#58615a]"
                  : "bg-[#eff1f2] text-[#595c5d]"
              }`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#006941]">Cuisines</h3>
        <div className="space-y-3">
          {FILTERS.cuisines.map((cuisine) => (
            <label key={cuisine} className="group flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="cuisine"
                defaultChecked={cuisine === "Mexican"}
                className="h-5 w-5 border-[#abadae]/30 accent-[#006941]"
              />
              <span className="font-medium text-[#595c5d] transition-colors group-hover:text-[#006941]">
                {cuisine}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

function RecipeCard({ recipe }) {
  return (
    <article className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-transparent bg-white shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)] transition-all hover:border-[#006941]/10">
      <div className="relative h-56">
        <Image
          src={recipe.image}
          alt={recipe.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(min-width: 1280px) 26vw, (min-width: 768px) 40vw, 100vw"
        />

        <button
          type="button"
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors hover:bg-white ${
            recipe.favorite ? "text-[#8c4a00]" : "text-[#757778]"
          }`}
          aria-label="Toggle favorite"
        >
          <Heart className="h-5 w-5" fill={recipe.favorite ? "currentColor" : "none"} />
        </button>

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
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              {recipe.calories}
            </span>
          </div>

          <ArrowRight className="h-4 w-4 text-[#006941] transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
      <main className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-12">
        <section className="mb-8 rounded-xl border border-[#abadae]/15 bg-[#f8f9f9] p-4 shadow-sm shadow-[#006941]/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#595c5d]" />
              <input
                type="text"
                placeholder="Search recipes, ingredients..."
                className="w-full rounded-md border border-[#abadae]/20 bg-white py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#006941]/30 focus:ring-2 focus:ring-[#006941]/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#595c5d] transition-colors hover:bg-[#eff1f2] hover:text-[#006941]"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </button>

              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#d9efe3]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDREpvjVNS31SasBbNF9YiJDnYD9NnYwmZ5No5gdAE74FPLJSWRVXFG-3zWhtynyFmVr3CNi9pMGNb6_UpOTSBujLC2jz7dLssWmSWOBC69SX8fetFGkkFx2QK6lIINxwlLRBEy8VWPu4hpQs6khePc36s3u3x9225ZwRhxlK6ZY5Eal4hrNf2tV4XImmKHjLtglZdncs88xZNBH4xqTYogW6NuC6X9nDZH9EjnKMg4s5yQkwyfT0KUo6MCKLDLhDlghuPUIt9OPMTk"
                  alt="User profile"
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="group relative mb-12 h-[400px] w-full overflow-hidden rounded-xl shadow-[0_32px_64px_-12px_rgba(0,105,65,0.08)]">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTW3Cl9bj3m4KQymVuSqGCTkb_DiqKPFjNvng-3EOw10Ry8VXeNfQAC256wM3To0X6I9RqMZYUpVsp60bjXVlQlGcZCvGoDaJe0UKixOotAoazzHY4m6xXIdfjRI5agMytUlSCyetnVc1CxEw3-ql2pv3ZUM0rWEF2UE3gseIdsRdnpPN79o89TuOZl0GnwiCnoa2n8MSvuoMvoCuqRyExSjJySVR5QHDDUmvuqgHub2oJqxzSO1Xdl74HxWblhELbhINlMOu8h4uX"
            alt="Seasonal Harvest Buddha Bowl"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 max-w-2xl p-10 text-white">
            <span className="mb-4 inline-block rounded-full bg-[#006941] px-4 py-1 text-xs font-bold uppercase tracking-widest">
              Today&apos;s Special
            </span>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Seasonal Harvest Buddha Bowl with Miso Dressing
            </h1>
            <p className="mb-6 text-lg text-stone-200">
              Experience a symphony of textures and earthy flavors curated by Chef Julian. Freshly picked
              root vegetables meets silky fermented dressing.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-8 py-3 font-bold text-[#caffdc] transition-all hover:opacity-90"
              >
                View Recipe
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-4 w-4" />
                  25 mins
                </span>
                <span className="inline-flex items-center gap-1">
                  <Flame className="h-4 w-4" />
                  420 kcal
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-12 lg:flex-row">
          <FilterSidebar />

          <section className="flex-1">
            <div className="mb-10 rounded-2xl border border-[#abadae]/10 bg-[#eff1f2] p-8">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="mb-2 text-xl font-extrabold tracking-tight">Smart Discovery</h2>
                  <p className="text-sm font-medium text-[#595c5d]">
                    Find recipes based on what&apos;s in your pantry right now.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4 md:flex-row">
                  <div className="relative w-full flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#595c5d]" />
                    <input
                      type="text"
                      placeholder="Search for ingredients (e.g. Salmon, Kale, Garlic...)"
                      className="w-full rounded-xl border border-[#abadae]/20 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none transition-all focus:border-[#006941] focus:ring-2 focus:ring-[#006941]/20"
                    />
                  </div>

                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#006941] px-10 py-3.5 font-bold text-white transition-all hover:bg-[#005c38] md:w-auto"
                  >
                    Cari Resep
                    <Search className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#006941]">Quick Add</h3>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_ADD.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                          item.added
                            ? "border-[#006941] bg-[#7bfeb8]/30 font-bold text-[#006941]"
                            : "border-[#abadae]/30 bg-white font-semibold text-[#595c5d] hover:border-[#006941] hover:text-[#006941]"
                        }`}
                      >
                        {item.added ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <PlusCircle className="h-4 w-4" />
                        )}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="mb-1 text-3xl font-extrabold tracking-tight">Discover Flavors</h2>
                <p className="text-[#595c5d]">248 recipes found for your current selection</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#595c5d]">Sort by:</span>
                <select className="cursor-pointer bg-transparent font-bold text-[#006941] outline-none">
                  <option>Most Popular</option>
                  <option>Newest First</option>
                  <option>Quickest Prep</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {RECIPES.map((recipe) => (
                <RecipeCard key={recipe.title} recipe={recipe} />
              ))}
            </div>

            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#abadae]/20 text-[#595c5d] transition-colors hover:bg-[#006941]/10"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button type="button" className="h-10 w-10 rounded-full bg-[#006941] font-bold text-[#caffdc]">
                1
              </button>
              <button
                type="button"
                className="h-10 w-10 rounded-full font-bold text-[#595c5d] transition-colors hover:bg-[#006941]/10"
              >
                2
              </button>
              <button
                type="button"
                className="h-10 w-10 rounded-full font-bold text-[#595c5d] transition-colors hover:bg-[#006941]/10"
              >
                3
              </button>
              <span className="px-2 text-[#595c5d]">...</span>
              <button
                type="button"
                className="h-10 w-10 rounded-full font-bold text-[#595c5d] transition-colors hover:bg-[#006941]/10"
              >
                12
              </button>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#abadae]/20 text-[#595c5d] transition-colors hover:bg-[#006941]/10"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
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
          <span>© 2024 Recipeat UI. All rights reserved.</span>
          <span>Designed for the Modern Kitchen</span>
        </div>
      </footer>
    </div>
  );
}
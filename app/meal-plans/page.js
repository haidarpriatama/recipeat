import Image from "next/image";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Flame,
  PlusCircle,
  Share2,
  ShoppingBasket,
  Timer,
  UtensilsCrossed,
} from "lucide-react";
import { footerContent } from "@/components/content/landingContent";
import SiteFooter from "@/components/layout/SiteFooter";
import ActionLink from "@/components/ui/ActionLink";
import SectionHeading from "@/components/ui/SectionHeading";
import AuthGuard from "@/components/layout/AuthGuard";

export const metadata = {
  title: "Meal Plans – Recipeat",
  description: "Plan your weekly meals and track nutrition.",
};

const CALENDAR_DAYS = [
  { label: 28, muted: true },
  { label: 29, muted: true },
  { label: 30, muted: true },
  { label: 1 },
  { label: 2 },
  { label: 3 },
  { label: 4 },
  { label: 5 },
  { label: 6, active: true },
  { label: 7 },
  { label: 8 },
  { label: 9 },
  { label: 10 },
  { label: 11 },
  { label: 12 },
];

const DAILY_NUTRITION = [
  { label: "Protein", current: 85, target: 120, unit: "g", track: "bg-[#dadddf]", fill: "bg-[#006941]" },
  { label: "Carbs", current: 180, target: 250, unit: "g", track: "bg-[#dadddf]", fill: "bg-[#8c4a00]" },
  { label: "Fats", current: 45, target: 65, unit: "g", track: "bg-[#dadddf]", fill: "bg-[#555e57]" },
];

const TIMELINE_MEALS = [
  {
    slot: "Breakfast",
    time: "08:00 AM",
    title: "Garden Smash Avocado Toast",
    description:
      "Creamy smashed avocado with heirloom radishes and a perfectly poached free-range egg on toasted rye.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoXe21ffc99OW3brb9qebAmWlRgVV5jwDngMxGEn1rlTU4eamJ4ShdlxbAtTm8c4ofXb37GFv-rkLjB1OFlbd0JXBERfzExahIY79MvvyeZ6QkBmleyqwMiOdMxM8xpGztSO4Wql_vh-f21a1GT0-jWk9vXvBQu5o3dCc8Vld0-CjNQRvsFaX45yLnP-RyOgKH_V-JQoqENXQyqYK1xzXDOWuNT3sKZ8-b70oO5OMuplwhQ6ztwK9tmD6sQa5uk7NLDI2Rzx6bjd59",
    imageAlt: "Avocado toast with poached egg",
    prepTime: "12 min",
    difficulty: "Simple",
    calories: "340 kcal",
  },
  {
    slot: "Lunch",
    time: "01:30 PM",
    title: "Honey Glazed Salmon Bowl",
    description:
      "Wild-caught salmon over a bed of fluffy quinoa, roasted harvest vegetables, and a citrus-honey glaze.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBU_gRjB6CjHfcjmnJZKWcqurq4-k94ZYDfrJD76oSfeNWqtJ8wPb8ahWXn4Yc8wcCkHw7dfgEtu3qTShJrFuyr_h8IUXH5W-7yYOthQwWBZyBvEUfTzjIGSbB5nz2Zbap362nyBJHomLJb_HkVT9sgTenD6bqRL1Vlie5C8HhZflHMo9z1CR9igGqtO9s5cZNbF054BePNKcXR5ja_6gXMYENDvuUZEe-uvkmsHw-Y-5EgrhTDLiHvWHWwPUUCQtcHlwZD-oEgtrp7",
    imageAlt: "Healthy salmon quinoa bowl",
    prepTime: "25 min",
    difficulty: "Medium",
    calories: "580 kcal",
  },
  {
    slot: "Dinner",
    time: "07:30 PM",
    empty: true,
  },
];

const GROCERY_GROUPS = [
  {
    title: "Produce",
    items: [
      { label: "Ripe Avocados (3)" },
      { label: "Baby Spinach", checked: true },
      { label: "Heirloom Radishes" },
    ],
  },
  {
    title: "Proteins",
    items: [{ label: "Wild Salmon Fillets (2)" }, { label: "Free-range Eggs (12)" }],
  },
  {
    title: "Pantry",
    items: [{ label: "Quinoa (Organic)" }, { label: "Linguine Pasta" }],
  },
];

function CalendarCard() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,105,65,0.08)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">October 2024</h3>
        <div className="flex items-center gap-1 text-[#595c5d]">
          <button
            type="button"
            aria-label="Previous month"
            className="rounded-full p-1 transition-colors hover:bg-[#eff1f2] hover:text-[#006941]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            className="rounded-full p-1 transition-colors hover:bg-[#eff1f2] hover:text-[#006941]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-semibold text-[#595c5d]">
        {"MTWTFSS".split("").map((day, index) => (
          <span key={`${day}-${index}`} className="uppercase">
            {day}
          </span>
        ))}

        {CALENDAR_DAYS.map((day) => (
          <button
            key={day.label}
            type="button"
            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              day.active
                ? "bg-[#006941] font-bold text-white shadow-lg shadow-[#006941]/20"
                : day.muted
                  ? "text-[#abadae]"
                  : "hover:bg-[#eff1f2]"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function TimelineItem({ meal }) {
  if (meal.empty) {
    return (
      <article className="group relative pl-16">
        <div className="absolute left-4 top-1 z-10 h-4 w-4 rounded-full bg-[#006941] ring-4 ring-[#caffdc]" />

        <div className="mb-4 flex items-center gap-4">
          <span className="rounded-full bg-[#f3fcf3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#58615a]">
            {meal.slot}
          </span>
          <span className="text-sm font-medium text-[#595c5d]">{meal.time}</span>
        </div>

        <button
          type="button"
          className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#abadae] bg-white/60 p-8 text-center transition-all hover:border-[#006941] hover:bg-[#f3fcf3]"
        >
          <PlusCircle className="mb-2 h-9 w-9 text-[#757778] transition-colors group-hover:text-[#006941]" />
          <span className="text-sm font-bold text-[#757778] transition-colors group-hover:text-[#006941]">
            Plan your dinner
          </span>
        </button>
      </article>
    );
  }

  return (
    <article className="group relative pl-16">
      <div className="absolute left-4 top-1 z-10 h-4 w-4 rounded-full bg-[#006941] ring-4 ring-[#caffdc]" />

      <div className="mb-4 flex items-center gap-4">
        <span className="rounded-full bg-[#f3fcf3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#58615a]">
          {meal.slot}
        </span>
        <span className="text-sm font-medium text-[#595c5d]">{meal.time}</span>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_38px_-14px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_16px_38px_-14px_rgba(0,105,65,0.25)] md:flex">
        <div className="relative h-48 md:h-auto md:w-1/3">
          <Image
            src={meal.image}
            alt={meal.imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 35vw, 100vw"
          />
        </div>

        <div className="flex flex-col justify-between p-6 md:w-2/3">
          <div>
            <h3 className="mb-2 text-xl font-bold">{meal.title}</h3>
            <p className="text-sm text-[#595c5d]">{meal.description}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-xs font-semibold text-[#595c5d]">
            <span className="inline-flex items-center gap-1.5">
              <Timer className="h-4 w-4 text-[#006941]" />
              {meal.prepTime}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UtensilsCrossed className="h-4 w-4 text-[#006941]" />
              {meal.difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-[#006941]" />
              {meal.calories}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function MealTimeline() {
  return (
    <div className="relative space-y-12 before:absolute before:bottom-4 before:left-6 before:top-4 before:w-0.5 before:bg-[#7bfeb8]">
      {TIMELINE_MEALS.map((meal) => (
        <TimelineItem key={`${meal.slot}-${meal.time}`} meal={meal} />
      ))}
    </div>
  );
}



export default function MealPlansPage() {
  return (
    <AuthGuard>
    <>
      <div className="bg-[#f5f6f7] text-[#2c2f30]">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-12 lg:px-10">
          <aside className="space-y-6 lg:col-span-3">
            <CalendarCard />
          </aside>

          <section className="space-y-8 lg:col-span-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#006941]">Today&apos;s Journey</span>
                <SectionHeading
                  title="Monday, Oct 6"
                  className="mt-1"
                  titleClassName="text-4xl md:text-5xl"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#abadae]/25 bg-white text-[#595c5d] transition-colors hover:text-[#006941]"
                >
                  <Bell className="h-5 w-5" />
                </button>

                {/* Tombol keranjang belanja sudah dihapus dari sini */}
                <ActionLink href="/recipes" size="sm" className="rounded-xl !text-white hover:!text-white">
                  Cook Now
                </ActionLink>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-white p-2 shadow-sm shadow-[#2c2f30]/10">
              <button
                type="button"
                className="rounded-full bg-[#006941] px-4 py-1.5 text-xs font-bold text-white"
                aria-pressed="true"
              >
                Daily View
              </button>
              <button
                type="button"
                className="rounded-full px-4 py-1.5 text-xs font-bold text-[#595c5d] transition-colors hover:bg-[#eff1f2]"
                aria-pressed="false"
              >
                Weekly View
              </button>
            </div>

            <MealTimeline />
          </section>

          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter
        brand={footerContent.brand}
        legalText={footerContent.legalText}
        socialItems={footerContent.socialItems}
        linkGroups={footerContent.linkGroups}
      />
    </>
    </AuthGuard>
  );
}
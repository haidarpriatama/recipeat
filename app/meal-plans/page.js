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
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import MealCard from "@/components/MealPlan/MealCard";

export const metadata = {
  title: "Meal Plans – Recipeat",
  description: "Plan your weekly meals and track nutrition.",
};

// Helper to get day name
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function MealPlansPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const today = new Date();
  const dayName = DAYS[today.getDay()];

  let mealPlan = null;
  let todayMeals = [];
  let nutritionTotals = { protein: 0, carbs: 0, fats: 0 };

  if (userId) {
    // Find the latest meal plan for this user
    mealPlan = await prisma.mealPlan.findFirst({
      where: { userId },
      include: {
        recipes: {
          include: { recipe: { include: { category: true } } }
        }
      },
      orderBy: { weekStart: 'desc' }
    });

    if (mealPlan) {
      todayMeals = mealPlan.recipes.filter(r => r.dayOfWeek === dayName);
    }

    nutritionTotals = todayMeals.reduce((acc, curr) => ({
      protein: acc.protein + (curr.recipe.protein || 0),
      carbs: acc.carbs + (curr.recipe.carbs || 0),
      fats: acc.fats + (curr.recipe.fats || 0),
    }), { protein: 0, carbs: 0, fats: 0 });
  }

  const slots = ["Breakfast", "Lunch", "Dinner"];
  const getSlotTime = (slot) => slot === "Breakfast" ? "08:00 AM" : slot === "Lunch" ? "01:30 PM" : "07:30 PM";
  const timelineMeals = slots.map((slot) => {
    const slotMeals = todayMeals.filter(r => r.mealType === slot);
    const meals = slotMeals.map((mealRecord) => ({
      slot,
      mealType: slot,
      time: getSlotTime(slot),
      title: mealRecord.recipe.title,
      description: mealRecord.recipe.description || "No description available.",
      image: mealRecord.recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      imageAlt: mealRecord.recipe.title,
      prepTime: `${mealRecord.recipe.cookTime} min`,
      difficulty: "Medium",
      calories: `${((mealRecord.recipe.protein || 0) * 4) + ((mealRecord.recipe.carbs || 0) * 4) + ((mealRecord.recipe.fats || 0) * 9)} kcal`,
      id: mealRecord.recipe.id,
      mealPlanId: mealPlan.id,
      dayOfWeek: mealRecord.dayOfWeek
    }));

    return {
      slot,
      mealType: slot,
      time: getSlotTime(slot),
      meals,
      remaining: 3 - slotMeals.length,
    };
  });

  // Nutrition goals with fallback defaults
  const nutritionGoals = userId && mealPlan ? [
    { label: "Protein", current: nutritionTotals.protein, target: 120, unit: "g", track: "bg-[#dadddf]", fill: "bg-[#006941]" },
    { label: "Carbs", current: nutritionTotals.carbs, target: 250, unit: "g", track: "bg-[#dadddf]", fill: "bg-[#8c4a00]" },
    { label: "Fats", current: nutritionTotals.fats, target: 65, unit: "g", track: "bg-[#dadddf]", fill: "bg-[#555e57]" },
  ] : [
    { label: "Protein", current: 0, target: 120, unit: "g", track: "bg-[#dadddf]", fill: "bg-[#006941]" },
    { label: "Carbs", current: 0, target: 250, unit: "g", track: "bg-[#dadddf]", fill: "bg-[#8c4a00]" },
    { label: "Fats", current: 0, target: 65, unit: "g", track: "bg-[#dadddf]", fill: "bg-[#555e57]" },
  ];

  return (
    <AuthGuard>
    <>
      <div className="bg-[#f5f6f7] text-[#2c2f30] pt-20">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-12 lg:px-10">
          <aside className="space-y-6 lg:col-span-3">
            <CalendarCard />
          </aside>

          <section className="space-y-8 lg:col-span-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#006941]">Today&apos;s Journey</span>
                <SectionHeading
                  title={`${dayName}, ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
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

                <ActionLink href="/explore" size="sm" className="rounded-xl !text-white hover:!text-white">
                  Add Recipes
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

            <div className="relative space-y-12 before:absolute before:bottom-4 before:left-6 before:top-4 before:w-0.5 before:bg-[#7bfeb8]">
              {timelineMeals.map((group) => (
                <TimelineItem key={group.slot} group={group} />
              ))}
            </div>
          </section>
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

function CalendarCard() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,105,65,0.08)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">May 2026</h3>
        <div className="flex items-center gap-1 text-[#595c5d]">
          <button type="button" className="rounded-full p-1 transition-colors hover:bg-[#eff1f2] hover:text-[#006941]"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" className="rounded-full p-1 transition-colors hover:bg-[#eff1f2] hover:text-[#006941]"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-semibold text-[#595c5d]">
        {"MTWTFSS".split("").map((day, index) => (<span key={`${day}-${index}`} className="uppercase">{day}</span>))}
        {CALENDAR_DAYS.map((day) => (
          <button key={day.label} className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${day.active ? "bg-[#006941] font-bold text-white shadow-lg shadow-[#006941]/20" : day.muted ? "text-[#abadae]" : "hover:bg-[#eff1f2]"}`}>
            {day.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function TimelineItem({ group }) {
  return (
    <article className="group relative pl-16">
      <div className="absolute left-4 top-1 z-10 h-4 w-4 rounded-full bg-[#006941] ring-4 ring-[#caffdc]" />
      <div className="mb-4 flex items-center gap-4">
        <span className="rounded-full bg-[#f3fcf3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#58615a]">{group.slot}</span>
        <span className="text-sm font-medium text-[#595c5d]">{group.time}</span>
      </div>

      <div className="space-y-4">
        {group.meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} compact />
        ))}

        {group.remaining > 0 && (
          <Link href={`/explore?slot=${group.slot}`} className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#abadae] bg-white/60 p-8 text-center transition-all hover:border-[#006941] hover:bg-[#f3fcf3]">
            <PlusCircle className="mb-2 h-9 w-9 text-[#757778] transition-colors group-hover:text-[#006941]" />
            <span className="text-sm font-bold text-[#757778] transition-colors group-hover:text-[#006941]">Plan your {group.slot.toLowerCase()}</span>
            <span className="mt-1 text-xs font-medium text-[#959798]">{group.remaining} slot{group.remaining === 1 ? "" : "s"} left</span>
          </Link>
        )}
      </div>
    </article>
  );
}

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
import CalendarCardClient from "@/components/MealPlan/CalendarCardClient";
import { Suspense } from "react";

export const metadata = {
  title: "Meal Plans – Recipeat",
  description: "Plan your weekly meals and track nutrition.",
};

// Helper to get day name
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function MealPlansPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const dateParam = resolvedSearchParams?.date;

  const session = await auth();
  const userId = session?.user?.id;
  
  let today = new Date();
  if (dateParam) {
    const parsed = new Date(dateParam);
    if (!isNaN(parsed)) {
      const [y, m, d] = dateParam.split('-');
      if (y && m && d) {
        today = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      }
    }
  }
  
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const dayName = DAYS[today.getDay()];

  let mealPlan = null;
  let todayMeals = [];
  let nutritionTotals = { protein: 0, carbs: 0, fats: 0 };

  if (userId) {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (dbUser) {
      // Normalize to Monday 00:00:00 for the week start
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
      weekStart.setHours(0, 0, 0, 0);

      // Find the meal plan for this user for the specific week
      mealPlan = await prisma.mealPlan.findFirst({
        where: { userId: dbUser.id, weekStart },
      include: {
        recipes: {
          include: { recipe: { include: { category: true, ratings: true } } }
        }
      }
    });

      if (mealPlan) {
        todayMeals = mealPlan.recipes.filter(r => r.dayOfWeek === dayName);
      }

      nutritionTotals = { protein: 0, carbs: 0, fats: 0 };
    }
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
      rating: mealRecord.recipe.ratings && mealRecord.recipe.ratings.length > 0 
        ? (mealRecord.recipe.ratings.reduce((acc, curr) => acc + curr.score, 0) / mealRecord.recipe.ratings.length).toFixed(1)
        : "0.0",
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
      <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-12 lg:px-10">
          <aside className="space-y-6 lg:col-span-3">
            <Suspense fallback={<div className="h-[300px] rounded-2xl bg-white p-6 shadow-sm">Loading calendar...</div>}>
              <CalendarCardClient />
            </Suspense>
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
                <ActionLink href={`/explore?date=${dateParam || formattedToday}`} size="sm" className="rounded-xl !text-white hover:!text-white">
                  Add Recipes
                </ActionLink>
              </div>
            </div>

            <div className="relative space-y-12 before:absolute before:bottom-4 before:left-6 before:top-4 before:w-0.5 before:bg-[#7bfeb8]">
              {timelineMeals.map((group) => (
                <TimelineItem key={group.slot} group={group} dateStr={dateParam || formattedToday} />
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



function TimelineItem({ group, dateStr }) {
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
          <Link href={`/explore?slot=${group.slot}&date=${dateStr}`} className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#abadae] bg-white/60 p-8 text-center transition-all hover:border-[#006941] hover:bg-[#f3fcf3]">
            <PlusCircle className="mb-2 h-9 w-9 text-[#757778] transition-colors group-hover:text-[#006941]" />
            <span className="text-sm font-bold text-[#757778] transition-colors group-hover:text-[#006941]">Plan your {group.slot.toLowerCase()}</span>
            <span className="mt-1 text-xs font-medium text-[#959798]">{group.remaining} slot{group.remaining === 1 ? "" : "s"} left</span>
          </Link>
        )}
      </div>
    </article>
  );
}

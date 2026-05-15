import { footerContent } from "@/components/content/landingContent";
import SiteFooter from "@/components/layout/SiteFooter";
import MealPlanClient from "@/components/MealPlan/MealPlanClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMealsForDate } from "@/lib/queries/mealPlans";

export const metadata = {
  title: "Meal Plans – Recipeat",
  description: "Plan your weekly meals and track nutrition.",
};

export const runtime = "nodejs";
export const preferredRegion = "sin1";

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function MealPlansPage({ searchParams }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const selectedDate = resolvedParams?.date || getTodayDateString();
  const initialState = await getMealsForDate(session.user, selectedDate);

  return (
    <>
      <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
        <MealPlanClient
          initialDateStr={selectedDate}
          initialMeals={initialState.meals}
        />
      </div>

      <SiteFooter
        brand={footerContent.brand}
        legalText={footerContent.legalText}
        socialItems={footerContent.socialItems}
        linkGroups={footerContent.linkGroups}
      />
    </>
  );
}

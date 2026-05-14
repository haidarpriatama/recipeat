import { Suspense } from "react";
import { footerContent } from "@/components/content/landingContent";
import SiteFooter from "@/components/layout/SiteFooter";
import AuthGuard from "@/components/layout/AuthGuard";
import MealPlanClient from "@/components/MealPlan/MealPlanClient";

export const metadata = {
  title: "Meal Plans – Recipeat",
  description: "Plan your weekly meals and track nutrition.",
};

export default function MealPlansPage() {
  return (
    <AuthGuard>
      <>
        <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
          <Suspense fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#006941] border-t-transparent" />
            </div>
          }>
            <MealPlanClient />
          </Suspense>
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


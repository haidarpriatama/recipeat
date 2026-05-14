export const dynamic = "force-dynamic";

import {
  featuresContent,
  footerContent,
  heroContent,
  recipesContent,
} from "@/components/content/landingContent";
import SiteFooter from "@/components/layout/SiteFooter";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HeroSection from "@/components/sections/HeroSection";
import RecipesSection from "@/components/sections/RecipesSection";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  let dynamicRecipeCards = recipesContent.cards;
  try {
    const latestRecipes = await prisma.recipe.findMany({
      where: { status: 'PUBLISHED' },
      take: 3,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    if (latestRecipes.length > 0) {
      dynamicRecipeCards = latestRecipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        alt: recipe.title,
        label: recipe.category?.name || 'Recipe',
        time: `${recipe.cookTime}m`,
        tags: ["Featured", "Delicious"],
      }));
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <>
      <main className="bg-[#f5f6f7] text-[#2c2f30]">
        <HeroSection
          title={heroContent.title}
          description={heroContent.description}
          primaryAction={isLoggedIn ? { label: "Explore Now", href: "/explore" } : heroContent.primaryAction}
          secondaryAction={heroContent.secondaryAction}
          heroImage={heroContent.heroImage}
        />

        <FeaturesSection
          title={featuresContent.title}
          description={featuresContent.description}
          cards={featuresContent.cards}
        />

        <RecipesSection
          title={recipesContent.title}
          description={recipesContent.description}
          browseAction={recipesContent.browseAction}
          cards={dynamicRecipeCards}
        />
      </main>

      <SiteFooter
        brand={footerContent.brand}
        legalText={footerContent.legalText}
        socialItems={footerContent.socialItems}
        linkGroups={footerContent.linkGroups}
      />
    </>
  );
}
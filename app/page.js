export const revalidate = 60; // ISR: revalidate every 60 seconds

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
import { getSafeImageSrc } from "@/lib/images";
import { measureServerTiming } from "@/lib/perf";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  let dynamicRecipeCards = recipesContent.cards;

  try {
    const latestRecipes = await measureServerTiming(
      "home:latestRecipes",
      () =>
        prisma.recipe.findMany({
          where: { status: "PUBLISHED" },
          take: 3,
          select: {
            id: true,
            title: true,
            imageUrl: true,
            cookTime: true,
            categories: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        })
    );

    if (latestRecipes.length > 0) {
      dynamicRecipeCards = latestRecipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: getSafeImageSrc(recipe.imageUrl),
        alt: recipe.title,
        label: recipe.categories && recipe.categories.length > 0 ? recipe.categories.map(c => c.name).join(", ") : "Recipe",
        time: `${recipe.cookTime}m`,
        tags: ["Featured", "Delicious"],
      }));
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }

  return (
    <>
      <main className="bg-[#f5f6f7] text-[#2c2f30]">
        <HeroSection
          title={heroContent.title}
          description={heroContent.description}
          primaryAction={{ label: "Explore Now", href: "/explore" }}
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

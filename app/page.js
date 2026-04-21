import {
  ctaContent,
  featuresContent,
  footerContent,
  heroContent,
  recipesContent,
} from "@/components/content/landingContent";
import SiteFooter from "@/components/layout/SiteFooter";
import CtaSection from "@/components/sections/CtaSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HeroSection from "@/components/sections/HeroSection";
import RecipesSection from "@/components/sections/RecipesSection";

export default function HomePage() {
  return (
    <>
      <main className="bg-[#f5f6f7] text-[#2c2f30]">
        <HeroSection
          badge={heroContent.badge}
          title={heroContent.title}
          description={heroContent.description}
          primaryAction={heroContent.primaryAction}
          secondaryAction={heroContent.secondaryAction}
          heroImage={heroContent.heroImage}
          tracker={heroContent.tracker}
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
          cards={recipesContent.cards}
        />

        <CtaSection
          title={ctaContent.title}
          description={ctaContent.description}
          action={ctaContent.action}
          note={ctaContent.note}
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
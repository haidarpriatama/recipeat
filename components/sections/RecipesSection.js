import RecipeCard from "@/components/ui/RecipeCard";
import LucideIcon from "@/components/ui/LucideIcon";

export default function RecipesSection({
  title,
  description,
  browseAction,
  cards,
}) {
  return (
    <section id="recipes" className="bg-[#f5f6f7] py-24">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight">{title}</h2>
            <p className="max-w-md text-[#595c5d]">{description}</p>
          </div>

          <a
            className="group flex items-center gap-2 font-bold text-[#006941]"
            href={browseAction.href}
          >
            {browseAction.label}
            <LucideIcon
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              name={browseAction.icon}
              strokeWidth={2.25}
            />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((recipe, index) => (
            <RecipeCard key={recipe.id || index} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
}
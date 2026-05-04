import Image from "next/image";
import Link from "next/link";
import { Star, Timer } from "lucide-react";

export default function RecipeCard({ recipe }) {
  const cardContent = (
    <article className="h-full group overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden">
        <Image
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={recipe.alt}
          src={recipe.image}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#006941] backdrop-blur">
          {recipe.label}
        </div>
      </div>

      <div className="p-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-bold text-[#8c4a00]">
            <Star className="h-4 w-4" strokeWidth={2.25} />
            {recipe.rating}
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-[#595c5d]">
            <Timer className="h-4 w-4" strokeWidth={2.25} />
            {recipe.time}
          </div>
        </div>

        <h4 className="mb-4 text-xl font-bold transition-colors group-hover:text-[#006941]">
          {recipe.title}
        </h4>

        <div className="flex flex-wrap items-center gap-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f3fcf3] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#58615a]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );

  if (recipe.id) {
    return <Link href={`/recipes/${recipe.id}`} className="block h-full">{cardContent}</Link>;
  }
  return cardContent;
}
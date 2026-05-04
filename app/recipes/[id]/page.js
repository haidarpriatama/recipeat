export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, Flame, Star, ChefHat, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Recipe Details – Recipeat",
};

export default async function RecipeDetailPage({ params }) {
  const { id } = await params;
  const recipeId = parseInt(id, 10);

  if (isNaN(recipeId)) {
    notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      category: true,
      ingredients: true,
    },
  });

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] pb-24 text-[#2c2f30]">
      {/* Back button area */}
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-6 md:px-12">
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-bold text-[#595c5d] transition-colors hover:text-[#006941]">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>
      </div>

      <main className="mx-auto max-w-screen-xl px-6 md:px-12">
        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-[400px] w-full lg:h-[600px]">
              <Image
                src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
                alt={recipe.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <div className="absolute top-6 left-6 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#006941] backdrop-blur">
                {recipe.category?.name || "Recipe"}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center p-10 md:p-16">
              <h1 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                {recipe.title}
              </h1>
              
              <p className="mb-10 text-lg leading-relaxed text-slate-500">
                {recipe.description || "No description provided."}
              </p>

              <div className="mb-10 flex flex-wrap items-center gap-8 border-y border-slate-100 py-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Prep & Cook</span>
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Clock3 className="h-5 w-5 text-[#006941]" />
                    {recipe.cookTime} mins
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-slate-100 hidden md:block"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Rating</span>
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
                    {recipe.rating ? recipe.rating.toFixed(1) : "5.0"}
                  </div>
                </div>
              </div>

              {/* Ingredients & Instructions Section */}
              <div className="space-y-12">
                <div>
                  <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                    <ChefHat className="h-5 w-5 text-[#006941]" /> Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      recipe.ingredients.map((ing) => (
                        <li key={ing.id} className="flex items-center justify-between border-b border-slate-50 pb-3 text-slate-600">
                          <span className="font-medium">{ing.ingredientName}</span>
                          <span className="font-bold text-slate-900">{ing.quantity}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">Ingredients not listed.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-6 text-xl font-bold text-slate-900">Instructions</h3>
                  <div className="prose prose-slate max-w-none text-slate-600">
                    {recipe.instructions ? (
                      recipe.instructions.split('\n').map((step, idx) => {
                        const cleanStep = step.replace(/^\d+\.\s*/, '').trim();
                        if (!cleanStep) return null;
                        return (
                          <p key={idx} className="mb-4 flex gap-4">
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#006941]/10 text-xs font-bold text-[#006941]">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{cleanStep}</span>
                          </p>
                        );
                      })
                    ) : (
                      <p>Instructions not provided.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

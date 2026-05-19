import prisma from "@/lib/prisma";
import Image from "next/image";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, Flame, ChefHat, ArrowLeft } from "lucide-react";
import AddToMealPlanButton from "@/components/MealPlan/AddToMealPlanButton";
import FavoriteButton from "@/components/RecipeCard/FavoriteButton";
import UserRecipeRating from "@/components/RecipeCard/UserRecipeRating";
import { auth } from "@/lib/auth";
import SiteFooter from "@/components/layout/SiteFooter";
import { footerContent } from "@/components/content/landingContent";


const SERVING_TIPS = {
  Breakfast:
    "Sajikan dalam mangkuk atau piring cantik sambil masih hangat. Tambahkan potongan buah segar atau yogurt rendah lemak untuk menu sarapan sehat.",
  Lunch:
    "Atur piring dengan makanan utama di tengah, sayuran segar di sisi, dan tambahkan irisan jeruk nipis atau saus rendah kalori untuk presentasi yang rapi.",
  Dinner:
    "Sajikan hangat di atas piring lebar, beri hiasan daun kemangi atau seledri, dan gunakan porsi kecil untuk menjaga menu malam tetap ringan.",
  Snack:
    "Sajikan sebagai camilan sehat di atas piring kecil dengan beberapa potongan sayur atau buah sebagai pelengkap.",
};

const COOKING_GUIDANCE =
  "Baca seluruh instruksi terlebih dahulu sebelum mulai memasak. Siapkan semua bahan dan peralatan di meja kerja Anda (mise en place). Ikuti setiap tahapan dengan teliti dan perhatikan warna, aroma, dan tekstur makanan saat memasak untuk hasil terbaik.";

export const metadata = {
  title: "Recipe Details – Recipeat",
};

function parseInstructionSteps(instructions) {
  if (!instructions) return [];

  return instructions
    .split(/(?:^|\n)\s*\d+\.\s*/)
    .map((step) => step.trim())
    .filter(Boolean);
}

export default async function RecipeDetailPage({ params }) {
  const { id } = await params;
  const recipeId = parseInt(id, 10);

  if (isNaN(recipeId)) {
    notFound();
  }

  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const realUserId = session?.user?.id || null;

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      categories: true,
      ingredients: { include: { ingredient: true } },
      favorites: realUserId ? { where: { userId: realUserId } } : false,
    },
  });

  if (!recipe || (recipe.status === "DRAFT" && !isAdmin)) {
    notFound();
  }

  const instructionSteps = parseInstructionSteps(recipe.instructions);

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
              <SafeImage
                src={recipe.imageUrl || ""}
                alt={recipe.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <div className="absolute top-6 left-6 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#006941] backdrop-blur">
                {recipe.categories && recipe.categories.length > 0 ? recipe.categories.map(c => c.name).join(", ") : "Recipe"}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center p-10 md:p-16">
              <h1 className="mb-4 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                {recipe.title}
              </h1>
              
              <div className="mb-8">
                <UserRecipeRating recipeId={recipe.id} />
              </div>
              
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
              </div>

              <div className="mt-8 flex items-center gap-4">
                <AddToMealPlanButton recipeId={recipe.id} mealType={recipe.categories?.[0]?.name || "Lunch"} />
                <FavoriteButton recipeId={recipe.id} initialFavorited={recipe.favorites?.length > 0} className="relative !top-auto !right-auto h-[56px] w-[56px] bg-white border border-slate-200 shadow-sm hover:border-[#006941]" />
              </div>

              {/* Ingredients & Instructions Section */}
              <div className="mt-12 space-y-12">
                <div>
                  <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                    <ChefHat className="h-5 w-5 text-[#006941]" /> Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      recipe.ingredients.map((ing) => (
                        <li key={ing.id} className="flex items-center justify-between border-b border-slate-50 pb-3 text-slate-600">
                          {/* INI BAGIAN YANG DITAMBAHKAN OPTIONAL CHAINING (?.) */}
                          <span className="font-medium">{ing.ingredient?.name || "Unknown Ingredient"}</span>
                          <span className="font-bold text-slate-900">{ing.quantity}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">Ingredients not listed.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-8 text-2xl font-bold text-slate-900">Instructions</h3>
                  <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                    {instructionSteps.length > 0 ? (
                      <div className="space-y-0">
                        {instructionSteps.map((step, idx) => (
                          <div key={idx} className="relative flex gap-5 pb-8 last:pb-0">
                            {idx < instructionSteps.length - 1 && (
                              <span className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-[#006941]/25" />
                            )}
                            <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#006941] text-sm font-bold text-white shadow-md shadow-[#006941]/20">
                              {idx + 1}
                            </div>
                            <div className="pt-1">
                              <p className="text-sm leading-relaxed text-slate-700">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">Instructions not provided.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <SiteFooter
        brand={footerContent.brand}
        legalText={footerContent.legalText}
        socialItems={footerContent.socialItems}
        linkGroups={footerContent.linkGroups}
      />
    </div>
  );
}
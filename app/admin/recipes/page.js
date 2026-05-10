import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminRecipesPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
      _count: {
        select: { favorites: true, ingredients: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const totalRecipes = recipes.length;
  const publishedRecipes = recipes.filter((recipe) => recipe._count.ingredients > 0).length;
  const draftRecipes = totalRecipes - publishedRecipes;
  const newThisWeek = recipes.filter((recipe) => new Date(recipe.createdAt) >= weekAgo).length;

  async function deleteRecipeAction(formData) {
    "use server";
    const currentSession = await auth();
    if (!currentSession || currentSession.user.role !== "ADMIN") redirect("/");

    const id = Number(formData.get("id"));
    if (!id) return;

    await prisma.$transaction([
      prisma.favorite.deleteMany({ where: { recipeId: id } }),
      prisma.mealPlanRecipe.deleteMany({ where: { recipeId: id } }),
      prisma.recipeIngredient.deleteMany({ where: { recipeId: id } }),
      prisma.recipe.delete({ where: { id } }),
    ]);

    revalidatePath("/admin/recipes");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#006941]">Manage Recipes</h1>
          <p className="mt-2 max-w-2xl text-[#595c5d]">
            Review, organize, and curate your collection of seasonal culinary creations.
          </p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-6 py-3 font-bold text-white shadow-lg transition-opacity hover:opacity-90"
        >
          <PlusCircle className="h-5 w-5" />
          Add New Recipe
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total Recipes" value={totalRecipes} tone="bg-[#eff1f2] text-[#2c2f30]" />
        <StatCard label="Published" value={publishedRecipes} tone="bg-[#f3fcf3] text-[#006941]" />
        <StatCard label="Drafts" value={draftRecipes} tone="bg-[#ffc69a]/40 text-[#7b4000]" />
        <StatCard label="New This Week" value={newThisWeek} tone="bg-white text-[#2c2f30]" />
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#eff1f2]/60">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Image</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Recipe</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Date Added</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#595c5d]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff1f2]">
              {recipes.map((recipe) => {
                const published = recipe._count.ingredients > 0;
                return (
                  <tr key={recipe.id} className="transition-colors hover:bg-[#f5f6f7]">
                    <td className="px-6 py-4">
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-[#eff1f2]">
                        <Image
                          src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=320&q=80"}
                          alt={recipe.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#2c2f30]">{recipe.title}</p>
                      <p className="text-xs text-[#595c5d]">{recipe.cookTime} mins • {recipe._count.favorites} favorites</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[#f3fcf3] px-3 py-1 text-xs font-bold text-[#58615a]">
                        {recipe.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#595c5d]">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${published ? "bg-[#caffdc] text-[#006941]" : "bg-[#ffc69a]/50 text-[#7b4000]"}`}>
                        {published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/recipes/${recipe.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#006941] transition-colors hover:bg-[#f3fcf3]"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={deleteRecipeAction}>
                          <input type="hidden" name="id" value={recipe.id} />
                          <button
                            type="submit"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#b31b25] transition-colors hover:bg-[#ffefee]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {recipes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#595c5d]">
                    No recipes yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`rounded-2xl p-5 ${tone}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

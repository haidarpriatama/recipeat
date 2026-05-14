import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import RecipeIngredientManager from "@/components/admin/RecipeIngredientManager";
import InstructionTextarea from "@/components/admin/InstructionTextarea";
import { HelpCircle } from "lucide-react";

export default async function AdminNewRecipePage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const [categories, allIngredients] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.ingredient.findMany({ orderBy: { name: "asc" } })
  ]);

  async function createRecipeAction(formData) {
    "use server";

    const currentSession = await auth();
    if (!currentSession || currentSession.user.role !== "ADMIN") redirect("/");

    const submitAction = formData.get("submitAction");
    const status = submitAction === "draft" ? "DRAFT" : "PUBLISHED";

    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const instructions = String(formData.get("instructions") || "").trim();
    const imageUrl = String(formData.get("imageUrl") || "").trim();
    const cookTime = Number(formData.get("cookTime"));
    const categoryId = Number(formData.get("categoryId"));

    const ingredientsData = formData.get("ingredientsData");
    let parsedIngredients = [];
    if (ingredientsData) {
      try {
        parsedIngredients = JSON.parse(ingredientsData);
        parsedIngredients = parsedIngredients.filter(i => i.name.trim() !== "");
      } catch (e) {}
    }

    if (!title || !cookTime || !categoryId) {
      return;
    }

    const recipeIngredientsToCreate = [];
    for (const item of parsedIngredients) {
      const name = item.name.trim();
      const quantity = item.quantity.trim() || "As needed";
      
      let ingredientRecord = await prisma.ingredient.findUnique({
        where: { name: name.toLowerCase() }
      });
      
      if (!ingredientRecord) {
        ingredientRecord = await prisma.ingredient.create({
          data: { name: name.toLowerCase() }
        });
      }
      
      recipeIngredientsToCreate.push({
        ingredientId: ingredientRecord.id,
        quantity: quantity
      });
    }

    await prisma.recipe.create({
      data: {
        title,
        description: description || null,
        instructions: instructions || null,
        imageUrl: imageUrl || null,
        cookTime,
        categoryId,
        status,
        ingredients: {
          create: recipeIngredientsToCreate
        }
      },
    });

    revalidatePath("/admin/recipes");
    redirect("/admin/recipes");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#006941]">Create New Recipe</h1>
        <p className="mt-2 text-[#595c5d]">Add a new recipe to your curated collection.</p>
      </div>

      <form action={createRecipeAction} className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#595c5d]">Recipe Title</label>
            <input
              name="title"
              required
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
              placeholder="e.g. Pan-Seared Salmon with Asparagus"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#595c5d]">Description</label>
            <textarea
              name="description"
              rows={4}
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
              placeholder="Short recipe description"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <label className="block text-sm font-bold text-[#595c5d]">Instructions</label>
              <div className="group relative flex items-center">
                <HelpCircle className="h-4 w-4 cursor-help text-[#595c5d] transition-colors hover:text-[#006941]" />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-xl bg-[#2c2f30] px-3 py-2.5 text-xs font-semibold leading-relaxed text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                  Please format as a numbered list: <br />
                  1. First step... <br />
                  2. Second step...
                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#2c2f30]"></div>
                </div>
              </div>
            </div>
            <InstructionTextarea
              name="instructions"
              rows={8}
              placeholder="Step-by-step cooking instructions"
            />
          </div>
          
          <div className="pt-2">
            <RecipeIngredientManager availableIngredients={allIngredients} />
          </div>
        </section>

        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#595c5d]">Category</label>
            <select
              name="categoryId"
              required
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#595c5d]">Cook Time (minutes)</label>
            <input
              name="cookTime"
              type="number"
              required
              min={1}
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#595c5d]">Image URL</label>
            <input
              name="imageUrl"
              type="url"
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
              placeholder="https://..."
            />
          </div>


          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              name="submitAction"
              value="publish"
              className="rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
            >
              Publish Recipe
            </button>
            <button
              type="submit"
              name="submitAction"
              value="draft"
              className="rounded-xl border-2 border-[#006941] px-5 py-3 font-bold text-[#006941] transition-colors hover:border-[#e67e22] hover:bg-[#e67e22] hover:text-white"
            >
              Save Draft
            </button>
            <Link
              href="/admin/recipes"
              className="rounded-xl bg-[#eff1f2] px-5 py-3 text-center font-semibold text-[#2c2f30] transition-colors hover:bg-[#dadddf]"
            >
              Cancel
            </Link>
          </div>
        </section>
      </form>
    </div>
  );
}

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import RecipeIngredientManager from "@/components/admin/RecipeIngredientManager";
import { ExternalLink } from "lucide-react";

export default async function AdminEditRecipePage({ params }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const { id } = await params;
  const recipeId = Number(id);

  if (!recipeId) redirect("/admin/recipes");

  const [recipe, categories, allIngredients] = await Promise.all([
    prisma.recipe.findUnique({ 
      where: { id: recipeId },
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.ingredient.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!recipe) redirect("/admin/recipes");

  const initialIngredients = recipe.ingredients.map(ri => ({
    name: ri.ingredient.name,
    quantity: ri.quantity
  }));

  async function updateRecipeAction(formData) {
    "use server";

    const currentSession = await auth();
    if (!currentSession || currentSession.user.role !== "ADMIN") redirect("/");

    const id = Number(formData.get("id"));
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

    if (!id || !title || !cookTime || !categoryId) {
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

    await prisma.recipe.update({
      where: { id },
      data: {
        title,
        description: description || null,
        instructions: instructions || null,
        imageUrl: imageUrl || null,
        cookTime,
        categoryId,
        ingredients: {
          deleteMany: {},
          create: recipeIngredientsToCreate
        }
      },
    });

    revalidatePath("/admin/recipes");
    redirect("/admin/recipes");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#006941]">Edit Recipe</h1>
          <p className="mt-2 text-[#595c5d]">Update recipe details and keep content consistent.</p>
        </div>
        <Link 
          href={`/recipes/${recipe.id}`}
          target="_blank"
          className="flex items-center gap-2 rounded-xl bg-[#eff1f2] px-4 py-2.5 text-sm font-bold text-[#006941] hover:bg-[#dadddf] transition-colors self-start sm:self-auto"
        >
          View Recipe <ExternalLink size={16} />
        </Link>
      </div>

      <form action={updateRecipeAction} className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <input type="hidden" name="id" value={recipe.id} />

        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#595c5d]">Recipe Title</label>
            <input
              name="title"
              required
              defaultValue={recipe.title}
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#595c5d]">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={recipe.description || ""}
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#595c5d]">Instructions</label>
            <textarea
              name="instructions"
              rows={8}
              defaultValue={recipe.instructions || ""}
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
            />
          </div>
          
          <div className="pt-2">
            <RecipeIngredientManager initialIngredients={initialIngredients} availableIngredients={allIngredients} />
          </div>
        </section>

        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#595c5d]">Category</label>
            <select
              name="categoryId"
              required
              defaultValue={recipe.categoryId}
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
            >
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
              min={1}
              required
              defaultValue={recipe.cookTime}
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#595c5d]">Image URL</label>
            <input
              name="imageUrl"
              type="url"
              defaultValue={recipe.imageUrl || ""}
              className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 outline-none ring-[#006941] transition focus:ring-2"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
            >
              Save Changes
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

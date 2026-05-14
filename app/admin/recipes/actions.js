"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteRecipeAction(formData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

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

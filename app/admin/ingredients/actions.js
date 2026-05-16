"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

function formatIngredientName(name) {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export async function deleteIngredientAction(id) {
  const currentSession = await auth();
  if (!currentSession || currentSession.user.role !== "ADMIN") throw new Error("Unauthorized");
  if (!id) throw new Error("ID required");

  await prisma.recipeIngredient.deleteMany({ where: { ingredientId: id } });
  await prisma.ingredient.delete({ where: { id } });

  revalidatePath("/admin/ingredients");
  revalidateTag("ingredients-list");
}

export async function updateIngredientAction(id, name) {
  const currentSession = await auth();
  if (!currentSession || currentSession.user.role !== "ADMIN") throw new Error("Unauthorized");
  if (!id || !name) return { error: "ID and name required" };

  const normalizedName = formatIngredientName(name);

  const existing = await prisma.ingredient.findUnique({ where: { name: normalizedName } });
  if (existing && existing.id !== id) {
    return { error: "Ingredient with this name already exists." };
  }

  await prisma.ingredient.update({
    where: { id },
    data: { name: normalizedName },
  });

  revalidatePath("/admin/ingredients");
  revalidateTag("ingredients-list");
  return { success: true };
}

export async function createIngredientAction(name) {
  const currentSession = await auth();
  if (!currentSession || currentSession.user.role !== "ADMIN") throw new Error("Unauthorized");
  if (!name) throw new Error("Name required");

  const normalizedName = formatIngredientName(name);
  const existing = await prisma.ingredient.findUnique({ where: { name: normalizedName } });
  if (!existing) {
    await prisma.ingredient.create({
      data: { name: normalizedName },
    });
    revalidatePath("/admin/ingredients");
    revalidateTag("ingredients-list");
    return { success: true };
  } else {
    return { error: "Ingredient already exists" };
  }
}

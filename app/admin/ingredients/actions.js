"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteIngredientAction(id) {
  const currentSession = await auth();
  if (!currentSession || currentSession.user.role !== "ADMIN") throw new Error("Unauthorized");
  if (!id) throw new Error("ID required");

  await prisma.recipeIngredient.deleteMany({ where: { ingredientId: id } });
  await prisma.ingredient.delete({ where: { id } });

  revalidatePath("/admin/ingredients");
}

export async function updateIngredientAction(id, name) {
  const currentSession = await auth();
  if (!currentSession || currentSession.user.role !== "ADMIN") throw new Error("Unauthorized");
  if (!id || !name) throw new Error("ID and name required");

  await prisma.ingredient.update({
    where: { id },
    data: { name },
  });

  revalidatePath("/admin/ingredients");
}

export async function createIngredientAction(name) {
  const currentSession = await auth();
  if (!currentSession || currentSession.user.role !== "ADMIN") throw new Error("Unauthorized");
  if (!name) throw new Error("Name required");

  const normalizedName = name.trim().toLowerCase();
  const existing = await prisma.ingredient.findUnique({ where: { name: normalizedName } });
  if (!existing) {
    await prisma.ingredient.create({
      data: { name: normalizedName },
    });
    revalidatePath("/admin/ingredients");
  }
}

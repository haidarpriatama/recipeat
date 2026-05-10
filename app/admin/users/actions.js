"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteUserAction(id) {
  const currentSession = await auth();
  if (!currentSession || currentSession.user.role !== "ADMIN") throw new Error("Unauthorized");
  if (!id) throw new Error("ID required");

  // Must delete related records before deleting user
  await prisma.$transaction([
    prisma.favorite.deleteMany({ where: { userId: id } }),
    prisma.mealPlanRecipe.deleteMany({ where: { mealPlan: { userId: id } } }),
    prisma.mealPlan.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);

  revalidatePath("/admin/users");
}

export async function updateUserAction(id, name, role) {
  const currentSession = await auth();
  if (!currentSession || currentSession.user.role !== "ADMIN") throw new Error("Unauthorized");
  if (!id || !name || !role) throw new Error("Invalid data");

  await prisma.user.update({
    where: { id },
    data: { name, role },
  });

  revalidatePath("/admin/users");
}

"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function deleteUserAction(id) {
  const currentSession = await auth();
  if (!currentSession || currentSession.user.role !== "ADMIN") throw new Error("Unauthorized");
  if (!id) throw new Error("ID required");

  const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (authDeleteError) throw new Error(authDeleteError.message);

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

export async function getUnverifiedUsersAction() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  const unverified = data.users.filter((u) => !u.email_confirmed_at);
  
  return unverified.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    name: u.user_metadata?.name || "Unknown",
  }));
}

export async function deleteUnverifiedUserAction(userId) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  
  return { success: true };
}

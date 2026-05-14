"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function normalizeUsername(username) {
  return username.trim().replace(/\s+/g, "").toLowerCase();
}

export async function updateProfileAction({ username, fullName }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const nextFullName = fullName?.trim();
  const nextUsername = normalizeUsername(username || "");

  if (!nextFullName || !nextUsername) {
    throw new Error("Username and full name are required");
  }

  const { data: currentUserResponse, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(session.user.id);
  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const currentMetadata = currentUserResponse?.user?.user_metadata || {};

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(session.user.id, {
    user_metadata: {
      ...currentMetadata,
      name: nextFullName,
      username: nextUsername,
    },
  });

  if (updateError) {
    throw new Error(updateError.message);
  }

  await prisma.user.upsert({
    where: { id: session.user.id },
    update: {
      name: nextFullName,
    },
    create: {
      id: session.user.id,
      email: session.user.email,
      name: nextFullName,
    },
  });

  revalidatePath("/profile");
  return {
    username: nextUsername,
    fullName: nextFullName,
  };
}

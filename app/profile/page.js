import ProfileContent from "./ProfileContent";
import { auth } from "@/lib/auth";
import { getSafeImageSrc } from "@/lib/images";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile – Recipeat",
  description: "Manage your Recipeat profile and account settings.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const userId = session.user.id;

  const [favorites, favoriteCount, ratingCount] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      include: {
        recipe: {
          include: { category: true },
        },
      },
      orderBy: { savedAt: "desc" },
      take: 3,
    }),
    prisma.favorite.count({ where: { userId } }),
    prisma.rating.count({ where: { userId } }),
  ]);
  const favoriteRecipes = favorites.map((fav) => ({
    id: fav.recipe.id,
    title: fav.recipe.title,
    image: getSafeImageSrc(fav.recipe.imageUrl),
    alt: fav.recipe.title,
    time: `${fav.recipe.cookTime} min`,
    tags: [fav.recipe.category?.name || "Recipe"],
  }));

  return (
    <ProfileContent
      favorites={favoriteRecipes}
      favoriteCount={favoriteCount}
      ratingCount={ratingCount}
      user={session.user}
    />
  );
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  const selectedMealTypes = searchParams.get("mealTypes")
    ? searchParams.get("mealTypes").split(",").filter(Boolean)
    : [];
  const selectedServingTimes = searchParams.get("servingTimes")
    ? searchParams.get("servingTimes").split(",").filter(Boolean)
    : [];
  const ingredientsFilter = searchParams.get("ingredients")
    ? searchParams.get("ingredients").split(",").filter(Boolean)
    : [];
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const session = await auth();
  const userId = session?.user?.id;

  const where = {
    status: "PUBLISHED",
    AND: [
      query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
      categoryFilter
        ? { category: { name: { equals: categoryFilter, mode: "insensitive" } } }
        : {},
      selectedMealTypes.length > 0
        ? { category: { name: { in: selectedMealTypes, mode: "insensitive" } } }
        : {},
      selectedServingTimes.length > 0
        ? {
            OR: selectedServingTimes.map((time) => {
              if (time === "under_15") return { cookTime: { lt: 15 } };
              if (time === "under_30") return { cookTime: { lt: 30 } };
              if (time === "under_60") return { cookTime: { lt: 60 } };
              if (time === "over_90") return { cookTime: { gt: 90 } };
              return {};
            }),
          }
        : {},
      ingredientsFilter.length > 0
        ? {
            ingredients: {
              some: {
                ingredient: {
                  OR: ingredientsFilter.map((ing) => ({
                    name: { contains: ing, mode: "insensitive" },
                  })),
                },
              },
            },
          }
        : {},
    ],
  };

  try {
    const [recipes, count] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          category: true,
          favorites: userId ? { where: { userId } } : false,
          ratings: userId ? { where: { userId } } : false,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.recipe.count({ where }),
    ]);

    const displayRecipes = recipes.map((recipe) => {
      const userRating =
        recipe.ratings && recipe.ratings.length > 0
          ? recipe.ratings[0].score
          : 0;
      return {
        id: recipe.id,
        title: recipe.title,
        image:
          recipe.imageUrl ||
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
        alt: recipe.title,
        time: `${recipe.cookTime}m`,
        rating: userRating,
        label: recipe.category?.name || "Recipe",
        favorite: recipe.favorites?.length > 0,
      };
    });

    return NextResponse.json({ recipes: displayRecipes, total: count });
  } catch (error) {
    console.error("Error fetching explore recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

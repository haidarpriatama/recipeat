import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_request, { params }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ingredientId = Number(id);
  if (!Number.isInteger(ingredientId) || ingredientId <= 0) {
    return Response.json({ message: "Invalid ingredient id" }, { status: 400 });
  }

  const recipes = await prisma.recipeIngredient.findMany({
    where: { ingredientId },
    select: {
      recipe: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      recipe: {
        title: "asc",
      },
    },
  });

  return Response.json({
    recipes: recipes.map((item) => item.recipe),
  });
}

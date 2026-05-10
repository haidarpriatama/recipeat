import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { recipeId } = await params;
    const session = await auth();

    // Jika user tidak login, return null
    if (!session?.user?.id) {
      return Response.json({ rating: null }, { status: 200 });
    }

    const recipeIdNum = parseInt(recipeId, 10);
    if (isNaN(recipeIdNum)) {
      return Response.json(
        { error: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    let dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) {
      return Response.json({ rating: null }, { status: 200 });
    }

    // Cari rating user untuk resep ini
    const rating = await prisma.rating.findUnique({
      where: {
        userId_recipeId: {
          userId: dbUser.id,
          recipeId: recipeIdNum,
        },
      },
    });

    return Response.json({
      rating: rating ? rating.score : null,
      ratedAt: rating?.updatedAt || null,
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    return Response.json(
      { error: "Failed to fetch rating" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { recipeId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { score } = body;

    // Validasi score (1-5)
    if (!score || score < 1 || score > 5 || !Number.isInteger(score)) {
      return Response.json(
        { error: "Score must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    const recipeIdNum = parseInt(recipeId, 10);
    if (isNaN(recipeIdNum)) {
      return Response.json(
        { error: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    // Cek apakah recipe ada
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeIdNum },
    });

    if (!recipe) {
      return Response.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    // Pastikan user ada di DB
    let dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || session.user.email
        }
      });
    }

    // Upsert rating
    const rating = await prisma.rating.upsert({
      where: {
        userId_recipeId: {
          userId: dbUser.id,
          recipeId: recipeIdNum,
        },
      },
      update: { score },
      create: {
        userId: dbUser.id,
        recipeId: recipeIdNum,
        score,
      },
    });

    return Response.json({ success: true, rating: rating.score });
  } catch (error) {
    console.error("Error saving rating:", error);
    return Response.json(
      { error: "Failed to save rating" },
      { status: 500 }
    );
  }
}

// app/api/mealplan/route.js
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Mendapatkan semua meal plans (hanya milik user)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const mealPlans = await prisma.mealPlan.findMany({
      where: { userId: session.user.id }
    });
    return Response.json(mealPlans, { status: 200 });
  } catch (error) {
    console.error('GET /api/mealplan error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Menambahkan resep ke meal plan
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { recipeId, dayOfWeek, mealType, weekStart } = body;

    const weekStartDate = new Date(weekStart);
    weekStartDate.setHours(0, 0, 0, 0);

    // Pastikan user ada di DB dan ambil ID-nya
    const dbUser = await prisma.user.upsert({
      where: { email: session.user.email },
      update: { name: session.user.name || session.user.email },
      create: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email,
      },
    });

    const userId = dbUser.id;

    // Cari atau buat MealPlan untuk minggu tersebut
    let mealPlan = await prisma.mealPlan.findFirst({
      where: { userId, weekStart: weekStartDate },
    });

    if (!mealPlan) {
      mealPlan = await prisma.mealPlan.create({
        data: { userId, weekStart: weekStartDate },
      });
    }

    // Tambahkan resep ke MealPlanRecipe
    if (recipeId && dayOfWeek) {
      const rId = parseInt(recipeId, 10);
      await prisma.mealPlanRecipe.upsert({
        where: {
          mealPlanId_recipeId_dayOfWeek: {
            mealPlanId: mealPlan.id,
            recipeId: rId,
            dayOfWeek,
          },
        },
        update: { mealType: mealType || 'Lunch' },
        create: {
          mealPlanId: mealPlan.id,
          recipeId: rId,
          dayOfWeek,
          mealType: mealType || 'Lunch',
        },
      });
    }

    return Response.json(mealPlan, { status: 201 });
  } catch (error) {
    console.error('POST /api/mealplan error:', error);
    return Response.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

// Menghapus meal plan
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email,
      },
    });

    const { id, mealPlanId, recipeId, dayOfWeek, mealType } = await request.json();

    if (mealPlanId && recipeId && dayOfWeek) {
      const deleted = await prisma.mealPlanRecipe.deleteMany({
        where: {
          mealPlanId: Number(mealPlanId),
          recipeId: Number(recipeId),
          dayOfWeek,
          mealType,
          mealPlan: { userId: dbUser.id },
        },
      });
      return Response.json(deleted, { status: 200 });
    }

    const deletedMealPlan = await prisma.mealPlan.deleteMany({
      where: { id: Number(id), userId: dbUser.id },
    });

    return Response.json(deletedMealPlan, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/mealplan error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
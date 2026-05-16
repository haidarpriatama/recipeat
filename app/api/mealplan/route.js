// app/api/mealplan/route.js
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getMealsForDate } from '@/lib/queries/mealPlans';

export const runtime = "nodejs";
export const preferredRegion = "sin1";

// Mendapatkan semua meal plans (hanya milik user)
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    // If a date is provided, return meals for that specific day
    if (dateParam) {
      const state = await getMealsForDate(session.user, dateParam);
      return Response.json(state, { status: 200 });
    }

    // Fallback: return all meal plans for user
    const mealPlans = await prisma.mealPlan.findMany({ where: { userId: session.user.id } });
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

    const [wy, wm, wd] = weekStart.split('-').map(Number);
    const weekStartDate = new Date(wy, wm - 1, wd, 0, 0, 0, 0);

    const userId = session.user.id;

    // Cari atau buat MealPlan untuk minggu tersebut
    let mealPlan = await prisma.mealPlan.findFirst({
      where: { userId, weekStart: weekStartDate },
    });

    if (!mealPlan) {
      mealPlan = await prisma.mealPlan.create({
        data: { userId, weekStart: weekStartDate },
      });
    }

    if (recipeId && dayOfWeek) {
      const rId = parseInt(recipeId, 10);
      const targetMealType = mealType || 'Lunch';
      const existingSlotMeals = await prisma.mealPlanRecipe.count({
        where: {
          mealPlanId: mealPlan.id,
          dayOfWeek,
          mealType: targetMealType,
        },
      });
      const existingRecipe = await prisma.mealPlanRecipe.findUnique({
        where: {
          mealPlanId_recipeId_dayOfWeek: {
            mealPlanId: mealPlan.id,
            recipeId: rId,
            dayOfWeek,
          },
        },
      });

      if (!existingRecipe && existingSlotMeals >= 3) {
        return Response.json({ message: `${targetMealType} meal plan is full. Maximum 3 recipes.` }, { status: 409 });
      }

      await prisma.mealPlanRecipe.upsert({
        where: {
          mealPlanId_recipeId_dayOfWeek: {
            mealPlanId: mealPlan.id,
            recipeId: rId,
            dayOfWeek,
          },
        },
        update: { mealType: targetMealType },
        create: {
          mealPlanId: mealPlan.id,
          recipeId: rId,
          dayOfWeek,
          mealType: targetMealType,
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

    const userId = session.user.id;

    const { id, mealPlanId, recipeId, dayOfWeek, mealType } = await request.json();

    if (mealPlanId && recipeId && dayOfWeek) {
      const deleted = await prisma.mealPlanRecipe.deleteMany({
        where: {
          mealPlanId: Number(mealPlanId),
          recipeId: Number(recipeId),
          dayOfWeek,
          mealType,
          mealPlan: { userId: userId },
        },
      });
      return Response.json(deleted, { status: 200 });
    }

    const deletedMealPlan = await prisma.mealPlan.deleteMany({
      where: { id: Number(id), userId: userId },
    });

    return Response.json(deletedMealPlan, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/mealplan error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

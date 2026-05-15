// app/api/mealplan/route.js
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Mendapatkan semua meal plans (hanya milik user)
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return Response.json({ meals: [], mealPlanId: null }, { status: 200 });

    // If a date is provided, return meals for that specific day
    if (dateParam) {
      const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const [y, m, d] = dateParam.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const dayName = DAYS[dateObj.getDay()];

      const weekStart = new Date(dateObj);
      weekStart.setDate(dateObj.getDate() - (dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1));
      weekStart.setHours(0, 0, 0, 0);

      const mealPlan = await prisma.mealPlan.findFirst({
        where: { userId: dbUser.id, weekStart },
        include: {
          recipes: {
            where: { dayOfWeek: dayName },
            include: { recipe: { include: { category: true, ratings: true } } }
          }
        }
      });

      if (!mealPlan) return Response.json({ meals: [], mealPlanId: null, dayName }, { status: 200 });

      const meals = mealPlan.recipes.map((r) => ({
        id: r.recipe.id,
        title: r.recipe.title,
        description: r.recipe.description || '',
        image: r.recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        imageAlt: r.recipe.title,
        prepTime: `${r.recipe.cookTime} min`,
        mealType: r.mealType,
        dayOfWeek: r.dayOfWeek,
        mealPlanId: mealPlan.id,
        rating: r.recipe.ratings?.length > 0
          ? (r.recipe.ratings.reduce((a, b) => a + b.score, 0) / r.recipe.ratings.length).toFixed(1)
          : '0.0',
      }));

      return Response.json({ meals, mealPlanId: mealPlan.id, dayName }, { status: 200 });
    }

    // Fallback: return all meal plans for user
    const mealPlans = await prisma.mealPlan.findMany({ where: { userId: dbUser.id } });
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
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const runtime = "nodejs";
export const preferredRegion = "sin1";

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { mealPlanId, recipeId, dayOfWeek, mealType, repeatWeekly } = await request.json();

    const userId = session.user.id;
    if (!userId) return Response.json({ message: 'User not found' }, { status: 404 });

    const mealPlan = await prisma.mealPlan.findFirst({
      where: { id: Number(mealPlanId), userId: userId },
    });
    if (!mealPlan) return Response.json({ message: 'Meal plan not found' }, { status: 404 });

    await prisma.mealPlanRecipe.update({
      where: {
        mealPlanId_recipeId_dayOfWeek: {
          mealPlanId: Number(mealPlanId),
          recipeId: Number(recipeId),
          dayOfWeek,
        },
      },
      data: { repeatWeekly },
    });

    if (!repeatWeekly) {
      const futureMealPlans = await prisma.mealPlan.findMany({
        where: { userId: userId, weekStart: { gt: mealPlan.weekStart } },
        select: { id: true },
      });

      if (futureMealPlans.length > 0) {
        await prisma.mealPlanRecipe.deleteMany({
          where: {
            mealPlanId: { in: futureMealPlans.map((p) => p.id) },
            recipeId: Number(recipeId),
            dayOfWeek,
            mealType,
            repeatWeekly: true,
          },
        });
      }
    }

    return Response.json({ success: true, repeatWeekly }, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/mealplan/repeat error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

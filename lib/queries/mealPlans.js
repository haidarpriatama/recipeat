import { DEFAULT_RECIPE_IMAGE, getSafeImageSrc } from "@/lib/images";
import prisma from "@/lib/prisma";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getMealPlanSelect(dayName) {
  return {
    id: true,
    recipes: {
      where: { dayOfWeek: dayName },
      select: {
        recipeId: true,
        mealType: true,
        dayOfWeek: true,
        repeatWeekly: true,
        recipe: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            cookTime: true,
            ratings: {
              select: {
                score: true,
              },
            },
          },
        },
      },
    },
  };
}

function mapMeals(mealPlan, dayName) {
  if (!mealPlan) {
    return { meals: [], mealPlanId: null, dayName };
  }

  return {
    meals: mealPlan.recipes.map((entry) => ({
      id: entry.recipe.id,
      title: entry.recipe.title,
      description: entry.recipe.description || "",
      image: getSafeImageSrc(entry.recipe.imageUrl, DEFAULT_RECIPE_IMAGE),
      imageAlt: entry.recipe.title,
      prepTime: `${entry.recipe.cookTime} min`,
      mealType: entry.mealType,
      dayOfWeek: entry.dayOfWeek,
      mealPlanId: mealPlan.id,
      repeatWeekly: entry.repeatWeekly,
      rating:
        entry.recipe.ratings.length > 0
          ? (
              entry.recipe.ratings.reduce((total, rating) => total + rating.score, 0) /
              entry.recipe.ratings.length
            ).toFixed(1)
          : "0.0",
    })),
    mealPlanId: mealPlan.id,
    dayName,
  };
}

export function getMealPlanDateContext(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayName = DAYS[dateObj.getDay()];

  const weekStart = new Date(dateObj);
  weekStart.setDate(dateObj.getDate() - (dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1));
  weekStart.setHours(0, 0, 0, 0);

  const previousWeekStart = new Date(weekStart);
  previousWeekStart.setDate(weekStart.getDate() - 7);

  return { dateObj, dayName, weekStart, previousWeekStart };
}

export async function getMealsForDate({ email }, dateStr) {
  const { dayName, weekStart, previousWeekStart } = getMealPlanDateContext(dateStr);

  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!dbUser) {
    return { meals: [], mealPlanId: null, dayName };
  }

  let mealPlan = await prisma.mealPlan.findFirst({
    where: { userId: dbUser.id, weekStart },
    select: getMealPlanSelect(dayName),
  });

  const previousMealPlan = await prisma.mealPlan.findFirst({
    where: { userId: dbUser.id, weekStart: previousWeekStart },
    select: {
      id: true,
      recipes: {
        where: { dayOfWeek: dayName, repeatWeekly: true },
        select: {
          recipeId: true,
          dayOfWeek: true,
          mealType: true,
        },
      },
    },
  });

  if (previousMealPlan?.recipes.length) {
    if (!mealPlan) {
      const createdPlan = await prisma.mealPlan.create({
        data: {
          userId: dbUser.id,
          weekStart,
        },
        select: { id: true },
      });

      mealPlan = {
        id: createdPlan.id,
        recipes: [],
      };
    }

    const existingKeys = new Set(
      mealPlan.recipes.map((entry) => `${entry.recipeId}-${entry.dayOfWeek}-${entry.mealType}`)
    );

    const entriesToCreate = previousMealPlan.recipes.filter(
      (entry) => !existingKeys.has(`${entry.recipeId}-${entry.dayOfWeek}-${entry.mealType}`)
    );

    if (entriesToCreate.length > 0) {
      await prisma.mealPlanRecipe.createMany({
        data: entriesToCreate.map((entry) => ({
          mealPlanId: mealPlan.id,
          recipeId: entry.recipeId,
          dayOfWeek: entry.dayOfWeek,
          mealType: entry.mealType,
          repeatWeekly: true,
        })),
        skipDuplicates: true,
      });

      mealPlan = await prisma.mealPlan.findFirst({
        where: { id: mealPlan.id },
        select: getMealPlanSelect(dayName),
      });
    }
  }

  return mapMeals(mealPlan, dayName);
}

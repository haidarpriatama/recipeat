import prisma from './lib/prisma.js';

async function test() {
  try {
    const favorites = await prisma.favorite.findMany({ take: 1 });
    console.log("Favorites fetched successfully:", favorites.length);
    const mealPlans = await prisma.mealPlan.findMany({ take: 1 });
    console.log("MealPlans fetched successfully:", mealPlans.length);
    const ratings = await prisma.rating.findMany({ take: 1 });
    console.log("Ratings fetched successfully:", ratings.length);
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();

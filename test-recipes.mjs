import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();
async function main() {
  const recipes = await prisma.recipe.findMany({ select: { title: true, category: { select: { name: true } } } });
  console.log(JSON.stringify(recipes, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());

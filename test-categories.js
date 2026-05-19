const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const categories = await prisma.category.findMany();
  console.log(categories);
  const cumi = await prisma.recipe.findFirst({ where: { title: { contains: "Cumi" } }, include: { category: true } });
  console.log("Cumi recipe:", cumi);
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

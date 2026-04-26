const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Sedang mengisi data awal...');

  try {
    // 1. Bersihkan data lama
    await prisma.mealPlanRecipe.deleteMany({});
    await prisma.mealPlan.deleteMany({});
    await prisma.favorite.deleteMany({});
    await prisma.recipeIngredient.deleteMany({});
    await prisma.recipe.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.ingredient.deleteMany({});

    // 2. Tambah Kategori
    const cat1 = await prisma.category.create({ data: { name: 'Sarapan' } });
    const cat2 = await prisma.category.create({ data: { name: 'Makan Siang' } });
    const cat3 = await prisma.category.create({ data: { name: 'Makan Malam' } });

    // 3. Tambah Resep
    await prisma.recipe.create({
      data: {
        title: 'Nasi Goreng Spesial',
        description: 'Nasi goreng lezat khas Indonesia.',
        cookTime: 20,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1512058560366-c80b0426c6f5?auto=format&fit=crop&w=800&q=80',
      }
    });

    console.log('BERHASIL! Database sudah terisi.');
  } catch (error) {
    console.error('Error saat seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { Pool } from 'pg';
import { PrismaClient } from './generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function findGroupedIngredients() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: {
        OR: [
          { name: { contains: ' & ' } },
          { name: { contains: ' dan ' } },
          { name: { contains: ' and ' } }
        ]
      },
      include: {
        recipes: true
      }
    });
    
    console.log(`Found ${ingredients.length} grouped ingredients:`);
    ingredients.forEach(i => {
      console.log(`- ID: ${i.id}, Name: "${i.name}", Used in ${i.recipes.length} recipes`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

findGroupedIngredients();

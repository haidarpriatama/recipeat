import { Pool } from 'pg';
import { PrismaClient } from './generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkQuantities() {
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
    
    for (const i of ingredients) {
      if (i.recipes.length > 0) {
        console.log(`\nIngredient: "${i.name}"`);
        for (const r of i.recipes) {
          console.log(`  - Recipe ID ${r.recipeId}: quantity = "${r.quantity}"`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuantities();

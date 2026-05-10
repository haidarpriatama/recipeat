import { Pool } from 'pg';
import { PrismaClient } from './generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const sessionUserId = '917559b3-ebd5-4703-9049-a5fc506d4b9d'; // Existing user ID from the favorite query
    
    console.log("Upserting user...");
    const user = await prisma.user.upsert({
      where: { id: sessionUserId },
      update: {},
      create: { 
        id: sessionUserId, 
        email: "test@example.com", 
        name: "Test User"
      },
    });
    console.log("Upserted user:", user);

    console.log("Finding favorite...");
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId: sessionUserId,
          recipeId: 126,
        },
      },
    });
    console.log("Found favorite:", !!existing);

  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();

import { Pool } from 'pg';
import { PrismaClient } from './generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function migrateIngredients() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: {
        OR: [
          { name: { contains: ' & ' } },
          { name: { contains: ' dan ', mode: 'insensitive' } },
          { name: { contains: ' and ', mode: 'insensitive' } }
        ]
      },
      include: {
        recipes: true
      }
    });
    
    console.log(`Found ${ingredients.length} grouped ingredients to split.`);

    for (const oldIng of ingredients) {
      console.log(`Processing: "${oldIng.name}"`);
      
      // Split the name
      const parts = oldIng.name.split(/&| dan | and /i).map(s => s.trim()).filter(s => s.length > 0);
      
      if (parts.length < 2) continue; // safety check

      // Find or create new ingredients
      const newIngredientIds = [];
      for (const part of parts) {
        let ing = await prisma.ingredient.findFirst({
          where: { name: { equals: part, mode: 'insensitive' } }
        });
        if (!ing) {
          ing = await prisma.ingredient.create({
            data: { name: part }
          });
          console.log(`  Created new ingredient: "${part}" (ID: ${ing.id})`);
        } else {
          console.log(`  Found existing ingredient: "${part}" (ID: ${ing.id})`);
        }
        newIngredientIds.push(ing.id);
      }

      // Re-assign recipe links
      for (const recipeLink of oldIng.recipes) {
        console.log(`  Updating recipe ID ${recipeLink.recipeId}`);
        // Delete the old link
        await prisma.recipeIngredient.delete({
          where: { id: recipeLink.id }
        });

        // Create new links for each split ingredient
        for (const newId of newIngredientIds) {
          // Check if it already exists to avoid duplicates
          const existingLink = await prisma.recipeIngredient.findFirst({
            where: { recipeId: recipeLink.recipeId, ingredientId: newId }
          });
          if (!existingLink) {
            await prisma.recipeIngredient.create({
              data: {
                recipeId: recipeLink.recipeId,
                ingredientId: newId,
                quantity: recipeLink.quantity
              }
            });
          }
        }
      }

      // Finally, delete the old grouped ingredient
      await prisma.ingredient.delete({
        where: { id: oldIng.id }
      });
      console.log(`  Deleted old grouped ingredient: "${oldIng.name}"`);
    }

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

migrateIngredients();

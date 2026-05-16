const { PrismaClient } = require('./generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function formatIngredientName(name) {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

async function main() {
  // Step 1: Find all ingredients and group by normalized name (case-insensitive)
  const allIngredients = await prisma.ingredient.findMany({
    include: {
      recipes: true, // include RecipeIngredient links
    },
  });

  console.log(`Total ingredients in database: ${allIngredients.length}`);

  // Group by normalized (lowercase) name
  const groups = {};
  for (const ing of allIngredients) {
    const key = ing.name.trim().toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(ing);
  }

  // Find groups with duplicates
  const duplicateGroups = Object.entries(groups).filter(([, items]) => items.length > 1);
  console.log(`Found ${duplicateGroups.length} groups of duplicate ingredients.\n`);

  let mergedCount = 0;
  let deletedCount = 0;

  for (const [key, items] of duplicateGroups) {
    const canonicalName = formatIngredientName(key);
    console.log(`\n--- Duplicate group: "${key}" (${items.length} entries) ---`);
    for (const item of items) {
      console.log(`  ID: ${item.id}, Name: "${item.name}", Used in ${item.recipes.length} recipe links`);
    }

    // Pick the "primary" ingredient: prefer one that already has the canonical name, otherwise the one with the lowest ID
    let primary = items.find(i => i.name === canonicalName) || items[0];
    const duplicates = items.filter(i => i.id !== primary.id);

    console.log(`  -> Keeping ID ${primary.id} ("${primary.name}") as primary`);

    for (const dup of duplicates) {
      console.log(`  -> Merging ID ${dup.id} ("${dup.name}") into primary...`);

      // Get all recipe links for the duplicate
      const dupLinks = await prisma.recipeIngredient.findMany({
        where: { ingredientId: dup.id },
      });

      for (const link of dupLinks) {
        // Check if primary already has a link to this recipe
        const existingLink = await prisma.recipeIngredient.findUnique({
          where: {
            recipeId_ingredientId: {
              recipeId: link.recipeId,
              ingredientId: primary.id,
            },
          },
        });

        if (existingLink) {
          // Primary already linked to this recipe, just delete the duplicate link
          await prisma.recipeIngredient.delete({ where: { id: link.id } });
          console.log(`    Recipe ${link.recipeId}: deleted duplicate link (primary already linked)`);
        } else {
          // Move link from duplicate to primary
          await prisma.recipeIngredient.update({
            where: { id: link.id },
            data: { ingredientId: primary.id },
          });
          console.log(`    Recipe ${link.recipeId}: moved link to primary`);
          mergedCount++;
        }
      }

      // Delete the duplicate ingredient
      await prisma.ingredient.delete({ where: { id: dup.id } });
      console.log(`  -> Deleted duplicate ingredient ID ${dup.id}`);
      deletedCount++;
    }

    // Rename primary to canonical name if needed
    if (primary.name !== canonicalName) {
      await prisma.ingredient.update({
        where: { id: primary.id },
        data: { name: canonicalName },
      });
      console.log(`  -> Renamed primary "${primary.name}" -> "${canonicalName}"`);
    }
  }

  // Step 2: Normalize all remaining ingredient names (non-duplicate ones)
  const remaining = await prisma.ingredient.findMany();
  let renamedCount = 0;
  for (const ing of remaining) {
    const newName = formatIngredientName(ing.name);
    if (newName !== ing.name) {
      await prisma.ingredient.update({
        where: { id: ing.id },
        data: { name: newName },
      });
      console.log(`Renamed: "${ing.name}" -> "${newName}"`);
      renamedCount++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Duplicate groups found: ${duplicateGroups.length}`);
  console.log(`Duplicate ingredients deleted: ${deletedCount}`);
  console.log(`Recipe links merged: ${mergedCount}`);
  console.log(`Ingredients renamed: ${renamedCount}`);
  console.log(`Done!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

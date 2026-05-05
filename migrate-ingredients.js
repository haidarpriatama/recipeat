const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Starting migration...');
    
    // 1. Get all current ingredients
    const { rows: recipeIngredients } = await client.query('SELECT * FROM "RecipeIngredient"');
    console.log(`Found ${recipeIngredients.length} ingredient records.`);

    // 2. Extract and normalize unique ingredient names
    // Normalize "Telur Ayam" etc. to "Telur"
    const uniqueNames = new Set();
    recipeIngredients.forEach(ri => {
      let name = ri.ingredientName;
      if (name.toLowerCase().includes('telur')) {
        name = 'Telur';
      }
      uniqueNames.add(name);
    });

    console.log(`Unique ingredients after normalization: ${uniqueNames.size}`);

    // 3. Create Ingredient table (manual SQL since schema hasn't pushed)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Ingredient" (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      )
    `);

    // 4. Insert unique ingredients and get IDs
    const nameToId = {};
    for (const name of uniqueNames) {
      const { rows } = await client.query(
        'INSERT INTO "Ingredient" (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [name]
      );
      nameToId[name] = rows[0].id;
    }

    // 5. Update RecipeIngredient table
    // Add ingredientId column first
    await client.query('ALTER TABLE "RecipeIngredient" ADD COLUMN IF NOT EXISTS "ingredientId" INTEGER');

    for (const ri of recipeIngredients) {
      let normalizedName = ri.ingredientName;
      if (normalizedName.toLowerCase().includes('telur')) {
        normalizedName = 'Telur';
      }
      const ingredientId = nameToId[normalizedName];
      await client.query(
        'UPDATE "RecipeIngredient" SET "ingredientId" = $1 WHERE id = $2',
        [ingredientId, ri.id]
      );
    }

    console.log('Migration step 1 complete. Now push the Prisma schema.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

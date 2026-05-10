import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function resetSequences() {
  try {
    console.log("Resetting sequences...");
    await pool.query(`SELECT setval('"Ingredient_id_seq"', (SELECT MAX(id) FROM "Ingredient"));`);
    console.log("Ingredient sequence reset!");
    await pool.query(`SELECT setval('"RecipeIngredient_id_seq"', (SELECT MAX(id) FROM "RecipeIngredient"));`);
    console.log("RecipeIngredient sequence reset!");
  } catch (err) {
    console.error("Error resetting sequence:", err);
  } finally {
    await pool.end();
  }
}

resetSequences();

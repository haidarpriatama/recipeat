import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function resetSequences() {
  try {
    console.log("Resetting sequences...");
    const tables = [
      "Account",
      "Category",
      "Ingredient",
      "MealPlan",
      "Rating",
      "Recipe",
      "RecipeIngredient",
      "Session"
    ];

    for (const table of tables) {
      await pool.query(`
        SELECT setval(
          pg_get_serial_sequence('"${table}"', 'id'),
          COALESCE((SELECT MAX(id) FROM "${table}"), 1),
          EXISTS(SELECT 1 FROM "${table}")
        );
      `);
      console.log(`${table} sequence reset!`);
    }
  } catch (err) {
    console.error("Error resetting sequence:", err);
  } finally {
    await pool.end();
  }
}

resetSequences();

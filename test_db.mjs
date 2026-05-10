import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function test() {
  try {
    const res = await pool.query('SELECT * FROM "Favorite" LIMIT 1');
    console.log("Favorite table exists:", res.rows);
  } catch (err) {
    console.error("Error querying Favorite:", err.message);
  }

  try {
    const res = await pool.query('SELECT * FROM "Rating" LIMIT 1');
    console.log("Rating table exists:", res.rows);
  } catch (err) {
    console.error("Error querying Rating:", err.message);
  }
  
  pool.end();
}

test();

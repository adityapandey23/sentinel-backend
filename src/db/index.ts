import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// Adding a pool to the database connection
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

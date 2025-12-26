import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export type SqlContext = PostgresJsDatabase<typeof schema>;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
});

export const db = drizzle(pool, { schema });

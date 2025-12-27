import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type SqlContext = NodePgDatabase<typeof schema>;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
});

export const db = drizzle(pool, { schema });

import { beforeAll } from "vitest";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../src/db/db";

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
});

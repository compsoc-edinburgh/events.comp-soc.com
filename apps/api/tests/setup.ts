import { beforeAll, beforeEach } from "vitest";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../src/db/db";
import { setMockAuth } from "../src/lib/mock-auth";

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
});

beforeEach(() => {
  setMockAuth({ userId: null, sessionClaims: null });
});

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // @ts-expect-error, it doesn't see types for the process
    url: process.env.DATABASE_URL!,
  },
});

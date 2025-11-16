import { defineConfig } from "prisma/config";

const DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  engine: "classic",
  datasource: {
    url: DATABASE_URL
  }
});

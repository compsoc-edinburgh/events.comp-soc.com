import { defineConfig } from "vitest/config";
import { config } from "dotenv";

config({ path: ".env.test" });

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    // Since we use ONE Docker DB, we cannot run multiple test
    fileParallelism: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/types/**"],
    },
  },
});

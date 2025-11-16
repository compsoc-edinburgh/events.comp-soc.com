import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      exclude: ["node_modules/", "generated/", "dist/", "src/tests/"]
    },
    server: {
      deps: {
        inline: ["@clerk/fastify"]
      }
    }
  }
});

import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Base ESLint configuration for the monorepo
 * Individual apps can extend this with their specific needs
 */
export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/coverage/**",
      "**/.turbo/**",
    ],
  },
  
  // Base JavaScript and TypeScript config
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    rules: {
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Allow console in development
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  }
);


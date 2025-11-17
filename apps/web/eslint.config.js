import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import baseConfig from "../../eslint.config.js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

/**
 * ESLint config for the web app
 * Extends base config with React-specific rules
 */
export default tseslint.config(...baseConfig, eslintConfigPrettier, eslintPluginPrettier, {
  files: ["**/*.{ts,tsx}"],
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh
  },
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }]
  }
});

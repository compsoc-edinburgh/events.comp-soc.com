import baseConfig from "../../eslint.config.js";

/**
 * ESLint config for the API app
 * Extends base config for Node.js environment
 */
export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        NodeJS: true,
        console: true,
        process: true,
      },
    },
  },
];


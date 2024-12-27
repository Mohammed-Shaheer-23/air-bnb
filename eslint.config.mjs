export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "no-console": "off", // Disable the no-console rule
      "no-unused-vars": "warn", // Show unused vars as warnings instead of errors
    },
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
  },
];

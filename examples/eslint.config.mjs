import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import requireIfBlock from "./dist/require-if-block.js";

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins: {
      example: requireIfBlock,
    },
    rules: {
      "example/require-if-block": "error",
    },
  },
);

import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";
import commentsConfig from "@eslint-community/eslint-plugin-eslint-comments/configs";
import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import compat from "eslint-plugin-compat";
import packageJson from "eslint-plugin-package-json";
import perfectionist from "eslint-plugin-perfectionist";
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  globalIgnores(["dist/", "package-lock.json", "src/css/fontello.css"]),
  packageJson.configs.recommended,
  {
    extends: [css.configs.recommended],
    files: ["**/*.css"],
    language: "css/css",
    rules: {
      "css/no-invalid-properties": "off", // Doesn't support CSS variables
    },
  },
  {
    extends: [json.configs.recommended],
    files: ["**/*.json"],
    ignores: ["package.json"],
    language: "json/json",
  },
  {
    extends: [markdown.configs.recommended],
    files: ["**/*.md"],
    language: "markdown/commonmark",
  },
  {
    extends: [
      js.configs.recommended,
      prettierRecommended,
      commentsConfig.recommended,
      compat.configs["flat/recommended"],
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      perfectionist.configs["recommended-natural"],
    ],
    files: ["**/*.js", "**/*.ts"],
    plugins: {
      "eslint-comments": eslintComments,
      "prefer-arrow-functions": preferArrowFunctions,
    },
    rules: {
      "array-callback-return": "error",
      "arrow-body-style": ["error", "as-needed"],
      "block-scoped-var": "error",
      "consistent-return": "error",
      "default-case": "error",
      "default-case-last": "error",
      eqeqeq: "error",
      "eslint-comments/no-unused-disable": "error",
      "eslint-comments/require-description": [
        "error",
        {
          ignore: ["eslint-enable", "exported", "global"],
        },
      ],
      "guard-for-in": "error",
      "logical-assignment-operators": "error",
      "new-cap": "error",
      "no-alert": "error",
      "no-await-in-loop": "error",
      "no-console": "error",
      "no-constructor-return": "error",
      "no-duplicate-imports": "error",
      "no-else-return": "error",
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-inner-declarations": "error",
      "no-invalid-this": "error",
      "no-iterator": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-multi-assign": "error",
      "no-new-func": "error",
      "no-object-constructor": "error",
      "no-param-reassign": "error",
      "no-promise-executor-return": "error",
      "no-return-assign": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-template-curly-in-string": "error",
      "no-unreachable-loop": "error",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "no-warning-comments": "warn",
      "object-shorthand": "error",
      "operator-assignment": "error",
      "perfectionist/sort-union-types": [
        "error",
        {
          groups: [
            "literal",
            "function",
            "import",
            "operator",
            "conditional",
            "object",
            "tuple",
            "intersection",
            "union",
            "named",
            "keyword",
            "nullish",
            "unknown",
          ],
        },
      ],
      "prefer-arrow-functions/prefer-arrow-functions": [
        "error",
        {
          allowNamedFunctions: true,
        },
      ],
      "prefer-exponentiation-operator": "error",
      "prefer-object-spread": "error",
      "prefer-regex-literals": "error",
      "prefer-template": "error",
      radix: "error",
      "require-atomic-updates": "error",
      "require-unicode-regexp": "off", // Needs newer ES
      strict: ["error", "never"],
    },
  },
  {
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        sourceType: "script",
      },
    },
    rules: {
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/class-methods-use-this": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/init-declarations": "error",
      "@typescript-eslint/method-signature-style": ["error", "method"],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unnecessary-parameter-property-assignment":
        "error",
      "@typescript-eslint/no-unnecessary-qualifier": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-use-before-define": [
        "error",
        { functions: false },
      ],
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/parameter-properties": "error",
      "@typescript-eslint/prefer-enum-initializers": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/prefer-string-starts-ends-with": "off", // Needs newer ES
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/typedef": "error",
    },
  },
  {
    files: ["*.config.js", "*.config.ts", "gulpfile.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);

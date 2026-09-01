/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
  rules: {
    "color-function-notation": "legacy",
    // The `inset` shorthand is above our floor (Chrome 87 / Safari 14.1).
    "declaration-block-no-redundant-longhand-properties": [
      true,
      {
        ignoreShorthands: ["inset"],
      },
    ],
  },
};

/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
  plugins: ["stylelint-no-unsupported-browser-features"],
  /* eslint-disable @typescript-eslint/naming-convention -- Keys are rule names */
  rules: {
    "color-function-notation": "legacy",
    "plugin/no-unsupported-browser-features": [
      true,
      {
        severity: "warning",
      },
    ],
  },
  /* eslint-enable */
};

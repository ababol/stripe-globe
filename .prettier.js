/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */

/** @type {PrettierConfig & TailwindConfig} */
module.exports = {
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
  quoteProps: "preserve",
  tailwindFunctions: ["cn", "cva"],
  trailingComma: "all",
};

import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		extends: [js.configs.recommended],
	},
	{
		files: ["**/*.{ts,mts,cts}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
	},
	eslintConfigPrettier,
	...eslintPluginAstro.configs.recommended,
]);

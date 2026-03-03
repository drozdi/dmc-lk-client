// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	globalIgnores([
		"dist",
		"test",
		"build",
		"dev",
		"public",
		"reports",
		"node_modules",
	]),
	js.configs.recommended,
	tseslint.configs.recommended,
	reactHooks.configs["recommended-latest"],
	reactRefresh.configs.vite,
	{
		rules: {
			"no-unused-expressions": "off",
			"@typescript-eslint/no-unused-expressions": [
				"error",
				{
					allowShortCircuit: false,
					allowTernary: false,
					allowTaggedTemplates: false,
				},
			],
		},
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2023,
			globals: globals.browser,
		},
	},
]);

import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

async function loadFrameworkLintConfigs() {
	const configs = [];

	// 1. Vue Setup
	try {
		const pluginVue = await import("eslint-plugin-vue");
		configs.push(...pluginVue.default.configs["flat/recommended"]);
	} catch {}

	// 2. Svelte Setup
	try {
		const pluginSvelte = await import("eslint-plugin-svelte");
		configs.push(...pluginSvelte.default.configs["flat/recommended"]);
	} catch {}

	// 3. React / Solid / JSX Configuration
	try {
		await import("@astrojs/react");

		const pluginReact = await import("eslint-plugin-react");
		const pluginReactHooks = await import("eslint-plugin-react-hooks");

		configs.push({
			files: ["**/*.jsx", "**/*.tsx"],
			plugins: {
				react: pluginReact.default,
				"react-hooks": pluginReactHooks.default,
			},
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
			rules: {
				...pluginReact.default.configs.recommended.rules,
				...pluginReactHooks.default.configs.recommended.rules,
				"react/react-in-jsx-scope": "off",
				"react/prop-types": "off",
			},
			settings: {
				react: {
					version: "detect",
				},
			},
		});
	} catch {}

	return configs;
}

const dynamicFrameworkConfigs = await loadFrameworkLintConfigs();

// --- MAIN CONFIGURATION ---
export default defineConfig([
	{
		// Global Ignores
		ignores: [
			".astro",
			"dist",
			"generated",
			"src/env.d.ts",
			"src/components/ui/*.tsx",
		],
	},

	// Pure TypeScript Configuration (Strictly TS and TSX only)
	{
		files: ["**/*.ts", "**/*.tsx"],
		extends: [
			...tseslint.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
			},
		},
		rules: {
			"@typescript-eslint/array-type": "off",
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/consistent-type-imports": [
				"warn",
				{ prefer: "type-imports", fixStyle: "inline-type-imports" },
			],
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/no-misused-promises": [
				"error",
				{ checksVoidReturn: { attributes: false } },
			],
		},
	},

	...dynamicFrameworkConfigs,
	...eslintPluginAstro.configs.recommended,

	{
		files: ["**/*.astro"],
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		languageOptions: {
			parser: eslintPluginAstro.parser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: [".astro"],
			},
		},
		rules: {
			"@typescript-eslint/consistent-type-imports": [
				"warn",
				{ prefer: "type-imports", fixStyle: "inline-type-imports" },
			],
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
		},
	},

	{
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
	},
]);

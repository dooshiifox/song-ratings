/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"plugin:svelte/recommended",
		"plugin:@tanstack/eslint-plugin-query/recommended",
		"prettier"
	],
	parser: "@typescript-eslint/parser",
	plugins: ["import", "@typescript-eslint", "@tanstack/query" /* "prettier" */],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
		extraFileExtensions: [".svelte"],
		project: "./tsconfig.eslint.json"
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser"
			},
			rules: {
				"@typescript-eslint/no-unsafe-member-access": "off",
				"@typescript-eslint/no-unsafe-call": "off",
				// runes break with these >:(((
				"@typescript-eslint/no-unsafe-assignment": "off",
				"@typescript-eslint/no-unsafe-return": "off",
				"@typescript-eslint/no-unsafe-argument": "off",
				quotes: "off",
				// Breaks $ stores
				"svelte/valid-compile": "off"
			}
		}
	],
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts"]
		},
		"import/extensions": [".ts"],
		"import/resolver": {
			typescript: {
				project: "./tsconfig.eslint.json"
			}
		}
	},
	rules: {
		quotes: [
			"error",
			"double",
			{
				avoidEscape: true
			}
		],
		// indent: ["error", "tab", { SwitchCase: 1 }],
		// Managed by Prettier
		indent: ["off"],
		"comma-dangle": ["error", "never"],
		"linebreak-style": ["error", "unix"],
		semi: ["error", "always"],
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
		],
		// enforce boolean conditions
		"@typescript-eslint/strict-boolean-expressions": [
			"error",
			{
				allowString: false,
				allowNumber: false,
				allowNullableObject: false,
				allowNullableBoolean: false,
				allowNullableString: false,
				allowNullableNumber: false,
				allowNullableEnum: false,
				allowAny: false
			}
		],
		"@typescript-eslint/member-delimiter-style": "warn",
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/array-type": [
			"warn",
			{
				default: "generic"
			}
		],
		"@typescript-eslint/ban-ts-comment": "warn",
		// Handled by TS
		"no-undef": "off",
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": "error",
		"no-use-before-define": "off",
		"@typescript-eslint/no-use-before-define": [
			"error",
			{
				functions: false,
				classes: true,
				variables: true,
				allowNamedExports: false,
				enums: false,
				typedefs: false,
				ignoreTypeReferences: true
			}
		],
		"@typescript-eslint/consistent-type-definitions": ["error", "type"],
		// The ability to do `{ [name: T]: U }` is useful for self-documenting.
		"@typescript-eslint/consistent-indexed-object-style": ["off"],
		"@typescript-eslint/dot-notation": [
			"off"
			// {
			// 	allowIndexSignaturePropertyAccess: true
			// }
		],
		"import/no-default-export": "error",
		// Doesnt recognise namespaces
		"import/default": "off",
		// Doesn't work with SvelteKit stuff like "$app/environment"
		"import/no-unresolved": "off",
		"no-extra-boolean-cast": "off"
	}
};

import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import functionalPlugin from "eslint-plugin-functional";
import importPlugin from "eslint-plugin-import";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const restrictedSyntaxCommon = [
  {
    selector: "Literal[value=null]",
    message:
      "Avoid using `null`. Prefer explicit optional modeling or early returns.",
  },
  {
    selector: "Identifier[name='undefined']",
    message:
      "Avoid using `undefined`. Prefer explicit optional modeling or early returns.",
  },
  {
    selector: "TSUndefinedKeyword",
    message:
      "Avoid `undefined` in type positions. Prefer explicit optional/domain modeling.",
  },
  {
    selector: "IfStatement[test.type='Identifier']",
    message:
      "Do not use bare value conditions like `if (value)`. Use explicit comparisons.",
  },
  {
    selector:
      "IfStatement[test.type='UnaryExpression'][test.operator='!'][test.argument.type='Identifier']",
    message: "Do not use bare negation conditions. Use explicit comparisons.",
  },
  {
    selector: "TSAsExpression",
    message:
      "Do not use `as` type assertions. Narrow or redesign the interface.",
  },
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message: "Render trusted elements explicitly instead of injecting HTML.",
  },
  {
    selector:
      "AssignmentExpression[left.type='MemberExpression'][left.property.name=/^(innerHTML|outerHTML)$/]",
    message: "Do not assign raw HTML.",
  },
];

const restrictedSyntaxDomainOnly = [
  {
    selector: 'UnaryExpression[operator="typeof"]',
    message:
      "Avoid runtime `typeof` in domain/application code. Validate at boundaries.",
  },
  {
    selector: 'BinaryExpression[operator="instanceof"]',
    message:
      "Avoid `instanceof` in domain/application code. Validate at boundaries.",
  },
];

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
  {
    ignores: [
      "node_modules",
      "dist",
      ".git",
      "playwright-report",
      "test-results",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        globalThis: "readonly",
        process: "readonly",
        Buffer: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      functional: functionalPlugin,
      import: importPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript?.rules,
      "no-undef": "off",
      "no-undefined": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/prefer-as-const": "off",
      "no-var": "error",
      "no-nested-ternary": "error",
      eqeqeq: ["error", "always"],
      "no-implicit-coercion": "error",
      "no-param-reassign": ["error", { props: true }],
      "functional/no-let": "error",
      "functional/no-throw-statements": "error",
      "no-restricted-syntax": ["error", ...restrictedSyntaxCommon],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
  },
  {
    files: ["src/domain/**/*.{ts,tsx}", "src/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...restrictedSyntaxCommon,
        ...restrictedSyntaxDomainOnly,
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-call": "error",
    },
  },
  {
    files: [
      "src/domain/**/*.{ts,tsx}",
      "src/application/**/*.{ts,tsx}",
      "src/presentation/**/*.{ts,tsx}",
      "src/shared/**/*.{ts,tsx}",
      "src/main.tsx",
    ],
    rules: {
      "functional/immutable-data": [
        "error",
        {
          ignoreImmediateMutation: true,
          ignoreNonConstDeclarations: true,
          ignoreMapsAndSets: true,
          ignoreAccessorPattern: ["current", "*.current", "style", "*.style"],
        },
      ],
    },
  },
  {
    files: ["src/infrastructure/**/*.ts", "src/infrastructure/**/*.tsx"],
    rules: {
      "functional/immutable-data": "off",
    },
  },
];

export default config;

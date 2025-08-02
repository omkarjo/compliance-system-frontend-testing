import js from "@eslint/js";
import globals from "globals";
import eslintPluginImport from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    ignores: ["dist", "node_modules", "build", "coverage"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: eslintPluginImport,
      "unused-imports": unusedImports,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"],
        },
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx"],
        },
      },
      "import/ignore": [
        "node_modules",
        "\\.(css|less|scss|sass|styl)$",
        "\\.(svg|png|jpg|jpeg|gif|webp)$",
      ],
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "import/no-unresolved": [
        "error",
        {
          ignore: [
            "^@tailwindcss/",
            "^@vitejs/",
            "^vite$",
            "^vite/",
          ],
        },
      ],
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/export": "error",
      "import/no-named-as-default": "warn",
      "import/no-named-as-default-member": "warn",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },
];
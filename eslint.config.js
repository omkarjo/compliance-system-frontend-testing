import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import cypress from 'eslint-plugin-cypress' // Import Cypress plugin

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node.js globals if needed
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      cypress, // Add Cypress plugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['test/e2e/**/*.cy.{js,jsx}'], // Target Cypress test files
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha, // Add Mocha globals (used by Cypress)
        'cy': true, // Cypress global
      },
    },
    plugins: {
      cypress, // Enable Cypress plugin for test files
    },
    env: {
      'cypress/globals': true, // Add Cypress environment
    },
    rules: {
      'no-unused-expressions': 'off', // Disable for Chai assertions
    },
  },
]
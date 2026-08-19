import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'playwright-report', 'test-results']),
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: ['src/**/*.test.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['src/**/*.test.{js,jsx}'],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.vitest },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Playwright spec files mix Node-side test code with browser-side
    // page.evaluate() callback bodies in the same file, so both global
    // sets are legitimate here.
    files: ['e2e/**/*.js', 'playwright.config.js', 'vite.config.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
])

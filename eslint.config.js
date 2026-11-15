// tsc uses TypeScript 7; the "typescript" alias supplies Microsoft's TS 6 API
// compatibility package required by typescript-eslint.
import tsParser from '@typescript-eslint/parser'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // Ignore build artifacts
  { ignores: ['dist/**', 'node_modules/**', 'public/**', 'docker-volumes/**'] },

  // JS/TS files
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      quotes: ['warn', 'single', { avoidEscape: true }],
      semi: ['warn', 'never']
    },
  },
])

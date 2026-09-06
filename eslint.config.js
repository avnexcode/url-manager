//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    ignores: [
      // Config files
      'eslint.config.js',
      'prettier.config.js',

      // Build output & caches
      'dist/**',
      '.output/**',
      '.vercel/**',
      '.tanstack/**',
      '.nitro/**',
      '.vinxi/**',
      'project.inlang/**',

      // Generated files
      'src/generated/**',
      'src/routeTree.gen.ts',

      // Tooling & server configs
      '.vscode/**',
      'nginx/**',
    ],
  },
]

// @ts-check

import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { flatConfigs as importPluginFlatConfigs } from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
  {
    ignores: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      'coverage/**',
      'release/**',
      '.erb/**',
      '.idea/**',
      '**/*.css.d.ts',
      '**/*.sass.d.ts',
      '**/*.scss.d.ts'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  importPluginFlatConfigs.recommended,
  {
    files: ['**/*.ts'],
    settings: {
      'import/extensions': ['.ts', '.tsx', '.d.ts', '.js', '.jsx'],
      'import/external-module-folders': ['node_modules', 'node_modules/@types'],
      'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'] },
      'import/resolver': { node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'] } }
    },
    plugins: {
      unicorn: unicornPlugin
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'import/named': 'off',
      'import/no-unresolved': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      'no-param-reassign': ['error', { props: false }],
      'import/no-extraneous-dependencies': 'off',
      'import/no-relative-packages': 'off',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], ['type']]
        }
      ],
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mui/*/*/*', '!@mui/material/test-utils/*'],
              message: 'Do not import material imports as 3rd level imports',
              allowTypeImports: true
            },
            {
              group: ['@mui/material', '!@mui/material/'],
              message: 'Please import material imports as defaults or 2nd level imports',
              allowTypeImports: true
            }
          ]
        }
      ],
      'require-atomic-updates': 'off',
      'object-shorthand': ['error', 'always'],
      'unicorn/prefer-string-slice': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-duplicate-imports': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
      '@typescript-eslint/no-for-in-array': 'error',
      'no-implied-eval': 'off',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      'require-await': 'off',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/unbound-method': 'error',
      quotes: ['error', 'single']
    }
  },
  eslintConfigPrettier
);

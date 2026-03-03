// @ts-check

import { defineConfig } from 'eslint/config';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { flatConfigs as importPluginFlatConfigs } from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

const require = createRequire(import.meta.url);
const emotionPlugin = require('@emotion/eslint-plugin');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(
  {
    ignores: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      'release/app/dist/**',
      'release/build/**',
      '.erb/**',
      '.idea/**',
      '**/*.css.d.ts',
      '**/*.sass.d.ts',
      '**/*.scss.d.ts'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  importPluginFlatConfigs.recommended,
  importPluginFlatConfigs.typescript,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': { meta: reactHooksPlugin.meta, rules: reactHooksPlugin.rules },
      '@emotion': /** @type {import('eslint').ESLint.Plugin} */ (/** @type {unknown} */ (emotionPlugin)),
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
        tsconfigRootDir: __dirname
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        node: {},
        webpack: {
          config: path.resolve(__dirname, '.erb/configs/webpack.config.eslint.ts')
        },
        typescript: {}
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      }
    },
    rules: {
      'import/no-unresolved': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-param-reassign': ['error', { props: false }],
      'import/no-extraneous-dependencies': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'import/no-relative-packages': 'off',
      'react/function-component-definition': 'off',
      'react/no-unstable-nested-components': 'off',
      'react/require-default-props': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
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
      'react/prop-types': 'off',
      '@emotion/no-vanilla': 'off',
      '@emotion/import-from-emotion': 'error',
      '@emotion/styled-import': 'error',
      'require-atomic-updates': 'off',
      'object-shorthand': ['error', 'always'],
      'unicorn/prefer-string-slice': 'error',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-restricted-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
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
      '@typescript-eslint/unbound-method': 'error'
    }
  },
  eslintConfigPrettier
);

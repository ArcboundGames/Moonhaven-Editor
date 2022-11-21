module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript'
  ],
  plugins: ['babel', '@emotion', 'unicorn', 'react-hooks', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true
  },
  settings: {
    react: {
      version: '18.2'
    },
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts')
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
    '@typescript-eslint/no-var-requires': 'off',
    'no-param-reassign': ['error', { props: false }],
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/no-relative-packages': 'off',
    'react/function-component-definition': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/require-default-props': 'off',
    'prettier/prettier': 'off',
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
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
    'react/prop-types': [0],
    '@emotion/no-vanilla': 'off',
    '@emotion/import-from-emotion': 'error',
    '@emotion/styled-import': 'error',
    'require-atomic-updates': [0],
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
    '@typescript-eslint/ban-types': [0], // TODO enable in future
    '@typescript-eslint/no-non-null-assertion': [0],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-function-return-type': [0],
    '@typescript-eslint/explicit-module-boundary-types': [0],
    '@typescript-eslint/no-duplicate-imports': 'error',
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
  },
};

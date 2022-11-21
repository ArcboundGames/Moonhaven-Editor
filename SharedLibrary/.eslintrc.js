module.exports = {
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    tsconfigRootDir: './',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['babel', 'unicorn', '@typescript-eslint'],
  env: {
    browser: true
  },
  rules: {
    'import/no-unresolved': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    'no-param-reassign': ['error', { props: false }],
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-relative-packages': 'off',
    'prettier/prettier': 'off',
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
    'require-atomic-updates': [0],
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
    'no-duplicate-imports': [0], // handled by @typescript-eslint
    '@typescript-eslint/ban-types': [0], // TODO enable in future
    '@typescript-eslint/no-non-null-assertion': [0],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-function-return-type': [0],
    '@typescript-eslint/explicit-module-boundary-types': [0],
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true }
    ],
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
};

import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': plugin,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json', './packages/*/tsconfig.json'],
          alwaysTryTypes: true,
        },
      },
    },
    languageOptions: {
      parser,
      parserOptions: {
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'max-depth': ['error', 4],
      'consistent-return': 'error',
      indent: ['error', 2],
      'no-shadow': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-unused-vars': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-unresolved': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
      'no-useless-rename': 'error',
      'max-lines': [
        'error',
        {
          max: 350,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      complexity: ['error', 8],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          // 'newlines-between': 'always',
        },
      ],
      'no-empty-function': 'error',
      '@typescript-eslint/consistent-type-definitions': 'warn',
      '@typescript-eslint/consistent-indexed-object-style': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        {
          ignoreConditionalTests: false,
          ignoreMixedLogicalExpressions: false,
        },
      ],
    },
  },
];

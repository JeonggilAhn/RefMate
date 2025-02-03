import { fixupConfigRules } from '@eslint/compat';
import prettier from 'eslint-plugin-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended', // 기본 JS 권장 규칙
      'plugin:react/recommended', // React 권장 규칙
      'plugin:react-hooks/recommended', // React Hooks 권장 규칙
      'prettier', // Prettier와 호환
    ),
  ),
  {
    plugins: {
      prettier,
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'warn',
      'prettier/prettier': 'error', // Prettier 규칙을 ESLint와 통합
    },
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
    },
  },
];

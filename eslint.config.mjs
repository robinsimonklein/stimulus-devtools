import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import typescriptEslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default defineConfig(
  { ignores: ['*.d.ts', '.wxt/', '.output'] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...pluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Typescript
      '@typescript-eslint/no-explicit-any': 'off',

      // Vue
      'vue/multi-word-component-names': ['off'],
    },
  },
  pluginPrettier,
);

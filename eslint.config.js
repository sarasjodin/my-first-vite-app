import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        document: true,
        window: true,
        console: true,
        localStorage: true,
        fetch: true,
        setTimeout: true,
        clearTimeout: true,
        location: true,
        HTMLElement: true,
        HTMLFormElement: true,
        HTMLInputElement: true,
        HTMLSelectElement: true,
        HTMLButtonElement: true,
        MouseEvent: true,
        SubmitEvent: true,
        confirm: true,
        Response: true,
        MutationObserver: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
  js.configs.recommended,
];

import borgarLint from '@borgar/eslint-config';
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: [
      '**/*.js',
      '**/*.ts',
      '**/*.mjs'
    ],
    ignores: [
      'dist/*'
    ],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { projectService: { allowDefaultProject: [ 'tsdown.config.ts' ] } }
    }
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  borgarLint.config.recommended,
  borgarLint.config.stylistic({ commaDangle: false }),
  {
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-this-alias': 'off',
    }
  }
]);

import nextPlugin from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';

const nextCoreWebVitalsConfig = nextPlugin.configs['core-web-vitals'] ?? {};

export default [
  {
    ignores: ['**/node_modules/**', '.next/**'],
  },
  {
    ...nextCoreWebVitalsConfig,
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ...(nextCoreWebVitalsConfig.languageOptions ?? {}),
      parser: tsParser,
      parserOptions: {
        ...(nextCoreWebVitalsConfig.languageOptions?.parserOptions ?? {}),
        project: ['./tsconfig.json'],
      },
    },
  },
];

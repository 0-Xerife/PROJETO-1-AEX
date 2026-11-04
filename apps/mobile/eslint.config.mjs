import expo from 'eslint-config-expo/flat.js';
import { typescript } from '@aex/config/eslint';
export default [
  { ignores: ['dist/**', '.expo/**', 'expo-env.d.ts'] },
  ...expo,
  ...typescript(import.meta.dirname),
  {
    files: ['app.config.ts'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: './tsconfig.tools.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

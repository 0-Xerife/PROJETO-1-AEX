import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export const javascript = [
  js.configs.recommended,
  { languageOptions: { globals: globals.node } },
  prettier,
];

export function typescript(root, extraGlobals = {}) {
  return [
    ...tseslint.configs.recommendedTypeChecked.map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
    })),
    {
      files: ['**/*.ts', '**/*.tsx'],
      languageOptions: {
        parserOptions: { projectService: true, tsconfigRootDir: root },
        globals: { ...globals.node, ...extraGlobals },
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
      },
    },
    prettier,
  ];
}

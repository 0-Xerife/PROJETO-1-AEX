import { javascript } from '@aex/config/eslint';

export default [
  { ignores: ['apps/**', 'packages/**', 'examples/**', '**/node_modules/**', '.turbo/**'] },
  ...javascript,
];

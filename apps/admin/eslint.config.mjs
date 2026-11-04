import next from 'eslint-config-next/core-web-vitals';
import { typescript } from '@aex/config/eslint';
const config = [
  { ignores: ['.next/**', 'next-env.d.ts'] },
  ...next,
  ...typescript(import.meta.dirname),
];
export default config;

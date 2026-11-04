import { javascript, typescript } from '@aex/config/eslint';
export default [{ ignores: ['dist/**'] }, ...javascript, ...typescript(import.meta.dirname)];

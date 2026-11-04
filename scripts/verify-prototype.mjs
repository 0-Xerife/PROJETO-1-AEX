import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

// SHA-256 dos blobs originais em d985cc5. Só normaliza CRLF para LF,
// como o checkout do Git; a movimentação também foi conferida byte a byte.
const expected = {
  'README.md': '77704a5753dcabf09426e95d3d1940f087765eeee3629a85a933e9ea0e7df721',
  'package.json': 'abe7182569d4b9c2918f2ee8b4c0f8a30ec8da7dab78b9c1a24419e7e9f16107',
  'server.js': '6aaa9f37c8f7507a4a9f173f59385d5c304e1ac0896e12bce7533ab99f732090',
  'public/domain.js': 'd93af93c81c7cbd9522773a8024ffbb423f5f0f2fb39f8b4d8f2d5f0489f9645',
  'public/app.js': 'dd4ffc4ce911fb32b3e865c8ac394ce80fda681c6fbb9413d175194b2b486e4f',
  'public/index.html': '104a60ef222a98c8fb2669e2e173bd8056dd12e7fd51c138f37c91c0da235658',
  'public/styles.css': '5249ec02d8bd447c4275ee77c6b9a23d3008ce52e77c764e60f61958fbf77c2f',
  'test/domain.test.js': '6d87b4c8cdc9e40e9abac5aa9cb6b3b7fe595e2f4a32e84f1473463d55496eb0',
};
for (const [file, hash] of Object.entries(expected)) {
  const content = await readFile(new URL('../examples/prototype/' + file, import.meta.url), 'utf8');
  const canonical = content.replace(/\r\n/g, '\n');
  assert.equal(createHash('sha256').update(canonical).digest('hex'), hash, file);
}
console.log('Protótipo preservado: 8/8 conteúdos originais (LF/CRLF).');

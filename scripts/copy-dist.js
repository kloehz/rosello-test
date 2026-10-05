import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const files = [
  ['index.html', 'dist/index.html'],
  ['README.md', 'dist/README.md'],
  ['.nojekyll', 'dist/.nojekyll'],
  ['assets', 'dist/assets'],
  ['src/main.js', 'dist/src/main.js']
];

for (const [from, to] of files) {
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}
writeFileSync('dist/.nojekyll', '');
console.log('dist ready');

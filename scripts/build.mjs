import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist/core', { recursive: true });
await cp('web', 'dist', { recursive: true });
for (const name of ['csv', 'compare', 'report']) await copyFile(`src/${name}.mjs`, `dist/core/${name}.mjs`);
console.log('Built RowGuard website in dist/');

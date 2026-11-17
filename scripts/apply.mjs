#!/usr/bin/env node
import {mkdir, readFile, writeFile, lstat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
if (!args.length || args[0] === '--help') {
  console.log('Usage: wonjeongdae-brand init --out <new-directory>\nCopies CSS, tokens and AI guide into a NEW directory. Does not edit your app.');
  process.exit(0);
}
if (args.length !== 3 || args[0] !== 'init' || args[1] !== '--out' || !args[2].trim()) throw new Error('Expected: init --out <new-directory>');
const out = path.resolve(args[2]);
const relative = path.relative(root, out);
if (!relative || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))) throw new Error('Choose a consumer directory outside this package.');
try { await lstat(out); throw new Error(`Output already exists: ${out}. Choose a new directory; existing files are never overwritten.`); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const files = {'brand.css': 'dist/brand.css', 'components.css': 'dist/components.css', 'tokens.json': 'tokens/brand.json', 'APPLY.md': 'docs/APPLY.md', 'DESIGN.md': 'DESIGN.md'};
const contents = await Promise.all(Object.entries(files).map(async ([dest, src]) => [dest, await readFile(path.join(root, src), 'utf8')]));
await mkdir(out, {recursive: true});
for (const [dest, content] of contents) await writeFile(path.join(out, dest), content, {flag: 'wx'});
console.log(`Copied version 0.1.0 to ${out}. Read APPLY.md, import both CSS files, add data-wj-brand to your root, and map existing UI to semantic tokens. No app files were changed. Snapshots need explicit re-import when upgrading.`);

import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const tokens = JSON.parse(await readFile(path.join(root, 'tokens/brand.json'), 'utf8'));
const declarations = object => Object.entries(object).map(([key, value]) => `  --wj-${key}: ${value};`).join('\n');
const theme = name => declarations(Object.fromEntries(Object.entries(tokens.themes[name]).map(([key, color]) => [key, `var(--wj-color-${color})`])));
const css = `/* Generated from tokens/brand.json. Run npm run build; do not edit. */
@layer wj.tokens, wj.components;
@layer wj.tokens {
:root {
${declarations(Object.fromEntries(Object.entries(tokens.colors).map(([key, value]) => [`color-${key}`, value])))}
${declarations(tokens.proposedWebDefaults)}
  --wj-gradient: linear-gradient(120deg, var(--wj-color-soft-mint), var(--wj-color-key), var(--wj-color-medium-green), var(--wj-color-deep-green));
}
:where([data-wj-brand]) {
${theme('light')}
  color-scheme: light;
  color: var(--wj-text);
  background-color: var(--wj-background);
  font-family: var(--wj-font-family);
  line-height: 1.6;
}
:where([data-wj-brand][data-wj-theme="dark"]) {
${theme('dark')}
  color-scheme: dark;
}
}
`;
const components = await readFile(path.join(root, 'src/components.css'), 'utf8');
await mkdir(path.join(root, 'dist'), {recursive: true});
for (const [file, content] of Object.entries({'brand.css': css, 'components.css': components})) {
  const target = path.join(root, 'dist', file);
  if (process.argv.includes('--check')) {
    if (await readFile(target, 'utf8') !== content) throw new Error(`${file} is stale; run npm run build`);
  } else await writeFile(target, content);
}
console.log(process.argv.includes('--check') ? 'Generated CSS is current.' : 'Built brand.css and components.css.');

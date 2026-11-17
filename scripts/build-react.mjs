import {readFile,writeFile,mkdir} from 'node:fs/promises';
const read=name=>readFile(new URL(`../${name}`,import.meta.url),'utf8');
const tokens=JSON.parse(await read('tokens/system.json'));
const declarations=[];
for(const group of ['space','radius','size'])for(const [name,value] of Object.entries(tokens[group]))declarations.push(`  --wj-ui-${group}-${name}: ${value/16}rem;`);
for(const [name,spec] of Object.entries(tokens.typography))declarations.push(`  --wj-ui-type-${name}-size: ${spec.size/16}rem;\n  --wj-ui-type-${name}-line: ${spec.lineHeight/16}rem;`);
const css=`/* Generated from brand.json + system.json. UI dimensions are proposals. */\n${await read('dist/brand.css')}\n${await read('dist/components.css')}\n@layer wj.react;\n:root {\n${declarations.join('\n')}\n}\n${await read('src/react/styles.css')}`;
await mkdir(new URL('../dist/react/',import.meta.url),{recursive:true});
if(process.argv.includes('--check')){if(await read('dist/react/styles.css')!==css)throw new Error('React styles are stale; run npm run build');}
else await writeFile(new URL('../dist/react/styles.css',import.meta.url),css);
console.log(process.argv.includes('--check')?'React styles are current.':'Built self-contained React styles.');

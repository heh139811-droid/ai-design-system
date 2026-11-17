import {readFile,readdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
async function compare(directory='') {
  for(const entry of await readdir(new URL(`.artifact-tmp/react-check/${directory}`,root),{withFileTypes:true})) {
    const relative=directory+entry.name;
    if(entry.isDirectory()){await compare(relative+'/');continue;}
    const expected=await readFile(new URL(`.artifact-tmp/react-check/${relative}`,root),'utf8');
    const actual=await readFile(new URL(`dist/react/${relative}`,root),'utf8');
    if(actual!==expected)throw new Error(`dist/react/${relative} is stale; run npm run build`);
  }
}
await compare();
console.log('React ESM and declarations are current.');

import {build} from 'esbuild';
import {mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
await mkdir(new URL('dist/react-demo/',root),{recursive:true});
await build({entryPoints:[fileURLToPath(new URL('examples/react/App.tsx',root))],outfile:fileURLToPath(new URL('dist/react-demo/app.js',root)),bundle:true,format:'iife',platform:'browser',target:['es2020'],jsx:'automatic',minify:true,define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof'});
await copyFile(new URL('examples/react/index.html',root),new URL('dist/react-demo/index.html',root));
await copyFile(new URL('dist/react/styles.css',root),new URL('dist/react-demo/styles.css',root));
console.log('Built offline React component demo.');

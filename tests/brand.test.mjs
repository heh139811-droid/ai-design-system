import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const tokens = JSON.parse(await readFile(path.join(root, 'tokens/brand.json'), 'utf8'));
const luminance = hex => hex.slice(1).match(/../g).map(x => parseInt(x,16)/255).map(x => x <= .04045 ? x/12.92 : ((x+.055)/1.055)**2.4).reduce((sum,x,i) => sum+x*[.2126,.7152,.0722][i],0);
const contrast = (a,b) => { const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
test('source palette stays at six approved colors; composition is 100%', () => {
  assert.deepEqual(Object.values(tokens.colors).sort(), ['#F2FFF4','#ABFF48','#6EE78D','#00866F','#F7FBF7','#17332D'].sort());
  assert.equal(Object.values(tokens.recommendedComposition).reduce((a,b)=>a+b,0),100);
});
test('both themes meet normal-text and focus contrast with approved roles', () => {
  for(const [name,roles] of Object.entries(tokens.themes)) {
    const c = role => tokens.colors[roles[role]];
    for(const background of ['background','surface']) {
      for(const foreground of ['text','heading','link']) assert.ok(contrast(c(foreground),c(background)) >= 4.5, `${name} ${foreground}/${background}`);
      assert.ok(contrast(c('focus'),c(background)) >= 3, `${name} focus`);
      assert.ok(contrast(c('border'),c(background)) >= 3, `${name} control border`);
    }
    assert.ok(contrast(c('on-accent'),c('accent')) >= 4.5, `${name} CTA`);
  }
  assert.ok(contrast(tokens.colors['deep-green'],tokens.colors['soft-white']) < 4.5);
  assert.ok(contrast(tokens.colors['deep-green'],tokens.colors['soft-mint']) >= 3);
});
test('committed generated styles match source', () => {
  const r=spawnSync(process.execPath,['scripts/build.mjs','--check'],{cwd:root,encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);
});
test('consumer installer copies usable files and refuses existing paths', async () => {
  const temp = await mkdtemp(path.join(tmpdir(),'wj-brand-'));
  try {
    const out=path.join(temp,'brand');
    const run=()=>spawnSync(process.execPath,[path.join(root,'scripts/apply.mjs'),'init','--out',out],{encoding:'utf8'});
    assert.equal(run().status,0);
    assert.match(await readFile(path.join(out,'brand.css'),'utf8'),/--wj-color-key: #ABFF48/);
    assert.match(await readFile(path.join(out,'APPLY.md'),'utf8'),/data-wj-brand/);
    await writeFile(path.join(out,'keep.txt'),'consumer content');
    assert.notEqual(run().status,0);
    assert.equal(await readFile(path.join(out,'keep.txt'),'utf8'),'consumer content');
  } finally { await rm(temp,{recursive:true,force:true}); }
});

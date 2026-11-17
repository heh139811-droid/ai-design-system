import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {createPrompt,makeIssueUrl,zipFiles,REPOSITORY} from '../src/hub-core.mjs';
test('handoff reflects project, medium, stage and theme without claiming auto-sync',()=>{
  const text=createPrompt({project:'회사 소개',kind:'figma',stage:'new',theme:'dark'});
  assert.match(text,/회사 소개/);assert.match(text,/Figma 디자인/);assert.match(text,/새로 만드는/);assert.match(text,/어두운 테마/);assert.match(text,/자동 동기화 플러그인이 포함돼 있지 않습니다/);
  assert.match(createPrompt(),/기존 결과물/);assert.match(createPrompt({kind:'document'}),/직접 적용되지 않습니다/);
});
test('feedback link keeps content encoded and opens a GitHub draft',()=>{
  const url=new URL(makeIssueUrl('제안 & 색상','#ABFF48\n본문?x=1','0.1.0'));
  assert.equal(url.origin,new URL(REPOSITORY).origin);assert.equal(url.pathname,'/heh139811-droid/ai-design-system/issues/new');assert.equal(url.searchParams.get('title'),'[브랜드 제안] 제안 & 색상');assert.match(url.searchParams.get('body'),/#ABFF48\n본문\?x=1/);
});
test('ZIP stores valid CRC-32, UTF-8 filenames and central directory offsets',()=>{
  const bytes=zipFiles({'테스트.txt':'123456789'}),view=new DataView(bytes.buffer);
  const nameLength=view.getUint16(26,true),end=bytes.length-22;
  assert.equal(view.getUint32(0,true),0x04034b50);assert.equal(view.getUint32(14,true),0xcbf43926);assert.equal(view.getUint16(6,true),0x800);
  assert.equal(new TextDecoder().decode(bytes.slice(30,30+nameLength)),'테스트.txt');
  assert.equal(new TextDecoder().decode(bytes.slice(30+nameLength,30+nameLength+9)),'123456789');
  const central=view.getUint32(end+16,true);assert.equal(view.getUint32(central,true),0x02014b50);assert.equal(view.getUint32(central+42,true),0);assert.equal(view.getUint16(end+10,true),1);
  assert.throws(()=>zipFiles({'../secret':'x'}),/Unsafe/);
});
test('offline hub embeds current tokens and source, with valid JS and matching hosted output',async()=>{
  const root=new URL('../',import.meta.url);
  const html=await readFile(new URL('START.html',root),'utf8');
  assert.equal(html,await readFile(new URL('dist/hub/index.html',root),'utf8'));
  const match=html.match(/<script id="brand-data" type="application\/json">([\s\S]*?)<\/script>/);
  assert.ok(match);const data=JSON.parse(match[1]);assert.deepEqual(data.tokens,JSON.parse(await readFile(new URL('tokens/brand.json',root),'utf8')));
  assert.match(data.files['APPLY.md'],/data-wj-brand/);
  const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,1);new vm.Script(scripts[0][1]);
  assert.doesNotMatch(html,/<(?:script|link)[^>]+(?:src|href)=["']https?:/i);
});

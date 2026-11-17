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

test('hub boots offline, downloads Figma ZIP and exposes connected library without sending a request',async()=>{
  const html=await readFile(new URL('../START.html',import.meta.url),'utf8');
  const embedded=JSON.parse(html.match(/<script id="brand-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for(const connected of [false,true]) {
    const elements=new Map();const links=[];const blobs=[];
    function element(){return {textContent:'',value:'',hidden:true,dataset:{},style:{},listeners:{},children:[],setAttribute(){},append(...nodes){this.children.push(...nodes);},addEventListener(name,fn){this.listeners[name]=fn;},focus(){},select(){},click(){links.push(this);},remove(){},reportValidity(){return true;}};}
    const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
    const data=structuredClone(embedded);data.config.figmaLibraryUrl=connected?'https://www.figma.com/design/example/Library':'';
    get('brand-data').textContent=JSON.stringify(data);
    const groups=new Map(['[data-version]','[data-repo]','[data-preview-theme]','[data-download]','[data-figma-download]'].map(s=>[s,[element()]]));
    const task=element();
    const doc={getElementById:get,querySelectorAll:s=>groups.get(s)||[],querySelector:s=>task,createElement:()=>element(),body:element()};
    class CapturedBlob {constructor(parts,options){blobs.push({parts,options});}}
    class LocalFormData {entries(){return Object.entries({project:'팀 웹',kind:'web',stage:'existing',theme:'light'});}}
    const url={createObjectURL:()=> 'blob:offline-kit',revokeObjectURL(){}};
    vm.runInNewContext(script,{document:doc,navigator:{},setTimeout(){},clearTimeout(){},FormData:LocalFormData,Blob:CapturedBlob,URL:url,TextEncoder,Uint8Array,DataView});
    assert.match(get('prompt').value,/팀 웹/);
    groups.get('[data-figma-download]')[0].listeners.click();
    assert.equal(links.at(-1).download,`wonjeongdae-figma-kit-v${data.version}.zip`);
    const bytes=blobs.at(-1).parts[0];assert.equal(new DataView(bytes.buffer).getUint32(0,true),0x04034b50);
    assert.match(new TextDecoder().decode(bytes),/manifest.json/);
    get('figmaSetupLink').listeners.click();assert.equal(get('figmaSetup').open,true);
    await get('copyFigmaGuide').listeners.click();assert.equal(get('manualCopyPanel').hidden,false);assert.match(get('manualCopy').value,/처음 등록한다면/);
    if(connected){assert.equal(get('figmaLibraryLink').hidden,false);assert.equal(task.href,data.config.figmaLibraryUrl);}
    else assert.equal(get('figmaLibraryLink').hidden,true);
  }
});

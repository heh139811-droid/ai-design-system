import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const code=await readFile(new URL('../dist/figma/code.js',import.meta.url),'utf8');
const tokens=JSON.parse(await readFile(new URL('../tokens/brand.json',import.meta.url),'utf8'));

// Models graph/alias/instance behavior; does not simulate Figma rendering or API acceptance.
function host({limited=false,fail=false,noFonts=false}={}) {
  let id=0;const nodes=[],collections=[],variables=[];const pluginData=new Map();let finished;
  let done=new Promise(resolve=>{finished=resolve;});
  function node(type) {
    const n={id:String(++id),type,children:[],width:100,height:100,removed:false,
      appendChild(child){if(child.parent)child.parent.children=child.parent.children.filter(x=>x!==child);this.children.push(child);child.parent=this;},
      resize(w,h){assert.ok(w>0&&h>0);this.width=w;this.height=h;},
      setExplicitVariableMode(c,m){assert.ok(c.modes.some(x=>x.modeId===m));this.theme={collection:c.id,mode:m};},
      addComponentProperty(name,type,value){return `${name}#${id}`;},
      createInstance(){const copy=node('INSTANCE');copy.mainComponent=this;copy.width=this.width;copy.height=this.height;return copy;},
      remove(){this.removed=true;if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);}
    };nodes.push(n);return n;
  }
  const figma={root:{getPluginData:k=>pluginData.get(k)||'',setPluginData:(k,v)=>pluginData.set(k,v)},
    currentPage:node('PAGE'),
    listAvailableFontsAsync:async()=>noFonts?[]:[{fontName:{family:'Noto Sans KR',style:'Regular'}}],loadFontAsync:async()=>{},
    getNodeByIdAsync:async id=>nodes.find(x=>x.id===id&&!x.removed),
    setCurrentPageAsync:async p=>{figma.currentPage=p;},
    createPage:()=>node('PAGE'),createText:()=>node('TEXT'),createFrame:()=>node('FRAME'),
    createComponent:()=>{if(fail)throw new Error('Injected failure');return node('COMPONENT');},
    combineAsVariants:(items,parent)=>{const set=node('COMPONENT_SET');parent.appendChild(set);items.forEach(n=>set.appendChild(n));return set;},
    viewport:{scrollAndZoomIntoView(){}},closePlugin:message=>finished(message),
    variables:{
      createVariableCollection(name){const c={id:String(++id),name,defaultModeId:'light',modes:[{modeId:'light',name:'Mode 1'}],removed:false,
        renameMode(id,name){this.modes.find(m=>m.modeId===id).name=name;},
        addMode(name){if(limited)throw new Error('Plan limit');this.modes.push({modeId:'dark',name});return 'dark';},remove(){this.removed=true;}};collections.push(c);return c;},
      createVariable(name,c,type){const v={id:String(++id),name,collection:c.id,type,values:{},removed:false,setValueForMode(mode,value){assert.ok(c.modes.some(m=>m.modeId===mode));this.values[mode]=value;},remove(){this.removed=true;}};variables.push(v);return v;},
      createVariableAlias:v=>({type:'VARIABLE_ALIAS',id:v.id}),
      setBoundVariableForPaint:(p,field,v)=>({...p,boundVariables:{[field]:{type:'VARIABLE_ALIAS',id:v.id}}})
    }
  };
  return {figma,nodes,collections,variables,pluginData,async run(){done=new Promise(resolve=>{finished=resolve;});vm.runInNewContext(code,{figma});return done;}};
}

test('Figma generator builds aliases, editable variants and six templates; rerun preserves edits',async()=>{
  const h=host();assert.match(await h.run(),/생성 완료/);
  const palette=h.variables.filter(v=>v.name.startsWith('color/'));assert.equal(palette.length,6);
  for(const v of palette){const hex=tokens.colors[v.name.slice(6)];assert.equal(v.values.light.r,parseInt(hex.slice(1,3),16)/255);}
  for(const [theme,roles] of Object.entries(tokens.themes))for(const [name,color] of Object.entries(roles)){
    const v=h.variables.find(v=>v.name===name);assert.equal(v.values[theme].id,palette.find(v=>v.name===`color/${color}`).id);
  }
  const sets=h.nodes.filter(n=>n.type==='COMPONENT_SET');assert.equal(sets.length,5);
  assert.equal(sets.find(n=>n.name==='WJ / Button').children.length,8);
  assert.ok(h.nodes.some(n=>n.type==='TEXT'&&n.componentPropertyReferences?.characters));
  const templates=h.figma.currentPage;assert.equal(templates.children.length,6);
  assert.ok(templates.children.every(n=>n.layoutMode==='VERTICAL'));
  assert.ok(h.nodes.some(n=>n.type==='INSTANCE'&&n.mainComponent.type==='COMPONENT'));
  templates.name='User edited name';const count=h.nodes.length;
  assert.match(await h.run(),/既存|기존 라이브러리/);assert.equal(h.nodes.length,count);assert.equal(templates.name,'User edited name');
});

test('single-mode plans receive separate light and dark collections with correct aliases',async()=>{
  const h=host({limited:true});assert.match(await h.run(),/생성 완료/);assert.equal(h.collections.length,3);
  const dark=h.collections.find(c=>c.name.endsWith('/ Dark'));
  const background=h.variables.find(v=>v.collection===dark.id&&v.name==='background');
  assert.equal(background.values.light.id,h.variables.find(v=>v.name==='color/charcoal').id);
});

test('generator failure rolls back only new objects and leaves original page',async()=>{
  const h=host({fail:true});const original=h.figma.currentPage;
  assert.match(await h.run(),/Injected failure/);assert.equal(h.figma.currentPage,original);assert.equal(original.removed,false);
  assert.ok(h.nodes.filter(n=>n.type==='PAGE'&&n!==original).every(n=>n.removed));
  assert.ok(h.variables.every(v=>v.removed));assert.ok(h.collections.every(c=>c.removed));assert.equal(h.pluginData.size,0);
});

test('missing font stops before library mutation',async()=>{
  const h=host({noFonts:true});assert.match(await h.run(),/글꼴이 필요/);assert.equal(h.collections.length,0);assert.equal(h.nodes.length,1);
});

test('offline hub distributes the exact generated Figma kit and unconnected status',async()=>{
  const html=await readFile(new URL('../START.html',import.meta.url),'utf8');
  const data=JSON.parse(html.match(/<script id="brand-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data.figmaFiles['code.js'],code);
  const manifest=JSON.parse(data.figmaFiles['manifest.json']);assert.deepEqual(manifest.networkAccess.allowedDomains,['none']);
  assert.equal(manifest.documentAccess,'dynamic-page');assert.equal(manifest.main,'code.js');
  assert.deepEqual(JSON.parse(data.figmaFiles['tokens.json']),tokens);
  assert.match(html,/공유 라이브러리 연결 전/);assert.match(html,/발표 템플릿 준비 중/);
});

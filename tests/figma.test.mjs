import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const code=await readFile(new URL('../dist/figma/code.js',import.meta.url),'utf8');
const tokens=JSON.parse(await readFile(new URL('../tokens/brand.json',import.meta.url),'utf8'));
const system=JSON.parse(await readFile(new URL('../tokens/system.json',import.meta.url),'utf8'));

// Models graph/alias/instance behavior; does not simulate Figma rendering or API acceptance.
function host({limited=false,fail=false,noFonts=false,failTheme=false}={}) {
  let id=0;const nodes=[],collections=[],variables=[],styles=[];const pluginData=new Map();let finished;
  let done=new Promise(resolve=>{finished=resolve;});
  function node(type) {
    const n={id:String(++id),type,children:[],width:100,height:100,removed:false,
      appendChild(child){if(child.parent)child.parent.children=child.parent.children.filter(x=>x!==child);this.children.push(child);child.parent=this;},
      resize(w,h){assert.ok(w>0&&h>0);this.width=w;this.height=h;},
      setExplicitVariableModeForCollection(c,m){if(failTheme)throw new Error('Injected theme failure');assert.ok(c.modes.some(x=>x.modeId===m));this.theme={collection:c.id,mode:m};},
      setBoundVariable(field,v){assert.ok(v);this.boundVariables={...this.boundVariables,[field]:{type:'VARIABLE_ALIAS',id:v.id}};},
      async setTextStyleIdAsync(id){assert.ok(styles.some(s=>s.id===id));this.textStyleId=id;},
      async setReactionsAsync(reactions){this.reactions=reactions;},
      addComponentProperty(name,type,value){assert.ok(!this.componentPropertyDefinitions?.[name]);this.componentPropertyDefinitions={...this.componentPropertyDefinitions,[name]:{type,defaultValue:value}};return `${name}#${this.id}`;},
      createInstance(){const copy=node('INSTANCE');copy.mainComponent=this;copy.width=this.width;copy.height=this.height;return copy;},
      remove(){this.removed=true;if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);}
    };nodes.push(n);return n;
  }
  const figma={root:{
    getPluginData(){throw new Error('Cannot get private plugin data in a plugin without an ID');},
    setPluginData(){throw new Error('Cannot set private plugin data in a plugin without an ID');},
    getSharedPluginData:(ns,k)=>pluginData.get(`${ns}/${k}`)||'',
    setSharedPluginData:(ns,k,v)=>pluginData.set(`${ns}/${k}`,v)
  },
    currentPage:node('PAGE'),
    listAvailableFontsAsync:async()=>noFonts?[]:[{fontName:{family:'Noto Sans KR',style:'Regular'}}],loadFontAsync:async()=>{},
    getNodeByIdAsync:async id=>nodes.find(x=>x.id===id&&!x.removed),
    setCurrentPageAsync:async p=>{figma.currentPage=p;},
    createPage:()=>node('PAGE'),createText:()=>node('TEXT'),createFrame:()=>node('FRAME'),
    createTextStyle:()=>{const s=node('TEXT_STYLE');styles.push(s);return s;},
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
  return {figma,nodes,collections,variables,styles,pluginData,async run(){done=new Promise(resolve=>{finished=resolve;});vm.runInNewContext(code,{figma,console:{error(){}}});return done;}};
}

test('Figma system builds aliases, twelve component sets and eight patterns; rerun preserves edits',async()=>{
  const h=host();assert.match(await h.run(),/생성 완료/);
  const palette=h.variables.filter(v=>v.name.startsWith('color/'));assert.equal(palette.length,6);
  for(const v of palette){const hex=tokens.colors[v.name.slice(6)];assert.equal(v.values.light.r,parseInt(hex.slice(1,3),16)/255);}
  for(const [theme,roles] of Object.entries(tokens.themes))for(const [name,color] of Object.entries(roles)){
    const v=h.variables.find(v=>v.name===name);assert.equal(v.values[theme].id,palette.find(v=>v.name===`color/${color}`).id);
  }
  const sets=h.nodes.filter(n=>n.type==='COMPONENT_SET');assert.equal(sets.length,12);
  assert.equal(sets.find(n=>n.name==='WJ / Button').children.length,72);
  assert.ok(h.nodes.some(n=>n.type==='TEXT'&&n.componentPropertyReferences?.characters));
  const templates=h.nodes.find(n=>n.type==='PAGE'&&n.name?.endsWith('03 Patterns'));assert.equal(templates.children.length,8);
  assert.ok(templates.children.every(n=>n.layoutMode==='VERTICAL'));
  assert.ok(h.nodes.some(n=>n.type==='INSTANCE'&&n.mainComponent.type==='COMPONENT'));
  const inventory=JSON.parse([...h.pluginData.entries()].find(([key])=>key.endsWith('-inventory'))[1]);
  assert.equal(inventory.components,12);assert.equal(inventory.variants,146);assert.equal(inventory.patterns,8);assert.equal(inventory.styles,9);
  const start=h.figma.currentPage;start.name='User edited name';const count=h.nodes.length;
  assert.match(await h.run(),/기존 라이브러리/);assert.equal(h.nodes.length,count);assert.equal(start.name,'User edited name');
});

test('single-mode plans receive separate light and dark collections with correct aliases',async()=>{
  const h=host({limited:true});assert.match(await h.run(),/생성 완료/);assert.equal(h.collections.length,6);
  const dark=h.collections.find(c=>c.name.endsWith('Semantic Dark'));
  const background=h.variables.find(v=>v.collection===dark.id&&v.name==='background');
  assert.equal(background.values.light.id,h.variables.find(v=>v.name==='color/charcoal').id);
});

test('generator failure rolls back only new objects and leaves original page',async()=>{
  const h=host({fail:true});const original=h.figma.currentPage;
  assert.match(await h.run(),/Injected failure/);assert.equal(h.figma.currentPage,original);assert.equal(original.removed,false);
  assert.ok(h.nodes.filter(n=>n.type==='PAGE'&&n!==original).every(n=>n.removed));
  assert.ok(h.variables.every(v=>v.removed));assert.ok(h.collections.every(c=>c.removed));assert.equal(h.pluginData.size,0);
  assert.ok(h.styles.every(s=>s.removed));
});

test('missing font stops before library mutation',async()=>{
  const h=host({noFonts:true});assert.match(await h.run(),/글꼴이 필요/);assert.equal(h.collections.length,0);assert.equal(h.nodes.length,1);
});

test('theme API failure removes unattached frame created on the original page',async()=>{
  const h=host({failTheme:true});const original=h.figma.currentPage;
  assert.match(await h.run(),/Injected theme failure/);assert.equal(h.figma.currentPage,original);
  assert.ok(h.nodes.filter(n=>n!==original).every(n=>n.removed));
  assert.ok(h.variables.every(v=>v.removed));assert.ok(h.collections.every(c=>c.removed));
});

test('system binds dimensions and typography, documents every component, and wires interactive variants',async()=>{
  const h=host();assert.match(await h.run(),/생성 완료/);
  assert.equal(h.styles.length,Object.keys(system.typography).length);
  assert.ok(h.styles.every(s=>s.boundVariables.fontSize&&s.boundVariables.lineHeight&&s.boundVariables.fontFamily));
  assert.ok(h.nodes.filter(n=>n.type==='TEXT').every(n=>n.textStyleId));
  const button=h.nodes.find(n=>n.type==='COMPONENT'&&n.name==='Theme=Light, State=Default, Hierarchy=Primary, Size=MD');
  const heightVar=h.variables.find(v=>v.id===button.boundVariables.height.id);
  assert.equal(heightVar.name,'component/button/height/md');
  assert.equal(heightVar.values.light.id,h.variables.find(v=>v.name==='size/control-md').id);
  assert.ok(button.boundVariables.paddingLeft);assert.ok(button.boundVariables.cornerRadius);
  const buttonSet=h.nodes.find(n=>n.type==='COMPONENT_SET'&&n.name==='WJ / Button');
  assert.equal(Object.keys(buttonSet.componentPropertyDefinitions).length,2);
  const labelRefs=buttonSet.children.map(c=>c.children.find(n=>n.characters==='시작하기').componentPropertyReferences.characters);
  assert.equal(new Set(labelRefs).size,1);
  assert.equal(button.reactions[0].actions[0].navigation,'CHANGE_TO');
  for(const [name,spec] of Object.entries(system.components)){
    const doc=h.nodes.find(n=>n.name===`${name} / Usage & contract`);assert.ok(doc);
    assert.ok(doc.children.some(n=>n.characters===spec.accessibility));
    assert.ok(doc.children.some(n=>n.characters===spec.responsive));
  }
  const toggle=h.nodes.find(n=>n.type==='COMPONENT'&&n.name==='Theme=Light, State=Default, Value=Off'&&n.parent.name==='WJ / Checkbox');
  assert.equal(toggle.reactions.length,1);
  const disabled=h.nodes.filter(n=>n.type==='COMPONENT'&&n.name.includes('State=Disabled'));
  assert.ok(disabled.every(n=>!n.reactions?.length));
  const patterns=h.nodes.find(n=>n.type==='PAGE'&&n.name?.endsWith('03 Patterns'));
  assert.ok(patterns.children.some(n=>n.name==='tablet / light / 768'));
  assert.ok(patterns.children.filter(n=>n.name.includes('/ 360')).every(n=>n.layoutGrids[0].count===4));
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

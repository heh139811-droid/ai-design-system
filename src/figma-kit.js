/* Runs in Figma Design. KIT is generated from brand.json and system.json. */
async function generateLibrary() {
  const S=KIT.system, prefix=`WJ ${KIT.version} / DS${S.revision}`;
  const namespace='wonjeongdae_library',key=`wj-system-${KIT.version}-r${S.revision}`;
  const previous=figma.root.getSharedPluginData(namespace,key);
  if(previous) {
    const page=await figma.getNodeByIdAsync(previous);
    if(!page || page.type!=='PAGE')throw new Error('생성된 시작 페이지가 삭제되었습니다. 새 파일에서 생성해 주세요.');
    await figma.setCurrentPageAsync(page);figma.viewport.scrollAndZoomIntoView(page.children.slice(0,1));
    figma.closePlugin('기존 라이브러리를 열었습니다. 사용자 수정은 유지됩니다.');return;
  }
  const available=await figma.listAvailableFontsAsync();
  const family=['Noto Sans KR','Malgun Gothic','Inter'].find(f=>available.some(x=>x.fontName.family===f&&x.fontName.style==='Regular'));
  if(!family)throw new Error('Noto Sans KR, Malgun Gothic 또는 Inter Regular 글꼴이 필요합니다.');
  const regular={family,style:'Regular'};
  const bold=available.find(f=>f.fontName.family===family&&['Bold','SemiBold','Semibold'].includes(f.fontName.style))?.fontName||regular;
  await figma.loadFontAsync(regular);if(bold.style!==regular.style)await figma.loadFontAsync(bold);
  /** @type {PageNode[]} */ const pages=[];
  /** @type {SceneNode[]} */ const nodes=[];
  /** @type {VariableCollection[]} */ const collections=[];
  /** @type {Variable[]} */ const variables=[];
  /** @type {TextStyle[]} */ const styles=[];
  /** @type {{node:TextNode,style:TextStyle}[]} */ const styleQueue=[];
  /** @type {Record<string,Variable>} */ const metric={};
  /** @type {Record<string,TextStyle>} */ const typography={};
  /** @type {Record<string,ComponentNode[]>} */ const sets={};
  /** @type {{component:ComponentNode,node:SceneNode,name:string,type:'TEXT'|'BOOLEAN',value:string|boolean}[]} */const propertyBindings=[];
  const originalPage=figma.currentPage;
  let phase='Variables';
  /** @template {SceneNode} T @param {T} node @returns {T} */
  const own=node=>{nodes.push(node);return node;};
  const collection=name=>{const c=figma.variables.createVariableCollection(`${prefix} / ${name}`);collections.push(c);return c;};
  /** @param {string} name @param {VariableCollection} c @param {VariableResolvedDataType} type */
  const variable=(name,c,type)=>{const v=figma.variables.createVariable(name,c,type);variables.push(v);return v;};
  const page=name=>{const p=figma.createPage();p.name=`${prefix} / ${name}`;pages.push(p);return p;};
  const rgb=hex=>({r:parseInt(hex.slice(1,3),16)/255,g:parseInt(hex.slice(3,5),16)/255,b:parseInt(hex.slice(5,7),16)/255});
  try {
    const brand=collection('01 Brand');
    /** @type {Record<string,Variable>} */const primitives={};
    for(const [name,hex] of Object.entries(KIT.tokens.colors)) {
      const v=variable(`color/${name}`,brand,'COLOR');v.setValueForMode(brand.defaultModeId,rgb(hex));
      v.description='사용자 브랜드 이미지 명시값 · 변경은 브랜드 담당자 검토';primitives[name]=v;
    }
    const themeCollection=collection('02 Semantic');themeCollection.renameMode(themeCollection.defaultModeId,'Light');
    let darkMode='',separate=false;
    try{darkMode=themeCollection.addMode('Dark');}catch{separate=true;}
    const darkCollection=separate?collection('02 Semantic Dark'):themeCollection;
    if(separate){darkMode=darkCollection.defaultModeId;darkCollection.renameMode(darkMode,'Dark');}
    /** @type {Record<string,Record<string,Variable>>} */const roles={light:{},dark:{}};
    for(const role of Object.keys(KIT.tokens.themes.light)) {
      const l=variable(role,themeCollection,'COLOR'),d=separate?variable(role,darkCollection,'COLOR'):l;
      l.setValueForMode(themeCollection.defaultModeId,figma.variables.createVariableAlias(primitives[KIT.tokens.themes.light[role]]));
      d.setValueForMode(darkMode,figma.variables.createVariableAlias(primitives[KIT.tokens.themes.dark[role]]));
      l.description=`의미 역할: ${role}. Brand Variables의 별칭. 색상 직접 지정 대신 사용.`;
      roles.light[role]=l;roles.dark[role]=d;
    }
    const dimensions=collection('03 Dimensions · Proposal');
    for(const [group,values] of Object.entries({space:S.space,radius:S.radius,size:S.size}))for(const [name,value] of Object.entries(values)) {
      const v=variable(`${group}/${name}`,dimensions,'FLOAT');v.setValueForMode(dimensions.defaultModeId,value);
      v.description='구현 제안 · px. 브랜드 이미지에 명시된 수치 아님.';metric[`${group}/${name}`]=v;
    }
    const componentTokens=collection('04 Component aliases · Proposal');
    for(const [name,target] of Object.entries({'button/height/sm':'size/control-sm','button/height/md':'size/control-md','button/radius':'radius/control','field/radius':'radius/control','selection/size':'size/selection'})) {
      const v=variable(`component/${name}`,componentTokens,'FLOAT');v.setValueForMode(componentTokens.defaultModeId,figma.variables.createVariableAlias(metric[target]));
      v.description=`컴포넌트 계약 → ${target} · 구현 제안`;metric[`component/${name}`]=v;
    }
    const typeCollection=collection('05 Typography · Proposal');
    const familyVar=variable('font/family',typeCollection,'STRING');familyVar.setValueForMode(typeCollection.defaultModeId,family);
    for(const [name,spec] of Object.entries(S.typography)) {
      const size=variable(`type/${name}/size`,typeCollection,'FLOAT');size.setValueForMode(typeCollection.defaultModeId,spec.size);
      const line=variable(`type/${name}/line-height`,typeCollection,'FLOAT');line.setValueForMode(typeCollection.defaultModeId,spec.lineHeight);
      const style=figma.createTextStyle();styles.push(style);style.name=`WJ / ${name}`;
      style.fontName=spec.weight==='Bold'?bold:regular;style.fontSize=spec.size;style.lineHeight={unit:'PIXELS',value:spec.lineHeight};
      style.description='구현 제안 · 정식 브랜드 서체 아님. Typography Variables에 연결됨.';
      style.setBoundVariable('fontFamily',familyVar);style.setBoundVariable('fontSize',size);style.setBoundVariable('lineHeight',line);
      typography[name]=style;
    }
    /** @param {FrameNode | ComponentNode | InstanceNode} n @param {string} theme */
    const setTheme=(n,theme)=>n.setExplicitVariableModeForCollection(theme==='dark'?darkCollection:themeCollection,theme==='dark'?darkMode:themeCollection.defaultModeId);
    const paint=(theme,role)=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:rgb(KIT.tokens.colors[KIT.tokens.themes[theme][role]])},'color',roles[theme][role]);
    /** @param {GeometryMixin} n */
    function fill(n,theme,role){n.fills=[paint(theme,role)];}
    /** @param {FrameNode | ComponentNode | InstanceNode} n */
    function border(n,theme,focus=false){n.strokes=[paint(theme,focus?'focus':'border')];n.strokeWeight=focus?S.size.focus:S.size.stroke;n.setBoundVariable('strokeWeight',metric[focus?'size/focus':'size/stroke']);}
    /** @param {FrameNode | ComponentNode} n @param {VariableBindableNodeField} field @param {string} token */
    const bind=(n,field,token)=>n.setBoundVariable(field,metric[token]);
    /** @template {FrameNode | ComponentNode} T @param {T} n @param {string} name @param {string} theme @param {number} width @param {string} padding @param {'VERTICAL'|'HORIZONTAL'} direction @returns {T} */
    function layout(n,name,theme,width,padding='6',direction='VERTICAL') {
      n.name=name;n.layoutMode=direction;n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';n.resize(width,100);
      n.itemSpacing=S.space['4'];bind(n,'itemSpacing','space/4');
      for(const field of ['paddingLeft','paddingRight','paddingTop','paddingBottom']){n[field]=S.space[padding];bind(n,/** @type {VariableBindableNodeField} */(field),`space/${padding}`);}
      n.cornerRadius=S.radius.card;bind(n,'cornerRadius','radius/card');n.clipsContent=false;fill(n,theme,'surface');setTheme(n,theme);return n;
    }
    /** @param {ChildrenMixin} parent */
    const frame=(parent,name,theme,width,padding='6')=>{const n=layout(own(figma.createFrame()),name,theme,width,padding,'VERTICAL');parent.appendChild(n);return n;};
    /** @param {ChildrenMixin} parent */
    function text(parent,value,theme='light',styleName='body-md',role='text',width=0) {
      const n=own(figma.createText());n.name=value.slice(0,70);const spec=S.typography[styleName];
      n.fontName=spec.weight==='Bold'?bold:regular;n.fontSize=spec.size;n.lineHeight={unit:'PIXELS',value:spec.lineHeight};n.characters=value;fill(n,theme,role);
      if(width){n.resize(width,n.height);n.textAutoResize='HEIGHT';}else n.textAutoResize='WIDTH_AND_HEIGHT';
      parent.appendChild(n);styleQueue.push({node:n,style:typography[styleName]});return n;
    }
    /** @param {ComponentNode} c @param {TextNode} n */
    function editable(c,n,name){propertyBindings.push({component:c,node:n,name,type:'TEXT',value:n.characters});}
    /** @param {ComponentNode} c @param {SceneNode} n */
    function optional(c,n,name,initial=true){propertyBindings.push({component:c,node:n,name,type:'BOOLEAN',value:initial});n.visible=initial;}
    /** @param {ChildrenMixin} parent @param {string} kind @param {string} theme @param {Record<string,string>} props */
    function instance(parent,kind,theme,props={}) {
      const wanted={Theme:theme==='light'?'Light':'Dark',...props};
      const c=sets[kind].find(n=>Object.entries(wanted).every(([k,v])=>n.name.split(', ').includes(`${k}=${v}`)));
      if(!c)throw new Error(`컴포넌트 조합 없음: ${kind} ${JSON.stringify(wanted)}`);
      const n=own(c.createInstance());parent.appendChild(n);return n;
    }
    const flatten=props=>Object.entries(props).map(([k,v])=>`${k}=${v}`).join(', ');
    /** @param {Record<string,string>} props */
    const component=(parent,props,theme,width)=>{const n=layout(own(figma.createComponent()),flatten(props),theme,width,'4','VERTICAL');parent.appendChild(n);return n;};
    phase='Foundations';
    const foundations=page('01 Foundations');
    function board(title,subtitle,x,y=0,width=1040){const n=frame(foundations,title,'light',width,'10');n.x=x;n.y=y;fill(n,'light','background');text(n,title,'light','heading-lg');text(n,subtitle,'light','body-md','text',width-80);return n;}
    const start=board('원정대 / Design System',`v${KIT.version} · 구조 개정 ${S.revision} · 검토 전 라이브러리`,0);
    text(start,'01 Foundations → 02 Components → 03 Patterns','light','heading-sm');
    text(start,'색 → 의미 역할 → 컴포넌트 → 패턴. 원본 토큰을 변경하면 연결된 Variables와 인스턴스에 반영되는 구조입니다.','light','body-lg','text',960);
    text(start,'팀원: Assets에서 WJ 컴포넌트를 선택하고 Variant·텍스트·표시 옵션을 바꾸세요. Patterns 화면은 복제해서 시작합니다. Detach instance는 피하세요.','light','body-md','text',960);
    text(start,`서체: ${family} / ${bold.style}. 브랜드 지정 서체가 아닌 사용 가능한 대체 서체입니다. 로고·사진 원본은 포함하지 않습니다.`,'light','body-sm','text',960);
    text(start,'확정: 이미지에 적힌 6색·권장 구성. 제안: Semantic 역할, 글꼴·간격·모서리·상태·레이아웃·컴포넌트. 전사 승인 전에는 초안으로 취급합니다.','light','body-md','text',960);
    text(start,separate?'모드 제한 대응: Light/Dark 컬렉션 분리. Theme 변형으로 사용합니다.':'Semantic 컬렉션: Light/Dark 모드. 컴포넌트의 Theme 변형으로 선택합니다.','light','body-sm','text',960);
    const colors=board('Color / Primitive → Semantic','직접 HEX를 넣기보다 역할별 Variables를 사용합니다. 새로운 유사 녹색을 추가하지 않습니다.',1160);
    for(const [name,hex] of Object.entries(KIT.tokens.colors)) {
      const swatch=frame(colors,`${name} · ${hex}`,'light',960,'4');swatch.fills=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:rgb(hex)},'color',primitives[name])];
      text(swatch,`${name} / ${hex}`,name==='deep-green'||name==='charcoal'?'dark':'light','heading-md');
    }
    text(colors,'soft-mint 40 / key 10 / medium-green 20 / deep-green 30은 시각물의 권장 구성입니다. 모든 화면의 픽셀 비율이 아닙니다.','light','body-sm','text',960);
    for(const theme of ['light','dark']) {
      const panel=frame(colors,`${theme} semantic aliases`,theme,960,'6');
      for(const [role,name] of Object.entries(KIT.tokens.themes[theme]))text(panel,`${role} → color/${name}`,theme,'body-sm');
    }
    const typeBoard=board('Typography / Connected Text Styles','Text Style의 크기·줄높이·서체는 Typography Variables에 연결되어 있습니다.',2320);
    for(const [name,spec] of Object.entries(S.typography)) {
      text(typeBoard,`${name} / ${spec.size} · ${spec.lineHeight}`,'light','caption');text(typeBoard,'사람과 브랜드가 만나는 더 큰 가능성','light',name,'text',960);
    }
    const dimensionsBoard=board('Spacing & Radius / Variables','4px 기반 간격과 모서리 수치는 구현 제안입니다. Auto Layout의 padding·gap과 반경에 바인딩됩니다.',3480);
    for(const [name,value] of Object.entries(S.space))text(dimensionsBoard,`space/${name} = ${value}px`,'light','body-md');
    for(const [name,value] of Object.entries(S.radius)) {
      const r=frame(dimensionsBoard,`radius/${name}`,'light',960,'4');r.cornerRadius=value;bind(r,'cornerRadius',`radius/${name}`);border(r,'light');text(r,`radius/${name} = ${value}px`);
    }
    const rules=board('Layout · Accessibility · Contribution','컴포넌트는 디자인 계약입니다. 실제 제품의 DOM·키보드·스크린리더 동작은 별도 구현·검증해야 합니다.',4640);
    for(const [name,l] of Object.entries(S.layout))text(rules,`${name}: ${l.width}px / ${l.columns} columns / margin ${l.margin} / gutter ${l.gutter}`,'light','body-md');
    for(const rule of [
      '반응형: 모바일 한 열, 태블릿 중간 폭, 데스크톱 다열. 내용에 따라 줄바꿈하며 360·768·1440px에서 확인합니다.',
      '대비: 일반 본문 4.5:1, 큰 글자 3:1 기준. 밝은 바탕의 작은 글자는 차콜. deep-green 작은 본문 금지.',
      '인터랙션: 클릭 영역 44px 이상을 제안합니다. Focus를 숨기지 않습니다. Disabled·오류는 문구와 형태로 구분합니다.',
      '상태: 새 의미색은 승인 전 추가하지 않습니다. 오류는 원인·해결 문구로 안내하고 aria-invalid 등을 구현합니다.',
      '작성: 라벨은 짧고 명확하게, 버튼은 동사형, 오류는 다음 행동을 제시합니다. Placeholder가 라벨을 대신하지 않습니다.',
      '변경: 제안 → 브랜드·제품 담당 검토 → 버전과 변경 기록 → Figma/코드 검사 → 담당자 게시. 담당자는 조직에서 지정해야 합니다.',
      '마이그레이션: 기존 v0.1 파일을 덮어쓰지 않습니다. 새로운 구조는 별도 페이지에 생성됩니다. 기존 화면은 담당자가 인스턴스와 토큰을 매핑합니다.',
      '검수: 텍스트 오버라이드, Boolean 표시, 크기·테마 전환, 긴 한글, 화면 축소, 토큰 변경 전파를 실제 Figma에서 확인합니다.'
    ])text(rules,rule,'light','body-md','text',960);
    phase='Components';
    const components=page('02 Components');let boardY=0;
    /** @param {string} kind @param {ComponentNode[]} variants */
    function register(kind,variants) {
      const spec=S.components[kind];
      const doc=frame(components,`${kind} / Usage & contract`,'light',1040,'10');doc.x=0;doc.y=boardY;
      text(doc,kind,'light','heading-lg');text(doc,spec.purpose,'light','body-lg','text',960);
      for(const [label,value] of Object.entries({Anatomy:spec.anatomy,Usage:spec.rules,Accessibility:spec.accessibility,Responsive:spec.responsive,'Code mapping':spec.code})) {
        text(doc,label,'light','label');text(doc,value,'light','body-sm','text',960);
      }
      text(doc,'상태·크기·Theme는 오른쪽 Variant 매트릭스에서 선택합니다. 편집 가능한 문구와 표시 옵션은 인스턴스 속성에 있습니다.','light','caption','text',960);
      const set=own(figma.combineAsVariants(variants,components));set.name=`WJ / ${kind}`;set.description=`${spec.purpose}\n${spec.rules}\n접근성: ${spec.accessibility}\n구현 제안 · v${KIT.version}`;
      const propertyIds={};
      for(const binding of propertyBindings.filter(b=>variants.includes(b.component))) {
        const id=propertyIds[binding.name]||(propertyIds[binding.name]=set.addComponentProperty(binding.name,binding.type,binding.value));
        binding.node.componentPropertyReferences={...binding.node.componentPropertyReferences,[binding.type==='TEXT'?'characters':'visible']:id};
      }
      set.x=1160;set.y=boardY;let y=40;
      for(let i=0;i<variants.length;i+=4){const row=variants.slice(i,i+4);let x=40;for(const n of row){n.x=x;n.y=y;x+=n.width+40;}y+=Math.max(...row.map(n=>n.height))+64;}
      set.resize(Math.max(...variants.map(n=>n.x+n.width))+40,y);boardY+=Math.max(doc.height,set.height)+160;sets[kind]=variants;
    }
    for(const kind of Object.keys(S.components)) {
      /** @type {ComponentNode[]} */const variants=[];
      for(const theme of ['light','dark']) {
        const themeName=theme==='light'?'Light':'Dark';
        const states=['Button'].includes(kind)?['Default','Hover','Pressed','Focus','Disabled','Loading']:['Input','Textarea','Select'].includes(kind)?['Default','Focus','Error','Disabled']:['Checkbox','Radio','Switch'].includes(kind)?['Default','Focus','Disabled']:['Tabs'].includes(kind)?['First','Second']:['Default'];
        const hierarchies=kind==='Button'?['Primary','Secondary','Ghost']:[''];
        const sizes=kind==='Button'?['SM','MD']:[''];
        const values=['Checkbox','Radio','Switch'].includes(kind)?['Off','On']:[''];
        const formats=kind==='Navigation'?['Wide','Compact']:[''];
        for(const hierarchy of hierarchies)for(const size of sizes)for(const value of values)for(const format of formats)for(const state of states) {
          const props={Theme:themeName,State:state};if(hierarchy)props['Hierarchy']=hierarchy;if(size)props['Size']=size;if(value)props['Value']=value;if(format)props['Layout']=format;
          const width=kind==='Button'?180:kind==='Modal'?480:kind==='Navigation'&&format==='Wide'?640:320;
          const c=component(components,props,theme,width);c.description=S.components[kind].purpose;
          if(kind==='Button') {
            c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.counterAxisAlignItems='CENTER';c.primaryAxisAlignItems='CENTER';
            c.resize(width,size==='SM'?S.size['control-sm']:S.size['control-md']);bind(c,'height',size==='SM'?'component/button/height/sm':'component/button/height/md');
            for(const f of ['paddingTop','paddingBottom']){c[f]=S.space['2'];bind(c,/** @type {VariableBindableNodeField} */(f),'space/2');}
            c.cornerRadius=S.radius.control;bind(c,'cornerRadius','component/button/radius');
            const active=hierarchy==='Primary'&&!['Disabled'].includes(state);
            if(active)fill(c,theme,state==='Hover'||state==='Pressed'?'support':'accent');else {fill(c,theme,'surface');if(hierarchy==='Ghost')c.fills=[];}
            if(hierarchy!=='Ghost')border(c,theme);
            const icon=text(c,'→',theme,'label',active?'on-accent':'text');optional(c,icon,'Show leading icon',false);
            editable(c,text(c,'시작하기',theme,'label',active?'on-accent':'text'),'Label');
            if(state==='Loading')text(c,'…',theme,'label','on-accent');
          } else if(['Input','Textarea','Select'].includes(kind)) {
            c.fills=[];editable(c,text(c,kind==='Select'?'프로젝트 유형':'프로젝트 이름',theme,'label'),'Label');
            const field=frame(c,'Field',theme,288,'3');field.cornerRadius=S.radius.control;bind(field,'cornerRadius','component/field/radius');border(field,theme,state==='Focus');
            editable(c,text(field,kind==='Select'?'웹사이트  ⌄':kind==='Textarea'?'어떤 프로젝트인지 알려주세요.\n목적과 일정을 적어 주세요.':'회사 홈페이지 개편',theme,'body-md','text',264),'Value');
            const help=text(c,state==='Error'?'! 프로젝트 이름을 입력해 주세요.':'작업에 필요한 정보를 입력하세요.',theme,'body-sm','text',288);editable(c,help,state==='Error'?'Error message':'Helper text');optional(c,help,'Show help');
          } else if(['Checkbox','Radio','Switch'].includes(kind)) {
            c.layoutMode='HORIZONTAL';c.counterAxisAlignItems='CENTER';c.minHeight=44;c.fills=[];
            const control=frame(c,'Control',theme,kind==='Switch'?48:24,'0');control.resize(kind==='Switch'?48:24,24);control.primaryAxisSizingMode='FIXED';control.counterAxisSizingMode='FIXED';border(control,theme);
            bind(control,'height','component/selection/size');control.cornerRadius=kind==='Checkbox'?4:999;bind(control,'cornerRadius',kind==='Checkbox'?'radius/small':'radius/pill');
            if(value==='On')fill(control,theme,'accent');
            if(value==='On'||kind==='Switch'){const mark=text(control,kind==='Checkbox'?'✓':kind==='Radio'?'●':value==='On'?'  ●':'●',theme,'label',value==='On'?'on-accent':'text');mark.layoutPositioning='ABSOLUTE';mark.x=kind==='Switch'&&value==='On'?21:4;mark.y=2;}
            const label=text(c,kind==='Switch'?'알림 받기':'개인정보 수집에 동의합니다.',theme,'body-sm','text',kind==='Switch'?176:216);editable(c,label,'Label');
            if(kind==='Switch')text(c,value,theme,'caption');
          } else if(kind==='Badge') {
            c.resize(120,32);c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';
            for(const f of ['paddingTop','paddingBottom']){c[f]=4;bind(c,/** @type {VariableBindableNodeField} */(f),'space/1');}
            c.cornerRadius=999;bind(c,'cornerRadius','radius/pill');border(c,theme);editable(c,text(c,'검토 중',theme,'label'),'Label');
          } else if(kind==='Card') {
            border(c,theme);editable(c,text(c,'새로운 프로젝트',theme,'heading-md','heading',288),'Title');
            editable(c,text(c,'사람과 브랜드가 만나는 더 큰 가능성. 내용을 바꿔 사용하세요.',theme,'body-md','text',288),'Body');
            const action=instance(c,'Button',theme,{Hierarchy:'Secondary',Size:'MD',State:'Default'});optional(c,action,'Show action');
          } else if(kind==='Tabs') {
            c.layoutMode='HORIZONTAL';c.fills=[];c.itemSpacing=8;bind(c,'itemSpacing','space/2');
            for(const f of ['paddingTop','paddingBottom','paddingLeft','paddingRight']){c[f]=0;bind(c,/** @type {VariableBindableNodeField} */(f),'space/0');}
            for(const [i,label] of ['프로젝트','팀 소개'].entries()) {
              const tab=frame(c,`Tab ${i+1}`,theme,136,'3');tab.minHeight=44;tab.cornerRadius=0;bind(tab,'cornerRadius','radius/none');
              const selected=(state==='First'&&i===0)||(state==='Second'&&i===1);if(selected)border(tab,theme);else tab.fills=[];
              editable(c,text(tab,label,theme,'label'),`Tab ${i+1}`);
            }
          } else if(kind==='Navigation') {
            c.layoutMode=format==='Wide'?'HORIZONTAL':'VERTICAL';fill(c,theme,'background');border(c,theme);
            editable(c,text(c,'원정대',theme,'heading-sm'),'Brand text');const tabs=instance(c,'Tabs',theme,{State:'First'});tabs.resize(288,tabs.height);
          } else if(kind==='Modal') {
            border(c,theme);editable(c,text(c,'프로젝트를 시작할까요?',theme,'heading-md','heading',448),'Title');
            editable(c,text(c,'내용을 확인하고 다음 단계로 진행하세요.',theme,'body-md','text',448),'Body');
            instance(c,'Button',theme,{Hierarchy:'Secondary',Size:'MD',State:'Default'});instance(c,'Button',theme,{Hierarchy:'Primary',Size:'MD',State:'Default'});
          }
          if(state==='Focus')border(c,theme,true);
          if(state==='Disabled')c.opacity=0.55;
          variants.push(c);
        }
      }
      register(kind,variants);
    }
    phase='Interactions';
    function matching(kind,source,state,value){return sets[kind].find(n=>n.name===source.name.replace(/State=[^,]+/,`State=${state}`).replace(/Value=[^,]+/,`Value=${value||source.variantProperties?.Value||'Off'}`));}
    for(const kind of ['Button','Checkbox','Radio','Switch','Tabs'])for(const c of sets[kind]) {
      const state=c.name.match(/State=([^,]+)/)[1];if(['Disabled','Loading','Focus'].includes(state))continue;
      /** @type {Reaction[]} */const reactions=[];
      if(kind==='Button') {
        const hover=matching(kind,c,'Hover'),normal=matching(kind,c,'Default'),pressed=matching(kind,c,'Pressed');
        if(state==='Default')reactions.push({trigger:{type:'ON_HOVER'},actions:[{type:'NODE',destinationId:hover.id,navigation:'CHANGE_TO',transition:null,resetVideoPosition:false}]});
        if(state==='Hover')reactions.push({trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:pressed.id,navigation:'CHANGE_TO',transition:null,resetVideoPosition:false}]});
        if(state==='Pressed')reactions.push({trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:normal.id,navigation:'CHANGE_TO',transition:null,resetVideoPosition:false}]});
      } else {
        if(kind==='Radio'&&c.name.includes('Value=On'))continue;
        if(kind==='Tabs') {
          for(const [i,tab] of c.children.entries())if(tab.type==='FRAME') {
            const target=matching(kind,c,i===0?'First':'Second');
            await tab.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:target.id,navigation:'CHANGE_TO',transition:null,resetVideoPosition:false}]}]);
          }
          continue;
        }
        const value=c.name.match(/Value=([^,]+)/)?.[1];const dest=matching(kind,c,kind==='Tabs'?(state==='First'?'Second':'First'):'Default',value==='On'?'Off':'On');
        reactions.push({trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:dest.id,navigation:'CHANGE_TO',transition:null,resetVideoPosition:false}]});
      }
      await c.setReactionsAsync(reactions);
    }
    phase='Patterns';const patterns=page('03 Patterns');
    for(const [column,theme] of ['light','dark'].entries()) {
      let y=0;
      for(const [name,l] of Object.entries(S.layout)) {
        const canvas=frame(patterns,`${name} / ${theme} / ${l.width}`,theme,l.width,'0');canvas.x=column*1600;canvas.y=y;fill(canvas,theme,'background');
        for(const f of ['paddingLeft','paddingRight']){canvas[f]=l.margin;bind(canvas,/** @type {VariableBindableNodeField} */(f),`space/${l.margin===20?'5':l.margin===32?'8':'16'}`);}
        canvas.paddingTop=canvas.paddingBottom=32;bind(canvas,'paddingTop','space/8');bind(canvas,'paddingBottom','space/8');
        const inner=l.width-l.margin*2;
        canvas.layoutGrids=[{pattern:'COLUMNS',alignment:'STRETCH',gutterSize:l.gutter,count:l.columns,offset:l.margin,visible:false,color:{...rgb(KIT.tokens.colors['medium-green']),a:0.15}}];
        const nav=instance(canvas,'Navigation',theme,{State:'Default',Layout:name==='mobile'?'Compact':'Wide'});nav.resize(inner,nav.height);
        text(canvas,'사람과 브랜드가 만나는\n더 큰 가능성',theme,name==='mobile'?'heading-lg':'display','heading',inner);
        text(canvas,'공통 기준에 연결된 컴포넌트로 시작하세요.',theme,'body-md','text',inner);
        instance(canvas,'Button',theme,{Hierarchy:'Primary',Size:'MD',State:'Default'});
        const card=instance(canvas,'Card',theme,{State:'Default'});card.resize(inner,card.height);
        text(canvas,'프로젝트 문의',theme,'heading-md','heading',inner);
        for(const kind of ['Input','Select','Textarea']){const field=instance(canvas,kind,theme,{State:'Default'});field.resize(inner,field.height);}
        instance(canvas,'Checkbox',theme,{State:'Default',Value:'Off'});instance(canvas,'Button',theme,{Hierarchy:'Primary',Size:'MD',State:'Default'});
        y+=canvas.height+160;
      }
      const modal=frame(patterns,`Dialog pattern / ${theme}`,theme,560,'10');modal.x=column*1600;modal.y=y;fill(modal,theme,'background');
      text(modal,'확인 흐름 / 디자인 예시',theme,'heading-sm');instance(modal,'Modal',theme,{State:'Default'});
    }
    phase='Text style connections';
    const audit=board('Library inventory / Structural checks','이 목록은 생성된 객체에서 계산합니다. 실제 렌더·키보드·스크린리더 검증과 전사 승인은 별도입니다.',0,start.height+160);
    const counts={components:Object.keys(sets).length,variants:Object.values(sets).reduce((sum,list)=>sum+list.length,0),styles:styles.length,variables:variables.length,patterns:patterns.children.length};
    text(audit,`${counts.components} component sets / ${counts.variants} variants / ${counts.styles} text styles / ${counts.variables} variables / ${counts.patterns} patterns`,'light','heading-sm','text',960);
    text(audit,'전파 경로: Brand → Semantic → 컴포넌트 fills/strokes · Dimensions → Component aliases → padding/gap/radius/height · Typography Variables → Text Styles → 모든 텍스트.','light','body-md','text',960);
    text(audit,'디자인 상태 전환은 기본 프로토타입 예시입니다. 입력 검증·제출·포커스 트랩·라디오 그룹 동작은 실제 제품에서 구현해야 합니다.','light','body-sm','text',960);
    for(const entry of styleQueue)await entry.node.setTextStyleIdAsync(entry.style.id);
    if(styleQueue.some(entry=>entry.node.textStyleId!==entry.style.id))throw new Error('Text Style 연결 검증 실패');
    // Inner text/fields stretch with the parent; labels keep semantic style links.
    for(const n of nodes)if(n.type==='FRAME'||n.type==='COMPONENT')for(const child of n.children) {
      if(child.type==='TEXT'&&child.textAutoResize==='HEIGHT')child.layoutSizingHorizontal='FILL';
      if(child.type==='FRAME'&&child.name==='Field')child.layoutSizingHorizontal='FILL';
    }
    figma.root.setSharedPluginData(namespace,key,foundations.id);
    figma.root.setSharedPluginData(namespace,`${key}-inventory`,JSON.stringify(counts));
    await figma.setCurrentPageAsync(foundations);figma.viewport.scrollAndZoomIntoView([start]);
    figma.closePlugin(`생성 완료 · Foundations / 컴포넌트 ${Object.keys(sets).length}종 / Patterns · 전사 검토·게시 전 단계`);
  } catch(error) {
    await figma.setCurrentPageAsync(originalPage);
    for(const n of [...nodes].reverse())if(!n.removed)n.remove();
    for(const p of pages)if(!p.removed)p.remove();
    for(const s of styles)s.remove();
    for(const v of variables)v.remove();
    for(const c of collections)c.remove();
    throw new Error(`${phase}: ${error.message}`);
  }
}
generateLibrary().catch(error=>{console.error('WJ generation failed',error.stack||error);figma.closePlugin(`생성하지 못했습니다: ${error.message}`);});

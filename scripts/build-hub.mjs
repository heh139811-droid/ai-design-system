import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=file=>readFile(path.join(root,file),'utf8');
const pkg=JSON.parse(await read('package.json'));
const tokens=JSON.parse(await read('tokens/brand.json'));
const config=JSON.parse(await read('config/hub.json'));
if(config.figmaLibraryUrl) {
  const url=new URL(config.figmaLibraryUrl);
  if(url.protocol!=='https:' || !['figma.com','www.figma.com'].includes(url.hostname) || url.username || url.password) throw new Error('Use an HTTPS figma.com library URL');
}
const figmaFiles={};
for(const name of ['manifest.json','code.js','README.md','SYSTEM.md','tokens.json','system.json']) figmaFiles[name]=await read(`dist/figma/${name}`);
const files={
  '처음-읽어주세요.txt':`원정대 브랜드 전달 자료 v${pkg.version}\n\n1. AI-적용요청.txt를 AI에 붙여넣으세요.\n2. 이 ZIP을 함께 첨부하세요. ZIP 첨부가 안 되면 압축을 풀어 DESIGN.md, APPLY.md, tokens.json을 첨부하세요.\n3. 적용 결과를 확인하세요. 자료만 가져온 상태는 적용 완료가 아닙니다.\n\n공통 레포: https://github.com/heh139811-droid/ai-design-system\n\n이 파일은 특정 버전의 배포본으로 자동 갱신되지 않습니다.\n사진·로고·정식 폰트·Figma 자동 동기화는 포함되지 않습니다.`,
  'tokens.json':JSON.stringify(tokens,null,2)+'\n',
  'brand.css':await read('dist/brand.css'),
  'components.css':await read('dist/components.css'),
  'DESIGN.md':await read('DESIGN.md'),
  'APPLY.md':await read('docs/APPLY.md')
};
const payload=JSON.stringify({version:pkg.version,tokens,files,figmaFiles,config}).replaceAll('<','\\u003c');
const core=(await read('src/hub-core.mjs')).replace(/^export /gm,'');
const script=core+'\n'+await read('src/hub.js');
if (/<\/script/i.test(script)) throw new Error('Unsafe inline script end tag');
let html=await read('src/hub.html');
for(const [marker,value] of Object.entries({
  '/*__BRAND_CSS__*/':files['brand.css']+'\n'+files['components.css'],
  '/*__HUB_CSS__*/':await read('src/hub.css'),
  '/*__HUB_DATA__*/':payload,
  '/*__HUB_SCRIPT__*/':script
})) html=html.replace(marker,()=>value);
if (/\/\*__HUB_/.test(html)) throw new Error('Unresolved hub placeholder');
await mkdir(path.join(root,'dist/hub'),{recursive:true});
for(const name of ['START.html','dist/hub/index.html']) {
  if(process.argv.includes('--check')) {
    if(await read(name)!==html) throw new Error(`${name} is stale; run npm run build`);
  } else await writeFile(path.join(root,name),html);
}
console.log(process.argv.includes('--check')?'Brand hub is current.':'Built standalone START.html and dist/hub/index.html.');

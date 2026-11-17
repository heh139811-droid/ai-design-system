const data = JSON.parse(document.getElementById('brand-data').textContent);
const $ = id => document.getElementById(id);
document.querySelectorAll('[data-version]').forEach(el => {el.textContent=data.version;});
document.querySelectorAll('[data-repo]').forEach(el => {el.href=REPOSITORY;});
const system=JSON.parse(data.figmaFiles['system.json']);
for(const [name,spec] of Object.entries(system.components)) {
  const entry=document.createElement('details'),summary=document.createElement('summary');summary.textContent=name;entry.append(summary);
  for(const [label,value] of Object.entries({'용도':spec.purpose,'구조':spec.anatomy,'사용 규칙':spec.rules,'접근성':spec.accessibility,'반응형':spec.responsive})) {
    const p=document.createElement('p');p.textContent=`${label}: ${value}`;entry.append(p);
  }
  $('catalog').append(entry);
}
if(data.config.figmaLibraryUrl) {
  $('figmaLibraryLink').href=data.config.figmaLibraryUrl;
  $('figmaLibraryLink').hidden=false;
  $('figmaLibraryStatus').textContent='공유 파일 연결됨';
  $('figmaTaskStatus').textContent='공유 파일 열기';
  const taskLink=document.querySelector('.task-card a');taskLink.href=data.config.figmaLibraryUrl;taskLink.target='_blank';taskLink.rel='noopener noreferrer';taskLink.textContent='공유 Figma 파일 열기 ↗';
  $('figmaConnectionNote').textContent='공유 파일에 접근하려면 Figma 로그인과 파일 권한이 필요할 수 있습니다. 파일 복제본은 원본 변경이 자동 반영되지 않습니다.';
}
let toastTimer;
function notify(message) {clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>{$('toast').hidden=true;},3500);}
async function copy(text, message) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);notify(message);
  } catch {
    $('manualCopyPanel').hidden=false;$('manualCopy').value=text;$('manualCopy').focus();$('manualCopy').select();
  }
}
const descriptions = {
  'soft-mint':['소프트 민트','넓은 배경과 여백 · 권장 40%'],
  key:['메인 라임','작은 버튼·라인 강조 · 권장 10%'],
  'medium-green':['미디엄 그린','보조 요소 · 권장 20%'],
  'deep-green':['딥그린','큰 제목·브랜드 강조 · 권장 30%'],
  'soft-white':['소프트 화이트','본문·문서의 밝은 바탕'],
  charcoal:['차콜 그린','어두운 바탕·밝은 화면의 본문']
};
for(const [key,hex] of Object.entries(data.tokens.colors)) {
  const button=document.createElement('button');button.type='button';button.className='color-card';
  button.setAttribute('aria-label',`${descriptions[key][0]} ${hex} 복사`);
  const swatch=document.createElement('div');swatch.className='color-swatch';swatch.style.backgroundColor=hex;
  const hint=document.createElement('span');hint.textContent='복사 ↗';swatch.append(hint);
  const meta=document.createElement('div');meta.className='color-meta';
  const name=document.createElement('b');name.textContent=descriptions[key][0];
  const code=document.createElement('code');code.textContent=hex;meta.append(name,code);
  const usage=document.createElement('p');usage.textContent=descriptions[key][1];button.append(swatch,meta,usage);
  button.addEventListener('click',()=>copy(hex,`${descriptions[key][0]} ${hex} 복사 완료`));$('palette').append(button);
}
document.querySelectorAll('[data-preview-theme]').forEach(button => button.addEventListener('click',()=>{
  $('previewFrame').dataset.wjTheme=button.dataset.previewTheme;
  document.querySelectorAll('[data-preview-theme]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
}));
function requestValues() {return Object.fromEntries(new FormData($('requestForm')).entries());}
function updatePrompt() {$('prompt').value=createPrompt(requestValues(),data.version);}
$('requestForm').addEventListener('input',updatePrompt);
$('requestForm').addEventListener('change',updatePrompt);
$('requestForm').addEventListener('submit',event=>event.preventDefault());
$('copyPrompt').addEventListener('click',()=>copy($('prompt').value,'요청문 복사 완료 · 브랜드 ZIP과 함께 AI에 전달하세요.'));
$('closeManualCopy').addEventListener('click',()=>{$('manualCopyPanel').hidden=true;$('copyPrompt').focus();});
function downloadZip(files,filename) {
  try {
    const bytes=zipFiles(files),url=URL.createObjectURL(new Blob([bytes],{type:'application/zip'}));
    const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);notify('다운로드를 요청했습니다. 브라우저 다운로드 목록을 확인하세요.');
  } catch {notify('다운로드를 시작하지 못했습니다. 공통 레포에서 자료를 받아 주세요.');}
}
document.querySelectorAll('[data-download]').forEach(button=>button.addEventListener('click',()=>downloadZip({...data.files,'AI-적용요청.txt':$('prompt').value},`wonjeongdae-brand-kit-v${data.version}.zip`)));
document.querySelectorAll('[data-figma-download]').forEach(button=>button.addEventListener('click',()=>downloadZip(data.figmaFiles,`wonjeongdae-figma-kit-v${data.version}.zip`)));
$('copyFigmaGuide').addEventListener('click',()=>copy(data.figmaFiles['README.md'],'Figma 최초 설정 안내를 복사했습니다.'));
$('figmaSetupLink').addEventListener('click',()=>{$('figmaSetup').open=true;});
$('feedbackForm').addEventListener('submit',event=>{
  event.preventDefault();if(!$('feedbackForm').reportValidity())return;
  const url=makeIssueUrl($('feedbackTitle').value,$('feedbackBody').value,data.version);
  // User-triggered navigation opens a draft; only the user submits on GitHub.
  const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';document.body.append(link);link.click();link.remove();
});
$('copyFeedback').addEventListener('click',()=>{
  if(!$('feedbackForm').reportValidity())return;
  copy(`원정대 브랜드 의견 · v${data.version}\n제목: ${$('feedbackTitle').value.trim()}\n\n${$('feedbackBody').value.trim()}`,'의견 복사 완료 · 담당자에게 전달해 주세요.');
});
updatePrompt();

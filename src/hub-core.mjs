export const REPOSITORY = 'https://github.com/heh139811-droid/ai-design-system';

export function createPrompt({project = '', kind = 'web', stage = 'existing', theme = 'light'} = {}, version = '0.1.0') {
  const kinds = {web:'웹사이트', document:'문서·발표자료', figma:'Figma 디자인'};
  const themes = {light:'밝은 테마', dark:'어두운 테마', both:'밝은 테마와 어두운 테마 모두'};
  const lines = [
    `원정대 브랜드 기준 v${version}을 ${project.trim() || '이 프로젝트'}에 적용해 주세요.`,
    `대상: ${kinds[kind] || kinds.web}. ${stage === 'new' ? '새로 만드는 작업' : '기존 결과물의 브랜드 적용'}. ${themes[theme] || themes.light}.`,
    `공통 기준: ${REPOSITORY}. README.md, DESIGN.md, docs/APPLY.md를 먼저 읽어 주세요.`,
    '레포 접근 권한이 없으면 내가 첨부한 브랜드 전달 자료 ZIP을 풀어 그 안의 기준을 확인하세요. 접근하지 못한 자료를 확인했다고 말하지 마세요.',
    '지정 색상: 소프트 민트 #F2FFF4, 라임 #ABFF48, 미디엄 그린 #6EE78D, 딥그린 #00866F, 소프트 화이트 #F7FBF7, 차콜 그린 #17332D.',
    '넓은 밝은 배경은 민트·소프트 화이트, 어두운 배경은 차콜로 구성하세요. 라임은 버튼·라인·아이콘 등 작은 강조에만 쓰고 버튼 글자는 차콜로 쓰세요.',
    '민트 40% / 라임 10% / 미디엄 그린 20% / 딥그린 30%는 브랜드 시각물의 권장 구성입니다. 모든 화면에 정확한 면적 비율을 강제하지 마세요.',
    '유사 녹색을 임의로 추가하지 마세요. 작은 본문은 차콜을 쓰고 딥그린은 밝은 배경의 큰 제목에 활용하세요. 로고·사진·정식 폰트가 없으면 임의로 확정 자산을 만들지 마세요.',
    stage === 'new' ? '신규 결과물은 처음부터 이 기준을 사용하세요.' : '기존 내용과 동작을 유지하고, 기존 스타일을 브랜드 역할에 매핑하세요. 단순 파일 추가만으로 적용 완료라고 보고하지 마세요.',
    kind === 'figma' ? 'Figma Variables와 컴포넌트에 역할을 매핑하세요. 이 자료에는 Figma 자동 동기화 플러그인이 포함돼 있지 않습니다.' : kind === 'document' ? '매체의 글꼴·색상·레이아웃 설정에 기준을 연결하세요. 웹 CSS 파일은 문서에 직접 적용되지 않습니다.' : '웹의 스타일 진입점에서 CSS를 연결하고 대상 UI에 테마를 적용하세요. 처음 적용하는 프로젝트는 기존 스타일과의 연결 작업이 필요합니다.',
    '적용 후 읽기 쉬운지, 버튼·입력·오류 상태가 구분되는지 확인하고 웹이면 모바일·데스크톱과 키보드 포커스도 확인하세요. 변경 사항, 확인 결과와 남은 작업을 알려 주세요.'
  ];
  return lines.join('\n\n');
}

export function makeIssueUrl(title, body, version) {
  const url = new URL(`${REPOSITORY}/issues/new`);
  url.searchParams.set('title', `[브랜드 제안] ${title.trim()}`);
  url.searchParams.set('body', `사용한 기준: v${version}\n\n${body.trim()}\n\n검토 요청: 적용 여부를 브랜드 담당자가 확인해 주세요.`);
  return url.href;
}

// Uncompressed ZIP, UTF-8 names, no library or network required.
export function zipFiles(files) {
  const encoder = new TextEncoder();
  const chunks = [], records = [];
  let offset = 0;
  const crc32 = bytes => {
    let crc = 0xffffffff;
    for(const byte of bytes) { crc ^= byte; for(let bit=0;bit<8;bit++) crc=(crc>>>1)^((crc&1)?0xedb88320:0); }
    return (crc ^ 0xffffffff) >>> 0;
  };
  const header = size => { const bytes=new Uint8Array(size); return {bytes, view:new DataView(bytes.buffer)}; };
  for(const [filename, text] of Object.entries(files)) {
    if(filename.startsWith('/') || filename.includes('..') || filename.includes('\\')) throw new Error('Unsafe ZIP path');
    const name=encoder.encode(filename), data=encoder.encode(text), crc=crc32(data);
    const local=header(30+name.length), v=local.view;
    v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);
    v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);local.bytes.set(name,30);
    chunks.push(local.bytes,data);
    const central=header(46+name.length), c=central.view;
    c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint16(14,33,true);
    c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true);central.bytes.set(name,46);records.push(central.bytes);
    offset+=local.bytes.length+data.length;
  }
  const directorySize=records.reduce((sum,b)=>sum+b.length,0), end=header(22);
  end.view.setUint32(0,0x06054b50,true);end.view.setUint16(8,records.length,true);end.view.setUint16(10,records.length,true);end.view.setUint32(12,directorySize,true);end.view.setUint32(16,offset,true);
  const output=new Uint8Array(offset+directorySize+22);let cursor=0;
  for(const bytes of [...chunks,...records,end.bytes]) { output.set(bytes,cursor);cursor+=bytes.length; }
  return output;
}

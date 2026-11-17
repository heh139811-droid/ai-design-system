'use client';
import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BrandProvider,Button,Input,Textarea,Select,Checkbox,Radio,RadioGroup,Switch,Tabs,Modal,Card,Badge,Navigation} from '@wonjeongdae/design-system/react';

function App(){
  const [dark,setDark]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState(false),[notifications,setNotifications]=useState(true);
  return <BrandProvider theme={dark?'dark':'light'} style={{minHeight:'100vh',padding:'clamp(1rem,4vw,3rem)'}}>
    <div style={{maxWidth:1000,margin:'auto'}}>
      <Navigation label="예제 메뉴" brand="원정대 / React UI" items={[{label:'컴포넌트',href:'#components',current:true},{label:'문의 양식',href:'#form'}]}/>
      <header style={{paddingBlock:'2rem'}}><Badge>구현 제안 · React</Badge><h1>설치하고, 연결하고, 사용하세요.</h1><p>색상·토큰·컴포넌트 동작을 함께 제공하는 개발용 예제입니다.</p><Switch label="다크 테마" checked={dark} onCheckedChange={setDark}/></header>
      <main id="components"><Tabs label="컴포넌트 예제" items={[
        {value:'form',label:'실제 문의 양식',content:<Card id="form"><h2>프로젝트 문의</h2><form style={{display:'grid',gap:20}} onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);if(!String(data.get('project')||'').trim()){setError('프로젝트 이름을 입력해 주세요.');setSaved(false);return;}setError('');setSaved(true);}} noValidate>
          <Input label="프로젝트 이름" name="project" hint="예: 회사 홈페이지 개편" error={error} required/>
          <Select label="작업 종류" name="kind"><option value="web">웹사이트</option><option value="app">앱</option></Select>
          <Textarea label="설명" name="description" hint="목적과 원하는 일정을 알려주세요."/>
          <RadioGroup legend="원하는 분위기"><Radio name="theme" label="밝게" value="light" defaultChecked/><Radio name="theme" label="어둡게" value="dark"/></RadioGroup>
          <Checkbox name="consent" label="담당자가 연락하는 데 동의합니다."/>
          <Switch label="업데이트 알림" checked={notifications} onCheckedChange={setNotifications}/>
          <div style={{display:'flex',flexWrap:'wrap',gap:12}}><Button type="submit">입력 확인</Button><Button type="reset" variant="secondary" onClick={()=>{setError('');setSaved(false);}}>초기화</Button></div>
          <p role="status">{saved?'입력 확인 완료. 데모는 서버로 전송하지 않습니다.':''}</p>
        </form></Card>},
        {value:'states',label:'버튼·모달',content:<Card><h2>상태와 키보드 동작</h2><div style={{display:'flex',gap:12,flexWrap:'wrap'}}><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button size="sm">SM</Button><Button disabled>사용 불가</Button><Button loading>저장</Button>
          <Modal title="프로젝트를 시작할까요?" description="Escape로 닫으면 실행 버튼으로 포커스가 돌아갑니다." trigger={<Button>모달 열기</Button>}><Input label="담당자"/><p>Tab·Shift+Tab으로 모달 안에서 이동해 보세요. 다크 테마도 포털에 유지됩니다.</p></Modal></div></Card>},
        {value:'code',label:'사용 코드',content:<Card><h2>가장 작은 사용 예</h2><pre style={{overflowX:'auto'}}>{`import '@wonjeongdae/design-system/react/styles.css';\nimport { BrandProvider, Button } from '@wonjeongdae/design-system/react';\n\n<BrandProvider theme="light">\n  <Button variant="primary">시작하기</Button>\n</BrandProvider>`}</pre><p>전체 속성·설치·마이그레이션은 패키지의 docs/REACT.md를 확인하세요.</p></Card>}
      ]}/></main><footer style={{paddingBlock:'2rem'}}>원본 6색 유지 · 폰트·간격·컴포넌트는 구현 제안 · 로고 자산 아님</footer>
    </div>
  </BrandProvider>;
}
createRoot(document.getElementById('root')!).render(<App/>);

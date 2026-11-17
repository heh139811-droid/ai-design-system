import './react-dom-env.mjs';
import React,{useState,createRef} from 'react';
import test,{afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {render,screen,cleanup,waitFor,act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderToString} from 'react-dom/server';
import axe from 'axe-core';
import {BrandProvider,Button,Input,Textarea,Select,Checkbox,Radio,RadioGroup,Switch,Tabs,Modal,Card,Badge,Navigation} from '@wonjeongdae/design-system/react';
afterEach(cleanup);

test('button defaults to non-submit; loading and disabled block activation while keeping its name',async()=>{
  const user=userEvent.setup();let submit=0,click=0;
  const view=render(<BrandProvider><form onSubmit={e=>{e.preventDefault();submit++;}}><Button onClick={()=>click++}>저장</Button></form></BrandProvider>);
  await user.click(screen.getByRole('button',{name:'저장'}));assert.equal(click,1);assert.equal(submit,0);
  view.rerender(<BrandProvider><Button loading onClick={()=>click++}>저장</Button></BrandProvider>);
  const busy=screen.getByRole('button',{name:'저장'});assert.equal(busy.getAttribute('aria-busy'),'true');
  await user.click(busy);assert.equal(click,1);
});

test('form fields associate label, hint and error; native values submit and reset',async()=>{
  const user=userEvent.setup();const ref=createRef<HTMLInputElement>();
  const {container}=render(<BrandProvider><form><Input ref={ref} label="프로젝트" name="project" hint="작업 이름" error="이름을 확인하세요" defaultValue="초기"/><Textarea label="설명" name="body"/><Select label="유형" name="kind" defaultValue="web"><option value="web">웹</option><option value="app">앱</option></Select><Checkbox label="동의" name="consent"/><RadioGroup legend="분위기"><Radio name="theme" label="라이트" value="light" defaultChecked/><Radio name="theme" label="다크" value="dark"/></RadioGroup><button type="reset">초기화</button></form></BrandProvider>);
  const input=screen.getByRole('textbox',{name:'프로젝트'});assert.equal(input,ref.current);assert.equal(input.getAttribute('aria-invalid'),'true');
  for(const id of input.getAttribute('aria-describedby')!.split(' '))assert.ok(document.getElementById(id));
  await user.clear(input);await user.type(input,'테스트');await user.selectOptions(screen.getByRole('combobox',{name:'유형'}),'app');
  await user.click(screen.getByRole('checkbox',{name:'동의'}));await user.click(screen.getByRole('radio',{name:'다크'}));
  const data=new window.FormData(container.querySelector('form')!);assert.equal(data.get('project'),'테스트');assert.equal(data.get('kind'),'app');assert.equal(data.get('theme'),'dark');assert.equal(data.get('consent'),'on');
  await user.click(screen.getByRole('button',{name:'초기화'}));assert.equal((input as HTMLInputElement).value,'초기');
});

test('checkbox uses Space, radio arrow navigation preserves a single selection, disabled fields block edits',async()=>{
  const user=userEvent.setup();render(<BrandProvider><Checkbox label="동의"/><RadioGroup legend="테마"><Radio name="theme" value="light" label="라이트" defaultChecked/><Radio name="theme" value="dark" label="다크"/></RadioGroup><Input label="잠김" disabled value="기존"/></BrandProvider>);
  screen.getByRole('checkbox').focus();await user.keyboard(' ');assert.equal((screen.getByRole('checkbox') as HTMLInputElement).checked,true);
  screen.getByRole('radio',{name:'라이트'}).focus();await user.keyboard('{ArrowRight}');assert.equal((screen.getByRole('radio',{name:'다크'}) as HTMLInputElement).checked,true);
  assert.equal((screen.getByRole('radio',{name:'라이트'}) as HTMLInputElement).checked,false);
  await user.type(screen.getByRole('textbox',{name:'잠김'}),'변경');assert.equal((screen.getByRole('textbox',{name:'잠김'}) as HTMLInputElement).value,'기존');
});

test('switch supports controlled state and keyboard, including disabled',async()=>{
  const user=userEvent.setup();function Example(){const [checked,setChecked]=useState(false);return <BrandProvider><Switch label="알림" checked={checked} onCheckedChange={setChecked}/><Switch label="잠긴 알림" disabled/></BrandProvider>;}
  render(<Example/>);const control=screen.getByRole('switch',{name:'알림'});control.focus();await user.keyboard(' ');assert.equal(control.getAttribute('aria-checked'),'true');
  await user.click(control);assert.equal(control.getAttribute('aria-checked'),'false');await user.click(screen.getByRole('switch',{name:'잠긴 알림'}));assert.equal(screen.getByRole('switch',{name:'잠긴 알림'}).getAttribute('aria-checked'),'false');
});

test('tabs support arrows, Home/End, skip disabled items and connect panels',async()=>{
  const user=userEvent.setup();render(<BrandProvider><Tabs label="프로젝트 보기" items={[{value:'a',label:'개요',content:'개요 내용'},{value:'b',label:'잠김',content:'비공개',disabled:true},{value:'c',label:'상세',content:'상세 내용'}]}/></BrandProvider>);
  const first=screen.getByRole('tab',{name:'개요'}),last=screen.getByRole('tab',{name:'상세'});act(()=>first.focus());await user.keyboard('{ArrowRight}');
  await waitFor(()=>assert.equal(last.getAttribute('aria-selected'),'true'));assert.equal(document.activeElement,last);assert.equal(screen.getByRole('tabpanel').id,last.getAttribute('aria-controls'));
  await user.keyboard('{Home}');await waitFor(()=>assert.equal(first.getAttribute('aria-selected'),'true'));
  await user.keyboard('{End}');await waitFor(()=>assert.equal(last.getAttribute('aria-selected'),'true'));
});

test('modal traps focus, inherits dark theme in body portal, closes by Escape and restores trigger focus',async()=>{
  const user=userEvent.setup();render(<BrandProvider theme="dark"><Modal title="문의 확인" description="입력 내용을 확인하세요" trigger={<Button>문의 열기</Button>}><Input label="담당자"/><Button>확인</Button></Modal></BrandProvider>);
  const trigger=screen.getByRole('button',{name:'문의 열기'});await user.click(trigger);
  const dialog=await screen.findByRole('dialog',{name:'문의 확인'});assert.equal(dialog.closest('[data-wj-theme]')?.getAttribute('data-wj-theme'),'dark');
  assert.ok(dialog.getAttribute('aria-describedby'));assert.ok(dialog.contains(document.activeElement));
  screen.getByRole('button',{name:'닫기'}).focus();await user.tab();assert.equal(document.activeElement,screen.getByRole('textbox',{name:'담당자'}));
  await user.keyboard('{Escape}');await waitFor(()=>assert.equal(screen.queryByRole('dialog'),null));await waitFor(()=>assert.equal(document.activeElement,trigger));
});

test('React surfaces pass axe structural checks (visual contrast requires browser review)',async()=>{
  render(<main><BrandProvider><Navigation label="주요 메뉴" brand="원정대" items={[{href:'#work',label:'프로젝트',current:true}]}/><Card aria-label="프로젝트 카드"><Badge>진행 중</Badge><Input label="프로젝트"/><Textarea label="설명"/><Select label="유형"><option>웹</option></Select><Switch label="알림"/><Checkbox label="동의"/></Card><Tabs label="보기" items={[{value:'a',label:'개요',content:'내용'}]}/></BrandProvider></main>);
  const result=await axe.run(document.body,{rules:{'color-contrast':{enabled:false}}});assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
});

test('server rendering exposes theme, labels and stable useId associations without document access',()=>{
  const html=renderToString(<BrandProvider theme="dark"><Input label="서버 입력" hint="안내"/><Button>저장</Button></BrandProvider>);
  assert.match(html,/data-wj-theme="dark"/);assert.match(html,/aria-describedby=/);assert.match(html,/type="button"/);
});

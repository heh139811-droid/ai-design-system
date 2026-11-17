import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import {BrandProvider,Button,Input,Modal,Tabs} from '@wonjeongdae/design-system/react';
assert.equal(typeof document,'undefined');
const html=renderToString(createElement(BrandProvider,{theme:'dark'},
  createElement(Input,{label:'서버 입력',hint:'안내'}),createElement(Button,null,'저장'),
  createElement(Tabs,{label:'보기',items:[{value:'a',label:'개요',content:'내용'}]}),
  createElement(Modal,{title:'문의',trigger:createElement(Button,null,'열기')},'내용')
));
assert.match(html,/data-wj-theme="dark"/);assert.match(html,/aria-describedby=/);assert.match(html,/type="button"/);
console.log('SSR succeeds without window/document.');

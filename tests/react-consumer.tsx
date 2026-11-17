import {BrandProvider,Button,Input,Modal,Tabs,Switch} from '@wonjeongdae/design-system/react';
export const example=<BrandProvider theme="dark"><Button size="sm" variant="secondary">저장</Button><Input label="프로젝트" error="확인"/><Switch label="알림"/><Modal title="확인" trigger={<Button>열기</Button>}>내용</Modal><Tabs label="보기" items={[{value:'a',label:'개요',content:'내용'}]}/></BrandProvider>;
// @ts-expect-error invalid hierarchy must be rejected in consumer code
export const invalidVariant=<Button variant="purple"/>;
// @ts-expect-error fields require an accessible label
export const missingLabel=<Input/>;

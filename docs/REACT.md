# React 개발자 가이드

## 설치

React 18.2 이상 또는 React 19와 React DOM이 있는 프로젝트에서 사용합니다. TypeScript 선언 파일과 ESM이 포함됩니다. Next.js에서는 Client Component 경계를 사용합니다.

현재 배포 수단은 로컬 tarball입니다. npm 공개 레지스트리에 게시하거나 원격 레포에 푸시한 상태로 설명하지 않습니다.
개발 검사는 Node.js 22.22 이상을 사용합니다. 이 레포에서 `npm ci`, `npm run build`, `npm test`, `npm run check`를 실행한 뒤 다음 명령으로 설치 파일을 만듭니다.

```bash
npm pack
```

생성된 `wonjeongdae-design-system-0.1.0.tgz`를 소비 프로젝트에 전달하고 그 프로젝트에서 설치합니다.

```bash
npm install ./wonjeongdae-design-system-0.1.0.tgz
```

이 작업 세션에서 생성한 설치 파일은 `.artifact-tmp/wonjeongdae-design-system-0.1.0.tgz`에 있습니다. 파일이 갱신되면 소비 프로젝트에서 다시 설치하고 lockfile 변경을 커밋하세요. 원격 Git 설치는 해당 구현이 푸시된 커밋/태그를 확인한 후 사용합니다.

## 가장 작은 예제

글로벌 CSS 진입점에서 아래 CSS를 한 번 불러옵니다. 원본 브랜드 CSS와 기본 컴포넌트 CSS가 함께 포함되어 있으므로 따로 중복 import하지 않아도 됩니다. 외부 폰트 다운로드·CSS reset은 없습니다.

```tsx
import '@wonjeongdae/design-system/react/styles.css';
import { BrandProvider, Button, Input } from '@wonjeongdae/design-system/react';

export function App() {
  return (
    <BrandProvider theme="light">
      <Input label="프로젝트 이름" name="project" hint="예: 홈페이지 개편" />
      <Button variant="primary" size="md">시작하기</Button>
    </BrandProvider>
  );
}
```

`BrandProvider`는 div를 렌더합니다. 기본 테마는 light이며 theme을 dark로 변경하면 모달의 body 포털까지 같은 테마가 유지됩니다. 기존 앱의 data-theme 속성을 덮어쓰지 않습니다. 모든 컴포넌트는 provider 아래에 두세요. 강제 !important나 전역 button/input 재정의는 사용하지 않습니다.

## 컴포넌트 API

- **Button**: variant="primary|secondary|ghost", size="sm|md", loading, disabled. 기본 type="button"으로 의도치 않은 폼 제출을 방지합니다. 제출은 type="submit"을 명시하세요. loading은 disabled와 aria-busy를 적용하며 접근 가능한 이름을 유지합니다. 아이콘만 넣으면 aria-label을 제공하세요.
- **Input / Textarea / Select**: label 필수. hint, error, containerClassName과 native props, ref를 지원합니다. error가 있으면 aria-invalid와 오류 문구 연결을 추가합니다. 사용자가 준 aria-describedby도 유지합니다. 필수 값 검증은 소비 앱이 처리합니다. Select는 option을 children으로 전달하는 native select입니다.
- **Checkbox / Radio**: label 필수. checked/defaultChecked, onChange, name, value 등 native input props를 지원합니다. RadioGroup에는 legend를 넣고 같은 그룹의 Radio에 동일한 name을 지정합니다. RadioGroup의 disabled로 그룹 전체를 비활성화할 수 있습니다.
- **Switch**: label 필수. checked/defaultChecked, onCheckedChange, disabled, name 지원. native onChange 대신 onCheckedChange를 사용합니다. Space·Enter로 전환하며 checked와 disabled를 관리합니다. Radix 기본 폼 동작을 사용합니다.
- **Card / Badge**: 기본 HTML 속성·className·ref 지원. Card는 section이며 제목 요소를 children으로 제공합니다. Badge는 상태 변경을 자동 알리는 live 영역이 아닙니다.
- **Tabs**: label 필수, items=[{value,label,content,disabled?}], value/defaultValue/onValueChange, activationMode="automatic|manual", orientation="horizontal|vertical". 방향키·Home·End, 선택 상태와 패널 ID 연결을 제공합니다. 동일 Tabs 안에서 value를 중복하지 마세요.
- **Navigation**: label 필수, brand, items=[{href,label,current?,...anchorProps}]. nav landmark와 aria-current="page"를 제공합니다. 좁은 화면에서는 메뉴를 줄바꿈합니다. 햄버거 메뉴·라우터 추상화는 포함하지 않습니다.
- **Modal**: title 필수, description, trigger, open/defaultOpen/onOpenChange, footer, closeLabel="닫기", contentProps. trigger는 ref를 전달할 수 있는 요소를 사용합니다. 포커스 트랩·Escape·실행 버튼으로 복귀·포털 테마를 제공합니다. trigger 없는 외부 제어 모달은 contentProps.onCloseAutoFocus에서 복귀 지점을 지정할 수 있습니다. 기본 닫기 버튼은 항상 제공합니다.

모든 form 컴포넌트는 controlled와 uncontrolled 패턴을 혼합하지 마세요. React의 ref는 React Hook Form 등에서 사용할 수 있습니다. 특정 폼 라이브러리 어댑터는 포함하지 않습니다.

## 실제 폼과 모달

```tsx
'use client';
import { useState } from 'react';
import { Button, Input, Switch, Modal } from '@wonjeongdae/design-system/react';

export function ProjectForm() {
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState(false);
  return (
    <form noValidate onSubmit={event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      setError(String(data.get('project') || '').trim() ? '' : '이름을 입력하세요.');
      // 검증 성공 후 API 호출은 소비 프로젝트에서 구현합니다.
    }}>
      <Input label="프로젝트" name="project" required error={error} />
      <Switch label="알림 받기" checked={notifications} onCheckedChange={setNotifications} />
      <Button type="submit">입력 확인</Button>
      <Modal title="문의 안내" description="담당자에게 전달할 내용을 확인하세요."
        trigger={<Button variant="secondary">안내 열기</Button>}>
        문의할 내용을 확인하세요.
      </Modal>
    </form>
  );
}
```

## Next.js App Router

`app/layout.tsx`에서 styles.css를 import합니다. 상태·이벤트 핸들러가 있는 화면은 `'use client'` 파일에 두세요. 라이브러리 ESM에도 `'use client'`를 보존합니다. 브라우저 전용 객체를 모듈 최상위에서 읽지 않으므로 서버 렌더도 가능합니다. Next.js 전체 앱 빌드 검증 여부는 VALIDATION.md를 확인하세요.

## 예제와 기준

`dist/react-demo/index.html`을 브라우저로 열면 오프라인 React 예제가 실행됩니다. `examples/react/App.tsx`에서 문의 폼·테마·모달·탭과 사용 코드를 확인할 수 있습니다. 예제 폼은 서버에 전송하지 않습니다.

색상은 brand.json, 새 UI 수치는 system.json에서 생성합니다. 폰트·간격·모서리·컴포넌트는 구현 제안입니다. Figma의 임의 State 변형을 강제로 지정하는 API 대신 hover/focus/checked/disabled 등의 실제 상태로 스타일을 적용합니다. Figma의 모든 속성·레이아웃이 React API와 1:1인 것은 아닙니다.

기존 CSS 소비자는 컴포넌트별로 천천히 교체하세요. 이전 CSS import만으로 기존 HTML이 React로 변환되지는 않습니다. 기존 전역 스타일·포털·모달 스택과 충돌 여부를 소비 앱에서 확인해야 합니다.

## 검증 범위

키보드·라벨·오류 연결·폼 값·초기화·탭·모달 포커스·포털 테마는 DOM 동작 검사로 확인합니다. axe 구조 검사는 색상 대비를 제외합니다. 단색 대비는 기존 토큰 검사를 사용하며 실제 시각·OS native select·모바일·스크린리더는 소비 프로젝트에서 확인해야 합니다. 접근성 인증이나 모든 환경의 호환성 보장은 아닙니다.

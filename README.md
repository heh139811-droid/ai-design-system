# 원정대 · AI Design System

비개발자와 개발자가 같은 브랜드 기준으로 협업하는 공통 프로젝트입니다.
공통 레포: https://github.com/heh139811-droid/ai-design-system

## 비개발자: START.html을 열면 됩니다

**[브랜드 허브 열기](START.html)** — 다운로드한 파일을 더블클릭하세요. 별도 설치나 터미널 명령은 필요 없습니다.

- 색상 카드를 눌러 HEX 복사
- 라이트·다크 화면 미리보기
- 작업 이름·매체·테마에 맞춘 AI 적용 요청문 복사
- 브랜드 기준·CSS·색상 JSON·요청문이 담긴 ZIP 다운로드
- 개선 의견을 GitHub 작성화면으로 가져가거나 담당자에게 보낼 텍스트 복사

팀원에게 START.html 파일 하나를 전달하면 오프라인에서도 열 수 있습니다. [팀원 사용 가이드](docs/FOR-TEAM.md)를 참고하세요.
현재는 버전별 배포본입니다. 실시간 공동 편집·자동 업데이트·실제 사이트 즉시 변환 기능은 없습니다.

## Figma 라이브러리 시작하기

허브 첫 화면에서 업무를 선택합니다. Figma는 담당자가 생성 도구 ZIP을 받아 최초 한 번 실행한 뒤 파일을 공유하는 방식입니다.
Variables·5종 컴포넌트·라이트/다크 6개 화면을 생성합니다. [설정 안내](docs/FIGMA.md)를 확인하세요.
공유 후 `config/hub.json`의 `figmaLibraryUrl`에 실제 Figma 파일 주소를 넣고 빌드하면 허브에 열기 버튼이 나타납니다.
발표 템플릿은 준비 중이며 이번 배포에는 포함되지 않습니다. 생성된 컴포넌트의 간격·라운드·글꼴은 검토 전 구현 제안입니다.

## 개발자: 수정과 실행

Node.js 20 이상만 필요하며 외부 패키지 설치는 필요 없습니다.

```bash
npm run build
npm test
npm run check
npm run dev
```

개발 미리보기: http://127.0.0.1:4175
허브 소스는 src/hub.html, src/hub.css, src/hub.js입니다. build가 START.html과 dist/hub/index.html을 생성합니다. 생성 파일을 직접 수정하지 마세요.
색상 원본은 tokens/brand.json입니다. 허브와 다운로드 ZIP, 생성 CSS 모두 같은 원본을 사용합니다.

## 다른 프로젝트의 웹 UI에 사용

아래 Git 의존성은 레포 읽기 권한과 Git 인증이 필요합니다. 실제 운영에서는 검증한 커밋 또는 발행한 버전 태그를 고정하세요.

```bash
npm install git+https://github.com/heh139811-droid/ai-design-system.git
```

```js
import '@wonjeongdae/design-system/brand.css';
import '@wonjeongdae/design-system/components.css';
```

```html
<main data-wj-brand data-wj-theme="light">
  <section class="wj-container wj-stack">
    <h1 class="wj-brand-heading">사람과 브랜드가 만나는 더 큰 가능성</h1>
    <button class="wj-button">프로젝트 문의하기</button>
  </section>
</main>
```

기존 사이트는 [AI 적용 절차](docs/APPLY.md)에 따라 최초 스타일 매핑이 필요합니다. CSS를 가져오는 것만으로 기존 HTML이 자동 변환되지는 않습니다.

## 유지·협업 기준

- [이미지 분석·브랜드 계약](DESIGN.md): 확정 6색과 구현 제안을 구분합니다.
- [팀원용 가이드](docs/FOR-TEAM.md): 의견 제안·검토·새 버전 공유 방법.
- [운영](docs/OPERATIONS.md): 업데이트와 적용 범위.
- [검증 기록](docs/VALIDATION.md): 자동 검사와 미검증 구간.
- [기존 단순 예제](examples/index.html).

이 프로젝트는 프레임워크에 종속되지 않는 CSS·JSON 기반입니다. Astryx 어댑터, Figma 동기화, 원본 로고·폰트·사진, 설치 프로그램은 포함되지 않습니다.

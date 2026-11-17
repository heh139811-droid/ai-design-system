# AI에게 원정대 브랜드 적용을 지시하는 절차

이 문서를 읽은 AI는 아래 순서로 실제 코드를 수정한다. 설치만으로 완료했다고 보고하지 않는다.

1. DESIGN.md와 tokens.json(레포에서는 tokens/brand.json)을 읽는다. 버전/커밋을 기록한다.
2. 대상 프로젝트의 AGENTS.md와 스타일 진입점, 프레임워크, 기존 토큰, 전역 CSS·UI 라이브러리를 확인한다.
3. 패키지 import 또는 init으로 복사한 brand.css와 components.css를 전역 스타일 진입점에서 한 번 불러온다. 임의 CSS reset을 추가하지 않는다.
4. 앱 루트 또는 특정 영역에 data-wj-brand를 넣고 data-wj-theme="light" 또는 "dark"를 명시한다. data-theme 같은 대상 앱의 속성을 덮어쓰지 않는다.
5. 기존 background/text/primary/border 토큰을 --wj-background/--wj-text/--wj-accent/--wj-border에 매핑한다. 버튼 글자는 --wj-on-accent로 연결한다.
6. 기존 UI 구조와 동작을 유지하며 하드코딩된 브랜드 색을 매핑한다. 임의로 전체 button/input 선택자에 !important를 덮어쓰지 않는다.
7. 신규 화면은 wj-button, wj-input, wj-card, wj-heading, wj-link 클래스를 사용한다. 기존 컴포넌트의 API를 유지해야 하면 해당 스타일 슬롯에 토큰만 연결한다.
8. Tailwind/shadcn은 대상 버전의 토큰 포맷(HEX, HSL, OKLCH)과 CSS 레이어를 먼저 확인한다. 형식 변환 없이 HEX를 HSL 채널 자리에 넣지 않는다. Astryx는 설치 버전의 theme API 문서를 조회하고 역할을 매핑한다. 이 패키지는 Astryx 어댑터를 구현하지 않았다.
9. 라이브러리 포털(모달/토스트)이 body로 나가면 브랜드 범위와 테마 상속을 확인한다. iframe·Shadow DOM에는 별도 CSS/테마 주입이 필요하다.
10. 상태색·차트 의미색·외부 서비스 로고는 기계적으로 초록으로 바꾸지 않는다. 작은 deep-green 본문은 charcoal로 바꾼다.
11. 라이트/다크, 360px/768px/1440px, hover/focus/disabled/error, 키보드 이동, 주요 페이지를 브라우저에서 확인한다. 빌드/테스트 결과와 미검증 구간을 함께 보고한다.
12. 완료 후 대상 프로젝트 AGENTS.md에 사용 버전, 이 가이드의 위치, 재적용 명령을 기록한다. 이후 테마 변경은 토큰 수정으로 처리한다.

## 재사용할 사용자 지시문
"원정대 공통 디자인 시스템 레포의 README.md, DESIGN.md, docs/APPLY.md를 읽고 이 프로젝트에 브랜드 컬러를 적용해. 기존 동작을 유지하고 테마 토큰을 연결한 다음 주요 화면의 라이트/다크와 대비를 검증해. 수정 파일과 수동 작업이 남은 부분을 보고해."

## 적용 범위
- HTML/CSS/React/Vue/Svelte: CSS와 토큰을 사용할 수 있지만 최초 연결은 필요하다.
- 이미 역할 토큰을 연결한 앱: 패키지 버전 갱신 및 테마 변경으로 연결된 요소를 일괄 변경한다.
- 기존 제각각의 CSS: AI가 최초 매핑·수정해야 한다. 사용자 지시 한 번으로 시작할 수 있지만 무검증 완료를 보장하지 않는다.
- Figma: JSON 기준을 수동으로 Variables에 매핑한다. Figma 플러그인·자동 동기화는 구현하지 않았다.
- 네이티브 앱/슬라이드/인쇄물: JSON과 규칙만 재사용하며 플랫폼별 구현이 필요하다.

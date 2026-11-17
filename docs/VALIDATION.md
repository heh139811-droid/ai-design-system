# v0.1 검증 결과 · 2026-11-17

## 구조 개정 2 · Foundations / Components / Patterns

- 브랜드 원본 6색·권장 비율은 유지했다. `tokens/system.json`에 간격·모서리·사이즈·타이포그래피·레이아웃·컴포넌트 규칙을 구현 제안으로 분리했다.
- Figma 생성 코드: 12개 Component Sets / 146개 변형 / 9개 Text Styles / 8개 Patterns. Text Styles의 서체·크기·줄높이는 Variables에 연결하고, 컴포넌트의 패딩·간격·반경·버튼 높이를 직접 또는 별칭으로 연결한다.
- 원본 → 의미 역할 → 컴포넌트, 수치 → 컴포넌트 별칭, 타이포그래피 Variables → Text Styles → 텍스트 관계를 API 모형으로 검사한다. 각 컴포넌트의 목적·구조·사용·접근성·반응형·코드 대응 규칙과 기본 Prototype 전환도 검사한다.
- `npm run build` 성공, `npm test` 16개 통과, `npm run check`(공식 Figma 타입 검사 포함) 통과. 현재 등록된 Downloads/wonjeongdae-figma-kit-v0.1.0의 실행 파일을 교체했고 생성물과 SHA-256 일치를 확인했다.
- 새 개정 키로 생성하므로 기존 5종 컴포넌트 결과·사용자 화면은 유지한다. 기존 인스턴스의 자동 마이그레이션은 하지 않는다.
- Figma 앱은 실행 중인 것이 확인됐지만 앱 선택 도구가 `Computer Use was not approved to use Figma`를 반환했다. 실제 생성·레이아웃·토큰 변경 전파·Prototype 조작·팀 게시 결과는 미검증이다. 자동 검사 통과를 실제 Figma 실행 성공으로 설명하지 않는다.
- 실제 검수 항목은 docs/SYSTEM.md의 인수 조건을 따른다. 팀 공유·승인·전사 담당자 확정은 남아 있다.

## 이전 구조의 검증 기록
- 실제 실행의 `not a function`은 잘못된 테마 API 이름으로 확인했다. `setExplicitVariableModeForCollection`으로 수정하고 공식 @figma/plugin-typings 기반 TypeScript 검사를 npm run check에 추가했다. 실패 시 부모에 붙기 전 생성된 프레임도 제거한다. 실제 Figma 재실행 검증은 아직 필요하다.
- 실제 개인 테스트에서 ID 없는 플러그인의 private getPluginData 호출 오류가 확인되어 공유 문서 메타데이터로 교체했다. 자동 검사에서는 private 데이터 API를 호출하면 오류가 나도록 해 회귀를 검증한다. 실제 Figma 재실행 결과는 아직 확인 전이다.
- `npm run build`: CSS, Figma 생성 도구, 오프라인 허브 생성 성공.
- `npm test`: 15개 통과. 기존 8개와 Figma 생성 도구 6개, 허브 실행 흐름 1개를 확인했다.
- Figma API 모형 검사: 6색과 역할별 별칭, 변형 5종, 6개 템플릿, 단일 모드 플랜 대응, 재실행 보존, 실패 시 정리, 글꼴 부재 시 생성 중단.
- 허브 모형 검사: 공유 주소 연결 전/후 초기화, Figma ZIP 다운로드, 클립보드 미지원 시 수동 복사, 설정 안내 열기.
- `npm run check`: 생성물과 원본의 일치 여부를 검사한다.
- 실제 브라우저 접근 호스트가 unavailable을 반환했다. 이번 화면의 시각·반응형·키보드·실제 다운로드 동작은 브라우저에서 미검증이다.
- Figma 연결과 대상 팀 파일이 없어 실제 Figma API 실행·한글 렌더·텍스트 잘림·게시·팀 공유는 미검증이다. 자동 검사는 Figma 런타임을 대체하지 않는다.
- 최초 마이그레이션: 기존 Figma 파일과 소비 웹 프로젝트는 수정하지 않았다. 담당자가 생성 도구를 최초 등록·실행하고 결과를 검토한 뒤 파일 공유/게시 및 `config/hub.json`의 공유 주소 연결을 진행해야 한다.
- 6색과 권장 구성은 변경하지 않았다. 컴포넌트·서체·레이아웃 수치는 구현 제안이다.

## 초기 구현 검증 기록 (아래 4개는 당시 결과)
- npm run build: CSS 생성 성공.
- npm test: 4개 테스트 통과. 원본 6색과 비율 합계, 양 테마의 본문/링크/CTA/포커스/테두리 대비, 생성 CSS 최신성, 소비 프로젝트 파일 복사와 기존 폴더 보호 확인.
- npm run check: 원본 토큰과 생성 파일 일치.
- npm pack --dry-run: 설치 패키지에 토큰·CSS·도입 스크립트·가이드 포함 확인.

## 수치
- charcoal / soft-white: 12.98:1.
- charcoal / soft-mint: 13.17:1.
- charcoal / key: 11.07:1.
- deep-green / soft-white: 4.33:1. 작은 본문에 사용하지 않는다.
- deep-green / soft-mint: 4.39:1. 큰 브랜드 제목에만 사용한다.

## 미검증 및 한계
- 브라우저 자동화 호스트가 unavailable을 반환하여 실제 렌더·반응형·키보드 시각 검증은 수행하지 못했다. examples/index.html을 로컬 브라우저에서 열어 확인해야 한다.
- 텍스트 대비 검사는 지정된 불투명 단색 역할 조합에 한정된다. 사진·그라데이션 위 텍스트의 대비를 보장하지 않는다.
- 사용자 실제 프런트엔드에 대한 연결·마이그레이션은 수행하지 않았다. 최초 검증은 이전 NestJS 백엔드 작업 폴더에서 진행했고, 현재는 독립 디자인 시스템 레포다.
- CI 설정 파일은 작성했으며 GitHub에서 실행된 결과는 별도로 확인해야 한다.
- 공식 Figma 라이브러리, Astryx 어댑터, 로고·사진·폰트 원본은 포함하지 않는다.

# Figma 디자인 시스템 · 구조 개정 2

## 개인 테스트: 이미 등록했다면

현재 등록된 **원정대 기본 라이브러리 생성**을 다시 실행합니다. 생성 도구 이름은 기존 등록을 유지하기 위해 그대로 둡니다.
이번 개정은 기존 화면 예시와 별개의 페이지·Variables를 생성하고, **01 Foundations**의 시작 안내를 엽니다.
이미 같은 개정을 생성했다면 해당 페이지를 열며 사용자 수정을 덮어쓰지 않습니다.

## 처음 등록한다면

1. 허브에서 Figma 생성 도구 ZIP을 받아 압축을 풉니다. `manifest.json`과 `code.js`가 같은 폴더에 있는지 확인합니다. README.md·SYSTEM.md·JSON 두 개도 함께 제공됩니다.
2. Figma 데스크톱의 빈 Design 파일에서 Plugins → Development → Import plugin from manifest로 `manifest.json`을 등록합니다.
3. Development → **원정대 기본 라이브러리 생성**을 실행합니다. 개인 테스트에는 팀 게시가 필요하지 않습니다.
4. 생성된 Foundations·Components·Patterns를 확인합니다. 실제 폰트·글자 잘림·Auto Layout·속성·Prototype 검증이 필요합니다.

로컬 등록에는 게시된 plugin ID를 임의로 추가하지 않습니다. 재실행 정보는 공유 문서 메타데이터에 저장합니다. 환경에서 등록 ID를 요구하면 Figma의 New plugin으로 발급받은 값을 사용합니다.

## 파일에서 무엇을 보나

- **01 Foundations**: 색상 원본과 Semantic 별칭, 간격·모서리·크기 Variables, 9개 연결된 Text Styles, 레이아웃·접근성·기여 규칙, 생성 객체 수를 계산한 Inventory.
- **02 Components**: Button, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Card, Tabs, Navigation, Modal. 각 컴포넌트 옆에 anatomy·사용 규칙·반응형·접근성·코드 대응 범위가 있습니다.
- **03 Patterns**: 360·768·1440px 문의 화면과 모달 구성, 라이트·다크 총 8개 패턴. 화면은 컴포넌트 인스턴스를 사용합니다.

Button은 우선순위 3종·크기 2종·상태 6종·테마 2종, 72개 변형입니다. 전체는 12개 Component Sets·146개 변형입니다.
텍스트와 Boolean 표시 속성을 편집하고 Theme·State 등 Variant를 선택합니다. Button, Card, Tabs 등을 중첩 인스턴스로 재사용합니다.
기본 버튼·선택·탭 상호작용을 Prototype에 연결하지만, 입력 데이터 처리나 웹 접근성 동작을 구현한 서비스는 아닙니다.

Light/Dark 두 번째 모드가 허용되지 않으면 Semantic 컬렉션을 테마별로 분리합니다. 페이지·Variables 등 다른 플랜 제한은 Figma 오류로 표시될 수 있습니다.
구조 수치·사용 규칙·인수 조건의 전체 내용은 함께 제공되는 **SYSTEM.md**에 있습니다.

## 팀에 배포하기

팀원은 공유 파일의 Patterns 화면을 복제하거나 Assets의 WJ 컴포넌트를 선택해 문구·상태·크기를 바꿉니다. 인스턴스 분리를 피합니다.
담당자가 검토 후 파일을 공유하거나 가능한 플랜·권한에서 팀 라이브러리로 게시합니다. 현재 공개 플러그인 등록이나 전사 게시가 완료된 것은 아닙니다.
실제 공유 주소를 `config/hub.json`의 `figmaLibraryUrl`에 넣고 빌드하면 허브의 열기 버튼이 활성화됩니다.
파일 복제본과 오프라인 HTML은 자동 갱신되지 않습니다. 같은 버전의 배포본을 사용하세요.

## 기준·마이그레이션·검증

브랜드 확정값은 tokens/brand.json의 6색과 권장 구성입니다. tokens/system.json은 구현 제안이며, 폰트·모서리·간격·컴포넌트를 전사 확정 규칙으로 취급하지 않습니다.
로고·사진·정식 폰트 원본은 제공되지 않았습니다. 브랜드 글자는 정식 로고가 아닙니다.
기존 생성 결과를 삭제하거나 기존 인스턴스를 자동 교체하지 않습니다. 이전 파일에 연결하는 최초 마이그레이션은 담당자 작업입니다.
실패 시 이번 실행에서 만든 페이지·노드·스타일·Variables·컬렉션만 정리합니다. 사용자의 기존 내용은 건드리지 않습니다.
자동 검사는 공식 Figma 타입 검사와 API 모형의 구조·관계 검사입니다. 실제 Figma 실행·시각 검수·토큰 전파·게시 결과는 별도 확인해야 합니다.
도구에는 네트워크 요청이 없으며 공식 Figma 연동이나 자동 동기화 제품이 아닙니다.

API 기준: [Variables](https://developers.figma.com/docs/plugins/working-with-variables/), [Text Style bindings](https://developers.figma.com/docs/plugins/api/properties/TextStyle-setboundvariable/), [Variants](https://developers.figma.com/docs/plugins/api/properties/figma-combineasvariants/).

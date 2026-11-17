# 원정대 디자인 시스템 · 구조 개정 2

상태: 구현 초안. 브랜드 이미지의 확정값과 제품 구현 제안을 구분한다. Figma 도구 생성은 전사 승인·게시 완료를 뜻하지 않는다.

## 시스템 구조

1. `tokens/brand.json`: 원본 6색, 권장 구성과 웹 역할 매핑. 이 개정에서 원본 색상·비율은 변경하지 않았다.
2. `tokens/system.json`: 간격·모서리·컨트롤 크기·타이포그래피·레이아웃·컴포넌트 계약. 모든 수치는 구현 제안이다.
3. Figma Brand → Semantic → 컴포넌트 fills/strokes. Dimensions → Component aliases → 높이·모서리, Dimensions → Auto Layout padding/gap. Typography Variables → Text Styles → 텍스트.
4. Components → 실제 인스턴스를 사용하는 Patterns. 인스턴스를 분리하지 않고 텍스트·표시·변형으로 편집한다.

## 파일 탐색

- **01 Foundations**: 시작 안내, 색상 원본과 역할, 연결된 타이포그래피 표본, 간격·반경, 반응형·접근성·기여 규칙, 생성 객체에서 계산한 inventory.
- **02 Components**: 12종의 사용 문서와 Variant 매트릭스. 각 문서는 purpose, anatomy, usage, accessibility, responsive, code mapping을 포함한다.
- **03 Patterns**: 360·768·1440px 문의 화면과 모달 구성의 Light/Dark 예시. 총 8개이며 완성된 서비스나 동작하는 입력 양식이 아니다.

## Foundations

색상 원본은 6색을 유지한다. 라임은 작은 CTA·라인·아이콘에만 사용한다. 작은 본문은 차콜/밝은 바탕 조합을 사용한다. 딥그린/밝은 바탕은 작은 본문 대비 기준을 충족하지 않아 큰 브랜드 제목에만 쓴다. 40/10/20/30은 브랜드 시각물 권장 구성이다.

공간은 0·4·8·12·16·20·24·32·40·48·64px, 반경은 0·4·12·20·999px을 제안한다. Auto Layout의 패딩·간격과 반경은 Variables에 실제로 바인딩한다. 버튼 크기는 SM 44px, MD 48px로 제안하고 숫자 별칭을 통해 바인딩한다.

타이포그래피는 display, heading-lg/md/sm, body-lg/md/sm, label, caption의 9개 Text Styles다. 각 스타일의 fontFamily·fontSize·lineHeight를 Variables에 바인딩한다. 사용 가능한 Noto Sans KR, Malgun Gothic, Inter 순으로 대체 서체를 선택하고 Regular와 제공되는 Bold/Semibold를 사용한다. 지정 브랜드 서체나 승인 폰트로 소개하지 않는다.

레이아웃은 360px/4열/좌우20/거터16, 768px/8열/좌우32/거터24, 1440px/12열/좌우64/거터24를 제안한다. 패턴에 편집 가능한 숨김 Layout Grid가 포함된다. 이 기준은 내용에 맞춰 검토하며 자동 반응형 엔진을 의미하지 않는다.

## Components

- **Button**: Primary/Secondary/Ghost × SM/MD × Default/Hover/Pressed/Focus/Disabled/Loading × Light/Dark, 72개 변형. Label과 leading icon 표시 속성. Primary는 영역별 하나를 권장한다.
- **Input, Textarea, Select**: Default/Focus/Error/Disabled × Light/Dark. Label·Value·Help 텍스트와 Help 표시 옵션. Select의 드롭다운은 디자인 표본이며 옵션 선택 엔진이 아니다.
- **Checkbox, Radio, Switch**: Off/On × Default/Focus/Disabled × Light/Dark. 문구·형태·위치로 선택 상태를 구분한다. Radio는 실제 구현에서 그룹 단일 선택을 유지한다.
- **Badge**: 짧은 분류를 표현한다. 의미가 다른 상태를 초록의 농담만으로 구별하지 않는다.
- **Card**: Title·Body·Show action 속성, 내부 Button 인스턴스. 긴 본문을 고정 높이로 자르지 않는다.
- **Tabs**: First/Second × Light/Dark, 탭별 CHANGE_TO 기본 프로토타입.
- **Navigation**: Wide/Compact × Light/Dark, 내부 Tabs 인스턴스. 브랜드 글자는 정식 로고가 아니다.
- **Modal**: Title·Body와 Primary/Secondary Button 인스턴스. 실제 dialog 동작·닫기·포커스 관리는 제품 구현에서 제공한다.

Button의 기본 hover/pressed 전환, Checkbox/Switch 토글, Radio 선택, Tabs 전환은 Figma 프로토타입 예시다. Disabled/Loading에는 행동을 연결하지 않는다. 브라우저·스크린리더·입력 데이터 처리 기능으로 설명하지 않는다.

모든 컴포넌트의 상세 규칙은 `system.json`에 있으며 Figma 사용 문서로도 생성된다. 웹 CSS가 제공하는 클래스는 Button/Input/Card/Badge 등 기존 범위다. 모든 Figma 컴포넌트에 대응하는 React·Vue 구현이 있다고 주장하지 않는다.

## 접근성·콘텐츠 계약

- 일반 텍스트 대비 4.5:1, 큰 텍스트 3:1 기준으로 검사한다. 사진·그라데이션·불투명도 합성은 별도 검수한다.
- 클릭 영역 44px 이상, 포커스 3px을 제품 제안으로 사용한다. 포커스는 키보드 이동 중 보여야 한다.
- 입력 라벨을 항상 표시하고 오류 문구에 원인과 해결 방법을 적는다. label/for, aria-describedby, aria-invalid를 실제 제품에서 연결한다.
- 탭은 tablist/tab/tabpanel과 방향키·Home/End를 구현한다. 모달은 focus trap·Escape·닫힌 후 포커스 복귀를 구현한다.
- 새 상태색을 임의로 추가하지 않는다. 색상 외 문구·선택 표시·형태로 의미를 전달한다. 별도 의미색은 제품 요구와 검토를 거쳐 추가한다.
- 한국어 긴 제목·값·오류 안내, 200% 확대, 360px 화면, 키보드 순서와 스크린리더를 최종 제품에서 확인한다.

## 운영·변경·마이그레이션

브랜드 담당자는 원본 색과 자산을, 디자인 시스템 담당자는 컴포넌트·역할·제안을, 제품 개발 담당자는 코드와 접근성 동작을 검토한다. 이는 권장 역할이며 실제 담당자 이름과 승인 권한은 조직이 정해야 한다.

제안은 허브 의견 기능으로 모은다. 변경에는 이유·영향 컴포넌트·호환성·이전/이후·마이그레이션·실제 검사 결과를 기록한다. 검토 후 원본을 수정하고 build/test/check를 수행한 뒤 담당자가 Figma 결과를 확인하고 게시한다.

개정 2는 기존 5종/6개 화면 생성 결과와 다른 키를 사용해 별도 페이지·컬렉션을 만든다. 기존 화면을 자동 마이그레이션하거나 삭제하지 않는다. 같은 개정 재실행은 기존 시작 페이지를 열어 사용자 수정을 보존한다. 새 개정에서 다시 생성된 자산은 기존 인스턴스의 자동 교체가 아니므로 담당자 매핑이 필요하다.

게시·권한·플랜·실제 공유 파일 주소가 확정되기 전까지 전사 배포 완료로 표시하지 않는다. 오프라인 허브와 복제 파일은 자동 업데이트되지 않는다.

## 인수 조건

1. 실제 Figma에서 3개 페이지가 생성되고 Inventory와 12개 Component Sets·9개 Text Styles가 보인다.
2. 복제한 파일에서 spacing/radius/typography와 의미 색 Variables를 바꿨을 때 연결된 요소가 갱신된다.
3. 인스턴스의 Theme·Hierarchy·Size·State·Boolean·텍스트 속성을 편집하고 긴 한글이 잘리지 않는지 확인한다.
4. 인스턴스의 기본 상호작용을 Prototype에서 확인한다. 라디오 그룹·입력·모달 동작은 별도 제품 검수 대상이다.
5. 같은 개정을 재실행해 중복 생성이나 사용자 수정 덮어쓰기가 없는지 확인한다.
6. 원본 자산·브랜드 승인·공유 권한·전사 담당자·업데이트 절차를 확정한 뒤 게시한다.

구조 자동 검사와 실제 렌더·배포 검증은 별개로 기록한다.

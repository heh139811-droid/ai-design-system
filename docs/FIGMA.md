# Figma 기본 라이브러리 · v0.1.0

## 팀원이 사용하는 방법
담당자가 공유한 Figma 파일을 열고 `03 템플릿`의 화면을 복제해 문구를 바꿉니다.
같은 파일에서는 Assets의 WJ 컴포넌트를 끌어와 Theme / State 변형과 텍스트 속성을 선택합니다.
파일을 복제하면 스냅샷으로 사용하며 원본 업데이트가 자동 반영되지 않습니다.
팀 라이브러리로 게시한 경우 팀원이 해당 라이브러리를 활성화해 사용합니다. 게시 가능 여부는 조직의 플랜·권한에 따라 다릅니다.

## 담당자 최초 설정
1. 허브의 **Figma 생성 도구 ZIP 받기**를 눌러 다운로드하고 압축을 풉니다.
2. Figma 데스크톱 앱에서 비어 있는 Figma Design 파일을 만듭니다. 생성 도구에는 파일 편집 권한이 필요합니다.
3. Plugins → Development → Import plugin from manifest에서 `manifest.json`을 선택합니다.
   환경에서 plugin ID를 요구하면 Development → New plugin으로 ID를 발급받고, 발급된 ID를 이 manifest의 `id`에 추가합니다. ID를 임의로 만들지 않습니다.
4. Development 메뉴에서 **원정대 기본 라이브러리 생성**을 실행합니다.
5. 생성된 `01 기준`, `02 컴포넌트`, `03 템플릿` 페이지를 검토합니다. 한글 표시·텍스트 잘림·Auto Layout·모드·변형을 확인합니다.
6. 파일 링크를 팀에 공유합니다. 팀 라이브러리 게시가 가능한 플랜이면 검토 후 Publish하고 팀원에게 활성화 방법을 안내합니다.
7. 담당자는 `config/hub.json`의 `figmaLibraryUrl`에 공유 주소를 넣고 `npm run build` 후 새 START.html을 배포합니다.

개발용 생성 도구의 최초 등록은 담당자 작업입니다. 일반 팀원은 공유 파일에서 복제하거나 Assets에서 선택합니다.
공개 플러그인 등록이나 전사 라이브러리 게시가 완료된 상태는 아닙니다.

## 생성 내용
- 원본 6색 Variables와 역할별 색상 별칭.
- Light / Dark 모드. 플랜이 두 번째 모드를 허용하지 않으면 테마별 컬렉션으로 자동 분리합니다.
- Button: Default / Hover / Focus / Disabled.
- Input: Default / Focus / Error / Disabled. 오류는 문구로 표시하고 새 상태색을 추가하지 않습니다.
- Card, Navigation(Default / Active), Modal.
- 각 컴포넌트의 Light / Dark 변형, Auto Layout, 편집 가능한 텍스트 속성.
- 1440px 웹 시작 화면, 360px 모바일 시작 화면, 720px 문의 양식의 라이트·다크 총 6개 템플릿.

같은 버전을 다시 실행하면 생성된 템플릿 페이지를 엽니다. 사용자의 수정 내용을 덮어쓰거나 기존 컴포넌트를 자동 마이그레이션하지 않습니다.
생성 도중 실패하면 이번 실행에서 만든 페이지·Variables·컬렉션을 제거합니다. 새 버전은 복제한 파일에서 검토 후 게시하세요.

## 기준과 검증 한계
브랜드 확정값은 tokens/brand.json의 6색과 권장 구성입니다. 간격·라운드·레이아웃·컴포넌트는 구현 제안입니다.
Noto Sans KR → Malgun Gothic → Inter 순으로 사용 가능한 Regular 글꼴을 선택합니다. 정식 브랜드 서체가 아니며 한글 글리프는 Figma에서 확인해야 합니다.
로고 벡터·사진 원본·정식 폰트는 포함하지 않습니다. 메뉴의 원정대 글자는 로고 자산이 아닙니다.
플러그인은 네트워크 요청을 하지 않으며 공식 Figma 연동·자동 동기화 제품이 아닙니다. 템플릿은 디자인 예시이며 클릭 동작을 구현한 프로토타입은 아닙니다.
로컬 자동 검사는 API 모형에서 생성·재실행·실패 정리를 검증합니다. 실제 Figma 생성·렌더·게시 검증은 별도로 필요합니다.

API 기준: [Figma Plugin Manifest](https://developers.figma.com/docs/plugins/manifest/), [Variables](https://developers.figma.com/docs/plugins/api/figma-variables/), [Variants](https://developers.figma.com/docs/plugins/api/properties/figma-combineasvariants/).

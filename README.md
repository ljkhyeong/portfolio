# 임정규 백엔드 개발자 포트폴리오

KICS 요청을 기관별 규격으로 변환해 전달하고 제출 자료를 KICS에 반영하는 서버와 Spring Batch를 개발합니다. 개인 프로젝트에서는 결제 orderId와 환불 UUID를 재사용하고, DB에 남은 알림 작업을 스케줄러가 다시 처리하도록 구현했습니다.

## 경력 프로젝트

-   **전송형 전자영장 시스템**: BEINTECH 소속으로 LG CNS 컨소시엄에 참여해 KICS 요청을 통신사와 집행포털 규격으로 변환해 전달하고, 제출 자료를 KICS에 반영하는 서버와 Spring Batch를 개발 중입니다.
-   **차세대 군사법 정보 시스템**: 군사법원, 군검찰 및 군사경찰의 수용자 자료를 검증해 군교정 DB에 반영하는 배치를 개발했습니다. Jenkins 실행 이력, JEUS 로그와 Tibero 상태로 중단된 기관 배치를 찾아 필요한 배치만 재실행했습니다. CSRF 차단과 대용량 파일의 저장소 직접 업로드도 구현했습니다.

## 개인 프로젝트

-   **BATON**: Core에서 조직, 역할, 반복 업무, 결정과 인수인계를 관리합니다. 짧은 링크, URL 점검, 이벤트 전달, 주간 보고서, 캘린더 구독과 WebRTC 스터디룸은 6개 서비스로 분리했습니다. Core와 BRIEF, CAL 및 ROUND는 로컬에서 연결했으며 공개 환경 전체 연동은 미검증입니다.
-   **happyGallery**: 카드와 네이버페이 및 카카오페이 결제, 스마트스토어 상품, 재고, 주문, 문의와 정산 운영을 구현했습니다. 최신 기능은 공개 `main`에 반영했으며 실제 네이버 판매자 및 PG 계정 연동은 미검증입니다.

## 웹앱 프로젝트

-   **청년정책메이트**: 정책 조건을 가능, 불가, 추가 확인 필요로 판정해 근거와 기준일을 표시하고, 확인한 마감만 D-7, D-3 및 D-1 알림 후보로 계산합니다. 공개 `main`의 CI와 서버 테스트 341개가 통과했습니다. 온통청년 인증키는 승인 대기 중이며 실제 정책 수집 및 추천, 로그인, 저장과 알림 발송은 아직 구현하지 않았습니다.

## 오픈소스 및 개발 도구

-   **Hope Commit**: SeungIl 님의 Hope 6.0.0에서 파생한 비공식 포크입니다. 입력한 커밋만 검토하고 실제 변경 줄이 근거인 결과를 HTML로 저장하는 Commit Diff를 추가했습니다. 공개 릴리스와 `main`은 v5.0.2이며 자동화 테스트 343개가 통과했습니다. 원본 Hope 프로젝트는 이 포크를 보증하거나 유지보수하지 않습니다.
-   **IntentTrace**: AI 코드 변경의 요청과 판단 출처를 전체 길이 커밋 ID, 코드 위치 및 실제 검증에 연결합니다. 작성자가 확인한 기록은 GitHub와 IntelliJ에서 조회할 수 있습니다. v0.7.0 실행 JAR과 IntelliJ 플러그인을 공개했으며 공개 `main`은 0.8.0-SNAPSHOT입니다.

## 교육 프로젝트

-   **WebRTC/HLS 현장강의 보조 서비스**: 2023년 6인 팀에서 WebRTC 실시간 화면과 RTP-HLS 변환 서버 및 다시보기 화면을 구현했습니다. 팀 시연 환경에서 HLS 재생 지연을 약 35초에서 약 17초로 줄였습니다.

## 실행

Node.js 22를 사용합니다. 로컬 개발과 GitHub Actions는 `.nvmrc`를 기준으로 실행하고,
Netlify는 `netlify.toml`의 `NODE_VERSION`을 사용합니다.

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
npm run preview
```

Vite 빌드 결과는 `build/`에 생성됩니다. Netlify는 배포 전에 전체 테스트와 빌드를
실행합니다. 빌드 후에는 프로젝트별 링크 미리보기 정보를 담은 정적 HTML과 404
페이지를 만듭니다.

공개 경로를 추가하거나 `noindex` 여부를 바꾼 뒤에는 `routeMeta`를 기준으로 sitemap을
갱신하고 검사합니다. 프로덕션 빌드는 추적 중인 sitemap을 자동으로 고치지 않고 현재
경로 목록과 같은지만 확인합니다.

```bash
npm run sitemap:generate
npm run sitemap:check
```

## 공개 문서 검색

`/search`에서는 프로젝트 개요, 구현 방법과 선택 이유, 문제 해결 방법과 공개한 대표 문서를 검색할 수
있습니다. 기본 설정은 API 키 없이 Elasticsearch의 단어 일치도 검색인 BM25만 실행합니다.
OpenAI 또는 Ollama 실행 설정에서는 BM25 결과와 의미 유사도를 계산한 벡터 검색 결과를
각 순위의 역수 점수로 합치는 RRF 방식으로 정렬합니다. 이 순위 결합 로직은 Java로
구현했습니다. AI 답변은 검색과 분리되어 있으며, 사용자가 요청할 때만 검색된 공개 문서를
대규모 언어 모델(LLM)에 전달합니다. 답변 생성이 중단되어도 검색 결과와 원문 링크는 그대로
유지됩니다.

-   프론트엔드: 현재 React 및 Netlify 애플리케이션
-   검색 API: `knowledge-api/`의 별도 Spring Boot 애플리케이션
-   검색 저장소: Elasticsearch
-   운영 AI: OpenAI API
-   로컬 AI: Ollama 프로필

공개 검색 자료는 포트폴리오 데이터와 명시적으로 허용한 Markdown에서만 생성합니다.
빌드 중 외부 문서를 내려받지 않으며, 회사 비공개 자료와 Obsidian 원문은 포함하지
않습니다.

```bash
npm run knowledge:generate
cp .env.example .env.local
npm run dev
```

`VITE_KNOWLEDGE_API_BASE_URL`에는 로컬 또는 운영 Knowledge API 주소를 설정합니다. API
키는 브라우저 환경 변수에 넣지 않습니다. Elasticsearch, Spring Boot API, OpenAI 및
Ollama 프로필의 실행 방법은 `knowledge-api/README.md`를 확인합니다.

## PDF

-   최신 파일: `public/임정규_포트폴리오.pdf`
-   React 인쇄 원본: `src/component/print/PortfolioPrintPage.jsx`
-   인쇄 스타일: `src/css/PortfolioPrint.css`
-   로컬 미리보기: `http://localhost:5173/portfolio/print`

```bash
npm run dev
npm run pdf:generate
npm run pdf:generate:edge
npm run pdf:generate:safari
npm run pdf:check
```

`pdf:generate`는 임시 Vite 서버를 열고 Chrome으로 이미지 및 폰트가 모두 표시되는지와
A4 페이지 밖으로 내용이 넘치는지 검사한 뒤 배포용 기준 파일인
`public/임정규_포트폴리오.pdf`를 교체합니다. Edge 미리보기는
`output/pdf-preview/임정규_포트폴리오-edge.pdf`에 따로 저장합니다. 실행 파일을 자동으로
찾지 못하면 `PDF_BROWSER_PATH`, `CHROME_PATH` 또는 `EDGE_PATH`로 경로를 지정합니다.

macOS에서는 `pdf:generate:safari`가 Safari와 같은 WebKit으로 인쇄 화면을 렌더링하고,
인쇄 창을 열지 않은 채 `output/pdf-preview/임정규_포트폴리오-safari.pdf`에 저장합니다.
Edge와 Safari 결과는 브라우저 호환성 확인용이며 배포용 PDF를 덮어쓰지 않습니다. Safari
명령은 Apple의 Swift, AppKit과 WebKit을 사용하므로 Windows, Linux와 Netlify에서는 실행하지
않습니다. PDF를 갱신한 뒤
`npm run build`를 실행하면 최신 파일이 `build/`에도 포함됩니다.
`pdf:check`는 인쇄에 사용하는 파일 내용으로 계산한 SHA-256 값과 PDF 파일 자체의
SHA-256 값을 생성 기록과 비교합니다. 이 검사는 프로덕션 빌드에서도 자동으로 실행됩니다.

인쇄본과 홈 웹 화면은 `src/data/profile.js`, `src/data/projectSummaries.js`를 함께 사용하고,
웹 프로젝트 상세는 `src/data/projects.js`의 근거와 문제 해결 내용을 추가로 사용합니다.
기존 `/portfolio-pdf/index.html` 주소는 배포 환경에서 최신 PDF로 이동합니다.

## 공유 이미지

홈 링크는 `public/og-cover.png`, 프로젝트 상세 링크는 `public/og/`의 개별 이미지를
사용합니다. BATON의 6개 서비스도 이름과 처리 흐름을 구분합니다. 공유 이미지 문구와 경로는
`src/data/projectOg.js`, 카드 화면은 `src/component/share/ProjectOgPreview.jsx`에서 관리합니다.
변경 후 다음 명령으로 1200×630 이미지와 생성 기록을 함께 갱신합니다.

```bash
npm run og:generate
npm run og:check
```

`og:generate`는 홈 1개와 상세 14개를 생성하고 렌더링 원본 및 PNG의 SHA-256을 기록합니다.
`og:check`는 전체 이미지의 크기, 파일 변경 여부와 원본 갱신 여부를 검사합니다.
이 검사는 프로덕션 빌드에서도 자동으로 실행됩니다. 개발 서버에서
`/og-preview.html?project=baton-relay`처럼 확인할 수 있으며, 미리보기 HTML은 배포에 포함하지 않습니다.

## 화면 디자인 기준과 출처

[Hamish Williams 님의 포트폴리오](https://hamishw.com/projects/slice)를 참고해
어두운 배경, 큰 대표 화면과 짧은 소개, 구현 설명 옆의 관련 이미지 배치를 적용했습니다.
원본 프로젝트 이미지와 로고는 가져오지 않았으며, 이 저장소의 화면과 처리 흐름도를 사용합니다.
상세페이지 하단에도 디자인 출처를 표시합니다.

메인과 상세의 색상, 본문 폭과 글자 크기는 `src/css/PortfolioTheme.css`에서 함께 관리합니다.
섹션 제목은 36px, 두께 550, 줄 간격 1.3으로 통일합니다. 공통 헤더는
`src/component/PortfolioNavigation.jsx`와 `src/css/PortfolioNavigation.css`에서 관리하며,
메인 메뉴와 상세 전용 이동 메뉴를 같은 아바타와 이름 옆에 표시합니다.

상세 전용 배치는 `src/css/CaseShowcase.css`에서 관리합니다. 대표 이미지를 상단과 본문으로
나눠 배치해도 확대 창에서는 전체 이미지를 순서대로 확인할 수 있습니다. 인쇄용 페이지는
`src/css/PortfolioPrint.css`에서 밝은 배경과 인쇄용 크기를 별도로 적용합니다.

상세페이지는 1440px 및 1920px 데스크톱 화면을 기준으로 확인합니다. 본문은 18px,
보조 설명과 메뉴 및 구성도 설명은 16px로 표시합니다.

배포: [ljkportfolio.netlify.app](https://ljkportfolio.netlify.app/)

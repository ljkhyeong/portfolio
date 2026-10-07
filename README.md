# 임정규 백엔드 개발자 포트폴리오

외부 연동과 배치를 개발하는 Java 백엔드 개발자 임정규의 포트폴리오입니다. 멱등 처리, 동시성 제어, 중단된 작업의 재처리를 주로 구현해 왔고, 지금은 5개 기관이 쓰는 전자영장 연계 서버를 개발합니다.

## 경력 프로젝트

-   **전송형 전자영장 시스템**: BEINTECH 소속으로 LG CNS 컨소시엄에 참여해 KICS 요청을 통신사와 집행포털 규격으로 변환해 전달하고, 제출 자료를 KICS에 반영하는 서버와 Spring Batch를 개발 중입니다.
-   **차세대 군사법 정보 시스템**: 군사법원, 군검찰 및 군사경찰의 수용자 자료를 검증해 군교정 DB에 반영하는 배치를 개발했습니다. Jenkins 실행 이력, JEUS 로그와 Tibero 상태로 중단된 기관 배치를 찾아 필요한 배치만 재실행했습니다. CSRF 토큰 검증과 Presigned URL 기반 대용량 파일 업로드도 구현했습니다.

## 개인 프로젝트

-   **BATON**: Core에서 조직, 역할, 반복 업무, 결정과 인수인계를 기록합니다. 짧은 링크, URL 점검, 이벤트 전달, 주간 보고서, 캘린더 구독과 WebRTC 스터디룸은 6개 서비스로 분리했습니다. Core와 BRIEF, CAL, ROUND의 연동은 로컬에서 확인했습니다. 배포 환경에서 6개 서비스를 모두 연결하는 것은 아직 확인하지 않았습니다.
-   **happyGallery**: 카드와 네이버페이 및 카카오페이 결제, 스마트스토어 상품, 재고, 주문, 문의, 정산 연동을 구현했습니다. 공개 `main`에 병합하면 GitHub Actions가 검사한 이미지를 k3s에 롤링 배포합니다. 실제 네이버 판매자 계정과 결제사 계정 연동은 미검증입니다.

## 웹앱 프로젝트

-   **청년정책메이트**: 온통청년에서 수집한 정책 40건을 검색하고, 그중 12건은 신청 조건 일부를 가능, 불가, 추가 확인 필요로 판정해 근거를 표시합니다. 관심 정책 저장, 변경 비교, 마감 알림과 조건 규칙의 버전 관리, AI 초안 검토를 구현했습니다. 실제 OAuth, OpenAI, Resend 운영 연동은 미검증입니다.

## 오픈소스 및 개발 도구

-   **Hope Commit**: SeungIl 님의 Hope 6.0.0에서 파생한 비공식 포크입니다. 지정한 커밋만 리뷰하고 실제 변경 줄이 근거인 결과를 HTML로 저장하는 Commit Diff를 추가했습니다. 공개 릴리스와 `main`은 v5.0.2이며 자동화 테스트 343개가 통과했습니다. 원본 Hope 프로젝트는 이 포크를 보증하거나 유지보수하지 않습니다.
-   **IntentTrace**: AI 코드 변경의 요청, 변경 근거와 출처를 전체 커밋 해시, 코드 위치와 검증 결과에 연결합니다. 작성자가 확인한 기록은 웹, IntelliJ, Zed에서 조회합니다. v0.7.0 실행 JAR과 IntelliJ 플러그인을 공개했으며 공개 `main`은 0.12.3-SNAPSHOT입니다. PR Check Run 게시와 서버 운영 배포는 아직 확인하지 않았습니다.

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
페이지를 만듭니다. 상세·검색 경로의 HTML에는 Vite 매니페스트로 찾은 화면 청크와 CSS,
대표 캡처가 있는 상세의 첫 캡처를 미리 받는 태그를 넣고(`scripts/route-preload.mjs`),
매니페스트는 배포 파일에서 지웁니다.

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
키는 브라우저 환경 변수에 넣지 않습니다. 공개 AI 답변의 자동 호출을 막을 때는
Cloudflare Turnstile 공개 사이트 키만 `VITE_KNOWLEDGE_TURNSTILE_SITE_KEY`에 설정합니다.
Elasticsearch, Spring Boot API, OpenAI 및 Ollama 프로필과 Turnstile 서버 검증 설정은
`knowledge-api/README.md`를 확인합니다.

## 글꼴

화면 글꼴은 Pretendard 1.3.9(SIL OFL 1.1)에서 사이트에 쓰는 글자만 남긴 서브셋
`public/fonts/portfolio-sans.woff2`입니다. Pretendard가 예약 글꼴 이름이라 수정본의 이름은
Portfolio Sans로 바꿨고, 라이선스 원문은 `public/fonts/LICENSE.txt`에 있습니다. 화면 문구에
새 글자가 생기면 빌드 전 검사(`npm run font:check`)가 실패합니다. 이때 원본 가변 글꼴과
fontTools를 준비해 서브셋을 다시 만듭니다.

```bash
python3 -m venv .venv-font
.venv-font/bin/pip install fonttools==4.66.1 brotli==1.2.0
npm run font:subset -- --source <PretendardVariable.woff2> --python .venv-font/bin/python
```

원본은 `https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/woff2/PretendardVariable.woff2`
입니다. 서브셋을 다시 만들면 공유 이미지와 PDF도 다시 생성합니다.

## GitHub 기여 기록

메인의 기여 히트맵은 `src/data/githubActivity.json`을 읽어 그립니다. 빌드와 화면에서는
GitHub를 호출하지 않으며, 기록을 갱신할 때만 아래 명령으로 GraphQL API에서 최근 1년
기여 수를 받아 저장합니다. GraphQL API는 인증이 필요하므로 `GITHUB_TOKEN` 또는
`GH_TOKEN`을 설정합니다.

```bash
GH_TOKEN="$(gh auth token)" npm run activity:refresh
```

응답의 날짜 순서, 음수 여부와 합계가 맞지 않으면 저장하지 않습니다. 기록이 바뀌면 홈
공유 이미지와 PDF도 다시 생성합니다.

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

`pdf:generate`는 원본, PDF 파일과 생성 기록이 일치하면 브라우저 실행을 생략합니다.
갱신이 필요하면 임시 Vite 서버를 열고 Chrome으로 이미지 및 폰트가 모두 표시되는지와
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
브라우저나 외부 폰트가 바뀌어 다시 생성하려면 `npm run pdf:generate -- --force`를 사용합니다.
Edge와 Safari 미리보기에도 같은 생략 기준과 `--force` 옵션을 적용합니다.

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

`og:generate`는 홈 1개와 상세 14개 중 원본이 바뀌었거나 파일 또는 생성 기록이 없거나
손상된 항목만 생성합니다. 원본과 PNG의 SHA-256을 모두 확인하므로 파일이 존재한다는
이유만으로 생략하지 않습니다. 메인 전용 문구나 스타일 변경은 상세 이미지 재생성을 유발하지 않습니다.
브라우저나 외부 폰트 변경 등으로 전체를 다시 생성하려면 `npm run og:generate -- --force`를 사용합니다.
`og:check`는 전체 이미지의 크기, 파일 변경 여부와 원본 갱신 여부를 검사합니다.
이 검사는 프로덕션 빌드에서도 자동으로 실행됩니다. 개발 서버에서
`/og-preview.html?project=baton-relay`처럼 확인할 수 있으며, 미리보기 HTML은 배포에 포함하지 않습니다.

변경별 검증 순서와 이전 세션의 반복 작업 개선 내용은 [에이전트 검증 절차](docs/agent-validation.md)를 참고합니다.

## 화면 디자인 기준

메인은 실제 기간을 그린 연표, 경력 카드, 실제 화면을 단 프로젝트 카드로 구성합니다. 연표는
`src/data/timeline.js`가 각 프로젝트의 기간에서 막대 위치를 계산하고, 진행 중인 막대는 GitHub
기여 기록을 갱신한 날까지 그립니다. 상세 첫 화면에는 맡은 일, 기간과 상태를 두고 확인한 범위를
문장 하나로 씁니다(`src/data/caseHighlights.js`의 `caseResults`). 외부 포트폴리오를 본뜨지 않았으며,
비교한 시안과 선택 근거는 [메인 F4·상세 P4 개편 기록](docs/design-f4-2026-10-06.md)에 있습니다.

메인과 상세의 색상, 본문 폭과 글자 크기는 `src/css/PortfolioTheme.css`에서 함께 관리합니다.
섹션 제목은 `--portfolio-section-*` 토큰(38px, 두께 600, 줄 간격 1.3)으로 통일합니다. 공통 헤더는
`src/component/PortfolioNavigation.jsx`와 `src/css/PortfolioNavigation.css`에서 관리하며,
메인 메뉴와 상세 전용 이동 메뉴를 같은 아바타와 이름 옆에 표시합니다.

상세 전용 배치는 `src/css/CaseShowcase.css`에서 관리합니다. 대표 이미지를 상단과 본문으로
나눠 배치해도 확대 창에서는 전체 이미지를 순서대로 확인할 수 있습니다. 인쇄용 페이지는
`src/css/PortfolioPrint.css`에서 밝은 배경과 인쇄용 크기를 별도로 적용합니다.

상세페이지는 1440px 및 1920px 데스크톱 화면을 기준으로 확인합니다. 본문은 18px,
보조 설명과 메뉴 및 구성도 설명은 16px로 표시합니다.

배포: [ljkportfolio.netlify.app](https://ljkportfolio.netlify.app/)

# 임정규 백엔드 개발자 포트폴리오

KICS 요청을 기관별 규격으로 변환해 전달하고 제출 자료를 KICS에 반영하는 서버와 Spring Batch를 개발합니다. 개인 프로젝트에서는 결제 orderId와 환불 UUID를 재사용하고, DB에 남은 알림 작업을 스케줄러가 다시 처리하도록 구현했습니다.

## 경력 프로젝트

-   **전송형 전자영장 시스템**: BEINTECH 소속으로 LG CNS 컨소시엄에 참여해 KICS 요청을 통신사와 집행포털 규격으로 변환해 전달하고, 제출 자료를 KICS에 반영하는 서버와 Spring Batch를 개발 중입니다.
-   **차세대 군사법 정보 시스템**: 군사법원, 군검찰 및 군사경찰의 수용자 자료를 검증해 군교정 DB에 반영하는 배치를 개발했습니다. Jenkins 실행 이력, JEUS 로그와 Tibero 상태로 중단된 기관 배치를 찾아 필요한 배치만 재실행했습니다. CSRF 차단과 대용량 파일의 저장소 직접 업로드도 구현했습니다.

## 개인 프로젝트

-   **BATON**: Core가 조직, 역할과 인수인계 및 Google, Naver와 이메일 계정 연결을 관리합니다. 짧은 링크, URL 점검, 이벤트 전달, 주간 보고서, 캘린더 구독과 WebRTC 스터디룸은 6개 서비스로 분리했습니다. Core-CAL, Core-ROUND와 Core-BRIEF 내부 HTTPS는 로컬에서 확인했으며 공개 환경 전체 연결은 아직 확인하지 않았습니다.
-   **happyGallery**: 결제 및 알림 재처리와 예약 및 재고 동시성 제어에 이어 스마트스토어 주문, 재고, 문의 및 정산, Toss 결제 대사, NHN 최종 수신 결과 조회 흐름, 빈자리 알림과 다인 예약 부분취소를 구현했습니다. 최신 기능은 원격 작업 브랜치 `ba3ec0a2`에 있고 공개 `main`에는 아직 반영하지 않았습니다.

## 오픈소스 및 개발 도구

-   **Hope Commit**: SeungIl 님의 Hope 3.0.3에서 파생한 비공식 포크입니다. 입력한 커밋과 확정한 비교 기준 사이의 변경만 검토하고 실제 변경 줄이 근거인 결과만 HTML로 저장하는 Commit Diff를 추가했습니다. 최신 릴리스와 공개 `main`의 패키지 및 플러그인 버전은 모두 4.0.0입니다. 원본 Hope 프로젝트는 이 포크를 보증하거나 유지보수하지 않습니다.
-   **IntentTrace**: AI 코드 변경의 사용자 요청과 판단 출처를 전체 길이 커밋 ID, 코드 위치 및 실제 검증에 연결합니다. 원문 대화와 숨은 추론은 저장하지 않고, 작성자 확인 뒤 코드가 바뀌지 않은 기록만 팀에 공개합니다. v0.6.0 실행 JAR과 SHA-256을 공개했으며 공개 `main`은 0.7.0-SNAPSHOT입니다.

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

메신저와 채용 플랫폼의 링크 미리보기에는 `public/og-cover.png`를 사용합니다. 화면 디자인을
변경한 뒤 다음 명령으로 현재 홈 화면과 같은 1200×630 이미지를 다시 생성합니다.

```bash
npm run og:generate
npm run og:check
```

`og:generate`는 홈 화면을 이미지로 저장한 뒤 렌더링에 사용하는 파일 내용과 생성된 PNG의
SHA-256 값을 기록합니다. `og:check`는 두 값을 생성 기록과 비교해 공유 이미지가 현재 홈
화면에서 만든 파일인지 확인합니다. 이 검사는 프로덕션 빌드에서도 자동으로 실행됩니다.

배포: [ljkportfolio.netlify.app](https://ljkportfolio.netlify.app/)

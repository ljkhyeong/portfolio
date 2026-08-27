# 임정규 Backend Portfolio

Java와 Spring으로 개발한 공공 시스템, 모놀리식 애플리케이션의 Gradle 멀티모듈 구성, 마이크로서비스 경험을 정리한 React 포트폴리오입니다.

## 경력 프로젝트

-   **전송형 전자영장 시스템**: BEINTECH 소속으로 LG CNS 컨소시엄에 참여해 독립망 간 기관 연계 인터페이스와 Spring Batch를 개발한 경력 사례
-   **차세대 군사법 정보 시스템**: BEINTECH에서 수용자 인적정보 및 영장정보 연계 배치, WebSquare 요청의 CSRF 처리, Presigned URL 기반 파일 업로드와 운영 장애 대응을 수행한 경력 사례

## 개인 프로젝트

-   **BATON**: Core를 기준 데이터와 최종 권한의 주체로 두고 GO, WATCH, RELAY, BRIEF, CAL, ROUND를 변경 및 장애 처리 방식에 따라 분리한 마이크로서비스 프로젝트
-   **happyGallery**: 결제 및 환불 중간 상태와 알림 아웃박스를 DB에 남겨 미처리 작업을 복구하고, 옵션별 SKU 재고는 고정된 락 순서로 차감하는 Spring Boot 모놀리식 애플리케이션 및 React SSR 화면

## 오픈소스 및 개발 도구

-   **Hope Commit**: SeungIl 님이 개발한 Hope 3.0.3을 기반으로 포크한 비공식 프로젝트. 원본의 제한된 수집, 근거 검증과 오프라인 HTML 렌더링 구조를 활용해 Commit Diff를 추가하고 개인적인 커밋 검토 흐름에 맞게 수정 및 보완

## 교육 프로젝트

-   **WebRTC/HLS 현장강의 보조 서비스**: 2023년 6인 팀에서 HLS 서버와 React 화면을 맡아 WebRTC/RTP 미디어 경로와 HLS 변환을 구현한 교육 프로젝트

## 실행

Node.js 22를 사용합니다. Netlify 빌드도 저장소의 `.nvmrc`와 `netlify.toml`을 읽어
같은 메이저 버전을 사용합니다.

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
페이지를 만들고, 현재 코드에서 참조하지 않는 이전 포트폴리오 자산은 배포 결과에서만
제외합니다. 원본 파일은 `public/`에 보존합니다.

## 공개 문서 검색

`/search`에서는 프로젝트 개요, 설계 판단, 문제 해결과 공개한 대표 문서를 검색할 수
있습니다. 기본 설정은 API 키 없이 Elasticsearch BM25 검색만 실행합니다. OpenAI 또는
Ollama 프로필에서는 키워드 검색과 벡터 검색을 Java RRF로 합쳐 정렬합니다. AI 답변은
검색과 분리되어 있으며, 사용자가 요청할 때만 검색된 공개 근거를 LLM에 전달합니다.
답변 생성이 중단되어도 검색 결과와 원문 링크는 그대로 유지됩니다.

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

`pdf:generate`는 임시 Vite 서버를 열고 Chrome으로 이미지 및 폰트 로딩과 A4 페이지의
overflow를 검사한 뒤 `public/임정규_포트폴리오.pdf`를 교체합니다. Edge가 설치된 환경에서는
`pdf:generate:edge`로 같은 과정을 실행할 수 있습니다. 실행 파일을 자동으로 찾지 못하면
`PDF_BROWSER_PATH`, `CHROME_PATH` 또는 `EDGE_PATH`로 경로를 지정합니다.

macOS에서는 `pdf:generate:safari`가 Safari와 같은 WebKit으로 인쇄 화면을 렌더링하고,
인쇄 창을 열지 않은 채 PDF를 저장합니다. 이 명령은 Apple의 Swift, AppKit과 WebKit을
사용하므로 Windows, Linux와 Netlify에서는 실행하지 않습니다. PDF를 갱신한 뒤
`npm run build`를 실행하면 최신 파일이 `build/`에도 포함됩니다.
`pdf:check`는 인쇄 소스와 커밋된 PDF의 지문을 비교하며 프로덕션 빌드에서도 자동으로
실행됩니다.

인쇄본과 홈 웹 화면은 `src/data/profile.js`, `src/data/projectSummaries.js`를 함께 사용하고,
웹 프로젝트 상세는 `src/data/projects.js`의 근거와 문제 해결 내용을 추가로 사용합니다.
기존 `/portfolio-pdf/index.html` 주소는 배포 환경에서 최신 PDF로 이동합니다.

## 공유 이미지

메신저와 채용 플랫폼의 링크 미리보기에는 `public/og-cover.png`를 사용합니다. 화면 디자인을
변경한 뒤 다음 명령으로 현재 홈 화면과 같은 1200×630 이미지를 다시 생성합니다.

```bash
npm run og:generate
```

배포: [ljkportfolio.netlify.app](https://ljkportfolio.netlify.app/)

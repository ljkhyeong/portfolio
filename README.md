# 임정규 Backend Portfolio

Java와 Spring으로 개발한 공공 시스템, 모놀리식 애플리케이션의 Gradle 멀티모듈 구성, 마이크로서비스 경험을 정리한 React 포트폴리오입니다.

## 대표 프로젝트

-   **BATON**: Core를 기준 데이터의 주체로 두고 GO, WATCH, RELAY를 실패 특성에 따라 분리한 마이크로서비스 프로젝트
-   **happyGallery**: 포트와 어댑터 원칙을 적용하고 결제, 환불, 알림과 동시성 실패를 복구 가능한 상태로 만든 Spring Boot 모놀리식 애플리케이션 및 Gradle 멀티모듈 구성

차세대 군사법 정보 시스템은 경력 사례로, WebRTC/HLS 팀 프로젝트는 교육 프로젝트로 간략히 정리했습니다.

## 실행

Node.js 22를 사용합니다. Netlify 빌드도 저장소의 `.nvmrc`를 읽어 같은 메이저 버전을
사용합니다.

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
npm run preview
```

Vite 빌드 결과는 기존 배포 설정과 호환되도록 `build/`에 생성됩니다. 빌드 후에는
프로젝트별 링크 미리보기 정보를 담은 정적 HTML과 404 페이지도 함께 생성됩니다.

## PDF

-   최신 파일: `public/포트폴리오최신.pdf`
-   React 인쇄 원본: `src/component/print/PortfolioPrintPage.jsx`
-   인쇄 스타일: `src/css/PortfolioPrint.css`
-   로컬 미리보기: `http://localhost:5173/portfolio/print`

```bash
npm run dev
npm run pdf:generate
```

`pdf:generate`는 임시 Vite 서버를 열고 Chrome으로 이미지 및 폰트 로딩과 A4 페이지의
overflow를 검사한 뒤 `public/포트폴리오최신.pdf`를 교체합니다. PDF를 갱신한 뒤
`npm run build`를 실행하면 최신 파일이 `build/`에도 포함됩니다.

인쇄본과 웹 화면은 `src/data/profile.js`, `src/data/projects.js`를 함께 사용합니다.
기존 `/portfolio-pdf/index.html` 주소는 배포 환경에서 최신 PDF로 이동합니다.

배포: [ljkportfolio.netlify.app](https://ljkportfolio.netlify.app/)

# 임정규 Backend Portfolio

Java와 Spring으로 개발한 공공 시스템, 모놀리식 애플리케이션의 Gradle 멀티모듈 구성, 마이크로서비스 경험을 정리한 React 포트폴리오입니다.

## 경력 프로젝트

-   **전송형 전자영장 시스템**: LG CNS 컨소시엄 참여 프로젝트에서 독립망 간 기관 연계 인터페이스와 Spring Batch를 개발한 경력 사례
-   **차세대 군사법 정보 시스템**: 폐쇄망 환경에서 기관 연계 배치, 보안 기능과 운영 장애 대응을 수행한 경력 사례

## 개인 프로젝트

-   **BATON**: Core를 기준 데이터의 주체로 두고 GO, WATCH, RELAY, BRIEF, CAL을 변경 및 장애 처리 방식에 따라 분리한 마이크로서비스 프로젝트
-   **happyGallery**: 포트와 어댑터 원칙을 적용하고 결제, 환불, 알림과 동시성 실패를 DB에 기록해 중복을 막고 미처리 작업을 재처리하는 Spring Boot 모놀리식 애플리케이션 및 Gradle 멀티모듈 구성

## 교육 프로젝트

-   **WebRTC/HLS 현장강의 보조 서비스**: HLS 서버와 React 화면을 맡아 WebRTC/RTP 미디어 경로와 HLS 변환을 구현한 팀 프로젝트

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

## PDF

-   최신 파일: `public/포트폴리오최신.pdf`
-   React 인쇄 원본: `src/component/print/PortfolioPrintPage.jsx`
-   인쇄 스타일: `src/css/PortfolioPrint.css`
-   로컬 미리보기: `http://localhost:5173/portfolio/print`

```bash
npm run dev
npm run pdf:generate
npm run pdf:check
```

`pdf:generate`는 임시 Vite 서버를 열고 Chrome으로 이미지 및 폰트 로딩과 A4 페이지의
overflow를 검사한 뒤 `public/포트폴리오최신.pdf`를 교체합니다. PDF를 갱신한 뒤
`npm run build`를 실행하면 최신 파일이 `build/`에도 포함됩니다.
`pdf:check`는 인쇄 소스와 커밋된 PDF의 지문을 비교하며 프로덕션 빌드에서도 자동으로
실행됩니다.

인쇄본과 웹 화면은 `src/data/profile.js`, `src/data/projects.js`를 함께 사용합니다.
기존 `/portfolio-pdf/index.html` 주소는 배포 환경에서 최신 PDF로 이동합니다.

## 공유 이미지

메신저와 채용 플랫폼의 링크 미리보기에는 `public/og-cover.png`를 사용합니다. 화면 디자인을
변경한 뒤 다음 명령으로 현재 홈 화면과 같은 1200×630 이미지를 다시 생성합니다.

```bash
npm run og:generate
```

배포: [ljkportfolio.netlify.app](https://ljkportfolio.netlify.app/)

export const portfolioProfile = {
    name: "임정규",
    role: "백엔드 개발자",
    location: "서울",
    email: "jolri24@naver.com",
    phone: "010 3972 6284",
    phoneHref: "+821039726284",
    github: "https://github.com/ljkhyeong",
    site: "https://ljkportfolio.netlify.app",
    headline: {
        lead: "복잡한 요구사항을",
        emphasis: "안정적인 백엔드",
        tail: "로 만듭니다.",
    },
    webSummary:
        "공공 시스템을 개발 및 운영했고, 모놀리식 애플리케이션은 Gradle 멀티모듈로 구성했습니다. 마이크로서비스에서는 서비스별 데이터와 장애를 분리했습니다.",
    printHeadline: {
        lead: "실패 이후까지 설계하는",
        emphasis: "백엔드 개발자",
    },
    printSummary:
        "공공 시스템에서 기능 개발과 운영 장애를 대응했고, 개인 프로젝트에서는 멱등성, 데이터 정합성, 복구 경로를 코드와 테스트로 구체화했습니다.",
}

export const workPrinciples = [
    {
        number: "01",
        title: "서비스별 역할을 먼저 나눕니다",
        printTitle: "경계를 먼저 정합니다",
        description:
            "데이터를 어디서 관리하고 권한을 어디서 확인할지 정합니다. BATON에서는 조직 데이터, 링크 생성, URL 점검, 메시지 전송을 별도 서비스로 나눴습니다.",
        printDescription: "데이터 소유권, 트랜잭션 범위, 서비스별 책임을 먼저 나눕니다.",
        link: "/projects/baton",
        linkLabel: "BATON 서비스 구성 보기",
    },
    {
        number: "02",
        title: "외부 실패를 영속 상태로 남깁니다",
        printTitle: "재처리를 기능으로 만듭니다",
        description:
            "결제 응답 누락과 알림 전송 실패를 멱등 키, 펜싱 토큰, 아웃박스로 남겨 중복 실행을 줄이고 중단된 작업을 이어서 복구합니다.",
        printDescription: "멱등 키, 락, 아웃박스와 복구 작업으로 실패 뒤의 동작을 정의합니다.",
        link: "/projects/happygallery",
        linkLabel: "happyGallery 장애 처리 보기",
    },
    {
        number: "03",
        title: "설계 이유와 테스트를 기록합니다",
        printTitle: "근거를 남깁니다",
        description:
            "설계 이유를 ADR로 남기고 통합 테스트, E2E 테스트, 로그와 모니터링으로 동작을 확인합니다. 문서는 이후 변경할 때 확인하는 기준으로 사용합니다.",
        printDescription: "ADR, API 계약, 통합 테스트와 로그로 설계 이유와 결과를 확인합니다.",
        link: "/projects/happygallery",
        linkLabel: "문서와 테스트 보기",
    },
]

export const education = {
    period: "2023.05 — 2023.11",
    organization: "카카오 클라우드 스쿨 개발자 과정 3기",
    meta: "6인 팀",
    projectId: "webrtc",
    description:
        "HLS 서버와 React 화면을 맡았습니다. WebSocket 제어와 WebRTC/RTP 미디어 경로를 분리하고 FFmpeg와 GStreamer로 HLS를 변환해 지연을 약 30초에서 11초로 줄였습니다.",
}

export const career = {
    period: "2024.06 — 2026.01",
    organization: "BEINTECH",
    position: "백엔드 개발 및 운영",
    projectId: "defense",
    description:
        "차세대 군사법 정보 시스템의 군교정 영역에서 기관 연계 배치, 보안 기능, 장애 대응을 맡았습니다. Java 8, eGov, MyBatis, Tibero 기반의 폐쇄망 환경에서 로그와 DB, 배치 흐름을 함께 확인했습니다.",
    printDescription:
        "차세대 군사법 정보 시스템 군교정 부문에서 기관 연계 배치, 보안 기능, 로그 및 DB 기반 장애 대응을 담당했습니다.",
}

export const skillGroups = [
    {
        label: "백엔드",
        items: ["Java 21 / 8", "Spring Boot / eGov", "JPA / MyBatis", "포트와 어댑터"],
        proof: "BATON, happyGallery, 공공 SI",
    },
    {
        label: "데이터 및 장애 대응",
        items: ["MySQL / PostgreSQL", "Redis", "상태 전이", "멱등 처리 / 아웃박스"],
        proof: "동시성 제어, 보상 처리, 재시도",
    },
    {
        label: "테스트 및 운영",
        items: ["JUnit / Testcontainers", "Playwright", "Prometheus / Grafana", "Docker / CI"],
        proof: "API 계약, 통합 테스트, E2E 테스트",
    },
]

export const printSkillGroups = [
    {
        label: "Backend",
        detail: "Java 21 / 8, Spring Boot, eGov 4.1, JPA, MyBatis",
    },
    {
        label: "Architecture",
        detail: "헥사고날 아키텍처, 모놀리식 애플리케이션, Gradle 멀티모듈, 마이크로서비스",
    },
    {
        label: "Data & Recovery",
        detail: "MySQL, PostgreSQL, Tibero, Redis, 멱등 처리, 아웃박스, 보상 처리",
    },
    {
        label: "Test & Operations",
        detail: "JUnit, Testcontainers, REST Docs, Playwright, Docker, Jenkins, Prometheus",
    },
]

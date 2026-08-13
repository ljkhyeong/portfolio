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
        "LG CNS 컨소시엄 전송형 전자영장 프로젝트에서 독립망 간 기관 연계 인터페이스와 Spring Batch를 개발하고 있습니다. 공공 시스템 운영 장애 대응 경험과 개인 프로젝트의 결제 및 환불 멱등성, 알림 아웃박스, 서비스별 데이터 분리를 함께 담았습니다.",
    heroProofs: [
        "LG CNS 컨소시엄 / 독립망 연계",
        "GO 동시 요청 8 → 링크 1",
        "happyGallery 백엔드 테스트 218",
    ],
    printHeadline: {
        lead: "실패 이후까지 설계하는",
        emphasis: "백엔드 개발자",
    },
    printSummary:
        "LG CNS 컨소시엄 전송형 전자영장 프로젝트에서 독립망 간 기관 연계를 개발하고 있습니다. 공공 시스템 운영 장애 대응과 개인 프로젝트의 멱등성, 데이터 일관성, 실패 후 재처리 방식을 함께 담았습니다.",
}

export const workPrinciples = [
    {
        number: "01",
        title: "서비스별 역할을 먼저 나눕니다",
        printTitle: "경계를 먼저 정합니다",
        description:
            "데이터를 어디서 관리하고 권한을 어디서 확인할지 정합니다. BATON에서는 조직 데이터, 링크 생성, URL 점검, 메시지 전송, 주간 브리프와 캘린더 구독을 별도 서비스로 나눴습니다.",
        printDescription: "데이터 소유권, 트랜잭션 범위, 서비스별 책임을 먼저 나눕니다.",
        link: "/projects/baton",
        linkLabel: "BATON 서비스 구성 보기",
    },
    {
        number: "02",
        title: "외부 연동 실패를 DB에 기록합니다",
        printTitle: "재처리를 기능으로 만듭니다",
        description:
            "결제 응답 누락과 알림 전송 실패를 멱등 키, 작업 선점 토큰과 아웃박스로 기록해 중복 실행을 막고 중단된 작업을 이어서 처리합니다.",
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

export const careers = [
    {
        id: "e-warrant",
        period: "2026.03 — 진행 중",
        organization: "LG CNS 컨소시엄 참여 프로젝트",
        position: "해양경찰 KICS 연계 개발",
        projectId: "warrant",
        description:
            "전송형 전자영장 시스템에서 해양경찰 KICS 통신사실확인자료 개선과 집행포털 연계를 담당하고 있습니다. 사법기관, 금융기관 및 통신사처럼 독립된 망 사이의 요청과 제출 자료를 인터페이스와 Spring Batch로 연결하고 대용량 조회와 외부 연동의 실패 경계를 설계했습니다.",
        printDescription:
            "해양경찰 KICS 통신사실확인자료 개선과 집행포털 연계를 담당하며 독립망 사이의 요청과 제출 자료를 인터페이스와 Spring Batch로 연결하고 있습니다.",
    },
    {
        id: "beintech",
        period: "2024.06 — 2026.01",
        organization: "BEINTECH",
        position: "백엔드 개발 및 운영",
        projectId: "defense",
        description:
            "차세대 군사법 정보 시스템의 군교정 영역에서 기관 연계 배치, 보안 기능, 장애 대응을 맡았습니다. Java 8, eGov, MyBatis, Tibero 기반의 폐쇄망 환경에서 로그와 DB, 배치 흐름을 함께 확인했습니다.",
        printDescription:
            "차세대 군사법 정보 시스템 군교정 부문에서 기관 연계 배치, 보안 기능, 로그 및 DB 기반 장애 대응을 담당했습니다.",
    },
]

export const personalActivities = [
    {
        id: "lns-http-study",
        title: "LnS (Learn & Share) — HTTP 완벽 가이드",
        type: "개발 서적 그룹 스터디",
        role: "발표 및 Q&A 정리",
        summary:
            "HTTP 메시지, 캐시, 프록시와 인증 등 실무에서 자주 확인하는 주제를 발표하고 질문과 답변을 문서로 정리했습니다.",
        links: [
            {
                label: "LnS 발표 및 Q&A 기록",
                href: "https://www.notion.so/LnS-Learn-Share-b3782d6639408242904501146ebbdfdf",
            },
        ],
    },
    {
        id: "effective-java-study",
        title: "Effective Java 스터디",
        type: "개발 서적 그룹 스터디",
        role: "아이템별 학습 내용 기록",
        summary:
            "객체 생성, 불변성, 제네릭과 API 설계 원칙을 아이템별로 학습하고 적용 기준을 Notion에 기록했습니다.",
        links: [
            {
                label: "Effective Java 학습 기록",
                href: "https://www.notion.so/2bb82d6639408021aa64da7cb536ab64",
            },
        ],
    },
]

export const skillGroups = [
    {
        label: "백엔드",
        items: ["Java 21 / 11 / 8", "Spring Boot / eGov", "Spring Batch", "JPA / MyBatis"],
        proof: "전자영장, BATON, happyGallery, 공공 SI",
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
        detail: "Java 21 / 11 / 8, Spring Boot, Spring Batch, eGov 4.1, JPA, MyBatis",
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

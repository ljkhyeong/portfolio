export const portfolioProfile = {
    name: "임정규",
    role: "백엔드 개발자",
    location: "서울",
    email: "jolri24@naver.com",
    phone: "010 3972 6284",
    phoneHref: "+821039726284",
    github: "https://github.com/ljkhyeong",
    site: "https://ljkportfolio.netlify.app",
    printHeadline: {
        lead: "실패 이후까지 설계하는",
        emphasis: "백엔드 개발자",
    },
    printSummary:
        "BEINTECH 소속으로 LG CNS 컨소시엄 전송형 전자영장 프로젝트의 독립망 간 기관 연계를 개발하고 있습니다. 공공 시스템 운영 장애 대응과 개인 프로젝트의 멱등성, 데이터 일관성, 실패 후 재처리 방식을 함께 담았습니다.",
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
        printDescription:
            "멱등 키, 락, 아웃박스와 미처리 작업 재처리로 실패 뒤의 동작을 정의합니다.",
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
        "HLS 서버와 React 화면을 맡았습니다. WebSocket 제어와 WebRTC/RTP 미디어 경로를 분리하고 FFmpeg와 GStreamer로 HLS를 변환했으며, FFmpeg 설정 조정으로 지연을 약 35초에서 17초로 줄였습니다.",
}

export const careers = [
    {
        id: "beintech",
        period: "2024.06 — 현재",
        organization: "BEINTECH",
        position: "백엔드 개발자",
        description:
            "2024년 6월 첫 회사로 입사해 2년 이상 공공 SI 백엔드 개발과 운영을 담당하고 있습니다. 차세대 군사법 정보 시스템을 거쳐 현재 전송형 전자영장 시스템을 개발하고 있습니다.",
        printDescription:
            "첫 회사에서 2년 이상 공공 SI 백엔드 개발과 운영을 담당하며 군사법 및 전자영장 프로젝트를 수행하고 있습니다.",
        projectIds: ["warrant", "defense"],
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

export const printSkillGroups = [
    {
        label: "Backend",
        detail: "Java 21 / 11 / 8, Spring Boot, Spring Batch, eGov 4.1, JPA, MyBatis",
    },
    {
        label: "Architecture",
        detail: "BATON: Core + 6개 마이크로서비스 / happyGallery: 모놀리식 애플리케이션 + Gradle 멀티모듈 / 헥사고날 아키텍처",
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

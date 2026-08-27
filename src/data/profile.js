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
        lead: "기관 연계와 실패 재처리를 구현하는",
        emphasis: "백엔드 개발자",
    },
    printSummary:
        "BEINTECH에서 KICS와 통신사 및 전자영장 집행포털 사이의 요청 및 제출 자료를 연계하는 인터페이스와 Spring Batch를 개발하고 있습니다. 군사법 시스템에서는 Jenkins 실행 이력, WAS 로그와 DB 상태를 대조해 연계 장애를 확인하고 재처리했습니다. 개인 프로젝트에서는 중복 결제, 알림 유실과 재고 경쟁을 DB 상태와 락으로 제어했습니다.",
}

export const workPrinciples = [
    {
        number: "01",
        title: "서비스마다 관리할 데이터와 API 책임을 정합니다",
        printTitle: "서비스 책임을 먼저 정합니다",
        description:
            "BATON에서는 조직 데이터와 사용자의 참여 가능 여부를 Core가 관리합니다. 링크 생성, URL 점검, 알림 전송, 주간 보고서, 캘린더 구독과 화상 회의는 각각 별도 서비스에서 처리합니다.",
        printDescription:
            "어떤 서비스가 데이터를 저장하고 변경하는지, 다른 서비스가 호출할 API는 무엇인지 먼저 정합니다.",
        link: "/projects/baton",
        linkLabel: "BATON 서비스 구성 보기",
    },
    {
        number: "02",
        title: "외부 연동 실패를 DB에 기록합니다",
        printTitle: "중단된 작업을 다시 처리합니다",
        description:
            "결제와 알림 요청의 처리 상태를 DB에 저장하고, 같은 요청이 다시 와도 기존 결과를 반환하도록 구현했습니다. 서버가 중단되면 미처리 상태를 조회해 다른 작업이 이어서 처리합니다.",
        printDescription:
            "결제 결과를 받지 못한 재요청은 기존 처리 결과를 조회하고, 보내지 못한 알림은 DB에서 찾아 다시 전송합니다.",
        link: "/projects/happygallery",
        linkLabel: "happyGallery 장애 처리 보기",
    },
    {
        number: "03",
        title: "ADR와 자동화 테스트로 변경 기준을 남깁니다",
        printTitle: "구현 이유와 확인 결과를 남깁니다",
        description:
            "기술 선택 이유는 ADR로, API 요청 및 응답은 REST Docs와 OpenAPI로 남깁니다. 통합 및 E2E 테스트로 결제, 주문과 예약 흐름이 변경 후에도 유지되는지 확인합니다.",
        printDescription:
            "ADR에 선택 이유를 기록하고, API 문서와 자동화 테스트로 변경 후에도 기존 기능이 동작하는지 확인합니다.",
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
            "2024년 6월 BEINTECH에 입사했습니다. 차세대 군사법 정보 시스템에서 수용자 인적정보 및 영장정보 연계 배치와 운영 장애 대응을 맡았고, 현재 전송형 전자영장 시스템에서 KICS-통신사 및 KICS-집행포털 연계 인터페이스와 Spring Batch를 개발하고 있습니다.",
        printDescription:
            "차세대 군사법 정보 시스템의 기관 연계 배치와 운영 장애 대응을 맡았고, 현재 전송형 전자영장 시스템의 KICS-통신사 및 KICS-집행포털 연계를 개발하고 있습니다.",
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
        detail: "Java 25 / 21 / 11 / 8, Spring Boot, Spring Batch, eGov 4.1, JPA, MyBatis",
    },
    {
        label: "Architecture",
        detail: "BATON: Core + 6개 마이크로서비스 / happyGallery: 모놀리식 애플리케이션 + Gradle 멀티모듈 / 헥사고날 아키텍처",
    },
    {
        label: "Data & Recovery",
        detail: "MySQL, PostgreSQL, Tibero, Redis, 중복 처리 방지, 미전송 작업 재처리",
    },
    {
        label: "Test & Operations",
        detail: "JUnit, Testcontainers, REST Docs, Playwright, Docker, Jenkins, Prometheus",
    },
]

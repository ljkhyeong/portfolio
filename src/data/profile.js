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
        lead: "기관 간 자료 전송과 중단 작업 재처리를 구현하는",
        emphasis: "백엔드 개발자",
    },
    printSummary:
        "BEINTECH에서 KICS 요청을 통신사와 전자영장 집행포털 규격으로 변환해 보내고, 제출 자료를 다시 KICS에 반영하는 서버 기능과 Spring Batch를 개발하고 있습니다. 군사법 시스템에서는 Jenkins 실행 이력, 업무 서버 로그와 DB 상태를 대조해 연계 장애를 확인하고 재처리했습니다. 개인 프로젝트에서는 요청 ID와 DB 처리 상태로 중복 결제와 알림 유실을 막고, 재고 행을 잠가 동시 주문의 초과 차감을 방지했습니다.",
}

export const workPrinciples = [
    {
        number: "01",
        title: "각 서비스가 저장할 데이터와 제공할 API를 먼저 정합니다",
        printTitle: "서비스별 저장 데이터와 API를 구분합니다",
        description:
            "BATON에서는 중앙 서비스(Core)가 조직 데이터와 조직 작업 공간 접속용 공유 키를 관리하고, 화상방 참여권을 발급할 때 계정과 연결된 활동 중인 스터디 구성원인지 확인합니다. 링크 생성, URL 점검, 이벤트 전달, 주간 보고서, 캘린더 구독과 화상 회의는 각각 별도 서비스에서 처리합니다.",
        printDescription:
            "어떤 서비스가 데이터를 저장하고 변경하는지, 다른 서비스가 호출할 API는 무엇인지 먼저 정합니다.",
        link: "/projects/baton",
        linkLabel: "BATON 서비스 구성 보기",
    },
    {
        number: "02",
        title: "결제 및 알림 처리 상태를 저장해 중단된 작업을 다시 처리합니다",
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
        title: "기술 선택 이유와 테스트 결과를 문서로 남깁니다",
        printTitle: "기술 선택 이유와 테스트 결과를 남깁니다",
        description:
            "기술을 고른 이유와 검토한 대안은 의사결정 기록(ADR)에 남깁니다. 실제 API 요청 및 응답을 테스트해 REST Docs와 OpenAPI 문서를 만들고, 통합 및 주요 화면 자동화 테스트로 결제, 주문과 예약 흐름이 변경 후에도 유지되는지 확인합니다.",
        printDescription:
            "의사결정 기록(ADR)에 선택 이유를 남기고, API 문서와 자동화 테스트로 변경 후에도 기존 기능이 동작하는지 확인합니다.",
        link: "/projects/happygallery",
        linkLabel: "문서와 테스트 보기",
    },
]

export const education = {
    period: "교육 과정 2023.05 — 2023.11",
    organization: "카카오 클라우드 스쿨 개발자 과정 3기",
    meta: "6인 팀",
    projectId: "webrtc",
    description:
        "현재 강의는 WebRTC로 실시간 재생하고, 놓친 구간은 HLS로 다시 볼 수 있는 React 화면을 구현했습니다. mediasoup가 내보낸 RTP 영상은 FFmpeg와 GStreamer로 HLS 세그먼트와 재생 목록으로 변환했습니다. 세그먼트 길이와 FFmpeg 설정을 조정해 팀 시연 환경의 HLS 재생 지연을 약 35초에서 17초로 줄였습니다.",
}

export const careers = [
    {
        id: "beintech",
        period: "2024.06 — 현재",
        organization: "BEINTECH",
        position: "백엔드 개발자",
        description:
            "2024년 6월 BEINTECH에 입사했습니다. 차세대 군사법 정보 시스템에서 군사법원, 군검찰 및 군사경찰의 수용자 및 영장 자료를 검증해 군교정 DB에 반영하는 배치를 개발하고, 중단된 연계를 찾아 재처리했습니다. 현재 전송형 전자영장 시스템에서 KICS 요청을 통신사와 집행포털 규격으로 변환해 보내고 제출 자료를 다시 KICS에 반영하는 서버 기능과 Spring Batch를 개발하고 있습니다.",
        printDescription:
            "군사법원, 군검찰 및 군사경찰의 수용자 및 영장 자료를 검증해 군교정 DB에 반영하는 배치를 개발했고, 현재 KICS 요청과 제출 자료를 통신사 및 집행포털과 주고받는 연계를 개발하고 있습니다.",
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
            "객체 생성, 변경할 수 없는 객체 설계, 제네릭과 API 설계 원칙을 아이템별로 학습하고 적용 기준을 Notion에 기록했습니다.",
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
        detail: "Java 25 / 21 / 11 / 8, Spring Boot, Spring Batch, 전자정부 표준프레임워크 4.1, JPA, MyBatis",
    },
    {
        label: "Architecture",
        detail: "BATON: 중앙 서비스 + 6개 마이크로서비스 / happyGallery: 업무 규칙, 웹 요청과 DB 저장을 분리한 Gradle 멀티모듈",
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

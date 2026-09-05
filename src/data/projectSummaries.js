export const projectSummaries = [
    {
        id: "baton",
        index: "01",
        projectType: "personal",
        presentation: "featured",
        title: "BATON",
        navigationLabel: "BATON",
        eyebrow: "조직 운영 플랫폼",
        homeSummary: "조직의 역할, 반복 업무, 결정과 인수인계를 관리하는 플랫폼입니다.",
        homeHighlights: [
            "할 일 관리, 담당자 공백 및 업무 지연 확인, 통합 검색, 인수인계 문서 생성",
            "Core와 6개 마이크로서비스의 API 및 저장소 분리",
        ],
        homeRepository: {
            label: "WATCH GitHub",
            href: "https://github.com/ljkhyeong/baton-watch",
        },
        summary:
            "조직의 역할, 반복 업무, 결정과 인수인계를 관리합니다. 링크, URL 점검, 이벤트 전달, 주간 보고서, 캘린더 및 WebRTC는 6개 마이크로서비스로 분리했습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "Core와 6개 서비스의 API, 개별 저장소, 이벤트 전달과 중단 작업 재처리 흐름 설계 및 구현",
            },
            {
                label: "문제",
                value: "같은 링크 요청이나 이벤트가 다시 전달되면 링크와 전달 작업이 중복 생성될 수 있음",
            },
            {
                label: "해결",
                value: "링크 요청 UUID와 이벤트 ID로 기존 작업을 재사용하고, 중단된 전달은 같은 시도 UUID와 제공자 멱등 키를 유지하며 결과 미확인 전송은 자동 재시도하지 않음",
            },
        ],
        period: "2026.07.20 — 진행 중",
        route: "/projects/baton",
        tags: ["Java / Kotlin", "Spring Boot", "MySQL / PostgreSQL", "RabbitMQ / AWS SQS FIFO"],
        visual: "baton",
        stage: "개발 중",
        visibility: "일부 저장소 공개",
        homeEvidence: {
            validation: "서비스별 자동화 및 로컬 교차 서비스 테스트",
            documents: "PRD 47 / ADR 70 / Runbook 17",
        },
        serviceLinks: [
            { id: "go", name: "GO", route: "/projects/baton/go" },
            { id: "watch", name: "WATCH", route: "/projects/baton/watch" },
            { id: "relay", name: "RELAY", route: "/projects/baton/relay" },
            { id: "brief", name: "BRIEF", route: "/projects/baton/brief" },
            { id: "cal", name: "CAL", route: "/projects/baton/cal" },
            { id: "round", name: "ROUND", route: "/projects/baton/round" },
        ],
    },
    {
        id: "warrant",
        index: "01",
        projectType: "career",
        presentation: "career-case",
        title: "전송형 전자영장 시스템",
        navigationLabel: "전자영장",
        eyebrow: "BEINTECH / LG CNS 컨소시엄 / 해양경찰 사건수사시스템, 통신사 및 집행포털 연계",
        homeSummary:
            "KICS와 통신사 및 전자영장 포털 사이에서 요청과 제출 자료를 전달하는 시스템입니다.",
        homeHighlights: [
            "기관별 요청 규격 변환 및 전송 서버 개발",
            "제출 자료의 KICS 반영 서버와 Spring Batch 개발",
        ],
        summary:
            "KICS 요청을 기관별 규격으로 변환해 전달하고, 기관이 제출한 자료를 KICS에 반영하는 공공 시스템입니다. 연계 서버와 Spring Batch를 개발합니다.",
        homeFacts: [
            {
                label: "담당",
                value: "KICS 요청 변환 및 전송, 제출 자료의 KICS 반영 서버와 Spring Batch 개발",
            },
            {
                label: "문제",
                value: "기관별 요청 및 제출 형식이 다르고, PDF 완료 응답이 요청 상태 저장보다 먼저 도착할 수 있음",
            },
            {
                label: "해결",
                value: "기관별 변환 코드를 분리하고, 먼저 도착한 PDF 완료 응답은 요청 상태를 다시 조회해 반영",
            },
        ],
        period: "2026.03.24 — 진행 중",
        route: "/projects/e-warrant",
        tags: ["Java 11", "Spring Boot 2.6", "Spring Batch", "Oracle Database", "WebSquare"],
        visual: "warrant",
        stage: "진행 중",
        visibility: "담당 범위만 공개",
        homeEvidence: {
            validation: "자료 변환 및 배치 단계 확인",
            documents: "내부 문서 비공개",
        },
    },
    {
        id: "happygallery",
        index: "02",
        projectType: "personal",
        presentation: "featured",
        title: "happyGallery",
        navigationLabel: "happyGallery",
        eyebrow: "공방 상품 판매 및 예약 서비스",
        homeSummary:
            "상품 주문, 클래스 예약과 스마트스토어 운영을 한 곳에서 처리하는 공방 서비스입니다.",
        homeHighlights: [
            "카드와 네이버페이 및 카카오페이 결제 흐름",
            "스마트스토어 상품, 재고, 주문, 문의 및 정산 운영",
        ],
        homeRepository: {
            label: "GitHub",
            href: "https://github.com/ljkhyeong/happyGallery",
        },
        summary:
            "공방 상품 주문과 클래스 예약을 처리합니다. 카드와 간편결제, 스마트스토어 상품 및 주문 운영, 결제 및 알림 재처리와 재고 동시성 제어를 구현했습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "요구사항 정리, Java 및 Spring Boot API, React 화면, 결제 및 외부 채널 연동과 자동화 테스트",
            },
            {
                label: "문제",
                value: "결제사 응답 유실, 서버 중단에 따른 알림 유실과 외부 주문 재수신에 따른 재고 중복 반영",
            },
            {
                label: "해결",
                value: "결제 orderId와 환불 UUID를 재사용하고, DB 알림을 재처리하며 스마트스토어 주문은 적용 수량 차이만 재고에 반영",
            },
        ],
        period: "2026.02.21 — 진행 중",
        route: "/projects/happygallery",
        tags: ["Java 25", "Spring Boot 4.1", "React 19", "MySQL / Redis"],
        visual: "gallery",
        stage: "개발 중",
        visibility: "공개 저장소",
        homeEvidence: {
            validation: "공개 main 통합 테스트 및 화면 자동화 19개 통과",
            documents: "PRD 4 / ADR 48 / Runbook 1",
        },
    },
    {
        id: "youth-policy-mate",
        index: "01",
        projectType: "webapp",
        presentation: "webapp-case",
        title: "청년정책메이트",
        navigationLabel: "청년정책메이트",
        eyebrow: "서울 청년 정책 탐색 및 일정 관리 웹앱",
        homeSummary: "청년 정책 자격 근거와 신청 일정을 확인하는 웹앱을 개발하고 있습니다.",
        homeHighlights: [
            "연령, 지역, 취업과 소득 조건의 3단계 자격 판정",
            "정책 개정과 마감일을 반영한 알림 후보 계산",
        ],
        homeRepository: {
            label: "GitHub",
            href: "https://github.com/ljkhyeong/youth-policy-mate",
        },
        summary:
            "서울 청년이 정책 자격 근거와 신청 일정을 확인하는 웹앱을 개발합니다. 현재 조건 입력 화면, 개발용 예시의 3단계 판정, 마감 알림 후보와 AI 호출 전 비용 예약 및 중단 작업 복구 모델을 구현했습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "제품 요구사항, Next.js 화면, Java 및 Spring Boot 서버, PostgreSQL 상태 모델과 자동화 테스트",
            },
            {
                label: "문제",
                value: "정책 조건이나 모집 기간을 확인할 수 없을 때도 신청 가능 여부와 마감일이 확정된 것처럼 보일 수 있음",
            },
            {
                label: "해결",
                value: "가능, 불가, 추가 확인 필요로 판정을 나누고 근거와 기준일을 함께 표시하며 확인되지 않은 마감일은 만들지 않음",
            },
        ],
        period: "2026.08.30 — 진행 중",
        route: "/projects/youth-policy-mate",
        tags: ["Java 25 / Spring Boot 4.1", "Next.js 16 / React 19", "TypeScript", "PostgreSQL 18"],
        visual: "youth-policy-mate",
        stage: "개발 중",
        visibility: "공개 저장소",
        homeProof: "공개 main CI 통과 및 서버 자동화 테스트 341개 통과",
        homeFlow: ["조건 입력", "근거별 판정", "일정 및 알림 후보"],
    },
    {
        id: "hope-commit",
        index: "01",
        projectType: "tooling",
        presentation: "tooling-case",
        title: "Hope Commit",
        homeRepository: {
            label: "GitHub",
            href: "https://github.com/ljkhyeong/hope-commit",
        },
        navigationLabel: "Hope Commit",
        eyebrow: "Hope 6.0.0 비공식 포크 / 로컬 커밋 HTML 리뷰",
        summary:
            "SeungIl 님의 Hope 6.0.0을 포크한 비공식 도구입니다. 지정한 커밋만 검토하고 각 설명을 실제 변경 줄에 연결한 오프라인 HTML 리뷰를 생성합니다.",
        homeFacts: [
            {
                label: "담당",
                value: "SeungIl 님의 Hope 6.0.0 포크에 로컬 커밋 비교, 참조한 코드를 표시하는 HTML 리뷰와 자동화 테스트 추가",
            },
            {
                label: "문제",
                value: "작업 중인 파일과 이전 대화가 섞여 지정한 커밋 밖의 코드까지 리뷰될 수 있음",
            },
            {
                label: "해결",
                value: "작업 파일이 아닌 Git 커밋 객체만 읽고, 설명이 실제 변경 줄을 가리킬 때만 HTML 생성",
            },
        ],
        period: "2026.08.22 — 진행 중",
        route: "/projects/hope-commit",
        tags: ["JavaScript", "Node.js 22", "Git CLI", "Playwright"],
        visual: "hope-commit",
        stage: "개발 중",
        visibility: "공개 저장소",
        homeProof: "v5.0.2 공개 및 자동화 테스트 343개 통과",
        homeFlow: ["대상 커밋", "변경 줄", "HTML 리뷰"],
    },
    {
        id: "intent-trace",
        index: "02",
        projectType: "tooling",
        presentation: "tooling-case",
        title: "IntentTrace",
        homeRepository: {
            label: "GitHub",
            href: "https://github.com/ljkhyeong/intent-trace",
        },
        navigationLabel: "IntentTrace",
        eyebrow: "AI 코드 변경 의도 및 검증 기록",
        summary:
            "AI 코드 변경의 요청, 변경 근거와 출처, 코드 위치와 검증 결과를 함께 남기는 도구입니다. 원문 대화나 숨은 추론은 저장하지 않으며 작성자가 확인한 기록을 GitHub와 IntelliJ에서 조회합니다.",
        homeFacts: [
            {
                label: "담당",
                value: "Kotlin 및 Spring 서버, GitHub 인증과 Check Run, Codex MCP 연동 및 IntelliJ 플러그인 구현",
            },
            {
                label: "문제",
                value: "AI가 코드를 바꾼 이유와 검증 결과를 커밋만 보고 확인하기 어려움",
            },
            {
                label: "해결",
                value: "전체 커밋 해시와 코드 줄 해시를 저장하고, 작성자 확인 뒤 코드가 바뀌면 공개 차단",
            },
        ],
        period: "2026.08.27 — 진행 중",
        route: "/projects/intent-trace",
        tags: [
            "Kotlin / JDK 21",
            "Spring Boot / Spring AI",
            "PostgreSQL / H2",
            "IntelliJ Platform",
        ],
        visual: "intent-trace",
        stage: "개발 중",
        visibility: "공개 저장소",
        homeProof: "v0.7.0 공개 및 최신 main의 서버, IntelliJ와 릴리스 자동화 검증",
        homeFlow: ["커밋", "코드 줄 해시", "공개 판단"],
    },
    {
        id: "defense",
        index: "02",
        projectType: "career",
        presentation: "career-case",
        title: "차세대 군사법 정보 시스템",
        navigationLabel: "군사법",
        eyebrow: "BEINTECH / 국방부 SI / 백엔드 개발 및 운영",
        summary:
            "군 사법 및 군교정 업무를 처리하는 국방부 폐쇄망 시스템입니다. 군사법원, 군검찰 및 군사경찰의 자료 검증 배치, 요청 위조 차단과 대용량 파일 직접 업로드를 개발했습니다. Jenkins 실행 이력, JEUS 로그와 Tibero 상태로 중단된 기관 배치를 찾아 재실행했습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "군교정 업무 화면, 수용자 인적정보 및 영장정보 연계 배치, CSRF 차단과 대용량 파일 직접 업로드 개발",
            },
            {
                label: "문제",
                value: "기관별 자료 형식 차이, 상태 변경 요청 위조와 대용량 업로드의 서버 부하",
            },
            {
                label: "해결",
                value: "자료 검증 배치와 CSRF 차단 및 저장소 직접 업로드를 구현하고, Jenkins, JEUS와 Tibero로 중단 단계를 찾아 해당 기관 배치를 재실행",
            },
        ],
        period: "2024.06.23 — 2026.01.30",
        route: "/projects/defense",
        tags: ["Java 8", "전자정부 표준프레임워크 4.1", "MyBatis", "Tibero", "Jenkins"],
        visual: "defense",
        stage: "종료",
        visibility: "담당 범위만 공개",
        homeProof: "기관별 배치 결과, JEUS 로그 및 Tibero 상태 확인",
        homeFlow: ["기관 자료", "검증 배치", "업무 반영"],
    },
    {
        id: "webrtc",
        index: "2023 교육 프로젝트",
        projectType: "education",
        presentation: "prior-experience",
        title: "WebRTC/HLS 현장강의 보조 서비스",
        homeRepository: {
            label: "HLS GitHub",
            href: "https://github.com/TeamyRoom/TMeRoom-HLSServer",
        },
        eyebrow: "카카오 클라우드 스쿨 3기 / 6인 팀",
        summary:
            "WebRTC 실시간 강의와 HLS 다시보기를 제공하는 서비스입니다. RTP-HLS 변환 서버와 React 화면을 맡았습니다. 팀 시연에서 HLS 재생 지연을 약 35초에서 약 17초로 줄였습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "mediasoup RTP 출력의 HLS 변환 서버와 WebRTC 실시간 및 HLS 다시보기 React 화면",
            },
            {
                label: "문제",
                value: "팀 시연 환경에서 강의 영상의 HLS 다시보기가 약 35초 늦게 재생됨",
            },
            {
                label: "해결",
                value: "HLS 세그먼트 길이와 FFmpeg 인코딩 설정을 조정해 팀 시연 환경에서 약 17초로 단축",
            },
        ],
        period: "2023.09.01 — 2023.11.10",
        route: "/projects/webrtc",
        tags: ["WebRTC", "HLS", "React", "FFmpeg", "GStreamer"],
        visual: "webrtc",
        stage: "종료",
        visibility: "공개 저장소",
        homeProof: "HLS 지연 약 35초 → 약 17초 (팀 시연 환경)",
        homeFlow: ["RTP", "HLS 변환", "다시보기"],
    },
]

export const projectSummariesById = Object.fromEntries(
    projectSummaries.map((project) => [project.id, project]),
)

export const projectSummaries = [
    {
        id: "baton",
        index: "01",
        projectType: "personal",
        presentation: "featured",
        title: "BATON",
        navigationLabel: "BATON",
        eyebrow: "조직 운영 플랫폼",
        summary:
            "조직의 역할, 반복 업무, 의사결정과 인수인계를 한곳에서 관리하는 서비스입니다. 조직 데이터와 사용자의 참여 가능 여부는 Core가 관리하고, 링크 생성, URL 점검, 알림 전송, 주간 보고서, 캘린더 구독과 화상 회의는 6개 마이크로서비스가 각각 처리하도록 구현했습니다.",
        homeFacts: [
            { label: "담당", value: "Core와 6개 마이크로서비스의 API, DB 및 실행 환경 구현" },
            { label: "문제", value: "중복 요청, 서비스 중단과 이벤트 재전송으로 인한 중복 처리" },
            {
                label: "해결",
                value: "서비스별 관리 데이터 분리, 요청 처리 기록과 미전송 이벤트 재처리",
            },
        ],
        period: "2026.07.20 — 진행 중",
        route: "/projects/baton",
        tags: ["Java / Kotlin", "Spring Boot", "MySQL / PostgreSQL", "WebRTC / Messaging"],
        visual: "baton",
        stage: "개발 중",
        visibility: "일부 공개",
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
        careerId: "beintech",
        presentation: "career-case",
        title: "전송형 전자영장 시스템",
        navigationLabel: "전자영장",
        eyebrow: "BEINTECH / LG CNS 컨소시엄 / 독립망 기관 연계",
        summary:
            "전자영장 관련 자료 제공 요청과 금융기관 및 통신사의 제출 자료를 독립망 사이에서 연계하는 공공 시스템입니다. LG CNS 컨소시엄에 참여해 해양경찰 사건수사시스템(KICS, 행정망), 통신사 업무망(통신사 전용망), 전자영장 집행포털(인터넷망, LG CNS 주관) 간 연계 인터페이스와 배치 개발을 담당하고 있습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "KICS-통신사 및 KICS-집행포털 연계 인터페이스와 Spring Batch",
            },
            {
                label: "문제",
                value: "KICS, 통신사 및 집행포털의 서로 다른 연계 규격과 계속 누적되는 전송 이력",
            },
            {
                label: "해결",
                value: "기관별 변환 코드 분리, Spring Batch 공통 단계, 커서 페이지네이션과 콜백 재처리",
            },
        ],
        period: "2026.03.24 — 진행 중",
        route: "/projects/e-warrant",
        tags: ["Java 11", "Spring Boot 2.6", "Spring Batch", "Oracle DB", "WebSquare"],
        visual: "warrant",
        stage: "진행 중",
        visibility: "공개 가능 범위",
    },
    {
        id: "happygallery",
        index: "02",
        projectType: "personal",
        presentation: "featured",
        title: "happyGallery",
        navigationLabel: "happyGallery",
        eyebrow: "공방 상품 판매 및 예약 서비스",
        summary:
            "공방 고객이 작품을 주문하고 클래스를 예약하며, 관리자가 상품, 재고, 일정과 주문 상태를 처리하는 서비스입니다. 요구사항 정리부터 Java 및 Spring 백엔드와 React 화면, 결제 및 환불 복구, 주문제작 옵션별 재고, 테스트와 AWS 배포까지 직접 구현했습니다.",
        homeFacts: [
            { label: "담당", value: "요구사항 정리부터 전체 구현 및 AWS 운영" },
            {
                label: "문제",
                value: "결제 승인 결과 미수신, 서버 중단 시 알림 유실과 동시 주문 시 옵션 재고 초과 차감",
            },
            {
                label: "해결",
                value: "결제 요청 ID로 중복 승인을 막고, 미전송 알림은 DB에서 다시 처리하며, 옵션 재고는 항상 같은 순서로 잠근 뒤 차감",
            },
        ],
        period: "2026.02.21 — 진행 중",
        route: "/projects/happygallery",
        tags: ["Java 25", "Spring Boot 4.1", "React 19 / SSR", "MySQL / Redis"],
        visual: "gallery",
        stage: "개발 중",
        visibility: "공개 저장소",
    },
    {
        id: "hope-commit",
        index: "01",
        projectType: "tooling",
        presentation: "tooling-case",
        title: "Hope Commit",
        navigationLabel: "Hope Commit",
        eyebrow: "Hope 3.0.3 비공식 포크 / 커밋 검토 기능 추가 및 보완",
        summary:
            "SeungIl 님이 개발한 Hope 3.0.3을 포크해, 사용자가 입력한 로컬 커밋과 부모 커밋을 비교하고 변경 코드와 리뷰 결과를 HTML로 저장하는 Commit Diff 기능을 추가했습니다. 현재 수정 중인 파일과 이전 대화가 리뷰에 섞이지 않도록 커밋에 저장된 파일만 읽고, 리뷰 설명이 실제 변경 파일과 줄을 가리키는지 검증하도록 보완했습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "Hope 3.0.3 포크, 로컬 커밋 비교 및 HTML 리뷰 기능과 자동화 테스트 추가",
            },
            {
                label: "문제",
                value: "현재 수정 중인 파일이나 이전 대화가 섞여 입력한 커밋과 다른 코드까지 리뷰될 수 있음",
            },
            {
                label: "해결",
                value: "입력 커밋과 부모 커밋에 저장된 파일만 수집하고, 설명이 실제 변경 줄을 가리킬 때만 새 HTML 생성",
            },
        ],
        period: "2026.08.22 — 진행 중",
        route: "/projects/hope-commit",
        tags: ["JavaScript", "Node.js 22", "Git Objects", "JSON Schema"],
        visual: "hope-commit",
        stage: "개발 중",
        visibility: "공개 저장소",
    },
    {
        id: "defense",
        index: "02",
        projectType: "career",
        careerId: "beintech",
        presentation: "career-case",
        title: "차세대 군사법 정보 시스템",
        navigationLabel: "군사법",
        eyebrow: "BEINTECH / 국방부 SI / 백엔드 개발 및 운영",
        summary:
            "군 사법 업무와 군교정시설 수용 대상자의 인적정보 및 영장정보를 폐쇄망에서 처리하는 국방부 시스템입니다. 군교정 기능과 세 기관에서 받은 수용자 자료의 검증 및 반영 배치, WebSquare 요청의 CSRF 처리, Presigned URL 기반 파일 업로드와 운영 장애 대응을 담당했습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "군교정 기능과 수용자 인적정보 및 영장정보 검증 배치",
            },
            {
                label: "문제",
                value: "폐쇄망 수용자 정보 연계, 요청 위조와 대용량 파일의 WAS 부하",
            },
            {
                label: "해결",
                value: "기관별 검증 배치, Spring Security CSRF 토큰과 Presigned URL 직접 업로드",
            },
        ],
        period: "2024.06.23 — 2026.01.30",
        route: "/projects/defense",
        tags: ["Java 8", "eGov", "MyBatis", "Tibero", "Jenkins"],
        visual: "defense",
        stage: "종료",
        visibility: "공개 가능 범위",
    },
    {
        id: "webrtc",
        index: "2023 교육 프로젝트",
        projectType: "education",
        presentation: "prior-experience",
        title: "WebRTC/HLS 현장강의 보조 서비스",
        eyebrow: "카카오 클라우드 스쿨 3기 / 6인 팀",
        summary:
            "현장 강의를 WebRTC로 실시간 시청하고, 지나간 구간은 HLS로 다시 재생하는 서비스입니다. 6인 팀에서 RTP 영상을 HLS로 변환하는 서버와 React 시청 화면을 구현하고, HLS 재생 지연을 약 35초에서 17초로 줄였습니다.",
        homeFacts: [
            { label: "담당", value: "RTP 영상의 HLS 변환 서버와 실시간 및 다시보기 React 화면" },
            { label: "문제", value: "강의 영상의 HLS 다시보기가 약 35초 늦게 재생됨" },
            {
                label: "해결",
                value: "HLS 세그먼트 길이와 FFmpeg 인코딩 설정을 조정해 약 17초로 단축",
            },
        ],
        period: "2023.09.01 — 2023.11.10",
        route: "/projects/webrtc",
        tags: ["WebRTC", "HLS", "React", "FFmpeg", "GStreamer"],
        visual: "webrtc",
        stage: "종료",
        visibility: "공개 저장소",
    },
]

export const projectSummariesById = Object.fromEntries(
    projectSummaries.map((project) => [project.id, project]),
)

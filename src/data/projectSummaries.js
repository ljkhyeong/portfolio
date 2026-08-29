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
            "조직의 역할, 반복 업무, 의사결정과 인수인계를 관리하는 플랫폼입니다. Core와 링크, 점검, 이벤트, 보고서, 캘린더 및 WebRTC를 담당하는 6개 마이크로서비스로 구성했습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "Core와 6개 마이크로서비스의 API, 저장소, 테스트 및 배포",
            },
            {
                label: "문제",
                value: "재요청과 장애 복구 때 링크와 이벤트가 중복 처리될 수 있음",
            },
            {
                label: "해결",
                value: "요청 및 이벤트 ID로 중복을 막고, 결과 미확인 전송은 자동 재시도에서 제외",
            },
        ],
        period: "2026.07.20 — 진행 중",
        route: "/projects/baton",
        tags: ["Java / Kotlin", "Spring Boot", "MySQL / PostgreSQL", "WebRTC / Messaging"],
        visual: "baton",
        stage: "개발 중",
        visibility: "일부 저장소 공개",
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
        summary:
            "KICS의 자료 요청을 통신사 및 전자영장 포털 규격으로 변환해 전달하는 공공 시스템입니다. 제출 자료를 KICS에 반영하는 서버와 Spring Batch를 개발합니다.",
        homeFacts: [
            {
                label: "담당",
                value: "KICS 요청 변환 및 전송, 제출 자료 반영 서버와 Spring Batch 개발",
            },
            {
                label: "문제",
                value: "기관별 형식 차이, 누적 이력 조회 지연과 PDF 완료 응답의 순서 역전",
            },
            {
                label: "해결",
                value: "기관별 변환과 공통 배치를 분리하고, 마지막 전송 ID 다음부터 조회하며 PDF 요청 상태를 다시 확인",
            },
        ],
        period: "2026.03.24 — 진행 중",
        route: "/projects/e-warrant",
        tags: ["Java 11", "Spring Boot 2.6", "Spring Batch", "Oracle DB", "WebSquare"],
        visual: "warrant",
        stage: "진행 중",
        visibility: "담당 범위만 공개",
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
            "공방 상품 주문과 클래스 예약을 관리하는 서비스입니다. 중복 결제 및 환불, 알림 유실, 예약 정원 및 재고 초과를 방지하고 AWS에 배포했습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "요구사항 정리, Spring 백엔드 및 React 화면 구현, 자동화 테스트와 AWS 운영",
            },
            {
                label: "문제",
                value: "결제 결과 미수신, 서버 중단에 따른 알림 유실과 동시 요청의 정원 및 재고 초과",
            },
            {
                label: "해결",
                value: "요청 ID로 중복 결제 방지, 미전송 알림 재처리, DB 잠금으로 정원 및 재고 초과 방지",
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
            "SeungIl 님의 Hope 3.0.3을 포크해 Commit Diff를 추가했습니다. 선택한 커밋과 확정한 비교 기준 사이의 변경만 검토해 HTML 리뷰를 만듭니다.",
        homeFacts: [
            {
                label: "담당",
                value: "Hope 3.0.3 포크, 로컬 커밋 비교 및 HTML 리뷰 기능과 자동화 테스트 추가",
            },
            {
                label: "문제",
                value: "작업 중인 파일과 이전 대화가 섞여 지정한 커밋 밖의 코드까지 리뷰될 수 있음",
            },
            {
                label: "해결",
                value: "선택한 커밋과 확정한 비교 기준에 저장된 코드만 읽고, 설명이 실제 변경 줄을 가리킬 때만 HTML 생성",
            },
        ],
        period: "2026.08.22 — 진행 중",
        route: "/projects/hope-commit",
        tags: ["JavaScript", "Node.js 22", "Git 객체 조회", "JSON Schema"],
        visual: "hope-commit",
        stage: "개발 중",
        visibility: "공개 저장소",
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
            "군 사법 및 군교정 업무를 처리하는 국방부 폐쇄망 시스템입니다. 군사법원, 군검찰 및 군사경찰의 자료 검증 배치, 요청 위조 차단과 대용량 파일 직접 업로드를 개발했습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "군교정 업무 화면과 수용자 인적정보 및 영장정보 검증 배치 개발",
            },
            {
                label: "문제",
                value: "기관별 자료 형식 차이, 상태 변경 요청 위조와 대용량 업로드의 서버 부하",
            },
            {
                label: "해결",
                value: "자료 검증 배치, CSRF 차단과 저장소 직접 업로드 적용",
            },
        ],
        period: "2024.06.23 — 2026.01.30",
        route: "/projects/defense",
        tags: ["Java 8", "전자정부 표준프레임워크 4.1", "MyBatis", "Tibero", "Jenkins"],
        visual: "defense",
        stage: "종료",
        visibility: "담당 범위만 공개",
    },
    {
        id: "webrtc",
        index: "2023 교육 프로젝트",
        projectType: "education",
        presentation: "prior-experience",
        title: "WebRTC/HLS 현장강의 보조 서비스",
        eyebrow: "카카오 클라우드 스쿨 3기 / 6인 팀",
        summary:
            "WebRTC 실시간 강의와 HLS 다시보기를 제공하는 서비스입니다. RTP-HLS 변환 서버와 React 화면을 맡아 재생 지연을 약 35초에서 약 17초로 줄였습니다.",
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
    },
]

export const projectSummariesById = Object.fromEntries(
    projectSummaries.map((project) => [project.id, project]),
)

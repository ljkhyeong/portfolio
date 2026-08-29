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
            "조직의 역할, 반복 업무, 의사결정과 인수인계를 한곳에서 관리하는 서비스입니다. 중앙 서비스인 Core는 조직 데이터와 조직 구성원이 작업 공간에 접속할 때 함께 사용하는 공유 키를 관리합니다. WebRTC 스터디룸 참여권을 발급할 때는 계정과 연결된 활동 중인 스터디 구성원인지 확인합니다. 링크 생성, URL 점검, 서비스 간 이벤트 전달, 주간 보고서, 캘린더 구독과 WebRTC 스터디룸은 6개 마이크로서비스가 각각 처리합니다.",
        homeFacts: [
            {
                label: "담당",
                value: "조직 데이터, 작업 공간 공유 키와 WebRTC 스터디룸 참여권을 관리하는 중앙 서비스의 서버 기능을 구현했습니다. 링크, URL 점검, 이벤트 전달, 보고서, 캘린더 및 WebRTC 스터디룸을 처리하는 6개 마이크로서비스의 서버 기능, 저장 방식, 자동화 테스트와 배포 절차도 구현했습니다.",
            },
            {
                label: "문제",
                value: "응답을 받지 못한 재요청이나 서버 중단 후 재처리에서 같은 링크와 이벤트가 두 번 반영될 위험",
            },
            {
                label: "해결",
                value: "GO는 같은 링크 요청에 기존 결과를 반환했습니다. RELAY는 받은 이벤트 ID를 저장하고, 같은 이벤트가 다시 들어와도 전송 대상별 작업을 한 번만 만들었습니다. 전송 전 일시 실패만 다시 처리하고, 외부 전송 성공 여부를 확인할 수 없으면 자동 재시도를 중단했습니다.",
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
            "전자영장 자료 제공 요청과 금융기관 및 통신사의 제출 자료를 독립망 사이에서 전달하는 공공 시스템입니다. LG CNS 컨소시엄에서 해양경찰 사건수사시스템(KICS) 요청을 통신사와 집행포털 규격으로 변환해 보내고, 연계를 통해 수신한 제출 자료를 다시 KICS에 반영하는 서버 기능과 Spring Batch를 개발하고 있습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "해양경찰 사건수사시스템(KICS) 요청을 통신사와 집행포털 규격으로 변환해 보내고, 제출 자료를 다시 KICS에 반영하는 서버 기능과 Spring Batch",
            },
            {
                label: "문제",
                value: "기관마다 자료 형식이 다르고, 전송 이력이 쌓일수록 뒤쪽 목록 조회가 느려지며, PDF 변환 완료 응답이 요청 저장보다 먼저 도착할 수 있음",
            },
            {
                label: "해결",
                value: "기관별 자료 변환과 공통 배치 단계를 분리하고, 신규 목록은 마지막 조회 위치 다음부터 불러오며, 먼저 도착한 PDF 변환 완료 응답은 요청 상태를 다시 조회해 반영",
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
            "공방 고객이 작품을 주문하고 클래스를 예약하며, 관리자가 상품, 재고, 일정과 주문 상태를 처리하는 서비스입니다. 결제 및 환불 요청 ID로 중복 처리를 막고, 결과를 확인할 수 없으면 결제사에서 기존 처리 결과를 다시 조회한 뒤 복구 배치로 재처리합니다. 외부 배송조회 등록 실패는 배치로 다시 처리하고, 택배사 배송 완료와 관리자의 주문 완료를 분리했습니다. 예약은 클래스와 예약 시간 행을 잠근 뒤 정원을 확인했으며, 옵션별 재고는 재고 행을 항상 같은 순서로 잠그고 차감했습니다. AWS 배포 및 운영 이력이 있습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "요구사항 정리, Java 및 Spring 백엔드와 React 화면 구현, 자동화 테스트, AWS 배포 및 운영 이력",
            },
            {
                label: "문제",
                value: "결제 승인 결과 미수신, 주문 저장 직후 서버 중단으로 인한 알림 유실과 동시 예약 및 주문 시 정원이나 옵션 재고 초과",
            },
            {
                label: "해결",
                value: "결제 요청 ID로 중복 승인을 막고, 미전송 알림은 DB에서 다시 처리했습니다. 클래스와 예약 시간 행을 잠근 뒤 정원을 확인했으며, 옵션 재고 행은 항상 같은 순서로 잠그고 차감했습니다.",
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
            "SeungIl 님이 개발한 Hope 3.0.3을 포크해 Commit Diff를 추가했습니다. 사용자가 고른 커밋과 비교 기준에 저장된 코드만 비교합니다. 일반 커밋은 첫 번째 부모, 최초 커밋은 빈 상태, 병합 커밋은 사용자가 고른 부모를 비교 기준으로 확정합니다. 현재 수정 파일과 이전 대화를 제외하고, 리뷰 설명이 실제 변경 파일과 줄을 가리키는지 확인한 뒤 HTML로 저장합니다.",
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
                value: "입력 커밋과 일반, 최초 및 병합 커밋별 규칙으로 확정한 비교 기준에 각각 저장된 파일만 수집하고, 설명이 실제 변경 줄을 가리킬 때만 새 HTML 생성",
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
            "군 사법 업무와 군교정시설 수용 대상자의 정보를 폐쇄망에서 처리하는 국방부 시스템입니다. 군사법원, 군검찰 및 군사경찰에서 받은 수용 대상자의 인적정보와 영장정보를 검증해 군교정 DB에 반영하는 배치를 개발했습니다. WebSquare 업무 화면의 상태 변경 요청 위조 차단, 대용량 파일 직접 업로드와 운영 장애 재처리도 담당했습니다.",
        homeFacts: [
            {
                label: "담당",
                value: "군교정 업무 화면과 군사법원, 군검찰 및 군사경찰에서 받은 수용 대상자의 인적정보 및 영장정보 검증 배치",
            },
            {
                label: "문제",
                value: "군사법원, 군검찰 및 군사경찰마다 다른 수용 대상자 자료 형식, 위조된 상태 변경 요청과 대용량 파일 업로드 시 업무 서버 부하",
            },
            {
                label: "해결",
                value: "기관별 자료를 검증해 군교정 DB에 반영하고, 위조 요청은 보안 토큰으로 차단하며, 대용량 파일은 업무 서버를 거치지 않고 저장소에 직접 업로드",
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
            "현장 강의를 WebRTC로 실시간 시청하고, 지나간 구간은 HLS로 다시 보는 서비스입니다. 6인 팀에서 mediasoup의 RTP 출력을 HLS로 변환하는 서버와 WebRTC 실시간 및 HLS 다시보기 React 화면을 구현하고, 팀 시연 환경에서 HLS 재생 지연을 약 35초에서 약 17초로 줄였습니다.",
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

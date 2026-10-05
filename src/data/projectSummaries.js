export const youthPolicyCoverage = { policies: 40, questionPolicies: 11, agePolicies: 9 }

export const projectSummaries = [
    {
        id: "baton",
        homeCategory: "personal",
        homeTypeLabel: "웹 서비스",
        index: "01",
        projectType: "personal",
        presentation: "featured",
        title: "BATON",
        navigationLabel: "BATON",
        eyebrow: "역할·반복 업무·인수인계 서비스",
        homeSummary:
            "역할·반복 업무·인수인계 문서를 기록하고, 여러 팀의 할 일과 다시 확인할 자료를 한 화면에서 봅니다.",
        homeRepository: {
            label: "GitHub",
            href: "https://github.com/ljkhyeong/baton",
        },
        summary:
            "역할·반복 업무·인수인계 문서를 기록하고 여러 팀의 할 일을 모아 보여 줍니다. 링크, URL 점검, 이벤트 전달, 주간 보고서, 캘린더 및 WebRTC는 6개 마이크로서비스로 분리했습니다.",
        homeFacts: {
            problem:
                "같은 링크 요청이나 이벤트가 다시 전달되면 링크와 전달 작업이 중복 생성될 수 있음",
            solution:
                "요청 UUID와 이벤트 ID로 중복 생성을 방지. 중단된 전송은 다른 서버가 같은 시도 UUID·멱등 키로 이어서 처리하고, 결과 미확인 건은 자동 재전송하지 않음",
        },
        period: "2026.07.20 — 현재",
        route: "/projects/baton",
        tags: ["Java / Kotlin", "Spring Boot", "MySQL / PostgreSQL", "RabbitMQ / AWS SQS FIFO"],
        visual: "baton",
        stage: "개발 중",
        visibility: "공개 저장소 6개",
        // 메인 서비스 지도와 상세 아키텍처 도식이 같은 역할 문구를 사용한다.
        coreRole: "조직, 역할 및 인수인계",
        serviceLinks: [
            { id: "go", name: "GO", route: "/projects/baton/go", role: "짧은 링크 발급" },
            {
                id: "watch",
                name: "WATCH",
                route: "/projects/baton/watch",
                role: "외부 URL 상태 점검",
            },
            {
                id: "relay",
                name: "RELAY",
                route: "/projects/baton/relay",
                role: "Core 이벤트 외부 전달",
            },
            {
                id: "brief",
                name: "BRIEF",
                route: "/projects/baton/brief",
                role: "운영 점검 및 주간 보고서",
            },
            {
                id: "cal",
                name: "CAL",
                route: "/projects/baton/cal",
                role: "읽기 전용 캘린더 구독",
            },
            { id: "round", name: "ROUND", route: "/projects/baton/round", role: "WebRTC 스터디룸" },
        ],
    },
    {
        id: "warrant",
        homeCategory: "career",
        homeTypeLabel: "BEINTECH / 공공 SI",
        collaboration: "LG CNS 컨소시엄 참여",
        agencyScope: "5개 기관 연계 시스템",
        index: "01",
        projectType: "career",
        presentation: "career-case",
        title: "전송형 전자영장 시스템",
        navigationLabel: "전자영장",
        eyebrow: "BEINTECH / LG CNS 컨소시엄 / 5개 기관 전자영장 연계",
        homeSummary:
            "법무부, 공수처, 검찰, 경찰, 해양경찰의 전자영장 업무를 연계하는 시스템입니다.",
        summary:
            "법무부, 공수처, 검찰, 경찰, 해양경찰 등 5개 기관의 전자영장 업무를 연계하는 시스템입니다. KICS 요청을 기관별 규격으로 변환해 전달하고 제출 자료를 KICS에 반영하는 서버와 Spring Batch를 개발합니다.",
        homeFacts: {
            problem: "여러 서버의 동일 작업 중복 실행과 외부 API 대기 중 DB 연결 점유",
            solution:
                "SKIP LOCKED와 처리 상태로 작업 선점, API 전후 트랜잭션 분리와 중단 작업 재처리",
        },
        period: "2026.03.24 — 현재",
        route: "/projects/e-warrant",
        tags: ["Java 11", "Spring Boot 2.6", "Spring Batch", "Oracle Database", "WebSquare"],
        visual: "warrant",
        stage: "진행 중",
        visibility: "담당 구현과 테스트 요약 공개",
    },
    {
        id: "happygallery",
        homeCategory: "personal",
        homeTypeLabel: "웹 서비스",
        index: "02",
        projectType: "personal",
        presentation: "featured",
        title: "happyGallery",
        navigationLabel: "happyGallery",
        eyebrow: "공방 상품 판매 및 예약 서비스",
        homeSummary:
            "상품 주문, 클래스 예약과 스마트스토어 주문·재고 연동을 한 곳에서 처리하는 공방 서비스입니다.",
        liveSite: {
            label: "서비스 보기",
            href: "https://happy-gallery.com",
            note: "배포된 공방 홈페이지와 작품·클래스 안내",
        },
        homeRepository: {
            label: "GitHub",
            href: "https://github.com/ljkhyeong/happyGallery",
        },
        summary:
            "공방 상품 주문과 클래스 예약을 처리합니다. 카드·간편결제, 스마트스토어 주문·재고 동기화와 공휴일·주소 조회를 구현했습니다.",
        homeFacts: {
            problem:
                "결제사 응답 유실, 서버 중단에 따른 알림 유실과 스마트스토어 주문 재수신 시 재고 중복 반영",
            solution:
                "결제·환불 키를 재사용하고 미전송 알림을 재처리. 스마트스토어 주문은 수량 변경분만 재고에 반영",
        },
        period: "2026.02.21 — 현재",
        route: "/projects/happygallery",
        tags: ["Java 25", "Spring Boot 4.1", "React 19", "MySQL / Redis"],
        visual: "gallery",
        stage: "배포 완료",
        visibility: "서비스·저장소 공개",
    },
    {
        id: "youth-policy-mate",
        homeCategory: "more",
        homeTypeLabel: "모바일 웹앱",
        index: "01",
        projectType: "webapp",
        presentation: "webapp-case",
        title: "청년정책메이트",
        navigationLabel: "청년정책메이트",
        eyebrow: "서울 청년 정책 탐색 및 일정 관리 웹앱",
        homeRepository: {
            label: "GitHub",
            href: "https://github.com/ljkhyeong/youth-policy-mate",
        },
        summary: `정책 ${youthPolicyCoverage.policies}건을 검색하고 ${youthPolicyCoverage.questionPolicies}종의 신청 요건을 확인합니다. 저장한 정책의 변경 비교·마감 일정·알림과 관리자용 조건 규칙 검토를 제공합니다.`,
        period: "2026.08.30 — 현재",
        route: "/projects/youth-policy-mate",
        tags: ["Java 25 / Spring Boot 4.1", "Next.js 16 / React 19", "TypeScript", "PostgreSQL 18"],
        visual: "youth-policy-mate",
        stage: "개발 중",
        visibility: "공개 저장소",
    },
    {
        id: "hope-commit",
        homeCategory: "more",
        homeTypeLabel: "AI 스킬 / Codex·Claude Code",
        index: "01",
        projectType: "tooling",
        presentation: "tooling-case",
        title: "Hope Commit",
        homeRepository: {
            label: "GitHub",
            href: "https://github.com/ljkhyeong/hope-commit",
        },
        navigationLabel: "Hope Commit",
        eyebrow: "Hope 6.0.0 비공식 포크 / 커밋 AI 리뷰 HTML",
        summary:
            "SeungIl 님의 Hope 6.0.0을 포크한 비공식 도구입니다. 지정한 커밋만 검토하고 각 설명을 실제 변경 줄에 연결한 오프라인 HTML 리뷰를 생성합니다.",
        period: "2026.08.22 — 현재",
        route: "/projects/hope-commit",
        tags: ["JavaScript", "Node.js 22", "Git CLI", "Playwright"],
        visual: "hope-commit",
        stage: "개발 중",
        visibility: "공개 저장소",
    },
    {
        id: "intent-trace",
        homeCategory: "more",
        homeTypeLabel: "IDE 플러그인 / IntelliJ·Zed·MCP",
        index: "02",
        projectType: "tooling",
        presentation: "tooling-case",
        title: "IntentTrace",
        homeRepository: {
            label: "GitHub",
            href: "https://github.com/ljkhyeong/intent-trace",
        },
        navigationLabel: "IntentTrace",
        eyebrow: "AI 코드 변경 요청·근거·검증 기록",
        summary:
            "AI 코드의 변경 이유와 검증 결과를 커밋·파일·줄에 연결해 남깁니다. 웹·IDE에서 기록을 검색하고 원본 코드, 이슈·PR과 CI 결과를 함께 확인합니다.",
        period: "2026.08.27 — 현재",
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
    },
    {
        id: "defense",
        homeCategory: "career",
        homeTypeLabel: "BEINTECH / 국방부 SI",
        agencyScope: "국방부 산하 4개 기관 연계 시스템",
        index: "02",
        projectType: "career",
        presentation: "career-case",
        title: "차세대 군사법 정보 시스템",
        navigationLabel: "군사법",
        eyebrow: "BEINTECH / 국방부 산하 4개 기관 연계 / 백엔드 개발 및 운영",
        summary:
            "국방부 산하 4개 기관의 자료를 연계하는 폐쇄망 시스템입니다. 수용자 자료 반영 배치, CSRF 차단과 대용량 파일 직접 업로드를 개발했습니다. 중단된 배치는 Jenkins·JEUS·Tibero 정보를 대조해 재실행했습니다.",
        period: "2024.06.23 — 2026.01.30",
        route: "/projects/defense",
        tags: ["Java 8", "전자정부 표준프레임워크 4.1", "MyBatis", "Tibero", "Jenkins"],
        visual: "defense",
        stage: "종료",
        visibility: "담당 범위만 공개",
    },
    {
        id: "webrtc",
        homeCategory: "more",
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
        period: "2023.09.01 — 2023.11.10",
        route: "/projects/webrtc",
        tags: ["WebRTC", "HLS", "React", "FFmpeg", "GStreamer"],
        visual: "webrtc",
        stage: "종료",
        visibility: "공개 저장소",
    },
]

// 메인은 경력, 대표 개인 프로젝트, 나머지 순서로 읽게 한다. 세부 유형은 각 행의 라벨로 표시한다.
export const homeProjectCategories = [
    { id: "career", label: "경력 프로젝트" },
    { id: "personal", label: "개인 프로젝트" },
    { id: "more", label: "그 밖의 프로젝트" },
]

export const projectSummariesById = Object.fromEntries(
    projectSummaries.map((project) => [project.id, project]),
)

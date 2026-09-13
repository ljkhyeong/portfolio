export const homeSkillGroups = [
    {
        id: "backend",
        label: "백엔드",
        summary:
            "Java와 Spring으로 공공기관 연계 API와 배치, 주문·예약 API와 정책 신청 조건 판정 로직을 개발했습니다.",
        items: [
            { name: "Java" },
            { name: "Spring Boot / Spring MVC" },
            { name: "Spring Batch" },
            { name: "JPA / MyBatis" },
            { name: "MySQL / PostgreSQL" },
            { name: "RabbitMQ / AWS SQS FIFO" },
        ],
    },
    {
        id: "reliability",
        label: "중복 방지 및 작업 복구",
        summary:
            "같은 요청에는 기존 식별자를 재사용해 중복 실행을 막고, DB에 저장한 작업은 서버 중단 후 다시 처리하도록 구현했습니다.",
        items: [
            {
                name: "이중화 서버의 연계 작업 선점",
                detail: "SKIP LOCKED로 잠긴 행을 건너뛰고 처리 상태를 변경해 작업을 선점합니다. 외부 API는 트랜잭션 밖에서 호출하고, 오래된 처리 중 상태는 재처리 대상으로 돌립니다.",
                examples: [{ label: "전자영장", route: "/projects/e-warrant" }],
            },
            {
                name: "결제 및 환불 중복 실행 방지",
                detail: "결제 승인에는 orderId를, 환불에는 최초 생성 시 저장한 UUID를 모든 재시도에 재사용합니다. 결과가 불확실하면 PG 처리 결과를 조회합니다.",
                examples: [{ label: "happyGallery", route: "/projects/happygallery" }],
            },
            {
                name: "서버 중단 후 알림 재처리",
                detail: "주문 또는 예약과 알림 작업을 같은 트랜잭션에 저장합니다. 대기 중이거나 처리 기한이 지난 작업은 스케줄러가 다시 처리합니다.",
                examples: [{ label: "happyGallery", route: "/projects/happygallery" }],
            },
            {
                name: "정원 및 재고 초과 방지",
                detail: "클래스, 예약 슬롯과 재고 행을 잠가 동시 요청의 정원 및 재고 초과를 막습니다.",
                examples: [{ label: "happyGallery", route: "/projects/happygallery" }],
            },
            {
                name: "서버 중단 후 URL 점검 및 이벤트 전달 재개",
                detail: "WATCH는 처리 기한이 지난 URL 점검을 새로 실행합니다. RELAY는 다른 서버가 같은 시도 UUID와 외부 서비스 멱등 키로 계속 처리합니다. 이전 서버의 늦은 결과는 반영하지 않습니다.",
                examples: [
                    { label: "BATON WATCH", route: "/projects/baton/watch" },
                    { label: "BATON RELAY", route: "/projects/baton/relay" },
                ],
            },
            {
                name: "정책 조건의 버전 관리와 AI 초안 검토",
                detail: "질문과 판정 규칙을 버전 데이터로 관리합니다. AI 결과는 현재 공고·요청과 대조해 초안으로 저장하고, 관리자 검토 후 적용합니다.",
                examples: [{ label: "청년정책메이트", route: "/projects/youth-policy-mate" }],
            },
        ],
    },
    {
        id: "delivery",
        label: "테스트 및 운영",
        summary:
            "통합 및 화면 테스트로 주요 기능을 검증합니다. Jenkins 실행 이력, JEUS 로그와 Tibero 상태로 중단된 기관 배치를 찾습니다.",
        items: [
            {
                name: "통합 테스트",
                detail: "JUnit과 Testcontainers로 주문, 결제, 예약과 작업 복구 규칙을 실제 DB에서 확인합니다.",
                examples: [
                    { label: "happyGallery", route: "/projects/happygallery" },
                    { label: "청년정책메이트", route: "/projects/youth-policy-mate" },
                ],
            },
            {
                name: "API 문서 검증",
                detail: "Spring REST Docs와 OpenAPI로 구현과 문서의 요청 및 응답 형식을 함께 검증합니다.",
                examples: [{ label: "happyGallery", route: "/projects/happygallery" }],
            },
            {
                name: "화면 자동화 테스트",
                detail: "Playwright로 주문, 결제와 예약의 주요 흐름을 회귀 테스트합니다.",
                examples: [{ label: "happyGallery", route: "/projects/happygallery" }],
            },
            {
                name: "배포 상태 및 중단 배치 확인",
                detail: "Docker 배포 상태를 확인하고, Jenkins 실행 이력과 JEUS 로그 및 Tibero 상태를 대조해 중단된 기관 자료 반영 배치를 찾습니다.",
                examples: [
                    { label: "happyGallery", route: "/projects/happygallery" },
                    { label: "군사법", route: "/projects/defense" },
                ],
            },
        ],
    },
    {
        id: "ai-development",
        label: "AI 활용 개발",
        summary:
            "개인 프로젝트에서 작업이 길어져도 개발 규칙을 다시 확인하도록, 코드 수정 직후와 작업 종료 전에 검사 결과를 에이전트에 전달합니다.",
        items: [
            {
                name: "변경 파일에 맞춘 검사",
                detail: "파일 경로와 확장자로 검사 범위를 고르고, 포맷·컴파일 오류를 에이전트에 전달합니다. 검사 선택에 별도 LLM을 호출하지 않습니다.",
                examples: [
                    { label: "happyGallery", route: "/projects/happygallery#project-problems" },
                ],
            },
            {
                name: "계층 의존 규칙 자동 검사",
                detail: "ArchUnit으로 Controller의 저장소 직접 접근, 도메인의 인프라 의존과 서비스의 구현체 직접 참조를 검사합니다.",
            },
            {
                name: "작업 전체 변경 검토",
                detail: "작업 중 커밋과 새 파일까지 모아 전체 diff를 검토합니다. 자동 검사 결과를 바탕으로 코드 수정과 설계 판단은 작업 중인 에이전트가 맡습니다.",
            },
        ],
    },
    {
        id: "frontend",
        label: "프론트엔드",
        summary:
            "React와 TypeScript로 사용자 화면을 구현하고, 공공 업무 화면은 WebSquare로 개발합니다.",
        items: [
            { name: "JavaScript" },
            { name: "TypeScript" },
            { name: "React" },
            { name: "Next.js" },
            { name: "WebSquare" },
        ],
    },
]

export const homeSkillGroups = [
    {
        id: "backend",
        label: "백엔드",
        summary:
            "Java와 Spring으로 공공기관 연계 API와 배치, 주문 및 예약 서버와 정책 판정 모델을 개발했습니다.",
        items: [
            { name: "Java" },
            {
                name: "Spring Boot / Spring MVC",
                examples: [{ label: "청년정책메이트", route: "/projects/youth-policy-mate" }],
            },
            {
                name: "Spring Batch",
                examples: [{ label: "전자영장", route: "/projects/e-warrant" }],
            },
            { name: "JPA / MyBatis" },
            { name: "MySQL / PostgreSQL" },
            {
                name: "RabbitMQ / AWS SQS FIFO",
                examples: [{ label: "BATON", route: "/projects/baton" }],
            },
        ],
    },
    {
        id: "reliability",
        label: "안정성 설계",
        summary:
            "같은 요청에는 기존 식별자를 재사용해 중복 실행을 막고, DB에 저장한 작업은 서버 중단 후 다시 처리하도록 구현했습니다.",
        items: [
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
                detail: "클래스와 예약 시간, 재고 행을 잠가 동시 요청의 정원 및 재고 초과를 막습니다.",
                examples: [{ label: "happyGallery", route: "/projects/happygallery" }],
            },
            {
                name: "서버 중단 후 URL 점검 및 이벤트 전달 재개",
                detail: "WATCH는 처리 기한이 지난 URL 점검을 새 시도로 다시 실행합니다. RELAY는 중단 전 시도 UUID와 외부 서비스 중복 방지 키를 유지한 채 다른 서버가 이어받고, 이전 서버의 늦은 결과는 반영하지 않습니다.",
                examples: [
                    { label: "BATON WATCH", route: "/projects/baton/watch" },
                    { label: "BATON RELAY", route: "/projects/baton/relay" },
                ],
            },
            {
                name: "미확인 조건과 늦은 결과 차단",
                detail: "정책 조건을 확인할 수 없으면 추가 확인 필요로 남깁니다. 정책 개정과 요청 순번이 맞지 않는 AI 결과는 현재 후보에 반영하지 않습니다.",
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
        id: "frontend",
        label: "프론트엔드",
        summary:
            "React와 TypeScript로 사용자 화면을 구현하고, 공공 업무 화면은 WebSquare로 개발합니다.",
        items: [
            { name: "JavaScript" },
            { name: "TypeScript" },
            {
                name: "React",
                examples: [
                    { label: "happyGallery", route: "/projects/happygallery" },
                    { label: "청년정책메이트", route: "/projects/youth-policy-mate" },
                ],
            },
            {
                name: "Next.js",
                examples: [{ label: "청년정책메이트", route: "/projects/youth-policy-mate" }],
            },
            {
                name: "WebSquare",
                examples: [{ label: "군사법", route: "/projects/defense" }],
            },
        ],
    },
]

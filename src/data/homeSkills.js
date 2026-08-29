export const homeSkillGroups = [
    {
        id: "backend",
        label: "백엔드",
        summary:
            "Java와 Spring으로 기관 연계 API와 배치를 개발하고, RabbitMQ와 SQS로 서비스 이벤트를 전달합니다.",
        items: [
            { name: "Java" },
            { name: "Spring Boot / Spring MVC" },
            { name: "Spring Batch" },
            { name: "JPA / MyBatis" },
            { name: "MySQL / PostgreSQL" },
            { name: "RabbitMQ / SQS" },
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
            { name: "WebSquare" },
        ],
    },
    {
        id: "reliability",
        label: "중복 방지 및 장애 복구",
        summary: "같은 요청은 한 번만 처리하고, 서버가 멈추면 남은 작업을 다시 시작합니다.",
        items: [
            {
                name: "중복 결제 및 환불 방지",
                detail: "요청 ID와 처리 상태를 저장하고, 결과가 불확실하면 PG 처리 결과를 조회합니다.",
            },
            {
                name: "미전송 알림 재전송",
                detail: "주문 및 예약 상태와 알림을 함께 저장하고, 스케줄러가 미전송 알림을 다시 보냅니다.",
            },
            {
                name: "정원 및 재고 초과 방지",
                detail: "클래스와 예약 시간, 재고 행을 잠가 동시 요청의 정원 및 재고 초과를 막습니다.",
            },
            {
                name: "중단 작업 재처리",
                detail: "서버가 멈추면 다른 서버가 미완료 작업을 이어받고, 이전 서버의 늦은 결과는 버립니다.",
            },
        ],
    },
    {
        id: "delivery",
        label: "테스트 및 운영",
        summary: "통합 테스트와 화면 테스트로 기능을 확인하고, 로그와 DB에서 장애 지점을 찾습니다.",
        items: [
            {
                name: "통합 테스트",
                detail: "JUnit과 Testcontainers로 주문, 결제와 예약 규칙을 실제 DB에서 확인합니다.",
            },
            {
                name: "API 문서 검증",
                detail: "Spring REST Docs와 OpenAPI로 구현과 문서의 요청 및 응답 형식을 함께 검증합니다.",
            },
            {
                name: "화면 자동화 테스트",
                detail: "Playwright로 주문, 결제와 예약의 주요 흐름을 회귀 테스트합니다.",
            },
            {
                name: "배포 및 장애 분석",
                detail: "Docker 상태, Jenkins 배치 이력, 서버 로그와 DB 상태를 대조해 장애 지점을 찾습니다.",
            },
        ],
    },
]

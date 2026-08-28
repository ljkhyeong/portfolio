export const homeSkillGroups = [
    {
        id: "backend",
        label: "백엔드",
        summary:
            "Java와 Spring으로 기관 간 자료를 주고받는 API와 배치를 개발하고, RabbitMQ와 SQS로 서비스 간 이벤트를 전달합니다.",
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
        label: "중복 처리 방지 및 장애 복구",
        summary: "결제 및 환불, 알림, 예약 및 재고에서 중복 실행과 작업 유실을 방지합니다.",
        items: [
            {
                name: "중복 결제 및 환불 방지",
                detail: "요청 ID와 처리 상태를 저장하고 결제사(PG)의 기존 결과를 다시 조회해, 같은 요청이 와도 승인이나 환불을 한 번만 처리합니다.",
            },
            {
                name: "서버 중단으로 남은 알림 재전송",
                detail: "주문 및 예약 상태와 보낼 알림을 같은 DB 트랜잭션에 저장하고, 남은 알림은 스케줄러가 다시 전송합니다.",
            },
            {
                name: "동시 예약 및 재고 초과 차감 방지",
                detail: "좌석과 재고 행을 항상 같은 순서로 잠근 뒤 남은 수량을 확인하고 차감해, 동시에 요청해도 수량을 초과하지 않게 합니다.",
            },
            {
                name: "중단 작업 재처리",
                detail: "처리 중인 서버가 멈추면 일정 시간 뒤 다른 서버가 DB의 미완료 작업을 이어받고, 먼저 실행한 서버의 늦은 결과는 저장하지 않습니다.",
            },
        ],
    },
    {
        id: "delivery",
        label: "테스트 및 운영",
        summary:
            "실제 DB를 사용하는 통합 테스트, 주요 화면 자동화 테스트와 로그 및 DB 조회로 변경 사항과 운영 장애를 확인합니다.",
        items: [
            {
                name: "통합 테스트",
                detail: "JUnit과 Testcontainers로 주문, 결제와 예약 등의 업무 규칙과 실제 DB 동작을 확인합니다.",
            },
            {
                name: "API 요청 및 응답 문서 검증",
                detail: "Spring REST Docs와 OpenAPI로 요청 및 응답 형식이 API 문서와 함께 바뀌는지 확인합니다.",
            },
            {
                name: "주요 화면 자동화 테스트",
                detail: "Playwright로 주문, 결제, 예약과 주요 사용자 흐름이 변경 후에도 계속 동작하는지 확인합니다.",
            },
            {
                name: "배포 및 장애 분석",
                detail: "Docker 배포 상태, Jenkins 배치 실행 이력, 서버 로그와 DB 처리 상태를 대조해 장애가 발생한 단계를 찾습니다.",
            },
        ],
    },
]

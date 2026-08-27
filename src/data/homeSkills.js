export const homeSkillGroups = [
    {
        id: "backend",
        label: "백엔드",
        summary: "Java와 Spring 기반으로 API, 기관 연계 배치와 메시지 처리를 구현합니다.",
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
                detail: "요청 ID와 처리 상태를 저장하고 PG 결과를 다시 조회해, 같은 요청이 와도 승인이나 환불을 한 번만 처리합니다.",
            },
            {
                name: "중단된 알림 재전송",
                detail: "주문 및 예약 상태와 보낼 알림을 같은 DB 트랜잭션에 저장하고, 남은 알림은 스케줄러가 다시 전송합니다.",
            },
            {
                name: "동시 예약 및 재고 초과 차감 방지",
                detail: "좌석과 재고 행을 항상 같은 순서로 잠근 뒤 확인하고 변경해, 동시에 요청해도 수량을 초과하지 않게 합니다.",
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
        summary: "통합 및 계약 테스트, 브라우저 E2E와 운영 장애 분석으로 동작을 확인합니다.",
        items: [
            {
                name: "통합 테스트",
                detail: "JUnit과 Testcontainers로 도메인 규칙과 실제 DB 동작을 확인합니다.",
            },
            {
                name: "API 계약 검증",
                detail: "Spring REST Docs와 OpenAPI로 요청 및 응답 계약과 문서를 동기화합니다.",
            },
            {
                name: "브라우저 E2E",
                detail: "Playwright로 주문, 결제, 예약과 주요 사용자 흐름의 회귀를 확인합니다.",
            },
            {
                name: "배포 및 장애 분석",
                detail: "Docker 배포, Jenkins 배치 실행과 로그 및 DB 조회로 운영 장애를 추적합니다.",
            },
        ],
    },
]

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
        label: "데이터 정합성 및 장애 대응",
        summary: "결제 및 환불, 알림, 예약 및 재고에서 중복 실행과 작업 유실을 방지합니다.",
        items: [
            {
                name: "결제 및 환불 멱등성",
                detail: "멱등 키와 처리 상태, PG 결과 조회로 재요청의 중복 승인 및 환불을 방지합니다.",
            },
            {
                name: "알림 아웃박스",
                detail: "상태 변경과 알림 작업을 같은 트랜잭션에 저장하고 미전송 작업을 다시 처리합니다.",
            },
            {
                name: "예약 및 재고 동시성 제어",
                detail: "비관적 락과 고정된 락 순서로 초과 예약과 재고 중복 차감을 방지합니다.",
            },
            {
                name: "중단 작업 재처리",
                detail: "작업 선점 토큰과 상태 전이로 이전 실행 결과를 차단하고 중단된 작업을 이어서 처리합니다.",
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

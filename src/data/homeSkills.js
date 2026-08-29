export const homeSkillGroups = [
    {
        id: "backend",
        label: "백엔드",
        summary:
            "Java와 Spring으로 KICS 요청을 기관별 형식으로 바꾸고 제출 자료를 KICS에 반영하는 API와 배치를 개발합니다. RabbitMQ와 SQS로 BATON 이벤트를 전달합니다.",
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
        id: "reliability",
        label: "결제 및 환불 재요청, 서버 중단 처리",
        summary:
            "결제 승인 orderId와 환불 UUID를 재사용하고, DB에 남은 알림과 처리 기한이 지난 URL 점검을 다른 실행이 이어받게 했습니다.",
        items: [
            {
                name: "같은 결제 승인과 환불 1건 유지",
                detail: "결제 승인에는 orderId, 환불에는 생성할 때 저장한 UUID를 모든 재시도에 재사용합니다. 결과가 불확실하면 PG 처리 결과를 조회합니다.",
            },
            {
                name: "서버 중단 뒤 알림 작업 인계",
                detail: "주문 또는 예약과 알림 작업을 같은 트랜잭션에 저장하고, 대기 중이거나 처리 기한이 지난 작업은 스케줄러가 가져갑니다.",
            },
            {
                name: "정원 및 재고 초과 방지",
                detail: "클래스와 예약 시간, 재고 행을 잠가 동시 요청의 정원 및 재고 초과를 막습니다.",
            },
            {
                name: "중단된 URL 점검 및 이벤트 전달 인계",
                detail: "WATCH는 처리 기한이 지난 URL 점검을 다른 서버가 새 시도로 실행합니다. RELAY는 중단 전 시도 UUID와 제공자 멱등 키를 유지한 채 처리 권한만 넘기고 이전 서버의 늦은 결과를 버립니다.",
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
                name: "배포 상태 및 중단 배치 확인",
                detail: "Docker 배포 상태를 확인하고, Jenkins 실행 이력과 JEUS 로그 및 Tibero 상태를 대조해 중단된 기관 자료 반영 배치를 찾습니다.",
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
            { name: "WebSquare" },
        ],
    },
]

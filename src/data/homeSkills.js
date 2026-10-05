// 메인 기술 영역. 구현 사례는 프로젝트 카드와 상세에서 설명하므로 기술 이름과 사용 범위만 둔다.
export const homeSkillGroups = [
    {
        id: "backend",
        label: "백엔드",
        summary:
            "Java와 Spring으로 공공기관 연계 API와 배치, 주문·예약 API와 정책 신청 조건 판정 로직을 개발했습니다.",
        items: [
            "Java",
            "Spring Boot / Spring MVC",
            "Spring Batch",
            "JPA / MyBatis",
            "MySQL / PostgreSQL",
            "RabbitMQ / AWS SQS FIFO",
        ],
    },
    {
        id: "delivery",
        label: "테스트 및 운영",
        summary:
            "통합·화면 테스트로 주문, 결제, 예약과 작업 복구를 검증합니다. 폐쇄망에서는 실행 이력과 로그로 중단된 기관 배치를 찾아 재실행했습니다.",
        items: [
            "JUnit / Testcontainers",
            "Spring REST Docs / OpenAPI",
            "Playwright",
            "ArchUnit",
            "Docker / k3s",
            "Jenkins / JEUS / Tibero",
        ],
    },
    {
        id: "ai-development",
        label: "AI 활용 개발",
        summary:
            "개인 프로젝트에 Codex 훅을 연결해 파일 수정 직후 ESLint·컴파일 검사를, 작업 종료 전 전체 diff·ArchUnit 검사를 실행하고 결과를 AI 에이전트에 전달합니다.",
        items: ["Codex 훅", "변경 파일별 검사", "작업 전체 diff 검토"],
        link: { label: "happyGallery 적용 사례", route: "/projects/happygallery#project-problems" },
    },
    {
        id: "frontend",
        label: "프론트엔드",
        summary:
            "React와 TypeScript로 사용자 화면을 구현하고, 공공 업무 화면은 WebSquare로 개발합니다.",
        items: ["JavaScript", "TypeScript", "React", "Next.js", "WebSquare"],
    },
]

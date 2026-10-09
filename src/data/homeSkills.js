// 메인 학습과 기술 영역. 구현 사례는 프로젝트에서 설명하므로 여기에는 기술 이름만 쉼표로 나열한다.
// AI 활용은 도구 이름보다 쓰는 방식이 중요해 한 문장으로 쓴다.
export const homeSkillGroups = [
    {
        id: "backend",
        label: "백엔드",
        items: [
            "Java",
            "Spring Boot",
            "Spring MVC",
            "Spring Batch",
            "JPA",
            "MyBatis",
            "MySQL",
            "PostgreSQL",
            "RabbitMQ",
            "AWS SQS FIFO",
        ],
    },
    {
        id: "delivery",
        label: "테스트와 운영",
        items: [
            "JUnit",
            "Testcontainers",
            "Spring REST Docs",
            "OpenAPI",
            "Playwright",
            "ArchUnit",
            "Docker",
            "k3s",
            "GitHub Actions",
            "Jenkins",
            "JEUS",
            "Tibero",
        ],
    },
    {
        id: "ai-development",
        label: "AI 활용",
        summary:
            "Codex 훅으로 파일을 수정할 때마다 ESLint와 컴파일 검사를, 작업을 끝내기 전에는 전체 diff와 ArchUnit 검사를 실행합니다.",
        link: { label: "happyGallery 적용 사례", route: "/projects/happygallery#project-problems" },
    },
    {
        id: "frontend",
        label: "프론트엔드",
        items: ["JavaScript", "TypeScript", "React", "Next.js", "WebSquare"],
    },
]

import { describe, expect, it } from "vitest"
import { careers } from "./profile"
import { projectSummaries, projectSummariesById } from "./projectSummaries"
import {
    careerCaseStudies,
    educationCaseStudies,
    personalCaseStudies,
    projectsById,
    toolingCaseStudies,
    webappCaseStudies,
} from "./projects"

describe("project summary data", () => {
    it("keeps home summaries in the same order and content as detailed projects", () => {
        expect(Object.keys(projectsById)).toEqual(projectSummaries.map((project) => project.id))

        projectSummaries.forEach((summary) => {
            expect(projectsById[summary.id]).toMatchObject(summary)
            expect(projectSummariesById[summary.id]).toBe(summary)
        })
    })

    it("keeps BATON home service links aligned with detailed microservices", () => {
        const detailedServiceLinks = projectsById.baton.services
            .filter((service) => !service.primary)
            .map(({ id, name, route }) => ({ id, name, route }))

        expect(projectSummariesById.baton.serviceLinks).toEqual(detailedServiceLinks)
        expect(detailedServiceLinks.map((service) => service.id)).toEqual([
            "go",
            "watch",
            "relay",
            "brief",
            "cal",
            "round",
        ])
    })

    it("separates career, personal, webapp, tooling, and education projects in recruiter-first order", () => {
        expect(careerCaseStudies.map((project) => project.id)).toEqual(["warrant", "defense"])
        expect(personalCaseStudies.map((project) => project.id)).toEqual(["baton", "happygallery"])
        expect(webappCaseStudies.map((project) => project.id)).toEqual(["youth-policy-mate"])
        expect(toolingCaseStudies.map((project) => project.id)).toEqual([
            "hope-commit",
            "intent-trace",
        ])
        expect(educationCaseStudies.map((project) => project.id)).toEqual(["webrtc"])
    })

    it("separates Hope Commit fork attribution from the added Commit Diff scope", () => {
        const hopeCommit = projectsById["hope-commit"]

        expect(hopeCommit.category).toBe("오픈소스 및 개발 도구")
        expect(hopeCommit.status.text).toContain("SeungIl 님의 Hope 6.0.0")
        expect(hopeCommit.status.text).toContain("제가 추가한 Commit Diff")
        expect(hopeCommit.status.text).toContain("README와 NOTICE에 구분")
        expect(hopeCommit.status.text).toContain("공개 릴리스와 main은 v5.0.2")
        expect(hopeCommit.status.text).toContain("Commit Diff")
        expect(hopeCommit.links).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ href: "https://github.com/ljkhyeong/hope-commit" }),
                expect.objectContaining({ href: "https://github.com/dkstm95/hope" }),
            ]),
        )
        expect(hopeCommit.links).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    href: "https://github.com/ljkhyeong/hope-commit/actions/runs/33632058777",
                }),
                expect.objectContaining({
                    href: "https://github.com/dkstm95/hope",
                    note: "SeungIl 님이 개발한 원본 프로젝트",
                }),
            ]),
        )
        expect(hopeCommit.proofs).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    item: "저장소 자동화 테스트",
                    result: expect.stringContaining("자동화 테스트 343개가 통과"),
                }),
            ]),
        )
    })

    it("IntentTrace의 검증 근거와 공개 및 릴리스 범위를 구분한다", () => {
        const intentTrace = projectsById["intent-trace"]

        expect(intentTrace.category).toBe("오픈소스 및 개발 도구")
        expect(intentTrace.status.text).toContain("v0.7.0")
        expect(intentTrace.status.text).toContain("0.12.3-SNAPSHOT")
        expect(intentTrace.architecture.tradeoff).toContain("별도 조회에서 GitHub 원본 코드와 비교")
        expect(intentTrace.proofs).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    item: "웹 기록 조회와 원본 코드 비교",
                    result: expect.stringContaining("웹에서 팀 공개 기록과 내 비공개 기록"),
                }),
            ]),
        )
        expect(intentTrace.documents).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ label: "변경 의도 기록 MVP" }),
                expect.objectContaining({ label: "IntelliJ 현재 줄 의도 조회" }),
                expect.objectContaining({ label: "IntelliJ 변경 기록 탐색" }),
                expect.objectContaining({ label: "릴리스 생성과 검증" }),
            ]),
        )
    })

    it("청년정책메이트의 실제 정책 화면과 미검증 외부 연동을 구분한다", () => {
        const youthPolicyMate = projectsById["youth-policy-mate"]

        expect(youthPolicyMate.projectType).toBe("webapp")
        expect(youthPolicyMate.screenshots.map((screenshot) => screenshot.src)).toEqual([
            "youth-policy-mate-home.webp",
            "youth-policy-mate-policies.webp",
            "youth-policy-mate-detail.webp",
            "youth-policy-mate-questions.webp",
        ])
        expect(
            youthPolicyMate.screenshots.map(({ width, height }) => `${width}x${height}`),
        ).toEqual(["780x1688", "780x1688", "780x1688", "780x1688"])
        expect(youthPolicyMate.screenshotNote).toContain("온통청년에서 수집해 저장한 공개 데이터")
        expect(youthPolicyMate.status.text).toContain("공개 정책 40건")
        expect(youthPolicyMate.status.text).toContain(
            "실제 OAuth 계정·외부 이메일 수신·AI 공급자는 미검증",
        )
        expect(youthPolicyMate.stack).toContain("Spring JDBC")
        expect(youthPolicyMate.proofs).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    item: "서버 자동화 검증",
                    result: expect.stringContaining("서버 테스트 436개"),
                }),
            ]),
        )
    })

    it("models BEINTECH as one current employment with two ordered projects", () => {
        expect(careers).toHaveLength(1)
        expect(careers[0]).toMatchObject({
            id: "beintech",
            organization: "BEINTECH",
            position: "백엔드 개발자",
            period: "2024.06 — 현재",
            projectIds: ["warrant", "defense"],
        })
    })

    it("gives every home project a concise responsibility, problem, and solution", () => {
        projectSummaries.forEach((project) => {
            expect(project.homeFacts.map((fact) => fact.label)).toEqual(["담당", "문제", "해결"])
            project.homeFacts.forEach((fact) => {
                expect(fact.value.trim().length).toBeGreaterThan(10)
            })
        })
    })

    it("기술 스택에는 실제 사용 기술만 표시한다", () => {
        expect(projectsById.warrant.stack).toEqual([
            "Java 11",
            "Spring Boot 2.6",
            "Spring Batch",
            "Oracle Database",
            "WebSquare",
            "Maven",
        ])
        expect(projectsById.warrant.stack).not.toContain("Spring Retry")
        expect(projectSummariesById.baton.tags).toEqual([
            "Java / Kotlin",
            "Spring Boot",
            "MySQL / PostgreSQL",
            "RabbitMQ / AWS SQS FIFO",
        ])
        expect(projectSummariesById.happygallery.tags).toEqual([
            "Java 25",
            "Spring Boot 4.1",
            "React 19",
            "MySQL / Redis",
        ])
        expect(projectSummariesById["hope-commit"].tags).toEqual([
            "JavaScript",
            "Node.js 22",
            "Git CLI",
            "Playwright",
        ])
        expect(projectSummariesById["intent-trace"].tags).toEqual([
            "Kotlin / JDK 21",
            "Spring Boot / Spring AI",
            "PostgreSQL / H2",
            "IntelliJ Platform",
        ])
        expect(projectSummariesById["youth-policy-mate"].tags).toEqual([
            "Java 25 / Spring Boot 4.1",
            "Next.js 16 / React 19",
            "TypeScript",
            "PostgreSQL 18",
        ])
        expect(projectSummaries.flatMap((project) => project.tags).join(" | ")).not.toMatch(
            /SSR|Messaging|Git 객체 조회|GitHub App|Check Run/,
        )
        expect(projectSummariesById.warrant.tags).toContain("Spring Batch")
    })

    it("keeps BATON shared decisions in Core and service pages focused on their own failures", () => {
        const baton = projectsById.baton
        const sharedProblem = baton.problems.find((problem) => problem.number === "01")
        const coreProblem = baton.problems.find((problem) => problem.number === "02")
        const coreProof = baton.proofs.find((proof) => proof.item.startsWith("Core 인수인계"))

        expect(sharedProblem).toMatchObject({ shared: true })
        expect(coreProblem.serviceIds).toEqual(["core"])
        expect(baton.featuredProblemNumbers[0]).toBe("02")
        expect(coreProof).toMatchObject({
            method: "도메인 규칙 및 저장소 통합 테스트",
            result: expect.stringContaining("진행 중인 인수인계를 1건으로 유지"),
        })
        expect(coreProof.result).toContain("준비 → 전달 → 수락 순서")
        expect(coreProof.result).toContain("준비 또는 전달 단계만 취소")

        baton.services
            .filter((service) => !service.primary)
            .forEach((service) => {
                const serviceProblems = baton.problems.filter(
                    (problem) => problem.serviceIds.includes(service.id) && !problem.shared,
                )

                expect(serviceProblems).toHaveLength(2)
                expect(service.tradeoff).toEqual(expect.any(String))
                expect(service.evidence).not.toMatch(/^자동화 테스트/)
            })
    })

    it("grounds happyGallery payment and pass refund claims in accepted ADR decisions", () => {
        const happyGallery = projectsById.happygallery
        const paymentProblem = happyGallery.problems.find((problem) => problem.number === "02")
        const passRefundProblem = happyGallery.problems.find((problem) => problem.number === "07")
        const passRefundProof = happyGallery.proofs.find(
            (proof) => proof.item === "8회권 환불, 미래 예약과 잔여 횟수 일치",
        )

        expect(paymentProblem).toMatchObject({
            constraint: expect.stringContaining("실패 이력이 사라지거나"),
            decision: expect.stringContaining("독립 트랜잭션"),
        })
        expect(passRefundProblem).toMatchObject({
            title: "8회권 환불 시 예약 취소와 이용 횟수 및 사용 이력 반영",
            decision: expect.stringContaining("순서대로 잠그고"),
            boundary: expect.stringContaining("관리자 재처리"),
        })
        expect(happyGallery.featuredProblemNumbers).not.toContain("07")
        expect(happyGallery.featuredProblemNumbers).toEqual(["02", "03", "12", "14"])
        expect(passRefundProof).toMatchObject({
            method: "MySQL 및 Redis Testcontainers 통합 테스트",
            result: expect.stringContaining("8회분 환불 요청"),
        })
        expect(happyGallery.documents).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ label: "결제 승인 실패 이력과 중복 처리 방지" }),
                expect.objectContaining({ label: "8회권 사용, 취소 및 환불 정책" }),
            ]),
        )
        expect(happyGallery.screenshots.map(({ width, height }) => `${width}x${height}`)).toEqual([
            "1440x960",
            "1440x960",
            "1440x960",
            "1440x960",
            "1440x1200",
        ])
    })

    it("describes defense integration, security, and legacy incident response without placeholder terms", () => {
        const defense = projectsById.defense
        const securityProblem = defense.problems.find((problem) => problem.number === "02")
        const uploadProblem = defense.problems.find((problem) => problem.number === "03")
        const incidentProblem = defense.problems.find((problem) => problem.number === "04")
        const publicCopy = JSON.stringify(defense)

        expect(defense.systemTitle).toBe("수용자 인적정보 및 영장정보 연계 배치 흐름")
        expect(defense.visualCaption).toContain("수용자 인적정보와 영장정보")
        expect(defense.oneLine).toContain("CSRF 차단")
        expect(securityProblem.decision).toContain("WebSquare 공통 요청")
        expect(securityProblem.decision).toContain("필터에서 차단")
        expect(uploadProblem.decision).toContain("업로드 권한과 파일 정보를 검증")
        expect(uploadProblem.decision).toContain("Presigned URL")
        expect(uploadProblem.decision).toContain("저장소로 직접 전송")
        expect(incidentProblem.title).toContain("Jenkins")
        expect(incidentProblem.title).toContain("배치 중단 단계 확인")
        expect(incidentProblem.constraint).toContain("통합 모니터링이 없는 폐쇄망")
        expect(incidentProblem.constraint).toContain("장애 단계를 찾기 어려웠습니다")
        expect(incidentProblem.constraint).not.toContain("APM")
        expect(incidentProblem.constraint).not.toContain("분산 추적")
        expect(incidentProblem.decision).toContain("Jenkins")
        expect(incidentProblem.decision).toContain("JEUS 로그")
        expect(incidentProblem.decision).toContain("Tibero 상태")
        expect(publicCopy).not.toContain("기관 A")
        expect(publicCopy).not.toContain("기관 B")
        expect(publicCopy).not.toContain("기관 C")
        expect(publicCopy).not.toContain("배치 3종")
        expect(publicCopy).not.toContain("log → DB → batch")
        expect(publicCopy).not.toContain("WebSquare 보안 연동")
        expect(publicCopy).not.toContain("Apache Tika")
    })

    it("uses reader-facing terms and explains every implementation or verification claim", () => {
        const publicCopy = JSON.stringify(projectsById)
        const microservices = projectsById.baton.services.filter((service) => !service.primary)

        expect(publicCopy).not.toMatch(/\blease\b/i)
        expect(publicCopy).not.toContain("processingToken")
        expect(publicCopy).not.toContain("AFTER_COMMIT")
        expect(publicCopy).not.toContain("Fake PG")
        expect(publicCopy).not.toContain("작업 선점")
        expect(publicCopy).toContain("점검의 처리 기한")
        expect(publicCopy).not.toContain("테스트 스위트")
        expect(publicCopy).not.toContain("재인계")
        expect(publicCopy).not.toContain("BATON 생산자")
        expect(publicCopy).not.toContain("BATON 발행")

        microservices.forEach((service) => {
            expect(service.summary).toEqual(expect.any(String))
            expect(service.summary.length).toBeGreaterThan(20)
            expect(service.contribution).toEqual(expect.any(String))
            expect(service.contribution).toMatch(/다\.$/)
            expect(service.stack).toEqual(expect.any(Array))
            expect(service.stack.length).toBeGreaterThanOrEqual(6)
            expect(service.stack).toContain("Spring Boot 4.1")
            expect(service.stack).not.toEqual(
                expect.arrayContaining(["멱등성", "아웃박스", "Inbox", "헥사고날 아키텍처"]),
            )
        })

        Object.values(projectsById).forEach((project) => {
            project.proofs.forEach((proof) => {
                expect(proof).toEqual(
                    expect.objectContaining({
                        item: expect.any(String),
                        method: expect.any(String),
                        rule: expect.any(String),
                        result: expect.any(String),
                    }),
                )
                expect(proof).not.toHaveProperty("value")
                expect(proof).not.toHaveProperty("label")
                expect(proof).not.toHaveProperty("detail")
            })
        })
    })
})

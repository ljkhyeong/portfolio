import { describe, expect, it } from "vitest"
import { careers } from "./profile"
import { projectSummaries, projectSummariesById } from "./projectSummaries"
import {
    careerCaseStudies,
    educationCaseStudies,
    personalCaseStudies,
    projectsById,
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
        ])
    })

    it("separates career, personal, and education projects in recruiter-first order", () => {
        expect(careerCaseStudies.map((project) => project.id)).toEqual(["warrant", "defense"])
        expect(personalCaseStudies.map((project) => project.id)).toEqual(["baton", "happygallery"])
        expect(educationCaseStudies.map((project) => project.id)).toEqual(["webrtc"])
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
        expect(careerCaseStudies.map(({ id, careerId }) => ({ id, careerId }))).toEqual([
            { id: "warrant", careerId: "beintech" },
            { id: "defense", careerId: "beintech" },
        ])
    })

    it("gives every home project a concise responsibility, problem, and solution", () => {
        projectSummaries.forEach((project) => {
            expect(project.homeFacts.map((fact) => fact.label)).toEqual(["담당", "문제", "해결"])
            project.homeFacts.forEach((fact) => {
                expect(fact.value.trim().length).toBeGreaterThan(10)
            })
        })
    })

    it("keeps architecture patterns out of technology tags and names Spring Batch exactly", () => {
        expect(projectsById.warrant.stack).toEqual([
            "Java 11",
            "Spring Boot 2.6",
            "Spring Batch",
            "WebSquare",
            "Maven",
        ])
        expect(projectsById.warrant.stack).not.toContain("Spring Retry")
        expect(projectSummariesById.baton.tags).not.toContain("Outbox")
        expect(projectSummariesById.happygallery.tags).not.toContain("헥사고날 아키텍처")
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
            result: expect.stringContaining("열린 바통을 1건으로 유지"),
        })

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
            (proof) => proof.item === "8회권 전체 환불 정합성",
        )

        expect(paymentProblem).toMatchObject({
            constraint: expect.stringContaining("saveAndFlush"),
            decision: expect.stringContaining("REQUIRES_NEW"),
        })
        expect(passRefundProblem).toMatchObject({
            title: "8회권 환불과 미래 예약 정합성 유지",
            decision: expect.stringContaining("PK 순서"),
            boundary: expect.stringContaining("관리자 재처리"),
            print: expect.objectContaining({ label: "PASS / REFUND" }),
        })
        expect(happyGallery.featuredProblemNumbers).not.toContain("07")
        expect(passRefundProof).toMatchObject({
            method: "MySQL 및 Redis Testcontainers 통합 테스트",
            result: expect.stringContaining("8회분 환불 요청"),
        })
        expect(happyGallery.documents).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ label: "결제 승인 트랜잭션과 보상 경계" }),
                expect.objectContaining({ label: "8회권 사용, 취소 및 환불 정책" }),
            ]),
        )
    })

    it("uses reader-facing terms and explains every implementation or verification claim", () => {
        const publicCopy = JSON.stringify(projectsById)
        const microservices = projectsById.baton.services.filter((service) => !service.primary)

        expect(publicCopy).not.toContain("lease")
        expect(publicCopy).not.toContain("processingToken")
        expect(publicCopy).not.toContain("AFTER_COMMIT")
        expect(publicCopy).not.toContain("Fake PG")
        expect(publicCopy).toContain("작업 선점 만료 시간")
        expect(publicCopy).not.toContain("테스트 스위트")
        expect(publicCopy).not.toContain("재인계")
        expect(publicCopy).not.toContain("BATON 생산자")
        expect(publicCopy).not.toContain("BATON 발행")

        microservices.forEach((service) => {
            expect(service.summary).toEqual(expect.any(String))
            expect(service.summary.length).toBeGreaterThan(20)
            expect(service.contribution).toEqual(expect.any(String))
            expect(service.contribution).toMatch(/구현했습니다\.$/)
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

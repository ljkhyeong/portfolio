import { describe, expect, it } from "vitest"
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

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
})

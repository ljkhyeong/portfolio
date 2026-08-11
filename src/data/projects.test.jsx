import { describe, expect, it } from "vitest"
import { projectSummaries, projectSummariesById } from "./projectSummaries"
import { projectsById } from "./projects"

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
})

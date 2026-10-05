import { projectList } from "./projects"
import { verificationRails, verificationStatusLabels } from "./verificationRails"

test("모든 프로젝트 상세에 상태가 정해진 검증 단계가 있다", () => {
    projectList.forEach((project) => {
        const stages = verificationRails[project.id]

        expect(stages, project.id).toBeDefined()
        expect(stages.length, project.id).toBeGreaterThanOrEqual(3)
        stages.forEach((stage) => {
            expect(Object.keys(verificationStatusLabels)).toContain(stage.status)
            expect(stage.note.trim().length).toBeGreaterThan(0)
        })
    })
})

test("상세 설명에 미검증 범위가 있으면 레일에도 미검증 단계를 표시한다", () => {
    projectList.forEach((project) => {
        const statusText = typeof project.status === "object" ? project.status.text : project.status
        const hasUnverifiedStage = verificationRails[project.id].some(
            (stage) => stage.status === "unverified",
        )

        expect(hasUnverifiedStage, project.id).toBe(statusText.includes("미검증"))
    })
})

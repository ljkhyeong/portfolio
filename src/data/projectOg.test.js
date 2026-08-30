import { describe, expect, test } from "vitest"
import { projectOgCards } from "./projectOg"
import { routeMeta } from "./routeMeta"

describe("프로젝트 공유 이미지", () => {
    test("모든 상세 경로에 서로 다른 이미지와 설명을 지정한다", () => {
        const routes = Object.keys(routeMeta).filter((route) => route.startsWith("/projects/"))
        expect(projectOgCards.map((card) => card.route).sort()).toEqual(routes.sort())
        expect(new Set(projectOgCards.map((card) => card.image)).size).toBe(routes.length)
        for (const card of projectOgCards) {
            expect(routeMeta[card.route].image).toBe(card.image)
            expect(routeMeta[card.route].imageAlt).toContain("핵심 처리 흐름")
        }
    })

    test("BATON의 여섯 서비스도 개별 이미지로 구분한다", () => {
        expect(
            projectOgCards.filter((card) => card.serviceId).map((card) => card.serviceId),
        ).toEqual(["go", "watch", "relay", "brief", "cal", "round"])
        expect(routeMeta["/"].image).toBe("/og-cover.png")
    })
})

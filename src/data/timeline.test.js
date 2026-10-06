import { describe, expect, test } from "vitest"
import {
    formatPeriod,
    parseDate,
    timelineLanes,
    timelineNow,
    timelineYears,
    toTimelineItem,
} from "./timeline"

describe("메인 연표 기간", () => {
    test("화면에는 월까지만 쓰고 진행 중 표시는 그대로 둔다", () => {
        expect(formatPeriod("2026.02.21 — 현재")).toBe("2026.02 — 현재")
        expect(formatPeriod("2023.05 — 2023.11")).toBe("2023.05 — 2023.11")
    })

    test("일이 없는 끝 날짜는 그달 마지막 날로 본다", () => {
        expect(parseDate("2023.05")).toBe(Date.UTC(2023, 4, 1))
        expect(parseDate("2023.02", { end: true })).toBe(Date.UTC(2023, 1, 28))
        expect(parseDate("2026.03.24")).toBe(Date.UTC(2026, 2, 24))
    })

    test("진행 중인 기간은 기준일까지 그린다", () => {
        const asOf = Date.UTC(2026, 9, 5)
        const item = toTimelineItem(
            { id: "sample", label: "예시", period: "2026.07.20 — 현재" },
            asOf,
        )

        expect(item.end).toBe(asOf)
        expect(item.period).toBe("2026.07 — 현재")
    })

    test.each([
        ["2023 — 2024", /날짜 형식/],
        ["2023.05 ~ 2023.11", /시작 — 끝/],
        ["2023.11 — 2023.05", /빠릅니다/],
    ])("잘못된 기간 %s은 바로 알린다", (period, message) => {
        expect(() => toTimelineItem({ id: "sample", label: "예시", period })).toThrow(message)
    })

    test("모든 막대와 연도 눈금은 축 안에 있고 시작이 끝보다 앞선다", () => {
        const items = timelineLanes.flatMap((lane) => lane.items)

        items.forEach((item) => {
            expect(item.from).toBeGreaterThanOrEqual(0)
            expect(item.to).toBeLessThanOrEqual(100)
            expect(item.to).toBeGreaterThan(item.from)
        })
        timelineYears.forEach(({ at }) => {
            expect(at).toBeGreaterThan(0)
            expect(at).toBeLessThanOrEqual(timelineNow)
        })
        // 축 끝 여유는 석 달이라 "지금"은 해가 바뀌어도 축 오른쪽 끝 근처에 있다.
        expect(timelineNow).toBeGreaterThan(85)
        expect(timelineNow).toBeLessThan(100)
    })
})

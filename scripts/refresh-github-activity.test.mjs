import { describe, expect, it } from "vitest"
import { parseContributionCalendar } from "./refresh-github-activity.mjs"

const payload = (days, total = days.reduce((sum, day) => sum + day.contributionCount, 0)) => ({
    data: {
        user: {
            contributionsCollection: {
                contributionCalendar: {
                    totalContributions: total,
                    weeks: [
                        { contributionDays: days.slice(0, 2) },
                        { contributionDays: days.slice(2) },
                    ],
                },
            },
        },
    },
})

const days = [
    { date: "2026-10-01", contributionCount: 0 },
    { date: "2026-10-02", contributionCount: 3 },
    { date: "2026-10-03", contributionCount: 12 },
]

describe("parseContributionCalendar", () => {
    it("주 단위 응답을 날짜순 기여 수 배열로 바꾼다", () => {
        expect(parseContributionCalendar(payload(days), "ljkhyeong")).toEqual({
            login: "ljkhyeong",
            from: "2026-10-01",
            to: "2026-10-03",
            total: 15,
            days: [0, 3, 12],
        })
    })

    it("일별 합계와 전체 기여 수가 다르면 저장하지 않는다", () => {
        expect(() => parseContributionCalendar(payload(days, 99), "ljkhyeong")).toThrow(
            "일별 합계(15)와 전체 기여 수(99)가 다릅니다.",
        )
    })

    it("날짜 순서, 날짜 형식과 기여 수가 어긋나면 거부한다", () => {
        expect(() =>
            parseContributionCalendar(payload([days[1], days[0], days[2]]), "ljkhyeong"),
        ).toThrow("날짜순이 아닙니다")
        expect(() =>
            parseContributionCalendar(payload([{ date: "2026/10/01", contributionCount: 1 }]), "x"),
        ).toThrow("날짜 형식")
        expect(() =>
            parseContributionCalendar(
                payload([{ date: "2026-10-01", contributionCount: -1 }]),
                "x",
            ),
        ).toThrow("기여 수가 올바르지 않습니다")
    })

    it("GraphQL 오류와 빈 응답을 구분해 알린다", () => {
        expect(() =>
            parseContributionCalendar({ errors: [{ message: "Could not resolve user" }] }, "x"),
        ).toThrow("GitHub GraphQL 오류: Could not resolve user")
        expect(() => parseContributionCalendar({ data: { user: null } }, "x")).toThrow(
            "contributionCalendar가 없습니다",
        )
        expect(() => parseContributionCalendar(payload([]), "x")).toThrow(
            "기여 기록이 비어 있습니다",
        )
    })
})

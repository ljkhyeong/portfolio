import {
    activityLevel,
    activityThresholds,
    summarizeActivity,
    toActivityWeeks,
} from "./githubActivity"

test("기여가 있는 날의 사분위수로 단계를 나눈다", () => {
    const thresholds = activityThresholds([0, 1, 2, 3, 4, 5, 6, 7, 800])

    expect(thresholds).toEqual([3, 5, 7])
    expect(activityLevel(0, thresholds)).toBe(0)
    expect(activityLevel(2, thresholds)).toBe(1)
    expect(activityLevel(5, thresholds)).toBe(2)
    expect(activityLevel(7, thresholds)).toBe(3)
    expect(activityLevel(800, thresholds)).toBe(4)
})

test("일요일부터 주를 나누고 앞뒤 빈칸과 달 이름을 붙인다", () => {
    // 2026-09-30은 수요일이다.
    const weeks = toActivityWeeks({ from: "2026-09-30", days: [1, 0, 2, 0, 0, 3, 4, 1] })

    expect(weeks).toHaveLength(2)
    expect(weeks[0].days.slice(0, 3)).toEqual([null, null, null])
    expect(weeks[0].days[3]).toMatchObject({ date: "2026-09-30", count: 1 })
    expect(weeks[1].days[0]).toMatchObject({ date: "2026-10-04", count: 0, level: 0 })
    expect(weeks[1].days[1]).toMatchObject({ date: "2026-10-05", count: 3 })
    expect(weeks[1].days.slice(4)).toEqual([null, null, null])
    expect(weeks.map((week) => week.monthLabel)).toEqual(["9월", "10월"])
})

test("전체 기여 수와 활동한 날을 계산한다", () => {
    expect(summarizeActivity({ days: [0, 3, 0, 12] })).toEqual({ total: 15, activeDays: 2 })
})

// 저장한 기여 기록을 히트맵의 주 단위 열과 0~4 단계로 바꾼다.

const DAY_MS = 24 * 60 * 60 * 1000

const parseDate = (value) => {
    const [year, month, day] = value.split("-").map(Number)
    return new Date(Date.UTC(year, month - 1, day))
}

const formatDate = (date) => date.toISOString().slice(0, 10)

// 기여가 있는 날의 사분위수로 단계를 나눈다. 하루 기여가 매우 큰 날이 있어도 나머지 날이 구분된다.
export const activityThresholds = (days) => {
    const active = days.filter((count) => count > 0).sort((a, b) => a - b)
    if (active.length === 0) {
        return [0, 0, 0]
    }
    const at = (ratio) => active[Math.min(active.length - 1, Math.floor(active.length * ratio))]
    return [at(0.25), at(0.5), at(0.75)]
}

export const activityLevel = (count, [first, second, third]) => {
    if (count <= 0) return 0
    if (count <= first) return 1
    if (count <= second) return 2
    if (count <= third) return 3
    return 4
}

// GitHub 달력처럼 일요일부터 한 주를 만들고, 시작 주의 앞쪽과 마지막 주의 뒤쪽은 빈칸으로 채운다.
export const toActivityWeeks = ({ from, days }) => {
    const thresholds = activityThresholds(days)
    const start = parseDate(from)
    const cells = [
        ...Array.from({ length: start.getUTCDay() }, () => null),
        ...days.map((count, index) => {
            const date = formatDate(new Date(start.getTime() + index * DAY_MS))
            return { date, count, level: activityLevel(count, thresholds) }
        }),
    ]
    while (cells.length % 7 !== 0) {
        cells.push(null)
    }

    const weeks = []
    let previousMonth = null
    for (let index = 0; index < cells.length; index += 7) {
        const week = cells.slice(index, index + 7)
        const firstDay = week.find(Boolean)
        const month = Number(firstDay.date.slice(5, 7))
        weeks.push({ days: week, monthLabel: month !== previousMonth ? `${month}월` : null })
        previousMonth = month
    }
    return weeks
}

export const summarizeActivity = ({ days }) => ({
    total: days.reduce((sum, count) => sum + count, 0),
    activeDays: days.filter((count) => count > 0).length,
})

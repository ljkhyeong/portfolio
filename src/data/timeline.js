import activity from "./githubActivity.json"
import { education } from "./profile"
import { projectSummariesById } from "./projectSummaries"
import { warrantPerformance } from "./warrantEvidence"

// 메인 첫 화면 연표. 기간은 각 프로젝트의 period에서 읽고, 진행 중인 막대는 GitHub 기여 기록을
// 갱신한 날(activity.to)까지 그린다. 막대 옆 글은 확인한 결과와 그 조건이다.
const timelineNotes = {
    warrant: `성능 테스트 환경에서 ${warrantPerformance.load}로 ${warrantPerformance.duration} 동안 모두 처리`,
    defense: "중단된 기관 배치만 찾아 재실행",
    happygallery: "main 병합 시 k3s 자동 배포",
    baton: "통합 테스트에서 동시 요청 8건에도 링크 1건만 생성",
    "hope-commit": "GitHub Actions에서 자동화 테스트 343개 통과",
    webrtc: "팀 시연에서 재생 지연 약 35초 → 약 17초",
}

const ONGOING = "현재"
const DAY = 24 * 60 * 60 * 1000

const DATE_PATTERN = /^\d{4}\.\d{2}(\.\d{2})?$/

// "2026.02.21", "2023.05"를 날짜로 바꾼다. 일이 없는 끝 날짜는 그달 마지막 날로 본다.
// 형식이 다르면 연표 전체가 어긋나므로 모듈을 불러올 때 바로 알린다.
export const parseDate = (text, { end = false } = {}) => {
    if (!DATE_PATTERN.test(text ?? "")) {
        throw new Error(`연표 날짜 형식이 아닙니다: ${text} (YYYY.MM 또는 YYYY.MM.DD)`)
    }

    const [year, month, day] = text.split(".").map(Number)

    if (day) {
        return Date.UTC(year, month - 1, day)
    }

    return end ? Date.UTC(year, month, 0) : Date.UTC(year, month - 1, 1)
}

const splitPeriod = (period) => {
    const parts = period.split("—").map((part) => part.trim())

    if (parts.length !== 2) {
        throw new Error(`기간은 "시작 — 끝" 형식이어야 합니다: ${period}`)
    }

    return parts
}

// 화면에는 월까지만 쓴다. 예: "2026.02.21 — 현재" → "2026.02 — 현재"
export const formatPeriod = (period) =>
    splitPeriod(period)
        .map((part) => (part === ONGOING ? part : part.split(".").slice(0, 2).join(".")))
        .join(" — ")

const timelineAsOf = Date.parse(`${activity.to}T00:00:00Z`)

// 진행 중인 기간("현재")은 GitHub 기여 기록을 갱신한 날까지로 본다.
export const toTimelineItem = ({ id, label, period, route }, asOf = timelineAsOf) => {
    const [start, end] = splitPeriod(period)
    const item = {
        id,
        label,
        route,
        period: formatPeriod(period),
        start: parseDate(start),
        end: end === ONGOING ? asOf : parseDate(end, { end: true }),
        note: timelineNotes[id],
    }

    if (item.end < item.start) {
        throw new Error(`끝 날짜가 시작 날짜보다 빠릅니다: ${id} ${period}`)
    }

    return item
}

const projectItem = (id) => {
    const project = projectSummariesById[id]

    return toTimelineItem({
        id,
        label: project.timelineLabel ?? project.title,
        period: project.period,
        route: project.route,
    })
}

const byStart = (left, right) => left.start - right.start

const lanes = [
    { id: "career", label: "경력", items: ["defense", "warrant"].map(projectItem) },
    {
        id: "personal",
        label: "개인 프로젝트",
        items: ["happygallery", "baton", "hope-commit", "intent-trace", "youth-policy-mate"]
            .map(projectItem)
            .sort(byStart),
    },
    {
        id: "learning",
        label: "학습",
        items: [
            toTimelineItem({
                id: "education",
                label: education.timelineLabel,
                period: education.period,
            }),
            projectItem("webrtc"),
        ],
    },
]

const rangeStart = Math.min(...lanes.flatMap((lane) => lane.items.map((item) => item.start)))
// 축 끝은 기준일 뒤로 석 달 여유만 둔다. 그해 12월 31일까지 그리면 1월에 기록을 갱신할 때
// "지금"이 축의 80% 근처로 물러나고 남은 한 해가 빈 칸이 된다.
const END_MARGIN_DAYS = 92
const rangeEnd = timelineAsOf + END_MARGIN_DAYS * DAY
const toPercent = (time) =>
    Math.round(((time - rangeStart) / (rangeEnd - rangeStart)) * 10000) / 100

// 막대 위치는 백분율로 미리 계산한다. 화면은 이 값만 CSS 변수로 쓴다.
export const timelineLanes = lanes.map((lane) => ({
    ...lane,
    items: lane.items.map((item) => ({
        ...item,
        from: toPercent(item.start),
        to: toPercent(item.end),
    })),
}))

const firstYear = new Date(rangeStart).getUTCFullYear()
// 연도 눈금은 기준일이 든 해까지만 둔다. 축 끝 여유에 걸친 다음 해 눈금은 그리지 않는다.
const lastYear = new Date(timelineAsOf).getUTCFullYear()

export const timelineYears = Array.from({ length: lastYear - firstYear }, (_, index) => {
    const year = firstYear + index + 1
    return { year, at: toPercent(Date.UTC(year, 0, 1)) }
})

export const timelineNow = toPercent(timelineAsOf)

export const timelineRange = {
    from: new Date(rangeStart).toISOString().slice(0, 7).replace("-", "."),
    to: new Date(timelineAsOf).toISOString().slice(0, 7).replace("-", "."),
}

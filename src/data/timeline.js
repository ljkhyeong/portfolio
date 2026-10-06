import activity from "./githubActivity.json"
import { education } from "./profile"
import { projectSummariesById } from "./projectSummaries"
import { warrantPerformance } from "./warrantEvidence"

// 메인 첫 화면 연표. 기간은 각 프로젝트의 period에서 읽고, 진행 중인 막대는 GitHub 기여 기록을
// 갱신한 날(activity.to)까지 그린다. 막대 옆 글은 확인한 결과와 그 조건이다.
const timelineNotes = {
    warrant: `${warrantPerformance.load}로 ${warrantPerformance.duration} 동안 모두 처리, 성능 테스트 환경`,
    defense: "멈춘 배치를 찾아 해당 기관 배치만 다시 실행",
    happygallery: "공개 서비스로 배포",
    baton: "같은 요청 8건을 동시에 보내도 링크 1건, 통합 테스트",
    "hope-commit": "자동화 테스트 343개 통과",
    webrtc: "재생 지연 약 35초 → 약 17초, 팀 시연",
}

const ONGOING = "현재"
const DAY = 24 * 60 * 60 * 1000

// "2026.02.21", "2023.05"를 날짜로 바꾼다. 일이 없는 끝 날짜는 그달 마지막 날로 본다.
const parseDate = (text, { end = false } = {}) => {
    const [year, month, day] = text.split(".").map(Number)

    if (day) {
        return Date.UTC(year, month - 1, day)
    }

    return end ? Date.UTC(year, month, 0) : Date.UTC(year, month - 1, 1)
}

const splitPeriod = (period) => period.split("—").map((part) => part.trim())

// 화면에는 월까지만 쓴다. 예: "2026.02.21 — 현재" → "2026.02 — 현재"
export const formatPeriod = (period) =>
    splitPeriod(period)
        .map((part) => (part === ONGOING ? part : part.split(".").slice(0, 2).join(".")))
        .join(" — ")

export const timelineAsOf = Date.parse(`${activity.to}T00:00:00Z`)

const toItem = ({ id, label, period, route }) => {
    const [start, end] = splitPeriod(period)

    return {
        id,
        label,
        route,
        period: formatPeriod(period),
        start: parseDate(start),
        end: end === ONGOING ? timelineAsOf : parseDate(end, { end: true }),
        ongoing: end === ONGOING,
        note: timelineNotes[id],
    }
}

const projectItem = (id) => {
    const project = projectSummariesById[id]

    return toItem({
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
            toItem({
                id: "education",
                label: "카카오 클라우드 스쿨 3기",
                period: education.period,
            }),
            projectItem("webrtc"),
        ],
    },
]

const rangeStart = Math.min(...lanes.flatMap((lane) => lane.items.map((item) => item.start)))
const rangeEnd = Date.UTC(new Date(timelineAsOf).getUTCFullYear() + 1, 0, 1) - DAY
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
const lastYear = new Date(rangeEnd).getUTCFullYear()

export const timelineYears = Array.from({ length: lastYear - firstYear }, (_, index) => {
    const year = firstYear + index + 1
    return { year, at: toPercent(Date.UTC(year, 0, 1)) }
})

export const timelineNow = toPercent(timelineAsOf)

export const timelineRange = {
    from: new Date(rangeStart).toISOString().slice(0, 7).replace("-", "."),
    to: new Date(timelineAsOf).toISOString().slice(0, 7).replace("-", "."),
}

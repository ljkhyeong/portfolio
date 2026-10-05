import { randomUUID } from "node:crypto"
import { readFile, rename, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { format, resolveConfig } from "prettier"
import { cancelGitHubBody, githubResponseError } from "./github-response.mjs"

// 메인의 기여 히트맵 원본을 GitHub GraphQL에서 받아 저장한다.
// 빌드에서는 외부를 호출하지 않고 저장된 파일만 사용한다.
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DEFAULT_LOGIN = "ljkhyeong"
const DEFAULT_OUTPUT = new URL("../src/data/githubActivity.json", import.meta.url)
const MAX_RESPONSE_BYTES = 512 * 1024

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`

// 응답 형식을 검사하고 날짜순 기여 수 배열로 바꾼다. 하나라도 어긋나면 저장하지 않는다.
export const parseContributionCalendar = (payload, login) => {
    if (payload?.errors?.length) {
        throw new Error(`GitHub GraphQL 오류: ${payload.errors[0]?.message ?? "알 수 없음"}`)
    }
    const calendar = payload?.data?.user?.contributionsCollection?.contributionCalendar
    if (!calendar || !Array.isArray(calendar.weeks)) {
        throw new Error("기여 기록 응답에 contributionCalendar가 없습니다.")
    }
    const days = calendar.weeks.flatMap((week) => week?.contributionDays ?? [])
    if (days.length === 0) {
        throw new Error("기여 기록이 비어 있습니다.")
    }
    days.forEach((day, index) => {
        if (!DATE_PATTERN.test(day?.date ?? "")) {
            throw new Error(`${index}번째 날짜 형식이 올바르지 않습니다.`)
        }
        if (!Number.isSafeInteger(day.contributionCount) || day.contributionCount < 0) {
            throw new Error(`${day.date}의 기여 수가 올바르지 않습니다.`)
        }
        if (index > 0 && day.date <= days[index - 1].date) {
            throw new Error(`${day.date}가 날짜순이 아닙니다.`)
        }
    })
    const counts = days.map((day) => day.contributionCount)
    const total = counts.reduce((sum, count) => sum + count, 0)
    if (total !== calendar.totalContributions) {
        throw new Error(
            `일별 합계(${total})와 전체 기여 수(${calendar.totalContributions})가 다릅니다.`,
        )
    }

    return {
        login,
        from: days[0].date,
        to: days.at(-1).date,
        total,
        days: counts,
    }
}

const fetchCalendar = async ({ login, token }) => {
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        redirect: "error",
        signal: AbortSignal.timeout(30_000),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "ljkhyeong-portfolio-activity",
        },
        body: JSON.stringify({ query: QUERY, variables: { login } }),
    })
    if (!response.ok) {
        await cancelGitHubBody(response.body)
        throw githubResponseError(response, "기여 기록을 받지 못했습니다")
    }
    if (Number(response.headers.get("content-length")) > MAX_RESPONSE_BYTES) {
        await cancelGitHubBody(response.body)
        throw new Error("기여 기록 응답이 너무 큽니다.")
    }
    const text = await response.text()
    if (text.length > MAX_RESPONSE_BYTES) {
        throw new Error("기여 기록 응답이 너무 큽니다.")
    }
    return JSON.parse(text)
}

export const refreshGitHubActivity = async ({
    login = DEFAULT_LOGIN,
    token = process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim(),
    output = DEFAULT_OUTPUT,
} = {}) => {
    if (!token) {
        throw new Error("GITHUB_TOKEN 또는 GH_TOKEN이 필요합니다. GraphQL API는 인증이 필요합니다.")
    }
    const activity = parseContributionCalendar(await fetchCalendar({ login, token }), login)
    const outputPath = fileURLToPath(output)
    // 저장소 포맷 검사를 통과하도록 Prettier 설정으로 저장한다.
    const serialized = await format(JSON.stringify(activity), {
        ...(await resolveConfig(outputPath)),
        filepath: outputPath,
    })
    const current = await readFile(outputPath, "utf8").catch(() => null)
    if (current === serialized) {
        return { activity, changed: false, outputPath }
    }
    // 같은 디렉터리의 임시 파일을 완성한 뒤 바꿔 실패 시 기존 파일을 유지한다.
    const temporaryPath = path.join(path.dirname(outputPath), `.githubActivity-${randomUUID()}.tmp`)
    try {
        await writeFile(temporaryPath, serialized, { flag: "wx" })
        await rename(temporaryPath, outputPath)
    } finally {
        await rm(temporaryPath, { force: true })
    }
    return { activity, changed: true, outputPath }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
    try {
        const { activity, changed, outputPath } = await refreshGitHubActivity()
        console.log(
            `${activity.from} ~ ${activity.to} 기여 ${activity.total}회${changed ? "를 저장했습니다" : ", 변경 없음"}: ${path.relative(process.cwd(), outputPath)}`,
        )
    } catch (error) {
        console.error(error.message)
        process.exitCode = 1
    }
}

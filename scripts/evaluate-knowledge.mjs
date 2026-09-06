import { readFile, mkdir, writeFile } from "node:fs/promises"
import { parseArgs } from "node:util"
import path from "node:path"

const { values } = parseArgs({
    options: {
        url: { type: "string", default: "http://127.0.0.1:8080" },
        output: { type: "string", default: "output/validation/knowledge-evaluation.json" },
        answers: { type: "boolean", default: false },
    },
})
const cases = JSON.parse(
    await readFile(new URL("./knowledge-evaluation-cases.json", import.meta.url)),
)
const corpus = JSON.parse(
    await readFile(new URL("../public/knowledge/portfolio.json", import.meta.url)),
)
let verifiedSourceRevision = null
if (process.env.KNOWLEDGE_SYNC_KEY) {
    const response = await fetch(`${values.url.replace(/\/$/, "")}/internal/v1/knowledge/status`, {
        headers: { "X-Knowledge-Sync-Key": process.env.KNOWLEDGE_SYNC_KEY },
        signal: AbortSignal.timeout(30_000),
    })
    if (!response.ok) throw new Error(`자료 버전 확인: HTTP ${response.status}`)
    const status = await response.json()
    if (!status.upToDate || status.sourceRevision !== corpus.sourceRevision) {
        throw new Error("평가 API의 색인과 현재 공개 자료가 다릅니다. 먼저 동기화하세요.")
    }
    verifiedSourceRevision = status.sourceRevision
}
const rows = []
const request = async (endpoint, body) => {
    const start = performance.now()
    const response = await fetch(`${values.url.replace(/\/$/, "")}/api/v1/knowledge/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(120_000),
    })
    if (!response.ok)
        throw new Error(
            `${endpoint}: HTTP ${response.status} — 평가 서버의 호출 제한·설정을 확인하세요.`,
        )
    return { payload: await response.json(), elapsedMs: Math.round(performance.now() - start) }
}
for (const item of cases) {
    if (item.unanswerable && !values.answers) continue
    const { payload, elapsedMs } = await request(values.answers ? "answers" : "search", {
        [values.answers ? "question" : "query"]: item.question,
        limit: 6,
    })
    const rank = item.unanswerable
        ? null
        : payload.results.findIndex(
              (result) =>
                  result.projectId === item.projectId && result.title.includes(item.titleIncludes),
          ) + 1
    const contractPassed = !values.answers
        ? null
        : item.unanswerable
          ? payload.status === "INSUFFICIENT_EVIDENCE"
          : payload.status === "GENERATED" && payload.citations?.length > 0
    rows.push({
        ...item,
        rank,
        hitAt5: rank > 0 && rank <= 5,
        elapsedMs,
        contractPassed,
        ...(values.answers
            ? {
                  status: payload.status,
                  answer: payload.answer,
                  citations: payload.citations,
                  semanticReview: "미검토: criteria에 따라 답변과 인용 원문을 확인해야 합니다.",
              }
            : {}),
        results: payload.results.map(({ projectId, title }) => ({ projectId, title })),
    })
}
const searchable = rows.filter((row) => !row.unanswerable)
const hitAt5 = searchable.filter((row) => row.hitAt5).length / searchable.length
const mrrAt5 =
    searchable.reduce((sum, row) => sum + (row.hitAt5 ? 1 / row.rank : 0), 0) / searchable.length
const report = {
    expectedSourceRevision: corpus.sourceRevision,
    verifiedSourceRevision,
    mode: values.answers ? "answers" : "search",
    hitAt5,
    mrrAt5,
    meanElapsedMs: Math.round(rows.reduce((sum, row) => sum + row.elapsedMs, 0) / rows.length),
    rows,
}
await mkdir(path.dirname(values.output), { recursive: true })
await writeFile(values.output, `${JSON.stringify(report, null, 2)}\n`)
console.log(
    `상위 5건 적중 ${searchable.filter((row) => row.hitAt5).length}/${searchable.length}, MRR@5 ${mrrAt5.toFixed(3)} → ${values.output}`,
)
if (hitAt5 < 0.85 || rows.some((row) => row.contractPassed === false)) process.exitCode = 1

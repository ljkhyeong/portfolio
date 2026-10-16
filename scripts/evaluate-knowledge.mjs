import { readFile, mkdir, writeFile } from "node:fs/promises"
import { parseArgs } from "node:util"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"
import { createKnowledgeApiClient } from "./knowledge-api-client.mjs"

const { values } = parseArgs({
    options: {
        url: { type: "string", default: "http://127.0.0.1:8080" },
        output: { type: "string", default: "output/validation/knowledge-evaluation.json" },
        answers: { type: "boolean", default: false },
        // 검색 API 대신 화면의 브라우저 폴백 검색(src/api/localKnowledgeSearch.js)을 같은 질문으로 잰다.
        local: { type: "boolean", default: false },
    },
})
if (values.local && values.answers) {
    throw new Error("--local은 브라우저 검색만 평가합니다. AI 답변 평가와 함께 쓰지 않습니다.")
}
const cases = JSON.parse(
    await readFile(new URL("./knowledge-evaluation-cases.json", import.meta.url)),
)
const corpus = JSON.parse(
    await readFile(new URL("../public/knowledge/portfolio.json", import.meta.url)),
)
const client = createKnowledgeApiClient({
    baseUrl: values.url,
    syncKey: process.env.KNOWLEDGE_SYNC_KEY,
})
const loadLocalSearch = async () => {
    const vite = await createServer({
        root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
        appType: "custom",
        logLevel: "silent",
        server: { middlewareMode: true },
    })
    try {
        const { buildLocalIndex, searchLocalIndex } = await vite.ssrLoadModule(
            "/src/api/localKnowledgeSearch.js",
        )
        const index = buildLocalIndex(corpus)
        return (body) => searchLocalIndex(index, body)
    } finally {
        await vite.close()
    }
}
const searchLocally = values.local ? await loadLocalSearch() : null
let verifiedSourceRevision = null
if (!values.local && process.env.KNOWLEDGE_SYNC_KEY) {
    const status = await client.readStatus(corpus)
    if (!status.upToDate) {
        throw new Error("평가 API의 색인과 현재 공개 자료가 다릅니다. 먼저 동기화하세요.")
    }
    verifiedSourceRevision = status.sourceRevision
}
const rows = []
const request = async (body) => {
    const start = performance.now()
    const payload = await (values.local
        ? searchLocally(body)
        : values.answers
          ? client.answer(body)
          : client.search(body))
    return { payload, elapsedMs: Math.round(performance.now() - start) }
}
for (const item of cases) {
    if (item.unanswerable && !values.answers) continue
    const { payload, elapsedMs } = await request({
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
if (verifiedSourceRevision !== null) {
    const status = await client.readStatus(corpus)
    if (!status.upToDate) {
        throw new Error("평가 종료 시 색인이 현재 자료와 다릅니다. 동기화 후 다시 평가하세요.")
    }
}
const searchable = rows.filter((row) => !row.unanswerable)
const hitAt5 = searchable.filter((row) => row.hitAt5).length / searchable.length
const mrrAt5 =
    searchable.reduce((sum, row) => sum + (row.hitAt5 ? 1 / row.rank : 0), 0) / searchable.length
const report = {
    expectedSourceRevision: corpus.sourceRevision,
    verifiedSourceRevision,
    mode: values.local ? "local-search" : values.answers ? "answers" : "search",
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

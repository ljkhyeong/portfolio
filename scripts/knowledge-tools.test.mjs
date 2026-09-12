// @vitest-environment node

import { createServer } from "node:http"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { expect, test } from "vitest"

const execute = promisify(execFile)
const corpus = JSON.parse(
    await readFile(new URL("../public/knowledge/portfolio.json", import.meta.url)),
)
const evaluationCases = JSON.parse(
    await readFile(new URL("./knowledge-evaluation-cases.json", import.meta.url)),
)
const casesFor = (mode) =>
    evaluationCases.filter((item) => mode === "answers" || !item.unanswerable)
const evaluationResponse = (item) => {
    const results = item.unanswerable
        ? []
        : [
              {
                  projectId: item.projectId,
                  title: item.titleIncludes,
                  documentType: "problem_solution",
                  snippet: "공개 문서의 테스트 근거",
                  route: corpus.documents.find((document) => document.projectId === item.projectId)
                      .route,
              },
          ]
    return {
        total: results.length,
        status: item.unanswerable ? "INSUFFICIENT_EVIDENCE" : "GENERATED",
        answer: item.unanswerable ? null : "테스트 답변 [1]",
        citations: results.map(({ title, route, snippet }) => ({ title, route, excerpt: snippet })),
        results,
    }
}
const currentStatus = (overrides = {}) => ({
    sourceRevision: corpus.sourceRevision,
    expectedDocuments: corpus.documents.length,
    indexedDocuments: corpus.documents.length,
    matchedDocuments: corpus.documents.length,
    upToDate: true,
    ...overrides,
})
const runWithServer = async (reply, verify) => {
    const requests = []
    const outputDirectory = await mkdtemp(path.join(tmpdir(), "portfolio-knowledge-tools-"))
    const server = createServer((request, response) => {
        requests.push(request.method)
        response.setHeader("Content-Type", "application/json")
        response.end(JSON.stringify(reply(request, requests)))
    })
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
    try {
        const run = (mode = "sync", { syncKey = "test-only" } = {}) => {
            const baseUrl = `http://127.0.0.1:${server.address().port}`
            const args =
                mode === "sync"
                    ? ["scripts/sync-knowledge-index.mjs"]
                    : [
                          "scripts/evaluate-knowledge.mjs",
                          "--url",
                          baseUrl,
                          "--output",
                          path.join(outputDirectory, "evaluation.json"),
                          ...(mode === "answers" ? ["--answers"] : []),
                      ]
            return execute(process.execPath, args, {
                env: {
                    ...process.env,
                    KNOWLEDGE_API_BASE_URL: baseUrl,
                    KNOWLEDGE_SYNC_KEY: syncKey,
                },
                timeout: 5_000,
            })
        }
        await verify(run, requests, path.join(outputDirectory, "evaluation.json"))
    } finally {
        server.closeAllConnections()
        await new Promise((resolve) => server.close(resolve))
        await rm(outputDirectory, { recursive: true, force: true })
    }
}

test("배포 API의 자료 버전이 다르면 색인을 수정하지 않는다", async () => {
    await runWithServer(
        () => currentStatus({ sourceRevision: "old-revision", upToDate: false }),
        async (run, requests) => {
            await expect(run()).rejects.toMatchObject({ code: 1 })
            expect(requests).toEqual(["GET"])
        },
    )
})

test("동기화 요청이 성공해도 최종 색인이 일치하지 않으면 실패한다", async () => {
    await runWithServer(
        () => currentStatus({ upToDate: false, matchedDocuments: 0 }),
        async (run, requests) => {
            await expect(run()).rejects.toMatchObject({ code: 1 })
            expect(requests).toEqual(["GET", "POST", "GET"])
        },
    )
})

test("이미 최신인 색인은 다시 동기화하지 않는다", async () => {
    await runWithServer(
        () => currentStatus(),
        async (run, requests) => {
            await expect(run()).resolves.toMatchObject({ stderr: "" })
            expect(requests).toEqual(["GET", "GET"])
        },
    )
})

test.each([
    { upToDate: "false" },
    { upToDate: 1 },
    { upToDate: null },
    { expectedDocuments: "165" },
    { expectedDocuments: corpus.documents.length + 1, upToDate: false },
    { indexedDocuments: -1 },
    { matchedDocuments: undefined },
    { matchedDocuments: 0.5 },
    { matchedDocuments: corpus.documents.length + 1 },
    { matchedDocuments: 0 },
])("잘못된 자료 상태는 동기화 전에 거부한다: %j", async (overrides) => {
    await runWithServer(
        () => currentStatus(overrides),
        async (run, requests) => {
            await expect(run()).rejects.toMatchObject({ code: 1 })
            expect(requests).toEqual(["GET"])
        },
    )
})

test("동기화 후 상태값이 잘못되면 성공으로 보고하지 않는다", async () => {
    await runWithServer(
        (_request, requests) =>
            currentStatus({
                upToDate: requests.length === 3 ? "true" : false,
                matchedDocuments: 0,
            }),
        async (run, requests) => {
            await expect(run()).rejects.toMatchObject({ code: 1 })
            expect(requests).toEqual(["GET", "POST", "GET"])
        },
    )
})

test.each(["search", "answers"])(
    "잘못된 자료 상태에서는 %s 평가를 시작하지 않는다",
    async (mode) => {
        await runWithServer(
            () => currentStatus({ upToDate: "false" }),
            async (run, requests) => {
                await expect(run(mode)).rejects.toMatchObject({ code: 1 })
                expect(requests).toEqual(["GET"])
            },
        )
    },
)

test("동기화가 완료되면 최종 상태를 다시 확인한다", async () => {
    await runWithServer(
        (_request, requests) =>
            currentStatus({
                upToDate: requests.length === 3,
                matchedDocuments: requests.length === 3 ? corpus.documents.length : 0,
            }),
        async (run, requests) => {
            await expect(run()).resolves.toMatchObject({ stderr: "" })
            expect(requests).toEqual(["GET", "POST", "GET"])
        },
    )
})

test.each(["search", "answers"])("유효한 자료로 %s 평가를 완료한다", async (mode) => {
    const cases = casesFor(mode)
    const receivedHeaders = []
    await runWithServer(
        (request, requests) => {
            receivedHeaders.push(request.headers["x-knowledge-sync-key"])
            if (request.method === "GET") return currentStatus()
            const item = cases[requests.length - 2]
            return evaluationResponse(item)
        },
        async (run, requests, outputPath) => {
            await expect(run(mode)).resolves.toMatchObject({ stderr: "" })
            expect(requests).toHaveLength(cases.length + 2)
            expect(requests.at(-1)).toBe("GET")
            expect(receivedHeaders[0]).toBe("test-only")
            expect(receivedHeaders.at(-1)).toBe("test-only")
            expect(receivedHeaders.slice(1, -1)).toEqual(
                cases.map(() => (mode === "answers" ? "test-only" : undefined)),
            )
            const report = JSON.parse(await readFile(outputPath, "utf8"))
            expect(report.verifiedSourceRevision).toBe(corpus.sourceRevision)
            expect(report.rows).toHaveLength(cases.length)
        },
    )
})

test("빈 답변을 성공으로 평가하거나 보고서를 저장하지 않는다", async () => {
    await runWithServer(
        (request) =>
            request.method === "GET"
                ? currentStatus()
                : {
                      ...evaluationResponse(casesFor("answers")[0]),
                      answer: null,
                  },
        async (run, requests, outputPath) => {
            await expect(run("answers")).rejects.toMatchObject({
                code: 1,
                stderr: expect.stringContaining("응답 형식"),
            })
            expect(requests).toEqual(["GET", "POST"])
            await expect(readFile(outputPath, "utf8")).rejects.toMatchObject({ code: "ENOENT" })
        },
    )
})

test("관리 키 없는 검색 평가는 상태 API를 호출하지 않고 미확인 버전을 기록한다", async () => {
    const cases = casesFor("search")
    const receivedKeys = []
    await runWithServer(
        (request, requests) => {
            receivedKeys.push(request.headers["x-knowledge-sync-key"])
            return evaluationResponse(cases[requests.length - 1])
        },
        async (run, requests, outputPath) => {
            await expect(run("search", { syncKey: "" })).resolves.toMatchObject({ stderr: "" })
            expect(requests).toEqual(cases.map(() => "POST"))
            expect(receivedKeys).toEqual(cases.map(() => undefined))
            const report = JSON.parse(await readFile(outputPath, "utf8"))
            expect(report.verifiedSourceRevision).toBeNull()
        },
    )
})

test.each([
    ["search", { sourceRevision: "changed-revision" }],
    ["answers", { sourceRevision: "changed-revision" }],
    ["search", { upToDate: false, matchedDocuments: 0 }],
    ["answers", { upToDate: false, matchedDocuments: 0 }],
])("%s 평가 종료 때 자료 상태가 다르면 보고서를 저장하지 않는다: %j", async (mode, finalStatus) => {
    const cases = casesFor(mode)
    await runWithServer(
        (request, requests) =>
            request.method === "GET"
                ? currentStatus(requests.length === 1 ? {} : finalStatus)
                : evaluationResponse(cases[requests.length - 2]),
        async (run, requests, outputPath) => {
            await expect(run(mode)).rejects.toMatchObject({ code: 1 })
            expect(requests).toHaveLength(cases.length + 2)
            expect(requests.at(-1)).toBe("GET")
            await expect(readFile(outputPath, "utf8")).rejects.toMatchObject({ code: "ENOENT" })
        },
    )
})

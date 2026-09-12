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
        const run = (mode = "sync") => {
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
                    KNOWLEDGE_SYNC_KEY: "test-only",
                },
                timeout: 5_000,
            })
        }
        await verify(run, requests)
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
    const cases = JSON.parse(
        await readFile(new URL("./knowledge-evaluation-cases.json", import.meta.url)),
    ).filter((item) => mode === "answers" || !item.unanswerable)
    const receivedHeaders = []
    await runWithServer(
        (request, requests) => {
            receivedHeaders.push(request.headers["x-knowledge-sync-key"])
            if (requests.length === 1) return currentStatus()
            const item = cases[requests.length - 2]
            return {
                status: item.unanswerable ? "INSUFFICIENT_EVIDENCE" : "GENERATED",
                answer: "테스트 답변",
                citations: item.unanswerable ? [] : [{ id: "test-citation" }],
                results: item.unanswerable
                    ? []
                    : [{ projectId: item.projectId, title: item.titleIncludes }],
            }
        },
        async (run, requests) => {
            await expect(run(mode)).resolves.toMatchObject({ stderr: "" })
            expect(requests).toHaveLength(cases.length + 1)
            expect(receivedHeaders[0]).toBe("test-only")
            expect(receivedHeaders.slice(1)).toEqual(
                cases.map(() => (mode === "answers" ? "test-only" : undefined)),
            )
        },
    )
})

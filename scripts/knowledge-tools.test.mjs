// @vitest-environment node

import { createServer } from "node:http"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { readFile } from "node:fs/promises"
import { expect, test } from "vitest"

const execute = promisify(execFile)
const corpus = JSON.parse(
    await readFile(new URL("../public/knowledge/portfolio.json", import.meta.url)),
)
const runWithServer = async (reply, verify) => {
    const requests = []
    const server = createServer((request, response) => {
        requests.push(request.method)
        response.setHeader("Content-Type", "application/json")
        response.end(JSON.stringify(reply(request, requests)))
    })
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
    try {
        const run = () =>
            execute(process.execPath, ["scripts/sync-knowledge-index.mjs"], {
                env: {
                    ...process.env,
                    KNOWLEDGE_API_BASE_URL: `http://127.0.0.1:${server.address().port}`,
                    KNOWLEDGE_SYNC_KEY: "test-only",
                },
            })
        await verify(run, requests)
    } finally {
        await new Promise((resolve) => server.close(resolve))
    }
}

test("배포 API의 자료 버전이 다르면 색인을 수정하지 않는다", async () => {
    await runWithServer(
        () => ({ sourceRevision: "old-revision", upToDate: false }),
        async (run, requests) => {
            await expect(run()).rejects.toMatchObject({ code: 1 })
            expect(requests).toEqual(["GET"])
        },
    )
})

test("동기화 요청이 성공해도 최종 색인이 일치하지 않으면 실패한다", async () => {
    await runWithServer(
        () => ({ sourceRevision: corpus.sourceRevision, upToDate: false }),
        async (run, requests) => {
            await expect(run()).rejects.toMatchObject({ code: 1 })
            expect(requests).toEqual(["GET", "POST", "GET"])
        },
    )
})

test("이미 최신인 색인은 다시 동기화하지 않는다", async () => {
    await runWithServer(
        () => ({
            sourceRevision: corpus.sourceRevision,
            upToDate: true,
            matchedDocuments: corpus.documents.length,
        }),
        async (run, requests) => {
            await expect(run()).resolves.toMatchObject({ stderr: "" })
            expect(requests).toEqual(["GET", "GET"])
        },
    )
})

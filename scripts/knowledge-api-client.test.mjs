// @vitest-environment node

import { createServer } from "node:http"
import { expect, test, vi } from "vitest"
import { createKnowledgeApiClient } from "./knowledge-api-client.mjs"

const searchResult = {
    projectId: "baton",
    documentType: "problem_solution",
    title: "알림 재처리",
    snippet: "미전송 알림을 다시 처리합니다.",
    route: "/projects/baton/relay",
}
const validAnswer = {
    status: "GENERATED",
    answer: "미전송 알림을 다시 처리합니다. [1]",
    citations: [
        { title: searchResult.title, route: searchResult.route, excerpt: searchResult.snippet },
    ],
    results: [searchResult],
}

test.each([
    "not-a-url",
    "file:///tmp/portfolio.json",
    "https://user:secret@example.com",
    "https://example.com?token=secret",
    "https://example.com#section",
])("잘못된 API 주소는 요청 전에 거부한다: %s", (baseUrl) => {
    const fetchImpl = vi.fn()
    expect(() => createKnowledgeApiClient({ baseUrl, fetchImpl })).toThrow()
    expect(fetchImpl).not.toHaveBeenCalled()
})

test("관리 키가 없으면 관리 API를 호출하지 않는다", async () => {
    const fetchImpl = vi.fn()
    const client = createKnowledgeApiClient({ baseUrl: "https://example.com", fetchImpl })
    await expect(client.sync()).rejects.toThrow("KNOWLEDGE_SYNC_KEY")
    expect(fetchImpl).not.toHaveBeenCalled()
})

test("API 경로 접두어를 유지하고 익명 답변에 관리 키를 넣지 않는다", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(validAnswer)))
    const client = createKnowledgeApiClient({
        baseUrl: "https://example.com/portfolio/",
        fetchImpl,
    })
    await client.answer({ question: "공개 질문" })
    expect(fetchImpl).toHaveBeenCalledWith(
        "https://example.com/portfolio/api/v1/knowledge/answers",
        expect.objectContaining({
            method: "POST",
            redirect: "error",
            body: JSON.stringify({ question: "공개 질문" }),
        }),
    )
    expect(fetchImpl.mock.calls[0][1].headers).not.toHaveProperty("X-Knowledge-Sync-Key")
})

test.each([
    ["search", { total: 1, results: {} }],
    ["search", { total: 1, results: [] }],
    ["search", { total: 1, results: [{ ...searchResult, title: {} }] }],
    ["answer", { ...validAnswer, answer: null }],
    ["answer", { ...validAnswer, answer: {} }],
    ["answer", { ...validAnswer, citations: [{ title: "출처 주소 없음" }] }],
    ["answer", { ...validAnswer, results: {} }],
    ["answer", { ...validAnswer, results: [null] }],
])("%s 평가에서 잘못된 응답을 거부한다: %j", async (operation, payload) => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)))
    const client = createKnowledgeApiClient({ baseUrl: "https://example.com", fetchImpl })

    await expect(client[operation]({ query: "알림", question: "알림" })).rejects.toThrow(
        "응답 형식",
    )
    expect(fetchImpl).toHaveBeenCalledTimes(1)
})

test.each([
    ["search", { total: 1, results: [searchResult] }],
    ["search", { total: 0, results: [] }],
    ["answer", validAnswer],
    ["answer", { status: "INSUFFICIENT_EVIDENCE", answer: null, citations: [], results: [] }],
    [
        "answer",
        { status: "GENERATION_UNAVAILABLE", answer: null, citations: [], results: [searchResult] },
    ],
])("%s 평가의 정상 응답을 반환한다: %j", async (operation, payload) => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)))
    const client = createKnowledgeApiClient({ baseUrl: "https://example.com", fetchImpl })

    await expect(client[operation]({ query: "알림", question: "알림" })).resolves.toEqual(payload)
})

test.each([204, 206, 401, 429, 503])("HTTP %i 응답을 성공으로 처리하지 않는다", async (status) => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status }))
    const client = createKnowledgeApiClient({
        baseUrl: "https://example.com",
        syncKey: "test-only",
        fetchImpl,
    })
    await expect(client.sync()).rejects.toThrow(`HTTP ${status}`)
    expect(fetchImpl).toHaveBeenCalledTimes(1)
})

test.each([
    [429, "45", " 45초 후 다시 실행하세요."],
    [503, "30", " 30초 후 다시 실행하세요."],
    [429, "invalid", ""],
    [429, "0", ""],
    [401, "45", ""],
])("HTTP %i의 대기 시간(%s)을 안내하되 자동 재요청하지 않는다", async (status, value, hint) => {
    const fetchImpl = vi
        .fn()
        .mockResolvedValue(
            new Response("<html>일시 중단</html>", { status, headers: { "Retry-After": value } }),
        )
    const client = createKnowledgeApiClient({ baseUrl: "https://example.com", fetchImpl })

    await expect(client.search({ query: "알림" })).rejects.toThrow(
        `/api/v1/knowledge/search: HTTP ${status} — API 주소·호출 제한을 확인하세요.${hint}`,
    )
    expect(fetchImpl).toHaveBeenCalledTimes(1)
})

test.each([
    ["search", 90_000, { results: [], total: 0 }],
    ["answer", 180_000, validAnswer],
])("%s 평가에 웹과 같은 제한 시간을 적용한다", async (operation, timeoutMs, payload) => {
    const timeout = vi.spyOn(AbortSignal, "timeout").mockReturnValue(new AbortController().signal)
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)))
    const client = createKnowledgeApiClient({ baseUrl: "https://example.com", fetchImpl })
    try {
        await client[operation]({ query: "알림", question: "알림" })
        expect(timeout).toHaveBeenCalledWith(timeoutMs)
    } finally {
        timeout.mockRestore()
    }
})

test("잘못된 JSON 응답을 재시도하지 않는다", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("invalid-json"))
    const client = createKnowledgeApiClient({
        baseUrl: "https://example.com",
        syncKey: "test-only",
        fetchImpl,
    })
    await expect(client.sync()).rejects.toThrow("JSON 응답")
    expect(fetchImpl).toHaveBeenCalledTimes(1)
})

test.each([
    ["readStatus", 302, "GET"],
    ["sync", 307, "POST"],
    ["search", 303, "POST"],
    ["answer", 308, "POST"],
])(
    "%s 요청은 HTTP %i 리다이렉트에 키와 본문을 전달하지 않는다",
    async (operation, status, method) => {
        const redirectedRequests = []
        const originalRequests = []
        const receiver = createServer((request, response) => {
            redirectedRequests.push(request.headers)
            response.end("{}")
        })
        await new Promise((resolve) => receiver.listen(0, "127.0.0.1", resolve))
        const sender = createServer((request, response) => {
            originalRequests.push({
                method: request.method,
                key: request.headers["x-knowledge-sync-key"],
            })
            response.writeHead(status, {
                Location: `http://127.0.0.1:${receiver.address().port}/target`,
            })
            response.end()
        })
        await new Promise((resolve) => sender.listen(0, "127.0.0.1", resolve))
        try {
            const client = createKnowledgeApiClient({
                baseUrl: `http://127.0.0.1:${sender.address().port}`,
                syncKey: "test-only",
            })
            await expect(client[operation]({ question: "테스트 질문" })).rejects.toThrow()
            expect(originalRequests).toEqual([
                { method, key: operation === "search" ? undefined : "test-only" },
            ])
            expect(redirectedRequests).toEqual([])
        } finally {
            sender.closeAllConnections()
            receiver.closeAllConnections()
            await Promise.all([
                new Promise((resolve) => sender.close(resolve)),
                new Promise((resolve) => receiver.close(resolve)),
            ])
        }
    },
)

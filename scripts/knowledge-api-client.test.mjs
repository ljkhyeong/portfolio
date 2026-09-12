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
    ["search", 90, "/api/v1/knowledge/search", "헤더"],
    ["answer", 180, "/api/v1/knowledge/answers", "본문"],
    ["readStatus", 30, "/internal/v1/knowledge/status", "본문"],
    ["sync", 600, "/internal/v1/knowledge/sync", "헤더"],
])(
    "%s의 %s초 제한을 넘으면 %s의 %s 수신 지연을 안내한다",
    async (operation, seconds, endpoint, phase) => {
        const controller = new AbortController()
        const timeout = vi.spyOn(AbortSignal, "timeout").mockReturnValue(controller.signal)
        const fail = () => {
            controller.abort(new DOMException("테스트 제한 시간", "TimeoutError"))
            // 본문 수신 중에는 TimeoutError 대신 AbortError로 거부될 수도 있다.
            throw new DOMException("테스트 수신 중단", "AbortError")
        }
        const fetchImpl = vi.fn(async () => {
            if (phase === "헤더") fail()
            return { status: 200, json: fail }
        })
        const client = createKnowledgeApiClient({
            baseUrl: "https://example.com",
            syncKey: "test-only",
            fetchImpl,
        })
        try {
            await expect(client[operation]({ query: "알림", question: "알림" })).rejects.toThrow(
                `${endpoint}: ${seconds}초 안에 응답을 받지 못했습니다. 서버 상태를 확인하세요.`,
            )
            expect(fetchImpl).toHaveBeenCalledTimes(1)
        } finally {
            timeout.mockRestore()
        }
    },
)

test.each([
    ["헤더", "API에 연결하지 못했습니다. 최종 API 주소·네트워크·TLS 설정을 확인하세요."],
    ["본문", "응답 본문을 받지 못했습니다. 서버·네트워크 상태를 확인하세요."],
])("%s 수신 중 연결 오류를 JSON 오류와 구분한다", async (phase, message) => {
    const fail = () => {
        throw new TypeError("fetch failed")
    }
    const fetchImpl = vi.fn(async () => {
        if (phase === "헤더") fail()
        return { status: 200, json: fail }
    })
    const client = createKnowledgeApiClient({ baseUrl: "https://example.com", fetchImpl })

    await expect(client.search({ query: "알림" })).rejects.toThrow(
        `/api/v1/knowledge/search: ${message}`,
    )
    expect(fetchImpl).toHaveBeenCalledTimes(1)
})

test("오류 응답의 본문 정리가 실패해도 HTTP 상태와 대기 안내를 유지한다", async () => {
    const cancel = vi.fn().mockRejectedValue(new TypeError("stream closed"))
    const fetchImpl = vi.fn().mockResolvedValue({
        status: 429,
        headers: new Headers({ "Retry-After": "45" }),
        body: { cancel },
    })
    const client = createKnowledgeApiClient({ baseUrl: "https://example.com", fetchImpl })

    await expect(client.search({ query: "알림" })).rejects.toThrow(
        "/api/v1/knowledge/search: HTTP 429 — API 주소·호출 제한을 확인하세요. 45초 후 다시 실행하세요.",
    )
    expect(cancel).toHaveBeenCalledOnce()
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

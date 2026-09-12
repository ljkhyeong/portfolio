import { generatePortfolioAnswer, searchPortfolioKnowledge } from "./knowledgeSearch"

afterEach(() => {
    vi.unstubAllGlobals()
})

describe.each([
    ["검색", searchPortfolioKnowledge],
    ["답변", generatePortfolioAnswer],
])("%s API 응답 처리", (_label, request) => {
    const send = (signal) => request({ query: "알림 재처리", question: "알림 재처리", signal })
    const respond = (status, json) => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: status < 400, status, json }))
    }

    test("응답 본문을 읽는 중 취소되면 빈 결과로 바꾸지 않는다", async () => {
        const abort = new DOMException("요청 취소", "AbortError")
        respond(200, vi.fn().mockRejectedValue(abort))

        await expect(send()).rejects.toBe(abort)
    })

    test("본문을 읽은 직후 취소돼도 응답을 반환하지 않는다", async () => {
        const controller = new AbortController()
        respond(200, async () => {
            controller.abort()
            return { results: [] }
        })

        await expect(send(controller.signal)).rejects.toMatchObject({ name: "AbortError" })
    })

    test("성공 응답의 JSON이 잘못되면 읽기 오류를 알린다", async () => {
        respond(200, vi.fn().mockRejectedValue(new SyntaxError("잘못된 JSON")))

        await expect(send()).rejects.toMatchObject({
            name: "KnowledgeApiError",
            status: 200,
            code: "INVALID_RESPONSE",
            message: "서버 응답을 읽지 못했습니다. 다시 시도해 주세요.",
        })
    })

    test("JSON이 아닌 오류 응답도 HTTP 상태는 유지한다", async () => {
        respond(503, vi.fn().mockRejectedValue(new SyntaxError("HTML 오류 페이지")))

        await expect(send()).rejects.toMatchObject({
            status: 503,
            code: "KNOWLEDGE_API_ERROR",
        })
    })

    test("서버가 보낸 오류 메시지와 상태를 유지한다", async () => {
        respond(429, vi.fn().mockResolvedValue({ message: "호출 제한", code: "RATE_LIMITED" }))

        await expect(send()).rejects.toMatchObject({
            status: 429,
            code: "RATE_LIMITED",
            message: "호출 제한",
        })
    })

    test("정상 응답은 그대로 반환한다", async () => {
        const payload = { results: [{ title: "알림 재처리" }] }
        respond(200, vi.fn().mockResolvedValue(payload))

        await expect(send()).resolves.toEqual(payload)
    })
})

test("검색과 답변 요청에 같은 서비스 필터를 전달한다", async () => {
    const fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ results: [] }),
    })
    vi.stubGlobal("fetch", fetch)

    await searchPortfolioKnowledge({
        query: "링크 중복 생성",
        projectId: "baton",
        serviceId: "go",
        documentType: "problem_solution",
    })
    await generatePortfolioAnswer({
        question: "링크 중복 생성",
        projectId: "baton",
        serviceId: "go",
        documentType: "problem_solution",
    })

    fetch.mock.calls.forEach(([, request]) => {
        expect(JSON.parse(request.body)).toMatchObject({
            projectIds: ["baton"],
            serviceIds: ["go"],
            documentTypes: ["problem_solution"],
        })
    })
})

test("답변 요청에만 Turnstile 토큰을 헤더로 전달한다", async () => {
    const fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ results: [] }),
    })
    vi.stubGlobal("fetch", fetch)

    await searchPortfolioKnowledge({ query: "알림 재처리" })
    await generatePortfolioAnswer({
        question: "알림 재처리",
        turnstileToken: "verified-token",
    })

    expect(fetch.mock.calls[0][1].headers).not.toHaveProperty("X-Turnstile-Token")
    expect(fetch.mock.calls[1][1].headers).toHaveProperty("X-Turnstile-Token", "verified-token")
})

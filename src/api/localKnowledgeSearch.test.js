import { isSearchResponse } from "./knowledgeResponse"
import {
    buildLocalIndex,
    LocalKnowledgeError,
    resetLocalKnowledgeIndex,
    searchLocalIndex,
    searchLocalKnowledge,
    splitChunks,
    tokenize,
} from "./localKnowledgeSearch"

const documentOf = (overrides) => ({
    documentId: "doc-1",
    projectId: "happygallery",
    projectName: "happyGallery",
    serviceId: null,
    documentType: "problem_solution",
    title: "결제 및 환불 재요청의 중복 처리 방지",
    heading: "문제와 해결 방법",
    content: "결제사 응답이 유실되면 같은 orderId로 결제 결과를 다시 조회합니다.",
    sourceUrl: "https://ljkportfolio.netlify.app/projects/happygallery#project-problems",
    route: "/projects/happygallery",
    ...overrides,
})

const corpus = {
    documents: [
        documentOf({}),
        documentOf({
            documentId: "doc-2",
            title: "서버 중단 후 미전송 알림 재처리",
            content: "업무 상태와 알림 Outbox를 함께 저장하고 미전송 건을 다시 처리합니다.",
        }),
        documentOf({
            documentId: "doc-3",
            projectId: "baton",
            projectName: "BATON",
            serviceId: "go",
            documentType: "service_overview",
            title: "GO 서비스 개요",
            heading: "서비스 개요",
            content: "같은 요청의 결제 링크를 한 번만 만듭니다.",
            sourceUrl: null,
            route: "/projects/baton/go",
        }),
    ],
}

afterEach(() => {
    vi.unstubAllGlobals()
    resetLocalKnowledgeIndex()
})

test("한글은 두 글자씩, 영문과 숫자는 낱말 단위로 나눈다", () => {
    expect(tokenize("결제와 API를 2번")).toEqual(["결제", "제와", "api", "를", "2", "번"])
})

test("긴 본문은 1,200자 이하 문단으로 나누고 다음 문단과 겹친다", () => {
    const sentence = "같은 요청을 다시 보내도 링크는 한 번만 만들어집니다. "
    const content = sentence.repeat(120)
    const chunks = splitChunks(content)

    expect(chunks.length).toBeGreaterThan(1)
    chunks.forEach((chunk) => expect(chunk.length).toBeLessThanOrEqual(1200))
    expect(content.trim().endsWith(chunks.at(-1))).toBe(true)
    // 다음 문단은 앞 문단의 마지막 150자 근처에서 시작한다.
    expect(chunks[0].slice(-200)).toContain(chunks[1].slice(0, 20))
    expect(splitChunks("짧은 본문")).toEqual(["짧은 본문"])
})

test("제목에 질문 낱말이 있는 문서를 먼저 보여 주고 API와 같은 응답 형식을 만든다", () => {
    const response = searchLocalIndex(buildLocalIndex(corpus), { query: "결제 중복 처리" })

    expect(isSearchResponse(response)).toBe(true)
    expect(response.results[0]).toMatchObject({
        chunkId: "doc-1#000",
        title: "결제 및 환불 재요청의 중복 처리 방지",
        route: "/projects/happygallery",
    })
    expect(response.results[0].snippet).toContain("orderId")
    expect(response.total).toBe(response.results.length)
})

test("프로젝트, 서비스, 문서 종류로 검색 범위를 좁힌다", () => {
    const index = buildLocalIndex(corpus)

    expect(
        searchLocalIndex(index, { query: "결제", projectId: "baton", serviceId: "go" }).results,
    ).toEqual([expect.objectContaining({ chunkId: "doc-3#000", serviceId: "go" })])
    expect(
        searchLocalIndex(index, { query: "결제", documentType: "service_overview" }).results,
    ).toHaveLength(1)
    expect(searchLocalIndex(index, { query: "일치하지않는검색어" })).toEqual({
        total: 0,
        results: [],
    })
})

test("긴 문단의 요약은 280자 안에서 문장이나 낱말 경계로 자른다", () => {
    const content = `${"앞 문장은 질문과 관계가 없습니다. ".repeat(20)}멱등 키로 결과를 조회합니다. ${"뒤 문장도 이어집니다. ".repeat(30)}`
    const [result] = searchLocalIndex(buildLocalIndex({ documents: [documentOf({ content })] }), {
        query: "멱등 키",
    }).results

    expect(result.snippet.startsWith("멱등 키로 결과를 조회합니다.")).toBe(true)
    expect(result.snippet.length).toBeLessThanOrEqual(281)
    expect(result.snippet.endsWith("…")).toBe(true)
})

test("형식이 맞지 않는 자료는 색인하지 않는다", () => {
    expect(() => buildLocalIndex({ documents: [{ title: "제목만" }] })).toThrow(LocalKnowledgeError)
    expect(() => buildLocalIndex({})).toThrow(LocalKnowledgeError)
})

test("공개 자료는 한 번만 받고, 받지 못하면 다음 검색에서 다시 받는다", async () => {
    const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({ ok: false, json: async () => ({}) })
        .mockResolvedValue({ ok: true, json: async () => corpus })
    vi.stubGlobal("fetch", fetchMock)

    await expect(searchLocalKnowledge({ query: "결제" })).rejects.toMatchObject({
        name: "LocalKnowledgeError",
        message: "공개 문서 자료를 불러오지 못했습니다.",
    })
    await expect(searchLocalKnowledge({ query: "결제" })).resolves.toMatchObject({ total: 2 })
    await expect(searchLocalKnowledge({ query: "알림" })).resolves.toMatchObject({ total: 1 })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenLastCalledWith("/knowledge/portfolio.json")
})

test("먼저 시작한 검색이 취소돼도 함께 기다리던 다음 검색은 같은 자료로 끝난다", async () => {
    let respond
    const fetchMock = vi.fn(
        () =>
            new Promise((resolve) => {
                respond = () => resolve({ ok: true, json: async () => corpus })
            }),
    )
    vi.stubGlobal("fetch", fetchMock)
    const first = new AbortController()

    const cancelled = searchLocalKnowledge({ query: "결제", signal: first.signal })
    const next = searchLocalKnowledge({ query: "알림" })
    first.abort()
    respond()

    await expect(cancelled).rejects.toMatchObject({ name: "AbortError" })
    await expect(next).resolves.toMatchObject({ total: 1 })
    expect(fetchMock).toHaveBeenCalledOnce()
})

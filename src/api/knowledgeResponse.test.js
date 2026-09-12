import { isAnswerResponse, isSearchResponse } from "./knowledgeResponse"

const result = {
    chunkId: "baton#relay#0",
    projectId: "baton",
    projectName: "BATON",
    serviceId: "relay",
    documentType: "problem_solution",
    title: "미전송 알림 재처리",
    heading: "문제와 해결 방법",
    snippet: "미전송 알림을 다시 처리합니다.",
    sourceUrl: "https://ljkportfolio.netlify.app/projects/baton/relay#project-problems",
    route: "/projects/baton/relay",
    score: 0.92,
}
const citation = {
    chunkId: result.chunkId,
    title: result.title,
    heading: result.heading,
    sourceUrl: result.sourceUrl,
    route: result.route,
    excerpt: result.snippet,
}
const search = { query: "알림 재처리", total: 1, results: [result] }
const answer = {
    question: "알림 재처리",
    status: "GENERATED",
    answer: "미전송 알림을 다시 처리합니다. [1]",
    citations: [citation],
    results: [result],
}

test("현재 API 응답과 빈 검색 결과를 허용한다", () => {
    expect(isSearchResponse(search)).toBe(true)
    expect(isSearchResponse({ query: "없는 질문", total: 0, results: [] })).toBe(true)
    expect(isAnswerResponse(answer)).toBe(true)
})

test.each(["INSUFFICIENT_EVIDENCE", "GENERATION_UNAVAILABLE"])(
    "%s 상태의 빈 답변을 허용한다",
    (status) => {
        expect(isAnswerResponse({ ...answer, status, answer: null, citations: [] })).toBe(true)
    },
)

test.each([
    ["배열 아닌 결과", { results: {} }],
    ["빈 항목", { results: [null] }],
    ["문자열 건수", { total: "1" }],
    ["건수 불일치", { total: 2 }],
    ["음수 건수", { total: -1 }],
    ["소수 건수", { total: 1.5 }],
    ["객체 본문", { results: [{ ...result, snippet: {} }] }],
    ["숫자 서비스 ID", { results: [{ ...result, serviceId: 7 }] }],
    ["객체 프로젝트명", { results: [{ ...result, projectName: {} }] }],
    ["제목 누락", { results: [{ ...result, title: "", heading: null }] }],
])("잘못된 검색 응답: %s", (_label, invalid) => {
    expect(isSearchResponse({ ...search, ...invalid })).toBe(false)
})

test.each([
    ["알 수 없는 상태", { status: "SUCCESS" }],
    ["객체 답변", { answer: {} }],
    ["빈 답변", { answer: "   " }],
    ["배열 아닌 출처", { citations: {} }],
    ["출처 없는 답변", { citations: [] }],
    ["빈 출처 항목", { citations: [null] }],
    ["객체 근거 문단", { citations: [{ ...citation, excerpt: {} }] }],
    ["실패 상태의 답변 본문", { status: "GENERATION_UNAVAILABLE" }],
])("잘못된 답변 응답: %s", (_label, invalid) => {
    expect(isAnswerResponse({ ...answer, ...invalid })).toBe(false)
})

test.each([
    { sourceUrl: null },
    { sourceUrl: "/docs/baton/relay.md" },
    { sourceUrl: "https://github.com/ljkhyeong/happyGallery/blob/main/README.md", route: null },
    { title: null, serviceId: null, projectName: null, excerpt: null },
])("선택 필드가 없거나 원문 종류가 달라도 표시 가능한 응답은 허용한다: %j", (fields) => {
    expect(isSearchResponse({ ...search, results: [{ ...result, ...fields }] })).toBe(true)
    expect(isAnswerResponse({ ...answer, citations: [{ ...citation, ...fields }] })).toBe(true)
})

test.each([
    { route: "//outside.example/path" },
    { route: "/\\outside.example/path" },
    { route: "https://outside.example/path" },
    { sourceUrl: "javascript:void(0)" },
    { sourceUrl: "data:text/html,invalid" },
    { sourceUrl: "https://user:password@outside.example/doc" },
    { sourceUrl: "https://" },
    { sourceUrl: "https://example.com/\npath" },
    { sourceUrl: "//outside.example/path" },
    { sourceUrl: null, route: null },
])("검색·답변의 잘못된 출처 주소를 거부한다: %j", (fields) => {
    expect(isSearchResponse({ ...search, results: [{ ...result, ...fields }] })).toBe(false)
    expect(isAnswerResponse({ ...answer, citations: [{ ...citation, ...fields }] })).toBe(false)
})

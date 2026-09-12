// @vitest-environment node

import { afterEach, expect, test, vi } from "vitest"
import { dispatchKnowledgeRefresh } from "./dispatch-knowledge-refresh.mjs"

afterEach(() => vi.restoreAllMocks())

test("GitHub 이벤트 API에 고정된 문서 검사 이벤트를 전달한다", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ status: 204 })
    await expect(
        dispatchKnowledgeRefresh({ token: " test-token ", fetchImpl }),
    ).resolves.toMatchObject({ sent: true })
    const [url, request] = fetchImpl.mock.calls[0]
    expect(url).toBe("https://api.github.com/repos/ljkhyeong/portfolio/dispatches")
    expect(request).toMatchObject({
        method: "POST",
        redirect: "error",
        headers: { Authorization: "Bearer test-token", "Content-Type": "application/json" },
    })
    expect(request.signal).toBeInstanceOf(AbortSignal)
    expect(JSON.parse(request.body)).toEqual({ event_type: "knowledge-documents-changed" })
})

test("dry-run은 토큰 없이 요청을 확인하고 네트워크를 호출하지 않는다", async () => {
    const fetchImpl = vi.fn()
    await expect(dispatchKnowledgeRefresh({ dryRun: true, fetchImpl })).resolves.toMatchObject({
        sent: false,
    })
    expect(fetchImpl).not.toHaveBeenCalled()
})

test("토큰이 없으면 전송하지 않는다", async () => {
    const fetchImpl = vi.fn()
    await expect(dispatchKnowledgeRefresh({ fetchImpl })).rejects.toThrow(
        "KNOWLEDGE_DISPATCH_TOKEN",
    )
    expect(fetchImpl).not.toHaveBeenCalled()
})

test.each(["https://example.com/repo", "owner/../repo", "owner/..", "owner/repo?token=secret"])(
    "잘못된 저장소 %s는 전송 전에 거부한다",
    async (repository) => {
        const fetchImpl = vi.fn()
        await expect(
            dispatchKnowledgeRefresh({ repository, token: "test", fetchImpl }),
        ).rejects.toThrow("owner/repository")
        expect(fetchImpl).not.toHaveBeenCalled()
    },
)

test.each([302, 401, 403, 422, 429, 500])(
    "HTTP %i는 성공으로 처리하거나 재전송하지 않는다",
    async (status) => {
        const fetchImpl = vi.fn().mockResolvedValue({ status })
        await expect(dispatchKnowledgeRefresh({ token: "test", fetchImpl })).rejects.toThrow(
            `HTTP ${status}`,
        )
        expect(fetchImpl).toHaveBeenCalledTimes(1)
    },
)

test.each([403, 429, 503])(
    "HTTP %i의 대기 시간을 안내하고 오류 본문을 정리한다",
    async (status) => {
        const cancel = vi.fn().mockResolvedValue(undefined)
        const fetchImpl = vi.fn().mockResolvedValue({
            status,
            headers: new Headers({ "Retry-After": "45" }),
            body: { cancel },
        })
        await expect(dispatchKnowledgeRefresh({ token: "test", fetchImpl })).rejects.toThrow(
            `HTTP ${status} — 45초 후 다시 실행하세요.`,
        )
        expect(cancel).toHaveBeenCalledTimes(1)
        expect(fetchImpl).toHaveBeenCalledTimes(1)
    },
)

test.each([403, 429])("HTTP %i에서 남은 한도가 0이면 초기화 시각을 사용한다", async (status) => {
    vi.spyOn(Date, "now").mockReturnValue(1_800_000_000_100)
    const fetchImpl = vi.fn().mockResolvedValue({
        status,
        headers: new Headers({ "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": "1800000060" }),
    })
    await expect(dispatchKnowledgeRefresh({ token: "test", fetchImpl })).rejects.toThrow("60초 후")
    expect(fetchImpl).toHaveBeenCalledTimes(1)
})

test("대기 헤더가 함께 있으면 더 긴 대기 시간을 안내한다", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_800_000_000_100)
    const fetchImpl = vi.fn().mockResolvedValue({
        status: 403,
        headers: new Headers({
            "Retry-After": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": "1800000060",
        }),
    })
    await expect(dispatchKnowledgeRefresh({ token: "test", fetchImpl })).rejects.toThrow("60초 후")
    expect(fetchImpl).toHaveBeenCalledTimes(1)
})

test.each([
    { "X-RateLimit-Remaining": "1", "X-RateLimit-Reset": "1800000060" },
    { "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": "invalid" },
    { "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": "1799999999" },
    { "Retry-After": "-1" },
    { "Retry-After": "1.5" },
    { "Retry-After": "9007199254740992" },
])("유효한 호출 제한 근거가 없으면 대기 시간을 만들지 않는다: %j", async (headers) => {
    vi.spyOn(Date, "now").mockReturnValue(1_800_000_000_100)
    const fetchImpl = vi.fn().mockResolvedValue({ status: 403, headers: new Headers(headers) })
    await expect(dispatchKnowledgeRefresh({ token: "test", fetchImpl })).rejects.toThrow(
        /^GitHub 문서 검사 요청 실패: HTTP 403$/,
    )
    expect(fetchImpl).toHaveBeenCalledTimes(1)
})

test("응답 본문 정리 실패가 HTTP 오류와 대기 안내를 덮어쓰지 않는다", async () => {
    const cancel = vi.fn().mockRejectedValue(new Error("테스트 정리 실패"))
    const fetchImpl = vi.fn().mockResolvedValue({
        status: 429,
        headers: new Headers({ "Retry-After": "30" }),
        body: { cancel },
    })
    await expect(dispatchKnowledgeRefresh({ token: "test", fetchImpl })).rejects.toThrow(
        "HTTP 429 — 30초 후",
    )
    expect(cancel).toHaveBeenCalledTimes(1)
})

test.each([false, true])(
    "응답을 받지 못하면 접수 확인을 안내하고 재전송하지 않는다: %s",
    async (timedOut) => {
        const controller = new AbortController()
        vi.spyOn(AbortSignal, "timeout").mockReturnValue(controller.signal)
        const fetchImpl = vi.fn().mockImplementation(async () => {
            if (timedOut) controller.abort()
            throw new Error("test-only-secret")
        })
        const result = dispatchKnowledgeRefresh({ token: "test-only-secret", fetchImpl })
        await expect(result).rejects.toThrow(timedOut ? "15초" : "응답을 받지 못했습니다")
        await expect(result).rejects.toThrow("Actions에서 접수 여부를 확인")
        await expect(result).rejects.not.toThrow("test-only-secret")
        expect(fetchImpl).toHaveBeenCalledTimes(1)
    },
)

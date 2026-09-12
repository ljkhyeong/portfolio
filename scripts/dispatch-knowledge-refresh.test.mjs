// @vitest-environment node

import { expect, test, vi } from "vitest"
import { dispatchKnowledgeRefresh } from "./dispatch-knowledge-refresh.mjs"

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

// @vitest-environment node

import { mkdtemp, readFile, readdir, rm, stat, utimes, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { refreshKnowledgeDocuments } from "./refresh-knowledge-documents.mjs"
import {
    PUBLIC_EXTERNAL_DOCUMENTS,
    PUBLIC_EXTERNAL_DOCUMENTS_METADATA_ONLY,
} from "../src/data/knowledgeCorpus.js"

const first = "https://github.com/example/project/blob/main/docs/first.md"
const second = "https://github.com/example/project/blob/main/docs/second.md"
const revision = "a".repeat(40)
const otherRevision = "b".repeat(40)
const snapshot = (href, content, sha = revision) => ({
    revision: sha,
    sourceUrl: href.replace("/main/", `/${sha}/`),
    content,
})
let directory
let output
let original

beforeEach(async () => {
    directory = await mkdtemp(path.join(tmpdir(), "portfolio-source-refresh-"))
    output = path.join(directory, "snapshots.json")
    original = `${JSON.stringify({ [first]: snapshot(first, "# 이전 공개 문서\n") }, null, 4)}\n`
    await writeFile(output, original)
})

afterEach(async () => {
    await rm(directory, { recursive: true, force: true })
})

const run = (fetchImpl, options = {}) =>
    refreshKnowledgeDocuments({
        documents: [first],
        metadataOnly: [],
        output,
        token: "test-only",
        fetchImpl,
        ...options,
    })
const unchanged = async () => {
    expect(await readFile(output, "utf8")).toBe(original)
    expect(await readdir(directory)).toEqual(["snapshots.json"])
}
const responses = (...values) => {
    const mock = vi.fn()
    for (const value of values) mock.mockResolvedValueOnce(value)
    return mock
}

test("SHA 전용 응답을 사용하고 저장소·참조별로 커밋을 재사용한다", async () => {
    const branchDocument = "https://github.com/example/project/blob/develop/docs/third.md"
    const fetchImpl = responses(
        new Response(`${revision}\n`),
        new Response("# 첫 문서"),
        new Response("# 둘째 문서"),
        new Response(otherRevision),
        new Response("# 개발 문서"),
    )
    await expect(
        run(fetchImpl, { documents: [first, second, branchDocument] }),
    ).resolves.toMatchObject({ documents: 3, changed: true })
    expect(fetchImpl.mock.calls.map(([url]) => url)).toEqual([
        "https://api.github.com/repos/example/project/commits/main",
        `https://raw.githubusercontent.com/example/project/${revision}/docs/first.md`,
        `https://raw.githubusercontent.com/example/project/${revision}/docs/second.md`,
        "https://api.github.com/repos/example/project/commits/develop",
        `https://raw.githubusercontent.com/example/project/${otherRevision}/docs/third.md`,
    ])
    for (const [url, options] of fetchImpl.mock.calls) {
        expect(options.redirect).toBe("error")
        expect(options.signal).toBeInstanceOf(AbortSignal)
        if (url.startsWith("https://api.github.com/")) {
            expect(options.headers).toMatchObject({
                Accept: "application/vnd.github.sha",
                Authorization: "Bearer test-only",
            })
        } else {
            expect(options.headers).not.toHaveProperty("Authorization")
        }
    }
    const result = JSON.parse(await readFile(output, "utf8"))
    expect(result[first]).toEqual(snapshot(first, "# 첫 문서"))
    expect(result[branchDocument].revision).toBe(otherRevision)
    expect(await readdir(directory)).toEqual(["snapshots.json"])
})

test("현재 허용 목록을 처리하고 설명 전용 문서는 내려받지 않는다", async () => {
    const fetchImpl = vi.fn(
        async (url) =>
            new Response(url.startsWith("https://api.github.com/") ? revision : "# 공개 문서"),
    )
    await run(fetchImpl, {
        documents: PUBLIC_EXTERNAL_DOCUMENTS,
        metadataOnly: PUBLIC_EXTERNAL_DOCUMENTS_METADATA_ONLY,
    })
    expect(Object.keys(JSON.parse(await readFile(output, "utf8")))).toEqual(
        PUBLIC_EXTERNAL_DOCUMENTS.filter(
            (href) => !PUBLIC_EXTERNAL_DOCUMENTS_METADATA_ONLY.includes(href),
        ),
    )
    expect(
        fetchImpl.mock.calls.filter(([url]) =>
            url.startsWith("https://raw.githubusercontent.com/"),
        ),
    ).toHaveLength(
        PUBLIC_EXTERNAL_DOCUMENTS.length - PUBLIC_EXTERNAL_DOCUMENTS_METADATA_ONLY.length,
    )
})

test("본문이 같으면 기존 커밋과 파일 수정 시간을 유지한다", async () => {
    await utimes(output, 1, 1)
    const before = await stat(output)
    await expect(
        run(responses(new Response(otherRevision), new Response("# 이전 공개 문서\n"))),
    ).resolves.toMatchObject({ changed: false })
    await unchanged()
    expect((await stat(output)).mtimeMs).toBe(before.mtimeMs)
})

test("본문이 같아도 잘못된 기존 출처는 검증한 커밋으로 교체한다", async () => {
    await writeFile(
        output,
        JSON.stringify({
            [first]: {
                content: "# 이전 공개 문서\n",
                revision: "invalid",
                sourceUrl: "https://example.com",
            },
        }),
    )
    await run(responses(new Response(revision), new Response("# 이전 공개 문서\n")))
    expect(JSON.parse(await readFile(output, "utf8"))[first]).toEqual(
        snapshot(first, "# 이전 공개 문서\n"),
    )
})

test.each(["", "not-a-sha", JSON.stringify({ sha: revision }), "../main"])(
    "잘못된 SHA 응답은 문서 수집 전에 거부한다: %s",
    async (sha) => {
        const fetchImpl = responses(new Response(sha))
        await expect(run(fetchImpl)).rejects.toThrow("SHA")
        expect(fetchImpl).toHaveBeenCalledTimes(1)
        await unchanged()
    },
)

test.each(["", " \n\t", "담당자: test@example.invalid", "문의: 010-1234-5678"])(
    "빈 본문이나 연락처가 들어오면 기존 파일을 유지한다: %s",
    async (content) => {
        const fetchImpl = responses(
            new Response(revision),
            new Response("# 먼저 읽은 새 문서"),
            new Response(content),
        )
        await expect(run(fetchImpl, { documents: [first, second] })).rejects.toThrow()
        await unchanged()
    },
)

test.each([302, 401, 429, 503])(
    "HTTP %i로 중단되면 먼저 받은 문서도 저장하지 않는다",
    async (status) => {
        const fetchImpl = responses(
            new Response(revision),
            new Response("# 새 문서"),
            new Response(null, { status }),
        )
        await expect(run(fetchImpl, { documents: [first, second] })).rejects.toThrow(
            `HTTP ${status}`,
        )
        expect(fetchImpl).toHaveBeenCalledTimes(3)
        await unchanged()
    },
)

test.each([false, true])(
    "길이 헤더 유무와 관계없이 문서당 1MiB를 제한한다: %s",
    async (withLength) => {
        const content = "x".repeat(1024 * 1024 + 1)
        const response = new Response(content, {
            headers: withLength ? { "Content-Length": String(content.length) } : {},
        })
        await expect(run(responses(new Response(revision), response))).rejects.toThrow("용량 제한")
        await unchanged()
    },
)

test("잘못된 UTF-8 본문은 저장하지 않는다", async () => {
    await expect(
        run(responses(new Response(revision), new Response(new Uint8Array([0xff, 0xfe])))),
    ).rejects.toThrow()
    await unchanged()
})

test("본문 수신 중 연결이 끊기면 기존 파일을 유지한다", async () => {
    const body = new ReadableStream({
        start(controller) {
            controller.error(new Error("테스트 연결 중단"))
        },
    })
    await expect(run(responses(new Response(revision), new Response(body)))).rejects.toThrow(
        "연결 중단",
    )
    await unchanged()
})

test.each([
    "https://example.com/owner/repo/blob/main/doc.md",
    "https://github.com/example/project/tree/main/docs",
    "https://github.com/example/project/blob/main",
    "https://token@github.com/example/project/blob/main/doc.md",
    "https://github.com/example/project/blob/main/doc.md?token=secret",
])("잘못된 주소는 내려받기 전에 거부한다: %s", async (href) => {
    const fetchImpl = vi.fn()
    await expect(run(fetchImpl, { documents: [first, href] })).rejects.toThrow()
    expect(fetchImpl).not.toHaveBeenCalled()
    await unchanged()
})

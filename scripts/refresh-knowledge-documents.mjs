import { randomUUID } from "node:crypto"
import { readFile, rename, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
    PUBLIC_EXTERNAL_DOCUMENTS,
    PUBLIC_EXTERNAL_DOCUMENTS_METADATA_ONLY,
} from "../src/data/knowledgeCorpus.js"
import { assertNoContactInformation } from "./knowledge-corpus-core.mjs"
import { cancelGitHubBody, githubResponseError } from "./github-response.mjs"

const SHA_PATTERN = /^[a-f0-9]{40}$/
const MAX_DOCUMENT_BYTES = 1024 * 1024
const DEFAULT_OUTPUT = new URL("../docs/knowledge-document-snapshots.json", import.meta.url)

const parseDocument = (href) => {
    const url = new URL(href)
    const [, owner, repository, kind, ref, ...segments] = url.pathname.split("/")
    if (
        url.origin !== "https://github.com" ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        !/^[\w-]+$/.test(owner ?? "") ||
        !/^[\w.-]+$/.test(repository ?? "") ||
        [".", ".."].includes(repository) ||
        kind !== "blob" ||
        !ref ||
        !segments.length ||
        segments.some((segment) => !segment)
    ) {
        throw new Error("공개 문서 주소는 GitHub의 저장소/blob/참조/파일 형식이어야 합니다.")
    }
    return { href, repo: `${owner}/${repository}`, ref, sourcePath: segments.join("/") }
}

const readText = async (response, maxBytes) => {
    if (response.status !== 200) {
        const error = githubResponseError(response, "GitHub 문서 수집 실패")
        await cancelGitHubBody(response.body)
        throw error
    }
    if (Number(response.headers.get("content-length")) > maxBytes) {
        await cancelGitHubBody(response.body)
        throw new Error("GitHub 응답이 읽기 용량 제한을 초과했습니다.")
    }
    if (!response.body) throw new Error("GitHub 응답 본문이 비어 있습니다.")
    const reader = response.body.getReader()
    const chunks = []
    let size = 0
    try {
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            size += value.byteLength
            if (size > maxBytes) throw new Error("GitHub 응답이 읽기 용량 제한을 초과했습니다.")
            chunks.push(value)
        }
        return new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks, size))
    } finally {
        try {
            await cancelGitHubBody(reader)
        } finally {
            reader.releaseLock()
        }
    }
}

export async function refreshKnowledgeDocuments({
    documents = PUBLIC_EXTERNAL_DOCUMENTS,
    metadataOnly = PUBLIC_EXTERNAL_DOCUMENTS_METADATA_ONLY,
    output = DEFAULT_OUTPUT,
    token = process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim(),
    fetchImpl = fetch,
} = {}) {
    const targets = [...new Set(documents)]
        .filter((href) => !metadataOnly.includes(href))
        .map(parseDocument)
    const outputPath = output instanceof URL ? fileURLToPath(output) : output
    const previousText = await readFile(outputPath, "utf8").catch((error) => {
        if (error.code === "ENOENT") return "{}"
        throw error
    })
    const previous = JSON.parse(previousText)
    const snapshots = {}
    const revisions = new Map()
    const fetchText = async (url, maxBytes, headers = {}) =>
        readText(
            await fetchImpl(url, {
                redirect: "error",
                signal: AbortSignal.timeout(30_000),
                headers,
            }),
            maxBytes,
        )

    for (const { href, repo, ref, sourcePath } of targets) {
        const referenceKey = `${repo}/${ref}`
        if (!revisions.has(referenceKey)) {
            const revision = (
                await fetchText(`https://api.github.com/repos/${repo}/commits/${ref}`, 256, {
                    Accept: "application/vnd.github.sha",
                    "X-GitHub-Api-Version": "2026-03-10",
                    ...(token?.trim() ? { Authorization: `Bearer ${token.trim()}` } : {}),
                })
            ).trim()
            if (!SHA_PATTERN.test(revision))
                throw new Error("GitHub 커밋 SHA 응답 형식이 올바르지 않습니다.")
            revisions.set(referenceKey, revision)
        }
        const revision = revisions.get(referenceKey)
        const content = await fetchText(
            `https://raw.githubusercontent.com/${repo}/${revision}/${sourcePath}`,
            MAX_DOCUMENT_BYTES,
        )
        if (!content.trim()) throw new Error(`공개 문서 본문이 비어 있습니다: ${href}`)
        assertNoContactInformation(content, href)
        const sourceUrl = (sha) => `https://github.com/${repo}/blob/${sha}/${sourcePath}`
        const old = previous?.[href]
        snapshots[href] =
            old?.content === content &&
            SHA_PATTERN.test(old.revision) &&
            old.sourceUrl === sourceUrl(old.revision)
                ? old
                : { revision, sourceUrl: sourceUrl(revision), content }
    }

    const serialized = `${JSON.stringify(snapshots, null, 4)}\n`
    const changed = previousText !== serialized
    if (changed) {
        // 같은 디렉터리의 완성된 임시 파일로 교체해 기존 스냅샷이 잘리지 않게 한다.
        const temporaryPath = `${outputPath}.${randomUUID()}.tmp`
        try {
            await writeFile(temporaryPath, serialized, { flag: "wx", mode: 0o600 })
            await rename(temporaryPath, outputPath)
        } finally {
            await rm(temporaryPath, { force: true })
        }
    }
    return {
        documents: targets.length,
        metadataOnly: documents.filter((href) => metadataOnly.includes(href)).length,
        changed,
    }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    try {
        const result = await refreshKnowledgeDocuments()
        console.log(
            `공개 문서 ${result.documents}건을 커밋에 고정했습니다. 연락처 포함 문서 ${result.metadataOnly}건은 설명만 유지합니다.`,
        )
    } catch (error) {
        console.error(`공개 문서 수집 실패: ${error.message}`)
        process.exitCode = 1
    }
}

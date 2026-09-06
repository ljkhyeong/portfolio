import { readFile } from "node:fs/promises"

const baseUrl = process.env.KNOWLEDGE_API_BASE_URL?.replace(/\/$/, "")
const syncKey = process.env.KNOWLEDGE_SYNC_KEY
if (!baseUrl || !syncKey)
    throw new Error("KNOWLEDGE_API_BASE_URL과 KNOWLEDGE_SYNC_KEY를 설정하세요.")
const corpus = JSON.parse(
    await readFile(new URL("../public/knowledge/portfolio.json", import.meta.url)),
)
const request = async (path, method = "GET") => {
    const response = await fetch(`${baseUrl}/internal/v1/knowledge/${path}`, {
        method,
        headers: { "X-Knowledge-Sync-Key": syncKey },
        signal: AbortSignal.timeout(600_000),
    })
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`)
    return response.json()
}
const before = await request("status")
if (before.sourceRevision !== corpus.sourceRevision) {
    throw new Error(
        "API에 포함된 자료 버전이 현재 배포 자료와 다릅니다. 같은 자료로 API를 먼저 배포하세요.",
    )
}
if (!before.upToDate) await request("sync", "POST")
const status = await request("status")
if (!status.upToDate || status.sourceRevision !== corpus.sourceRevision) {
    throw new Error("색인의 문서 수·본문 해시가 현재 자료와 일치하지 않습니다.")
}
console.log(`검색 자료 반영 확인: ${status.sourceRevision}, ${status.matchedDocuments}건`)

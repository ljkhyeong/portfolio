import { readFile } from "node:fs/promises"
import { createKnowledgeApiClient } from "./knowledge-api-client.mjs"

const baseUrl = process.env.KNOWLEDGE_API_BASE_URL
const syncKey = process.env.KNOWLEDGE_SYNC_KEY
if (!baseUrl || !syncKey)
    throw new Error("KNOWLEDGE_API_BASE_URL과 KNOWLEDGE_SYNC_KEY를 설정하세요.")
const corpus = JSON.parse(
    await readFile(new URL("../public/knowledge/portfolio.json", import.meta.url)),
)
const client = createKnowledgeApiClient({ baseUrl, syncKey })
const before = await client.readStatus(corpus)
if (!before.upToDate) await client.sync()
const status = await client.readStatus(corpus)
if (!status.upToDate) {
    throw new Error("색인의 문서 수·본문 해시가 현재 자료와 일치하지 않습니다.")
}
console.log(`검색 자료 반영 확인: ${status.sourceRevision}, ${status.matchedDocuments}건`)

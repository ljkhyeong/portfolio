import { readFile, writeFile } from "node:fs/promises"
import { PUBLIC_EXTERNAL_DOCUMENTS } from "../src/data/knowledgeCorpus.js"

const selectedNames = [
    "eligibility-decision.md",
    "deadline-reminder-candidates.md",
    "ai-reservation-recovery-heartbeat.md",
    "0033_결제_confirm_트랜잭션과_보상_경계/adr.md",
    "0032_알림_Outbox_전달_보장/adr.md",
    "0047_스마트스토어_재고_동기화/adr.md",
]
const selected = PUBLIC_EXTERNAL_DOCUMENTS.filter((href) =>
    selectedNames.some((name) => decodeURIComponent(href).endsWith(name)),
)
if (selected.length !== selectedNames.length)
    throw new Error("선택한 공개 문서의 허용 목록을 확인하세요.")
const revisions = new Map()
const output = new URL("../docs/knowledge-document-snapshots.json", import.meta.url)
const previousText = await readFile(output, "utf8").catch((error) => {
    if (error.code === "ENOENT") return "{}"
    throw error
})
const previous = JSON.parse(previousText)
const snapshots = {}
for (const href of selected) {
    const [, owner, repository, , branch, ...segments] = new URL(href).pathname.split("/")
    const repo = `${owner}/${repository}`
    if (!revisions.has(repo)) {
        const response = await fetch(`https://api.github.com/repos/${repo}/commits/${branch}`, {
            signal: AbortSignal.timeout(30_000),
            headers: { Accept: "application/vnd.github+json" },
        })
        if (!response.ok) throw new Error(`${repo}: HTTP ${response.status}`)
        revisions.set(repo, (await response.json()).sha)
    }
    const revision = revisions.get(repo)
    const sourcePath = segments.join("/")
    const response = await fetch(
        `https://raw.githubusercontent.com/${repo}/${revision}/${sourcePath}`,
        {
            signal: AbortSignal.timeout(30_000),
        },
    )
    if (!response.ok) throw new Error(`${href}: HTTP ${response.status}`)
    const content = await response.text()
    snapshots[href] =
        previous[href]?.content === content
            ? previous[href]
            : {
                  revision,
                  sourceUrl: `https://github.com/${repo}/blob/${revision}/${sourcePath}`,
                  content,
              }
}
const serialized = `${JSON.stringify(snapshots, null, 4)}\n`
if (previousText !== serialized) await writeFile(output, serialized)
console.log(
    `공개 문서 ${selected.length}건을 커밋에 고정했습니다. 본문 diff를 검토한 뒤 검색 자료를 생성하세요.`,
)

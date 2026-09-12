import { readFile, writeFile } from "node:fs/promises"
import {
    PUBLIC_EXTERNAL_DOCUMENTS,
    PUBLIC_EXTERNAL_DOCUMENTS_METADATA_ONLY,
} from "../src/data/knowledgeCorpus.js"

const revisions = new Map()
const output = new URL("../docs/knowledge-document-snapshots.json", import.meta.url)
const githubToken = process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim()
const githubHeaders = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
}
const previousText = await readFile(output, "utf8").catch((error) => {
    if (error.code === "ENOENT") return "{}"
    throw error
})
const previous = JSON.parse(previousText)
const snapshots = {}
const snapshotTargets = PUBLIC_EXTERNAL_DOCUMENTS.filter(
    (href) => !PUBLIC_EXTERNAL_DOCUMENTS_METADATA_ONLY.includes(href),
)
for (const href of snapshotTargets) {
    const [, owner, repository, , branch, ...segments] = new URL(href).pathname.split("/")
    const repo = `${owner}/${repository}`
    if (!revisions.has(repo)) {
        const response = await fetch(`https://api.github.com/repos/${repo}/commits/${branch}`, {
            signal: AbortSignal.timeout(30_000),
            headers: githubHeaders,
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
    `공개 문서 ${snapshotTargets.length}건을 커밋에 고정했습니다. 연락처 포함 문서 ${PUBLIC_EXTERNAL_DOCUMENTS_METADATA_ONLY.length}건은 설명만 유지합니다.`,
)

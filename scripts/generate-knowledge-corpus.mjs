import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"
import { createKnowledgeSources, PUBLIC_LOCAL_DOCUMENTS } from "../src/data/knowledgeCorpus.js"
import { buildKnowledgeCorpus } from "./knowledge-corpus-core.mjs"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outputPath = path.join(repositoryRoot, "public", "knowledge", "portfolio.json")

const loadProjects = async () => {
    const vite = await createServer({
        root: repositoryRoot,
        appType: "custom",
        logLevel: "silent",
        server: { middlewareMode: true },
    })

    try {
        const { projectList } = await vite.ssrLoadModule("/src/data/projects.js")

        return projectList
    } finally {
        await vite.close()
    }
}

const loadLocalDocuments = async () =>
    Object.fromEntries(
        await Promise.all(
            PUBLIC_LOCAL_DOCUMENTS.map(async (href) => {
                const filePath = path.join(
                    repositoryRoot,
                    "public",
                    href.replace(/^\/docs\//, "docs/"),
                )

                return [href, await readFile(filePath, "utf8")]
            }),
        ),
    )

const projects = await loadProjects()
const localDocumentContentByHref = await loadLocalDocuments()
const sources = createKnowledgeSources(projects, { localDocumentContentByHref })
const corpus = buildKnowledgeCorpus(sources)

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(corpus, null, 2)}\n`)

console.log(
    `공개 지식 문서 ${corpus.documents.length}건을 생성했습니다: ${path.relative(repositoryRoot, outputPath)}`,
)

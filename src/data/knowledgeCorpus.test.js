import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { projectList } from "./projects"
import {
    createKnowledgeSources,
    KNOWLEDGE_DOCUMENT_TYPES,
    PUBLIC_EXTERNAL_DOCUMENTS,
    PUBLIC_LOCAL_DOCUMENTS,
} from "./knowledgeCorpus"
import { buildKnowledgeCorpus } from "../../scripts/knowledge-corpus-core.mjs"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const localDocumentContentByHref = Object.fromEntries(
    PUBLIC_LOCAL_DOCUMENTS.map((href) => [
        href,
        readFileSync(
            path.join(repositoryRoot, "public", href.replace(/^\/docs\//, "docs/")),
            "utf8",
        ),
    ]),
)

const createCorpus = () =>
    buildKnowledgeCorpus(createKnowledgeSources(projectList, { localDocumentContentByHref }))

describe("공개 지식 문서 목록", () => {
    it("공개한 프로젝트 설명과 접근 가능한 대표 문서만 포함한다", () => {
        const corpus = createCorpus()
        const serializedCorpus = JSON.stringify(corpus)
        const publicContent = corpus.documents
            .map((document) => `${document.title}\n${document.content}`)
            .join("\n")
        const externalDocuments = corpus.documents.filter((document) =>
            document.sourceUrl.startsWith("https://github.com/"),
        )

        expect(corpus.projectIds).toEqual([
            "baton",
            "warrant",
            "happygallery",
            "hope-commit",
            "defense",
            "webrtc",
        ])
        expect(corpus.documentTypes).toEqual(KNOWLEDGE_DOCUMENT_TYPES)
        expect(externalDocuments.map((document) => document.sourceUrl)).toEqual(
            PUBLIC_EXTERNAL_DOCUMENTS,
        )
        expect(publicContent).not.toMatch(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)
        expect(publicContent).not.toMatch(/(?:\+?82[-.\s]?)?0?1[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/)
        expect(serializedCorpus).not.toContain("Obsidian")
        expect(serializedCorpus).toContain("ADR/0033_결제_confirm_트랜잭션과_보상_경계")
        expect(serializedCorpus).toContain("ADR/0036_%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4")
    })

    it("같은 입력에는 같은 문서 ID와 해시를 생성한다", () => {
        const firstCorpus = createCorpus()
        const secondCorpus = createCorpus()

        expect(secondCorpus).toEqual(firstCorpus)
        expect(new Set(firstCorpus.documents.map((document) => document.documentId)).size).toBe(
            firstCorpus.documents.length,
        )

        firstCorpus.documents.forEach((document) => {
            expect(document).toEqual(
                expect.objectContaining({
                    schemaVersion: "1.0",
                    sourceRevision: expect.stringMatching(/^sha256:[a-f0-9]{12}$/),
                    documentId: expect.stringMatching(/^knowledge_[a-f0-9]{24}$/),
                    projectId: expect.any(String),
                    serviceId: expect.toSatisfy(
                        (value) => value === null || typeof value === "string",
                    ),
                    documentType: expect.any(String),
                    title: expect.any(String),
                    content: expect.any(String),
                    sourceUrl: expect.stringMatching(/^https:\/\//),
                    visibility: "public",
                    evidenceLevel: expect.any(String),
                    sourceHash: expect.stringMatching(/^[a-f0-9]{64}$/),
                    contentHash: expect.stringMatching(/^[a-f0-9]{64}$/),
                }),
            )
        })
    })

    it("문서 내용이 바뀌면 해당 문서의 해시만 바뀐다", () => {
        const sources = createKnowledgeSources(projectList, { localDocumentContentByHref })
        const baseline = buildKnowledgeCorpus(sources)
        const changed = buildKnowledgeCorpus(
            sources.map((source, index) =>
                index === 0
                    ? { ...source, content: `${source.content}\n\n변경된 공개 설명` }
                    : source,
            ),
        )

        expect(changed.documents[0].documentId).toBe(baseline.documents[0].documentId)
        expect(changed.documents[0].contentHash).not.toBe(baseline.documents[0].contentHash)
        expect(changed.documents[0].sourceHash).not.toBe(baseline.documents[0].sourceHash)
        expect(changed.documents.slice(1)).toEqual(baseline.documents.slice(1))
    })
})

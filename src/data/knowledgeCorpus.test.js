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
            "youth-policy-mate",
            "hope-commit",
            "intent-trace",
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

        const batonOverview = corpus.documents.find(
            (document) =>
                document.projectId === "baton" && document.documentType === "project_overview",
        )
        const roundOverview = corpus.documents.find(
            (document) =>
                document.projectId === "baton" &&
                document.serviceId === "round" &&
                document.documentType === "service_overview",
        )

        expect(batonOverview.content).toContain("공개 범위: 일부 저장소 공개")
        expect(roundOverview.content).toContain(
            "저장소 공개 범위: 비공개 저장소 / 설계와 테스트 요약 공개",
        )
        expect(roundOverview.content).toContain("검증 요약: Chromium 전체 미디어")
        expect(roundOverview.content).toContain("입력 확인: 참여권의 서명")

        const intentTraceOverview = corpus.documents.find(
            (document) =>
                document.projectId === "intent-trace" &&
                document.documentType === "project_overview",
        )

        expect(intentTraceOverview.content).toContain("원문 대화나 숨은 추론은 저장하지 않으며")
        expect(intentTraceOverview.content).toContain("공개 main은 0.8.0-SNAPSHOT")

        const youthPolicyOverview = corpus.documents.find(
            (document) =>
                document.projectId === "youth-policy-mate" &&
                document.documentType === "project_overview",
        )

        expect(youthPolicyOverview.content).toContain("구분: 개인 웹앱 프로젝트")
        expect(youthPolicyOverview.content).toContain("실제 정책 수집 및 추천")
        expect(youthPolicyOverview.content).toContain("아직 구현하지 않았습니다")

        const firstProblem = corpus.documents.find(
            (document) => document.documentType === "problem_solution",
        )

        expect(firstProblem.content).toContain("해결 방법:")
        expect(firstProblem.content).not.toContain("\n\n적용:")
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

    it.each([
        ["제목", (source) => ({ ...source, title: `${source.title} 수정` })],
        ["원문 링크", (source) => ({ ...source, sourceUrl: "https://example.com/updated" })],
    ])("문서의 %s이 바뀌면 sourceHash만 바뀐다", (_, changeSource) => {
        const sources = createKnowledgeSources(projectList, { localDocumentContentByHref })
        const baseline = buildKnowledgeCorpus(sources)
        const changed = buildKnowledgeCorpus(
            sources.map((source, index) => (index === 0 ? changeSource(source) : source)),
        )

        expect(changed.documents[0].documentId).toBe(baseline.documents[0].documentId)
        expect(changed.documents[0].contentHash).toBe(baseline.documents[0].contentHash)
        expect(changed.documents[0].sourceHash).not.toBe(baseline.documents[0].sourceHash)
        expect(changed.documents.slice(1)).toEqual(baseline.documents.slice(1))
    })
})

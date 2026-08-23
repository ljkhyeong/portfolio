import { createHash } from "node:crypto"
import { KNOWLEDGE_DOCUMENT_TYPES, KNOWLEDGE_SCHEMA_VERSION } from "../src/data/knowledgeCorpus.js"

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
const PHONE_PATTERN = /(?:\+?82[-.\s]?)?0?1[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/

export const normalizeKnowledgeContent = (content) =>
    content
        .normalize("NFC")
        .replaceAll("\r\n", "\n")
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()

const stableValue = (value) => {
    if (Array.isArray(value)) {
        return value.map(stableValue)
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value)
                .sort(([left], [right]) => left.localeCompare(right))
                .map(([key, nestedValue]) => [key, stableValue(nestedValue)]),
        )
    }

    return value
}

const stableStringify = (value) => JSON.stringify(stableValue(value))

const sha256 = (value) => createHash("sha256").update(value, "utf8").digest("hex")

const assertPublicSource = (source) => {
    if (source.visibility !== "public") {
        throw new Error(`공개 허용 목록이 아닌 문서입니다: ${source.sourceKey}`)
    }

    if (!KNOWLEDGE_DOCUMENT_TYPES.includes(source.documentType)) {
        throw new Error(`지원하지 않는 문서 종류입니다: ${source.documentType}`)
    }

    if (EMAIL_PATTERN.test(source.content) || PHONE_PATTERN.test(source.content)) {
        throw new Error(
            `연락처가 포함된 문서는 공개 지식 목록에 넣을 수 없습니다: ${source.sourceKey}`,
        )
    }
}

const buildDocument = (source) => {
    assertPublicSource(source)

    const content = normalizeKnowledgeContent(source.content)
    const sourceIdentity = [source.projectId, source.documentType, source.sourceKey].join(":")
    const documentId = `knowledge_${sha256(`${KNOWLEDGE_SCHEMA_VERSION}:${sourceIdentity}`).slice(0, 24)}`
    const contentHash = sha256(content)
    const sourceHash = sha256(
        stableStringify({
            schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
            sourceKey: source.sourceKey,
            projectId: source.projectId,
            projectName: source.projectName,
            serviceId: source.serviceId,
            documentType: source.documentType,
            title: source.title,
            heading: source.heading,
            content,
            sourceUrl: source.sourceUrl,
            route: source.route,
            visibility: source.visibility,
            evidenceLevel: source.evidenceLevel,
        }),
    )

    return {
        schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
        sourceRevision: `sha256:${sourceHash.slice(0, 12)}`,
        documentId,
        projectId: source.projectId,
        projectName: source.projectName,
        serviceId: source.serviceId,
        documentType: source.documentType,
        title: source.title,
        heading: source.heading,
        content,
        sourceUrl: source.sourceUrl,
        route: source.route,
        visibility: source.visibility,
        evidenceLevel: source.evidenceLevel,
        sourceHash,
        contentHash,
    }
}

export const buildKnowledgeCorpus = (sources) => {
    const documents = sources.map(buildDocument)
    const duplicateDocumentIds = documents
        .map((document) => document.documentId)
        .filter((documentId, index, ids) => ids.indexOf(documentId) !== index)

    if (duplicateDocumentIds.length > 0) {
        throw new Error(`중복된 공개 문서 ID가 있습니다: ${duplicateDocumentIds.join(", ")}`)
    }

    const projectIds = [...new Set(documents.map((document) => document.projectId))]
    const corpusHash = sha256(
        stableStringify(
            documents
                .map(({ documentId, sourceHash }) => ({ documentId, sourceHash }))
                .sort((left, right) => left.documentId.localeCompare(right.documentId)),
        ),
    )

    return {
        schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
        sourceRevision: `sha256:${corpusHash.slice(0, 12)}`,
        documentTypes: KNOWLEDGE_DOCUMENT_TYPES,
        projectIds,
        documents,
    }
}

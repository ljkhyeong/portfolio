import { isSearchResponse } from "./knowledgeResponse"

// 검색 API에 연결할 수 없을 때 쓰는 브라우저 검색이다. 검색 API가 색인하는 것과 같은 공개 자료
// (public/knowledge/portfolio.json)를 서버와 같은 기준으로 검색한다.
// - 문단: 1,200자, 150자 겹침, 줄바꿈과 마침표, '다'에서 끊기(knowledge-api KnowledgeChunker)
// - 순위: 제목^3, 소제목^2, 프로젝트 이름^2, 본문의 BM25 중 가장 높은 필드 점수(Elasticsearch best_fields)
// - 결과: 문서마다 점수가 가장 높은 문단 하나, 요약 280자(ResponseMapper)
// 형태소 분석(Nori) 대신 한글은 두 글자씩 나눠 비교하므로 순위는 서버 검색과 다를 수 있다.
export const LOCAL_CORPUS_PATH = "knowledge/portfolio.json"

const MAX_CHUNK_CHARACTERS = 1200
const OVERLAP_CHARACTERS = 150
const SNIPPET_LENGTH = 280
const DEFAULT_LIMIT = 10
const BM25_K1 = 1.2
const BM25_B = 0.75
const FIELD_BOOSTS = { title: 3, heading: 2, projectName: 2, content: 1 }
const FIELDS = Object.keys(FIELD_BOOSTS)
const TOKEN_PATTERN = /\p{Script=Hangul}+|(?:(?!\p{Script=Hangul})[\p{L}\p{N}])+/gu
const HANGUL_PATTERN = /^\p{Script=Hangul}+$/u

export class LocalKnowledgeError extends Error {
    constructor(message, { code = "LOCAL_CORPUS_UNAVAILABLE" } = {}) {
        super(message)
        this.name = "LocalKnowledgeError"
        this.code = code
    }
}

// 한글 낱말은 두 글자씩 겹쳐 나눈다(결제와 → 결제, 제와). 조사가 붙어도 앞 두 글자가 같으면 일치한다.
export const tokenize = (text) => {
    const tokens = []
    for (const [word] of String(text ?? "")
        .toLowerCase()
        .matchAll(TOKEN_PATTERN)) {
        if (!HANGUL_PATTERN.test(word) || word.length === 1) {
            tokens.push(word)
            continue
        }
        for (let index = 0; index < word.length - 1; index += 1) {
            tokens.push(word.slice(index, index + 2))
        }
    }
    return tokens
}

const isWhitespace = (character) => /\s/.test(character)

const findNaturalBoundary = (content, start, proposedEnd) => {
    if (proposedEnd === content.length) return proposedEnd
    const minimumEnd = start + Math.floor((MAX_CHUNK_CHARACTERS * 2) / 3)
    for (let index = proposedEnd; index >= minimumEnd; index -= 1) {
        if (["\n", ".", "\u3002", "다"].includes(content[index - 1])) return index
    }
    for (let index = proposedEnd; index >= minimumEnd; index -= 1) {
        if (isWhitespace(content[index - 1])) return index
    }
    return proposedEnd
}

export const splitChunks = (text) => {
    const content = String(text ?? "").trim()
    if (content.length <= MAX_CHUNK_CHARACTERS) return content ? [content] : []

    const chunks = []
    let start = 0
    while (start < content.length) {
        const proposedEnd = Math.min(start + MAX_CHUNK_CHARACTERS, content.length)
        const end = findNaturalBoundary(content, start, proposedEnd)
        const chunk = content.slice(start, end).trim()
        if (chunk) chunks.push(chunk)
        if (end >= content.length) break
        start = Math.max(end - OVERLAP_CHARACTERS, start + 1)
        while (start < end && !isWhitespace(content[start])) start += 1
    }
    return chunks
}

const countTerms = (tokens) => {
    const counts = new Map()
    tokens.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1))
    return counts
}

const hasText = (value) => typeof value === "string" && value.trim().length > 0

const isCorpusDocument = (document) =>
    document !== null &&
    typeof document === "object" &&
    ["documentId", "projectId", "documentType", "content"].every((key) => hasText(document[key])) &&
    (hasText(document.title) || hasText(document.heading))

export const buildLocalIndex = (corpus) => {
    if (!Array.isArray(corpus?.documents) || !corpus.documents.every(isCorpusDocument)) {
        throw new LocalKnowledgeError("공개 문서 자료의 형식이 올바르지 않습니다.", {
            code: "LOCAL_CORPUS_INVALID",
        })
    }

    const chunks = corpus.documents.flatMap((document) =>
        splitChunks(document.content).map((content, index) => {
            const fields = {
                title: document.title ?? "",
                heading: document.heading ?? "",
                projectName: document.projectName ?? "",
                content,
            }
            const terms = Object.fromEntries(
                FIELDS.map((field) => {
                    const tokens = tokenize(fields[field])
                    return [field, { counts: countTerms(tokens), length: tokens.length }]
                }),
            )
            return {
                chunkId: `${document.documentId}#${String(index).padStart(3, "0")}`,
                document,
                content,
                terms,
            }
        }),
    )

    const fieldStats = Object.fromEntries(
        FIELDS.map((field) => {
            const documentFrequency = new Map()
            let totalLength = 0
            chunks.forEach((chunk) => {
                totalLength += chunk.terms[field].length
                chunk.terms[field].counts.forEach((_, term) =>
                    documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1),
                )
            })
            return [
                field,
                {
                    documentFrequency,
                    averageLength: chunks.length ? totalLength / chunks.length : 0,
                },
            ]
        }),
    )

    return { chunks, fieldStats, chunkCount: chunks.length }
}

const fieldScore = (index, chunk, field, queryTerms) => {
    const { counts, length } = chunk.terms[field]
    if (length === 0) return 0
    const { documentFrequency, averageLength } = index.fieldStats[field]
    let score = 0
    queryTerms.forEach((term) => {
        const termFrequency = counts.get(term)
        if (!termFrequency) return
        const containing = documentFrequency.get(term) ?? 0
        const idf = Math.log(1 + (index.chunkCount - containing + 0.5) / (containing + 0.5))
        const lengthNorm = 1 - BM25_B + BM25_B * (length / (averageLength || 1))
        score += idf * (termFrequency / (termFrequency + BM25_K1 * lengthNorm))
    })
    return score
}

const toPlainText = (text) =>
    text
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]*)`/g, "$1")
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/^\s{0,3}#{1,6}\s*/gm, "")
        .replace(/^\s*>\s?/gm, "")
        .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
        .replace(/^[\s|:-]+$/gm, "")
        .replace(/\*\*|__|~~/g, "")
        .replace(/\s*\|\s*/g, " ")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{2,}/g, "\n")
        .trim()

// 질문 낱말이 가장 많이 들어 있는 문장부터 280자까지 보여 준다. 길면 문장이나 낱말 경계에서 자른다.
export const buildSnippet = (content, queryTerms) => {
    const plain = toPlainText(content)
    const sentences = plain.split(/(?<=[.!?\u3002])\s+|\n+/).filter((sentence) => sentence.trim())
    let best = 0
    let bestScore = 0
    sentences.forEach((sentence, index) => {
        const sentenceTerms = new Set(tokenize(sentence))
        const score = [...queryTerms].filter((term) => sentenceTerms.has(term)).length
        if (score > bestScore) {
            best = index
            bestScore = score
        }
    })

    const passage = sentences.slice(best).join(" ")
    if (passage.length <= SNIPPET_LENGTH) return passage

    const head = passage.slice(0, SNIPPET_LENGTH + 1)
    const sentenceEnd = Math.max(
        ...[". ", "다. ", "? ", "! "].map((mark) => head.lastIndexOf(mark)),
    )
    let end = sentenceEnd >= SNIPPET_LENGTH / 2 ? sentenceEnd + 1 : head.lastIndexOf(" ")
    if (end <= 0) end = SNIPPET_LENGTH
    return `${passage.slice(0, end).trimEnd()}…`
}

export const searchLocalIndex = (
    index,
    { query, projectId, serviceId, documentType, limit = DEFAULT_LIMIT },
) => {
    const queryTerms = new Set(tokenize(query))
    if (queryTerms.size === 0) return { total: 0, results: [] }

    const ranked = index.chunks
        .filter(
            ({ document }) =>
                (!projectId || document.projectId === projectId) &&
                (!serviceId || document.serviceId === serviceId) &&
                (!documentType || document.documentType === documentType),
        )
        .map((chunk) => ({
            chunk,
            score: Math.max(
                ...FIELDS.map(
                    (field) => FIELD_BOOSTS[field] * fieldScore(index, chunk, field, queryTerms),
                ),
            ),
        }))
        .filter(({ score }) => score > 0)
        .sort((left, right) => right.score - left.score)

    const seenDocuments = new Set()
    const results = []
    for (const { chunk } of ranked) {
        const { document } = chunk
        if (seenDocuments.has(document.documentId)) continue
        seenDocuments.add(document.documentId)
        results.push({
            chunkId: chunk.chunkId,
            projectId: document.projectId,
            projectName: document.projectName ?? null,
            serviceId: document.serviceId ?? null,
            documentType: document.documentType,
            title: document.title ?? null,
            heading: document.heading ?? null,
            snippet: buildSnippet(chunk.content, queryTerms),
            sourceUrl: document.sourceUrl ?? null,
            route: document.route ?? null,
        })
        if (results.length >= limit) break
    }
    return { total: results.length, results }
}

let indexPromise = null

// 여러 검색이 같은 요청을 기다리므로, 한 검색이 취소돼도 자료 요청은 끊지 않는다.
const loadLocalIndex = async () => {
    let response
    try {
        response = await fetch(`${import.meta.env.BASE_URL}${LOCAL_CORPUS_PATH}`)
    } catch {
        throw new LocalKnowledgeError("공개 문서 자료를 불러오지 못했습니다.")
    }
    if (!response.ok) {
        throw new LocalKnowledgeError("공개 문서 자료를 불러오지 못했습니다.")
    }
    let corpus
    try {
        corpus = await response.json()
    } catch {
        throw new LocalKnowledgeError("공개 문서 자료의 형식이 올바르지 않습니다.", {
            code: "LOCAL_CORPUS_INVALID",
        })
    }
    return buildLocalIndex(corpus)
}

// 자료와 색인은 한 번만 만든다. 실패하면 다음 검색에서 다시 받는다.
export const searchLocalKnowledge = async ({ signal, ...request }) => {
    signal?.throwIfAborted()
    indexPromise ??= loadLocalIndex().catch((error) => {
        indexPromise = null
        throw error
    })
    const index = await indexPromise
    signal?.throwIfAborted()
    const response = searchLocalIndex(index, request)
    if (!isSearchResponse(response)) {
        throw new LocalKnowledgeError("공개 문서 검색 결과의 형식이 올바르지 않습니다.", {
            code: "LOCAL_CORPUS_INVALID",
        })
    }
    return response
}

export const resetLocalKnowledgeIndex = () => {
    indexPromise = null
}

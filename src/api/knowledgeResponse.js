const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value)
const hasText = (value) => typeof value === "string" && value.trim().length > 0
const isOptionalText = (value) => value == null || typeof value === "string"
const isEmpty = (value) => value == null || value === ""
const hasUnsafeUrlCharacters = (value) => /[\\\u0000-\u0020\u007f]/.test(value)

const isLocalRoute = (value) =>
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !hasUnsafeUrlCharacters(value)

const isSourceUrl = (value) => {
    if (isLocalRoute(value)) return true
    if (!hasText(value) || hasUnsafeUrlCharacters(value)) return false

    try {
        const url = new URL(value)
        return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password
    } catch {
        return false
    }
}

const isEvidence = (item) =>
    isRecord(item) &&
    ["chunkId", "title", "heading", "excerpt"].every((key) => isOptionalText(item[key])) &&
    (hasText(item.title) || hasText(item.heading)) &&
    (isEmpty(item.route) || isLocalRoute(item.route)) &&
    (isEmpty(item.sourceUrl) || isSourceUrl(item.sourceUrl)) &&
    (hasText(item.route) || hasText(item.sourceUrl))

const isSearchResult = (item) =>
    isEvidence(item) &&
    hasText(item.projectId) &&
    hasText(item.documentType) &&
    typeof item.snippet === "string" &&
    isOptionalText(item.projectName) &&
    isOptionalText(item.serviceId)

export const isSearchResponse = (payload) =>
    isRecord(payload) &&
    Array.isArray(payload.results) &&
    payload.results.every(isSearchResult) &&
    Number.isSafeInteger(payload.total) &&
    payload.total === payload.results.length

export const isAnswerResponse = (payload) => {
    if (
        !isRecord(payload) ||
        !Array.isArray(payload.citations) ||
        !payload.citations.every(isEvidence)
    ) {
        return false
    }

    if (payload.status === "GENERATED") {
        return hasText(payload.answer) && payload.citations.length > 0
    }

    return (
        ["INSUFFICIENT_EVIDENCE", "GENERATION_UNAVAILABLE"].includes(payload.status) &&
        isEmpty(payload.answer) &&
        payload.citations.length === 0
    )
}

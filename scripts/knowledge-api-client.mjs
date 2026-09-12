import {
    isAnswerResponse,
    isSearchResponse,
    isSearchResults,
} from "../src/api/knowledgeResponse.js"

const normalizeBaseUrl = (value) => {
    let url
    try {
        url = new URL(value)
    } catch {
        throw new Error("Knowledge API 주소는 HTTP 또는 HTTPS URL이어야 합니다.")
    }
    if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Knowledge API 주소는 HTTP 또는 HTTPS URL이어야 합니다.")
    }
    if (url.username || url.password || url.search || url.hash) {
        throw new Error("Knowledge API 주소에는 인증 정보·쿼리·해시를 넣을 수 없습니다.")
    }
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`
}

const validateStatus = (status, corpus) => {
    const counts = [status?.expectedDocuments, status?.indexedDocuments, status?.matchedDocuments]
    if (
        typeof status?.sourceRevision !== "string" ||
        typeof status?.upToDate !== "boolean" ||
        counts.some((value) => !Number.isSafeInteger(value) || value < 0) ||
        status.matchedDocuments > Math.min(status.expectedDocuments, status.indexedDocuments) ||
        (status.upToDate &&
            (status.expectedDocuments !== status.indexedDocuments ||
                status.expectedDocuments !== status.matchedDocuments))
    ) {
        throw new Error("자료 상태 응답의 형식이나 문서 수가 올바르지 않습니다.")
    }
    if (
        status.sourceRevision !== corpus.sourceRevision ||
        status.expectedDocuments !== corpus.documents.length
    ) {
        throw new Error("API와 현재 공개 자료의 버전·문서 수가 다릅니다. 같은 자료로 배포하세요.")
    }
    return status
}

export function createKnowledgeApiClient({ baseUrl, syncKey, fetchImpl = fetch }) {
    const base = normalizeBaseUrl(baseUrl)
    const key = syncKey?.trim()
    const request = async (
        endpoint,
        { method = "GET", body, authenticated = false, timeoutMs, validate },
    ) => {
        const headers = { Accept: "application/json" }
        if (body !== undefined) headers["Content-Type"] = "application/json"
        if (authenticated) {
            if (!key) throw new Error("KNOWLEDGE_SYNC_KEY를 설정하세요.")
            headers["X-Knowledge-Sync-Key"] = key
        }
        // 관리 키와 질문을 리다이렉트 대상에 전달하지 않는다.
        const response = await fetchImpl(`${base}${endpoint}`, {
            method,
            headers,
            ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
            redirect: "error",
            signal: AbortSignal.timeout(timeoutMs),
        })
        if (response.status !== 200) {
            await response.body?.cancel()
            throw new Error(
                `${endpoint}: HTTP ${response.status} — API 주소·호출 제한을 확인하세요.`,
            )
        }
        let payload
        try {
            payload = await response.json()
        } catch {
            throw new Error(`${endpoint}: JSON 응답을 읽지 못했습니다.`)
        }
        if (validate && !validate(payload)) {
            throw new Error(`${endpoint}: 응답 형식이 올바르지 않습니다. API 계약을 확인하세요.`)
        }
        return payload
    }

    return {
        readStatus: async (corpus) =>
            validateStatus(
                await request("/internal/v1/knowledge/status", {
                    authenticated: true,
                    timeoutMs: 30_000,
                }),
                corpus,
            ),
        sync: () =>
            request("/internal/v1/knowledge/sync", {
                method: "POST",
                authenticated: true,
                timeoutMs: 600_000,
            }),
        search: (body) =>
            request("/api/v1/knowledge/search", {
                method: "POST",
                body,
                timeoutMs: 120_000,
                validate: isSearchResponse,
            }),
        answer: (body) =>
            request("/api/v1/knowledge/answers", {
                method: "POST",
                body,
                authenticated: Boolean(key),
                timeoutMs: 120_000,
                validate: (payload) =>
                    isAnswerResponse(payload) && isSearchResults(payload.results),
            }),
    }
}

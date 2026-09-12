import {
    isAnswerResponse,
    isSearchResponse,
    isSearchResults,
} from "../src/api/knowledgeResponse.js"
import {
    ANSWER_TIMEOUT_MS,
    getRetryAfterSeconds,
    SEARCH_TIMEOUT_MS,
} from "../src/api/knowledgeRequestPolicy.js"

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
        const requestBody = body !== undefined ? JSON.stringify(body) : undefined
        const signal = AbortSignal.timeout(timeoutMs)
        const checkTimeout = () => {
            if (signal.aborted) {
                throw new Error(
                    `${endpoint}: ${timeoutMs / 1000}초 안에 응답을 받지 못했습니다. 서버 상태를 확인하세요.`,
                )
            }
        }
        // 관리 키와 질문을 리다이렉트 대상에 전달하지 않는다.
        let response
        try {
            response = await fetchImpl(`${base}${endpoint}`, {
                method,
                headers,
                ...(requestBody !== undefined ? { body: requestBody } : {}),
                redirect: "error",
                signal,
            })
        } catch {
            checkTimeout()
            throw new Error(
                `${endpoint}: API에 연결하지 못했습니다. 최종 API 주소·네트워크·TLS 설정을 확인하세요.`,
            )
        }
        checkTimeout()
        if (response.status !== 200) {
            const retryAfterSeconds = getRetryAfterSeconds(response)
            const retryHint =
                retryAfterSeconds > 0 ? ` ${retryAfterSeconds}초 후 다시 실행하세요.` : ""
            try {
                await response.body?.cancel()
            } catch {
                // 본문 정리 실패가 이미 받은 HTTP 오류와 대기 안내를 덮어쓰지 않게 한다.
            }
            if (response.status === 409 && endpoint === "/internal/v1/knowledge/sync") {
                throw new Error(
                    `${endpoint}: HTTP 409 — 동기화가 이미 실행 중입니다. 완료 후 자료 상태를 확인하세요.`,
                )
            }
            throw new Error(
                `${endpoint}: HTTP ${response.status} — API 주소·호출 제한을 확인하세요.${retryHint}`,
            )
        }
        let payload
        try {
            payload = await response.json()
        } catch (error) {
            checkTimeout()
            if (error instanceof SyntaxError) {
                throw new Error(`${endpoint}: JSON 응답을 읽지 못했습니다.`)
            }
            throw new Error(
                `${endpoint}: 응답 본문을 받지 못했습니다. 서버·네트워크 상태를 확인하세요.`,
            )
        }
        checkTimeout()
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
                timeoutMs: SEARCH_TIMEOUT_MS,
                validate: isSearchResponse,
            }),
        answer: (body) =>
            request("/api/v1/knowledge/answers", {
                method: "POST",
                body,
                authenticated: Boolean(key),
                timeoutMs: ANSWER_TIMEOUT_MS,
                validate: (payload) =>
                    isAnswerResponse(payload) && isSearchResults(payload.results),
            }),
    }
}

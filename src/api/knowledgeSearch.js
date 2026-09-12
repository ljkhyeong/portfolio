const API_BASE_URL = (import.meta.env.VITE_KNOWLEDGE_API_BASE_URL ?? "").replace(/\/$/, "")
const SEARCH_TIMEOUT_MS = 90_000
const ANSWER_TIMEOUT_MS = 180_000

export class KnowledgeApiError extends Error {
    constructor(message, { status = 0, code = "KNOWLEDGE_API_ERROR" } = {}) {
        super(message)
        this.name = "KnowledgeApiError"
        this.status = status
        this.code = code
    }
}

const postKnowledgeRequest = async (path, body, { signal, headers = {}, timeoutMs }) => {
    signal?.throwIfAborted()
    const controller = new AbortController()
    const cancelRequest = () => controller.abort(signal.reason)
    signal?.addEventListener("abort", cancelRequest, { once: true })
    const timeout = setTimeout(() => {
        controller.abort(
            new KnowledgeApiError("응답이 늦어 요청을 중단했습니다. 잠시 후 다시 시도해 주세요.", {
                code: "REQUEST_TIMEOUT",
            }),
        )
    }, timeoutMs)
    const checkCancellation = () => {
        signal?.throwIfAborted()
        controller.signal.throwIfAborted()
    }

    try {
        let response
        try {
            response = await fetch(`${API_BASE_URL}${path}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            })
        } catch (error) {
            checkCancellation()
            if (error.name === "AbortError") {
                throw error
            }

            throw new KnowledgeApiError("검색 서버에 연결할 수 없습니다.", {
                code: "NETWORK_ERROR",
            })
        }

        let payload
        try {
            payload = await response.json()
        } catch (error) {
            checkCancellation()
            if (error.name === "AbortError") {
                throw error
            }

            if (response.ok) {
                throw new KnowledgeApiError("서버 응답을 읽지 못했습니다. 다시 시도해 주세요.", {
                    status: response.status,
                    code: "INVALID_RESPONSE",
                })
            }

            payload = {}
        }

        checkCancellation()

        if (!response.ok) {
            throw new KnowledgeApiError(payload?.message || "요청을 처리하지 못했습니다.", {
                status: response.status,
                code: payload?.code,
            })
        }

        return payload
    } finally {
        clearTimeout(timeout)
        signal?.removeEventListener("abort", cancelRequest)
    }
}

const compactFilters = ({ projectId, serviceId, documentType }) => ({
    ...(projectId ? { projectIds: [projectId] } : {}),
    ...(serviceId ? { serviceIds: [serviceId] } : {}),
    ...(documentType ? { documentTypes: [documentType] } : {}),
})

export const searchPortfolioKnowledge = ({
    query,
    projectId,
    serviceId,
    documentType,
    limit = 10,
    signal,
}) =>
    postKnowledgeRequest(
        "/api/v1/knowledge/search",
        {
            query,
            ...compactFilters({ projectId, serviceId, documentType }),
            limit,
        },
        { signal, timeoutMs: SEARCH_TIMEOUT_MS },
    )

export const generatePortfolioAnswer = ({
    question,
    projectId,
    serviceId,
    documentType,
    limit = 6,
    turnstileToken,
    signal,
}) =>
    postKnowledgeRequest(
        "/api/v1/knowledge/answers",
        {
            question,
            ...compactFilters({ projectId, serviceId, documentType }),
            limit,
        },
        {
            signal,
            timeoutMs: ANSWER_TIMEOUT_MS,
            headers: turnstileToken ? { "X-Turnstile-Token": turnstileToken } : {},
        },
    )

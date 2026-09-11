const API_BASE_URL = (import.meta.env.VITE_KNOWLEDGE_API_BASE_URL ?? "").replace(/\/$/, "")

export class KnowledgeApiError extends Error {
    constructor(message, { status = 0, code = "KNOWLEDGE_API_ERROR" } = {}) {
        super(message)
        this.name = "KnowledgeApiError"
        this.status = status
        this.code = code
    }
}

const postKnowledgeRequest = async (path, body, { signal } = {}) => {
    let response

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal,
        })
    } catch (error) {
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

    signal?.throwIfAborted()

    if (!response.ok) {
        throw new KnowledgeApiError(payload.message || "요청을 처리하지 못했습니다.", {
            status: response.status,
            code: payload.code,
        })
    }

    return payload
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
        { signal },
    )

export const generatePortfolioAnswer = ({
    question,
    projectId,
    serviceId,
    documentType,
    limit = 6,
    signal,
}) =>
    postKnowledgeRequest(
        "/api/v1/knowledge/answers",
        {
            question,
            ...compactFilters({ projectId, serviceId, documentType }),
            limit,
        },
        { signal },
    )

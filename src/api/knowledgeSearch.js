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

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new KnowledgeApiError(payload.message || "요청을 처리하지 못했습니다.", {
            status: response.status,
            code: payload.code,
        })
    }

    return payload
}

const compactFilters = ({ projectId, documentType }) => ({
    ...(projectId ? { projectIds: [projectId] } : {}),
    ...(documentType ? { documentTypes: [documentType] } : {}),
})

export const searchPortfolioKnowledge = ({ query, projectId, documentType, limit = 10, signal }) =>
    postKnowledgeRequest(
        "/api/v1/knowledge/search",
        {
            query,
            ...compactFilters({ projectId, documentType }),
            limit,
        },
        { signal },
    )

export const generatePortfolioAnswer = ({ question, projectId, documentType, limit = 6, signal }) =>
    postKnowledgeRequest(
        "/api/v1/knowledge/answers",
        {
            question,
            ...compactFilters({ projectId, documentType }),
            limit,
        },
        { signal },
    )

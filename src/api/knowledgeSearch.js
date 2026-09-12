import { isAnswerResponse, isSearchResponse } from "./knowledgeResponse"
import {
    ANSWER_TIMEOUT_MS,
    getRetryAfterSeconds,
    SEARCH_TIMEOUT_MS,
} from "./knowledgeRequestPolicy"

const API_BASE_URL = (import.meta.env.VITE_KNOWLEDGE_API_BASE_URL ?? "").replace(/\/$/, "")

export class KnowledgeApiError extends Error {
    constructor(
        message,
        { status = 0, code = "KNOWLEDGE_API_ERROR", retryAfterSeconds = null } = {},
    ) {
        super(message)
        this.name = "KnowledgeApiError"
        this.status = status
        this.code = code
        this.retryAfterSeconds = retryAfterSeconds
    }
}

const postKnowledgeRequest = async (path, body, { signal, headers = {}, timeoutMs, validate }) => {
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
                redirect: "error",
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
            throw new KnowledgeApiError(
                typeof payload?.message === "string" && payload.message.trim()
                    ? payload.message
                    : "요청을 처리하지 못했습니다.",
                {
                    status: response.status,
                    retryAfterSeconds: getRetryAfterSeconds(response),
                    code:
                        typeof payload?.code === "string" && payload.code.trim()
                            ? payload.code
                            : undefined,
                },
            )
        }

        if (response.status !== 200 || !validate(payload)) {
            throw new KnowledgeApiError("서버 응답 형식이 올바르지 않습니다. 다시 시도해 주세요.", {
                status: response.status,
                code: "INVALID_RESPONSE",
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
        { signal, timeoutMs: SEARCH_TIMEOUT_MS, validate: isSearchResponse },
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
            validate: isAnswerResponse,
            headers: turnstileToken ? { "X-Turnstile-Token": turnstileToken } : {},
        },
    )

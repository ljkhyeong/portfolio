import { useEffect, useRef, useState } from "react"
import {
    generatePortfolioAnswer,
    knowledgeApiConfigured,
    searchPortfolioKnowledge,
} from "../../api/knowledgeSearch"
import { searchLocalKnowledge } from "../../api/localKnowledgeSearch"

// source가 "local"이면 검색 API 대신 브라우저에서 공개 자료를 검색한 결과다. 이때는 AI 답변을 만들지 않는다.
const emptySearch = { state: "idle", results: [], total: 0, errorMessage: "", source: "api" }
const emptyAnswer = { state: "idle", answer: "", citations: [], errorMessage: "" }

const getRequestErrorMessage = (error, action) => {
    const retryHint =
        Number.isSafeInteger(error.retryAfterSeconds) && error.retryAfterSeconds > 0
            ? `${error.retryAfterSeconds}초 후 다시 시도해 주세요.`
            : "잠시 후 다시 시도해 주세요."
    if (error.status === 429) {
        return `${action} 요청이 많습니다. ${retryHint}`
    }

    if (error.status === 503 && error.code === "HUMAN_VERIFICATION_UNAVAILABLE") {
        return `자동 요청 방지 확인을 사용할 수 없습니다. ${retryHint}`
    }

    if (error.status === 503 || error.code === "NETWORK_ERROR") {
        return `현재 ${action} 서버에 연결할 수 없습니다. ${retryHint}`
    }

    return error.message || `${action} 요청을 처리하지 못했습니다.`
}

// 검색 서버에 닿지 못했거나 서버 쪽 오류일 때만 브라우저 검색으로 바꾼다.
// 요청 제한(429)과 잘못된 요청(400)은 서버가 답한 결과이므로 그대로 안내한다.
const canSearchLocally = (error) =>
    ["NETWORK_ERROR", "REQUEST_TIMEOUT", "INVALID_RESPONSE"].includes(error?.code) ||
    error?.status === 404 ||
    error?.status >= 500

// 검색 API 주소가 없거나, API가 없거나(404) 연결되지 않으면 같은 화면에서는 다시 부르지 않는다.
// 다시 시도하면 주소 설정 여부로 초기화한다.
const isApiMissing = (error) => error?.code === "NETWORK_ERROR" || error?.status === 404

const usePortfolioKnowledge = ({ query, projectId, serviceId, documentType }) => {
    const [search, setSearch] = useState(emptySearch)
    const [answer, setAnswer] = useState(emptyAnswer)
    const [retryCount, setRetryCount] = useState(0)
    const activeAnswer = useRef(null)
    const apiMissing = useRef(!knowledgeApiConfigured)

    useEffect(() => {
        const controller = new AbortController()
        setAnswer(emptyAnswer)
        setSearch({ ...emptySearch, state: query ? "loading" : "idle" })

        const runSearch = async () => {
            const request = { query, projectId, serviceId, documentType, signal: controller.signal }
            let apiError = null
            if (!apiMissing.current) {
                try {
                    return { response: await searchPortfolioKnowledge(request), source: "api" }
                } catch (error) {
                    if (controller.signal.aborted || !canSearchLocally(error)) throw error
                    apiError = error
                }
            }
            try {
                const response = await searchLocalKnowledge(request)
                if (isApiMissing(apiError)) apiMissing.current = true
                return { response, source: "local" }
            } catch (localError) {
                throw apiError ?? localError
            }
        }

        if (query) {
            runSearch()
                .then(({ response, source }) => {
                    if (!controller.signal.aborted) {
                        setSearch({
                            state: "success",
                            results: response.results || [],
                            total: response.total ?? response.results?.length ?? 0,
                            errorMessage: "",
                            source,
                        })
                    }
                })
                .catch((error) => {
                    if (!controller.signal.aborted) {
                        setSearch({
                            ...emptySearch,
                            state: "error",
                            errorMessage: getRequestErrorMessage(error, "검색"),
                        })
                    }
                })
        }

        return () => {
            controller.abort()
            activeAnswer.current?.abort()
        }
    }, [query, projectId, serviceId, documentType, retryCount])

    const generateAnswer = async (turnstileToken) => {
        if (
            search.state !== "success" ||
            search.results.length === 0 ||
            search.source === "local"
        ) {
            return
        }

        activeAnswer.current?.abort()
        const controller = new AbortController()
        activeAnswer.current = controller
        setAnswer({ ...emptyAnswer, state: "loading" })

        try {
            const response = await generatePortfolioAnswer({
                question: query,
                projectId,
                serviceId,
                documentType,
                turnstileToken,
                signal: controller.signal,
            })

            if (controller.signal.aborted) {
                return
            }

            if (response.status === "GENERATED" && response.answer) {
                setAnswer({
                    state: "generated",
                    answer: response.answer,
                    citations: response.citations || [],
                    errorMessage: "",
                })
            } else if (response.status === "INSUFFICIENT_EVIDENCE") {
                setAnswer({ ...emptyAnswer, state: "insufficient" })
            } else {
                setAnswer({
                    ...emptyAnswer,
                    state: "unavailable",
                    errorMessage: "현재 답변 생성 서비스를 사용할 수 없습니다.",
                })
            }
        } catch (error) {
            if (!controller.signal.aborted) {
                setAnswer({
                    ...emptyAnswer,
                    state: "unavailable",
                    errorMessage: getRequestErrorMessage(error, "AI 답변"),
                })
            }
        }
    }

    return {
        search,
        answer,
        generateAnswer,
        retrySearch: () => {
            apiMissing.current = !knowledgeApiConfigured
            setRetryCount((count) => count + 1)
        },
    }
}

export default usePortfolioKnowledge

import { useEffect, useRef, useState } from "react"
import { generatePortfolioAnswer, searchPortfolioKnowledge } from "../../api/knowledgeSearch"

const emptySearch = { state: "idle", results: [], total: 0, errorMessage: "" }
const emptyAnswer = { state: "idle", answer: "", citations: [], errorMessage: "" }

const getRequestErrorMessage = (error, action) => {
    if (error.status === 429) {
        return `${action} 요청이 많습니다. 잠시 후 다시 시도해 주세요.`
    }

    if (error.status === 503 || error.code === "NETWORK_ERROR") {
        return `현재 ${action} 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.`
    }

    return error.message || `${action} 요청을 처리하지 못했습니다.`
}

const usePortfolioKnowledge = ({ query, projectId, serviceId, documentType }) => {
    const [search, setSearch] = useState(emptySearch)
    const [answer, setAnswer] = useState(emptyAnswer)
    const [retryCount, setRetryCount] = useState(0)
    const activeAnswer = useRef(null)

    useEffect(() => {
        const controller = new AbortController()
        setAnswer(emptyAnswer)
        setSearch({ ...emptySearch, state: query ? "loading" : "idle" })

        if (query) {
            searchPortfolioKnowledge({
                query,
                projectId,
                serviceId,
                documentType,
                signal: controller.signal,
            })
                .then((response) => {
                    if (!controller.signal.aborted) {
                        setSearch({
                            state: "success",
                            results: response.results || [],
                            total: response.total ?? response.results?.length ?? 0,
                            errorMessage: "",
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
        if (search.state !== "success" || search.results.length === 0) {
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
        retrySearch: () => setRetryCount((count) => count + 1),
    }
}

export default usePortfolioKnowledge

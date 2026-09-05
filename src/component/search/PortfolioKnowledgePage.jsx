import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { generatePortfolioAnswer, searchPortfolioKnowledge } from "../../api/knowledgeSearch"
import { portfolioProfile } from "../../data/profile"
import { projectSummaries } from "../../data/projectSummaries"
import { assetPath } from "../../utils/assetPath"
import "../../css/PortfolioKnowledge.css"

const suggestionQuestions = [
    "결제와 환불 중복 처리를 어떻게 막았나요?",
    "BATON Core와 6개 서비스는 각각 무엇을 담당하나요?",
    "폐쇄망에서 배치 중단 원인을 어떻게 찾았나요?",
    "서버 중단 뒤 미전송 알림을 어떻게 재처리했나요?",
]

const documentTypes = [
    ["project_overview", "프로젝트 개요"],
    ["service_overview", "서비스 개요"],
    ["architecture_decision", "구현 방법과 선택 이유"],
    ["problem_solution", "문제와 해결 방법"],
    ["implementation_evidence", "구현 내용과 테스트 결과"],
    ["representative_document", "대표 문서"],
]

const documentTypeLabels = Object.fromEntries(documentTypes)

const getPrimaryLabel = (item) => item.title || item.heading

const getSecondaryLabel = (item) => {
    const documentTypeLabel = documentTypeLabels[item.documentType]

    return item.heading && item.heading !== item.title && item.heading !== documentTypeLabel
        ? item.heading
        : null
}

const getRequestErrorMessage = (error, action) => {
    if (error.status === 429) {
        return `${action} 요청이 많습니다. 잠시 후 다시 시도해 주세요.`
    }

    if (error.status === 503 || error.code === "NETWORK_ERROR") {
        return `현재 ${action} 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.`
    }

    return error.message || `${action} 요청을 처리하지 못했습니다.`
}

const SourceLink = ({ item, children, className }) => {
    const href = item.sourceUrl || item.route

    if (!href) {
        return null
    }

    if (href.startsWith("/")) {
        return (
            <Link className={className} to={href}>
                {children}
            </Link>
        )
    }

    return (
        <a className={className} href={href} target="_blank" rel="noreferrer">
            {children}
            <span className="sr-only">새 창에서 보기</span>
        </a>
    )
}

const KnowledgeHeader = () => (
    <header className="knowledge-header">
        <nav className="knowledge-nav" aria-label="포트폴리오 검색 메뉴">
            <Link className="knowledge-nav__brand" to="/" aria-label="ljkhyeong 포트폴리오 홈">
                <span className="knowledge-nav__avatar" aria-hidden="true">
                    <img src={assetPath("ljkhyeong-avatar.png")} alt="" width="80" height="80" />
                </span>
                <strong>ljkhyeong</strong>
            </Link>
            <div className="knowledge-nav__links">
                <a href="/#work">프로젝트</a>
                <Link to="/search" aria-current="page">
                    문서 검색
                </Link>
            </div>
            <a className="knowledge-nav__contact" href={`mailto:${portfolioProfile.email}`}>
                이메일 보내기 <span aria-hidden="true">↗</span>
            </a>
        </nav>
    </header>
)

const KnowledgeFilters = ({ projectId, documentType, onProjectChange, onTypeChange }) => (
    <fieldset className="knowledge-filters">
        <legend className="sr-only">검색 범위</legend>
        <label>
            <span>프로젝트</span>
            <select value={projectId} onChange={(event) => onProjectChange(event.target.value)}>
                <option value="">전체 프로젝트</option>
                {projectSummaries.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.title}
                    </option>
                ))}
            </select>
        </label>
        <label>
            <span>문서 종류</span>
            <select value={documentType} onChange={(event) => onTypeChange(event.target.value)}>
                <option value="">전체 문서</option>
                {documentTypes.map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </label>
    </fieldset>
)

const SearchResults = ({ state, total, results, query, errorMessage }) => {
    if (state === "idle") {
        return (
            <div className="knowledge-state knowledge-state--idle">
                <span aria-hidden="true">⌕</span>
                <h2>검색 결과</h2>
                <p>질문을 입력하거나 추천 질문을 선택하세요.</p>
            </div>
        )
    }

    if (state === "loading") {
        return (
            <div className="knowledge-state" role="status" aria-live="polite">
                <span className="knowledge-state__spinner" aria-hidden="true" />
                <h2>공개 자료를 검색하고 있습니다.</h2>
            </div>
        )
    }

    if (state === "error") {
        return (
            <div className="knowledge-state knowledge-state--error" role="alert">
                <span aria-hidden="true">!</span>
                <h2>검색 결과를 불러오지 못했습니다.</h2>
                <p>{errorMessage}</p>
            </div>
        )
    }

    if (results.length === 0) {
        return (
            <div className="knowledge-state">
                <span aria-hidden="true">0</span>
                <h2>일치하는 공개 자료가 없습니다.</h2>
                <p>프로젝트나 문서 종류를 전체로 바꾸거나, 더 짧은 검색어를 사용해 보세요.</p>
            </div>
        )
    }

    return (
        <section className="knowledge-results" aria-labelledby="knowledge-results-title">
            <div className="knowledge-results__heading">
                <h2 id="knowledge-results-title">“{query}” 검색 결과</h2>
                <strong>{total}건</strong>
            </div>
            <ol>
                {results.map((result, index) => (
                    <li key={result.chunkId || `${result.title}-${index}`}>
                        <article className="knowledge-result">
                            <div className="knowledge-result__meta">
                                <span>{result.projectName || result.projectId}</span>
                                {result.serviceId && <span>{result.serviceId.toUpperCase()}</span>}
                                <span>
                                    {documentTypeLabels[result.documentType] || result.documentType}
                                </span>
                            </div>
                            <h3>{getPrimaryLabel(result)}</h3>
                            {getSecondaryLabel(result) && (
                                <p className="knowledge-result__document">
                                    {getSecondaryLabel(result)}
                                </p>
                            )}
                            <p className="knowledge-result__snippet">{result.snippet}</p>
                            <SourceLink item={result} className="knowledge-result__link">
                                원문 확인 <span aria-hidden="true">↗</span>
                            </SourceLink>
                        </article>
                    </li>
                ))}
            </ol>
        </section>
    )
}

const AnswerPanel = ({ state, answer, citations, errorMessage, onGenerate, canGenerate }) => (
    <aside className="knowledge-answer" aria-labelledby="knowledge-answer-title">
        <div className="knowledge-answer__heading">
            <h2 id="knowledge-answer-title">공개 문서 기반 답변</h2>
            <span className="knowledge-answer__count">출처 {citations.length}</span>
        </div>

        {state === "idle" && (
            <div className="knowledge-answer__empty">
                <p>문서를 검색한 뒤 답변을 생성할 수 있습니다.</p>
            </div>
        )}

        {state === "loading" && (
            <div className="knowledge-answer__status" role="status" aria-live="polite">
                <span className="knowledge-answer__cursor" aria-hidden="true" />
                검색 결과에 있는 공개 문서로 답변을 작성하고 있습니다.
            </div>
        )}

        {state === "insufficient" && (
            <div className="knowledge-answer__notice" role="status">
                <strong>질문과 관련된 공개 문서가 충분하지 않습니다.</strong>
                <p>검색 결과를 직접 확인하거나 질문 범위를 좁혀 보세요.</p>
            </div>
        )}

        {state === "unavailable" && (
            <div className="knowledge-answer__notice knowledge-answer__notice--error" role="alert">
                <strong>AI 답변을 만들지 못했습니다.</strong>
                <p>{errorMessage} 검색 결과와 문서 링크는 계속 확인할 수 있습니다.</p>
            </div>
        )}

        {state === "generated" && (
            <div className="knowledge-answer__content" aria-live="polite">
                <p>{answer}</p>
                <section aria-labelledby="knowledge-citations-title">
                    <h3 id="knowledge-citations-title">답변에 사용한 문서</h3>
                    <ol>
                        {citations.map((citation, index) => (
                            <li key={citation.chunkId || `${citation.title}-${index}`}>
                                <SourceLink item={citation} className="knowledge-answer__citation">
                                    <span aria-hidden="true">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span>
                                        <strong>{getPrimaryLabel(citation)}</strong>
                                        {getSecondaryLabel(citation) && (
                                            <small>{getSecondaryLabel(citation)}</small>
                                        )}
                                    </span>
                                    <span aria-hidden="true">↗</span>
                                </SourceLink>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        )}

        <button
            className="knowledge-answer__button"
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate || state === "loading"}
        >
            {state === "loading" ? "답변 생성 중" : "검색 결과로 답변 생성"}
            <span aria-hidden="true">→</span>
        </button>
        <p className="knowledge-answer__policy">공개 문서로만 답하고 출처를 표시합니다.</p>
    </aside>
)

const PortfolioKnowledgePage = () => {
    const [query, setQuery] = useState("")
    const [projectId, setProjectId] = useState("")
    const [documentType, setDocumentType] = useState("")
    const [searchState, setSearchState] = useState("idle")
    const [searchedQuery, setSearchedQuery] = useState("")
    const [results, setResults] = useState([])
    const [total, setTotal] = useState(0)
    const [searchError, setSearchError] = useState("")
    const [answerState, setAnswerState] = useState("idle")
    const [answer, setAnswer] = useState("")
    const [citations, setCitations] = useState([])
    const [answerError, setAnswerError] = useState("")
    const activeSearch = useRef(null)
    const activeAnswer = useRef(null)

    useEffect(
        () => () => {
            activeSearch.current?.abort()
            activeAnswer.current?.abort()
        },
        [],
    )

    const resetAnswer = () => {
        activeAnswer.current?.abort()
        setAnswerState("idle")
        setAnswer("")
        setCitations([])
        setAnswerError("")
    }

    const resetSearchResult = () => {
        activeSearch.current?.abort()
        setSearchState("idle")
        setSearchedQuery("")
        setResults([])
        setTotal(0)
        setSearchError("")
        resetAnswer()
    }

    const handleProjectChange = (value) => {
        setProjectId(value)

        if (searchState !== "idle") {
            resetSearchResult()
        }
    }

    const handleDocumentTypeChange = (value) => {
        setDocumentType(value)

        if (searchState !== "idle") {
            resetSearchResult()
        }
    }

    const runSearch = async (searchQuery) => {
        const normalizedQuery = searchQuery.trim()

        if (!normalizedQuery) {
            return
        }

        activeSearch.current?.abort()
        const controller = new AbortController()
        activeSearch.current = controller
        setQuery(normalizedQuery)
        setSearchedQuery(normalizedQuery)
        setSearchState("loading")
        setSearchError("")
        resetAnswer()

        try {
            const response = await searchPortfolioKnowledge({
                query: normalizedQuery,
                projectId,
                documentType,
                signal: controller.signal,
            })
            setResults(response.results || [])
            setTotal(response.total ?? response.results?.length ?? 0)
            setSearchState("success")
        } catch (error) {
            if (error.name === "AbortError") {
                return
            }

            setResults([])
            setTotal(0)
            setSearchError(getRequestErrorMessage(error, "검색"))
            setSearchState("error")
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        runSearch(query)
    }

    const handleGenerateAnswer = async () => {
        if (!searchedQuery || results.length === 0) {
            return
        }

        activeAnswer.current?.abort()
        const controller = new AbortController()
        activeAnswer.current = controller
        setAnswerState("loading")
        setAnswerError("")
        setCitations([])

        try {
            const response = await generatePortfolioAnswer({
                question: searchedQuery,
                projectId,
                documentType,
                signal: controller.signal,
            })

            setCitations(response.citations || [])

            if (response.status === "GENERATED" && response.answer) {
                setAnswer(response.answer)
                setAnswerState("generated")
                return
            }

            if (response.status === "INSUFFICIENT_EVIDENCE") {
                setAnswerState("insufficient")
                return
            }

            setAnswerError("현재 답변 생성 서비스를 사용할 수 없습니다.")
            setAnswerState("unavailable")
        } catch (error) {
            if (error.name === "AbortError") {
                return
            }

            setAnswerError(getRequestErrorMessage(error, "AI 답변"))
            setAnswerState("unavailable")
        }
    }

    return (
        <div className="knowledge-page">
            <a className="skip-link" href="#knowledge-main">
                본문으로 건너뛰기
            </a>
            <KnowledgeHeader />
            <main id="knowledge-main" tabIndex="-1">
                <section className="knowledge-hero" aria-labelledby="knowledge-title">
                    <div className="knowledge-hero__copy">
                        <h1 id="knowledge-title" data-route-heading="/search">
                            백엔드 문제 해결 방법과 테스트 결과를 검색합니다.
                        </h1>
                        <p>
                            KICS 요청 변환과 제출 자료의 KICS 반영, 결제 orderId와 환불 UUID 재사용,
                            서버 중단 뒤 DB 알림 작업 처리를 공개 문서에서 확인할 수 있습니다.
                        </p>
                    </div>
                    <ul className="knowledge-hero__rules" aria-label="검색 및 답변 원칙">
                        <li>
                            <span aria-hidden="true">01</span>
                            공개 자료만 검색
                        </li>
                        <li>
                            <span aria-hidden="true">02</span>
                            답변마다 출처 표시
                        </li>
                        <li>
                            <span aria-hidden="true">03</span>
                            관련 문서가 부족하면 답변하지 않음
                        </li>
                    </ul>
                </section>

                <section className="knowledge-query" aria-labelledby="knowledge-query-title">
                    <h2 id="knowledge-query-title" className="sr-only">
                        포트폴리오 문서 검색
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="knowledge-query-input">
                            확인하고 싶은 내용을 입력하세요.
                        </label>
                        <div className="knowledge-query__input-row">
                            <span aria-hidden="true">⌕</span>
                            <input
                                id="knowledge-query-input"
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="예: 결제 승인 응답이 누락되면 어떻게 처리했나요?"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={!query.trim() || searchState === "loading"}
                            >
                                {searchState === "loading" ? "검색 중" : "문서 검색"}
                            </button>
                        </div>
                    </form>

                    <div className="knowledge-query__controls">
                        <div className="knowledge-suggestions" aria-label="추천 질문">
                            <span>추천 질문</span>
                            <div>
                                {suggestionQuestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => runSearch(suggestion)}
                                        disabled={searchState === "loading"}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <KnowledgeFilters
                            projectId={projectId}
                            documentType={documentType}
                            onProjectChange={handleProjectChange}
                            onTypeChange={handleDocumentTypeChange}
                        />
                    </div>
                </section>

                <div className="knowledge-workspace" aria-busy={searchState === "loading"}>
                    <SearchResults
                        state={searchState}
                        total={total}
                        results={results}
                        query={searchedQuery}
                        errorMessage={searchError}
                    />
                    <AnswerPanel
                        state={answerState}
                        answer={answer}
                        citations={citations}
                        errorMessage={answerError}
                        onGenerate={handleGenerateAnswer}
                        canGenerate={searchState === "success" && results.length > 0}
                    />
                </div>
            </main>
            <footer className="knowledge-footer">
                <span>{portfolioProfile.name} · 포트폴리오 문서 검색</span>
                <Link to="/">포트폴리오로 돌아가기 →</Link>
            </footer>
        </div>
    )
}

export default PortfolioKnowledgePage

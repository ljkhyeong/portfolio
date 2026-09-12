import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { portfolioProfile } from "../../data/profile"
import { projectSummaries, projectSummariesById } from "../../data/projectSummaries"
import { siteUrl } from "../../data/routeMeta"
import PortfolioNavigation from "../PortfolioNavigation"
import TurnstileWidget, { turnstileSiteKey } from "./TurnstileWidget"
import usePortfolioKnowledge from "./usePortfolioKnowledge"
import "../../css/PortfolioKnowledge.css"

const defaultSuggestionQuestions = [
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
const batonServices = [
    { id: "core", name: "Core" },
    ...projectSummariesById.baton.serviceLinks.map(({ id, name }) => ({ id, name })),
]

const getSuggestionSet = (projectId, serviceId) => {
    if (!projectId) {
        return { label: "추천 질문", questions: defaultSuggestionQuestions }
    }

    const project = projectSummariesById[projectId]
    const service =
        projectId === "baton" && serviceId
            ? batonServices.find((candidate) => candidate.id === serviceId)
            : null
    const scopeLabel = service ? `BATON ${service.name}` : project.title

    return {
        label: `${scopeLabel} 추천 질문`,
        questions: [
            `${scopeLabel} 주요 기능과 담당 범위는 무엇인가요?`,
            `${scopeLabel} 문제 해결 방법을 알려주세요.`,
            `${scopeLabel} 테스트 결과와 미검증 범위는 무엇인가요?`,
        ],
    }
}

const getPrimaryLabel = (item) => item.title || item.heading

const getSecondaryLabel = (item) => {
    const documentTypeLabel = documentTypeLabels[item.documentType]

    return item.heading && item.heading !== item.title && item.heading !== documentTypeLabel
        ? item.heading
        : null
}

const siteOrigin = new URL(siteUrl).origin
const normalizePathname = (pathname) => pathname.replace(/\/$/, "") || "/"

const getSourceDestination = (item) => {
    if (!item.sourceUrl) {
        return item.route ? { href: item.route, kind: "route" } : { href: null, kind: "missing" }
    }

    let source
    try {
        source = new URL(item.sourceUrl, siteUrl)
    } catch {
        return { href: item.sourceUrl, kind: "external" }
    }

    if (source.origin !== siteOrigin) {
        return { href: source.toString(), kind: "external" }
    }

    const relativeSource = `${source.pathname}${source.search}${source.hash}`
    const routePathname = item.route
        ? normalizePathname(new URL(item.route, siteUrl).pathname)
        : null

    return routePathname === normalizePathname(source.pathname)
        ? { href: `${item.route}${source.search}${source.hash}`, kind: "route" }
        : { href: relativeSource, kind: "asset" }
}

const SourceLink = ({ item, children, className }) => {
    const { href, kind } = getSourceDestination(item)

    if (!href) {
        return null
    }

    if (kind === "route") {
        return (
            <Link className={className} to={href}>
                {children}
                <span aria-hidden="true">→</span>
            </Link>
        )
    }

    if (kind === "asset") {
        return (
            <a className={className} href={href}>
                {children}
                <span aria-hidden="true">→</span>
            </a>
        )
    }

    return (
        <a className={className} href={href} target="_blank" rel="noreferrer">
            {children}
            <span aria-hidden="true">↗</span>
            <span className="sr-only">새 창에서 보기</span>
        </a>
    )
}

const KnowledgeHeader = () => (
    <header>
        <PortfolioNavigation
            label="포트폴리오 검색 메뉴"
            links={
                <>
                    <Link to="/#work">프로젝트</Link>
                    <Link to="/search" aria-current="page">
                        문서 검색
                    </Link>
                </>
            }
            actions={
                <a className="site-nav__contact" href={`mailto:${portfolioProfile.email}`}>
                    이메일 보내기
                </a>
            }
        />
    </header>
)

const KnowledgeFilters = ({
    projectId,
    serviceId,
    documentType,
    onProjectChange,
    onServiceChange,
    onTypeChange,
    onReset,
}) => (
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
        {projectId === "baton" ? (
            <label>
                <span>BATON 서비스</span>
                <select value={serviceId} onChange={(event) => onServiceChange(event.target.value)}>
                    <option value="">전체 서비스</option>
                    {batonServices.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>
            </label>
        ) : null}
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
        {projectId || serviceId || documentType ? (
            <button className="knowledge-filters__reset" type="button" onClick={onReset}>
                범위 초기화
            </button>
        ) : null}
    </fieldset>
)

const SearchResults = ({ state, total, results, query, errorMessage, onRetry }) => {
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
                <button className="knowledge-state__action" type="button" onClick={onRetry}>
                    검색 다시 시도
                </button>
            </div>
        )
    }

    if (results.length === 0) {
        return (
            <div className="knowledge-state">
                <span aria-hidden="true">0</span>
                <h2>일치하는 공개 자료가 없습니다.</h2>
                <p>검색 범위를 초기화하거나 더 짧은 검색어를 사용해 보세요.</p>
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
                                원문 확인
                            </SourceLink>
                        </article>
                    </li>
                ))}
            </ol>
        </section>
    )
}

const AnswerContent = ({ answer, citations }) => {
    const evidenceDetails = useRef([])
    const showEvidence = (index) => {
        const details = evidenceDetails.current[index]
        if (!details) return
        details.open = true
        details.querySelector("summary")?.focus()
        details.scrollIntoView?.({ block: "nearest", behavior: "smooth" })
    }
    return (
        <div className="knowledge-answer__content" aria-live="polite">
            <p>
                {answer.split(/(\[\d+\])/g).map((part, index) => {
                    const match = part.match(/^\[(\d+)\]$/)
                    const number = match ? Number(match[1]) : 0
                    return number > 0 && number <= citations.length ? (
                        <button
                            key={index}
                            type="button"
                            className="knowledge-answer__reference"
                            aria-label={`근거 ${number} 보기`}
                            onClick={() => showEvidence(number - 1)}
                        >
                            {part}
                        </button>
                    ) : (
                        part
                    )
                })}
            </p>
            <section aria-labelledby="knowledge-citations-title">
                <h3 id="knowledge-citations-title">답변에 사용한 문서</h3>
                <ol>
                    {citations.map((citation, index) => (
                        <li key={citation.chunkId || `${citation.title}-${index}`}>
                            <SourceLink item={citation} className="knowledge-answer__citation">
                                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                                <span>
                                    <strong>{getPrimaryLabel(citation)}</strong>
                                    {getSecondaryLabel(citation) && (
                                        <small>{getSecondaryLabel(citation)}</small>
                                    )}
                                </span>
                            </SourceLink>
                            <details
                                className="knowledge-answer__evidence"
                                ref={(element) => {
                                    evidenceDetails.current[index] = element
                                }}
                            >
                                <summary>근거 {index + 1} 전체 문단</summary>
                                <blockquote>
                                    {citation.excerpt ||
                                        "근거 문단이 없습니다. 원문 링크에서 확인하세요."}
                                </blockquote>
                            </details>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    )
}

const AnswerPanel = ({
    state,
    answer,
    citations,
    errorMessage,
    onGenerate,
    canGenerate,
    verificationEnabled,
    verificationResetKey,
    onVerificationTokenChange,
}) => (
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

        {state === "generated" && <AnswerContent answer={answer} citations={citations} />}

        {verificationEnabled && (
            <TurnstileWidget
                resetKey={verificationResetKey}
                onTokenChange={onVerificationTokenChange}
            />
        )}

        <button
            className="knowledge-answer__button"
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate || state === "loading"}
        >
            {state === "loading"
                ? "답변 생성 중"
                : state === "unavailable"
                  ? "답변 다시 시도"
                  : "검색 결과로 답변 생성"}
            <span aria-hidden="true">→</span>
        </button>
        <p className="knowledge-answer__policy">
            공개 문서로만 답하고 출처를 표시합니다.
            {verificationEnabled ? " 답변 요청은 자동 호출 여부를 확인합니다." : ""}
        </p>
    </aside>
)

const PortfolioKnowledgePage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const searchedQuery = (searchParams.get("q") ?? "").trim()
    const projectId =
        projectSummaries.find((project) => project.id === searchParams.get("project"))?.id ?? ""
    const serviceId =
        projectId === "baton" &&
        batonServices.some((service) => service.id === searchParams.get("service"))
            ? searchParams.get("service")
            : ""
    const documentType =
        documentTypes.find(([type]) => type === searchParams.get("type"))?.[0] ?? ""
    const [query, setQuery] = useState(searchedQuery)
    const verificationEnabled = Boolean(turnstileSiteKey)
    const [verificationToken, setVerificationToken] = useState("")
    const [verificationResetKey, setVerificationResetKey] = useState(0)
    const suggestions = getSuggestionSet(projectId, serviceId)
    const { search, answer, generateAnswer, retrySearch } = usePortfolioKnowledge({
        query: searchedQuery,
        projectId,
        serviceId,
        documentType,
    })
    const hasAnswerContext = search.state === "success" && search.results.length > 0

    useEffect(() => setQuery(searchedQuery), [searchedQuery, searchParams])
    useEffect(() => {
        if (!hasAnswerContext) setVerificationToken("")
    }, [hasAnswerContext])

    const runSearch = (searchQuery, filters = { projectId, serviceId, documentType }) => {
        const normalizedQuery = searchQuery.trim()
        const nextParams = new URLSearchParams()
        if (normalizedQuery) nextParams.set("q", normalizedQuery)
        if (filters.projectId) nextParams.set("project", filters.projectId)
        if (filters.serviceId) nextParams.set("service", filters.serviceId)
        if (filters.documentType) nextParams.set("type", filters.documentType)
        setQuery(normalizedQuery)

        if (
            normalizedQuery === searchedQuery &&
            filters.projectId === projectId &&
            filters.serviceId === serviceId &&
            filters.documentType === documentType
        ) {
            if (normalizedQuery) retrySearch()
            return
        }

        setSearchParams(nextParams)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        runSearch(query)
    }

    const handleGenerateAnswer = async () => {
        if (verificationEnabled && !verificationToken) return
        try {
            await generateAnswer(verificationToken)
        } finally {
            if (verificationEnabled) {
                setVerificationResetKey((key) => key + 1)
            }
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
                            기관 연계, 결제 중복 방지, 서버 중단 후 재처리 경험을 공개 문서에서
                            검색할 수 있습니다.
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
                                placeholder={
                                    projectId
                                        ? `예: ${suggestions.questions[0]}`
                                        : "예: 결제 승인 응답이 누락되면 어떻게 처리했나요?"
                                }
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={!query.trim() || search.state === "loading"}
                            >
                                {search.state === "loading" ? "검색 중" : "문서 검색"}
                            </button>
                        </div>
                    </form>

                    <div className="knowledge-query__controls">
                        <div className="knowledge-suggestions" aria-label={suggestions.label}>
                            <span>{suggestions.label}</span>
                            <div>
                                {suggestions.questions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => runSearch(suggestion)}
                                        disabled={search.state === "loading"}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <KnowledgeFilters
                            projectId={projectId}
                            serviceId={serviceId}
                            documentType={documentType}
                            onProjectChange={(value) =>
                                runSearch(query, {
                                    projectId: value,
                                    serviceId: value === "baton" ? serviceId : "",
                                    documentType,
                                })
                            }
                            onServiceChange={(value) =>
                                runSearch(query, { projectId, serviceId: value, documentType })
                            }
                            onTypeChange={(value) =>
                                runSearch(query, { projectId, serviceId, documentType: value })
                            }
                            onReset={() =>
                                runSearch(query, {
                                    projectId: "",
                                    serviceId: "",
                                    documentType: "",
                                })
                            }
                        />
                    </div>
                </section>

                <div className="knowledge-workspace" aria-busy={search.state === "loading"}>
                    <SearchResults {...search} query={searchedQuery} onRetry={retrySearch} />
                    <AnswerPanel
                        {...answer}
                        onGenerate={handleGenerateAnswer}
                        canGenerate={
                            hasAnswerContext && (!verificationEnabled || Boolean(verificationToken))
                        }
                        verificationEnabled={verificationEnabled && hasAnswerContext}
                        verificationResetKey={verificationResetKey}
                        onVerificationTokenChange={setVerificationToken}
                    />
                </div>
            </main>
            <footer className="knowledge-footer">
                <span>{portfolioProfile.name} / 포트폴리오 문서 검색</span>
                <Link to="/">포트폴리오로 돌아가기 →</Link>
            </footer>
        </div>
    )
}

export default PortfolioKnowledgePage

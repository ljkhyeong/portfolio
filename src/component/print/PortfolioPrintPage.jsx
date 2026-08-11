import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import {
    careers,
    education,
    personalActivities,
    portfolioProfile,
    printSkillGroups,
    workPrinciples,
} from "../../data/profile"
import { projectsById } from "../../data/projects"
import { assetPath } from "../../utils/assetPath"
import PrintPage from "./PrintPage"
import PrintProjectEvidence from "./PrintProjectEvidence"
import "../../css/PortfolioPrint.css"

const toPublishedUrl = (href) => {
    if (/^https?:\/\//.test(href)) {
        return href
    }

    return `${portfolioProfile.site}${href.startsWith("/") ? href : `/${href}`}`
}

const takeSentences = (text, count = 1) => {
    const sentences = text.match(/[^.]+\.?/g) ?? [text]

    return sentences.slice(0, count).join(" ").trim()
}

const PrintTitle = ({ eyebrow, title, children, project = false }) => (
    <div className={`print-title${project ? " print-title--project" : ""}`}>
        {project ? (
            <>
                <div>
                    <p className="print-eyebrow">{eyebrow}</p>
                    <h2>{title}</h2>
                </div>
                <p>{children}</p>
            </>
        ) : (
            <>
                <p className="print-eyebrow">{eyebrow}</p>
                <h2>{title}</h2>
                {children ? <p>{children}</p> : null}
            </>
        )}
    </div>
)

const PrintGallery = ({ project, dark = false }) => (
    <div
        className={`print-screen-gallery print-screen-gallery--${project.id}${
            dark ? " print-screen-gallery--dark" : ""
        }`}
        aria-label={`${project.title} 대표 화면`}
    >
        {project.screenshots.slice(0, 3).map((screenshot, index) => (
            <figure
                className={index === 0 ? "print-screen-gallery__primary" : ""}
                key={screenshot.id}
            >
                <img
                    src={assetPath(screenshot.src)}
                    alt={screenshot.alt}
                    width={screenshot.width}
                    height={screenshot.height}
                />
                <figcaption>
                    <b>
                        {String(index + 1).padStart(2, "0")} / {screenshot.label}
                    </b>
                    {screenshot.caption}
                </figcaption>
            </figure>
        ))}
    </div>
)

const ServiceIndex = ({ project }) => {
    const [core, ...microservices] = project.services

    return (
        <section className="print-service-index" aria-label="BATON 서비스 구성">
            <h3 className="print-markdown-heading">### 서비스 구성</h3>
            <article className="print-service-index__core">
                <small>
                    {core.name.toUpperCase()} / {core.kind}
                </small>
                <strong>{core.role}</strong>
                <p>{core.detail}</p>
                <span>
                    {core.database} · {core.evidence}
                </span>
            </article>
            <div className="print-service-index__children">
                {microservices.map((service) => (
                    <a href={toPublishedUrl(service.route)} key={service.id}>
                        <small>
                            {service.name} / {service.kind}
                        </small>
                        <strong>{service.role}</strong>
                        <p>{service.detail}</p>
                        <span>
                            {service.database} · {service.evidence}
                        </span>
                    </a>
                ))}
            </div>
        </section>
    )
}

const MetricRow = ({ proofs }) => (
    <div className="print-metric-row" aria-label="주요 구현 및 운영 근거">
        {proofs.slice(0, 3).map((proof) => (
            <div key={`${proof.value}-${proof.label}`}>
                <strong>{proof.value}</strong>
                <span>{proof.label}</span>
            </div>
        ))}
    </div>
)

const PortfolioPrintPage = () => {
    const headingRef = useRef(null)
    const baton = projectsById.baton
    const gallery = projectsById.happygallery
    const warrant = projectsById.warrant
    const defense = projectsById.defense
    const webrtc = projectsById.webrtc
    const studies = personalActivities
    const go = baton.services.find((service) => service.id === "go")
    const watch = baton.services.find((service) => service.id === "watch")
    const relay = baton.services.find((service) => service.id === "relay")
    const goConcurrency = go.evidence.split("·").at(-1).trim().replace("동시 ", "")

    useEffect(() => {
        let cancelled = false
        document.documentElement.classList.add("portfolio-print-mode")
        document.body.classList.add("portfolio-print-mode")
        document.documentElement.dataset.printReady = "loading"
        headingRef.current?.focus({ preventScroll: true })

        const markPrintReadiness = async () => {
            const images = Array.from(document.querySelectorAll(".print-document img"))
            const imageReady = images.map((image) => {
                if (image.complete) {
                    return image.decode?.().catch(() => undefined) ?? Promise.resolve()
                }

                return new Promise((resolve) => {
                    image.addEventListener("load", resolve, { once: true })
                    image.addEventListener("error", resolve, { once: true })
                })
            })

            const assetsReady = Promise.all([
                document.fonts?.ready ?? Promise.resolve(),
                ...imageReady,
            ])
            const assetDeadline = new Promise((resolve) => setTimeout(resolve, 4000))

            await Promise.race([assetsReady, assetDeadline])

            if (cancelled) {
                return
            }

            const overflowPages = Array.from(document.querySelectorAll("[data-print-page]"))
                .filter((page) => page.scrollHeight > page.clientHeight + 1)
                .map((page) => page.dataset.pageNumber)

            document.documentElement.dataset.printReady = "true"
            document.documentElement.dataset.printOverflowCount = String(overflowPages.length)
            document.documentElement.dataset.printOverflowPages = overflowPages.join(",")
        }

        markPrintReadiness().catch((error) => {
            document.documentElement.dataset.printReady = "error"
            document.documentElement.dataset.printError = error.message
        })

        return () => {
            cancelled = true
            document.documentElement.classList.remove("portfolio-print-mode")
            document.body.classList.remove("portfolio-print-mode")
            delete document.documentElement.dataset.printReady
            delete document.documentElement.dataset.printOverflowCount
            delete document.documentElement.dataset.printOverflowPages
            delete document.documentElement.dataset.printError
        }
    }, [])

    return (
        <div className="portfolio-print">
            <nav className="print-toolbar" aria-label="인쇄본 도구">
                <Link to="/">← 웹 포트폴리오</Link>
                <span>React 인쇄 원본 · A4 11쪽</span>
                <button type="button" onClick={() => window.print()}>
                    인쇄 또는 PDF 저장
                </button>
            </nav>

            <main className="print-document">
                <section
                    className="print-page print-page--dark print-page--cover"
                    data-print-page
                    data-page-number="01"
                >
                    <div className="print-cover-grid" aria-hidden="true" />
                    <header className="print-cover-nav">
                        <span># portfolio.md / 2026</span>
                        <span>BACKEND DEVELOPER</span>
                    </header>

                    <div className="print-cover-main">
                        <p className="print-eyebrow">
                            {portfolioProfile.name} / {portfolioProfile.role}
                        </p>
                        <h1 ref={headingRef} tabIndex="-1">
                            {portfolioProfile.printHeadline.lead}
                            <strong>{portfolioProfile.printHeadline.emphasis}</strong>
                        </h1>
                        <p>{portfolioProfile.printSummary}</p>
                    </div>

                    <div className="print-cover-proof" aria-label="주요 경험 요약">
                        <div>
                            <span>BATON / GO</span>
                            <strong>{goConcurrency}</strong>
                            <p>동시에 들어온 같은 링크 생성 요청을 1건으로 처리</p>
                        </div>
                        <div>
                            <span>{gallery.title}</span>
                            <strong>
                                {gallery.proofs[1].value} / {gallery.proofs[2].value}
                            </strong>
                            <p>OpenAPI operations / REST Docs tests</p>
                        </div>
                        <div>
                            <span>{warrant.title}</span>
                            <strong>{warrant.proofs[0].value}</strong>
                            <p>{warrant.proofs[0].detail}</p>
                        </div>
                    </div>

                    <footer className="print-cover-footer">
                        <span>{portfolioProfile.email}</span>
                        <span>{portfolioProfile.github.replace("https://", "")}</span>
                        <span>{portfolioProfile.phone}</span>
                    </footer>
                </section>

                <PrintPage
                    number="02"
                    path="# profile.md"
                    meta={`${portfolioProfile.name} 포트폴리오`}
                    footer="BACKEND DEVELOPMENT"
                    variant="profile"
                >
                    <PrintTitle
                        eyebrow="# WORKING PRINCIPLES"
                        title="정합성과 복구 경로를 먼저 설계합니다."
                    >
                        기능이 정상 동작하는 순간뿐 아니라 중복 요청, 외부 연동 실패, 재시작 뒤의
                        상태까지 한 흐름으로 봅니다.
                    </PrintTitle>

                    <div className="print-principles">
                        {workPrinciples.map((principle) => (
                            <article key={principle.number}>
                                <span>{principle.number}</span>
                                <h3>{principle.printTitle}</h3>
                                <p>{principle.printDescription}</p>
                            </article>
                        ))}
                    </div>

                    <section className="print-profile-row" aria-labelledby="print-education-title">
                        <h3 id="print-education-title">## Education</h3>
                        <div className="print-profile-row__meta">
                            <time>{education.period}</time>
                            <strong>{education.organization}</strong>
                            <span>{education.meta}</span>
                        </div>
                        <div>
                            <h4>{webrtc.title}</h4>
                            <time className="print-profile-project-period">{webrtc.period}</time>
                            <p>{education.description}</p>
                        </div>
                    </section>

                    <section
                        className="print-profile-row print-profile-row--careers"
                        aria-labelledby="print-career-title"
                    >
                        <h3 id="print-career-title">## Career</h3>
                        <div className="print-career-summary-list">
                            {careers.map((careerItem) => {
                                const project = projectsById[careerItem.projectId]

                                return (
                                    <article key={careerItem.id}>
                                        <div className="print-career-summary-list__meta">
                                            <time>{careerItem.period}</time>
                                            <strong>{careerItem.organization}</strong>
                                        </div>
                                        <div>
                                            <h4>{project.title}</h4>
                                            <span>{careerItem.position}</span>
                                            <p>{careerItem.printDescription}</p>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </section>

                    <aside className="print-profile-note print-profile-note--studies">
                        <span>## Personal Activity</span>
                        <div className="print-study-grid">
                            {studies.map((study) => (
                                <article aria-label={study.title} key={study.id}>
                                    <small>
                                        {study.type} / {study.role}
                                    </small>
                                    <strong>{study.title}</strong>
                                    <p>{study.summary}</p>
                                    <div className="print-profile-note__links">
                                        {study.links.map((link) => (
                                            <a href={link.href} key={link.href}>
                                                {link.label} ↗
                                            </a>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </aside>
                </PrintPage>

                <PrintPage
                    number="03"
                    path="# projects/baton/overview.md"
                    meta={`${baton.period} · ${baton.evidenceAsOf}`}
                    footer="JAVA 21 / SPRING BOOT / MYSQL / POSTGRESQL / TESTCONTAINERS"
                    dark
                    variant="baton"
                >
                    <PrintTitle eyebrow="## MAIN PROJECT" title={baton.title} project>
                        {baton.summary}
                    </PrintTitle>
                    <PrintGallery project={baton} dark />
                    <ServiceIndex project={baton} />
                    <aside className="print-status-note">
                        <strong>{baton.status.label}</strong>
                        <p>{baton.status.text}</p>
                    </aside>
                </PrintPage>

                <PrintPage
                    number="04"
                    path="# projects/baton/evidence.md"
                    meta="Decision records + recovery paths"
                    footer="PRD / ADR / RUNBOOK / API CONTRACT"
                    dark
                    variant="evidence"
                >
                    <PrintTitle eyebrow="## BATON / ENGINEERING EVIDENCE" title="대표 문제 해결">
                        서비스마다 실제로 다루는 실패 단위와 복구 기준을 문서와 테스트로
                        고정했습니다.
                    </PrintTitle>
                    <PrintProjectEvidence
                        project={baton}
                        problemIds={["02", "03", "05", "07"]}
                        showDocuments={false}
                        toPublishedUrl={toPublishedUrl}
                    />
                </PrintPage>

                <PrintPage
                    number="05"
                    path="# projects/baton/documents.md"
                    meta={baton.evidenceAsOf}
                    footer="PRD / ADR / RUNBOOK / API CONTRACT"
                    dark
                    variant="documents"
                >
                    <PrintTitle eyebrow="## BATON / DOCUMENTATION" title="문서 분류와 대표 문서">
                        기술 선택, 복구 절차와 서비스 계약을 다음 변경 때 확인할 수 있는 기록으로
                        남겼습니다.
                    </PrintTitle>
                    <PrintProjectEvidence
                        project={baton}
                        documentIndexes={[0, 1, 2, 3, 4]}
                        showProblems={false}
                        toPublishedUrl={toPublishedUrl}
                    />
                </PrintPage>

                <PrintPage
                    number="06"
                    path="# projects/happyGallery/overview.md"
                    meta={`${gallery.period} · ${gallery.evidenceAsOf}`}
                    footer="SPRING BOOT / REACT / MYSQL / REDIS / REST DOCS"
                    variant="gallery"
                >
                    <PrintTitle eyebrow="## COMMERCE + BOOKING" title={gallery.title} project>
                        {gallery.summary}
                    </PrintTitle>
                    <PrintGallery project={gallery} />
                    <MetricRow proofs={gallery.proofs} />
                    <aside className="print-architecture-note">
                        <span>## 구조</span>
                        <div>
                            <p>{gallery.architecture.description}</p>
                            <small>{gallery.architecture.tradeoff}</small>
                        </div>
                    </aside>
                    <aside className="print-status-note">
                        <strong>{gallery.status.label}</strong>
                        <p>{gallery.status.text}</p>
                    </aside>
                </PrintPage>

                <PrintPage
                    number="07"
                    path="# projects/happyGallery/evidence.md"
                    meta={gallery.evidenceAsOf}
                    footer="ARCHITECTURE / PAYMENT / OUTBOX / CONCURRENCY / SECURITY / OPERATIONS"
                    variant="evidence"
                >
                    <PrintTitle
                        eyebrow="## HAPPYGALLERY / ENGINEERING EVIDENCE"
                        title="대표 문제 해결"
                    >
                        정합성, 외부 I/O, 보안과 운영 비용을 각각 검증 가능한 경계로 나눴습니다.
                    </PrintTitle>
                    <PrintProjectEvidence
                        project={gallery}
                        problemIds={["01", "02", "03", "04", "05", "06"]}
                        compact
                        showDocuments={false}
                        toPublishedUrl={toPublishedUrl}
                    />
                </PrintPage>

                <PrintPage
                    number="08"
                    path="# projects/happyGallery/documents.md"
                    meta={gallery.evidenceAsOf}
                    footer="PRD / ADR / IDEA / POC / RETROSPECTIVE / RUNBOOK"
                    variant="documents"
                >
                    <PrintTitle
                        eyebrow="## HAPPYGALLERY / DOCUMENTATION"
                        title="문서 분류와 대표 문서"
                    >
                        요구사항, 설계 결정과 운영 회고를 구현 및 변경의 기준으로 관리했습니다.
                    </PrintTitle>
                    <PrintProjectEvidence
                        project={gallery}
                        documentIndexes={[0, 1, 3, 4, 5]}
                        showProblems={false}
                        toPublishedUrl={toPublishedUrl}
                    />
                </PrintPage>

                <PrintPage
                    number="09"
                    path="# projects/e-warrant/career-case.md"
                    meta={warrant.period}
                    footer="JAVA 11 / SPRING BOOT 2.6 / WEB SQUARE / SPRING RETRY / EAI"
                    variant="warrant"
                >
                    <PrintTitle eyebrow="PUBLIC SI / SYSTEM INTEGRATION" title={warrant.title}>
                        {warrant.summary}
                    </PrintTitle>

                    <section
                        className="print-warrant-overview"
                        aria-label="전자영장 연계 업무 흐름"
                    >
                        <header>
                            <small>MY ROLE</small>
                            <strong>{warrant.role}</strong>
                        </header>
                        <div
                            className="print-warrant-flow"
                            role="img"
                            aria-label={warrant.visualCaption}
                        >
                            <div>
                                <small>REQUEST</small>
                                <strong>사법기관 요청</strong>
                            </div>
                            <span aria-hidden="true">→</span>
                            <div className="print-warrant-flow__core">
                                <small>INTEGRATION</small>
                                <strong>집행포털 인터페이스 및 배치</strong>
                            </div>
                            <span aria-hidden="true">↔</span>
                            <div>
                                <small>RESPONSE</small>
                                <strong>금융기관 및 통신사 제출</strong>
                            </div>
                        </div>
                        <p>{warrant.visualCaption}</p>
                    </section>

                    <MetricRow proofs={warrant.proofs} />

                    <section
                        className="print-warrant-problems"
                        aria-labelledby="warrant-problems-title"
                    >
                        <h3 id="warrant-problems-title" className="print-markdown-heading">
                            ### 대표 문제 해결
                        </h3>
                        <div>
                            {warrant.problems.map((problem) => (
                                <article key={problem.number}>
                                    <span>CASE {problem.number}</span>
                                    <h4>{problem.title}</h4>
                                    <dl>
                                        <div>
                                            <dt>문제 상황</dt>
                                            <dd>{takeSentences(problem.constraint)}</dd>
                                        </div>
                                        <div>
                                            <dt>해결</dt>
                                            <dd>{takeSentences(problem.decision, 2)}</dd>
                                        </div>
                                        <div>
                                            <dt>트레이드오프</dt>
                                            <dd>{takeSentences(problem.boundary)}</dd>
                                        </div>
                                    </dl>
                                </article>
                            ))}
                        </div>
                    </section>

                    <aside className="print-status-note print-status-note--warrant">
                        <strong>{warrant.status.label}</strong>
                        <p>{warrant.status.text}</p>
                    </aside>
                </PrintPage>

                <PrintPage
                    number="10"
                    path="# projects/defense/career-case.md"
                    meta={defense.period}
                    footer="JAVA 8 / EGOV / MYBATIS / TIBERO / JENKINS"
                    variant="defense"
                >
                    <PrintTitle eyebrow="PUBLIC SI / CLOSED NETWORK" title={defense.title}>
                        {defense.summary}
                    </PrintTitle>

                    <div
                        className="print-defense-flow"
                        role="img"
                        aria-label="비식별 기관 연계 배치 흐름"
                    >
                        <div className="print-agency-stack">
                            <span>기관 A</span>
                            <span>기관 B</span>
                            <span>기관 C</span>
                        </div>
                        <div className="print-flow-arrow" aria-hidden="true">
                            →
                        </div>
                        <div className="print-flow-box">
                            <small>JENKINS</small>
                            <strong>기관 연계 배치 3종</strong>
                            <p>실행 결과 → 서버 로그 → DB 반영 → 화면 조회</p>
                        </div>
                        <div className="print-flow-arrow" aria-hidden="true">
                            →
                        </div>
                        <div className="print-flow-box">
                            <small>BUSINESS SYSTEM</small>
                            <strong>군교정 업무</strong>
                            <p>검증 · 반영 · 운영 대응</p>
                        </div>
                    </div>

                    <MetricRow proofs={defense.proofs} />

                    <div className="print-career-cases">
                        {defense.problems.map((problem, index) => (
                            <article key={problem.number}>
                                <span>{["개발", "보안", "장애 대응"][index]}</span>
                                <h3>{problem.title}</h3>
                                <p>{problem.decision}</p>
                            </article>
                        ))}
                        <article>
                            <span>공개 범위</span>
                            <h3>직접 수행한 업무만 비식별화</h3>
                            <p>{defense.status.text}</p>
                        </article>
                    </div>
                </PrintPage>

                <PrintPage
                    number="11"
                    path="# skills-and-contact.md"
                    meta="Backend developer"
                    footer={`${portfolioProfile.name.toUpperCase()} / 2026`}
                    dark
                    variant="closing"
                >
                    <PrintTitle eyebrow="# STACK WITH CONTEXT" title="사용한 기술과 적용 경험">
                        기술 이름보다 어떤 문제에 적용했고, 실패 뒤 어떻게 복구했는지를 함께
                        설명합니다.
                    </PrintTitle>

                    <div className="print-skill-table">
                        {printSkillGroups.map((group) => (
                            <article key={group.label}>
                                <h3>{group.label}</h3>
                                <p>{group.detail}</p>
                            </article>
                        ))}
                    </div>

                    <div className="print-closing-contact">
                        <p>요구사항, 장애 영향과 복구 방법을 확인한 뒤 필요한 구조를 선택합니다.</p>
                        <div>
                            <a href={`mailto:${portfolioProfile.email}`}>
                                {portfolioProfile.email}
                            </a>
                            <a href={portfolioProfile.github}>{portfolioProfile.github}</a>
                            <a href={portfolioProfile.site}>{portfolioProfile.site}</a>
                            <a href={`tel:${portfolioProfile.phoneHref}`}>
                                {portfolioProfile.phone}
                            </a>
                        </div>
                    </div>

                    <nav className="print-project-links" aria-label="주요 프로젝트 링크">
                        <a href={toPublishedUrl(baton.route)}>BATON Core</a>
                        <a href={toPublishedUrl(go.route)}>GO</a>
                        <a href={toPublishedUrl(watch.route)}>WATCH</a>
                        <a href={toPublishedUrl(relay.route)}>RELAY</a>
                        <a href={toPublishedUrl(gallery.route)}>happyGallery</a>
                        <a href={toPublishedUrl(warrant.route)}>전송형 전자영장</a>
                        <a href={toPublishedUrl(defense.route)}>군사법 경력 사례</a>
                        <a href={toPublishedUrl(webrtc.route)}>WebRTC/HLS</a>
                    </nav>
                </PrintPage>
            </main>
        </div>
    )
}

export default PortfolioPrintPage

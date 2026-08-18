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
    <div className="print-metric-row" aria-label="주요 구현 및 확인 결과">
        {proofs.slice(0, 3).map((proof) => (
            <div key={`${proof.item}-${proof.scope ?? "all"}`}>
                <strong>{proof.item}</strong>
                <span>
                    {proof.result.replace(
                        "API 경로 193개, 작업 225개",
                        "193 paths / 225 operations",
                    )}
                </span>
                {proof.scope ? <small>{proof.scope}</small> : null}
            </div>
        ))}
    </div>
)

const WarrantCareerPage = ({ warrant }) => (
    <PrintPage
        number="03"
        path="# career-projects/e-warrant.md"
        meta={warrant.period}
        footer="JAVA 11 / SPRING BOOT 2.6 / SPRING BATCH / WEB SQUARE / MAVEN"
        variant="warrant"
    >
        <PrintTitle eyebrow="## CAREER PROJECT / LG CNS 컨소시엄" title={warrant.title}>
            {warrant.summary}
        </PrintTitle>

        <section className="print-warrant-overview" aria-label="전자영장 연계 업무 흐름">
            <header>
                <small>MY ROLE</small>
                <strong>{warrant.role}</strong>
            </header>
            <div className="print-warrant-flow" role="img" aria-label={warrant.visualCaption}>
                <div>
                    <small>REQUEST</small>
                    <strong>사법기관 KICS 독립망</strong>
                </div>
                <span aria-hidden="true">→</span>
                <div className="print-warrant-flow__core">
                    <small>INTEGRATION</small>
                    <strong>전자영장 집행포털 인터페이스 및 Spring Batch</strong>
                </div>
                <span aria-hidden="true">↔</span>
                <div>
                    <small>RESPONSE</small>
                    <strong>금융기관 및 통신사 독립망</strong>
                </div>
            </div>
            <p>{warrant.visualCaption}</p>
        </section>

        <MetricRow proofs={warrant.proofs} />

        <section className="print-warrant-problems" aria-labelledby="warrant-problems-title">
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
                                <dt>적용한 방법</dt>
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
)

const DefenseCareerPage = ({ defense }) => (
    <PrintPage
        number="04"
        path="# career-projects/defense.md"
        meta={defense.period}
        footer="JAVA 8 / EGOV / MYBATIS / TIBERO / JENKINS"
        variant="defense"
    >
        <PrintTitle eyebrow="## CAREER PROJECT / PUBLIC SI" title={defense.title}>
            {defense.summary}
        </PrintTitle>

        <div className="print-defense-flow" role="img" aria-label="비식별 기관 연계 배치 흐름">
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
                <p>형식 확인 · DB 반영 · 장애 대응</p>
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
)

const PortfolioPrintPage = () => {
    const headingRef = useRef(null)
    const baton = projectsById.baton
    const gallery = projectsById.happygallery
    const warrant = projectsById.warrant
    const defense = projectsById.defense
    const webrtc = projectsById.webrtc
    const studies = personalActivities
    const microservices = baton.services.filter((service) => !service.primary)

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
                <span>React 인쇄 원본 · A4 9쪽</span>
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
                            <span>CURRENT CAREER</span>
                            <strong>기관 연계 및 배치</strong>
                            <p>KICS 독립망 연계 인터페이스와 Spring Batch 개발</p>
                        </div>
                        <div>
                            <span>{baton.title}</span>
                            <strong>Core + 5개 서비스</strong>
                            <p>상태 전이, 멱등 처리와 실패 후 재처리 기준 설계</p>
                        </div>
                        <div>
                            <span>{gallery.title}</span>
                            <strong>결제 및 예약 운영</strong>
                            <p>결제 및 환불 멱등성, 알림 아웃박스와 예약 경쟁 처리</p>
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
                        title="데이터 일관성과 실패 후 재처리를 먼저 설계합니다."
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

                <WarrantCareerPage warrant={warrant} />
                <DefenseCareerPage defense={defense} />

                <PrintPage
                    number="05"
                    path="# personal-projects/baton/overview.md"
                    meta={`${baton.period} · ${baton.evidenceAsOf}`}
                    footer="JAVA / KOTLIN / SPRING BOOT / MYSQL / POSTGRESQL / TESTCONTAINERS"
                    dark
                    variant="baton"
                >
                    <PrintTitle
                        eyebrow="## PERSONAL PROJECT / MAIN PROJECT"
                        title={baton.title}
                        project
                    >
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
                    number="06"
                    path="# personal-projects/baton/engineering-evidence.md"
                    meta="설계 결정, 확인 결과 및 대표 문서"
                    footer="PRD / ADR / RUNBOOK / API CONTRACT"
                    dark
                    variant="evidence-docs"
                >
                    <PrintTitle
                        eyebrow="## PERSONAL PROJECT / BATON ENGINEERING EVIDENCE"
                        title="문제 해결과 판단 근거"
                    >
                        Core와 마이크로서비스의 데이터 처리 기준, 실패 후 동작과 대표 설계 문서를
                        함께 정리했습니다.
                    </PrintTitle>
                    <PrintProjectEvidence
                        project={baton}
                        problemIds={["02", "03", "05", "07"]}
                        documentLabels={[
                            "Core 헥사고날 아키텍처",
                            "GO 멱등 링크 생성",
                            "WATCH 상태 변경 이벤트 전달",
                        ]}
                        compact
                        compactDocuments
                        toPublishedUrl={toPublishedUrl}
                    />
                </PrintPage>

                <PrintPage
                    number="07"
                    path="# personal-projects/happyGallery/overview.md"
                    meta={`${gallery.period} · ${gallery.evidenceAsOf}`}
                    footer="SPRING BOOT / REACT / MYSQL / REDIS / REST DOCS"
                    variant="gallery"
                >
                    <PrintTitle
                        eyebrow="## PERSONAL PROJECT / COMMERCE + BOOKING"
                        title={gallery.title}
                        project
                    >
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
                    number="08"
                    path="# personal-projects/happyGallery/engineering-evidence.md"
                    meta={gallery.evidenceAsOf}
                    footer="ADR / RETROSPECTIVE / PAYMENT / OUTBOX / CONCURRENCY"
                    variant="evidence-docs"
                >
                    <PrintTitle
                        eyebrow="## PERSONAL PROJECT / HAPPYGALLERY ENGINEERING EVIDENCE"
                        title="문제 해결과 판단 근거"
                    >
                        정합성, 외부 I/O와 동시성 문제를 처리한 방법과 그 판단 근거가 된 대표 문서를
                        함께 정리했습니다.
                    </PrintTitle>
                    <PrintProjectEvidence
                        project={gallery}
                        problemIds={["02", "03", "04", "07"]}
                        documentLabels={[
                            "결제 승인 트랜잭션과 보상 경계",
                            "8회권 사용, 취소 및 환불 정책",
                            "알림 Outbox 전달 보장",
                        ]}
                        compact
                        compactDocuments
                        toPublishedUrl={toPublishedUrl}
                    />
                </PrintPage>

                <PrintPage
                    number="09"
                    path="# skills-and-contact.md"
                    meta="Backend developer"
                    footer={`${portfolioProfile.name.toUpperCase()} / 2026`}
                    dark
                    variant="closing"
                >
                    <PrintTitle eyebrow="# STACK WITH CONTEXT" title="사용한 기술과 적용 경험">
                        기술 이름보다 어떤 문제에 적용했고, 실패 뒤 어떤 기준으로 재처리했는지를
                        함께 설명합니다.
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
                        <p>
                            요구사항, 장애 영향과 재처리 또는 복원 방법을 확인한 뒤 필요한 구조를
                            선택합니다.
                        </p>
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
                        {microservices.map((service) => (
                            <a href={toPublishedUrl(service.route)} key={service.id}>
                                {service.name}
                            </a>
                        ))}
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

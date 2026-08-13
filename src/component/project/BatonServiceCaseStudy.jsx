import { Link } from "react-router-dom"
import { batonServicesById, projectsById } from "../../data/projects"
import BatonServiceSwitcher from "./BatonServiceSwitcher"
import ProblemSolutionList from "./ProblemSolutionList"
import "../../css/BatonService.css"

const BatonServiceCaseStudy = ({ serviceId }) => {
    const project = projectsById.baton
    const service = batonServicesById[serviceId]

    if (!service || service.primary) {
        return null
    }

    const problems = project.problems.filter((problem) => problem.serviceIds.includes(serviceId))
    const documents = project.documents.filter((document) => document.serviceId === serviceId)
    const siblings = project.services.filter((candidate) => !candidate.primary)

    return (
        <main className={`baton-service-page baton-service-page--${serviceId}`} id="main-content">
            <a className="skip-link" href="#service-title">
                본문으로 건너뛰기
            </a>
            <nav className="baton-service-nav" aria-label="BATON 서비스 상세 탐색">
                <Link to="/projects/baton">← BATON 전체 보기</Link>
                <span>services/{serviceId}.md</span>
            </nav>

            <article className="baton-service-case">
                <header className="baton-service-hero">
                    <div>
                        <span className="baton-service-kicker">BATON / {service.kind}</span>
                        <h1 id="service-title" data-route-heading={service.route} tabIndex={-1}>
                            {service.name}
                        </h1>
                    </div>
                    <div className="baton-service-hero__intro">
                        <strong>{service.role}</strong>
                        <p>{service.detail}</p>
                        <dl className="baton-service-hero__facts" aria-label="서비스 정보">
                            <div>
                                <dt>DB</dt>
                                <dd>{service.database}</dd>
                            </div>
                            <div>
                                <dt>공개 범위</dt>
                                <dd>{service.visibility}</dd>
                            </div>
                            <div>
                                <dt>검증 근거</dt>
                                <dd>{service.evidence}</dd>
                            </div>
                        </dl>
                    </div>
                </header>

                <aside className="baton-service-status" aria-label="구현 상태">
                    <code>[status]</code>
                    <p>{service.status}</p>
                </aside>

                <BatonServiceSwitcher services={project.services} currentServiceId={serviceId} />

                <nav className="baton-service-index" aria-label="서비스 상세 섹션 바로가기">
                    <span aria-hidden="true">페이지 내 이동</span>
                    <ul>
                        <li>
                            <a href="#service-boundary">책임</a>
                        </li>
                        <li>
                            <a href="#service-problems">문제 해결</a>
                        </li>
                        <li>
                            <a href="#service-documents">문서</a>
                        </li>
                    </ul>
                </nav>

                <section
                    className="baton-service-boundary"
                    id="service-boundary"
                    aria-labelledby="boundary-title"
                >
                    <div className="baton-service-section-heading">
                        <span>## 01</span>
                        <h2 id="boundary-title">BATON 안에서의 책임</h2>
                    </div>
                    <div className="service-boundary-flow">
                        <article>
                            <code>입력</code>
                            <strong>{service.input}</strong>
                            <p>Core와 각 마이크로서비스가 합의한 입력 계약만 받습니다.</p>
                        </article>
                        <span aria-hidden="true">→</span>
                        <article className="service-boundary-flow__current">
                            <code>
                                {service.name} / {service.kind}
                            </code>
                            <strong>{service.role}</strong>
                            <p>{service.detail}</p>
                        </article>
                        <span aria-hidden="true">→</span>
                        <article>
                            <code>출력 및 재처리 기준</code>
                            <strong>{service.output}</strong>
                            <p>{service.recoveryBoundary}</p>
                        </article>
                    </div>
                    <blockquote>
                        <strong>서비스 분리의 트레이드오프</strong>
                        {project.architecture.tradeoff}
                    </blockquote>
                </section>

                <section
                    className="baton-service-problems"
                    id="service-problems"
                    aria-labelledby="service-problems-title"
                >
                    <div className="baton-service-section-heading">
                        <span>## 02</span>
                        <h2 id="service-problems-title">대표 문제 해결</h2>
                    </div>
                    <ProblemSolutionList
                        problems={problems}
                        label={`${service.name} 대표 문제 해결 목록`}
                    />
                </section>

                <section
                    className="baton-service-documents"
                    id="service-documents"
                    aria-labelledby="service-documents-title"
                >
                    <div className="baton-service-section-heading">
                        <span>## 03</span>
                        <h2 id="service-documents-title">문서 분류와 대표 문서</h2>
                    </div>
                    <div
                        className="service-document-counts"
                        aria-label={`${service.name} 문서 분류`}
                    >
                        {service.documentation.map((item) => (
                            <article key={item.label}>
                                <code>{item.label}</code>
                                <strong>{item.count}</strong>
                            </article>
                        ))}
                    </div>
                    <div className="service-document-links">
                        <h3>
                            <span aria-hidden="true">###</span> 대표 문서
                        </h3>
                        {documents.map((document) => (
                            <article key={document.href}>
                                <a href={document.href} target="_blank" rel="noreferrer">
                                    <code>[{document.type}]</code>
                                    <strong>{document.label}</strong>
                                    <span aria-hidden="true">↗</span>
                                </a>
                                <p>{document.note}</p>
                            </article>
                        ))}
                        {service.repository ? (
                            <a
                                className="service-repository-link"
                                href={service.repository.href}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {service.repository.label} 보기 <span aria-hidden="true">↗</span>
                            </a>
                        ) : null}
                        {service.repository?.note ? (
                            <p className="service-repository-note">{service.repository.note}</p>
                        ) : null}
                    </div>
                </section>
            </article>

            <footer className="baton-service-footer">
                <span>다른 BATON 마이크로서비스</span>
                <div>
                    {siblings.map((candidate) => (
                        <Link
                            className={candidate.id === serviceId ? "is-current" : ""}
                            to={candidate.route}
                            key={candidate.id}
                            aria-current={candidate.id === serviceId ? "page" : undefined}
                        >
                            {candidate.name}
                        </Link>
                    ))}
                </div>
            </footer>
        </main>
    )
}

export default BatonServiceCaseStudy

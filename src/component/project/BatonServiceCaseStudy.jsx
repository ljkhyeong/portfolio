import { Link } from "react-router-dom"
import { batonServicesById, projectsById } from "../../data/projects"
import "../../css/BatonService.css"

const ProblemStory = ({ problem }) => (
    <article className="service-problem">
        <div className="service-problem__heading">
            <code>{problem.number}</code>
            <h3>{problem.title}</h3>
        </div>
        <dl>
            <div>
                <dt>문제 상황</dt>
                <dd>{problem.constraint}</dd>
            </div>
            <div>
                <dt>해결</dt>
                <dd>{problem.decision}</dd>
            </div>
            <div>
                <dt>검증</dt>
                <dd>{problem.validation}</dd>
            </div>
            <div className="service-problem__tradeoff">
                <dt>트레이드오프와 한계</dt>
                <dd>{problem.boundary}</dd>
            </div>
        </dl>
    </article>
)

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
                        <h1 id="service-title" data-route-heading={service.route}>
                            {service.name}
                        </h1>
                    </div>
                    <div className="baton-service-hero__intro">
                        <strong>{service.role}</strong>
                        <p>{service.detail}</p>
                        <ul aria-label="서비스 정보">
                            <li>{service.database}</li>
                            <li>{service.visibility}</li>
                            <li>{service.evidence}</li>
                        </ul>
                    </div>
                </header>

                <aside className="baton-service-status" aria-label="구현 상태">
                    <code>[status]</code>
                    <p>{service.status}</p>
                </aside>

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
                            <code>Core / System of Record</code>
                            <strong>조직 운영 기준 데이터</strong>
                            <p>팀, 시즌, 역할과 업무 기준을 관리합니다.</p>
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
                            <code>복구 상태</code>
                            <strong>실패 뒤 재시작 지점</strong>
                            <p>중복, 지연과 외부 응답 유실을 영속 상태로 남깁니다.</p>
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
                    <div className="baton-service-problems__list">
                        {problems.map((problem) => (
                            <ProblemStory problem={problem} key={problem.number} />
                        ))}
                    </div>
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
                        {serviceId === "watch" ? (
                            <a
                                className="service-repository-link"
                                href="https://github.com/ljkhyeong/baton-watch"
                                target="_blank"
                                rel="noreferrer"
                            >
                                WATCH 공개 저장소 보기 <span aria-hidden="true">↗</span>
                            </a>
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

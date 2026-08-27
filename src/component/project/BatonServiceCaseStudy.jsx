import { Link } from "react-router-dom"
import { batonServicesById, projectsById } from "../../data/projects"
import BatonServiceSwitcher from "./BatonServiceSwitcher"
import CaseMetaSection from "./CaseMetaSection"
import ProblemSolutionList from "./ProblemSolutionList"
import "../../css/BatonService.css"

const BatonServiceCaseStudy = ({ serviceId }) => {
    const project = projectsById.baton
    const service = batonServicesById[serviceId]

    if (!service || service.primary) {
        return null
    }

    const problems = project.problems.filter(
        (problem) => problem.serviceIds.includes(serviceId) && !problem.shared,
    )
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
                        <p>{service.summary ?? service.detail}</p>
                        <p className="baton-service-hero__contribution">{service.contribution}</p>
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
                                <dt>문서 및 테스트</dt>
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
                        <li>
                            <a href="#service-stack">사용 기술</a>
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
                        <h2 id="boundary-title">이 서비스가 받는 데이터와 처리 결과</h2>
                    </div>
                    <div className="service-boundary-flow">
                        <article>
                            <code>입력</code>
                            <strong>{service.input}</strong>
                            <p>{service.inputRule}</p>
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
                            <code>처리 결과</code>
                            <strong>{service.output}</strong>
                            <p>중복 및 실패 처리: {service.recoveryBoundary}</p>
                        </article>
                    </div>
                    <blockquote>
                        <strong>{service.name}의 적용 범위와 제약</strong>
                        {service.tradeoff}
                    </blockquote>
                </section>

                <section
                    className="baton-service-problems"
                    id="service-problems"
                    aria-labelledby="service-problems-title"
                >
                    <div className="baton-service-section-heading">
                        <span>## 02</span>
                        <h2 id="service-problems-title">문제와 해결 방법</h2>
                    </div>
                    <ProblemSolutionList
                        problems={problems}
                        label={`${service.name} 문제와 해결 방법 목록`}
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
                    </div>
                </section>

                <CaseMetaSection
                    id="service-stack"
                    headingId="service-stack-title"
                    sectionNumber="## 04"
                    technologies={service.stack}
                    technologyLabel={`${service.name} 기술 스택`}
                    links={
                        service.repository
                            ? [
                                  {
                                      href: service.repository.href,
                                      label: `${service.repository.label} 보기`,
                                      note:
                                          service.repository.note ??
                                          "서비스 구현과 테스트 코드를 확인할 수 있습니다.",
                                  },
                              ]
                            : []
                    }
                    linkNote={
                        service.repository
                            ? undefined
                            : "비공개 저장소입니다. 공개 가능한 설계 결정과 테스트 근거는 위 대표 문서에 정리했습니다."
                    }
                />
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

import { Link } from "react-router-dom"
import { batonServicesById, projectsById } from "../../data/projects"
import { batonServicePresentations } from "../../data/batonServicePresentation"
import featuredCasePresentations from "../../data/featuredProblems"
import BatonServiceSwitcher from "./BatonServiceSwitcher"
import CaseMetaSection from "./CaseMetaSection"
import CaseKeySummary from "./CaseKeySummary"
import CaseSectionNavigation from "./CaseSectionNavigation"
import ProblemSolutionList from "./ProblemSolutionList"
import BatonServiceFlowDiagram from "./diagrams/BatonServiceFlowDiagram"
import "../../css/BatonService.css"

const problemResults = {
    "03": "동시 요청 8건에도 링크와 처리 기록 각 1건",
    "04": "HMAC 키 불일치 시 기동과 링크 생성 차단",
    "05": "사설망, 늦은 결과 차단과 중단 시도 회수 확인",
    "06": "응답 유실과 미전송 이벤트 재처리 확인",
    "07": "서버 중단 후 같은 시도 정보 유지와 상태 확정 확인",
    "08": "RabbitMQ 재전달에도 수신 이력 1건",
    "09": "실제 Core와 로컬 HTTP 및 내부 HTTPS 연동 확인",
    10: "재생성 결과 일치, 동시 요청에도 보고서 1건",
    11: "중복, 과거 개정과 같은 개정의 내용 충돌 차단",
    12: "시간대, 취소 일정과 ETag 304 응답 확인",
    13: "현재 연결 순번의 SDP 및 ICE만 반영",
    14: "잘못된 참여권 차단과 공개 키 교체 확인",
}

const BatonServiceCaseStudy = ({ serviceId }) => {
    const project = projectsById.baton
    const service = batonServicesById[serviceId]
    const presentation = batonServicePresentations[serviceId]

    if (!service || service.primary || !presentation) {
        return null
    }

    const problems = project.problems
        .filter((problem) => problem.serviceIds.includes(serviceId) && !problem.shared)
        .map((problem) => ({ ...problem, validationSummary: problemResults[problem.number] }))
    const documents = project.documents.filter((document) => document.serviceId === serviceId)
    const siblings = project.services.filter((candidate) => !candidate.primary)

    return (
        <main className={`baton-service-page baton-service-page--${serviceId}`} id="main-content">
            <a className="skip-link" href="#service-title">
                본문으로 건너뛰기
            </a>
            <nav className="baton-service-nav" aria-label="BATON 서비스 상세 탐색">
                <Link to="/projects/baton">← BATON 전체 보기</Link>
                <span>BATON / {service.name}</span>
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
                        <p>{service.summary ?? service.detail}</p>
                        <dl className="baton-service-hero__facts" aria-label="서비스 정보">
                            <div>
                                <dt>DB</dt>
                                <dd>{service.database}</dd>
                            </div>
                            <div>
                                <dt>공개 범위</dt>
                                <dd>{service.visibility}</dd>
                            </div>
                        </dl>
                    </div>
                </header>

                <CaseKeySummary
                    items={[
                        { label: "해결 대상", text: presentation.target },
                        { label: "핵심 설계", text: presentation.decision },
                        { label: "확인 결과", text: presentation.result },
                    ]}
                />

                <BatonServiceSwitcher services={project.services} currentServiceId={serviceId} />

                <CaseSectionNavigation
                    label="서비스 상세 섹션 바로가기"
                    sections={[
                        { id: "service-problems", label: "문제 해결" },
                        { id: "service-boundary", label: "처리 흐름" },
                        { id: "service-verification", label: "검증 상태" },
                        { id: "service-documents", label: "문서" },
                        { id: "service-stack", label: "사용 기술" },
                    ]}
                />

                <section
                    className="baton-service-problems"
                    id="service-problems"
                    aria-labelledby="service-problems-title"
                >
                    <div className="baton-service-section-heading">
                        <h2 id="service-problems-title">문제와 해결 방법</h2>
                    </div>
                    <ProblemSolutionList
                        problems={problems}
                        featured={featuredCasePresentations[`baton-${serviceId}`]}
                        label={`${service.name} 문제와 해결 방법 목록`}
                    />
                </section>

                <section
                    className="baton-service-boundary"
                    id="service-boundary"
                    aria-labelledby="boundary-title"
                >
                    <div className="baton-service-section-heading">
                        <h2 id="boundary-title">처리 흐름</h2>
                    </div>
                    <BatonServiceFlowDiagram serviceId={serviceId} />
                    <details className="baton-service-scope">
                        <summary>구현 범위와 제약</summary>
                        <div>
                            <p>{service.contribution}</p>
                            <dl>
                                <div>
                                    <dt>입력</dt>
                                    <dd>{service.input}</dd>
                                </div>
                                <div>
                                    <dt>입력 검증</dt>
                                    <dd>{service.inputRule}</dd>
                                </div>
                                <div>
                                    <dt>처리 결과</dt>
                                    <dd>{service.output}</dd>
                                </div>
                                <div>
                                    <dt>재처리 기준</dt>
                                    <dd>{service.recoveryBoundary}</dd>
                                </div>
                            </dl>
                            <blockquote>
                                <strong>{service.name}의 적용 범위와 제약</strong>
                                <p>{service.tradeoff}</p>
                            </blockquote>
                        </div>
                    </details>
                </section>

                <section
                    className="baton-service-verification"
                    id="service-verification"
                    aria-labelledby="service-verification-title"
                >
                    <div className="baton-service-section-heading">
                        <h2 id="service-verification-title">검증 결과와 남은 범위</h2>
                    </div>
                    <dl className="baton-service-status" aria-label="구현 상태">
                        {presentation.verification.map((item) => (
                            <div
                                key={item.kind}
                                className={`baton-service-status__item baton-service-status__item--${item.kind}`}
                            >
                                <dt>
                                    <span aria-hidden="true">
                                        {item.kind === "verified"
                                            ? "✓"
                                            : item.kind === "limited"
                                              ? "!"
                                              : "—"}
                                    </span>
                                    {item.label}
                                </dt>
                                <dd>{item.text}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <section
                    className="baton-service-documents"
                    id="service-documents"
                    aria-labelledby="service-documents-title"
                >
                    <div className="baton-service-section-heading">
                        <h2 id="service-documents-title">문서 분류와 대표 문서</h2>
                    </div>
                    <div className="service-document-links">
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
                    <details className="service-document-inventory">
                        <summary>문서 분류와 작성 수</summary>
                        <dl aria-label={`${service.name} 문서 분류`}>
                            {service.documentation.map((item) => (
                                <div key={item.label}>
                                    <dt>{item.label}</dt>
                                    <dd>{item.count}</dd>
                                </div>
                            ))}
                        </dl>
                    </details>
                </section>

                <CaseMetaSection
                    id="service-stack"
                    headingId="service-stack-title"
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

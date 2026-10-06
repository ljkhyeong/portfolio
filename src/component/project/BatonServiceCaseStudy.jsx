import { Link } from "react-router-dom"
import { batonServicesById, projectsById } from "../../data/projects"
import { batonServicePresentations } from "../../data/batonServicePresentation"
import featuredCasePresentations from "../../data/featuredProblems"
import PortfolioNavigation from "../PortfolioNavigation"
import ProjectScreenshotGallery from "../ProjectScreenshotGallery"
import BatonServiceSwitcher from "./BatonServiceSwitcher"
import CaseMetaSection from "./CaseMetaSection"
import CaseSectionNavigation from "./CaseSectionNavigation"
import { DocumentCounts, DocumentItems } from "./DocumentList"
import ProblemCases from "./ProblemCases"
import BatonServiceFlowDiagram from "./diagrams/BatonServiceFlowDiagram"
import "../../css/BatonService.css"
import "../../css/CaseShowcase.css"

const BatonServiceCaseStudy = ({ serviceId }) => {
    const project = projectsById.baton
    const service = batonServicesById[serviceId]
    const presentation = batonServicePresentations[serviceId]

    if (!service || service.primary || !presentation) {
        return null
    }

    const problems = project.problems.filter(
        (problem) => problem.serviceIds.includes(serviceId) && !problem.shared,
    )
    const documents = project.documents.filter((document) => document.serviceId === serviceId)
    const siblings = project.services.filter((candidate) => !candidate.primary)
    const serviceGalleryProject = service.screenshots?.length
        ? {
              title: `BATON ${service.name}`,
              visual: `baton-${serviceId}`,
              screenshots: service.screenshots,
              screenshotNote: service.screenshotNote,
          }
        : null

    return (
        <main
            className={`baton-service-page baton-service-page--${serviceId} case-showcase`}
            id="main-content"
        >
            <a className="skip-link" href="#service-title">
                본문으로 건너뛰기
            </a>
            <PortfolioNavigation
                label="BATON 서비스 상세 탐색"
                links={
                    <>
                        <Link to="/#work">프로젝트 목록</Link>
                        <Link to="/projects/baton">
                            <span aria-hidden="true">←</span> BATON 전체 보기
                        </Link>
                    </>
                }
                actions={<span className="site-nav__context">BATON / {service.name}</span>}
            />

            <article className="baton-service-case">
                <header className="baton-service-hero">
                    <div>
                        <span className="baton-service-kicker">BATON / {service.kind}</span>
                        <h1 id="service-title" data-route-heading={service.route} tabIndex={-1}>
                            {service.name}
                        </h1>
                        <div className="baton-service-hero__intro">
                            <p>{service.summary ?? service.detail}</p>
                            <Link
                                className="baton-service-hero__search"
                                to={`/search?project=baton&service=${service.id}`}
                            >
                                이 서비스 문서 검색 <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
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
                </header>

                <section
                    className="baton-service-boundary case-cover"
                    id="service-boundary"
                    aria-labelledby="boundary-title"
                >
                    <div className="baton-service-section-heading case-cover__heading">
                        <h2 id="boundary-title">
                            {serviceGalleryProject ? "대표 화면과 처리 흐름" : "처리 흐름"}
                        </h2>
                    </div>
                    {serviceGalleryProject ? (
                        <div className="baton-service-boundary__screens">
                            <ProjectScreenshotGallery
                                project={serviceGalleryProject}
                                context="service"
                            />
                        </div>
                    ) : null}
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

                <BatonServiceSwitcher services={project.services} currentServiceId={serviceId} />

                <CaseSectionNavigation
                    label="서비스 상세 섹션 바로가기"
                    sections={[
                        {
                            id: "service-boundary",
                            label: serviceGalleryProject ? "화면 및 흐름" : "처리 흐름",
                        },
                        { id: "service-problems", label: "문제 해결" },
                        { id: "service-verification", label: "확인한 범위" },
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
                    <ProblemCases
                        project={serviceGalleryProject ?? project}
                        problems={problems}
                        featured={featuredCasePresentations[`baton-${serviceId}`]}
                    />
                </section>

                <section
                    className="baton-service-verification"
                    id="service-verification"
                    aria-labelledby="service-verification-title"
                >
                    <div className="baton-service-section-heading">
                        <h2 id="service-verification-title">확인한 범위</h2>
                    </div>
                    <dl className="baton-service-status" aria-label="구현 상태">
                        {presentation.verification.map((item) => (
                            <div
                                key={item.kind}
                                className={`baton-service-status__item baton-service-status__item--${item.kind}`}
                            >
                                <dt>{item.label}</dt>
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
                        <h2 id="service-documents-title">대표 문서</h2>
                    </div>
                    <DocumentCounts
                        groups={service.documentation}
                        label={`${service.name} 문서 분류와 작성 수`}
                    />
                    <DocumentItems documents={documents} />
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

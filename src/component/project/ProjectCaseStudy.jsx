import { Link } from "react-router-dom"
import { navigableCaseStudies, projectsById } from "../../data/projects"
import { assetPath } from "../../utils/assetPath"
import GalleryScreenshot from "../GalleryScreenshot"
import "../../css/Project.css"

const ProductVisual = ({ project }) => {
    const isBaton = project.visual === "baton"

    return (
        <figure className={`case-visual case-visual--product case-visual--${project.visual}-ui`}>
            <div className="case-product__chrome" aria-hidden="true">
                <span />
                <span />
                <span />
                <strong>{isBaton ? "BATON / ONBOARDING" : "HAPPYGALLERY / HOME"}</strong>
            </div>
            <div className="case-product__viewport">
                {isBaton ? (
                    <img
                        src={assetPath("baton-product-ui.png")}
                        width="1440"
                        height="900"
                        alt="BATON 팀 생성 온보딩 실행 화면"
                    />
                ) : (
                    <GalleryScreenshot sizes="(max-width: 900px) 100vw, 1200px" />
                )}
            </div>
            <figcaption>
                <span>실제 실행 화면</span>
                <strong>{isBaton ? "조직 생성 온보딩" : "공방 상품 및 클래스 홈"}</strong>
            </figcaption>
        </figure>
    )
}

const BatonServices = ({ services }) => {
    const core = services.find((service) => service.primary)
    const supporting = services.filter((service) => !service.primary)

    return (
        <div className="case-service-map" aria-label="BATON 서비스 책임 경계">
            <article className="case-service-map__core">
                <div>
                    <span>MAIN / {core.database}</span>
                    <strong>{core.name}</strong>
                    <h3>{core.role}</h3>
                </div>
                <p>{core.detail}</p>
                <em>{core.evidence}</em>
            </article>
            <div className="case-service-map__divider">
                <span>외부 실패 특성에 따라 분리한 서비스</span>
            </div>
            <div className="case-service-map__children">
                {supporting.map((service) => (
                    <article key={service.name}>
                        <span>{service.database}</span>
                        <strong>{service.name}</strong>
                        <h3>{service.role}</h3>
                        <p>{service.detail}</p>
                        <em>{service.evidence}</em>
                    </article>
                ))}
            </div>
        </div>
    )
}

const DefenseVisual = () => (
    <div
        className="case-visual case-visual--defense"
        role="img"
        aria-label="세 개의 비식별 기관 데이터가 연계 배치를 거쳐 군교정 업무로 전달되는 흐름"
    >
        <div className="defense-map__label">폐쇄망 / 비식별화</div>
        <div className="defense-map">
            <div className="defense-map__sources">
                <span>기관 A</span>
                <span>기관 B</span>
                <span>기관 C</span>
            </div>
            <span className="defense-map__connector" aria-hidden="true" />
            <div className="defense-map__batch">
                <small>Jenkins</small>
                <strong>연계 배치 3종</strong>
                <span>log → DB → batch</span>
            </div>
            <span className="defense-map__connector" aria-hidden="true" />
            <div className="defense-map__destination">
                <small>업무 시스템</small>
                <strong>군교정 업무</strong>
                <span>검증 / 반영 / 운영 대응</span>
            </div>
        </div>
    </div>
)

const ProjectVisual = ({ project }) => {
    if (project.presentation === "featured") {
        return <ProductVisual project={project} />
    }

    return <DefenseVisual />
}

const ArchitectureSection = ({ project }) => (
    <section className="case-architecture" aria-labelledby="architecture-title">
        <div className="case-section-heading">
            <span>02</span>
            <h2 id="architecture-title">설계 판단</h2>
        </div>
        <div className="case-architecture__intro">
            <span>{project.architecture.label}</span>
            <h3>{project.architecture.title}</h3>
            <p>{project.architecture.description}</p>
        </div>
        <div className="case-architecture__decisions">
            {project.spotlights.map((spotlight) => (
                <article key={spotlight.label}>
                    <span>{spotlight.label}</span>
                    <h3>{spotlight.title}</h3>
                    <p>{spotlight.text}</p>
                </article>
            ))}
        </div>
    </section>
)

const PriorExperienceCase = ({ project }) => (
    <main className="case-study-page case-study-page--prior">
        <nav className="case-study-nav" aria-label="프로젝트 상세 탐색">
            <Link to="/" className="case-study-nav__home">
                <span aria-hidden="true">←</span> 포트폴리오
            </Link>
            <span className="case-study-nav__count">이전 경험</span>
        </nav>
        <article className="prior-case">
            <span className="case-kicker">{project.eyebrow}</span>
            <h1>{project.title}</h1>
            <p className="prior-case__summary">{project.summary}</p>
            <dl className="prior-case__facts">
                <div>
                    <dt>기간</dt>
                    <dd>{project.period}</dd>
                </div>
                <div>
                    <dt>담당</dt>
                    <dd>{project.role}</dd>
                </div>
                <div>
                    <dt>구성</dt>
                    <dd>WebSocket 제어 / WebRTC 및 RTP 미디어 / FFmpeg 및 GStreamer HLS</dd>
                </div>
                <div>
                    <dt>개선</dt>
                    <dd>HLS 재생 지연 약 30초 → 11초</dd>
                </div>
            </dl>
            <p className="prior-case__note">{project.status.text}</p>
            <div className="prior-case__links">
                {project.links.map((link) => (
                    <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                        {link.label} ↗
                    </a>
                ))}
            </div>
        </article>
    </main>
)

const ProjectCaseStudy = ({ projectId }) => {
    const project = projectsById[projectId]

    if (!project) {
        return null
    }

    if (project.presentation === "prior-experience") {
        return <PriorExperienceCase project={project} />
    }

    const projectIndex = navigableCaseStudies.findIndex((item) => item.id === projectId)
    const nextProject = navigableCaseStudies[(projectIndex + 1) % navigableCaseStudies.length]
    const hasArchitecture = Boolean(project.architecture)
    const problemSectionNumber = hasArchitecture ? "03" : "02"
    const proofSectionNumber = hasArchitecture ? "04" : "03"
    const metaSectionNumber = hasArchitecture ? "05" : "04"

    return (
        <main className={`case-study-page case-study-page--${project.visual}`}>
            <nav className="case-study-nav" aria-label="프로젝트 상세 탐색">
                <Link to="/" className="case-study-nav__home">
                    <span aria-hidden="true">←</span> 포트폴리오
                </Link>
                <span className="case-study-nav__count">
                    프로젝트 {project.index} /{" "}
                    {String(navigableCaseStudies.length).padStart(2, "0")}
                </span>
            </nav>

            <article className="case-study">
                <header className="case-hero">
                    <div className="case-hero__heading">
                        <span className="case-kicker">{project.eyebrow}</span>
                        <h1>{project.title}</h1>
                    </div>
                    <div className="case-hero__intro">
                        <p>{project.summary}</p>
                        <ul className="case-hero__tags" aria-label="주요 기술">
                            {project.tags.map((tag) => (
                                <li key={tag}>{tag}</li>
                            ))}
                        </ul>
                    </div>
                </header>

                <section className="case-snapshot" aria-labelledby="snapshot-title">
                    <div className="case-section-heading">
                        <span>00</span>
                        <h2 id="snapshot-title">프로젝트 개요</h2>
                    </div>
                    <dl className="case-snapshot__grid">
                        <div>
                            <dt>구분</dt>
                            <dd>{project.category}</dd>
                        </div>
                        <div>
                            <dt>기간</dt>
                            <dd>{project.period}</dd>
                        </div>
                        <div>
                            <dt>담당</dt>
                            <dd>{project.role}</dd>
                        </div>
                        <div>
                            <dt>핵심 과제</dt>
                            <dd>{project.oneLine}</dd>
                        </div>
                    </dl>
                    <aside className="case-status" aria-label={project.status.label}>
                        <span>{project.status.label}</span>
                        <p>{project.status.text}</p>
                    </aside>
                </section>

                <section className="case-system" aria-labelledby="system-title">
                    <div className="case-section-heading">
                        <span>01</span>
                        <h2 id="system-title">시스템 구성</h2>
                    </div>
                    <ProjectVisual project={project} />
                    {project.services ? <BatonServices services={project.services} /> : null}
                    <p className="case-system__caption">{project.visualCaption}</p>
                </section>

                {hasArchitecture ? <ArchitectureSection project={project} /> : null}

                <section className="case-problems" aria-labelledby="problems-title">
                    <div className="case-section-heading">
                        <span>{problemSectionNumber}</span>
                        <h2 id="problems-title">고민과 해결</h2>
                    </div>
                    <div className="case-problems__list">
                        {project.problems.map((problem) => (
                            <article className="case-problem" key={problem.number}>
                                <div className="case-problem__title">
                                    <span>{problem.number}</span>
                                    <h3>{problem.title}</h3>
                                </div>
                                <dl className="case-problem__story">
                                    <div>
                                        <dt>고민</dt>
                                        <dd>{problem.constraint}</dd>
                                    </div>
                                    <div>
                                        <dt>설계</dt>
                                        <dd>{problem.decision}</dd>
                                    </div>
                                    <div>
                                        <dt>검증</dt>
                                        <dd>{problem.validation}</dd>
                                    </div>
                                    <div>
                                        <dt>남은 한계</dt>
                                        <dd>{problem.boundary}</dd>
                                    </div>
                                </dl>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="case-proof" aria-labelledby="proof-title">
                    <div className="case-section-heading">
                        <span>{proofSectionNumber}</span>
                        <h2 id="proof-title">검증 결과</h2>
                    </div>
                    <div className="case-proof__grid">
                        {project.proofs.map((proof) => (
                            <div className="case-proof__item" key={proof.label}>
                                <strong>{proof.value}</strong>
                                <span>{proof.label}</span>
                                <p>{proof.detail}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="case-meta" aria-labelledby="stack-title">
                    <div className="case-meta__stack">
                        <div className="case-section-heading">
                            <span>{metaSectionNumber}</span>
                            <h2 id="stack-title">사용 기술</h2>
                        </div>
                        <ul>
                            {project.stack.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="case-meta__links">
                        <div className="case-section-heading">
                            <span>LINK</span>
                            <h2>관련 링크</h2>
                        </div>
                        {project.links.length > 0 ? (
                            <ul>
                                {project.links.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href} target="_blank" rel="noreferrer">
                                            <span>{link.label}</span>
                                            <span aria-hidden="true">↗</span>
                                        </a>
                                        <p>{link.note}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="case-meta__link-note">{project.linkNote}</p>
                        )}
                    </div>
                </section>
            </article>

            <footer className="case-next">
                <Link to={nextProject.route}>
                    <span>다음 사례 / {nextProject.index}</span>
                    <strong>{nextProject.title}</strong>
                    <span className="case-next__arrow" aria-hidden="true">
                        →
                    </span>
                </Link>
            </footer>
        </main>
    )
}

export default ProjectCaseStudy

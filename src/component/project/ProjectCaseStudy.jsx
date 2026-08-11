import { Link } from "react-router-dom"
import { navigableCaseStudies, projectsById } from "../../data/projects"
import ProjectScreenshotGallery from "../ProjectScreenshotGallery"
import "../../css/Project.css"

const ProductVisual = ({ project }) => <ProjectScreenshotGallery project={project} context="case" />

const BatonServices = ({ services }) => {
    const core = services.find((service) => service.primary)
    const supporting = services.filter((service) => !service.primary)

    return (
        <div className="case-service-map" aria-label="BATON 서비스 책임 경계">
            <article className="case-service-map__core">
                <div>
                    <span>
                        CORE / {core.kind} / {core.database}
                    </span>
                    <strong>{core.name}</strong>
                    <h3>{core.role}</h3>
                </div>
                <p>{core.detail}</p>
                <em>{core.evidence}</em>
            </article>
            <div className="case-service-map__divider">
                <span>3개의 독립 마이크로서비스</span>
            </div>
            <div className="case-service-map__children">
                {supporting.map((service) => (
                    <Link
                        key={service.name}
                        to={service.route}
                        aria-label={`BATON ${service.name} 마이크로서비스 상세 보기`}
                    >
                        <span>
                            {service.kind} / {service.database}
                        </span>
                        <strong>{service.name}</strong>
                        <h3>{service.role}</h3>
                        <p>{service.detail}</p>
                        <em>{service.evidence}</em>
                        <b>
                            마이크로서비스 상세 보기 <span aria-hidden="true">↗</span>
                        </b>
                    </Link>
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
    <section
        className="case-architecture"
        id="project-architecture"
        aria-labelledby="architecture-title"
    >
        <div className="case-section-heading">
            <span aria-hidden="true">## 02</span>
            <h2 id="architecture-title">설계 판단</h2>
        </div>
        <div className="case-architecture__intro">
            <span>{project.architecture.label}</span>
            <h3>{project.architecture.title}</h3>
            <div>
                <p>{project.architecture.description}</p>
                <blockquote>
                    <strong>트레이드오프</strong>
                    {project.architecture.tradeoff}
                </blockquote>
            </div>
        </div>
    </section>
)

const CaseDocuments = ({ documentGroups, documents, sectionNumber }) => (
    <section className="case-documents" id="project-documents" aria-labelledby="documents-title">
        <div className="case-section-heading">
            <span>{sectionNumber}</span>
            <h2 id="documents-title">문서 분류와 대표 문서</h2>
        </div>
        <p className="case-documents__intro">
            문서 종류별 역할을 구분하고, 기술 선택과 운영 판단을 확인할 대표 문서를 골랐습니다.
        </p>
        <div className="case-document-catalog" aria-label="문서 분류">
            {documentGroups.map((group) => (
                <article key={group.id}>
                    <code>{group.label}</code>
                    <strong>{group.count}</strong>
                    <p>{group.summary}</p>
                </article>
            ))}
        </div>
        <div className="case-representative-documents">
            <h3>
                <span aria-hidden="true">###</span> 대표 문서
            </h3>
            <ul>
                {documents.map((doc) => (
                    <li key={doc.href}>
                        <a
                            href={doc.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${doc.label} 대표 문서 새 창에서 보기`}
                        >
                            <code>[{doc.type}]</code>
                            <strong>{doc.label}</strong>
                            <span aria-hidden="true">↗</span>
                        </a>
                        <p>{doc.note}</p>
                    </li>
                ))}
            </ul>
        </div>
    </section>
)

const CaseSectionNavigation = ({ hasArchitecture, hasDocuments }) => {
    const sections = [
        { href: "#project-overview", label: "개요" },
        { href: "#project-system", label: "화면 및 구성" },
        ...(hasArchitecture ? [{ href: "#project-architecture", label: "설계" }] : []),
        { href: "#project-problems", label: "문제 해결" },
        ...(hasDocuments ? [{ href: "#project-documents", label: "문서" }] : []),
    ]

    return (
        <nav className="case-section-nav" aria-label="상세 섹션 바로가기">
            <span className="case-section-nav__label" aria-hidden="true">
                페이지 내 이동
            </span>
            <ul>
                {sections.map((section) => (
                    <li key={section.href}>
                        <a href={section.href}>{section.label}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

const PriorExperienceCase = ({ project }) => {
    const [technology, ...subject] = project.title.split(" ")

    return (
        <main className="case-study-page case-study-page--prior" id="main-content">
            <a className="skip-link" href="#prior-project-title">
                본문으로 건너뛰기
            </a>
            <nav className="case-study-nav" aria-label="프로젝트 상세 탐색">
                <Link to="/" className="case-study-nav__home">
                    <span aria-hidden="true">←</span> 포트폴리오
                </Link>
                <span className="case-study-nav__count">교육 프로젝트</span>
            </nav>
            <article className="prior-case">
                <span className="case-kicker">{project.eyebrow}</span>
                <h1
                    id="prior-project-title"
                    aria-label={project.title}
                    data-route-heading={project.route}
                >
                    <span>{technology}</span>
                    <span>{subject.join(" ")}</span>
                </h1>
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
}

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
    const hasDocuments = Boolean(project.documents?.length)
    const problemSectionNumber = hasArchitecture ? "03" : "02"
    const proofSectionNumber = hasArchitecture ? "04" : "03"
    const documentSectionNumber = hasArchitecture ? "05" : "04"
    const metaSectionNumber = hasArchitecture ? (hasDocuments ? "06" : "05") : "04"

    return (
        <main className={`case-study-page case-study-page--${project.visual}`} id="main-content">
            <a className="skip-link" href="#project-title">
                본문으로 건너뛰기
            </a>
            <nav className="case-study-nav" aria-label="프로젝트 상세 탐색">
                <Link to="/" className="case-study-nav__home">
                    <span aria-hidden="true">←</span> 포트폴리오
                </Link>
                <span className="case-study-nav__count">
                    주요 프로젝트 {project.index} /{" "}
                    {String(navigableCaseStudies.length).padStart(2, "0")}
                </span>
            </nav>

            <article className="case-study">
                <header className="case-hero">
                    <div className="case-hero__heading">
                        <span className="case-kicker">{project.eyebrow}</span>
                        <h1 id="project-title" data-route-heading={project.route}>
                            {project.title}
                        </h1>
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

                <CaseSectionNavigation
                    hasArchitecture={hasArchitecture}
                    hasDocuments={hasDocuments}
                />

                <section
                    className="case-snapshot"
                    id="project-overview"
                    aria-labelledby="snapshot-title"
                >
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

                <section className="case-system" id="project-system" aria-labelledby="system-title">
                    <div className="case-section-heading">
                        <span>01</span>
                        <h2 id="system-title">대표 화면 및 서비스 구성</h2>
                    </div>
                    <ProjectVisual project={project} />
                    {project.services ? <BatonServices services={project.services} /> : null}
                    <p className="case-system__caption">{project.visualCaption}</p>
                </section>

                {hasArchitecture ? <ArchitectureSection project={project} /> : null}

                <section
                    className="case-problems"
                    id="project-problems"
                    aria-labelledby="problems-title"
                >
                    <div className="case-section-heading">
                        <span>{problemSectionNumber}</span>
                        <h2 id="problems-title">대표 문제 해결</h2>
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
                                    <div>
                                        <dt>트레이드오프와 한계</dt>
                                        <dd>{problem.boundary}</dd>
                                    </div>
                                </dl>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="case-proof" id="project-proof" aria-labelledby="proof-title">
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

                {hasDocuments ? (
                    <CaseDocuments
                        documentGroups={project.documentGroups}
                        documents={project.documents}
                        sectionNumber={documentSectionNumber}
                    />
                ) : null}

                <section className="case-meta" id="project-stack" aria-labelledby="stack-title">
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

import { Link } from "react-router-dom"
import { navigableCaseStudies, projectsById } from "../../data/projects"
import ProjectScreenshotGallery from "../ProjectScreenshotGallery"
import BatonServiceSwitcher from "./BatonServiceSwitcher"
import ProblemSolutionList from "./ProblemSolutionList"
import ProjectEvidenceList from "./ProjectEvidenceList"
import ProjectSwitcher from "./ProjectSwitcher"
import "../../css/Project.css"

const ProductVisual = ({ project }) => <ProjectScreenshotGallery project={project} context="case" />

const ProjectLabels = ({ project }) => {
    const labels = [project.stage, project.visibility].filter(Boolean).slice(0, 2)

    if (labels.length === 0) {
        return null
    }

    return (
        <ul className="case-project-labels" aria-label={`프로젝트 상태: ${labels.join(", ")}`}>
            {labels.map((label) => (
                <li key={label}>{label}</li>
            ))}
        </ul>
    )
}

const ProjectEvidenceLinks = ({ project }) => {
    const candidates = [
        project.links?.[0]
            ? {
                  ...project.links[0],
                  shortLabel: project.links[0].href.includes("github.com")
                      ? "GitHub 저장소"
                      : project.links[0].label,
              }
            : null,
        project.documents?.[0]
            ? {
                  href: project.documents[0].href,
                  label: `대표 문서: ${project.documents[0].label}`,
                  shortLabel: "대표 문서",
              }
            : null,
    ].filter(Boolean)
    const links = candidates.filter(
        (link, index) =>
            candidates.findIndex((candidate) => candidate.href === link.href) === index,
    )

    if (links.length === 0) {
        return null
    }

    return (
        <ul className="case-hero__evidence" aria-label="프로젝트 자료 바로가기">
            {links.map((link) => (
                <li key={link.href}>
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${link.label} 새 창에서 보기`}
                    >
                        {link.shortLabel ?? link.label}
                        <span aria-hidden="true">↗</span>
                    </a>
                </li>
            ))}
        </ul>
    )
}

const ProblemList = ({ problems, additional = false }) => (
    <ProblemSolutionList
        problems={problems}
        label={additional ? "추가 문제 해결 목록" : "대표 문제 해결 목록"}
    />
)

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
                <span>{supporting.length}개의 독립 마이크로서비스</span>
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
                <span>형식 확인 / DB 반영 / 장애 대응</span>
            </div>
        </div>
    </div>
)

const WarrantVisual = () => (
    <div
        className="case-visual case-visual--warrant"
        role="img"
        aria-label="사법기관 KICS의 전자영장 요청이 독립망 간 집행포털 연계 계층을 거쳐 금융기관 및 통신사로 전달되고, 제출 자료가 KICS 업무 시스템으로 돌아오는 흐름"
    >
        <div className="warrant-map__label">LG CNS 컨소시엄 / 독립망 간 기관 연계</div>
        <div className="warrant-map">
            <div className="warrant-map__node warrant-map__node--requester">
                <small>Request</small>
                <strong>사법기관 KICS 업무망</strong>
                <span>자료 제공 요청</span>
            </div>
            <div className="warrant-map__connector" aria-hidden="true">
                <span>전자영장 요청</span>
            </div>
            <div className="warrant-map__node warrant-map__node--portal">
                <small>Portal / Interface</small>
                <strong>전자영장 집행포털</strong>
                <span>계약 확인 / 데이터 변환 / 상태 처리</span>
            </div>
            <div className="warrant-map__connector" aria-hidden="true">
                <span>독립망 전달</span>
            </div>
            <div className="warrant-map__responders">
                <small>Response</small>
                <strong>금융기관 업무망</strong>
                <strong>통신사 업무망</strong>
            </div>
        </div>
        <div className="warrant-map__return" aria-hidden="true">
            <span>독립망 제출 자료</span>
            <i />
            <strong>KICS 업무 반영</strong>
        </div>
    </div>
)

const ProjectVisual = ({ project }) => {
    if (project.presentation === "featured") {
        return <ProductVisual project={project} />
    }

    if (project.visual === "warrant") {
        return <WarrantVisual />
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

const CaseSectionNavigation = ({ hasArchitecture, hasDocuments, systemNavLabel }) => {
    const sections = [
        { href: "#project-overview", label: "개요" },
        { href: "#project-system", label: systemNavLabel ?? "대표 화면" },
        ...(hasArchitecture ? [{ href: "#project-architecture", label: "설계" }] : []),
        { href: "#project-problems", label: "문제 해결" },
        { href: "#project-proof", label: "테스트 및 결과" },
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
                <ProjectSwitcher contextLabel="경력 및 개인 프로젝트" />
            </nav>
            <article className="prior-case">
                <div className="case-kicker prior-case__kicker">
                    <span>교육 프로젝트</span>
                    <span>{project.eyebrow}</span>
                </div>
                <h1
                    id="prior-project-title"
                    aria-label={project.title}
                    data-route-heading={project.route}
                    tabIndex={-1}
                >
                    <span>{technology}</span>
                    <span>{subject.join(" ")}</span>
                </h1>
                <ProjectLabels project={project} />
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
                        <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${link.label} 새 창에서 보기`}
                            key={link.href}
                        >
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
    const evidenceTitle =
        project.evidenceTitle ??
        (project.projectType === "career" ? "주요 구현 및 확인 결과" : "테스트 범위 및 운영 이력")
    const problemSectionNumber = hasArchitecture ? "03" : "02"
    const proofSectionNumber = hasArchitecture ? "04" : "03"
    const documentSectionNumber = hasArchitecture ? "05" : "04"
    const metaSectionNumber = hasArchitecture ? (hasDocuments ? "06" : "05") : "04"
    const featuredProblemNumbers =
        project.featuredProblemNumbers ?? project.problems.map((problem) => problem.number)
    const featuredProblems = featuredProblemNumbers
        .map((number) => project.problems.find((problem) => problem.number === number))
        .filter(Boolean)
    const featuredProblemSet = new Set(featuredProblems.map((problem) => problem.number))
    const additionalProblems = project.problems.filter(
        (problem) => !featuredProblemSet.has(problem.number),
    )

    return (
        <main className={`case-study-page case-study-page--${project.visual}`} id="main-content">
            <a className="skip-link" href="#project-title">
                본문으로 건너뛰기
            </a>
            <nav className="case-study-nav" aria-label="프로젝트 상세 탐색">
                <Link to="/" className="case-study-nav__home">
                    <span aria-hidden="true">←</span> 포트폴리오
                </Link>
                <ProjectSwitcher currentProjectId={projectId} />
            </nav>

            <article className="case-study">
                <header className="case-hero">
                    <div className="case-hero__heading">
                        <span className="case-kicker">{project.eyebrow}</span>
                        <h1 id="project-title" data-route-heading={project.route} tabIndex={-1}>
                            {project.title}
                        </h1>
                    </div>
                    <div className="case-hero__intro">
                        <p>{project.summary}</p>
                        <div className="case-hero__support">
                            <ProjectLabels project={project} />
                            <ProjectEvidenceLinks project={project} />
                        </div>
                    </div>
                </header>

                {project.services ? <BatonServiceSwitcher services={project.services} /> : null}

                <CaseSectionNavigation
                    hasArchitecture={hasArchitecture}
                    hasDocuments={hasDocuments}
                    systemNavLabel={project.systemNavLabel}
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
                        <h2 id="system-title">{project.systemTitle ?? "대표 화면"}</h2>
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
                    <ProblemList problems={featuredProblems} />
                    {additionalProblems.length > 0 ? (
                        <details className="case-problems__more">
                            <summary>
                                추가 문제 해결 {additionalProblems.length}건 보기
                                <span aria-hidden="true" />
                            </summary>
                            <ProblemList problems={additionalProblems} additional />
                        </details>
                    ) : null}
                </section>

                <section className="case-proof" id="project-proof" aria-labelledby="proof-title">
                    <div className="case-section-heading">
                        <span>{proofSectionNumber}</span>
                        <h2 id="proof-title">{evidenceTitle}</h2>
                    </div>
                    <ProjectEvidenceList proofs={project.proofs} label={`${evidenceTitle} 목록`} />
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
                    <span>
                        다음 프로젝트 / {nextProject.projectType === "career" ? "경력" : "개인"}{" "}
                        {nextProject.index}
                    </span>
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

import { Link } from "react-router-dom"
import { educationCaseStudies, navigableCaseStudies, projectsById } from "../../data/projects"
import { caseResults, caseIntroductions, problemHighlights } from "../../data/caseHighlights"
import featuredCasePresentations from "../../data/featuredProblems"
import ProjectScreenshotGallery from "../ProjectScreenshotGallery"
import PortfolioNavigation from "../PortfolioNavigation"
import BatonServiceSwitcher from "./BatonServiceSwitcher"
import CaseMetaSection from "./CaseMetaSection"
import CaseDesignCredit from "./CaseDesignCredit"
import CaseSectionNavigation from "./CaseSectionNavigation"
import ProblemSolutionList from "./ProblemSolutionList"
import ProjectEvidenceList from "./ProjectEvidenceList"
import ProjectSwitcher from "./ProjectSwitcher"
import BatonArchitectureDiagram from "./diagrams/BatonArchitectureDiagram"
import HopeCommitFlowDiagram from "./diagrams/HopeCommitFlowDiagram"
import PortfolioFlowDiagram from "./diagrams/PortfolioFlowDiagram"
import WarrantIntegrationDiagram from "./diagrams/WarrantIntegrationDiagram"
import "../../css/Project.css"
import "../../css/EditorialDiagram.css"
import "../../css/CaseShowcase.css"
import VerificationRail from "./VerificationRail"

const projectTypeShortLabels = {
    career: "경력",
    personal: "개인",
    tooling: "도구",
    webapp: "웹앱",
    education: "교육",
}

const projectNavigationOrder = [...navigableCaseStudies, ...educationCaseStudies]

const getProjectPositionLabel = (project) => {
    const typeLabel = projectTypeShortLabels[project.projectType]

    return project.projectType === "education" ? typeLabel : `${typeLabel} ${project.index}`
}

const ProjectPagerLink = ({ direction, project }) => {
    const isPrevious = direction === "previous"

    return (
        <Link className={`case-next__link case-next__link--${direction}`} to={project.route}>
            <span className="case-next__label">
                {isPrevious ? "이전 프로젝트" : "다음 프로젝트"} /{" "}
                {getProjectPositionLabel(project)}
            </span>
            <strong>{project.title}</strong>
            <span className="case-next__arrow" aria-hidden="true">
                {isPrevious ? "←" : "→"}
            </span>
        </Link>
    )
}

const ProjectPager = ({ currentProjectId }) => {
    const currentIndex = projectNavigationOrder.findIndex(
        (project) => project.id === currentProjectId,
    )
    const previousProject = currentIndex > 0 ? projectNavigationOrder[currentIndex - 1] : null
    const nextProject =
        currentIndex >= 0 && currentIndex < projectNavigationOrder.length - 1
            ? projectNavigationOrder[currentIndex + 1]
            : null

    if (!previousProject && !nextProject) {
        return null
    }

    return (
        <nav className="case-next" aria-label="프로젝트 이전 및 다음">
            {previousProject ? (
                <ProjectPagerLink direction="previous" project={previousProject} />
            ) : null}
            {nextProject ? <ProjectPagerLink direction="next" project={nextProject} /> : null}
        </nav>
    )
}

const ProductVisual = ({ project }) => (
    <ProjectScreenshotGallery project={project} context="case-overview" />
)

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
                  shortLabel:
                      project.links[0].shortLabel ??
                      (project.links[0].href.includes("github.com")
                          ? "GitHub 저장소"
                          : project.links[0].label),
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

    return (
        <ul className="case-hero__evidence" aria-label="프로젝트 자료 바로가기">
            <li>
                <Link to={`/search?project=${project.id}`}>
                    이 프로젝트 문서 검색 <span aria-hidden="true">→</span>
                </Link>
            </li>
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

// 긴 목록은 앞의 6건만 펼치고 나머지는 접어 둔다. 남는 항목이 2건 이하면 접지 않는다.
const VISIBLE_LIST_COUNT = 6
const splitLongList = (items) =>
    items.length > VISIBLE_LIST_COUNT + 2
        ? [items.slice(0, VISIBLE_LIST_COUNT), items.slice(VISIBLE_LIST_COUNT)]
        : [items, []]

const MoreItems = ({ count, children }) => (
    <details className="case-more">
        <summary>
            나머지 {count}건 보기
            <span aria-hidden="true" />
        </summary>
        {children}
    </details>
)

const EvidenceSection = ({ proofs, title }) => {
    const [visible, rest] = splitLongList(proofs)

    return (
        <>
            <ProjectEvidenceList proofs={visible} label={`${title} 목록`} />
            {rest.length > 0 ? (
                <MoreItems count={rest.length}>
                    <ProjectEvidenceList proofs={rest} label={`${title} 나머지 목록`} />
                </MoreItems>
            ) : null}
        </>
    )
}

const DocumentItems = ({ documents }) => (
    <ul>
        {documents.map((doc) => (
            <li key={doc.href}>
                <a
                    href={doc.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${doc.label} 대표 문서 새 창에서 보기`}
                >
                    <strong>{doc.label}</strong>
                    <span aria-hidden="true">↗</span>
                </a>
                <p>{doc.note}</p>
                <span className="case-document-type">{doc.type}</span>
            </li>
        ))}
    </ul>
)

const ProjectHeroFacts = ({ project }) => (
    <dl className="case-hero-facts" aria-label="프로젝트 기간과 담당 범위">
        <div>
            <dt>담당</dt>
            <dd>{project.role}</dd>
        </div>
        <div>
            <dt>기간</dt>
            <dd>{project.period}</dd>
        </div>
    </dl>
)

const ProjectStatus = ({ project }) => (
    <aside className="case-status" aria-label={project.status.label}>
        <span>{project.status.label}</span>
        <p>{project.status.text}</p>
    </aside>
)

const ProblemList = ({ problems, projectId, additional = false }) => (
    <ProblemSolutionList
        featured={additional ? undefined : featuredCasePresentations[projectId]}
        problems={problems.map((problem) => ({
            ...problem,
            validationSummary: additional ? null : problemHighlights[projectId]?.[problem.number],
        }))}
        label={additional ? "추가 문제와 해결 방법 목록" : "주요 문제와 해결 방법 목록"}
    />
)

// 서비스별 담당 기능은 구성도 노드에서 보여 주고, 노드를 누르면 해당 서비스 상세로 이동한다.
const BatonServices = ({ services }) => (
    <div className="baton-service-overview">
        <BatonArchitectureDiagram services={services} />
    </div>
)

const ProjectVisual = ({ project }) => {
    if (project.screenshots?.length) {
        return <ProductVisual project={project} />
    }

    if (project.visual === "hope-commit") {
        return <HopeCommitFlowDiagram />
    }

    if (project.visual === "warrant") {
        return <WarrantIntegrationDiagram />
    }

    if (["intent-trace", "webrtc", "defense"].includes(project.id)) {
        return <PortfolioFlowDiagram variant={project.id} />
    }

    return null
}

const ArchitectureVisual = ({ project }) => {
    if (project.id === "hope-commit" && project.screenshots?.length) {
        return <HopeCommitFlowDiagram />
    }

    if (["youth-policy-mate", "intent-trace"].includes(project.id)) {
        return <PortfolioFlowDiagram variant={project.id} />
    }

    return null
}

const ArchitectureSection = ({ project }) => (
    <section
        className="case-architecture"
        id="project-architecture"
        aria-labelledby="architecture-title"
    >
        <div className="case-section-heading">
            <h2 id="architecture-title">구현 방법과 선택 이유</h2>
        </div>
        <div className="case-architecture__intro">
            <span>{project.architecture.label}</span>
            <h3>{project.architecture.title}</h3>
            <div>
                <p>{project.architecture.description}</p>
                <blockquote>
                    <strong>적용 범위와 제약</strong>
                    {project.architecture.tradeoff}
                </blockquote>
            </div>
        </div>
        {project.services ? (
            <>
                <BatonServices services={project.services} />
                <p className="case-system__caption">{project.visualCaption}</p>
            </>
        ) : (
            <ArchitectureVisual project={project} />
        )}
    </section>
)

const CaseDocuments = ({ documentGroups, documents, intro }) => {
    const [visible, rest] = splitLongList(documents)

    return (
        <section
            className="case-documents"
            id="project-documents"
            aria-labelledby="documents-title"
        >
            <div className="case-section-heading">
                <h2 id="documents-title">문서 분류와 대표 문서</h2>
            </div>
            <p className="case-documents__intro">
                {intro ?? "문서를 요구사항, 기술 선택, 테스트와 운영 절차로 나눴습니다."}
            </p>
            <div className="case-representative-documents">
                <DocumentItems documents={visible} />
                {rest.length > 0 ? (
                    <MoreItems count={rest.length}>
                        <DocumentItems documents={rest} />
                    </MoreItems>
                ) : null}
            </div>
            <details className="case-document-inventory">
                <summary>문서 분류와 작성 수</summary>
                <dl>
                    {documentGroups.map((group) => (
                        <div key={group.id}>
                            <dt>
                                {group.label} <span>{group.count}</span>
                            </dt>
                            <dd>{group.summary}</dd>
                        </div>
                    ))}
                </dl>
            </details>
        </section>
    )
}

const projectSections = ({ hasArchitecture, hasDocuments, systemNavLabel }) => [
    { id: "project-overview", label: "개요", mobileLabel: "개요" },
    {
        id: "project-system",
        label: systemNavLabel ?? "대표 화면",
        mobileLabel: (systemNavLabel ?? "대표 화면").includes("화면") ? "화면" : "구성",
    },
    { id: "project-problems", label: "문제 해결", mobileLabel: "문제" },
    ...(hasArchitecture
        ? [{ id: "project-architecture", label: "구현 방법", mobileLabel: "방법" }]
        : []),
    { id: "project-proof", label: "테스트 및 결과", mobileLabel: "결과" },
    ...(hasDocuments ? [{ id: "project-documents", label: "문서", mobileLabel: "문서" }] : []),
    { id: "project-stack", label: "사용 기술", mobileLabel: "기술" },
]

const PriorExperienceCase = ({ project }) => {
    const [technology, ...subject] = project.title.split(" ")
    const evidenceTitle = project.evidenceTitle ?? "구현 범위 및 확인 결과"

    return (
        <main className="case-study-page case-study-page--prior case-showcase" id="main-content">
            <a className="skip-link" href="#prior-project-title">
                본문으로 건너뛰기
            </a>
            <PortfolioNavigation
                label="프로젝트 상세 탐색"
                links={
                    <Link to="/#work">
                        <span aria-hidden="true">←</span> 프로젝트 목록
                    </Link>
                }
                actions={
                    <ProjectSwitcher currentProjectId={project.id} contextLabel="교육 프로젝트" />
                }
            />
            <article className="prior-case">
                <header className="case-hero" id="project-overview">
                    <div className="case-hero__heading">
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
                        <p className="prior-case__summary">{caseIntroductions[project.id]}</p>
                        <ProjectEvidenceLinks project={project} />
                    </div>
                    <ProjectHeroFacts project={project} />
                </header>

                <VerificationRail projectId={project.id} summary={caseResults[project.id]} />

                <section
                    className="case-system case-cover"
                    id="project-system"
                    aria-labelledby="system-title"
                >
                    <div className="case-section-heading case-cover__heading">
                        <h2 id="system-title">WebRTC 실시간 강의와 HLS 다시보기 구조</h2>
                    </div>
                    <ProjectVisual project={project} />
                    <p className="case-system__caption">{project.visualCaption}</p>
                </section>

                <CaseSectionNavigation
                    sections={projectSections({ systemNavLabel: "미디어 처리 흐름" })}
                />

                <section
                    className="case-problems"
                    id="project-problems"
                    aria-labelledby="problems-title"
                >
                    <div className="case-section-heading">
                        <h2 id="problems-title">문제와 해결 방법</h2>
                    </div>
                    <ProblemList problems={project.problems} projectId={project.id} />
                </section>

                <section className="case-proof" id="project-proof" aria-labelledby="proof-title">
                    <div className="case-section-heading">
                        <h2 id="proof-title">{evidenceTitle}</h2>
                    </div>
                    <ProjectStatus project={project} />
                    <EvidenceSection proofs={project.proofs} title={evidenceTitle} />
                </section>

                <CaseMetaSection
                    id="project-stack"
                    headingId="stack-title"
                    technologies={project.stack}
                    technologyLabel={`${project.title} 기술 스택`}
                    links={project.links}
                />
            </article>
            <ProjectPager currentProjectId={project.id} />
            <CaseDesignCredit />
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

    const hasArchitecture = Boolean(project.architecture)
    const hasDocuments = Boolean(project.documents?.length)
    const evidenceTitle =
        project.evidenceTitle ??
        (project.projectType === "career" ? "주요 구현 및 확인 결과" : "테스트 범위 및 운영 이력")
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
        <main
            className={`case-study-page case-study-page--${project.visual} case-showcase`}
            id="main-content"
        >
            <a className="skip-link" href="#project-title">
                본문으로 건너뛰기
            </a>
            <PortfolioNavigation
                label="프로젝트 상세 탐색"
                links={
                    <Link to="/#work">
                        <span aria-hidden="true">←</span> 프로젝트 목록
                    </Link>
                }
                actions={<ProjectSwitcher currentProjectId={projectId} />}
            />

            <article className="case-study">
                <header className="case-hero" id="project-overview">
                    <div className="case-hero__heading">
                        <span className="case-kicker">
                            {project.projectType === "career" ? project.category : project.eyebrow}
                        </span>
                        <h1 id="project-title" data-route-heading={project.route} tabIndex={-1}>
                            {project.title}
                        </h1>
                        <div className="case-hero__intro">
                            <p>
                                {project.agencyScope && (
                                    <strong className="case-hero__scope">
                                        {project.agencyScope}
                                    </strong>
                                )}
                                {caseIntroductions[project.id] ?? project.summary}
                            </p>
                            <div className="case-hero__support">
                                <ProjectLabels project={project} />
                                <ProjectEvidenceLinks project={project} />
                            </div>
                        </div>
                    </div>
                    <ProjectHeroFacts project={project} />
                </header>

                <VerificationRail projectId={project.id} summary={caseResults[project.id]} />

                <section
                    className="case-system case-cover"
                    id="project-system"
                    aria-labelledby="system-title"
                >
                    <div className="case-section-heading case-cover__heading">
                        <h2 id="system-title">{project.systemTitle ?? "대표 화면"}</h2>
                    </div>
                    <ProjectVisual project={project} />
                    {!project.screenshots ? (
                        <p className="case-system__caption">{project.visualCaption}</p>
                    ) : null}
                </section>

                {project.services ? <BatonServiceSwitcher services={project.services} /> : null}

                <CaseSectionNavigation
                    sections={projectSections({
                        hasArchitecture,
                        hasDocuments,
                        systemNavLabel: project.systemNavLabel,
                    })}
                />

                <section
                    className="case-problems"
                    id="project-problems"
                    aria-labelledby="problems-title"
                >
                    <div className="case-section-heading">
                        <h2 id="problems-title">문제와 해결 방법</h2>
                    </div>
                    <ProblemList problems={featuredProblems} projectId={project.id} />
                    {additionalProblems.length > 0 ? (
                        <details className="case-more">
                            <summary>
                                추가 문제 해결 {additionalProblems.length}건 보기
                                <span aria-hidden="true" />
                            </summary>
                            <ProblemList problems={additionalProblems} additional />
                        </details>
                    ) : null}
                </section>

                {hasArchitecture ? <ArchitectureSection project={project} /> : null}

                <section className="case-proof" id="project-proof" aria-labelledby="proof-title">
                    <div className="case-section-heading">
                        <h2 id="proof-title">{evidenceTitle}</h2>
                    </div>
                    <ProjectStatus project={project} />
                    <EvidenceSection proofs={project.proofs} title={evidenceTitle} />
                </section>

                {hasDocuments ? (
                    <CaseDocuments
                        documentGroups={project.documentGroups}
                        documents={project.documents}
                        intro={project.documentsIntro}
                    />
                ) : null}

                <CaseMetaSection
                    id="project-stack"
                    headingId="stack-title"
                    technologies={project.stack}
                    technologyLabel={`${project.title} 기술 스택`}
                    links={project.links}
                    linkNote={project.linkNote}
                />
            </article>

            <ProjectPager currentProjectId={projectId} />
            <CaseDesignCredit />
        </main>
    )
}

export default ProjectCaseStudy

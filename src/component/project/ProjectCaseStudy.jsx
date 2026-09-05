import { Link } from "react-router-dom"
import { navigableCaseStudies, projectsById } from "../../data/projects"
import { caseHighlights, caseIntroductions, problemHighlights } from "../../data/caseHighlights"
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

const projectTypeShortLabels = {
    career: "경력",
    personal: "개인",
    tooling: "도구",
    webapp: "웹앱",
    education: "교육",
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
        <div>
            <dt>확인 결과</dt>
            <dd>{caseHighlights[project.id]?.[2].text}</dd>
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

const BatonServices = ({ services }) => {
    const supporting = services.filter((service) => !service.primary)

    return (
        <div className="baton-service-overview">
            <BatonArchitectureDiagram services={services} />
            <section
                className="baton-service-directory"
                aria-labelledby="baton-service-directory-title"
            >
                <header className="baton-service-directory__header">
                    <h3 id="baton-service-directory-title">마이크로서비스별 담당 기능</h3>
                    <p>처리 흐름과 검증 결과는 각 서비스 상세에서 확인할 수 있습니다.</p>
                </header>
                <ul className="baton-service-directory__list">
                    {supporting.map((service) => (
                        <li key={service.name}>
                            <Link
                                to={service.route}
                                aria-label={`BATON ${service.name} 마이크로서비스 상세 보기`}
                            >
                                <div className="baton-service-directory__identity">
                                    <strong>{service.name}</strong>
                                </div>
                                <div className="baton-service-directory__description">
                                    <h4>{service.role}</h4>
                                </div>
                                <b aria-hidden="true">→</b>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

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

    if (project.id === "youth-policy-mate") {
        return <PortfolioFlowDiagram variant="youth-policy-mate" />
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

const CaseDocuments = ({ documentGroups, documents, intro }) => (
    <section className="case-documents" id="project-documents" aria-labelledby="documents-title">
        <div className="case-section-heading">
            <h2 id="documents-title">문서 분류와 대표 문서</h2>
        </div>
        <p className="case-documents__intro">
            {intro ?? "문서를 요구사항, 기술 선택, 테스트와 운영 절차로 나눴습니다."}
        </p>
        <div className="case-representative-documents">
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
                    </div>
                    <ProjectHeroFacts project={project} />
                </header>

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
                    <ProjectEvidenceList proofs={project.proofs} label={`${evidenceTitle} 목록`} />
                </section>

                <CaseMetaSection
                    id="project-stack"
                    headingId="stack-title"
                    technologies={project.stack}
                    technologyLabel={`${project.title} 기술 스택`}
                    links={project.links}
                />
            </article>
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

    const projectIndex = navigableCaseStudies.findIndex((item) => item.id === projectId)
    const nextProject = navigableCaseStudies[(projectIndex + 1) % navigableCaseStudies.length]
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
                            <p>{caseIntroductions[project.id] ?? project.summary}</p>
                            <div className="case-hero__support">
                                <ProjectLabels project={project} />
                                <ProjectEvidenceLinks project={project} />
                            </div>
                        </div>
                    </div>
                    <ProjectHeroFacts project={project} />
                </header>

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
                        <details className="case-problems__more">
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
                    <ProjectEvidenceList proofs={project.proofs} label={`${evidenceTitle} 목록`} />
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

            <footer className="case-next">
                <Link to={nextProject.route}>
                    <span>
                        다음 프로젝트 / {projectTypeShortLabels[nextProject.projectType]}{" "}
                        {nextProject.index}
                    </span>
                    <strong>{nextProject.title}</strong>
                    <span className="case-next__arrow" aria-hidden="true">
                        →
                    </span>
                </Link>
            </footer>
            <CaseDesignCredit />
        </main>
    )
}

export default ProjectCaseStudy

import { Link } from "react-router-dom"
import { navigableCaseStudies, projectsById } from "../../data/projects"
import { caseHighlights, problemHighlights } from "../../data/caseHighlights"
import ProjectScreenshotGallery from "../ProjectScreenshotGallery"
import BatonServiceSwitcher from "./BatonServiceSwitcher"
import CaseMetaSection from "./CaseMetaSection"
import CaseKeySummary from "./CaseKeySummary"
import CaseSectionNavigation from "./CaseSectionNavigation"
import ProblemSolutionList from "./ProblemSolutionList"
import ProjectEvidenceList from "./ProjectEvidenceList"
import ProjectSwitcher from "./ProjectSwitcher"
import BatonArchitectureDiagram from "./diagrams/BatonArchitectureDiagram"
import HopeCommitFlowDiagram from "./diagrams/HopeCommitFlowDiagram"
import WarrantIntegrationDiagram from "./diagrams/WarrantIntegrationDiagram"
import IntentTraceRecordPreview from "./IntentTraceRecordPreview"
import "../../css/Project.css"
import "../../css/EditorialDiagram.css"

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

const ProblemList = ({ problems, projectId, additional = false }) => (
    <ProblemSolutionList
        problems={problems.map((problem) => ({
            ...problem,
            validationSummary: additional ? null : problemHighlights[projectId]?.[problem.number],
        }))}
        label={additional ? "추가 문제와 해결 방법 목록" : "주요 문제와 해결 방법 목록"}
    />
)

const BatonServices = ({ services }) => {
    const core = services.find((service) => service.primary)
    const supporting = services.filter((service) => !service.primary)

    return (
        <div className="baton-service-overview">
            <BatonArchitectureDiagram services={services} />
            <section
                className="baton-service-directory"
                aria-labelledby="baton-service-directory-title"
            >
                <header className="baton-service-directory__header">
                    <span>{supporting.length} MICROSERVICES</span>
                    <h3 id="baton-service-directory-title">서비스별 책임과 검증 근거</h3>
                    <p>각 서비스의 입력, 저장소와 테스트 결과입니다.</p>
                </header>
                <article className="baton-service-directory__core">
                    <div>
                        <span>CORE / {core.database}</span>
                        <strong>{core.name}</strong>
                    </div>
                    <div>
                        <h4>{core.role}</h4>
                        <p>{core.detail}</p>
                    </div>
                    <em>{core.evidence}</em>
                </article>
                <ul className="baton-service-directory__list">
                    {supporting.map((service) => (
                        <li key={service.name}>
                            <Link
                                to={service.route}
                                aria-label={`BATON ${service.name} 마이크로서비스 상세 보기`}
                            >
                                <div className="baton-service-directory__identity">
                                    <span>{service.database}</span>
                                    <strong>{service.name}</strong>
                                </div>
                                <div className="baton-service-directory__description">
                                    <h4>{service.role}</h4>
                                    <p>{service.detail}</p>
                                    <em>{service.evidence}</em>
                                </div>
                                <b aria-hidden="true">↗</b>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

const DefenseVisual = () => (
    <div
        className="case-visual case-visual--defense"
        role="img"
        aria-label="군사법원, 군검찰 및 군사경찰에서 수용 대상자의 인적정보와 영장정보를 전달하고, 기관별 배치가 필수값과 형식을 검증한 뒤 군교정 DB에 반영하는 흐름"
    >
        <div className="defense-map__label">국방부 SI / 폐쇄망 기관 연계</div>
        <div className="defense-map">
            <div className="defense-map__sources">
                <span>군사법원</span>
                <span>군검찰</span>
                <span>군사경찰</span>
            </div>
            <span className="defense-map__connector" aria-hidden="true" />
            <div className="defense-map__batch">
                <small>중단 단계 확인 및 해당 배치 재실행</small>
                <strong>수용자 정보 검증 배치</strong>
                <ol className="defense-map__steps" aria-label="배치 처리 단계">
                    <li>기관별 데이터 수신</li>
                    <li>인적정보 및 영장정보 검증</li>
                    <li>군교정 DB 반영</li>
                </ol>
            </div>
            <span className="defense-map__connector" aria-hidden="true" />
            <div className="defense-map__destination">
                <small>군교정 업무 시스템</small>
                <strong>수용자 정보 반영</strong>
                <span>수용 및 후속 업무 처리</span>
            </div>
        </div>
    </div>
)

const EducationStreamingVisual = () => (
    <div
        className="case-visual case-visual--webrtc"
        role="img"
        aria-label="강의 영상을 mediasoup에서 WebRTC로 React 실시간 화면에 전달하고, mediasoup의 RTP 출력은 FFmpeg와 GStreamer에서 HLS로 변환해 React 다시보기 화면에 제공하는 흐름"
    >
        <div className="stream-map__source">
            <span className="stream-map__pulse" aria-hidden="true" />
            <small>강의 영상 입력</small>
            <strong>mediasoup</strong>
        </div>
        <div className="stream-map__lanes">
            <div className="stream-lane">
                <span className="stream-lane__label">LIVE</span>
                <span className="stream-lane__path" aria-hidden="true" />
                <div className="stream-lane__node">mediasoup → WebRTC</div>
                <div className="stream-lane__node">React 실시간 시청</div>
                <small>현재 강의 영상을 낮은 지연으로 재생</small>
            </div>
            <div className="stream-lane">
                <span className="stream-lane__label">REPLAY</span>
                <span className="stream-lane__path" aria-hidden="true" />
                <div className="stream-lane__node">RTP 출력 → FFmpeg / GStreamer</div>
                <div className="stream-lane__node">React 지난 구간 재생</div>
                <small>HLS 세그먼트와 재생 목록으로 다시보기 제공</small>
            </div>
        </div>
    </div>
)

const ProjectVisual = ({ project }) => {
    if (project.presentation === "featured") {
        return <ProductVisual project={project} />
    }

    if (project.visual === "hope-commit") {
        return <HopeCommitFlowDiagram />
    }

    if (project.visual === "intent-trace") {
        return <IntentTraceRecordPreview />
    }

    if (project.visual === "warrant") {
        return <WarrantIntegrationDiagram />
    }

    if (project.visual === "webrtc") {
        return <EducationStreamingVisual />
    }

    if (project.visual === "defense") {
        return <DefenseVisual />
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
            <span aria-hidden="true">## 02</span>
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
    </section>
)

const CaseDocuments = ({ documentGroups, documents, intro, sectionNumber }) => (
    <section className="case-documents" id="project-documents" aria-labelledby="documents-title">
        <div className="case-section-heading">
            <span>{sectionNumber}</span>
            <h2 id="documents-title">문서 분류와 대표 문서</h2>
        </div>
        <p className="case-documents__intro">
            {intro ?? "문서를 요구사항, 기술 선택, 테스트와 운영 절차로 나눴습니다."}
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

const projectSections = ({ hasArchitecture, hasDocuments, systemNavLabel }) => [
    { id: "project-overview", label: "개요", mobileLabel: "개요" },
    {
        id: "project-system",
        label: systemNavLabel ?? "대표 화면",
        mobileLabel: (systemNavLabel ?? "대표 화면").includes("화면") ? "화면" : "구성",
    },
    ...(hasArchitecture
        ? [{ id: "project-architecture", label: "구현 방법", mobileLabel: "방법" }]
        : []),
    { id: "project-problems", label: "문제 해결", mobileLabel: "문제" },
    { id: "project-proof", label: "테스트 및 결과", mobileLabel: "결과" },
    ...(hasDocuments ? [{ id: "project-documents", label: "문서", mobileLabel: "문서" }] : []),
    { id: "project-stack", label: "사용 기술", mobileLabel: "기술" },
]

const PriorExperienceCase = ({ project }) => {
    const [technology, ...subject] = project.title.split(" ")
    const evidenceTitle = project.evidenceTitle ?? "구현 범위 및 확인 결과"

    return (
        <main className="case-study-page case-study-page--prior" id="main-content">
            <a className="skip-link" href="#prior-project-title">
                본문으로 건너뛰기
            </a>
            <nav className="case-study-nav" aria-label="프로젝트 상세 탐색">
                <Link to="/" className="case-study-nav__home">
                    <span aria-hidden="true">←</span> 포트폴리오
                </Link>
                <ProjectSwitcher currentProjectId={project.id} contextLabel="교육 프로젝트" />
            </nav>
            <article className="prior-case">
                <header>
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
                </header>

                <CaseKeySummary items={caseHighlights[project.id]} />
                <CaseSectionNavigation
                    sections={projectSections({ systemNavLabel: "미디어 처리 흐름" })}
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
                            <dt>입력 및 변환</dt>
                            <dd>mediasoup RTP 입력 / FFmpeg 및 GStreamer HLS 변환</dd>
                        </div>
                        <div>
                            <dt>제공 기능</dt>
                            <dd>React WebRTC 실시간 시청 / HLS 지난 구간 다시보기</dd>
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
                        <h2 id="system-title">WebRTC 실시간 재생과 RTP 출력의 HLS 다시보기 흐름</h2>
                    </div>
                    <ProjectVisual project={project} />
                    <p className="case-system__caption">{project.visualCaption}</p>
                </section>

                <section
                    className="case-problems"
                    id="project-problems"
                    aria-labelledby="problems-title"
                >
                    <div className="case-section-heading">
                        <span>02</span>
                        <h2 id="problems-title">문제와 해결 방법</h2>
                    </div>
                    <ProblemList problems={project.problems} projectId={project.id} />
                </section>

                <section className="case-proof" id="project-proof" aria-labelledby="proof-title">
                    <div className="case-section-heading">
                        <span>03</span>
                        <h2 id="proof-title">{evidenceTitle}</h2>
                    </div>
                    <ProjectEvidenceList proofs={project.proofs} label={`${evidenceTitle} 목록`} />
                </section>

                <CaseMetaSection
                    id="project-stack"
                    headingId="stack-title"
                    sectionNumber="04"
                    technologies={project.stack}
                    technologyLabel={`${project.title} 기술 스택`}
                    links={project.links}
                />
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

                <CaseKeySummary items={caseHighlights[project.id]} />

                {project.services ? <BatonServiceSwitcher services={project.services} /> : null}

                <CaseSectionNavigation
                    sections={projectSections({
                        hasArchitecture,
                        hasDocuments,
                        systemNavLabel: project.systemNavLabel,
                    })}
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
                        intro={project.documentsIntro}
                        sectionNumber={documentSectionNumber}
                    />
                ) : null}

                <CaseMetaSection
                    id="project-stack"
                    headingId="stack-title"
                    sectionNumber={metaSectionNumber}
                    technologies={project.stack}
                    technologyLabel={`${project.title} 기술 스택`}
                    links={project.links}
                    linkNote={project.linkNote}
                />
            </article>

            <footer className="case-next">
                <Link to={nextProject.route}>
                    <span>
                        다음 프로젝트 /{" "}
                        {nextProject.projectType === "career"
                            ? "경력"
                            : nextProject.projectType === "tooling"
                              ? "도구"
                              : "개인"}{" "}
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

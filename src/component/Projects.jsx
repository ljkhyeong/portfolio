import { Link } from "react-router-dom"
import { homeProjectCategories, projectSummaries } from "../data/projectSummaries"
import { caseResults, caseIntroductions } from "../data/caseHighlights"
import featuredProblems from "../data/featuredProblems"
import "../css/Projects.css"

const PROJECT_TYPE_LABELS = {
    career: "경력 프로젝트",
    personal: "개인 프로젝트",
    tooling: "오픈소스 및 개발 도구",
    webapp: "웹앱",
    education: "교육 프로젝트",
}

const ProjectFacts = ({ project }) => (
    <dl className="project-card__facts" aria-label={`${project.title} 문제, 구현과 검증`}>
        <div>
            <dt>문제</dt>
            <dd>{project.homeFacts.problem}</dd>
        </div>
        <div>
            <dt>구현</dt>
            <dd>{project.homeFacts.solution}</dd>
        </div>
        <div>
            <dt>검증</dt>
            <dd>{caseResults[project.id]}</dd>
        </div>
    </dl>
)

const ProjectMeta = ({ project }) => (
    <div className="project-card__meta">
        <div className="project-card__status" aria-label={`${project.title} 진행 및 공개 상태`}>
            <span>{project.stage}</span>
            <span>{project.visibility}</span>
            <time>{project.period}</time>
        </div>
        <ul aria-label={`${project.title} 기술 스택`}>
            {project.tags.slice(0, 4).map((tag) => (
                <li key={tag}>{tag}</li>
            ))}
        </ul>
    </div>
)

const ProjectLinks = ({ project, supporting = false }) => (
    <div className={supporting ? "project-support__actions" : "project-card__actions"}>
        <Link
            className={supporting ? "project-support__link" : "project-card__detail-link"}
            to={project.route}
            aria-label={`${project.title} 프로젝트 상세 보기`}
        >
            상세 보기 <span aria-hidden="true">→</span>
        </Link>
        {project.liveSite && (
            <a
                className="project-repository-link"
                href={project.liveSite.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} ${project.liveSite.label} 새 창에서 보기`}
            >
                {project.liveSite.label} <span aria-hidden="true">↗</span>
            </a>
        )}
        {project.homeRepository && (
            <a
                className="project-repository-link"
                href={project.homeRepository.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} ${project.homeRepository.label} 저장소 새 창에서 보기`}
            >
                {project.homeRepository.label} <span aria-hidden="true">↗</span>
            </a>
        )}
    </div>
)

// 대표 프로젝트의 구조를 작은 화면 캡처 대신 읽을 수 있는 크기의 지도와 처리 순서로 보여 준다.
const BatonSystemMap = ({ project }) => (
    <nav className="project-glance project-glance--system" aria-label="BATON 마이크로서비스 상세">
        <div className="project-glance__core">
            <strong>Core</strong>
            <span>{project.coreRole}</span>
        </div>
        <ul>
            {project.serviceLinks.map((service) => (
                <li key={service.id}>
                    <Link
                        to={service.route}
                        aria-label={`BATON ${service.name} 마이크로서비스 상세 보기`}
                    >
                        <strong>{service.name}</strong>
                        <span>{service.role}</span>
                    </Link>
                </li>
            ))}
        </ul>
    </nav>
)

const ProcessingSteps = ({ label, steps }) => (
    <figure className="project-glance project-glance--steps">
        <figcaption>{label}</figcaption>
        <ol>
            {steps.map((step) => (
                <li key={step.title}>
                    <strong>{step.title}</strong>
                    <span>{step.description}</span>
                </li>
            ))}
        </ol>
    </figure>
)

const ProjectGlance = ({ project }) => {
    if (project.serviceLinks) {
        return <BatonSystemMap project={project} />
    }
    if (project.id === "happygallery") {
        return (
            <ProcessingSteps
                label="결제·환불 처리 순서"
                steps={featuredProblems.happygallery.steps}
            />
        )
    }
    return null
}

const FeaturedProjectCard = ({ project }) => (
    <li className="project-showcase__item">
        <article>
            <header className="project-card__header">
                <span className="project-card__eyebrow">
                    {project.homeTypeLabel || PROJECT_TYPE_LABELS[project.projectType]}
                </span>
                <h4 className="project-card__title">
                    <Link to={project.route}>{project.title}</Link>
                </h4>
                {project.collaboration && (
                    <p className="project-card__collaboration">{project.collaboration}</p>
                )}
                <p className="project-card__summary">
                    {project.agencyScope && (
                        <strong className="project-card__scope">{project.agencyScope}</strong>
                    )}
                    {project.homeSummary}
                </p>
                <ProjectGlance project={project} />
            </header>
            <div className="project-card__content">
                <ProjectFacts project={project} />
                <ProjectMeta project={project} />
                <ProjectLinks project={project} />
            </div>
        </article>
    </li>
)

const SupportingProjectCard = ({ project }) => (
    <li className="project-support__item">
        <article>
            <header className="project-support__identity">
                <span>
                    {project.homeTypeLabel || PROJECT_TYPE_LABELS[project.projectType]} /{" "}
                    {project.stage}
                </span>
                <h4>
                    <Link to={project.route}>{project.title}</Link>
                </h4>
            </header>
            <p className="project-support__summary">
                {project.agencyScope && (
                    <strong className="project-card__scope">{project.agencyScope}</strong>
                )}
                {caseIntroductions[project.id] || project.summary}
            </p>
            <ProjectLinks project={project} supporting />
        </article>
    </li>
)

const Projects = () => {
    const groups = homeProjectCategories.map((category) => ({
        ...category,
        projects: projectSummaries.filter((project) => project.homeCategory === category.id),
    }))

    return (
        <section className="work-section" id="work" aria-labelledby="projects-title">
            <div className="project-index__intro">
                <h2 id="projects-title">프로젝트</h2>
            </div>

            <nav className="project-categories" aria-label="프로젝트 유형 바로가기">
                {groups.map((group) => (
                    <a key={group.id} href={`#projects-${group.id}`}>
                        <span>{group.label}</span>
                        <span className="project-categories__count">{group.projects.length}개</span>
                        <span aria-hidden="true">↓</span>
                    </a>
                ))}
            </nav>

            {groups.map((group) => (
                <section
                    key={group.id}
                    className="project-group"
                    id={`projects-${group.id}`}
                    aria-labelledby={`projects-${group.id}-title`}
                >
                    <div className="project-section-heading">
                        <h3 id={`projects-${group.id}-title`}>{group.label}</h3>
                        <span>{group.projects.length}개</span>
                    </div>
                    <ol className="project-group__list" aria-label={`${group.label} 목록`}>
                        {group.projects.map((project) =>
                            project.homeFacts ? (
                                <FeaturedProjectCard key={project.id} project={project} />
                            ) : (
                                <SupportingProjectCard key={project.id} project={project} />
                            ),
                        )}
                    </ol>
                </section>
            ))}
        </section>
    )
}

export default Projects

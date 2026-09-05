import { Link } from "react-router-dom"
import { homeProjectCategories, projectSummaries } from "../data/projectSummaries"
import { caseHighlights, caseIntroductions } from "../data/caseHighlights"
import { assetPath } from "../utils/assetPath"
import "../css/Projects.css"

const FEATURED_PROJECT_IDS = ["warrant", "baton", "happygallery"]

const PROJECT_TYPE_LABELS = {
    career: "경력 프로젝트",
    personal: "개인 프로젝트",
    tooling: "오픈소스 및 개발 도구",
    webapp: "웹앱",
    education: "교육 프로젝트",
}

const PROJECT_VISUALS = {
    baton: {
        src: "baton-core-today.webp",
        alt: "BATON 오늘 화면에서 업무 회차와 미완료 업무 및 수락 대기 인수인계를 확인하는 모습",
        width: 1440,
        height: 900,
        caption: "업무 회차, 미완료 업무와 수락 대기 인수인계",
    },
    gallery: {
        src: "happygallery-product-options.webp",
        alt: "happyGallery 상품 상세에서 색상과 각인 옵션을 선택하고 조합별 가격과 재고를 확인하는 모습",
        width: 1440,
        height: 960,
        caption: "상품 옵션, 조합별 가격과 재고 확인",
    },
}

const ProjectFacts = ({ project }) => (
    <dl className="project-card__facts" aria-label={`${project.title} 문제, 구현과 검증`}>
        {[
            ["문제", "문제"],
            ["구현", "해결"],
        ].map(([label, source]) => (
            <div key={label}>
                <dt>{label}</dt>
                <dd>{project.homeFacts.find((fact) => fact.label === source)?.value}</dd>
            </div>
        ))}
        <div>
            <dt>검증</dt>
            <dd>{caseHighlights[project.id].find((item) => item.label === "확인 결과").text}</dd>
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
            상세 보기 <span aria-hidden="true">↗</span>
        </Link>
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

const ProjectServices = ({ project }) => {
    if (!project.serviceLinks) {
        return null
    }

    return (
        <nav className="project-card__services" aria-label="BATON 마이크로서비스 상세">
            <div className="project-card__service-map">
                <strong>CORE</strong>
                <span aria-hidden="true">→</span>
                <ul>
                    {project.serviceLinks.map((service) => (
                        <li key={service.id}>
                            <Link
                                to={service.route}
                                aria-label={`BATON ${service.name} 마이크로서비스 상세 보기`}
                            >
                                {service.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

const ScreenshotVisual = ({ project }) => {
    const visual = PROJECT_VISUALS[project.visual]

    if (!visual) {
        return null
    }

    return (
        <figure
            className={`project-card__visual project-card__visual--image project-card__visual--${project.visual}`}
        >
            <div className="project-card__preview">
                <img
                    src={assetPath(visual.src)}
                    alt={visual.alt}
                    width={visual.width}
                    height={visual.height}
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <figcaption>{visual.caption}</figcaption>
        </figure>
    )
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
                {PROJECT_VISUALS[project.visual] && (
                    <Link
                        className="project-card__visual-link"
                        to={project.route}
                        aria-label={`${project.title} 미리보기에서 상세 보기`}
                    >
                        <ScreenshotVisual project={project} />
                    </Link>
                )}
            </header>
            <div className="project-card__content">
                <ProjectFacts project={project} />
                <ProjectMeta project={project} />
                <ProjectLinks project={project} />
                <ProjectServices project={project} />
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
                            FEATURED_PROJECT_IDS.includes(project.id) ? (
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

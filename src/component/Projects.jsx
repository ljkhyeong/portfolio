import { Link } from "react-router-dom"
import { projectSummaries } from "../data/projectSummaries"
import { assetPath } from "../utils/assetPath"
import "../css/Projects.css"

const FEATURED_PROJECT_IDS = ["warrant", "baton", "happygallery"]
const SUPPORTING_PROJECT_IDS = [
    "youth-policy-mate",
    "defense",
    "hope-commit",
    "intent-trace",
    "webrtc",
]

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

const getProjectsInOrder = (ids) =>
    ids.map((id) => projectSummaries.find((project) => project.id === id)).filter(Boolean)

const ProjectHighlights = ({ project }) => (
    <ul className="project-card__highlights" aria-label={`${project.title} 핵심 구현`}>
        {project.homeHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
        ))}
    </ul>
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
            <span>서비스 맵</span>
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

const WarrantVisual = () => (
    <div
        className="project-card__visual project-card__visual--warrant"
        role="img"
        aria-label="KICS 요청을 연계 서버가 기관 규격으로 변환해 통신사와 전자영장 포털에 전달하는 흐름"
    >
        <span className="project-card__visual-kicker">PUBLIC SYSTEM INTEGRATION</span>
        <div className="warrant-flow">
            <div className="warrant-flow__node warrant-flow__node--source">
                <span>01</span>
                <strong>KICS</strong>
                <small>요청 및 결과</small>
            </div>
            <span className="warrant-flow__connector" aria-hidden="true">
                <i />
            </span>
            <div className="warrant-flow__node warrant-flow__node--server">
                <span>02</span>
                <strong>연계 서버</strong>
                <small>기관별 변환</small>
            </div>
            <span className="warrant-flow__connector" aria-hidden="true">
                <i />
            </span>
            <div className="warrant-flow__node warrant-flow__node--target">
                <span>03</span>
                <strong>통신사 및 포털</strong>
                <small>전송 및 제출</small>
            </div>
        </div>
        <p>기관별 요청 변환과 제출 자료 반영을 구현했습니다.</p>
    </div>
)

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

const FeaturedProjectCard = ({ project, position }) => (
    <li
        className={`project-showcase__item project-showcase__item--${project.visual} project-showcase__item--${project.presentation}`}
    >
        <article>
            <Link
                className="project-card__visual-link"
                to={project.route}
                aria-label={`${project.title} 미리보기에서 상세 보기`}
            >
                {project.visual === "warrant" ? (
                    <WarrantVisual />
                ) : (
                    <ScreenshotVisual project={project} />
                )}
            </Link>

            <div className="project-card__content">
                <header className="project-card__header">
                    <div className="project-card__eyebrow">
                        <span>{String(position + 1).padStart(2, "0")}</span>
                        <span>{PROJECT_TYPE_LABELS[project.projectType]}</span>
                    </div>
                    <h3>
                        <Link to={project.route}>{project.title}</Link>
                    </h3>
                    {project.projectType === "career" && (
                        <p className="project-card__eyebrow-copy">BEINTECH / LG CNS 컨소시엄</p>
                    )}
                    <p className="project-card__summary">{project.homeSummary}</p>
                </header>

                <ProjectHighlights project={project} />
                <ProjectMeta project={project} />
                <ProjectLinks project={project} />
                <ProjectServices project={project} />
            </div>
        </article>
    </li>
)

const SupportingProjectCard = ({ project, position }) => {
    const implementation = project.homeFacts.find((fact) => fact.label === "담당")?.value

    return (
        <li
            className={`project-support__item project-support__item--${project.visual} project-support__item--${project.presentation}`}
        >
            <article>
                <span className="project-support__index" aria-hidden="true">
                    {String(position + 4).padStart(2, "0")}
                </span>

                <header className="project-support__identity">
                    <span>{PROJECT_TYPE_LABELS[project.projectType]}</span>
                    <h4>
                        <Link to={project.route}>{project.title}</Link>
                    </h4>
                    <p>{project.eyebrow}</p>
                    <time>{project.period}</time>
                </header>

                <div className="project-support__summary">
                    <dl className="project-support__details">
                        <div>
                            <dt>구현</dt>
                            <dd>{implementation}</dd>
                        </div>
                        <div>
                            <dt>확인</dt>
                            <dd>{project.homeProof}</dd>
                        </div>
                    </dl>
                </div>

                <ProjectLinks project={project} supporting />
            </article>
        </li>
    )
}

const Projects = () => {
    const featuredProjects = getProjectsInOrder(FEATURED_PROJECT_IDS)
    const listedProjectIds = new Set([...FEATURED_PROJECT_IDS, ...SUPPORTING_PROJECT_IDS])
    const supportingProjects = [
        ...getProjectsInOrder(SUPPORTING_PROJECT_IDS),
        ...projectSummaries.filter((project) => !listedProjectIds.has(project.id)),
    ]

    return (
        <section className="work-section" id="work" aria-labelledby="projects-title">
            <div className="project-index__intro">
                <h2 id="projects-title">대표 프로젝트</h2>
            </div>

            <div className="project-showcase">
                <ol className="project-showcase__grid" aria-label="대표 프로젝트">
                    {featuredProjects.map((project, position) => (
                        <FeaturedProjectCard
                            key={project.id}
                            project={project}
                            position={position}
                        />
                    ))}
                </ol>
            </div>

            <section className="project-support" aria-labelledby="supporting-projects-title">
                <div className="project-section-heading project-section-heading--compact">
                    <div>
                        <span>MORE WORK</span>
                        <h3 id="supporting-projects-title">추가 프로젝트</h3>
                    </div>
                    <p>웹앱, 운영 경험, 개발 도구와 실시간 미디어 구현 사례입니다.</p>
                </div>
                <ol className="project-support__grid" aria-label="추가 프로젝트">
                    {supportingProjects.map((project, position) => (
                        <SupportingProjectCard
                            key={project.id}
                            project={project}
                            position={position}
                        />
                    ))}
                </ol>
            </section>
        </section>
    )
}

export default Projects

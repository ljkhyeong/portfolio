import { Link } from "react-router-dom"
import { projectSummaries } from "../data/projectSummaries"
import { assetPath } from "../utils/assetPath"
import "../css/Projects.css"

const FEATURED_PROJECT_IDS = ["warrant", "baton", "happygallery"]
const SUPPORTING_PROJECT_IDS = ["defense", "hope-commit", "intent-trace", "webrtc"]

const PROJECT_TYPE_LABELS = {
    career: "경력 프로젝트",
    personal: "개인 프로젝트",
    tooling: "오픈소스 및 개발 도구",
    education: "교육 프로젝트",
}

const PROJECT_VISUALS = {
    baton: {
        src: "baton-workspace.png",
        alt: "BATON 오늘 화면에서 인수인계 타임라인과 최근 결정을 확인하는 모습",
        eyebrow: "ORGANIZATION FLOW",
        caption: "역할, 반복 업무와 인수인계를 한 흐름에서 관리",
    },
    gallery: {
        src: "happygallery-products.jpg",
        alt: "happyGallery 상품 목록 화면에서 공방 상품을 확인하는 모습",
        eyebrow: "COMMERCE & BOOKING",
        caption: "상품 주문과 클래스 예약을 함께 운영",
    },
}

const SUPPORTING_VISUALS = {
    defense: ["SI", "BATCH"],
    "hope-commit": ["DIFF", "REVIEW"],
    "intent-trace": ["AI", "TRACE"],
    webrtc: ["RTC", "HLS"],
}

const getProjectsInOrder = (ids) =>
    ids.map((id) => projectSummaries.find((project) => project.id === id)).filter(Boolean)

const ProjectLabels = ({ project }) => {
    const labels = [project.stage, project.visibility].filter(Boolean).slice(0, 2)

    if (labels.length === 0) {
        return null
    }

    return (
        <ul className="project-card__labels" aria-label={`프로젝트 상태: ${labels.join(", ")}`}>
            {labels.map((label) => (
                <li key={label}>{label}</li>
            ))}
        </ul>
    )
}

const ProjectFacts = ({ project, compact = false }) => (
    <dl
        className={`project-card__facts${compact ? " project-card__facts--compact" : ""}`}
        aria-label={`${project.title} 담당, 문제와 해결`}
    >
        {project.homeFacts.map((fact) => (
            <div className="project-card__fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
            </div>
        ))}
    </dl>
)

const ProjectMeta = ({ project }) => (
    <div className="project-card__meta">
        <time>{project.period}</time>
        <ul aria-label={`${project.title} 기술 스택`}>
            {project.tags.slice(0, 4).map((tag) => (
                <li key={tag}>{tag}</li>
            ))}
        </ul>
    </div>
)

const ProjectServices = ({ project }) => {
    if (!project.serviceLinks) {
        return null
    }

    return (
        <div className="project-card__services" aria-label="BATON 마이크로서비스 상세">
            <span>6개 서비스 상세</span>
            <div>
                {project.serviceLinks.map((service) => (
                    <Link
                        key={service.id}
                        to={service.route}
                        aria-label={`BATON ${service.name} 마이크로서비스 상세 보기`}
                    >
                        {service.name}
                        <span aria-hidden="true">↗</span>
                    </Link>
                ))}
            </div>
        </div>
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
        <p>요청 변환부터 제출 자료 반영까지 담당 범위를 분리해 처리합니다.</p>
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
            <img src={assetPath(visual.src)} alt={visual.alt} loading="lazy" decoding="async" />
            <figcaption>
                <span>{visual.eyebrow}</span>
                <strong>{visual.caption}</strong>
            </figcaption>
        </figure>
    )
}

const FeaturedProjectCard = ({ project, position }) => (
    <li
        className={`project-showcase__item project-showcase__item--${project.visual} project-showcase__item--${project.presentation}`}
    >
        <article>
            {project.visual === "warrant" ? (
                <WarrantVisual />
            ) : (
                <ScreenshotVisual project={project} />
            )}

            <div className="project-card__content">
                <header className="project-card__header">
                    <div className="project-card__eyebrow">
                        <span>{String(position + 1).padStart(2, "0")}</span>
                        <span>{PROJECT_TYPE_LABELS[project.projectType]}</span>
                    </div>
                    <h4>
                        <Link to={project.route} aria-label={`${project.title} 프로젝트 상세 보기`}>
                            {project.title}
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </h4>
                    <p className="project-card__eyebrow-copy">{project.eyebrow}</p>
                    <ProjectLabels project={project} />
                    <p className="project-card__summary">{project.summary}</p>
                </header>

                <ProjectFacts project={project} />
                <ProjectMeta project={project} />
                <ProjectServices project={project} />
            </div>
        </article>
    </li>
)

const SupportingProjectCard = ({ project, position }) => {
    const visualLabels = SUPPORTING_VISUALS[project.visual] ?? ["CODE", "CASE"]

    return (
        <li
            className={`project-support__item project-support__item--${project.visual} project-support__item--${project.presentation}`}
        >
            <article>
                <div className="project-support__visual" aria-hidden="true">
                    <span>{visualLabels[0]}</span>
                    <i />
                    <span>{visualLabels[1]}</span>
                </div>

                <header className="project-card__header">
                    <div className="project-card__eyebrow">
                        <span>{String(position + 4).padStart(2, "0")}</span>
                        <span>{PROJECT_TYPE_LABELS[project.projectType]}</span>
                    </div>
                    <h4>
                        <Link to={project.route} aria-label={`${project.title} 프로젝트 상세 보기`}>
                            {project.title}
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </h4>
                    <p className="project-card__eyebrow-copy">{project.eyebrow}</p>
                    <ProjectLabels project={project} />
                </header>

                <ProjectFacts project={project} compact />
                <ProjectMeta project={project} />
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
                <div className="section-heading-meta">
                    <span className="section-index" aria-hidden="true">
                        01
                    </span>
                    <span className="section-kicker">프로젝트</span>
                </div>
                <h2 id="projects-title">주요 프로젝트</h2>
                <p>
                    현재 업무와 개인 프로젝트에서 맡은 문제, 해결 방법과 확인 가능한 범위를
                    정리했습니다.
                </p>
            </div>

            <section className="project-showcase" aria-labelledby="featured-projects-title">
                <div className="project-section-heading">
                    <div>
                        <span>SELECTED CASES</span>
                        <h3 id="featured-projects-title">대표 사례</h3>
                    </div>
                    <p>기관 연계, 중복 실행 방지와 중단 작업 재처리를 실제 구현으로 보여줍니다.</p>
                </div>
                <ol className="project-showcase__grid" aria-label="대표 프로젝트">
                    {featuredProjects.map((project, position) => (
                        <FeaturedProjectCard
                            key={project.id}
                            project={project}
                            position={position}
                        />
                    ))}
                </ol>
            </section>

            <section className="project-support" aria-labelledby="supporting-projects-title">
                <div className="project-section-heading project-section-heading--compact">
                    <div>
                        <span>MORE WORK</span>
                        <h3 id="supporting-projects-title">추가 프로젝트</h3>
                    </div>
                    <p>운영 경험, 개발 도구와 실시간 미디어 구현 사례입니다.</p>
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

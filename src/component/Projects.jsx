import { Link } from "react-router-dom"
import { projectList } from "../data/projects"
import "../css/Projects.css"

const ProjectServices = ({ project }) => {
    if (!project.services) {
        return null
    }

    const microservices = project.services.filter((service) => !service.primary)

    return (
        <div className="project-index__services" aria-label="BATON 마이크로서비스 상세">
            <span>Microservices</span>
            <div>
                {microservices.map((service) => (
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

const ProjectIndex = ({ projects, label, education = false }) => (
    <>
        <div
            className={`project-index__group${education ? " project-index__group--education" : ""}`}
        >
            <strong>{label}</strong>
            <span>{String(projects.length).padStart(2, "0")}</span>
        </div>
        <ol
            className={`project-index${education ? " project-index--education" : ""}`}
            aria-label={label}
        >
            {projects.map((project, position) => (
                <li
                    className={`project-index__item project-index__item--${project.id}`}
                    key={project.id}
                >
                    <span className="project-index__number" aria-hidden="true">
                        {education ? "EDU" : String(position + 1).padStart(2, "0")}
                    </span>
                    <div className="project-index__body">
                        <Link
                            className="project-index__primary"
                            to={project.route}
                            aria-label={`${project.title} 프로젝트 상세 보기`}
                        >
                            <div className="project-index__title-block">
                                <span>{project.eyebrow}</span>
                                <h3>{project.title}</h3>
                            </div>
                            <p className="project-index__summary">{project.summary}</p>
                            <div className="project-index__meta">
                                <time>{project.period}</time>
                                <span>{project.tags.slice(0, 4).join(" / ")}</span>
                            </div>
                            <span className="project-index__arrow" aria-hidden="true">
                                ↗
                            </span>
                        </Link>
                        <ProjectServices project={project} />
                    </div>
                </li>
            ))}
        </ol>
    </>
)

const Projects = () => {
    const mainProjects = projectList.filter(
        (project) => project.presentation !== "prior-experience",
    )
    const educationProjects = projectList.filter(
        (project) => project.presentation === "prior-experience",
    )

    return (
        <section className="work-section" id="work" aria-labelledby="projects-title">
            <div className="project-index__intro">
                <span className="section-kicker"># projects.md</span>
                <h2 id="projects-title">Projects</h2>
                <p>프로젝트를 선택하면 역할, 설계 판단, 문제 해결과 대표 문서를 볼 수 있습니다.</p>
            </div>

            <ProjectIndex projects={mainProjects} label="주요 프로젝트" />
            {educationProjects.length > 0 && (
                <ProjectIndex projects={educationProjects} label="교육 프로젝트" education />
            )}
        </section>
    )
}

export default Projects

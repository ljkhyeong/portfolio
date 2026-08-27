import { Link } from "react-router-dom"
import { projectSummaries } from "../data/projectSummaries"
import "../css/Projects.css"

const ProjectLabels = ({ project }) => {
    const labels = [project.stage, project.visibility].filter(Boolean).slice(0, 2)

    if (labels.length === 0) {
        return null
    }

    return (
        <ul className="project-index__labels" aria-label={`프로젝트 상태: ${labels.join(", ")}`}>
            {labels.map((label) => (
                <li key={label}>{label}</li>
            ))}
        </ul>
    )
}

const ProjectServices = ({ project }) => {
    if (!project.serviceLinks) {
        return null
    }

    return (
        <div className="project-index__services" aria-label="BATON 마이크로서비스 상세">
            <span>서비스 상세</span>
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

const ProjectIndex = ({ projects, label, type, education = false, separated = false }) => (
    <section className="project-index__section" aria-labelledby={`${type}-projects-title`}>
        <div
            className={`project-index__group${separated ? " project-index__group--separated" : ""}`}
        >
            <h3 id={`${type}-projects-title`}>{label}</h3>
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
                                <h4>{project.title}</h4>
                                <ProjectLabels project={project} />
                            </div>
                            <dl
                                className="project-index__facts"
                                aria-label={`${project.title} 담당, 문제와 해결`}
                            >
                                {project.homeFacts.map((fact) => (
                                    <div className="project-index__fact" key={fact.label}>
                                        <dt>{fact.label}</dt>
                                        <dd>{fact.value}</dd>
                                    </div>
                                ))}
                            </dl>
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
    </section>
)

const Projects = () => {
    const careerProjects = projectSummaries.filter((project) => project.projectType === "career")
    const personalProjects = projectSummaries.filter(
        (project) => project.projectType === "personal",
    )
    const toolingProjects = projectSummaries.filter((project) => project.projectType === "tooling")
    const educationProjects = projectSummaries.filter(
        (project) => project.projectType === "education",
    )

    return (
        <section className="work-section" id="work" aria-labelledby="projects-title">
            <div className="project-index__intro">
                <span className="section-kicker"># projects.md</span>
                <h2 id="projects-title">프로젝트</h2>
                <p>
                    프로젝트를 선택하면 담당 업무, 구현 방법, 문제와 해결 과정, 테스트 결과와 공개
                    문서를 볼 수 있습니다.
                </p>
            </div>

            <ProjectIndex projects={careerProjects} label="경력 프로젝트" type="career" />
            <ProjectIndex
                projects={personalProjects}
                label="개인 프로젝트"
                type="personal"
                separated
            />
            {toolingProjects.length > 0 && (
                <ProjectIndex
                    projects={toolingProjects}
                    label="오픈소스 및 개발 도구"
                    type="tooling"
                    separated
                />
            )}
            {educationProjects.length > 0 && (
                <ProjectIndex
                    projects={educationProjects}
                    label="교육 프로젝트"
                    type="education"
                    education
                    separated
                />
            )}
        </section>
    )
}

export default Projects

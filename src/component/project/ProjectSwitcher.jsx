import { Link } from "react-router-dom"
import { navigableCaseStudies } from "../../data/projects"
import "../../css/ProjectSwitcher.css"

const ProjectSwitcher = ({ currentProjectId, contextLabel }) => {
    const currentIndex = navigableCaseStudies.findIndex(
        (project) => project.id === currentProjectId,
    )
    const currentProject = navigableCaseStudies[currentIndex]
    const countLabel =
        contextLabel ??
        (currentProject
            ? `주요 프로젝트 ${currentProject.index} / ${String(navigableCaseStudies.length).padStart(2, "0")}`
            : `주요 프로젝트 ${navigableCaseStudies.length}개`)

    return (
        <nav className="project-switcher" aria-label="다른 주요 프로젝트 상세">
            <span className="project-switcher__count">{countLabel}</span>
            <ol aria-label="주요 프로젝트 바로가기">
                {navigableCaseStudies.map((project) => {
                    const isCurrent = project.id === currentProjectId
                    const label = project.navigationLabel ?? project.title

                    return (
                        <li key={project.id}>
                            <Link
                                className={isCurrent ? "is-current" : undefined}
                                to={project.route}
                                aria-current={isCurrent ? "page" : undefined}
                                aria-label={`${project.title} 프로젝트로 이동`}
                            >
                                <span aria-hidden="true">{project.index}</span>
                                <strong>{label}</strong>
                            </Link>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default ProjectSwitcher

import { Link } from "react-router-dom"
import { navigableCaseStudies, navigableCaseStudyGroups } from "../../data/projects"
import "../../css/ProjectSwitcher.css"

const ProjectSwitcher = ({ currentProjectId, contextLabel }) => {
    const currentGroup = navigableCaseStudyGroups.find((group) =>
        group.projects.some((project) => project.id === currentProjectId),
    )
    const currentProjectIndex = currentGroup?.projects.findIndex(
        (project) => project.id === currentProjectId,
    )
    const countLabel =
        contextLabel ??
        (currentGroup && currentProjectIndex >= 0
            ? `${currentGroup.title} ${String(currentProjectIndex + 1).padStart(2, "0")} / ${String(currentGroup.projects.length).padStart(2, "0")}`
            : `프로젝트 ${navigableCaseStudies.length}개`)

    return (
        <nav className="project-switcher" aria-label="경력 및 개인 프로젝트 바로가기">
            <span className="project-switcher__count">{countLabel}</span>
            <div className="project-switcher__groups">
                {navigableCaseStudyGroups.map((group) => (
                    <div className="project-switcher__group" key={group.id}>
                        <span>{group.label}</span>
                        <ol aria-label={`${group.title} 바로가기`}>
                            {group.projects.map((project, index) => {
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
                                            <span aria-hidden="true">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <strong>{label}</strong>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                ))}
            </div>
        </nav>
    )
}

export default ProjectSwitcher

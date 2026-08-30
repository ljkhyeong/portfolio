import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { educationCaseStudies, navigableCaseStudyGroups } from "../../data/projects"
import "../../css/ProjectSwitcher.css"

const ProjectSwitcher = ({ currentProjectId, contextLabel }) => {
    const detailsRef = useRef(null)
    const menuGroups = [
        ...navigableCaseStudyGroups,
        { id: "education", label: "교육", title: "교육 프로젝트", projects: educationCaseStudies },
    ]
    const currentGroup = menuGroups.find((group) =>
        group.projects.some((project) => project.id === currentProjectId),
    )
    const currentProjectIndex = currentGroup?.projects.findIndex(
        (project) => project.id === currentProjectId,
    )
    const countLabel =
        contextLabel ??
        (currentGroup && currentProjectIndex >= 0
            ? `${currentGroup.title} ${String(currentProjectIndex + 1).padStart(2, "0")} / ${String(currentGroup.projects.length).padStart(2, "0")}`
            : `프로젝트 ${menuGroups.reduce((count, group) => count + group.projects.length, 0)}개`)
    const closeMenu = () => {
        if (detailsRef.current) {
            detailsRef.current.open = false
        }
    }

    useEffect(() => {
        const closeWhenOutside = (event) => {
            if (detailsRef.current?.open && !detailsRef.current.contains(event.target)) {
                closeMenu()
            }
        }
        const closeWithEscape = (event) => {
            if (event.key === "Escape" && detailsRef.current?.open) {
                closeMenu()
                detailsRef.current.querySelector("summary")?.focus()
            }
        }

        document.addEventListener("pointerdown", closeWhenOutside)
        document.addEventListener("keydown", closeWithEscape)

        return () => {
            document.removeEventListener("pointerdown", closeWhenOutside)
            document.removeEventListener("keydown", closeWithEscape)
        }
    }, [])

    return (
        <div className="project-switcher" role="group" aria-label="프로젝트 바로가기">
            <span className="project-switcher__count" aria-label={`현재 위치: ${countLabel}`}>
                {countLabel}
            </span>
            <details className="project-switcher__details" ref={detailsRef}>
                <summary aria-label="다른 프로젝트 보기">
                    <strong>프로젝트 이동</strong>
                </summary>
                <div className="project-switcher__panel">
                    {menuGroups.map((group) => (
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
                                                onClick={closeMenu}
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
            </details>
        </div>
    )
}

export default ProjectSwitcher

import { Link } from "react-router-dom"
import { careers } from "../data/profile"
import { projectSummariesById } from "../data/projectSummaries"
import StageBadge from "./StageBadge"
import { ProjectFacts } from "./Projects"

// 메인에서 경력을 보여 주는 유일한 영역이다. 업무별 기간과 담당 업무 아래에 대표 사례의 문제·구현·검증을 둔다.
const CareerSummary = () => {
    const career = careers[0]

    return (
        <section className="home-career blueprint-sheet" id="career" aria-labelledby="career-title">
            <div className="sheet-heading">
                <h2 id="career-title">경력</h2>
                <p>
                    <strong>{career.organization}</strong> {career.position} / {career.period} ·{" "}
                    {career.homeDescription}
                </p>
            </div>
            <ol className="sheet-rows" aria-label={`${career.organization} 수행 프로젝트`}>
                {career.projectIds.map((id, index) => {
                    const project = projectSummariesById[id]

                    return (
                        <li className="sheet-row" key={id}>
                            <time className="sheet-row__period">{project.period}</time>
                            <div className="sheet-row__body">
                                <span className="sheet-row__label">
                                    {index === 0 ? "현재 업무" : "이전 업무"}
                                </span>
                                <h3>
                                    <Link to={project.route}>{project.title}</Link>
                                </h3>
                                <p className="home-career__scope">
                                    {[project.collaboration, project.agencyScope]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </p>
                                <p>{career.projectResponsibilities[id]}</p>
                                {project.homeFacts ? <ProjectFacts project={project} /> : null}
                            </div>
                            <StageBadge stage={project.stage} />
                        </li>
                    )
                })}
            </ol>
        </section>
    )
}

export default CareerSummary

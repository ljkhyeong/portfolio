import { Link } from "react-router-dom"
import { careers } from "../data/profile"
import { projectSummariesById } from "../data/projectSummaries"
import { formatPeriod } from "../data/timeline"

// "2024.06 — 현재" → "2024년 6월부터"
const sinceLabel = (period) => {
    const [year, month] = period.split("—")[0].trim().split(".").map(Number)
    return `${year}년 ${month}월부터`
}

// 메인에서 경력을 보여 주는 유일한 영역이다. 회사 이름은 여기에만 쓴다.
// 확인한 결과는 첫 화면 연표에 있으므로 카드에는 맡은 일과 해결한 문제만 둔다.
const CareerSummary = () => {
    const career = careers[0]

    return (
        <section className="home-section" id="career" aria-labelledby="career-title">
            <div className="home-section__head">
                <h2 id="career-title">경력</h2>
                <p>
                    {career.organization} {career.position}, {sinceLabel(career.period)}
                </p>
            </div>
            <ol className="home-career" aria-label={`${career.organization} 수행 프로젝트`}>
                {career.projectIds.map((id) => {
                    const project = projectSummariesById[id]

                    return (
                        <li key={id}>
                            <article className="home-card home-career__card">
                                <p className="home-card__meta">
                                    {formatPeriod(project.period)}, {project.stage}
                                </p>
                                <h3>
                                    <Link to={project.route}>{project.title}</Link>
                                </h3>
                                <p className="home-card__scope">
                                    {[project.collaboration, project.agencyScope]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                                <p>{project.homeSummary}</p>
                                <p>{project.homeStory}</p>
                                <p className="home-card__links">
                                    <Link
                                        to={project.route}
                                        aria-label={`${project.title} 프로젝트 상세 보기`}
                                    >
                                        상세 보기 <span aria-hidden="true">→</span>
                                    </Link>
                                </p>
                            </article>
                        </li>
                    )
                })}
            </ol>
        </section>
    )
}

export default CareerSummary

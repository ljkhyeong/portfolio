import { Link } from "react-router-dom"
import { careers } from "../data/profile"
import { projectSummaries } from "../data/projectSummaries"

// 메인에서 경력을 보여 주는 유일한 영역이다. 회사, 재직 기간과 업무별 기간·담당 업무를 함께 둔다.
const CareerSummary = () => {
    const career = careers[0]

    return (
        <section className="home-career" id="career" aria-label="경력">
            <div className="home-career__company">
                <h2>{career.organization}</h2>
                <p>
                    {career.position} / {career.period}
                </p>
                <p>{career.homeDescription}</p>
            </div>
            {career.projectIds.map((id, index) => {
                const project = projectSummaries.find((item) => item.id === id)

                return (
                    <div key={id}>
                        <span>
                            {index === 0 ? "현재 업무" : "이전 업무"} ·{" "}
                            <time>{project.period}</time>
                        </span>
                        <h3>
                            <Link to={project.route}>{project.title}</Link>
                        </h3>
                        {project.collaboration && (
                            <p className="home-career__collaboration">{project.collaboration}</p>
                        )}
                        <p className="home-career__scope">{project.agencyScope}</p>
                        <p>{career.projectResponsibilities[id]}</p>
                    </div>
                )
            })}
        </section>
    )
}

export default CareerSummary

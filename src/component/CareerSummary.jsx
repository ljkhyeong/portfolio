import { careers } from "../data/profile"
import { projectSummaries } from "../data/projectSummaries"

const CareerSummary = () => {
    const career = careers[0]

    return (
        <section className="home-career" aria-label="현재 경력 요약">
            <div className="home-career__company">
                <h2>{career.organization}</h2>
                <p>
                    {career.position} / {career.period}
                </p>
                <a href="#experience">경력 상세 보기</a>
            </div>
            {career.projectIds.map((id, index) => {
                const project = projectSummaries.find((item) => item.id === id)

                return (
                    <div key={id}>
                        <span>{index === 0 ? "현재 업무" : "이전 업무"}</span>
                        <h3>{project.title}</h3>
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

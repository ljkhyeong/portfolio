import { useId } from "react"
import "../../css/FeaturedProblem.css"

const evidenceFields = [
    ["문제 상황", "constraint"],
    ["적용한 방법", "decision"],
    ["테스트 및 확인", "validation"],
    ["제약과 남은 작업", "boundary"],
]

const FeaturedProblem = ({ problem, featured, visual }) => {
    const titleId = useId()
    const flow = (
        <div className="featured-problem__flow">
            <p className="featured-problem__flow-label">처리 순서</p>
            <ol aria-label={`${problem.title} 처리 순서`}>
                {featured.steps.map((step, index) => (
                    <li key={step.title}>
                        <span className="featured-problem__step-number" aria-hidden="true">
                            {index + 1}
                        </span>
                        <div>
                            <strong>{step.title}</strong>
                            <p>{step.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    )

    return (
        <article
            className={`featured-problem${visual ? " featured-problem--visual" : ""}`}
            aria-labelledby={titleId}
        >
            <div className="featured-problem__copy">
                <header className="featured-problem__header">
                    <p className="featured-problem__eyebrow">대표 사례</p>
                    <h3 id={titleId}>{problem.title}</h3>
                </header>
                <div className="featured-problem__body">
                    <div className="featured-problem__explanation">
                        <p>
                            <strong>문제</strong>
                            {featured.problem}
                        </p>
                        <p>
                            <strong>적용</strong>
                            {featured.approach}
                        </p>
                    </div>
                    {!visual ? flow : null}
                </div>
                <div className="featured-problem__evidence">
                    <p className="featured-problem__evidence-label">{featured.evidenceLabel}</p>
                    <p className="featured-problem__result">{featured.result}</p>
                    {featured.limitation ? (
                        <p className="featured-problem__limitation">
                            <strong>확인 범위와 제약</strong>
                            {featured.limitation}
                        </p>
                    ) : null}
                </div>
                <details className="featured-problem__details">
                    <summary>구현 근거와 제약 상세</summary>
                    {visual ? flow : null}
                    <dl>
                        {evidenceFields.map(([term, field]) => (
                            <div key={field}>
                                <dt>{term}</dt>
                                <dd>{problem[field]}</dd>
                            </div>
                        ))}
                    </dl>
                </details>
            </div>
            {visual ? <div className="featured-problem__visual">{visual}</div> : null}
        </article>
    )
}

export default FeaturedProblem

import "../../css/ProblemSolutionList.css"
import FeaturedProblem from "./FeaturedProblem"

const problemEvidence = [
    ["문제 상황", "constraint"],
    ["적용한 방법", "decision"],
    ["테스트 및 확인", "validation"],
    ["제약과 남은 작업", "boundary"],
]

const ProblemSolutionList = ({ problems, label, featured, featuredVisual }) => {
    const featuredProblem = featured
        ? problems.find((problem) => problem.number === featured.problemNumber)
        : null
    const remainingProblems = featuredProblem
        ? problems.filter((problem) => problem.number !== featuredProblem.number)
        : problems

    return (
        <>
            {featuredProblem ? (
                <FeaturedProblem
                    problem={featuredProblem}
                    featured={featured}
                    visual={featuredVisual}
                />
            ) : null}
            {remainingProblems.length > 0 ? (
                <ol className="problem-solution-list" aria-label={label}>
                    {remainingProblems.map((problem) => (
                        <li key={problem.number}>
                            <details className="problem-solution-list__item">
                                <summary>
                                    <h3>
                                        <span>{problem.title}</span>
                                        <span
                                            className="problem-solution-list__action"
                                            aria-hidden="true"
                                        >
                                            <span>상세 보기</span>
                                            <span>접기</span>
                                            <i />
                                        </span>
                                    </h3>
                                    {problem.validationSummary ? (
                                        <p className="problem-solution-list__result">
                                            <span>확인 결과</span>
                                            {problem.validationSummary}
                                        </p>
                                    ) : null}
                                </summary>
                                <dl>
                                    {problemEvidence.map(([term, field]) => (
                                        <div key={field}>
                                            <dt>{term}</dt>
                                            <dd>{problem[field]}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </details>
                        </li>
                    ))}
                </ol>
            ) : null}
        </>
    )
}

export default ProblemSolutionList

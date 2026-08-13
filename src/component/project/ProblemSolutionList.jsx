import "../../css/ProblemSolutionList.css"

const problemEvidence = [
    ["문제", "constraint"],
    ["해결", "decision"],
    ["검증", "validation"],
    ["트레이드오프와 한계", "boundary"],
]

const ProblemSolutionList = ({ problems, label }) => (
    <ol className="problem-solution-list" aria-label={label}>
        {problems.map((problem) => (
            <li key={problem.number}>
                <details className="problem-solution-list__item">
                    <summary>
                        <h3>
                            <code aria-hidden="true">{problem.number}</code>
                            <span>{problem.title}</span>
                            <span className="problem-solution-list__action" aria-hidden="true">
                                <span>상세 보기</span>
                                <span>접기</span>
                                <i />
                            </span>
                        </h3>
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
)

export default ProblemSolutionList

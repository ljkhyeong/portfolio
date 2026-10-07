import "../../css/ProblemSolutionList.css"

// 대표 사례(ProblemCases)와 같은 순서와 이름으로 네 칸을 쓴다.
const problemFields = [
    ["문제", "constraint"],
    ["방법", "decision"],
    ["확인", "validation"],
    ["한계", "boundary"],
]

// 대표 사례 밖의 문제를 번호와 제목만 보이는 색인으로 펼쳐 두고, 누르면 그 자리에서 내용을 연다.
// 색인 제목(h3) 아래에 놓이므로 항목 제목은 h4로 쓴다.
const ProblemSolutionList = ({ problems, label }) => (
    <ol className="problem-solution-list problem-solution-list--index" aria-label={label}>
        {problems.map((problem) => (
            <li key={problem.number}>
                <details className="problem-solution-list__item">
                    <summary>
                        <h4>
                            <span className="problem-solution-list__number">{problem.number}</span>
                            <span>{problem.title}</span>
                            <span className="problem-solution-list__action" aria-hidden="true">
                                <i />
                            </span>
                        </h4>
                    </summary>
                    <dl>
                        {problemFields.map(([term, field]) => (
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

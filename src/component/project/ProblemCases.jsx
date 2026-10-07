import { useId } from "react"
import ProjectScreenshotGallery from "../ProjectScreenshotGallery"
import "../../css/ProblemCases.css"

const caseFields = [
    ["문제", "constraint"],
    ["방법", "decision"],
    ["확인", "validation"],
    ["한계", "boundary"],
]

const ProcessSteps = ({ title, steps, inline = false }) => (
    <div className={`problem-case__steps${inline ? " problem-case__steps--inline" : ""}`}>
        <p className="problem-case__steps-label">처리 순서</p>
        <ol aria-label={`${title} 처리 순서`}>
            {steps.map((step, index) => (
                <li key={step.title}>
                    <span aria-hidden="true">{index + 1}</span>
                    <div>
                        <strong>{step.title}</strong>
                        <p>{step.description}</p>
                    </div>
                </li>
            ))}
        </ol>
    </div>
)

// 대표 사례 하나. 관련 화면이 있으면 화면과, 처리 순서가 있으면 순서와 짝지어 둔다.
// 네 칸(문제, 방법, 확인, 한계)은 모든 사례가 같은 순서로 쓴다.
const ProblemCase = ({ project, problem, featured, flip }) => {
    const titleId = useId()
    const steps = featured?.problemNumber === problem.number ? featured.steps : null
    const visual = problem.screenshotId ? (
        <div className="problem-case__visual">
            <ProjectScreenshotGallery
                project={project}
                context="problem"
                visibleScreenshotIds={[problem.screenshotId]}
                showNote={false}
            />
        </div>
    ) : steps ? (
        <div className="problem-case__visual problem-case__visual--steps">
            <ProcessSteps title={problem.title} steps={steps} />
        </div>
    ) : null

    return (
        <article
            className={`problem-case${visual ? " problem-case--visual" : ""}${flip ? " problem-case--flip" : ""}`}
            aria-labelledby={titleId}
        >
            {visual}
            <div className="problem-case__copy">
                <p className="problem-case__number">문제 {problem.number}</p>
                <h3 id={titleId}>{problem.title}</h3>
                {steps && featured.problem ? (
                    <p className="problem-case__lead">{featured.problem}</p>
                ) : null}
                <dl className="problem-case__fields">
                    {caseFields.map(([term, field]) => (
                        <div key={field}>
                            <dt>{term}</dt>
                            <dd>{problem[field]}</dd>
                        </div>
                    ))}
                </dl>
                {steps && problem.screenshotId ? (
                    <ProcessSteps title={problem.title} steps={steps} inline />
                ) : null}
            </div>
        </article>
    )
}

// 화면이나 처리 순서가 있는 사례를 먼저 크게 두고, 글만 있는 사례는 두 열로 나란히 둔다.
const ProblemCases = ({ project, problems, featured }) => {
    const hasVisual = (problem) =>
        Boolean(problem.screenshotId) || featured?.problemNumber === problem.number
    const visualCases = problems.filter(hasVisual)
    const textCases = problems.filter((problem) => !hasVisual(problem))

    return (
        <div className="problem-cases">
            {visualCases.map((problem, index) => (
                <ProblemCase
                    project={project}
                    problem={problem}
                    featured={featured}
                    flip={index % 2 === 1}
                    key={problem.number}
                />
            ))}
            {textCases.length > 0 ? (
                <div className="problem-cases__grid">
                    {textCases.map((problem) => (
                        <ProblemCase project={project} problem={problem} key={problem.number} />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

export default ProblemCases

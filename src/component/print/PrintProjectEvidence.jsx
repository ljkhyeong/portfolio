const ProblemGrid = ({ project, problemIds, compact = false }) => {
    const problems = problemIds.map((id) =>
        project.problems.find((problem) => problem.number === id),
    )

    return (
        <div
            className={`print-problem-grid${compact ? " print-problem-grid--compact" : ""}`}
            aria-label={`${project.title} 대표 문제 해결`}
        >
            {problems.map((problem) => (
                <article key={problem.number}>
                    <span>{problem.print.label}</span>
                    <h3>{problem.title}</h3>
                    <dl>
                        <div>
                            <dt>문제 상황</dt>
                            <dd>{problem.print.problem}</dd>
                        </div>
                        <div>
                            <dt>적용한 방법</dt>
                            <dd>{problem.print.solution}</dd>
                        </div>
                        <div>
                            <dt>트레이드오프</dt>
                            <dd>{problem.print.tradeoff}</dd>
                        </div>
                    </dl>
                </article>
            ))}
        </div>
    )
}

const DocumentCatalog = ({ project }) => (
    <section className="print-document-catalog" aria-label={`${project.title} 문서 분류`}>
        <div className="print-document-catalog__heading">
            <h3 className="print-markdown-heading">### 문서 분류</h3>
            <span>{project.evidenceAsOf}</span>
        </div>
        <div
            className={`print-document-taxonomy${
                project.documentGroups.length === 5 ? " print-document-taxonomy--five" : ""
            }`}
        >
            {project.documentGroups.map((group) => (
                <article key={group.id}>
                    <strong>
                        {group.label} <b>{group.count}</b>
                    </strong>
                    <p>{group.summary}</p>
                </article>
            ))}
        </div>
    </section>
)

const RepresentativeDocuments = ({ project, documentIndexes, toPublishedUrl }) => (
    <nav className="print-representative-docs" aria-label={`${project.title} 대표 문서`}>
        <h3 className="print-markdown-heading">### 대표 문서</h3>
        {documentIndexes.map((index) => {
            const document = project.documents[index]

            return (
                <a href={toPublishedUrl(document.href)} key={`${document.type}-${document.label}`}>
                    <b>
                        [{document.type}] {document.label}
                    </b>
                    <span>{document.note}</span>
                </a>
            )
        })}
    </nav>
)

const PrintProjectEvidence = ({
    project,
    problemIds = [],
    documentIndexes = [],
    compact = false,
    showProblems = true,
    showDocuments = true,
    toPublishedUrl,
}) => (
    <>
        {showProblems ? (
            <ProblemGrid project={project} problemIds={problemIds} compact={compact} />
        ) : null}
        {showDocuments ? (
            <>
                <DocumentCatalog project={project} />
                <RepresentativeDocuments
                    project={project}
                    documentIndexes={documentIndexes}
                    toPublishedUrl={toPublishedUrl}
                />
            </>
        ) : null}
    </>
)

export default PrintProjectEvidence

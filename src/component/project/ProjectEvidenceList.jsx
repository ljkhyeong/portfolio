const EvidenceField = ({ label, children, className = "" }) => (
    <div className={className}>
        <dt>{label}</dt>
        <dd>{children}</dd>
    </div>
)

const ProjectEvidenceList = ({ proofs, label }) => (
    <ol className="project-evidence-list" aria-label={label}>
        {proofs.map((proof) => (
            <li key={`${proof.item}-${proof.scope ?? "all"}`}>
                <details className="project-evidence-list__entry">
                    <summary>
                        <div className="project-evidence-list__item">
                            <span>확인 항목</span>
                            <strong>{proof.item}</strong>
                        </div>
                        <div className="project-evidence-list__result">
                            <span>확인 결과</span>
                            <p>{proof.result}</p>
                        </div>
                        <span className="project-evidence-list__action" aria-hidden="true">
                            <span>방법 보기</span>
                            <span>접기</span>
                            <i />
                        </span>
                    </summary>
                    <dl>
                        <EvidenceField
                            label="확인 방법 및 조건"
                            className="project-evidence-list__method"
                        >
                            <strong>{proof.method}</strong>
                            <p>{proof.rule}</p>
                        </EvidenceField>
                        {proof.scope ? (
                            <EvidenceField
                                label="확인 범위"
                                className="project-evidence-list__scope"
                            >
                                <p>{proof.scope}</p>
                            </EvidenceField>
                        ) : null}
                    </dl>
                </details>
            </li>
        ))}
    </ol>
)

export default ProjectEvidenceList

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
                <dl>
                    <EvidenceField label="검증 항목" className="project-evidence-list__item">
                        <strong>{proof.item}</strong>
                        {proof.scope ? <small>{proof.scope}</small> : null}
                    </EvidenceField>
                    <EvidenceField
                        label="검증 방법 및 기준"
                        className="project-evidence-list__method"
                    >
                        <strong>{proof.method}</strong>
                        <p>{proof.rule}</p>
                    </EvidenceField>
                    <EvidenceField label="확인 결과" className="project-evidence-list__result">
                        <p>{proof.result}</p>
                    </EvidenceField>
                </dl>
            </li>
        ))}
    </ol>
)

export default ProjectEvidenceList

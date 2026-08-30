import { getEvidencePresentation } from "../../data/evidencePresentation"
import "../../css/ProjectEvidenceList.css"

const EvidenceField = ({ label, children, className = "" }) => (
    <div className={className}>
        <dt>{label}</dt>
        <dd>{children}</dd>
    </div>
)

const ProjectEvidenceList = ({ proofs, label }) => (
    <ol className="project-evidence-list project-evidence-list--classified" aria-label={label}>
        {proofs.map((proof) => {
            const { methodLabel, resultSummary, scopeNote } = getEvidencePresentation(proof)

            return (
                <li key={`${proof.item}-${proof.scope ?? "all"}`}>
                    <details className="project-evidence-list__entry">
                        <summary>
                            <div className="project-evidence-list__subject">
                                <span className="project-evidence-list__type">{methodLabel}</span>
                                <strong>{proof.item}</strong>
                            </div>
                            <div className="project-evidence-list__outcome">
                                <p>{resultSummary ?? proof.result}</p>
                                {scopeNote ? (
                                    <p className="project-evidence-list__limitation">{scopeNote}</p>
                                ) : null}
                            </div>
                            <span className="project-evidence-list__action" aria-hidden="true">
                                <span>{resultSummary ? "근거 보기" : "방법 보기"}</span>
                                <span>접기</span>
                                <i />
                            </span>
                        </summary>
                        <dl>
                            {resultSummary ? (
                                <EvidenceField label="상세 결과">
                                    <p>{proof.result}</p>
                                </EvidenceField>
                            ) : null}
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
            )
        })}
    </ol>
)

export default ProjectEvidenceList

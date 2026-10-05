import { verificationRails, verificationStatusLabels } from "../../data/verificationRails"
import "../../css/VerificationRail.css"

// 구현부터 실제 연동까지 어디까지 확인했는지 단계별로 보여 준다.
// 색만으로 구분하지 않도록 단계마다 확인 상태를 글자로 함께 적는다.
const VerificationRail = ({ projectId }) => {
    const stages = verificationRails[projectId]

    if (!stages) {
        return null
    }

    const headingId = `verification-rail-${projectId}`

    return (
        <section className="verification-rail" aria-labelledby={headingId}>
            <h2 id={headingId}>검증 단계</h2>
            <ol>
                {stages.map((stage) => (
                    <li className={`verification-rail__stage is-${stage.status}`} key={stage.label}>
                        <span className="verification-rail__mark" aria-hidden="true" />
                        <strong>{stage.label}</strong>
                        <span className="verification-rail__status">
                            {verificationStatusLabels[stage.status]}
                        </span>
                        <p>{stage.note}</p>
                    </li>
                ))}
            </ol>
        </section>
    )
}

export default VerificationRail

import { verificationRails, verificationStatusLabels } from "../../data/verificationRails"
import "../../css/VerificationRail.css"

// 단계 목록만 그린다. 상세 상단 레일과 메인의 경력·프로젝트 카드가 같은 표시를 쓴다.
// compact는 기준선 없이 칸으로 나눠 좁은 카드 안에서 줄바꿈한다.
export const VerificationStages = ({ projectId, label, compact = false }) => {
    const stages = verificationRails[projectId]

    if (!stages) {
        return null
    }

    return (
        <ol
            className={`verification-rail__stages${compact ? " verification-rail__stages--compact" : ""}`}
            aria-label={label}
        >
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
    )
}

const STATUS_ORDER = ["verified", "limited", "unverified"]

// 메인의 그 밖의 프로젝트용 한 줄 요약. 단계를 하나씩 늘어놓지 않고 상태별로 묶어 이름만 보여 준다.
export const VerificationSummary = ({ projectId, label }) => {
    const stages = verificationRails[projectId]

    if (!stages) {
        return null
    }

    const groups = STATUS_ORDER.map((status) => ({
        status,
        labels: stages.filter((stage) => stage.status === status).map((stage) => stage.label),
    })).filter((group) => group.labels.length > 0)

    return (
        <ul className="verification-summary" aria-label={label}>
            {groups.map((group) => (
                <li className={`verification-summary__group is-${group.status}`} key={group.status}>
                    <span className="verification-rail__mark" aria-hidden="true" />
                    <strong>{verificationStatusLabels[group.status]}</strong>
                    <span>{group.labels.join(" · ")}</span>
                </li>
            ))}
        </ul>
    )
}

// 구현부터 실제 연동까지 어디까지 확인했는지 단계별로 보여 준다.
// 색만으로 구분하지 않도록 단계마다 확인 상태를 글자로 함께 적는다.
// 확인 결과 문장은 상단 정보에서 반복하지 않고 레일 위에 한 번만 둔다.
// note에는 공개 범위나 공개 버전처럼 단계에 담기지 않는 현재 상태를 한 줄로 둔다.
const VerificationRail = ({ projectId, summary, note }) => {
    const stages = verificationRails[projectId]

    if (!stages) {
        return null
    }

    const headingId = `verification-rail-${projectId}`

    return (
        <section className="verification-rail" aria-labelledby={headingId}>
            <h2 id={headingId}>검증 단계</h2>
            {summary && <p className="verification-rail__summary">{summary}</p>}
            <VerificationStages projectId={projectId} />
            {note ? (
                <p className="verification-rail__note">
                    <span>{note.label}</span>
                    {note.text}
                </p>
            ) : null}
        </section>
    )
}

export default VerificationRail

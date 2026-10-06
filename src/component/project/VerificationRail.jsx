import "../../css/VerificationRail.css"

// 어디까지 확인했는지를 문장으로 쓴다. 확인하지 않은 범위도 같은 문장에서 밝힌다.
// note에는 공개 범위나 다른 구현처럼 확인 범위에 담기지 않는 내용을 한 줄로 둔다.
const VerificationRail = ({ projectId, summary, note }) => {
    if (!summary) {
        return null
    }

    const headingId = `verification-${projectId}`

    return (
        <section className="verification-rail" aria-labelledby={headingId}>
            <p className="verification-rail__summary">
                <strong id={headingId}>확인한 범위</strong> {summary}
            </p>
            {note ? (
                <p className="verification-rail__note">
                    <strong>{note.label}</strong> {note.text}
                </p>
            ) : null}
        </section>
    )
}

export default VerificationRail

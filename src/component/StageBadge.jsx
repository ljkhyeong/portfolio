// 진행 단계 표시. 색은 장식이 아니라 배포 완료·진행·종료를 구분한다.
const STAGE_TONES = {
    "배포 완료": "ok",
    종료: "done",
}

const StageBadge = ({ stage }) => (
    <span className={`stage-badge stage-badge--${STAGE_TONES[stage] ?? "run"}`}>{stage}</span>
)

export default StageBadge

const recordFields = [
    {
        label: "USER REQUEST",
        value: "사용자가 요청한 변경과 완료 조건",
    },
    {
        label: "DECISION SOURCE",
        value: "확인 가능한 문서, 코드와 사용자 결정",
    },
    {
        label: "REVISION",
        value: "40자 또는 64자 전체 커밋 ID와 SHA-256 스냅샷",
    },
]

const evidenceFields = [
    {
        label: "CODE ANCHOR",
        value: "저장소 상대 경로 / 줄 범위 / 내용 해시",
    },
    {
        label: "VERIFICATION",
        value: "실행 명령 / 종료 코드 / 실행 시간 / 출력 해시",
    },
]

const lifecycle = ["DRAFT", "AUTHOR_CONFIRMED", "PUBLISHED", "SUPERSEDED"]

const IntentTraceRecordPreview = () => (
    <figure className="editorial-diagram intent-trace-record">
        <figcaption className="editorial-diagram__header">
            <span className="editorial-diagram__eyebrow">CHANGE RECORD / VERIFIED SUMMARY</span>
            <h3 className="editorial-diagram__title">코드 변경 근거 기록</h3>
            <p className="editorial-diagram__summary">
                사용자 요청과 판단 출처를 전체 길이 커밋 ID, 코드 위치와 실행한 검증에 연결합니다.
                작성자 확인 뒤 코드가 바뀌지 않은 기록만 팀에 공개합니다.
            </p>
        </figcaption>

        <div
            className="intent-trace-record__preview"
            role="group"
            aria-label="사용자 요청과 판단 출처, 전체 길이 커밋 ID, 코드 위치 및 검증 결과를 저장하고 작성자 확인 뒤 코드가 바뀌면 공개를 차단하는 IntentTrace 변경 기록 예시"
        >
            <header className="intent-trace-record__toolbar">
                <div>
                    <span>INTENT TRACE</span>
                    <strong>변경 기록</strong>
                </div>
                <span className="intent-trace-record__status">PUBLISHED</span>
            </header>

            <div className="intent-trace-record__body">
                <section aria-label="기록 내용">
                    <div className="intent-trace-record__fields">
                        {recordFields.map((field) => (
                            <div key={field.label}>
                                <span>{field.label}</span>
                                <strong>{field.value}</strong>
                            </div>
                        ))}
                    </div>
                    <div className="intent-trace-record__evidence">
                        {evidenceFields.map((field) => (
                            <div key={field.label}>
                                <span>{field.label}</span>
                                <p>{field.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <aside aria-label="기록 공개 상태">
                    <span className="intent-trace-record__aside-label">RECORD LIFECYCLE</span>
                    <ol>
                        {lifecycle.map((state, index) => (
                            <li key={state} className={state === "PUBLISHED" ? "is-current" : ""}>
                                <span>{String(index + 1).padStart(2, "0")}</span>
                                <strong>{state}</strong>
                            </li>
                        ))}
                    </ol>
                    <div className="intent-trace-record__boundary">
                        <span>저장하지 않음</span>
                        <strong>원문 대화 / 숨은 추론 / 검증 원문</strong>
                    </div>
                </aside>
            </div>
        </div>
    </figure>
)

export default IntentTraceRecordPreview

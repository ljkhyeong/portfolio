import { timelineLanes, timelineYears } from "../../data/timeline"

// 메인 연표에서 이 프로젝트의 기간만 강조한 띠. 경력, 개인 프로젝트, 학습을 한 줄씩 겹쳐 그려
// 회사 일과 언제 함께 진행했는지 보여 준다.
const ProjectTimelineStrip = ({ projectId }) => {
    const current = timelineLanes
        .flatMap((lane) => lane.items)
        .find((item) => item.id === projectId)

    if (!current) {
        return null
    }

    return (
        <figure
            className="project-timeline-strip"
            aria-label={`연표에서 이 프로젝트의 기간: ${current.period}`}
        >
            <figcaption>연표에서 이 프로젝트의 기간, {current.period}</figcaption>
            <div className="project-timeline-strip__chart" aria-hidden="true">
                {timelineLanes.map((lane) => (
                    <div className="project-timeline-strip__lane" key={lane.id}>
                        <span className="project-timeline-strip__label">{lane.label}</span>
                        <span className="project-timeline-strip__track">
                            {lane.items.map((item) => (
                                <span
                                    className={`project-timeline-strip__bar${item.id === projectId ? " is-current" : ""}`}
                                    style={{ "--from": item.from, "--to": item.to }}
                                    key={item.id}
                                />
                            ))}
                        </span>
                    </div>
                ))}
                <div className="project-timeline-strip__axis">
                    {timelineYears.map(({ year, at }) => (
                        <span style={{ "--at": at }} key={year}>
                            {year}
                        </span>
                    ))}
                </div>
            </div>
        </figure>
    )
}

export default ProjectTimelineStrip

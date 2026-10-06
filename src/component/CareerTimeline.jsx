import { Link } from "react-router-dom"
import { timelineLanes, timelineNow, timelineRange, timelineYears } from "../data/timeline"

// 막대가 이름을 담을 만큼 길면 이름을 막대 안에 쓰고, 짧으면 옆에 쓴다.
// 옆에 쓰는 이름과 확인한 결과는 막대 앞뒤 중 빈 자리가 넓은 쪽에 둔다.
const INSIDE_MIN_SPAN = 16

const placementOf = (item) => (item.to - item.from >= INSIDE_MIN_SPAN ? "inside" : "outside")

const sideOf = (item) => (item.from > 100 - item.to ? "before" : "after")

const TimelineItem = ({ item }) => {
    const className = `career-timeline__item career-timeline__item--${placementOf(item)} career-timeline__item--${sideOf(item)}`
    const style = { "--from": item.from, "--to": item.to }
    const content = (
        <>
            <span className="career-timeline__track" aria-hidden="true">
                <span className="career-timeline__bar">
                    <span className="career-timeline__bar-label">{item.label}</span>
                </span>
            </span>
            <span className="career-timeline__label">
                <strong className="career-timeline__name">{item.label}</strong>
                {item.note ? <span className="career-timeline__note">{item.note}</span> : null}
            </span>
            <span className="career-timeline__period">{item.period}</span>
        </>
    )

    return (
        <li>
            {item.route ? (
                <Link className={className} style={style} to={item.route}>
                    {content}
                </Link>
            ) : (
                <span className={className} style={style}>
                    {content}
                </span>
            )}
        </li>
    )
}

// 메인 첫 화면 연표. 넓은 화면에서는 기간을 막대로 그리고, 좁은 화면과 인쇄본에서는 항목마다 작은 막대를 단 목록이 된다.
const CareerTimeline = () => (
    <figure
        className="career-timeline"
        aria-label={`${timelineRange.from}부터 지금까지 한 일의 연표`}
    >
        <div className="career-timeline__chart">
            <div className="career-timeline__axis" aria-hidden="true">
                {timelineYears.map(({ year, at }) => (
                    <span className="career-timeline__year" style={{ "--at": at }} key={year}>
                        {year}
                    </span>
                ))}
                <span className="career-timeline__now" style={{ "--at": timelineNow }}>
                    지금
                </span>
            </div>
            {timelineLanes.map((lane) => (
                <div
                    className={`career-timeline__lane career-timeline__lane--${lane.id}`}
                    role="group"
                    aria-label={`${lane.label} 기간`}
                    key={lane.id}
                >
                    <p className="career-timeline__lane-title" aria-hidden="true">
                        {lane.label}
                    </p>
                    <ol>
                        {lane.items.map((item) => (
                            <TimelineItem item={item} key={item.id} />
                        ))}
                    </ol>
                </div>
            ))}
        </div>
        <figcaption>
            {timelineRange.from} — {timelineRange.to}
        </figcaption>
    </figure>
)

export default CareerTimeline

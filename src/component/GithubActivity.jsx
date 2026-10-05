import activity from "../data/githubActivity.json"
import { summarizeActivity, toActivityWeeks } from "../utils/githubActivity"

const formatMonth = (date) => date.slice(0, 7).replace("-", ".")

// 최근 1년 GitHub 기여 기록. 원본은 npm run activity:refresh로 갱신한 저장 파일이다.
const GithubActivity = () => {
    const weeks = toActivityWeeks(activity)
    const { total, activeDays } = summarizeActivity(activity)
    const summary = `${total.toLocaleString("ko-KR")}회 · 활동한 날 ${activeDays}일`

    return (
        <figure className="activity" aria-labelledby="activity-title">
            <figcaption className="activity__head">
                <span className="blueprint-fig" aria-hidden="true" />
                <h3 id="activity-title">최근 1년 GitHub 기여</h3>
                <p>
                    {summary} · {formatMonth(activity.from)} — {formatMonth(activity.to)}
                </p>
            </figcaption>
            <div
                className="activity__grid"
                role="img"
                aria-label={`${activity.from}부터 ${activity.to}까지 GitHub 기여 ${summary}`}
            >
                {weeks.map((week) => (
                    <div className="activity__week" key={week.days.find(Boolean).date}>
                        <span className="activity__month">{week.monthLabel}</span>
                        {week.days.map((day, index) =>
                            day ? (
                                <i
                                    className={`activity__day activity__day--${day.level}`}
                                    title={`${day.date} 기여 ${day.count}회`}
                                    key={day.date}
                                />
                            ) : (
                                <i className="activity__day activity__day--empty" key={index} />
                            ),
                        )}
                    </div>
                ))}
            </div>
            <p className="activity__legend" aria-hidden="true">
                적음
                {[0, 1, 2, 3, 4].map((level) => (
                    <i className={`activity__day activity__day--${level}`} key={level} />
                ))}
                많음
            </p>
        </figure>
    )
}

export default GithubActivity

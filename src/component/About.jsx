import { Link } from "react-router-dom"
import { education, personalActivities } from "../data/profile"
import { homeSkillGroups } from "../data/homeSkills"
import GithubActivity from "./GithubActivity"

const Capability = ({ group }) => (
    <article className={`capability capability--${group.id}`}>
        <h3>{group.label}</h3>
        <div className="capability__body">
            <ul aria-label={`${group.label} 기술`}>
                {group.items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            <p>{group.summary}</p>
            {group.link ? (
                <Link className="capability__link" to={group.link.route}>
                    {group.link.label} <span aria-hidden="true">→</span>
                </Link>
            ) : null}
        </div>
    </article>
)

const About = () => {
    return (
        <>
            {/* 경력은 메인 상단에서 한 번만 보여 주고, 여기에는 교육과 그룹 스터디를 경력과 같은 행으로 둔다. */}
            <section
                className="experience-section blueprint-sheet"
                id="experience"
                aria-labelledby="experience-title"
            >
                <div className="sheet-heading">
                    <h2 id="experience-title">학습</h2>
                </div>
                <ol className="sheet-rows" aria-label="교육 및 그룹 스터디">
                    <li className="sheet-row">
                        <span className="sheet-row__period">{education.period}</span>
                        <div className="sheet-row__body">
                            <span className="sheet-row__label">{education.type}</span>
                            <h3>{education.organization}</h3>
                            <p>{education.summary}</p>
                        </div>
                        <Link className="sheet-row__link" to={education.route}>
                            프로젝트 보기 <span aria-hidden="true">→</span>
                        </Link>
                    </li>
                    {personalActivities.map((activity) => (
                        <li className="sheet-row" key={activity.id}>
                            <span className="sheet-row__period">그룹 스터디</span>
                            <div className="sheet-row__body">
                                <span className="sheet-row__label">{activity.role}</span>
                                <h3>{activity.title}</h3>
                            </div>
                            <a
                                className="sheet-row__link"
                                href={activity.links[0].href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${activity.links[0].label} 새 창에서 보기`}
                            >
                                기록 보기 <span aria-hidden="true">↗</span>
                            </a>
                        </li>
                    ))}
                </ol>

                {/* 최근 개발 활동은 학습의 근거로 학습 영역 끝에 둔다. */}
                <div className="experience-section__activity">
                    <GithubActivity />
                </div>
            </section>

            <section
                className="capability-section blueprint-sheet"
                id="capabilities"
                aria-labelledby="capability-title"
            >
                <div className="sheet-heading">
                    <h2 id="capability-title">기술</h2>
                </div>
                {/* 구현 사례는 프로젝트 카드와 상세에서 설명하므로 여기에는 기술 이름과 사용 범위만 둔다. */}
                <div className="capability-list">
                    {homeSkillGroups.map((group) => (
                        <Capability group={group} key={group.id} />
                    ))}
                </div>
            </section>
        </>
    )
}

export default About

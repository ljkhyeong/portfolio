import { Link } from "react-router-dom"
import { education, personalActivities } from "../data/profile"
import { homeSkillGroups } from "../data/homeSkills"
import { projectSummariesById } from "../data/projectSummaries"

const CapabilityItems = ({ group }) => (
    <ul aria-label={`${group.label} 기술 및 적용 사례`}>
        {group.items.map((item) => (
            <li className={item.detail ? undefined : "capability__stack-item"} key={item.name}>
                <strong>{item.name}</strong>
                {item.detail ? <span>{item.detail}</span> : null}
                {item.examples ? (
                    <div className="capability__examples">
                        {item.examples.map((example) => (
                            <Link
                                to={example.route}
                                aria-label={`${item.name} 적용 사례: ${example.label}`}
                                key={example.route}
                            >
                                {example.label} <span aria-hidden="true">→</span>
                            </Link>
                        ))}
                    </div>
                ) : null}
            </li>
        ))}
    </ul>
)

const DesktopCapability = ({ group }) => (
    <article className={`capability capability--${group.id}`}>
        <div className="capability__heading">
            <h3>{group.label}</h3>
            <p>{group.summary}</p>
        </div>
        <CapabilityItems group={group} />
    </article>
)

const MobileCapability = ({ group }) => (
    <details className={`capability capability-mobile capability--${group.id}`}>
        <summary>
            <span className="capability-mobile__title">{group.label}</span>
            <span className="capability-mobile__summary">{group.summary}</span>
            <span className="capability-mobile__action" aria-hidden="true" />
        </summary>
        <CapabilityItems group={group} />
    </details>
)

const About = () => {
    return (
        <>
            <section
                className="experience-section blueprint-sheet"
                id="experience"
                aria-labelledby="experience-title"
            >
                <div className="experience-section__intro">
                    <h2 id="experience-title">학습</h2>
                </div>

                {/* 경력은 메인 상단의 경력 요약에서 한 번만 보여 주고, 여기에는 교육과 개인 활동을 둔다. */}
                <div className="timeline timeline--learning" aria-label="교육 및 개인 활동">
                    <section
                        className="timeline__group timeline__group--education"
                        aria-labelledby="education-title"
                    >
                        <h3 className="timeline__group-title" id="education-title">
                            교육
                        </h3>
                        <article className="timeline__item timeline__item--compact">
                            <div className="timeline__period">{education.period}</div>
                            <div className="timeline__content">
                                <span>
                                    {education.organization}, {education.meta}
                                </span>
                                <h4>{projectSummariesById[education.projectId].title}</h4>
                                <p>{education.description}</p>
                                <Link to="/projects/webrtc">교육 프로젝트 상세 보기 →</Link>
                            </div>
                        </article>
                    </section>

                    <section
                        className="timeline__group timeline__group--activities"
                        aria-labelledby="activities-title"
                    >
                        <h3 className="timeline__group-title" id="activities-title">
                            개인 활동
                        </h3>
                        {personalActivities.map((activity) => (
                            <article
                                className="timeline__item timeline__item--compact"
                                key={activity.id}
                            >
                                <div className="timeline__period">그룹 스터디</div>
                                <div className="timeline__content">
                                    <span>
                                        {activity.type}, {activity.role}
                                    </span>
                                    <h4>{activity.title}</h4>
                                    <p>{activity.summary}</p>
                                    <div className="timeline__links">
                                        {activity.links.map((link) => (
                                            <a
                                                href={link.href}
                                                key={link.href}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {link.label} ↗
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                </div>
            </section>

            <section
                className="capability-section blueprint-sheet"
                id="capabilities"
                aria-labelledby="capability-title"
            >
                <div className="capability-section__intro">
                    <h2 id="capability-title">기술</h2>
                </div>
                <div className="capability-list capability-list--desktop">
                    {homeSkillGroups.map((group) => (
                        <DesktopCapability group={group} key={group.id} />
                    ))}
                </div>
                <div className="capability-list capability-list--mobile">
                    {homeSkillGroups.map((group) => (
                        <MobileCapability group={group} key={group.id} />
                    ))}
                </div>
            </section>
        </>
    )
}

export default About

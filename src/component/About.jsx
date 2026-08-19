import { Link } from "react-router-dom"
import { careers, education, personalActivities } from "../data/profile"
import { homeSkillGroups } from "../data/homeSkills"
import { projectSummariesById } from "../data/projectSummaries"

const CareerItem = ({ career }) => {
    const project = projectSummariesById[career.projectId]

    return (
        <article className="timeline__item">
            <div className="timeline__period">{career.period}</div>
            <div className="timeline__content">
                <span>
                    {career.organization} / {career.position}
                </span>
                <h4>{project.title}</h4>
                <p>{career.description}</p>
                <Link to={project.route}>경력 프로젝트 상세 보기 →</Link>
            </div>
        </article>
    )
}

const CapabilityItems = ({ group }) => (
    <ul aria-label={`${group.label} 기술 및 적용 사례`}>
        {group.items.map((item) => (
            <li className={item.detail ? undefined : "capability__stack-item"} key={item.name}>
                <strong>{item.name}</strong>
                {item.detail ? <span>{item.detail}</span> : null}
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
                className="experience-section"
                id="experience"
                aria-labelledby="experience-title"
            >
                <div className="experience-section__intro">
                    <span className="section-kicker"># experience.md</span>
                    <h2 id="experience-title">경력 및 학습</h2>
                    <p>
                        교육, 실무 경력과 꾸준히 이어온 학습 활동을 시간과 성격에 맞게 나눴습니다.
                    </p>
                </div>

                <div className="timeline" aria-label="교육, 경력 및 개인 활동">
                    <section className="timeline__group" aria-labelledby="education-title">
                        <h3 className="timeline__group-title" id="education-title">
                            교육
                        </h3>
                        <article className="timeline__item">
                            <div className="timeline__period">{education.period}</div>
                            <div className="timeline__content">
                                <span>
                                    {education.organization} · {education.meta}
                                </span>
                                <h4>{projectSummariesById[education.projectId].title}</h4>
                                <p>{education.description}</p>
                                <Link to="/projects/webrtc">교육 프로젝트 상세 보기 →</Link>
                            </div>
                        </article>
                    </section>

                    <section className="timeline__group" aria-labelledby="career-title">
                        <h3 className="timeline__group-title" id="career-title">
                            경력
                        </h3>
                        {careers.map((career) => (
                            <CareerItem career={career} key={career.id} />
                        ))}
                    </section>

                    <section className="timeline__group" aria-labelledby="activities-title">
                        <h3 className="timeline__group-title" id="activities-title">
                            개인 활동
                        </h3>
                        {personalActivities.map((activity) => (
                            <article className="timeline__item" key={activity.id}>
                                <div className="timeline__period">Group Study</div>
                                <div className="timeline__content">
                                    <span>
                                        {activity.type} · {activity.role}
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
                className="capability-section"
                id="capabilities"
                aria-labelledby="capability-title"
            >
                <div className="capability-section__intro">
                    <span className="section-kicker"># skills.md</span>
                    <h2 id="capability-title">기술</h2>
                    <p>
                        백엔드와 프론트엔드 기술, 데이터 정합성과 운영 경험을 실제 적용 기준으로
                        정리했습니다.
                    </p>
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

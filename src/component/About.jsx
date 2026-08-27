import { Link } from "react-router-dom"
import { careers, education, personalActivities } from "../data/profile"
import { homeSkillGroups } from "../data/homeSkills"
import { projectSummariesById } from "../data/projectSummaries"

const CareerGroup = ({ career }) => {
    const projects = career.projectIds.map((projectId) => projectSummariesById[projectId])

    return (
        <section className="timeline__group timeline__group--career" aria-labelledby="career-title">
            <h3 className="timeline__group-title" id="career-title">
                경력
            </h3>
            <header className="career-company">
                <div>
                    <span>첫 회사 · 현재 재직</span>
                    <strong>{career.organization}</strong>
                </div>
                <time>{career.period}</time>
                <p>{career.description}</p>
            </header>
            <ol className="career-track" aria-label={`${career.organization} 수행 프로젝트`}>
                {projects.map((project, index) => (
                    <li
                        className={
                            index === 0 ? "career-track__item is-current" : "career-track__item"
                        }
                        key={project.id}
                    >
                        <article>
                            <div className="career-track__meta">
                                <time>{project.period}</time>
                                {index === 0 ? <span>진행 중</span> : <span>완료</span>}
                            </div>
                            <h4>{project.title}</h4>
                            <dl className="career-track__facts">
                                {[project.homeFacts[0], project.homeFacts[2]].map((fact) => (
                                    <div key={fact.label}>
                                        <dt>{fact.label}</dt>
                                        <dd>{fact.value}</dd>
                                    </div>
                                ))}
                            </dl>
                            <Link to={project.route}>{project.title} 상세 보기 →</Link>
                        </article>
                    </li>
                ))}
            </ol>
        </section>
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
                        공공 SI에서 맡은 개발 및 운영 업무, 교육 프로젝트와 개발 서적 스터디를
                        정리했습니다.
                    </p>
                </div>

                <div className="timeline timeline--split" aria-label="교육, 경력 및 개인 활동">
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
                                    {education.organization} · {education.meta}
                                </span>
                                <h4>{projectSummariesById[education.projectId].title}</h4>
                                <p>{education.description}</p>
                                <Link to="/projects/webrtc">교육 프로젝트 상세 보기 →</Link>
                            </div>
                        </article>
                    </section>

                    {careers.map((career) => (
                        <CareerGroup career={career} key={career.id} />
                    ))}

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
                    <p>사용한 기술과 해당 기술로 해결한 문제를 함께 정리했습니다.</p>
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

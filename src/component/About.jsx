import { Link } from "react-router-dom"
import { career, education, personalActivities, skillGroups } from "../data/profile"
import { projectsById } from "../data/projects"

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
                    <h2 id="experience-title">Experience &amp; Learning</h2>
                    <p>
                        교육, 실무 경력과 꾸준히 이어온 학습 활동을 시간과 성격에 맞게 나눴습니다.
                    </p>
                </div>

                <div className="timeline" aria-label="교육, 경력 및 개인 활동">
                    <section className="timeline__group" aria-labelledby="education-title">
                        <h3 className="timeline__group-title" id="education-title">
                            Education
                        </h3>
                        <article className="timeline__item">
                            <div className="timeline__period">{education.period}</div>
                            <div className="timeline__content">
                                <span>
                                    {education.organization} · {education.meta}
                                </span>
                                <h4>{projectsById[education.projectId].title}</h4>
                                <p>{education.description}</p>
                                <Link to="/projects/webrtc">교육 프로젝트 상세 보기 →</Link>
                            </div>
                        </article>
                    </section>

                    <section className="timeline__group" aria-labelledby="career-title">
                        <h3 className="timeline__group-title" id="career-title">
                            Career
                        </h3>
                        <article className="timeline__item">
                            <div className="timeline__period">{career.period}</div>
                            <div className="timeline__content">
                                <span>{career.position}</span>
                                <h4>{career.organization}</h4>
                                <p>{career.description}</p>
                                <Link to="/projects/defense">경력 프로젝트 상세 보기 →</Link>
                            </div>
                        </article>
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
                    <h2 id="capability-title">Skills</h2>
                    <p>기술 이름과 실제로 적용한 프로젝트를 함께 적었습니다.</p>
                </div>
                <div className="capability-list">
                    {skillGroups.map((group) => (
                        <article className="capability" key={group.label}>
                            <div className="capability__heading">
                                <h3>{group.label}</h3>
                                <span>{group.proof}</span>
                            </div>
                            <ul>
                                {group.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>
        </>
    )
}

export default About

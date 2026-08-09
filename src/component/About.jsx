import { Link } from "react-router-dom"
import { career, education, skillGroups, workPrinciples } from "../data/profile"
import { projectsById } from "../data/projects"

const About = () => {
    return (
        <>
            <section className="approach-section" id="about">
                <div className="section-heading section-heading--dark">
                    <span className="section-kicker">02 / 업무 방식</span>
                    <h2>
                        기술을 고르기 전에
                        <br />
                        <em>요구사항과 운영 환경</em>을 확인합니다.
                    </h2>
                    <p>업무 규칙, 장애 영향, 복구 방법을 확인한 뒤 필요한 기술을 선택합니다.</p>
                </div>

                <div className="principle-list">
                    {workPrinciples.map((principle) => (
                        <article className="principle" key={principle.number}>
                            <span className="principle__number">{principle.number}</span>
                            <h3>{principle.title}</h3>
                            <p>{principle.description}</p>
                            <Link to={principle.link}>{principle.linkLabel} →</Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className="experience-section" id="experience">
                <div className="section-heading section-heading--compact">
                    <span className="section-kicker"># experience.md</span>
                    <h2>
                        공공 SI부터 개인 서비스까지
                        <br />
                        다른 운영 환경을 경험했습니다.
                    </h2>
                </div>

                <div className="experience-layout">
                    <div className="timeline" aria-label="경력 및 교육">
                        <section className="timeline__group" aria-labelledby="education-title">
                            <h3 className="timeline__group-title" id="education-title">
                                <span aria-hidden="true">##</span> <span lang="en">Education</span>
                            </h3>
                            <article className="timeline__item">
                                <div className="timeline__period">{education.period}</div>
                                <div className="timeline__content">
                                    <span>
                                        {education.organization} · {education.meta}
                                    </span>
                                    <h4>{projectsById[education.projectId].title}</h4>
                                    <p>{education.description}</p>
                                    <Link to="/projects/webrtc">프로젝트 기록 보기 →</Link>
                                </div>
                            </article>
                        </section>
                        <section className="timeline__group" aria-labelledby="career-title">
                            <h3 className="timeline__group-title" id="career-title">
                                <span aria-hidden="true">##</span> <span lang="en">Career</span>
                            </h3>
                            <article className="timeline__item">
                                <div className="timeline__period">{career.period}</div>
                                <div className="timeline__content">
                                    <span>실무</span>
                                    <h4>
                                        {career.organization} · {career.position}
                                    </h4>
                                    <p>{career.description}</p>
                                    <Link to="/projects/defense">실무 사례 보기 →</Link>
                                </div>
                            </article>
                        </section>
                    </div>

                    <aside className="profile-statement">
                        <span className="profile-statement__label">최근 개발</span>
                        <blockquote>
                            “장애가 발생해도
                            <br />
                            안전하게 다시 처리할 수 있게 만듭니다.”
                        </blockquote>
                        <p>
                            최근에는 BATON에서 멱등 링크, 안전한 URL 점검, 메시지 재시도와 결과 불명
                            처리를 GO, WATCH, RELAY로 나눠 구현하고 있습니다.
                        </p>
                    </aside>
                </div>
            </section>

            <section className="capability-section" aria-labelledby="capability-title">
                <div className="capability-section__intro">
                    <span className="section-kicker">사용 기술과 적용 경험</span>
                    <h2 id="capability-title">
                        기술 이름과
                        <br />
                        사용한 곳을 함께 보여드립니다.
                    </h2>
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

import { Link } from "react-router-dom"
import { education, personalActivities } from "../data/profile"
import { homeSkillGroups } from "../data/homeSkills"
import GithubActivity from "./GithubActivity"

// 학습과 기술을 한 영역에 나란히 둔다. 최근 GitHub 기여 기록은 학습의 근거로 영역 끝에 둔다.
const About = () => (
    <section className="home-section" id="skills" aria-labelledby="skills-title">
        <div className="home-section__head">
            <h2 id="skills-title">학습과 기술</h2>
        </div>
        <div className="home-columns">
            <ul className="home-list" aria-label="교육과 그룹 스터디">
                <li>
                    <p className="home-list__meta">{education.period}</p>
                    <h3>{education.organization}</h3>
                    <p>
                        {education.summary}{" "}
                        <Link to={education.route}>
                            프로젝트 보기 <span aria-hidden="true">→</span>
                        </Link>
                    </p>
                </li>
                {personalActivities.map((activity) => (
                    <li key={activity.id}>
                        <p className="home-list__meta">그룹 스터디</p>
                        <h3>{activity.title}</h3>
                        <p>
                            {activity.summary}{" "}
                            <a
                                href={activity.links[0].href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${activity.links[0].label} 새 창에서 보기`}
                            >
                                기록 보기 <span aria-hidden="true">↗</span>
                            </a>
                        </p>
                    </li>
                ))}
            </ul>
            <ul className="home-list" aria-label="기술">
                {homeSkillGroups.map((group) => (
                    <li key={group.id}>
                        <h3>{group.label}</h3>
                        <p>
                            {group.items ? group.items.join(", ") : group.summary}
                            {group.link ? (
                                <>
                                    {" "}
                                    <Link to={group.link.route}>
                                        {group.link.label} <span aria-hidden="true">→</span>
                                    </Link>
                                </>
                            ) : null}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
        <GithubActivity />
    </section>
)

export default About

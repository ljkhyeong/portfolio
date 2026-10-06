import { Link } from "react-router-dom"
import { assetPath } from "../utils/assetPath"
import { projectSummaries } from "../data/projectSummaries"
import { formatPeriod } from "../data/timeline"

const ProjectLinks = ({ project }) => (
    <p className="home-card__links">
        <Link to={project.route} aria-label={`${project.title} 프로젝트 상세 보기`}>
            상세 보기 <span aria-hidden="true">→</span>
        </Link>
        {project.liveSite && (
            <a
                href={project.liveSite.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} ${project.liveSite.label} 새 창에서 보기`}
            >
                {project.liveSite.label} <span aria-hidden="true">↗</span>
            </a>
        )}
        {project.homeRepository && (
            <a
                href={project.homeRepository.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} ${project.homeRepository.label} 저장소 새 창에서 보기`}
            >
                {project.homeRepository.label} <span aria-hidden="true">↗</span>
            </a>
        )}
    </p>
)

// 실제 화면은 상세의 화면 묶음으로 이어진다. 촬영 조건(테스트 데이터 등)을 화면 아래에 함께 쓴다.
const CoverShot = ({ project, ratio }) => {
    const shot = project.coverScreenshot

    // 화면 캡처가 없는 프로젝트는 맡은 처리 흐름을 글자로 보여 준다.
    if (!shot) {
        return project.coverText ? (
            <figure className="home-shot home-shot--text">
                <div className="home-shot__text" role="img" aria-label={project.coverText.text}>
                    {project.coverText.text}
                </div>
                <figcaption>
                    <strong>처리 흐름</strong> {project.coverText.note}
                </figcaption>
            </figure>
        ) : null
    }

    return (
        <figure className={`home-shot home-shot--${ratio}`}>
            <Link to={project.route} aria-label={`${project.title} ${shot.label} 화면과 상세 보기`}>
                <img
                    src={assetPath(shot.src)}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    loading="lazy"
                    decoding="async"
                />
            </Link>
            <figcaption>
                <strong>{shot.label}</strong> {shot.note}
            </figcaption>
        </figure>
    )
}

const FeaturedProject = ({ project }) => (
    <li>
        <article className="home-feature">
            <CoverShot project={project} ratio="wide" />
            <h3>
                <Link to={project.route}>{project.title}</Link>
            </h3>
            <p className="home-card__meta">
                {[formatPeriod(project.period), project.stage, project.visibility].join(", ")}
            </p>
            <p>{project.homeSummary}</p>
            <p>{project.homeStory}</p>
            <p className="home-card__check">
                <strong>확인한 범위</strong> {project.homeCheck}
            </p>
            <ProjectLinks project={project} />
        </article>
    </li>
)

const MoreProject = ({ project }) => (
    <li>
        <article className="home-more__item">
            <CoverShot project={project} ratio="card" />
            <p className="home-card__meta">{formatPeriod(project.period)}</p>
            <h3>
                <Link to={project.route}>{project.title}</Link>
            </h3>
            <p>{project.homeSummary}</p>
            {project.homeCheck ? <p className="home-card__check">{project.homeCheck}</p> : null}
            <ProjectLinks project={project} />
        </article>
    </li>
)

const Projects = () => {
    const personal = projectSummaries.filter((project) => project.homeCategory === "personal")
    const more = projectSummaries.filter((project) => project.homeCategory === "more")

    return (
        <>
            <section className="home-section" id="work" aria-labelledby="work-title">
                <div className="home-section__head">
                    <h2 id="work-title">개인 프로젝트</h2>
                </div>
                <ol className="home-features" aria-label="개인 프로젝트 목록">
                    {personal.map((project) => (
                        <FeaturedProject project={project} key={project.id} />
                    ))}
                </ol>
            </section>
            <section className="home-section" id="more" aria-labelledby="more-title">
                <div className="home-section__head">
                    <h2 id="more-title">그 밖의 프로젝트</h2>
                </div>
                <ol className="home-more" aria-label="그 밖의 프로젝트 목록">
                    {more.map((project) => (
                        <MoreProject project={project} key={project.id} />
                    ))}
                </ol>
            </section>
        </>
    )
}

export default Projects

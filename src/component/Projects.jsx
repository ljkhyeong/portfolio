import { Link } from "react-router-dom"
import { featuredProjects } from "../data/projects"
import { assetPath } from "../utils/assetPath"
import GalleryScreenshot from "./GalleryScreenshot"
import "../css/Projects.css"

const ProductArtwork = ({ project }) => {
    const isBaton = project.visual === "baton"

    return (
        <figure className={`project-art project-art--${project.visual}`}>
            <div className="project-art__chrome" aria-hidden="true">
                <span />
                <span />
                <span />
                <strong>{isBaton ? "BATON / ONBOARDING" : "HAPPYGALLERY / HOME"}</strong>
            </div>
            <div className="project-art__viewport">
                {isBaton ? (
                    <img
                        src={assetPath("baton-product-ui.png")}
                        width="1440"
                        height="900"
                        loading="lazy"
                        decoding="async"
                        alt="BATON 팀 생성 온보딩 실행 화면"
                    />
                ) : (
                    <GalleryScreenshot sizes="(max-width: 860px) 100vw, 55vw" />
                )}
            </div>
            <figcaption>
                <span>실제 실행 화면</span>
                <strong>{isBaton ? "조직 생성 온보딩" : "공방 상품 및 클래스 홈"}</strong>
            </figcaption>
        </figure>
    )
}

const ServiceHierarchy = ({ services }) => {
    const core = services.find((service) => service.primary)
    const supporting = services.filter((service) => !service.primary)

    return (
        <section className="service-hierarchy" aria-labelledby="baton-services-title">
            <div className="service-hierarchy__heading">
                <span>서비스 구성</span>
                <h4 id="baton-services-title">
                    Core가 메인, GO · WATCH · RELAY가 기능별 서비스입니다.
                </h4>
            </div>
            <article className="service-card service-card--core">
                <div>
                    <span>MAIN / {core.database}</span>
                    <h5>{core.name}</h5>
                    <strong>{core.role}</strong>
                </div>
                <p>{core.detail}</p>
                <em>{core.evidence}</em>
            </article>
            <div className="service-hierarchy__branch" aria-hidden="true">
                <span>기능별 독립 서비스</span>
            </div>
            <div className="service-hierarchy__services">
                {supporting.map((service) => (
                    <article className="service-card" key={service.name}>
                        <span>{service.database}</span>
                        <h5>{service.name}</h5>
                        <strong>{service.role}</strong>
                        <p>{service.detail}</p>
                        <em>{service.evidence}</em>
                    </article>
                ))}
            </div>
        </section>
    )
}

const EngineeringSummary = ({ project }) => (
    <div className="project-showcase__engineering">
        <article className="architecture-note">
            <span>{project.architecture.label}</span>
            <h4>{project.architecture.title}</h4>
            <p>{project.architecture.description}</p>
        </article>
        <div className="engineering-notes">
            {project.spotlights.map((spotlight) => (
                <article key={spotlight.label}>
                    <span>{spotlight.label}</span>
                    <h4>{spotlight.title}</h4>
                    <p>{spotlight.text}</p>
                </article>
            ))}
        </div>
        {project.services ? <ServiceHierarchy services={project.services} /> : null}
    </div>
)

const Projects = () => {
    return (
        <section className="work-section" id="work">
            <div className="section-heading section-heading--work">
                <span className="section-kicker">01 / 대표 프로젝트</span>
                <h2>
                    정상 흐름보다
                    <br />
                    <em>실패 이후의 상태</em>를 먼저 설계했습니다.
                </h2>
                <p>현재 경력을 가장 잘 보여주는 두 프로젝트와 설계 판단을 중심으로 정리했습니다.</p>
            </div>

            <div className="project-showcases">
                {featuredProjects.map((project) => (
                    <article
                        className={`project-showcase project-showcase--${project.visual}`}
                        key={project.id}
                    >
                        <div className="project-showcase__index">{project.index}</div>
                        <div className="project-showcase__content">
                            <div className="project-showcase__meta">
                                <span>{project.eyebrow}</span>
                                <span>{project.period}</span>
                            </div>
                            <h3>{project.title}</h3>
                            <p>{project.summary}</p>
                            <ul className="project-showcase__tags" aria-label="주요 기술">
                                {project.tags.map((tag) => (
                                    <li key={tag}>{tag}</li>
                                ))}
                            </ul>
                            <div className="project-showcase__proofs">
                                {project.proofs.map((proof) => (
                                    <div key={`${proof.value}-${proof.label}`}>
                                        <strong>{proof.value}</strong>
                                        <span>{proof.label}</span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                className="project-showcase__link"
                                to={project.route}
                                aria-label={`${project.title} 설계와 문제 해결 과정 보기`}
                            >
                                설계와 문제 해결 과정 보기
                                <span aria-hidden="true">↗</span>
                            </Link>
                        </div>
                        <div className="project-showcase__visual">
                            <ProductArtwork project={project} />
                        </div>
                        <EngineeringSummary project={project} />
                    </article>
                ))}
            </div>
        </section>
    )
}

export default Projects

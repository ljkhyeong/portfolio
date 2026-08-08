import { Link } from "react-router-dom"
import { featuredProjects } from "../data/projects"
import ProjectScreenshotGallery from "./ProjectScreenshotGallery"
import "../css/Projects.css"

const ServiceHierarchy = ({ services }) => {
    const core = services.find((service) => service.primary)
    const supporting = services.filter((service) => !service.primary)

    return (
        <section className="service-hierarchy" aria-labelledby="baton-services-title">
            <div className="service-hierarchy__heading">
                <span>## 서비스 구성</span>
                <h4 id="baton-services-title">Core와 3개의 독립 마이크로서비스</h4>
            </div>
            <article className="service-card service-card--core">
                <div>
                    <span>
                        CORE / {core.kind} / {core.database}
                    </span>
                    <h5>{core.name}</h5>
                    <strong>{core.role}</strong>
                </div>
                <p>{core.detail}</p>
                <em>{core.evidence}</em>
            </article>
            <div className="service-hierarchy__branch" aria-hidden="true">
                <span>실패 특성별로 분리한 서비스</span>
            </div>
            <div className="service-hierarchy__services">
                {supporting.map((service) => (
                    <Link
                        className="service-card service-card--microservice"
                        key={service.name}
                        to={service.route}
                        aria-label={`BATON ${service.name} 마이크로서비스 상세 보기`}
                    >
                        <span>
                            {service.kind} / {service.database}
                        </span>
                        <h5>{service.name}</h5>
                        <strong>{service.role}</strong>
                        <p>{service.detail}</p>
                        <em>{service.evidence}</em>
                        <b>
                            상세 보기 <span aria-hidden="true">↗</span>
                        </b>
                    </Link>
                ))}
            </div>
        </section>
    )
}

const DecisionRecord = ({ decision }) => (
    <dl className="decision-record">
        <div>
            <dt>문제 상황</dt>
            <dd>{decision.problem}</dd>
        </div>
        <div>
            <dt>해결</dt>
            <dd>{decision.solution}</dd>
        </div>
        <div className="decision-record__tradeoff">
            <dt>트레이드오프</dt>
            <dd>{decision.tradeoff}</dd>
        </div>
    </dl>
)

const ProjectDocuments = ({ documentGroups, documents, projectId }) => (
    <section className="project-documents" aria-labelledby={`${projectId}-documents-title`}>
        <div className="project-documents__heading">
            <span aria-hidden="true">###</span>
            <h4 id={`${projectId}-documents-title`}>문서 분류와 대표 문서</h4>
            <p>전체 기록의 구조를 먼저 보여주고, 면접에서 이어 읽을 문서만 골랐습니다.</p>
        </div>
        <div className="project-documents__body">
            <div className="document-catalog" aria-label="문서 분류">
                {documentGroups.map((group) => (
                    <article key={group.id}>
                        <code>{group.label}</code>
                        <strong>{group.count}</strong>
                        <p>{group.summary}</p>
                    </article>
                ))}
            </div>
            <div className="representative-documents">
                <h5>
                    <span aria-hidden="true">####</span> 대표 문서
                </h5>
                <ul>
                    {documents.map((doc) => (
                        <li key={doc.href}>
                            <a
                                href={doc.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${doc.label} 대표 문서 새 창에서 보기`}
                            >
                                <code>[{doc.type}]</code>
                                <strong>{doc.label}</strong>
                                <span aria-hidden="true">↗</span>
                            </a>
                            <p>{doc.note}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </section>
)

const EngineeringSummary = ({ project }) => (
    <div className="project-showcase__engineering">
        <article className="architecture-note">
            <span>
                <b aria-hidden="true">##</b> {project.architecture.label}
            </span>
            <h4>{project.architecture.title}</h4>
            <p>{project.architecture.description}</p>
            <blockquote>
                <strong>트레이드오프</strong>
                {project.architecture.tradeoff}
            </blockquote>
        </article>
        <div className="engineering-notes-block">
            <div className="engineering-notes__heading">
                <span aria-hidden="true">###</span>
                <h4>대표 문제 해결</h4>
            </div>
            <div className="engineering-notes">
                {project.spotlights.map((spotlight) => (
                    <article key={spotlight.label}>
                        <span>
                            <b aria-hidden="true">####</b> {spotlight.label}
                        </span>
                        <h4>{spotlight.title}</h4>
                        <DecisionRecord decision={spotlight} />
                    </article>
                ))}
            </div>
        </div>
        {project.services ? <ServiceHierarchy services={project.services} /> : null}
        <ProjectDocuments
            documentGroups={project.documentGroups}
            documents={project.documents}
            projectId={project.id}
        />
    </div>
)

const Projects = () => {
    return (
        <section className="work-section" id="work">
            <div className="section-heading section-heading--work">
                <span className="section-kicker"># projects.md</span>
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
                            <ProjectScreenshotGallery project={project} />
                        </div>
                        <EngineeringSummary project={project} />
                    </article>
                ))}
            </div>
        </section>
    )
}

export default Projects

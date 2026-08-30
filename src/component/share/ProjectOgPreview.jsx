import { projectOgCardsById } from "../../data/projectOg"
import { BatonServiceFlowSvg } from "../project/diagrams/BatonServiceFlowDiagram"
import "../../css/ProjectOg.css"

const ProjectOgDiagram = ({ card }) => {
    const prefix = `og-${card.id}`

    return (
        <svg viewBox="0 0 544 340" role="img" aria-labelledby={`${prefix}-title ${prefix}-desc`}>
            <title id={`${prefix}-title`}>{card.caption}</title>
            <desc id={`${prefix}-desc`}>
                {card.steps?.map(([title, detail]) => `${title}: ${detail}`).join(". ") ??
                    "조직 운영 Core와 GO, WATCH, RELAY, BRIEF, CAL, ROUND의 책임을 분리합니다."}
            </desc>
            <defs>
                <marker
                    id={`${prefix}-arrow`}
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                >
                    <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--og-muted)" />
                </marker>
            </defs>
            {card.steps ? (
                <>
                    {[112, 220].map((y) => (
                        <path
                            key={y}
                            d={`M 272 ${y} V ${y + 24}`}
                            className="og-flow-arrow"
                            markerEnd={`url(#${prefix}-arrow)`}
                        />
                    ))}
                    {card.steps.map(([title, detail], index) => (
                        <g
                            key={title}
                            className={
                                index === 1 ? "og-flow-node og-flow-node--focal" : "og-flow-node"
                            }
                            transform={`translate(40, ${32 + index * 108})`}
                        >
                            <rect width="464" height="80" rx="8" />
                            <text x="20" y="24" className="og-flow-number">
                                0{index + 1}
                            </text>
                            <text x="232" y="32" className="og-flow-title">
                                {title}
                            </text>
                            <text x="232" y="60" className="og-flow-detail">
                                {detail}
                            </text>
                        </g>
                    ))}
                </>
            ) : (
                <>
                    <path d="M 272 92 V 300" className="og-flow-arrow" />
                    {[172, 236, 300].map((y) => (
                        <g key={y}>
                            <path
                                d={`M 272 ${y} H 232`}
                                className="og-flow-arrow"
                                markerEnd={`url(#${prefix}-arrow)`}
                            />
                            <path
                                d={`M 272 ${y} H 312`}
                                className="og-flow-arrow"
                                markerEnd={`url(#${prefix}-arrow)`}
                            />
                            <circle cx="272" cy={y} r="3" fill="var(--og-muted)" />
                        </g>
                    ))}
                    <g className="og-flow-node og-flow-node--focal" transform="translate(152, 12)">
                        <rect width="240" height="80" rx="8" />
                        <text x="120" y="32" className="og-flow-title">
                            BATON Core
                        </text>
                        <text x="120" y="60" className="og-flow-detail">
                            조직, 업무, 인수인계
                        </text>
                    </g>
                    {card.labels.map((label, index) => (
                        <g
                            className="og-flow-node"
                            key={label}
                            transform={`translate(${index % 2 === 0 ? 36 : 316}, ${148 + Math.floor(index / 2) * 64})`}
                        >
                            <rect width="192" height="48" rx="8" />
                            <text x="96" y="31" className="og-flow-title">
                                {label}
                            </text>
                        </g>
                    ))}
                </>
            )}
        </svg>
    )
}

const ProjectOgPreview = ({ imageId }) => {
    const card = projectOgCardsById[imageId]

    if (!card) return <p>공유 이미지 대상을 찾을 수 없습니다.</p>

    return (
        <main className="project-og" data-og-project={card.id}>
            <header className="project-og__header">
                <span className="project-og__brand">
                    ljkhyeong<span aria-hidden="true"> / </span>PORTFOLIO
                </span>
                <span>백엔드 개발자 임정규</span>
            </header>
            <div className="project-og__body">
                <section className="project-og__copy">
                    <p className="project-og__category">{card.category}</p>
                    <h1
                        className={
                            card.serviceId
                                ? "project-og__title project-og__title--service"
                                : "project-og__title"
                        }
                    >
                        {card.title.map((line) => (
                            <span key={line}>{line}</span>
                        ))}
                    </h1>
                    <p className="project-og__description">{card.description}</p>
                </section>
                <figure className="project-og__visual">
                    <figcaption>{card.caption}</figcaption>
                    {card.serviceId ? (
                        <BatonServiceFlowSvg serviceId={card.serviceId} compact />
                    ) : (
                        <ProjectOgDiagram card={card} />
                    )}
                </figure>
            </div>
            <footer className="project-og__footer">
                <span>설계, 구현 및 검증 기록</span>
                <span>{card.route}</span>
            </footer>
        </main>
    )
}

export default ProjectOgPreview

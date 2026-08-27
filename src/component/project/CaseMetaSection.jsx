import "../../css/CaseMetaSection.css"

const CaseMetaSection = ({
    id,
    headingId,
    sectionNumber,
    technologies,
    technologyLabel,
    links = [],
    linkNote,
}) => (
    <section className="case-meta" id={id} aria-labelledby={headingId}>
        <div className="case-meta__stack">
            <div className="case-section-heading">
                <span>{sectionNumber}</span>
                <h2 id={headingId}>사용 기술</h2>
            </div>
            <ul aria-label={technologyLabel}>
                {technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                ))}
            </ul>
        </div>
        <div className="case-meta__links">
            <div className="case-section-heading">
                <span>LINK</span>
                <h2>관련 링크</h2>
            </div>
            {links.length > 0 ? (
                <ul>
                    {links.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} target="_blank" rel="noreferrer">
                                <span>{link.label}</span>
                                <span aria-hidden="true">↗</span>
                            </a>
                            {link.note ? <p>{link.note}</p> : null}
                        </li>
                    ))}
                </ul>
            ) : null}
            {linkNote ? <p className="case-meta__link-note">{linkNote}</p> : null}
        </div>
    </section>
)

export default CaseMetaSection

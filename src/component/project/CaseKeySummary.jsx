import "../../css/CaseKeySummary.css"

const CaseKeySummary = ({ items }) => (
    <dl className="case-key-summary" aria-label="프로젝트 핵심 요약">
        {items.map((item) => (
            <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.text}</dd>
            </div>
        ))}
    </dl>
)

export default CaseKeySummary

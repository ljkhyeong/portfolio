import "../../css/DocumentList.css"

// 대표 문서 영역의 공용 표시. 프로젝트 상세와 BATON 서비스 상세가 함께 쓴다.
// 분류별 작성 수는 접지 않고 제목 아래에 펼쳐 두고, 문서는 유형 표시와 제목·설명을 한 행으로 둔다.
export const DocumentCounts = ({ groups, label }) => (
    <dl className="document-counts" aria-label={label}>
        {groups.map((group) => (
            <div key={group.label}>
                <dt>{group.label}</dt>
                <dd>{group.count}</dd>
            </div>
        ))}
    </dl>
)

export const DocumentItems = ({ documents }) => (
    <ul className="document-items">
        {documents.map((doc) => (
            <li key={doc.href}>
                <span className="document-items__type">{doc.type}</span>
                <div>
                    <a
                        href={doc.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${doc.label} 대표 문서 새 창에서 보기`}
                    >
                        <strong>{doc.label}</strong>
                        <span aria-hidden="true">↗</span>
                    </a>
                    <p>{doc.note}</p>
                </div>
            </li>
        ))}
    </ul>
)

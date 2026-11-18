// 데이터에서 지정한 첫 구절만 강조하며, 검색 자료에는 원문 문자열을 그대로 사용한다.
const HighlightedText = ({ text, highlight }) => {
    const start = highlight ? text.indexOf(highlight) : -1
    if (start < 0) return text
    return (
        <>
            {text.slice(0, start)}
            <strong className="project-impact">{highlight}</strong>
            {text.slice(start + highlight.length)}
        </>
    )
}
export default HighlightedText

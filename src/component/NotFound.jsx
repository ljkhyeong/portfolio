import { Link } from "react-router-dom"

const NotFound = () => (
    <main className="not-found" id="main-content">
        <div className="not-found__inner">
            <span>404 / NOT FOUND</span>
            <h1>요청한 페이지를 찾을 수 없습니다.</h1>
            <p>주소가 바뀌었거나 더 이상 제공하지 않는 페이지입니다.</p>
            <Link to="/">
                프로젝트 목록으로 돌아가기 <span aria-hidden="true">→</span>
            </Link>
        </div>
    </main>
)

export default NotFound

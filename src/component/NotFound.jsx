import { Link, useLocation } from "react-router-dom"
import { normalizeRoutePath } from "../data/routeMeta"

const NotFound = () => {
    const { pathname } = useLocation()

    return (
        <main className="not-found" id="main-content">
            <div className="not-found__inner">
                <span className="not-found__code">404 / NOT FOUND</span>
                <h1 data-route-heading={normalizeRoutePath(pathname)}>
                    페이지를 찾을 수 없습니다.
                </h1>
                <p>주소가 변경됐거나 삭제된 페이지입니다.</p>
                <nav className="not-found__links" aria-label="다른 페이지로 이동">
                    <Link className="not-found__primary" to="/">
                        홈으로 돌아가기 <span aria-hidden="true">→</span>
                    </Link>
                    <Link to="/#work">프로젝트 목록</Link>
                    <Link to="/search">문서 검색</Link>
                </nav>
            </div>
        </main>
    )
}

export default NotFound

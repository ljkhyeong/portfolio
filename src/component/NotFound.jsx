import { Link, useLocation } from "react-router-dom"
import { normalizeRoutePath } from "../data/routeMeta"

const NotFound = () => {
    const { pathname } = useLocation()

    return (
        <main className="not-found" id="main-content">
            <div className="not-found__inner">
                <span>404 / NOT FOUND</span>
                <h1 data-route-heading={normalizeRoutePath(pathname)}>
                    페이지를 찾을 수 없습니다.
                </h1>
                <p>주소가 변경됐거나 삭제된 페이지입니다.</p>
                <Link to="/">
                    홈으로 돌아가기 <span aria-hidden="true">→</span>
                </Link>
            </div>
        </main>
    )
}

export default NotFound

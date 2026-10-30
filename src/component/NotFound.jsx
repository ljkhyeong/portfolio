import { Link, useLocation } from "react-router-dom"
import PortfolioNavigation from "./PortfolioNavigation"
import { normalizeRoutePath } from "../data/routeMeta"

// 다른 화면과 같은 머리글에 프로젝트와 문서 검색 링크를 두고, 본문에는 홈으로 가는 링크 하나만 둔다.
const NotFound = () => {
    const { pathname } = useLocation()

    return (
        <div className="not-found">
            <header>
                <PortfolioNavigation
                    label="포트폴리오 메뉴"
                    links={
                        <>
                            <Link to="/#work">프로젝트</Link>
                            <Link to="/search">문서 검색</Link>
                        </>
                    }
                />
            </header>
            <main className="not-found__main" id="main-content">
                <p className="not-found__code">404</p>
                <h1 data-route-heading={normalizeRoutePath(pathname)}>
                    페이지를 찾을 수 없습니다.
                </h1>
                <p className="not-found__lead">주소가 변경됐거나 삭제된 페이지입니다.</p>
                <Link className="not-found__home" to="/">
                    홈으로 돌아가기 <span aria-hidden="true">→</span>
                </Link>
            </main>
        </div>
    )
}

export default NotFound

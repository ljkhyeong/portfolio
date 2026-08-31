import { Link } from "react-router-dom"
import { assetPath } from "../utils/assetPath"
import "../css/PortfolioNavigation.css"

const PortfolioNavigation = ({ isHome = false, label, links, actions }) => {
    const BrandLink = isHome ? "a" : Link
    const brandDestination = isHome ? { href: "#top" } : { to: "/" }

    return (
        <nav className={`site-nav site-nav--${isHome ? "home" : "detail"}`} aria-label={label}>
            <BrandLink
                className="site-nav__brand"
                aria-label="ljkhyeong 포트폴리오 홈"
                {...brandDestination}
            >
                <span className="site-nav__avatar" aria-hidden="true">
                    <img src={assetPath("ljkhyeong-avatar.png")} alt="" width="160" height="160" />
                </span>
                <strong>ljkhyeong</strong>
            </BrandLink>
            <div className="site-nav__links">{links}</div>
            <div className="site-nav__actions">{actions}</div>
        </nav>
    )
}

export default PortfolioNavigation

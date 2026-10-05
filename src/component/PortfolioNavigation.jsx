import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { assetPath } from "../utils/assetPath"
import { portfolioProfile } from "../data/profile"
import "../css/PortfolioNavigation.css"

// 800px 이하 메인의 고정 메뉴는 두 줄(132px)이라 작은 화면을 많이 가린다.
// 아래로 스크롤하면 이름·연락처 줄을 접고 섹션 링크 줄만 남기고, 위로 스크롤하면 다시 펼친다.
const COMPACT_QUERY = "(max-width: 800px)"
const COMPACT_START = 160
const SCROLL_TOLERANCE = 4

const useCompactOnScroll = (enabled) => {
    const [compact, setCompact] = useState(false)

    useEffect(() => {
        if (!enabled || typeof window.matchMedia !== "function") {
            return undefined
        }
        const media = window.matchMedia(COMPACT_QUERY)
        let lastY = window.scrollY
        const handleScroll = () => {
            const y = window.scrollY
            if (!media.matches || y <= COMPACT_START) {
                setCompact(false)
            } else if (y > lastY + SCROLL_TOLERANCE) {
                setCompact(true)
            } else if (y < lastY - SCROLL_TOLERANCE) {
                setCompact(false)
            } else {
                return
            }
            lastY = y
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [enabled])

    return compact
}

const PortfolioNavigation = ({ isHome = false, label, links, actions }) => {
    const BrandLink = isHome ? "a" : Link
    const brandDestination = isHome ? { href: "#top" } : { to: "/" }
    const compact = useCompactOnScroll(isHome)

    return (
        <nav
            className={`site-nav site-nav--${isHome ? "home" : "detail"}${compact ? " site-nav--compact" : ""}`}
            aria-label={label}
        >
            <BrandLink
                className="site-nav__brand"
                aria-label={`${portfolioProfile.name} 포트폴리오 홈`}
                {...brandDestination}
            >
                <span className="site-nav__avatar" aria-hidden="true">
                    <img src={assetPath("ljkhyeong-avatar.png")} alt="" width="160" height="160" />
                </span>
                <strong>{portfolioProfile.name}</strong>
                {isHome && <span className="site-nav__role">{portfolioProfile.role}</span>}
            </BrandLink>
            <div className="site-nav__links">{links}</div>
            <div className="site-nav__actions">{actions}</div>
        </nav>
    )
}

export default PortfolioNavigation

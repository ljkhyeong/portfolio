import { assetPath } from "../utils/assetPath"
import { portfolioProfile } from "../data/profile"

const Header = () => {
    return (
        <header className="site-header">
            <nav className="site-nav" aria-label="주요 메뉴">
                <a className="site-nav__brand" href="#top" aria-label="임정규 포트폴리오 홈">
                    <span>JK</span>
                    <strong>임정규</strong>
                </a>
                <div className="site-nav__links">
                    <a href="#work">프로젝트</a>
                    <a href="#experience">경력 및 교육</a>
                    <a href="#capabilities">기술</a>
                </div>
                <a className="site-nav__contact" href={`mailto:${portfolioProfile.email}`}>
                    이야기 나누기
                    <span aria-hidden="true">↗</span>
                </a>
            </nav>

            <section className="hero" id="top">
                <div className="hero__copy">
                    <p className="hero__name">
                        {portfolioProfile.name} · {portfolioProfile.role}
                    </p>
                    <h1>
                        {portfolioProfile.headline.lead}
                        <br />
                        <em>{portfolioProfile.headline.emphasis}</em>
                        {portfolioProfile.headline.tail}
                    </h1>
                    <p className="hero__summary">{portfolioProfile.webSummary}</p>
                    <div className="hero__actions">
                        <a className="button button--primary" href="#work">
                            프로젝트 보기
                            <span aria-hidden="true">↓</span>
                        </a>
                        <a
                            className="button button--ghost"
                            href={assetPath("포트폴리오최신.pdf")}
                            target="_blank"
                            rel="noreferrer"
                            download
                        >
                            PDF 내려받기
                            <span aria-hidden="true">↓</span>
                        </a>
                    </div>
                </div>
                <p className="hero__stack">Java · Spring · MySQL · Redis · React</p>
            </section>
        </header>
    )
}

export default Header

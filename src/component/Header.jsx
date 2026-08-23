import { Link } from "react-router-dom"
import { assetPath } from "../utils/assetPath"
import { portfolioProfile } from "../data/profile"
import { homeHeroContent } from "../data/homeHero"

const Header = () => {
    return (
        <header className="site-header">
            <nav className="site-nav" aria-label="주요 메뉴">
                <a className="site-nav__brand" href="#top" aria-label="ljkhyeong 포트폴리오 홈">
                    <span className="site-nav__avatar" aria-hidden="true">
                        <img
                            src={assetPath("ljkhyeong-avatar.png")}
                            alt=""
                            width="160"
                            height="160"
                        />
                    </span>
                    <strong>ljkhyeong</strong>
                </a>
                <div className="site-nav__links">
                    <a href="#work">프로젝트</a>
                    <a href="#experience">경력 및 학습</a>
                    <a href="#capabilities">기술</a>
                    <Link to="/search">문서 검색</Link>
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
                    <h1 data-route-heading="/">
                        {homeHeroContent.headline.lead}
                        <br />
                        <em>{homeHeroContent.headline.emphasis}</em>
                        {homeHeroContent.headline.tail}
                    </h1>
                    <p className="hero__summary">{homeHeroContent.summary}</p>
                    <div className="hero__actions">
                        <a className="button button--primary" href="#work">
                            프로젝트 보기
                            <span aria-hidden="true">↓</span>
                        </a>
                        <a
                            className="button button--ghost"
                            href={assetPath("임정규_포트폴리오.pdf")}
                            target="_blank"
                            rel="noreferrer"
                            download
                        >
                            PDF 내려받기
                            <span aria-hidden="true">↓</span>
                        </a>
                    </div>
                </div>
                <div className="hero__signals">
                    <p className="hero__signals-label">대표 경험</p>
                    <ul aria-label="대표 경험 프로젝트">
                        {homeHeroContent.signals.map((signal) => (
                            <li key={signal.route}>
                                <Link to={signal.route}>
                                    <span className="hero__signal-label">{signal.label}</span>
                                    <strong>{signal.title}</strong>
                                    <span className="hero__signal-evidence">{signal.evidence}</span>
                                    <span className="hero__signal-action" aria-hidden="true">
                                        →
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </header>
    )
}

export default Header

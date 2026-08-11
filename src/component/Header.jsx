import { assetPath } from "../utils/assetPath"
import { portfolioProfile } from "../data/profile"

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
                <ul className="hero__proofs" aria-label="대표 검증 근거">
                    {portfolioProfile.heroProofs.map((proof) => (
                        <li key={proof}>{proof}</li>
                    ))}
                </ul>
            </section>
        </header>
    )
}

export default Header

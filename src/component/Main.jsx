import Header from "./Header"
import Projects from "./Projects"
import About from "./About"
import { portfolioProfile } from "../data/profile"
import "../css/Main.css"

const Main = () => {
    return (
        <div className="portfolio-page">
            <a className="skip-link" href="#main-content">
                본문으로 건너뛰기
            </a>
            <Header />
            <main id="main-content" tabIndex="-1">
                <Projects />
                <About />
            </main>
            <footer className="site-footer" id="contact">
                <div className="site-footer__lead">
                    <div className="section-heading-meta">
                        <span className="section-kicker">연락처</span>
                        <span className="section-index" aria-hidden="true">
                            04
                        </span>
                    </div>
                    <h2>
                        백엔드 개발자 포지션이나
                        <br /> 프로젝트 경험에 관해 문의해 주세요.
                    </h2>
                </div>
                <div className="site-footer__contact" aria-label="연락처 목록">
                    <a
                        href={`mailto:${portfolioProfile.email}`}
                        aria-label={`${portfolioProfile.email}로 메일 보내기`}
                    >
                        <span className="site-footer__contact-label">Email</span>
                        <strong>{portfolioProfile.email}</strong>
                        <span className="site-footer__contact-action" aria-hidden="true">
                            ↗
                        </span>
                    </a>
                    <a
                        href={`tel:${portfolioProfile.phoneHref}`}
                        aria-label={`${portfolioProfile.phone}로 전화 걸기`}
                    >
                        <span className="site-footer__contact-label">Phone</span>
                        <strong>{portfolioProfile.phone}</strong>
                        <span className="site-footer__contact-action" aria-hidden="true">
                            ↗
                        </span>
                    </a>
                    <a
                        href={portfolioProfile.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub 프로필 새 창에서 보기"
                    >
                        <span className="site-footer__contact-label">Profile</span>
                        <strong>GitHub</strong>
                        <span className="site-footer__contact-action" aria-hidden="true">
                            ↗
                        </span>
                    </a>
                </div>
                <div className="site-footer__meta">
                    <span>
                        {portfolioProfile.name} · {portfolioProfile.role}
                    </span>
                    <span>{portfolioProfile.location}</span>
                </div>
            </footer>
        </div>
    )
}

export default Main

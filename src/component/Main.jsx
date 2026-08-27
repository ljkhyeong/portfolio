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
                    <span className="section-kicker">연락처</span>
                    <h2>
                        백엔드 개발자 포지션이나
                        <br /> 프로젝트 경험에 관해 문의해 주세요.
                    </h2>
                </div>
                <div className="site-footer__contact">
                    <a href={`mailto:${portfolioProfile.email}`}>{portfolioProfile.email}</a>
                    <a href={`tel:${portfolioProfile.phoneHref}`}>{portfolioProfile.phone}</a>
                    <a href={portfolioProfile.github} target="_blank" rel="noreferrer">
                        GitHub ↗
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

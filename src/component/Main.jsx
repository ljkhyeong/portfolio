import Header from "./Header"
import Projects from "./Projects"
import About from "./About"
import { portfolioProfile } from "../data/profile"
import "../css/Main.css"

const Main = () => {
    return (
        <div className="portfolio-page">
            <Header />
            <main>
                <Projects />
                <About />
            </main>
            <footer className="site-footer" id="contact">
                <div className="site-footer__lead">
                    <span className="section-kicker">연락처</span>
                    <h2>
                        백엔드 개발과 운영 경험에 대해
                        <br /> 이야기 나누고 싶습니다.
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
                    <span>{portfolioProfile.location} · 2026</span>
                </div>
            </footer>
        </div>
    )
}

export default Main

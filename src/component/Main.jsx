import Header from "./Header"
import Projects from "./Projects"
import About from "./About"
import CareerSummary from "./CareerSummary"
import { assetPath } from "../utils/assetPath"
import { portfolioProfile } from "../data/profile"
import "../css/Home.css"

const Main = () => {
    return (
        <div className="portfolio-page">
            <a className="skip-link" href="#main-content">
                본문으로 건너뛰기
            </a>
            <Header />
            <main id="main-content" tabIndex="-1">
                <CareerSummary />
                <Projects />
                <About />
            </main>
            <footer className="home-contact" id="contact" aria-labelledby="contact-title">
                <h2 id="contact-title">연락처</h2>
                <a
                    className="home-contact__email"
                    href={`mailto:${portfolioProfile.email}`}
                    aria-label={`${portfolioProfile.email}로 메일 보내기`}
                >
                    {portfolioProfile.email}
                </a>
                <ul className="home-contact__links" aria-label="연락처 목록">
                    <li>
                        <a
                            href={`tel:${portfolioProfile.phoneHref}`}
                            aria-label={`${portfolioProfile.phone}로 전화 걸기`}
                        >
                            {portfolioProfile.phone}
                        </a>
                    </li>
                    <li>
                        <a
                            href={portfolioProfile.github}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub 프로필 새 창에서 보기"
                        >
                            {portfolioProfile.github.replace("https://", "")}
                        </a>
                    </li>
                    <li>
                        <a
                            href={assetPath("임정규_포트폴리오.pdf")}
                            target="_blank"
                            rel="noreferrer"
                            download
                        >
                            이력서 PDF
                        </a>
                    </li>
                </ul>
            </footer>
        </div>
    )
}

export default Main

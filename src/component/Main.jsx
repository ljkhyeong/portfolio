import Header from "./Header"
import Projects from "./Projects"
import About from "./About"
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
                    <a href="mailto:jolri24@naver.com">jolri24@naver.com</a>
                    <a href="tel:+821039726284">010 3972 6284</a>
                    <a href="https://github.com/ljkhyeong" target="_blank" rel="noreferrer">
                        GitHub ↗
                    </a>
                </div>
                <div className="site-footer__meta">
                    <span>임정규 · 백엔드 개발자</span>
                    <span>서울 · 2026</span>
                </div>
            </footer>
        </div>
    )
}

export default Main

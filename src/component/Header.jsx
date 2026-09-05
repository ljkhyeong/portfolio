import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { assetPath } from "../utils/assetPath"
import { homeHeroContent } from "../data/homeHero"
import PortfolioNavigation from "./PortfolioNavigation"
import "../css/HomeHero.css"

const HOME_SECTIONS = [
    { id: "work", label: "프로젝트" },
    { id: "experience", label: "경력 및 학습" },
    { id: "capabilities", label: "기술" },
]

const Header = () => {
    const [activeSection, setActiveSection] = useState("")

    useEffect(() => {
        const sections = HOME_SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean)

        if (sections.length === 0 || !("IntersectionObserver" in window)) {
            return undefined
        }

        const navigationHeight =
            document.querySelector(".site-nav")?.getBoundingClientRect().height || 64
        const observer = new IntersectionObserver(
            (entries) => {
                const currentEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (left, right) =>
                            Math.abs(left.boundingClientRect.top) -
                            Math.abs(right.boundingClientRect.top),
                    )[0]

                if (currentEntry) {
                    setActiveSection(currentEntry.target.id)
                }
            },
            {
                rootMargin: `-${Math.round(navigationHeight)}px 0px -68% 0px`,
                threshold: 0,
            },
        )

        sections.forEach((section) => observer.observe(section))

        return () => observer.disconnect()
    }, [])

    return (
        <header className="site-header">
            <PortfolioNavigation
                isHome
                label="주요 메뉴"
                links={
                    <>
                        {HOME_SECTIONS.map((section) => (
                            <a
                                href={`#${section.id}`}
                                aria-current={activeSection === section.id ? "location" : undefined}
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                            >
                                {section.label}
                            </a>
                        ))}
                        <Link to="/search">문서 검색</Link>
                    </>
                }
                actions={
                    <>
                        <a className="site-nav__contact-link" href="#contact">
                            연락처
                        </a>
                        <a
                            className="site-nav__contact"
                            href={assetPath("임정규_포트폴리오.pdf")}
                            aria-label="포트폴리오 PDF 내려받기"
                            target="_blank"
                            rel="noreferrer"
                            download
                        >
                            PDF
                            <span aria-hidden="true">↓</span>
                        </a>
                    </>
                }
            />

            <section className="home-hero" id="top" aria-labelledby="home-hero-title">
                <div className="home-hero__copy">
                    <h1 id="home-hero-title" data-route-heading="/">
                        {homeHeroContent.headlineLines.map((line, index) => (
                            <span className="home-hero__line" key={line}>
                                {index > 0 && " "}
                                {line}
                            </span>
                        ))}
                    </h1>
                    <p className="home-hero__summary">{homeHeroContent.summary}</p>
                    <div className="home-hero__actions">
                        <a className="home-hero__button home-hero__button--primary" href="#work">
                            프로젝트 보기
                            <span aria-hidden="true">↘</span>
                        </a>
                        <a
                            className="home-hero__button home-hero__button--secondary"
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

                <aside className="home-flow" aria-labelledby="home-flow-title">
                    <div className="home-flow__heading">
                        <div>
                            <h2 id="home-flow-title">요청 처리 흐름</h2>
                            <span>BATON과 happyGallery에 적용한 요청 처리 방식</span>
                        </div>
                    </div>

                    <div className="home-flow__map">
                        <ol aria-label="안정적인 요청 처리 흐름">
                            {homeHeroContent.flow.map((item) => (
                                <li key={item.step}>
                                    <span className="home-flow__step">{item.step}</span>
                                    <div>
                                        <strong>{item.title}</strong>
                                        <p>{item.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </aside>
            </section>
        </header>
    )
}

export default Header

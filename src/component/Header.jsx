import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { assetPath } from "../utils/assetPath"
import { homeHeroContent } from "../data/homeHero"
import { portfolioProfile } from "../data/profile"
import CareerTimeline from "./CareerTimeline"
import PortfolioNavigation from "./PortfolioNavigation"

const HOME_SECTIONS = [
    { id: "career", label: "경력" },
    { id: "work", label: "개인 프로젝트" },
    { id: "more", label: "그 밖의 프로젝트" },
    { id: "skills", label: "학습과 기술" },
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
                    <a
                        className="site-nav__contact"
                        href={assetPath("임정규_포트폴리오.pdf")}
                        aria-label="이력서 PDF 내려받기"
                        target="_blank"
                        rel="noreferrer"
                        download
                    >
                        이력서 PDF
                    </a>
                }
            />

            {/* 어떤 개발자인지 한 문장으로 쓰고, 바로 아래 연표로 경력과 프로젝트의 기간과 결과를 보여 준다. */}
            <section className="home-intro" id="top" aria-labelledby="home-hero-title">
                <div className="home-intro__head">
                    <div className="home-intro__lead">
                        <p className="home-intro__name">
                            <img
                                src={assetPath("ljkhyeong-avatar.png")}
                                alt={`${portfolioProfile.name} 프로필 사진`}
                                width="160"
                                height="160"
                            />
                            {portfolioProfile.name}
                        </p>
                        <h1 id="home-hero-title" data-route-heading="/">
                            {homeHeroContent.headline}
                        </h1>
                    </div>
                    <div className="home-intro__side">
                        <p>{homeHeroContent.summary}</p>
                        <ul className="home-intro__contact" aria-label="연락 수단">
                            <li>
                                <a href={`mailto:${portfolioProfile.email}`}>
                                    {portfolioProfile.email}
                                </a>
                            </li>
                            <li>
                                <a href={portfolioProfile.github} target="_blank" rel="noreferrer">
                                    {portfolioProfile.github.replace("https://", "")}
                                </a>
                            </li>
                            <li>{portfolioProfile.location}</li>
                        </ul>
                    </div>
                </div>
                <CareerTimeline />
            </section>
        </header>
    )
}

export default Header

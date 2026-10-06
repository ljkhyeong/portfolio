import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { assetPath } from "../utils/assetPath"
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
        </header>
    )
}

export default Header

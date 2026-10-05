import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { assetPath } from "../utils/assetPath"
import { homeHeroContent } from "../data/homeHero"
import { careers, portfolioProfile } from "../data/profile"
import BatonBlueprint from "./BatonBlueprint"
import PortfolioNavigation from "./PortfolioNavigation"
import "../css/Blueprint.css"
import "../css/HomeHero.css"

const HOME_SECTIONS = [
    { id: "career", label: "경력" },
    { id: "work", label: "프로젝트" },
    { id: "experience", label: "학습" },
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

            {/* 도면처럼 기준선으로 나눈 띠를 쌓는다. 넓은 화면에서는 소개 옆에 BATON 구조도를 두고,
                좁은 화면에서는 구조도를 숨겨 경력이 늦게 나오지 않게 한다. */}
            <section
                className="blueprint-band home-hero"
                id="top"
                aria-labelledby="home-hero-title"
            >
                <div className="blueprint-col home-hero__inner">
                    <div className="home-hero__copy">
                        <div className="home-hero__identity">
                            <img
                                className="home-hero__avatar"
                                src={assetPath("ljkhyeong-avatar.png")}
                                alt={`${portfolioProfile.name} 픽셀 아바타`}
                                width="160"
                                height="160"
                            />
                            <p className="home-hero__name">
                                {portfolioProfile.name}
                                <span>{portfolioProfile.role}</span>
                            </p>
                        </div>
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
                            <a
                                className="home-hero__button home-hero__button--primary"
                                href="#work"
                            >
                                프로젝트 보기
                            </a>
                            <a
                                className="home-hero__button home-hero__button--secondary"
                                href={assetPath("임정규_포트폴리오.pdf")}
                                target="_blank"
                                rel="noreferrer"
                                download
                            >
                                PDF 내려받기
                            </a>
                        </div>
                    </div>

                    <figure className="home-figure">
                        <BatonBlueprint captionId="home-figure-caption" />
                        <figcaption id="home-figure-caption">
                            <span>
                                <b className="blueprint-fig" aria-hidden="true" /> BATON — Core와
                                6개 서비스의 역할
                            </span>
                            <span>서비스마다 독립 실행, DB 공유 없음</span>
                        </figcaption>
                    </figure>

                    <aside className="home-flow" aria-labelledby="home-flow-title">
                        <div className="home-flow__heading">
                            <h2 id="home-flow-title">요청 처리 흐름</h2>
                            <span>BATON과 happyGallery에 적용한 요청 처리 방식</span>
                        </div>
                        <ol aria-label="중복 방지와 중단 작업 재처리 흐름">
                            {homeHeroContent.flow.map((item) => (
                                <li key={item.step}>
                                    <span className="home-flow__step">{item.step}</span>
                                    <strong>{item.title}</strong>
                                    <p>{item.description}</p>
                                </li>
                            ))}
                        </ol>
                    </aside>
                </div>
            </section>

            <div className="blueprint-band">
                <dl className="blueprint-col home-meta" aria-label="기본 정보">
                    <div>
                        <dt>회사</dt>
                        <dd>
                            {careers[0].organization} · {careers[0].period}
                        </dd>
                    </div>
                    <div>
                        <dt>업무</dt>
                        <dd>{careers[0].homeDescription}</dd>
                    </div>
                    <div>
                        <dt>위치</dt>
                        <dd>{portfolioProfile.location}</dd>
                    </div>
                    <div>
                        <dt>이메일</dt>
                        <dd>
                            <a href={`mailto:${portfolioProfile.email}`}>
                                {portfolioProfile.email}
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt>GitHub</dt>
                        <dd>
                            <a href={portfolioProfile.github} target="_blank" rel="noreferrer">
                                {portfolioProfile.github.replace("https://", "")}
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt>PDF</dt>
                        <dd>
                            <a href={assetPath("임정규_포트폴리오.pdf")} download>
                                임정규_포트폴리오.pdf
                            </a>
                        </dd>
                    </div>
                </dl>
            </div>
        </header>
    )
}

export default Header

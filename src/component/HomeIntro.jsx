import { assetPath } from "../utils/assetPath"
import { homeHeroContent } from "../data/homeHero"
import { portfolioProfile } from "../data/profile"
import CareerTimeline from "./CareerTimeline"

// 어떤 개발자인지 한 문장으로 쓰고, 바로 아래 연표로 경력과 프로젝트의 기간과 결과를 보여 준다.
// 본문으로 건너뛰기가 제목과 연표를 건너뛰지 않도록 main의 첫 영역으로 둔다.
const HomeIntro = () => (
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
                        <a href={`mailto:${portfolioProfile.email}`}>{portfolioProfile.email}</a>
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
)

export default HomeIntro

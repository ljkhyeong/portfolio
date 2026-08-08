import { assetPath } from "../utils/assetPath"

const SystemPortrait = () => {
    return (
        <div className="system-portrait" aria-label="요구사항부터 테스트까지 이어지는 개발 흐름">
            <div className="system-portrait__grid" aria-hidden="true" />
            <div
                className="system-portrait__orbit system-portrait__orbit--outer"
                aria-hidden="true"
            />
            <div
                className="system-portrait__orbit system-portrait__orbit--inner"
                aria-hidden="true"
            />
            <div className="system-portrait__core">
                <span>BACKEND</span>
                <strong>DEVELOPMENT</strong>
            </div>
            <div className="system-node system-node--constraint">
                <span>01</span>
                <strong>요구사항</strong>
                <small>업무 규칙과 운영 환경</small>
            </div>
            <div className="system-node system-node--boundary">
                <span>02</span>
                <strong>역할 분리</strong>
                <small>데이터와 기능 담당</small>
            </div>
            <div className="system-node system-node--recovery">
                <span>03</span>
                <strong>복구</strong>
                <small>중복 방지, 보상, 재시도</small>
            </div>
            <div className="system-node system-node--evidence">
                <span>04</span>
                <strong>검증</strong>
                <small>테스트, 로그, 모니터링</small>
            </div>
            <div className="system-portrait__status">
                <span className="system-portrait__pulse" />
                장애 상황까지 고려한 설계
            </div>
        </div>
    )
}

const Header = () => {
    return (
        <header className="site-header">
            <nav className="site-nav" aria-label="주요 메뉴">
                <a className="site-nav__brand" href="#top" aria-label="임정규 포트폴리오 홈">
                    <span>JK</span>
                    <strong>임정규</strong>
                </a>
                <div className="site-nav__links">
                    <a href="#work">프로젝트</a>
                    <a href="#about">업무 방식</a>
                    <a href="#experience">경력</a>
                </div>
                <a className="site-nav__contact" href="mailto:jolri24@naver.com">
                    이야기 나누기
                    <span aria-hidden="true">↗</span>
                </a>
            </nav>

            <section className="hero" id="top">
                <div className="hero__copy">
                    <p className="hero__name">임정규 · 백엔드 개발자</p>
                    <h1>
                        복잡한 요구사항을
                        <br />
                        <em>안정적인 백엔드</em>로 만듭니다.
                    </h1>
                    <p className="hero__summary">
                        공공 시스템, 모듈러 모놀리스, 마이크로서비스를 개발했습니다. 데이터 정합성,
                        장애 복구, 유지보수를 고려해 설계하고 구현합니다.
                    </p>
                    <div className="hero__actions">
                        <a className="button button--primary" href="#work">
                            주요 프로젝트 보기
                            <span aria-hidden="true">↓</span>
                        </a>
                        <a
                            className="button button--ghost"
                            href={assetPath("포트폴리오최신.pdf")}
                            target="_blank"
                            rel="noreferrer"
                            download
                        >
                            PDF 내려받기
                            <span aria-hidden="true">↓</span>
                        </a>
                    </div>
                </div>
                <div className="hero__visual">
                    <SystemPortrait />
                </div>
                <div className="hero__footnote">
                    <span>Java · Spring · MySQL · Redis</span>
                    <span>API 계약 · 동시성 제어 · 장애 복구</span>
                </div>
            </section>

            <div className="proof-rail" aria-label="핵심 역량 요약">
                <div className="proof-rail__item">
                    <span>01 / 서비스 분리</span>
                    <strong>조직 데이터, 링크, URL 점검, 메시지 전송을 서비스별로 분리</strong>
                    <small>BATON Core · GO · WATCH · RELAY</small>
                </div>
                <div className="proof-rail__item">
                    <span>02 / 장애 복구</span>
                    <strong>중복 처리 방지, 결제 보상, 알림 재시도 구현</strong>
                    <small>happyGallery 모듈러 모놀리스</small>
                </div>
                <div className="proof-rail__item">
                    <span>03 / 운영 환경</span>
                    <strong>폐쇄망과 레거시 환경에서 배치 개발 및 장애 대응</strong>
                    <small>공공 SI 개발 및 운영</small>
                </div>
            </div>
        </header>
    )
}

export default Header

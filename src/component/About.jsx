import { Link } from "react-router-dom"

const principles = [
    {
        number: "01",
        title: "서비스별 역할을 먼저 나눕니다",
        description:
            "데이터를 어디서 관리하고 권한을 어디서 확인할지 정합니다. BATON에서는 조직 데이터, 링크 생성, URL 점검, 메시지 전송을 별도 서비스로 나눴습니다.",
        link: "/projects/baton",
        linkLabel: "BATON 서비스 구성 보기",
    },
    {
        number: "02",
        title: "외부 실패를 영속 상태로 남깁니다",
        description:
            "결제 응답 누락과 알림 전송 실패를 멱등 키, 펜싱 토큰, 아웃박스로 남겨 중복 실행을 줄이고 중단된 작업을 이어서 복구합니다.",
        link: "/projects/happygallery",
        linkLabel: "happyGallery 장애 처리 보기",
    },
    {
        number: "03",
        title: "설계 이유와 테스트를 기록합니다",
        description:
            "설계 이유를 ADR로 남기고 통합 테스트, E2E 테스트, 로그와 모니터링으로 동작을 확인합니다. 문서는 이후 변경할 때 확인하는 기준으로 사용합니다.",
        link: "/projects/happygallery",
        linkLabel: "문서와 테스트 보기",
    },
]

const skillGroups = [
    {
        label: "백엔드",
        items: ["Java 21 / 8", "Spring Boot / eGov", "JPA / MyBatis", "포트와 어댑터"],
        proof: "BATON, happyGallery, 공공 SI",
    },
    {
        label: "데이터 및 장애 대응",
        items: ["MySQL / PostgreSQL", "Redis", "상태 전이", "멱등 처리 / 아웃박스"],
        proof: "동시성 제어, 보상 처리, 재시도",
    },
    {
        label: "테스트 및 운영",
        items: ["JUnit / Testcontainers", "Playwright", "Prometheus / Grafana", "Docker / CI"],
        proof: "API 계약, 통합 테스트, E2E 테스트",
    },
]

const About = () => {
    return (
        <>
            <section className="approach-section" id="about">
                <div className="section-heading section-heading--dark">
                    <span className="section-kicker">02 / 업무 방식</span>
                    <h2>
                        기술을 고르기 전에
                        <br />
                        <em>요구사항과 운영 환경</em>을 확인합니다.
                    </h2>
                    <p>업무 규칙, 장애 영향, 복구 방법을 확인한 뒤 필요한 기술을 선택합니다.</p>
                </div>

                <div className="principle-list">
                    {principles.map((principle) => (
                        <article className="principle" key={principle.number}>
                            <span className="principle__number">{principle.number}</span>
                            <h3>{principle.title}</h3>
                            <p>{principle.description}</p>
                            <Link to={principle.link}>{principle.linkLabel} →</Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className="experience-section" id="experience">
                <div className="section-heading section-heading--compact">
                    <span className="section-kicker"># experience.md</span>
                    <h2>
                        공공 SI부터 개인 서비스까지
                        <br />
                        다른 운영 환경을 경험했습니다.
                    </h2>
                </div>

                <div className="experience-layout">
                    <div className="timeline" aria-label="경력 및 교육">
                        <section className="timeline__group" aria-labelledby="education-title">
                            <h3 className="timeline__group-title" id="education-title">
                                <span aria-hidden="true">##</span> <span lang="en">Education</span>
                            </h3>
                            <article className="timeline__item">
                                <div className="timeline__period">2023.05 — 2023.11</div>
                                <div className="timeline__content">
                                    <span>카카오 클라우드 스쿨 개발자 과정 3기 · 6인 팀</span>
                                    <h4>WebRTC/HLS 현장강의 보조 서비스</h4>
                                    <p>
                                        HLS 서버와 React 화면을 맡았습니다. WebSocket 제어와
                                        WebRTC/RTP 미디어 경로를 분리하고 FFmpeg와 GStreamer로 HLS를
                                        변환해 지연을 약 30초에서 11초로 줄였습니다.
                                    </p>
                                    <Link to="/projects/webrtc">프로젝트 기록 보기 →</Link>
                                </div>
                            </article>
                        </section>
                        <section className="timeline__group" aria-labelledby="career-title">
                            <h3 className="timeline__group-title" id="career-title">
                                <span aria-hidden="true">##</span> <span lang="en">Career</span>
                            </h3>
                            <article className="timeline__item">
                                <div className="timeline__period">2024.06 — 2026.01</div>
                                <div className="timeline__content">
                                    <span>실무</span>
                                    <h4>BEINTECH · 백엔드 개발 및 운영</h4>
                                    <p>
                                        차세대 군사법 정보 시스템의 군교정 영역에서 기관 연계 배치,
                                        보안 기능, 장애 대응을 맡았습니다. Java 8, eGov, MyBatis,
                                        Tibero 기반의 폐쇄망 환경에서 로그와 DB, 배치 흐름을 함께
                                        확인했습니다.
                                    </p>
                                    <Link to="/projects/defense">실무 사례 보기 →</Link>
                                </div>
                            </article>
                        </section>
                    </div>

                    <aside className="profile-statement">
                        <span className="profile-statement__label">최근 개발</span>
                        <blockquote>
                            “장애가 발생해도
                            <br />
                            안전하게 다시 처리할 수 있게 만듭니다.”
                        </blockquote>
                        <p>
                            최근에는 BATON에서 멱등 링크, 안전한 URL 점검, 메시지 재시도와 결과 불명
                            처리를 GO, WATCH, RELAY로 나눠 구현하고 있습니다.
                        </p>
                    </aside>
                </div>
            </section>

            <section className="capability-section" aria-labelledby="capability-title">
                <div className="capability-section__intro">
                    <span className="section-kicker">사용 기술과 적용 경험</span>
                    <h2 id="capability-title">
                        기술 이름과
                        <br />
                        사용한 곳을 함께 보여드립니다.
                    </h2>
                </div>
                <div className="capability-list">
                    {skillGroups.map((group) => (
                        <article className="capability" key={group.label}>
                            <div className="capability__heading">
                                <h3>{group.label}</h3>
                                <span>{group.proof}</span>
                            </div>
                            <ul>
                                {group.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>
        </>
    )
}

export default About

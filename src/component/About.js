const cardData = [
  {
    name: "project2",
    title: "WebRTC/HLS 현장강의 보조 서비스",
    text: "저지연, 되감기가 특징인 현장강의 보조 서비스",
    image: "webRTC.png",
    period: "2023.09.01 - 2023.11.10",
  },
  {
    name: "project4",
    title: "차세대 군사법 정보 시스템",
    text: "군교정 부문을 맡아 운영·배치·보안 기능을 개발한 공공 업무 시스템",
    image: "국방부.webp",
    period: "2024.06.23 - 2026.01.30",
  },
  {
    name: "project3",
    title: "happyGallery",
    text: "온라인 쇼핑몰과 체험 예약을 통합한 공방 서비스",
    image: "happyGallery 프로젝트.png",
    period: "2026.02.21 ~",
  },
];

const About = ({ onShowProjects }) => {
  return (
    <>
      <div className="details">
        <div className="section">
          <div className="section__title">About Me</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="text">
                비즈니스 요구사항을 기능 구현에서 끝내지 않고, 운영 안정성과
                유지보수성까지 함께 설계하는 개발자입니다.
              </div>
              <div className="text">
                요구사항을 빠르게 구현하는 것보다, 예외 상황과 이후 운영까지
                고려한 구조를 만들고 문서로 남기는 방식을 선호합니다.
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">career & Activities</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="left">
                <div className="name">카카오 클라우드 스쿨 개발자 과정 3기</div>
                <div className="desc">2023.05 - 2023.11</div>
              </div>
              <div className="right">
                <div className="name">BEINTECH (공공 SI)</div>
                <div className="desc">2024.06.16 - 재직중</div>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">Skill & Experience</div>
          <div className="section__list">
            <div className="section__list-item skill-columns">
              <div className="skill-column">
                <div className="skill-header">Backend</div>
                <div className="skill-cell">
                  <span className="addr-line">Application</span>
                  <span className="addr">
                    {" "}- Java, Spring, JPA, MyBatis
                  </span>
                </div>
                <div className="skill-cell">
                  <span className="addr-line">Data</span>
                  <span className="addr"> - MySQL</span>
                </div>
                <div className="skill-cell">
                  <span className="addr-line">Testing</span>
                  <span className="addr"> - Testcontainers</span>
                </div>
                <div className="skill-cell skill-cell-legacy">
                  <span className="addr-line">Legacy</span>
                  <span className="addr"> - Spring XML 설정</span>
                </div>
              </div>
              <div className="skill-column">
                <div className="skill-header">Frontend</div>
                <div className="skill-cell">
                  <span className="addr-line">Frontend</span>
                  <span className="addr">
                    {" "}
                    - React, TypeScript, TanStack Query, Bootstrap
                  </span>
                </div>
                <div className="skill-cell">
                  <span className="addr-line">Testing</span>
                  <span className="addr"> - Playwright</span>
                </div>
                <div className="skill-cell skill-cell-legacy">
                  <span className="addr-line">Legacy</span>
                  <span className="addr"> - WebSquare</span>
                </div>
              </div>
              <div className="skill-column">
                <div className="skill-header">Infrastructure & Ops</div>
                <div className="skill-cell">
                  <span className="addr-line">Cloud</span>
                  <span className="addr">
                    {" "}- EC2, ECS Fargate, ECR, S3, CloudFront, ALB, RDS,
                    ElastiCache, IAM OIDC
                  </span>
                </div>
                <div className="skill-cell">
                  <span className="addr-line">Infra</span>
                  <span className="addr"> - Docker, Nginx, Tomcat, Redis</span>
                </div>
                <div className="skill-cell">
                  <span className="addr-line">Operations</span>
                  <span className="addr">
                    {" "}- Flyway, Actuator, Prometheus, Grafana, Sentry,
                    Jenkins
                  </span>
                </div>
                <div className="skill-cell">
                  <span className="addr-line">Tooling</span>
                  <span className="addr"> - Gradle, Maven</span>
                </div>
                <div className="skill-cell skill-cell-legacy">
                  <span className="addr-line">Legacy</span>
                  <span className="addr"> - Tibero, JEUS, Nexus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">Projects</div>
          <div className="section__list">
            <div className="projects-main">
              {cardData.map((card, index) => (
                <div
                  className="gallery"
                  key={index}
                  data-name={card.name}
                  onClick={onShowProjects}
                >
                  <img src={card.image} alt={card.title} />
                  <div className="gallery-body">
                    <h5 className="projects-title">{card.title}</h5>
                    <div className="projects-text">{card.text}</div>
                    <div className="projects-period">{card.period}</div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: "-30px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              ↑ 클릭하시면 PROJECTS 탭으로 이동합니다 ↑
            </div>

            <div className="section__list-item">
              <div className="name">WebRTC/HLS 현장강의 보조 서비스 (Team)</div>
              <div className="text">
                Frontend, Spring, SFU, HLS, Chatting 서버를 역할별로 분리한
                실시간 강의 서비스입니다. 저는 HLS 서버와 React frontend를 맡아
                저지연 시청과 되감기 흐름이 실제 사용자 경험으로 이어지도록
                구현했습니다.
              </div>
            </div>
            <div className="section__list-item">
              <div className="name">차세대 군사법 정보 시스템 (Professional)</div>
              <div className="text">
                국방부 주관 차세대 군사법 정보 시스템에서 군교정 부문을 맡아,
                레거시·폐쇄망 환경에서 업무 기능, 연계 배치, 보안 기능을
                개발했습니다. 운영 제약이 큰 환경에서 안정적인 시스템 변경과
                대응 방식을 익힌 프로젝트입니다.
              </div>
            </div>
            <div className="section__list-item">
              <div className="name">happyGallery (Personal)</div>
              <div className="text">
                오프라인 공방을 위한 온라인 쇼핑몰 + 체험 예약 시스템입니다.
                상품 주문, 클래스 예약, 8회권 패스, 관리자 운영 흐름을 하나의
                플랫폼으로 통합했고, 문서화와 운영 기준까지 함께 설계하며
                지속적으로 고도화하고 있습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

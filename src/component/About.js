import { assetPath } from "../utils/assetPath";
import "../css/Books.css";
import "../css/Projects.css";
import { books } from "../data/books";

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
    image: "mnd.webp",
    period: "2024.06.23 - 2026.01.30",
  },
  {
    name: "project3",
    title: "happyGallery",
    text: "주문, 예약, 패스, 관리자 운영과 아키텍처 기준을 함께 설계한 공방 플랫폼",
    image: "happygallery-project.png",
    period: "2026.02.21 ~",
  },
];

const About = ({ onShowProjects, onShowBooks }) => {
  return (
    <>
      <div className="details">
        <div className="section">
          <div className="section__title">About Me</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="text">
                ■ 비즈니스 요구사항을 기능 구현에서 끝내지 않고, 운영
                안정성과 유지보수성까지 함께 설계하는 개발자입니다.
              </div>
              <div className="text">
                ■ 백엔드 구현을 기반으로 배포, 관측성, 세션/캐시, 요청 제한,
                장애 완충까지 직접 다루며 DevOps에 가까운 방향으로 역량을
                넓혀가고 있습니다.
              </div>
              <div className="text">
                ■ 개인 프로젝트에서 PRD(요구사항 기준), ADR(아키텍처 결정),
                Idea(검토 메모), POC(실험 기록), Retrospective(회고) 등의
                문서를 지속적으로 남기며 시스템 경계, API 계약, 운영 기준,
                배포 토폴로지, 로그 마스킹 같은 주제를 먼저 정리한 뒤
                개발하는 방식을 훈련하고 있습니다.
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
                    - React, JavaScript, TypeScript, TanStack Query, Bootstrap
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
                  className="projects-card"
                  key={index}
                  data-name={card.name}
                  onClick={onShowProjects}
                >
                  <img
                    className="projects-card__image"
                    src={assetPath(card.image)}
                    alt={card.title}
                  />
                  <div className="projects-card__body">
                    <h5 className="projects-card__title">{card.title}</h5>
                    <div className="projects-card__text">{card.text}</div>
                    <div className="projects-card__period">{card.period}</div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: "4px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              ↑ 클릭하시면 PROJECTS 탭으로 이동합니다 ↑
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">Books & Study</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="text">
                개발서적 독서를 꾸준히 하고 있고, 개인공부와 그룹스터디를
                병행하면서 필요한 내용은 다시 정리해 학습하고 있습니다.
              </div>
            </div>
          </div>
          <div className="books-grid">
            {books.map((book) => (
              <article
                className="book-card book-card--link"
                key={book.key}
                onClick={onShowBooks}
              >
                <img
                  className="book-card__image"
                  src={assetPath(book.image)}
                  alt={book.title}
                />
                <div className="book-card__body">
                  <div className="book-card__title">{book.title}</div>
                  <div className="book-card__description">{book.description}</div>
                  {book.studyLink ? (
                    <a
                      className="book-card__link"
                      href={book.studyLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      GROUP STUDY
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <div className="about-books-hint">
            ↑ 클릭하시면 BOOKS 탭으로 이동합니다 ↑
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

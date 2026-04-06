import { useNavigate } from "react-router-dom";
import "../css/Projects.css";
import { assetPath } from "../utils/assetPath";

const projectSections = [
  {
    title: "Independent",
    subtitle: "개인 설계와 구현을 중심으로 진행한 프로젝트",
    projects: [
      {
        name: "project3",
        title: "happyGallery",
        text: "주문, 예약, 패스 규칙을 문서와 구조로 정리한 공방 서비스",
        image: "happygallery-project.png",
        period: "2026.02.21 ~",
        tags: ["Spring Boot", "JPA", "Redis", "Hexagonal", "Playwright"],
      },
    ],
  },
  {
    title: "Collaborative",
    subtitle: "팀 협업을 통해 구현한 프로젝트",
    projects: [
      {
        name: "project2",
        title: "WebRTC/HLS 현장강의 보조 서비스",
        text: "WebRTC 실시간 시청과 HLS 다시보기를 함께 구현한 강의 서비스",
        image: "webRTC.png",
        period: "2023.09.01 - 2023.11.10",
        tags: ["WebRTC", "HLS", "React", "Node.js", "Kubernetes"],
      },
    ],
  },
  {
    title: "Professional",
    subtitle: "재직 중 경험한 업무 영역",
    projects: [
      {
        name: "project4",
        title: "차세대 군사법 정보 시스템",
        text: "복잡한 결재 규칙과 배치 정합성을 다룬 공공 시스템",
        image: "mnd.webp",
        period: "2024.06.23 - 2026.01.30",
        tags: ["eGov", "MyBatis", "Tibero", "Spring Security", "Jenkins"],
      },
    ],
  },
];

const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="projects-layout">
      {projectSections.map((section) => (
        <section className="project-section" key={section.title}>
          <div className="project-section__header">
            <h3 className="project-section__title">{section.title}</h3>
            <p className="project-section__subtitle">{section.subtitle}</p>
          </div>
          {section.projects.map((card) => (
            <div
              className="project-feature"
              key={card.name}
              onClick={() => navigate(`./${card.name}`)}
            >
              <img
                className="project-feature__image"
                src={assetPath(card.image)}
                alt={card.title}
              />
              <div className="project-feature__body">
                <h4 className="project-feature__title">{card.title}</h4>
                <p className="project-feature__text">{card.text}</p>
                {card.tags && (
                  <div className="project-feature__tags">
                    {card.tags.map((tag) => (
                      <span className="project-feature__tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <span className="project-feature__period">{card.period}</span>
                <span className="project-feature__cta">자세히 보기 →</span>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
};

export default Projects;

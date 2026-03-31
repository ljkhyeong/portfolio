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
          {section.projects.length > 0 ? (
            <div className="projects-grid">
              {section.projects.map((card) => (
                <div
                  className="projects-card"
                  key={card.name}
                  data-name={card.name}
                  onClick={() => navigate(`./${card.name}`)}
                >
                  <img
                    className="projects-card__image"
                    src={assetPath(card.image)}
                    alt={card.title}
                  />
                  <div className="projects-card__body">
                    <h5 className="projects-card__title">{card.title}</h5>
                    <div className="projects-card__text">{card.text}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
};

export default Projects;

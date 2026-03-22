import { useNavigate } from "react-router-dom";
import "../css/Projects.css";

const projectSections = [
  {
    title: "Independent",
    subtitle: "개인 설계와 구현을 중심으로 진행한 프로젝트",
    projects: [
      {
        name: "project3",
        title: "happyGallery",
        text: "온라인 쇼핑몰과 체험 예약을 통합한 공방 서비스",
        image: "happyGallery 프로젝트.png",
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
        text: "Frontend, Spring, SFU, HLS, Chat 서버를 분리한 실시간 강의 서비스",
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
        text: "군교정 부문을 맡아 운영·배치·보안 기능을 개발한 공공 업무 시스템",
        image: "국방부.webp",
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
                  className="gallery"
                  key={card.name}
                  data-name={card.name}
                  onClick={() => navigate(`./${card.name}`)}
                >
                  <img src={card.image} alt={card.title} />
                  <div className="gallery-body">
                    <h5 className="projects-title">{card.title}</h5>
                    <div className="projects-text">{card.text}</div>
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

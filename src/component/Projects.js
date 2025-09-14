import { useNavigate } from "react-router-dom";
import "../css/Projects.css";

const cardData = [
  {
    name: "project2",
    title: "WebRTC/HLS 현장강의 보조 서비스",
    text: "저지연, 되감기가 특징인 현장강의 보조 서비스",
    image: "webRTC.png",
  },
  {
    name: "project3",
    title: "Feature-Flag-Service",
    text: "안정적인 배포를 위한 점진적 롤아웃 서비스",
    image: "feature-flag.png",
  },
];

const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="container projects-main">
      {cardData.map((card, index) => (
        <div
          className="gallery"
          key={index}
          data-name={card.name}
          onClick={() => navigate(`./${card.name}`)}
        >
          <img src={card.image} alt="img" />
          <h5 className="projects-title">{card.title}</h5>
          <div className="projects-text">{card.text}</div>
        </div>
      ))}
    </div>
  );
};

export default Projects;

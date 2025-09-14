import { useNavigate } from "react-router-dom";

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

const About = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="details">
        <div className="section">
          <div className="section__title">About Me</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="text">
                안정적인 과거(legacy)와 발전한 현재(trend)의 기술 환경을 모두
                이해하고 균형 있게 적용할 수 있는 개발자
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
                <div className="name">BEINTECH</div>
                <div className="desc">2024.06.16 - 재직중</div>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">Skill</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="left">
                <div className="name">능숙한</div>
                <div>
                  <span className="addr-line">Backend</span>
                  <span className="addr"> - Java, Spring</span>
                </div>
              </div>
              <div className="right">
                <div className="name">알고 있는</div>
                <div>
                  <span className="addr-line">Backend</span>
                  <span className="addr"> - node.js</span>
                </div>
                <div>
                  <span className="addr-line">Frontend</span>
                  <span className="addr"> - Javascript, React</span>
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
                  onClick={() => navigate(`./${card.name}`)}
                >
                  <img src={card.image} alt="img" />
                  <h5 className="projects-title">{card.title}</h5>
                  <div className="projects-text">{card.text}</div>
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
              ↑ 클릭하시면 해당 프로젝트 페이지로 이동합니다 ↑
            </div>

            <div className="section__list-item">
              <div className="name pr" onClick={() => navigate(`./project2`)}>
                👉 WebRTC/HLS 현장강의 보조 서비스 (Team) (2023.9.1 -
                2023.11.10)
              </div>
              <div className="text">
                현장강의를 위해 WebRTC로 지연을 줄이고 HLS로 되감기를 추가한다는
                아이디어에서 진행된 Node.js, Spring Boot 기반 프로젝트입니다.
                WebRTC, HLS 플레이어를 실시간 전환하여 놓친 부분을 다시 듣다가
                돌아올 수 있으며 강의실 별 실시간 채팅, 질의응답, 파일 송수신이
                가능합니다.
              </div>
            </div>
            <div className="section__list-item">
              <div className="name pr" onClick={() => navigate(`./project3`)}>
                👉 Feature-Flag-Service (Personal) (2025.08.31 - 진행중)
              </div>
              <div className="text">
                Spring Boot 기반의 Feature Flag Management Service입니다. 사용자
                그룹별 세분화, 점진적 롤아웃, 실시간 설정값 제공을 지원합니다.
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">Certifications</div>
          <div className="skills">
            <div className="skills__item">
              <div className="left">
                <div class="name">정보처리기사</div>
                <div className="name">네트워크관리사 2급</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

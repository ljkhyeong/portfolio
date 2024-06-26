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
    title: "Soccer-Fan-Board",
    text: "해외축구 입문자 커뮤니티 서비스",
    image: "soccerFor.png",
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
                · 개발 과정에서 항상 사용자의 입장을 생각하며, 팀원들에게 누가
                되지 않도록 성실하고 열심히 임합니다.
              </div>
              <div className="text">
                · 기존에 배웠던 것을 잘 활용하고 새로운 기능을 능숙히 배우기
                위해 CS 관련 서적을 꾸준히 읽습니다.
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section__title">career & Activities</div>
          <div className="section__list">
            <div className="section__list-item">
              <div className="left"></div>
              <div className="right">
                <div className="name">카카오 클라우드 스쿨 개발자 과정 3기</div>
                <div className="desc">2023.05 - 2023.11</div>
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
                  <span className="addr-line">Language</span>
                  <span className="addr"> - Java</span>
                </div>

                <div>
                  <span className="addr-line">Backend</span>
                  <span className="addr"> - Spring, Hibernate</span>
                </div>
                <div>
                  <span className="addr-line">RDBMS</span>
                  <span className="addr"> - MySQL,MariaDB</span>
                </div>
                <div>
                  <span className="addr-line">Infra</span>
                  <span className="addr"> - Docker</span>
                </div>
                <div>
                  <span className="addr-line">협업도구</span>
                  <span className="addr"> - Git</span>
                </div>
              </div>
              <div className="right">
                <div className="name">알고 있는</div>
                <div>
                  <span className="addr-line">Language</span>
                  <span className="addr"> - C, Go, Python, JavaScript</span>
                </div>
                <div>
                  <span className="addr-line">Frontend</span>
                  <span className="addr"> - React</span>
                </div>
                <div>
                  <span className="addr-line">Backend</span>
                  <span className="addr"> - Node.js </span>
                </div>
                <div>
                  <span className="addr-line">Infra</span>
                  <span className="addr"> - Kubernetes, AWS</span>
                </div>
                <div>
                  <span className="addr-line">협업도구</span>
                  <span className="addr"> - Jira, Notion</span>
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
                아이디어에서 진행된 프로젝트입니다. WebRTC, HLS 플레이어를
                실시간 전환하여 놓친 부분을 다시 듣다가 돌아올 수 있으며 강의실
                별 실시간 채팅, 질의응답, 파일 송수신이 가능합니다.
              </div>
            </div>
            <div className="section__list-item">
              <div className="name pr" onClick={() => navigate(`./project3`)}>
                👉 Soccer-Fan-Board (Personal) (2023.12.5 - 2023.2.4)
              </div>
              <div className="text">
                배운기능을 개인적으로 구현해보자는 취지로 개발한 프로젝트입니다.
                해외축구 입문자들을 위해 관심있는 팀의 문서, 선수단 정보,
                커뮤니티 게시판을 제공합니다. 배포 중인 프로젝트입니다.
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

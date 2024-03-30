import { useState } from "react";
import "../../css/Project.css";
import YouTube from "react-youtube";
import { useNavigate } from "react-router-dom";

const cardData = [
  { name: "회원가입", title: "회원가입 및 로그인", image: "회원가입.gif" },
  { name: "위키", title: "위키", image: "위키.gif" },
  { name: "스크래핑", title: "스크래핑", image: "스크래핑.gif" },
  { name: "선수정보", title: "선수단 정보", image: "선수단 정보.gif" },
  { name: "게시글", title: "게시글", image: "게시글.gif" },
  { name: "댓글", title: "댓글", image: "댓글.gif" },
];

const Project3 = () => {
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handlePrevious = () => {
    navigate("/project2");
  };

  const handleMain = () => {
    navigate("../");
  };

  return (
    <>
      <button className="nav-button prev" onClick={handlePrevious}>
        &lt;
      </button>
      <div className="container">
        <div className="header">
          <div className="project-title">Soccer Fan Board</div>
        </div>
        <div className="details">
          <div className="section">
            <img className="rep-image" src="soccerFor.png" />
          </div>
          <div className="section">
            <div className="section__title">📖 내용</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 배운 기능들을 개인적으로 구현해보자는 취지로 개발한 해외축구
                  커뮤니티입니다.
                </div>
                <div className="project-text">
                  · 2023.12.5 - 2024.2.4 2개월 간 진행했었습니다.
                </div>
                <div className="project-text">
                  · 2024.4.1~ 게시판 대용량 트래픽 고려, 성능 개선을 목표로
                  재개발 중입니다.
                </div>
                <div className="project-text">
                  · 팀 MD 문서, 선수단 정보, 게시판을 제공했었으며 목표에
                  집중하기 위해 게시판 제외 기능 개발 보류 예정입니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🐱 Github & Service Link</div>
            <div className="section__list">
              <a
                href="https://github.com/ljkhyeong/Soccer-Fan-Board"
                className="addr"
              >
                https://github.com/ljkhyeong/Soccer-Fan-Board{" "}
              </a>
            </div>
            <div className="section__list">
              <a href="http://13.125.252.116" className="addr">
                http://13.125.252.116{" "}
              </a>
            </div>
          </div>
          <div className="section">
            <div className="section__list">
              <div className="section__list-item">
                <div className="left">
                  <div className="section__title">⛏️ 기술스택</div>
                  <div>
                    <span className="addr-line">Language</span>
                    <span className="addr"> - Java, JavaScript</span>
                  </div>
                  <div>
                    <span className="addr-line">Frontend</span>
                    <span className="addr"> - React</span>
                  </div>
                  <div>
                    <span className="addr-line">Backend</span>
                    <span className="addr"> - Spring, Hibernate</span>
                  </div>
                  <div>
                    <span className="addr-line">RDBMS</span>
                    <span className="addr"> - MariaDB</span>
                  </div>
                  <div>
                    <span className="addr-line">Infra</span>
                    <span className="addr"> - Docker, AWS (EC2/RDS)</span>
                  </div>
                  <div>
                    <span className="addr-line">SCM</span>
                    <span className="addr"> - Git</span>
                  </div>
                  <div>
                    <span className="addr-line">CI/CD</span>
                    <span className="addr"> - Github Actions</span>
                  </div>
                </div>
                <div className="right">
                  <div className="section__title">🖥️ 구현된 기능</div>
                  <div className="project-text">
                    · <span className="addr-line">회원</span> - Validator
                    회원가입, JWT 쿠키인증, <br />
                    패스워드 변경
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">문서</span> - 문서 작성(md
                    편집기), 수정,
                    <br /> 역사 조회 [회원만 가능]
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">선수단 정보</span> - 선수단
                    조회 <br /> (Selenium을 이용한 주기적 스크래핑 후 DB저장)
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">게시판</span> -
                    게시글/댓글/대댓글 작성 및 수정 및 삭제 ,검색 및 추천 글
                    분류 [비회원도 가능]
                    <br />
                    좋아요 [회원만 가능]
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">📚 로컬테스트 GIF</div>
            <div className="projects-main">
              {cardData.map((card, index) => (
                <div
                  className="gallery"
                  key={index}
                  data-name={card.name}
                  onClick={() => openModal(card.image)}
                >
                  <img src={card.image} alt="img" />
                  <h5 className="projects-title">{card.title}</h5>
                </div>
              ))}
            </div>
            <div className="section">
              <div className="section__title">✨ 개선한 기능</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · 게시글 조회 시 조회수 +1 (락 경쟁 때문에 성능 문제 발생
                    가능)
                    <br /> -> Redis에서 카운팅하다가 배치로 한꺼번에 DB
                    업데이트하도록 수정, 비동기화
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section__title">🧑‍💻 추가할 기능</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · 모던 자바 인 액션에서 학습한 스트림, 람다를 활용하여
                    병렬성, 가독성 향상토록 리팩토링
                  </div>

                  <div className="project-text">
                    · (운영) 도메인/TLS 인증서 구매{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {modalImage && (
          <div className="modal" onClick={closeModal}>
            <span className="close">&times;</span>
            <img className="modal-content" src={modalImage} alt="??" />
          </div>
        )}
      </div>
      <div className="navigation-buttons">
        <button className="main-button" onClick={handleMain}>
          메인으로
        </button>
      </div>
    </>
  );
};

export default Project3;

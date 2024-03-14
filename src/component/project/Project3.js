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
                  · 해외축구 입문자를 위한 커뮤니티 서비스입니다.
                </div>
                <div className="project-text">
                  · 2023.12.5 - 2023.2.4 약 2개월 간 진행한 개인 프로젝트입니다.
                </div>
                <div className="project-text">
                  · 팀 위키 문서, 선수단 정보, 커뮤니티 게시판을 제공합니다.
                  게시판은 비회원도 이용 가능합니다.{" "}
                </div>
                <div className="project-text">
                  · 개발 및 유지보수 진행 & 배포 중인 프로젝트입니다.{" "}
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
            <div className="section__title">⛏️ 기술스택</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="left">
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
              <div className="section__title">🖥️ 구현된 기능</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · (회원) 회원가입, jwt 로그인, 패스워드 변경
                  </div>
                  <div className="project-text">
                    · (위키) 문서 작성(markdown 편집기), 수정, 역사 조회 -
                    회원만 가능
                  </div>
                  <div className="project-text">
                    · (선수단 정보) 선수단 리스트 조회
                  </div>
                  <div className="project-text">
                    · (게시판) 게시글/댓글/대댓글 작성 및 수정 및 삭제 -
                    비회원도 가능, 게시글 검색 및 좋아요, 추천 글 분류
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section__title">🧑‍💻 추가할 기능</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · (메인) 팀 검색 기능, 각 리그/팀 추가{" "}
                  </div>
                  <div className="project-text">
                    · (회원) OAuth 소셜계정 가입, 패스워드 찾기, 회원정보 확인{" "}
                  </div>
                  <div className="project-text">
                    · (데이터 크롤링) 경기일정 데이터 업데이트, 선수단 정보
                    업데이트 스케줄링 , 실시간 경기 정보
                  </div>
                  <div className="project-text">
                    · (게시판) 머리말/태그 작성 및 조회{" "}
                  </div>
                  <div className="project-text">
                    · (위키) 위키엔진 도입, 기존 문서는 수정 못하도록, 비회원
                    위키 작성{" "}
                  </div>
                  <div className="project-text">· (운영) 도메인/TLS 구매 </div>
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

import { useState } from "react";
import "../../css/Project.css";
import YouTube from "react-youtube";
import { useNavigate } from "react-router-dom";

const cardData = [
  { name: "명명규칙", title: "명명규칙", image: "명명규칙.png" },
  {
    name: "erd",
    title: "ERD",
    image:
      "https://github.com/gayeonP/spring-OneZo/assets/62829894/c9e44589-0f91-40e2-b252-72f40ba89c0d",
  },
  { name: "참고문서", title: "참고문서 공유", image: "참고문서 공유.png" },
];

const Project2 = () => {
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handlePrevious = () => {
    navigate("/project1");
  };

  const handleNext = () => {
    navigate("/project3");
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
          <div className="project-title">205번가</div>
        </div>
        <div className="details">
          <div className="section">
            <img className="rep-image" src="205st.png" />
          </div>
          <div className="section">
            <div className="section__title">📖 내용</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 스프링 공부를 목적으로 한 소형 쇼핑몰 프로젝트입니다..
                </div>
                <div className="project-text">
                  · 6인 팀으로 2023.8.14 - 2023.8.25 약 2주 간 진행한
                  프로젝트입니다.
                </div>
                <div className="project-text">
                  · 회원 등록/인증, 상품 데이터 크롤링, 상품 조회/장바구니
                  담기/주문, 상품 문의까지 구현되었습니다.
                </div>
                <div className="project-text">
                  · 결제 등 필수 기능이 미개발 상태라 추후 개인적으로 유지보수
                  후 배포 예정입니다.{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🐱 Github</div>
            <div className="section__list">
              <a href="https://github.com/ljkhyeong/205st" className="addr">
                https://github.com/ljkhyeong/205st
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
                    <span className="addr"> - Java</span>
                  </div>
                  <div>
                    <span className="addr-line">Backend</span>
                    <span className="addr">
                      {" "}
                      - Spring, Hibernate, Thymeleaf
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">RDBMS</span>
                    <span className="addr"> - MariaDB</span>
                  </div>
                  <div>
                    <span className="addr-line">SCM</span>
                    <span className="addr"> - Git, Notion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">📚 개발과정 자료</div>
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
              <div className="section__title">🙋‍♂️ 역할</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · html/css 모든 페이지 틀을 작성했습니다.
                  </div>
                  <div className="project-text">
                    · 회원 등록 및 검증, Spring Interceptor를 활용한 세션 로그인
                    기능을 개발했습니다.{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section__title">🧑‍💻 추가할 기능</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">· 결제 API 도입 </div>
                  <div className="project-text">· OAuth 소셜 로그인 기능 </div>
                  <div className="project-text">· 상품 커스텀 정렬 기능</div>
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
      <button className="nav-button next" onClick={handleNext}>
        &gt;
      </button>
      <div className="navigation-buttons">
        <button className="main-button" onClick={handleMain}>
          메인으로
        </button>
      </div>
    </>
  );
};

export default Project2;

import { useState } from "react";
import "../../css/Project.css";
import { useNavigate } from "react-router-dom";
import { assetPath } from "../../utils/assetPath";

const cardData = [
  { name: "명명규칙", title: "명명규칙", image: "명명규칙.png" },
  {
    name: "erd",
    title: "ERD",
    image:
      "https://github.com/gayeonP/spring-OneZo/assets/62829894/c9e44589-0f91-40e2-b252-72f40ba89c0d",
  },
  { name: "참고문서", title: "참고문서 공유", image: "참고문서 공유.png" },
  { name: "205st_메인", title: "메인화면", image: "205st_메인.gif" },
  {
    name: "205st_회원가입",
    title: "회원가입 및 로그인",
    image: "205st_회원가입.gif",
  },
  { name: "205st_상품조회", title: "상품 조회", image: "205st_상품 조회.gif" },
  {
    name: "205st_장바구니",
    title: "장바구니 담기",
    image: "205st_장바구니.gif",
  },
];

const starStories = [
  {
    title: "짧은 일정에서 화면과 규칙의 기준선 만들기",
    situation:
      "2주짜리 팀 프로젝트라 화면, 엔티티, 역할 분담이 동시에 움직였고 기준 문서 없이 가면 화면마다 해석이 달라질 위험이 있었습니다.",
    task: "빠르게 개발하되 최소한의 공통 기준을 만들어 팀원이 같은 모델을 보게 해야 했습니다.",
    action:
      "명명 규칙, ERD, 참고 문서를 먼저 정리하고 공용 화면 틀을 제가 선행 구현해 나머지 기능 개발이 같은 구조를 따르도록 맞췄습니다.",
    result:
      "6인 팀이 2주 안에 핵심 화면 7종을 병렬로 구현할 수 있었고, 화면별 네이밍과 폼 구조가 통일돼 후반 병합 충돌과 중복 마크업 수정을 크게 줄였습니다.",
  },
  {
    title: "검증 규칙을 컨트롤러 밖으로 분리",
    situation:
      "회원가입 검증이 화면과 컨트롤러에 흩어지면 짧은 프로젝트일수록 중복 코드가 빠르게 늘어나는 문제가 있었습니다.",
    task: "폼 검증을 한 군데로 모아 예외 메시지와 입력 조건을 일관되게 유지해야 했습니다.",
    action:
      "JSR-303 Validator를 도입해 회원가입 입력 검증을 DTO 중심으로 정리하고, 로그인 여부와 권한 체크는 Spring Interceptor로 분리했습니다.",
    result:
      "회원가입 검증 규칙을 화면별 분기 대신 공통 검증 경로 1개로 수렴시켰고, 로그인 필요 화면도 인터셉터로 일관되게 보호할 수 있었습니다.",
  },
  {
    title: "장바구니 금액 계산을 화면 로직에서 분리",
    situation:
      "초기에는 장바구니 수량 변경과 총액 계산이 화면 처리와 섞여 있어 추후 주문 기능 확장 시 중복 계산이 생길 여지가 컸습니다.",
    task: "현재는 소형 프로젝트여도 이후 주문과 결제로 확장 가능한 계산 구조를 만들어야 했습니다.",
    action:
      "상품 조회, 장바구니 수량 변경, 합계 계산 흐름을 서비스 계층에서 다루도록 정리하고, 세션 기반 장바구니 상태를 한 군데서 관리했습니다.",
    result:
      "장바구니 계산 로직이 화면 이벤트와 분리돼 이후 주문, 결제 기능을 붙일 때 재사용 가능한 기반을 마련했습니다. 작은 프로젝트에서도 도메인 규칙을 미리 분리해야 유지보수가 쉬워진다는 점을 배웠습니다.",
  },
];

const techChoices = [
  {
    title: "Spring MVC + Thymeleaf",
    summary:
      "학습 목적과 짧은 일정에 맞춰 서버 렌더링 기반 구조를 선택해 기능 흐름을 빠르게 끝까지 경험하는 데 집중했습니다.",
    tradeoff:
      "SPA보다 화면 상호작용은 제한되지만, 세션, 폼 검증, 서버 사이드 렌더링을 한 번에 익히기에 적합했습니다.",
  },
  {
    title: "Hibernate",
    summary:
      "반복적인 CRUD를 직접 SQL로 작성하기보다 엔티티 중심으로 빠르게 기능을 올리기 위해 선택했습니다.",
    tradeoff:
      "복잡한 통계나 대량 처리에는 한계가 있지만, 초기 학습 단계에서는 도메인 흐름에 집중할 수 있었습니다.",
  },
  {
    title: "세션 + Interceptor",
    summary:
      "JWT까지 확장하기보다 서버 세션과 인터셉터로 로그인 흐름을 명확하게 구현했습니다.",
    tradeoff:
      "확장성은 작지만, 인증 흐름과 보호 자원 접근을 이해하기에는 단순하고 안정적이었습니다.",
  },
];

const Project1 = () => {
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  const openModal = (image) => {
    setModalImage(image.startsWith("http") ? image : assetPath(image));
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleNext = () => {
    navigate("/project2");
  };

  const handleMain = () => {
    navigate("../");
  };

  return (
    <>
      <div className="container">
        <div className="header">
          <div className="project-title">205번가</div>
        </div>
        <div className="details">
          <div className="section">
            <img
              className="rep-image"
              src={assetPath("205st.png")}
              alt="205번가 대표 이미지"
            />
          </div>
          <div className="section">
            <div className="section__title">📖 내용</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 205번가는 스프링 학습을 목적으로 진행한 소형 쇼핑몰
                  프로젝트지만, 단순 CRUD보다 짧은 일정 안에서 규칙과 구조를
                  어떻게 정리할지에 초점을 맞췄습니다.
                </div>
                <div className="project-text">
                  · 6인 팀이 2023.08.14부터 2023.08.25까지 약 2주간 진행했고,
                  저는 공통 화면 틀과 회원 기능을 맡았습니다.
                </div>
                <div className="project-text">
                  · 이후 happyGallery 같은 더 큰 프로젝트를 하면서 돌아보니, 이
                  프로젝트는 작은 규모에서도 도메인 규칙과 화면 로직을 분리하는
                  습관을 만든 출발점이었습니다.
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
            <div className="section__list">
              <div className="section__list-item">
                <div className="left">
                  <div className="section__title">⛏️ 기술스택</div>
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
                    <span className="addr-line">협업도구</span>
                    <span className="addr"> - Git, Notion</span>
                  </div>
                </div>
                <div className="right">
                  <div className="section__title">
                    ⚖️ 선택 이유와 트레이드오프
                  </div>
                  {techChoices.map((choice) => (
                    <div className="project-text" key={choice.title}>
                      · <span className="addr-line">{choice.title}</span> -{" "}
                      {choice.summary} {choice.tradeoff}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🎯 핵심 트러블슈팅 (STAR)</div>
            <div className="section__list">
              <div className="section__list-item">
                {starStories.map((story) => (
                  <div key={story.title} style={{ marginBottom: "18px" }}>
                    <div className="project-text">
                      · <span className="addr-line">{story.title}</span>
                    </div>
                    <div className="project-text">
                      Situation - {story.situation}
                    </div>
                    <div className="project-text">Task - {story.task}</div>
                    <div className="project-text">Action - {story.action}</div>
                    <div className="project-text">Result - {story.result}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">📚 개발과정 & 로컬테스트 GIF</div>
            <div className="projects-main">
              {cardData.map((card, index) => (
                <div
                  className="gallery"
                  key={index}
                  data-name={card.name}
                  onClick={() => openModal(card.image)}
                >
                  <img
                    src={
                      card.image.startsWith("http")
                        ? card.image
                        : assetPath(card.image)
                    }
                    alt="img"
                  />
                  <h5 className="projects-title">{card.title}</h5>
                </div>
              ))}
            </div>
            <div className="section">
              <div className="section__title">🙋‍♂️ 역할</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · 공통 페이지 레이아웃과 HTML/CSS 틀을 작성해 팀원이 기능
                    구현에 집중할 수 있는 기반을 만들었습니다.
                  </div>
                  <div className="project-text">
                    · Validator 기반 회원가입 검증과 Spring Interceptor 기반
                    세션 로그인 기능을 구현했습니다.
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section__title">🧑‍💻 이후 확장 방향</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · OAuth 소셜 로그인과 주문, 결제 기능을 붙이면서 현재 분리해
                    둔 검증 및 장바구니 규칙을 실제 주문 도메인으로 확장해 볼
                    계획이었습니다.
                  </div>
                  <div className="project-text">
                    · 작은 프로젝트에서도 단순한 기능 나열보다 규칙 분리와 책임
                    정리가 더 중요하다는 점을 확인한 경험이었습니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {modalImage && (
          <div className="modal" onClick={closeModal}>
            <span className="close">&times;</span>
            <img className="modal-content" src={modalImage} alt="img" />
          </div>
        )}
      </div>
      <button className="nav-button next" onClick={handleNext}>
        ›
      </button>
      <div className="navigation-buttons">
        <button className="main-button" onClick={handleMain}>
          메인으로
        </button>
      </div>
    </>
  );
};

export default Project1;

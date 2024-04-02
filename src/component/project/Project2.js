import { useState } from "react";
import "../../css/Project.css";
import YouTube from "react-youtube";
import { useNavigate } from "react-router-dom";

const cardData = [
  {
    name: "화면정의서",
    title: "화면정의서 초기",
    image: "화면정의서 초기.jpeg",
  },
  { name: "기술내용", title: "기술내용 정리", image: "기술내용 정리.png" },
  {
    name: "회의록",
    title: "일일 스크럼 회의록",
    image: "일일 스크럼 회의록 세부.png",
  },
  { name: "요구사항", title: "요구사항 명세", image: "요구사항 명세.png" },
  { name: "api", title: "API 명세", image: "API 명세.png" },
  { name: "환경변수", title: "환경변수 명세", image: "환경변수 명세.png" },
  { name: "erd", title: "ERD (스프링 서버)", image: "스프링 ERD.png" },
  {
    name: "아키텍처",
    title: "아키텍처 다이어그램",
    image: "아키텍처 다이어그램.png",
  },
  { name: "디버깅", title: "디버깅 진행도", image: "디버깅 진행도.png" },
  { name: "종합", title: "종합 발표자료", image: "종합.png" },
];

const Project1 = () => {
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  const openModal = (image) => {
    if (image === "종합.png") {
      window.open(
        "https://docs.google.com/presentation/d/1nc8vpIapH1YTMuJ2fM0nzeoFOHuBBmovss31_c82PEA/edit#slide=id.p1",
        "_blank",
      );
    } else {
      setModalImage(image);
    }
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
          <div className="project-title">WebRTC/HLS 현장강의 보조 서비스</div>
        </div>
        <div className="details">
          <div className="section">
            <img className="rep-image" src="webRTC.png" />
          </div>
          <div className="section">
            <div className="section__title">📖 내용</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 현장강의를 위해 WebRTC로 지연을 줄이고 HLS로 되감기를
                  추가한다는 아이디어에서 진행된 프로젝트입니다.
                </div>
                <div className="project-text">
                  · 6인 팀으로 2023.9.1 - 2023.11.10 약 2개월 간 진행한
                  프로젝트입니다.
                </div>
                <div className="project-text">
                  · WebRTC, HLS 플레이어를 실시간 전환하여 놓친 부분을 다시
                  듣다가 돌아올 수 있습니다.{" "}
                </div>
                <div className="project-text">
                  · 강의실은 관리자, 강사, 학생 롤로 구분됩니다.
                </div>
                <div className="project-text">
                  · 강의실 별 실시간 채팅, 질의응답(강사님에게만 보이도록 혹은
                  공개), 파일 업로드/다운로드가 가능합니다.
                </div>
                <div className="project-text">
                  · AWS 비용문제로 배포 중단 상태입니다.{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🐱 Github</div>
            <div className="section__list">
              <a
                href="https://github.com/orgs/TeamyRoom/repositories"
                className="addr"
              >
                https://github.com/orgs/TeamyRoom/repositories{" "}
              </a>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🎥 시연영상</div>
            <YouTube
              videoId="KKR2vj10sNQ"
              opts={{
                width: "560",
                height: "315",
                playerVars: {
                  autoplay: 0,
                  rel: 0,
                  modestbranding: 1,
                },
              }}
            />
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
                    <span className="addr"> - Spring, Node.js, Hibernate</span>
                  </div>
                  <div>
                    <span className="addr-line">RDBMS</span>
                    <span className="addr"> - MariaDB</span>
                  </div>
                  <div>
                    <span className="addr-line">Infra</span>
                    <span className="addr">
                      {" "}
                      - Docker, Kubernetes, AWS
                      (EKS/Route53/ElasticCache/ALB/EC2/S3)
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">SCM</span>
                    <span className="addr"> - Git, Jira, Notion</span>
                  </div>
                  <div>
                    <span className="addr-line">CI/CD</span>
                    <span className="addr"> - GitHub Actions, Argo CD</span>
                  </div>
                </div>
                <div className="right">
                  <div className="section__title">🖥️ 구현된 기능</div>
                  <div className="project-text">
                    · <span className="addr-line">메인</span> - 강의실
                    생성/강의코드 입장
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">회원</span> - 회원가입,
                    로그인, 내 강의목록
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">강의실</span> -
                    플레이어(WebRTC/HLS), <br />
                    Q&A 게시판, 자료함, 관리자 페이지, <br />
                    실시간 채팅
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">📚 개발과정</div>
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
                    · WebRTC 스트림을 HLS로 트랜스코딩 후 AWS S3에 저장하며,
                    관련 옵션을 SFU서버, 클라이언트와 공유하는 미디어
                    서버(Node.js)를 개발했습니다.
                  </div>
                  <div className="project-text">
                    · 비디오 플레이어(HLS), Q&A 게시판/자료 게시판/관리자
                    페이지/강의화면(React) 프론트엔드를 개발했습니다.{" "}
                  </div>
                  <div className="project-text">
                    · Q&A 게시판/자료 게시판/관리자 페이지(Spring), WebRTC
                    SFU서버(Node.js) 백엔드에 기여했습니다.
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section__title">✨ 개선한 기능</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · 정지화면 트랜스코딩 불가 (빠른 인코딩 및 타임스탬프
                    처리혼동 때문에 muxing queue 오버플로우 발생)
                    <br /> -> -r 옵션을 이용해 출력 프레임, 입력 프레임 조정하여
                    큐에 쌓이는 데이터 조정, 타임 스탬프 고정처리
                  </div>
                  <div className="project-text">
                    · WebRTC와 HLS의 지연 30초
                    <br /> -> ts 세그먼트 길이를 6초에서 2초로 축소하여 지연
                    15초로 감소 / S3 업로드 등 네트워크 관련 오버헤드 증가
                  </div>
                  <div className="project-text">
                    · WebRTC와 HLS의 지연 15초
                    <br /> -> -g 옵션을 이용해 GOP 간격을 증가시켜 압축률 증가,
                    그에 따른 지연 11초로 감소, 부하 감소 / 화질 저하
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section__title">🧑‍💻 추가할 기능</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · AWS CloudFront를 이용한 CDN 설치를 통해 HLS 지연 감소
                    (현재 지연 약 11초)
                  </div>
                  <div className="project-text">
                    · 다양한 화질 저장을 통해 클라이언트 맞춤형 HLS 다시보기
                    제공 (현재 WebRTC의 화질조정을 기준으로 레코딩)
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

export default Project1;

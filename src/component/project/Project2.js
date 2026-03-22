import { useState } from "react";
import "../../css/Project.css";
import YouTube from "react-youtube";
import { useNavigate } from "react-router-dom";
import { assetPath } from "../../utils/assetPath";

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

const Project2 = () => {
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  const openModal = (image) => {
    if (image === "종합.png") {
      window.open(
        "https://docs.google.com/presentation/d/1nc8vpIapH1YTMuJ2fM0nzeoFOHuBBmovss31_c82PEA/edit#slide=id.p1",
        "_blank",
      );
    } else {
      setModalImage(assetPath(image));
    }
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleNext = () => {
    navigate("/project4");
  };

  const handleMain = () => {
    navigate("../");
  };

  return (
    <>
      <div className="container">
        <div className="header">
          <div className="project-title">WebRTC/HLS 현장강의 보조 서비스</div>
        </div>
        <div className="details">
          <div className="section">
            <img
              className="rep-image"
              src={assetPath("webRTC.png")}
              alt="WebRTC HLS 현장강의 보조 서비스 대표 이미지"
            />
          </div>
          <div className="section">
            <div className="section__title">📖 내용</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 현장강의에서 중요한 저지연 시청은 WebRTC로, 놓친 구간을
                  다시 보는 기능은 HLS로 제공하자는 문제의식에서 출발한
                  프로젝트입니다.
                </div>
                <div className="project-text">
                  · 6인 팀으로 2023.09.01부터 2023.11.10까지 약 2개월간
                  진행했고, 프론트엔드 / Spring 백엔드 / SFU / HLS / 채팅 /
                  배포 설정을 역할별 저장소로 분리해 개발했습니다.
                </div>
                <div className="project-text">
                  · 단순한 스트리밍 페이지가 아니라 강의실 생성/입장,
                  회원관리, 강의 화면, Q&A, 자료함, 관리자 기능까지 포함한
                  서비스 단위로 설계했습니다.
                </div>
                <div className="project-text">
                  · 저는 이 구조 안에서 HLS 서버와 React frontend를 맡아,
                  실시간 강의와 다시보기 흐름이 실제 사용자 경험으로 이어지도록
                  구현했습니다.
                </div>
                <div className="project-text">
                  · 현재는 AWS 비용 문제로 배포를 중단했지만, 공개된 Git
                  organization과 이미지 문서로 당시 구조와 구현 과정을 확인할
                  수 있습니다.
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
            <div className="section__title">🏗️ 프로젝트 구조</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · <span className="addr-line">Frontend</span> - React 기반
                  강의실, 플레이어, 게시판, 관리자 화면 UI
                </div>
                <div className="project-text">
                  · <span className="addr-line">Spring Server</span> - 회원,
                  강의, 질문, 파일, 관리자 기능을 담당하는 백엔드
                </div>
                <div className="project-text">
                  · <span className="addr-line">SFU Server</span> - WebRTC
                  실시간 송출 및 연결 처리
                </div>
                <div className="project-text">
                  · <span className="addr-line">HLS Server</span> - HLS 변환,
                  되감기 재생, 세그먼트 생성, 미디어 저장 처리
                  <br />- WebSocket은 녹화 시작/중지와 transport 생성 같은
                  제어 메시지에 사용하고, 실제 미디어는 RTP 기반으로 전달받아
                  FFmpeg / GStreamer에서 HLS로 변환
                </div>
                <div className="project-text">
                  · <span className="addr-line">Chatting Server</span> -
                  강의실 별 실시간 채팅
                </div>
                <div className="project-text">
                  · <span className="addr-line">k8s manifest</span> - backend,
                  frontend, sfu, hls, chat 배포 설정 관리
                </div>
              </div>
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
                    <span className="addr-line">Frontend</span>
                    <span className="addr">
                      {" "}
                      - JavaScript, React, mediasoup-client, video.js
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Backend</span>
                    <span className="addr">
                      {" "}
                      - Java, Spring Boot, Node.js, Hibernate
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Database</span>
                    <span className="addr"> - MariaDB</span>
                  </div>
                  <div>
                    <span className="addr-line">Observability</span>
                    <span className="addr">
                      {" "}
                      - 서버 로그, HLS 변환 로그, 배포 상태 확인 중심 운영
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Media / Realtime</span>
                    <span className="addr">
                      {" "}
                      - WebRTC, HLS, FFmpeg, GStreamer
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Infra</span>
                    <span className="addr">
                      {" "}
                      - Docker, Kubernetes, AWS
                      (Route53/ElasticCache/ALB/EC2/S3), Argo CD
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Quality</span>
                    <span className="addr"> - GitHub Actions</span>
                  </div>
                </div>
                <div className="right">
                  <div className="section__title">🖥️ 구현된 기능</div>
                  <div className="project-text">
                    · <span className="addr-line">강의실 / 회원</span> -
                    강의실 생성, 강의 코드 입장, 회원가입/로그인, 내 강의 목록
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">실시간 시청</span> - 교사 /
                    학생 역할 기반 WebRTC 강의 송출 및 시청
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">다시보기 / 플레이어</span> -
                    HLS 플레이어, WebRTC / HLS 전환
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">강의 보조 기능</span> - Q&A
                    게시판, 자료함, 관리자 페이지, 실시간 채팅
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🤝 운영 / 협업</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · <span className="addr-line">Git organization</span> -
                  Frontend, Spring, SFU, HLS, Chatting, k8s manifest를
                  저장소별로 분리해 관리
                </div>
                <div className="project-text">
                  · <span className="addr-line">협업 문서</span> - Jira,
                  Notion, 이미지 문서로 요구사항, 회의록, API 명세, 아키텍처를
                  정리
                </div>
                <div className="project-text">
                  · <span className="addr-line">개발 방식</span> - 짧은 주기로
                  요구사항을 나누고 점검하는 애자일 방식으로 진행
                </div>
                <div className="project-text">
                  · <span className="addr-line">배포 흐름</span> - GitHub
                  Actions, Argo CD 기반 배포 구성
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
                  <img src={assetPath(card.image)} alt="img" />
                  <h5 className="projects-title">{card.title}</h5>
                </div>
              ))}
            </div>
            <div className="section">
              <div className="section__title">🙋‍♂️ 내 역할</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · HLS 서버에서 WebSocket 기반 제어 채널을 구현해 transport
                    생성, 녹화 시작/중지, 파일명 전달 같은 세션 흐름을
                    처리했습니다.
                  </div>
                  <div className="project-text">
                    · mediasoup plain transport로 전달된 RTP 스트림을 FFmpeg /
                    GStreamer 파이프라인에 연결해 HLS 세그먼트로 변환하고,
                    생성된 파일을 저장/업로드하는 흐름을 개발했습니다.
                  </div>
                  <div className="project-text">
                    · HLS 플레이어, 강의화면, Q&A 게시판, 자료 게시판, 관리자
                    페이지 등 React 프론트엔드를 개발했습니다.
                  </div>
                  <div className="project-text">
                    · HLS 서버, SFU 서버, 프론트엔드 사이에서 필요한 옵션과
                    재생 흐름이 맞물리도록 연동을 조정했습니다.
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section__title">✨ 트러블슈팅 / 개선</div>
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
                    그에 따른 부하 감소, 지연 11초로 감소 / 화질 저하
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

export default Project2;

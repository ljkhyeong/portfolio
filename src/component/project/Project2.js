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

const starStories = [
  {
    title: "WebRTC와 HLS를 병행한 이유",
    situation:
      "현장 강의는 저지연이 중요하지만, 놓친 구간을 다시 보는 기능까지 WebRTC 하나로 해결하기는 어려웠습니다.",
    task: "실시간성과 다시보기 경험을 모두 만족시키는 구조를 짧은 개발 기간 안에 설계해야 했습니다.",
    action:
      "실시간 시청은 WebRTC, 구간 재생과 다시보기는 HLS로 분리했습니다. mediasoup plain transport로 받은 RTP를 FFmpeg와 GStreamer 파이프라인에 태우고, React 플레이어에서는 강의 상황에 따라 두 경로를 전환하도록 구현했습니다.",
    result:
      "HLS 단독 구조 대신 하이브리드 구조를 택해 저지연 송출과 다시보기라는 서로 다른 요구를 동시에 충족했고, 5개 저장소가 나뉜 구조에서도 역할 경계를 명확히 가져갈 수 있었습니다.",
  },
  {
    title: "지연 시간 30초를 11초까지 줄인 튜닝",
    situation:
      "초기 HLS 파이프라인은 세그먼트 길이와 인코딩 설정이 보수적으로 잡혀 있어 WebRTC 대비 약 30초 지연이 발생했습니다.",
    task: "화질과 비용을 완전히 포기하지 않으면서도 다시보기 체감 지연을 줄여야 했습니다.",
    action:
      "TS 세그먼트 길이를 6초에서 2초로 줄여 플레이어가 더 빠르게 붙도록 만들고, GOP 간격과 인코딩 옵션을 조정해 변환 부하와 압축률의 균형을 다시 잡았습니다.",
    result:
      "재생 지연을 30초에서 15초, 다시 11초 수준까지 낮췄습니다. 대신 S3 업로드 오버헤드와 화질 저하라는 trade-off가 생겨, 팀 안에서 품질과 지연의 균형점을 수치로 설명할 수 있었습니다.",
  },
  {
    title: "정지 화면에서 발생한 muxing queue overflow 디버깅",
    situation:
      "강의 화면 변화가 거의 없을 때 FFmpeg muxing queue overflow가 발생하며 HLS 변환이 중단됐습니다.",
    task: "트랜스코딩 실패 원인을 미디어 서버가 아니라 프레임 생성과 타임스탬프 흐름까지 내려가서 파악해야 했습니다.",
    action:
      "입력 프레임과 출력 프레임 비율을 다시 맞추고 `-r` 옵션과 타임스탬프 고정 처리로 큐에 데이터가 몰리지 않게 조정했습니다. 동시에 WebSocket 제어 채널과 실제 미디어 흐름을 분리해 어느 구간에서 병목이 나는지 로그를 나눠 확인했습니다.",
    result:
      "1시간 장기 송출 테스트에서 변환 중단 재현률을 50% 수준에서 0%로 낮췄고, 디버깅 시간을 줄이기 위해 서버 로그와 변환 로그를 분리한 운영 기준도 만들었습니다.",
  },
];

const techChoices = [
  {
    title: "WebRTC + HLS",
    summary:
      "WebRTC만 쓰면 되감기와 저장이 어렵고, HLS만 쓰면 저지연이 어렵기 때문에 하이브리드 구조를 선택했습니다.",
    tradeoff:
      "구조는 복잡해졌지만 기능 요구사항을 기술 특성에 맞게 분해해 해결할 수 있었습니다.",
  },
  {
    title: "mediasoup plain transport",
    summary:
      "실시간 미디어 송출과 변환 파이프라인을 직접 제어하기 위해 plain transport를 사용했습니다.",
    tradeoff:
      "설정과 디버깅 난이도는 높지만, FFmpeg 및 GStreamer와 연결 지점을 세밀하게 조정할 수 있었습니다.",
  },
  {
    title: "React + video.js",
    summary:
      "플레이어 UI와 게시판, 관리자 화면을 빠르게 통합하기 위해 React 기반 프론트를 선택했습니다.",
    tradeoff:
      "스트리밍 UX와 일반 업무 UI를 한 화면에서 함께 다루는 복잡도가 있지만, 사용자 경험을 하나의 상태 흐름으로 묶을 수 있었습니다.",
  },
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
                  · 이 프로젝트는 현장 강의에서 필요한 저지연 시청과 놓친 구간
                  다시보기를 동시에 제공하려는 문제의식에서 출발했습니다.
                </div>
                <div className="project-text">
                  · 6인 팀이 약 2개월 동안 frontend, Spring backend, SFU, HLS,
                  chatting, k8s manifest 저장소를 나눠 개발했고, 저는 HLS 서버와
                  React 프론트를 담당했습니다.
                </div>
                <div className="project-text">
                  · 핵심은 기능 수보다, WebRTC와 HLS라는 성격이 다른 기술을 한
                  서비스 경험 안에서 어떻게 연결하느냐였습니다.
                </div>
                <div className="project-text">
                  · 그래서 플레이어 UX, 미디어 파이프라인, 제어 채널, 인코딩
                  파라미터를 함께 다루며 문제를 해결했습니다.
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
                https://github.com/orgs/TeamyRoom/repositories
              </a>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🏗️ 프로젝트 구조</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · <span className="addr-line">Frontend</span> - React 기반
                  강의실, 플레이어, 게시판, 관리자 화면
                </div>
                <div className="project-text">
                  · <span className="addr-line">Spring Server</span> - 회원,
                  강의, 게시판, 파일, 관리자 기능을 담당하는 백엔드
                </div>
                <div className="project-text">
                  · <span className="addr-line">SFU Server</span> - WebRTC
                  실시간 송출과 연결 제어
                </div>
                <div className="project-text">
                  · <span className="addr-line">HLS Server</span> - RTP 수신,
                  HLS 변환, 세그먼트 생성, 저장
                </div>
                <div className="project-text">
                  · <span className="addr-line">Chatting / Infra</span> - 실시간
                  채팅, Docker, Kubernetes, AWS, Argo CD
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
                      - Java, Spring Boot, Node.js, JPA
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
                    <span className="addr-line">Database</span>
                    <span className="addr"> - MariaDB</span>
                  </div>
                  <div>
                    <span className="addr-line">Infra</span>
                    <span className="addr">
                      {" "}
                      - Docker, Kubernetes, AWS, Argo CD
                    </span>
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
            <div className="section__title">🙋‍♂️ 내 역할</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · HLS 서버에서 WebSocket 기반 제어 채널을 구현해 transport
                  생성, 녹화 시작과 중지, 파일명 전달 같은 세션 흐름을
                  처리했습니다.
                </div>
                <div className="project-text">
                  · mediasoup plain transport로 받은 RTP를 FFmpeg와 GStreamer
                  파이프라인으로 연결해 HLS 세그먼트를 생성하고 저장 흐름을
                  만들었습니다.
                </div>
                <div className="project-text">
                  · React 프론트에서 플레이어, 게시판, 자료함, 관리자 화면을
                  구현하고 WebRTC와 HLS 전환 경험을 맞췄습니다.
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
              <div className="section__title">🤝 운영 / 협업</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · 저장소를 역할별로 나눴기 때문에, 프론트와 HLS 사이 API
                    계약 및 옵션 명세를 문서로 계속 맞추는 작업이 중요했습니다.
                  </div>
                  <div className="project-text">
                    · 짧은 스프린트마다 요구사항, 회의록, 아키텍처 이미지,
                    디버깅 로그를 남겨 미디어 이슈를 팀 전체가 같은 기준으로 볼
                    수 있게 했습니다.
                  </div>
                  <div className="project-text">
                    · 배포는 GitHub Actions와 Argo CD를 사용했지만, 비용 문제로
                    운영은 종료했습니다. 대신 문서와 발표 자료로 구조와
                    시행착오를 남겨 두었습니다.
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

export default Project2;

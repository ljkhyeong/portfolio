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
          <div className="project-title">Feature Flag Service</div>
        </div>
        <div className="details">
          <div className="section"></div>
          <div className="section">
            <div className="section__title">📖 내용</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · Spring Boot 기반의 Feature Flag Management Service입니다.
                </div>
                <div className="project-text">
                  · 사용자 그룹별 세분화, 점진적 롤아웃, 실시간 설정값 제공을
                  지원.
                </div>
                <div className="project-text">
                  · 프로젝트 상세 내용, 정책, API 명세 등은 해당 프로젝트 깃허브
                  페이지에 readme.md에 요약정보로 게시했습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🐱 Github Link</div>
            <div className="section__list">
              <a
                href="https://github.com/ljkhyeong/feature-flag-service"
                className="addr"
              >
                https://github.com/ljkhyeong/feature-flag-service{" "}
              </a>
            </div>
            <div className="section__list"></div>
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
                    <span className="addr"> - React (Admin 콘솔 예정)</span>
                  </div>
                  <div>
                    <span className="addr-line">Backend</span>
                    <span className="addr">
                      {" "}
                      - Spring Boot, JPA(Hibernate), MyBatis 일부
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">RDBMS</span>
                    <span className="addr"> - MariaDB</span>
                  </div>
                  <div>
                    <span className="addr-line">Infra</span>
                    <span className="addr">
                      {" "}
                      - Redis, Docker, Testcontainers
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">협업도구</span>
                    <span className="addr"> - Git</span>
                  </div>
                  <div>
                    <span className="addr-line">CI/CD</span>
                    <span className="addr">
                      {" "}
                      - GitHub Actions (빌드/테스트/REST Docs)
                    </span>
                  </div>
                </div>
                <div className="right">
                  <div className="section__title">🖥️ 구현된 기능</div>
                  <div className="project-text">
                    <span className="addr-line">
                      ** readme 문서가 가독성이 훨씬 좋으므로 인터넷 접속이
                      되신다면 Github Link로 확인 부탁드립니다 **
                    </span>
                  </div>
                  <div className="project-text">
                    <span className="addr-line">Feature Flag 관리</span> <br />·
                    플래그 CRUD (생성/조회/수정/삭제) <br />· 환경별 플래그 키
                    제약 (Unique Constraint) <br />· 플래그 토글(toggle API)
                  </div>
                  <div className="project-text">
                    <span className="addr-line">배포 전략</span> <br />·
                    퍼센티지 배포 (사용자 ID 해싱 기반 분포, ±1% 오차 검증 완료){" "}
                    <br />· 배포 조건 확장 가능 (rulesJson 기반 include/exclude
                    사용자 그룹)
                  </div>
                  <div className="project-text">
                    <span className="addr-line">SDK 제공용 API</span> <br />·
                    /sdk/v1/config – 환경별 번들 JSON 반환
                    <br /> · ETag + If-None-Match 지원 (304 캐시 최적화)
                    <br /> · gzip 압축 가능
                  </div>
                  <div className="project-text">
                    <span className="addr-line">운영/품질 보증</span> <br />·
                    Redis 캐시 (GenericJackson2JsonRedisSerializer)
                    <br />· 캐시 무효화 정책 (@CacheEvict)
                    <br />· REST Docs (MockMvc 기반 문서화, Asciidoctor HTML
                    생성)
                    <br />· E2E 테스트 (캐시 미스/히트/404/304 시나리오)
                    <br />· 성능 테스트 (k6) – 캐싱 적용 후 평균 응답 &lt; 20ms,
                    성공률 100%
                    <br />· Testcontainers (MariaDB, Redis 통합 테스트 환경)
                  </div>
                  <div className="project-text">
                    <span className="addr-line">에러 처리/표준화</span> <br />·
                    ApplicationException + ErrorCode enum
                    <br />
                    ·GlobalExceptionHandler 통해 표준 에러 스키마 반환 <br />
                  </div>
                  <div className="project-text">
                    <span className="addr-line">문서/아키텍처 관리</span> <br />
                    · README.md – 실행/품질/트러블슈팅 정리 <br />· ADR 문서 –
                    캐시 직렬화 정책, ETag 헤더 케이스 정책 등 <br />·
                    Retrospectives – 날짜별 회고 기록
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="section">
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
                  <div className="project-text">
                    · 모든 글 조회수 Redis 카운팅 후 배치작업 (일반글은 조회수
                    업데이트 경합으로 인한 성능부하 가능성 낮음)
                    <br /> -> 게시글 조회 배치작업 베스트글(임시로 좋아요 1이
                    기준)에만 하도록 개선
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section__title">🧑‍💻 추가할 기능</div>
              <div className="section__list">
                <div className="section__list-item">
                  <div className="project-text">
                    · 병렬성, 가독성 향상토록 리팩토링
                  </div>
                  <div className="project-text">· 도메인/TLS 인증서 구매 </div>
                </div>
              </div>
            </div> */}
          {/* </div> */}
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

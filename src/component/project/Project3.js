import "../../css/Project.css";
import { useNavigate } from "react-router-dom";
import { assetPath } from "../../utils/assetPath";

const documentHighlights = [
  {
    title: "PRD",
    meta: "4 documents",
    href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs/PRD",
    summary:
      "회원/비회원 흐름, 주문·예약·8회권 정책, 관리자 운영 규칙, API 계약을 기준 문서로 먼저 고정했습니다.",
    docs: [
      {
        name: "0001_기준_스펙",
        summary:
          "주문·예약·8회권·관리자 운영 규칙을 한 문서로 묶어 구현 중 기준선이 흔들리지 않게 했습니다.",
      },
      {
        name: "0002_회원_스토어_전환",
        summary:
          "guest 중심 흐름에서 member store로 확장할 때 필요한 경로, 인증, 화면 구조를 단계적으로 정리했습니다.",
      },
      {
        name: "0004_API_계약",
        summary:
          "요청/응답 예시와 에러 포맷을 문서화해 프론트와 백엔드 계약 변경 비용을 줄였습니다.",
      },
    ],
  },
  {
    title: "ADR",
    meta: "28 documents",
    href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs/ADR",
    summary:
      "헥사고날 전환, 비회원 조회 토큰 보호, 결제 환불 보호, 관측성, 테스트 기준 같은 설계 결정을 기록하고 코드에 반영했습니다.",
    docs: [
      {
        name: "0027_테스트_전략과_최소_테스트_세트_기준선",
        summary:
          "상위 20% 안팎의 핵심 기능에만 테스트를 집중해, 투자 대비 유지보수성과 검증 효율을 높였습니다.",
      },
      {
        name: "0024_비회원_토큰_강화",
        summary:
          "비회원 조회 토큰을 헤더 전달 + 해시 저장으로 바꿔, 로그 노출과 DB 유출 리스크를 줄였습니다.",
      },
      {
        name: "0021_Hexagonal_아키텍처_전환",
        summary:
          "기존 구조를 전면 재작성하지 않고 port/adapter를 점진 도입해, 변경 리스크를 낮추며 구조를 개선했습니다.",
      },
    ],
  },
  {
    title: "Idea / POC",
    meta: "29 ideas, 1 POC",
    href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs/Idea",
    summary:
      "Redis 다중 인스턴스 대응, 배포 토폴로지, Circuit Breaker 도입 같은 후보를 검토하고 실험 후 채택 여부를 정리했습니다.",
    docs: [
      {
        name: "0015_다중_인스턴스용_Redis_도입",
        summary:
          "세션과 rate limit을 서버 메모리에서 Redis로 옮겨, 다중 인스턴스 환경에서도 같은 운영 기준을 유지하게 했습니다.",
      },
      {
        name: "0028_CloudFront_S3_ALB_배포_구조",
        summary:
          "정적 파일, API, 관측성 스택을 어떤 경로로 배치할지 미리 검토해 배포 구조 결정 비용을 줄였습니다.",
      },
      {
        name: "0001_결제_제공자_CircuitBreaker_적용",
        summary:
          "실 PG 연동 전에도 환불 경계에 CircuitBreaker와 TimeLimiter를 적용해 장애 전파를 줄이는 구조를 검증했습니다.",
      },
    ],
  },
  {
    title: "Retrospective",
    meta: "8 retrospectives",
    href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs/Retrospective",
    summary:
      "기능이 커진 뒤 운영 가시성 보강, guest-member 흐름 정리, 라우트 안정화처럼 구현 이후의 교훈을 다음 작업 기준으로 남겼습니다.",
    docs: [
      {
        name: "0004_기능_성장_후_Observability_보강",
        summary:
          "기능을 멈추고 갈아엎지 않아도 requestId, metrics, dashboard, Sentry를 순차적으로 붙여 운영 가시성을 회복할 수 있음을 정리했습니다.",
      },
      {
        name: "0005_비회원_회원_흐름_수렴",
        summary:
          "guest 위에 member 흐름을 덧붙이며 생긴 중복을 돌아보고, 공통 모델로 수렴해야 유지보수 비용이 줄어든다는 교훈을 남겼습니다.",
      },
      {
        name: "0007_문서_동기화와_표준_경로_운영_규율",
        summary:
          "기능 추가 뒤 문서·경로 정리를 따라가는 비용을 줄이기 위해, 표준 경로와 문서 분리 기준을 먼저 잡는 규율을 정리했습니다.",
      },
    ],
  },
];

const Project3 = () => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate("/project4");
  };

  const handleMain = () => {
    navigate("../");
  };

  return (
    <>
      <button className="nav-button prev" onClick={handlePrevious}>
        ‹
      </button>
      <div className="container">
        <div className="header">
          <div className="project-title">happyGallery</div>
        </div>
        <div className="details">
          <div className="section">
            <img
              className="rep-image"
              src={assetPath("happygallery-project.png")}
              alt="happyGallery 프로젝트"
            />
          </div>
          <div className="section">
            <div className="section__title">📖 내용</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 오프라인 공방을 위한 온라인 쇼핑몰 + 체험 예약 시스템입니다.
                </div>
                <div className="project-text">
                  · 상품 주문, 클래스 예약, 8회권 패스, 관리자 운영을 하나의
                  플랫폼에서 처리할 수 있도록 설계/구현했습니다.
                </div>
                <div className="project-text">
                  · 백엔드는 Spring Boot, 프론트는 React + TypeScript로
                  구성했고, 운영 안정성과 문서화까지 함께 다듬고 있는 개인
                  프로젝트입니다.
                </div>
                <div className="project-text">
                  · 단순히 기능을 붙이는 방식보다, 요구사항과 정책을 문서로
                  기준화하고 설계 결정을 계속 기록하면서 프로젝트를
                  발전시키고 있습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🐱 Github Link</div>
            <div className="section__list">
              <a
                href="https://github.com/ljkhyeong/happyGallery"
                className="addr"
              >
                https://github.com/ljkhyeong/happyGallery
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
                    <span className="addr-line">Frontend</span>
                    <span className="addr">
                      {" "}
                      - React, TypeScript, Bootstrap, TanStack Query
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Backend</span>
                    <span className="addr">
                      {" "}
                      - Java, Spring Boot, JPA, Flyway, Embedded Tomcat
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Database</span>
                    <span className="addr"> - MySQL, Redis</span>
                  </div>
                  <div>
                    <span className="addr-line">Observability</span>
                    <span className="addr">
                      {" "}
                      - Actuator, Prometheus, Grafana, Sentry
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Infra</span>
                    <span className="addr"> - Docker</span>
                  </div>
                  <div>
                    <span className="addr-line">Quality</span>
                    <span className="addr"> - Testcontainers, Playwright</span>
                  </div>
                </div>
                <div className="right">
                  <div className="section__title">🖥️ 구현된 기능</div>
                  <div className="project-text">
                    · <span className="addr-line">스토어 / 회원</span> -
                    상품 목록/상세, 회원가입/로그인, 마이페이지, 비회원 이력
                    가져오기
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">주문 / 예약 / 패스</span> -
                    상품 주문, 클래스 예약, 예약 변경/취소, 회원 전용 8회권
                    구매/조회/만료 처리
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">관리자 운영</span> - 상품
                    등록, 슬롯 생성/비활성화, 주문 승인/거절/배송/픽업, 환불
                    실패 재시도, 문의 답변 관리
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">운영 안정성</span> - Redis
                    기반 세션/요청 제한, 결제 환불 안정성, 관측성 구성,
                    Testcontainers와 Playwright 기반 검증
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
                  · <span className="addr-line">Git 전략</span> - Git flow
                  를 팀 규모와 작업 흐름에 맞게 간략화
                </div>
                <div className="project-text">
                  · <span className="addr-line">문서화</span> - README,
                  PRD, ADR, 회고 문서를 중심으로 설계 의도와 운영 기준을
                  지속적으로 정리
                </div>
                <div className="project-text">
                  · <span className="addr-line">AI 작업 흐름</span> - Claude
                  Code에서 적절한 서브 에이전트, 스킬, 하니스를 걸어 탐색,
                  구현, 검증 흐름을 분리해 작업
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">📚 개발과정</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 기능 구현과 동시에 문서 체계를 운영했습니다. 요구사항,
                  설계 결정, 실험 기록, 회고를 분리해 남기면서 프로젝트를
                  점진적으로 고도화했습니다.
                </div>
              </div>
            </div>
            <div className="process-grid">
              {documentHighlights.map((item) => (
                <a
                  className="process-card"
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="process-card__title">{item.title}</div>
                  <div className="process-card__meta">{item.meta}</div>
                  <div className="process-card__text">{item.summary}</div>
                  <div className="process-card__docs">
                    {item.docs.map((doc) => (
                      <div className="process-card__doc" key={doc.name}>
                        <span className="process-card__doc-name">{doc.name}</span>
                        <span className="process-card__doc-summary">
                          {" "}
                          : {doc.summary}
                        </span>
                      </div>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
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

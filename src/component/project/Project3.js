import "../../css/Project.css";
import { useNavigate } from "react-router-dom";
import { assetPath } from "../../utils/assetPath";

const documentHighlights = [
  {
    title: "PRD",
    meta: "4 documents",
    href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs/PRD",
    summary:
      "주문, 예약, 8회권, 관리자 운영 규칙을 기능보다 먼저 고정해 비즈니스 기준이 개발 중 흔들리지 않게 했습니다.",
    docs: [
      {
        name: "0001_기준_스펙",
        summary:
          "상품, 예약, 패스, 환불, 운영 규칙을 하나의 기준선으로 묶어 도메인 경계를 먼저 정리했습니다.",
      },
      {
        name: "0002_회원_스토어_전환",
        summary:
          "guest 중심 흐름에 member store와 guest claim을 얹으면서도 정책 충돌이 나지 않도록 단계별 전환 기준을 남겼습니다.",
      },
      {
        name: "0004_API_계약",
        summary:
          "프론트와 백엔드가 같은 요청, 응답, 에러 계약을 보도록 맞춰 변경 비용을 줄였습니다.",
      },
    ],
  },
  {
    title: "ADR",
    meta: "30 documents",
    href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs/ADR",
    summary:
      "헥사고날 전환, 슬롯 동시성, guest token 강화, 환불 보호, 세션 전략 같은 설계 결정을 문서와 코드로 함께 관리했습니다.",
    docs: [
      {
        name: "0003_슬롯_동시성_전략",
        summary:
          "정원 8명 슬롯은 SELECT FOR UPDATE로 직렬화해 재시도 루프 없이 예약 정합성을 보장했습니다.",
      },
      {
        name: "0021_Hexagonal_아키텍처_전환",
        summary:
          "전체 재작성 대신 port와 adapter를 점진 도입해 기능 개발 속도를 유지하며 구조를 개선했습니다.",
      },
      {
        name: "0024_비회원_토큰_강화",
        summary:
          "query param 평문 토큰을 헤더 전달, 해시 저장, HMAC 만료 토큰으로 바꿔 보안 리스크를 줄였습니다.",
      },
    ],
  },
  {
    title: "Idea / POC",
    meta: "38 ideas, 1 POC",
    href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs/Idea",
    summary:
      "Redis 세션, 다중 인스턴스 대응, HTTP 캐싱, Circuit Breaker, Query 경계 같은 주제를 미리 검토해 설계 결정을 감이 아닌 근거로 내렸습니다.",
    docs: [
      {
        name: "0015_다중_인스턴스용_Redis_도입",
        summary:
          "회원 세션, 관리자 세션, rate limit을 단일 서버 메모리에서 분리해 다중 인스턴스 전환 여지를 확보했습니다.",
      },
      {
        name: "0038_커서_페이지네이션_tuple_comparison_전환",
        summary:
          "관리자 목록에서 offset 비용을 줄이기 위해 tuple comparison 기반 cursor 조회를 검토했습니다.",
      },
      {
        name: "0001_결제_제공자_CircuitBreaker_적용",
        summary:
          "실제 PG 연동 전에도 환불 호출 보호 경계를 먼저 검증해 장애 전파를 막는 방향을 잡았습니다.",
      },
    ],
  },
  {
    title: "Retrospective",
    meta: "8 retrospectives",
    href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs/Retrospective",
    summary:
      "기능 성장 뒤 운영 가시성, guest와 member 흐름 수렴, 문서 동기화 비용을 어떻게 다뤘는지 회고로 남겼습니다.",
    docs: [
      {
        name: "0004_기능_성장_후_Observability_보강",
        summary:
          "requestId, metrics, dashboard, Sentry를 단계적으로 붙여 기능이 커진 뒤에도 운영 시야를 복구했습니다.",
      },
      {
        name: "0005_비회원_회원_흐름_수렴",
        summary:
          "guest 위에 member 기능을 덧붙이며 생긴 중복 모델을 공통 규칙으로 수렴해야 한다는 교훈을 정리했습니다.",
      },
      {
        name: "0006_Query_Facade와_운영_경로_정리",
        summary:
          "복잡한 조회와 운영 경로를 별도 Query Service로 분리해 컨트롤러가 도메인과 인프라를 동시에 알지 않게 했습니다.",
      },
    ],
  },
];

const starStories = [
  {
    title: "도메인 규칙과 외부 의존성 분리",
    situation:
      "주문, 예약, 8회권, 관리자 운영이 한 서비스 안에서 함께 자라면서 app 계층이 repository와 외부 연동 구현을 직접 아는 구간이 늘었습니다.",
    task: "기능 개발 속도를 유지한 채 도메인 규칙과 외부 기술 의존성을 분리해야 했습니다.",
    action:
      "4개 모듈 구조는 유지하되 port와 adapter를 점진 도입했고, payment, notification, session, booking, order, admin query 경계를 유스케이스 중심으로 재정렬했습니다. `BookingCreationSupport`, `DefaultAdminOrderQueryService`, `DefaultAdminBookingQueryService`처럼 조합 책임도 별도 유스케이스로 분리했습니다.",
    result:
      "전면 재작성 없이 구조를 개선했고, 30개 ADR과 38개 Idea를 기준으로 설계를 추적 가능한 상태로 유지했습니다. 동시에 Playwright 핵심 시나리오 `P8-1`부터 `P8-9`까지 9개 흐름을 통과시키며 구조 개선과 기능 검증을 함께 가져갔습니다.",
  },
  {
    title: "비회원 토큰 보안 강화",
    situation:
      "기존 guest 주문과 예약 토큰은 query parameter로 전달되고 DB에 평문으로 저장돼 로그, Referer, 브라우저 히스토리, DB 유출 시 리스크가 컸습니다.",
    task: "기존 사용자의 하위 호환을 깨지 않으면서 토큰 노출면을 줄여야 했습니다.",
    action:
      "전달 방식을 `X-Access-Token` 헤더로 바꾸고, DB에는 SHA-256 해시만 저장하도록 변경했습니다. 이후 HMAC 서명과 만료 시각을 포함한 토큰으로 고도화했고, `.` 구분자가 없는 레거시 토큰도 함께 처리하는 듀얼 모드 검증 경로를 만들었습니다.",
    result:
      "토큰 전달 경로를 query parameter에서 header 1개로 통일했고, booking과 order 토큰 포맷도 2개에서 1개로 수렴시켰습니다. 만료가 없던 토큰은 기본 168시간 유효 정책으로 바뀌었고, DB에는 원본 토큰이 남지 않게 했습니다.",
  },
  {
    title: "예약 정합성과 환불 보호",
    situation:
      "체험 예약은 정원 8명 슬롯을 두고 경쟁이 발생하고, 취소 시에는 외부 PG 환불이 느리거나 실패할 수 있어 예약 상태와 환불 상태가 어긋날 위험이 있었습니다.",
    task: "동시 예약과 외부 장애를 각각 다른 종류의 문제로 보고, 도메인 정합성과 시스템 보호를 동시에 만족시켜야 했습니다.",
    action:
      "슬롯 정원에는 `SELECT FOR UPDATE` 기반 비관적 락을 적용해 `booked_count` 증가를 단일 트랜잭션으로 직렬화했습니다. 환불은 `PaymentProvider` 경계에 `CircuitBreaker + TimeLimiter`를 두고, 실패를 `RefundResult.failure`로 표준화해 취소 트랜잭션과 분리했습니다.",
    result:
      "슬롯 정원 경쟁은 재시도 루프 없이 단일 row 잠금으로 처리하게 됐고, 환불 호출은 3초 timeout, 실패율 50%, 20건 sliding window, 30초 open 정책으로 내부 스레드 점유를 제한했습니다. 즉 도메인 정합성은 DB 락으로, 외부 장애 전파는 회로 차단으로 각각 분리해 다뤘습니다.",
  },
];

const techChoices = [
  {
    title: "JPA + MyBatis",
    summary:
      "주문, 예약, 패스처럼 상태 전이와 연관관계가 중요한 영역은 JPA로 다뤄 도메인 규칙에 집중했습니다.",
    tradeoff:
      "반면 관리자 주문과 예약 검색, 매출과 환불 집계처럼 복잡한 조회는 MyBatis mapper로 분리해 SQL 제어권과 성능을 확보했습니다.",
  },
  {
    title: "점진적 헥사고날 구조",
    summary:
      "기존 app, domain, infra를 버리지 않고 port와 adapter를 얹어 구조 개선과 기능 개발을 병행했습니다.",
    tradeoff:
      "클래스 수와 보일러플레이트는 늘지만, controller, batch, scheduler가 같은 유스케이스를 호출하도록 정리해 변경 영향 범위를 줄였습니다.",
  },
  {
    title: "Spring Session + Redis",
    summary:
      "회원 세션 `HG_SESSION`, 관리자 세션, 요청 제한 카운터를 단일 서버 메모리 대신 Redis에 둬 다중 인스턴스 확장성을 확보했습니다.",
    tradeoff:
      "인프라 복잡도는 늘지만 세션 일관성과 rate limit 정합성을 서버 수와 무관하게 유지할 수 있습니다.",
  },
  {
    title: "Testcontainers + Playwright",
    summary:
      "시간 경계와 Redis 의존 흐름은 MySQL, Redis Testcontainers로 검증하고, 사용자 여정은 브라우저 테스트로 확인했습니다.",
    tradeoff:
      "실행 시간은 늘어나지만 핵심 정책을 코드 리팩터링과 동시에 검증할 수 있어 회귀 비용을 줄였습니다.",
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
                  · happyGallery는 공방의 상품 주문, 체험 예약, 회원 전용 8회권,
                  비회원 조회, 관리자 운영을 하나의 서비스 안에서 다루는
                  프로젝트입니다.
                </div>
                <div className="project-text">
                  · 단순히 기능 수를 늘리기보다, 서로 다른 비즈니스 규칙이
                  충돌하지 않도록 도메인 경계를 먼저 정리하고 그 위에 구현을
                  얹는 방식을 택했습니다.
                </div>
                <div className="project-text">
                  · 특히 guest, member, admin 흐름이 뒤섞이지 않도록 PRD로
                  기준선을 고정하고, ADR로 설계 결정을 남기며 구조를 점진적으로
                  개선했습니다.
                </div>
                <div className="project-text">
                  · 결과적으로 4개 PRD, 30개 ADR, 38개 Idea, 8개 Retrospective가
                  코드와 함께 쌓이는 문서 중심 프로젝트로 운영하고 있습니다.
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
                      - Vite, React 19, TypeScript, Bootstrap, TanStack Query,
                      React Router
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Backend</span>
                    <span className="addr">
                      {" "}
                      - Java 21, Spring Boot 4, JPA, MyBatis, Spring Session,
                      Flyway, Resilience4j
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Architecture</span>
                    <span className="addr">
                      {" "}
                      - Multi-module, Hexagonal Architecture
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Database</span>
                    <span className="addr"> - MySQL 8, Redis</span>
                  </div>
                  <div>
                    <span className="addr-line">Observability</span>
                    <span className="addr">
                      {" "}
                      - Actuator, Prometheus, Grafana, Sentry
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Quality</span>
                    <span className="addr"> - Testcontainers, Playwright</span>
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
            <div className="section__title">🏛️ 아키텍처 / 설계 포인트</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · <span className="addr-line">도메인 우선 설계</span> - 상태
                  전이, 예약금, 환불, 패스 만료처럼 규칙이 자주 바뀌는 영역은
                  엔티티와 유스케이스에서 책임지게 하고, 인프라 세부사항은
                  adapter로 밀어냈습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">운영 경계 분리</span> - 관리자
                  조회는 Query Service, 환불은 Payment 경계, 세션은 Session
                  경계로 끊어 controller가 여러 관심사를 동시에 알지 않게
                  했습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">문서와 코드 동기화</span> - PRD,
                  ADR, Idea, Retrospective를 기능 완료 후 정리하는 산출물이
                  아니라 구현 전에 결정을 고정하는 기준으로 사용했습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🤝 운영</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · <span className="addr-line">세션과 요청 제한 운영</span> -
                  회원 세션 `HG_SESSION`, 관리자 Bearer 세션, rate limit
                  카운터를 모두 Redis로 옮겨 인스턴스 수와 무관한 운영 기준을
                  맞췄습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">관측성과 로그 운영</span> -
                  Actuator, Prometheus, Grafana, Sentry를 붙여 서버 상태와
                  퍼널 지표를 함께 보고, 전화번호와 토큰은 로그 전에
                  마스킹했습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">배치와 검증</span> - 8회권
                  만료, 픽업 만료 같은 커스텀 배치를 유지하면서,
                  `@UseCaseIT`와 Playwright `P8-1`부터 `P8-9`까지 9개 핵심
                  시나리오로 회귀를 확인했습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">문서 기준선</span> - README,
                  PRD, ADR, Idea, Retrospective를 코드와 같이 갱신해 운영
                  기준이 문서 뒤로 밀리지 않게 관리했습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">📚 개발과정</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 요구사항, 설계, 실험, 회고를 구분해 기록하면서 기능 개발과
                  구조 개선을 동시에 진행했습니다. 아래 카드들은 실제로
                  프로젝트에서 유지 중인 기준 문서들입니다.
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
                        <span className="process-card__doc-name">
                          {doc.name}
                        </span>
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

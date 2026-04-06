import "../../css/Project.css";
import { useNavigate } from "react-router-dom";
import { assetPath } from "../../utils/assetPath";
import { renderTechText } from "../../utils/renderTechText";

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
          "복잡한 조회와 운영 경로를 별도 Query Service와 운영 경계로 분리해 각 계층과 기능 경계가 서로의 세부 구현을 직접 알지 않게 했습니다.",
      },
    ],
  },
];

const starStories = [
  {
    title: "기능 개발과 병행한 점진적 구조 개선",
    situation:
      "주문, 예약, 패스, 관리자 기능이 함께 커지면서 서비스 계층이 저장소와 외부 연동 구현을 직접 아는 구간이 많아졌고, 수정 한 번이 여러 모듈로 번졌습니다.",
    task: "운영 중인 프로젝트라 기능 개발을 멈추지 않고 구조를 정리해야 했습니다.",
    action:
      "전면 재작성 대신 결제, 알림, 세션, 예약, 주문 경계를 인터페이스 기준으로 다시 나누고 port와 adapter를 점진 도입했습니다.",
    result:
      "기능 개발을 이어가면서도 변경 영향 범위를 줄였고, 설계 결정은 ADR 30건과 Idea 38건으로 추적 가능하게 남겼습니다. Playwright P8-1, P8-9를 포함한 9개 핵심 시나리오와 @UseCaseIT 검증으로 회귀도 함께 막았습니다.",
  },
  {
    title: "운영 흐름을 깨지 않은 토큰 보안 강화",
    situation:
      "비회원 주문과 예약 토큰이 URL 파라미터와 DB 평문에 남아 로그, 브라우저 히스토리, DB 유출 시 노출 위험이 컸습니다.",
    task: "기존 조회 흐름은 유지하면서 토큰 노출면을 줄여야 했습니다.",
    action:
      "전달은 X-Access-Token 헤더로 바꾸고 DB에는 SHA-256 해시만 저장했습니다. 이후 HMAC 서명과 만료 시각을 넣고, 레거시 토큰도 함께 검증하게 했습니다.",
    result:
      "사용자 흐름을 깨지 않고 URL 노출을 없앴고, DB에는 원본 토큰이 남지 않게 했습니다. 예약과 주문 토큰 포맷도 하나로 통일해 운영 복잡도를 줄였습니다.",
  },
  {
    title: "예약 동시성과 환불 장애를 분리해 안정화",
    situation:
      "예약은 정원 경쟁이 있고, 취소는 외부 PG 환불 지연까지 얽혀 하나의 장애가 전체 흐름으로 번질 수 있었습니다.",
    task: "예약 정합성과 외부 호출 장애를 같은 방식으로 처리하지 않고 분리해 안정화해야 했습니다.",
    action:
      "슬롯 정원은 SELECT FOR UPDATE로 직렬화하고, 환불은 CircuitBreaker + TimeLimiter와 실패 표준화로 안정화했습니다.",
    result:
      "정원 초과와 환불 지연을 분리해 다루게 되면서 내부 트랜잭션이 외부 호출 대기로 묶이지 않게 했습니다. 환불 호출은 3초 timeout, 실패율 50%, 20건 sliding window, 30초 open 정책으로 자원 점유를 제한했습니다.",
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
      "회원 세션 HG_SESSION, 관리자 세션, 요청 제한 카운터를 단일 서버 메모리 대신 Redis에 둬 다중 인스턴스 확장성을 확보했습니다.",
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
            <div className="section__title">내용</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · happyGallery는 공방의 상품 주문, 체험 예약, 회원권, 비회원
                  조회, 관리자 운영을 하나의 서비스로 묶은 개인 프로젝트입니다.
                </div>
                <div className="project-text">
                  · 핵심은 기능 추가보다 주문, 예약, 패스, 환불 규칙이 충돌하지
                  않도록 도메인 경계를 먼저 정리하는 데 있었습니다.
                </div>
                <div className="project-text">
                  · PRD, ADR, Idea, Retrospective를 기준선으로 두고 구조 개선과
                  기능 개발을 함께 진행하며 문서와 코드가 같이 쌓이도록 운영하고
                  있습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">Github Link</div>
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
            <div className="tech-tradeoff-grid">
              <div>
                <div className="section__title">기술스택</div>
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
              <div>
                <div className="section__title">선택 이유와 트레이드오프</div>
                {techChoices.map((choice) => (
                  <div className="project-text" key={choice.title}>
                    · <span className="addr-line">{choice.title}</span> -{" "}
                    {renderTechText(choice.summary)}{" "}
                    {renderTechText(choice.tradeoff)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">핵심 트러블슈팅 (STAR)</div>
            <div className="section__list">
              {starStories.map((story) => (
                <div className="star-story" key={story.title}>
                  <div className="star-story__title">{story.title}</div>
                  <div className="star-story__row">
                    <span className="star-story__label">Situation</span>
                    <span className="star-story__content">
                      {renderTechText(story.situation)}
                    </span>
                  </div>
                  <div className="star-story__row">
                    <span className="star-story__label">Task</span>
                    <span className="star-story__content">
                      {renderTechText(story.task)}
                    </span>
                  </div>
                  <div className="star-story__row">
                    <span className="star-story__label">Action</span>
                    <span className="star-story__content">
                      {renderTechText(story.action)}
                    </span>
                  </div>
                  <div className="star-story__row">
                    <span className="star-story__label">Result</span>
                    <span className="star-story__content">
                      {renderTechText(story.result)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="section">
            <div className="section__title">아키텍처 / 설계 포인트</div>
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
                  경계로 나눠 각 경계가 서로의 세부 구현을 직접 알지 않게
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
            <div className="section__title">운영</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · <span className="addr-line">세션과 요청 제한 운영</span> -
                  회원 세션 HG_SESSION, 관리자 Bearer 세션, rate limit
                  카운터를 모두{" "}
                  <code>Redis</code>로 옮겨 인스턴스 수와
                  무관한 운영 기준을 맞췄습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">관측성과 로그 운영</span> -
                  <code>Actuator</code>, <code>Prometheus</code>,{" "}
                  <code>Grafana</code>, <code>Sentry</code>를 붙여 서버 상태와
                  퍼널 지표를 함께 보고, 전화번호와 토큰은 로그 전에
                  마스킹했습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">배치와 검증</span> - 8회권 만료,
                  픽업 만료 같은 커스텀 배치를 유지하면서,{" "}
                  <code>Playwright</code> P8-1, P8-9를 포함한 핵심 시나리오
                  9개와 @UseCaseIT 검증으로 회귀를 확인했습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">문서 기준선</span> - README,
                  PRD, ADR, Idea, Retrospective를 코드와 같이 갱신해 운영 기준이
                  문서 뒤로 밀리지 않게 관리했습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">개발과정</div>
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
                  <div className="process-card__text">
                    {renderTechText(item.summary)}
                  </div>
                  <div className="process-card__docs">
                    {item.docs.map((doc) => (
                      <div className="process-card__doc" key={doc.name}>
                        <span className="process-card__doc-name">
                          {doc.name}
                        </span>
                        <span className="process-card__doc-summary">
                          {" "}
                          : {renderTechText(doc.summary)}
                        </span>
                      </div>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="section">
            <div className="section__title">회고</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  ·{" "}
                  <span className="addr-line">
                    먼저 깔아두면 이후가 빨라진다
                  </span>
                  - 프로필 분리, 기준 스펙, DB migration, CI,{" "}
                  <code>Testcontainers</code> 같은 실행 기반을 먼저 세운 덕분에
                  이후 기능을 붙일 때마다 매번 바닥부터 다시 정리하지 않아도
                  됐습니다. 이 프로젝트를 통해 큰 기능보다 실행 기반을 먼저
                  만드는 편이 오히려 전체 개발 속도를 높인다는 점을 분명히 알게
                  됐습니다.
                </div>
                <div className="project-text">
                  ·{" "}
                  <span className="addr-line">
                    빠른 확장은 나중에 중복 비용을 남긴다
                  </span>
                  - guest 흐름 위에 member와 claim을 덧붙이는 방식은 초기 구현
                  속도는 빨랐지만, 시간이 갈수록 guest, member, claimed를 따로
                  다루는 중복이 커졌습니다. 그래서 이제는 기능을 빨리 붙이는
                  것보다, 공통 고객 모델과 조회 구조를 먼저 잡아두는 편이
                  장기적으로 훨씬 낫다는 점을 알게 됐습니다.
                </div>
                <div className="project-text">
                  ·{" "}
                  <span className="addr-line">
                    운영 기준도 기능과 같이 설계해야 한다
                  </span>
                  - <code>Sentry</code>를 포함한 관측성을 뒤늦게 붙여도 운영
                  시야를 회복할 수는 있었지만, 어떤 지표를 봐야 하는지와 운영
                  조회를 어디서 읽어야 하는지를 나중에 다시 정리하는 비용이
                  컸습니다. 이 경험을 통해 관측성과 조회 경계는 기능 완료 후
                  보강하는 항목이 아니라 처음부터 같이 설계해야 한다는 점을
                  확실히 배웠습니다.
                </div>
              </div>
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

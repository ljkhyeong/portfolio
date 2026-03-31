import "../../css/Project.css";
import { useNavigate } from "react-router-dom";
import { assetPath } from "../../utils/assetPath";

const processData = [
  {
    title: "업무 분석",
    meta: "기관 연계",
    summary:
      "군사경찰, 군검찰, 군교정, 군사법원 사이에서 어떤 사건 상태와 결재 문서가 이동하는지 먼저 모델링했습니다.",
    docs: [
      {
        name: "업무 흐름도",
        summary: "기관별 입력 주체와 승인 주체를 사건 단계별로 정리",
      },
      {
        name: "권한 매트릭스",
        summary: "화면 버튼, 상태 전이, 첨부 열람 권한을 역할 기준으로 분리",
      },
    ],
  },
  {
    title: "도메인 분리",
    meta: "정책 계층",
    summary:
      "복잡한 결재 라인과 보안 규칙을 화면 이벤트에 직접 넣지 않고 상태 전이, 권한, 연계 검증 정책으로 분리했습니다.",
    docs: [
      {
        name: "ApprovalLinePolicy",
        summary: "결재 단계별 진입 가능 조건과 다음 상태 계산 담당",
      },
      {
        name: "DocumentSecurityPolicy",
        summary: "망분리 환경에서 파일 확장자, MIME, 반출 제한 규칙 담당",
      },
    ],
  },
  {
    title: "통합 검증",
    meta: "운영 반영",
    summary:
      "배치, 연계, 첨부, 권한, 결재 시나리오를 기관 조합별로 검증해 운영 반영 시 재현 가능한 절차를 만들었습니다.",
    docs: [
      {
        name: "통합 시나리오",
        summary: "4개 기관, 12개 상태 전이, 3개 배치 경로를 조합해 점검",
      },
      {
        name: "장애 조치 내역",
        summary: "DB 락 경합, 배치 중복 처리, 파일 검증 실패 원인을 추적",
      },
    ],
  },
  {
    title: "운영 안정화",
    meta: "폐쇄망 대응",
    summary:
      "망분리 환경에서 외부 인프라 없이도 정합성과 보안을 보장하기 위해 DB, WAS, 배치 로그를 직접 다루며 운영 기준을 정리했습니다.",
    docs: [
      {
        name: "배치 운영서",
        summary: "야간 배치, 수동 재처리, 장애 복구 절차를 표준화",
      },
      {
        name: "보안 점검표",
        summary: "CSRF, 파일 위변조, 세션, 로그 마스킹 점검 기준을 관리",
      },
    ],
  },
];

const starStories = [
  {
    title: "연계 배치 재처리 중복 반영 방지",
    situation:
      "연계 배치를 재실행하거나 수동 재처리할 때 같은 사건이 중복 반영되며 상태가 꼬일 위험이 있었습니다.",
    task:
      "기존 운영 환경을 유지하면서도 배치가 같은 사건을 두 번 잡지 않게 막고, 재처리 시에도 정합성을 보장해야 했습니다.",
    action:
      "외부 분산 락 대신 DB Named Lock을 도입해 사건 번호 단위 임계 구역을 만들었습니다. 배치가 처리 직전에 락을 먼저 잡고, 이미 다른 배치가 같은 사건을 처리 중이면 건너뛰거나 재시도하도록 설계해 중복 반영을 막았습니다. 락 획득 실패와 재처리 이력은 배치 로그로 남겨 운영자가 바로 추적할 수 있게 했습니다.",
    result:
      "200건 재처리 테스트에서 중복 처리 건수를 7건에서 0건으로 줄였고, 야간 연계 배치에서도 동일 사건 이중 반영 이슈를 제거했습니다. 기존 운영 환경을 크게 흔들지 않으면서 배치 정합성을 지킬 수 있는 방식을 만든 셈입니다.",
  },
  {
    title: "보안 요구사항을 운영 가능한 코드로 정리",
    situation:
      "폐쇄망 시스템이라도 첨부 위변조, CSRF, 세션 탈취 같은 기본 보안은 계속 요구됐고, 특히 공문 첨부는 확장자 위장 파일이 유입될 위험이 있었습니다.",
    task: "보안 기능을 체크리스트 수준이 아니라 업무 흐름을 막지 않는 방식으로 녹여야 했습니다.",
    action:
      "Spring Security 기반 CSRF 토큰을 화면 흐름에 맞게 적용하고, Apache Tika로 MIME과 확장자를 함께 검사하는 업로드 검증 계층을 추가했습니다. 예외 사유를 사용자 메시지와 운영 로그로 각각 나눠 남겨 보안과 운영성을 동시에 챙겼습니다.",
    result:
      "보안 점검에서 재현되던 첨부 우회 업로드 5건을 모두 차단했고, 반려 사유를 로그에서 바로 추적할 수 있어 운영 대응 시간을 평균 30분에서 10분으로 줄였습니다.",
  },
];

const techChoices = [
  {
    title: "MyBatis 선택",
    summary:
      "Tibero 기반의 대형 조회와 기관별 맞춤 SQL가 많아 JPA보다 MyBatis가 초기 적합성이 높았습니다.",
    tradeoff:
      "대신 도메인 규칙까지 mapper XML로 흘러들기 쉬워, 복잡한 결재 규칙은 서비스와 정책 객체로 끌어올려 SQL과 비즈니스 로직을 분리했습니다.",
  },
  {
    title: "eGov + XML 설정 유지",
    summary:
      "고객사 표준과 운영 안정성 때문에 최신 스택으로 교체하기보다 기존 eGov와 XML 설정을 유지하는 선택이 필요했습니다.",
    tradeoff:
      "보일러플레이트와 수동 설정 비용이 크지만, 그 제약 안에서 TransactionTemplate, 공통 인터셉터, 정책 객체를 도입해 유지보수성을 보완했습니다.",
  },
  {
    title: "DB Named Lock",
    summary:
      "연계 배치가 같은 사건을 동시에 처리하지 않게 사건 번호 기준으로 DB Named Lock을 걸었습니다.",
    tradeoff:
      "락 경합과 DB 의존성은 생기지만, 배치 중복 실행과 재처리 꼬임을 막는 데는 가장 단순하고 운영하기 쉬운 방법이었습니다.",
  },
];

const Project4 = () => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate("/project2");
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
        ‹
      </button>
      <div className="container">
        <div className="header">
          <div className="project-title">차세대 군사법 정보 시스템</div>
        </div>
        <div className="details">
          <div className="section">
            <img
              className="rep-image rep-image--narrow"
              src={assetPath("mnd.webp")}
              alt="차세대 군사법 정보 시스템 대표 이미지"
            />
          </div>
          <div className="section">
            <div className="section__title">📖 내용</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 국방부 차세대 군사법 정보 시스템에서 군사경찰, 군검찰,
                  군교정, 군사법원을 연결하는 군교정 부문을 담당했습니다.
                </div>
                <div className="project-text">
                  · 이 프로젝트의 핵심은 화면 수가 아니라, 기관별 결재 라인과
                  보안 규칙이 복잡하게 얽힌 업무를 어떻게 유지보수 가능한 코드로
                  바꾸느냐였습니다.
                </div>
                <div className="project-text">
                  · 망분리와 레거시 제약 때문에 최신 인프라를 쉽게 도입할 수
                  없었고, 주어진 eGov, JEUS, Tibero 환경 안에서 문제를 풀어야
                  했습니다.
                </div>
                <div className="project-text">
                  · 저는 연계 배치, 결재 도메인 규칙, 보안 기능, 운영 장애
                  대응까지 맡으면서 공공 시스템에서 기술 부채와 운영 제약을 함께
                  다루는 경험을 쌓았습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__list">
              <div className="section__list-item">
                <div className="left">
                  <div className="section__title">⛏️ 기술스택</div>
                  <div>
                    <span className="addr-line">Frontend</span>
                    <span className="addr"> - WebSquare</span>
                  </div>
                  <div>
                    <span className="addr-line">Backend</span>
                    <span className="addr">
                      {" "}
                      - Java 8, eGov 4.1, MyBatis, Spring Session, XML 설정,
                      JEUS
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Database</span>
                    <span className="addr"> - Tibero</span>
                  </div>
                  <div>
                    <span className="addr-line">Security</span>
                    <span className="addr">
                      {" "}
                      - Spring Security CSRF, Apache Tika
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Infra</span>
                    <span className="addr">
                      {" "}
                      - Jenkins, Nexus, VM 이중화, Putty
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Operations</span>
                    <span className="addr">
                      {" "}
                      - SSH 로그 확인, DB 직접 조회, 배치 로그 점검
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
                  · 군사경찰, 군검찰, 군사법원에서 군교정으로 들어오는 연계 배치
                  3종을 구현하고 운영 반영했습니다.
                </div>
                <div className="project-text">
                  · 복잡한 결재 라인과 상태 전이를 mapper XML이 아닌 정책 객체와
                  서비스 계층으로 분리해 유지보수 포인트를 줄였습니다.
                </div>
                <div className="project-text">
                  · Spring Security CSRF와 Apache Tika 기반 파일 검증을 붙여
                  공문 첨부와 입력 흐름의 보안 수준을 높였습니다.
                </div>
                <div className="project-text">
                  · 운영 단계에서는 SSH 로그, 배치 상태, DB 데이터 정합성을 직접
                  확인하며 장애 대응까지 맡았습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">📚 개발과정</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 공공 프로젝트답게 요구사항과 산출물은 waterfall 방식으로
                  관리됐지만, 실제 코드 안에서는 결재 규칙과 보안 규칙을 객체로
                  분리해 변경 비용을 줄이는 방향을 택했습니다.
                </div>
              </div>
            </div>
            <div className="process-grid">
              {processData.map((card) => (
                <div className="process-card" key={card.title}>
                  <div className="process-card__title">{card.title}</div>
                  <div className="process-card__meta">{card.meta}</div>
                  <div className="process-card__text">{card.summary}</div>
                  <div className="process-card__docs">
                    {card.docs.map((doc) => (
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
                </div>
              ))}
            </div>
          </div>
          <div className="section">
            <div className="section__title">📌 배운 점</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 레거시 환경에서는 최신 프레임워크의 편의 기능보다, 왜 도메인
                  규칙을 SQL과 화면에서 분리해야 하는지가 더 선명하게
                  보였습니다.
                </div>
                <div className="project-text">
                  · 특히 악조건이라고 해서 설계를 포기하는 것이 아니라, 망분리와
                  레거시라는 제약을 전제로도 가장 실용적인 구조를 만드는 태도가
                  중요하다는 점을 배웠습니다.
                </div>
                <div className="project-text">
                  · 이후에는 새로운 기술을 도입할 때도 기능 나열보다 trade-off를
                  먼저 따지고, 도입 불가능한 환경에서는 대체 수단으로 같은
                  목표를 달성할 수 있는지부터 검토하게 됐습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default Project4;

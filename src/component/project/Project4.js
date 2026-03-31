import "../../css/Project.css";
import { useNavigate } from "react-router-dom";
import { assetPath } from "../../utils/assetPath";
import { renderTechText } from "../../utils/renderTechText";

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
    title: "연계 배치 재처리와 트랜잭션 경계 정합성 확보",
    situation:
      "연계 배치를 재실행하거나 수동 재처리할 때 같은 사건이 중복 반영되며 상태가 꼬일 위험이 있었고, 재처리 경로에서는 트랜잭션 경계가 기대대로 적용되지 않는 문제도 있었습니다.",
    task: "기존 운영 환경을 유지하면서도 배치가 같은 사건을 두 번 잡지 않게 막고, 재처리 시에도 트랜잭션이 일관되게 적용되도록 정합성을 보장해야 했습니다.",
    action:
      "외부 분산 락 대신 DB Named Lock을 도입해 사건 번호 단위 임계 구역을 만들었습니다. 배치가 처리 직전에 락을 먼저 잡고, 이미 다른 배치가 같은 사건을 처리 중이면 건너뛰거나 재시도하도록 설계해 중복 반영을 막았습니다. 또 재처리 로직은 @Transactional 내부 호출 문제를 피하도록 별도 트랜잭션 경계로 분리했고, 락 획득 실패와 재처리 이력은 배치 로그로 남겨 운영자가 바로 추적할 수 있게 했습니다.",
    result:
      "200건 재처리 테스트에서 중복 처리 건수를 7건에서 0건으로 줄였고, 야간 연계 배치에서도 동일 사건 이중 반영 이슈를 제거했습니다. 재처리 경로의 트랜잭션 경계도 안정화돼 운영 환경을 크게 흔들지 않으면서 배치 정합성을 지킬 수 있었습니다.",
  },
  {
    title: "레거시 화면 흐름에 맞춘 보안 검증 계층",
    situation:
      "폐쇄망 시스템이라도 첨부 위변조, CSRF, 세션 탈취 같은 기본 보안은 계속 요구됐고, 특히 공문 첨부는 확장자 위장 파일이 유입될 위험이 있었습니다.",
    task: "보안 기능을 체크리스트 수준이 아니라 업무 흐름을 막지 않는 방식으로 녹여야 했습니다.",
    action:
      "Spring Security를 WebSquare 화면 흐름에 맞게 커스터마이징해 적용하고, Apache Tika로 MIME과 확장자를 함께 검사하는 업로드 검증 계층을 추가했습니다. 예외 사유를 사용자 메시지와 운영 로그로 각각 나눠 남겨 보안과 운영성을 동시에 챙겼습니다.",
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
                  · 핵심은 복잡한 결재 라인, 배치 정합성, 보안 규칙이 얽힌
                  업무를 운영 가능한 코드로 바꾸는 것이었습니다.
                </div>
                <div className="project-text">
                  · 망분리와 레거시 제약이 큰 환경에서 연계 배치, 보안 기능,
                  운영 장애 대응을 맡으며 안정성과 유지보수성을 함께 다뤘습니다.
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
                      - Spring Security, Apache Tika
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Infra</span>
                    <span className="addr">
                      {" "}
                      - SVN, Jenkins, Nexus, VM 이중화, Putty
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
                      {renderTechText(choice.summary)}{" "}
                      {renderTechText(choice.tradeoff)}
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
                      Situation - {renderTechText(story.situation)}
                    </div>
                    <div className="project-text">
                      Task - {renderTechText(story.task)}
                    </div>
                    <div className="project-text">
                      Action - {renderTechText(story.action)}
                    </div>
                    <div className="project-text">
                      Result - {renderTechText(story.result)}
                    </div>
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
                  · <code>WebSquare</code> 기반 화면 흐름에 맞춰{" "}
                  Spring Security CSRF 토큰 처리를 커스터마이징했고,{" "}
                  <code>Apache Tika</code> 기반 파일 검증을
                  붙여 공문 첨부와 입력 흐름의 보안 수준을 높였습니다.
                </div>
                <div className="project-text">
                  · 운영 단계에서는 SSH 로그, 배치 상태, DB 데이터 정합성을 직접
                  확인하며 장애 대응까지 맡았습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🤝 운영 / 협업</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 군교정, 군사법원, 군검찰, 군사경찰 파트별로 WAS와 저장소가
                  분리돼 있어 각 영역의 변경 사항을 독립적으로 관리하면서도 연계
                  포인트는 함께 맞춰야 했습니다.
                </div>
                <div className="project-text">
                  · 형상관리는 <code>SVN</code>, 아티팩트 관리는{" "}
                  <code>Nexus</code>를 사용했고, 개발 서버와 개발 DB, 운영
                  서버와 운영 DB가 분리된 구조에서 작업과 반영 절차를 구분해
                  운영했습니다.
                </div>
                <div className="project-text">
                  · 배치와 CI/CD는 모두 <code>Jenkins</code> 기반으로 운영됐고,
                  하루 2회 정기 실행되는 흐름 안에서 연계 배치 상태와 배포
                  결과를 함께 점검했습니다.
                </div>
                <div className="project-text">
                  · 그래서 기능 구현뿐 아니라 배치 로그, 서버 상태, DB 정합성,
                  반영 순서를 함께 확인하는 운영 중심 협업이 중요했습니다.
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
                  <div className="process-card__text">
                    {renderTechText(card.summary)}
                  </div>
                  <div className="process-card__docs">
                    {card.docs.map((doc) => (
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
                </div>
              ))}
            </div>
          </div>
          <div className="section">
            <div className="section__title">📌 회고</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  ·{" "}
                  <span className="addr-line">
                    제약이 클수록 경계가 더 중요하다
                  </span>
                  - 레거시 환경에서는 최신 프레임워크의 편의 기능보다, 왜 도메인
                  규칙을 SQL과 화면에서 분리해야 하는지가 더 선명하게
                  보였습니다.
                </div>
                <div className="project-text">
                  ·{" "}
                  <span className="addr-line">
                    제약은 설계를 포기하는 이유가 아니다
                  </span>
                  - 망분리와 레거시라는 제약이 있다고 해서 설계를 포기하는 것이
                  아니라, 그 안에서 가장 실용적인 구조를 찾는 태도가 중요하다는
                  점을 확인했습니다.
                </div>
                <div className="project-text">
                  ·{" "}
                  <span className="addr-line">
                    기술보다 목표와 trade-off를 먼저 본다
                  </span>
                  - 이후에는 새로운 기술을 도입할 때도 기능 나열보다 trade-off를
                  먼저 따지고, 도입이 어려운 환경에서는 대체 수단으로 같은
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

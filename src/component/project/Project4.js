import "../../css/Project.css";
import { useNavigate } from "react-router-dom";

const processData = [
  {
    title: "분석 / 설계",
    meta: "Waterfall 1",
    summary:
      "요구사항과 기관별 업무 흐름을 먼저 정리하고, 화면/데이터/연계 기준을 확정한 뒤 개발 범위를 나눴습니다.",
    docs: [
      {
        name: "요구사항 정의서",
        summary: "군교정 업무와 기관 간 연계 항목을 화면 단위로 정리",
      },
      {
        name: "화면설계서",
        summary: "입력/조회 흐름과 기관별 화면 구성을 사전에 고정",
      },
    ],
  },
  {
    title: "개발",
    meta: "Waterfall 2",
    summary:
      "확정된 설계서를 기준으로 CRUD 기능, 기관 간 연계 처리, 배치와 보안 기능을 순차적으로 구현했습니다.",
    docs: [
      {
        name: "프로그램 명세",
        summary: "기능별 처리 흐름과 입력/출력 기준을 구현 단위로 관리",
      },
      {
        name: "SQL / 배치 명세",
        summary: "데이터 중심 구조에 맞춰 조회와 연계 로직을 구체화",
      },
    ],
  },
  {
    title: "테스트 / 반영",
    meta: "Waterfall 3",
    summary:
      "개발 후에는 단위 확인보다 통합 시나리오와 데이터 정합성 점검이 중요해서, 기관 간 흐름과 배치 결과를 중심으로 검증했습니다.",
    docs: [
      {
        name: "통합 테스트 시나리오",
        summary: "문서 송수신, 상태 연계, 배치 결과를 중심으로 검증",
      },
      {
        name: "결함 조치 내역",
        summary: "운영 반영 전 수정 이력과 영향 범위를 추적",
      },
    ],
  },
  {
    title: "운영 인수 / 유지보수",
    meta: "Waterfall 4",
    summary:
      "반영 이후에는 산출물과 이행 내역을 정리하고, 로그·DB·배치 상태를 확인하며 운영 이슈에 대응했습니다.",
    docs: [
      {
        name: "산출물 패키지",
        summary: "HWP, Excel 중심 문서를 기준으로 변경 사항을 정리",
      },
      {
        name: "운영 점검 내역",
        summary: "배치, 데이터, 장애 대응 결과를 폐쇄망 환경에서 관리",
      },
    ],
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
            <div className="section__title">📖 내용</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 국방부 주관 차세대 군사법 정보 시스템에서 군사경찰,
                  군검찰, 군교정, 군사법원 연계 업무시스템 중 군교정 부문을
                  맡았습니다.
                </div>
                <div className="project-text">
                  · 폐쇄망과 레거시 중심 환경에서 빠른 기능 추가와 안정적인
                  운영이 우선되는 공공 업무 시스템이었습니다.
                </div>
                <div className="project-text">
                  · 2024.06.23부터 2026.01.30까지 참여하며 CRUD 위주 업무
                  기능이 많은 폐쇄망 공공 시스템에서 기관 간 연계와 운영을
                  경험했습니다.
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
                    <span className="addr-line">Language</span>
                    <span className="addr"> - Java 8, XML</span>
                  </div>
                  <div>
                    <span className="addr-line">Frontend</span>
                    <span className="addr"> - WebSquare</span>
                  </div>
                  <div>
                    <span className="addr-line">Backend</span>
                    <span className="addr">
                      {" "}
                      - eGov 4.1, MyBatis, Spring Session
                    </span>
                  </div>
                  <div>
                    <span className="addr-line">Database / WAS</span>
                    <span className="addr"> - Tibero, JEUS</span>
                  </div>
                  <div>
                    <span className="addr-line">Infra / Quality</span>
                    <span className="addr">
                      {" "}
                      - Jenkins, Maven, Nexus, VM 이중화, Putty
                    </span>
                  </div>
                </div>
                <div className="right">
                  <div className="section__title">🖥️ 구현된 기능</div>
                  <div className="project-text">
                    · <span className="addr-line">문서 송수신</span> - 기관 간
                    공문과 사건 관련 문서를 등록, 전달, 조회하는 업무 흐름 지원
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">기관 간 연계 업무</span> -
                    조사현황, 피의자 상태, 사건 진행 정보가 군사경찰, 군검찰,
                    군교정, 군사법원 사이에서 이어지도록 처리
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">기관별 핵심 업무</span> -
                    영장, 수용, 판결, 소환, 기록 관리 등 각 기관에 필요한 화면과
                    처리 기능 제공
                  </div>
                  <div className="project-text">
                    · <span className="addr-line">배치 연계</span> - 기관 간
                    데이터를 주기적으로 동기화하는 연계 배치와 후속 처리 흐름
                    제공
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🙋‍♂️ 내 역할</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 데이터 중심 아키텍처와 레거시 코드 위에서 CRUD 위주 업무
                  기능을 개발했습니다.
                </div>
                <div className="project-text">
                  · Jenkins를 이용해 군사경찰 → 군교정, 군사법원 → 군교정,
                  군검찰 → 군교정 연계 배치를 구현했습니다.
                </div>
                <div className="project-text">
                  · Spring Security 기반 CSRF 토큰 기능과 Apache Tika 기반
                  파일 위변조 업로드 방지 기능을 구현했습니다.
                </div>
                <div className="project-text">
                  · HWP, Excel 중심의 공공 프로젝트 산출물과 변경 내역을
                  관리했습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">🤝 운영 / 협업</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · <span className="addr-line">폐쇄망 운영</span> - Nexus와
                  Maven으로 라이브러리를 관리하고, Jenkins 파이프라인으로 배포를
                  운영했습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">인프라 운영</span> - VM 기반
                  WAS/DB 이중화 환경에서 로그, 배치, 데이터 상태를 직접
                  점검했습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">산출물 관리</span> - HWP,
                  Excel 중심의 공공 프로젝트 산출물을 관리했습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">운영 지원</span> - SSH 로그
                  확인, DB 직접 쿼리 점검, 장애 상황 데이터 확인 대응을
                  수행했습니다.
                </div>
                <div className="project-text">
                  · <span className="addr-line">팀 적응</span> - 기존 AA와
                  컨벤션을 우선 존중하면서, 위험도가 큰 유지보수 이슈나 취약점은
                  선별적으로 공유했습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">📚 개발과정</div>
            <div className="section__list">
              <div className="section__list-item">
                <div className="project-text">
                  · 공공 프로젝트 특성상 요구사항과 설계를 먼저 확정하고, 그
                  결과를 기준으로 개발과 테스트, 운영 반영으로 넘어가는
                  waterfall 방식으로 진행했습니다.
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
                  · 레거시 환경에서는 최신 스프링이 자동으로 감춰주는 편의
                  기능이 부족해서, 기능 하나를 만들더라도 요청 처리, 파일
                  응답, 트랜잭션, 예외 흐름을 더 낮은 레벨에서 이해해야
                  했습니다.
                </div>
                <div className="project-text">
                  · 예를 들어 `ResourceHttpMessageConverter`가 없어
                  `Resource`를 활용한 표준 방식 대신 파일 업로드/다운로드
                  흐름을 직접 구성하면서, multipart 처리와 응답 스트림 제어를
                  더 구체적으로 이해하게 됐습니다.
                </div>
                <div className="project-text">
                  · 또 프로젝트 구조상 별도 클래스를 쉽게 추가하기 어려워
                  `@Transactional` 전파 속성에 기대기 힘든 경우가 있었고,
                  `TransactionTemplate`과 `TransactionManager`로 내부 호출 문제를
                  직접 풀면서 선언형 트랜잭션 뒤에서 실제로 어떤 경계가
                  만들어지는지 체감했습니다.
                </div>
                <div className="project-text">
                  · XML 기반 설정, 수동 빈 등록, 인터셉터/시큐리티 설정,
                  체크 예외 중심의 오류 처리 같은 구조를 다루면서 레거시
                  시스템이 왜 보일러플레이트가 많아지고 유지보수 비용이
                  커지는지도 명확히 배웠습니다.
                </div>
                <div className="project-text">
                  · 그 경험 덕분에 최신 스택의 추상화를 더 정확히 이해하게
                  됐고, 이후에는 단순히 “신식이라서 좋은 것”이 아니라 무엇을
                  줄여주고 어떤 리스크를 없애주는지 설명할 수 있게 됐습니다.
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

# 포트폴리오 문구 검토

검토일: 2026-09-05

## 검토 범위와 판단

현재 저장소의 홈, 경력 및 기술 소개, 프로젝트 상세 8개, BATON 서비스 상세 6개, 도식, 검색 안내, 공유 이미지용 문구와 공개 BATON 요약 문서를 검토했습니다. 인쇄용 페이지가 홈 컴포넌트를 재사용하는 것도 확인했습니다. 배포 사이트와 외부 저장소의 최신 구현은 이번 검토 대상에 포함하지 않았습니다.

수정안 38개와 반복 문장 정리를 모두 반영했습니다. 같은 표현은 홈, 상세, 도식과 검색 문서에도 적용했습니다. 아래 원문은 변경 전 전체 문장 또는 연속된 일부 표현이며, 수정안은 기존 기능과 검증 범위를 기준으로 작성했습니다. 문맥에 따라 조사와 문장 길이를 조정했습니다.

가장 먼저 정리할 부분은 BATON의 자체 용어, 청년정책메이트의 구현 설명, IntentTrace의 기록 및 공개 설명입니다. 전자영장, 군사법과 WebRTC는 문제와 처리 방법이 비교적 구체적이며 일부 긴 문장만 줄이면 됩니다.

## 홈과 공통 소개

| 번호 | 변경 전 표현 | 수정안 | 이유 및 위치 |
| --- | --- | --- | --- |
| 1 | 중복 실행 방지와 중단 후 재처리 등 안정적인 설계를 추구하는 백엔드 개발자입니다. | 중복 실행을 막고 중단된 작업을 재처리하는 백엔드 개발자입니다. | `등`, `안정적인 설계`, `추구하는`을 줄이고 구현한 동작을 앞세웁니다. [홈 소개](/Users/lim/devProject/personal/portfolio/src/data/homeHero.js:2) |
| 2 | 오늘 할 일, 조직 연속성, 통합 검색과 바통북 구현 | 할 일 관리, 담당자 공백 및 업무 지연 확인, 통합 검색, 인수인계 문서 생성 | 처음 보는 사람도 기능을 알 수 있도록 자체 명칭을 풀어 씁니다. [BATON 홈 카드](/Users/lim/devProject/personal/portfolio/src/data/projectSummaries.js:12) |
| 3 | 완료되지 않은 작업만 이어서 실행 | 재처리 가능한 미완료 작업 실행 | 모든 미완료 작업을 자동 재실행하는 것처럼 보일 수 있습니다. RELAY의 결과 미확인 전송은 자동 재전송하지 않는다는 설명과 맞춥니다. [홈 처리 흐름](/Users/lim/devProject/personal/portfolio/src/data/homeHero.js:25) |
| 4 | 요청 변환부터 제출 자료 반영까지 담당 범위를 분리해 처리합니다. | 기관별 요청 변환과 제출 자료 반영을 구현했습니다. | 무엇을 분리했다는 것인지 모호합니다. 이 위치에서는 담당 업무만 적어도 충분합니다. [전자영장 홈 도식](/Users/lim/devProject/personal/portfolio/src/component/Projects.jsx:147) |
| 5 | 변경할 수 없는 객체 설계 | 불변 객체 설계 | 실무에서 쓰는 용어가 더 짧고 정확합니다. [학습 소개](/Users/lim/devProject/personal/portfolio/src/data/profile.js:59) |

## BATON과 서비스 상세

| 번호 | 변경 전 표현 | 수정안 | 이유 및 위치 |
| --- | --- | --- | --- |
| 6 | 조직 연속성 | 담당자 공백 및 업무 지연 | 추상적인 목적 대신 화면에서 확인하는 내용을 적습니다. 제품 화면의 고유 메뉴명을 설명해야 할 때만 원래 이름을 병기합니다. [화면 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:23) |
| 7 | 운영 회차, 미완료 루틴과 수락 대기 바통을 확인하는 화면 검증용 데이터 | 업무 회차, 미완료 반복 업무, 수락 대기 인수인계 화면(테스트 데이터) | `루틴`, `바통`을 업무 용어로 바꾸고 화면 설명과 데이터 출처를 구분합니다. [화면 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:15) |
| 8 | 바통북 | 인수인계 문서(바통북) | 문서의 용도를 먼저 알려 줍니다. [화면 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:41) |
| 9 | 새 시도로 회수 | 기존 시도를 종료하고 새 점검 실행 | `회수`만으로는 점검을 다시 실행한다는 동작이 드러나지 않습니다. 도식에는 `새 점검 실행`으로 줄일 수 있습니다. [WATCH 도식](/Users/lim/devProject/personal/portfolio/src/component/project/diagrams/BatonServiceFlowDiagram.jsx:66) |
| 10 | 결과 미확인 조정 원장 | 전송 결과 수동 확정 이력 | 조정하는 대상과 운영자의 작업을 명확히 합니다. [RELAY 검증 설명](/Users/lim/devProject/personal/portfolio/src/data/batonServicePresentation.js:83) |
| 11 | Core가 판정한 5개 운영 신호를 현재 관심 항목과 주간 보고서에 반영합니다. | Core가 확인한 담당자 공백, 업무 지연 등 5개 문제를 점검 목록과 주간 보고서에 반영합니다. | `운영 신호`, `관심 항목`의 실제 대상을 알려 줍니다. 상세 문서에는 5개 판정 항목을 유지합니다. [BRIEF 소개](/Users/lim/devProject/personal/portfolio/src/data/projects.js:360) |
| 12 | ACTIVE 또는 RESOLVED 관심 항목 | 미해결(ACTIVE) 또는 해결됨(RESOLVED) 상태의 점검 항목 | 코드의 상태값과 사용자에게 보이는 뜻을 연결합니다. [BRIEF 처리 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:363) |
| 13 | 에디션 생성 | 주간 보고서 발행 | 같은 결과물을 `보고서`와 `에디션`으로 다르게 부르지 않습니다. [BRIEF 연동 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:700) |
| 14 | Core가 확정한 일정의 전체 현재 값 및 개정 번호와 구독 생성, 회전 및 폐기 요청 | Core 일정의 최신 전체 데이터와 개정 번호, 구독 생성, 토큰 교체 및 구독 폐기 요청 | `전체 현재 값`을 자연스럽게 고치고 교체 및 폐기 대상을 적습니다. [CAL 입력 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:433) |
| 15 | 짧은 RS256 참여권 | 만료 시간이 짧은 RS256 입장 토큰 | `짧은`이 문자열 길이가 아니라 유효 기간이라는 점을 명확히 합니다. [ROUND 입력 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:480) |
| 16 | 안정 계약 1.0.0 / 후보 계약 1.1.0-rc.1 | 정식 JSON 규격 1.0.0 / 릴리스 후보 JSON 규격 1.1.0-rc.1 | 무엇의 버전인지 제목에서 알 수 있게 합니다. 릴리스 후보를 정식 배포 완료로 표현하지 않습니다. [CAL 공개 범위](/Users/lim/devProject/personal/portfolio/src/data/projects.js:440) |

## happyGallery

| 번호 | 변경 전 표현 | 수정안 | 이유 및 위치 |
| --- | --- | --- | --- |
| 17 | E2E 인공 응답 | E2E 테스트용 모의 API 응답 | `인공 응답`보다 실제 테스트 방식을 잘 설명합니다. 실제 PG 및 네이버 계정 연동 여부는 별도 문장으로 유지합니다. [화면 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:824) |
| 18 | 전화번호와 주소 암호화 및 정확 검색 | 전화번호 및 주소 암호화와 전화번호 일치 검색 | `정확`이라는 평가 대신 지원하는 검색 방식을 적습니다. 부분 검색을 지원하지 않는다는 설명은 유지합니다. [개인정보 처리 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1095) |
| 19 | 채널 판매를 반영하기 전에 내부 절대 재고를 보내면 판매 수량이 되돌아갑니다. | 스마트스토어 판매분을 반영하기 전에 자사몰 재고 수량을 보내면, 이미 판매된 수량이 재고에 다시 잡힐 수 있습니다. | `내부 절대 재고`, `판매 수량이 되돌아감`보다 어떤 데이터가 잘못되는지 분명합니다. [재고 동기화 문제](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1180) |
| 20 | 예약 시간을 매번 만들면 반복 입력이 늘지만, 시간 행을 없애면 예약 참조와 동시성 제어가 어려웠습니다. | 예약 슬롯을 매번 등록하는 수고를 줄이면서, 기존 예약의 참조와 동시성 제어는 유지해야 했습니다. | 시간 값과 DB 행을 섞어 부르는 대신 `예약 슬롯`으로 통일합니다. [예약 회차 생성](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1157) |
| 21 | 8회권 환불 시 예약, 크레딧과 원장 일치 | 8회권 환불 시 예약 취소와 이용 횟수 및 사용 이력 반영 | 독자가 크레딧과 원장의 의미를 추측하지 않도록 처리 내용을 적습니다. 상세에는 횟수 계산과 환불 완료 전 상태를 유지합니다. [이용권 환불 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1119) |
| 22 | 빈자리 알림과 다인 예약 부분취소의 정원 일치 | 예약 부분취소 시 환불액 및 잔여석 반영과 빈자리 알림 | 실제 갱신 대상이 수업 정원인지 잔여석인지 구분합니다. [부분취소 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1202) |

## 청년정책메이트

| 번호 | 변경 전 표현 | 수정안 | 이유 및 위치 |
| --- | --- | --- | --- |
| 23 | 조건에 맞는 청년 정책의 판단 근거와 신청 일정을 관리하는 웹앱입니다. | 청년 정책의 신청 자격과 판단 근거, 신청 일정을 확인하는 웹앱을 개발합니다. | 무엇을 판단하는지 명시하고 개발 중이라는 현재 상태를 유지합니다. [상세 소개](/Users/lim/devProject/personal/portfolio/src/data/caseHighlights.js:4) |
| 24 | 개발 전용 고정 인공 자료 | 개발용 고정 테스트 데이터 | 테스트 목적은 유지하면서 겹치는 수식어를 줄입니다. 실제 정책 추천 및 알림 발송 결과가 아니라는 설명은 남깁니다. [자격 화면 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1281) |
| 25 | 기간 의미를 보존하고 확인되지 않은 마감일은 만들지 않음 | 날짜 마감과 시각 마감을 구분하고, 미확인 마감일은 제외 | `의미를 보존`을 실제 비교 규칙과 처리 방식으로 바꿉니다. [마감 처리 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1435) |
| 26 | AI 비용을 호출 전에 예약하고 중단된 확인 작업의 소유권 유지 | AI 호출 예산 예약과 중단 작업 복구 규칙 | 긴 제목은 목적과 구현 대상으로 줄입니다. 본문에서 최대 비용 예약, 결과 미확인과 작업자 교체 규칙을 설명합니다. [AI 처리 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1459) |
| 27 | 복구 임대 갱신과 소유권을 잃은 작업의 늦은 결과 차단 | 복구 작업의 처리 기한을 갱신하고 이전 작업자의 결과는 무시 | `임대`가 작업 처리 권한의 유효 기간이라는 점을 드러냅니다. 기술 상세에서는 최초에 `처리 기한(lease)`으로 설명할 수 있습니다. [복구 문서 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1370) |
| 28 | PostgreSQL 통합 테스트와 공급자 독립 인공 실행기 | PostgreSQL 통합 테스트와 외부 AI 호출을 대체한 모의 실행기 | 실제 AI 공급자 호출을 검증한 것으로 오해하지 않으면서 어색한 번역투를 줄입니다. [AI 검증 방법](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1397) |
| 29 | Next.js 화면과 Spring Boot 업무 모듈을 나누고 서버 DTO에서 TypeScript 계약을 생성합니다. | Next.js와 Spring Boot를 분리하고, 서버 DTO에서 TypeScript API 타입을 생성합니다. | 생성하는 산출물을 `계약` 대신 `API 타입`으로 명확히 합니다. [구조 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1299) |

## IntentTrace와 Hope Commit

| 번호 | 변경 전 표현 | 수정안 | 이유 및 위치 |
| --- | --- | --- | --- |
| 30 | 전체 길이 커밋 ID | 전체 커밋 해시 | 통상적인 Git 용어로 줄입니다. 특정 글자 수는 새로 단정하지 않습니다. [IntentTrace 기록 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1884) |
| 31 | 판단 출처 | 변경 근거와 출처 | 무엇에 대한 판단인지 알려 줍니다. 원문 대화와 내부 추론을 저장하지 않는다는 제한은 유지합니다. [IntentTrace 기록 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1725) |
| 32 | 작성자 확인 뒤 변경되지 않은 코드만 공개 | 작성자 확인 후 코드가 바뀌면 변경 기록 공개 차단 | 공개하는 대상이 코드 자체가 아니라 변경 기록이라는 점을 바로잡습니다. [IntentTrace 검증 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1817) |
| 33 | 공개 경계 | 공개 여부 확인 | 도식의 기능을 나타내는 제목으로 바꿉니다. 실제 판단 규칙과 상태 전이는 유지합니다. [IntentTrace 도식](/Users/lim/devProject/personal/portfolio/src/component/project/diagrams/PortfolioFlowDiagram.jsx:194) |
| 34 | 입력한 커밋과 확정한 비교 기준 사이의 변경만 검토 | 지정한 커밋의 diff만 리뷰 | 제목은 짧게 쓰고 일반, 최초 및 병합 커밋별 비교 기준은 본문에 둡니다. [Hope Commit 문제 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1640) |
| 35 | 리뷰의 파일과 줄 근거 검증 | 리뷰가 참조한 파일과 코드 줄 검증 | `줄 근거`를 자연스럽게 풀어 씁니다. 코드 위치가 유효하다는 것이 리뷰 판단의 정확성을 보장하지 않는다는 제한은 유지합니다. [Hope Commit 검증 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1664) |

## 경력, WebRTC와 검색 안내

| 번호 | 변경 전 표현 | 수정안 | 이유 및 위치 |
| --- | --- | --- | --- |
| 36 | 기관별 자료 수신 여부와 Jenkins 실행 결과, 업무 서버 로그 및 Tibero 처리 상태를 대조해 중단 단계를 찾고, 재처리 후 인적정보와 영장정보가 군교정 DB에 반영되는 것까지 확인했습니다. | 기관별 수신 이력, Jenkins 실행 결과, 서버 로그와 Tibero 상태로 중단 단계를 찾았습니다. 재처리 후 인적정보와 영장정보의 군교정 DB 반영을 확인했습니다. | 장애 원인 확인과 재처리 결과를 두 문장으로 나눕니다. [군사법 검증 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:2117) |
| 37 | WebRTC 실시간 재생과 RTP 출력의 HLS 다시보기 흐름 | WebRTC 실시간 강의와 HLS 다시보기 구조 | 도식 제목의 겹치는 수식어를 줄이고 용도를 앞세웁니다. RTP 변환 과정은 도식 안에 유지합니다. [WebRTC 도식 제목](/Users/lim/devProject/personal/portfolio/src/component/project/ProjectCaseStudy.jsx:340) |
| 38 | 폐쇄망 배치가 중단되면 Jenkins 실행 이력, JEUS 로그와 Tibero 상태에서 어떻게 중단 단계를 찾았나요? | 폐쇄망에서 배치 중단 원인을 어떻게 찾았나요? | 추천 질문은 짧게 제시하고 사용하는 도구는 검색 결과에서 설명합니다. [검색 추천 질문](/Users/lim/devProject/personal/portfolio/src/component/search/PortfolioKnowledgePage.jsx:12) |

## 문구 교체와 함께 줄일 반복

1. **개요, 대표 사례, 검증 결과에서 같은 처리 설명을 반복하지 않습니다.** 개요에는 기능과 담당 업무, 문제 해결에는 선택한 방법, 검증 결과에는 조건과 결과를 둡니다. happyGallery의 결제 및 알림 처리, 군사법의 중단 배치 확인에서 우선 적용할 수 있습니다.
2. **공개 브랜치와 로컬 브랜치 차이는 현재 상태에서 한 번 설명합니다.** `공개 main보다 16개 커밋 앞섬` 등의 정보는 각 사례에 반복하지 않습니다. 검증 시점이 다른 항목은 해당 항목에 버전이나 커밋을 남깁니다.
3. **스크린샷 공통 안내를 묶습니다.** 예: `모의 API 응답으로 확인한 테스트 화면입니다. 실제 결제 및 네이버 계정 연동은 미검증입니다.` 각 캡션에는 `결제수단 선택`, `상품 옵션별 가격과 재고`처럼 기능만 적습니다. 단독 확대 화면에서도 테스트 화면이라는 안내를 볼 수 있게 해야 합니다.
4. **현재 제약과 향후 검토 항목을 구분합니다.** `실제 외부 계정 연동 미검증`, `단일 인스턴스만 지원`은 유지합니다. 기능마다 붙은 장기적인 확장 및 운영 과제는 관련성이 높은 사례에만 둡니다.

## 유지할 표현과 수정 시 주의점

- `트랜잭션`, `멱등 키`, `낙관적 잠금`, `Outbox`, `CSRF`, `Presigned URL`, `WebRTC 시그널링`은 구현을 정확히 설명하는 실무 용어입니다. 전부 쉬운 말로 풀어 쓰면 문장이 더 길어질 수 있습니다.
- `대사`도 결제 및 정산에서 쓰는 용어입니다. 처음 한 번 `외부 처리 내역과 내부 기록을 비교하는 대사`로 설명하고 이후에는 그대로 써도 됩니다.
- `같은 요청 8건에도 링크와 처리 기록 각각 1건`, `외부 API 대기 중 DB 연결 반환`, `서버 중단 후 미전송 알림 재처리`처럼 대상과 동작이 분명한 표현은 유지합니다.
- HLS 지연의 약 35초와 약 17초는 시연 환경의 측정값이라는 조건을 유지합니다. 실제 정책 추천, 외부 계정 연동 또는 장기 운영이 완료된 것처럼 문장을 바꾸지 않습니다.
- 제품 화면의 실제 메뉴명이나 문서 원제는 임의로 바꾸지 않습니다. 포트폴리오 설명에는 기능명을 쓰고 원래 명칭을 괄호에 병기할 수 있습니다.
- 홈과 상세 데이터 외에 도식, 공유 이미지 문구, 검색용 문서와 인쇄 결과도 함께 반영했습니다. 홈 제목은 강조 문구 길이로 나누어 표시하므로 제목과 강조 구간을 함께 수정했습니다.

## 반영 결과와 확인

2026-09-05에 사용자가 승인한 수정안 38개와 반복 문장 정리 4개를 반영했습니다.

- **설명 정리:** 개요는 기능과 담당 업무, 문제 해결은 처리 방법, 검증 결과는 확인한 결과를 중심으로 줄였습니다. 브랜치 차이에 대한 반복 설명과 관련성이 낮은 장기 과제도 정리했습니다.
- **스크린샷 안내:** 공통 테스트 조건을 갤러리 아래에 한 번 표시합니다. 확대 창에서는 이미지별 안내가 있으면 해당 안내를, 없으면 공통 안내를 표시합니다. 모바일에서는 설명 아래에 이동 버튼을 배치했습니다.
- **생성 파일 갱신:** 검색 데이터, 공유 이미지, [포트폴리오 PDF](/Users/lim/devProject/personal/portfolio/public/임정규_포트폴리오.pdf)를 다시 생성했습니다.
- **테스트:** 25개 파일의 테스트 163개가 모두 통과했습니다. 공통 안내와 이미지별 안내가 확대 창에서도 전달되는지 확인하는 테스트를 추가했습니다.
- **빌드:** 프로덕션 빌드와 공유 이미지 및 PDF의 최신 상태 확인이 통과했습니다.
- **화면 확인:** 16개 경로를 데스크톱 1440px과 모바일 390px에서 확인했습니다. 브라우저 오류와 가로 넘침이 없었으며, 홈 제목과 모바일 확대 창의 안내문도 확인했습니다.

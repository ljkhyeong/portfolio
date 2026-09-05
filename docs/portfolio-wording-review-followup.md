# 포트폴리오 문구 추가 검토

검토일: 2026-09-05

검토 기준: `5f1e0b3` 커밋의 포트폴리오 소스와 공개 BATON 요약 문서

## 검토 결과

홈, 프로젝트 상세 8개, BATON 서비스 상세 6개, 도식 및 요약 데이터, 검색 데이터 생성 방식과 공개 BATON 문서를 다시 확인했습니다. 문구 수정 16개, 공통 안내 이동 1개, 조사 오류 1묶음으로 총 18개 항목을 정리했으며 사용자 승인 후 모두 반영했습니다. CAL의 공개 및 연동 상태도 확인해 설명을 맞췄습니다.

아래 원문은 변경 전 전체 문장 또는 연속된 일부 표현입니다. 문맥에 따라 조사와 문장 길이를 조정했으며, 실제 기능과 미구현 및 미검증 범위는 유지했습니다. 홈과 상세 화면의 같은 이미지 설명을 함께 수정하고 검색 데이터와 공유 이미지, PDF도 다시 생성했습니다.

## 의미를 바로잡은 표현

동작을 오해할 수 있어 우선 수정한 항목입니다.

| 번호 | 변경 전 표현 | 수정안 | 이유 및 위치 |
| --- | --- | --- | --- |
| 1 | 미확인 조건과 늦은 결과 차단 | 조건 미확인 안내와 이전 AI 결과 차단 | 본문에서는 미확인 조건을 차단하지 않고 `추가 확인 필요`로 남깁니다. 제목도 이 동작에 맞춰야 합니다. [기술 소개](/Users/lim/devProject/personal/portfolio/src/data/homeSkills.js:55) |
| 2 | 줄인 인원만큼 정원을 반환합니다. | 취소한 인원만큼 잔여석을 늘립니다. | 부분취소로 바뀌는 것은 수업의 최대 정원이 아니라 잔여석입니다. 바로 위 문제 설명의 `환불액과 정원을 함께 맞춰야`도 `취소 인원에 맞춰 환불액과 잔여석을 계산해야`로 맞춥니다. [예약 부분취소](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1204) |
| 3 | 주문 완료는 관리자 확인 전까지 유지되는지 | 관리자 확인 전에는 주문을 완료 처리하지 않는지 | 현재 문장은 관리자 확인 전에 이미 주문 완료 상태인 것처럼 읽힙니다. 앞 문장의 `주문 완료는 관리자가 확정`과 뜻을 맞춥니다. [배송 처리 검증](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1170) |
| 4 | 색상, 각인과 조합별 가격 및 재고 선택 | 색상과 각인 선택, 옵션 조합별 가격 및 재고 확인 | 사용자는 옵션을 선택하고 가격과 재고를 확인합니다. 이미지 대체 설명도 같은 구분을 적용합니다. [상품 옵션 화면](/Users/lim/devProject/personal/portfolio/src/data/projects.js:822) |
| 5 | 결과는 재현할 수 있지만 대상 커밋이 로컬에 있어야 합니다. | 같은 커밋의 변경 내용을 다시 수집하려면 해당 커밋이 로컬에 있어야 합니다. | `결과 재현`은 AI 리뷰 내용까지 항상 같다는 의미로 읽힐 수 있습니다. 실제 설명의 대상인 Git 변경 내용 수집으로 범위를 좁힙니다. [Hope Commit 구조 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1545) |
| 6 | 확인되지 않은 조건과 마감일을 확정하지 않고, 정책 개정과 늦은 AI 결과를 현재 상태에 덮어쓰지 않는 웹앱을 개발합니다. | 확인되지 않은 조건과 마감일은 확정하지 않습니다. 과거 정책 개정과 이전 AI 요청 결과가 최신 데이터를 덮지 않도록 처리하는 웹앱을 개발합니다. | `정책 개정` 전체를 막는 것이 아니라 과거 개정을 제외합니다. AI 결과도 도착 시각만으로 제외하는 것이 아니라 개정과 요청 순번을 비교한다는 설명에 맞춥니다. 이 문장은 화면 첫 소개 대신 검색용 개요에 포함됩니다. [청년정책메이트 검색용 개요](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1412) |

## 용어와 긴 문장 정리

| 번호 | 변경 전 표현 | 수정안 | 이유 및 위치 |
| --- | --- | --- | --- |
| 7 | 동시 예약에도 원장이 일치하는지 | 동시 예약에도 이용 횟수와 사용 이력이 일치하는지 | 지난 수정에서 제목은 바뀌었지만 검증 본문에 `원장`이 남았습니다. 무엇을 비교했는지 적습니다. [8회권 환불 검증](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1123) |
| 8 | 짧은 입장 토큰 | 만료 시간이 짧은 입장 토큰 | 공개 ROUND 문서에는 아직 `짧은`만 남아 있습니다. 웹 상세와 같은 표현으로 맞춥니다. [ROUND 공개 문서](/Users/lim/devProject/personal/portfolio/public/docs/baton/round-realtime-boundary.md:9) |
| 9 | 304 캐시 | ETag와 변경 없음 응답(304) | 캐시와 응답 상태를 뭉뚱그린 표현입니다. 같은 서비스의 처리 결과 설명과 맞춥니다. [CAL 기능 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:429) |
| 10 | 온통청년 원천 매핑 | 온통청년 데이터의 내부 형식 변환 | 원천 데이터의 어떤 처리를 뜻하는지 바로 알 수 있게 합니다. 뒤의 `실제 정책 추천은 아직 연결하지 않았습니다`라는 개발 상태는 유지합니다. [청년정책메이트 구현 범위](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1430) |
| 11 | 기술 책임 분리 / 조건 의미 | 웹, 서버와 DB의 역할 분리 / 자격 판정 기준 | 역할을 나눈 대상과 조건의 용도를 명시합니다. [ADR 소개](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1316), [설계 문서 소개](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1323) |
| 12 | 배포, DB에 남은 URL 점검 및 이벤트 전달 작업을 다른 실행이 이어받는 절차와 공개 스테이징 전송 테스트를 정리합니다. | 배포, 중단 작업 복구와 공개 스테이징 전송 테스트 절차를 정리합니다. | 문서 분류의 한 줄 소개에는 목적만 적습니다. DB에 저장한 작업을 다른 서버가 이어받는 방식은 각 서비스 상세에 남아 있습니다. [BATON Runbook 소개](/Users/lim/devProject/personal/portfolio/src/data/projects.js:74) |
| 13 | 점검 처리 기한이 짧으면 같은 URL 점검이 겹치고, 길면 중단한 서버의 기존 시도를 닫고 새 시도를 만들기까지 늦어집니다. | 처리 기한이 짧으면 중복 점검이 늘고, 길면 중단 작업의 재실행이 늦어집니다. | 처리 단계 설명을 줄이고 기한 설정의 영향을 바로 보여 줍니다. 다음 문장의 대기 및 실패 건수를 보고 기한을 조정한다는 내용은 유지합니다. [WATCH 제약](/Users/lim/devProject/personal/portfolio/src/data/projects.js:295) |
| 14 | BATON 이벤트를 Webhook 및 AWS SQS FIFO 대상으로 전달 | Webhook 및 AWS SQS FIFO 이벤트 전달 | BATON 서비스 목록에 표시되는 기능명입니다. `대상으로`를 줄여도 전달 방식이 드러납니다. [RELAY 기능명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:312) |
| 15 | 메시지 보존과 별도 실패 큐 운영 지점이 늘어 RabbitMQ 모니터링과 재처리 Runbook이 필요합니다. | RabbitMQ 메시지 보관 및 실패 큐 모니터링, 재처리 절차가 필요합니다. | `운영 지점이 늘어` 대신 실제 관리할 대상과 작업을 적습니다. [RELAY 제약](/Users/lim/devProject/personal/portfolio/src/data/projects.js:687) |
| 16 | 사용자가 열어 둔 WebSquare 업무 화면을 악용한 위조 요청이 저장 및 변경 기능을 실행하지 못하도록 Spring Security의 위조 방지 토큰(CSRF)을 모든 상태 변경 요청에 포함해야 했습니다. | 위조 요청으로 WebSquare의 저장 및 변경 기능이 실행되는 것을 막아야 했습니다. 모든 상태 변경 요청에 CSRF 토큰이 필요했습니다. | 문제와 구현 조건을 두 문장으로 나눕니다. Spring Security 적용 방법은 이어지는 해결 설명에서 확인할 수 있습니다. [군사법 CSRF 문제 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:2124) |

## 공통 안내 이동

17. **happyGallery의 대사 설명을 해당 화면으로 옮겼습니다.**

변경 전 공통 안내는 `E2E 테스트용 모의 API 응답으로 확인한 화면입니다. 실제 결제 및 네이버 계정 연동은 미검증입니다. 대사는 외부 처리 내역과 내부 기록을 비교하는 작업입니다.`였습니다.

첫 두 문장은 공통 안내로 유지하고, 스마트스토어 대사 화면의 캡션을 `결과 미확인 주문의 외부 내역 조회와 내부 기록 대조`로 바꿨습니다. 상품 옵션과 결제수단 확대 화면에는 공통 테스트 조건만 표시합니다.

위치: [공통 안내](/Users/lim/devProject/personal/portfolio/src/data/projects.js:816), [대사 화면 캡션](/Users/lim/devProject/personal/portfolio/src/data/projects.js:840)

갤러리 안내와 `visualCaption`이 화면에서 연속으로 중복 출력되는 문제는 없습니다. [상세 화면의 표시 조건](/Users/lim/devProject/personal/portfolio/src/component/project/ProjectCaseStudy.jsx:457)에서 스크린샷이 있는 경우 추가 캡션을 생략하고 있으므로, 중복 출력 수정은 제안에서 제외했습니다.

## 조사 오류

18. **지난 검토에서 놓친 조사 오류 7곳을 수정했습니다.**

| 변경 전 표현 | 수정안 | 발생 수 및 위치 |
| --- | --- | --- |
| 코드 줄를 | 코드 줄을 | 1곳. [Hope Commit 이미지 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1534) |
| 클라이언트 역할를 | 클라이언트 역할을 | 1곳. [IntentTrace ADR 소개](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1741) |
| 주간 보고서은 | 주간 보고서는 | 2곳. [BRIEF 문서 앞부분](/Users/lim/devProject/personal/portfolio/public/docs/baton/brief-event-projection.md:13), [재생성 설명](/Users/lim/devProject/personal/portfolio/public/docs/baton/brief-event-projection.md:20) |
| 주간 보고서을 | 주간 보고서를 | 2곳. [BRIEF 재생성 설명](/Users/lim/devProject/personal/portfolio/public/docs/baton/brief-event-projection.md:20) |
| 최신 전체 데이터과 | 최신 전체 데이터와 | 1곳. [CAL 문서](/Users/lim/devProject/personal/portfolio/public/docs/baton/cal-calendar-contract.md:5) |

## CAL 상태 확인 및 반영

2026년 9월 5일 GitHub 릴리스 API, 포트폴리오가 참조하는 CAL 공개 커밋 `978f0d4`의 릴리스 기록과 로컬 BATON Core의 인수인계 문서를 확인했습니다.

- `1.1.0-rc.1`은 2026년 9월 2일 사전 릴리스로 게시됐습니다. 태그는 `contracts-v1.1.0-rc.1`이며 규격 ZIP도 공개돼 있습니다. [공개 릴리스](https://github.com/ljkhyeong/baton-cal/releases/tag/contracts-v1.1.0-rc.1)
- Core가 규격 ZIP과 요청 형식을 고정하고 실제 CAL 컨테이너와 연동 테스트를 완료한 기록을 확인했습니다. 정식 버전 기준은 `1.0.0`입니다. [공개 커밋의 릴리스 및 연동 기록](https://github.com/ljkhyeong/baton-cal/blob/978f0d4/docs/contract-release-history.md)
- 운영 활성화와 공개 배포는 완료 전이며 실제 캘린더 앱과 운영 환경의 구독 및 전체 일정 재전송은 미검증입니다. [Core 인수인계 문서](/Users/lim/devProject/personal/manager/HANDOFF.md:3)

포트폴리오 상세, 서비스 검증 상태와 CAL 공개 문서에 위 구분을 반영했습니다. 기존 공개 문서의 `미게시 후보`, `공개 릴리스와 Core 적용 전`은 이전 상태를 나타내므로 현재 확인한 내용으로 수정했습니다. CAL과 Core의 코드 및 설정은 변경하지 않았고 해당 서비스의 연동 테스트를 이번 작업에서 다시 실행하지는 않았습니다.

## 반영 후 확인

수정안의 원문, 주변 설명과 실제 표시 조건을 대조했습니다. 조사 오류 7곳과 검토에서 지적한 이전 표현이 본문 및 공개 문서에 남아 있지 않은지 확인했습니다.

- 25개 파일의 테스트 163개 통과
- 프로덕션 빌드, 공유 이미지 및 PDF 최신 상태 확인 통과
- 변경된 10개 경로의 데스크톱 1440px 및 모바일 390px 확인, 가로 넘침과 브라우저 오류 없음
- 상품 옵션 및 스마트스토어 대사 확대 창의 캡션과 공통 테스트 안내 확인
- CAL의 정식 규격, 사전 릴리스와 운영 상태 표시 확인
- 검색 데이터와 공유 이미지, 12쪽 PDF 갱신 및 PDF의 변경 문구 확인

# 포트폴리오 문구 3차 검토

검토일: 2026-09-05

검토 기준: `b1ad6f9` 커밋의 포트폴리오

## 검토 결과

추가 수정안 8개와 이전 수정에서 도식에 남은 표현 1곳을 정리했습니다. 이번에는 도식과 본문의 동작 설명, 성과 측정 기준, 대상이 불분명한 용어를 중심으로 확인했습니다. 검토 문서만 추가했으며 화면 문구와 생성 파일은 변경하지 않았습니다.

## 먼저 수정할 동작 설명

### 1. IntentTrace: 공개 거절과 기존 기록 대체를 구분

- 현재: `이후 코드가 바뀌면 공개 상태를 다시 검사해 기존 기록을 차단하는 흐름입니다.`
- 현재 도식: `공개 후 코드 변경 → 공개 상태 재검증 → 공개 차단`, 결과 상태는 `SUPERSEDED`.
- 설명 수정안: `공개 요청 시 작성자 확인과 코드 상태 일치를 검사합니다. 새 기록으로 대체한 기존 기록에는 대체 상태와 새 기록의 링크를 남깁니다.`
- 도식 수정안: 공개 요청의 코드 상태가 다르면 `공개 거절`로 표시합니다. 별도 흐름으로 `새 기록 공개 → 기존 기록 대체 요청 → 새 기록으로 대체`를 표시합니다.

현재 도식은 공개 후 코드를 계속 감시해 기존 기록을 자동으로 숨기는 기능처럼 읽힙니다. 구현에서는 공개 요청 때 제출된 코드 상태를 비교하고, 공개된 기록의 대체는 별도 요청으로 처리합니다. `SUPERSEDED` 기록도 읽기 권한이 있는 팀원에게 조회되므로 `공개 차단`이나 `기존 기록 무효화`로 표시하면 의미가 달라집니다. 문구와 화살표를 함께 수정해야 합니다.

위치: [도식 설명](/Users/lim/devProject/personal/portfolio/src/component/project/diagrams/PortfolioFlowDiagram.jsx:189), [결과 상태](/Users/lim/devProject/personal/portfolio/src/component/project/diagrams/PortfolioFlowDiagram.jsx:265), [하단 설명](/Users/lim/devProject/personal/portfolio/src/component/project/diagrams/PortfolioFlowDiagram.jsx:286).

확인 근거: IntentTrace 로컬 `0f01cb3`의 [공개 및 대체 조건](/Users/lim/devProject/personal/intent-trace/src/main/kotlin/io/intenttrace/record/domain/ChangeRecord.kt:74), [팀 조회 범위](/Users/lim/devProject/personal/intent-trace/src/main/kotlin/io/intenttrace/record/application/TeamChangeRecordService.kt:76). 포트폴리오에 적힌 `b641831`과 비교해 공개 조건, 대체 조건 및 대체 기록의 팀 조회 규칙이 동일한 것을 확인했습니다.

### 2. 청년정책메이트: 조건 입력 화면과 개발용 판정 API를 구분

- 현재 제목: `조건 입력부터 자격 근거와 일정까지 연결`
- 제목 수정안: `조건 입력 화면과 개발용 자격 및 일정 계산`
- 현재 설명: `비회원 조건과 개발용 정책 예시를 서버 규칙으로 비교하고, 판정 근거와 마감 알림 후보를 웹 화면에 표시합니다.`
- 설명 수정안: `조건 입력값은 화면에서만 확인합니다. 개발용 API는 테스트 정책과 답변으로 자격과 알림 후보를 계산해 결과 화면에 표시합니다.`
- 도식 수정안: `조건 입력 → 입력 내용 확인`은 웹 화면 안에 표시합니다. 별도로 `테스트 정책과 답변 → 서버 계산 → 개발용 결과 화면`을 표시하고, 일반 조건 입력에서 개발 API로 향하는 화살표는 제거합니다. `비회원 세션`은 `화면 입력 상태`로 바꿉니다.

현재 화살표는 일반 조건 입력값을 서버에 보내 판정하는 것처럼 보입니다. 하지만 포트폴리오의 화면 설명과 실제 조건 입력 구현 모두 서버에 보내거나 저장하지 않는다고 명시합니다. 개발용 고정 예시 조회와 별도 테스트 답변 재판정은 일반 조건 입력과 구분해야 합니다.

위치: [구조도 제목과 설명](/Users/lim/devProject/personal/portfolio/src/component/project/diagrams/PortfolioFlowDiagram.jsx:290), [조건 입력 노드](/Users/lim/devProject/personal/portfolio/src/component/project/diagrams/PortfolioFlowDiagram.jsx:310), [조건 화면 안내](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1270).

확인 근거: 청년정책메이트 로컬 `da2d099`의 [조건 입력 처리](/Users/lim/devProject/personal/youth-policy-mate/frontend/src/features/conditions/condition-form.tsx:27), [개발용 고정 예시 조회](/Users/lim/devProject/personal/youth-policy-mate/frontend/src/app/dev/eligibility/server/load-eligibility-examples.ts:6), [개발 API 설명](/Users/lim/devProject/personal/youth-policy-mate/docs/development/eligibility-preview-api.md:3).

### 3. WebRTC/HLS: 재생 시작 대기와 영상 지연을 구분

| 위치 | 현재 표현 | 수정안 |
| --- | --- | --- |
| 공유 이미지 | 실시간 강의와 다시보기를 연결하고 / 재생 시작 대기를 줄였습니다. | 실시간 강의와 다시보기를 제공하고 / HLS 재생 지연을 줄였습니다. |
| 검색 설명 | 재생 시작 시간을 약 35초에서 약 17초로 줄인 | HLS 재생 지연을 약 35초에서 약 17초로 줄인 |
| 교육 이력 | mediasoup RTP를 HLS로 변환하고 재생 지연을 약 35초에서 약 17초로 줄였습니다. | mediasoup RTP를 HLS로 변환했습니다. 팀 시연에서 HLS 재생 지연을 약 35초에서 약 17초로 줄였습니다. |
| 프로젝트 요약 | RTP-HLS 변환 서버와 React 화면을 맡아 재생 지연을 약 35초에서 약 17초로 줄였습니다. | RTP-HLS 변환 서버와 React 화면을 맡았습니다. 팀 시연에서 HLS 재생 지연을 약 35초에서 약 17초로 줄였습니다. |

본문의 측정 대상은 RTP 입력부터 React HLS 재생까지 걸린 시간입니다. `재생 시작 대기`는 재생 버튼을 누른 뒤 첫 화면이 나올 때까지의 대기 시간으로 읽힐 수 있습니다. 측정 대상은 `HLS 재생 지연`으로 맞추고, 독립적으로 읽히는 교육 이력과 요약에도 `팀 시연` 조건을 붙이면 충분합니다. 수치와 기존 측정 한계는 유지합니다.

위치: [공유 이미지](/Users/lim/devProject/personal/portfolio/src/data/projectOg.js:95), [검색 설명](/Users/lim/devProject/personal/portfolio/src/data/routeMeta.js:95), [교육 이력](/Users/lim/devProject/personal/portfolio/src/data/profile.js:18), [프로젝트 요약](/Users/lim/devProject/personal/portfolio/src/data/projectSummaries.js:306).

확인 근거: [포트폴리오의 측정 방법](/Users/lim/devProject/personal/portfolio/src/data/projects.js:2185), [설정 변경 전후 비교](/Users/lim/devProject/personal/portfolio/src/data/projects.js:2220). 이번 검토에서 성능을 다시 측정한 것은 아닙니다.

## 용어와 대상 정리

| 번호 | 현재 표현 | 수정안 | 이유 및 위치 |
| --- | --- | --- | --- |
| 4 | 독립된 코드 분석 | 이전 대화 없이 코드 분석 | 무엇에서 독립됐는지 밝힙니다. 본문 첫 설명은 `이전 대화를 전달하지 않은 별도 AI 분석 결과를 변경 파일과 줄에 연결하고, 수집 범위와 JSON 형식을 검사합니다.`로 바꿉니다. [핵심 사례](/Users/lim/devProject/personal/portfolio/src/data/featuredProblems.js:50), [상세 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1667). Hope Commit의 [분석 작업 지침](/Users/lim/devProject/personal/hope-commit/plugins/hope/skills/commit/SKILL.md:54)에서 이전 대화를 전달하지 않는 규칙을 확인했습니다. |
| 5 | 사설망과 DNS 변경 차단, 이전 결과 미저장 확인 | 사설망 접근과 DNS 재조회 시 IP 변경 차단, 이전 결과 저장 방지 확인 | DNS 설정 변경 자체를 금지하는 기능처럼 읽히지 않도록 차단 조건을 적습니다. [WATCH 결과 요약](/Users/lim/devProject/personal/portfolio/src/data/batonServicePresentation.js:42). 상세 검증에 적힌 DNS 재조회 중 IP 변경 차단과 뜻을 맞춥니다. |
| 6 | 시간대, 취소와 HTTP 캐시를 iCalendar에 반영 | iCalendar 시간대 및 취소 처리와 HTTP 캐시 적용 | HTTP 캐시를 iCalendar 파일의 내용으로 넣는 것처럼 읽히지 않도록 구분합니다. [CAL 문제 해결 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:731). 본문의 UID 및 SEQUENCE 설명과 ETag 및 304 응답 설명은 유지합니다. |
| 7 | 미조회 시 재시도 | 요청 상태가 없으면 재조회 | `미조회`는 조회하지 않았다는 뜻과 조회 결과가 없다는 뜻이 섞입니다. PDF 완료 응답을 받은 뒤 요청 상태가 아직 DB에 없을 때 다시 조회한다는 조건을 적습니다. [전자영장 처리 단계](/Users/lim/devProject/personal/portfolio/src/data/featuredProblems.js:84). |
| 8 | 군사법원, 검찰 및 경찰 | 군사법원, 군검찰 및 군사경찰 | 공유 이미지만 읽어도 대상 기관을 알 수 있도록 본문과 명칭을 맞춥니다. [군사법 공유 이미지](/Users/lim/devProject/personal/portfolio/src/data/projectOg.js:85). |

## 이전 수정에서 도식에 남은 표현

CAL 도식의 `회전 시 이전 토큰 폐기`를 `토큰 교체 시 이전 토큰 폐기`로 맞춥니다. 새로운 용어 변경 제안이 아니라, 1차 검토에서 승인한 `토큰 교체` 표기를 상세 도식에도 적용하는 항목입니다.

위치: [CAL 구독 토큰 설명](/Users/lim/devProject/personal/portfolio/src/component/project/diagrams/BatonServiceFlowDiagram.jsx:169). 이 도식은 서비스 상세 페이지에서 실제 사용됩니다. 암호화 문서의 `키 회전`까지 일괄 치환하지 않습니다.

## 확인 범위

- 이번 검토는 소스의 화면 표시 경로와 문구를 읽고 대조한 결과입니다. 브라우저 검사와 테스트 및 빌드는 실행하지 않았습니다.
- IntentTrace와 청년정책메이트의 관련 구현은 읽기만 했으며, 위 근거 파일에 미커밋 변경이 없는 것을 확인했습니다. 다른 저장소의 신규 기능이나 공개 상태를 포트폴리오에 추가하는 검토는 하지 않았습니다.
- 실제 반영 시 도식의 제목, 본문, 하단 설명과 대체 설명을 함께 맞추고, 검색 데이터와 공유 이미지 및 PDF를 다시 생성해야 합니다.

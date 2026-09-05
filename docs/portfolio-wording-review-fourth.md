# 포트폴리오 문구 4차 검토

검토일: 2026-09-05

검토 기준: `ff37d75` 커밋. 이전 검토 및 반영 커밋 6개를 `origin/main`에 푸시한 뒤 검토했습니다.

## 검토 결과

추가 수정안 5개를 정리했습니다. 이번에는 짧은 요약에서 빠진 처리 조건과 대상, 본문보다 모호해진 용어를 확인했습니다. 화면 소스와 생성 파일은 수정하지 않았습니다.

### 1. CAL: 304 응답의 요청 조건을 명시

- 현재: `일정이 같으면 ETag로 304를 반환`
- 수정안: `조건부 요청의 ETag 또는 수정 시각을 검사해 캐시가 유효하면 304를 반환합니다. 그 외에는 .ics 본문을 반환합니다.`
- 도식 제목: `최신 일정만 반영하고 변경 없으면 304 응답` → `캐시가 유효한 조건부 요청에 304 응답`
- 축약 도식의 결과 구분: `내용 변경 / 변경 없음` → `본문 필요 / 캐시 유효`. 각각 `200 및 .ics 본문 / 304 응답`으로 표시합니다.

현재 표현은 서버의 일정이 바뀌지 않았다는 이유만으로 첫 요청에도 304를 보내는 것처럼 읽힐 수 있습니다. 실제 구현은 `If-None-Match` 또는 `If-Modified-Since`를 확인합니다. 같은 일정이라도 캐시 검증 헤더가 없으면 본문을 반환하는 테스트가 있습니다. 개정 번호와 토큰 처리 설명은 유지합니다.

위치: [CAL 도식 설명](/Users/lim/devProject/personal/portfolio/src/data/batonServicePresentation.js:165), [CAL 캐시 처리 본문](/Users/lim/devProject/personal/portfolio/src/data/projects.js:735).

근거: [캐시 검증 헤더와 응답 처리](/Users/lim/devProject/personal/baton-cal/src/main/kotlin/io/baton/cal/web/PublicCalendarController.kt:56), [동일한 빈 피드의 200 및 304 응답 테스트](/Users/lim/devProject/personal/baton-cal/src/test/kotlin/io/baton/cal/web/PublicCalendarContractTest.kt:66).

### 2. happyGallery: 재고 차이의 비교 대상을 명시

- 현재: `주문별 재고 차이 반영`
- 수정안: `주문별 수량 변경분만 재고에 반영`
- 본문 설명이 필요한 곳: `이미 반영한 수량과 이번에 반영할 수량의 차이만 재고에 적용합니다.`

현재 요약은 자사몰 재고와 스마트스토어 재고를 단순 비교한다는 뜻으로도 읽힙니다. 본문에 적힌 방식은 주문별로 이미 적용한 수량과 현재 목표 수량의 차이를 계산하는 것입니다. 요약에도 주문 수량의 변경분이라는 대상을 남기는 편이 명확합니다.

위치: [검증 결과 요약](/Users/lim/devProject/personal/portfolio/src/data/evidencePresentation.js:39), [프로젝트 요약 데이터](/Users/lim/devProject/personal/portfolio/src/data/projectSummaries.js:126).

근거: [주문별 적용 수량과 현재 목표 수량 비교](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1182).

### 3. happyGallery: 문의 처리와 주문 상태 갱신을 구분

- 현재: `외부 상태로 문의 및 주문 명령 확정`
- 수정안: `문의 조회 및 답변, 수집한 변경 주문으로 주문 상태 갱신`
- 본문 수정안: `문의는 네이버 API로 조회하고 답변합니다. 주문 상태는 변경 주문 수집 결과로 갱신합니다.`

현재 문구는 어떤 작업을 확정하는지 불분명하고, 문의와 주문이 같은 상태 갱신 방식을 사용하는 것처럼 읽힙니다. 설계 문서는 문의를 API 조회 및 답변으로 제공하고, 주문 상태는 외부 호출의 성공 응답만으로 추정하지 않고 다음 변경 주문 수집 결과로 반영한다고 구분합니다. 실제 네이버 계정 연동이 미검증이라는 조건은 유지합니다.

위치: [검증 결과 요약](/Users/lim/devProject/personal/portfolio/src/data/evidencePresentation.js:39), [검증 결과 원문](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1001).

근거: [외부 명령과 상태 확정의 구분](/Users/lim/devProject/personal/happyGallery/docs/ADR/0048_스마트스토어_주문_운영_연동/adr.md:18), [문의 조회 및 답변 방식](/Users/lim/devProject/personal/happyGallery/docs/ADR/0048_스마트스토어_주문_운영_연동/adr.md:37).

2번과 3번을 함께 반영한 검증 요약: `주문별 수량 변경분 반영, 문의 조회 및 답변, 수집한 변경 주문으로 상태 갱신, 미처리 날짜부터 정산 재개`

### 4. ROUND: 전체 미디어 대신 확인한 기능을 표시

- 현재: `Chromium 전체 미디어`
- 수정안: `Chromium 카메라 및 마이크 제어와 화면 공유 테스트`
- 함께 수정: `모바일 배치 시나리오` → `모바일 화면 배치 시나리오`

`전체 미디어`만으로는 검증한 기능을 알기 어렵습니다. 포트폴리오에 적힌 `7c9218c`의 테스트에서 카메라 및 마이크 켜기와 끄기, 장치 변경과 화면 공유를 확인했으므로 기능 이름으로 적습니다. `모바일 배치`도 화면 배치라는 뜻을 밝혀 배치 작업과 구분합니다. 기존 WebKit, Core 연동 및 배포 검사와 실제 기기 미검증 조건은 유지합니다.

위치: [ROUND 검증 요약](/Users/lim/devProject/personal/portfolio/src/data/evidencePresentation.js:29), [서비스 검증 안내](/Users/lim/devProject/personal/portfolio/src/data/batonServicePresentation.js:187), [검증 시나리오](/Users/lim/devProject/personal/portfolio/src/data/projects.js:573), [공개 요약 문서](/Users/lim/devProject/personal/portfolio/public/docs/baton/round-realtime-boundary.md:25). 같은 표현이 있는 [서비스 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:478)도 함께 맞춥니다.

근거: ROUND 저장소의 `7c9218c`에 있는 `e2e/standalone-room-media.spec.ts`를 확인했습니다. [현재 파일 위치](/Users/lim/devProject/personal/webRTC/e2e/standalone-room-media.spec.ts:9).

### 5. RELAY: 완료 응답을 RabbitMQ ACK로 명시

- 현재: `재전달에도 수신 이력 1건 유지, 완료 응답 반환, 실패 큐 미전송`
- 수정안: `재전달 시 수신 이력 1건 유지, RabbitMQ ACK 전송, DLQ 미전송`

현재 표현만 보면 HTTP 응답이나 최종 외부 전송 성공을 뜻하는지 알기 어렵습니다. 이 검증은 PostgreSQL에 저장한 이벤트가 다시 도착했을 때 RabbitMQ에 처리 완료를 알리는 ACK와 실패 큐인 DLQ로의 전송 여부를 확인합니다. 본문에 이미 설명한 실무 용어를 요약에도 사용합니다.

위치: [RELAY 검증 결과 요약](/Users/lim/devProject/personal/portfolio/src/data/evidencePresentation.js:15).

근거: [RabbitMQ 재전달 시나리오와 결과](/Users/lim/devProject/personal/portfolio/src/data/projects.js:550).

## 확인 범위

- 현재 렌더링 경로를 기준으로 검토했습니다. 화면에서 사용하지 않는 `homeFlow`와 `caseHighlights`의 일부 항목은 사용자에게 보이는 문제로 집계하지 않았습니다.
- CAL과 happyGallery의 관련 근거 파일에 미커밋 변경이 없는 것을 확인했고, ROUND는 포트폴리오에 적힌 커밋의 테스트 소스를 읽었습니다. 외부 서비스의 최신 기능을 추가하거나 테스트를 다시 실행한 검토는 아닙니다.
- 이번 변경은 검토 문서뿐이므로 애플리케이션 테스트와 빌드는 다시 실행하지 않았습니다. 직전 구현 커밋의 테스트 163개, 프로덕션 빌드와 데스크톱 및 모바일 확인 결과는 3차 검토 문서에 기록돼 있습니다.

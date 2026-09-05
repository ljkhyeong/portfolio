# 포트폴리오 문구 5차 검토

검토일: 2026-09-05

검토 기준: `c3755d5` 커밋. 검토 시작 시 작업 폴더와 `origin/main`은 같은 상태였습니다.

## 검토 결과

이번에 확인한 추가 수정안은 3개입니다. 짧은 요약에서 생략한 대상을 명시하는 정도이며, 앞선 검토처럼 동작 설명을 크게 바꿀 항목은 발견하지 못했습니다. 아래는 제안이며 화면 문구에는 아직 반영하지 않았습니다.

### 1. Hope Commit: 파일 이름 변경 정보와 추가 및 삭제 줄 수를 명시

- 현재: `이름 변경과 줄 수 유지`
- 수정안: `파일 이름 변경 정보와 추가 및 삭제 줄 수 보존`

현재 표현은 파일 내용을 수정해도 줄 수를 같게 유지한다는 뜻으로 읽힐 수 있습니다. 실제로 보존하는 것은 변경 전후 파일 경로와 추가 및 삭제 줄 수입니다. 수집 결과에 남기는 정보를 직접 적는 편이 정확합니다.

검증 요약 전체 수정안: `커밋 및 비교 기준 고정, 파일 이름 변경 정보와 추가 및 삭제 줄 수 보존, UTF-8이 아닌 경로 거절`

상세 결과에도 같은 표현을 적용합니다. `textconv 및 색상을 꺼도 이름 변경과 줄 수를 유지했고`는 `textconv와 색상 출력을 끈 상태에서 파일 이름 변경 정보와 추가 및 삭제 줄 수를 보존했고`로 바꿀 수 있습니다.

위치: [검증 결과 요약](/Users/lim/devProject/personal/portfolio/src/data/evidencePresentation.js:62), [상세 결과](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1602).

근거: Hope Commit 저장소의 포트폴리오 기준 커밋 `9d8392d`에서 `test/commit-collector.test.mjs`를 확인했습니다. 603행의 이름 변경 테스트는 이전 경로, 현재 경로와 추가 및 삭제 줄 수를 검사하며, 627행의 변경 파일 테스트는 추가 2줄과 삭제 1줄을 검사합니다. 테스트를 이번 검토에서 다시 실행한 것은 아닙니다.

### 2. BRIEF: 재생성하는 목록을 점검 목록으로 명시

- 현재: `저장 이벤트로 목록 재생성`
- 수정안: `저장 이벤트로 점검 목록 재생성`

현재 요약만 읽으면 이벤트 목록이나 주간 보고서 목록으로도 이해할 수 있습니다. 본문에서 설명한 점검 목록을 요약에도 명시합니다.

같은 대상을 설명하는 `저장 이벤트 기반 목록 재생성`과 `저장 이벤트로 같은 목록을 재생성`도 각각 `저장 이벤트 기반 점검 목록 재생성`, `저장 이벤트로 같은 점검 목록을 재생성`으로 맞춥니다.

위치: [검증 결과 요약](/Users/lim/devProject/personal/portfolio/src/data/evidencePresentation.js:19), [서비스 상세 요약](/Users/lim/devProject/personal/portfolio/src/data/projects.js:373), [상세 결과](/Users/lim/devProject/personal/portfolio/src/data/projects.js:560), [공개 요약 문서](/Users/lim/devProject/personal/portfolio/public/docs/baton/brief-event-projection.md:25).

근거: [BRIEF 소개 및 점검 항목 저장 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:359)과 검증 상세 결과를 대조했습니다.

### 3. ROUND: 응답과 후보의 종류를 명시

- 현재: `응답 및 후보 수신`
- 수정안: `SDP 응답 및 ICE 후보 수신`

`후보`만으로는 WebRTC 연결 후보라는 뜻이 드러나지 않습니다. 바로 아래 설명에 있는 answer와 ICE를 제목에서도 식별할 수 있도록 실무 용어를 적습니다. 하단 설명인 `answer와 ICE의 연결 순번 확인`은 유지할 수 있습니다.

위치: [대표 문제의 처리 단계](/Users/lim/devProject/personal/portfolio/src/data/featuredProblems.js:202).

근거: 같은 항목의 문제 설명, 처리 방식과 검증 결과가 SDP answer 및 ICE 메시지의 연결 순번 비교를 설명합니다.

## 확인 범위

- 화면에서 사용하는 검증 결과 요약과 상세 결과, 대표 문제의 처리 단계, 문서 검색 화면 및 주요 도식의 문구를 확인했습니다.
- 검증 결과 요약이 상세 결과를 대신 표시하는 구조와 대표 문제 단계의 화면 연결을 확인했습니다.
- 기존에 수정한 항목을 다시 집계하지 않았습니다. 이미 의미가 분명한 문장이나 일반적인 기술 용어는 수정 대상으로 늘리지 않았습니다.
- 이번 변경은 검토 문서 추가뿐입니다. 화면, 공유 이미지와 PDF는 변경하지 않았으므로 앱 테스트와 빌드를 다시 실행하지 않았습니다.

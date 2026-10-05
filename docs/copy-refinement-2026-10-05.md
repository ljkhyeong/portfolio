# 포트폴리오 문구 전수 정리 — 2026-10-05

## 검토 범위

-   메인 소개, 처리 흐름, 프로젝트 카드, 경력·기술·활동
-   프로젝트 8개와 BATON 서비스 6개의 상세(개요, 문제 해결, 검증 근거, 도식, 이미지 설명)
-   경로 메타데이터, `index.html` 기본 설명, OG 이미지 15개, PDF, 문서 검색 화면 안내
-   README 프로젝트 목록과 공개 BATON 설계 요약

`capture.mjs --all --expand --text`로 접힌 설명과 도식 문구까지 모은 뒤, 영역을 넷(메인·공통, BATON, 경력·교육, 개인 프로젝트)으로 나눠 검토했다. 의미가 걸린 문장은 원본 저장소의 README·ADR·커밋으로 확인했다.

## 수정 기준

-   대상이 빠진 말(`인계`, `매핑`, `새 상태`, `운영`, `원문 충돌`)은 무엇을 어떻게 처리하는지로 바꿨다.
-   내부 용어와 상태값(`ACTIVE`, `SENT`, `access token`, `its_`, `user token`)은 한글 설명을 앞에 두거나 괄호로 함께 적었다.
-   같은 대상을 다르게 부르던 말을 하나로 맞췄다. `중복 교대` → `중복 인수인계`, `군경찰` → `군사경찰`, `PG` → `결제사`, `공개 자료` → `공개 문서`
-   다른 영역과 같은 내용을 반복하거나 내부 작업 경위를 설명하는 문장은 지웠다.
-   실제와 다르게 읽히던 문장을 바로잡았다. 기능별로 쓴 happyGallery 모듈 분리는 계층별 6개 모듈 분리로, IntentTrace의 공개 시 GitHub 비교는 별도 조회로, Idea 문서 40건 전체를 코드로 확인한 것처럼 읽히던 문장은 검토와 POC 1건으로 고쳤다.

## 유지한 표현

-   `SKIP LOCKED`, 멱등 키, Outbox, Presigned URL, CSRF, PKCE, No Offset처럼 구현을 설명하는 실무 용어
-   커밋, 버전, 테스트 수, 전자영장 성능 조건(100 RPS·300 TPS, 1시간), HLS 지연 수치와 측정 조건, Hope 원작자 고지
-   구현, 로컬·자동화 검증, 공개 `main` 반영, 실제 운영, 미검증의 구분

새 구현 성과나 수치는 추가하지 않았다. 검증 수준을 넓힌 문장도 없다.

## 주요 수정

| 번호 | 현재 문구                                                                       | 수정안                                                                                                 | 이유 및 위치                                                                                                                                                                               |
| ---- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | 요청 식별값과 처리 대상을 확인 / 재처리 기준에 따라 다시 실행                   | 멱등 키와 처리 대상을 확인 / 처리 기한이 지난 작업만 다시 실행                                         | 실무 용어와 실제 조건으로 바꿈. [메인 처리 흐름](src/data/homeHero.js:9)                                                                                                                   |
| 2    | 허용 경로의 짧은 링크 / 서비스 간 이벤트 전달                                   | 짧은 링크 발급 / Core 이벤트 외부 전달                                                                 | 서비스 역할을 동작으로 표시. [메인 서비스 지도](src/data/projectSummaries.js:48), [구성도](src/component/project/diagrams/BatonArchitectureDiagram.jsx:194)                                |
| 3    | 2026.03.24 — 진행 중                                                            | 2026.03.24 — 현재                                                                                      | 기간 표기 관례. [경력](src/data/profile.js:24) 외 6곳                                                                                                                                      |
| 4    | 배포 상태 및 중단 배치 확인                                                     | 배포 구성 및 중단 배치 확인                                                                            | 실제 작업(k3s 롤링 교체·백업 절차 구성)에 맞춤. [기술](src/data/homeSkills.js:82)                                                                                                          |
| 5    | 군경찰                                                                          | 군사경찰                                                                                               | 기관 정식 명칭. [경력 카드](src/data/caseHighlights.js), [도식](src/component/project/diagrams/PortfolioFlowDiagram.jsx:22), OG                                                            |
| 6    | 공개 자료                                                                       | 공개 문서                                                                                              | 검색 대상 이름 통일. [문서 검색 화면](src/component/search/PortfolioKnowledgePage.jsx:218)                                                                                                 |
| 7    | 중복 교대                                                                       | 중복 인수인계                                                                                          | BATON 전체 용어와 통일. [검증 근거](src/data/projects.js:663), [검증 요약](src/data/evidencePresentation.js:2)                                                                             |
| 8    | ACTIVE·RESOLVED로 반영                                                          | 미해결(ACTIVE)·해결됨(RESOLVED)으로 반영                                                               | 상태값 단독 노출 제거. [BRIEF 사례](src/data/featuredProblems.js:174), [BRIEF 도식](src/data/batonServicePresentation.js:129), OG는 `미해결 / 해결됨`                                      |
| 9    | v2 운영 이벤트 / BATON 이벤트 / event ID                                        | 점검 결과 이벤트 / Core 이벤트 / 이벤트 ID                                                             | 도식 화살표가 전달하는 내용을 표시. [구성도](src/component/project/diagrams/BatonArchitectureDiagram.jsx:108), [RELAY 도식](src/component/project/diagrams/BatonServiceFlowDiagram.jsx:85) |
| 10   | Core와 6개 서비스 분리(결정 설명 반복)                                          | Core와 6개 서비스의 기능 및 DB 분리                                                                    | 분리 대상을 명시하고 반복 문장 삭제. [BATON 결정](src/data/projects.js:732)                                                                                                                |
| 11   | RELAY 전달 채널(Slack 누락)                                                     | Discord·Slack·Webhook·AWS SQS FIFO                                                                     | 실제 지원 채널과 일치. [RELAY 메타](src/data/routeMeta.js), RELAY 도식·OG                                                                                                                  |
| 12   | BATON 그림 설명, GO·WATCH 보조 문단, CAL 최대 100건 문장                        | 삭제                                                                                                   | 바로 위 도식·상태 표와 같은 내용 반복. [BATON 상세](src/data/projects.js), [서비스 표시](src/data/batonServicePresentation.js)                                                             |
| 13   | 이중화 서버의 작업 선점과 트랜잭션 분리(구현 방법 블록)                         | 삭제                                                                                                   | 문제 02 `이중화 서버의 작업 선점과 중단 작업 재처리`와 같은 내용. [전자영장 문제 02](src/data/projects.js:2369)                                                                            |
| 14   | 누적 전송 이력의 조회 비용 개선                                                 | 누적 전송 이력의 OFFSET 조회 비용 개선, `마지막 전송 ID` 다음부터 조회(No Offset)                      | 비용 원인과 방식 명시. [전자영장 문제 01](src/data/projects.js:2337)                                                                                                                       |
| 15   | PDF 완료 응답 순서 역전                                                         | 요청 상태 저장보다 먼저 도착한 PDF 완료 응답 재조회                                                    | 무엇이 먼저 도착했는지 명시. [전자영장 문제 03](src/data/projects.js:2357)                                                                                                                 |
| 16   | 대용량 파일을 저장소로 직접 업로드                                              | Presigned URL로 대용량 파일 직접 업로드, 파일 저장 시스템으로 직접 전송                                | 방식 명시, `저장소`(Git 저장소와 혼동) 대신 파일 저장 시스템. [군사법 문제 03](src/data/projects.js:2454)                                                                                  |
| 17   | 중단된 경우 확인한 단계부터 다시 실행                                           | 중단되면 해당 기관 배치를 다시 실행                                                                    | 재실행 단위 명시. [군사법 도식](src/component/project/diagrams/PortfolioFlowDiagram.jsx:22)                                                                                                |
| 18   | 요청 기관                                                                       | 자료 송신 기관                                                                                         | 도식 구역의 실제 역할. [군사법 도식](src/component/project/diagrams/PortfolioFlowDiagram.jsx:27)                                                                                           |
| 19   | HLS 재생 지연 약 35초 → 약 17초                                                 | 팀 시연 환경에서 HLS 재생 지연 약 35초 → 약 17초                                                       | 측정 조건을 수치 앞에 표시. [교육 카드](src/data/caseHighlights.js:75), OG                                                                                                                 |
| 20   | 상품, 주문, 예약 기능의 모듈 분리                                               | 계층별 6개 모듈 분리                                                                                   | 실제 모듈은 계층 분리(happyGallery settings.gradle, ADR-0021). [happyGallery 구현 방법](src/data/projects.js:1020)                                                                         |
| 21   | 스마트스토어 운영                                                               | 스마트스토어 주문·재고 연동                                                                            | 구현 대상 명시. [메인 카드](src/data/caseHighlights.js:7), 홈 요약, 메타, 검증 단계, README, OG 설명                                                                                       |
| 22   | 개발 전에 선택할 방식과 외부 장애 대응안을 작은 검증 코드로 확인                | 개발 전 구현 방식과 외부 장애 대응안을 검토합니다. POC 1건은 검증 코드로 확인했습니다.                 | Idea 40건은 검토 문서. [happyGallery 문서](src/data/projects.js:1046)                                                                                                                      |
| 23   | Toss 자체창                                                                     | Toss SDK로 각 간편결제 창을 열어 결제                                                                  | Toss 자체 결제창으로 오해. [검증 근거](src/data/projects.js:1142)                                                                                                                          |
| 24   | 배송 전 과정을 통합 테스트                                                      | 운송장 등록부터 배송 완료와 관리자 주문 완료까지 통합 테스트                                           | `배송 전(前)`으로 읽힘. [문제 해결](src/data/projects.js:1346)                                                                                                                             |
| 25   | 서버 중단 후 인계 / SENT로 확정                                                 | 서버 중단 후 미전송 알림 재처리 / 발송 완료(SENT)로 확정                                               | 대상 명시, 상태값 설명. [알림 문제](src/data/projects.js:1251)                                                                                                                             |
| 26   | 매핑이 없거나 새 상태가 들어오면                                                | 자사몰 상품과 연결되지 않은 주문이나 처음 보는 주문 상태는                                             | 대상 명시. [스마트스토어 문제](src/data/projects.js:1360)                                                                                                                                  |
| 27   | 결제 조회 대사와 NHN 접수 및 최종 수신 결과의 분리 저장                         | Toss 웹훅 수신 시 결제 재조회·최근 7일 정산 대사, NHN 접수와 최종 수신 결과 분리 저장                  | 무엇을 대조하는지 명시. [검증 요약](src/data/evidencePresentation.js:53)                                                                                                                   |
| 28   | 무료 공휴일 갱신                                                                | 공휴일 자동 갱신                                                                                       | `무료 공휴일`로 읽힘. [검증 근거](src/data/projects.js:1195)                                                                                                                               |
| 29   | 작업이 길어질 때 개발 규칙을 놓칠 수 있어                                       | AI 에이전트가 긴 작업에서 초기 개발 규칙을 놓칠 수 있어                                                | 주체 명시, 검사 이름(ESLint) 정정. [에이전트 피드백 문제](src/data/projects.js:1402)                                                                                                       |
| 30   | 원 단위 전액 환불 / 전환 전에 준비한 결제                                       | 비례 환불(원 단위 미만 버림), 결제 대기 중인 8회권, 전체 횟수 환불 시 결제액 전액 환불                 | ADR-0011 기준으로 풀어 씀. [회차권 검증](src/data/projects.js:1299)                                                                                                                        |
| 31   | 촬영 이후 변경 경위 설명, 초기 구현 검증 2e831500 기준, 스모크 통과 기록을 보존 | 촬영한 화면의 기능은 이후 바뀌지 않았습니다 / 삭제 / 스모크 테스트 19개가 통과했습니다                 | 작업 경위 대신 결과만 표시. [화면 설명](src/data/projects.js:971), [CI 근거](src/data/projects.js:1149)                                                                                    |
| 32   | 질문 11종·연령 비교 9종                                                         | 정책 11종의 조건 질문과 9종의 연령 비교                                                                | 질문 종류가 아니라 정책 수. [검증 단계](src/data/caseHighlights.js:21)                                                                                                                     |
| 33   | 개인 정책 변경 비교 / 키 교체                                                   | 관심 정책의 저장 시점 비교 / 암호화 키 교체                                                            | 대상 명시. [청년정책메이트 상태](src/data/projects.js)                                                                                                                                     |
| 34   | 검토된 원문 충돌                                                                | 공식 공고와의 차이                                                                                     | 원본 프로젝트 내부 용어. [화면 설명](src/data/projects.js:1477), 검증 근거 제목, 도식 노트                                                                                                 |
| 35   | 일부 구간 중첩                                                                  | 답변 구간이 기준과 일부만 겹치는 경우                                                                  | 무엇이 겹치는지 명시. [대표 사례](src/data/featuredProblems.js:46)                                                                                                                         |
| 36   | 모바일 웹앱(메타), 웹앱 / 서울 청년정책(OG)                                     | 모바일 웹앱 개발 프로젝트, 웹앱 / 서울 청년정책 / 개발 중                                              | 출시 서비스로 읽히지 않게 개발 단계 표시. [메타](src/data/routeMeta.js:71), OG                                                                                                             |
| 37   | 로컬 커밋 HTML 리뷰                                                             | 커밋 AI 리뷰 HTML, 지정한 커밋을 AI로 리뷰하고 각 설명을 실제 변경 줄에 연결                           | 기능을 동작으로 표시. [eyebrow](src/data/projectSummaries.js:164), 메인 카드                                                                                                               |
| 38   | v5.0.2 공개 및 자동화 테스트 343개 통과                                         | Hope Commit v5.0.2 공개, 자동화 테스트 343개 통과                                                      | 원본 Hope 버전으로 오해 방지. 메인 카드, 검증 단계                                                                                                                                         |
| 39   | 커밋 검토 처리 흐름 / 코드 변경 근거 기록                                       | HTML 리뷰 화면 / 기록 조회 화면                                                                        | 영역에 실제로 있는 것은 화면 캡처. [Hope](src/data/projects.js:1764), [IntentTrace](src/data/projects.js:1965)                                                                             |
| 40   | 검증이 끝난 결과만 새 HTML로 저장 / 짧은 ID, 긴 커밋 본문 분할                  | 검증을 통과한 리뷰만 새 HTML로 저장 / 짧은 커밋 ID, 긴 커밋 메시지 분할 표시                           | 실패 결과 포함으로 읽힘, diff와 혼동. [Hope 근거](src/data/projects.js:1861)                                                                                                               |
| 41   | Hope 상태의 세부 수정 3건 나열, 리뷰 판단 확인 문장                             | 최신 공개 버전은 v5.0.2(main 9d8392d)입니다 / 삭제                                                     | 문제 해결·대표 사례와 반복. [Hope 상태](src/data/projects.js:1881)                                                                                                                         |
| 42   | 기록 공개 시 제출한 해시를 확인하고 GitHub 원본 코드와 비교                     | 공개 요청은 클라이언트가 제출한 코드 해시로 검사하고, GitHub 원본 코드 비교는 별도 조회에서 실행       | 실제는 별도 조회(intent-trace README). [IntentTrace 제약](src/data/projects.js:1973)                                                                                                       |
| 43   | access 및 refresh token과 its\_ 세션 / user token                               | GitHub 액세스·리프레시 토큰과 IntentTrace 세션 토큰(its\_) / 사용자 토큰                               | 영어 용어·접두사 설명. [인증 근거](src/data/projects.js:2087)                                                                                                                              |
| 44   | 조회 중단 사유와 재개 위치를 제공                                               | 조회가 시간 또는 GitHub 호출 한도에 걸리면 중단 사유와 다음 조회 위치를 반환                           | 중단 조건 명시. [웹 조회 근거](src/data/projects.js:2108)                                                                                                                                  |
| 45   | 개발 버전의 IDE 검색·GitHub 연결 진단을 검증 / Zed MCP 연결과 최신 로컬 검증    | 개발 브랜치의 IntelliJ 기록 검색·PR 커밋 일치 진단은 자동화 테스트로 확인 / Zed MCP 연결과 세션 재연결 | 검증 방법과 확인 대상 명시. [메인 카드](src/data/caseHighlights.js:24), [Zed 근거](src/data/projects.js:2112)                                                                              |
| 46   | 검증 근거 14행의 기본 배지 `확인 방법`                                          | 통합 테스트, 코드 대조, 시나리오 대조, CI 확인, 로컬 연동 등 실제 방법                                 | 같은 목록의 다른 행과 표시 통일. [검증 요약](src/data/evidencePresentation.js)                                                                                                             |
| 47   | README 청년정책메이트(인증키 대기, 미구현), 판단 출처·전체 길이 커밋 ID         | 상세 데이터 기준 현재 구현 범위, 변경 근거와 출처·전체 커밋 해시                                       | README가 상세 페이지와 반대로 읽힘, 승인 용어 미반영. [README](README.md:17)                                                                                                               |

이 밖에 같은 의미의 반복 문장, 도식 주석과 그림 설명을 정리했다. 그림 설명(`visualCaption`)이 없는 상세는 설명 문단을 그리지 않도록 [ProjectCaseStudy.jsx](src/component/project/ProjectCaseStudy.jsx)의 세 곳을 조건부로 바꿨다.

## 확인 필요(이번 작업에서 바꾸지 않음)

-   청년정책메이트 원본 HEAD의 README는 질문 제공 12개 정책, 연령 비교 10개 정책이다. 포트폴리오는 `4f7d030` 기준 11종·9종이다. 현행화 작업에서 갱신 여부를 정해야 한다.
-   IntentTrace HANDOFF에 `125684c` 이후 반영분이 있고, README의 `공개 main은 0.8.0-SNAPSHOT`이 지금도 맞는지 확인이 필요하다.
-   CAL 후보 규격(rc.1·rc.2 표기), BRIEF 규격(rc.4), Runbook 수(38·33)는 원본 저장소마다 표기가 다르다.
-   전자영장 연계 대상 이름(`집행포털`과 `전자영장 포털`)은 공식 명칭을 확인하지 못해 그대로 두었다.
-   `evidencePresentation.js`의 `OpenAPI 문서화 범위`, `공개 main 자동화 검증`은 어느 근거 항목과도 맞지 않아 화면에 나오지 않는다. 삭제 여부를 정해야 한다.
-   happyGallery 문제 15의 `기존 브라우저 시나리오를 확인하고`가 실행인지 코드 대조인지 원본 기록으로 확정하지 못했다.

## 반영 및 검증 결과

-   원문 일치 검사 스크립트로 218건(테스트 기대값 18건 포함)을 반영하고, 전자영장 구현 방법 블록 삭제와 남은 표현 정리 7건을 따로 반영했다. 반영 뒤 이전 표현(`군경찰`, `중복 교대`, `스마트스토어 운영`, `원문 충돌`, `— 진행 중` 등)이 화면 데이터에 남지 않았음을 검색으로 확인했다.
-   테스트 기대값은 같은 의미의 새 문구로 고쳤다. 삭제한 문장(`visualCaption`, ROUND `책임을 분리`)을 확인하던 단언 2개는 지웠다.
-   새 글자 `겹`, `줘`가 생겨 글꼴 서브셋을 다시 만들었다(669자, 123,328바이트).
-   OG 14개와 홈 공유 이미지, PDF를 다시 생성했다. 전자영장·BRIEF·RELAY·청년정책메이트·happyGallery·군사법 OG를 열어 문구가 영역 안에 들어가는지 확인했다.
-   `capture.mjs --all` 1440·390px 34건에서 가로 넘침, 깨진 이미지, 콘솔 오류와 도식 글자 넘침이 없었다. BATON 구성도와 RELAY 도식은 캡처로 줄바꿈을 확인했다.
-   `check:file` 13개 테스트 파일 158건 통과. 전체 검사 결과는 `output/validation/last-run.md`에 기록했다.

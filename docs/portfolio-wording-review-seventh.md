# 포트폴리오 문구 7차 추가 검토

검토일: 2026-09-05

검토 기준: `481b526` 커밋. 6차 수정안 6개가 반영된 상태에서 검토했습니다.

## 결과

추가 수정안은 4개입니다. 처리 대상이 빠진 문장, 저장물을 혼동하게 하는 제목, 설명 없는 AI 내부 용어와 검색 설명의 개발 범위를 정리하는 제안입니다. 이번에는 검토 문서만 작성했으며 화면 문구는 수정하지 않았습니다.

### 1. BATON GO: 생성 및 폐기 대상을 링크로 명시

- 현재: `BATON 호출자의 생성 및 폐기와 대상 서비스 권한까지 포함한 전체 흐름, 실제 클러스터와 공개 배포는 미검증입니다.`
- 수정안: `BATON의 링크 생성 및 폐기 요청부터 대상 서비스의 접근 권한 확인까지 이어지는 전체 연동, 실제 클러스터와 공개 배포는 미검증입니다.`

현재 문구는 호출자 계정이나 인증 정보를 생성하고 폐기한다는 뜻으로도 읽힙니다. 실제 설명 대상인 링크를 명시하면 무엇을 아직 검증하지 않았는지 분명해집니다.

위치: [GO 검증 상태](/Users/lim/devProject/personal/portfolio/src/data/batonServicePresentation.js:20).

근거: [GO 담당 기능](/Users/lim/devProject/personal/portfolio/src/data/projects.js:213)은 링크 생성, 조회, 폐기와 리다이렉트를 구분하며 실제 접근 권한은 대상 서비스가 확인한다고 설명합니다. [서비스 상세 화면](/Users/lim/devProject/personal/portfolio/src/component/project/BatonServiceCaseStudy.jsx:187)이 이 검증 문구를 표시합니다. 실제 연동 상태를 새로 판정하는 수정은 아닙니다.

### 2. Hope Commit: 저장하는 대상을 리뷰로 명시

- 현재: `검증 결과만 저장하고 중단된 작업 재개`
- 수정안: `검증을 통과한 리뷰만 저장하고 중단 작업 재개`

`검증 결과`는 테스트 통과 및 실패 기록을 뜻하는 것으로 읽힐 수 있습니다. 이 항목은 참조한 파일과 코드 줄, 형식 등을 검사한 리뷰를 HTML로 저장하고 중단된 생성 작업을 재개하는 기능입니다. 제목에도 저장하는 대상을 밝혀야 합니다.

위치: [Hope Commit 문제 해결 제목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1675).

근거: [HTML 저장 검증 항목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1613)과 같은 문제의 적용 방법 및 검증 설명을 대조했습니다. 참조한 코드 줄과 형식이 유효하다는 확인 범위를 유지하며, 리뷰 판단 자체가 정확하다고 보장하는 표현은 추가하지 않습니다.

### 3. 청년정책메이트: AI 후보와 한도 보류의 의미를 명시

- 현재: `AI 후보`
- 첫 설명의 수정안: `AI 요약 및 조건 추출 후보`
- 현재: `한도 보류`
- 수정안: `예산 한도로 처리 보류`
- 검증 요약 현재: `과거 개정과 오래된 AI 요청 결과를 현재 후보로 반영하지 않는지 테스트`
- 검증 요약 수정안: `과거 정책 개정과 오래된 AI 요청 결과의 반영 차단 테스트`

상세 페이지에서도 후보가 추천할 정책인지, 알림 날짜인지, AI가 만든 내용인지 설명하지 않습니다. 첫 설명에서 요약 및 조건 추출 후보라고 밝히고 이후에는 후보로 줄여 쓰면 됩니다. 한도 역시 예산 한도라고 명시해야 동시 요청 수나 입력 길이 제한과 구분됩니다.

위치: [AI 검증 항목](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1388), [AI 처리 설명](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1450), [접힌 상태의 검증 요약](/Users/lim/devProject/personal/portfolio/src/data/caseHighlights.js:82).

근거: 청년정책메이트의 포트폴리오 기준 커밋 `7311d9e`에서 `docs/development/policy-ai-candidates.md`와 `PolicyAiResult.java`를 확인했습니다. 작업 종류는 `SUMMARY`와 `CONDITION_EXTRACTION`이며, 미생성 사유의 `BUDGET_LIMIT`은 예산 한도입니다. 현재 모델은 후보 ID와 내용 해시만 관리합니다. 실제 AI 호출, 후보 본문 저장과 자격 규칙 반영까지 구현한 것처럼 바꾸면 안 됩니다.

6차에서 홈의 `현재 후보`는 수정했지만 이번 항목은 상세 페이지의 검증 요약과 모델 설명에 남은 표현입니다.

### 4. 청년정책메이트: 검색 및 링크 미리보기 설명에도 테스트 정책 사용을 명시

- 현재: `정책 조건을 3단계로 판정해 근거와 기준일을 표시하고 확인한 마감만 알림 후보로 계산하는 서울 청년정책 웹앱`
- 수정안: `테스트 정책의 조건을 3단계로 판정해 근거와 기준일을 표시하고, 확인한 마감만 알림 후보 날짜로 계산하는 서울 청년정책 웹앱 개발 프로젝트`

6차에서 공유 이미지는 수정했지만 검색 설명과 링크 미리보기의 텍스트는 별도로 관리합니다. 현재 설명에는 테스트 정책을 사용하는 개발 단계라는 정보가 없어 실제 정책을 안내하는 서비스로 읽힐 수 있습니다.

위치: [청년정책메이트 경로 메타데이터](/Users/lim/devProject/personal/portfolio/src/data/routeMeta.js:71).

근거: 기존 배포 빌드의 `build/projects/youth-policy-mate/index.html`에서 같은 문장이 `description`, `og:description`, `twitter:description`에 들어가는 것을 확인했습니다. [생성 코드](/Users/lim/devProject/personal/portfolio/scripts/generate-route-meta.mjs:44)는 이 세 설명을 같은 데이터에서 생성합니다. [현재 구현 상태](/Users/lim/devProject/personal/portfolio/src/data/projects.js:1415)와 공유 이미지의 테스트 정책 범위에 맞추는 수정입니다.

## 확인 범위

- 홈 소개, 기술, 프로젝트 요약과 경로 메타데이터를 다시 읽었습니다.
- 주요 프로젝트의 문제 해결 상세, 검증 결과와 검증 요약, BATON 서비스의 검증 상태를 대조했습니다.
- 소스에만 남은 미사용 문구를 화면의 문제로 집계하지 않도록 표시 경로를 확인했습니다.
- 후보의 의미는 포트폴리오 기준 커밋의 문서와 모델로 확인했습니다. 외부 프로젝트의 최신 기능이나 운영 상태를 갱신한 검토는 아닙니다.
- 이번에는 화면 소스를 수정하지 않았으므로 테스트, 빌드, PDF 생성과 브라우저 전수 검사는 다시 실행하지 않았습니다. 검색 설명은 앞서 생성한 배포 HTML을 확인했습니다.

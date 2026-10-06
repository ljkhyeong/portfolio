---
name: portfolio-project-refresh
description: 포트폴리오에 소개한 프로젝트의 최신 구현, 배포, 검증 상태를 원본 저장소와 대조해 반영하거나, 새 프로젝트를 추가할 때 사용한다. "프로젝트 현행화", "최신 상태 반영", "배포 상태 반영", "테스트 수와 버전 갱신", "스크린샷 교체", "새 프로젝트 추가", "이 성능 결과 반영해줘", "BATON·happyGallery·청년정책메이트·Hope Commit·IntentTrace 업데이트" 같은 요청에 사용한다. 원본 저장소는 읽기만 하고, 포트폴리오의 데이터, 도식, 공유 이미지, 검색 자료와 근거 문서를 함께 갱신한다.
---

# 프로젝트 현행화

포트폴리오 문장 하나하나가 면접 질문의 근거가 된다. 그래서 확인한 리비전과 문서로만 갱신하고, 구현과 실제 운영을 섞지 않는다. 원본 저장소의 스킬(`baton-*`, `youth-policy-*` 등)은 그 저장소를 개발할 때 쓰는 스킬이므로 이 작업에 적용하지 않는다.

## 1. 기준 고정

1. 대상 프로젝트와 원본 저장소를 [references/repositories.md](references/repositories.md)에서 찾는다.
2. 마지막 근거 문서(`docs/project-progress-*.md` 중 최신)의 확인 리비전을 읽는다. 이번 작업은 그 리비전 이후의 변경부터 확인한다.
3. 각 저장소의 상태를 기록한다. 원본 저장소에서는 `fetch`처럼 원격 추적 정보만 갱신하는 명령만 쓴다. `pull`, `checkout`, `reset`, 커밋, 파일 수정은 하지 않는다.

```bash
git -C <저장소> fetch --quiet origin
git -C <저장소> rev-parse --short origin/main HEAD
git -C <저장소> status --short --branch
git -C <저장소> log --oneline <이전 리비전>..origin/main
gh repo view ljkhyeong/<저장소> --json visibility,url
gh run list -R ljkhyeong/<저장소> --branch main -L 3
gh release list -R ljkhyeong/<저장소> -L 3
```

로컬 브랜치가 공개 `main`보다 앞서 있으면 어느 내용이 로컬 기준인지 따로 적는다.

## 2. 근거 읽기와 상태 판정

README, CHANGELOG·릴리스, PRD·ADR, HANDOFF·운영 문서, 테스트 기록과 최근 커밋 메시지를 읽는다. 각 주장은 다음 단계 중 하나로 판정한다.

| 단계             | 근거                                                       | 포트폴리오 표현 예                      |
| ---------------- | ---------------------------------------------------------- | --------------------------------------- |
| 구현             | 로컬 또는 공개 브랜치의 코드와 커밋                        | `구현했습니다`, `로컬 개발 브랜치 기준` |
| 자동화·로컬 검증 | 테스트 결과, CI 실행 기록, 검증 로그                       | `서버 테스트 436개 통과(c8cfc33)`       |
| 공개 반영        | 공개 `main`, 태그, 릴리스                                  | `공개 main 반영`, `v0.7.0 공개`         |
| 배포·운영        | 접속 가능한 배포 주소, 배포 기록, 실제 외부 계정 연동 확인 | `배포 완료`(배포 주소를 확인했을 때만)  |
| 미검증           | 근거가 없거나 모의 응답·테스트 데이터로만 확인             | `실제 PG 계정 연동은 미검증입니다`      |

-   테스트 수, 버전, 건수는 확인한 리비전과 함께 적는다. 다른 저장소의 전체 테스트를 직접 실행했다면 명령과 리비전을 기록하고, 실행하지 않았으면 기록을 인용했다고 밝힌다.
-   사용자가 직접 준 결과(성능 수치 등)는 `제공 결과`로 기록하고, 이 저장소에서 재실행하지 않았다고 적는다. 정정된 수치는 사용하지 않는다(예: 전자영장 1,500 RPS → 100 RPS·300 TPS).
-   README와 기획 문서만 있는 저장소는 구현 프로젝트로 추가하지 않는다.
-   회사 비공개 자료, 내부 코드, 업무 로그와 자기소개서 초안은 근거로 인용하거나 공개 자료에 넣지 않는다.

## 3. 반영 위치

같은 값은 한 곳에서 정의하고 참조한다. 이미 공유 상수(`youthPolicyCoverage`, `warrantPerformance` 등)가 있으면 상수만 고친다.

| 순서 | 파일                                                                                                           | 내용                                                                                    |
| ---- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1    | `src/data/projectSummaries.js`                                                                                 | 홈 카드, 요약, `stage`, `visibility`, `period`, `tags`, 저장소·서비스 링크              |
| 2    | `src/data/projects.js`                                                                                         | 상세 `status`, `problems`, `screenshots`, `architecture`, `documents`, `stack`, `links` |
| 3    | `batonServicePresentation.js`, `caseHighlights.js`, `featuredProblems.js`, `timeline.js`, `warrantEvidence.js` | BATON 서비스, 상세 첫 화면 소개와 확인한 범위, 대표 사례, 메인 연표 문구, 성능 수치     |
| 4    | `src/data/projectOg.js`, `src/data/routeMeta.js`                                                               | 공유 이미지 문구, 검색 결과 설명                                                        |
| 5    | `src/component/project/diagrams/*.jsx`                                                                         | 흐름이나 수치가 바뀐 도식(`portfolio-diagram` 스킬)                                     |
| 6    | `src/data/knowledgeCorpus.js`                                                                                  | 검색 자료로 공개할 외부 문서 목록(`portfolio-knowledge-search` 스킬)                    |
| 7    | `README.md`                                                                                                    | 프로젝트 목록 요약                                                                      |

검증 범위는 문제의 `validation`과 `boundary`, 상세 상단의 확인한 범위 문장(`caseHighlights.js`의 `caseResults`)에 쓴다. 메인 카드의 `homeCheck`와 연표 문구(`timeline.js`)도 같은 범위로 맞춘다. `boundary`에는 날짜, 리비전과 한계를 함께 쓴다. 예: `2026.09.06 로컬 d6ef9d2 · 전체 서울 정책과 최종 신청 자격 판정은 아님`. 별도 근거 목록(`proofs`)은 문제 해결과 같은 내용을 반복해 2026-10-05에 없앴다. 문장 표현은 `portfolio-copy`의 원칙을 따른다.

## 4. 스크린샷

원본 앱을 로컬에서 실행해 촬영한다. 원본 저장소의 설정 파일은 바꾸지 않고, 필요하면 환경 변수나 테스트 데이터 실행 옵션을 쓴다.

| 항목     | 기준                                                                                                                                                                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 데스크톱 | Chrome 1440px, 데이터 항목 `width: 1440`, `height: 960`(긴 화면은 실제 높이)                                                                                                                                                                                                |
| 모바일   | 390×844, deviceScaleFactor 2 → 780×1688                                                                                                                                                                                                                                     |
| 파일     | `public/<프로젝트>-<화면>.webp`. `cwebp -q 85 in.png -o out.webp`로 변환하고 원본 PNG는 `output/playwright/<주제>-<날짜>/`에 둔다. 메인 카드 화면(`coverScreenshot`)을 바꾸면 `npm run cover:variants`로 640·960px 사본을 다시 만든다(세로 화면은 `homeImage`로 잘라 둔다). |
| 설명     | `screenshotNote`에 촬영일, 실행 환경, 데이터 출처(공개 데이터·테스트 데이터·모의 응답), 실제 연동 여부를 쓴다. 이미지별 `caption`과 `alt`에는 기능만 쓴다.                                                                                                                  |

`src/data/projects.test.jsx`가 일부 프로젝트의 스크린샷 크기를 확인하므로, 크기를 바꾸면 기대값도 함께 고친다. 개인정보, 실제 고객 데이터, 토큰이 화면에 보이면 촬영하지 않는다.

## 5. 새 프로젝트 추가

1. `projectSummaries`에 항목을 추가한다. 필수 값은 `id`, `homeCategory`, `projectType`(`career`·`personal`·`webapp`·`tooling`·`education`), `presentation`, `title`, `navigationLabel`, `route: "/projects/<id>"`다. 비슷한 기존 항목의 필드 구성을 따른다.
2. `src/data/projects.js`의 `projects` 배열에 같은 `id`로 상세를 추가한다. 상세 경로는 `App.jsx`가 `projectSummaries`로 만들므로 라우트를 직접 추가하지 않는다. 별도 화면이나 리다이렉트가 필요할 때만 `App.jsx`를 고친다.
3. `src/data/routeMeta.js`에 제목과 설명을, `src/data/projectOg.js`에 공유 카드를 추가한다.
4. `npm run sitemap:generate`, `npm run og:generate`로 산출물을 만든다(`portfolio-artifacts`).
5. 홈의 유형별 개수, 프로젝트 이동 메뉴와 PDF 배치를 확인한다.

## 6. 근거 문서와 확인

1. `docs/project-progress-YYYY-MM-DD.md`를 [references/evidence-template.md](references/evidence-template.md) 형식으로 작성한다.
2. `npm run check:file -- <변경 파일...>`로 데이터 테스트를 확인한다.
3. 변경한 상세와 홈을 1440px·390px로 확인한다(`portfolio-visual-check`). 새 스크린샷이 갤러리와 확대 창에서 보이는지도 확인한다.
4. OG, PDF, 검색 자료를 갱신하고(`portfolio-artifacts`), 종료 전에 `npm run check:finish`를 실행한다.
5. 확인한 리비전, 실행한 명령과 미확인 항목을 `output/validation/last-run.md`에 남긴다.

## 보고

프로젝트별로 확인 리비전, 반영한 변경, 상태 판정을 바꾼 항목(예: 미검증 → 배포 확인), 유지한 미검증 항목과 근거를 찾지 못한 주장을 보고한다.

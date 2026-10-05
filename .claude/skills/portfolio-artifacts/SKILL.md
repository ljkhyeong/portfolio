---
name: portfolio-artifacts
description: 포트폴리오의 생성 산출물인 다운로드 PDF, 공유 이미지(OG), sitemap, 경로별 메타 HTML과 검색 자료(public/knowledge/portfolio.json)를 갱신하거나 확인할 때 사용한다. "PDF 다시 만들어줘", "공유 이미지 갱신", "og:check 실패", "pdf:check 실패", "sitemap이 다르다", "빌드 전 검사 실패", "인쇄 화면 확인"과 데이터·스타일 변경 후의 산출물 갱신에 사용한다. 어떤 입력이 어떤 산출물을 바꾸는지와 생성 순서를 정한다.
---

# 포트폴리오 산출물

산출물은 원본 파일의 SHA-256 지문으로 최신 여부를 판단한다. 그래서 무엇을 다시 만들지 추측하지 말고 검사 명령에 맡긴다. 생성 명령도 최신 항목을 생략하므로 같은 입력으로 반복 실행하지 않는다. 이전 세션에서 OG 전체 생성에 약 35초가 걸렸고, 빌드 후 PDF 배치를 다시 고쳐 생성과 빌드를 두 번 반복한 적이 있다. 순서를 지키는 이유다.

## 입력과 산출물

| 산출물                            | 생성                          | 검사                    | 주요 입력                                                                                                                                                                  |
| --------------------------------- | ----------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/임정규_포트폴리오.pdf`    | `npm run pdf:generate`        | `npm run pdf:check`     | 메인 컴포넌트·CSS, 홈 데이터(`profile`, `homeHero`, `caseHighlights`, `homeSkills`, `projectSummaries`, `warrantEvidence`), `PortfolioPrintPage.jsx`, `PortfolioPrint.css` |
| `public/og-cover.png`             | `npm run og:generate`         | `npm run og:check`      | 메인 렌더링 입력과 같음                                                                                                                                                    |
| `public/og/*.png` (상세 14개)     | `npm run og:generate`         | `npm run og:check`      | `projectOg.js`, `projectSummaries.js`, `ProjectOgPreview.jsx`, `ProjectOg.css`, BATON 서비스 흐름 도식과 `batonServicePresentation.js`                                     |
| `public/sitemap.xml`              | `npm run sitemap:generate`    | `npm run sitemap:check` | `routeMeta.js`의 경로와 `noindex`                                                                                                                                          |
| `public/knowledge/portfolio.json` | `npm run knowledge:generate`  | 빌드 전 자동 생성       | `projects.js`, `knowledgeCorpus.js`, `public/docs/**`, `docs/knowledge-document-snapshots.json`                                                                            |
| `build/**/index.html` 메타        | `npm run build`의 `postbuild` | 빌드                    | `routeMeta.js`. 상세·검색 경로에는 빌드 매니페스트로 찾은 화면 청크·CSS와 첫 캡처 미리 불러오기 태그를 넣는다(`scripts/route-preload.mjs`, 매니페스트는 배포 전에 지움)    |

정확한 입력 목록은 `scripts/artifact-inputs.mjs`가 기준이다. 렌더링 코드, 새 CSS 파일이나 새 데이터 파일을 산출물 화면에 연결했으면 이 목록에도 추가한다. 빠뜨리면 산출물이 낡아도 검사를 통과한다. 홈 OG와 PDF는 `scripts/artifact-inputs.test.mjs`가 `Main.jsx`와 `PortfolioPrintPage.jsx`의 상대 경로 import를 따라가 누락을 잡는다. 2026-10-05에 도면형 메인의 새 컴포넌트와 CSS가 빠져 PDF가 "최신"으로 잘못 판정된 뒤 추가한 검사다. `projects.js`처럼 상세 화면에만 쓰는 데이터는 PDF와 홈 OG를 바꾸지 않는다.

## 순서

1. 화면과 인쇄 배치 수정을 먼저 모두 끝낸다.
2. 바뀐 산출물만 확인한다.

    ```bash
    npm run og:check; npm run pdf:check; npm run sitemap:check
    ```

3. 실패한 항목만 생성한다. 생성 명령은 임시 Vite 서버와 Chrome을 직접 실행하므로 개발 서버가 필요 없다.
4. 생성 결과를 직접 확인한다.
    - **PDF**: 페이지 수가 이전과 같은지, A4 밖으로 넘친 내용이 없는지 본다. Read 도구의 `pages` 옵션으로 바뀐 페이지를 읽는다. 배치 확인은 `/portfolio/print`를 `portfolio-visual-check`로 캡처한다.
    - **OG**: 바뀐 `public/og/<id>.png`를 Read 도구로 보고 문구가 영역 안에 있는지 확인한다. 개발 서버에서는 `/og-preview.html?project=<id>`로 볼 수 있다.
    - **검색 자료**: `git diff --stat public/knowledge/portfolio.json`으로 문서 수와 바뀐 범위를 확인한다.
5. 최종 빌드는 마지막에 한 번만 실행한다. `prebuild`가 검색 자료 생성과 sitemap·OG·PDF 검사를 다시 하므로 빌드 직전에 같은 검사를 따로 반복하지 않는다. `check:finish`가 배포 입력 변경을 감지해 빌드를 실행하므로 보통은 `npm run check:finish`로 대신한다.

## 다시 만들어야 하는 특수한 경우

-   Chrome이나 외부 폰트가 바뀌면 파일 지문으로 감지할 수 없다. 이때만 `-- --force`를 붙인다.
-   Chrome을 찾지 못하면 `CHROME_PATH`로 경로를 지정한다. PDF는 `PDF_BROWSER_PATH`도 받고, Edge 미리보기는 `EDGE_PATH`를 쓴다.
-   Edge(`pdf:generate:edge`)와 Safari(`pdf:generate:safari`, macOS 전용) PDF는 호환성 확인용이다. `output/pdf-preview/`에만 저장되고 배포 PDF를 바꾸지 않는다. 브라우저별 인쇄 차이를 확인해 달라는 요청이 있을 때만 실행한다.

## 실패 대응

| 증상                                               | 조치                                                                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `sitemap.xml이 현재 공개 경로와 다릅니다`          | `npm run sitemap:generate` 후 diff에서 추가·삭제된 경로가 의도한 것인지 확인한다.                      |
| OG·PDF 검사 실패(원본 변경)                        | 해당 생성 명령을 실행한다. 원본을 바꾸지 않았는데 실패하면 `git status`로 의도하지 않은 변경을 찾는다. |
| PDF 생성 중 이미지·폰트 누락 또는 페이지 넘침 오류 | 인쇄 CSS나 데이터 길이를 고친다. 검사를 끄거나 기준을 낮추지 않는다.                                   |
| `check:finish`가 검사 중 파일 변경을 감지          | 생성된 diff를 검토한 뒤 같은 명령을 다시 실행한다. 변경이 없는 실행이 통과한 뒤 커밋한다.              |

`output/` 아래의 미리보기와 로그는 Git에서 제외된다. 커밋 대상은 `public/`의 산출물과 생성 기록(`scripts/*.manifest.json`, `scripts/og-manifests/`)이다.

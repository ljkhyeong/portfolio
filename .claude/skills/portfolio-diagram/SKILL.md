---
name: portfolio-diagram
description: 포트폴리오의 아키텍처 도식, 처리 흐름도, BATON 서비스 흐름도를 수정하거나 새로 추가할 때 사용한다. "도식 수정", "다이어그램 추가", "흐름도 갱신", "노드·연결선·라벨 바꿔줘", "구조도가 모바일에서 안 보여", "도식 글자가 넘쳐" 같은 요청에 사용한다. 독립 HTML 다이어그램을 만들지 않고 기존 React SVG 컴포넌트와 디자인 규칙 안에서 고친다.
---

# 포트폴리오 도식

포트폴리오 도식은 독립 이미지가 아니라 `src/component/project/diagrams/`의 React SVG 컴포넌트다. 같은 SVG가 상세 화면, 모바일 가로 스크롤과 일부 공유 이미지에 쓰인다. Codex의 diagram-design처럼 새 디자인 체계를 가져오지 않는다. 의미 패턴, 복잡도 예산과 연결선 규칙만 이 저장소의 기존 형식에 맞춰 적용한다.

## 컴포넌트

| 컴포넌트                        | 사용 위치                                        | 데이터 형식                                                                    |
| ------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| `PortfolioFlowDiagram.jsx`      | 군사법, WebRTC, IntentTrace, 청년정책메이트 상세 | `diagrams[variant]`의 `zones`, `nodes`, `edges`, `height`, `note`              |
| `BatonServiceFlowDiagram.jsx`   | BATON 서비스 상세 6개, **서비스 공유 이미지**    | `fullFlows[serviceId]`의 `node()`·`edge()` 도우미, 공유 이미지용 `compactFlow` |
| `BatonArchitectureDiagram.jsx`  | BATON 상세                                       | `NODE_DEFINITIONS`, `CONNECTIONS`                                              |
| `WarrantIntegrationDiagram.jsx` | 전자영장 상세                                    | SVG 직접 작성                                                                  |
| `HopeCommitFlowDiagram.jsx`     | Hope Commit 상세                                 | SVG 직접 작성(순서도)                                                          |

공통 스타일은 `src/css/EditorialDiagram.css`, BATON 서비스 흐름은 `BatonServiceFlowDiagram.css`다. 상세 화면에서는 `CaseShowcase.css`의 `main.case-showcase …` 규칙이 글자 크기를 키운다. 도식에 쓰는 수치는 데이터 상수(`youthPolicyCoverage` 등)에서 가져온다.

## 형식 규칙

-   **좌표계.** 너비 `viewBox` 960을 유지하고 높이만 바꾼다. 좌표와 크기는 8의 배수로 맞춘다(노드 예: 152×72, 200×160).
-   **노드.** 첫 줄은 영문 대문자 태그(`SOURCE 01`, `BATCH / FOCAL`, `DURABLE STATE`), 그다음 한국어 제목 1~2줄, 보조 설명 1~2줄이다. 강조 노드(`kind: "focal"`)는 도식이 설명하는 핵심 처리 단계에만 쓴다. 대부분 하나이고 ROUND처럼 두 경로가 대등할 때만 둘을 둔다.
-   **글자 폭.** 상세 화면에서 노드 제목은 18px, 보조 설명은 16px로 커진다. 한글 한 글자를 글자 크기만큼의 폭으로 계산하고 좌우 여백 16px씩을 뺀다. 152px 노드의 제목은 한 줄에 6~7자까지 들어간다. 넘치면 줄을 나누거나 노드를 넓힌다.
-   **연결선.** 직교 경로(`H`, `V`)와 8px 둥근 모서리(`Q`)로 그린다. 대각선과 교차를 피하고, 화살표는 노드 테두리에서 끝낸다. 보조 흐름(재처리, 실패)은 `dashed`, 핵심 흐름은 `kind: "accent"`로 표시한다.
-   **라벨.** 연결선 라벨은 배경 마스크 사각형(`label-mask`) 위에 두고 선과 겹치지 않게 한다. 짧은 조건만 쓴다(`조건 같음`, `통과`, `실패`).
-   **복잡도.** 노드는 9개 이하, 영역(`zones`)은 3~4개 이하로 둔다. 더 필요하면 도식을 나누거나 상세 본문으로 옮긴다.
-   **접근성.** `<title>`과 `<desc>`에 흐름 전체를 문장으로 쓰고 `aria-labelledby`로 연결한다. 가로 스크롤 영역에는 `role="region"`, `aria-label`, `tabIndex={0}`, `useCenteredDiagramViewport`를 유지한다. 테스트가 이 구조를 확인한다.

## 의미 맞추기

도식은 본문 설명을 그림으로 옮긴 것이므로 본문과 같은 사실만 담는다.

1. 상세 데이터(`projects.js`, `batonServicePresentation.js`)의 처리 순서, 상태 이름과 검증 범위를 먼저 읽는다.
2. 도식이 보여 줄 질문 하나를 정한다. 예: "결과가 확인되지 않은 전송을 어떻게 처리하는가". 그 질문에 필요 없는 노드는 넣지 않는다.
3. 미구현이거나 미검증인 단계는 점선, `개발용`, `모의` 같은 표시로 구분한다. 공유 이미지는 본문 없이 보이므로 테스트 데이터 여부를 도식 안에 표시한다.
4. 라벨과 제목의 표현은 `portfolio-copy`의 원칙을 따른다. 영어 태그 외에는 한국어 업무 용어를 쓴다.

## 확인

1. `npm run check:file -- <변경 파일...>`로 형식과 도식 테스트(`*Diagram.test.jsx`)를 확인한다. 공유 이미지 문구를 검사하는 테스트도 있으므로 표현을 바꿨으면 기대값을 함께 맞춘다.
2. 화면을 캡처해 자동 검사를 실행한다.

    ```bash
    node .claude/skills/portfolio-visual-check/scripts/capture.mjs --routes <경로> \
      --selector ".editorial-diagram__viewport, .baton-service-flow__viewport" \
      --contrast ".editorial-diagram, .baton-service-flow" --scale 2 --label diagram-<주제>
    ```

    도식 글자 넘침과 대비 실패는 고친다. 라벨 마스크 경고는 캡처에서 선과 겹치는지 확인한다.

3. 1440px 캡처에서 정렬, 교차, 화살표 끝 위치를 직접 보고, 390px에서는 가로 스크롤 시작 위치가 가운데인지 확인한다.
4. BATON 서비스 흐름을 바꿨으면 `npm run og:generate`로 공유 이미지를 다시 만들고 `/og-preview.html?project=baton-<서비스>`와 생성된 PNG를 확인한다(`portfolio-artifacts`).

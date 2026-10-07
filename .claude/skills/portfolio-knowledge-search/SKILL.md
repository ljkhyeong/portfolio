---
name: portfolio-knowledge-search
description: 포트폴리오의 공개 문서 검색과 AI 답변(RAG) 기능을 다룰 때 사용한다. `knowledge-api/`의 Spring Boot 검색 API, Elasticsearch·Nori 색인, BM25·벡터 RRF 순위, OpenAI·Ollama 프로필, 답변 캐시, Turnstile, 동기화·평가 도구, 검색 자료 생성(`knowledgeCorpus.js`, `public/knowledge/portfolio.json`)과 `/search` 화면의 요청·오류 처리가 대상이다. "검색 API", "RAG", "임베딩", "색인", "검색 품질 평가", "공개 문서 추가", "검색 결과가 이상해" 같은 요청에 사용한다.
---

# 공개 문서 검색

이 기능은 포트폴리오 데이터와 허용 목록의 공개 문서만 검색하고, 사용자가 요청할 때만 그 근거로 AI 답변을 만든다. 핵심 제약은 다음 세 가지다.

-   **공개 자료만 사용한다.** 회사 비공개 자료, Obsidian 원문, 자기소개서 초안과 연락처가 들어간 문서를 검색 자료에 넣지 않는다. 연락처 자동 검사는 일부 형식만 잡으므로 본문 diff를 직접 검토한다.
-   **검색과 답변을 분리한다.** 답변 생성이 실패해도 검색 결과와 원문 링크는 유지돼야 한다.
-   **비밀값은 서버에만 둔다.** 브라우저 환경 변수에는 API 주소와 Turnstile 공개 사이트 키만 넣는다.

실행 방법과 운영 설정의 세부 내용은 `knowledge-api/README.md`가 기준이다. 이 스킬은 변경 위치와 검증 범위를 정한다.

## 구성

| 영역           | 위치                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 검색 화면      | `src/component/search/PortfolioKnowledgePage.jsx`, `usePortfolioKnowledge.js`, `TurnstileWidget.jsx`                                |
| 요청·응답 처리 | `src/api/knowledgeSearch.js`, `knowledgeResponse.js`(평가 도구도 같은 검사 함수를 사용), `knowledgeRequestPolicy.js`                |
| 공개 자료 정의 | `src/data/knowledgeCorpus.js`의 `PUBLIC_LOCAL_DOCUMENTS`(`public/docs/**`), `PUBLIC_EXTERNAL_DOCUMENTS`(GitHub 허용 목록)           |
| 자료 생성      | `scripts/generate-knowledge-corpus.mjs`, `knowledge-corpus-core.mjs` → `public/knowledge/portfolio.json`                            |
| 외부 문서 사본 | `npm run knowledge:refresh-docs` → `docs/knowledge-document-snapshots.json`(커밋 SHA와 함께 보관)                                   |
| 동기화·평가    | `scripts/sync-knowledge-index.mjs`, `evaluate-knowledge.mjs`, `knowledge-evaluation-cases.json`(대표 질문 24개, 근거 없는 질문 4개) |
| 검색 API       | `knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/{domain,port,adapter,search,api,sync,verification,config}`           |
| CI             | `.github/workflows/knowledge-api.yml`, `knowledge-release-check.yml`, `knowledge-source-refresh.yml`                                |

## 변경별 작업

### 공개 문서를 추가하거나 바꿀 때

1. 로컬 문서는 `public/docs/` 아래에 두고 `PUBLIC_LOCAL_DOCUMENTS`에 추가한다. 외부 문서는 공개 저장소의 GitHub blob 주소를 `PUBLIC_EXTERNAL_DOCUMENTS`에 추가한다. 비공개 저장소의 문서는 추가하지 않는다.
2. 외부 문서를 추가했으면 `npm run knowledge:refresh-docs`로 사본을 받고 `docs/knowledge-document-snapshots.json`의 diff에서 본문과 출처를 검토한다.
3. `npm run knowledge:generate`로 자료를 만들고 문서 수와 바뀐 범위를 확인한다. 검색 API는 JAR에 포함된 `classpath:knowledge/portfolio.json`만 읽으므로 API를 다시 빌드해야 색인에 반영된다.
4. 새 문서가 대표 질문의 답이 되면 `knowledge-evaluation-cases.json`에 질문과 `criteria`를 추가할지 검토한다.

### 검색 API(Java)를 바꿀 때

`DependencyRulesTest`가 계층 의존을 일반 테스트처럼 막는다. 설계를 이 규칙에 맞춘다.

-   Domain → API, Service, Port, Adapter, Config 의존 금지
-   `@RestController` → Port, Adapter 직접 호출 금지
-   `@Service` → Adapter 구현체, API 의존 금지
-   Port → API, Service, Adapter, Config 의존 금지

외부 제공자(OpenAI, Ollama, Elasticsearch, Turnstile)는 Port 뒤의 Adapter로 둔다. 오류는 검색 결과를 유지하는 응답으로 변환한다. 시간 제한, 요청 크기 제한, 리다이렉트 거부 같은 기존 방어 규칙을 완화하지 않는다. AI 자동 재시도도 켜지 않는다(OpenAI `max-retries: 0`, Ollama `spring.ai.retry.max-attempts: 0`, Gateway `cf-aig-max-attempts: 1`).

호출 제한과 Turnstile 인터셉터는 `WebConfiguration`의 경로별 등록과 `includeHttpMethods(POST)`로 적용하고, URI 문자열로 요청 종류를 판별하지 않는다. 클라이언트 주소는 `server.forward-headers-strategy: native`가 정한 `remoteAddr`만 쓰며 `X-Forwarded-For`를 직접 해석하지 않는다.

설정 기본값은 `KnowledgeProperties`의 `@DefaultValue`에만 둔다. `knowledge.*` 환경변수는 완화 바인딩 이름(`KNOWLEDGE_SYNC_KEY` → `knowledge.sync.key`)을 쓰고, `application.yml`에 `${환경변수:기본값}` 매핑을 다시 만들지 않는다. AI 제공자는 Spring 프로필(`openai`, `ollama`, `ai-gateway`)로만 고른다.

HTTP 오류 본문은 `GlobalExceptionHandler`가 RFC 9457 `ProblemDetail`과 `code`로 만든다. 인터셉터와 컨트롤러는 응답을 직접 쓰지 않고 `KnowledgeApiException`을 던지며, Spring 표준 오류의 한글 문구는 `messages.properties`에 둔다. 웹이 읽는 `detail`, `code`와 `Retry-After`를 바꾸면 `src/api/knowledgeSearch.js`와 테스트를 함께 고친다.

| 범위           | 명령(`knowledge-api/`에서 실행)                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 파일 작성 직후 | `npm run check:file -- <파일...>`(루트에서 실행, Java 아키텍처 규칙 포함)                                                                          |
| 단위 테스트    | `./gradlew test`                                                                                                                                   |
| 통합 테스트    | 루트에서 `docker build -f knowledge-api/elasticsearch.Dockerfile -t portfolio-knowledge-elasticsearch:9.4.8-nori .` 후 `./gradlew integrationTest` |
| 배포 파일      | `./gradlew bootJar`                                                                                                                                |

Docker가 없거나 이미지를 만들지 못하면 `integrationTest`는 건너뛰지 않고 실패한다. 이때는 통합 테스트를 실행하지 않았다고 기록한다. 단위 테스트 통과를 통합 검증으로 보고하지 않는다. 청크 길이나 겹침, 임베딩 모델이나 차원을 바꾸면 다음 동기화가 새 색인에 전체 재색인한 뒤 alias를 교체한다. alias 이름(`KNOWLEDGE_ELASTICSEARCH_INDEX_NAME`)을 바꾸라고 안내하지 않는다.

### 검색 화면을 바꿀 때

`src/api/*.test.js`, `src/component/search/*.test.jsx`를 실행한다. 대기, 검색 중, 오류, 결과 없음, 답변 생성, 답변 실패, Turnstile 실패 상태의 문구와 배치를 확인한다. 화면 문구는 `portfolio-copy`, 배치는 `portfolio-ui` 기준을 따른다. API 없이 확인했으면 그 사실을 기록한다.

## 비용과 운영 작업

-   `npm run knowledge:evaluate -- --answers`와 OpenAI 프로필의 검색은 실제 모델 비용이 든다. 사용자가 요청했거나 승인했을 때만 실행한다.
-   `knowledge:sync`는 대상 API의 색인을 바꾼다. 운영 주소를 대상으로 실행하기 전에 사용자에게 확인한다. 로컬 API에는 바로 실행해도 된다.
-   `KNOWLEDGE_SYNC_KEY`, API 키, 토큰 값은 출력하거나 파일에 쓰지 않는다. 예시는 `.env.example`, `.env.integrations.example`의 변수 이름만 사용한다.
-   프런트엔드 문구만 바꾼 작업에서는 서버 테스트를 실행하지 않는다.

## 기록

실행한 Gradle·npm 명령, Docker 사용 여부, 평가 지표(상위 5건 적중률, MRR@5)와 실행하지 않은 검증을 `output/validation/last-run.md`에 남긴다. 긴 Gradle 로그는 `output/validation/<주제>-*.log`에 저장하고 실패 부분만 읽는다.

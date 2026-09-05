# RAG API와 검증 로직 정리

검토 및 반영일: 2026-09-05. 최초 검토 기준: `890dcc9`, 검토 문서 커밋: `0604196`.
범위: `knowledge-api`의 검색, 답변 생성, 동기화, 요청 검증과 설정.
Java 21, Spring Boot 4.1.0, Spring AI 2.0.0, Elasticsearch Java Client 8.19.19를 유지했다.

## 반영한 항목

| 항목 | 변경 | 확인 |
| --- | --- | --- |
| 검색마다 인덱스 존재·매핑 조회 | [KnowledgeIndexInitializer](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/index/KnowledgeIndexInitializer.java)에서 첫 검색 때 한 번 검사하고 동기화 때 재검사한다. | 동시 요청의 중복 초기화 방지, 실패 후 재시도, 재검사 실패 시 이전 성공 상태 폐기. |
| 모든 런타임 예외를 저장소 장애로 변환 | `IOException`과 `ElasticsearchException`만 변환한다. | 통신·서버 오류는 대체 처리하고 SDK 요청 생성 오류는 전파. |
| 답변 문장 비교와 인용 번호 파싱 | `ChatClient.entity()`로 `answerable`, 문단 본문과 근거 ID를 받는다. | JSON 변환 실패, 근거 부족, 누락 필드와 제공하지 않은 ID 처리. 추가 AI 재시도 없음. |
| 문서 필수값 직접 검사 | [KnowledgeSourceDocument](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/domain/KnowledgeSourceDocument.java)의 `@NotBlank`와 로더의 `Validator`로 위임한다. 사전 `resource.exists()`도 제거했다. | 필수값 검사 전 비공개 문서 제외, 공개 문서의 빈 제목 거부. |
| 설정 접근자 반복 | [KnowledgeProperties](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/config/KnowledgeProperties.java)를 중첩 record와 `@DefaultValue`, enum 바인딩으로 변경했다. | 기본값, 잘못된 제공자와 수치 설정, 청크 겹침 조건, 0 이하 호출 제한의 비활성화 유지. |
| 작은 중복 처리 | 컨트롤러의 중복 `strip()` 제거, `Retry-After` 계산을 `Math.ceilDiv()`로 통일했다. | 기존 HTTP 계약과 분 경계의 올림·호출 제한 테스트 통과. |

인덱스가 이미 있으면 최초 검사 이후 검색마다 발생하던 Elasticsearch 요청 2회를 생략한다. 실제 지연 시간이나 처리량을 측정한 결과는 아니다.
실행 중 외부에서 인덱스를 교체한 경우에는 내부 동기화 또는 앱 재시작으로 다시 검사한다.

[답변 서비스](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/search/KnowledgeAnswerService.java)는 검증된 근거를 사용 순서대로 번호 매겨 본문과 출처 목록을 맞춘다.
예를 들어 검색 결과 중 두 번째 문서만 인용하면 본문과 화면의 첫 출처가 모두 `[1]`을 사용한다. 응답 DTO와 프런트엔드 형식은 유지했다.

`AI_PROFILE`의 빈 값은 Spring 기본값 바인딩에 따라 `disabled`가 된다. `opneai` 같은 잘못된 이름은 기동 오류로 처리한다.
JSON 변환과 기본값 처리는 [Spring AI ChatClient](https://docs.spring.io/spring-ai/reference/api/chatclient.html), [Spring Boot 생성자 바인딩](https://docs.spring.io/spring-boot/reference/features/external-config.html#features.external-config.typesafe-configuration-properties.constructor-binding)을 따른다.

## 유지한 구현과 검증

- 공개 문서 필터, 빈 목록으로 전체 자료를 삭제하지 않도록 하는 조건, 중복 문서 ID와 원문 링크 검사.
- 임베딩 개수·차원, 인덱스의 모델·차원·청크 설정 호환성.
- 문서별 청크 수와 `sourceHash`를 비교하는 부분 색인 실패 복구, 새 청크 색인 후 이전 청크 삭제, 벌크·삭제 응답의 실패 확인.
- BM25 근거가 없으면 AI 호출을 생략하는 정책, 문단별 인용 ID 확인.
- 내부 동기화 키와 요청 DTO 검증, Bucket4j의 전역·클라이언트 한도와 버킷 수 제한.

| 즉시 교체하지 않은 항목 | 이유 |
| --- | --- |
| `KnowledgeChunker` → `TokenTextSplitter` | 현재는 글자 수와 겹침 기준이다. Spring AI 2.0.0의 토큰 분할기는 동일한 겹침 설정을 지원하지 않아 검색 품질 비교와 재색인이 필요하다. [Spring AI ETL](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html). |
| Elasticsearch 클라이언트 → Boot 자동 설정 | 현재 8.19.19 클라이언트를 고정했다. Boot 4.1.0의 관리 버전 9.4.2 및 `Rest5Client`와 호환성을 맞춘 뒤 검토해야 한다. [Spring Boot Elasticsearch](https://docs.spring.io/spring-boot/reference/data/nosql.html#data.nosql.elasticsearch). |
| `RrfRanker` → 기본 문서 결합기 | 기본 결합·중복 제거는 RRF 순위 계산을 대체하지 않는다. [Spring AI RAG](https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html). |

## 검증 범위

`./gradlew test integrationTest bootJar`로 단위 테스트, Elasticsearch 8.19.20 통합 테스트 3개와 실행 JAR 빌드를 통과했다.
마지막 설정 변경은 관련 설정 테스트와 JAR 빌드만 다시 확인했다. 최초 테스트에서 기대한 빈 제공자 값의 거부는 Spring 기본값 처리와 달라, 기본값을 허용하고 잘못된 이름을 거부하는 기준으로 조정했다.
실제 OpenAI·Ollama 호출과 검색 품질 평가는 실행하지 않았다. 프런트엔드와 공개 검색 자료는 변경하지 않아 웹 빌드와 산출물 생성은 반복하지 않았다.

## 추가 검토 반영 — `2a4d028` 검토 후

### 1. HTTP 오류 응답의 Spring 제공 헤더 보존

[GlobalExceptionHandler](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/api/GlobalExceptionHandler.java)의 405·415 응답에 `exception.getStatusCode()`와 `exception.getHeaders()`를 적용했다.
기존 한글 오류 본문을 유지하며, 405에서는 `Allow: POST`, 415에서는 `Accept: application/json`을 반환한다. 기존 HTTP 계약 테스트에서 두 헤더를 확인했다.
[Spring HTTP 메소드 예외](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/HttpRequestMethodNotSupportedException.html), [Spring 미디어 타입 예외](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/HttpMediaTypeNotSupportedException.html).

### 2. 자동 설정된 `ChatClient.Builder` 주입

[AiPortConfiguration](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/config/AiPortConfiguration.java)은 `ObjectProvider<ChatClient.Builder>`로 빌더를 받아 답변 어댑터에 전달한다.
어댑터는 이 빌더에 시스템 지침과 `NoOpTemplateRenderer`를 적용한다. `disabled` 프로필에서는 빌더 없이 기동하고, AI를 켠 상태에서 빌더가 없으면 설정 오류로 시작을 중단한다.

Spring AI 2.0.0의 실제 자동 설정과 가짜 ChatModel을 사용한 테스트에서 빌더 커스터마이저의 공통 옵션과 `spring.ai.chat.client` 관측 이벤트를 확인했다.
이는 앱 내부 설정의 연결 검증이며 운영 추적 서버로의 전송을 확인한 것은 아니다. [ChatClient 공식 문서](https://docs.spring.io/spring-ai/reference/api/chatclient.html).

### 3. 필터 정규화 중복 제거

[KnowledgeSearchService](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/search/KnowledgeSearchService.java)의 `normalizeFilterValues()`에서 null 처리, 공백 제거, 소문자 변환, 빈 값 제외와 중복 제거를 공통 수행한다.
문서 종류의 허용값 검사는 유지했다. 누락된 필터, 중복·공백·대문자가 있는 필터와 지원하지 않는 문서 종류를 관련 테스트에서 확인했다.

### 확인 범위

관련 테스트 39개와 `bootJar`를 통과했다. HTTP 계약, AI 설정 및 답변 어댑터, 검색·답변 서비스와 기본 프로필의 readiness 테스트를 선택 실행했다.
이번에 변경하지 않은 Elasticsearch 색인 통합 테스트, 웹 빌드와 PDF·OG 생성은 반복하지 않았다. 실제 OpenAI·Ollama 호출도 실행하지 않았다.

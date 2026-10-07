# RAG API와 검증 로직 정리

검토 및 반영일: 2026-09-05~06. 최초 검토 기준: `890dcc9`, 검토 문서 커밋: `0604196`.
범위: `knowledge-api`의 검색, 답변 생성, 동기화, 요청 검증과 설정.
Java 21, Spring Boot 4.1.0, Spring AI 2.0.0, Elasticsearch Java Client 8.19.19를 유지했다.

## 반영한 항목

| 항목                                  | 변경                                                                                                                                                                                                                | 확인                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 검색마다 인덱스 존재·매핑 조회        | 첫 검색 때 한 번 검사하던 초기화 클래스를 이후 alias 교체 방식으로 바꾸며 삭제했다. 검색은 alias를 바로 조회하고 호환성은 동기화가 매핑 `_meta`로 확인한다.                                                         | 첫 동기화 전 빈 결과, 다른 임베딩 모델 벡터 제외, 설정이 바뀌면 전체 재색인.         |
| 모든 런타임 예외를 저장소 장애로 변환 | `IOException`과 `ElasticsearchException`만 변환한다.                                                                                                                                                                | 통신·서버 오류는 대체 처리하고 SDK 요청 생성 오류는 전파.                            |
| 답변 문장 비교와 인용 번호 파싱       | `ChatClient.entity()`로 `answerable`, 문단 본문과 근거 ID를 받는다.                                                                                                                                                 | JSON 변환 실패, 근거 부족, 누락 필드와 제공하지 않은 ID 처리. 추가 AI 재시도 없음.   |
| 문서 필수값 직접 검사                 | [KnowledgeSourceDocument](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/domain/KnowledgeSourceDocument.java)의 `@NotBlank`와 로더의 `Validator`로 위임한다. 사전 `resource.exists()`도 제거했다. | 필수값 검사 전 비공개 문서 제외, 공개 문서의 빈 제목 거부.                           |
| 설정 접근자 반복                      | [KnowledgeProperties](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/config/KnowledgeProperties.java)를 중첩 record와 `@DefaultValue`, enum 바인딩으로 변경했다.                                  | 기본값, 잘못된 제공자와 수치 설정, 청크 겹침 조건, 0 이하 호출 제한의 비활성화 유지. |
| 작은 중복 처리                        | 컨트롤러의 중복 `strip()` 제거, `Retry-After` 계산을 `Math.ceilDiv()`로 통일했다.                                                                                                                                   | 기존 HTTP 계약과 분 경계의 올림·호출 제한 테스트 통과.                               |

검색 경로에서 인덱스 존재와 매핑을 확인하던 Elasticsearch 요청이 없어졌다. 실제 지연 시간이나 처리량을 측정한 결과는 아니다.

[답변 서비스](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/search/KnowledgeAnswerService.java)는 검증된 근거를 사용 순서대로 번호 매겨 본문과 출처 목록을 맞춘다.
예를 들어 검색 결과 중 두 번째 문서만 인용하면 본문과 화면의 첫 출처가 모두 `[1]`을 사용한다. 응답 DTO와 프런트엔드 형식은 유지했다.

`AI_PROFILE`의 빈 값은 Spring 기본값 바인딩에 따라 `disabled`가 된다. `opneai` 같은 잘못된 이름은 기동 오류로 처리한다.
JSON 변환과 기본값 처리는 [Spring AI ChatClient](https://docs.spring.io/spring-ai/reference/api/chatclient.html), [Spring Boot 생성자 바인딩](https://docs.spring.io/spring-boot/reference/features/external-config.html#features.external-config.typesafe-configuration-properties.constructor-binding)을 따른다.

## 유지한 구현과 검증

-   공개 문서 필터, 빈 목록으로 전체 자료를 삭제하지 않도록 하는 조건, 중복 문서 ID와 원문 링크 검사.
-   임베딩 개수와 차원은 `SpringAiEmbeddingAdapter`와 `EmbeddingPort` 계약으로, 인덱스의 모델·차원·청크 설정은 동기화의 `_meta` 비교로 확인한다(이후 변경).
-   문서별 부분 색인 복구는 이후 새 색인 전체 색인과 alias 원자 교체로 바꿨다. 교체 전 전체 청크 수와 벌크 응답의 실패를 확인하고, 실패하면 새 색인을 지운다.
-   BM25 근거가 없으면 AI 호출을 생략하는 정책, 문단별 인용 ID 확인.
-   내부 동기화 키와 요청 DTO 검증, 전역·클라이언트 호출 한도와 분당 클라이언트 수 제한(이후 Bucket4j를 고정 창 카운터로 교체).

| 즉시 교체하지 않은 항목                   | 이유                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `KnowledgeChunker` → `TokenTextSplitter`  | 현재는 글자 수와 겹침 기준이다. Spring AI 2.0.0의 토큰 분할기는 동일한 겹침 설정을 지원하지 않아 검색 품질 비교와 재색인이 필요하다. [Spring AI ETL](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html).                                                                                          |
| Elasticsearch 클라이언트 → Boot 자동 설정 | 이후 반영했다. 서버를 9.4.8로 올리고 Boot 관리 클라이언트 9.4.2, `Rest5Client` 자동 설정과 기본 상태 지표를 사용한다. 응답 대기 시간은 `socket-timeout`과 같게 맞추고 리다이렉트를 거부한다. [Spring Boot Elasticsearch](https://docs.spring.io/spring-boot/reference/data/nosql.html#data.nosql.elasticsearch). |
| `RrfRanker` → 기본 문서 결합기            | 기본 결합·중복 제거는 RRF 순위 계산을 대체하지 않는다. [Spring AI RAG](https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html).                                                                                                                                                      |

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
문서 종류의 허용값 검사는 유지했다. 누락된 필터, 중복·공백·대문자가 있는 필터와 지원하지 않는 문서 종류를 관련 테스트에서 확인했다. 이후 정규화는 `KnowledgeFilter`로, 허용값 검사는 요청 DTO로 옮겼다(아래 절).

### 확인 범위

관련 테스트 39개와 `bootJar`를 통과했다. HTTP 계약, AI 설정 및 답변 어댑터, 검색·답변 서비스와 기본 프로필의 readiness 테스트를 선택 실행했다.
이번에 변경하지 않은 Elasticsearch 색인 통합 테스트, 웹 빌드와 PDF·OG 생성은 반복하지 않았다. 실제 OpenAI·Ollama 호출도 실행하지 않았다.

## HTTP 오류 처리 반영 — `65d47d1` 검토 후

없는 API 주소가 `404` 대신 `500 INTERNAL_ERROR`를 반환하던 문제를 수정했다.
[GlobalExceptionHandler.handleUnexpected()](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/api/GlobalExceptionHandler.java)에서 일반 서버 오류로 처리하기 전에 [Spring ErrorResponse](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/ErrorResponse.html)의 상태와 헤더를 사용한다.
`NoHandlerFoundException`과 `NoResourceFoundException`을 개별 등록하지 않고 공통 인터페이스로 처리한다.

-   404는 `NOT_FOUND`와 “요청한 주소를 찾을 수 없습니다.”를 반환한다.
-   기존 전용 처리기가 없는 나머지 Spring HTTP 예외는 해당 상태·헤더와 `HTTP_ERROR`를 반환한다.
-   예상하지 못한 코드 오류는 기존처럼 로그를 남기고 `500 INTERNAL_ERROR`를 반환한다. 응답 DTO와 일반 오류 안내는 유지하며 내부 예외 메시지를 노출하지 않는다.

관련 테스트 12개와 `bootJar`를 통과했다. MockMvc로 없는 API의 404, 429와 `Retry-After` 헤더, 코드 오류의 500, 기존 400·403·405·406·415 응답을 확인했다.
별도의 로컬 HTTP 서버 테스트로 없는 정적 리소스의 404와 한글 본문을 확인했다. 실제 AI·Elasticsearch 호출과 웹 빌드는 실행하지 않았다.

## 추가 검토 결론 — `4eeedf5` 기준

요청 처리, 호출 제한, 검색·답변, 임베딩, 문서 로딩·분할과 색인 복구를 확인했다. 현재 요구사항에서 추가로 교체하거나 제거할 실익이 큰 구현은 찾지 못했다.

-   [호출 제한](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/api/KnowledgeRateLimiter.java)은 당시 Bucket4j를 사용했다. 전역·클라이언트 한도를 먼저 함께 확인하는 코드는 클라이언트 요청이 거절됐을 때 전역 토큰을 소모하지 않도록 필요하다. 버킷 수 제한은 메모리 사용을 제한한다. 이후 두 규칙을 유지한 채 고정 창 카운터로 바꿨다(아래 절).
-   요청 DTO는 입력값의 형식과 범위를, 답변 서비스는 AI가 반환한 인용 ID를 검사한다. 동기화 서비스의 임베딩 개수·차원 재검사는 이후 삭제했다. 동기화 경로에서는 두 예외가 같은 500으로 처리돼 어댑터 검사와 실제로 중복이었다.
-   당시 해시 생성(`util/Hashing`)은 이미 Java의 `MessageDigest`와 `HexFormat`을 사용했다. 이후 마지막 사용처인 답변 캐시 키를 record 값 비교로 바꾸며 삭제했다(아래 절). 임베딩 배열 변환과 짧은 DTO 매핑도 별도 의존성이나 공통 계층을 추가할 정도로 복잡하지 않다.
-   청크 분할과 RRF 결합은 현재 검색 기준을 구현한다. 인덱스 호환성과 부분 실패 검사는 이후 `_meta` 비교, 교체 전 청크 수 확인과 새 색인 삭제로 바꿨다. 벌크 결과 검사는 유지한다.

이번에는 앱 코드·테스트·의존성·설정을 변경하지 않았으며, 기존 성공 테스트와 빌드를 반복하지 않았다. 검색 품질·성능 측정과 실제 AI 호출은 이번 검토 범위에 포함하지 않았다.

## 오류 응답과 호출 제한 정리 — `c4bc019` 이후

-   오류 응답: [GlobalExceptionHandler](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/api/GlobalExceptionHandler.java)가 `ResponseEntityExceptionHandler`를 상속해 RFC 9457 `ProblemDetail`(`application/problem+json`)을 반환한다. `ApiErrorResponse`를 삭제했다. `message`는 `detail`이 되고, 업무 코드가 없는 오류의 `code`는 HTTP 상태 이름(`INVALID_REQUEST`→`BAD_REQUEST`, `HTTP_ERROR`→해당 상태 이름, `INTERNAL_ERROR`→`INTERNAL_SERVER_ERROR`)을 쓴다. 405·415의 헤더는 Spring이 유지하고, Spring MVC 표준 오류의 한글 문구는 `messages.properties`로 옮겼다. 웹은 `detail`을 읽는다. [Spring 오류 응답](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html).
-   인터셉터: 호출 제한과 Turnstile 인터셉터가 `ObjectMapper`로 본문을 직접 쓰지 않고 `ErrorResponseException` 하위 `KnowledgeApiException`을 던진다. 상태, 업무 코드, `Retry-After`와 CORS 노출 헤더는 유지한다. 내부 동기화 키 오류도 같은 예외로 바꾸고 `SyncForbiddenException`을 삭제했다.
-   입력 오류 범위: `IllegalArgumentException`을 모두 `400`과 원문 메시지로 응답하던 처리기를 삭제했다. 매니페스트 읽기·형식 오류처럼 요청과 무관한 오류는 `500`과 서버 오류 로그로 처리해 내부 메시지를 노출하지 않는다. 문서 종류 허용값은 요청 DTO의 `@Pattern`으로 검사해 `fieldErrors`로 알리고, 필터 정규화는 `KnowledgeFilter`가 맡는다.
-   호출 제한: Bucket4j를 UTC 분 단위 고정 창 카운터로 교체했다. 기존 구성(용량=한도, 분 경계 정렬 리필, 분마다 클라이언트 초기화)은 정의상 고정 창과 같아 허용·거절과 `Retry-After`(1~60초)가 바뀌지 않는다. 설정은 `knowledge.rate-limit.*`(`KNOWLEDGE_RATE_LIMIT_*`)로 옮기고 `max-client-buckets-per-minute`를 `max-clients-per-minute`로 바꿨다.

단위 테스트 273건, Elasticsearch 9.4.8 통합 테스트 10건, 웹 테스트 464건과 웹 빌드를 통과했다. 실제 Tomcat 테스트로 정적 리소스 404의 `ProblemDetail` 필드, 인코딩한 답변 경로의 `429`, 호출 제한 오류의 CORS 헤더와 `Retry-After`를 확인했다. 실제 AI·Turnstile 호출과 배포 환경 확인은 하지 않았다.

## 검색·답변 서비스와 캐시 정리 — `44d0b67` 이후

-   계층: [답변 서비스](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/search/KnowledgeAnswerService.java)가 API DTO 대신 도메인 `KnowledgeAnswer`(상태, 답변, 인용·결과 `SearchHit`)를 반환한다. 인용 전문의 평문 변환과 응답 생성은 `ResponseMapper`가 맡고, `knowledge.answers` 지표는 검색 지표처럼 서비스가 기록한다. `DependencyRulesTest`에 `@Service`가 API 패키지에 의존하지 않는 규칙을 추가했다.
-   시그니처: 검색·답변 서비스는 `(문장, KnowledgeFilter, 개수)` 하나만 두고 테스트 전용 오버로드를 삭제했다. `knowledge.search.max-limit`과 `Math.min` 제한을 지우고, 기본 개수가 요청 DTO 상한(검색 20, 답변 근거 10)을 넘으면 기동할 때 거부한다.
-   응답 필드: 읽는 곳이 없는 `results[].score`, 검색 응답의 `query`, 답변 응답의 `question`을 삭제했다. 순위는 목록 순서로 전달하고 `SearchHit`에 저장소 점수를 보관하지 않는다. 웹과 평가 도구가 쓰는 `total`과 답변 응답의 `results`는 유지한다.
-   캐시: 직접 센 `knowledge.cache.lookups`를 Micrometer `CaffeineCacheMetrics`와 `recordStats()`로 바꿔 `cache.gets{cache,result}`, `cache.size`, `cache.puts`, `cache.evictions`를 노출한다. 답변 캐시 키는 SHA-256 문자열 대신 질문과 전달 근거 목록의 record 값 비교를 사용해 `util/Hashing`을 삭제했다. 캐시 끄기는 `AI_ANSWER_CACHE_TTL_SECONDS=0` 하나로 정했다. Caffeine의 `maximumSize(0)`은 비동기 제거라 즉시 재사용을 막지 못해, 최대 개수는 1 이상만 허용한다.

단위 테스트 281건, Elasticsearch 9.4.8 통합 테스트 10건과 검색 화면·요청 처리 웹 테스트 133건을 통과했다. 같은 키의 동시 요청에서 생성 1회와 `miss` 1·`hit` 1, TTL 0에서 매번 생성, 잘못된 임베딩을 저장하지 않는 동작을 기존 테스트로 다시 확인했다. 실제 AI 호출과 검색 품질 평가는 하지 않았다(순위 계산과 색인 내용은 바뀌지 않음).

# RAG API와 검증 로직 검토

검토일: 2026-09-05. 기준 커밋: `890dcc9`.
범위: `knowledge-api/src/main/java`의 검색, 답변 생성, 동기화, API, 설정과 관련 테스트 및 의존성.
Java 21, Spring Boot 4.1.0, Spring AI 2.0.0, Elasticsearch Java Client 8.19.19를 기준으로 검토했다.

AI 호출은 이미 `ChatClient`와 `EmbeddingModel`, Elasticsearch 요청은 공식 Java Client,
호출 제한은 Bucket4j를 사용한다. 전체 RAG를 교체하기보다 아래의 반복 검사와 직접 파싱부터 정리하는 편이 좋다.

## 우선 정리할 항목

### 1. 검색할 때마다 인덱스 설정을 다시 검사한다

- 위치: [KnowledgeSearchService.java:64](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/search/KnowledgeSearchService.java#L64), [ElasticsearchKnowledgeRepository.java:73](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/adapter/elasticsearch/ElasticsearchKnowledgeRepository.java#L73).
- 현재 검색 요청마다 `ensureIndex()`를 호출한다. 인덱스가 있으면 존재 확인과 매핑 조회가 각각 실행돼 검색 전에 Elasticsearch 요청이 두 번 추가된다. 고정된 모델, 차원과 청크 설정도 매번 다시 비교한다.
- 인덱스 생성과 호환성 확인을 앱 초기화 또는 최초 접근 시 한 번 수행하고, 동기화나 인덱스 교체 시 다시 확인하는 구조를 권장한다. 첫 초기화 실패는 재시도할 수 있어야 하고, 실패를 초기화 완료로 저장하면 안 된다.
- 검증 자체는 필요하다. 요청마다 반복하는 위치와 빈도를 바꾸는 항목이다. 현재 시작 동기화는 옵션이므로 그 옵션이 꺼져 있어도 초기화할 수 있어야 한다.

### 2. Elasticsearch 예외 변환 범위가 너무 넓다

- 위치: [ElasticsearchKnowledgeRepository.java:415](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/adapter/elasticsearch/ElasticsearchKnowledgeRepository.java#L415).
- `execute()`가 모든 `RuntimeException`을 `ElasticsearchAccessException`으로 감싼다. SDK 요청을 만드는 중 발생한 잘못된 인자나 코드 오류도 검색 저장소 장애로 바뀔 수 있다.
- 벡터 검색은 이 예외를 잡아 BM25 결과로 대체하므로, 코드 오류가 정상적인 대체 응답에 가려질 수 있다. 실제 통신 및 Elasticsearch 응답 예외만 변환하고 프로그래밍 오류는 전파하도록 범위를 줄이는 편이 좋다.
- 서비스에는 이미 임의의 코드 오류를 대체 응답으로 숨기지 않는 테스트가 있다. 저장소를 거쳐 올라오는 경우에도 같은 원칙을 적용해야 한다.

### 3. AI 답변의 문장과 인용 번호를 직접 파싱한다

- 위치: [KnowledgeAnswerService.java:78](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/search/KnowledgeAnswerService.java#L78), [SpringAiAnswerGenerationAdapter.java:48](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/adapter/ai/SpringAiAnswerGenerationAdapter.java#L48).
- 특정 한국어 문장을 포함하는지로 근거 부족을 판단하고, 정규식과 `Integer.parseInt()`로 인용 번호를 뽑는다. 모델이 같은 뜻을 다른 문장으로 답하면 상태 판정이 달라진다.
- `ChatClient.call().entity(...)`로 답변 가능 여부와 문단별 근거 ID를 Java record로 받는 방식을 권장한다. 서비스가 검증한 ID를 문단에 붙여 현재의 문자열 응답 형식을 유지하면 프런트엔드 계약도 유지할 수 있다. [Spring AI ChatClient](https://docs.spring.io/spring-ai/reference/api/chatclient.html).
- JSON 변환 실패는 기존 답변 생성 불가 처리로 연결한다. 인용 ID의 범위와 근거 없는 답변 차단은 유지한다. JSON 형식이 맞는 것과 근거가 올바른 것은 다른 검사다.
- 이번 검토에서 로컬 Spring AI 2.0.0 JAR의 `entity(Class)`와 `useProviderStructuredOutput()` 지원을 확인했다. 제공자별 지원을 확인한 뒤 구조화 출력 옵션을 적용할 수 있다.
- `validateSchema()`는 기본적으로 최대 3회 재시도를 설정한다. 검증 코드를 줄인다는 이유만으로 이 자동 재시도까지 추가하지 않는다. [Spring AI 스키마 검증](https://docs.spring.io/spring-ai/reference/api/structured-output/validation.html).

## 함께 단순화할 항목

### 4. 문서의 필수값 검사를 표준 검증으로 통일한다

- 위치: [KnowledgeManifestLoader.java:73](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/sync/KnowledgeManifestLoader.java#L73).
- 여덟 필드를 `requireText()`로 직접 검사한다. 문서 record의 `@NotBlank`와 주입받은 `jakarta.validation.Validator`로 공통 필수값 검사를 위임할 수 있다. 검증 의존성은 이미 있다. [Spring Bean Validation](https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html).
- JSON을 `ObjectMapper`로 읽는 것만으로 Bean Validation이 실행되지는 않는다. 현재처럼 공개 문서를 먼저 걸러낸 뒤 로더에서 명시적으로 검증하고, 기존 오류 응답으로 변환해야 한다.
- 중복 문서 ID, 지원 스키마, `sourceUrl` 또는 `route` 필요 여부는 문서 간 관계나 업무 조건이므로 유지한다. 별도 커스텀 검증 어노테이션을 만드는 것은 필요하지 않다.
- `resource.exists()` 후 `getInputStream()`으로 다시 읽는 사전 존재 검사도 제거할 수 있다. 읽기 실패를 현재의 `IOException` 처리에서 보고하면 된다.

### 5. 설정 클래스의 반복 접근자 코드를 줄인다

- 위치: [KnowledgeProperties.java](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/config/KnowledgeProperties.java).
- 319줄 중 상당 부분이 필드와 getter/setter다. 중첩 record와 `@ConfigurationProperties`, `@DefaultValue`로 변경하면 불변 설정을 간단히 표현할 수 있다. 현재 앱은 이미 `@EnableConfigurationProperties`를 사용한다. [Spring Boot 생성자 바인딩](https://docs.spring.io/spring-boot/reference/features/external-config.html#features.external-config.typesafe-configuration-properties.constructor-binding).
- 문자열 provider의 허용값 확인은 enum 바인딩으로 대체할 수 있다. 필요한 범위 검사는 `@Validated`와 기본 제약으로 시작 시 확인한다.
- 기존 기본값과 환경 변수 이름은 유지한다. 청크 겹침이 청크 크기보다 작아야 한다는 관계 검사는 한 곳에 남긴다. 동작 결함 수정이 아닌 유지보수성 개선이다.

### 6. 작은 중복 처리 두 곳을 정리한다

- [KnowledgeController.java:40](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/api/KnowledgeController.java#L40): 요청 record 생성자에서 이미 `strip()`한 검색어와 질문을 컨트롤러에서 다시 처리한다. 컨트롤러의 두 호출은 제거할 수 있다. 서비스의 정규화는 HTTP 외 호출 허용 여부에 맞춰 결정한다.
- [KnowledgeRateLimiter.java:89](../knowledge-api/src/main/java/com/ljkhyeong/portfolio/knowledge/api/KnowledgeRateLimiter.java#L89): 초 단위 올림을 나눗셈과 나머지 조건으로 직접 계산한다. 같은 클래스의 다른 메서드처럼 Java 21의 `Math.ceilDiv()`로 통일할 수 있다.

## 즉시 대체하지 않을 부분

| 후보 | 판단 |
| --- | --- |
| `KnowledgeChunker` → `TokenTextSplitter` | 검토할 수 있지만 동일한 동작은 아니다. 현재는 글자 수와 150자 겹침을 사용한다. 로컬 2.0.0의 `TokenTextSplitter.Builder`는 토큰 수 기준이며 겹침 설정 API가 없다. 교체 시 검색 품질 비교와 청크 설정 지문 변경, 전체 재색인이 필요하다. [Spring AI ETL](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html). |
| `ElasticsearchKnowledgeRepository` → Boot 자동 설정 | Boot 자동 설정은 `Rest5Client`를 사용한다. 현재는 8.19.19 클라이언트를 고정했으며 Boot 4.1.0 BOM은 9.4.2를 관리한다. 버전 호환성을 먼저 맞춰야 한다. 현재 클라이언트를 Spring 빈으로 분리할 수는 있지만 저장소 전체가 불필요한 직접 구현인 것은 아니다. [Spring Boot Elasticsearch](https://docs.spring.io/spring-boot/reference/data/nosql.html#data.nosql.elasticsearch). |
| `RrfRanker` → 기본 RAG Advisor | 현재 짧은 RRF 구현은 두 검색 순위 결합과 동점 순서를 담당한다. 기본 `ConcatenationDocumentJoiner`는 단순 결합 및 중복 제거이므로 동일한 대체재가 아니다. [Spring AI RAG](https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html). |
| 요청 제한 전체 교체 | 이미 Bucket4j를 사용한다. 전역과 클라이언트 버킷의 소비를 함께 결정하는 동기화, 버킷 수 제한과 프록시 신뢰 설정은 서비스 정책이므로 유지한다. |

## 유지할 검증

- 공개 문서만 색인하고 빈 목록의 실수로 기존 문서를 전부 삭제하지 않도록 막는 조건.
- 모델, 벡터 차원과 청크 설정의 호환성. 임베딩 결과 개수와 차원 확인.
- 문서별 청크 수와 sourceHash를 비교해 부분 색인을 완료로 오인하지 않는 처리.
- 새 청크를 색인한 뒤 이전 청크를 삭제하는 순서와 벌크 및 삭제 응답의 부분 실패 확인.
- BM25 근거가 없으면 AI 호출을 생략하는 정책, 제공하지 않은 인용 ID 차단.
- 내부 동기화 키 확인과 요청 DTO의 `@NotBlank`, 길이 및 개수 제한.

## 검토 결과와 다음 확인

앱 코드는 변경하지 않았다. 소스, 기존 테스트와 공식 문서, 로컬 JAR API를 대조한 검토이며 실제 AI 호출이나 Elasticsearch 부하 측정은 하지 않았다.
검토 문서만 추가하므로 서버 테스트, 프런트엔드 빌드와 이미지 생성은 실행하지 않는다.

수정 시에는 인덱스 반복 검사와 예외 변환 범위를 먼저 정리하고, 구조화 답변을 별도 변경으로 적용하는 순서를 권장한다.
관련 검증은 초기화 후 추가 매핑 조회가 없는지, 통신 장애와 코드 오류가 구분되는지, 근거 부족과 잘못된 인용이 기존 응답 상태로 처리되는지에 한정한다.

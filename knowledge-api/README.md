# 포트폴리오 공개 기술문서 검색 API

포트폴리오에 공개한 프로젝트 설명과 대표 문서를 Elasticsearch에 색인하고, BM25와 벡터 검색 결과를 Java RRF로 결합하는 Spring Boot API입니다. AI 답변은 검색된 공개 근거만 전달해 생성하며, 제공자 오류가 발생해도 문서 검색 결과는 유지합니다.

## 실행 구성

-   Java 21
-   Spring Boot 4.1.0
-   Spring AI 2.0.0
-   Elasticsearch 8.19.20 + 한국어 분석기 Nori
-   운영 AI: OpenAI
-   로컬 AI: Ollama

Spring AI 2.0.x는 Spring Boot 4.0 및 4.1을 지원합니다. 버전 기준은 [Spring AI Getting Started](https://docs.spring.io/spring-ai/reference/getting-started.html)에서 확인할 수 있습니다.

## 기본 실행

기본 프로필은 `disabled`입니다. API 키 없이 기동하고, 공개 문서를 임베딩 없이 색인해 BM25 검색만 제공합니다. AI 답변 요청은 `GENERATION_UNAVAILABLE`과 기존 검색 결과를 반환합니다.

```bash
cd knowledge-api
docker compose up --build
```

애플리케이션만 실행할 때는 Elasticsearch를 먼저 실행한 뒤 다음 명령을 사용합니다.

```bash
KNOWLEDGE_SYNC_ON_STARTUP=true ./gradlew bootRun
```

`KNOWLEDGE_SYNC_ON_STARTUP`을 설정하지 않으면 애플리케이션은 기존 인덱스를 조회하되 시작 시 공개 문서를 색인하지 않습니다. 시작 동기화를 끈 환경에서는 `KNOWLEDGE_SYNC_KEY`를 설정하고 아래의 내부 동기화 API를 한 번 호출해야 합니다.

인덱스 생성과 호환성 검사는 첫 검색에서 한 번 수행하고 동기화 때 다시 실행합니다. 초기화 실패는 다음 요청에서 재시도합니다. 실행 중 외부에서 인덱스를 교체했다면 내부 동기화를 호출하거나 앱을 재시작해야 호환성을 다시 확인합니다.

빌드 시 루트의 `public/knowledge/portfolio.json`을 생성 리소스 디렉터리로 복사합니다. JAR에 별도 문서 사본을 직접 관리하지 않으므로 원본과 색인 자료가 달라지는 문제를 막습니다.

## OpenAI 운영 프로필

```bash
AI_PROFILE=openai \
OPENAI_API_KEY=... \
docker compose up --build
```

기본 모델은 `gpt-5-mini`, 임베딩 모델은 `text-embedding-3-large` 1024차원입니다. OpenAI의 임베딩 API는 `text-embedding-3` 계열에서 출력 차원 설정을 지원합니다. [OpenAI Embeddings API](https://developers.openai.com/api/reference/resources/embeddings/methods/create)

API 키는 백엔드 환경 변수에만 설정하며 React의 `VITE_*` 환경 변수에 넣지 않습니다.

## Ollama 로컬 프로필

Ollama 컨테이너와 모델을 먼저 준비합니다.

```bash
docker compose --profile ollama up -d elasticsearch ollama
docker compose exec ollama ollama pull qwen3:8b
docker compose exec ollama ollama pull bge-m3
AI_PROFILE=ollama docker compose --profile ollama up --build knowledge-api
```

프로필별 기본 인덱스는 `portfolio-knowledge-disabled-v3`, `portfolio-knowledge-openai-v3`, `portfolio-knowledge-ollama-v3`로 분리됩니다. Compose에서 `ELASTICSEARCH_INDEX`를 설정하면 사용자 지정 이름을 우선 사용합니다. 임베딩 모델 또는 차원을 변경하면 기존 벡터와 호환되지 않으므로 새 인덱스 이름으로 전체 문서를 다시 색인해야 합니다.

`AI_PROFILE`은 `disabled`, `openai`, `ollama`를 허용하며, 빈 값은 기본값 `disabled`로 바인딩합니다. 철자가 틀린 값은 AI가 비활성화된 상태로 기동하지 않고 설정 오류로 시작을 중단합니다.

## API

### 문서 검색

```http
POST /api/v1/knowledge/search
Content-Type: application/json

{
  "query": "BATON 알림 아웃박스는 어떻게 복구하나요?",
  "projectIds": ["baton"],
  "documentTypes": ["problem_solution"],
  "limit": 10
}
```

응답의 `results`에는 `chunkId`, 프로젝트와 서비스, 문서 종류, 제목, 관련 문단, 원문 URL 또는 포트폴리오 경로와 RRF 점수가 포함됩니다.

### 근거 기반 답변

```http
POST /api/v1/knowledge/answers
Content-Type: application/json

{
  "question": "BATON 알림 아웃박스는 어떻게 복구하나요?",
  "projectIds": ["baton"],
  "documentTypes": ["problem_solution"],
  "limit": 6
}
```

답변 상태는 다음 세 가지입니다.

-   `GENERATED`: 답변과 검증된 인용을 반환합니다.
-   `INSUFFICIENT_EVIDENCE`: 관련 공개 근거가 부족해 답변을 만들지 않습니다.
-   `GENERATION_UNAVAILABLE`: AI 제공자 오류 또는 설정 없음으로 답변을 만들지 않고 검색 결과만 반환합니다.

Spring AI가 자동 설정한 `ChatClient.Builder`를 주입받아 공통 옵션과 메트릭·추적 설정을 적용합니다. `ChatClient.entity()`로 답변 가능 여부와 문단별 본문·근거 ID를 받습니다. 서비스는 각 문단의 근거 ID를 확인하고 인용 순서대로 `[1]` 번호와 출처 목록을 만듭니다. 제공하지 않은 ID, 인용이 없는 문단이나 잘못된 JSON은 `GENERATION_UNAVAILABLE`로 처리합니다. JSON 형식을 고치기 위한 추가 AI 호출은 하지 않습니다. [Spring AI ChatClient](https://docs.spring.io/spring-ai/reference/api/chatclient.html).

벡터 검색 결과만 있고 BM25 키워드 검색에서 적중한 문서가 없으면 AI를 호출하지 않습니다. 이 조건은 질문과 직접 일치하는 공개 문서가 없는 상태에서 의미상 가까운 문서만으로 답변을 만드는 일을 막습니다.

## 동기화

루트의 `npm run knowledge:refresh-docs`는 허용 목록 중 공개 문서 6건을 가져와
`docs/knowledge-document-snapshots.json`에 원본 커밋과 함께 저장합니다. 본문 diff를 검토한 뒤
`npm run knowledge:generate`로 검색 자료를 생성합니다. 일반 빌드에서는 보관된 본문만 사용하며 외부 문서를 다시 내려받지 않습니다.

증분 동기화는 본문, 제목, 링크 등 공개 입력 전체를 계산한 `sourceHash`로 변경 여부를 판단합니다. `contentHash`는 본문만의 변경 이력을 확인할 수 있도록 각 청크에 함께 저장합니다. 변경된 청크를 먼저 upsert한 뒤 더 이상 사용하지 않는 이전 청크를 삭제하므로 벌크 색인 실패 시 기존 전체 문서가 먼저 사라지지 않습니다. 문서 목록에서 빠진 항목은 Elasticsearch에서 삭제합니다.

최대 청크 길이와 겹침 범위는 Elasticsearch 인덱스 매핑에 호환성 지문으로 저장합니다. 두 값 중 하나를 바꾸면 기존 인덱스를 재사용하지 않으므로 `ELASTICSEARCH_INDEX`에 새 이름을 지정한 뒤 전체 문서를 다시 색인해야 합니다.

문서 0건인 목록은 생성 오류로 간주해 기본적으로 동기화를 거부합니다. 전체 삭제가 의도된 별도 작업에서만 `KNOWLEDGE_ALLOW_EMPTY=true`를 설정합니다.

수동 동기화를 사용하려면 `KNOWLEDGE_SYNC_KEY`를 설정합니다.

```http
POST /internal/v1/knowledge/sync
X-Knowledge-Sync-Key: 설정한 값
```

외부 주소를 요청 본문으로 받지 않고 서버에 설정된 `KNOWLEDGE_SOURCE_LOCATION`만 읽습니다.

## 비용 제한과 프록시 주소

AI 답변 생성은 기본적으로 인스턴스 전체 분당 30회, 클라이언트별 5회로 제한합니다. OpenAI 프로필에서는 검색 질문의 임베딩에도 비용이 발생하므로 검색은 전체 300회, 클라이언트별 30회로 제한합니다. 초과 시 `429`와 `Retry-After`를 반환하며 브라우저 JavaScript에서도 `Retry-After`를 읽을 수 있게 CORS 응답 헤더로 노출합니다. CORS 사전 요청인 `OPTIONS`는 횟수에 포함하지 않습니다.

요청 종류별로 한 분 동안 최대 100개의 클라이언트 버킷을 유지합니다. 상한에 도달하면 이미 등록된 클라이언트의 제한은 계속 적용하고, 새로운 클라이언트는 다음 분까지 `429`로 차단합니다. `AI_MAX_CLIENT_BUCKETS_PER_MINUTE`로 상한을 조정할 수 있으며 0 이하이면 상한을 적용하지 않습니다.

클라이언트 구분에는 기본적으로 소켓의 `remoteAddr`를 사용합니다. `AI_TRUST_PROXY_HEADERS=true`는 신뢰하는 프록시가 외부 입력의 `X-Forwarded-For`를 제거하고 새 값으로 설정하는 환경에서만 사용해야 합니다.

현재 호출 제한 카운터는 인스턴스 메모리에 저장됩니다. 서버를 여러 대로 확장하면 인스턴스별로 한도가 따로 적용되므로 API Gateway 또는 Redis 기반의 공유 호출 제한으로 교체해야 합니다. 역방향 프록시 뒤에서는 프록시가 외부의 전달 헤더를 덮어쓰도록 설정하고, 신뢰할 수 있는 구간에서만 `AI_TRUST_PROXY_HEADERS`를 활성화합니다.

Compose의 Knowledge API 상태 확인은 Elasticsearch 연결을 포함한 `/actuator/health/readiness`를 사용합니다. Elasticsearch가 응답하지 않으면 readiness는 `DOWN`과 HTTP `503`을 반환합니다.

`docker-compose.yml`의 Elasticsearch 보안 비활성화 설정은 로컬 개발용입니다. 공개 운영 환경에서는 TLS와 인증이 설정된 관리형 Elasticsearch를 사용하거나 Elasticsearch를 비공개 네트워크에 배치해야 합니다.

CORS 기본 허용 주소는 다음 두 개이며 와일드카드를 사용하지 않습니다.

-   `http://localhost:5173`
-   `https://ljkportfolio.netlify.app`

운영 주소가 달라지면 `KNOWLEDGE_CORS_ALLOWED_ORIGINS`에 쉼표로 구분해 설정합니다.

## 검증

```bash
docker build -f elasticsearch.Dockerfile -t portfolio-knowledge-elasticsearch:8.19.20-nori ..
./gradlew test
./gradlew integrationTest
./gradlew bootJar
```

단위 테스트는 공개 문서와 필수값 검증, 인덱스 초기화·재검사·실패 후 재시도, `sourceHash` 증분 판정, RRF 순위, 저장소·제공자 장애 처리, 구조화 답변과 인용 순서, 설정 바인딩 및 요청 제한을 확인합니다. 통합 테스트는 위에서 빌드한 Nori 이미지에서 임베딩 유무, 한국어 조사, BM25 및 kNN 검색을 확인합니다.

## 검색 품질과 배포 자료 확인

Nori로 색인하므로 이전 `v2` 인덱스를 재사용하지 않습니다. 기본값은 `v3`이며 사용자 지정 인덱스도 새 이름으로 바꿔 전체 색인해야 합니다. 기존 인덱스는 자동 삭제하지 않습니다. 관리형 Elasticsearch에서도 같은 버전의 `analysis-nori` 설치가 필요합니다. [Nori 공식 문서](https://www.elastic.co/docs/reference/elasticsearch/plugins/analysis-nori-analyzer).

`GET /internal/v1/knowledge/status`는 동기화와 같은 `X-Knowledge-Sync-Key`를 요구합니다. API에 포함된 자료 버전, 기대 문서 수, 색인 문서 수, 해시가 같은 문서 수와 `upToDate`를 반환합니다. 문서 수가 같아도 본문이 다르면 최신으로 판정하지 않습니다.

다음은 저장소 루트에서 실행합니다. 배포 자동화에서는 **같은 공개 자료로 API를 배포한 뒤** 동기화 명령을 실행합니다.

```bash
export KNOWLEDGE_API_BASE_URL=http://127.0.0.1:8080
# KNOWLEDGE_SYNC_KEY는 배포 환경의 비밀값으로 설정
npm run knowledge:sync
npm run knowledge:evaluate -- --url "$KNOWLEDGE_API_BASE_URL"
```

동기화 명령은 현재 자료와 API 버전이 다르면 색인을 수정하지 않습니다. 최신이면 재색인을 생략하고, 동기화 후에도 해시가 다르면 실패합니다. CI에서는 새 API 이미지로 이 절차와 검색 평가를 실행하고 결과 JSON을 보관합니다. 원격 운영 배포 대상은 이 저장소에 설정돼 있지 않습니다.

`scripts/knowledge-evaluation-cases.json`은 대표 질문 20개와 답할 근거가 없는 질문 4개입니다. 기본 평가는 유료 AI 호출 없이 상위 5건의 목표 문서 적중률과 MRR@5, 요청 시간을 기록합니다. 적중률이 85% 미만이면 실패합니다. `KNOWLEDGE_SYNC_KEY`가 있으면 평가 전에 색인의 자료 버전도 확인합니다.

```bash
# AI가 설정된 별도 평가 서버에서만 실행: 실제 모델 사용 비용 발생
npm run knowledge:evaluate -- --url "$KNOWLEDGE_API_BASE_URL" --answers
```

답변 모드는 생성·거절 상태와 출처 유무를 검사하고 답변 및 출처를 기록합니다. 의미가 근거와 일치하는지는 각 질문의 `criteria`와 원문으로 검토해야 합니다. 인용 ID 검사를 사실 정확도 점수로 계산하지 않습니다. 평가용 인스턴스는 기존 호출 제한에 걸리지 않도록 별도로 설정하되 운영 한도를 낮추지 않습니다.

검색과 답변 생성에서 같은 질문을 사용하면 Caffeine으로 질문 벡터만 2분간, 최대 256개 재사용합니다. 문서 검색은 매번 실행하므로 색인 갱신이 캐시에 가려지지 않으며, 임베딩 실패는 캐시하지 않습니다. 인스턴스와 모델 설정을 공유하는 분산 캐시는 사용하지 않습니다.

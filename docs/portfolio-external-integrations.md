# 포트폴리오 외부 연동 및 홈서버 준비

포트폴리오 웹과 Knowledge API에 적용할 연동을 정리했습니다. 운영 계정·키·도메인과 클러스터는 사용자가 설정합니다.

## 연동 구성

| 목적                               | 연동                  | 코드 상태                             | 사용자가 설정할 값            |
| ---------------------------------- | --------------------- | ------------------------------------- | ----------------------------- |
| 공개 문서 답변·질문 임베딩         | OpenAI + Spring AI    | 기존 구현, 시간 제한·재시도·캐시 적용 | API 키, 프로필                |
| 공개 기술문서 읽기                 | GitHub API            | 기존 허용 목록·커밋 고정 방식         | 필요 시 조회 토큰             |
| 문서 변경 시 최신화 검사           | GitHub 이벤트 API     | 이벤트 수신·전송 도구 구현            | 이벤트 발신 도구의 전용 토큰  |
| AI 답변 자동 호출 방지             | Cloudflare Turnstile  | 서버 오류 분류·멱등 재시도 적용       | 사이트 키·비밀 키·허용 호스트 |
| 검색 장애·응답 시간·캐시 지표 수집 | Prometheus HTTP 수집  | 수집 API·관리 포트 분리 구현          | 수집 대상, Grafana 연결       |
| OpenAI 호출 정책·사용량 관리       | Cloudflare AI Gateway | 선택 프로필·공통 인증 헤더 구현       | 계정 ID, Gateway ID·토큰      |

Turnstile의 연결 오류·HTTP 5xx·`internal-error`는 같은 멱등 키로 한 번만 재시도합니다. 토큰 오류는 `403`, 서버·연동 설정 오류는 `503`으로 구분합니다. 비밀 키 오류·HTTP 429·잘못된 응답은 즉시 재시도하지 않으며, 검증 불가 상태에서 AI 답변을 허용하지 않습니다. [Cloudflare 검증 계약](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

웹의 대기 상한은 검색 90초·AI 답변 180초·Turnstile 스크립트 로딩 20초입니다. 실패하면 화면에서 수동으로 다시 시도하며, 답변 실패 시 검색 결과는 유지합니다. 브라우저 요청을 중단해도 서버·AI 작업이 계속될 수 있습니다. 재시도 동작은 [Knowledge API 안내](../knowledge-api/README.md#근거-기반-답변)를 참고합니다.

검색·답변 평가 도구도 웹과 같은 제한 시간을 사용합니다. `429`·`503`의 `Retry-After`가 유효하면 화면과 도구에 대기 시간을 안내하되 자동 재요청하지 않습니다.

웹의 검색·답변 요청은 리다이렉트를 거부하므로 최종 API 주소를 설정해야 합니다. 성공 응답도 목록·본문·출처 형식을 검사하고, 잘못된 응답은 오류로 안내합니다.

## 선택: Cloudflare AI Gateway

답변과 임베딩 요청을 Cloudflare의 OpenAI 전용 Gateway로 보낼 수 있습니다. 외부 서비스의 호출 제한과 사용량 조회 기능을 사용하며, 기존 OpenAI 키·모델·임베딩 차원은 유지합니다. 프로필을 추가하지 않으면 OpenAI 직접 호출을 유지합니다. [Cloudflare OpenAI 연동](https://developers.cloudflare.com/ai-gateway/usage/providers/openai/).

`knowledge-api/.env.ai-gateway.example`을 참고해 API 환경변수에 아래 값을 설정합니다. OpenAI API 키와 Gateway Run 권한의 Cloudflare 토큰이 모두 필요합니다. 이 프로필은 키를 요청에 전달하는 방식이며 Cloudflare에 키를 보관하거나 통합 결제를 설정하지 않습니다.

```bash
SPRING_PROFILES_ACTIVE=homeserver,openai,ai-gateway
AI_PROFILE=openai
OPENAI_API_KEY=<OpenAI 키>
CLOUDFLARE_ACCOUNT_ID=<계정 ID>
CLOUDFLARE_AI_GATEWAY_ID=<Gateway ID>
CLOUDFLARE_AI_GATEWAY_TOKEN=<Gateway 인증 토큰>
ELASTICSEARCH_INDEX=portfolio-knowledge-openai-v3
```

Compose도 `SPRING_PROFILES_ACTIVE`와 세 가지 Cloudflare 변수를 전달합니다. `ai-gateway`는 `openai`와 함께 켜야 하며 빈 토큰·잘못된 ID는 기동 단계에서 거부합니다. 기존 Turnstile 사이트 키·비밀 키와는 별개입니다.

요청 주소는 `https://gateway.ai.cloudflare.com/v1/<계정 ID>/<Gateway ID>/openai`입니다. OpenAI 키는 `Authorization`, Gateway 토큰은 `cf-aig-authorization`에 전달합니다. 다음 헤더를 기본 적용합니다.

| 헤더                         | 값      | 목적                                   |
| ---------------------------- | ------- | -------------------------------------- |
| `cf-aig-max-attempts`        | `1`     | Spring AI와 Gateway의 재시도 중첩 방지 |
| `cf-aig-skip-cache`          | `true`  | 기존 애플리케이션 캐시 정책 유지       |
| `cf-aig-collect-log-payload` | `false` | 질문·근거·답변 본문 로그 저장 제외     |

요청은 Cloudflare를 경유하며 본문 로그 제외와 별개로 요청량·토큰 수 등 메타데이터는 Gateway 설정에 따라 기록됩니다. Gateway 장애가 나면 기존 검색·답변 대체 처리를 사용하고 직접 OpenAI 호출로 자동 우회하지 않습니다. [요청 헤더](https://developers.cloudflare.com/ai-gateway/usage/rest-api/#per-request-configuration), [로그 본문 설정](https://developers.cloudflare.com/ai-gateway/observability/logging/).

운영 연결 뒤 답변과 임베딩 양쪽의 인증·호출 정책을 확인합니다. 로컬 검증에서는 실제 Spring AI 클라이언트를 HTTP 대역 서버에 연결해 경로·헤더·응답 처리를 확인하며 운영 계정은 호출하지 않습니다.

## GitHub 문서 변경 이벤트

`POST https://api.github.com/repos/ljkhyeong/portfolio/dispatches`로 다음 이벤트를 보내면 `.github/workflows/knowledge-source-refresh.yml`이 실행됩니다.

```json
{ "event_type": "knowledge-documents-changed" }
```

GitHub가 인증과 이벤트 수신을 처리합니다. 이 워크플로가 기본 브랜치에 반영돼 있어야 하며, 본문의 임의 경로나 명령을 실행하지 않습니다. GitHub 저장소 설정의 일반 `push` 웹훅을 이 URL에 직접 등록하는 방식은 아닙니다. 변경을 감지한 도구/CI가 위 형식의 인증된 API 요청을 보내야 합니다. [GitHub 이벤트 규칙](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#repository_dispatch).

전용 토큰은 **포트폴리오 저장소만 선택한 Contents: write 권한**의 fine-grained PAT 또는 GitHub App 토큰을 사용합니다. 다른 저장소의 기본 `GITHUB_TOKEN`만으로 대상 저장소를 호출할 수 있다고 가정하지 않습니다. [GitHub API 계약과 토큰 권한](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event).

루트 `.env.integrations.example`을 `.env.integrations.local`로 복사하고 토큰을 채운 뒤 Node 22에서 실행합니다.

```bash
# 요청만 확인하며 전송하지 않습니다.
node --env-file=.env.integrations.local scripts/dispatch-knowledge-refresh.mjs --dry-run

# 운영 연결 후 이벤트를 보냅니다.
node --env-file=.env.integrations.local scripts/dispatch-knowledge-refresh.mjs
```

전송 도구는 15초 제한, 리다이렉트 거부, HTTP 204 확인을 적용합니다. 자동 재전송은 하지 않습니다. 응답을 받지 못한 경우 GitHub Actions에서 접수 여부를 확인한 뒤 필요하면 다시 보냅니다.

검사는 허용된 공개 문서를 가져와 현재 자료와 비교합니다. 변경이 있으면 Actions 실패 결과와 `knowledge-source-refresh` 첨부 파일로 알립니다. 검토한 자료를 저장소에 반영하고 새 API 이미지에 포함한 뒤 기존 `knowledge:sync`로 색인을 확인합니다. 이 이벤트의 접수는 자료 반영이나 배포 완료를 뜻하지 않습니다.

수집은 요청당 30초·문서당 1MiB로 제한하고, 잘못된 커밋·빈 본문·이메일/휴대전화가 감지되면 저장 전에 중단합니다. 모든 문서를 확인한 뒤 스냅샷을 교체하므로 일부 다운로드 실패로 기존 파일을 덮어쓰지 않습니다. 토큰은 GitHub 커밋 API에만 전달하며 리다이렉트를 따라가지 않습니다. 연락처 검사만으로 비공개 정보 검토를 대신하지는 않습니다.

## 원격 검색 자료 읽기

기본값은 이미지에 포함된 `classpath:knowledge/portfolio.json`입니다. 웹과 API의 자료 버전을 맞추기 위해 이 구성을 유지합니다. 별도 저장소나 정적 호스팅의 JSON을 읽어야 할 때만 `KNOWLEDGE_SOURCE_LOCATION`에 최종 HTTPS 주소를 지정합니다. 일반 README가 아니라 이 저장소에서 생성한 공개 자료 형식이어야 합니다.

원격 연결은 기본 3초, 읽기 대기는 10초로 제한합니다. HTTP 200만 허용하고 리다이렉트는 거부합니다. 로컬·원격 자료 모두 8MiB까지 읽으며 `Content-Length`가 없는 응답도 제한합니다. 읽기 제한은 전체 다운로드 시간이 아닌 데이터 수신 대기 시간입니다.

환경변수 `KNOWLEDGE_SOURCE_CONNECT_TIMEOUT_SECONDS`, `KNOWLEDGE_SOURCE_READ_TIMEOUT_SECONDS`, `KNOWLEDGE_SOURCE_MAX_BYTES`로 조정합니다. 다운로드 실패·용량 초과·잘못된 JSON은 색인 변경 전에 중단합니다. 원격 자료를 사용해도 기존 자료 버전 확인과 공개 문서 검토 절차는 유지합니다.

## Prometheus / Grafana 연결

`homeserver` 프로필 또는 기존 Compose를 사용하면 관리 포트 9091에서 다음 주소를 제공합니다.

-   `/actuator/health/liveness`: 프로세스 상태
-   `/actuator/health/readiness`: 요청 수신 준비 상태와 Elasticsearch 클러스터 상태
-   `/actuator/prometheus`: HTTP·JVM·검색·답변·캐시 지표

Prometheus는 API Pod의 9091 포트를 수집하고 Grafana는 Prometheus를 데이터 소스로 사용합니다. 외부 수집 서비스도 같은 Prometheus 형식을 지원하면 연결할 수 있습니다. [Spring Boot 공식 연동](https://docs.spring.io/spring-boot/reference/actuator/metrics.html#actuator.metrics.export.prometheus).

수집 설정 예시입니다. 대상 서비스 이름과 네임스페이스는 사용자 환경에 맞춥니다.

```yaml
scrape_configs:
    - job_name: portfolio-knowledge
      metrics_path: /actuator/prometheus
      static_configs:
          - targets: ["knowledge-api-monitoring:9091"]
```

대표 지표는 `knowledge_answers_total`, `knowledge_searches_total`, `knowledge_cache_lookups_total`입니다. 예를 들어 최근 5분의 답변 캐시 적중률은 다음과 같이 조회합니다. 요청이 없는 구간은 비율을 계산할 수 없습니다.

```promql
sum(rate(knowledge_cache_lookups_total{cache="answer",result="hit"}[5m]))
/
sum(rate(knowledge_cache_lookups_total{cache="answer",result=~"hit|miss"}[5m]))
```

관리 포트는 클러스터 내부에서만 연결합니다. 외부 Ingress에는 업무 API의 8080 포트만 연결하고 `/internal/*`는 제외합니다. API 인스턴스를 여러 개 쓰면 Pod별 수집이 필요하며, 현재 호출 제한도 인스턴스별로 적용됩니다. 홈서버 기본 구성은 API 한 개입니다.

readiness는 Elasticsearch의 `green`·`yellow`를 허용하고, 연결 실패·상태 조회 시간 초과·`red`·판정 불가 상태는 HTTP `503`으로 반환합니다. 복구되면 다음 확인부터 정상으로 전환합니다. liveness는 Elasticsearch와 분리하며, 자료 버전·색인 완료 여부는 기존 `knowledge:sync`로 확인합니다.

## 이미지와 k3s 연결 기준

환경변수 예시는 `knowledge-api/.env.homeserver.example`입니다. 실제 값은 `.env.homeserver.local`이나 k3s ConfigMap/Secret에 저장합니다. 예시는 AI 비활성으로 설정돼 있어 키 없이 기동할 수 있습니다. `.env` 파일을 k3s가 자동으로 읽지는 않으므로 Pod 환경변수로 전달해야 합니다.

| 대상            | 설정                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- |
| API 기본 프로필 | `SPRING_PROFILES_ACTIVE=homeserver`, `AI_PROFILE=disabled`                               |
| OpenAI 사용     | `SPRING_PROFILES_ACTIVE=homeserver,openai`, `AI_PROFILE=openai`, `OPENAI_API_KEY`        |
| Elasticsearch   | Nori 플러그인이 포함된 이미지, `ELASTICSEARCH_URL`, 영속 볼륨                            |
| OpenAI 인덱스   | `ELASTICSEARCH_INDEX=portfolio-knowledge-openai-v3`                                      |
| 외부 API        | 8080 포트, HTTPS Ingress, `/api/v1/knowledge/*`                                          |
| 관리 API        | 9091 포트, 클러스터 내부 전용                                                            |
| 상태 검사       | startup/readiness는 `/actuator/health/readiness`, liveness는 `/actuator/health/liveness` |
| 종료            | graceful shutdown 사용, Pod 종료 유예는 앱 기본 30초보다 길게 설정                       |
| 비밀값          | OpenAI 키, 동기화 키, Turnstile 비밀 키, 필요 시 Elasticsearch 인증 정보                 |

모델·임베딩 차원을 바꿀 때는 새 인덱스 이름을 지정합니다. 최초 색인에 필요한 시간만큼 startup probe 대기 시간을 확보하고, Elasticsearch 장애를 liveness 실패로 처리해 API를 반복 재시작하지 않도록 구분합니다.

사용자가 실행할 이미지 빌드 명령입니다. 저장소 루트에서 Node 22로 웹 자료를 생성한 뒤 빌드합니다.

```bash
npm ci
npm run build
docker build -f knowledge-api/elasticsearch.Dockerfile -t portfolio-knowledge-elasticsearch:8.19.20-nori .
docker build -f knowledge-api/Dockerfile -t portfolio-knowledge-api:local .
```

API 이미지에는 현재 `public/knowledge/portfolio.json`이 포함됩니다. 웹 자료를 바꿨다면 API도 같은 자료로 빌드해야 합니다. API 컨테이너는 UID 10001로 실행하며 임시 파일용 `/tmp` 쓰기 권한이 필요합니다.

웹은 현재 Netlify 배포 구성을 유지합니다. 웹 빌드 환경의 `VITE_KNOWLEDGE_API_BASE_URL`에 홈서버 API의 HTTPS 주소를 넣고, API의 `KNOWLEDGE_CORS_ALLOWED_ORIGINS`에는 웹 주소를 지정합니다. Turnstile을 사용할 때는 React 사이트 키와 API 비밀 키·허용 호스트를 함께 설정합니다.

## 준비 완료 후 확인

사용자 설정이 끝나면 관리망에서 readiness와 Prometheus 응답을 확인하고, 저장소 루트에서 `npm run knowledge:sync` 및 `npm run knowledge:evaluate -- --url <API 주소>`로 자료 버전과 검색 품질을 확인합니다. 두 명령의 API 주소·동기화 키는 기존 README에 나온 환경변수를 사용합니다.

두 도구 모두 리다이렉트를 거부하므로 최종 API 주소를 사용합니다. 외부 연결에는 HTTPS를 사용하고 키는 URL이 아닌 환경변수로 전달합니다. 자료 상태의 자료형·문서 수·버전이 잘못되면 작업을 시작하지 않으며, 동기화 후에도 같은 검사를 통과해야 성공으로 보고합니다. 일반 검색 평가에는 동기화 키를 보내지 않습니다.

평가 도구는 웹과 같은 응답 형식 검사를 사용합니다. 관리 키가 있으면 평가 종료 후에도 자료 상태를 확인하고, 응답 형식이나 종료 상태가 잘못되면 새 보고서를 저장하지 않습니다. 관리 키가 없는 평가는 자료 버전을 미확인으로 기록합니다. 기본 검색 평가도 OpenAI 프로필에서는 질문 임베딩 비용이 발생할 수 있습니다.

GitHub 이벤트 전송은 Actions 실행 여부와 변경 첨부 파일로 확인합니다. 실제 OpenAI와 Turnstile 응답은 키를 설정한 환경에서 확인해야 합니다. 코드의 대역 테스트·빌드 성공만으로 운영 연동 완료를 판정하지 않습니다.

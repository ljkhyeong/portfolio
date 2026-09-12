# 포트폴리오 외부 연동 및 홈서버 준비

포트폴리오 웹과 Knowledge API에 적용할 연동을 정리했습니다. 운영 계정·키·도메인과 클러스터는 사용자가 설정합니다.

## 연동 구성

| 목적                               | 연동                 | 코드 상태                             | 사용자가 설정할 값            |
| ---------------------------------- | -------------------- | ------------------------------------- | ----------------------------- |
| 공개 문서 답변·질문 임베딩         | OpenAI + Spring AI   | 기존 구현, 시간 제한·재시도·캐시 적용 | API 키, 프로필                |
| 공개 기술문서 읽기                 | GitHub API           | 기존 허용 목록·커밋 고정 방식         | 필요 시 조회 토큰             |
| 문서 변경 시 최신화 검사           | GitHub 이벤트 API    | 이번에 추가                           | 이벤트 발신 도구의 전용 토큰  |
| AI 답변 자동 호출 방지             | Cloudflare Turnstile | 기존 위젯·서버 검증 구현              | 사이트 키·비밀 키·허용 호스트 |
| 검색 장애·응답 시간·캐시 지표 수집 | Prometheus HTTP 수집 | 이번에 추가                           | 수집 대상, Grafana 연결       |

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

## Prometheus / Grafana 연결

`homeserver` 프로필 또는 기존 Compose를 사용하면 관리 포트 9091에서 다음 주소를 제공합니다.

-   `/actuator/health/liveness`: 프로세스 상태
-   `/actuator/health/readiness`: 요청 수신 준비 상태와 Elasticsearch 연결
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

GitHub 이벤트 전송은 Actions 실행 여부와 변경 첨부 파일로 확인합니다. 실제 OpenAI와 Turnstile 응답은 키를 설정한 환경에서 확인해야 합니다. 코드의 대역 테스트·빌드 성공만으로 운영 연동 완료를 판정하지 않습니다.

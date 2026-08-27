import { projectSummaries, projectSummariesById } from "./projectSummaries"

const projects = [
    {
        ...projectSummariesById.baton,
        evidenceAsOf: "2026.08.27 서비스별 공개 main, 원격 개발 브랜치와 로컬 커밋을 각각 확인",
        evidenceTitle: "검증 범위 및 현재 상태",
        systemTitle: "대표 화면 및 마이크로서비스 구성",
        systemNavLabel: "화면 및 서비스",
        screenshots: [
            {
                id: "workspace",
                src: "baton-workspace.png",
                label: "업무 흐름",
                caption: "인수인계 타임라인, 진행이 멈춘 역할과 미완료 결정 확인",
                alt: "BATON 오늘 화면에서 인수인계 타임라인과 진행이 멈춘 역할 및 미완료 결정을 확인하는 모습",
                width: 1280,
                height: 720,
            },
            {
                id: "batonbook",
                src: "baton-batonbook.png",
                label: "바통북",
                caption: "역할 목적, 반복 업무와 중요 결정 미리보기",
                alt: "BATON 모바일 바통북에서 역할 목적과 반복 업무 및 중요 결정을 확인하는 모습",
                width: 390,
                height: 844,
                fit: "contain",
            },
            {
                id: "role-detail",
                src: "baton-role-detail.png",
                label: "역할 상세",
                caption: "담당자, 핵심 책임과 인수인계 준비 상태",
                alt: "BATON 모바일 역할 상세에서 담당자와 핵심 책임 및 인수인계 준비 상태를 확인하는 모습",
                width: 390,
                height: 844,
                fit: "contain",
            },
        ],
        architecture: {
            label: "서비스 구성과 담당 업무",
            title: "Core는 조직 정보와 접근 권한을 관리하고, 링크 생성, URL 점검, 이벤트 전달, 주간 보고서, 캘린더 구독과 실시간 스터디룸은 6개 서비스가 나눠 처리합니다.",
            description:
                "Core는 팀, 시즌, 역할, 반복 업무, 의사결정과 인수인계를 저장하고 사용자가 스터디룸에 들어갈 수 있는지 확인합니다. GO는 짧은 링크, WATCH는 외부 URL 점검, RELAY는 서비스 간 이벤트 전달, BRIEF는 현재 확인 목록과 주간 보고서, CAL은 iCalendar 구독 피드, ROUND는 최대 6명의 WebRTC 연결을 각각 별도 저장소와 실행 환경에서 처리합니다.",
            tradeoff:
                "한 서비스의 장애와 배포가 다른 서비스에 미치는 영향은 줄였지만, 7개 저장소를 각각 배포하고 모니터링해야 하며 서비스 사이의 이벤트가 빠짐없이 전달되도록 재전송과 재처리를 별도로 구현해야 합니다.",
        },
        featuredProblemNumbers: ["02", "03", "05", "07"],
        spotlights: [
            {
                serviceId: "go",
                label: "GO / 중복 링크 방지",
                title: "동시 요청 8건에서도 링크를 1건만 생성",
                problem:
                    "응답이 유실되거나 여러 서버가 같은 요청을 받으면 링크가 중복 생성될 수 있었습니다.",
                solution:
                    "클라이언트 UUID의 SHA-256 해시로 기존 처리 기록을 찾습니다. 같은 UUID로 다시 요청하면 저장된 대상 시스템, 경로, 사용 목적, 활성 시각과 만료 시각을 직접 비교하고 하나라도 다르면 충돌로 거절합니다. 링크 코드는 UUID와 서버 비밀 키로 HMAC-SHA256을 계산해 생성합니다.",
                tradeoff:
                    "UUID 처리 기록을 보관하는 비용이 들고, HMAC 키 교체와 DB 복구 시 기존 링크를 유지할 절차가 필요합니다.",
            },
            {
                serviceId: "watch",
                label: "WATCH / URL 점검",
                title: "외부 URL을 확인하는 동안 DB 연결을 점유하지 않음",
                problem:
                    "느린 URL 점검 중 DB 락을 잡으면 경합이 커지고, 늦게 끝난 작업이 최신 결과를 덮을 수 있었습니다.",
                solution:
                    "URL의 호스트를 한 번 조회해 사설망 및 로컬 주소를 차단하고, 확인한 IP로만 연결해 DNS 변경을 이용한 내부망 접근을 막았습니다. 작업 식별자와 점검 시작 당시 URL 버전이 현재 값과 다르면 늦게 끝난 결과를 저장하지 않았습니다.",
                tradeoff:
                    "한 서버가 가져간 점검의 처리 기한이 짧으면 중복 실행이 늘고, 길면 중단된 점검을 다른 서버가 이어받는 시점이 늦어집니다.",
            },
            {
                serviceId: "relay",
                label: "RELAY / 이벤트 중복 전달 방지",
                title: "전송 결과를 모르면 다시 보내지 않음",
                problem:
                    "등록된 Webhook이나 SQS 큐가 이벤트를 받았지만 RELAY가 응답을 받지 못하면 재시도가 같은 이벤트의 중복 전달로 이어질 수 있었습니다.",
                solution:
                    "받은 eventId를 수신 이력 테이블(Inbox)에 저장해 재전달은 한 번만 처리했습니다. DB에서 다른 서버가 처리하지 않은 작업만 가져오고, 성공 여부를 확인하지 못하면 자동 재전송하지 않는 결과 미확인 상태(OUTCOME_UNKNOWN)로 남겼습니다.",
                tradeoff:
                    "중복 전달 방지를 우선해 자동 재전송을 멈추므로, 대상 시스템의 처리 결과를 조회하거나 운영자가 상태를 확정하는 절차가 추가로 필요합니다.",
            },
        ],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "39",
                summary: "각 서비스가 받을 요청, 처리할 업무와 완료 판단 기준을 정리합니다.",
            },
            {
                id: "adr",
                label: "ADR",
                count: "54",
                summary: "기술 선택 이유, 검토한 대안과 적용 시 제약을 기록합니다.",
            },
            {
                id: "runbook",
                label: "Runbook",
                count: "7",
                summary: "배포, 장애 재처리와 공개 스테이징 전송 테스트 절차를 정리합니다.",
            },
            {
                id: "api",
                label: "API / Data Contract",
                count: "4개 서비스",
                summary:
                    "Core API, BRIEF 및 CAL 이벤트 JSON 형식과 ROUND WebSocket 메시지 규격을 관리합니다.",
            },
        ],
        documents: [
            {
                serviceId: "core",
                type: "ADR 요약",
                label: "Core 업무 규칙을 HTTP와 DB 코드에서 분리",
                href: "/docs/baton/core-hexagonal.md",
                note: "비공개 원문에서 공개 가능한 구현 결정과 적용 시 제약을 요약",
            },
            {
                serviceId: "go",
                type: "ADR 요약",
                label: "GO 같은 요청에서 링크 1건만 생성",
                href: "/docs/baton/go-idempotent-link.md",
                note: "동시 요청과 재시도에도 링크를 한 건만 생성하는 방식",
            },
            {
                serviceId: "watch",
                type: "ADR",
                label: "WATCH 상태 변경 이벤트 전달",
                href: "https://github.com/ljkhyeong/baton-watch/blob/main/docs/ADR/0003_health-change-event-delivery/adr.md",
                note: "URL 상태와 미전송 이벤트를 같은 DB 트랜잭션에 저장하는 원문",
            },
            {
                serviceId: "watch",
                type: "Runbook",
                label: "WATCH 공개 스테이징 전송 테스트",
                href: "https://github.com/ljkhyeong/baton-watch/blob/main/docs/runbooks/public-staging-event-delivery.md",
                note: "최초 전달, 응답 유실 재전송과 미전송 이벤트 재처리를 확인하는 절차",
            },
            {
                serviceId: "relay",
                type: "ADR 요약",
                label: "RELAY 응답 유실 시 이벤트 중복 전달 방지",
                href: "/docs/baton/relay-attempt-recovery.md",
                note: "외부 호출 전에 전송 시도를 저장하고 중단된 작업을 이어서 처리하는 결정 요약",
            },
            {
                serviceId: "brief",
                type: "PRD / ADR 요약",
                label: "BRIEF 중복 이벤트 처리와 주간 보고서 생성",
                href: "/docs/baton/brief-event-projection.md",
                note: "중복 및 순서가 바뀐 이벤트를 걸러내고 생성 후 수정하지 않는 주간 보고서를 저장하는 방식",
            },
            {
                serviceId: "cal",
                type: "PRD / ADR 요약",
                label: "CAL 일정 및 구독 계약",
                href: "/docs/baton/cal-calendar-contract.md",
                note: "일정 개정 번호, iCalendar 호환성, 구독 토큰 회전 및 폐기 계약",
            },
            {
                serviceId: "round",
                type: "ADR / 아키텍처 요약",
                label: "ROUND 방 참여권 검증과 WebRTC 연결 관리",
                href: "/docs/baton/round-realtime-boundary.md",
                note: "Core가 발급한 참여권 검증, 지연된 WebRTC 메시지 차단과 메모리에 저장하는 방 및 참가자 상태",
            },
        ],
        services: [
            {
                id: "core",
                name: "Core",
                kind: "CORE APPLICATION",
                route: "/projects/baton",
                role: "조직, 역할 및 인수인계 관리",
                summary:
                    "팀, 역할, 반복 업무, 의사결정과 인수인계를 저장합니다. 계정과 스터디 멤버십을 확인해 사용자가 지정된 ROUND 방에 들어갈 수 있는지 판단하고 짧은 참여권을 발급합니다.",
                detail: "팀, 시즌, 역할, 운영 기록, 계정과 스터디 멤버십, 참여권 발급",
                evidence:
                    "인수인계 상태 변경과 역할별 진행 중인 인수인계 1건 제약 테스트 · PRD 6 · ADR 19 · OpenAPI · 서비스 간 이벤트 및 참여권 규격",
                input: "팀 및 시즌 생성, 역할과 반복 업무 등록, 의사결정 기록, 바통 전달 및 수락과 ROUND 방 참여 요청",
                inputRule:
                    "요청한 계정의 조직 및 스터디 소속과 해당 상태를 변경할 권한이 있는지 확인합니다.",
                output: "팀, 시즌, 역할, 반복 업무와 인수인계 데이터 및 ROUND 참여권",
                recoveryBoundary:
                    "인수인계 수락과 역할 담당자 및 담당 기간 변경을 한 DB 트랜잭션에서 처리",
                database: "MySQL",
                primary: true,
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "조직 운영 기능과 ROUND 참여권 발급, WATCH 상태 변경 이벤트 수신 및 CAL 일정 이벤트 생성을 구현했습니다. 실제 OAuth 및 SMTP 계정과 운영용 자격 증명을 사용한 공개 HTTPS 환경 검증은 남아 있습니다.",
                documentation: [
                    { label: "PRD", count: "6" },
                    { label: "ADR", count: "19" },
                    { label: "OpenAPI", count: "1" },
                ],
            },
            {
                id: "go",
                name: "GO",
                kind: "MICROSERVICE",
                route: "/projects/baton/go",
                role: "BATON 및 ROUND 짧은 링크 생성과 리다이렉트",
                summary:
                    "허용 목록에 등록한 BATON 및 ROUND 경로만 짧은 코드와 연결합니다. GO는 목적지로 이동시키는 역할만 하고 실제 접근 허용 여부는 BATON 또는 ROUND가 직접 확인합니다.",
                contribution:
                    "링크 생성과 조회, 활성 시작일 및 만료일, 폐기와 리다이렉트, UUID로 같은 요청의 중복 생성 차단과 HMAC 키 검증을 설계하고 구현했습니다.",
                stack: [
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring Data JPA",
                    "MySQL 8.4",
                    "Flyway",
                    "Kubernetes / Kustomize",
                    "Testcontainers",
                ],
                detail: "UUID 처리 기록, 저장된 링크 조건 직접 비교, HMAC-SHA256 링크 코드와 허용 대상 및 경로 확인",
                evidence:
                    "동시 요청에서도 링크 1건만 생성하고 HMAC 키가 DB 기록과 다르면 서버 기동을 중단하는지 검증",
                input: "허용된 BATON 또는 ROUND 대상, 사용 목적, 활성 및 만료 시각과 UUID",
                inputRule:
                    "대상 시스템, 경로, 사용 목적, 활성 및 만료 시각과 UUID가 허용 범위인지 확인합니다.",
                output: "활성 시작일, 만료일과 폐기 상태를 저장한 짧은 링크 코드",
                recoveryBoundary:
                    "같은 UUID와 링크 조건이면 기존 링크를 반환하고, 같은 UUID의 조건이 하나라도 다르면 충돌로 차단",
                database: "MySQL",
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "링크 생성, 조회, 활성 시작일 및 만료일, 폐기와 리다이렉트를 구현했습니다. GO 링크에서 실제 BATON 및 ROUND 화면으로 이동한 뒤 대상 서비스가 접근 권한을 확인하는 전체 흐름과 공개 배포는 아직 검증하지 않았습니다.",
                tradeoff:
                    "UUID 처리 기록과 HMAC 키를 함께 관리해야 합니다. DB를 복구할 때 같은 시점의 키가 없으면 기존 링크를 그대로 유지할 수 없습니다.",
                documentation: [
                    { label: "PRD", count: "3" },
                    { label: "ADR", count: "9" },
                    { label: "Runbook", count: "3" },
                ],
            },
            {
                id: "watch",
                name: "WATCH",
                kind: "MICROSERVICE",
                route: "/projects/baton/watch",
                role: "URL 상태 점검",
                summary:
                    "BATON에 등록된 외부 URL이 사설망이나 로컬 주소로 연결되지 않는지 확인한 뒤 상태를 점검합니다. 저장된 이전 결과와 달라지면 URL 상태 변경 이벤트를 Core에 전달합니다.",
                contribution:
                    "DB에서 다른 서버가 아직 가져가지 않은 점검만 선택하고 외부 요청 중에는 DB 연결을 반환하도록 구현했습니다. 상태 변경 이벤트는 URL 결과와 함께 저장하고 전송하지 못한 건은 다시 처리합니다.",
                stack: [
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring JDBC",
                    "Spring Security",
                    "PostgreSQL 18",
                    "Apache HttpClient 5",
                    "Flyway",
                    "Testcontainers",
                ],
                detail: "사설망 및 로컬 주소 접근 차단, 중단된 점검 재처리, 이전 점검 결과의 덮어쓰기 차단과 미전송 이벤트 보관",
                evidence:
                    "사설망 주소, DNS 변경을 이용한 내부망 접근과 이전 작업의 늦은 결과가 저장되지 않는지 검증",
                input: "점검 대상 URL과 점검 요청 시점의 URL 버전",
                inputRule:
                    "URL 형식과 통신 방식을 확인하고 사설망 및 로컬 주소로 해석되는 요청을 차단합니다.",
                output: "URL 상태와 상태 변경 이벤트",
                recoveryBoundary:
                    "한 서버가 가져간 작업에 만료 시간을 두고 서버가 중단되면 다른 서버가 이어서 처리",
                database: "PostgreSQL",
                visibility: "공개 저장소",
                status: "안전한 URL 점검과 상태 변경 이벤트 전송을 구현했습니다. 스테이징 환경의 이벤트 전송 테스트는 아직 하지 않았습니다.",
                tradeoff:
                    "한 서버가 가져간 점검의 처리 기한이 짧으면 중복 실행이 늘고, 길면 중단된 점검을 다른 서버가 다시 처리하기까지 오래 걸립니다. 운영 지표를 보며 조정해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-watch",
                    label: "WATCH 공개 저장소",
                },
                documentation: [
                    { label: "PRD", count: "4" },
                    { label: "ADR", count: "3" },
                    { label: "Runbook", count: "2" },
                ],
            },
            {
                id: "relay",
                name: "RELAY",
                kind: "MICROSERVICE",
                route: "/projects/baton/relay",
                role: "BATON 이벤트를 Webhook 및 SQS FIFO 대상으로 전달",
                summary:
                    "BATON이 발행한 이벤트를 등록된 HTTP Webhook 또는 SQS FIFO 큐로 전달합니다. 전송 성공, 실패와 대상이 처리했는지 확인할 수 없는 경우를 구분해 저장합니다.",
                contribution:
                    "받은 eventId를 수신 이력 테이블(Inbox)에 저장해 같은 이벤트 재전달을 한 번만 처리했습니다. 대상 호출 전에 전송 시도와 대상용 중복 방지 키를 저장하고 RabbitMQ 수신, HTTP Webhook과 SQS FIFO 전송을 구현했습니다.",
                stack: [
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring JDBC",
                    "Spring Security",
                    "PostgreSQL 18",
                    "RabbitMQ / Spring AMQP",
                    "AWS SQS FIFO",
                    "Flyway",
                    "Testcontainers",
                ],
                detail: "eventId 기반 중복 차단, 다른 서버가 처리하지 않은 작업 선택, 제한 횟수 재시도와 성공 여부를 모르는 전송의 별도 보관",
                evidence:
                    "같은 이벤트가 다시 와도 한 번만 전달하고 작업 중단 뒤에도 같은 전송 식별자로 이어서 처리하는지 검증",
                input: "eventId, 이벤트 종류, 계약 버전, 대상 업무 식별자와 발생 시각",
                inputRule:
                    "eventId, 이벤트 종류, 계약 버전, 대상 업무 식별자와 발생 시각이 전달 계약에 맞는지 확인합니다.",
                output: "Webhook 또는 SQS FIFO 전달 성공, 실패 또는 결과 미확인 상태",
                recoveryBoundary:
                    "같은 eventId는 다시 전달하지 않고 성공 여부를 모르면 자동 재전송을 중단",
                database: "PostgreSQL",
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "HTTP Webhook과 AWS SQS FIFO 전송, RabbitMQ 이벤트 수신과 최대 횟수 및 대기 시간을 제한한 재시도 작업을 구현했습니다. 실제 AWS 자격 증명을 사용한 SQS 전송, 운영 소비자의 이벤트 형식 확인과 큐 적체 및 실패 알림 구성은 아직 검증하지 않았습니다.",
                tradeoff:
                    "중복 전달 방지를 우선해 결과 미확인 건은 자동 재전송하지 않습니다. 대상 시스템의 처리 결과 조회와 운영자 확정 절차가 추가로 필요합니다.",
                documentation: [
                    { label: "PRD", count: "2" },
                    { label: "ADR", count: "15" },
                ],
            },
            {
                id: "brief",
                name: "BRIEF",
                kind: "MICROSERVICE",
                route: "/projects/baton/brief",
                role: "주간 운영 요약",
                summary:
                    "BATON이 보낸 이벤트로 담당자가 없는 역할, 담당 종료가 임박했지만 후임자가 없는 역할, 준비 자료가 부족한 인수인계, 반복해서 마감이 지난 업무와 시작되지 않은 인수인계를 찾아 현재 확인 목록을 만듭니다. 매주 생성한 보고서는 이후 이벤트가 바뀌어도 수정하지 않고 당시 기록으로 보관합니다.",
                contribution:
                    "이벤트 ID, 내용 해시와 개정 번호로 중복 및 순서가 바뀐 이벤트를 걸러냈습니다. 저장한 이벤트로 현재 목록을 다시 만드는 기능, 주간 보고서 중복 생성 방지와 Bearer 토큰 무중단 교체를 Kotlin과 Spring JDBC로 구현했습니다.",
                stack: [
                    "Kotlin 2.3",
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring JDBC",
                    "PostgreSQL 18",
                    "Flyway",
                    "Testcontainers",
                ],
                detail: "이벤트 중복 및 구버전 차단, 저장 이벤트 기반 현재 목록 재생성, 생성 후 수정하지 않는 주간 보고서",
                evidence:
                    "BATON 실행 JAR가 보낸 이벤트를 Caddy 내부 인증서 기반 HTTPS로 BRIEF 실행 JAR가 수신하고 Bearer 토큰을 교체하는 과정 검증",
                input: "역할 미배정, 후임자 미지정, 인수인계 준비 미완료, 반복 지연 루틴과 미완료 인수인계 이벤트 및 각 개정 번호",
                inputRule:
                    "이벤트 ID, 계약 버전, 개정 번호와 본문 해시가 기존 수신 기록과 충돌하지 않는지 확인합니다.",
                output: "현재 확인 목록, 수신 이벤트 이력과 생성 후 수정하지 않는 주간 보고서",
                recoveryBoundary:
                    "같은 이벤트와 과거 개정 번호는 다시 반영하지 않고 저장한 수신 이벤트 전체를 읽어 현재 확인 목록을 다시 생성",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 최신 구현은 로컬 개발 브랜치",
                status: "로컬에서 BATON 실행 JAR가 보낸 실제 이벤트를 BRIEF 실행 JAR가 HTTPS로 수신하고 전용 Bearer 토큰을 중단 없이 교체하는 과정까지 확인했습니다. 최신 구현은 공개 main 반영 전이며 공인 DNS 및 ACME 인증서를 사용한 원격 스테이징 전송은 아직 검증하지 않았습니다.",
                tradeoff:
                    "각 항목이 선택된 이유를 이벤트 종류와 심각도로 확인할 수 있습니다. 이벤트 종류가 추가되면 Core가 보내는 JSON 형식, BRIEF의 확인 목록 생성 규칙과 주간 보고서 비교 규칙을 함께 변경해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-brief",
                    label: "BRIEF 공개 저장소",
                    note: "공개 main은 초기 스캐폴드이며 최신 구현은 로컬 개발 브랜치에 있습니다.",
                },
                documentation: [
                    { label: "PRD", count: "22" },
                    { label: "ADR", count: "5" },
                    { label: "Contract Pack", count: "1" },
                ],
            },
            {
                id: "cal",
                name: "CAL",
                kind: "MICROSERVICE",
                route: "/projects/baton/cal",
                role: "외부 캘린더 구독",
                summary:
                    "BATON에서 확정한 일정과 마감을 외부 캘린더 앱에서 구독할 수 있는 읽기 전용 피드로 제공합니다.",
                contribution:
                    "BATON이 일정 한 건의 전체 현재 값과 개정 번호를 담아 보낸 JSON을 저장하고 iCalendar 피드로 변환했습니다. 구독 토큰 회전과 폐기, 일정이 바뀌지 않았을 때 본문을 다시 보내지 않는 HTTP 캐시 응답도 구현했습니다.",
                stack: [
                    "Kotlin 2.3",
                    "Java 25",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring JDBC",
                    "PostgreSQL 18",
                    "iCal4j 4.2",
                    "Flyway",
                    "Testcontainers",
                ],
                detail: "iCalendar(.ics) 피드, 구독 토큰 회전 및 폐기, ETag 조건부 조회",
                evidence:
                    "BATON 코드가 만든 실제 일정 JSON을 CAL 컨테이너에 전송해 중복 및 과거 일정 차단과 iCalendar 결과를 검증",
                input: "BATON이 확정한 일정의 전체 현재 값 및 개정 번호와 구독 생성, 회전 및 폐기 요청",
                inputRule:
                    "일정 ID, 이벤트 ID, 개정 번호와 시간대 값이 서비스 간 일정 계약에 맞는지 확인합니다.",
                output: "읽기 전용 iCalendar 피드와 조건부 조회 응답",
                recoveryBoundary:
                    "중복 및 과거 개정 번호는 반영하지 않고 DB에 저장한 일정으로 같은 iCalendar 피드를 다시 생성",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 안정 계약 1.0.0",
                status: "시즌 일정의 수신, 변경, 취소와 읽기 전용 iCalendar 구독 기능을 구현했습니다. BATON 코드가 만든 실제 일정 JSON을 CAL 컨테이너에 보내 정상 반영되는 것도 확인했습니다. 운영 자격 증명을 사용한 실제 이벤트 전송과 공개 캘린더 앱 구독은 아직 하지 않았습니다.",
                tradeoff:
                    "읽기 전용 구독은 외부 캘린더에서 쉽게 사용할 수 있지만, 비동기 반영 지연과 캘린더 앱별 동작 차이를 관리해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-cal",
                    label: "CAL 공개 저장소",
                    note: "안정 계약 1.0.0의 JSON Schema와 BATON 일정 이벤트 호환성 테스트를 공개합니다.",
                },
                documentation: [
                    { label: "PRD", count: "2" },
                    { label: "ADR", count: "2" },
                    { label: "JSON Schema", count: "6" },
                ],
            },
            {
                id: "round",
                name: "ROUND",
                kind: "MICROSERVICE",
                route: "/projects/baton/round",
                role: "실시간 스터디룸",
                summary:
                    "Core가 계정과 스터디 멤버십을 확인해 발급한 방 참여권을 검증합니다. 최대 6명의 브라우저가 영상 및 음성 연결을 만들 때 교환하는 연결 설명(offer 및 answer)과 네트워크 경로 후보(ICE)를 WebSocket으로 전달하고, 직접 연결할 수 없을 때 사용할 TURN 서버의 짧은 접속 정보도 발급합니다.",
                contribution:
                    "React 방 화면, React와 분리한 WebRTC 연결 모듈, 프론트엔드와 Java 서버가 함께 사용하는 메시지 규격, Spring raw WebSocket 시그널링 서버와 Core 참여권 검증을 구현했습니다.",
                stack: [
                    "TypeScript",
                    "React 19",
                    "Vite 8",
                    "WebRTC / RTCDataChannel",
                    "Java 21",
                    "Spring Boot 4.1",
                    "Raw WebSocket",
                    "coturn / Caddy",
                    "Playwright",
                ],
                detail: "참가자마다 나머지 최대 5명과 직접 연결하는 mesh WebRTC, 이전 연결의 늦은 메시지 차단, DataChannel 애플리케이션 수신 응답, RS256 참여권 검증과 짧은 TURN 접속 정보",
                evidence:
                    "정상 및 비정상 참여권의 HTTPS 및 WSS 입장, Chromium 전체 미디어 흐름과 WebKit 직접 초대 및 장치 권한 동의 흐름을 구분해 확인",
                input: "Core가 방 ID, 참가자 ID와 만료 시각을 넣어 발급한 짧은 RS256 참여권",
                inputRule:
                    "참여권의 서명, 발급자, 수신자, 방 ID와 만료 시각을 Core 공개 키로 확인합니다.",
                output: "브라우저 사이의 WebRTC 연결 메시지 전달, DataChannel 채팅 수신 응답과 짧은 TURN 접속 정보",
                recoveryBoundary:
                    "연결을 새로 만들 때마다 순번을 올려 이전 연결에서 늦게 온 메시지는 버리고, 같은 참가자가 새 참여권으로 접속하면 이전 WebSocket 세션을 종료",
                database: "DB 없음 / 방과 참가자 연결 상태는 프로세스 메모리에 저장",
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "원격 개발 브랜치에서 BATON 서명자로 만든 참여권을 ROUND가 로컬 HTTPS와 WSS에서 검증하고 방에 입장시키는 과정을 확인했습니다. 공인 DNS 및 ACME, 외부 coturn 미디어 중계와 6명 장시간 접속 테스트는 아직 하지 않았습니다.",
                tradeoff:
                    "참가자끼리 직접 연결하는 mesh 구조는 인원이 늘수록 각 브라우저의 업로드와 CPU 사용량이 증가합니다. 방 상태가 프로세스 메모리에 있어 현재는 단일 시그널링 인스턴스로 운용해야 합니다.",
                documentation: [
                    { label: "Architecture", count: "1" },
                    { label: "ADR", count: "1" },
                    { label: "Protocol", count: "1" },
                    { label: "Runbook", count: "2" },
                ],
            },
        ],
        proofs: [
            {
                item: "Core 인수인계 상태 전이 및 중복 교대 차단",
                method: "도메인 규칙 및 저장소 통합 테스트",
                rule: "정상 순서의 상태 변경, 이전 상태로 되돌리는 요청과 같은 역할에 열린 인수인계 2건을 동시에 생성하는 요청을 각각 실행",
                result: "PREPARING → TRANSFERRED → ACCEPTED 순서만 허용하고 역할별 열린 바통을 1건으로 유지",
                scope: "Core 비공개 저장소 · 상태 전이 및 DB 제약 확인 · 2026.08.27 커밋 상태 기준",
            },
            {
                item: "GO 링크 중복 생성 방지",
                method: "Testcontainers 통합 테스트",
                rule: "같은 UUID와 요청으로 8건을 동시에 실행",
                result: "같은 UUID에 대한 공유 링크 1건과 링크 생성 처리 기록 1건만 DB에 저장",
                scope: "GO 비공개 저장소 · 동시 요청과 잘못된 HMAC 키의 서버 기동 차단 시나리오 · 2026.08.27 커밋 상태 기준",
            },
            {
                item: "WATCH 안전한 URL 점검",
                method: "자동화 테스트",
                rule: "사설망 IP를 가리키는 URL, DNS 재조회 때 IP가 바뀐 URL, 허용 크기를 넘는 HTTP 응답과 이전 URL 버전으로 시작한 점검 결과를 각각 입력",
                result: "사설망 및 로컬 주소 접근과 허용 크기를 넘는 응답을 차단하고 현재 등록된 URL 버전과 일치하는 점검 결과만 저장",
                scope: "WATCH 공개 저장소 · URL 보안 및 중단된 점검 재처리 자동화 시나리오 · 2026.08.27 커밋 상태 기준",
            },
            {
                item: "RELAY DB 저장 후 RabbitMQ 재전달 중복 방지",
                method: "RabbitMQ 및 PostgreSQL Docker Compose 검증",
                rule: "PostgreSQL 저장은 끝났지만 RabbitMQ에 처리 완료 응답(ACK)을 보내기 전에 RabbitMQ와 RELAY를 중단하고 같은 이벤트를 재전달",
                result: "같은 eventId의 수신 이력을 1건으로 유지하고 재전달에 처리 완료 응답을 보내며 별도 실패 큐(DLQ)에는 넣지 않음",
                scope: "RELAY 비공개 저장소 origin/main b87eb49 · RabbitMQ 4.3.4 및 PostgreSQL 일회성 Compose 시나리오 · 2026.08.08 CI 성공",
            },
            {
                item: "BRIEF 중복 이벤트 처리와 주간 보고서 재생성",
                method: "PostgreSQL 통합 테스트 및 BATON 실행 JAR에서 BRIEF 실행 JAR로 실제 이벤트 전송",
                rule: "같은 이벤트 재전송, 낮거나 건너뛴 개정 번호, 저장 이벤트 기반 현재 확인 목록 재생성과 동일 주간 보고서 동시 생성 요청을 실행",
                result: "중복 및 과거 이벤트를 반영하지 않고 저장한 이벤트에서 같은 확인 목록을 다시 만들며 동일 상태의 주간 보고서는 1건만 저장",
                scope: "최신 구현은 로컬 개발 브랜치 기준 · 공개 main 및 원격 스테이징 반영 전 · 2026.08.27",
            },
            {
                item: "CAL 일정 및 구독 계약",
                method: "PostgreSQL Testcontainers와 iCalendar 기대값 비교, BATON 코드가 만든 일정 JSON을 CAL 컨테이너에 전송",
                rule: "같은 일정의 전체 현재 값 재전달, 현재보다 낮은 개정 번호, 서머타임 전환(DST) 및 자정 경계 일정, 취소 일정과 구독 토큰 동시 회전을 각각 실행",
                result: "중복 및 과거 일정은 반영하지 않고 DST와 자정 경계 및 취소 일정을 정확한 iCalendar로 생성하며 같은 일정에서는 같은 ETag를 반환",
                scope: "공개 저장소 안정 계약 1.0.0 및 BATON 일정 이벤트 JSON Schema 기준 · 실제 운영 활성화와 공개 배포 전 · 2026.08.27",
            },
            {
                item: "Core가 발급한 참여권 검증과 WebRTC 방 입장",
                method: "BATON 서명자로 만든 RS256 참여권을 ROUND bootJar에 HTTPS 및 WSS로 전달하고 WebSocket 입장 테스트 실행",
                rule: "정상 참여권, 다른 방의 참여권, 잘못된 발급자 및 수신자와 공개 키, 만료 참여권을 각각 사용하고 새 공개 키를 먼저 등록한 뒤 키 교체와 재연결을 실행",
                result: "정상 참여권에만 TURN 접속 정보와 WebSocket 방 입장을 허용하고 잘못된 참여권은 거부하며 같은 참가자의 새 연결이 들어오면 이전 세션을 종료",
                scope: "ROUND 비공개 저장소 원격 개발 브랜치 기준 · 공인 DNS, 외부 coturn 중계와 6명 장시간 접속 테스트 전 · 2026.08.27",
            },
        ],
        category: "개인 프로젝트",
        role: "Core와 6개 서비스 저장소의 API, DB 구조, 이벤트 형식, 중복 및 실패 재처리 테스트와 배포 절차 설계 및 구현",
        oneLine:
            "Core는 조직과 접근 권한을 관리하고 짧은 링크, URL 점검, 서비스 간 이벤트 전달, 주간 보고서, 캘린더 구독과 WebRTC 스터디룸은 6개 서비스로 분리",
        status: {
            label: "현재 상태",
            text: "Core와 6개 서비스의 주요 기능을 구현했습니다. CAL은 BATON이 만든 실제 일정 JSON을 컨테이너에서 처리했고, ROUND는 BATON 서명자로 만든 참여권을 HTTPS 및 WSS에서 검증했습니다. BRIEF도 BATON 실행 JAR에서 보낸 이벤트를 로컬 HTTPS로 수신했지만 최신 코드는 공개 main 반영 전입니다. 실제 운영 자격 증명과 외부 서비스를 사용하는 공개 환경 배포는 진행 중입니다.",
        },
        visualCaption:
            "Core는 팀, 역할, 반복 업무, 의사결정, 인수인계와 접근 권한을 관리합니다. GO, WATCH, RELAY, BRIEF, CAL, ROUND는 각각 별도 저장소와 실행 환경에서 링크, URL 점검, 서비스 간 이벤트 전달, 주간 보고서, 캘린더와 WebRTC 연결을 처리합니다.",
        problems: [
            {
                number: "01",
                serviceIds: ["core", "go", "watch", "relay", "brief", "cal", "round"],
                shared: true,
                title: "Core와 6개 서비스의 담당 업무 및 DB 분리",
                constraint:
                    "링크, URL 점검, 메시지 전송, 주간 보고서, 캘린더 구독과 실시간 통신은 받는 데이터, 보안 검사와 실패 후 처리 방식이 서로 다릅니다.",
                decision:
                    "Core에는 조직, 역할, 인수인계와 접근 권한을 두고 GO, WATCH, RELAY, BRIEF, CAL, ROUND는 각각 별도 저장소와 실행 환경으로 분리했습니다. 다른 서비스에 알려야 하는 상태 변경은 업무 데이터와 같은 DB 트랜잭션의 아웃박스에 저장한 뒤 커밋 후 전송합니다.",
                validation:
                    "GO는 같은 링크 요청 8건의 단일 저장, WATCH는 사설망 URL과 늦은 점검 결과 차단, RELAY는 RabbitMQ 재전달 중복 제거, BRIEF는 중복 이벤트와 주간 보고서 재생성, CAL은 중복 일정과 iCalendar 생성, ROUND는 잘못된 참여권과 지연 WebRTC 메시지 차단을 각각 확인했습니다.",
                boundary:
                    "서비스별로 공개 main, 개발 브랜치와 로컬 구현 상태가 다릅니다. 위에 적은 기능별 테스트는 완료했지만 모든 서비스를 공개 환경에 배포해 실제 자격 증명과 외부 서비스를 사용하는 전체 흐름은 아직 확인하지 않았습니다.",
            },
            {
                number: "02",
                serviceIds: ["core"],
                title: "바통 인계 상태와 담당자 변경을 한 트랜잭션으로 처리",
                constraint:
                    "바통 수락과 담당자 변경이 따로 반영되면 같은 역할에 이전 담당자와 다음 담당자가 섞일 수 있었습니다.",
                decision:
                    "PREPARING → TRANSFERRED → ACCEPTED 상태를 두고 전달 시점의 바통북을 고정했습니다. 수락, 담당자와 담당 기간 변경은 한 트랜잭션에서 처리했습니다.",
                validation:
                    "역할별 열린 바통 1건 제약과 상태 전이 테스트로 중복 교대 및 전달 후 변경을 차단했습니다.",
                boundary:
                    "교대 모델은 명확해졌지만 상태와 이력이 늘어 운영자가 실패 지점을 이해할 화면과 재처리 절차가 필요합니다.",
                print: {
                    label: "CORE / HANDOFF",
                    problem: "수락과 담당자 변경이 따로 반영되면 책임자가 섞일 수 있음",
                    solution: "PREPARING → TRANSFERRED → ACCEPTED와 열린 바통 1건 제약",
                    tradeoff: "상태와 이력이 늘어 운영 화면과 재처리 절차가 필요",
                },
            },
            {
                number: "03",
                serviceIds: ["go"],
                title: "같은 링크 생성 요청을 여러 번 받아도 1건만 저장",
                constraint:
                    "저장 후 응답이 유실되거나 여러 서버가 같은 요청을 동시에 받으면 링크가 중복 생성될 수 있습니다.",
                decision:
                    "클라이언트 UUID의 SHA-256 해시로 생성 예약을 찾습니다. 재요청이면 저장된 대상 시스템, 경로, 사용 목적, 활성 시각과 만료 시각을 직접 비교하고 하나라도 다르면 충돌로 거절합니다. 링크 코드는 같은 UUID와 서버 비밀 키로 HMAC-SHA256을 계산해 생성합니다.",
                validation:
                    "같은 요청 8건을 동시에 보내도 링크와 예약이 각각 1건만 생성되는지 통합 테스트로 확인했습니다.",
                boundary:
                    "HMAC 키 교체와 DB 복구 시 기존 링크가 유지되도록 키 관리와 백업 절차가 함께 필요합니다.",
                print: {
                    label: "GO / IDEMPOTENCY",
                    problem: "응답 유실과 동시 요청으로 같은 링크가 중복 생성될 수 있음",
                    solution:
                        "UUID 처리 기록, 저장된 링크 조건 직접 비교와 HMAC 기반 고정 링크 코드",
                    tradeoff: "HMAC 키와 DB를 같은 시점에 복구해야 함",
                },
            },
            {
                number: "04",
                serviceIds: ["go"],
                title: "HMAC 키와 링크 데이터의 복구 시점 일치",
                constraint:
                    "잘못된 HMAC 키로 서버가 시작되면 같은 목적지에 다른 링크 코드가 생겨 기존 링크 계약이 깨질 수 있었습니다.",
                decision:
                    "HMAC 키의 버전과 식별 해시를 DB에 저장했습니다. 서버가 시작될 때 저장된 링크 데이터와 현재 키가 일치하는지 확인하고, 다르면 기동을 중단했습니다.",
                validation:
                    "서로 다른 HMAC 키로 동시에 최초 기동했을 때 하나만 DB와 연결되고, 잘못된 키로는 링크를 만들 수 없는지 통합 테스트로 확인했습니다.",
                boundary:
                    "DB 백업과 HMAC 키를 같은 시점 기준으로 보관하고 복원하는 운영 절차가 필요합니다.",
            },
            {
                number: "05",
                serviceIds: ["watch"],
                title: "외부 URL을 확인하는 동안 DB 연결을 반환하고 늦은 결과 차단",
                constraint:
                    "외부 URL은 느리거나 사설망을 가리킬 수 있고, 늦게 끝난 작업이 최신 점검 결과를 덮을 수도 있었습니다.",
                decision:
                    "DB에서 아직 다른 서버가 가져가지 않은 점검만 선택한 뒤 외부 요청 중에는 DB 연결을 반환했습니다. URL의 호스트를 한 번 조회해 사설망 및 로컬 주소를 차단하고 확인한 IP로만 연결했습니다. 작업 식별자와 점검 시작 당시 URL 버전이 현재 값과 다르면 늦게 끝난 결과를 저장하지 않았습니다.",
                validation:
                    "사설망 주소, DNS 변경을 이용한 내부망 접근, 제한을 넘는 리다이렉트 및 응답, 처리 서버 중단 뒤 다른 서버의 재처리와 이전 작업 결과 차단을 자동화 테스트로 확인했습니다.",
                boundary:
                    "한 서버가 가져간 점검의 처리 기한이 짧으면 중복 실행이 늘고, 길면 중단된 점검을 다른 서버가 이어받는 시점이 늦어집니다.",
                print: {
                    label: "WATCH / SAFE CHECK",
                    problem: "느린 I/O와 늦은 결과가 경합 및 최신 상태 덮어쓰기를 만듦",
                    solution: "사설망 및 로컬 주소 차단, 작업 식별자와 요청 시점 URL 버전 비교",
                    tradeoff: "실제 점검 시간에 맞춰 다른 서버가 이어받을 처리 기한을 조정해야 함",
                },
            },
            {
                number: "06",
                serviceIds: ["watch"],
                title: "URL 상태는 저장됐지만 전달에 실패한 이벤트를 다시 전송",
                constraint:
                    "URL 상태는 저장됐지만 Core 전달 호출이 실패하면 두 시스템이 서로 다른 상태를 볼 수 있었습니다.",
                decision:
                    "상태 변경과 전달할 이벤트를 같은 트랜잭션에 저장했습니다. 수신 확인 전까지 같은 이벤트를 다시 보내고, 오래 남은 미전송 이벤트를 별도 작업이 다시 처리하도록 했습니다.",
                validation:
                    "같은 이벤트 재전송, Core는 이벤트를 받았지만 WATCH가 성공 응답을 받지 못한 경우와 미전송 이벤트 재처리를 자동화 테스트로 확인했습니다. 공개 스테이징 전송 절차는 Runbook으로 정리했습니다.",
                boundary:
                    "현재는 소비자가 하나라 메시지 브로커를 두지 않았습니다. 소비자가 늘면 전달 방식을 다시 검토해야 합니다.",
            },
            {
                number: "07",
                serviceIds: ["relay"],
                title: "대상 시스템의 처리 결과를 모를 때 이벤트 중복 전달 방지",
                constraint:
                    "Webhook이나 SQS 큐가 이벤트를 받았지만 RELAY가 응답을 잃으면 자동 재시도가 같은 이벤트의 중복 전달로 이어질 수 있었습니다.",
                decision:
                    "대상 호출 전에 전송 시도 1건과 대상용 중복 방지 키를 DB에 저장하고 기존 시도 기록은 덮어쓰지 않았습니다. 결과를 확인할 수 없으면 결과 미확인 상태(OUTCOME_UNKNOWN)로 보존하고 운영자가 대상 시스템의 실제 처리 결과를 확인한 뒤에만 상태를 확정하도록 했습니다.",
                validation:
                    "작업 중단 뒤 같은 전송 식별자로 이어서 처리하고, 처리 권한이 만료된 서버의 늦은 결과로 상태를 바꾸지 못하며, 상태 확정 요청을 다시 실행해도 결과가 중복되지 않는지 확인했습니다.",
                boundary:
                    "중복 전달 방지를 우선해 자동 재전송을 멈추므로 대상 시스템 결과 조회나 운영자 조정 절차가 필요합니다.",
                print: {
                    label: "RELAY / RECOVERY",
                    problem: "응답 유실 뒤 재시도가 이벤트 중복 전달로 이어질 수 있음",
                    solution: "대상 호출 전 전송 시도 저장, 중복 방지 키와 결과 미확인 상태",
                    tradeoff: "자동 재전송 대신 결과 조회 및 운영자 조정 절차가 필요",
                },
            },
            {
                number: "08",
                serviceIds: ["relay"],
                title: "RabbitMQ 메시지 재전달 시 중복 처리 방지",
                constraint:
                    "PostgreSQL 저장이 끝났지만 RabbitMQ에 처리 완료 응답(ACK)을 보내기 전에 프로세스가 멈추면 같은 이벤트가 다시 전달됩니다.",
                decision:
                    "받은 이벤트 ID를 수신 이력 테이블(Inbox)에 저장해 같은 이벤트 재전달을 한 번만 처리했습니다. DB 저장 뒤 RabbitMQ에 처리 완료 응답(ACK)을 보내고, 반복해서 처리할 수 없는 메시지는 별도 실패 큐(DLQ)로 분리했습니다.",
                validation:
                    "메시지 브로커와 RELAY를 강제로 중단한 뒤 같은 이벤트가 재전달돼도 inbox가 1건인지 Docker Compose 통합 테스트로 확인했습니다.",
                boundary:
                    "메시지 보존과 별도 실패 큐 운영 지점이 늘어 RabbitMQ 모니터링과 재처리 Runbook이 필요합니다.",
            },
            {
                number: "09",
                serviceIds: ["brief"],
                title: "중복되거나 순서가 바뀐 BATON 이벤트 차단",
                constraint:
                    "같은 이벤트가 다시 오거나 이전 개정 번호의 이벤트가 늦게 도착하면 현재 확인 항목이 잘못 바뀔 수 있습니다.",
                decision:
                    "이벤트 ID, 내용 해시와 개정 번호를 함께 저장해 같은 이벤트, 같은 ID의 다른 내용, 과거 개정 번호와 현재 번호보다 2 이상 건너뛴 이벤트를 구분했습니다. 수락한 이벤트 기록과 현재 확인 목록은 같은 PostgreSQL 트랜잭션에서 저장합니다.",
                validation:
                    "PostgreSQL 통합 테스트와 로컬 BATON 실행 JAR 전송으로 같은 이벤트, 같은 ID의 다른 내용, 과거 개정 번호와 현재 번호보다 2 이상 건너뛴 이벤트를 구분하는지 확인했습니다. 기존 Bearer와 새 Bearer를 잠시 함께 허용해 전송 중단 없이 토큰을 교체하는 과정도 확인했습니다.",
                boundary:
                    "Caddy 내부 인증서로 BATON과 BRIEF 사이의 로컬 HTTPS 전송까지 확인했습니다. 최신 구현은 공개 main 반영 전이며 공인 DNS와 원격 스테이징 전달은 아직 검증하지 않았습니다.",
                print: {
                    label: "BRIEF / EVENT",
                    problem: "중복 또는 이전 버전 이벤트가 현재 확인 항목을 바꿀 수 있음",
                    solution: "이벤트 ID, 내용 해시와 개정 번호를 같은 트랜잭션에서 확인",
                    tradeoff: "로컬 BATON-BRIEF HTTPS 전송 확인, 공개 main과 원격 스테이징 반영 전",
                },
            },
            {
                number: "10",
                serviceIds: ["brief"],
                title: "저장한 이벤트로 다시 만들어도 같은 주간 보고서 유지",
                constraint:
                    "DB에 저장한 이벤트로 현재 확인 목록을 다시 만들 때 항목 순서나 결과가 달라지면 이전 주간 보고서를 신뢰하기 어렵습니다.",
                decision:
                    "수락한 이벤트 전체를 다시 읽어 현재 확인 목록을 만들었습니다. 보고서를 만들 때 마지막으로 수락한 이벤트의 수신 순번과 포함 항목을 함께 저장하고, 같은 주간과 같은 수신 순번 및 항목으로 다시 요청하면 기존 보고서를 반환했습니다. 한 번 생성한 보고서는 수정하지 않고 당시 상태를 확인할 수 있도록 보관합니다.",
                validation:
                    "같은 이벤트 기록으로 현재 확인 목록을 다시 만들기 전후의 결과와 같은 주간 보고서를 동시에 생성하는 요청을 확인했습니다. 동시 요청에서도 보고서는 1건만 저장되고 최초 생성은 HTTP 201, 같은 요청의 재실행은 HTTP 200으로 구분됩니다.",
                boundary:
                    "현재는 담당자가 없는 역할, 담당 종료가 임박했지만 후임자가 없는 역할, 준비 자료가 부족한 인수인계, 반복해서 마감이 지난 업무와 시작되지 않은 인수인계를 처리합니다. 항목을 추가하면 BATON 이벤트 JSON, BRIEF의 현재 목록 생성 규칙과 주간 보고서 비교 규칙을 함께 변경해야 합니다.",
            },
            {
                number: "11",
                serviceIds: ["cal"],
                title: "중복되거나 순서가 바뀐 일정 JSON 차단",
                constraint:
                    "네트워크 재시도로 같은 일정 JSON이 다시 오거나 과거 개정 번호가 늦게 도착하면 최신 캘린더가 이전 일정으로 돌아갈 수 있습니다.",
                decision:
                    "같은 일정 ID와 개정 번호가 다시 오거나 이전 번호가 늦게 오면 저장하지 않도록 이벤트 ID, 일정 ID, 개정 번호와 내용 해시를 비교했습니다. 수신 이력과 캘린더용 데이터는 같은 트랜잭션에서 변경합니다.",
                validation:
                    "동일 내용 재전송, 낮은 개정 번호, 같은 개정 번호의 다른 내용과 트랜잭션 실패 후 재시도를 PostgreSQL 통합 테스트로 확인했습니다.",
                boundary:
                    "BATON과 CAL은 비동기로 연동하므로 일정 반영이 지연될 수 있습니다. 실제 운영 활성화 전에는 자격 증명 회전과 모든 일정의 최신 값을 다시 보내는 순서를 함께 검증해야 합니다.",
                print: {
                    label: "CAL / REVISION",
                    problem: "중복 및 이전 일정이 최신 캘린더를 덮을 수 있음",
                    solution: "이벤트 ID, 일정 ID, 개정 번호와 내용 해시 비교",
                    tradeoff: "BATON 일정 JSON의 CAL 반영 확인, 실제 운영 전송과 공개 배포 전",
                },
            },
            {
                number: "12",
                serviceIds: ["cal"],
                title: "캘린더 시간대, 취소 및 캐시 일관성 유지",
                constraint:
                    "캘린더 앱마다 시간대와 취소 일정 및 캐시 처리 방식이 달라 일정이 중복되거나 변경 내용이 반영되지 않을 수 있습니다.",
                decision:
                    "일정마다 고정 UID와 원본 개정 번호 기반 SEQUENCE를 사용하고 취소 상태를 유지했습니다. 캘린더 앱이 이전 ETag를 보내고 일정이 바뀌지 않았으면 본문 대신 304 Not Modified를 반환합니다.",
                validation:
                    "UTC, 서머타임 전환(DST), 자정 경계, 취소 일정, UTF-8 줄 접기와 변경 없음 응답(304 Not Modified)을 iCalendar 기대값 파일 및 자동화 테스트로 확인했습니다.",
                boundary:
                    "iCal4j 또는 시간대 데이터 버전을 바꾸면 iCalendar 기대값 파일과 캐시 검증값이 함께 바뀌는지 확인해야 합니다.",
            },
            {
                number: "13",
                serviceIds: ["round"],
                title: "이전 WebRTC 연결에서 늦게 온 설정 메시지가 새 연결에 반영되지 않도록 차단",
                constraint:
                    "브라우저 연결을 다시 만들거나 네트워크 경로를 다시 찾은 뒤, 이전 연결의 설명(SDP)과 경로 후보(ICE)가 늦게 도착하면 새 연결 상태를 손상시킬 수 있습니다.",
                decision:
                    "연결마다 먼저 연결 설명을 만드는 브라우저를 하나로 고정했습니다. 새 연결을 만들 때마다 순번을 올리고 응답 설명(answer)과 경로 후보(ICE)에도 같은 순번을 넣어 이전 연결에서 늦게 도착한 메시지는 버렸습니다.",
                validation:
                    "연결 중단, ICE 재시작과 피어 재생성 사이에 이전 연결 순번의 answer 및 ICE를 늦게 전달해 현재 연결 시도의 메시지만 반영되는지 WebRTC 연결 모듈 자동화 테스트로 확인했습니다.",
                boundary:
                    "브라우저와 Java 연결 중계 서버의 메시지 버전을 함께 배포해야 합니다. 참가자 수나 영상 소스를 늘릴 때는 현재의 브라우저 간 직접 연결을 확장하기보다 미디어를 중앙 서버가 받아 나눠 보내는 SFU 구조를 검토해야 합니다.",
                print: {
                    label: "ROUND / NEGOTIATION",
                    problem: "이전 SDP와 ICE가 재연결 뒤의 새 협상을 손상시킬 수 있음",
                    solution:
                        "offer 생성 브라우저를 고정하고 연결 순번이 지난 answer 및 ICE를 차단",
                    tradeoff: "클라이언트와 시그널링 프로토콜을 함께 배포해야 함",
                },
            },
            {
                number: "14",
                serviceIds: ["round"],
                title: "Core는 방 입장 권한을 확인하고 ROUND는 WebRTC 메시지만 처리",
                constraint:
                    "브라우저의 연결 설명과 네트워크 경로 후보를 전달할 때마다 ROUND가 Core를 호출하면 Core 응답 지연이나 장애 때문에 화상 연결도 멈춥니다. 반대로 ROUND가 계정과 멤버십을 저장하면 두 서비스의 권한 정보가 달라질 수 있습니다.",
                decision:
                    "Core가 계정과 스터디 멤버십을 확인한 뒤 방 ID와 만료 시각을 넣어 RS256 참여권을 발급합니다. ROUND는 Core의 공개 키로 쿠키의 서명, 방 ID와 만료 시각을 직접 확인하고, 통과한 연결의 WebSocket 중계와 TURN 접속 정보 발급만 담당합니다.",
                validation:
                    "정상 참여권은 허용하고 다른 방, 발급자, 수신자, 공개 키와 만료 시각이 잘못된 참여권은 거부했습니다. 새 개인 키로 참여권을 발급하기 전에 ROUND에 새 공개 키를 먼저 등록하는 키 교체 순서와 같은 참가자의 새 연결이 이전 WebSocket 세션을 종료하는지도 확인했습니다.",
                boundary:
                    "멤버십 회수는 다음 참여권 갱신 또는 기존 참여권 만료까지 지연될 수 있습니다. 공인 DNS와 인증서, 외부 coturn 미디어 중계, 실기기 Safari와 6명 장시간 접속 테스트는 남아 있습니다.",
                print: {
                    label: "ROUND / AUTH BOUNDARY",
                    problem:
                        "WebRTC 메시지마다 Core를 호출하면 Core 장애로 화상 연결도 멈출 수 있음",
                    solution: "Core가 짧은 RS256 참여권을 발급하고 ROUND가 공개 키로 직접 확인",
                    tradeoff: "권한 회수는 참여권 갱신 또는 만료까지 지연될 수 있음",
                },
            },
        ],
        stack: [
            "Java 21 / 25",
            "Kotlin",
            "Spring Boot",
            "Spring MVC / JdbcClient",
            "Gradle",
            "MySQL",
            "PostgreSQL",
            "Flyway",
            "RabbitMQ / SQS",
            "iCal4j",
            "WebRTC / Raw WebSocket",
            "Testcontainers",
            "Docker",
        ],
        links: [
            {
                label: "BATON WATCH GitHub 저장소",
                href: "https://github.com/ljkhyeong/baton-watch",
                note: "안전한 URL 점검과 상태 변경 이벤트",
            },
        ],
    },
    {
        ...projectSummariesById.happygallery,
        evidenceAsOf: "2026.08.27 로컬 커밋 1e1e7a87 기준 · 공개 main과 원격 개발 브랜치 분리 표기",
        evidenceTitle: "테스트 범위 및 운영 이력",
        systemTitle: "대표 화면",
        systemNavLabel: "대표 화면",
        screenshots: [
            {
                id: "products",
                src: "happygallery-products.jpg",
                label: "작품 선택",
                caption: "검색, 상품 유형, 카테고리와 정렬 조건으로 작품을 고르는 화면",
                alt: "happyGallery 작품 목록에서 검색과 필터를 사용해 상품을 선택하는 모습",
                width: 1600,
                height: 1000,
            },
            {
                id: "product-detail",
                src: "happygallery-product-detail.jpg",
                label: "작품 주문",
                caption: "수량, 가격, 제작 기간과 맞춤 상담 조건을 확인하는 화면",
                alt: "happyGallery 작품 상세에서 수량과 가격 및 제작 조건을 확인하는 모습",
                width: 1600,
                height: 1000,
            },
            {
                id: "classes",
                src: "happygallery-classes.jpg",
                label: "클래스 선택",
                caption: "가격과 소요 시간을 비교하고 예약하는 화면",
                alt: "happyGallery 클래스 선택 화면에서 수업별 가격과 시간을 비교하는 모습",
                width: 1600,
                height: 1000,
            },
        ],
        architecture: {
            label: "상품, 주문, 예약 기능의 모듈 분리",
            title: "웹 요청과 DB 및 외부 연동 코드가 주문 및 예약 규칙에 직접 섞이지 않도록 나눴습니다.",
            description:
                "애플리케이션 실행, HTTP API, DB 저장, 결제 및 알림 연동, 업무 처리, 도메인 규칙을 6개 운영 모듈로 나눴습니다. 상위 모듈만 하위 업무 모듈을 참조하도록 제한하고, 결제사와 알림 업체처럼 교체 가능한 외부 연동에만 인터페이스를 뒀습니다. 테스트 공통 코드는 test-support에 분리했습니다.",
            tradeoff:
                "모듈과 타입 수는 늘지만 핵심 업무 규칙이 HTTP 요청, DB 저장 및 외부 연동 타입을 참조하는지 빌드에서 확인할 수 있습니다. 현재 규모의 분리 비용을 고려해 도메인 모듈에는 일부 JPA 매핑을 유지했습니다.",
        },
        featuredProblemNumbers: ["02", "03", "08", "09"],
        spotlights: [
            {
                label: "결제 및 환불 응답 유실",
                title: "외부 응답을 잃어도 중복 승인과 환불을 막음",
                problem:
                    "PG 실패 상태를 저장한 뒤 예외를 던지면 같은 트랜잭션이 롤백되어 이력까지 사라졌습니다. 응답 유실 뒤 재요청은 중복 승인이나 환불로 이어질 수 있었습니다.",
                solution:
                    "결제사 호출은 트랜잭션 밖에서 실행하고 호출 전후 상태는 서로 독립된 새 트랜잭션(REQUIRES_NEW)으로 저장했습니다. 결제 orderId와 환불 UUID를 중복 방지 요청 ID로 재사용하고, 결과를 확인할 수 없으면 결제사 조회와 복구 배치로 다시 처리합니다.",
                tradeoff:
                    "PG 호출을 트랜잭션 밖으로 분리해 DB 점유는 줄지만, API 응답 시점에 환불 상태가 REQUESTED로 남을 수 있습니다.",
            },
            {
                label: "중단된 알림 재전송",
                title: "주문 및 예약 저장과 전송할 알림을 DB에 함께 기록",
                problem:
                    "메모리 이벤트만 사용하면 업무 커밋 직후 프로세스가 종료될 때 알림 작업이 유실될 수 있었습니다.",
                solution:
                    "주문이나 예약 상태와 보내야 할 알림을 같은 DB 트랜잭션에 저장했습니다. 저장 직후 전송하고, 서버가 중단돼 남은 건은 스케줄러가 찾아 다시 전송합니다.",
                tradeoff:
                    "알림은 비동기로 처리되어 사용자 응답 시점에 발송이 끝나지 않을 수 있습니다. 성공 확인 전까지 재시도하므로 응답 유실 시 중복 알림 가능성도 남습니다.",
            },
            {
                label: "옵션 조합별 가격 및 재고",
                title: "색상 및 크기 조합별 가격과 재고를 서버에서 다시 확인",
                problem:
                    "선택형 옵션 조합마다 가격과 재고가 다르고, 관리자가 옵션을 바꾼 뒤에도 과거 주문과 환불을 당시 조건으로 재현해야 했습니다.",
                solution:
                    "각 선택 조합을 하나의 재고 항목(SKU)으로 관리하고 직접입력형은 제작 지시로 분리했습니다. 서버가 가격을 다시 계산하고 SKU ID 순서로 재고를 잠근 뒤 차감하며, 주문에는 결제 당시 옵션과 가격을 저장합니다.",
                tradeoff:
                    "옵션값이 늘면 조합 수가 곱으로 증가하므로 500개 상한과 관리자 입력 부담을 함께 관리해야 합니다.",
            },
        ],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "4",
                summary: "상품, 예약, 주문과 운영 정책의 기준을 관리합니다.",
            },
            {
                id: "adr",
                label: "ADR",
                count: "46",
                summary: "아키텍처, 동시성, 결제와 보안 결정을 기록합니다.",
            },
            {
                id: "idea-poc",
                label: "Idea / POC",
                count: "39 / 1",
                summary: "개발 전에 선택할 방식과 외부 장애 대응안을 작은 검증 코드로 확인합니다.",
            },
            {
                id: "retrospective",
                label: "Retrospective",
                count: "10",
                summary: "운영 비용, 테스트 흐름과 실패 원인을 되짚습니다.",
            },
            {
                id: "runbook",
                label: "Runbook",
                count: "1",
                summary: "k3s 배포, 롤백, 백업과 복구 절차를 관리합니다.",
            },
        ],
        documents: [
            {
                type: "PRD",
                label: "제품 기준 스펙",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/PRD/0001_%EA%B8%B0%EC%A4%80_%EC%8A%A4%ED%8E%99/spec.md",
                note: "상품, 예약, 주문과 운영 정책의 상위 기준을 정한 문서",
            },
            {
                type: "ADR",
                label: "업무 규칙과 웹 및 DB 코드 분리",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0021_Hexagonal_%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98_%EC%A0%84%ED%99%98/adr.md",
                note: "운영 모듈 6개와 test-support의 의존 방향 및 포트 적용 범위를 정한 기록",
            },
            {
                type: "ADR",
                label: "결제 승인 실패 이력과 중복 처리 방지",
                href: "https://github.com/ljkhyeong/happyGallery/blob/04e57fa2afbd65241282eb2d5dfc5fe6319fafa5/docs/ADR/0033_결제_confirm_트랜잭션과_보상_경계/adr.md",
                note: "결제사 호출과 상태 저장을 분리하고 실패 이력, 중복 방지 요청 ID와 복구 기준을 정한 기록",
            },
            {
                type: "ADR",
                label: "8회권 사용, 취소 및 환불 정책",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0011_이용권_사용_소모_환불_결정/adr.md",
                note: "미래 예약 자동 취소, 환불 크레딧 계산과 동시 처리의 잠금 순서를 정한 기록",
            },
            {
                type: "ADR",
                label: "미전송 알림 저장과 재처리",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0032_%EC%95%8C%EB%A6%BC_Outbox_%EC%A0%84%EB%8B%AC_%EB%B3%B4%EC%9E%A5/adr.md",
                note: "같은 트랜잭션 저장과 커밋 후 미전송 알림 재처리 방식을 정한 기록",
            },
            {
                type: "ADR",
                label: "개인정보 암호화와 블라인드 인덱스",
                href: "https://github.com/ljkhyeong/happyGallery/blob/04e57fa2afbd65241282eb2d5dfc5fe6319fafa5/docs/ADR/0036_%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4_%ED%8F%89%EB%AC%B8_%EC%A0%9C%EA%B1%B0%EC%99%80_%EB%B8%94%EB%9D%BC%EC%9D%B8%EB%93%9C_%EC%9D%B8%EB%8D%B1%EC%8A%A4_%EA%B8%B0%EC%A4%80/adr.md",
                note: "복원은 AES-GCM, 정확 검색은 HMAC으로 분리하고 키 회전 범위를 정한 기록",
            },
            {
                type: "Retrospective",
                label: "AWS 비용과 운영 종료",
                href: "https://github.com/ljkhyeong/happyGallery/blob/04e57fa2afbd65241282eb2d5dfc5fe6319fafa5/docs/Retrospective/0010_AWS_%EB%B9%84%EC%9A%A9_%EA%B3%BC%EA%B8%88_%EC%9B%90%EC%9D%B8_%EC%A0%90%EA%B2%80/retrospective.md",
                note: "상시 리소스 비용을 확인하고 운영 환경을 내린 과정",
            },
        ],
        proofs: [
            {
                item: "AWS 운영 이력",
                method: "실제 AWS 배포 및 비용 내역 확인",
                rule: "트래픽과 무관하게 발생하는 상시 리소스 비용을 월별로 확인",
                result: "운영 환경을 종료하고 비용 원인을 회고 문서로 정리",
                scope: "실운영 후 비용 문제로 종료",
            },
            {
                item: "8회권 환불, 미래 예약과 잔여 횟수 일치",
                method: "MySQL 및 Redis Testcontainers 통합 테스트",
                rule: "미래 예약 2건으로 크레딧 2회를 사용한 8회권에 전체 환불 요청",
                result: "미래 예약 2건을 취소하고 잔여 6회와 합쳐 8회분 환불 요청, 크레딧과 원장을 일치시킴",
                scope: "PassCreditUsageUseCaseIT 통합 시나리오 · 2026.08.27 로컬 커밋 1e1e7a87 기준",
            },
            {
                item: "OpenAPI 문서화 범위",
                method: "생성된 OpenAPI JSON 집계",
                rule: "문서화한 API 경로와 작업을 빌드 산출물에서 집계",
                result: "생성된 OpenAPI JSON에서 API 경로 197개와 HTTP 작업 228개를 확인",
                scope: "2026.08.27 로컬 커밋 1e1e7a87 기준",
            },
            {
                item: "백엔드 및 API 문서 회귀 검증",
                method: "Gradle 기본, 정책, Spring REST Docs와 OpenAPI 생성 테스트",
                rule: "도메인 및 통합 테스트, 아키텍처 정책, API 요청 및 응답 문서와 OpenAPI 생성을 작업별로 실행",
                result: "중복을 제외한 694개 통과: 기본 테스트 550개, 정책 테스트 115개, REST Docs 28개와 OpenAPI 생성 테스트 1개, 실패 및 오류 0건",
                scope: "2026.08.27 로컬 커밋 1e1e7a87 기준",
            },
            {
                item: "공개 페이지는 서버 렌더링하고 회원 및 결제 화면은 검색 제외",
                method: "React Router Framework Mode 서버 렌더링과 라우트 계약 검증",
                rule: "공개 상세, 존재하지 않는 경로, 회원 및 결제와 관리자 경로를 각각 요청하고 HTML 본문, 메타데이터, 색인 정책과 HTTP 상태를 확인",
                result: "공개 화면은 요청 시점에 대표 URL, 공유 미리보기 정보와 검색엔진용 구조화 데이터를 포함하고, 회원 및 결제 화면은 검색에서 제외하며 없는 상세 주소는 HTTP 404로 응답",
                scope: "2026.08.27 로컬 커밋 1e1e7a87 기준 · 원격 브랜치와 공개 main 반영 전",
            },
            {
                item: "주문제작 옵션, 가격과 재고 일치",
                method: "서버 가격 계산 및 MySQL 동시 재고 통합 시나리오",
                rule: "같은 SKU가 포함된 여러 주문 항목과 옵션 변경 뒤 결제 및 환불을 실행",
                result: "SKU별 요구 수량을 합산하고 상품 ID 순서로 DB 재고 행을 잠가 차감하며, 주문에 저장한 결제 당시 옵션과 가격으로 과거 주문 조건을 재현",
                scope: "2026.08.27 로컬 커밋 1e1e7a87 기준 · 원격 브랜치와 공개 main 반영 전",
            },
        ],
        category: "개인 프로젝트",
        role: "요구사항 정리, 백엔드 및 프론트엔드 구현, 테스트와 설계 문서 작성",
        oneLine:
            "결제 및 환불 요청 ID로 중복 처리를 막았습니다. 미전송 알림은 DB에서 다시 처리하고, 동시 주문과 예약은 재고 및 좌석을 잠근 뒤 확정했습니다.",
        status: {
            label: "운영 상태",
            text: "AWS 운영 환경에 배포했으나 상시 리소스 비용으로 운영을 종료했습니다. 현재 공개 URL은 없습니다. SSR, 주문제작 SKU와 예약 캘린더 구현 근거는 2026.08.27 로컬 커밋 1e1e7a87 기준이며 아직 원격 개발 브랜치와 공개 main에는 반영하지 않았습니다.",
        },
        visualCaption:
            "HTTP 요청, DB 저장과 결제 및 알림 연동 코드를 업무 규칙과 분리했습니다. JPA 매핑은 현재 규모의 분리 비용을 고려해 도메인 모듈에 일부 유지했습니다.",
        problems: [
            {
                number: "01",
                title: "핵심 업무 규칙이 웹 및 DB 코드에 의존하지 않도록 차단",
                constraint:
                    "기능이 늘수록 웹 요청 처리와 DB 저장 코드가 주문 및 예약 규칙 안으로 섞여, 업무 규칙을 바꿀 때 외부 구현까지 함께 수정하기 쉬웠습니다.",
                decision:
                    "운영 모듈 6개와 테스트 지원용 test-support 모듈로 의존 방향을 나누고 Gradle 의존성과 ArchUnit 정책 테스트로 bootstrap → adapter → application → domain 방향을 검사했습니다.",
                validation:
                    "LayerDependencyPolicyTest와 모듈별 컴파일로 금지한 의존이 빌드 단계에서 실패하는지 확인했습니다.",
                boundary:
                    "domain 모듈의 일부 JPA 의존은 유지했습니다. 현재 규모에서는 JPA를 완전히 분리하는 비용보다 일관된 의존 방향을 우선했습니다.",
                print: {
                    label: "ARCHITECTURE",
                    problem: "업무 규칙이 웹 요청과 DB 저장 코드에 의존하기 쉬움",
                    solution: "운영 6개 모듈과 test-support, Gradle 및 ArchUnit 정책 테스트",
                    tradeoff: "타입 수는 늘고 domain의 일부 JPA 의존은 유지",
                },
            },
            {
                number: "02",
                title: "결제사 응답을 받지 못한 재요청의 중복 승인 및 환불 방지",
                constraint:
                    "한 트랜잭션에서 결제사 호출과 상태 저장을 함께 처리하자, 실패 상태를 먼저 DB에 반영해도 이후 예외로 전체 작업이 롤백되면서 실패 이력까지 사라졌습니다. 응답 유실 뒤 재요청은 중복 승인이나 환불로 이어질 수 있었습니다.",
                decision:
                    "결제사 호출은 DB 트랜잭션 밖에서 실행하고, 호출 전후의 상태는 서로 독립된 새 트랜잭션(REQUIRES_NEW)으로 저장했습니다. 처리 중, 승인 완료와 재처리 가능 상태를 남기고 결제 orderId와 환불 UUID를 중복 방지 요청 ID로 재사용합니다. 결과를 확인할 수 없으면 결제사 조회와 복구 배치로 다시 처리합니다.",
                validation:
                    "예외 뒤에도 실패 이력이 남는지, 같은 요청 ID를 다시 보내면 기존 결과를 반환하는지, 이전 작업 결과 차단과 늦은 승인 반영 및 결과 미확인 환불 복구를 통합 테스트로 확인했습니다.",
                boundary:
                    "상태와 복구 경로가 늘어 운영 조회가 복잡해졌습니다. 실제 Toss Payments의 응답 지연과 장애를 포함한 연동 테스트는 남아 있습니다.",
                print: {
                    label: "PAYMENT / REFUND",
                    problem: "예외 롤백으로 실패 이력이 사라지고 응답 유실 뒤 중복 처리 위험",
                    solution:
                        "결제사 호출과 DB 저장을 분리하고 요청 ID별 처리 상태를 별도 트랜잭션에 보관",
                    tradeoff: "상태와 운영 복구 경로가 늘어남",
                },
            },
            {
                number: "03",
                title: "서버가 중단돼도 미전송 알림을 다시 처리",
                constraint:
                    "주문이나 예약을 커밋한 직후 프로세스가 종료되면 알림 호출 자체가 사라질 수 있습니다.",
                decision:
                    "주문이나 예약 상태와 고유 요청 ID를 가진 알림 작업을 같은 DB 트랜잭션에 저장했습니다. 저장 직후 전송하고, 미전송 알림은 스케줄러가 다시 조회합니다. 스케줄러가 작업을 가져갈 때 처리 서버와 만료 시간을 기록하고, 서버가 중단돼 시간이 지나면 다른 서버가 이어받습니다. 먼저 가져간 서버의 늦은 처리 결과는 버전 검사로 저장하지 않습니다.",
                validation:
                    "같은 알림의 아웃박스가 중복 생성되지 않는지, 처리 중단 뒤 다른 작업자가 이어받는지, 실패 후 다시 처리되는지, 발송 직전에 대상을 다시 확인하는지 통합 테스트로 확인했습니다.",
                boundary:
                    "성공 확인 전까지 재시도하므로 외부 업체가 같은 요청 ID의 중복 처리를 막지 않으면 응답 유실 뒤 중복 알림 가능성이 남습니다.",
                print: {
                    label: "NOTIFICATION",
                    problem: "업무 커밋 직후 종료되면 알림 요청이 사라짐",
                    solution:
                        "주문 및 예약과 보낼 알림을 함께 저장하고 미전송 건은 스케줄러가 재처리",
                    tradeoff: "비동기 지연과 응답 유실 시 중복 알림 가능성",
                },
            },
            {
                number: "04",
                title: "동시 예약과 주문의 좌석 및 재고 초과 차감 방지",
                constraint:
                    "마지막 자리나 재고에 요청이 몰리면 조회 시점에는 모두 가능해 보여 초과 처리될 수 있습니다.",
                decision:
                    "예약은 클래스 행을 먼저 잠근 뒤 예약 시간 행을 ID 순서로 잠갔습니다. 재고도 상품 ID 오름차순으로 잠그고 수량 확인과 차감을 한 트랜잭션에서 처리했습니다.",
                validation:
                    "마지막 좌석과 재고에 동시 요청을 보내 한 건만 성공하고, 나머지는 일관된 업무 오류를 반환하는지 확인했습니다.",
                boundary:
                    "단일 MySQL 기준 설계입니다. 같은 좌석이나 재고 행에 요청이 집중되면 대기 시간이 늘 수 있어 인기 클래스와 상품 재고를 더 작은 단위로 나누거나 처리 방식을 바꿔야 합니다.",
                print: {
                    label: "BOOKING / STOCK",
                    problem: "마지막 좌석과 재고가 동시 요청에서 초과 처리될 수 있음",
                    solution:
                        "클래스 다음 슬롯, 상품 ID 순서로 재고 행을 잠근 뒤 수량 확인 및 차감",
                    tradeoff: "같은 행에 요청이 몰리면 대기 시간이 증가",
                },
            },
            {
                number: "05",
                title: "전화번호와 주소를 암호화하면서 정확 검색 지원",
                constraint:
                    "전화번호와 주소를 평문으로 저장하지 않으면서도 주문 조회와 비회원 이력 찾기를 지원해야 했습니다.",
                decision:
                    "복원이 필요한 값은 AES-GCM으로 암호화하고 정확 검색은 HMAC 블라인드 인덱스로 분리했습니다. 기존 데이터 전환과 키 회전도 별도 단계로 설계했습니다.",
                validation:
                    "암호화 후 복호화, 잘못된 키 차단, 블라인드 인덱스 검색과 마이그레이션 재실행을 테스트했습니다.",
                boundary:
                    "부분 검색은 지원하지 않으며 키 유실 시 복구할 수 없으므로 암호화 백업과 키 보관 절차가 함께 필요합니다.",
                print: {
                    label: "PERSONAL DATA",
                    problem: "평문 제거와 주문 정확 검색을 함께 지원해야 함",
                    solution: "AES-GCM 암호화와 HMAC 블라인드 인덱스",
                    tradeoff: "부분 검색 미지원, 키 유실 방지 절차 필요",
                },
            },
            {
                number: "06",
                title: "AWS 운영 비용 분석 및 로컬 k3s 전환 준비",
                constraint:
                    "CloudFront, ALB, ECS, RDS와 Valkey 기반 환경을 실제 가동했지만 트래픽과 무관한 상시 비용이 계속 발생했습니다.",
                decision:
                    "Cost Explorer로 비용 원인을 확인하고 주요 리소스를 중지 및 삭제했습니다. 이후 단일 노트북 k3s 배포, 버전을 고정한 컨테이너 이미지와 암호화 백업 절차를 준비했습니다.",
                validation:
                    "AWS 리소스별 비용과 종료 상태를 회고에 남겼습니다. k3s 배포 파일과 배포 및 복구 스크립트의 문법 및 구성 검사 기준과 운영 절차서를 준비했습니다.",
                boundary:
                    "단일 노드는 비용과 통제에는 유리하지만 고가용성을 제공하지 않습니다. 실제 Linux 장비의 DNS, TLS, Secret, PVC, 외부 백업과 복구 훈련은 아직 완료하지 않았습니다.",
                print: {
                    label: "OPERATIONS / COST",
                    problem: "트래픽과 무관한 상시 리소스 비용 발생",
                    solution: "비용 원인 확인, 리소스 종료, 단일 노트북 k3s 준비",
                    tradeoff: "비용은 줄지만 단일 노드는 고가용성을 제공하지 않음",
                },
            },
            {
                number: "07",
                title: "8회권 전체 환불 시 미래 예약, 잔여 횟수와 환불 원장 일치",
                constraint:
                    "8회권 전체 환불과 예약 사용 및 취소가 동시에 실행되면 환불할 크레딧, 미래 예약과 원장 잔액이 서로 달라질 수 있었습니다.",
                decision:
                    "환불 횟수를 잔여 크레딧과 자동 취소한 미래 예약 수의 합으로 계산했습니다. 8회권 행을 먼저 잠근 뒤 클래스와 슬롯을 ID 순서로 잠그고, 예약 취소, 크레딧 소멸과 환불 증감 이력을 한 트랜잭션에 저장합니다. 결제 키 기준의 결제사 환불 이력은 별도로 남깁니다.",
                validation:
                    "미래 예약 2건이 자동 취소되고 잔여 6회와 합쳐 8회분 환불 요청이 생성되는지 확인했습니다. 같은 8회권으로 서로 다른 클래스를 동시에 예약해도 크레딧과 원장이 모두 반영되는지 별도 통합 테스트로 확인했습니다.",
                boundary:
                    "PG 환불 완료 전에도 예약 취소와 크레딧 소멸이 먼저 끝날 수 있습니다. 환불 상태를 DB에 보존하고 자동 복구와 관리자 재처리로 금전 환불을 이어가야 합니다.",
                print: {
                    label: "PASS / REFUND",
                    problem: "미래 예약과 잔여 크레딧이 환불 원장과 어긋날 수 있음",
                    solution:
                        "8회권과 예약 시간을 ID 순서로 잠그고 미래 예약까지 포함해 환불 횟수 계산",
                    tradeoff: "PG 완료 전에 예약 취소와 크레딧 변경이 먼저 끝날 수 있음",
                },
            },
            {
                number: "08",
                title: "검색엔진에 공개 상품만 노출하고 회원 및 결제 화면 제외",
                constraint:
                    "기존 SPA는 JavaScript 실행 전 공개 상품과 클래스 본문이 없고, 존재하지 않는 경로도 HTTP 200과 공통 메타데이터를 반환했습니다. 회원, 결제와 관리자 상태를 그대로 SSR로 옮기면 개인별 세션과 캐시가 섞일 수 있었습니다.",
                decision:
                    "공개 상품과 클래스 화면은 서버가 본문과 canonical, Open Graph 및 JSON-LD를 포함한 HTML로 응답하도록 구현했습니다. 존재하지 않는 상세는 HTTP 404를 반환했습니다. 회원, 결제와 관리자 화면은 브라우저에서만 렌더링하고 검색 제외(noindex)로 유지했습니다.",
                validation:
                    "공개 HTML에 본문과 경로별 메타데이터가 포함되는지, 없는 상세와 임의 경로가 실제 404인지, 비공개 경로가 noindex를 유지하는지 서버 렌더링 및 라우트 시나리오로 확인했습니다.",
                boundary:
                    "프런트엔드가 정적 파일 서버가 아닌 Node 프로세스가 되어 CPU, 메모리와 상태 검사가 필요합니다. 공개 문서 요청도 백엔드 공개 API 가용성에 의존합니다. 현재 구현은 로컬 커밋이며 공개 main 반영 전입니다.",
                print: {
                    label: "FRONTEND / SSR",
                    problem:
                        "검색엔진이 공개 상품 본문을 읽지 못하고 없는 주소도 정상 페이지로 인식",
                    solution:
                        "공개 화면은 서버 HTML로 응답하고 회원, 결제 및 관리자 화면은 검색에서 제외",
                    tradeoff: "Node 런타임과 백엔드 공개 API의 가용성이 필요",
                },
            },
            {
                number: "09",
                title: "옵션 조합별 가격 및 재고와 결제 당시 주문 내용 보존",
                constraint:
                    "색상과 크기 같은 선택 조합마다 가격과 제작 가능 수량이 다르고, 각인처럼 직접 입력한 제작 지시도 필요했습니다. 관리자가 옵션을 변경한 뒤에도 과거 주문, 환불과 재고 복구는 결제 당시 조건을 재현해야 했습니다.",
                decision:
                    "색상과 크기 선택 조합마다 재고 항목(SKU)을 만들고 직접입력형은 재고가 아닌 제작 지시로 분리했습니다. 서버가 최종 가격을 다시 계산하고 SKU별 수량을 합산한 뒤 ID 순서로 재고를 잠급니다. 주문에는 결제 당시 옵션, 추가 금액과 재고 항목을 저장합니다.",
                validation:
                    "누락 및 중복 조합, 존재하지 않는 옵션, 같은 SKU가 여러 항목에 포함된 주문과 동시 재고 차감을 검증했습니다. 옵션 변경 뒤에도 주문에 저장한 당시 옵션과 가격을 화면에 표시하고, 같은 조건으로 환불 금액을 계산하며 해당 SKU 재고를 복구하는지 확인했습니다.",
                boundary:
                    "선택값이 늘면 조합 수가 곱으로 증가해 500개 상한을 두었습니다. 관리자는 상한 안에서도 조합별 가격, 판매 여부와 재고를 입력해야 합니다. 현재 구현은 로컬 커밋이며 공개 main 반영 전입니다.",
                print: {
                    label: "PRODUCT / SKU",
                    problem: "옵션별 가격 및 재고와 과거 주문 조건이 어긋날 수 있음",
                    solution:
                        "옵션 조합별 재고 항목, 서버 가격 재계산과 ID 순서 재고 잠금 및 주문 당시 값 저장",
                    tradeoff: "조합 수 상한과 관리자 입력 부담이 생김",
                },
            },
            {
                number: "10",
                title: "운영시간과 휴일 규칙으로 예약 회차 자동 생성",
                constraint:
                    "관리자가 클래스별 예약 시간을 단건 또는 기간 및 요일 조합으로 미리 만들면 정상 영업일이 많을수록 반복 입력이 늘었습니다. 그렇다고 예약 시간 행을 없애면 결제, 변경 및 취소가 계속 같은 회차를 참조할 수 없고, 동시 예약을 막기 위한 DB 행 잠금도 사용할 수 없었습니다.",
                decision:
                    "기본 운영시간과 시작 간격, 날짜별 휴무 및 특별 영업, 일부 시간 차단을 DB에 저장했습니다. 고객이 일정을 조회할 때 클래스 행을 잠그고 규칙에 맞는 예약 시간을 슬롯 행으로 자동 생성하되, 기존 예약과 관리자가 비활성화한 시간은 유지했습니다. 관리자 단건 및 일괄 슬롯 생성 API는 제거했습니다.",
                validation:
                    "AdminSlotUseCaseIT로 기본 운영시간의 자동 생성, 공휴일 특별 영업과 차단 시간이 겹치는 경우를 확인했습니다. ConcurrentBookingUseCaseIT로 예약 확정과 슬롯 자동 생성을 동시에 실행해도 예약된 시간과 충돌하는 새 슬롯이 활성화되지 않는지 확인했고, KoreanPublicHolidayPolicyTest로 2026년 법정, 음력 및 대체공휴일을 검증했습니다.",
                boundary:
                    "같은 클래스의 예약 시간 조회와 예약 확정은 클래스 행을 차례로 잠그기 때문에 조회가 몰릴 때 대기 시간을 관찰해야 합니다. 임시공휴일과 선거일은 날짜 차단으로 보완해야 하며, 예약 캘린더 구현은 2026.08.27 로컬 커밋 1e1e7a87 기준으로 원격 개발 브랜치와 공개 main 반영 전입니다.",
                print: {
                    label: "BOOKING / CALENDAR",
                    problem:
                        "반복 예약 시간 입력을 줄이면서 기존 예약과 동시 예약 제어를 유지해야 함",
                    solution: "기본 운영 규칙, 날짜 및 시간 예외와 조회 시 예약 시간 자동 생성",
                    tradeoff: "같은 클래스 조회 및 예약 직렬화와 임시 휴일 수동 보완",
                },
            },
        ],
        stack: [
            "Java 25",
            "Spring Boot 4.1",
            "Gradle",
            "JPA",
            "MyBatis",
            "MySQL",
            "Redis",
            "React 19",
            "React Router 8 Framework Mode",
            "TypeScript",
            "Testcontainers",
            "Playwright",
            "Spring REST Docs",
        ],
        links: [
            {
                label: "GitHub 저장소",
                href: "https://github.com/ljkhyeong/happyGallery",
                note: "애플리케이션 코드와 테스트",
            },
            {
                label: "요구사항, ADR 및 회고 문서",
                href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs",
                note: "요구사항, ADR, 실험과 회고 기록",
            },
        ],
    },
    {
        ...projectSummariesById["hope-commit"],
        evidenceAsOf:
            "2026.08.27 기준 · 공개 main 3.1.1과 원격 개발 브랜치 4.0.0의 구현 상태를 구분해 표기",
        evidenceTitle: "구현 및 자동화 테스트",
        systemTitle: "커밋 검토 처리 흐름",
        systemNavLabel: "처리 흐름",
        architecture: {
            label: "입력한 커밋과 부모 커밋에 저장된 코드만 비교",
            title: "현재 수정 중인 파일을 제외하고, 사용자가 입력한 커밋과 바로 이전 커밋의 변경만 검토합니다.",
            description:
                "짧은 커밋 ID를 전체 ID로 확정하고 기본적으로 첫 번째 부모와 비교합니다. 최초 커밋은 빈 상태, 병합 커밋은 사용자가 지정한 부모를 기준으로 삼습니다. 현재 작업 파일이 바뀌어도 처음 선택한 커밋에 저장된 코드와 변경 내역을 계속 사용합니다.",
            tradeoff:
                "같은 커밋에서는 같은 코드를 검토할 수 있지만 수집과 검증 단계가 추가됩니다. 로컬 저장소에 대상 커밋이 있어야 하며, 원격 CI 결과와 이슈 및 토론 내용은 자동으로 가져오지 않습니다.",
        },
        featuredProblemNumbers: ["01", "02", "03", "04"],
        documentGroups: [
            {
                id: "feature",
                label: "Commit Diff 실행 기준",
                count: "1",
                summary: "Commit Diff의 실행 조건, 입력과 완료 기준을 정의합니다.",
            },
            {
                id: "security",
                label: "보안 정책",
                count: "1",
                summary: "비공개 경로와 자격 증명 형태의 데이터를 차단하는 기준을 관리합니다.",
            },
            {
                id: "license",
                label: "라이선스 및 원본 고지",
                count: "2",
                summary:
                    "SeungIl 님이 개발한 원본 Hope의 저작권, MIT 라이선스와 포크 관계를 명시합니다.",
            },
        ],
        documents: [
            {
                type: "README",
                label: "Hope Commit 한국어 소개",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/README.ko.md",
                note: "Commit Diff의 목적, 동작 범위와 설치 방법",
            },
            {
                type: "Skill Contract",
                label: "Commit Diff 실행 절차",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/plugins/hope-commit/skills/commit-diff/SKILL.md",
                note: "입력 가능한 커밋, 비교 대상, 코드 수집, 결과 검증과 HTML 저장 조건",
            },
            {
                type: "Security",
                label: "보안 정책",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/SECURITY.md",
                note: "정의한 비공개 경로와 고신뢰 자격 증명 패턴을 분석 근거에서 제외하는 기준",
            },
            {
                type: "Notice",
                label: "원본 프로젝트 고지",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/NOTICE",
                note: "SeungIl 님이 개발한 원본 Hope의 저작권, MIT 라이선스와 비공식 포크 관계",
            },
        ],
        proofs: [
            {
                item: "입력 커밋과 비교 대상 확정",
                method: "테스트용 Git 저장소를 사용한 Commit Diff 코드 수집 테스트",
                rule: "짧은 커밋 ID, 최초 커밋과 병합 커밋의 선택한 부모를 각각 확정해 Git 객체에서 변경 파일을 수집",
                result: "전체 커밋 ID와 부모를 고정하고 파일 이름 변경 및 변경 줄 수를 유지하는 테스트 통과",
                scope: "commit-collector.test.mjs 기준",
            },
            {
                item: "비공개 파일과 토큰 제외 및 리뷰 근거 검증",
                method: "비공개 경로, 토큰 형태와 변경 파일 및 줄 위치 검증 테스트",
                rule: "분석 과정에서 추가로 요청한 파일도 본문을 읽기 전에 비공개 경로인지 검사. 변경 파일에서 발견한 토큰 및 인증 키 형태의 값은 분석 입력과 HTML에서 제외",
                result: "정의한 비공개 설정 경로와 토큰 및 인증 키 형태의 값을 제외하고, 수집하지 않은 파일과 줄을 가리키는 리뷰 설명을 거절",
                scope: "commit-redaction.test.mjs 및 근거 검증 테스트 기준",
            },
            {
                item: "검증이 끝난 결과만 새 HTML로 저장",
                method: "커밋 선택부터 HTML 저장까지 전체 처리 테스트",
                rule: "대상 준비, 근거 기록, 분석 스키마 검증과 커밋 재확인을 모두 통과한 경우에만 새 HTML 파일 게시",
                result: "기존 결과 파일을 덮어쓰지 않고 확정한 커밋 정보가 포함된 새 HTML 생성",
                scope: "commit-lifecycle.test.mjs 기준",
            },
            {
                item: "저장소 자동화 테스트",
                method: "Node.js 내장 테스트 러너로 npm test 실행",
                rule: "Commit Diff와 원본 Hope의 코드 수집, 결과 검증, HTML 생성 및 플러그인 설치 기능이 유지되는지 자동화 테스트 실행",
                result: "자동화 테스트 245개 통과, 실패 0개",
                scope: "2026.08.27 공개 저장소 main 브랜치 기준",
            },
        ],
        category: "오픈소스 및 개발 도구",
        role: "Hope 3.0.3 포크, 로컬 커밋 비교 및 HTML 리뷰 기능과 자동화 테스트 추가",
        oneLine:
            "입력한 로컬 커밋을 부모 커밋과 비교해 변경 코드와 리뷰를 새 HTML 파일로 저장하되, 현재 수정 중인 파일과 이전 대화는 분석에서 제외",
        status: {
            label: "공개 상태",
            text: "SeungIl 님이 개발한 Hope 3.0.3의 Git 이력, MIT 라이선스와 기존 기능을 유지한 비공식 포크입니다. 제가 추가한 Commit Diff와 관련 테스트 및 문서는 README와 NOTICE에 구분했습니다. 공개 main은 3.1.1이고, 원격 개발 브랜치에서는 호출 명령과 비공개 경로 및 토큰 차단 규칙을 보완한 4.0.0을 검증 중입니다. 4.0.0은 아직 main과 태그에 반영하지 않았습니다.",
        },
        visualCaption:
            "입력 커밋과 부모 커밋을 먼저 확정하고 현재 수정 파일을 제외한 변경 코드를 수집한 뒤, 리뷰 설명이 실제 파일과 줄을 가리키는지 확인한 결과만 새 HTML로 저장합니다.",
        problems: [
            {
                number: "01",
                title: "현재 수정 파일을 제외하고 입력 커밋만 비교",
                constraint:
                    "스테이징한 파일, 수정 중인 파일과 추적하지 않는 파일을 함께 읽으면 특정 커밋에 없던 내용이 검토 결과에 섞일 수 있습니다.",
                decision:
                    "입력한 16진수 커밋 ID를 전체 객체 ID로 확정하고 선택한 부모와 비교했습니다. 파일 본문과 변경 내역은 현재 작업 트리가 아니라 확정한 커밋과 부모의 Git 객체에서 읽습니다.",
                validation:
                    "짧은 커밋 ID, 최초 커밋, 병합 커밋의 부모 선택과 파일 이름 변경을 테스트용 Git 저장소로 확인했습니다.",
                boundary:
                    "로컬 저장소에 존재하는 한 커밋만 검토합니다. 원격 CI 결과, 이슈와 토론 내용은 자동으로 수집하지 않습니다.",
            },
            {
                number: "02",
                title: "대용량 변경과 토큰 및 인증 키가 리뷰에 포함되지 않도록 제한",
                constraint:
                    "큰 변경사항이나 저장소 안의 자격 증명 값이 그대로 분석 입력과 HTML 결과에 포함되면 검토 범위가 불명확해지고 정보가 노출될 수 있습니다.",
                decision:
                    "변경 파일, 줄 수, 본문 크기와 분석 도중 추가로 읽을 수 있는 코드 구간 수에 상한을 두었습니다. 비공개 설정 경로와 자격 증명 형태를 검사해 분석 입력과 HTML에서 제외하고, 제외 사유는 확인하지 못한 범위로 기록합니다.",
                validation:
                    "npm, PyPI 및 네트워크 자격 증명 경로와 토큰 형태, 파일 크기와 추가 코드 조회 상한의 바로 아래 및 위 값을 테스트했습니다.",
                boundary:
                    "제외한 파일의 구현 내용은 분석하지 않습니다. 필요한 근거가 제한 범위 밖에 있으면 결과에 확인하지 못한 범위로 표시합니다.",
            },
            {
                number: "03",
                title: "리뷰 설명이 실제 변경 파일과 코드 줄을 가리키는지 검증",
                constraint:
                    "분석 모델이 이전 대화나 추측을 섞으면 실제 변경 코드가 뒷받침하지 않는 설명과 지적이 생성될 수 있습니다.",
                decision:
                    "이전 대화를 전달하지 않은 별도 분석 작업에서 리뷰하고, 각 설명에 실제 변경 파일과 줄 번호를 연결했습니다. 결과 형식은 JSON Schema로 확인하고 수집하지 않은 파일이나 줄을 가리키면 거절합니다.",
                validation:
                    "다른 페이지의 근거 참조, 존재하지 않는 파일과 줄 범위, 스키마에 없는 필드 및 과도한 설명을 거절하는 테스트로 확인했습니다.",
                boundary:
                    "별도 분석 작업을 사용할 수 없으면 검토를 중단합니다. 코드 줄 연결 여부는 확인할 수 있지만 리뷰 판단이 반드시 옳다는 뜻은 아니므로 사용자가 최종 확인해야 합니다.",
            },
            {
                number: "04",
                title: "검증이 끝난 결과만 새 HTML 파일로 저장",
                constraint:
                    "검토 도중 대상 커밋이 바뀌거나 다른 실행의 작업 파일 및 기존 결과를 덮어쓰면 어떤 코드로 만든 문서인지 확인하기 어렵습니다.",
                decision:
                    "리뷰 내용 검증 후 처음 확정한 커밋 코드가 남아 있는지 다시 확인하고 새 경로에 HTML을 저장합니다. 기존 출력 파일과 다른 실행이 사용 중인 작업 디렉터리는 교체하거나 삭제하지 않습니다.",
                validation:
                    "검증 전후 커밋 변경, 기존 출력 경로, 심볼릭 링크와 게시 중 경합을 재현해 게시 중단 및 임시 상태 보존 규칙을 확인했습니다.",
                boundary:
                    "HTML은 로컬 파일로만 생성합니다. 원격 저장소 게시, 브랜치 생성, 푸시와 리뷰 댓글 작성은 수행하지 않습니다.",
            },
        ],
        stack: [
            "JavaScript",
            "Node.js 22",
            "Git 객체 조회",
            "JSON Schema",
            "HTML / CSS",
            "Node Test Runner",
            "Codex Plugin",
            "Claude Code Plugin",
        ],
        links: [
            {
                label: "Hope Commit GitHub 저장소",
                href: "https://github.com/ljkhyeong/hope-commit",
                note: "Commit Diff 구현, 자동화 테스트와 플러그인 패키지",
            },
            {
                label: "원본 Hope 저장소",
                href: "https://github.com/dkstm95/hope",
                note: "SeungIl 님이 개발한 원본 프로젝트",
            },
        ],
        linkNote:
            "SeungIl 님이 개발한 Hope 3.0.3을 기반으로 포크한 뒤, 개인적인 커밋 검토 필요에 맞게 수정 및 보완했습니다. Hope Commit은 비공식 포크이며 원본 프로젝트가 이 포크를 보증하거나 유지보수하지 않습니다.",
    },
    {
        ...projectSummariesById.warrant,
        evidenceTitle: "주요 구현 및 확인 결과",
        proofs: [
            {
                item: "해양경찰 KICS 독립망 연계",
                method: "인터페이스 매핑 및 Spring Batch 단계별 확인",
                rule: "KICS의 통신사실확인자료 요청과 통신사 제출 자료를 KICS-통신사 및 KICS-집행포털 연계 계약에 맞춰 변환하고 단계별 처리 상태를 확인",
                result: "KICS의 요청이 기관별 규격으로 변환되어 통신사와 집행포털로 전달되고, 제출 자료가 다시 KICS에 반영되는 단계별 상태를 확인",
                scope: "보안상 운영 수치와 테스트 코드는 비공개",
            },
            {
                item: "누적 전송 상태 조회",
                method: "조회 쿼리 및 화면 이동 시나리오 확인",
                rule: "신규 화면은 커서 페이지네이션, 번호 이동이 필요한 기존 화면은 커버링 인덱스 기반 지연 조인 적용",
                result: "화면 요구에 따라 두 조회 방식을 분리 적용",
                scope: "구체적인 데이터 건수와 응답 시간은 비공개",
            },
            {
                item: "PDF 변환 요청 상태 저장 전 도착한 완료 콜백 처리",
                method: "PDF 변환 요청 상태 저장과 변환 완료 콜백의 순서를 바꾼 시나리오 확인",
                rule: "PDF 변환 완료 콜백이 변환 요청 상태의 DB 저장보다 먼저 도착하도록 실행",
                result: "Spring Retry의 지수 백오프와 지터로 PDF 변환 요청 상태를 다시 조회한 뒤 완료 결과를 반영",
                scope: "보안상 운영 수치와 테스트 코드는 비공개",
            },
        ],
        category: "BEINTECH / LG CNS 컨소시엄 공공 SI",
        role: "KICS의 자료 제공 요청을 통신사와 집행포털 규격으로 변환해 전송하고, 기관의 제출 자료를 수신 및 반영하는 인터페이스와 Spring Batch 구현",
        oneLine:
            "KICS의 자료 제공 요청을 기관별 규격으로 변환해 통신사와 집행포털로 전달하고, 제출 자료를 다시 KICS에 반영",
        status: {
            label: "공개 범위",
            text: "BEINTECH 소속으로 LG CNS 컨소시엄에 참여해 진행 중인 공공 SI입니다. 독립망 간 연계 구조와 직접 수행한 역할은 공개하고, 실제 접속 주소, 운영 환경 설정값, 보안 설정, 소스 코드와 내부 문서만 제외했습니다.",
        },
        systemTitle: "독립망 간 업무 흐름 및 시스템 구성",
        systemNavLabel: "업무 흐름",
        visualCaption:
            "전체 시스템은 KICS, 집행포털, 금융기관 및 통신사의 독립망 사이에서 요청과 제출 자료를 중계합니다. 이 가운데 KICS-통신사 및 KICS-집행포털 연계 인터페이스와 배치를 담당했습니다.",
        architecture: {
            label: "조회 코드 재사용과 외부 API 트랜잭션 분리",
            title: "조회, 변환과 전송 코드를 역할별 클래스로 나누고, 외부 API 응답을 기다리는 동안에는 DB 트랜잭션을 유지하지 않았습니다.",
            description:
                "통신사실확인자료와 수신자료 조회에서 반복되는 분기와 오류 처리는 공통 메서드, 상태값과 오류 코드로 묶었습니다. 기관별 조회, 변환과 전송 코드는 별도 클래스로 분리했습니다. 외부 API 호출 전후의 DB 반영만 별도 트랜잭션으로 실행해 응답 대기 중 DB 연결을 점유하지 않도록 했습니다.",
            tradeoff:
                "공통 구조를 먼저 잡아 초기 구현은 느려졌지만 후속 기능에서 수정할 코드는 줄었습니다. 현재는 한 서버 안의 ReentrantLock으로 겹친 호출을 막으므로, 서버를 여러 대로 늘리면 DB 잠금이나 분산 잠금 방식이 필요합니다.",
        },
        problems: [
            {
                number: "01",
                title: "누적 전송 이력의 뒤쪽 페이지 조회 비용을 줄이면서 기존 번호 이동 유지",
                constraint:
                    "전송 상태와 수신 자료가 계속 쌓이면 OFFSET이 커질수록 뒤쪽 페이지 조회 비용이 증가합니다. 기존 업무 화면은 번호 이동도 유지해야 했습니다.",
                decision:
                    "신규 전송 상태 조회에는 커서 페이지를 적용했습니다. 번호 이동이 필요한 기존 대용량 화면은 커버링 인덱스로 키를 먼저 찾고 본문을 지연 조인했으며, 데이터가 적은 화면에는 적용하지 않았습니다.",
                validation:
                    "신규 화면은 마지막 조회 키 다음 데이터부터 이어지는지 확인했습니다. 기존 화면은 페이지 번호 이동과 목록 결과를 유지하면서 키를 먼저 찾고 본문을 나중에 조회하는 SQL이 적용되는지 확인했습니다.",
                boundary:
                    "커서 페이지는 임의 페이지 이동이 어렵고 지연 조인은 SQL이 복잡해집니다. 조회량이 적은 화면은 단순한 쿼리의 유지보수성을 우선했습니다.",
            },
            {
                number: "02",
                title: "기관마다 반복되던 조회, 변환 및 전송 코드를 공통 처리와 기관별 구현으로 분리",
                constraint:
                    "수신 자료와 통신사실확인자료의 화면, 인터페이스와 Spring Batch 흐름이 비슷해 기능마다 같은 분기와 변환 코드를 만들 가능성이 컸습니다.",
                decision:
                    "공통 처리 흐름은 공통 메서드와 상태값으로 묶고 조회, 변환과 전송은 역할별 클래스로 나눴습니다. 기관별로 다른 데이터 형식과 처리 규칙은 별도 구현으로 분리했습니다.",
                validation:
                    "후속 수신 자료 기능에서 공통 코드를 재사용해 새로 작성하거나 수정할 코드 범위를 줄였습니다.",
                boundary:
                    "공통 구조를 설계하는 동안 첫 기능의 개발 속도는 느려졌습니다. 동작이 다른 기관별 규칙은 분리해 과도한 공통화를 피했습니다.",
            },
            {
                number: "03",
                title: "PDF 변환 요청 상태 저장 전 도착한 완료 콜백 재처리",
                constraint:
                    "외부 PDF 변환을 요청한 뒤 애플리케이션이 변환 요청 상태를 DB에 저장하기 전에 완료 콜백이 도착하면, 콜백 처리 시 대상 요청을 찾지 못해 정상 변환 결과가 누락될 수 있었습니다.",
                decision:
                    "Spring Retry에 지수 백오프와 지터를 적용해 짧은 간격으로 상태를 다시 조회했습니다. 동시에 몰린 콜백의 재시도 시점도 분산했습니다.",
                validation:
                    "PDF 변환 완료 콜백이 변환 요청 상태의 DB 저장보다 먼저 도착하는 경우에도 상태를 재조회한 뒤 완료 결과가 반영되는 것을 확인했습니다.",
                boundary:
                    "재시도는 정해진 횟수 안에서만 수행합니다. 계속 조회되지 않는 요청은 실패 상태로 기록하고 운영자 확인 절차로 넘겨야 합니다.",
            },
            {
                number: "04",
                title: "외부 API 호출과 DB 트랜잭션 분리",
                constraint:
                    "주기적으로 들어오는 연계 요청이 겹치고 외부 승인 API 응답이 늦어지면 같은 작업이 중복 실행되거나 DB 연결을 오래 점유할 수 있었습니다.",
                decision:
                    "외부 API를 호출하기 전과 응답을 받은 뒤의 DB 저장을 각각 별도 트랜잭션(REQUIRES_NEW)으로 처리했습니다. 한 애플리케이션 안에서는 ReentrantLock으로 같은 작업의 겹친 실행을 막았습니다.",
                validation:
                    "동시 호출에서 진행 중인 작업이 다시 실행되지 않고 외부 호출 전후의 DB 반영이 나뉘는 것을 확인했습니다.",
                boundary:
                    "ReentrantLock은 한 서버 프로세스 안에서만 유효합니다. 서버를 여러 대로 확장하면 DB 잠금이나 분산 잠금 등 별도의 조정 수단이 필요합니다.",
            },
        ],
        stack: ["Java 11", "Spring Boot 2.6", "Spring Batch", "Oracle DB", "WebSquare", "Maven"],
        links: [],
        linkNote:
            "보안 및 기밀 유지 기준에 따라 소스 코드, 운영 화면과 내부 설계 문서는 공개하지 않습니다.",
    },
    {
        ...projectSummariesById.defense,
        evidenceTitle: "주요 구현 및 확인 결과",
        systemTitle: "수용자 인적정보 및 영장정보 연계 배치 흐름",
        systemNavLabel: "연계 흐름",
        proofs: [
            {
                item: "기관별 수용자 정보 연계 배치와 중단 단계 재처리",
                method: "기관별 배치 실행 결과, WAS 로그와 Tibero 처리 상태 확인",
                rule: "군사법원, 군검찰 및 군사경찰에서 받은 수용 대상자의 인적정보와 영장정보를 수신하고 필수값과 형식을 검증한 뒤 군교정 DB에 반영",
                result: "Jenkins 실행 이력과 WAS 및 DB 상태를 대조해 중단 단계를 찾고, 해당 기관 자료의 재처리와 군교정 DB 반영까지 확인",
                scope: "운영 건수, 내부 데이터와 세부 연계 규격은 비공개",
            },
            {
                item: "WebSquare 상태 변경 요청의 CSRF 처리",
                method: "정상 토큰, 토큰 누락 및 불일치 요청을 각각 실행",
                rule: "Spring Security가 생성한 CSRF 토큰의 이름과 값을 WebSquare 화면 데이터 규격으로 전달하고 공통 요청 로직에서 상태 변경 요청마다 포함",
                result: "정상 요청은 처리하고 토큰이 없거나 일치하지 않는 요청은 Spring Security 필터에서 차단되는 것을 확인",
                scope: "폐쇄망 환경에서 확인",
            },
            {
                item: "대용량 파일 직접 업로드",
                method: "허용 및 차단 요청의 URL 발급 여부와 파일 본문 전송 경로 확인",
                rule: "WAS가 업로드 권한과 파일 정보를 검증한 뒤 Presigned URL을 발급하고, 브라우저가 기존 파일 솔루션으로 직접 업로드",
                result: "검증을 통과한 요청에만 URL을 발급하고 파일 본문이 WAS를 거치지 않는 것을 확인해 업로드 요청이 사용하는 WAS 메모리와 I/O를 줄임",
                scope: "폐쇄망 환경에서 확인",
            },
        ],
        category: "BEINTECH / 국방부 SI",
        role: "군교정 업무 화면 개발, 기관별 수용자 정보 연계 배치와 Jenkins, JEUS 및 Tibero를 이용한 장애 분석",
        oneLine:
            "세 기관의 수용자 자료를 검증해 군교정 DB에 반영하고, WebSquare 상태 변경 요청의 위조를 차단했으며, 대용량 파일은 WAS를 거치지 않고 저장소로 전송했습니다.",
        status: {
            label: "공개 범위",
            text: "BEINTECH 소속으로 수행한 보안이 필요한 국방부 SI입니다. 운영 데이터, 접속 환경과 세부 연계 규격은 공개하지 않고 직접 수행한 개발과 운영 업무만 정리했습니다.",
        },
        visualCaption:
            "군사법원, 군검찰 및 군사경찰에서 받은 수용 대상자의 인적정보와 영장정보를 기관별 배치로 검증한 뒤 군교정 DB에 반영하는 흐름입니다.",
        problems: [
            {
                number: "01",
                title: "수용자 인적정보 및 영장정보 연계 배치 구현",
                constraint:
                    "군사법원, 군검찰 및 군사경찰마다 수용 대상자의 인적정보와 영장정보 형식 및 전달 시점이 달랐고, 연계가 중단되면 수용과 후속 군교정 업무를 처리할 수 없었습니다.",
                decision:
                    "군사법원, 군검찰 및 군사경찰에서 받은 수용 대상자의 인적정보와 영장정보를 기관별로 수신하고, 필수값과 데이터 형식을 검증한 뒤 군교정 DB에 반영하도록 배치를 구현했습니다. Jenkins에서 기관별 실행 이력과 실패 단계를 확인하고 필요한 배치만 재처리하도록 구성했습니다.",
                validation:
                    "기관별 자료 수신 여부와 Jenkins 실행 결과, WAS 로그 및 Tibero 처리 상태를 대조해 중단 단계를 찾고, 재처리 후 인적정보와 영장정보가 군교정 DB에 반영되는 것까지 확인했습니다.",
                boundary:
                    "외부 모니터링 도구를 자유롭게 설치할 수 없어 일부 확인은 수동 절차와 기관 담당자 협업이 필요했습니다.",
            },
            {
                number: "02",
                title: "WebSquare 저장 및 변경 요청에 CSRF 토큰을 포함해 위조 요청 차단",
                constraint:
                    "기존 WebSquare 업무 화면의 저장 및 변경 요청에도 Spring Security가 발급한 CSRF 토큰을 포함해 위조 요청을 차단해야 했습니다.",
                decision:
                    "Spring Security가 생성한 CSRF 토큰의 이름과 값을 WebSquare 화면 데이터 규격으로 전달하고, 화면 공통 요청 로직이 상태 변경 요청마다 토큰을 포함하도록 구성했습니다. 토큰이 없거나 일치하지 않으면 Spring Security 필터에서 차단했습니다.",
                validation:
                    "정상 토큰, 토큰 누락과 불일치 요청을 각각 실행해 정상 요청만 처리되고 나머지는 필터에서 차단되는 것을 확인했습니다.",
                boundary:
                    "WebSquare의 모든 공통 요청 경로에서 토큰 이름과 값을 같은 방식으로 전달해야 하므로, 새 상태 변경 요청을 추가할 때 공통 로직 적용 여부를 확인해야 합니다.",
            },
            {
                number: "03",
                title: "대용량 파일을 WAS를 거치지 않고 저장소로 직접 업로드",
                constraint:
                    "대용량 파일 본문이 업무 WAS를 거치면 요청마다 메모리와 I/O를 사용하고, 동시에 업로드할 때 서버 부하가 커질 수 있었습니다. 기존 파일 솔루션은 유지해야 했습니다.",
                decision:
                    "화면에서 WAS에 업로드 권한과 파일 정보를 요청하고, 검증을 통과하면 Presigned URL을 발급했습니다. 브라우저는 이 URL로 기존 파일 저장 시스템에 직접 업로드하며 WAS는 파일 본문을 받거나 중계하지 않았습니다.",
                validation:
                    "허용 및 차단 요청의 Presigned URL 발급 여부를 확인하고, 허용된 파일 본문이 WAS를 거치지 않고 기존 파일 솔루션으로 직접 전송되는 경로를 확인했습니다.",
                boundary:
                    "Presigned URL의 만료 시간과 업로드 조건, 업로드 완료 상태를 별도로 관리해야 합니다. 브라우저와 파일 저장소 사이에서 실패한 업로드를 다시 확인하는 절차도 필요합니다.",
            },
            {
                number: "04",
                title: "Jenkins 실행 이력, JEUS 로그와 Tibero 상태를 대조해 배치 중단 위치 확인",
                constraint:
                    "폐쇄망에는 통합 모니터링과 자동화 테스트가 없어 화면 오류만으로 장애 위치를 알기 어려웠습니다. 요청 처리, SQL, 기관 연계 배치와 DB 반영 중 어느 단계가 중단됐는지 로그와 DB 상태를 직접 대조해야 했습니다.",
                decision:
                    "Jenkins 실행 이력에서 배치 실행 시각과 성공 및 실패 단계를 먼저 확인하고, 같은 시각의 JEUS 및 WAS 로그에서 요청과 예외를 찾았습니다. 이후 Tibero의 입력 데이터, 처리 상태와 결과 데이터를 비교해 배치 실행 전, 처리 중 또는 DB 반영 단계 중 어디에서 멈췄는지 판단했습니다. 필요한 경우 기관 담당자와 실제 송수신 시각도 대조했습니다.",
                validation:
                    "실제 운영 장애에서 기관 데이터 수신, 배치 시작 및 종료, DB 상태 변경과 화면 조회 순서로 확인해 누락되거나 중단된 단계를 찾고 재처리 후 정상 반영까지 확인했습니다.",
                boundary:
                    "통합 추적 도구가 없어 로그와 DB를 수동으로 대조해야 했고, 기관 간 전송 시각 확인과 재처리는 담당자 협업이 필요했습니다.",
            },
        ],
        stack: [
            "Java 8",
            "전자정부 표준프레임워크 4.1",
            "MyBatis",
            "Tibero",
            "Spring Security",
            "JEUS",
            "Jenkins",
            "SVN",
        ],
        links: [],
        linkNote:
            "보안 및 기밀 유지 기준에 따라 소스 코드, 운영 화면, 외부 문서는 공개하지 않습니다.",
    },
    {
        ...projectSummariesById.webrtc,
        evidenceTitle: "구현 범위 및 확인 결과",
        proofs: [
            {
                item: "RTP 입력부터 React 실시간 및 다시보기 화면까지",
                method: "공개 HLS 서버 및 React 구현 코드 검토와 6인 팀 시연",
                rule: "mediasoup의 RTP 출력을 FFmpeg와 GStreamer에서 HLS로 변환하고, React 화면에서 WebRTC 실시간 영상과 HLS 지난 구간 영상을 각각 재생",
                result: "React 화면에서 현재 강의는 WebRTC로 재생되고, 지난 구간을 선택하면 생성된 HLS 영상이 재생되는 것을 확인",
                scope: "직접 담당한 HLS 서버와 React 프론트엔드 구현 범위",
            },
            {
                item: "HLS 다시보기 재생 지연",
                method: "공개 HLS 서버 커밋에 기록된 설정 변경 전후의 시연 환경 재생 시간 비교",
                rule: "HLS 세그먼트 길이와 FFmpeg 인코딩 설정을 조정한 뒤, RTP 입력부터 React HLS 재생까지 걸리는 시간을 다시 측정",
                result: "HLS 다시보기 재생 지연을 약 35초에서 약 17초로 단축",
                scope: "공개 저장소 커밋 및 시연 기록 기준이며 네트워크와 기기를 통제한 정밀 벤치마크는 아님",
            },
        ],
        category: "교육 프로젝트",
        role: "RTP 입력 및 HLS 변환 서버, React 실시간 및 다시보기 화면 구현",
        oneLine:
            "현재 강의는 mediasoup와 WebRTC로 실시간 재생하고, mediasoup의 RTP 출력은 HLS로 변환해 지난 구간을 다시 볼 수 있도록 구현했습니다.",
        status: {
            label: "프로젝트 상태",
            text: "2023년 교육 과정 팀 프로젝트로 개발과 시연을 완료했습니다. 현재 운영하지 않으며 HLS 서버와 React 구현은 공개 저장소에서 확인할 수 있습니다.",
        },
        visualCaption:
            "현장 강의 영상은 WebRTC로 React 실시간 화면에 전달하고, mediasoup가 내보낸 RTP는 FFmpeg와 GStreamer에서 HLS 세그먼트와 재생 목록으로 변환해 React 다시보기 화면에 제공했습니다.",
        problems: [
            {
                number: "01",
                title: "현재 강의는 WebRTC로 실시간 재생하고 지난 구간은 HLS로 다시보기 제공",
                constraint:
                    "현재 강의는 낮은 지연으로 재생하면서 수강자가 놓친 구간은 이전 시점으로 돌아가 볼 수 있어야 했습니다. WebRTC 실시간 경로와 저장 가능한 HLS 다시보기 경로를 별도로 구성해야 했습니다.",
                decision:
                    "실시간 영상은 mediasoup와 WebRTC를 통해 React 화면에 연결했습니다. 다시보기는 HLS 서버가 mediasoup의 RTP 출력을 입력받고 FFmpeg와 GStreamer로 HLS 세그먼트 및 재생 목록을 생성한 뒤, React 플레이어에서 지난 구간을 선택해 재생하도록 구현했습니다.",
                validation:
                    "팀 시연에서 React 화면으로 현재 강의를 WebRTC로 시청하면서, 지나간 구간을 선택하면 생성된 HLS 영상이 재생되는 것을 확인했습니다. HLS 서버와 React 기능은 각각 공개 저장소에 남겼습니다.",
                boundary:
                    "HLS는 세그먼트를 일정 시간 모은 뒤 재생하므로 WebRTC보다 지연이 큽니다. 이 프로젝트는 교육용 시연까지 완료했으며 장기 운영과 대규모 동시 접속은 검증하지 않았습니다.",
            },
            {
                number: "02",
                title: "HLS 다시보기 재생 지연을 약 35초에서 약 17초로 단축",
                constraint:
                    "초기 설정에서는 RTP 영상이 React HLS 플레이어에서 재생되기까지 약 35초가 걸려, 방금 놓친 강의 구간을 다시 보려는 기능의 사용성이 떨어졌습니다.",
                decision:
                    "HLS 세그먼트 길이를 줄이고 FFmpeg 인코딩 설정을 조정해, 플레이어가 재생을 시작하는 데 필요한 영상 데이터가 더 빨리 만들어지도록 변경했습니다.",
                validation:
                    "같은 시연 흐름에서 RTP 입력부터 React HLS 재생까지 걸리는 시간을 설정 변경 전후로 비교해 약 35초에서 약 17초로 줄어든 것을 확인했습니다.",
                boundary:
                    "공개 저장소 커밋과 시연 기록을 기준으로 한 측정이며 네트워크와 재생 기기를 통제한 정밀 벤치마크는 아닙니다. HLS 구조상 남아 있는 지연을 더 줄이려면 저지연 HLS 적용과 플레이어 버퍼 설정 검증이 필요합니다.",
            },
        ],
        stack: ["React", "WebRTC", "HLS", "mediasoup", "FFmpeg", "GStreamer", "Node.js"],
        links: [
            {
                label: "HLS 서버 저장소",
                href: "https://github.com/TeamyRoom/TMeRoom-HLSServer",
                note: "직접 담당한 HLS 서버 구현",
            },
            {
                label: "React 프론트엔드 저장소",
                href: "https://github.com/TeamyRoom/TMeRoom-FrontServer",
                note: "직접 담당한 React 화면 구현",
            },
            {
                label: "시연 영상",
                href: "https://www.youtube.com/watch?v=KKR2vj10sNQ",
                note: "WebRTC 실시간 시청과 HLS 지난 구간 재생을 확인할 수 있는 팀 시연 영상",
            },
        ],
    },
]

export const projectList = projectSummaries.map(({ id }) =>
    projects.find((project) => project.id === id),
)

export const careerCaseStudies = projectList.filter((project) => project.projectType === "career")

export const personalCaseStudies = projectList.filter(
    (project) => project.projectType === "personal",
)

export const toolingCaseStudies = projectList.filter((project) => project.projectType === "tooling")

export const educationCaseStudies = projectList.filter(
    (project) => project.projectType === "education",
)

export const navigableCaseStudyGroups = [
    { id: "career", label: "경력", title: "경력 프로젝트", projects: careerCaseStudies },
    { id: "personal", label: "개인", title: "개인 프로젝트", projects: personalCaseStudies },
    {
        id: "tooling",
        label: "도구",
        title: "오픈소스 및 개발 도구",
        projects: toolingCaseStudies,
    },
]

export const navigableCaseStudies = navigableCaseStudyGroups.flatMap((group) => group.projects)

export const projectsById = Object.fromEntries(projectList.map((project) => [project.id, project]))

export const batonServicesById = Object.fromEntries(
    projectsById.baton.services.map((service) => [service.id, service]),
)

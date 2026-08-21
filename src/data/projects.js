import { projectSummaries, projectSummariesById } from "./projectSummaries"

const projects = [
    {
        ...projectSummariesById.baton,
        evidenceAsOf: "2026.08.13 저장소 기준",
        evidenceTitle: "테스트 방법 및 결과",
        systemTitle: "대표 화면 및 마이크로서비스 구성",
        systemNavLabel: "화면 및 서비스",
        screenshots: [
            {
                id: "workspace",
                src: "baton-workspace.png",
                label: "업무 흐름",
                caption: "바통 타임라인, 멈춘 흐름과 결정 기록",
                alt: "BATON 오늘 화면에서 바통 타임라인과 멈춘 역할 및 결정 기록을 확인하는 모습",
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
                caption: "담당자, 핵심 책임과 바통 준비도",
                alt: "BATON 모바일 역할 상세에서 담당자와 핵심 책임 및 바통 준비도를 확인하는 모습",
                width: 390,
                height: 844,
                fit: "contain",
            },
        ],
        architecture: {
            label: "서비스 경계",
            title: "Core는 기준 데이터를 관리하고, 5개 마이크로서비스는 서로 다른 변경 및 장애 흐름을 분리합니다.",
            description:
                "Core가 팀, 시즌, 권한, 루틴과 인수인계를 관리합니다. GO, WATCH, RELAY, BRIEF, CAL은 링크, URL 점검, 메시지 전송, 주간 브리프와 캘린더 구독을 각각 별도 저장소와 데이터베이스에서 처리합니다.",
            tradeoff:
                "서비스별 장애와 배포 범위를 분리한 대신 저장소, 배포와 모니터링 대상이 늘고 서비스 간 데이터 정합성을 별도로 관리해야 합니다.",
        },
        featuredProblemNumbers: ["02", "03", "05", "07"],
        spotlights: [
            {
                serviceId: "go",
                label: "GO / 멱등성",
                title: "동시 요청 8건에서도 링크를 1건만 생성",
                problem:
                    "응답이 유실되거나 여러 서버가 같은 요청을 받으면 링크가 중복 생성될 수 있었습니다.",
                solution:
                    "UUID 멱등 키와 요청 해시를 저장하고 HMAC-SHA256으로 링크 코드를 생성했습니다. 같은 멱등 키에 요청 내용이 다르면 충돌로 거절합니다.",
                tradeoff:
                    "멱등 기록을 보관하는 비용이 들고, HMAC 키 교체와 DB 복구 시 기존 링크를 유지할 절차가 필요합니다.",
            },
            {
                serviceId: "watch",
                label: "WATCH / URL 점검",
                title: "네트워크 I/O와 DB 락을 분리",
                problem:
                    "느린 URL 점검 중 DB 락을 잡으면 경합이 커지고, 늦게 끝난 작업이 최신 결과를 덮을 수 있었습니다.",
                solution:
                    "DNS 조회 결과를 고정해 SSRF와 DNS 리바인딩을 차단했습니다. 작업 선점 토큰과 원본 데이터 버전을 비교해 이전 작업의 늦은 결과는 저장하지 않았습니다.",
                tradeoff:
                    "작업 선점 유효 시간이 짧으면 중복 실행이 늘고, 길면 중단된 작업을 다른 서버가 이어받는 시점이 늦어집니다.",
            },
            {
                serviceId: "relay",
                label: "RELAY / 중복 발송 방지",
                title: "전송 결과를 모르면 다시 보내지 않음",
                problem:
                    "외부 전송은 성공했지만 응답만 잃으면 재시도가 중복 발송으로 이어질 수 있었습니다.",
                solution:
                    "수신 이력(Inbox)으로 중복 처리를 막고, SKIP LOCKED로 처리할 작업을 선점했습니다. 전송 성공 여부를 확인할 수 없으면 결과 미확인 상태(OUTCOME_UNKNOWN)로 남겼습니다.",
                tradeoff:
                    "중복 발송 방지를 우선해 자동 재전송을 멈추므로, 결과 조회나 수동 조정 절차가 추가로 필요합니다.",
            },
        ],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "18",
                summary: "서비스별 책임, 입력 계약과 완료 조건을 정의합니다.",
            },
            {
                id: "adr",
                label: "ADR",
                count: "47",
                summary: "기술 선택의 이유, 대안과 트레이드오프를 기록합니다.",
            },
            {
                id: "runbook",
                label: "Runbook",
                count: "5",
                summary: "배포, 장애 재처리와 공개 스테이징 전송 테스트 절차를 정리합니다.",
            },
            {
                id: "api",
                label: "API / Data Contract",
                count: "2",
                summary: "Core OpenAPI와 CAL JSON Schema를 서비스 간 계약의 기준으로 관리합니다.",
            },
        ],
        documents: [
            {
                serviceId: "core",
                type: "ADR 요약",
                label: "Core 헥사고날 아키텍처",
                href: "/docs/baton/core-hexagonal.md",
                note: "비공개 원문에서 공개 가능한 결정과 트레이드오프를 요약",
            },
            {
                serviceId: "go",
                type: "ADR 요약",
                label: "GO 멱등 링크 생성",
                href: "/docs/baton/go-idempotent-link.md",
                note: "동시 요청과 재시도에도 링크를 한 건만 생성하는 방식",
            },
            {
                serviceId: "watch",
                type: "ADR",
                label: "WATCH 상태 변경 이벤트 전달",
                href: "https://github.com/ljkhyeong/baton-watch/blob/main/docs/ADR/0003_health-change-event-delivery/adr.md",
                note: "아웃박스 기반 상태 변경 이벤트 전달 원문",
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
                label: "RELAY 응답 유실 시 중복 발송 방지",
                href: "/docs/baton/relay-attempt-recovery.md",
                note: "외부 호출 전에 전송 시도를 저장하고 중단된 작업을 이어서 처리하는 결정 요약",
            },
            {
                serviceId: "brief",
                type: "PRD / ADR 요약",
                label: "BRIEF 이벤트 처리와 주간 브리프 생성",
                href: "/docs/baton/brief-event-projection.md",
                note: "중복 및 순서가 바뀐 이벤트 처리와 생성 후 수정하지 않는 주간 브리프",
            },
            {
                serviceId: "cal",
                type: "PRD / ADR 요약",
                label: "CAL 일정 및 구독 계약",
                href: "/docs/baton/cal-calendar-contract.md",
                note: "일정 개정 번호, iCalendar 호환성, 구독 토큰 회전 및 폐기 계약",
            },
        ],
        services: [
            {
                id: "core",
                name: "Core",
                kind: "CORE APPLICATION",
                route: "/projects/baton",
                role: "조직 운영 기준 데이터",
                summary:
                    "팀, 역할, 루틴, 의사결정과 인수인계를 관리하고 각 마이크로서비스가 참조하는 기준 데이터를 제공합니다.",
                detail: "팀, 시즌, 역할, 루틴, 라운드, 의사결정, 자료, 인수인계",
                evidence: "PRD 5 · ADR 17 · OpenAPI 계약",
                input: "사용자 명령과 조직 운영 요청",
                output: "팀, 시즌, 역할, 루틴과 인수인계 기준 데이터",
                recoveryBoundary: "상태 변경과 담당자 변경을 한 트랜잭션에서 처리",
                database: "MySQL",
                primary: true,
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "조직 운영 핵심 흐름을 구현했고 서비스 간 전체 연동은 진행 중입니다.",
                documentation: [
                    { label: "PRD", count: "5" },
                    { label: "ADR", count: "17" },
                    { label: "OpenAPI", count: "1" },
                ],
            },
            {
                id: "go",
                name: "GO",
                kind: "MICROSERVICE",
                route: "/projects/baton/go",
                role: "BATON 전용 공유 링크",
                summary:
                    "BATON의 업무 화면을 짧고 고정된 주소로 공유하고 허용된 내부 경로로 연결합니다.",
                contribution:
                    "링크 생성, 조회와 리다이렉트, UUID 멱등 처리와 HMAC 키 검증을 설계하고 구현했습니다.",
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
                detail: "UUID 멱등 키, HMAC-SHA256 코드, 허용 경로만 처리",
                evidence: "동시 요청 8건에서 링크 1건 · 자동화 테스트 374개",
                input: "허용된 BATON 경로와 UUID 멱등 키",
                output: "허용 경로 규칙을 통과한 고정 링크 코드",
                recoveryBoundary: "같은 요청은 같은 결과를 반환하고 다른 요청은 충돌로 차단",
                database: "MySQL",
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "링크 생성, 조회, 리다이렉트와 중복 요청 처리를 구현했습니다. BATON Core 연동은 진행 중입니다.",
                tradeoff:
                    "멱등 처리 기록과 HMAC 키를 함께 관리해야 합니다. DB를 복구할 때 같은 시점의 키가 없으면 기존 링크를 그대로 유지할 수 없습니다.",
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
                    "BATON에 등록된 외부 URL을 안전하게 점검하고 상태 변경을 Core에 전달합니다.",
                contribution: "URL 검증, 작업 선점과 아웃박스 전송을 설계하고 구현했습니다.",
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
                detail: "SSRF 방어, 작업 선점 만료 후 다른 서버의 재처리, 이전 작업 결과 반영 차단, 아웃박스",
                evidence: "사설망 요청과 이전 작업의 늦은 결과 차단 · 자동화 테스트 354개",
                input: "점검 대상 URL과 원본 데이터 버전",
                output: "URL 상태와 상태 변경 이벤트",
                recoveryBoundary:
                    "작업 선점 만료 시간을 두고 중단된 작업을 다른 서버가 이어서 처리",
                database: "PostgreSQL",
                visibility: "공개 저장소",
                status: "안전한 URL 점검과 상태 변경 이벤트 전송을 구현했습니다. 스테이징 환경의 이벤트 전송 테스트는 아직 하지 않았습니다.",
                tradeoff:
                    "작업 선점 만료 시간이 짧으면 중복 실행이 늘고, 길면 중단된 작업을 다른 서버가 다시 처리하기까지 오래 걸립니다. 운영 지표를 보며 조정해야 합니다.",
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
                role: "알림 메시지 전달",
                summary:
                    "BATON의 알림 요청을 외부 메시지 공급자에 전달하고 전송 상태를 관리합니다.",
                contribution:
                    "수신 이력 중복 방지, 전송 시도 이력과 결과 미확인 처리, RabbitMQ와 SQS 연동 계약을 설계하고 구현했습니다.",
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
                detail: "수신 이력(Inbox) 중복 제거, 작업 선점, 재시도와 전송 결과 미확인 상태",
                evidence: "메시지 재전달에도 수신 이력과 전달 작업 각 1건 · 자동화 테스트 373개",
                input: "메시지 전송 이벤트와 수신 이벤트 식별자",
                output: "전송 성공, 실패 또는 결과 미확인 상태",
                recoveryBoundary:
                    "재전달은 중복 처리하지 않고 성공 여부를 모르면 자동 재전송을 중단",
                database: "PostgreSQL",
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "메시지 수신, 전송 이력과 중복 발송 방지 처리를 구현했습니다. 실제 메시지 공급자 연동 테스트는 아직 하지 않았습니다.",
                tradeoff:
                    "중복 발송 방지를 우선해 결과 미확인 건은 자동 재전송하지 않습니다. 전송 결과 조회와 운영자 확정 절차가 추가로 필요합니다.",
                documentation: [
                    { label: "PRD", count: "2" },
                    { label: "ADR", count: "14" },
                ],
            },
            {
                id: "brief",
                name: "BRIEF",
                kind: "MICROSERVICE",
                route: "/projects/baton/brief",
                role: "주간 운영 요약",
                summary:
                    "운영 이벤트를 모아 이번 주에 확인할 항목과 생성 시점의 주간 요약을 제공합니다.",
                contribution:
                    "이벤트 수신과 조회 데이터 재구축, 주간 브리프 생성 규칙을 Kotlin과 Spring JDBC로 구현했습니다.",
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
                detail: "운영 이벤트 중복 처리 방지, 확인 항목 구성, 생성 후 수정하지 않는 주간 브리프",
                evidence: "중복 이벤트와 동시 생성에도 주간 브리프 1건 · 자동화 테스트 8개",
                input: "인수인계 지연, 루틴 누락과 결정 후속 조치 지연 이벤트",
                output: "확인이 필요한 항목과 주간 운영 브리프",
                recoveryBoundary:
                    "중복 및 이전 버전 이벤트를 구분하고 저장한 수신 이력으로 조회 데이터를 재구축",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 최신 로컬 MVP 동기화 전",
                status: "로컬 MVP와 PostgreSQL 통합 테스트를 구현했습니다. BATON Core 이벤트 연동, 인증과 운영 환경 배포는 아직 하지 않았습니다.",
                tradeoff:
                    "규칙을 코드로 관리해 결과를 설명하기 쉽지만, 확인 항목이 늘 때마다 이벤트 계약과 선정 규칙을 함께 변경해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-brief",
                    label: "BRIEF 공개 저장소",
                    note: "최신 로컬 MVP는 공개 저장소 동기화 전입니다.",
                },
                documentation: [
                    { label: "PRD", count: "2" },
                    { label: "ADR", count: "2" },
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
                    "일정 스냅샷 수신, 구독 토큰 관리, iCalendar 피드와 HTTP 캐시 조건을 구현했습니다.",
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
                    "중복 및 이전 일정 차단, 같은 입력에서 동일한 캘린더 생성 · 자동화 테스트 43개",
                input: "BATON이 확정한 일정 스냅샷과 구독 명령",
                output: "읽기 전용 iCalendar 피드와 조건부 조회 응답",
                recoveryBoundary:
                    "중복 및 이전 개정 번호를 구분하고 저장한 일정으로 캘린더를 재구축",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 최신 로컬 구현 동기화 전",
                status: "시즌 단위 MVP와 계약 테스트를 구현했습니다. BATON Core 일정 이벤트 연동과 공개 배포는 아직 하지 않았습니다.",
                tradeoff:
                    "읽기 전용 구독은 외부 캘린더에서 쉽게 사용할 수 있지만, 비동기 반영 지연과 캘린더 앱별 동작 차이를 관리해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-cal",
                    label: "CAL 공개 저장소",
                    note: "최신 로컬 구현은 공개 저장소 동기화 전입니다.",
                },
                documentation: [
                    { label: "PRD", count: "2" },
                    { label: "ADR", count: "2" },
                    { label: "JSON Schema", count: "6" },
                ],
            },
        ],
        proofs: [
            {
                item: "Core 인수인계 상태 전이 및 중복 교대 차단",
                method: "도메인 규칙 및 저장소 통합 테스트",
                rule: "정상 상태 전이, 상태 역행과 같은 역할의 열린 바통 동시 생성을 실행",
                result: "PREPARING → TRANSFERRED → ACCEPTED 순서만 허용하고 역할별 열린 바통을 1건으로 유지",
                scope: "Core 비공개 저장소 · 상태 전이 및 DB 제약 확인 · 2026.08.13",
            },
            {
                item: "GO 링크 중복 생성 방지",
                method: "Testcontainers 통합 테스트",
                rule: "같은 멱등 키와 요청으로 8건을 동시에 실행",
                result: "링크와 생성 예약을 각각 1건만 저장",
                scope: "GO 전체 자동화 테스트 374개 · 2026.08.09",
            },
            {
                item: "WATCH 안전한 URL 점검",
                method: "자동화 테스트",
                rule: "사설망 주소, DNS 재조회, 제한 초과 응답과 이전 작업의 늦은 결과를 입력",
                result: "위험한 요청을 차단하고 최신 원본 버전의 결과만 저장",
                scope: "WATCH 전체 자동화 테스트 354개 · 2026.08.09",
            },
            {
                item: "RELAY 메시지 재전달 중복 방지",
                method: "Docker Compose 통합 테스트",
                rule: "DB 커밋 후 RabbitMQ ACK 전에 중단한 뒤 같은 이벤트를 재전달",
                result: "수신 이력(Inbox)과 전달 작업을 각각 1건만 유지",
                scope: "RELAY 전체 자동화 테스트 373개 · 2026.08.09",
            },
            {
                item: "BRIEF 동시 요청 중복 방지",
                method: "MockMvc 및 PostgreSQL Testcontainers",
                rule: "같은 이벤트와 동일 상태의 주간 브리프 생성 요청을 동시에 실행",
                result: "수신 기록과 주간 브리프를 각각 1건만 저장하고, 최초 요청과 중복 요청을 HTTP 상태로 구분",
                scope: "전체 테스트 8개 중 PostgreSQL 통합 테스트 4개 · 2026.08.13",
            },
            {
                item: "CAL 일정 및 구독 계약",
                method: "PostgreSQL Testcontainers 및 iCalendar 기대값 비교",
                rule: "중복 및 낮은 개정 번호, DST와 자정 및 취소, 구독 회전 동시 요청",
                result: "중복 및 이전 일정은 반영하지 않고, 동일 입력에서는 같은 캘린더와 캐시 검증값을 생성",
                scope: "전체 자동화 테스트 43개 · PostgreSQL 및 iCalendar 테스트 포함 · BATON Core 일정 이벤트 연동과 공개 배포 전 · 2026.08.13",
            },
        ],
        category: "개인 프로젝트",
        role: "6개 저장소의 서비스 분리, 도메인 규칙, API 및 DB 계약, 테스트와 운영 절차 설계 및 구현",
        oneLine: "변경 및 장애 처리 방식이 다른 기능을 서비스와 저장소 단위로 분리",
        status: {
            label: "현재 상태",
            text: "Core, GO, WATCH, RELAY의 핵심 기능과 BRIEF 및 CAL의 로컬 MVP를 구현했습니다. 서비스 간 전체 연동과 운영 환경 배포는 진행 중입니다. 근거별 기준일은 각 테스트 항목에 표시했습니다.",
        },
        visualCaption:
            "Core가 조직 운영의 기준 데이터를 관리합니다. GO, WATCH, RELAY, BRIEF, CAL은 Core의 단순 기능이 아니라 독립 저장소와 데이터베이스를 가진 마이크로서비스입니다.",
        problems: [
            {
                number: "01",
                serviceIds: ["core", "go", "watch", "relay", "brief", "cal"],
                shared: true,
                title: "서비스별 데이터와 처리 경계 분리",
                constraint:
                    "링크, URL 점검, 메시지 전송, 주간 브리프와 캘린더 구독은 입력, 보안과 재처리 방식이 서로 다릅니다.",
                decision:
                    "Core는 조직 운영 기준 데이터에 집중하고 GO, WATCH, RELAY, BRIEF, CAL을 별도 저장소와 데이터베이스로 분리했습니다. 서비스 간 전달이 필요한 상태 변경은 같은 트랜잭션의 아웃박스에 저장하고 커밋 후 전달하도록 설계했습니다.",
                validation:
                    "각 저장소의 계약 및 통합 테스트를 독립 실행했습니다. GO는 동시 링크 요청, WATCH는 안전한 URL 점검, RELAY는 메시지 재전달, BRIEF는 중복 이벤트, CAL은 일정 및 구독 계약을 각각 확인했습니다.",
                boundary:
                    "개별 저장소의 구현 상태는 다르며 Core부터 5개 마이크로서비스까지의 전체 연동과 실제 운영 환경 배포는 아직 완료하지 않았습니다.",
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
                title: "링크 생성 API의 멱등성 보장",
                constraint:
                    "저장 후 응답이 유실되거나 여러 서버가 같은 요청을 동시에 받으면 링크가 중복 생성될 수 있습니다.",
                decision:
                    "UUID 멱등 키와 표준화한 요청 해시를 생성 예약에 저장했습니다. HMAC-SHA256으로 동일 입력에서 같은 링크 코드를 만들고, 허용한 목적지 타입과 경로만 받습니다.",
                validation:
                    "같은 요청 8건을 동시에 보내도 링크와 예약이 각각 1건만 생성되는지 통합 테스트로 확인했습니다.",
                boundary:
                    "HMAC 키 교체와 DB 복구 시 기존 링크가 유지되도록 키 관리와 백업 절차가 함께 필요합니다.",
                print: {
                    label: "GO / IDEMPOTENCY",
                    problem: "응답 유실과 동시 요청으로 같은 링크가 중복 생성될 수 있음",
                    solution: "UUID 멱등 키, 요청 해시와 HMAC 기반 고정 링크 코드",
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
                title: "URL 점검 I/O와 DB 트랜잭션 분리",
                constraint:
                    "외부 URL은 느리거나 사설망을 가리킬 수 있고, 늦게 끝난 작업이 최신 점검 결과를 덮을 수도 있었습니다.",
                decision:
                    "짧은 트랜잭션에서 SKIP LOCKED로 작업만 선점하고 네트워크 I/O를 분리했습니다. DNS 조회 결과를 고정해 SSRF와 DNS 리바인딩을 차단했습니다. 작업 선점 토큰과 원본 데이터 버전을 비교해 이전 작업의 늦은 결과는 저장하지 않았습니다.",
                validation:
                    "사설망 주소와 DNS 재조회, 제한을 넘는 리다이렉트 및 응답, 작업 선점 만료 후 다른 서버의 재처리와 이전 작업 결과 반영 차단을 자동화 테스트로 확인했습니다. WATCH 전체 테스트는 354개입니다.",
                boundary:
                    "작업 선점 유효 시간이 짧으면 중복 실행이 늘고, 길면 중단된 작업을 다른 서버가 이어받는 시점이 늦어집니다.",
                print: {
                    label: "WATCH / SAFE CHECK",
                    problem: "느린 I/O와 늦은 결과가 경합 및 최신 상태 덮어쓰기를 만듦",
                    solution: "SSRF와 DNS 리바인딩 차단, 작업 선점 토큰과 원본 버전 비교",
                    tradeoff: "실제 처리 시간에 맞춰 작업 선점 유효 시간을 조정해야 함",
                },
            },
            {
                number: "06",
                serviceIds: ["watch"],
                title: "아웃박스로 상태 변경 이벤트 유실 방지",
                constraint:
                    "URL 상태는 저장됐지만 Core 전달 호출이 실패하면 두 시스템이 서로 다른 상태를 볼 수 있었습니다.",
                decision:
                    "상태 변경과 전달할 이벤트를 같은 트랜잭션에 저장했습니다. 수신 확인 전까지 같은 이벤트를 다시 보내고, 오래 남은 미전송 이벤트를 별도 작업이 다시 처리하도록 했습니다.",
                validation:
                    "자동 테스트로 동일 이벤트 재전송, ACK 유실과 미전송 이벤트 재처리를 확인했고 공개 스테이징 전송 테스트 절차는 Runbook으로 정리했습니다.",
                boundary:
                    "현재는 소비자가 하나라 메시지 브로커를 두지 않았습니다. 소비자가 늘면 전달 방식을 다시 검토해야 합니다.",
            },
            {
                number: "07",
                serviceIds: ["relay"],
                title: "전송 결과 미확인 시 중복 발송 방지",
                constraint:
                    "외부 전송은 성공했지만 응답만 잃으면 자동 재시도가 중복 발송으로 이어질 수 있었습니다.",
                decision:
                    "외부 호출 전에 수정하지 않는 전송 시도 이력과 전송업체용 멱등 키를 저장했습니다. 결과를 확인할 수 없으면 결과 미확인 상태(OUTCOME_UNKNOWN)로 보존하고, 운영자가 실제 결과를 확인한 이력으로만 상태를 확정하도록 했습니다.",
                validation:
                    "작업 중단 뒤 같은 전송 식별자로 이어서 처리하고, 이전 작업자의 선점 토큰으로 상태를 바꾸지 못하며, 상태 확정 요청을 다시 실행해도 결과가 중복되지 않는지 확인했습니다.",
                boundary:
                    "중복 발송 방지를 우선해 자동 재전송을 멈추므로 결과 조회나 운영자 조정 절차가 필요합니다.",
                print: {
                    label: "RELAY / RECOVERY",
                    problem: "응답 유실 뒤 재시도가 중복 발송으로 이어질 수 있음",
                    solution: "수정하지 않는 전송 시도 이력, 전송업체용 멱등 키와 결과 미확인 상태",
                    tradeoff: "자동 재전송 대신 결과 조회 및 운영자 조정 절차가 필요",
                },
            },
            {
                number: "08",
                serviceIds: ["relay"],
                title: "RabbitMQ 메시지 재전달 시 중복 처리 방지",
                constraint:
                    "PostgreSQL 커밋 뒤 RabbitMQ ACK 전에 프로세스가 멈추면 같은 이벤트가 다시 전달됩니다.",
                decision:
                    "분산 트랜잭션 대신 이벤트 ID를 수신 이력(Inbox)에 저장해 중복 처리를 막았습니다. DB 커밋 뒤 RabbitMQ ACK를 보내고, 실패 메시지는 재시도 큐와 DLQ로 분리했습니다.",
                validation:
                    "메시지 브로커와 RELAY를 강제로 중단한 뒤 같은 이벤트가 재전달돼도 inbox가 1건인지 Docker Compose 통합 테스트로 확인했습니다.",
                boundary:
                    "메시지 보존과 DLQ 운영 지점이 늘어 메시지 브로커 모니터링과 재처리 Runbook이 필요합니다.",
            },
            {
                number: "09",
                serviceIds: ["brief"],
                title: "중복 및 순서가 바뀐 운영 이벤트 처리",
                constraint:
                    "같은 이벤트가 다시 오거나 이전 개정 번호의 이벤트가 늦게 도착하면 현재 확인 항목이 잘못 바뀔 수 있습니다.",
                decision:
                    "이벤트 ID, 내용 해시와 개정 번호를 함께 저장해 중복, 식별자 충돌, 이전 버전과 개정 번호 누락을 구분했습니다. 수신 이력과 조회용 데이터는 같은 PostgreSQL 트랜잭션에서 반영합니다.",
                validation:
                    "MockMvc와 PostgreSQL Testcontainers로 중복, 충돌, 지원하지 않는 버전, 이전 개정 번호와 개정 번호 누락을 입력해 처리 결과와 저장 상태를 확인했습니다.",
                boundary:
                    "현재는 인증 없는 로컬 내부 HTTP 계약만 구현했으며 BATON Core 이벤트와의 실제 연동은 아직 하지 않았습니다.",
                print: {
                    label: "BRIEF / EVENT",
                    problem: "중복 또는 이전 버전 이벤트가 현재 확인 항목을 바꿀 수 있음",
                    solution: "이벤트 ID, 내용 해시와 개정 번호를 같은 트랜잭션에서 확인",
                    tradeoff: "현재는 로컬 내부 HTTP 계약이며 BATON 연동 전",
                },
            },
            {
                number: "10",
                serviceIds: ["brief"],
                title: "재구축 뒤에도 같은 주간 브리프 유지",
                constraint:
                    "이벤트를 다시 처리할 때 항목 순서나 생성 결과가 달라지면 이전 주간 브리프를 신뢰하기 어렵습니다.",
                decision:
                    "수락한 수신 이력으로 조회 데이터를 다시 만들고, 선정 항목의 해시를 기준으로 같은 내용의 브리프는 하나만 생성했습니다. 생성이 끝난 브리프는 수정하지 않습니다.",
                validation:
                    "같은 수신 이력의 재구축 전후 결과와 같은 상태의 동시 생성 요청을 확인했습니다. 동시 요청에서도 주간 브리프는 1건만 저장되고, 최초 생성은 HTTP 201, 같은 요청의 재실행은 HTTP 200으로 구분됩니다.",
                boundary:
                    "첫 버전은 인수인계 지연, 루틴 누락과 결정 후속 조치 지연 세 종류만 규칙 기반으로 처리합니다.",
            },
            {
                number: "11",
                serviceIds: ["cal"],
                title: "중복 및 순서가 바뀐 일정 스냅샷 처리",
                constraint:
                    "네트워크 재시도로 같은 일정이 다시 오거나 이전 개정 번호가 늦게 도착하면 최신 캘린더가 과거 상태로 돌아갈 수 있습니다.",
                decision:
                    "이벤트 ID, 일정 ID, 개정 번호와 내용 해시를 비교해 적용, 중복, 이전 버전과 충돌을 구분했습니다. 수신 이력과 캘린더용 데이터는 같은 트랜잭션에서 변경합니다.",
                validation:
                    "동일 내용 재전송, 낮은 개정 번호, 같은 개정 번호의 다른 내용과 트랜잭션 실패 후 재시도를 PostgreSQL 통합 테스트로 확인했습니다.",
                boundary:
                    "BATON과 CAL은 비동기로 연동하므로 일정 반영이 지연될 수 있으며 BATON Core 일정 이벤트와의 실제 연동은 아직 하지 않았습니다.",
                print: {
                    label: "CAL / REVISION",
                    problem: "중복 및 이전 일정이 최신 캘린더를 덮을 수 있음",
                    solution: "이벤트 ID, 일정 ID, 개정 번호와 내용 해시 비교",
                    tradeoff: "BATON Core 일정 이벤트 연동과 공개 배포 전",
                },
            },
            {
                number: "12",
                serviceIds: ["cal"],
                title: "캘린더 시간대, 취소 및 캐시 일관성 유지",
                constraint:
                    "캘린더 앱마다 시간대와 취소 일정 및 캐시 처리 방식이 달라 일정이 중복되거나 변경 내용이 반영되지 않을 수 있습니다.",
                decision:
                    "일정마다 고정 UID와 원본 개정 번호 기반 SEQUENCE를 사용하고 취소 상태를 유지했습니다. 같은 데이터에서는 같은 .ics, ETag와 Last-Modified를 생성합니다.",
                validation:
                    "UTC, DST, 자정 경계, 취소 일정, UTF-8 줄 접기와 변경 없음 응답(304 Not Modified)을 iCalendar 기대값 파일 및 자동화 테스트로 확인했습니다.",
                boundary:
                    "iCal4j 또는 시간대 데이터 버전을 바꾸면 iCalendar 기대값 파일과 캐시 검증값이 함께 바뀌는지 확인해야 합니다.",
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
        evidenceAsOf: "2026.08.13 저장소 기준",
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
            label: "모놀리식 애플리케이션 + Gradle 멀티모듈",
            title: "헥사고날 아키텍처를 적용한 6개 Gradle 모듈",
            description:
                "의존 방향을 bootstrap → web, persistence, external 어댑터 → application → domain 순서로 제한했습니다. 모든 클래스에 인터페이스를 만들지 않고 결제와 알림처럼 교체 가능한 외부 연동에만 포트를 뒀습니다.",
            tradeoff:
                "모듈과 타입 수는 늘지만 의존 위반을 빌드에서 차단할 수 있습니다. 현재 규모에서는 domain 모듈에 일부 JPA 매핑 어노테이션을 유지해 분리 비용을 줄였습니다.",
        },
        featuredProblemNumbers: ["02", "03", "04", "06"],
        spotlights: [
            {
                label: "결제 및 환불 / 멱등성",
                title: "외부 응답을 잃어도 중복 승인과 환불을 막음",
                problem:
                    "PG 실패 상태를 저장한 뒤 예외를 던지면 같은 트랜잭션이 롤백되어 이력까지 사라졌습니다. 응답 유실 뒤 재요청은 중복 승인이나 환불로 이어질 수 있었습니다.",
                solution:
                    "PG 호출은 트랜잭션 밖에서 실행하고 상태 변경은 REQUIRES_NEW로 분리했습니다. 결제는 orderId, 환불은 최초 UUID를 멱등 키로 재사용하고 결과를 확인할 수 없으면 PG 조회와 복구 배치로 다시 처리합니다.",
                tradeoff:
                    "PG 호출을 트랜잭션 밖으로 분리해 DB 점유는 줄지만, API 응답 시점에 환불 상태가 REQUESTED로 남을 수 있습니다.",
            },
            {
                label: "알림 / 아웃박스",
                title: "업무 커밋과 알림 작업을 함께 보존",
                problem:
                    "메모리 이벤트만 사용하면 업무 커밋 직후 프로세스가 종료될 때 알림 작업이 유실될 수 있었습니다.",
                solution:
                    "업무 상태와 알림 아웃박스를 같은 트랜잭션에 저장했습니다. 트랜잭션 커밋 직후 전송하고, 미전송 건은 스케줄러가 다시 조회해 처리합니다.",
                tradeoff:
                    "알림은 비동기로 처리되어 사용자 응답 시점에 발송이 끝나지 않을 수 있습니다. 성공 확인 전까지 재시도하므로 응답 유실 시 중복 알림 가능성도 남습니다.",
            },
            {
                label: "예약 및 재고 / 동시성",
                title: "락 순서를 고정해 마지막 자리의 한 명만 성공",
                problem:
                    "마지막 자리나 재고에 요청이 몰리면 조회 시점에는 모두 가능해 보여 초과 처리될 수 있었습니다.",
                solution:
                    "비관적 락을 사용하고 클래스→슬롯, productId 오름차순으로 락 순서를 고정했습니다.",
                tradeoff:
                    "초과 예약과 재고 차감을 막는 대신 같은 행에 요청이 몰리면 락 대기 시간이 늘어납니다. 운영 지표에 따라 락 범위를 조정해야 합니다.",
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
                count: "44",
                summary: "아키텍처, 동시성, 결제와 보안 결정을 기록합니다.",
            },
            {
                id: "idea-poc",
                label: "Idea / POC",
                count: "39 / 1",
                summary: "구현 전 가설과 외부 장애 대응 방식을 검증합니다.",
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
                label: "헥사고날 아키텍처 전환",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0021_Hexagonal_%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98_%EC%A0%84%ED%99%98/adr.md",
                note: "6개 모듈의 의존 방향과 포트 적용 범위를 정한 기록",
            },
            {
                type: "ADR",
                label: "결제 승인 트랜잭션과 보상 경계",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0033_결제_confirm_트랜잭션과_보상_경계/adr.md",
                note: "PG 호출과 상태 저장을 분리하고 실패 이력, 멱등 키와 복구 기준을 정한 기록",
            },
            {
                type: "ADR",
                label: "8회권 사용, 취소 및 환불 정책",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0011_이용권_사용_소모_환불_결정/adr.md",
                note: "미래 예약 자동 취소, 환불 크레딧 계산과 동시 처리의 잠금 순서를 정한 기록",
            },
            {
                type: "ADR",
                label: "알림 Outbox 전달 보장",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0032_%EC%95%8C%EB%A6%BC_Outbox_%EC%A0%84%EB%8B%AC_%EB%B3%B4%EC%9E%A5/adr.md",
                note: "같은 트랜잭션 저장과 커밋 후 미전송 알림 재처리 방식을 정한 기록",
            },
            {
                type: "ADR",
                label: "개인정보 암호화와 블라인드 인덱스",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0036_%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4_%ED%8F%89%EB%AC%B8_%EC%A0%9C%EA%B1%B0%EC%99%80_%EB%B8%94%EB%9D%BC%EC%9D%B8%EB%93%9C_%EC%9D%B8%EB%8D%B1%EC%8A%A4_%EA%B8%B0%EC%A4%80/adr.md",
                note: "복원은 AES-GCM, 정확 검색은 HMAC으로 분리하고 키 회전 범위를 정한 기록",
            },
            {
                type: "Retrospective",
                label: "AWS 비용과 운영 종료",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/Retrospective/0010_AWS_%EB%B9%84%EC%9A%A9_%EA%B3%BC%EA%B8%88_%EC%9B%90%EC%9D%B8_%EC%A0%90%EA%B2%80/retrospective.md",
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
                item: "8회권 전체 환불 정합성",
                method: "MySQL 및 Redis Testcontainers 통합 테스트",
                rule: "미래 예약 2건으로 크레딧 2회를 사용한 8회권에 전체 환불 요청",
                result: "미래 예약 2건을 취소하고 잔여 6회와 합쳐 8회분 환불 요청, 크레딧과 원장을 일치시킴",
                scope: "PassCreditUsageUseCaseIT 통합 시나리오 · 2026.08.13 저장소 기준",
            },
            {
                item: "API 계약 범위",
                method: "OpenAPI 스냅샷 생성",
                rule: "문서화한 API 경로와 작업을 빌드 산출물에서 집계",
                result: "API 경로 193개, 작업 225개",
                scope: "2026.08.13 저장소 기준",
            },
            {
                item: "백엔드 및 API 문서 테스트",
                method: "Gradle Test 및 Spring REST Docs",
                rule: "백엔드 자동화 테스트를 실행하고 REST Docs 테스트에서 API 요청 및 응답 문서를 생성",
                result: "테스트 225개 통과, 실패 및 오류 0건; REST Docs 테스트 클래스 10개 포함",
                scope: "2026.08.13 저장소 기준",
            },
        ],
        category: "개인 프로젝트",
        role: "요구사항 정리, 백엔드 및 프론트엔드 구현, 테스트와 설계 문서 작성",
        oneLine: "외부 I/O와 동시성 실패를 DB에 기록하고 재처리 기준을 설계",
        status: {
            label: "운영 상태",
            text: "AWS 운영 환경에 배포했으나 트래픽과 무관한 상시 리소스 비용이 발생해 운영을 종료했습니다. 현재 공개 URL은 없으며 API와 테스트 수치는 2026.08.13 로컬 저장소 기준입니다.",
        },
        visualCaption:
            "헥사고날 아키텍처의 포트와 어댑터를 적용했고, domain 모듈에는 일부 JPA 매핑 어노테이션을 유지했습니다.",
        problems: [
            {
                number: "01",
                title: "ArchUnit으로 모듈 의존 규칙 검증",
                constraint:
                    "기능이 늘수록 web과 persistence 코드가 application과 domain 안으로 섞이기 쉽습니다.",
                decision:
                    "6개 Gradle 모듈로 의존 방향을 나누고 Gradle 의존성과 ArchUnit 정책 테스트로 bootstrap → adapter → application → domain 방향을 검사했습니다.",
                validation:
                    "LayerDependencyPolicyTest와 모듈별 컴파일로 금지한 의존이 빌드 단계에서 실패하는지 확인했습니다.",
                boundary:
                    "domain 모듈의 일부 JPA 의존은 유지했습니다. 현재 규모에서는 JPA를 완전히 분리하는 비용보다 일관된 의존 방향을 우선했습니다.",
                print: {
                    label: "ARCHITECTURE",
                    problem: "web과 persistence 코드가 도메인으로 섞이기 쉬움",
                    solution: "6개 모듈, Gradle 의존성과 ArchUnit 정책 테스트",
                    tradeoff: "타입 수는 늘고 domain의 일부 JPA 의존은 유지",
                },
            },
            {
                number: "02",
                title: "PG 응답 유실 시 중복 승인 및 환불 방지",
                constraint:
                    "한 트랜잭션에서 PG 호출과 상태 저장을 처리하자 실패를 saveAndFlush한 뒤 예외를 던져도 이력이 함께 롤백됐습니다. 응답 유실 뒤 재요청은 중복 승인이나 환불로 이어질 수 있었습니다.",
                decision:
                    "PG 호출은 DB 트랜잭션 밖에서 실행하고 상태 변경은 REQUIRES_NEW로 분리했습니다. PROCESSING, APPROVED, RETRYABLE 등 중간 상태를 저장하고 결제 orderId와 환불 UUID를 멱등 키로 재사용합니다. 결과 미확인은 PG 조회와 복구 배치로 다시 처리합니다.",
                validation:
                    "예외 뒤에도 실패 이력이 남는지, 같은 멱등 키 재호출이 같은 결과를 반환하는지, 이전 작업 결과 차단과 늦은 승인 반영 및 결과 미확인 환불 복구를 통합 테스트로 확인했습니다.",
                boundary:
                    "상태와 복구 경로가 늘어 운영 조회가 복잡해졌습니다. 실제 Toss Payments의 응답 지연과 장애를 포함한 연동 테스트는 남아 있습니다.",
                print: {
                    label: "PAYMENT / REFUND",
                    problem: "예외 롤백으로 실패 이력이 사라지고 응답 유실 뒤 중복 처리 위험",
                    solution: "비트랜잭션 PG 호출, REQUIRES_NEW 상태 저장과 멱등 키",
                    tradeoff: "상태와 운영 복구 경로가 늘어남",
                },
            },
            {
                number: "03",
                title: "알림 아웃박스로 전송 작업 유실 방지",
                constraint:
                    "주문이나 예약을 커밋한 직후 프로세스가 종료되면 알림 호출 자체가 사라질 수 있습니다.",
                decision:
                    "업무 상태와 고유 멱등 키를 가진 알림 아웃박스를 같은 트랜잭션에 저장했습니다. 트랜잭션 커밋 직후 전송하고, 미전송 건은 스케줄러가 다시 조회합니다. 작업 선점 토큰과 낙관적 락으로 이전 작업자의 결과 반영을 막습니다.",
                validation:
                    "같은 알림의 아웃박스가 중복 생성되지 않는지, 처리 중단 뒤 다른 작업자가 이어받는지, 실패 후 다시 처리되는지, 발송 직전에 대상을 다시 확인하는지 통합 테스트로 확인했습니다.",
                boundary:
                    "성공 확인 전까지 재시도하므로 외부 업체가 멱등 요청을 지원하지 않으면 응답 유실 뒤 중복 알림 가능성이 남습니다.",
                print: {
                    label: "NOTIFICATION",
                    problem: "업무 커밋 직후 종료되면 알림 요청이 사라짐",
                    solution: "같은 트랜잭션 아웃박스, 즉시 전송과 스케줄러 재처리",
                    tradeoff: "비동기 지연과 응답 유실 시 중복 알림 가능성",
                },
            },
            {
                number: "04",
                title: "예약 및 재고 락 순서 고정",
                constraint:
                    "마지막 자리나 재고에 요청이 몰리면 조회 시점에는 모두 가능해 보여 초과 처리될 수 있습니다.",
                decision:
                    "예약은 클래스 다음 슬롯 PK 순서, 재고는 productId 오름차순으로 비관적 락을 잡고 확인과 변경을 한 트랜잭션에서 처리했습니다.",
                validation:
                    "마지막 좌석과 재고에 동시 요청을 보내 한 건만 성공하고, 나머지는 일관된 업무 오류를 반환하는지 확인했습니다.",
                boundary:
                    "단일 MySQL 기준 설계입니다. 같은 행에 요청이 집중되면 대기 시간이 늘 수 있어 운영 지표를 보고 경계를 다시 나눠야 합니다.",
                print: {
                    label: "BOOKING / STOCK",
                    problem: "마지막 좌석과 재고가 동시 요청에서 초과 처리될 수 있음",
                    solution: "비관적 락과 클래스→슬롯, productId 고정 순서",
                    tradeoff: "같은 행에 요청이 몰리면 대기 시간이 증가",
                },
            },
            {
                number: "05",
                title: "개인정보 암호화와 검색용 블라인드 인덱스 분리",
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
                    "Cost Explorer로 비용 원인을 확인하고 주요 리소스를 중지 및 삭제했습니다. 이후 단일 노트북 k3s 배포, 불변 이미지와 암호화 백업 절차를 준비했습니다.",
                validation:
                    "AWS 리소스별 비용과 종료 상태를 회고에 남겼습니다. 로컬 k3s에 배포하고 롤백, 백업 및 복원 절차를 실행한 결과를 Runbook에 기록했습니다.",
                boundary:
                    "단일 노드는 비용과 통제에는 유리하지만 고가용성을 제공하지 않습니다. 저장소 기준 준비는 완료했으나 공개 운영은 아직 시작하지 않았습니다.",
                print: {
                    label: "OPERATIONS / COST",
                    problem: "트래픽과 무관한 상시 리소스 비용 발생",
                    solution: "비용 원인 확인, 리소스 종료, 단일 노트북 k3s 준비",
                    tradeoff: "비용은 줄지만 단일 노드는 고가용성을 제공하지 않음",
                },
            },
            {
                number: "07",
                title: "8회권 환불과 미래 예약 정합성 유지",
                constraint:
                    "8회권 전체 환불과 예약 사용 및 취소가 동시에 실행되면 환불할 크레딧, 미래 예약과 원장 잔액이 서로 달라질 수 있었습니다.",
                decision:
                    "환불 횟수를 잔여 크레딧과 자동 취소한 미래 예약 수의 합으로 계산했습니다. 8회권 행을 먼저 잠근 뒤 클래스와 슬롯을 PK 순서로 잠그고, 예약 취소, 크레딧 소멸과 REFUND 원장을 한 트랜잭션에 저장합니다. payment_key 기준 PG 환불 이력은 별도로 남깁니다.",
                validation:
                    "미래 예약 2건이 자동 취소되고 잔여 6회와 합쳐 8회분 환불 요청이 생성되는지 확인했습니다. 같은 8회권으로 서로 다른 클래스를 동시에 예약해도 크레딧과 원장이 모두 반영되는지 별도 통합 테스트로 확인했습니다.",
                boundary:
                    "PG 환불 완료 전에도 예약 취소와 크레딧 소멸이 먼저 끝날 수 있습니다. 환불 상태를 DB에 보존하고 자동 복구와 관리자 재처리로 금전 환불을 이어가야 합니다.",
                print: {
                    label: "PASS / REFUND",
                    problem: "미래 예약과 잔여 크레딧이 환불 원장과 어긋날 수 있음",
                    solution: "8회권 선잠금, PK 순 잠금과 미래 예약을 포함한 환불 횟수 계산",
                    tradeoff: "PG 완료 전에 예약 취소와 크레딧 변경이 먼저 끝날 수 있음",
                },
            },
        ],
        stack: [
            "Java",
            "Spring Boot",
            "Gradle",
            "JPA",
            "MyBatis",
            "MySQL",
            "Redis",
            "React",
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
                label: "ADR 및 회고 문서",
                href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs",
                note: "요구사항, ADR, 실험과 회고 기록",
            },
        ],
    },
    {
        ...projectSummariesById.warrant,
        evidenceTitle: "주요 구현 및 확인 결과",
        proofs: [
            {
                item: "해양경찰 KICS 독립망 연계",
                method: "인터페이스 매핑 및 Spring Batch 단계별 확인",
                rule: "전자영장 요청과 제출 자료를 기관별 계약에 맞춰 변환하고 처리 상태를 단계별로 확인",
                result: "KICS와 집행포털 사이의 요청 및 제출 자료가 정의된 순서로 처리되는 것을 확인",
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
                item: "상태 저장보다 먼저 도착한 콜백 처리",
                method: "콜백 순서 변경 시나리오 확인",
                rule: "콜백이 선행 상태 저장보다 먼저 도착하도록 실행",
                result: "Spring Retry의 지수 백오프와 지터로 상태를 다시 조회한 뒤 후속 처리",
                scope: "보안상 운영 수치와 테스트 코드는 비공개",
            },
        ],
        category: "BEINTECH / LG CNS 컨소시엄 공공 SI",
        role: "해양경찰 KICS 통신사실확인자료 개선 및 독립망 간 전자영장 집행포털 연계",
        oneLine: "독립망 사이의 요청과 제출 자료를 인터페이스 및 Spring Batch로 연계",
        status: {
            label: "공개 범위",
            text: "BEINTECH 소속으로 LG CNS 컨소시엄에 참여해 진행 중인 공공 SI입니다. 독립망 간 연계 구조와 직접 수행한 역할은 공개하고, 실제 접속 주소, 운영 환경 설정값, 보안 설정, 소스 코드와 내부 문서만 제외했습니다.",
        },
        systemTitle: "독립망 간 업무 흐름 및 시스템 구성",
        systemNavLabel: "업무 흐름",
        visualCaption:
            "사법기관 KICS, 전자영장 집행포털, 금융기관 및 통신사가 서로 독립된 망에서 요청과 제출 자료를 주고받는 흐름을 공개 가능한 수준으로 단순화했습니다.",
        architecture: {
            label: "독립망 간 기관 연계와 실패 경계",
            title: "기관별 공통 처리 흐름을 재사용하고 외부 호출과 DB 트랜잭션을 분리했습니다.",
            description:
                "수신 자료와 통신사실확인자료의 공통 흐름은 제네릭과 enum으로 묶고, 조회, 변환과 전송은 책임별 클래스로 나눴습니다. 외부 시스템 호출 전후의 DB 반영은 짧은 트랜잭션으로 분리해 연결 점유 시간을 줄였습니다.",
            tradeoff:
                "공통 구조를 먼저 잡아 초기 구현은 느려졌지만 후속 기능에서 수정할 코드는 줄었습니다. 현재 ReentrantLock은 단일 JVM 범위이므로 서버를 여러 대로 늘리면 별도의 분산 조정 방식이 필요합니다.",
        },
        problems: [
            {
                number: "01",
                title: "커서 페이지네이션과 지연 조인 적용",
                constraint:
                    "전송 상태와 수신 자료가 계속 쌓이면 OFFSET이 커질수록 뒤쪽 페이지 조회 비용이 증가합니다. 기존 업무 화면은 번호 이동도 유지해야 했습니다.",
                decision:
                    "신규 전송 상태 조회에는 커서 페이지를 적용했습니다. 번호 이동이 필요한 기존 대용량 화면은 커버링 인덱스로 키를 먼저 찾고 본문을 지연 조인했으며, 데이터가 적은 화면에는 적용하지 않았습니다.",
                validation:
                    "조회 쿼리와 화면 이동을 함께 확인하고 데이터 증가가 예상되는 화면에만 적용해 기존 사용 방식을 유지했습니다.",
                boundary:
                    "커서 페이지는 임의 페이지 이동이 어렵고 지연 조인은 SQL이 복잡해집니다. 조회량이 적은 화면은 단순한 쿼리의 유지보수성을 우선했습니다.",
            },
            {
                number: "02",
                title: "기관 연계 인터페이스 및 Spring Batch 공통 흐름 분리",
                constraint:
                    "수신 자료와 통신사실확인자료의 화면, 인터페이스와 Spring Batch 흐름이 비슷해 기능마다 같은 분기와 변환 코드를 만들 가능성이 컸습니다.",
                decision:
                    "공통 처리 흐름은 제네릭과 enum으로 묶고 조회, 변환과 전송은 책임별 클래스로 나눴습니다. 기관별 차이는 별도 구현으로 분리했습니다.",
                validation:
                    "후속 수신 자료 기능에서 공통 코드를 재사용해 새로 작성하거나 수정할 코드 범위를 줄였습니다.",
                boundary:
                    "공통 구조를 설계하는 동안 첫 기능의 개발 속도는 느려졌습니다. 동작이 다른 기관별 규칙은 분리해 과도한 공통화를 피했습니다.",
            },
            {
                number: "03",
                title: "상태 저장보다 먼저 도착한 콜백 재처리",
                constraint:
                    "PDF 변환 콜백이 요청 상태 저장보다 먼저 도착하면 콜백 처리 시 조회 대상이 없어 정상 결과를 반영하지 못할 수 있었습니다.",
                decision:
                    "Spring Retry에 지수 백오프와 지터를 적용해 짧은 간격으로 상태를 다시 조회했습니다. 동시에 몰린 콜백의 재시도 시점도 분산했습니다.",
                validation:
                    "콜백과 상태 저장의 선후관계가 바뀌는 경우에도 재조회 후 처리가 이어지는 것을 확인했습니다.",
                boundary:
                    "재시도는 정해진 횟수 안에서만 수행합니다. 계속 조회되지 않는 요청은 실패 상태로 기록하고 운영자 확인 절차로 넘겨야 합니다.",
            },
            {
                number: "04",
                title: "외부 API 호출과 DB 트랜잭션 분리",
                constraint:
                    "주기적으로 들어오는 연계 요청이 겹치고 외부 승인 API 응답이 늦어지면 같은 작업이 중복 실행되거나 DB 연결을 오래 점유할 수 있었습니다.",
                decision:
                    "외부 호출 전후의 DB 반영을 REQUIRES_NEW 트랜잭션으로 분리하고, 단일 애플리케이션 안에서는 ReentrantLock으로 겹친 실행을 막았습니다.",
                validation:
                    "동시 호출에서 진행 중인 작업이 다시 실행되지 않고 외부 호출 전후의 DB 반영이 나뉘는 것을 확인했습니다.",
                boundary:
                    "ReentrantLock은 한 JVM 안에서만 유효합니다. 다중 인스턴스로 확장하면 DB 락이나 분산 락 등 별도의 조정 수단이 필요합니다.",
            },
        ],
        stack: ["Java 11", "Spring Boot 2.6", "Spring Batch", "WebSquare", "Maven"],
        links: [],
        linkNote:
            "보안 및 기밀 유지 기준에 따라 소스 코드, 운영 화면과 내부 설계 문서는 공개하지 않습니다.",
    },
    {
        ...projectSummariesById.defense,
        evidenceTitle: "주요 구현 및 확인 결과",
        systemTitle: "기관 연계 배치 흐름",
        systemNavLabel: "연계 흐름",
        proofs: [
            {
                item: "기관 연계 배치 3종",
                method: "Jenkins 실행 결과, 서버 로그와 DB 확인",
                rule: "기관별 데이터 형식과 실행 순서에 맞춰 배치를 실행하고 실패 단계 추적",
                result: "입력, 배치 처리와 DB 반영 순서로 장애 원인을 확인하고 재처리",
                scope: "보안상 기관명과 운영 수치는 비공개",
            },
            {
                item: "요청 위조 방지",
                method: "정상 및 차단 요청 시나리오 확인",
                rule: "기존 화면 흐름에 Spring Security CSRF 토큰을 적용",
                result: "토큰이 없는 요청을 차단하고 오류 원인을 로그에 기록",
                scope: "폐쇄망 환경에서 확인",
            },
            {
                item: "업로드 파일 형식 검사",
                method: "정상 파일과 확장자를 바꾼 파일 업로드 확인",
                rule: "파일 확장자와 Apache Tika가 확인한 실제 형식을 함께 비교",
                result: "허용하지 않은 실제 형식의 파일을 서버에서 차단",
                scope: "폐쇄망 환경에서 확인",
            },
        ],
        category: "BEINTECH / 공공 SI",
        role: "군교정 기능 개발, 기관 연계 및 운영 대응",
        oneLine: "기관 연계 배치 개발 및 로그, DB 기반 장애 분석",
        status: {
            label: "공개 범위",
            text: "BEINTECH 소속으로 수행한 보안이 필요한 공공 프로젝트입니다. 기관과 데이터는 공개하지 않고 직접 수행한 개발과 운영 업무만 정리했습니다.",
        },
        visualCaption:
            "공개 가능한 수준으로 단순화했습니다. 세 기관의 데이터가 연계 배치를 거쳐 군교정 업무에 반영됩니다.",
        problems: [
            {
                number: "01",
                title: "기관별 데이터 연계 배치 3종 구현",
                constraint:
                    "기관마다 데이터 형식과 실행 시간이 다르고 연계 오류가 나면 다음 업무도 처리할 수 없습니다.",
                decision:
                    "연계 배치 3종을 기관별 입력 조건과 처리 순서에 맞춰 구현하고 Jenkins에서 실행과 재처리를 관리했습니다.",
                validation:
                    "배치 실행 결과, 서버 로그, DB 데이터를 함께 확인해 어느 단계에서 처리가 멈췄는지 추적했습니다.",
                boundary:
                    "외부 모니터링 도구를 자유롭게 설치할 수 없어 일부 확인은 수동 절차와 기관 담당자 협업이 필요했습니다.",
            },
            {
                number: "02",
                title: "CSRF 방어와 업로드 파일 형식 검증",
                constraint:
                    "기존 업무 흐름은 유지하면서 요청 위조와 확장자를 바꾼 파일 업로드를 서버에서 차단해야 했습니다.",
                decision:
                    "Spring Security의 CSRF 토큰을 기존 화면에 연결하고 Apache Tika로 파일의 실제 형식을 확인했습니다.",
                validation:
                    "정상 요청과 차단 요청, 파일 형식 검사 결과를 확인하고 오류 원인을 서버 로그에 남겼습니다.",
                boundary:
                    "파일 검사를 강화하면 정상 파일도 차단될 수 있어 허용 기준과 차단 로그를 함께 관리해야 합니다.",
            },
            {
                number: "03",
                title: "로그, DB 및 배치 상태를 시간순으로 추적",
                constraint:
                    "화면의 오류 원인은 서버, SQL, 연계 배치 중 어느 곳에나 있을 수 있습니다.",
                decision:
                    "SSH 서버 로그, DB 데이터, 배치 상태를 같은 시간 순서로 비교하고 필요하면 기관 담당자와 연계 시간을 확인했습니다.",
                validation:
                    "입력 데이터, 배치 처리, DB 반영, 화면 조회 순서로 원인을 좁히고 재처리 결과까지 확인했습니다.",
                boundary:
                    "운영 장애는 코드 수정뿐 아니라 업무 규칙 확인, 기관 간 일정 조율과 재처리 절차가 함께 필요합니다.",
            },
        ],
        stack: [
            "Java 8",
            "eGov 4.1",
            "MyBatis",
            "Tibero",
            "Spring Security",
            "Apache Tika",
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
        evidenceTitle: "담당 범위 및 측정 결과",
        proofs: [
            {
                item: "담당 범위",
                method: "6인 팀 역할 분담 및 시연",
                rule: "HLS 서버와 React 프론트엔드 기능을 직접 구현",
                result: "실시간 시청과 지난 구간 재생 흐름을 팀 시연에서 확인",
                scope: "교육 프로젝트",
            },
            {
                item: "HLS 재생 지연",
                method: "팀 시연 환경에서 재생 시작 지연 측정",
                rule: "세그먼트 길이와 인코딩 설정을 조정한 전후 비교",
                result: "약 30초에서 약 11초로 단축",
                scope: "팀 시연 환경 기준이며 정밀 벤치마크는 아님",
            },
        ],
        category: "교육 프로젝트",
        role: "HLS 서버 및 React 프론트엔드",
        oneLine: "WebRTC 실시간 시청과 HLS 지난 구간 재생 구현",
        status: {
            label: "프로젝트 상태",
            text: "프로젝트를 종료했으며 현재 운영하지 않습니다.",
        },
        visualCaption:
            "WebSocket은 제어와 시그널링에 사용했고 실제 미디어는 WebRTC와 RTP로 전달했습니다.",
        problems: [],
        stack: ["React", "WebRTC", "HLS", "mediasoup", "FFmpeg", "GStreamer", "Node.js"],
        links: [
            {
                label: "TeamyRoom 저장소",
                href: "https://github.com/orgs/TeamyRoom/repositories",
                note: "역할별 팀 저장소",
            },
            {
                label: "시연 영상",
                href: "https://www.youtube.com/watch?v=KKR2vj10sNQ",
                note: "프로젝트 시연",
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

export const educationCaseStudies = projectList.filter(
    (project) => project.projectType === "education",
)

export const navigableCaseStudyGroups = [
    { id: "career", label: "경력", title: "경력 프로젝트", projects: careerCaseStudies },
    { id: "personal", label: "개인", title: "개인 프로젝트", projects: personalCaseStudies },
]

export const navigableCaseStudies = navigableCaseStudyGroups.flatMap((group) => group.projects)

export const projectsById = Object.fromEntries(projectList.map((project) => [project.id, project]))

export const batonServicesById = Object.fromEntries(
    projectsById.baton.services.map((service) => [service.id, service]),
)

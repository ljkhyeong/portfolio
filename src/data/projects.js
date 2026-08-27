import { projectSummaries, projectSummariesById } from "./projectSummaries"

const projects = [
    {
        ...projectSummariesById.baton,
        evidenceAsOf: "2026.08.27 공개 main, 원격 개발 브랜치와 로컬 커밋 교차 검토 기준",
        evidenceTitle: "검증 범위 및 현재 상태",
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
            title: "Core는 기준 데이터와 최종 권한을 관리하고, 6개 마이크로서비스는 서로 다른 변경 및 장애 흐름을 분리합니다.",
            description:
                "Core가 팀, 시즌, 역할, 운영 기록과 최종 참여 자격을 관리합니다. GO, WATCH, RELAY, BRIEF, CAL, ROUND는 링크 라우팅, URL 상태 점검, 이벤트 전달, 운영 브리프, 캘린더 투영과 실시간 통신을 각각 독립 저장소와 런타임에서 처리합니다.",
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
                count: "39",
                summary: "서비스별 책임, 입력 계약과 완료 조건을 정의합니다.",
            },
            {
                id: "adr",
                label: "ADR",
                count: "54",
                summary: "기술 선택의 이유, 대안과 트레이드오프를 기록합니다.",
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
                    "Core OpenAPI, BRIEF 및 CAL 계약 팩과 ROUND 프로토콜을 서비스 간 계약의 기준으로 관리합니다.",
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
            {
                serviceId: "round",
                type: "ADR / 아키텍처 요약",
                label: "ROUND 실시간 통신과 참여권 경계",
                href: "/docs/baton/round-realtime-boundary.md",
                note: "BATON 참여권, WebRTC 협상 복구와 휘발성 방 상태의 책임 경계",
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
                    "팀, 역할, 루틴, 의사결정과 인수인계를 관리하고 계정, 스터디 멤버십, ROUND 방 매핑과 참여권을 포함한 최종 권한을 판정합니다.",
                detail: "팀, 시즌, 역할, 운영 기록, 계정과 스터디 멤버십, 참여권 발급",
                evidence: "PRD 6 · ADR 19 · OpenAPI 및 교차 서비스 계약",
                input: "사용자 명령과 조직 운영 요청",
                output: "팀, 시즌, 역할, 루틴과 인수인계 기준 데이터",
                recoveryBoundary: "상태 변경과 담당자 변경을 한 트랜잭션에서 처리",
                database: "MySQL",
                primary: true,
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "조직 운영 흐름과 ROUND 참여권, WATCH 및 CAL 연동 경계를 구현했습니다. 실제 공개 OAuth, SMTP와 서비스별 운영 자격 증명을 사용하는 공개 HTTPS 검증은 남아 있습니다.",
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
                role: "BATON과 ROUND 정책형 링크 게이트웨이",
                summary:
                    "BATON과 ROUND의 허용된 화면만 짧고 고정된 주소로 연결하고, 최종 접근 권한은 각 대상 서비스가 계속 판정하도록 경계를 유지합니다.",
                contribution:
                    "링크 생성, 조회, 시작 및 만료, 폐기와 리다이렉트, UUID 멱등 처리와 HMAC 키 검증을 설계하고 구현했습니다.",
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
                detail: "UUID 멱등 키, HMAC-SHA256 코드, BATON 및 ROUND의 정확한 대상 계약",
                evidence: "동시 요청의 단일 링크 생성과 HMAC 키 및 DB 복구 펜스 검증",
                input: "허용된 BATON 또는 ROUND 대상과 UUID 멱등 키",
                output: "시작, 만료와 폐기 정책을 가진 고정 링크 코드",
                recoveryBoundary: "같은 요청은 같은 결과를 반환하고 다른 요청은 충돌로 차단",
                database: "MySQL",
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "정책형 링크의 생성, 조회, 시작 및 만료, 폐기와 리다이렉트를 구현했습니다. BATON Core 및 ROUND와의 종단 연동과 공개 배포 검증은 아직 남아 있습니다.",
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
                    "BATON에 등록된 외부 URL을 SSRF 방어 기준으로 점검하고, 저장된 이전 점검 결과와 달라진 경우 URL 상태 변경 이벤트를 Core에 전달합니다.",
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
                evidence: "사설망 요청, DNS 재결속과 이전 작업의 늦은 결과 차단 검증",
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
                    "BATON의 알림 이벤트를 외부 메시지 공급자에 전달하고 전송 성공, 실패와 공급자 응답 유실로 결과를 확인할 수 없는 경우를 구분해 저장합니다.",
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
                evidence: "메시지 재전달 중복 제거와 중단된 전송 시도의 동일 식별자 복구 검증",
                input: "메시지 전송 이벤트와 수신 이벤트 식별자",
                output: "전송 성공, 실패 또는 결과 미확인 상태",
                recoveryBoundary:
                    "재전달은 중복 처리하지 않고 성공 여부를 모르면 자동 재전송을 중단",
                database: "PostgreSQL",
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "HTTP Webhook과 AWS SQS FIFO 어댑터, RabbitMQ 수신과 제한형 재시도 워커를 구현했습니다. 실제 AWS 인증 및 소비자 계약과 운영 모니터링 토폴로지는 아직 검증하지 않았습니다.",
                tradeoff:
                    "중복 발송 방지를 우선해 결과 미확인 건은 자동 재전송하지 않습니다. 전송 결과 조회와 운영자 확정 절차가 추가로 필요합니다.",
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
                    "BATON의 다섯 연속성 신호를 설명 가능한 현재 관심 항목으로 투영하고, 일정 시점의 상태를 수정하지 않는 주간 운영 브리프로 고정합니다.",
                contribution:
                    "버전이 있는 이벤트 수신, 관심 항목 재구축, 불변 에디션과 Bearer 교체 경계를 Kotlin과 Spring JDBC로 구현했습니다.",
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
                detail: "운영 이벤트 멱등 수신, 관심 항목 투영 및 재구축, 수정하지 않는 주간 에디션",
                evidence: "로컬 BATON 실행 JAR 전달과 Caddy 내부 CA HTTPS 경계 검증",
                input: "BATON 연속성 이벤트 v1 및 v2와 집계 개정 번호",
                output: "현재 관심 항목과 이력, 비교 가능한 불변 주간 에디션",
                recoveryBoundary:
                    "중복 및 이전 버전 이벤트를 구분하고 저장한 수신 이력으로 조회 데이터를 재구축",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 최신 구현은 로컬 개발 브랜치",
                status: "로컬에서 BATON 실행 JAR 전달, 전용 Bearer와 Caddy HTTPS 경계를 검증했습니다. 최신 구현은 공개 main 반영 전이며 공인 DNS 및 ACME와 원격 스테이징 전달은 아직 검증하지 않았습니다.",
                tradeoff:
                    "규칙을 코드로 관리해 결과를 설명하기 쉽지만, 확인 항목이 늘 때마다 이벤트 계약과 선정 규칙을 함께 변경해야 합니다.",
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
                evidence: "중복 및 이전 일정 차단과 실제 BATON 직렬화 및 CAL 컨테이너 교차 검증",
                input: "BATON이 확정한 일정 스냅샷과 구독 명령",
                output: "읽기 전용 iCalendar 피드와 조건부 조회 응답",
                recoveryBoundary:
                    "중복 및 이전 개정 번호를 구분하고 저장한 일정으로 캘린더를 재구축",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 안정 계약 1.0.0",
                status: "시즌 단위 MVP와 안정 계약 1.0.0을 구현하고 실제 BATON 직렬화 및 CAL 컨테이너 교차 검증을 완료했습니다. 실제 운영 활성화와 공개 배포는 아직 하지 않았습니다.",
                tradeoff:
                    "읽기 전용 구독은 외부 캘린더에서 쉽게 사용할 수 있지만, 비동기 반영 지연과 캘린더 앱별 동작 차이를 관리해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-cal",
                    label: "CAL 공개 저장소",
                    note: "안정 계약 1.0.0과 Core 생산자 계약 검증을 공개합니다.",
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
                    "BATON Core가 계정과 스터디 멤버십을 확인해 발급한 참여권을 검증하고, 최대 6명의 WebRTC 방과 피어, 시그널링과 TURN 자격 증명을 관리합니다.",
                contribution:
                    "React 방 UI, 공유 프로토콜, React 비종속 RTC Core와 Java raw WebSocket 시그널링 및 BATON 참여권 경계를 구현했습니다.",
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
                detail: "6인 mesh WebRTC, 협상 세대, DataChannel ACK, RS256 및 JWK 참여권, 짧은 TURN 자격 증명",
                evidence:
                    "BATON 참여권과 HTTPS 및 WSS 교차 서비스 경계, Chromium 및 WebKit 흐름 검증",
                input: "BATON의 방 매핑과 방 범위의 짧은 참여권",
                output: "피어 협상, 휘발성 채팅과 미디어 연결을 위한 TURN 자격 증명",
                recoveryBoundary:
                    "협상 세대와 지연 ICE 차단, 제한된 재연결 및 새 참여권 연결의 이전 세션 교체",
                database: "없음 / 휘발성 메모리",
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "원격 개발 브랜치에서 BATON 참여권과 로컬 HTTPS 및 WSS 교차 서비스 흐름을 검증했습니다. 공인 DNS 및 ACME, 외부 coturn 미디어 중계와 6명 장시간 파일럿은 아직 검증하지 않았습니다.",
                tradeoff:
                    "mesh 구조는 참가자가 늘수록 각 브라우저의 업로드와 CPU 사용량이 증가합니다. 방 상태가 프로세스 메모리에 있어 현재는 단일 시그널링 인스턴스로 운용해야 합니다.",
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
                rule: "같은 멱등 키와 요청으로 8건을 동시에 실행",
                result: "동일 멱등 키에 대한 공유 링크 1건과 링크 생성 처리 기록 1건만 DB에 저장",
                scope: "GO 비공개 저장소 · 동시 요청 및 HMAC 키 결속 통합 시나리오 · 2026.08.27 커밋 상태 기준",
            },
            {
                item: "WATCH 안전한 URL 점검",
                method: "자동화 테스트",
                rule: "사설망 IP를 가리키는 URL, DNS 재조회 때 IP가 바뀐 URL, 허용 크기를 넘는 HTTP 응답과 이전 URL 버전으로 시작한 점검 결과를 각각 입력",
                result: "SSRF 및 응답 크기 제한을 위반한 요청을 차단하고 현재 등록된 URL 버전과 일치하는 점검 결과만 저장",
                scope: "WATCH 공개 저장소 · URL 보안 및 작업 선점 자동화 시나리오 · 2026.08.27 커밋 상태 기준",
            },
            {
                item: "RELAY ACK 간극 재전달 중복 방지",
                method: "RabbitMQ 및 PostgreSQL Docker Compose 검증",
                rule: "PostgreSQL 커밋 뒤 ACK가 완료되기 전에 RabbitMQ와 RELAY를 중단하고 같은 이벤트를 재전달",
                result: "같은 eventId의 Inbox를 1건으로 유지하고 재전달을 ACK 처리하며 DLQ에는 보내지 않음",
                scope: "RELAY 비공개 저장소 origin/main b87eb49 · RabbitMQ 4.3.4 및 PostgreSQL 일회성 Compose 시나리오 · 2026.08.08 CI 성공",
            },
            {
                item: "BRIEF 이벤트 투영과 불변 에디션",
                method: "PostgreSQL 통합 테스트와 로컬 BATON 실행 JAR 교차 검증",
                rule: "중복 및 이전 개정 이벤트, 관심 항목 전체 재구축과 같은 주간 상태의 에디션 생성 요청을 실행",
                result: "수신 증거와 현재 관심 항목을 일관되게 재구축하고 같은 상태의 에디션은 멱등하게 재사용",
                scope: "최신 구현은 로컬 개발 브랜치 기준 · 공개 main 및 원격 스테이징 반영 전 · 2026.08.27",
            },
            {
                item: "CAL 일정 및 구독 계약",
                method: "PostgreSQL Testcontainers, iCalendar 기대값과 실제 BATON-CAL 교차 검증",
                rule: "같은 일정 스냅샷 재전달, 현재보다 낮은 개정 번호, DST 및 자정 경계 일정, 취소 일정과 구독 토큰 동시 회전을 각각 실행",
                result: "중복 및 낮은 개정 번호 일정은 반영하지 않고, 시간 경계와 취소 일정은 iCalendar 기대값과 비교하며 동일 입력에서 같은 피드와 ETag를 생성",
                scope: "공개 저장소 안정 계약 1.0.0 및 Core 생산자 계약 기준 · 실제 운영 활성화와 공개 배포 전 · 2026.08.27",
            },
            {
                item: "ROUND 참여권과 실시간 통신 경계",
                method: "실제 BATON 서명자 및 JWK와 ROUND bootJar의 HTTPS 및 WSS 교차 검증, ROUND 시그널링 입장 테스트",
                rule: "정상 방 참여권과 다른 방, 발급자, 수신자, 키 및 만료 참여권을 각각 사용하고 새 키 선게시와 WebSocket 재연결을 실행",
                result: "정상 참여권만 방 범위 TURN 자격 증명과 WSS 입장을 허용하고 잘못된 참여권 및 이전 세션을 차단",
                scope: "ROUND 비공개 저장소 원격 개발 브랜치 기준 · 공인 DNS, 외부 coturn 중계와 6명 장시간 파일럿 전 · 2026.08.27",
            },
        ],
        category: "개인 프로젝트",
        role: "7개 저장소의 서비스 분리, 도메인 규칙, API 및 데이터 계약, 테스트와 운영 절차 설계 및 구현",
        oneLine:
            "조직 기준 데이터와 최종 권한은 Core가 관리하고 링크, URL 점검, 알림, 운영 브리프, 캘린더와 실시간 통신은 6개 마이크로서비스로 분리",
        status: {
            label: "현재 상태",
            text: "Core와 6개 마이크로서비스의 핵심 경계를 구현했습니다. CAL과 ROUND는 Core와의 교차 서비스 시나리오를 로컬에서 검증했고, BRIEF는 로컬 교차 검증 후 공개 main 반영 전입니다. 공개 HTTPS에서 실제 자격 증명과 외부 서비스를 사용하는 전체 운영 검증은 진행 중입니다.",
        },
        visualCaption:
            "Core가 조직 운영의 기준 데이터와 최종 권한을 관리합니다. GO, WATCH, RELAY, BRIEF, CAL, ROUND는 독립 저장소와 런타임을 가진 마이크로서비스입니다.",
        problems: [
            {
                number: "01",
                serviceIds: ["core", "go", "watch", "relay", "brief", "cal", "round"],
                shared: true,
                title: "서비스별 데이터와 처리 경계 분리",
                constraint:
                    "링크, URL 점검, 메시지 전송, 운영 브리프, 캘린더 구독과 실시간 통신은 입력, 보안과 실패 복구 방식이 서로 다릅니다.",
                decision:
                    "Core는 조직 운영 기준 데이터와 최종 권한에 집중하고 GO, WATCH, RELAY, BRIEF, CAL, ROUND를 별도 저장소와 런타임으로 분리했습니다. 서비스 간 전달이 필요한 상태 변경은 같은 트랜잭션의 아웃박스에 저장하고 커밋 후 전달하도록 설계했습니다.",
                validation:
                    "각 저장소의 계약 및 통합 시나리오를 독립 실행했습니다. GO는 동시 링크 요청, WATCH는 안전한 URL 점검, RELAY는 메시지 재전달, BRIEF는 이벤트 투영, CAL은 일정 계약, ROUND는 참여권과 실시간 연결을 확인했습니다.",
                boundary:
                    "저장소마다 공개 main과 개발 브랜치의 구현 상태가 다릅니다. 선택한 교차 서비스 흐름은 검증했지만 실제 공개 환경의 전체 연동과 운영 배포는 아직 완료하지 않았습니다.",
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
                    "UUID 멱등 키와 표준화한 요청 해시를 생성 예약에 저장했습니다. HMAC-SHA256으로 동일 입력에서 같은 링크 코드를 만들고, BATON과 ROUND에 허용한 목적지 타입 및 경로만 받습니다.",
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
                    "사설망 주소와 DNS 재조회, 제한을 넘는 리다이렉트 및 응답, 작업 선점 만료 후 다른 서버의 재처리와 이전 작업 결과 반영 차단을 자동화 테스트로 확인했습니다.",
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
                    "PostgreSQL 통합 테스트와 로컬 BATON 실행 JAR 교차 검증으로 중복, 충돌, 이전 개정 번호, 개정 공백과 Bearer 교체를 확인했습니다.",
                boundary:
                    "로컬 실행 JAR와 Caddy 내부 CA 경계까지 확인했습니다. 최신 구현은 공개 main 반영 전이며 공인 DNS와 원격 스테이징 전달은 아직 검증하지 않았습니다.",
                print: {
                    label: "BRIEF / EVENT",
                    problem: "중복 또는 이전 버전 이벤트가 현재 확인 항목을 바꿀 수 있음",
                    solution: "이벤트 ID, 내용 해시와 개정 번호를 같은 트랜잭션에서 확인",
                    tradeoff: "로컬 교차 검증 완료, 공개 main과 원격 스테이징 반영 전",
                },
            },
            {
                number: "10",
                serviceIds: ["brief"],
                title: "재구축 뒤에도 같은 주간 브리프 유지",
                constraint:
                    "이벤트를 다시 처리할 때 항목 순서나 생성 결과가 달라지면 이전 주간 브리프를 신뢰하기 어렵습니다.",
                decision:
                    "수락한 수신 이력으로 현재 관심 항목을 다시 만들고, 주간 범위와 생성 커서 및 상태를 기준으로 같은 에디션을 멱등하게 재사용했습니다. 생성한 에디션은 수정하지 않고 이력과 비교 대상으로 보존합니다.",
                validation:
                    "같은 수신 이력의 재구축 전후 결과와 같은 상태의 동시 생성 요청을 확인했습니다. 동시 요청에서도 주간 브리프는 1건만 저장되고, 최초 생성은 HTTP 201, 같은 요청의 재실행은 HTTP 200으로 구분됩니다.",
                boundary:
                    "현재 계약 팩은 다섯 연속성 신호를 규칙 기반으로 처리합니다. 새 신호를 추가하면 생산자 계약, 투영 규칙과 에디션 비교 의미를 함께 버전 관리해야 합니다.",
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
                    "BATON과 CAL은 비동기로 연동하므로 일정 반영이 지연될 수 있습니다. 실제 운영 활성화 전에는 자격 증명 회전과 전체 최신 스냅샷 재전달 순서를 함께 검증해야 합니다.",
                print: {
                    label: "CAL / REVISION",
                    problem: "중복 및 이전 일정이 최신 캘린더를 덮을 수 있음",
                    solution: "이벤트 ID, 일정 ID, 개정 번호와 내용 해시 비교",
                    tradeoff: "Core 교차 검증 완료, 실제 운영 활성화와 공개 배포 전",
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
            {
                number: "13",
                serviceIds: ["round"],
                title: "지연된 SDP와 ICE가 새 연결 협상을 덮지 않도록 차단",
                constraint:
                    "피어 연결을 다시 만들거나 ICE를 재시작한 뒤 이전 협상의 SDP와 ICE가 늦게 도착하면 새 연결 상태를 손상시킬 수 있습니다.",
                decision:
                    "피어 쌍마다 제안자를 고정해 동시 offer 충돌을 피하고, 모든 offer에 제한된 협상 세대를 부여했습니다. answer와 ICE가 같은 세대를 반환하게 하고 폐기한 세대의 메시지는 적용하지 않습니다.",
                validation:
                    "연결 중단, ICE 재시작과 피어 재생성 사이에 이전 세대의 answer 및 ICE를 늦게 전달해 현재 협상만 유지되는지 RTC Core 자동화 시나리오로 확인했습니다.",
                boundary:
                    "브라우저 클라이언트와 Java 시그널링의 프로토콜 버전을 함께 배포해야 합니다. 참가자 수나 영상 소스를 늘릴 때는 mesh 복구를 확장하기보다 SFU 전환을 검토해야 합니다.",
                print: {
                    label: "ROUND / NEGOTIATION",
                    problem: "이전 SDP와 ICE가 재연결 뒤의 새 협상을 손상시킬 수 있음",
                    solution: "고정 제안자와 협상 세대로 폐기된 메시지를 차단",
                    tradeoff: "클라이언트와 시그널링 프로토콜을 함께 배포해야 함",
                },
            },
            {
                number: "14",
                serviceIds: ["round"],
                title: "BATON 권한 판정과 WebRTC 실시간 경로 분리",
                constraint:
                    "시그널링 프레임마다 Core에 권한을 묻으면 Core의 지연과 장애가 SDP 및 ICE 교환에 전파되고, 반대로 ROUND가 계정 데이터를 가지면 권한 원본이 나뉩니다.",
                decision:
                    "Core가 계정과 스터디 멤버십을 확인해 방 범위의 짧은 RS256 참여권을 발급합니다. ROUND는 공개 JWK로 서명과 방을 로컬 검증하고, HttpOnly 및 Secure 쿠키와 참여권 수명 안에서 시그널링 및 TURN만 관리합니다.",
                validation:
                    "BATON과 ROUND의 계약 및 HTTPS와 WSS 경계 검증에서 정상 방은 허용하고 다른 방, 발급자, 수신자, 키와 만료 참여권은 거부했으며 새 키 선게시도 확인했습니다. ROUND 시그널링 입장 테스트에서는 같은 참가자의 새 연결이 이전 세션을 종료하는지 별도로 확인했습니다.",
                boundary:
                    "멤버십 회수는 다음 참여권 갱신 또는 기존 참여권 만료까지 지연될 수 있습니다. 공인 DNS, 외부 coturn 미디어 중계와 실제 소셜 로그인 및 6명 장시간 파일럿은 남아 있습니다.",
                print: {
                    label: "ROUND / AUTH BOUNDARY",
                    problem: "Core 권한 조회가 실시간 시그널링 경로에 결합될 수 있음",
                    solution: "짧은 RS256 참여권과 공개 JWK의 방 범위 로컬 검증",
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
            label: "모놀리식 애플리케이션 + Gradle 멀티모듈",
            title: "헥사고날 아키텍처를 적용한 운영 모듈 6개와 test-support 모듈",
            description:
                "의존 방향을 bootstrap → web, persistence, external 어댑터 → application → domain 순서로 제한하고 테스트 공통 지원은 test-support로 분리했습니다. 모든 클래스에 인터페이스를 만들지 않고 결제와 알림처럼 교체 가능한 외부 연동에만 포트를 뒀습니다.",
            tradeoff:
                "모듈과 타입 수는 늘지만 의존 위반을 빌드에서 차단할 수 있습니다. 현재 규모에서는 domain 모듈에 일부 JPA 매핑 어노테이션을 유지해 분리 비용을 줄였습니다.",
        },
        featuredProblemNumbers: ["02", "03", "08", "09"],
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
                label: "주문제작 / SKU 재고",
                title: "옵션 조합별 가격과 재고를 서버에서 확정",
                problem:
                    "선택형 옵션 조합마다 가격과 재고가 다르고, 관리자가 옵션을 바꾼 뒤에도 과거 주문과 환불을 당시 조건으로 재현해야 했습니다.",
                solution:
                    "선택형 조합을 최대 500개의 SKU로 관리하고 직접입력형은 제작 지시로 분리했습니다. 서버가 가격을 다시 계산하고 SKU를 정렬해 비관적 락으로 차감하며 주문에는 옵션과 가격 스냅샷을 남깁니다.",
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
                note: "운영 모듈 6개와 test-support의 의존 방향 및 포트 적용 범위를 정한 기록",
            },
            {
                type: "ADR",
                label: "결제 승인 트랜잭션과 보상 경계",
                href: "https://github.com/ljkhyeong/happyGallery/blob/04e57fa2afbd65241282eb2d5dfc5fe6319fafa5/docs/ADR/0033_결제_confirm_트랜잭션과_보상_경계/adr.md",
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
                item: "8회권 전체 환불 정합성",
                method: "MySQL 및 Redis Testcontainers 통합 테스트",
                rule: "미래 예약 2건으로 크레딧 2회를 사용한 8회권에 전체 환불 요청",
                result: "미래 예약 2건을 취소하고 잔여 6회와 합쳐 8회분 환불 요청, 크레딧과 원장을 일치시킴",
                scope: "PassCreditUsageUseCaseIT 통합 시나리오 · 2026.08.27 로컬 커밋 1e1e7a87 기준",
            },
            {
                item: "OpenAPI 문서화 범위",
                method: "OpenAPI 스냅샷 생성",
                rule: "문서화한 API 경로와 작업을 빌드 산출물에서 집계",
                result: "OpenAPI 스냅샷에서 API 경로 197개와 HTTP 작업 228개를 확인",
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
                item: "공개 페이지 SSR 및 SEO 경계",
                method: "React Router Framework Mode 서버 렌더링과 라우트 계약 검증",
                rule: "공개 상세, 존재하지 않는 경로, 회원 및 결제와 관리자 경로를 각각 요청하고 HTML 본문, 메타데이터, 색인 정책과 HTTP 상태를 확인",
                result: "공개 본문은 요청 시점에 canonical, Open Graph와 JSON-LD를 포함하고 비공개 경로는 client-only 및 noindex, 없는 상세는 실제 404로 분리",
                scope: "2026.08.27 로컬 커밋 1e1e7a87 기준 · 원격 브랜치와 공개 main 반영 전",
            },
            {
                item: "주문제작 옵션과 SKU 재고 정합성",
                method: "서버 가격 계산 및 MySQL 동시 재고 통합 시나리오",
                rule: "같은 SKU가 포함된 여러 주문 항목과 옵션 변경 뒤 결제 및 환불을 실행",
                result: "SKU별 요구 수량을 합산하고 정렬된 비관적 락으로 재고를 차감하며 주문 옵션 및 가격 스냅샷으로 당시 조건을 재현",
                scope: "2026.08.27 로컬 커밋 1e1e7a87 기준 · 원격 브랜치와 공개 main 반영 전",
            },
        ],
        category: "개인 프로젝트",
        role: "요구사항 정리, 백엔드 및 프론트엔드 구현, 테스트와 설계 문서 작성",
        oneLine:
            "PG 승인 및 환불 응답 유실은 중간 상태와 멱등 키로 복구하고, 알림은 아웃박스, 예약 및 재고는 비관적 락으로 중복과 유실을 제어",
        status: {
            label: "운영 상태",
            text: "AWS 운영 환경에 배포했으나 상시 리소스 비용으로 운영을 종료했습니다. 현재 공개 URL은 없습니다. SSR, 주문제작 SKU와 예약 캘린더 구현 근거는 2026.08.27 로컬 커밋 1e1e7a87 기준이며 아직 원격 개발 브랜치와 공개 main에는 반영하지 않았습니다.",
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
                    "운영 모듈 6개와 테스트 지원용 test-support 모듈로 의존 방향을 나누고 Gradle 의존성과 ArchUnit 정책 테스트로 bootstrap → adapter → application → domain 방향을 검사했습니다.",
                validation:
                    "LayerDependencyPolicyTest와 모듈별 컴파일로 금지한 의존이 빌드 단계에서 실패하는지 확인했습니다.",
                boundary:
                    "domain 모듈의 일부 JPA 의존은 유지했습니다. 현재 규모에서는 JPA를 완전히 분리하는 비용보다 일관된 의존 방향을 우선했습니다.",
                print: {
                    label: "ARCHITECTURE",
                    problem: "web과 persistence 코드가 도메인으로 섞이기 쉬움",
                    solution: "운영 6개 모듈과 test-support, Gradle 및 ArchUnit 정책 테스트",
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
                    "AWS 리소스별 비용과 종료 상태를 회고에 남겼습니다. k3s manifest와 배포 및 복구 스크립트의 정적 검증 기준 및 Runbook을 준비했습니다.",
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
            {
                number: "08",
                title: "공개 페이지 SSR과 비공개 화면의 색인 경계 분리",
                constraint:
                    "기존 SPA는 JavaScript 실행 전 공개 상품과 클래스 본문이 없고, 존재하지 않는 경로도 HTTP 200과 공통 메타데이터를 반환했습니다. 회원, 결제와 관리자 상태를 그대로 SSR로 옮기면 개인별 세션과 캐시가 섞일 수 있었습니다.",
                decision:
                    "React Router Framework Mode에서 공개 카탈로그와 상세만 요청 시점 SSR로 렌더링했습니다. 요청마다 QueryClient를 만들고 loader 데이터로 canonical, Open Graph, JSON-LD와 sitemap을 생성했습니다. 회원, 결제와 관리자 경로는 client-only 및 noindex로 유지했습니다.",
                validation:
                    "공개 HTML에 본문과 경로별 메타데이터가 포함되는지, 없는 상세와 임의 경로가 실제 404인지, 비공개 경로가 noindex를 유지하는지 서버 렌더링 및 라우트 시나리오로 확인했습니다.",
                boundary:
                    "프런트엔드가 정적 파일 서버가 아닌 Node 프로세스가 되어 CPU, 메모리와 상태 검사가 필요합니다. 공개 문서 요청도 백엔드 공개 API 가용성에 의존합니다. 현재 구현은 로컬 커밋이며 공개 main 반영 전입니다.",
                print: {
                    label: "FRONTEND / SSR",
                    problem: "SPA의 빈 HTML, 공통 메타데이터와 soft 404",
                    solution: "공개 SSR, 요청별 캐시와 경로별 SEO, 비공개 client-only 경계",
                    tradeoff: "Node 런타임과 백엔드 공개 API의 가용성이 필요",
                },
            },
            {
                number: "09",
                title: "주문제작 옵션 조합별 SKU 재고와 주문 스냅샷 유지",
                constraint:
                    "색상과 크기 같은 선택 조합마다 가격과 제작 가능 수량이 다르고, 각인처럼 직접 입력한 제작 지시도 필요했습니다. 관리자가 옵션을 변경한 뒤에도 과거 주문, 환불과 재고 복구는 결제 당시 조건을 재현해야 했습니다.",
                decision:
                    "선택형 옵션의 조합을 최대 500개의 ProductVariant로 만들고 직접입력형은 SKU가 아닌 제작 지시로 분리했습니다. 서버가 최종 가격을 다시 계산하고 SKU별 수량을 합산한 뒤 ID 순서로 비관적 락을 잡습니다. 주문에는 옵션, 추가 금액과 SKU를 스냅샷으로 저장합니다.",
                validation:
                    "누락 및 중복 조합, 존재하지 않는 옵션, 같은 SKU가 여러 항목에 포함된 주문과 동시 재고 차감을 검증했습니다. 옵션 변경 뒤에도 주문 스냅샷으로 표시, 환불 금액과 복구할 SKU가 유지되는지 확인했습니다.",
                boundary:
                    "선택값이 늘면 조합 수가 곱으로 증가해 500개 상한을 두었습니다. 관리자는 상한 안에서도 조합별 가격, 판매 여부와 재고를 입력해야 합니다. 현재 구현은 로컬 커밋이며 공개 main 반영 전입니다.",
                print: {
                    label: "PRODUCT / SKU",
                    problem: "옵션별 가격 및 재고와 과거 주문 조건이 어긋날 수 있음",
                    solution: "조합 SKU, 서버 가격 재계산, 정렬 락과 주문 옵션 스냅샷",
                    tradeoff: "조합 수 상한과 관리자 입력 부담이 생김",
                },
            },
            {
                number: "10",
                title: "기본 운영 규칙과 예외로 예약 회차 자동 생성",
                constraint:
                    "관리자가 클래스별 슬롯을 단건 또는 기간 및 요일 조합으로 미리 만들면 정상 영업일이 많을수록 반복 입력이 늘었습니다. 그렇다고 슬롯 엔티티를 없애면 결제, 변경과 취소가 참조하는 안정적인 슬롯 ID와 행 잠금 계약을 유지할 수 없었습니다.",
                decision:
                    "기본 운영시간과 시작 간격은 booking_calendar_settings, 날짜별 OPEN 및 CLOSED는 booking_day_overrides, 일부 시간 차단은 booking_time_blocks에 저장했습니다. 공개 조회가 클래스 행을 잠근 뒤 필요한 회차만 슬롯으로 구체화하고, 기존 슬롯의 예약 및 관리자 비활성 상태는 보존했습니다. 관리자 단건 및 일괄 슬롯 생성 API는 제거했습니다.",
                validation:
                    "AdminSlotUseCaseIT로 기본 운영시간의 자동 회차, 공휴일 OPEN 예외와 차단 시간 겹침을 확인했습니다. ConcurrentBookingUseCaseIT로 예약 확정과 회차 구체화를 동시에 실행해도 예약된 시간과 충돌하는 새 회차가 활성화되지 않는지 확인했고, KoreanPublicHolidayPolicyTest로 2026년 법정, 음력 및 대체공휴일을 검증했습니다.",
                boundary:
                    "같은 클래스의 회차 조회와 예약은 클래스 행 잠금에서 직렬화되므로 조회 집중 시 경합을 관찰해야 합니다. 임시공휴일과 선거일은 날짜 차단으로 보완해야 하며, 예약 캘린더 구현은 2026.08.27 로컬 커밋 1e1e7a87 기준으로 원격 개발 브랜치와 공개 main 반영 전입니다.",
                print: {
                    label: "BOOKING / CALENDAR",
                    problem: "반복 슬롯 입력과 기존 예약 잠금 계약을 함께 유지해야 함",
                    solution: "기본 운영 규칙, 날짜 및 시간 예외와 조회 시 회차 구체화",
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
                label: "ADR 및 회고 문서",
                href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs",
                note: "요구사항, ADR, 실험과 회고 기록",
            },
        ],
    },
    {
        ...projectSummariesById["hope-commit"],
        evidenceAsOf: "2026.08.27 공개 main과 원격 개발 브랜치 분리 검토 기준",
        evidenceTitle: "구현 및 자동화 테스트",
        systemTitle: "커밋 검토 처리 흐름",
        systemNavLabel: "처리 흐름",
        architecture: {
            label: "불변 Git 객체 기반 검토",
            title: "작업 트리를 제외하고 지정한 커밋과 부모의 Git 객체만 검토합니다.",
            description:
                "짧은 커밋 ID를 전체 객체 ID로 확정하고, 기본적으로 첫 번째 부모와 비교합니다. 최초 커밋은 빈 트리, 병합 커밋은 사용자가 지정한 부모를 기준으로 삼습니다. 수집, 근거 기록, 분석 검증과 게시 단계를 분리해 검토 중 커밋이나 작업 파일이 바뀌어도 처음 확정한 대상을 유지합니다.",
            tradeoff:
                "검토 결과의 재현성과 근거 추적을 우선해 실행 절차가 길어졌습니다. 로컬 저장소에 대상 커밋이 있어야 하며, 원격 CI와 토론 내용은 Commit Diff 검토 범위에 포함하지 않습니다.",
        },
        featuredProblemNumbers: ["01", "02", "03", "04"],
        documentGroups: [
            {
                id: "feature",
                label: "Feature Contract",
                count: "1",
                summary: "Commit Diff의 실행 조건, 입력과 완료 기준을 정의합니다.",
            },
            {
                id: "security",
                label: "Security",
                count: "1",
                summary: "비공개 경로와 자격 증명 형태의 데이터를 차단하는 기준을 관리합니다.",
            },
            {
                id: "license",
                label: "License / Notice",
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
                label: "Commit Diff 실행 계약",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/plugins/hope-commit/skills/commit-diff/SKILL.md",
                note: "대상 커밋 확정부터 근거 수집, 검증과 HTML 게시까지의 처리 절차",
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
                item: "커밋과 부모 객체 고정",
                method: "Git 저장소 픽스처를 사용한 Commit Diff 수집기 테스트",
                rule: "짧은 커밋 ID, 최초 커밋과 병합 커밋의 선택한 부모를 각각 확정해 Git 객체에서 변경 파일을 수집",
                result: "전체 커밋 ID와 부모를 고정하고 파일 이름 변경 및 변경 줄 수를 유지하는 테스트 통과",
                scope: "commit-collector.test.mjs 기준",
            },
            {
                item: "민감정보와 근거 범위 제한",
                method: "비공개 경로, 토큰 형태와 근거 좌표 검증 테스트",
                rule: "추가 맥락 요청의 비공개 설정 경로는 Git 객체 본문을 읽기 전에 차단하고, 변경 파일과 자격 증명 형태의 값은 본문을 검사한 뒤 분석 입력과 HTML 근거에서 제외",
                result: "정의한 비공개 설정 경로와 고신뢰 자격 증명 패턴을 제외하고, 제공된 파일과 줄 범위를 벗어난 근거를 거절",
                scope: "commit-redaction.test.mjs 및 근거 검증 테스트 기준",
            },
            {
                item: "검증 후 오프라인 HTML 게시",
                method: "Commit Diff 전체 생명주기 테스트",
                rule: "대상 준비, 근거 기록, 분석 스키마 검증과 커밋 재확인을 모두 통과한 경우에만 새 HTML 파일 게시",
                result: "기존 결과 파일을 덮어쓰지 않고 확정한 커밋과 스냅샷 정보가 포함된 HTML 생성",
                scope: "commit-lifecycle.test.mjs 기준",
            },
            {
                item: "저장소 자동화 테스트",
                method: "Node.js 내장 테스트 러너로 npm test 실행",
                rule: "Commit Diff와 원본 Hope 기능의 수집, 검증, 렌더링, 게시 및 패키징 회귀 테스트 실행",
                result: "자동화 테스트 245개 통과, 실패 0개",
                scope: "2026.08.27 공개 저장소 main 브랜치 기준",
            },
        ],
        category: "오픈소스 및 개발 도구",
        role: "원본 Hope 포크, Commit Diff 기능 추가 및 Git 객체 수집과 검증 절차 보완",
        oneLine:
            "작업 트리와 이전 대화의 영향을 분리하고 지정한 커밋만 근거로 검토하는 오프라인 HTML 생성",
        status: {
            label: "공개 상태",
            text: "SeungIl 님이 개발한 원본 Hope 3.0.3을 기반으로 한 비공식 포크입니다. 개인적으로 필요했던 커밋 단위 검토를 위해 Commit Diff를 추가하고 수정 및 보완했습니다. 공개 릴리스는 3.1.1이며 원본 Git 이력, MIT 라이선스와 기존 스킬을 유지하고 직접 추가한 범위를 README와 NOTICE에 구분해 기록했습니다. 원격 개발 브랜치에서는 플러그인 호출 체계와 경로 및 자격 증명 차단 규칙을 보완한 4.0.0을 검증 중이며, 아직 main과 태그에는 반영하지 않았습니다.",
        },
        visualCaption:
            "커밋 ID와 부모를 먼저 확정하고 Git 객체에서 근거를 수집한 뒤, 분석 검증과 재확인을 통과한 결과만 오프라인 HTML로 게시합니다.",
        problems: [
            {
                number: "01",
                title: "작업 트리와 분리된 커밋 검토",
                constraint:
                    "스테이징한 파일, 수정 중인 파일과 추적하지 않는 파일을 함께 읽으면 특정 커밋에 없던 내용이 검토 결과에 섞일 수 있습니다.",
                decision:
                    "입력한 16진수 커밋 ID를 전체 객체 ID로 확정하고 선택한 부모와 비교했습니다. 파일 본문과 변경 내역은 현재 작업 트리가 아니라 확정한 커밋과 부모의 Git 객체에서 읽습니다.",
                validation:
                    "짧은 커밋 ID, 최초 커밋, 병합 커밋의 부모 선택과 파일 이름 변경을 포함한 저장소 픽스처 테스트로 확인했습니다.",
                boundary:
                    "로컬 저장소에 존재하는 한 커밋만 검토합니다. 원격 CI 결과, 이슈와 토론 내용은 자동으로 수집하지 않습니다.",
            },
            {
                number: "02",
                title: "수집 범위 제한과 민감정보 차단",
                constraint:
                    "큰 변경사항이나 저장소 안의 자격 증명 값이 그대로 분석 입력과 HTML 결과에 포함되면 검토 범위가 불명확해지고 정보가 노출될 수 있습니다.",
                decision:
                    "변경 파일, 줄 수, 본문 크기와 추가 문맥 요청 수에 상한을 두었습니다. 비공개 설정 경로와 자격 증명 형태를 검사해 분석 입력과 HTML 근거에서 제외하고, 제외 사유는 검토 한계로 기록합니다.",
                validation:
                    "npm, PyPI 및 네트워크 자격 증명 경로와 토큰 형태, 파일 크기와 문맥 요청 상한을 경계값 테스트로 확인했습니다.",
                boundary:
                    "제외한 파일의 구현 내용은 분석하지 않습니다. 필요한 근거가 제한 범위 밖에 있으면 결과에 확인하지 못한 범위로 표시합니다.",
            },
            {
                number: "03",
                title: "근거 좌표와 분석 결과 검증",
                constraint:
                    "분석 모델이 이전 대화나 추측을 섞으면 실제 변경 코드가 뒷받침하지 않는 설명과 지적이 생성될 수 있습니다.",
                decision:
                    "분석은 이전 대화를 받지 않은 별도 작업 컨텍스트에서 실행하고, 각 판단에 수집기가 제공한 파일 식별자와 줄 범위를 연결합니다. 결과는 JSON Schema와 근거 규칙으로 검증합니다.",
                validation:
                    "다른 페이지의 근거 참조, 존재하지 않는 파일과 줄 범위, 스키마에 없는 필드 및 과도한 설명을 거절하는 테스트로 확인했습니다.",
                boundary:
                    "별도 분석 작업자를 사용할 수 없으면 검토를 중단합니다. 모델의 판단 자체를 증명하는 것이 아니라 판단이 참조한 코드 범위를 추적할 수 있게 합니다.",
            },
            {
                number: "04",
                title: "검증 결과의 원자적 게시",
                constraint:
                    "검토 도중 대상 커밋이나 임시 상태가 바뀌거나 기존 결과를 덮어쓰면 어떤 근거로 만든 문서인지 확인하기 어렵습니다.",
                decision:
                    "분석 검증 후 처음 확정한 Git 객체가 남아 있는지 다시 확인하고 새 경로에 HTML을 게시합니다. 기존 출력 파일과 다른 실행의 임시 디렉터리는 교체하거나 삭제하지 않습니다.",
                validation:
                    "검증 전후 커밋 변경, 기존 출력 경로, 심볼릭 링크와 게시 중 경합을 재현해 게시 중단 및 임시 상태 보존 규칙을 확인했습니다.",
                boundary:
                    "HTML은 로컬 파일로만 생성합니다. 원격 저장소 게시, 브랜치 생성, 푸시와 리뷰 댓글 작성은 수행하지 않습니다.",
            },
        ],
        stack: [
            "JavaScript",
            "Node.js 22",
            "Git Objects",
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
                result: "KICS, 집행포털과 통신사 업무망 사이에서 담당한 요청 및 제출 자료가 정의된 순서로 처리되는 것을 확인",
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
        role: "해양경찰 KICS 통신사실확인자료 관련 업무 개선 및 KICS-통신사, KICS-집행포털 간 망 연계 인터페이스와 배치 구현",
        oneLine: "독립망 사이의 요청과 제출 자료를 인터페이스 및 Spring Batch로 연계",
        status: {
            label: "공개 범위",
            text: "BEINTECH 소속으로 LG CNS 컨소시엄에 참여해 진행 중인 공공 SI입니다. 독립망 간 연계 구조와 직접 수행한 역할은 공개하고, 실제 접속 주소, 운영 환경 설정값, 보안 설정, 소스 코드와 내부 문서만 제외했습니다.",
        },
        systemTitle: "독립망 간 업무 흐름 및 시스템 구성",
        systemNavLabel: "업무 흐름",
        visualCaption:
            "* 사법기관 KICS, 전자영장 집행포털, 금융기관 및 통신사가 서로 독립된 망에서 요청과 제출 자료를 주고받는 흐름을 공개 가능한 수준으로 단순화했습니다.",
        architecture: {
            label: "독립망 간 기관 연계와 실패 경계",
            title: "공통 조회 흐름을 재사용하고, 변경 대응과 DB 연결 점유를 고려해 책임과 트랜잭션을 분리했습니다.",
            description:
                "통신사실확인자료와 수신자료 열람 조회는 처리 흐름이 많이 겹쳤습니다. 공통 로직은 제네릭 메서드와 enum, 공통 ErrorCode 및 Exception으로 묶어 재사용하고, 짧은 프로젝트 기간과 잦은 요구사항 변경 및 추가에 대응할 수 있도록 책임 주도 설계로 객체의 역할을 분리했습니다. 인터페이스와 배치는 외부 API 응답을 기다리는 동안 DB 커넥션을 오래 점유해 커넥션 풀이 고갈되지 않도록 외부 API 호출과 DB 트랜잭션을 분리했습니다.",
            tradeoff:
                "공통 구조를 먼저 잡아 초기 구현은 느려졌지만 후속 기능에서 수정할 코드는 줄었습니다. 현재 인터페이스 동시호출을 제한하기 위해 사용한 ReentrantLock은 단일 서버 싱글톤 빈 기준이므로, 서버를 여러 대로 늘리면 분산 락 방식이 필요합니다.",
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
                    "외부 호출 전후의 DB 반영을 REQUIRES_NEW 트랜잭션으로 분리하고, 단일 애플리케이션 안에서는 ReentrantLock으로 겹친 실행을 막았습니다.",
                validation:
                    "동시 호출에서 진행 중인 작업이 다시 실행되지 않고 외부 호출 전후의 DB 반영이 나뉘는 것을 확인했습니다.",
                boundary:
                    "ReentrantLock은 한 JVM 안에서만 유효합니다. 다중 인스턴스로 확장하면 DB 락이나 분산 락 등 별도의 조정 수단이 필요합니다.",
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
                item: "수용자 인적정보 및 영장정보 연계",
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
                result: "검증을 통과한 요청에만 URL을 발급하고 파일 본문이 WAS를 거치지 않아 대용량 파일로 인한 메모리 및 I/O 부하와 OOM 위험을 방지한 것을 확인",
                scope: "폐쇄망 환경에서 확인",
            },
        ],
        category: "BEINTECH / 국방부 SI",
        role: "군교정 기능 개발, 수용자 인적정보 및 영장정보 연계 배치와 운영 대응",
        oneLine:
            "수용자 인적정보 및 영장정보 검증 배치, WebSquare 요청의 Spring Security CSRF 토큰 처리와 Presigned URL 기반 대용량 파일 업로드",
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
                title: "WebSquare CSRF 토큰 처리와 Presigned URL 직접 업로드",
                constraint:
                    "기존 WebSquare 업무 화면과 파일 솔루션을 유지하면서 상태 변경 요청의 위조를 차단하고, 대용량 파일이 업무 WAS의 메모리와 I/O를 점유해 OOM으로 이어질 위험을 줄여야 했습니다.",
                decision:
                    "Spring Security가 생성한 CSRF 토큰의 이름과 값을 WebSquare 화면 데이터 규격으로 전달하고, 화면 공통 요청 로직이 저장 및 파일 업로드 같은 상태 변경 요청마다 토큰을 포함하도록 구성했습니다. 토큰이 없거나 일치하지 않는 요청은 Spring Security 필터에서 차단했습니다. 파일 업로드는 화면에서 파일 솔루션을 바로 호출하던 흐름을 `화면 → WAS 업로드 요청 검증 → Presigned URL 발급 → 파일 솔루션 직접 업로드` 순서로 변경했습니다. WAS는 업로드 권한과 파일 정보만 검증하고 파일 본문은 수신하거나 중계하지 않아, 기존 파일 솔루션 로직을 수정하지 않으면서 대용량 파일로 인한 WAS 메모리 및 I/O 부하와 OOM 위험을 방지했습니다.",
                validation:
                    "정상 CSRF 토큰과 누락 및 불일치 토큰 요청을 실행해 Spring Security 필터의 처리 결과를 확인했습니다. 파일 업로드는 허용 및 차단 요청의 Presigned URL 발급 여부와 파일 본문이 WAS를 거치지 않고 기존 파일 솔루션으로 직접 전송되는 경로를 확인했습니다.",
                boundary:
                    "Presigned URL의 만료 시간과 업로드 조건, 업로드 완료 상태를 별도로 관리해야 합니다. 직접 업로드는 WAS 부하를 줄이지만 브라우저와 파일 저장소 사이의 실패를 다시 확인하는 절차가 필요합니다.",
            },
            {
                number: "03",
                title: "폐쇄망 레거시 환경에서 WAS 로그와 DB 상태로 장애 원인 분석",
                constraint:
                    "Spring Boot Actuator, Prometheus, Grafana 같은 모니터링 환경을 추가하기 어려워 운영 화면 오류를 지표로 빠르게 좁힐 수 없었습니다. JUnit과 AssertJ 기반 자동화 테스트도 구축되어 있지 않아 오류 조건을 코드로 재현하고 수정 영향을 확인하기 어려웠습니다. 따라서 요청 처리, SQL, 기관 연계 배치 또는 DB 반영 중 어디에서 문제가 생겼는지 WAS 로그와 DB 상태를 직접 대조해야 했습니다.",
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
            "eGov 4.1",
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
        evidenceTitle: "담당 범위 및 측정 결과",
        proofs: [
            {
                item: "HLS 서버 및 React 구현 범위",
                method: "6인 팀 역할 분담 내용과 팀 시연 확인",
                rule: "HLS 서버와 React 프론트엔드 기능을 직접 구현",
                result: "React 화면의 WebRTC 실시간 시청과 HLS 지난 구간 재생 흐름을 확인",
                scope: "교육 프로젝트",
            },
            {
                item: "HLS 재생 지연",
                method: "공개 HLS 서버 커밋의 재생 측정 기록 확인",
                rule: "세그먼트 길이와 인코딩 설정을 조정한 전후 비교",
                result: "약 35초에서 약 17초로 단축",
                scope: "공개 저장소 커밋 기록 기준이며 정밀 벤치마크는 아님",
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

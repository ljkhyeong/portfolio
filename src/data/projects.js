import { projectSummaries, projectSummariesById } from "./projectSummaries"

const projects = [
    {
        ...projectSummariesById.baton,
        evidenceTitle: "검증 범위 및 현재 상태",
        systemTitle: "대표 화면 및 마이크로서비스 구성",
        systemNavLabel: "화면 및 서비스",
        screenshots: [
            {
                id: "workspace",
                src: "baton-workspace.png",
                label: "업무 흐름",
                caption: "인수인계 타임라인, 멈춘 바통과 최근 결정",
                alt: "BATON 오늘 화면에서 인수인계 타임라인, 진행이 멈춘 바통과 최근 결정 기록을 확인하는 모습",
                width: 1280,
                height: 720,
            },
            {
                id: "batonbook",
                src: "baton-batonbook.png",
                label: "바통북",
                caption: "역할 목적, 반복 업무와 주요 결정",
                alt: "BATON 모바일 바통북에서 역할 목적과 반복 업무 및 중요 결정을 확인하는 모습",
                width: 390,
                height: 844,
                fit: "contain",
            },
            {
                id: "role-detail",
                src: "baton-role-detail.png",
                label: "역할 상세",
                caption: "담당자, 핵심 책임과 인수인계 상태",
                alt: "BATON 모바일 역할 상세에서 담당자와 핵심 책임 및 인수인계 준비 상태를 확인하는 모습",
                width: 390,
                height: 844,
                fit: "contain",
            },
        ],
        architecture: {
            label: "서비스 구성과 담당 업무",
            title: "Core와 6개 서비스를 기능과 저장소 기준으로 분리했습니다.",
            description:
                "Core는 조직과 인수인계를 관리합니다. 6개 서비스는 링크, 점검, 이벤트, 보고서, 캘린더와 WebRTC를 담당하며 DB를 공유하지 않습니다.",
            tradeoff:
                "장애와 배포 영향은 분리했지만 7개 서비스를 각각 운영하고 서비스 간 이벤트의 재처리를 관리해야 합니다.",
        },
        featuredProblemNumbers: ["02", "03", "05", "07"],
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
                label: "API 및 서비스 간 데이터 형식",
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
                note: "비공개 저장소의 설계 문서에서 업무 규칙을 분리한 이유와 현재 제약만 공개용으로 정리",
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
                note: "중복 및 과거 이벤트는 반영하지 않고 건너뛴 최신 개정은 누락 구간을 기록하며, 생성한 주간 보고서는 이후 수정하지 않는 방식",
            },
            {
                serviceId: "cal",
                type: "PRD / ADR 요약",
                label: "CAL 일정 JSON 수신과 캘린더 구독",
                href: "/docs/baton/cal-calendar-contract.md",
                note: "일정 개정 번호, iCalendar 변환, 구독 주소의 토큰 교체 및 폐기 방식",
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
                    "조직과 인수인계를 관리하고 활동 중인 스터디 구성원에게만 ROUND 참여권을 발급합니다.",
                detail: "조직 운영 데이터, 작업 공간 공유 키 및 ROUND 참여권 관리",
                evidence:
                    "인수인계 상태 전이 및 역할별 진행 중 1건 제약 테스트 · PRD 6 · ADR 19 · OpenAPI",
                input: "조직 및 역할 관리, 인수인계 상태 변경과 ROUND 참여 요청",
                inputRule:
                    "조직 요청은 공유 키와 소속을 확인하고, 참여권 발급은 활동 중인 스터디 구성원인지 추가로 확인합니다.",
                output: "팀, 시즌, 역할, 반복 업무와 인수인계 데이터 및 ROUND 참여권",
                recoveryBoundary:
                    "인수인계 수락과 역할 담당자 및 담당 기간 변경을 한 DB 트랜잭션에서 처리",
                database: "MySQL",
                primary: true,
                visibility: "비공개 저장소 / 설계와 테스트 요약 공개",
                status: "조직 운영, ROUND 참여권, WATCH 및 CAL 연동과 지표를 구현했습니다. 외부 알림, 자동 재처리와 공개 HTTPS는 미검증입니다.",
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
                role: "BATON 및 ROUND 짧은 링크",
                summary:
                    "허용한 BATON 및 ROUND 경로에 짧은 링크를 발급합니다. 실제 접근 권한은 대상 서비스가 확인합니다.",
                contribution:
                    "링크 생성, 조회, 활성, 만료, 폐기와 리다이렉트를 구현했습니다. UUID로 중복 생성을 막고 HMAC 키 일치 여부를 검사합니다.",
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
                detail: "같은 UUID와 조건은 링크 1건으로 유지하고, HMAC-SHA256 코드 및 허용 경로를 검증",
                evidence:
                    "같은 요청 8건을 동시에 보내도 링크 1건만 저장되고, HMAC 키 불일치 시 서버가 시작되지 않는지 검증",
                input: "허용된 BATON 또는 ROUND 대상, 사용 목적, 활성 및 만료 시각과 UUID",
                inputRule:
                    "대상 시스템, 경로, 사용 목적, 활성 및 만료 시각과 UUID가 허용 범위인지 확인합니다.",
                output: "활성 시작일, 만료일과 폐기 상태를 저장한 짧은 링크 코드",
                recoveryBoundary:
                    "같은 UUID와 링크 조건이면 기존 링크를 반환하고, 같은 UUID의 조건이 하나라도 다르면 충돌로 차단",
                database: "MySQL",
                visibility: "비공개 저장소 / 설계와 테스트 요약 공개",
                status: "링크 생성, 폐기와 리다이렉트까지 구현했습니다. 대상 서비스 권한까지 포함한 전체 흐름과 공개 배포는 미검증입니다.",
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
                    "URL이 사설망 또는 로컬 주소로 해석되면 차단하고, 공개 URL의 상태를 점검해 변경 이벤트를 Core에 전달합니다.",
                contribution:
                    "점검 작업마다 처리 서버와 기한을 기록한 뒤, 외부 요청 중에는 DB 연결을 반환했습니다. 상태 변경 이벤트 재전송과 Prometheus 운영 지표도 구현했습니다.",
                stack: [
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring JDBC",
                    "Spring Security",
                    "PostgreSQL 18",
                    "Apache HttpClient 5",
                    "Micrometer / Prometheus",
                    "Flyway",
                    "Testcontainers",
                ],
                detail: "사설망 및 로컬 주소 접근 차단, 중단된 점검 재처리, 이전 점검 결과의 덮어쓰기 차단과 미전송 이벤트 보관",
                evidence:
                    "사설망 및 DNS 재조회 중 IP 변경을 차단하고, 이전 URL 버전의 늦은 결과가 저장되지 않는지 검증",
                input: "점검 대상 URL과 점검 요청 시점의 URL 버전",
                inputRule:
                    "URL 형식과 통신 방식을 확인하고 사설망 및 로컬 주소로 해석되는 요청을 차단합니다.",
                output: "URL 상태와 상태 변경 이벤트",
                recoveryBoundary:
                    "한 서버가 가져간 작업에 만료 시간을 두고 서버가 중단되면 다른 서버가 이어서 처리",
                database: "PostgreSQL",
                visibility: "공개 저장소",
                status: "URL 점검, 상태 변경 전송과 지표를 구현했습니다. 외부 대시보드 및 알림을 포함한 공개 스테이징은 미검증입니다.",
                tradeoff:
                    "점검 처리 기한이 짧으면 중복 실행이 늘고, 길면 장애 복구가 늦어집니다. 운영 지표를 기준으로 조정해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-watch/tree/65113d935cd272d486652dab4bdd1b3f377a683b",
                    label: "WATCH 개발 브랜치 고정 커밋",
                    note: "URL 점검, 상태 변경 전달과 Prometheus 운영 지표를 확인한 원격 개발 브랜치 커밋입니다.",
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
                    "Core 이벤트를 Webhook 또는 SQS FIFO로 전달하고 성공, 실패와 결과 미확인을 나눠 저장합니다.",
                contribution:
                    "이벤트 ID를 저장해 재수신 시 새 전송 작업을 만들지 않습니다. RabbitMQ 수신과 Webhook 및 SQS FIFO 전송을 구현했습니다.",
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
                detail: "이벤트 중복 차단, 중단 작업 재처리와 결과 미확인 작업 분리",
                evidence:
                    "이벤트 재수신에도 전달 작업이 늘지 않고, 서버 중단 뒤 기존 전송 ID로 재개되는지 검증",
                input: "이벤트 ID, 이벤트 종류, 데이터 형식 버전, 대상 업무 식별자와 발생 시각",
                inputRule: "수신 값이 정해 둔 이벤트 형식과 데이터 형식 버전에 맞는지 확인합니다.",
                output: "Webhook 또는 SQS FIFO 전달 성공, 실패 또는 결과 미확인 상태",
                recoveryBoundary:
                    "같은 이벤트는 새 작업을 만들지 않습니다. 전송 전 일시 실패만 재시도하고 결과 미확인은 자동 재시도하지 않습니다.",
                database: "PostgreSQL",
                visibility: "비공개 저장소 / 설계와 테스트 요약 공개",
                status: "Webhook, SQS FIFO 전송과 RabbitMQ 수신 및 제한 재시도를 구현했습니다. 실제 AWS 전송과 큐 적체 및 실패 알림은 미검증입니다.",
                tradeoff:
                    "결과 미확인 건은 중복 전달을 막기 위해 자동 재전송하지 않습니다. 운영자가 외부 기록을 확인해 상태를 확정해야 합니다.",
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
                role: "운영 점검 및 주간 보고서",
                summary:
                    "담당 공백, 자료 부족, 업무 지연과 미완료 인수인계를 찾아 주간 보고서로 보관합니다.",
                contribution:
                    "중복 및 과거 이벤트를 차단하고 누락된 개정 구간을 기록했습니다. 목록 재생성, 보고서 중복 방지와 Bearer 토큰 교체도 구현했습니다.",
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
                detail: "중복 및 과거 이벤트 차단, 점검 목록 재생성, 생성 후 고정하는 주간 보고서",
                evidence:
                    "중복 및 과거 이벤트 차단, 저장 이벤트 기반 목록 재생성과 동일 주간 보고서 1건 저장을 PostgreSQL 통합 테스트로 확인했습니다. 2.0.0-rc.1 실제 Core 실행 JAR은 로컬 HTTP로 연동했습니다.",
                input: "담당 공백, 책임 및 자료 부족, 반복 마감 지연과 미완료 인수인계 이벤트",
                inputRule:
                    "이벤트 ID, 데이터 형식 버전, 개정 번호와 본문 해시가 기존 수신 기록과 충돌하지 않는지 확인합니다.",
                output: "운영 점검 목록, 수신 이벤트 이력과 생성 후 수정하지 않는 주간 보고서",
                recoveryBoundary:
                    "같은 이벤트와 과거 개정 번호는 다시 반영하지 않고 저장한 수신 이벤트 전체를 읽어 운영 점검 목록을 다시 생성",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 최신 구현은 원격 개발 브랜치",
                status: "2.0.0-rc.1 실제 Core 실행 JAR과 BRIEF의 로컬 HTTP 연동을 확인했습니다. Caddy HTTPS 앞단은 실제 Core가 아닌 예시 JSON의 인증 및 수신만 확인했습니다. 2.0.0-rc.2 실제 Core JSON, 실제 Core-Caddy HTTPS와 원격 배포는 미검증입니다.",
                tradeoff:
                    "v1과 v2 이벤트를 함께 처리합니다. 이벤트 종류가 늘면 Core JSON, 점검 규칙과 보고서 비교 규칙을 함께 변경해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-brief/tree/61584199a5caaa15cdb65ab071977cde74029d08",
                    label: "BRIEF 개발 브랜치 고정 커밋",
                    note: "최신 구현은 원격 개발 브랜치에 있으며 공개 main에는 아직 반영하지 않았습니다.",
                },
                documentation: [
                    { label: "PRD", count: "22" },
                    { label: "ADR", count: "5" },
                    { label: "이벤트 형식 문서", count: "1" },
                ],
            },
            {
                id: "cal",
                name: "CAL",
                kind: "MICROSERVICE",
                route: "/projects/baton/cal",
                role: "외부 캘린더 구독",
                summary: "Core 일정과 마감을 외부 캘린더가 구독하는 읽기 전용 피드로 제공합니다.",
                contribution:
                    "Core 일정과 개정 번호를 저장해 iCalendar로 변환합니다. 구독 토큰 회전 및 폐기와 HTTP 캐시 응답도 구현했습니다.",
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
                detail: "읽기 전용 .ics 피드, 구독 토큰 교체 및 폐기, 304 캐시",
                evidence: "Core 실제 일정 JSON으로 중복 및 과거 일정 차단과 iCalendar 변환 검증",
                input: "Core가 확정한 일정의 전체 현재 값 및 개정 번호와 구독 생성, 회전 및 폐기 요청",
                inputRule:
                    "일정 ID, 이벤트 ID, 개정 번호와 시간대 값이 공개한 일정 JSON 형식에 맞는지 확인합니다.",
                output: "읽기 전용 iCalendar 피드와 일정이 바뀌지 않았음을 알리는 304 응답",
                recoveryBoundary:
                    "중복 및 과거 개정 번호는 반영하지 않고 DB에 저장한 일정으로 같은 iCalendar 피드를 다시 생성",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 안정 계약 1.0.0 / 개발 후보 1.1.0-rc.1",
                status: "일정 수신 및 iCalendar 구독과 Core 1.0.0 연동을 확인했습니다. 1.1.0-rc.1 공개와 운영 구독은 미검증입니다.",
                tradeoff:
                    "읽기 전용 구독은 외부 캘린더에서 쉽게 사용할 수 있지만, 비동기 반영 지연과 캘린더 앱별 동작 차이를 관리해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-cal/tree/fba74a22c9d62e940ccb5287947051f7a8d31f89",
                    label: "CAL 개발 브랜치 고정 커밋",
                    note: "안정 계약 1.0.0의 Core 호환성 근거와 미공개 개발 후보 1.1.0-rc.1을 함께 확인할 수 있습니다.",
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
                role: "WebRTC 스터디룸",
                summary:
                    "Core 참여권을 검증해 최대 6명의 WebRTC 연결 메시지를 전달하고, 직접 연결이 어려우면 TURN 접속 정보를 제공합니다.",
                contribution:
                    "React 방 화면과 연결 모듈, 공통 메시지 규격, Spring WebSocket 시그널링 및 참여권 검증을 구현했습니다.",
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
                detail: "최대 6명 mesh WebRTC, 이전 연결 메시지 차단, RS256 참여권과 TURN 접속 정보",
                evidence: "Chromium 연결 흐름 확인, WebKit은 직접 초대와 장치 권한 동의까지만 확인",
                input: "Core가 방 ID, 참가자 ID와 만료 시각을 넣어 RSA 개인 키로 서명한 짧은 RS256 참여권",
                inputRule:
                    "참여권의 서명, 발급자, 수신자, 방 ID와 만료 시각을 Core가 제공한 공개 키 목록으로 확인합니다.",
                output: "브라우저 사이의 WebRTC 연결 메시지 전달, DataChannel 채팅 수신 응답과 짧은 TURN 접속 정보",
                recoveryBoundary:
                    "연결을 새로 만들 때마다 순번을 올리고 이전 연결에서 늦게 온 메시지는 버립니다. 같은 참가자가 새 참여권으로 접속하면 이전 WebSocket 세션을 종료합니다.",
                database: "DB 없음 / 방과 참가자 연결 상태는 프로세스 메모리에 저장",
                visibility: "비공개 저장소 / 설계와 테스트 요약 공개",
                status: "Core 참여권으로 HTTPS 및 WSS 방 입장을 확인했습니다. 공인 DNS, 외부 coturn과 6명 장시간 접속은 미검증입니다.",
                tradeoff:
                    "참가자끼리 직접 연결하는 mesh 구조는 인원이 늘수록 각 브라우저의 업로드와 CPU 사용량이 증가합니다. 방 상태가 프로세스 메모리에 있어 현재는 단일 시그널링 인스턴스로 운용해야 합니다.",
                documentation: [
                    { label: "Architecture", count: "1" },
                    { label: "ADR", count: "1" },
                    { label: "메시지 규격", count: "1" },
                    { label: "Runbook", count: "2" },
                ],
            },
        ],
        proofs: [
            {
                item: "Core 인수인계 상태 전이 및 중복 교대 차단",
                method: "도메인 규칙 및 저장소 통합 테스트",
                rule: "준비 → 전달 → 수락 순서, 준비 또는 전달 단계의 취소, 이전 상태로 되돌리는 요청과 같은 역할에 열린 인수인계 2건을 동시에 생성하는 요청을 각각 실행",
                result: "준비 → 전달 → 수락 순서를 적용하고 준비 또는 전달 단계만 취소를 허용하며, 역할별 진행 중인 인수인계를 1건으로 유지",
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
                result: "사설망 및 과대 응답을 차단하고 현재 URL 버전의 점검 결과만 저장",
                scope: "WATCH 공개 저장소 · URL 보안 및 중단된 점검 재처리 자동화 시나리오 · 2026.08.27 커밋 상태 기준",
            },
            {
                item: "RELAY DB 저장 후 RabbitMQ 재전달 중복 방지",
                method: "RabbitMQ 및 PostgreSQL Docker Compose 검증",
                rule: "PostgreSQL 저장은 끝났지만 RabbitMQ에 처리 완료 응답(ACK)을 보내기 전에 RabbitMQ와 RELAY를 중단하고 같은 이벤트를 재전달",
                result: "같은 이벤트 ID의 수신 이력을 1건으로 유지하고 재전달에 처리 완료 응답을 보내며 별도 실패 큐(DLQ)에는 넣지 않음",
                scope: "RELAY 비공개 저장소 origin/main b87eb49 · RabbitMQ 4.3.4 및 PostgreSQL 일회성 Compose 시나리오 · 2026.08.08 CI 성공",
            },
            {
                item: "BRIEF 운영 점검 목록 다시 생성과 주간 보고서 중복 생성 방지",
                method: "PostgreSQL 통합 테스트와 2.0.0-rc.1 실제 Core 실행 JAR의 BRIEF 로컬 HTTP 연동. Caddy HTTPS 앞단에는 실제 Core가 아닌 예시 JSON 전송",
                rule: "같은 이벤트 재전송, 낮거나 건너뛴 개정 번호, 저장 이벤트 기반 운영 점검 목록 다시 생성과 동일 주간 보고서 동시 생성 요청을 실행",
                result: "중복 및 과거 이벤트를 차단하고, 저장 이벤트로 목록을 같은 결과로 다시 만들며, 동일 조건의 주간 보고서는 1건만 저장되는지 PostgreSQL 통합 테스트로 확인했습니다. 2.0.0-rc.1 실제 Core 실행 JAR은 로컬 HTTP로 연동했습니다.",
                scope: "2.0.0-rc.1 실제 Core 실행 JAR과 BRIEF의 로컬 HTTP 연동 · Caddy HTTPS 앞단은 실제 Core가 아닌 예시 JSON의 인증 및 수신만 확인 · 2.0.0-rc.2 실제 Core JSON, 실제 Core-Caddy HTTPS와 원격 배포는 미검증 · 2026.08.27",
            },
            {
                item: "CAL 일정 JSON 수신과 캘린더 구독",
                method: "PostgreSQL Testcontainers와 iCalendar 기대값 비교, Core의 실제 일정 JSON 생성 코드로 만든 데이터를 CAL 컨테이너에 전송",
                rule: "같은 일정의 전체 현재 값 재전달, 현재보다 낮은 개정 번호, 서머타임 전환(DST) 및 자정 경계 일정, 취소 일정과 구독 토큰 동시 회전을 각각 실행",
                result: "중복 및 과거 일정을 차단하고 DST, 자정 경계와 취소 일정을 변환하며 같은 일정에는 같은 ETag를 반환",
                scope: "공개 저장소 일정 JSON 형식 1.0.0 및 Core 일정 이벤트 JSON Schema 기준 · 실제 운영 활성화와 공개 배포 전 · 2026.08.27",
            },
            {
                item: "Core가 발급한 참여권 검증과 WebRTC 방 입장",
                method: "Core의 실제 참여권 서명 코드로 만든 RS256 참여권을 ROUND 실행 JAR에 HTTPS 및 암호화된 WebSocket(WSS)으로 전달하고 방 입장 테스트 실행",
                rule: "정상, 다른 방, 잘못된 발급자, 수신자 및 공개 키와 만료 참여권으로 입장, 키 교체와 재연결을 실행",
                result: "정상 참여권만 입장과 TURN을 허용하고, 같은 참가자가 재접속하면 이전 세션을 종료",
                scope: "ROUND 비공개 저장소 원격 개발 브랜치 기준 · 공인 DNS, 외부 TURN 미디어 중계 서버(coturn)와 6명 장시간 접속 테스트 전 · 2026.08.27",
            },
        ],
        category: "개인 프로젝트",
        role: "Core와 6개 서비스의 API, 이벤트, 저장소, 재처리와 배포 설계 및 구현",
        oneLine:
            "Core는 조직과 인수인계를 관리하고, 6개 서비스는 링크, URL 점검, 이벤트, 보고서, 캘린더와 WebRTC를 담당합니다.",
        status: {
            label: "현재 상태",
            text: "Core와 6개 서비스의 주요 기능을 구현했습니다. CAL 및 ROUND 실제 데이터와 BRIEF 2.0.0-rc.1 실제 Core 실행 JAR의 로컬 HTTP 연동을 확인했습니다. Caddy HTTPS 앞단은 실제 Core가 아닌 예시 JSON의 인증 및 수신만 확인했으며, 2.0.0-rc.2 실제 Core JSON, 실제 Core-Caddy HTTPS와 원격 배포는 미검증입니다.",
        },
        visualCaption:
            "Core만 조직 데이터를 저장하며 각 서비스는 자체 저장소를 사용합니다. ROUND 방 상태는 메모리에 둡니다.",
        problems: [
            {
                number: "01",
                serviceIds: ["core", "go", "watch", "relay", "brief", "cal", "round"],
                shared: true,
                title: "Core와 6개 서비스의 책임 및 저장소 분리",
                constraint: "각 기능은 입력, 보안 검사와 실패 처리 방식이 달랐습니다.",
                decision:
                    "Core는 조직 운영을 맡고 6개 서비스를 저장소와 실행 환경별로 분리했습니다. 상태 변경 이벤트는 업무 데이터와 함께 저장한 뒤 전송합니다.",
                validation:
                    "GO 중복 링크, WATCH 사설망 URL, RELAY 재전달, BRIEF 보고서, CAL 일정과 ROUND 참여권을 각각 테스트했습니다.",
                boundary:
                    "개별 기능은 검증했지만 실제 자격 증명을 사용한 공개 환경 전체 연동은 미검증입니다.",
            },
            {
                number: "02",
                serviceIds: ["core"],
                title: "바통 수락과 담당자 변경을 한 트랜잭션으로 처리",
                constraint:
                    "바통 수락과 담당자 변경이 따로 반영되면 역할 담당 정보가 어긋날 수 있었습니다.",
                decision:
                    "준비 때 다음 담당자와 기간을 고정하고 전달 때 누락 항목을 확인했습니다. 수락 시 담당자와 기간을 한 트랜잭션에서 바꾸고 역할별 진행 중 바통은 1건만 허용했습니다.",
                validation: "상태 전이, 취소, 중복 교대와 전달 후 수정을 테스트했습니다.",
                boundary:
                    "운영 화면에서 현재 상태와 수락 또는 취소 가능 여부를 보여주고, 준비 또는 전달 상태에서 멈춘 바통을 정리하는 절차가 필요합니다.",
            },
            {
                number: "03",
                serviceIds: ["go"],
                title: "같은 링크 요청은 1건만 저장",
                constraint:
                    "저장 후 응답이 유실되거나 여러 서버가 같은 요청을 동시에 받으면 링크가 중복 생성될 수 있습니다.",
                decision:
                    "UUID 해시로 처리 이력을 찾고 요청 조건을 비교합니다. 조건이 같으면 기존 링크를 반환하고 다르면 거절합니다.",
                validation:
                    "같은 요청 8건을 동시에 보내도 링크와 링크 생성 처리 기록이 각각 1건만 생성되는지 통합 테스트로 확인했습니다.",
                boundary:
                    "HMAC 키 교체와 DB 복구 시 기존 링크가 유지되도록 키 관리와 백업 절차가 함께 필요합니다.",
            },
            {
                number: "04",
                serviceIds: ["go"],
                title: "HMAC 키와 링크 데이터의 복구 시점 맞추기",
                constraint:
                    "DB와 HMAC 키의 복구 시점이 다르면 기존 링크 코드를 재현할 수 없습니다.",
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
                title: "URL 점검 중 DB 연결 반환과 늦은 결과 차단",
                constraint:
                    "느린 URL 점검이 DB 연결을 오래 잡고 늦은 결과가 최신 상태를 덮을 수 있었습니다.",
                decision:
                    "점검 작업마다 처리 서버와 기한을 기록한 뒤 DB 연결을 반환하고, 확인한 공인 IP로만 요청했습니다. 작업 ID나 URL 버전이 바뀐 결과는 저장하지 않았습니다.",
                validation:
                    "사설망, DNS 변경, 과도한 응답, 서버 중단과 늦은 결과를 테스트했습니다.",
                boundary:
                    "한 서버가 가져간 점검의 처리 기한이 짧으면 중복 실행이 늘고, 길면 중단된 점검을 다른 서버가 이어받는 시점이 늦어집니다.",
            },
            {
                number: "06",
                serviceIds: ["watch"],
                title: "미전송 URL 상태 이벤트 재처리",
                constraint:
                    "URL 상태는 저장됐지만 Core 전달 호출이 실패하면 두 시스템이 서로 다른 상태를 볼 수 있었습니다.",
                decision:
                    "상태 변경과 이벤트를 한 트랜잭션에 저장하고 수신 확인 전까지 재전송했습니다. 오래된 미전송 건은 별도 작업으로 처리했습니다.",
                validation:
                    "같은 이벤트 재전송, Core는 이벤트를 받았지만 WATCH가 성공 응답을 받지 못한 경우와 미전송 이벤트 재처리를 자동화 테스트로 확인했습니다. 공개 스테이징 전송 절차는 Runbook으로 정리했습니다.",
                boundary:
                    "현재는 이벤트를 받는 서비스가 하나라 별도 메시지 큐를 두지 않았습니다. 받는 서비스가 늘면 전달 방식을 다시 검토해야 합니다.",
            },
            {
                number: "07",
                serviceIds: ["relay"],
                title: "결과를 모르는 외부 전송의 중복 방지",
                constraint:
                    "외부 전송 뒤 응답을 잃으면 성공 여부를 모른 채 중복 전송할 수 있었습니다.",
                decision:
                    "호출 전에 시도와 중복 방지 키를 저장했습니다. 결과를 확인할 수 없으면 자동 재전송을 멈추고 외부 기록 확인 후 상태를 확정합니다.",
                validation:
                    "중단 재개, 만료 서버의 늦은 결과 차단과 상태 확정 재실행을 확인했습니다.",
                boundary:
                    "중복 전달 방지를 우선해 자동 재전송을 멈추므로 외부 전송 기록 확인과 운영자 조정 절차가 필요합니다.",
            },
            {
                number: "08",
                serviceIds: ["relay"],
                title: "RabbitMQ 메시지 재전달 시 중복 처리 방지",
                constraint:
                    "PostgreSQL 저장이 끝났지만 RabbitMQ에 처리 완료 응답(ACK)을 보내기 전에 프로세스가 멈추면 같은 이벤트가 다시 전달됩니다.",
                decision:
                    "이벤트 ID를 저장해 재전달돼도 새 작업을 만들지 않았습니다. 처리할 수 없는 메시지는 실패 큐로 분리했습니다.",
                validation:
                    "RabbitMQ와 RELAY를 강제로 중단한 뒤 같은 이벤트가 재전달돼도 수신 이력이 1건인지 Docker Compose 통합 테스트로 확인했습니다.",
                boundary:
                    "메시지 보존과 별도 실패 큐 운영 지점이 늘어 RabbitMQ 모니터링과 재처리 Runbook이 필요합니다.",
            },
            {
                number: "09",
                serviceIds: ["brief"],
                title: "중복 및 역순 BATON 이벤트 차단",
                constraint:
                    "같은 이벤트가 다시 오거나 이전 개정 번호의 이벤트가 늦게 도착하면 운영 점검 항목이 잘못 바뀔 수 있습니다.",
                decision:
                    "이벤트 ID, 해시와 개정 번호를 저장해 중복 및 과거 이벤트를 무시했습니다. 건너뛴 최신 개정은 누락 구간을 기록한 뒤 반영했습니다.",
                validation:
                    "2.0.0-rc.1 실제 Core 실행 JAR과 BRIEF를 로컬 HTTP로 연동했습니다. Caddy HTTPS 앞단은 실제 Core가 아닌 예시 JSON의 인증 및 수신만 확인했습니다.",
                boundary:
                    "2.0.0-rc.2 실제 Core JSON, 실제 Core-Caddy HTTPS와 원격 배포는 미검증입니다.",
            },
            {
                number: "10",
                serviceIds: ["brief"],
                title: "동일 조건의 주간 보고서는 1건만 생성",
                constraint:
                    "DB에 저장한 이벤트로 운영 점검 목록을 다시 만들 때 항목 순서나 결과가 달라지면 이전 주간 보고서를 신뢰하기 어렵습니다.",
                decision:
                    "수신 이벤트 전체로 목록을 다시 만들고 주간, 마지막 이벤트 순번과 항목이 같으면 기존 보고서를 반환했습니다. 생성한 보고서는 수정하지 않습니다.",
                validation:
                    "재생성 전후 목록이 같고 동시 요청에도 보고서 1건만 저장되는지 확인했습니다.",
                boundary:
                    "v1과 v2를 함께 지원하므로 새 항목을 추가할 때 두 JSON과 판정 규칙을 함께 바꿔야 합니다.",
            },
            {
                number: "11",
                serviceIds: ["cal"],
                title: "중복 및 과거 일정 JSON 차단",
                constraint:
                    "네트워크 재시도로 같은 일정 JSON이 다시 오거나 과거 개정 번호가 늦게 도착하면 최신 캘린더가 이전 일정으로 돌아갈 수 있습니다.",
                decision:
                    "이벤트 ID, 일정 ID, 개정 번호와 해시를 비교해 중복 및 과거 일정을 무시했습니다.",
                validation:
                    "동일 내용 재전송, 낮은 개정 번호, 같은 개정 번호의 다른 내용과 트랜잭션 실패 후 재시도를 PostgreSQL 통합 테스트로 확인했습니다.",
                boundary:
                    "BATON과 CAL은 비동기로 연동하므로 일정 반영이 지연될 수 있습니다. 실제 운영 활성화 전에는 자격 증명 회전과 모든 일정의 최신 값을 다시 보내는 순서를 함께 검증해야 합니다.",
            },
            {
                number: "12",
                serviceIds: ["cal"],
                title: "시간대, 취소와 HTTP 캐시를 iCalendar에 반영",
                constraint:
                    "캘린더 앱마다 시간대와 취소 일정 및 캐시 처리 방식이 달라 일정이 중복되거나 변경 내용이 반영되지 않을 수 있습니다.",
                decision:
                    "일정 ID는 UID로 고정하고 개정 번호는 SEQUENCE로 사용했습니다. 일정이 같으면 ETag와 304 응답으로 본문을 생략했습니다.",
                validation:
                    "UTC, 서머타임 전환(DST), 자정 경계, 취소 일정, UTF-8 줄 접기와 변경 없음 응답(304 Not Modified)을 iCalendar 기대값 파일 및 자동화 테스트로 확인했습니다.",
                boundary:
                    "iCal4j 또는 시간대 데이터 버전을 바꾸면 iCalendar 기대값 파일과 캐시 검증값이 함께 바뀌는지 확인해야 합니다.",
            },
            {
                number: "13",
                serviceIds: ["round"],
                title: "이전 WebRTC 연결의 늦은 메시지 차단",
                constraint:
                    "브라우저 연결을 다시 만들거나 네트워크 경로를 다시 찾은 뒤, 이전 연결의 설명(SDP)과 경로 후보(ICE)가 늦게 도착하면 새 연결 상태를 손상시킬 수 있습니다.",
                decision:
                    "연결마다 순번을 부여하고 answer와 ICE에도 같은 값을 넣어 이전 연결의 메시지를 버렸습니다.",
                validation:
                    "연결 중단, ICE 재시작과 피어 재생성 사이에 이전 연결 순번의 answer 및 ICE를 늦게 전달해 현재 연결 시도의 메시지만 반영되는지 WebRTC 연결 모듈 자동화 테스트로 확인했습니다.",
                boundary:
                    "메시지 규격을 함께 배포해야 하며 참가자가 늘면 SFU 구조를 검토해야 합니다.",
            },
            {
                number: "14",
                serviceIds: ["round"],
                title: "Core는 입장 권한, ROUND는 연결 중계 담당",
                constraint:
                    "ROUND가 연결마다 Core를 호출하거나 권한 정보를 복제하면 지연과 데이터 불일치가 생길 수 있습니다.",
                decision:
                    "Core가 스터디 구성원 자격을 확인해 RS256 참여권을 발급합니다. ROUND는 참여권 검증, WebSocket 중계와 TURN 접속 정보만 담당합니다.",
                validation:
                    "잘못된 참여권 차단, 공개 키 교체와 같은 참가자의 이전 세션 종료를 확인했습니다.",
                boundary:
                    "권한 회수는 참여권 만료까지 늦어질 수 있으며 외부 coturn, 실기기 Safari와 6명 장시간 접속은 미검증입니다.",
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
        evidenceTitle: "테스트 범위 및 운영 이력",
        systemTitle: "대표 화면",
        systemNavLabel: "대표 화면",
        screenshots: [
            {
                id: "products",
                src: "happygallery-products.jpg",
                label: "작품 선택",
                caption: "검색과 필터로 작품 선택",
                alt: "happyGallery 작품 목록에서 검색과 필터를 사용해 상품을 선택하는 모습",
                width: 1600,
                height: 1000,
            },
            {
                id: "product-detail",
                src: "happygallery-product-detail.jpg",
                label: "작품 주문",
                caption: "수량, 가격과 제작 조건 확인",
                alt: "happyGallery 작품 상세에서 수량과 가격 및 제작 조건을 확인하는 모습",
                width: 1600,
                height: 1000,
            },
            {
                id: "classes",
                src: "happygallery-classes.jpg",
                label: "클래스 선택",
                caption: "클래스 소개와 예약 수업 선택",
                alt: "happyGallery 클래스 목록 상단에서 수업 선택 안내를 확인하는 모습",
                width: 1600,
                height: 1000,
            },
        ],
        architecture: {
            label: "상품, 주문, 예약 기능의 모듈 분리",
            title: "업무 규칙을 HTTP, DB와 외부 연동 코드에서 분리했습니다.",
            description:
                "실행, API, DB, 외부 연동, 업무 처리와 도메인 규칙을 6개 모듈로 나눴습니다. Gradle과 ArchUnit으로 의존 방향을 검사합니다.",
            tradeoff:
                "모듈 수는 늘지만 잘못된 의존을 빌드에서 찾을 수 있습니다. 일부 JPA 매핑은 도메인 모듈에 유지했습니다.",
        },
        featuredProblemNumbers: ["02", "03", "04", "09"],
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
                note: "운영 모듈 6개와 test-support의 의존 방향 및 외부 연동 인터페이스 범위를 정한 기록",
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
                label: "개인정보 암호화와 전화번호 정확 검색",
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
                scope: "PassCreditUsageUseCaseIT 통합 시나리오 · 2026.08.27 로컬 커밋 b50a9ef0 기준",
            },
            {
                item: "OpenAPI 문서화 범위",
                method: "생성된 OpenAPI JSON 집계",
                rule: "문서화한 API 경로와 작업을 빌드 산출물에서 집계",
                result: "생성된 OpenAPI JSON에서 API 경로 199개와 HTTP 작업 230개를 확인",
                scope: "2026.08.27 로컬 커밋 b50a9ef0 기준",
            },
            {
                item: "백엔드 기능과 API 문서가 변경 후에도 유지되는지 확인",
                method: "Gradle 기본, 정책, Spring REST Docs와 OpenAPI 생성 테스트",
                rule: "도메인 및 통합 테스트, 아키텍처 정책, API 요청 및 응답 문서와 OpenAPI 생성을 작업별로 실행",
                result: "중복을 제외한 1,074개 통과: 기본 테스트 723개, 정책 테스트 120개, REST Docs 230개와 OpenAPI 생성 테스트 1개, 실패, 오류 및 건너뜀 0건",
                scope: "2026.08.27 로컬 커밋 b50a9ef0 기준",
            },
            {
                item: "공개 페이지는 서버 렌더링하고 회원 및 결제 화면은 검색 제외",
                method: "React Router 서버 HTML 및 HTTP 응답 시나리오",
                rule: "공개 상세, 존재하지 않는 경로, 회원 및 결제와 관리자 경로를 각각 요청하고 HTML 본문, 메타데이터, 색인 정책과 HTTP 상태를 확인",
                result: "공개 화면은 메타데이터와 JSON-LD를 포함해 렌더링하고, 비공개 화면은 검색 제외, 없는 주소는 404로 응답",
                scope: "2026.08.27 로컬 커밋 b50a9ef0 기준 · 원격 브랜치와 공개 main 반영 전",
            },
            {
                item: "주문제작 옵션, 가격과 재고 일치",
                method: "서버 가격 계산 및 MySQL 동시 재고 통합 시나리오",
                rule: "같은 SKU가 포함된 여러 주문 항목과 옵션 변경 뒤 결제 및 환불을 실행",
                result: "SKU별 수량을 합산해 ID 순서로 잠그고, 저장한 옵션과 가격으로 결제 당시 주문을 재현",
                scope: "2026.08.27 로컬 커밋 b50a9ef0 기준 · 원격 브랜치와 공개 main 반영 전",
            },
            {
                item: "외부 배송조회 등록 실패 재처리와 서명된 배송 상태 수신",
                method: "주문 배송 통합 테스트, 배송조회 API 변환 및 웹훅 서명 검증 테스트",
                rule: "운송장 등록 뒤 외부 배송조회 등록이 실패한 경우와 정상 및 위조 웹훅, 택배사 배송 완료 후 관리자 주문 완료를 각각 실행",
                result: "외부 등록 실패는 재처리하고 서명된 웹훅만 반영하며, 배송 완료와 주문 완료를 분리",
                scope: "2026.08.27 로컬 커밋 b50a9ef0 기준 · 실제 Delivery API 운영 자격 증명 검증 전",
            },
        ],
        category: "개인 프로젝트",
        role: "요구사항 정리, Spring 백엔드 및 React 화면 구현, 자동화 테스트와 AWS 배포 및 운영 이력",
        oneLine:
            "결제 및 환불 중복과 미전송 알림을 재처리하고, DB 잠금으로 예약 정원과 주문 재고 초과를 막았습니다.",
        status: {
            label: "운영 상태",
            text: "AWS 운영은 상시 비용으로 종료했습니다. 최신 로컬 브랜치에 서버 렌더링, 옵션별 재고, 예약 캘린더, 배송조회, 환불과 소셜 로그인을 구현했으며 main 반영 전입니다.",
        },
        visualCaption: "업무 규칙은 외부 코드에서 분리했지만 일부 JPA 매핑은 도메인에 남겼습니다.",
        problems: [
            {
                number: "01",
                title: "주문 및 예약 규칙을 웹과 DB 코드에서 분리",
                constraint:
                    "웹과 DB 코드가 업무 규칙에 섞여 규칙 변경이 외부 구현 수정으로 번졌습니다.",
                decision:
                    "실행, API, DB, 외부 연동, 업무 처리와 도메인 규칙을 나누고 Gradle과 ArchUnit으로 의존 방향을 검사했습니다.",
                validation:
                    "LayerDependencyPolicyTest와 모듈별 컴파일로 금지한 의존이 빌드 단계에서 실패하는지 확인했습니다.",
                boundary:
                    "domain 모듈의 일부 JPA 의존은 유지했습니다. 현재 규모에서는 JPA를 완전히 분리하는 비용보다 일관된 의존 방향을 우선했습니다.",
            },
            {
                number: "02",
                title: "결제 및 환불 재요청의 중복 처리 방지",
                constraint:
                    "결제사 응답을 잃으면 실패 이력이 사라지거나 같은 요청이 중복 승인 및 환불될 수 있었습니다.",
                decision:
                    "결제사 호출을 DB 트랜잭션 밖으로 분리하고 전후 상태를 독립 트랜잭션으로 저장했습니다. 결과 미확인은 orderId와 환불 UUID로 조회해 복구합니다.",
                validation:
                    "실패 이력 보존, 같은 요청 결과 재사용, 늦은 응답 차단과 환불 복구를 통합 테스트로 확인했습니다.",
                boundary:
                    "상태와 복구 경로가 늘어 운영 조회가 복잡해졌습니다. 실제 Toss Payments의 응답 지연과 장애를 포함한 연동 테스트는 남아 있습니다.",
            },
            {
                number: "03",
                title: "서버 중단 후 미전송 알림 재처리",
                constraint:
                    "주문이나 예약을 커밋한 직후 프로세스가 종료되면 알림 호출 자체가 사라질 수 있습니다.",
                decision:
                    "업무 상태와 알림 작업을 함께 저장하고 미전송 건은 스케줄러가 다시 처리합니다. 작업 서버가 멈추면 만료 후 다른 서버가 이어받습니다.",
                validation:
                    "알림 중복 저장 차단, 서버 중단 후 인계, 실패 재처리와 발송 직전 대상 확인을 통합 테스트했습니다.",
                boundary:
                    "성공 확인 전까지 재시도하므로 외부 업체가 같은 요청 ID의 중복 처리를 막지 않으면 응답 유실 뒤 중복 알림 가능성이 남습니다.",
            },
            {
                number: "04",
                title: "동시 예약 정원과 주문 재고 초과 방지",
                constraint:
                    "클래스마다 예약 정원이 다르고 한 번에 여러 명을 예약할 수 있어, 현재 예약 인원과 새 요청 인원의 합을 잠금 없이 확인하면 정원을 넘길 수 있습니다. 마지막 재고에도 같은 문제가 있었습니다.",
                decision:
                    "예약은 클래스와 예약 시간 행을 잠근 뒤 인원을 확인했습니다. 주문은 상품 또는 SKU 행을 정해진 순서로 잠그고 재고를 차감했습니다.",
                validation:
                    "동시 예약과 주문에서 정원 및 재고를 넘는 요청이 거절되는지 확인했습니다.",
                boundary:
                    "단일 MySQL 기준 설계입니다. 클래스 및 예약 시간 행이나 재고 행에 요청이 집중되면 대기 시간이 늘 수 있어 인기 클래스와 상품 재고를 더 작은 단위로 나누거나 처리 방식을 바꿔야 합니다.",
            },
            {
                number: "05",
                title: "전화번호와 주소 암호화 및 정확 검색",
                constraint:
                    "전화번호와 주소를 평문으로 저장하지 않으면서도 주문 조회와 비회원 이력 찾기를 지원해야 했습니다.",
                decision:
                    "복원이 필요한 값은 AES-GCM으로 암호화하고 정확 검색에는 HMAC 해시를 사용했습니다.",
                validation:
                    "암호화 후 복호화, 잘못된 키 차단, 블라인드 인덱스 검색과 마이그레이션 재실행을 테스트했습니다.",
                boundary:
                    "부분 검색은 지원하지 않으며 키 유실 시 복구할 수 없으므로 암호화 백업과 키 보관 절차가 함께 필요합니다.",
            },
            {
                number: "06",
                title: "AWS 비용 분석과 로컬 k3s 전환 준비",
                constraint:
                    "CloudFront, ALB, ECS, RDS와 Valkey 기반 환경을 실제 가동했지만 트래픽과 무관한 상시 비용이 계속 발생했습니다.",
                decision:
                    "Cost Explorer로 상시 비용을 확인해 AWS 리소스를 종료했습니다. 이후 단일 노트북 k3s 배포와 암호화 백업 절차를 준비했습니다.",
                validation:
                    "AWS 리소스별 비용과 종료 상태를 회고에 남겼습니다. k3s 배포 파일과 배포 및 복구 스크립트의 문법 및 구성 검사 기준과 운영 절차서를 준비했습니다.",
                boundary:
                    "단일 노드는 비용과 통제에는 유리하지만 고가용성을 제공하지 않습니다. 실제 Linux 장비의 DNS, TLS, Secret, PVC, 외부 백업과 복구 훈련은 아직 완료하지 않았습니다.",
            },
            {
                number: "07",
                title: "8회권 환불 시 예약, 크레딧과 원장 일치",
                constraint:
                    "8회권 전체 환불과 예약 사용 및 취소가 동시에 실행되면 환불할 크레딧, 미래 예약과 원장 잔액이 서로 달라질 수 있었습니다.",
                decision:
                    "환불 횟수를 잔여 크레딧과 취소한 미래 예약 수의 합으로 계산했습니다. 이용권과 예약을 순서대로 잠그고 취소, 크레딧 소멸과 원장을 함께 저장했습니다.",
                validation:
                    "미래 예약 2건과 잔여 6회를 합쳐 8회분 환불이 생성되고 동시 예약에도 원장이 일치하는지 확인했습니다.",
                boundary:
                    "결제사 환불 완료 전에도 예약 취소와 크레딧 소멸이 먼저 끝날 수 있습니다. 환불 상태를 DB에 보존하고 자동 복구와 관리자 재처리로 금전 환불을 이어가야 합니다.",
            },
            {
                number: "08",
                title: "공개 화면만 서버 렌더링하고 비공개 화면은 검색 제외",
                constraint:
                    "SPA에서는 공개 본문과 경로별 메타데이터가 없고 없는 경로도 HTTP 200을 반환했습니다.",
                decision:
                    "공개 상품과 클래스는 본문, canonical, Open Graph와 JSON-LD를 포함해 서버 렌더링했습니다. 회원, 결제와 관리자 화면은 브라우저 렌더링과 noindex를 유지했습니다.",
                validation:
                    "공개 HTML에 본문과 경로별 메타데이터가 포함되는지, 없는 상세와 임의 경로가 실제 404인지, 비공개 경로가 검색 제외 지시를 유지하는지 서버 렌더링 및 라우트 시나리오로 확인했습니다.",
                boundary:
                    "프런트엔드가 정적 파일 서버가 아닌 Node 프로세스가 되어 CPU, 메모리와 상태 검사가 필요합니다. 공개 문서 요청도 백엔드 공개 API 가용성에 의존합니다. 현재 구현은 로컬 커밋이며 공개 main 반영 전입니다.",
            },
            {
                number: "09",
                title: "옵션별 가격 및 재고와 결제 당시 주문 보존",
                constraint:
                    "옵션별 가격과 재고가 다르고, 옵션 변경 뒤에도 결제 당시 주문 조건을 재현해야 했습니다.",
                decision:
                    "선택 조합마다 SKU를 만들고 서버가 가격과 수량을 다시 계산했습니다. 주문에는 결제 당시 옵션, 추가 금액과 SKU를 저장했습니다.",
                validation:
                    "잘못된 옵션과 동시 재고 차감을 막고, 옵션 변경 뒤에도 기존 주문의 가격, 환불과 재고 복구가 유지되는지 확인했습니다.",
                boundary:
                    "SKU 조합은 500개로 제한했으며 관리자가 가격과 재고를 직접 관리해야 합니다. 현재 구현은 공개 main 반영 전입니다.",
            },
            {
                number: "10",
                title: "운영시간과 휴일 규칙으로 예약 회차 자동 생성",
                constraint:
                    "예약 시간을 매번 만들면 반복 입력이 늘지만, 시간 행을 없애면 예약 참조와 동시성 제어가 어려웠습니다.",
                decision:
                    "운영시간, 휴무와 차단 규칙을 저장하고 조회할 때 예약 시간을 자동 생성했습니다. 기존 예약과 비활성 시간은 유지했습니다.",
                validation:
                    "운영시간, 휴일, 차단 시간과 동시 예약 조건에서 슬롯이 중복 생성되지 않는지 통합 테스트로 확인했습니다.",
                boundary:
                    "조회가 몰리면 클래스 행 잠금 대기를 관찰해야 합니다. 해당 구현은 로컬 커밋 b50a9ef0 기준으로 원격 반영 전입니다.",
            },
            {
                number: "11",
                title: "배송조회 재처리와 주문 완료 분리",
                constraint:
                    "배송조회 등록 실패는 고객 조회를 막고, 웹훅만으로 주문을 완료하면 후속 처리가 너무 일찍 실행될 수 있었습니다.",
                decision:
                    "배송조회 등록 실패는 DB 상태를 기준으로 배치가 재처리합니다. 서명을 검증한 웹훅은 배송 상태만 갱신하고 주문 완료는 관리자가 확정합니다.",
                validation:
                    "배송 전 과정을 통합 테스트하고 서명된 웹훅만 반영하며 주문 완료는 관리자 확인 전까지 유지되는지 검증했습니다.",
                boundary:
                    "Delivery API 한 곳만 지원하며 운영 자격 증명, 장시간 장애와 웹훅 재전달은 미검증입니다.",
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
            "Google / Naver / Kakao OAuth",
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
        evidenceTitle: "구현 및 자동화 테스트",
        systemTitle: "커밋 검토 처리 흐름",
        systemNavLabel: "처리 흐름",
        architecture: {
            label: "검토 범위",
            title: "선택한 커밋과 확정한 비교 기준 사이의 변경만 검토합니다.",
            description:
                "일반 커밋은 첫 부모, 최초 커밋은 빈 상태, 병합 커밋은 사용자가 고른 부모를 비교 기준으로 확정합니다. 작업 파일이 바뀌어도 선택한 커밋과 비교 기준에 저장된 코드만 사용합니다.",
            tradeoff:
                "결과는 재현할 수 있지만 대상 커밋이 로컬에 있어야 합니다. CI, 이슈와 토론은 자동으로 가져오지 않습니다.",
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
        documentsIntro:
            "Commit Diff 실행 기준, 비공개 데이터 차단 정책과 원본 프로젝트 고지를 공개합니다.",
        documents: [
            {
                type: "README",
                label: "Hope Commit 한국어 소개",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/README.ko.md",
                note: "Commit Diff의 목적, 동작 범위와 설치 방법",
            },
            {
                type: "실행 절차",
                label: "Commit Diff 실행 절차",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/plugins/hope-commit/skills/commit-diff/SKILL.md",
                note: "입력 가능한 커밋, 비교 대상, 코드 수집, 결과 검증과 HTML 저장 조건",
            },
            {
                type: "Security",
                label: "보안 정책",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/SECURITY.md",
                note: "비공개 설정 경로와 토큰 및 인증 키로 판단되는 문자열을 분석 입력과 HTML에서 제외하는 기준",
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
                item: "선택한 커밋과 비교 기준 확정",
                method: "테스트용 Git 저장소를 사용한 Commit Diff 코드 수집 테스트",
                rule: "짧은 커밋 ID, 일반 커밋의 첫 번째 부모, 최초 커밋의 빈 상태와 병합 커밋에서 사용자가 고른 부모를 각각 확정해 저장된 변경 파일을 수집",
                result: "수집기는 커밋 ID와 비교 기준을 고정했습니다. textconv 및 색상을 꺼도 이름 변경과 줄 수를 유지했고, UTF-8이 아닌 경로는 거절했습니다.",
                scope: "2026.08.27 원격 개발 브랜치 4.0.0 커밋 d6203de의 commit-collector.test.mjs 기준 · 공개 main 반영 전",
            },
            {
                item: "비공개 파일과 토큰 제외 및 리뷰 근거 검증",
                method: "비공개 경로, 토큰 형태와 변경 파일 및 줄 위치 검증 테스트",
                rule: "분석 과정에서 추가로 요청한 파일도 본문을 읽기 전에 비공개 경로인지 검사. 변경 파일에서 발견한 토큰 및 인증 키 형태의 값은 분석 입력과 HTML에서 제외",
                result: "검증기는 비공개 경로와 자격 증명을 제외하고, 수집하지 않은 파일과 줄을 가리킨 리뷰를 거절했습니다.",
                scope: "2026.08.27 원격 개발 브랜치 4.0.0에서 보완한 비공개 경로 및 토큰 차단 규칙 기준 · 공개 main 반영 전",
            },
            {
                item: "검증이 끝난 결과만 새 HTML로 저장",
                method: "커밋 선택부터 HTML 저장까지 전체 처리 테스트",
                rule: "입력 커밋과 비교 기준을 확정하고 리뷰 설명의 파일, 줄과 JSON 형식을 확인한 뒤, 저장 직전에 실행 식별자와 검토 버전이 처음 확인한 값과 같은지 다시 확인한 경우에만 새 HTML 파일 생성",
                result: "저장기는 중단 후 빈 파일을 남기지 않고 재개했으며, 다른 실행의 디렉터리와 기존 결과를 유지했습니다.",
                scope: "2026.08.27 원격 개발 브랜치 4.0.0 커밋 d6203de의 commit-lifecycle.test.mjs 기준 · 공개 main 반영 전",
            },
            {
                item: "저장소 자동화 테스트",
                method: "Node.js 내장 테스트 러너로 npm test 실행",
                rule: "Commit Diff와 원본 Hope의 코드 수집, 결과 검증, HTML 생성 및 플러그인 설치 기능이 유지되는지 자동화 테스트 실행",
                result: "공개 main 3.1.1은 245개, 원격 개발 브랜치 4.0.0 커밋 d6203de는 277개 통과, 실패 및 건너뜀 0개",
                scope: "2026.08.27 공개 main과 원격 개발 브랜치 npm test 결과를 분리해 집계",
            },
        ],
        category: "오픈소스 및 개발 도구",
        role: "SeungIl 님의 Hope 3.0.3 포크에 로컬 커밋 비교, HTML 리뷰 및 자동화 테스트 추가",
        oneLine:
            "선택한 커밋과 확정한 비교 기준 사이의 변경만 검토하고, 파일과 줄 근거를 확인한 결과를 새 HTML로 저장합니다.",
        status: {
            label: "공개 상태",
            text: "SeungIl 님이 개발한 Hope 3.0.3을 포크했습니다. 제가 추가한 Commit Diff는 README와 NOTICE에 구분했습니다. 공개 main은 3.1.1이며 4.0.0 보완은 미반영입니다.",
        },
        visualCaption: "커밋 확정 → 변경 수집 → 줄 근거 검증 → HTML 저장 순서입니다.",
        problems: [
            {
                number: "01",
                title: "선택한 커밋과 확정한 비교 기준 사이의 변경만 검토",
                constraint:
                    "스테이징한 파일, 수정 중인 파일과 추적하지 않는 파일을 함께 읽으면 특정 커밋에 없던 내용이 검토 결과에 섞일 수 있습니다.",
                decision:
                    "커밋 종류에 맞는 비교 기준을 확정하고 선택한 커밋과 비교 기준에 저장된 코드만 읽습니다. 4.0.0에서는 textconv와 색상 출력을 끄고 UTF-8이 아닌 경로를 거절합니다.",
                validation:
                    "짧은 ID, 최초 및 병합 커밋, 파일 이름 변경과 안전한 Git 설정을 테스트했습니다.",
                boundary:
                    "로컬 저장소에 존재하는 한 커밋만 검토합니다. 원격 CI 결과, 이슈와 토론 내용은 자동으로 수집하지 않습니다.",
            },
            {
                number: "02",
                title: "대용량 변경과 자격 증명 제외",
                constraint:
                    "대용량 변경은 검토 범위를 흐리고, 자격 증명이 분석과 HTML에 노출될 수 있습니다.",
                decision:
                    "파일 수, 줄 수와 본문 크기에 상한을 두고 비공개 경로와 자격 증명은 분석 및 HTML에서 제외합니다.",
                validation:
                    "npm, PyPI 및 네트워크 자격 증명 경로와 토큰 형태, 파일 크기와 추가 코드 조회 상한의 바로 아래 및 위 값을 테스트했습니다.",
                boundary:
                    "제외한 파일의 구현 내용은 분석하지 않습니다. 필요한 근거가 제한 범위 밖에 있으면 결과에 확인하지 못한 범위로 표시합니다.",
            },
            {
                number: "03",
                title: "리뷰의 파일과 줄 근거 검증",
                constraint:
                    "분석 모델이 이전 대화나 추측을 섞으면 실제 변경 코드가 뒷받침하지 않는 설명과 지적이 생성될 수 있습니다.",
                decision:
                    "리뷰 설명은 독립된 분석에서 받고, 각 설명을 실제 변경 파일과 줄에 연결해 JSON Schema와 수집 범위로 검증합니다.",
                validation:
                    "수집하지 않은 파일 및 줄, 잘못된 범위와 형식, 과도하게 긴 설명을 거절하는지 테스트했습니다.",
                boundary:
                    "리뷰 설명을 독립된 분석에서 받을 수 없으면 검토를 중단합니다. 코드 줄 연결 여부는 확인할 수 있지만 리뷰 판단이 반드시 옳다는 뜻은 아니므로 사용자가 최종 확인해야 합니다.",
            },
            {
                number: "04",
                title: "검증 결과만 저장하고 중단된 작업 재개",
                constraint:
                    "상태 저장 중 중단되면 빈 파일이 남거나 수집을 다시 해야 합니다. 동시 실행은 기존 결과를 덮어쓸 수 있습니다.",
                decision:
                    "상태는 임시 파일에 저장한 뒤 교체하고 중단된 실행은 수집 지점부터 재개합니다. 저장 직전에는 실행 식별자와 검토 버전이 처음 확인한 값과 같은지 다시 확인합니다.",
                validation:
                    "상태 기록 단계별 중단 및 재개, 검증 전후 대상 변경과 잠금 소유권 상실을 재현했습니다. 기존 출력 경로, 심볼릭 링크와 동시 저장에서도 다른 실행의 작업 디렉터리와 기존 HTML이 바뀌지 않는지 확인했습니다.",
                boundary:
                    "HTML은 로컬 파일로만 생성합니다. 원격 저장소 게시, 브랜치 생성, 푸시와 리뷰 댓글 작성은 수행하지 않습니다.",
            },
        ],
        stack: [
            "JavaScript",
            "Node.js 22 / 26",
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
            "SeungIl 님이 개발한 Hope 3.0.3을 개인 커밋 검토 용도에 맞게 보완한 비공식 포크입니다. 원본 개발자는 이 포크를 보증하거나 유지보수하지 않습니다.",
    },
    {
        ...projectSummariesById.warrant,
        evidenceTitle: "주요 구현 및 확인 결과",
        proofs: [
            {
                item: "해양경찰 KICS 독립망 연계",
                method: "기관별 자료 변환과 Spring Batch 단계별 확인",
                rule: "KICS의 통신사실확인자료 요청과 통신사 및 집행포털 연계에서 받은 제출 자료를 기관별 연계 형식에 맞춰 변환하고 단계별 처리 상태를 확인",
                result: "KICS 요청을 기관별 규격으로 바꿔 통신사와 집행포털에 전달했습니다. 제출 자료가 KICS에 반영되는 단계별 상태도 확인했습니다.",
                scope: "보안상 운영 수치와 테스트 코드는 비공개",
            },
            {
                item: "누적 전송 상태 조회",
                method: "조회 쿼리 및 화면 이동 시나리오 확인",
                rule: "신규 화면은 마지막으로 본 전송 ID 다음부터 조회하고, 기존 번호 이동 화면은 인덱스에서 대상 키를 먼저 찾은 뒤 본문을 조회",
                result: "신규 화면은 마지막 전송 ID 다음 자료부터 조회했고, 기존 화면은 번호 이동을 유지하며 대상 키를 먼저 찾은 뒤 본문을 조회했습니다.",
                scope: "구체적인 데이터 건수와 응답 시간은 비공개",
            },
            {
                item: "PDF 변환 요청 상태 저장 전 도착한 완료 응답 처리",
                method: "PDF 변환 요청 상태 저장과 변환 완료 응답의 순서를 바꾼 시나리오 확인",
                rule: "PDF 변환 완료 응답이 요청 상태의 DB 저장보다 먼저 도착하도록 실행",
                result: "요청 상태를 간격을 늘려 재조회해 먼저 도착한 PDF 완료 결과를 반영했습니다.",
                scope: "보안상 운영 수치와 테스트 코드는 비공개",
            },
        ],
        category: "BEINTECH / LG CNS 컨소시엄 공공 SI",
        role: "KICS 요청과 제출 자료를 통신사 및 집행포털 규격으로 변환하는 서버와 Spring Batch 구현",
        oneLine:
            "KICS 요청을 통신사와 집행포털 규격으로 변환해 보내고, 제출 자료를 KICS에 반영했습니다.",
        status: {
            label: "공개 범위",
            text: "BEINTECH 소속으로 LG CNS 컨소시엄에 참여 중입니다. 담당 연계 구조와 역할만 공개하며 접속 주소, 설정, 소스와 내부 문서는 제외했습니다.",
        },
        systemTitle: "독립망 간 업무 흐름 및 시스템 구성",
        systemNavLabel: "업무 흐름",
        visualCaption: "KICS 요청과 기관 제출 자료가 독립망 사이를 오가는 흐름입니다.",
        architecture: {
            label: "기관별 변환 분리와 DB 연결 반환",
            title: "기관별 변환은 분리하고 외부 API 대기 중에는 DB 연결을 반환했습니다.",
            description:
                "조회, 상태 및 오류 처리만 공통으로 사용하고 외부 API 호출 전후의 DB 저장을 별도 트랜잭션으로 실행했습니다.",
            tradeoff:
                "후속 기능의 중복 코드는 줄었지만 초기 구현은 느려졌습니다. 다중 서버에서는 분산 잠금이 필요합니다.",
        },
        problems: [
            {
                number: "01",
                title: "대용량 이력 조회 비용을 줄이며 페이지 이동 유지",
                constraint:
                    "전송 상태와 수신 자료가 계속 쌓이면 OFFSET이 커질수록 뒤쪽 페이지 조회 비용이 증가합니다. 기존 업무 화면은 번호 이동도 유지해야 했습니다.",
                decision:
                    "신규 화면은 마지막 전송 ID 다음부터 조회했습니다. 기존 번호 이동 화면은 대상 키를 먼저 찾은 뒤 본문을 조회했습니다.",
                validation:
                    "신규 화면은 마지막 조회 키 다음 데이터부터 이어지는지 확인했습니다. 기존 화면은 페이지 번호 이동과 목록 결과를 유지하면서 키를 먼저 찾고 본문을 나중에 조회하는 SQL이 적용되는지 확인했습니다.",
                boundary:
                    "마지막 전송 ID 다음부터 조회하는 방식은 임의 페이지 이동이 어렵고, 키와 본문 조회를 나누면 SQL이 복잡해집니다. 조회량이 적은 화면은 단순한 쿼리의 유지보수성을 우선했습니다.",
            },
            {
                number: "02",
                title: "공통 처리와 기관별 변환 코드 분리",
                constraint:
                    "수신 자료와 통신사실확인자료의 화면, 인터페이스와 Spring Batch 흐름이 비슷해 기능마다 같은 분기와 변환 코드를 만들 가능성이 컸습니다.",
                decision:
                    "공통 처리 흐름은 공통 메서드와 상태값으로 묶고 조회, 변환과 전송은 역할별 클래스로 나눴습니다. 기관별로 다른 데이터 형식과 처리 규칙은 별도 구현으로 분리했습니다.",
                validation:
                    "후속 수신 자료 기능에서 공통 메서드, 상태값과 오류 코드를 재사용하고 기관별 조회, 변환 및 전송 코드만 추가한 것을 구현 코드로 확인했습니다.",
                boundary:
                    "공통 구조를 설계하는 동안 첫 기능의 개발 속도는 느려졌습니다. 동작이 다른 기관별 규칙은 분리해 과도한 공통화를 피했습니다.",
            },
            {
                number: "03",
                title: "PDF 완료 응답이 먼저 도착한 경우 재처리",
                constraint:
                    "외부 PDF 변환을 요청한 뒤 애플리케이션이 요청 상태를 DB에 저장하기 전에 완료 응답이 도착하면, 대상 요청을 찾지 못해 정상 변환 결과가 누락될 수 있었습니다.",
                decision:
                    "Spring Retry로 상태를 다시 조회하고 재시도 간격 증가와 무작위 지연으로 동시 요청을 분산했습니다.",
                validation:
                    "PDF 변환 완료 응답이 요청 상태의 DB 저장보다 먼저 도착하는 경우에도 상태를 다시 조회한 뒤 완료 결과가 반영되는 것을 확인했습니다.",
                boundary:
                    "재시도는 정해진 횟수 안에서만 수행합니다. 계속 조회되지 않는 요청은 실패 상태로 기록하고 운영자 확인 절차로 넘겨야 합니다.",
            },
            {
                number: "04",
                title: "외부 API 대기 중 DB 연결 반환과 중복 실행 방지",
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
                method: "기관별 배치 실행 결과, 업무 서버 로그와 Tibero 처리 상태 확인",
                rule: "군사법원, 군검찰 및 군사경찰에서 받은 수용 대상자의 인적정보와 영장정보를 수신하고 필수값과 형식을 검증한 뒤 군교정 DB에 반영",
                result: "Jenkins 실행 이력과 업무 서버 및 DB 상태를 대조해 중단 단계를 찾고, 해당 기관 자료의 재처리와 군교정 DB 반영까지 확인",
                scope: "운영 건수, 내부 데이터와 세부 연계 규격은 비공개",
            },
            {
                item: "WebSquare 상태 변경 요청의 위조 방지 토큰(CSRF) 확인",
                method: "정상 토큰, 토큰 누락 및 불일치 요청을 각각 실행",
                rule: "Spring Security가 생성한 CSRF 토큰의 이름과 값을 WebSquare 화면 데이터 규격으로 전달하고 공통 요청 로직에서 상태 변경 요청마다 포함",
                result: "정상 요청은 처리하고 토큰이 없거나 일치하지 않는 요청은 Spring Security 필터에서 차단되는 것을 확인",
                scope: "폐쇄망 환경에서 확인",
            },
            {
                item: "대용량 파일 직접 업로드",
                method: "허용 및 차단 요청의 URL 발급 여부와 파일 본문 전송 경로 확인",
                rule: "업무 서버가 업로드 권한과 파일 정보를 검증한 뒤 Presigned URL을 발급하고, 브라우저가 기존 파일 저장 시스템으로 직접 업로드",
                result: "검증을 통과한 요청에만 URL을 발급하고, 파일 본문이 업무 서버를 거치지 않고 저장소로 직접 전송되는 것을 확인",
                scope: "폐쇄망 환경에서 확인",
            },
        ],
        category: "BEINTECH / 국방부 SI",
        role: "군교정 업무 화면 개발, 기관별 수용자 정보 연계 배치와 Jenkins, JEUS 및 Tibero를 이용한 장애 분석",
        oneLine:
            "군사법원, 군검찰과 군사경찰의 수용자 자료를 군교정 DB에 반영하고, CSRF 차단과 대용량 파일 직접 업로드를 구현했습니다.",
        status: {
            label: "공개 범위",
            text: "BEINTECH에서 수행한 국방부 SI입니다. 운영 데이터와 세부 연계 규격은 제외하고 담당 개발 및 운영 업무만 공개했습니다.",
        },
        visualCaption:
            "세 기관의 수용자 인적정보와 영장정보를 수신 → 검증 → 군교정 DB 반영하는 순서입니다.",
        problems: [
            {
                number: "01",
                title: "세 기관의 수용자 및 영장정보 연계 배치",
                constraint:
                    "군사법원, 군검찰 및 군사경찰마다 수용 대상자의 인적정보와 영장정보 형식 및 전달 시점이 달랐고, 연계가 중단되면 수용과 후속 군교정 업무를 처리할 수 없었습니다.",
                decision:
                    "세 기관의 인적정보와 영장정보를 검증해 군교정 DB에 반영했습니다. Jenkins에서 실패 단계를 확인해 필요한 배치만 재처리했습니다.",
                validation:
                    "기관별 자료 수신 여부와 Jenkins 실행 결과, 업무 서버 로그 및 Tibero 처리 상태를 대조해 중단 단계를 찾고, 재처리 후 인적정보와 영장정보가 군교정 DB에 반영되는 것까지 확인했습니다.",
                boundary:
                    "외부 모니터링 도구를 자유롭게 설치할 수 없어 일부 확인은 수동 절차와 기관 담당자 협업이 필요했습니다.",
            },
            {
                number: "02",
                title: "WebSquare 상태 변경 요청에 CSRF 토큰 적용",
                constraint:
                    "사용자가 열어 둔 WebSquare 업무 화면을 악용한 위조 요청이 저장 및 변경 기능을 실행하지 못하도록 Spring Security의 위조 방지 토큰(CSRF)을 모든 상태 변경 요청에 포함해야 했습니다.",
                decision:
                    "CSRF 토큰을 WebSquare 공통 요청에 포함하고 누락되거나 일치하지 않는 요청은 필터에서 차단했습니다.",
                validation:
                    "정상 토큰, 토큰 누락과 불일치 요청을 각각 실행해 정상 요청만 처리되고 나머지는 필터에서 차단되는 것을 확인했습니다.",
                boundary:
                    "WebSquare의 모든 공통 요청 경로에서 토큰 이름과 값을 같은 방식으로 전달해야 하므로, 새 상태 변경 요청을 추가할 때 공통 로직 적용 여부를 확인해야 합니다.",
            },
            {
                number: "03",
                title: "대용량 파일을 저장소로 직접 업로드",
                constraint:
                    "대용량 파일 본문이 업무 서버를 거치면 요청마다 메모리와 디스크 및 네트워크 입출력을 사용하고, 동시에 업로드할 때 서버 부하가 커질 수 있었습니다. 기존 파일 저장 시스템은 유지해야 했습니다.",
                decision:
                    "업로드 권한과 파일 정보를 검증한 뒤 Presigned URL을 발급해 브라우저가 저장소로 직접 전송하게 했습니다.",
                validation:
                    "허용 및 차단 요청의 Presigned URL 발급 여부를 확인하고, 허용된 파일 본문이 업무 서버를 거치지 않고 기존 파일 저장 시스템으로 직접 전송되는 경로를 확인했습니다.",
                boundary:
                    "Presigned URL의 만료 시간과 업로드 조건, 업로드 완료 상태를 별도로 관리해야 합니다. 브라우저와 파일 저장소 사이에서 실패한 업로드를 다시 확인하는 절차도 필요합니다.",
            },
            {
                number: "04",
                title: "Jenkins, JEUS와 Tibero로 배치 중단 단계 확인",
                constraint:
                    "통합 모니터링이 없는 폐쇄망에서 화면 오류만으로는 장애 단계를 찾기 어려웠습니다.",
                decision:
                    "Jenkins에서 실패 시각과 단계를 확인하고 같은 시각의 JEUS 로그와 Tibero 상태를 대조했습니다. 필요할 때는 기관 송수신 시각도 확인했습니다.",
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
                item: "WebRTC 실시간 재생과 RTP 출력의 HLS 다시보기 변환",
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
        role: "mediasoup RTP 출력의 HLS 변환 서버와 WebRTC 실시간 및 HLS 다시보기 React 화면 구현",
        oneLine:
            "현재 강의는 mediasoup와 WebRTC로 실시간 재생하고, mediasoup의 RTP 출력은 FFmpeg와 GStreamer를 이용해 HLS로 변환해 지난 구간 다시보기에 사용했습니다.",
        status: {
            label: "프로젝트 상태",
            text: "2023년 교육 팀 프로젝트로 개발과 시연을 완료했습니다. 현재 운영하지 않으며 구현은 공개 저장소에서 확인할 수 있습니다.",
        },
        visualCaption: "실시간은 WebRTC, 지난 구간은 RTP를 HLS로 변환해 재생합니다.",
        problems: [
            {
                number: "01",
                title: "WebRTC 실시간 재생과 HLS 지난 구간 다시보기",
                constraint:
                    "현재 강의는 낮은 지연으로 재생하면서 수강자가 놓친 구간은 이전 시점으로 돌아가 볼 수 있어야 했습니다. WebRTC 실시간 경로와 저장 가능한 HLS 다시보기 경로를 별도로 구성해야 했습니다.",
                decision:
                    "현재 영상은 mediasoup와 WebRTC로 재생했습니다. mediasoup의 RTP 출력은 FFmpeg와 GStreamer를 이용해 HLS로 변환하고 지난 구간 다시보기에 사용했습니다.",
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
                    "시연 환경에서 측정한 결과이며 통제된 벤치마크는 아닙니다. 추가 단축에는 저지연 HLS와 버퍼 검증이 필요합니다.",
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

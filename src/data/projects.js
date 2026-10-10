import { projectSummaries, projectSummariesById, youthPolicyCoverage } from "./projectSummaries"
import { warrantPerformance, warrantPerformanceSummary } from "./warrantEvidence"

const projects = [
    {
        ...projectSummariesById.baton,
        systemTitle: "대표 화면과 서비스 구성",
        systemNavLabel: "화면 및 서비스",
        screenshotNote:
            "2026년 10월 7일 Core 공개 main 7ffbd74a 화면을 E2E 테스트용 모의 API 응답으로 촬영했습니다.",
        screenshots: [
            projectSummariesById.baton.coverScreenshot,
            {
                id: "my-teams",
                src: "baton-core-my-teams.webp",
                label: "여러 팀의 내 할 일",
                caption: "참여한 팀 목록, 여러 팀에 걸친 내 업무와 수락할 인수인계",
                alt: "BATON 내 팀 화면에서 참여한 두 팀과 모든 팀의 내 할 일을 확인하는 모습",
                width: 1440,
                height: 960,
            },
            {
                id: "continuity",
                src: "baton-core-continuity.webp",
                label: "담당자 공백과 업무 지연",
                caption: "팀 전체의 이번 회차 업무, 담당자가 없는 역할과 지연된 반복 업무",
                alt: "BATON 할 일 화면의 팀 전체 보기에서 담당자 공백과 반복 업무 지연 항목을 확인하는 모습",
                width: 1440,
                height: 960,
            },
            {
                id: "search",
                src: "baton-core-search.webp",
                label: "기록 검색",
                caption: "결정, 인수인계 항목과 역할 자료 검색",
                alt: "BATON 기록 메뉴의 검색에서 결정, 인수인계 항목, 역할 자료를 찾은 모습",
                width: 1440,
                height: 960,
            },
            {
                id: "batonbook",
                src: "baton-core-batonbook.webp",
                label: "인수인계 문서(바통북)",
                caption: "역할 책임, 반복 업무와 주요 결정을 한 문서로 정리",
                alt: "BATON 인수인계 문서 미리보기에서 담당 업무, 반복 업무, 주요 결정을 확인하는 모습",
                width: 1440,
                height: 960,
            },
        ],
        architecture: {
            label: "서비스 구성과 담당 업무",
            title: "역할, 반복 업무, 인수인계 문서는 Core에 저장하고, 6개 기능은 독립 서비스로 분리했습니다.",
            description:
                "각 서비스는 독립 배포하고 DB를 공유하지 않습니다. ROUND의 방 상태는 메모리에 저장합니다.",
            tradeoff: "서비스별로 배포 상태를 확인하고 미전송 이벤트를 재처리해야 합니다.",
        },
        featuredProblemNumbers: ["02", "03", "05", "07"],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "54",
            },
            {
                id: "adr",
                label: "ADR",
                count: "94",
            },
            {
                id: "runbook",
                label: "Runbook 및 운영 문서",
                count: "41",
            },
            {
                id: "api",
                label: "API 및 서비스 간 데이터 형식",
                count: "4개 서비스",
            },
        ],
        documents: [
            {
                serviceId: "core",
                type: "ADR 요약",
                label: "Core 업무 규칙을 HTTP와 DB 코드에서 분리",
                href: "/docs/baton/core-hexagonal.md",
                note: "업무 규칙을 HTTP와 DB 코드에서 분리한 이유와 현재 제약 요약",
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
                label: "BRIEF 점검 상태 반영과 발행 보고서 수정 방지",
                href: "/docs/baton/brief-event-projection.md",
                note: "Core의 담당자 공백 및 업무 지연 등 5개 상태를 미해결(ACTIVE) 또는 해결됨(RESOLVED)으로 반영하고, 발행한 주간 보고서는 수정하지 않는 방식",
            },
            {
                serviceId: "brief",
                type: "ADR",
                label: "BRIEF 사용자 권한과 보고서 생성 책임 분리",
                href: "https://github.com/ljkhyeong/baton-brief/blob/main/docs/ADR/0006_baton-brief-application-boundary/adr.md",
                note: "Core가 사용자 권한을 확인하고, BRIEF가 보고서 생성과 중복 생성 방지를 담당하는 설계 원문",
            },
            {
                serviceId: "brief",
                type: "PRD",
                label: "BRIEF 주간별 최신 보고서 조회",
                href: "https://github.com/ljkhyeong/baton-brief/blob/main/docs/PRD/0009_weekly-latest-edition/spec.md",
                note: "작업공간, 시즌, 주간, 시간대가 일치하는 저장 보고서 중 가장 최근 보고서를 조회하는 내부 API 계약",
            },
            {
                serviceId: "cal",
                type: "PRD / ADR 요약",
                label: "CAL 일정 JSON 수신과 캘린더 구독",
                href: "/docs/baton/cal-calendar-contract.md",
                note: "일정 버전 번호, iCalendar 변환, 구독 주소 토큰의 교체와 폐기 방식",
            },
            {
                serviceId: "round",
                type: "ADR / 아키텍처 요약",
                label: "ROUND 입장 토큰 검증과 WebRTC 연결 복구",
                href: "/docs/baton/round-realtime-boundary.md",
                note: "Core가 발급한 입장 토큰 검증, 지연된 WebRTC 메시지 차단, 메모리에 저장하는 방과 참가자 상태",
            },
        ],
        services: [
            {
                id: "core",
                name: "Core",
                kind: "CORE APPLICATION",
                route: "/projects/baton",
                role: "역할, 반복 업무, 인수인계 문서 기록",
                summary:
                    "역할, 반복 업무, 인수인계 문서를 기록하고, 여러 팀의 내 할 일과 확인 기한이 된 자료를 모아 보여 줍니다.",
                detail: "여러 팀과 진행 중인 시즌의 내 업무, 재확인할 자료, 시즌 간 기록 검색, 초안 복원과 인수인계 문서",
                evidence:
                    "인수인계 상태 전이와 역할별 진행 중 1건 제약을 테스트했습니다. BRIEF, CAL, ROUND와의 교차 서비스 테스트는 로컬에서 확인했습니다.",
                input: "조직과 역할 등록, 인수인계 상태 변경, ROUND 참여 요청",
                inputRule:
                    "조직 요청은 공유 키와 소속을 확인하고, 입장 토큰 발급은 활동 중인 스터디 구성원인지 추가로 확인합니다.",
                output: "팀, 시즌, 역할, 반복 업무, 인수인계 데이터와 ROUND 입장 토큰",
                recoveryBoundary:
                    "인수인계 수락과 역할 담당자, 담당 기간 변경을 한 DB 트랜잭션에서 처리합니다.",
                database: "MySQL",
                primary: true,
                screenshotNote:
                    "2026년 10월 7일 Core 공개 main 7ffbd74a 화면을 E2E 테스트용 모의 API 응답으로 촬영했습니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton",
                    label: "CORE 공개 저장소",
                    note: "구현 코드, 설계 문서와 테스트",
                },
                visibility: "공개 저장소",
                status: "공개 main 7ffbd74a에서 화면을 상단 메뉴 4개(할 일, 역할, 일정, 기록)로 다시 구성했습니다. 로그인한 구성원에게는 내 할 일과 도착한 인수인계를 먼저 보여 줍니다. Core와 BRIEF, CAL, ROUND의 연동은 로컬 검증 기록 기준이며 공개 환경 전체 연결은 미검증입니다.",
                screenshots: [
                    projectSummariesById.baton.coverScreenshot,
                    {
                        id: "my-teams",
                        src: "baton-core-my-teams.webp",
                        label: "여러 팀의 내 할 일",
                        caption: "참여한 팀 목록, 여러 팀에 걸친 내 업무와 수락할 인수인계",
                        alt: "BATON 내 팀 화면에서 참여한 두 팀과 모든 팀의 내 할 일을 확인하는 모습",
                        width: 1440,
                        height: 960,
                    },
                    {
                        id: "continuity",
                        src: "baton-core-continuity.webp",
                        label: "담당자 공백과 업무 지연",
                        caption: "팀 전체의 이번 회차 업무, 담당자가 없는 역할과 지연된 반복 업무",
                        alt: "BATON 할 일 화면의 팀 전체 보기에서 담당자 공백과 반복 업무 지연 항목을 확인하는 모습",
                        width: 1440,
                        height: 960,
                    },
                    {
                        id: "search",
                        src: "baton-core-search.webp",
                        label: "기록 검색",
                        caption: "결정, 인수인계 항목과 역할 자료 검색",
                        alt: "BATON 기록 메뉴의 검색에서 결정, 인수인계 항목, 역할 자료를 찾은 모습",
                        width: 1440,
                        height: 960,
                    },
                    {
                        id: "batonbook",
                        src: "baton-core-batonbook.webp",
                        label: "인수인계 문서(바통북)",
                        caption: "역할 책임, 반복 업무와 주요 결정을 한 문서로 정리",
                        alt: "BATON 인수인계 문서 미리보기에서 담당 업무, 반복 업무, 주요 결정을 확인하는 모습",
                        width: 1440,
                        height: 960,
                    },
                ],
                documentation: [
                    {
                        label: "PRD",
                        count: "11",
                    },
                    {
                        label: "ADR",
                        count: "25",
                    },
                    {
                        label: "OpenAPI",
                        count: "1",
                    },
                ],
            },
            {
                id: "go",
                name: "GO",
                kind: "MICROSERVICE",
                route: "/projects/baton/go",
                role: "BATON 및 ROUND 짧은 링크",
                summary:
                    "BATON과 ROUND의 허용된 경로에 짧은 링크를 발급합니다. 실제 접근 권한은 대상 서비스가 확인합니다.",
                contribution:
                    "링크 생성, 조회, 폐기와 리다이렉트를 구현했습니다. 멱등 키(UUID)로 중복 생성을 막고 관리 JWT를 검사하며, 최대 100개 링크 ID를 한 번에 조회하는 관리 API를 추가했습니다.",
                stack: [
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring JDBC",
                    "MySQL 8.4",
                    "Flyway",
                    "Kubernetes / Kustomize",
                    "Testcontainers",
                ],
                detail: "UUID와 요청 조건으로 중복 생성을 막고, Redis 요청률 제한, HMAC 키 교체, 만료 링크 정리와 관리용 일괄 조회를 제공합니다.",
                evidence:
                    "같은 요청 8건을 동시에 보내도 링크가 1건만 저장되는지, HMAC 키가 맞지 않으면 서버가 시작되지 않는지 검증했습니다.",
                input: "허용된 BATON 또는 ROUND 대상, 사용 목적, 활성 시각과 만료 시각, UUID",
                inputRule:
                    "대상 시스템, 경로, 사용 목적, 활성 시각과 만료 시각, UUID를 확인합니다. 관리 요청은 JWT의 issuer, audience와 작업별 scope를 검사합니다.",
                output: "활성 시작일, 만료일과 폐기 상태를 저장한 짧은 링크 코드",
                recoveryBoundary:
                    "같은 UUID와 링크 조건이면 기존 링크를 반환하고, 같은 UUID의 조건이 하나라도 다르면 충돌로 차단합니다.",
                database: "MySQL",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-go",
                    label: "GO 공개 저장소",
                    note: "구현 코드, 설계 문서와 테스트",
                },
                visibility: "공개 저장소",
                status: "공개 main f7459e1에 링크 상태 안내와 재시도 화면, 관리용 필터와 일괄 조회, HMAC 키 교체를 구현했습니다. 저장 계층은 JPA 대신 JdbcClient로 통일했습니다. 실제 클러스터 배포와 공개 배포는 미검증입니다.",
                tradeoff:
                    "UUID 처리 기록과 HMAC 키를 같은 시점으로 백업해야 합니다. DB 복구 시점의 키가 없으면 기존 링크를 그대로 유지할 수 없습니다.",
                screenshots: [
                    {
                        id: "link-error",
                        src: "baton-go-link-error.webp",
                        label: "링크 상태 안내",
                        caption: "활성 전 링크의 이용 시작 시각과 다시 열기 링크",
                        alt: "BATON GO가 아직 사용할 수 없는 링크에 이용 시작 시각과 다시 열기 링크를 보여 주는 화면",
                        width: 1440,
                        height: 900,
                    },
                ],
                documentation: [
                    {
                        label: "PRD",
                        count: "3",
                    },
                    {
                        label: "ADR",
                        count: "13",
                    },
                    {
                        label: "Runbook",
                        count: "10",
                    },
                ],
            },
            {
                id: "watch",
                name: "WATCH",
                kind: "MICROSERVICE",
                route: "/projects/baton/watch",
                role: "URL 상태 점검",
                summary:
                    "사설망 접근을 차단하고, 공개 URL의 응답 상태와 헤더로 연결 상태를 점검합니다. 상태 변경은 Core로 전달합니다.",
                contribution:
                    "점검 시도마다 처리 서버와 기한을 기록한 뒤 외부 HTTP 요청 중에는 DB 커넥션을 반환했습니다. 중단된 점검은 다시 실행하고, Core 응답을 받지 못한 상태 변경 이벤트는 DB에 남겨 다시 보냅니다.",
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
                detail: "URL 응답 상태와 헤더 점검, 수동 재확인, Core 원본 기반 복구, Grafana Cloud Free 원격 전송 설정",
                evidence:
                    "사설망 차단, 중단된 점검 재실행, 이전 결과 차단과 Core 원본 데이터를 이용한 WATCH 복구 절차를 확인했습니다.",
                input: "점검 대상 URL과 점검 요청 시점의 URL 버전",
                inputRule:
                    "URL 형식과 프로토콜(http, https)을 확인하고 사설망이나 로컬 주소로 해석되는 요청을 차단합니다.",
                output: "URL 상태와 상태 변경 이벤트",
                recoveryBoundary:
                    "한 서버의 처리 기한이 지나면 기존 시도를 종료하고 새 점검 시도를 만들어 다른 서버가 처리합니다.",
                database: "PostgreSQL",
                visibility: "공개 저장소",
                status: "공개 main 9dde469에서 URL 점검과 재처리, 결과 필수값 제약, 복구 도구를 확인했습니다. 중복 JSON 필드와 잘못된 유니코드 URL은 처리 전에 거부합니다. 외부 대시보드와 알림, 공개 환경의 Core 콜백 연결은 미검증입니다.",
                tradeoff:
                    "처리 기한이 짧으면 중복 점검이 늘고, 길면 중단 작업의 재실행이 늦어집니다. 대기 건수와 실패 건수를 보고 기한을 조정해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-watch/tree/9dde469",
                    label: "WATCH 공개 main 고정 커밋",
                    note: "URL 점검과 복구, DB 결과 제약, 운영 검증 도구를 확인한 공개 main 커밋입니다.",
                },
                documentation: [
                    {
                        label: "PRD",
                        count: "4",
                    },
                    {
                        label: "ADR",
                        count: "4",
                    },
                    {
                        label: "Runbook",
                        count: "18",
                    },
                ],
            },
            {
                id: "relay",
                name: "RELAY",
                kind: "MICROSERVICE",
                route: "/projects/baton/relay",
                role: "Discord, Slack, Webhook, AWS SQS FIFO 이벤트 전달",
                summary:
                    "Core 이벤트를 Discord, Slack, Webhook, AWS SQS FIFO로 전달하고 성공, 실패, 결과 미확인을 구분합니다.",
                contribution:
                    "이벤트 ID를 저장해 재수신 시 새 전송 작업을 만들지 않습니다. 서버가 중단되면 기존 시도 UUID와 외부 서비스의 멱등 키를 유지하고, 처리 서버만 변경합니다.",
                stack: [
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring JDBC",
                    "Spring Security",
                    "PostgreSQL 18",
                    "RabbitMQ / Spring AMQP",
                    "Discord Webhook",
                    "AWS SQS FIFO",
                    "pgBackRest",
                    "Flyway",
                    "Testcontainers",
                ],
                detail: "제공자별 전송과 재시도, 결과 미확인 보류, 설정 오류 조회, pgBackRest 시점 복구",
                evidence:
                    "이벤트를 다시 받아도 전송 작업을 중복 생성하지 않는지, 서버 중단 후 기존 시도 UUID와 외부 서비스 멱등 키를 유지한 채 처리 서버만 바뀌는지 검증했습니다.",
                input: "이벤트 ID, 이벤트 종류, 데이터 형식 버전, 대상 업무 식별자와 발생 시각",
                inputRule: "수신 값이 정해 둔 이벤트 형식과 데이터 형식 버전에 맞는지 확인합니다.",
                output: "Discord, Slack, Webhook, AWS SQS FIFO 전달의 성공, 실패 또는 결과 미확인 상태",
                recoveryBoundary: "전송 전 일시 실패만 재시도합니다.",
                database: "PostgreSQL",
                visibility: "비공개 저장소 / 설계와 검증 요약 문서만 공개",
                status: "비공개 main 4cf90a78에 Discord, Slack, Webhook, SQS 전달과 제공자별 재시도, 결과 미확인 보류를 구현했습니다. 실제 채널 발송과 운영 환경의 RPO·RTO는 미검증입니다.",
                tradeoff:
                    "결과 미확인 건은 중복 전달을 막기 위해 자동 재전송하지 않습니다. 운영자가 수신 측 전송 기록을 확인해 성공 또는 실패로 확정해야 합니다.",
                documentation: [
                    {
                        label: "PRD",
                        count: "2",
                    },
                    {
                        label: "ADR",
                        count: "40",
                    },
                    {
                        label: "운영 문서",
                        count: "5",
                    },
                ],
            },
            {
                id: "brief",
                name: "BRIEF",
                screenshotNote:
                    "2026년 10월 7일 Core 공개 main 7ffbd74a 화면을 E2E 테스트용 모의 API 응답으로 촬영했습니다.",
                kind: "MICROSERVICE",
                route: "/projects/baton/brief",
                role: "담당자 공백 및 업무 지연 점검과 주간 보고서",
                summary:
                    "Core가 확인한 담당자 공백, 업무 지연 등 5개 점검 결과를 주간 보고서에 반영합니다. 지난주에서 넘어온 미해결 항목, 이번 주 신규 항목과 해결 항목을 구분합니다.",
                contribution:
                    "Core가 보낸 상태를 그대로 미해결(ACTIVE) 또는 해결됨(RESOLVED) 상태의 점검 항목에 저장했습니다. 같은 이벤트와 과거 버전을 차단하고, 한 번 발행한 주간 보고서는 수정하지 않습니다.",
                stack: [
                    "Kotlin 2.4.20",
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring JDBC",
                    "PostgreSQL 18",
                    "Flyway",
                    "Testcontainers",
                ],
                detail: "업무 종류, 주간, 시간대별로 조회합니다. 미해결 이월, 신규, 해결 항목을 구분하고 보고서 비교와 이력 보존을 제공합니다.",
                evidence:
                    "중복 이벤트와 과거 이벤트 차단, 점검 항목 요약과 필터, 발행 보고서 불변성을 PostgreSQL과 Core 교차 서비스 테스트로 확인했습니다.",
                input: "Core의 5개 점검 결과: 담당자 공백, 후임자 공백, 역할 준비 부족, 반복 업무 지연, 미완료 인수인계",
                inputRule:
                    "같은 이벤트 ID로 저장한 값과 비교해 같은 내용의 재전달과 내용이 다른 충돌을 구분하고, 점검 상태의 버전 번호(revision)로 과거 이벤트를 확인합니다.",
                output: "미해결 또는 해결된 점검 항목, 수신 이벤트 이력, 발행 후 수정하지 않는 주간 보고서",
                recoveryBoundary:
                    "같은 이벤트와 과거 버전은 반영하지 않습니다. 저장한 이벤트를 처음부터 다시 읽어도 같은 점검 항목이 만들어집니다.",
                database: "PostgreSQL",
                visibility: "공개 저장소",
                status: "공개 main fc6dede에 보고서 최신 여부 확인과 범위 지정 비교 API를 추가했습니다. Core 화면에는 아직 연결하지 않았습니다. Core 연동은 로컬 검증 기록 기준이며 원격 배포는 미검증입니다.",
                tradeoff:
                    "이벤트 형식은 v2만 처리합니다. 점검 항목 종류가 늘면 Core 이벤트 JSON 규격, BRIEF 반영 규칙과 보고서 비교 규칙을 함께 바꿔야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-brief",
                    label: "BRIEF 공개 저장소",
                    note: "주간 보고서와 점검 항목 조회, 이벤트 수신, 검증 기록",
                },
                screenshots: [
                    {
                        id: "weekly-summary",
                        src: "baton-brief-weekly-summary.webp",
                        label: "주간 운영 요약",
                        caption: "저장된 주간 보고서의 점검 항목과 공유",
                        alt: "BATON 할 일 화면의 주간 업무 점검에서 BRIEF가 저장한 주간 요약과 점검 항목을 확인하는 모습",
                        width: 1440,
                        height: 960,
                    },
                ],
                documentation: [
                    {
                        label: "PRD",
                        count: "32",
                    },
                    {
                        label: "ADR",
                        count: "8",
                    },
                    {
                        label: "이벤트 형식 문서",
                        count: "1",
                    },
                    {
                        label: "운영 문서",
                        count: "4",
                    },
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
                    "Core 일정과 일정 버전 번호(revision)를 저장해 iCalendar로 변환합니다. 구독 토큰 교체와 폐기, HTTP 캐시 응답도 구현했습니다.",
                stack: [
                    "Kotlin 2.4.10",
                    "Java 25",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring JDBC",
                    "PostgreSQL 18",
                    "iCal4j 4.3.0",
                    "Flyway",
                    "Testcontainers",
                ],
                detail: "최대 100건 일정 묶음 반영, 개인 구독과 일괄 해지, 읽기 전용 .ics 캐시",
                evidence:
                    "Core 1.0.0 생성 코드의 일정 JSON으로 중복 일정과 과거 일정 차단, iCalendar 변환을 검증했습니다.",
                input: "Core 일정의 최신 전체 데이터와 버전 번호, 구독 생성, 토큰 교체, 구독 폐기 요청",
                inputRule:
                    "일정 ID, 이벤트 ID, 버전 번호와 시간대 값이 공개한 일정 JSON 형식에 맞는지 확인합니다.",
                output: "읽기 전용 iCalendar 피드와 일정이 바뀌지 않았음을 알리는 304 응답",
                recoveryBoundary:
                    "중복된 버전 번호와 과거 버전 번호는 반영하지 않고, DB에 저장한 일정으로 같은 iCalendar 피드를 다시 생성합니다.",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 정식 규격 1.0.0 / 후보 규격 1.1.0-rc.2",
                status: "공개 main 8cb55f8에 최대 100건 일정 묶음 수신과 시즌별 일괄 반영을 구현했습니다. 후보 규격 1.1.0-rc.2를 게시하고 Core 교차 테스트를 통과했습니다. 실제 캘린더 앱 구독은 미검증입니다.",
                tradeoff:
                    "읽기 전용 구독은 외부 캘린더에서 쉽게 사용할 수 있지만, 비동기 반영 지연과 앱별 시간대, 캐시 동작을 확인해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-cal/tree/8cb55f8",
                    label: "CAL 공개 main 고정 커밋",
                    note: "일정 묶음 처리를 확인한 공개 main입니다. 게시한 후보 규격은 1.1.0-rc.2입니다.",
                },
                documentation: [
                    {
                        label: "PRD",
                        count: "2",
                    },
                    {
                        label: "ADR",
                        count: "3",
                    },
                    {
                        label: "JSON Schema",
                        count: "18",
                    },
                ],
            },
            {
                id: "round",
                name: "ROUND",
                screenshotNote:
                    "2026년 10월 7일 공개 main a43c6f5를 로컬 standalone 서버와 가상 카메라로 실행해 촬영한 테스트 화면입니다. 실제 TURN 중계나 외부망 접속 결과가 아닙니다.",
                kind: "MICROSERVICE",
                route: "/projects/baton/round",
                role: "WebRTC 스터디룸",
                summary:
                    "Core 입장 토큰을 검증해 최대 6명의 WebRTC 시그널링 메시지를 전달하고, Cloudflare TURN 또는 coturn 접속 정보를 제공합니다.",
                contribution:
                    "React 입장 화면과 통화 화면, 재연결과 채팅 수신 확인을 처리하는 WebRTC 연결 모듈을 구현했습니다. 서버에는 Spring WebSocket 시그널링(프로토콜 v3)과 만료 시간이 짧은 Cloudflare TURN 자격 증명 발급을 구현했습니다.",
                stack: [
                    "TypeScript",
                    "React 19",
                    "Vite 8",
                    "WebRTC / RTCDataChannel",
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring WebSocket",
                    "Cloudflare TURN / coturn / Caddy",
                    "Playwright",
                ],
                detail: "입장 전 장치와 소리 확인, 공용 타이머 중심 통화 화면, 화면 공유 작은 창, 참가자별 재연결, 수신 확인을 포함한 채팅",
                evidence:
                    "Chromium 카메라와 마이크 제어, 화면 공유, WebKit 호환성, BATON 연동용 edge 프록시와 배포 검증을 CI 작업으로 분리했습니다. WebKit mDNS와 restic 누락도 보완했습니다.",
                input: "방 ID, 참가자 ID, 만료 시각이 담긴 Core의 단기 입장 토큰(RS256)",
                inputRule:
                    "입장 토큰의 서명, 발급자, 수신자, 방 ID와 만료 시각을 Core가 제공한 공개 키 목록으로 확인합니다.",
                output: "브라우저 사이의 WebRTC 시그널링 메시지 전달, DataChannel 채팅 수신 응답과 만료 시간이 짧은 Cloudflare TURN 접속 정보",
                recoveryBoundary:
                    "연결을 새로 만들 때마다 순번을 올리고 이전 연결에서 늦게 온 메시지는 버립니다. 같은 참가자가 새 입장 토큰으로 접속하면 이전 WebSocket 세션을 종료합니다.",
                database: "DB 없음 / 방과 참가자 연결 상태는 프로세스 메모리에 저장",
                repository: {
                    href: "https://github.com/ljkhyeong/webrtc-study",
                    label: "ROUND 공개 저장소",
                    note: "구현 코드, 설계 문서와 테스트",
                },
                visibility: "공개 저장소",
                status: "공개 main a43c6f5에서 통화 화면과 입장 화면을 공용 타이머 중심으로 다시 구성했습니다. 참가자 패널 키보드 조작과 새 메시지 수를 브라우저 제목에 표시하는 기능도 추가했습니다. 실제 TURN, Safari 실기기, 외부망과 6명 장시간 접속은 미검증입니다.",
                tradeoff:
                    "참가자끼리 직접 연결하는 mesh 구조는 인원이 늘수록 각 브라우저의 업로드와 CPU 사용량이 증가합니다.",
                screenshots: [
                    {
                        id: "study",
                        src: "baton-round-study.webp",
                        label: "스터디 진행 도구",
                        caption: "공용 타이머와 주제, 손들기 순서를 함께 보는 통화 화면",
                        alt: "BATON ROUND 통화 화면에서 남은 시간, 주제와 손들기 순서를 확인하는 모습",
                        width: 1440,
                        height: 960,
                    },
                    {
                        id: "invite",
                        src: "baton-round-invite.webp",
                        label: "QR 초대",
                        caption: "QR 코드와 초대 링크로 스터디룸 공유",
                        alt: "BATON ROUND 통화 중 QR 코드와 초대 링크를 보여 주는 초대 대화상자",
                        width: 1440,
                        height: 960,
                    },
                    {
                        id: "prejoin",
                        src: "baton-round-prejoin.webp",
                        label: "입장 전 장치 확인",
                        caption: "카메라 미리보기, 마이크와 스피커 확인 후 입장",
                        alt: "BATON ROUND 입장 전 화면에서 카메라 미리보기, 장치 선택과 이름 입력을 확인하는 모습",
                        width: 1440,
                        height: 960,
                    },
                    {
                        id: "call-chat",
                        src: "baton-round-call-chat.webp",
                        label: "통화와 채팅",
                        caption: "영상 통화와 DataChannel 채팅",
                        alt: "BATON ROUND 통화 화면에서 참가자 영상과 채팅 메시지를 함께 보는 모습",
                        width: 1440,
                        height: 960,
                    },
                    {
                        id: "screen-share",
                        src: "baton-round-screen-share.webp",
                        label: "화면 공유",
                        caption: "다른 참가자의 공유 화면을 고정해 크게 보기",
                        alt: "BATON ROUND 통화 화면에서 참가자의 공유 화면을 고정하고 확대 조작을 보여 주는 모습",
                        width: 1440,
                        height: 960,
                    },
                ],
                documentation: [
                    {
                        label: "Architecture",
                        count: "1",
                    },
                    {
                        label: "ADR",
                        count: "1",
                    },
                    {
                        label: "메시지 규격",
                        count: "1",
                    },
                    {
                        label: "Runbook",
                        count: "2",
                    },
                ],
            },
        ],
        category: "개인 프로젝트",
        role: "Core와 6개 서비스의 API, 데이터 저장, 이벤트 전달, 중단 작업 재처리 설계와 구현",
        oneLine:
            "여러 팀의 오늘 할 일과 인수인계 문서를 Core에 모으고, 짧은 링크, URL 점검, 이벤트 전달, 주간 보고서, 캘린더, WebRTC를 독립 서비스로 구현했습니다.",
        status: {
            label: "현재 상태",
            text: "여러 팀의 내 업무 모아 보기, 자료별 재확인 주기 설정, 주간 보고서 필터와 공유, 개인 캘린더 구독을 구현했습니다.",
        },
        problems: [
            {
                number: "01",
                serviceIds: ["core", "go", "watch", "relay", "brief", "cal", "round"],
                shared: true,
                title: "Core와 6개 서비스의 기능 및 DB 분리",
                constraint: "각 기능은 입력, 보안 검사와 실패 처리 방식이 달랐습니다.",
                decision:
                    "Core는 조직, 역할, 반복 업무, 인수인계 데이터를 저장합니다. 나머지 서비스는 각자 DB를 쓰고, ROUND는 방과 참가자 연결 상태를 메모리에 둡니다. 업무 상태와 전송할 이벤트는 같은 트랜잭션에 저장합니다(Transactional Outbox).",
                validation:
                    "GO는 같은 UUID의 링크 1건, WATCH는 사설망 URL 차단, RELAY는 같은 이벤트 ID의 수신 이력 1건, BRIEF는 미해결(ACTIVE) 또는 해결됨(RESOLVED) 상태 반영, CAL은 과거 버전 미반영, ROUND는 이전 연결의 늦은 메시지 차단을 확인했습니다.",
                boundary:
                    "Core와 BRIEF, CAL, ROUND의 로컬 연동과 Core Outbox에서 RELAY 수신 DB까지의 이벤트 전달을 Docker Compose로 확인했습니다. 배포 환경에서 Core와 6개 서비스의 종단 간 연결은 확인하지 않았습니다.",
            },
            {
                number: "02",
                serviceIds: ["core"],
                title: "인수인계 수락과 담당자 변경을 한 트랜잭션으로 처리",
                constraint:
                    "인수인계 수락과 담당자 변경이 따로 반영되면 역할 담당 정보가 어긋날 수 있었습니다.",
                decision:
                    "준비 때 다음 담당자와 기간을 고정하고 전달 때 누락 항목을 확인했습니다. 수락 시 담당자와 기간을 한 트랜잭션에서 바꾸고 역할별 진행 중 인수인계는 1건만 허용했습니다.",
                validation: "상태 전이, 취소, 중복 인수인계와 전달 후 수정을 테스트했습니다.",
                boundary:
                    "운영 화면에서 현재 상태와 수락 또는 취소 가능 여부를 보여주고, 준비 또는 전달 상태에서 멈춘 인수인계를 찾아 취소하는 절차가 필요합니다.",
            },
            {
                number: "03",
                serviceIds: ["go"],
                title: "같은 링크 요청은 1건만 저장",
                constraint:
                    "저장 후 응답이 유실되거나 여러 서버가 같은 요청을 동시에 받으면 링크가 중복 생성될 수 있습니다.",
                decision:
                    "멱등 키(UUID)의 해시로 처리 이력을 찾고 요청 본문을 비교합니다. 조건이 같으면 기존 링크를 반환하고 다르면 거절합니다.",
                validation:
                    "같은 요청 8건을 동시에 보내도 링크와 링크 생성 처리 기록이 각각 1건만 생성되는지 통합 테스트로 확인했습니다.",
                boundary:
                    "UUID 처리 기록은 링크를 정리한 뒤에도 남으므로 보관 기간과 정리 정책이 필요합니다.",
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
                    "서로 다른 HMAC 키 정보를 동시에 처음 등록하면 하나만 성공하고, 저장된 키와 다르면 서버 시작과 링크 생성을 거부하는지 통합 테스트로 확인했습니다.",
                boundary:
                    "DB 백업과 HMAC 키를 같은 시점 기준으로 보관하고 복원하는 운영 절차가 필요합니다.",
            },
            {
                number: "05",
                serviceIds: ["watch"],
                title: "URL 점검 중 DB 커넥션 반환과 늦은 결과 차단",
                constraint:
                    "느린 URL 점검이 DB 커넥션을 오래 점유하고 늦은 결과가 최신 상태를 덮을 수 있었습니다.",
                decision:
                    "점검 시도마다 처리 서버와 기한을 기록한 뒤 DB 커넥션을 반환했습니다. DNS로 확인한 IP가 공인 IP일 때만 요청해 내부망 접근(SSRF)을 막았습니다. 기한이 지나면 기존 시도를 종료하고 새로 점검하며, 이전 시도나 이전 URL 버전의 결과는 저장하지 않았습니다.",
                validation:
                    "사설망 접근, DNS 리바인딩, 응답 크기 초과, 서버 중단과 늦은 결과를 테스트했습니다.",
                boundary:
                    "서버가 선점한 점검의 처리 기한이 짧으면 중복 실행이 늘고, 길면 중단된 점검을 다시 실행하는 시점이 늦어집니다.",
            },
            {
                number: "06",
                serviceIds: ["watch"],
                title: "미전송 URL 상태 이벤트 재처리",
                constraint:
                    "URL 상태는 저장됐지만 Core 전달 호출이 실패하면 두 시스템이 서로 다른 상태를 볼 수 있었습니다.",
                decision:
                    "상태 변경과 이벤트를 한 트랜잭션에 저장하고(Transactional Outbox) Core의 수신 확인 전까지 재전송했습니다.",
                validation:
                    "같은 이벤트 재전송, Core는 이벤트를 받았지만 WATCH가 성공 응답을 받지 못한 경우와 미전송 이벤트 재처리를 자동화 테스트로 확인했습니다. 공개 스테이징 전송 절차는 Runbook으로 정리했습니다.",
                boundary: "현재 수신 서비스는 Core 하나이며 별도 메시지 큐 없이 HTTP로 전달합니다.",
            },
            {
                number: "07",
                serviceIds: ["relay"],
                title: "전송 결과 미확인 시 중복 전송 방지",
                constraint:
                    "외부 전송 뒤 응답이 유실되면 성공 여부를 모른 채 중복 전송할 수 있었습니다.",
                decision:
                    "호출 전에 시도 UUID와 외부 서비스 멱등 키를 저장했습니다. 서버가 바뀌어도 두 값을 유지합니다. 결과 미확인 건은 자동 재전송하지 않고, 운영자가 수신 측 전송 기록을 확인해 성공 또는 실패로 확정합니다.",
                validation:
                    "전달 서버 중단 뒤 같은 시도 UUID와 외부 서비스 멱등 키를 유지하는지, 이전 서버의 늦은 결과를 버리는지와 운영자 상태 확정을 확인했습니다.",
                boundary:
                    "결과 미확인 건은 자동으로 확정되지 않아 운영자가 한 건씩 확인해야 합니다.",
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
                boundary: "RabbitMQ 메시지 보관 및 실패 큐 모니터링, 재처리 절차가 필요합니다.",
            },
            {
                number: "09",
                serviceIds: ["brief"],
                title: "Core의 점검 결과를 그대로 반영",
                constraint:
                    "BRIEF가 Core의 판정 규칙을 다시 구현하면 두 서비스가 같은 조직 상태를 다르게 판단할 수 있습니다.",
                decision:
                    "Core가 판정한 5개 점검 결과를 그대로 미해결(ACTIVE) 또는 해결됨(RESOLVED) 상태의 점검 항목에 반영했습니다. 이벤트 ID별 저장 값 비교와 버전 번호로 중복 이벤트와 과거 이벤트도 차단했습니다.",
                validation:
                    "로컬에서 실제 Core와 내부 서비스용 Caddy HTTPS로 점검 항목, 요약, 필터 조회와 주간 보고서 발행을 확인했습니다.",
                boundary: "공인 DNS와 원격 배포는 미검증입니다.",
            },
            {
                number: "10",
                serviceIds: ["brief"],
                title: "발행한 주간 보고서는 수정하지 않음",
                constraint:
                    "DB에 저장한 이벤트로 운영 점검 목록을 다시 만들 때 항목 순서나 결과가 달라지면 이전 주간 보고서를 신뢰하기 어렵습니다.",
                decision:
                    "수신 이벤트 전체로 목록을 다시 만들고 주간, 마지막 이벤트 순번과 항목이 같으면 기존 보고서를 반환했습니다. 변경이 있으면 새 보고서를 만들고 이전 보고서는 수정하지 않았습니다.",
                validation:
                    "재생성 전후 목록이 같고 동시 요청에도 보고서 1건만 저장되는지 확인했습니다.",
                boundary:
                    "점검 항목 종류가 늘면 Core 이벤트 JSON과 BRIEF 반영 규칙을 함께 바꿔야 합니다.",
            },
            {
                number: "11",
                serviceIds: ["cal"],
                title: "중복 일정과 이전 버전 일정의 반영 방지",
                constraint:
                    "네트워크 재시도로 같은 일정 JSON이 다시 오거나 과거 버전 번호가 늦게 도착하면 최신 캘린더가 이전 일정으로 돌아갈 수 있습니다.",
                decision:
                    "이벤트 ID, 일정 ID, 버전, 해시로 중복 일정과 과거 일정을 걸러냅니다. 최대 100건을 한 트랜잭션으로 받고 변경된 시즌의 캘린더를 한 번씩 갱신합니다.",
                validation:
                    "묶음 내 오류 시 전체 롤백, 중복 일정과 과거 일정 차단, 시즌별 갱신을 검증했습니다. 후보 규격 1.1.0-rc.2의 Core 교차 테스트 5개 통과 기록도 확인했습니다.",
                boundary:
                    "Core와 CAL은 비동기로 연동하므로 일정 반영이 지연될 수 있습니다. 공개 운영 전에 자격 증명 교체와 전체 일정 재동기화 순서를 검증해야 합니다.",
            },
            {
                number: "12",
                serviceIds: ["cal"],
                title: "iCalendar 시간대 및 취소 처리와 HTTP 캐시 적용",
                constraint:
                    "캘린더 앱마다 시간대, 취소 일정, 캐시를 처리하는 방식이 달라 일정이 중복되거나 변경 내용이 반영되지 않을 수 있습니다.",
                decision:
                    "일정 ID는 UID로 고정하고 버전 번호는 SEQUENCE로 사용했습니다. 조건부 요청의 ETag 또는 수정 시각을 검사해 캐시가 유효하면 304를 반환하고, 그 외에는 .ics 본문을 반환합니다.",
                validation:
                    "UTC, 서머타임 전환(DST), 자정 경계, 취소 일정, UTF-8 줄 접기와 변경 없음 응답(304 Not Modified)을 iCalendar 기대값 파일과 자동화 테스트로 확인했습니다.",
                boundary:
                    "iCal4j 또는 시간대 데이터 버전을 바꾸면 iCalendar 기대값 파일과 ETag가 함께 바뀌는지 확인해야 합니다.",
            },
            {
                number: "13",
                serviceIds: ["round"],
                title: "이전 WebRTC 연결의 늦은 메시지 차단",
                constraint:
                    "피어 연결을 다시 만들거나 ICE를 재시작한 뒤 이전 연결의 SDP와 ICE 후보가 늦게 도착하면 새 연결 상태가 손상될 수 있습니다.",
                decision:
                    "연결마다 순번을 부여해 이전 answer와 ICE 메시지를 버립니다. 실패한 참가자만 다시 연결하고 정상 통화, 로컬 장치, 채팅 기록은 유지합니다.",
                validation:
                    "연결 중단, ICE 재시작과 피어 재생성 사이에 이전 연결 순번의 answer와 ICE를 늦게 전달해 현재 연결 시도의 메시지만 반영되는지 WebRTC 연결 모듈 자동화 테스트로 확인했습니다.",
                boundary: "클라이언트와 서버의 시그널링 메시지 규격을 함께 배포해야 합니다.",
            },
            {
                number: "14",
                serviceIds: ["round"],
                title: "Core는 입장 권한, ROUND는 시그널링 담당",
                constraint:
                    "ROUND가 연결마다 Core를 호출하거나 권한 정보를 복제하면 지연과 데이터 불일치가 생길 수 있습니다.",
                decision:
                    "Core가 스터디 구성원 자격을 확인해 RS256 입장 토큰을 발급합니다. ROUND는 입장 토큰 검증, WebSocket 시그널링과 TURN 접속 정보만 담당합니다.",
                validation:
                    "잘못된 입장 토큰 차단, 공개 키 교체와 같은 참가자의 이전 세션 종료를 확인했습니다.",
                boundary:
                    "권한 회수는 입장 토큰 만료까지 늦어질 수 있습니다. 실제 Cloudflare TURN 중계 전용 연결, Safari 실기기, 외부망과 6명 장시간 접속은 미검증입니다.",
            },
        ],
        stack: [
            "Java 21 / 25",
            "Kotlin 2.4",
            "TypeScript",
            "Spring Boot",
            "Spring MVC",
            "Spring Data JPA / Spring JDBC",
            "React 19 / Vite",
            "MySQL 8.4 / PostgreSQL 18",
            "Flyway",
            "RabbitMQ 4.3 / Discord / AWS SQS FIFO",
            "iCal4j 4.3",
            "WebRTC / Spring WebSocket",
            "Testcontainers / Playwright",
            "Docker / Kubernetes / Caddy",
        ],
        links: [
            {
                label: "BATON Core GitHub 저장소",
                shortLabel: "Core GitHub 저장소",
                href: "https://github.com/ljkhyeong/baton",
                note: "조직, 역할, 반복 업무, 결정, 인수인계 문서 · 공개 저장소",
            },
            {
                label: "BATON GO GitHub 저장소",
                shortLabel: "GO 저장소",
                href: "https://github.com/ljkhyeong/baton-go",
                note: "짧은 링크 발급과 폐기 · 공개 저장소",
            },
            {
                label: "BATON WATCH GitHub 저장소",
                shortLabel: "WATCH 저장소",
                href: "https://github.com/ljkhyeong/baton-watch",
                note: "사설망을 차단하는 URL 점검과 상태 변경 이벤트 · 공개 저장소",
            },
            {
                label: "BATON RELAY GitHub 저장소",
                shortLabel: "RELAY 저장소",
                note: "RabbitMQ 수신과 Discord, Slack, Webhook, AWS SQS FIFO 전달 · 비공개 저장소",
            },
            {
                label: "BATON BRIEF GitHub 저장소",
                shortLabel: "BRIEF 저장소",
                href: "https://github.com/ljkhyeong/baton-brief",
                note: "담당자 공백 및 업무 지연 점검과 주간 보고서 · 공개 저장소",
            },
            {
                label: "BATON CAL GitHub 저장소",
                shortLabel: "CAL 저장소",
                href: "https://github.com/ljkhyeong/baton-cal",
                note: "일정 스냅샷과 읽기 전용 iCalendar 구독 · 공개 저장소",
            },
            {
                label: "BATON ROUND GitHub 저장소",
                shortLabel: "ROUND 저장소",
                href: "https://github.com/ljkhyeong/webrtc-study",
                note: "WebRTC 스터디룸과 Spring WebSocket 시그널링 · 공개 저장소",
            },
        ],
    },
    {
        ...projectSummariesById.happygallery,
        systemTitle: "대표 화면",
        systemNavLabel: "대표 화면",
        screenshotNote:
            "2026년 10월 7일 공개 main 982a88a2를 로컬에서 실행하고 E2E 테스트용 모의 API 응답으로 촬영했습니다.",
        screenshots: [
            projectSummariesById.happygallery.coverScreenshot,
            {
                id: "smartstore-reconciliation",
                src: "happygallery-smartstore-reconciliation.webp",
                label: "스마트스토어 대사",
                caption: "결과를 확인하지 못한 발송 요청을 네이버 현재 상태와 대조",
                alt: "happyGallery 관리자 화면에서 결과를 확인하지 못한 스마트스토어 발송 요청의 운송장을 네이버 현재 상태와 대조하는 모습",
                width: 1440,
                height: 960,
            },
            {
                id: "smartstore-mapping",
                src: "happygallery-smartstore-mapping.webp",
                label: "스마트스토어 상품 연결",
                caption: "자사몰 옵션 조합과 스마트스토어 옵션의 연결, 변경 이력",
                alt: "happyGallery 관리자 화면에서 자사몰 옵션 조합을 스마트스토어 옵션에 연결하고 변경 이력을 확인하는 모습",
                width: 1440,
                height: 960,
            },
            {
                id: "classes",
                src: "happygallery-classes.webp",
                label: "클래스 목록",
                caption: "상황 필터, 가격, 소요 시간, 정원과 다음 수업",
                alt: "happyGallery 클래스 목록에서 상황 필터를 적용하고 수업 가격과 다음 수업 일정을 확인하는 모습",
                width: 1440,
                height: 960,
            },
            {
                id: "cart",
                src: "happygallery-cart.webp",
                label: "선택 구매와 결제수단",
                caption: "선택한 작품만 결제하고 나머지는 장바구니에 남기는 주문 화면",
                alt: "happyGallery 장바구니에서 세 작품 중 두 작품만 선택하고 수령 방법과 결제수단을 고르는 화면",
                width: 1440,
                height: 1200,
            },
        ],
        architecture: {
            label: "포트와 어댑터 구조, 6개 모듈",
            title: "업무 규칙을 HTTP, DB와 외부 연동 코드에서 분리했습니다.",
            description:
                "실행, API, DB, 외부 연동, 업무 처리와 도메인 규칙을 6개 모듈로 나눴습니다. Gradle과 ArchUnit으로 의존 방향을 검사합니다.",
            tradeoff:
                "모듈 수는 늘지만 잘못된 의존을 빌드에서 찾을 수 있습니다. 일부 JPA 매핑은 도메인 모듈에 유지했습니다.",
        },
        featuredProblemNumbers: ["02", "03", "12", "14", "16"],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "4",
            },
            {
                id: "adr",
                label: "ADR",
                count: "49",
            },
            {
                id: "idea-poc",
                label: "Idea / POC",
                count: "40 / 1",
            },
            {
                id: "retrospective",
                label: "Retrospective",
                count: "11",
            },
            {
                id: "runbook",
                label: "Runbook",
                count: "1",
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
                label: "포트와 어댑터 구조로 업무 규칙 분리",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0021_Hexagonal_%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98_%EC%A0%84%ED%99%98/adr.md",
                note: "운영 모듈 6개와 test-support의 의존 방향, 외부 연동 인터페이스 범위를 정한 기록",
            },
            {
                type: "개발 검증",
                label: "AI 코드 변경 검증 방식",
                href: "/docs/agent-feedback.md",
                note: "토스 기술 블로그에서 참고한 배경과 파일별 검사, 전체 변경 검토, ArchUnit의 적용 범위를 정리한 공개 요약",
            },
            {
                type: "ADR",
                label: "결제 승인 실패 이력과 중복 처리 방지",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0033_결제_confirm_트랜잭션과_보상_경계/adr.md",
                note: "결제사 호출과 상태 저장을 분리하고 실패 이력, 멱등 키와 복구 기준을 정한 기록",
            },
            {
                type: "ADR",
                label: "이용권 사용, 취소 및 환불 정책",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0011_이용권_사용_소모_환불_결정/adr.md",
                note: "미래 예약 자동 취소, 환불할 이용 횟수 계산과 동시 처리의 잠금 순서를 정한 기록",
            },
            {
                type: "ADR",
                label: "미전송 알림 저장과 재처리",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0032_%EC%95%8C%EB%A6%BC_Outbox_%EC%A0%84%EB%8B%AC_%EB%B3%B4%EC%9E%A5/adr.md",
                note: "업무 데이터와 알림을 같은 트랜잭션에 저장하고, 커밋 후 미전송 알림을 재처리하는 방식을 정한 기록",
            },
            {
                type: "ADR",
                label: "개인정보 암호화와 전화번호 일치 검색",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0036_%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4_%ED%8F%89%EB%AC%B8_%EC%A0%9C%EA%B1%B0%EC%99%80_%EB%B8%94%EB%9D%BC%EC%9D%B8%EB%93%9C_%EC%9D%B8%EB%8D%B1%EC%8A%A4_%EA%B8%B0%EC%A4%80/adr.md",
                note: "복원은 AES-GCM, 일치 검색은 HMAC으로 분리하고 키 회전 범위를 정한 기록",
            },
            {
                type: "Retrospective",
                label: "AWS 비용과 운영 종료",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/Retrospective/0010_AWS_%EB%B9%84%EC%9A%A9_%EA%B3%BC%EA%B8%88_%EC%9B%90%EC%9D%B8_%EC%A0%90%EA%B2%80/retrospective.md",
                note: "상시 리소스 비용을 확인하고 AWS 운영 환경을 종료한 과정",
            },
            {
                type: "ADR",
                label: "스마트스토어 주문과 재고 동기화",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0047_%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%8A%A4%ED%86%A0%EC%96%B4_%EC%9E%AC%EA%B3%A0_%EB%8F%99%EA%B8%B0%ED%99%94/adr.md",
                note: "채널 주문을 먼저 반영하고 부분취소와 재전송은 주문 수량 변경분만 적용하는 결정",
            },
            {
                type: "ADR",
                label: "스마트스토어 주문 운영과 정산",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0048_%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%8A%A4%ED%86%A0%EC%96%B4_%EC%A3%BC%EB%AC%B8_%EC%9A%B4%EC%98%81_%EC%97%B0%EB%8F%99/adr.md",
                note: "주문 상태 갱신, 문의 조회와 답변, 정산 내역 대조를 구분한 설계",
            },
        ],
        category: "개인 프로젝트",
        role: "요구사항 정리, Java와 Spring Boot API, React 화면, 결제와 스마트스토어 연동, 자동화 테스트와 k3s 배포 자동화",
        oneLine:
            "상품 주문, 간편결제, 클래스 예약, 스마트스토어 주문과 재고 연동을 하나의 서비스로 구현했습니다.",
        status: {
            label: "그 밖의 구현",
            text: "카드는 Toss 통합 결제창, 네이버페이와 카카오페이는 Toss SDK로 각 간편결제 창을 열어 결제합니다. 공휴일은 매일 자동 갱신하고, 주소 검색은 별도 API 키 없이 브라우저에서 실행합니다.",
        },
        visualCaption:
            "기능 설명용 테스트 데이터로 촬영한 화면입니다. 실제 네이버 판매자 계정이나 결제사 관리 화면은 아닙니다.",
        problems: [
            {
                number: "01",
                title: "주문 및 예약 규칙을 웹과 DB 코드에서 분리",
                constraint:
                    "주문이나 예약 규칙을 바꿀 때 HTTP와 DB 코드까지 함께 수정해야 했습니다.",
                decision:
                    "실행, API, DB, 외부 연동, 업무 처리와 도메인 규칙을 나누고 Gradle과 ArchUnit으로 의존 방향을 검사했습니다.",
                validation:
                    "LayerDependencyPolicyTest와 모듈별 컴파일로 금지한 의존이 빌드 단계에서 실패하는지 확인했습니다.",
                boundary:
                    "domain 모듈의 일부 JPA 의존은 유지했습니다. 현재 규모에서는 JPA를 완전히 분리하지 않고 모듈 의존 방향만 검사합니다.",
            },
            {
                number: "02",
                title: "결제 및 환불 재요청의 중복 처리 방지",
                screenshotId: "cart",
                constraint:
                    "결제사 응답이 유실되면 실패 이력이 사라지거나 같은 요청이 중복으로 승인되거나 환불될 수 있었습니다.",
                decision:
                    "결제사 호출을 DB 트랜잭션 밖으로 분리하고 전후 상태를 독립 트랜잭션으로 저장했습니다. 결과를 확인하지 못하면 결제는 orderId, 환불은 생성 때 저장한 멱등 키(UUID)로 결제사 처리 결과를 조회합니다.",
                validation:
                    "실패 이력 보존, 같은 orderId와 환불 UUID의 결과 재사용, 늦은 응답 차단과 결과 재조회를 통합 테스트로 확인했습니다.",
                boundary:
                    "결제와 환불의 처리 상태, 결과 조회 경로가 늘어 운영자 확인 화면이 복잡해졌습니다. 실제 Toss Payments의 응답 지연과 장애를 포함한 연동 테스트는 남아 있습니다.",
            },
            {
                number: "03",
                title: "서버 중단 후 미전송 알림 재처리",
                constraint:
                    "주문이나 예약을 커밋한 직후 프로세스가 종료되면 알림 호출 자체가 사라질 수 있습니다.",
                decision:
                    "업무 상태와 알림 Outbox를 함께 저장하고 미전송 건은 스케줄러가 다시 처리합니다. NHN 접수 ID로 최종 수신 결과를 조회해 실제 전달 성공만 발송 완료(SENT)로 확정하고, 알림톡 최종 실패 뒤에만 SMS를 요청합니다.",
                validation:
                    "알림 중복 저장 차단, 서버 중단 후 미전송 알림 재처리, 최종 수신 결과 반영과 알림톡 최종 실패 뒤 SMS 전환을 통합 테스트했습니다.",
                boundary:
                    "운영 자격 증명을 사용한 장시간 지연과 알림 서비스 장애는 아직 검증하지 않았습니다.",
            },
            {
                number: "04",
                title: "동시 예약 정원과 주문 재고 초과 방지",
                constraint:
                    "클래스마다 예약 정원이 다르고 한 번에 여러 명을 예약할 수 있어, 현재 예약 인원과 새 요청 인원의 합을 잠금 없이 확인하면 정원을 넘길 수 있습니다. 마지막 재고에도 같은 문제가 있었습니다.",
                decision:
                    "예약은 클래스와 예약 슬롯 행에 비관적 잠금을 건 뒤 인원을 확인했습니다. 주문은 상품 또는 SKU 행을 정해진 순서로 잠가 교착 상태를 피하고 재고를 차감했습니다.",
                validation:
                    "동시 예약과 주문에서 정원이나 재고를 넘는 요청이 거절되는지 확인했습니다.",
                boundary:
                    "단일 MySQL 기준 설계입니다. 같은 예약 슬롯이나 재고에 요청이 집중되면 잠금 대기가 늘어납니다.",
            },
            {
                number: "05",
                title: "전화번호 및 주소 암호화와 전화번호 일치 검색",
                constraint:
                    "전화번호와 주소를 평문으로 저장하지 않으면서도 주문 조회와 비회원 이력 찾기를 지원해야 했습니다.",
                decision:
                    "복원이 필요한 값은 AES-GCM으로 암호화하고 일치 검색에는 HMAC 블라인드 인덱스를 사용했습니다.",
                validation:
                    "암호화 후 복호화, 잘못된 키 차단, 블라인드 인덱스 검색과 마이그레이션 재실행을 테스트했습니다.",
                boundary:
                    "부분 검색은 지원하지 않으며 키 유실 시 복구할 수 없으므로 암호화 백업과 키 보관 절차가 함께 필요합니다.",
            },
            {
                number: "06",
                title: "AWS 비용 분석과 k3s 자동 배포 구성",
                constraint:
                    "CloudFront, ALB, ECS, RDS와 Valkey 기반 환경을 실제 가동했지만 트래픽과 무관한 상시 비용이 계속 발생했습니다.",
                decision:
                    "Cost Explorer로 상시 비용을 확인해 AWS 리소스를 종료했습니다. 이후 main에 병합하면 검사를 통과한 이미지만 k3s에 롤링 배포하고, 배포 전에는 앱을 멈추지 않고 DB와 이미지를 백업합니다.",
                validation:
                    "공개 서비스의 HTTPS 접속을 확인했습니다. 2026년 10월 6일 자동 배포(982a88a2)에서 배포 전 백업과 백업 파일 해시 검증, 롤링 교체, 공개 경로 점검이 통과했습니다.",
                boundary:
                    "단일 노드는 고가용성을 제공하지 않습니다. 실제 백업 복원과 장애 상황의 복구 시간은 검증하지 않았습니다.",
            },
            {
                number: "07",
                title: "이용권 변경 후에도 기존 구매와 환불 조건 보존",
                constraint:
                    "판매 이용권을 8회에서 4회로 바꾸더라도 기존 구매와 결제 대기 건의 횟수와 금액은 유지해야 합니다. 환불과 예약이 동시에 실행될 때 이용 이력도 일치해야 합니다.",
                decision:
                    "구매 당시 상품, 횟수, 금액을 저장하고, 이용권과 예약을 순서대로 잠가 취소, 횟수 차감, 사용 이력을 함께 반영합니다. 환불액은 구매 금액과 환불할 횟수로 계산합니다.",
                validation:
                    "4회권과 기존 8회권의 비례 환불(원 단위 미만 버림), 전환 전 결제 대기 중인 8회권의 조건 유지와 전체 횟수 환불 시 결제액 전액 환불을 테스트했습니다.",
                boundary:
                    "결제사 환불 완료 전에도 예약 취소와 이용 횟수 차감이 먼저 끝날 수 있습니다. 환불 상태를 DB에 보존하고 자동 복구와 관리자 재처리로 금전 환불을 이어가야 합니다.",
            },
            {
                number: "08",
                title: "공개 화면만 서버 렌더링하고 비공개 화면은 검색 제외",
                constraint:
                    "SPA에서는 공개 본문과 경로별 메타데이터가 없고 없는 경로도 HTTP 200을 반환했습니다.",
                decision:
                    "공개 상품과 클래스는 본문, canonical, Open Graph와 JSON-LD를 포함해 서버 렌더링했습니다. 회원, 결제와 관리자 화면은 브라우저 렌더링과 noindex를 유지했습니다.",
                validation:
                    "공개 HTML에 본문과 경로별 메타데이터가 포함되는지, 없는 상세와 임의 경로가 실제 404인지, 비공개 경로가 noindex를 유지하는지 서버 렌더링과 라우트 시나리오로 확인했습니다.",
                boundary:
                    "프런트엔드가 정적 파일 서버가 아닌 Node 프로세스가 되어 CPU, 메모리 모니터링과 프로세스 상태 확인이 필요합니다. 공개 문서 요청도 백엔드 공개 API 가용성에 의존합니다.",
            },
            {
                number: "09",
                title: "옵션별 가격과 재고, 결제 당시 주문 보존",
                constraint:
                    "옵션별 가격과 재고가 다르고, 옵션 변경 뒤에도 결제 당시 주문 조건을 재현해야 했습니다.",
                decision:
                    "선택 조합마다 SKU를 만들고 서버가 가격과 수량을 다시 계산했습니다. 주문에는 결제 당시 옵션, 추가 금액과 SKU를 저장했습니다.",
                validation:
                    "잘못된 옵션과 동시 재고 차감을 막고, 옵션 변경 뒤에도 기존 주문의 가격, 환불과 재고 복구가 유지되는지 확인했습니다.",
                boundary:
                    "SKU 조합은 500개로 제한했으며 관리자가 가격과 재고를 직접 관리해야 합니다.",
            },
            {
                number: "10",
                title: "운영시간과 휴일 규칙으로 예약 슬롯 자동 생성",
                constraint:
                    "예약 슬롯을 자동 생성하면서 기존 예약의 슬롯 연결과 동시 예약의 잠금 규칙을 유지해야 했습니다.",
                decision:
                    "운영시간, 휴무와 차단 규칙을 저장하고 조회할 때 예약 슬롯을 자동 생성했습니다. 기존 예약과 비활성 슬롯은 유지했습니다.",
                validation:
                    "운영시간, 휴일, 차단 시간과 동시 예약 조건에서 슬롯이 중복 생성되지 않는지 통합 테스트로 확인했습니다.",
                boundary: "조회가 몰리면 클래스 행 잠금 대기를 모니터링해야 합니다.",
            },
            {
                number: "11",
                title: "배송조회 재처리와 주문 완료 분리",
                constraint:
                    "배송조회 등록 실패는 고객 조회를 막고, 웹훅만으로 주문을 완료하면 적립과 후기 요청이 너무 일찍 실행될 수 있었습니다.",
                decision:
                    "배송조회 등록 실패는 DB 상태를 기준으로 배치가 재처리합니다. 서명을 검증한 웹훅은 배송 상태만 갱신하고 주문 완료는 관리자가 확정합니다.",
                validation:
                    "운송장 등록부터 배송 완료와 관리자 주문 완료까지 통합 테스트했습니다. 서명된 웹훅만 반영하고 관리자 확인 전에는 주문을 완료 처리하지 않는지 검증했습니다.",
                boundary:
                    "Delivery API 한 곳만 지원하며 운영 자격 증명, 장시간 장애와 웹훅 재전달은 미검증입니다.",
            },
            {
                number: "12",
                title: "스마트스토어 주문을 공유 재고에 한 번만 반영",
                screenshotId: "smartstore-reconciliation",
                constraint:
                    "스마트스토어 판매분을 반영하기 전에 자사몰 재고 수량을 보내면, 이미 판매된 수량이 재고에 다시 잡힐 수 있습니다. 변경 주문 재전송과 부분취소도 재고를 중복 변경할 수 있습니다.",
                decision:
                    "스마트스토어 변경 주문을 먼저 수집하고 상품 주문 번호를 식별자로 저장했습니다. 이미 반영한 수량과 이번에 반영할 수량의 차이만 재고에 적용한 뒤 내부 재고를 채널에 전송합니다.",
                validation:
                    "부분취소, 같은 변경 재수신, 재고 부족과 반품 검수 흐름을 공개 main 구현 코드와 ADR-0047에서 대조했습니다.",
                boundary:
                    "실제 네이버 자격 증명을 사용한 주문 수집과 재고 전송은 미검증입니다. 자사몰 상품과 연결되지 않은 주문이나 처음 보는 주문 상태는 재고를 바꾸지 않고 관리자 확인 대상으로 남깁니다.",
            },
            {
                number: "13",
                title: "외부 결제와 알림의 접수 및 최종 결과 분리",
                constraint:
                    "Toss 웹훅이나 NHN 발송 접수 응답만으로 완료를 확정하면 중복 웹훅, 정산 차이와 실제 수신 실패를 놓칠 수 있습니다.",
                decision:
                    "Toss 웹훅은 전송 ID로 한 번만 저장하고, 본문 대신 결제 조회 API로 상태를 확정합니다. 최근 7일 정산을 거래키로 대사하고, NHN 발송 접수는 최종 수신 결과 조회 전까지 별도 상태로 둡니다.",
                validation:
                    "중복 웹훅, 승인과 취소의 정산 불일치, NHN 최종 결과 조회 흐름을 공개 main 구현 코드와 ADR-0032, ADR-0033에서 대조했습니다.",
                boundary:
                    "Toss와 NHN 실제 자격 증명, 장시간 외부 장애, 운영 데이터 대사는 미검증입니다.",
            },
            {
                number: "14",
                title: "예약 부분취소 시 환불액과 잔여석 반영, 빈자리 알림",
                constraint:
                    "만석 회차의 취소로 자리가 생겨도 고객이 알기 어렵고, 여러 명 예약의 일부만 취소할 때 취소 인원에 맞춰 환불액과 잔여석을 계산해야 했습니다.",
                decision:
                    "빈자리가 실제로 생긴 순간 대기 신청을 종료하고 알림 작업을 함께 저장했습니다. 다인 예약은 남은 인원 비율로 예약금과 잔금을 다시 계산하고 취소한 인원만큼 잔여석을 늘립니다.",
                validation:
                    "전체취소, 부분취소, 예약 변경에서 빈자리로 전환되는 흐름과 최소 1명을 남기는 부분취소 흐름을 통합 테스트 코드와 PRD에서 확인했습니다.",
                boundary:
                    "빈자리 알림은 좌석을 선점하지 않습니다. 실제 NHN 발송과 Toss 부분환불 자격 증명 연동은 미검증입니다.",
            },
            {
                number: "15",
                title: "선택한 상품만 결제하고 재주문 조건을 다시 확인",
                constraint:
                    "장바구니 전체를 한 번에 결제하거나 이전 주문 가격을 그대로 쓰면 원하지 않는 상품이 포함되거나 현재 판매 조건과 어긋날 수 있습니다.",
                decision:
                    "선택한 항목과 장바구니 버전을 결제 요청에 묶고 미선택 상품은 유지합니다. 재주문은 현재 가격, 재고, 옵션을 확인한 뒤 다시 담습니다.",
                validation:
                    "선택 유지, 결제 전 장바구니 변경, 재주문 조건 변경을 Playwright E2E로 확인했습니다.",
                boundary:
                    "이전 주문의 가격과 옵션을 보장하지 않습니다. 실제 Toss 결제는 별도 검증 대상입니다.",
            },
            {
                number: "16",
                title: "AI 코드 변경을 파일 검사와 구조 검사로 확인",
                constraint:
                    "AI 에이전트가 긴 작업에서 초기 개발 규칙을 놓칠 수 있어, 파일을 수정할 때마다 검사 결과를 에이전트에 돌려줘야 했습니다.",
                decision:
                    "토스 기술 블로그의 피드백 루프를 참고해, 파일을 수정하면 ESLint와 컴파일 검사를, 작업을 끝내기 전에는 전체 diff와 ArchUnit 검사를 실행하도록 연결했습니다. 검사 범위는 파일 경로와 확장자로 고르고, 코드 수정과 설계 판단은 작업 중인 에이전트가 맡습니다.",
                validation:
                    "훅과 수동 명령이 같은 검사기를 사용합니다. 작업 중 커밋과 새 파일 포함, 변경이 없을 때 검사 생략, 반복 수정 요청 제한을 회귀 테스트 16건으로 확인합니다. 이 테스트와 계층 의존 규칙은 CI에서도 실행합니다.",
                boundary:
                    "검사 선택에 별도 LLM을 호출하지 않습니다. 자동 검사는 선언한 의존 규칙을 확인하며, 업무 책임과 과한 추상화는 전체 diff를 검토해 판단합니다.",
            },
        ],
        stack: [
            "Java 25",
            "Spring Boot 4.1",
            "Gradle",
            "Spring MVC",
            "Spring Data JPA",
            "MyBatis 4.1",
            "MySQL 8.4",
            "Redis 7.4",
            "React 19",
            "React Router 8",
            "TypeScript",
            "Testcontainers",
            "Playwright",
            "Spring REST Docs",
            "Spring Security / OAuth2",
        ],
        links: [
            projectSummariesById.happygallery.liveSite,
            {
                label: "GitHub 저장소",
                href: "https://github.com/ljkhyeong/happyGallery",
                note: "애플리케이션 코드와 테스트",
            },
            {
                label: "요구사항, ADR 및 회고 문서",
                href: "https://github.com/ljkhyeong/happyGallery/tree/main/docs",
                note: "공개 main의 요구사항, ADR, 실험과 회고 기록",
            },
            {
                label: "자동 배포 실행 기록",
                href: "https://github.com/ljkhyeong/happyGallery/actions/runs/37459985412",
                note: "main 982a88a2의 CI, 이미지 보안 검사와 k3s 롤링 배포",
            },
        ],
    },
    {
        ...projectSummariesById["youth-policy-mate"],
        systemTitle: "현재 구현 화면",
        systemNavLabel: "화면",
        screenshotNote:
            "2026년 10월 7일 공개 main 2065081을 로컬에서 실행해 촬영했습니다. 정책 목록과 상세는 온통청년에서 수집해 저장한 공개 데이터이며, 전체 정책 목록이나 최종 신청 자격을 보장하지 않습니다.",
        screenshots: [
            projectSummariesById["youth-policy-mate"].coverScreenshot,
            {
                id: "policies",
                src: "youth-policy-mate-policies.webp",
                label: "정책 목록",
                caption: `공개 정책 ${youthPolicyCoverage.policies}건의 분야 필터, 마감일 순 정렬과 D-day`,
                alt: `공개 정책 ${youthPolicyCoverage.policies}건을 분야 필터와 마감일 순으로 보여 주는 정책 목록 화면`,
                width: 780,
                height: 1688,
            },
            {
                id: "detail",
                src: "youth-policy-mate-detail.webp",
                label: "정책 상세",
                caption: "청년내일저축계좌의 출생일 기준 차이 안내와 온통청년 표기 조건",
                alt: "청년내일저축계좌 상세에서 공식 지침과의 출생일 기준 차이와 온통청년 표기 연령을 확인하는 화면",
                width: 780,
                height: 1688,
            },
            {
                id: "questions",
                src: "youth-policy-mate-questions.webp",
                label: "정책별 조건 질문",
                caption: "햇살론유스의 연령, 이용 대상, 소득 조건 질문",
                alt: "햇살론유스 신청 조건 확인에서 나이, 이용 대상, 소득 기준 질문이 열린 화면",
                width: 780,
                height: 1688,
            },
        ],
        architecture: {
            label: "웹, 서버, DB 분리와 API 타입 생성",
            title: "Next.js와 Spring Boot를 분리하고, 서버 DTO에서 TypeScript API 타입을 생성합니다.",
            description:
                "정책 수집, 조건 판정, 회원 저장과 알림을 기능별로 나누고 JDBC와 PostgreSQL 트랜잭션으로 처리합니다.",
            tradeoff: `정책 ${youthPolicyCoverage.policies}건을 수집했습니다. 질문은 검토한 정책 ${youthPolicyCoverage.questionPolicies}건의 일부 공통 요건만 다룹니다.`,
        },
        featuredProblemNumbers: ["01", "03", "04", "07"],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "1",
            },
            {
                id: "adr",
                label: "ADR",
                count: "3",
            },
            {
                id: "design",
                label: "설계",
                count: "11",
            },
            {
                id: "development",
                label: "구현 기록",
                count: "73",
            },
        ],
        documents: [
            {
                type: "README",
                label: "청년정책메이트 현재 구현 범위",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/README.md",
                note: "화면, 서버 모델, 자동화 검증과 아직 연결하지 않은 외부 기능",
            },
            {
                type: "PRD",
                label: "서울 청년정책 웹앱 MVP",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/PRD/0001_product-baseline/spec.md",
                note: "대상 사용자, 정책 범위, 자격 판정, 일정, 알림의 완료 기준과 제외 항목",
            },
            {
                type: "ADR",
                label: "웹, 서버, DB 구성",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/ADR/0001_%EA%B8%B0%EC%88%A0%EC%8A%A4%ED%83%9D%EA%B3%BC_%EC%B1%85%EC%9E%84_%EB%B6%84%EB%A6%AC.md",
                note: "Next.js 화면, Spring Boot 기능 모듈과 PostgreSQL 저장 범위",
            },
            {
                type: "구현 기록",
                label: "3단계 자격 판정과 근거",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/development/eligibility-decision.md",
                note: "가능, 불가, 추가 확인 필요 집계와 항목별 판단 근거",
            },
            {
                type: "구현 기록",
                label: "마감 알림 후보 계산",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/development/deadline-reminder-candidates.md",
                note: "한국 시간 기준 D-7, D-3, D-1 후보 날짜와 발송 시각 확인 기준",
            },
            {
                type: "구현 기록",
                label: "수집 공고의 AI 자동 추출",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/development/ai-rule-automation.md",
                note: "자동 추출 작업의 중단 후 재개와 결과 미확인 요청의 재호출 차단",
            },
            {
                type: "구현 기록",
                label: "수집 실패 재처리와 정책 보정",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/development/admin-collection-exceptions.md",
                note: "페이지 실패, 개정, 재처리 이력과 정책명, 운영 기관의 보정과 충돌 처리",
            },
            {
                type: "구현 기록",
                label: "정책 조건의 버전 관리와 검토",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/development/policy-rule-data.md",
                note: "질문과 판정표의 버전 관리, 원문 변경 시 재검토",
            },
            {
                type: "구현 기록",
                label: "AI 추출과 검토용 초안 저장",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/development/ai-rule-drafts.md",
                note: "OpenAI 호출, 예산 예약, 응답 보관과 관리자 검토 후 적용",
            },
        ],
        category: "개인 웹앱 프로젝트",
        role: "제품 요구사항, Next.js 화면, Java와 Spring Boot 서버, PostgreSQL 상태 모델과 자동화 테스트 구현",
        oneLine:
            "확인하지 못한 조건과 마감일은 ‘추가 확인 필요’로 표시하고, 이전 정책이나 AI 결과가 최신 데이터를 덮지 않도록 처리합니다.",
        status: {
            label: "그 밖의 구현",
            text: "이메일 발송 상태 조회, 수신 해제, 암호화 키 교체 명령을 공개 main에 반영했습니다. 정책 상세에는 온통청년에 표기된 연령, 소득, 취업 상태, 학력 조건을 참고로 보여 주며, 판정과 정렬에는 쓰지 않습니다.",
        },
        visualCaption:
            "실제 공개 정책을 저장한 로컬 DB로 촬영한 모바일 화면입니다. 조건 질문은 일부 요건을 확인하며 최종 신청 자격은 공식 안내에서 확인합니다.",
        problems: [
            {
                number: "01",
                title: "확인되지 않은 정책 조건을 신청 가능으로 단정하지 않음",
                screenshotId: "questions",
                constraint:
                    "정책 조건을 해석하지 못했거나 사용자 정보가 없을 때 단순 참과 거짓으로 처리하면 신청 가능 여부를 잘못 안내할 수 있습니다.",
                decision:
                    "정책별 질문의 답변을 공고별 판정표와 비교해 가능, 불가, 추가 확인 필요로 집계합니다. 기본 조건 입력은 생년월일로 연령만 비교하고, 판정에는 정책 개정, 조건 정의와 기준일을 함께 남깁니다.",
                validation: `조건 충족, 불충족, 정보 누락을 구분하고 정책 ${youthPolicyCoverage.questionPolicies}건의 질문과 판정 데이터를 연결했습니다.`,
                boundary: "환급액, 예외, 모집 기간 같은 최종 신청 조건은 질문에서 다루지 않습니다.",
            },
            {
                number: "02",
                title: "마감 날짜와 시각에 맞춘 알림 예약, 미확인 마감 제외",
                constraint:
                    "날짜 마감과 시각 마감을 같은 방식으로 비교하거나 상시 정책이나 기간 미확인 정책에 임의 마감일을 만들면 잘못된 알림을 보낼 수 있습니다.",
                decision:
                    "마감 날짜와 시간대, 수신 동의를 확인해 D-7, D-3, D-1 알림을 예약합니다. 관심 정책 해제와 동의 변경 시 관련 예약을 취소합니다.",
                validation:
                    "미확인 마감 제외, 중복 예약 방지, 저장 해제와 동의 변경 뒤 취소를 서버 테스트로 확인했습니다.",
                boundary:
                    "SMTP와 Resend 어댑터만 구현했고, 실제 발신 도메인과 외부 수신함 전달은 미검증입니다.",
            },
            {
                number: "03",
                title: "과거 정책 개정과 늦은 AI 결과의 덮어쓰기 차단",
                constraint:
                    "수집과 AI 처리가 비동기로 끝나면 이전 정책 개정이나 오래된 요청의 결과가 최신 정책을 덮을 수 있습니다.",
                decision:
                    "AI 조건 추출 결과를 저장할 때 정책 행을 잠그고 현재 개정, 원문과 최신 요청을 다시 확인합니다. 맞는 결과만 검토용 초안으로 만들고, 원문이 바뀌었거나 더 최근 요청이 있으면 응답 본문만 보관합니다.",
                validation:
                    "원문이 바뀌었거나 더 최근 요청이 있는 결과는 초안으로 저장되지 않는 것을 PostgreSQL 통합 테스트로 확인했습니다.",
                boundary: "실제 OpenAI API 키로 생성 품질과 운영 동작은 아직 확인하지 않았습니다.",
            },
            {
                number: "04",
                title: "AI 호출 예산 초과와 중복 과금 방지",
                constraint:
                    "외부 AI 호출 전에 비용을 먼저 예약하지 않으면 동시 요청이 예산을 초과할 수 있고, 응답이 유실된 요청을 바로 다시 보내면 중복 과금될 수 있습니다.",
                decision:
                    "PostgreSQL에서 최대 비용을 먼저 예약하고 외부 호출은 트랜잭션 밖에서 실행합니다. 결과 미확인 요청은 예약을 유지하고 다시 호출하지 않습니다. 만료된 자동 추출 작업의 늦은 완료 기록은 기존 실행 상태를 덮어쓰지 않습니다.",
                validation:
                    "예약과 정산, 결과 미확인 요청의 재호출 차단, 동시 배정, 중단 후 재개를 PostgreSQL과 모의 HTTP 서버로 확인했습니다.",
                boundary:
                    "OpenAI 호출과 자동 추출은 모의 HTTP 서버로만 검증했습니다. 실제 OpenAI 청구액과 대조하지는 않았습니다.",
            },
            {
                number: "05",
                title: "서버 DTO와 웹 API 타입 일치",
                constraint:
                    "웹과 서버가 요청 타입과 응답 타입을 따로 관리하면 자격 상태나 날짜 의미가 한쪽에서만 바뀔 수 있습니다.",
                decision:
                    "서버 DTO에서 OpenAPI와 TypeScript 타입을 생성하고 생성 결과가 최신인지 CI에서 확인합니다.",
                validation:
                    "공개 정책, 회원 저장, 일정, 알림 API의 생성 타입 검사와 웹 빌드 검증 기록을 확인했습니다.",
                boundary:
                    "개발 전용 예시 경로는 운영 빌드에서 제외합니다. 실제 OAuth와 SMTP 외부 연동은 별도 확인이 필요합니다.",
            },
            {
                number: "06",
                title: "수집 원문과 관리자 보정값 분리 저장",
                constraint:
                    "원문의 잘못된 정책명이나 운영 기관을 직접 고치면 원본과 수정 이유가 남지 않고, 다음 수집이 보정값을 되돌릴 수 있습니다.",
                decision:
                    "수집 페이지 실패, 개정, 재처리 이력을 남기고 정책명 또는 운영 기관의 보정값을 원본과 분리했습니다. 새 원본과 충돌하면 현재 값을 유지하고, 관리자가 보정 유지나 원본 적용을 선택하도록 했습니다.",
                validation:
                    "중복 재처리, 원본과 직전 개정 비교, 보정 사유와 작업자 기록, 새 원본 충돌, 정책 상세의 원문 차이 안내를 PostgreSQL API와 브라우저 시나리오로 확인했습니다.",
                boundary:
                    "현재 보정 범위는 공개 정책의 정책명과 운영 기관입니다. 실제 관리자 계정 연결과 다른 정책의 원문 검토는 남아 있습니다.",
            },
            {
                number: "07",
                title: "정책 조건을 코드 대신 버전 데이터로 관리",
                constraint:
                    "공고의 연령, 기간, 예외가 바뀔 때마다 정책별 Java 코드를 수정하면 질문과 판정이 어긋나기 쉽습니다.",
                decision:
                    "질문, 선택지, 판정표, 근거를 변경할 수 없는 버전으로 저장합니다. 관리자 검토 후 새 버전을 적용하고, 원문이 바뀌거나 기간이 끝나면 기존 규칙의 사용을 중단합니다.",
                validation:
                    "기존 정책의 데이터 전환, 질문과 목록의 동일 규칙 사용, 원문 변경 차단, 동시 적용 충돌 테스트를 확인했습니다.",
                boundary:
                    "기존 판정표로 표현할 수 없는 조건은 판정 코드를 추가해야 합니다. AI는 초안만 만들며 공고의 의미와 예외는 관리자가 검토합니다.",
            },
            {
                number: "08",
                title: "저장한 정책의 변경 내용을 저장 시점과 비교",
                constraint:
                    "저장 후 여러 번 개정된 정책을 직전 공고와만 비교하면 사용자가 처음 확인한 내용과의 차이를 놓칠 수 있습니다.",
                decision:
                    "관심 정책에 저장한 개정과 현재 공개 개정을 비교해 바뀐 항목만 보여줍니다. 비교 조회는 저장 기준, 읽음 상태, 알림 예약을 바꾸지 않습니다.",
                validation:
                    "회원 소유권과 개정 비교의 PostgreSQL 테스트, 데스크톱과 모바일 화면 검증 기록을 확인했습니다.",
                boundary:
                    "다른 정책번호로 등록된 다음 연도나 다음 회차 공고는 자동 연결하지 않습니다.",
            },
        ],
        stack: [
            "Java 25",
            "Spring Boot 4.1.1",
            "Spring MVC",
            "Spring JDBC",
            "Flyway",
            "PostgreSQL 18",
            "Next.js 16.3",
            "React 19.2",
            "TypeScript 5.9",
            "OpenAPI",
            "Testcontainers",
            "GitHub Actions",
        ],
        links: [
            {
                label: "청년정책메이트 GitHub 저장소",
                href: "https://github.com/ljkhyeong/youth-policy-mate",
                note: "Next.js 웹, Spring Boot 서버, 문서와 자동화 테스트",
            },
            {
                label: "요구사항 및 설계 문서",
                href: "https://github.com/ljkhyeong/youth-policy-mate/tree/main/docs",
                note: "PRD, ADR, 기능별 설계와 구현 범위",
            },
            {
                label: "공개 main CI 결과",
                href: "https://github.com/ljkhyeong/youth-policy-mate/actions/runs/37401517891",
                note: "공개 main 2065081의 웹과 서버 검사 결과",
            },
        ],
    },
    {
        ...projectSummariesById["hope-commit"],
        systemTitle: "HTML 리뷰 화면",
        systemNavLabel: "리뷰 화면",
        screenshotNote: "실제로 생성한 HTML 리뷰 화면입니다.",
        screenshots: [
            projectSummariesById["hope-commit"].coverScreenshot,
            {
                id: "review-evidence",
                src: "hope-commit-review-evidence.webp",
                label: "참조한 변경 코드",
                caption: "리뷰 설명, 참조한 파일과 코드 줄",
                alt: "Hope Commit HTML에서 리뷰 설명, 참조한 파일과 코드 줄을 확인하는 모습",
                width: 1440,
                height: 900,
            },
        ],
        architecture: {
            label: "검토 범위",
            title: "지정한 커밋의 diff만 리뷰합니다.",
            description:
                "일반 커밋은 첫 부모, 최초 커밋은 Git 빈 트리, 병합 커밋은 사용자가 고른 부모를 비교 기준으로 확정합니다. 작업 파일이 바뀌어도 입력한 커밋과 비교 기준에 저장된 코드만 사용합니다.",
            tradeoff:
                "같은 커밋의 변경 내용을 다시 수집하려면 해당 커밋이 로컬에 있어야 합니다. CI, 이슈와 토론은 자동으로 가져오지 않습니다.",
        },
        featuredProblemNumbers: ["01", "02", "03", "04"],
        documentGroups: [
            {
                id: "feature",
                label: "Commit Diff 실행 기준",
                count: "1",
            },
            {
                id: "security",
                label: "보안 정책",
                count: "1",
            },
            {
                id: "license",
                label: "라이선스 및 원본 고지",
                count: "2",
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
                type: "실행 절차",
                label: "Commit Diff 실행 절차",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/plugins/hope/skills/commit/SKILL.md",
                note: "입력 가능한 커밋, 비교 대상, 코드 수집, 결과 검증과 HTML 저장 조건",
            },
            {
                type: "Security",
                label: "보안 정책",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/SECURITY.md",
                note: "비공개 설정 경로와 토큰이나 인증 키로 판단되는 문자열을 분석 입력과 HTML에서 제외하는 기준",
            },
            {
                type: "Notice",
                label: "원본 프로젝트 고지",
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/NOTICE",
                note: "SeungIl 님이 개발한 원본 Hope의 저작권, MIT 라이선스와 비공식 포크 관계",
            },
        ],
        category: "오픈소스 및 개발 도구",
        role: "SeungIl 님의 Hope 6.0.0 포크에 로컬 커밋 비교, 참조한 코드를 표시하는 HTML 리뷰와 자동화 테스트 추가",
        oneLine:
            "지정한 커밋의 diff만 리뷰하고, 참조한 파일과 코드 줄을 검증한 결과를 새 HTML로 저장합니다.",
        status: {
            label: "공개 상태",
            text: "SeungIl 님의 Hope 6.0.0에서 파생한 비공식 포크이며, 제가 추가한 Commit Diff는 README와 NOTICE에 원본과 구분했습니다.",
        },
        visualCaption: "커밋 확정 → 변경 수집 → 참조한 코드 줄 검증 → HTML 저장 순서입니다.",
        problems: [
            {
                number: "01",
                title: "지정한 커밋의 diff만 리뷰",
                constraint:
                    "스테이징한 파일, 수정 중인 파일과 추적하지 않는 파일을 함께 읽으면 특정 커밋에 없던 내용이 검토 결과에 섞일 수 있습니다.",
                decision:
                    "커밋 종류에 맞는 비교 기준(부모 커밋)을 확정하고 입력한 커밋과 비교 기준에 저장된 코드만 읽습니다. textconv와 색상 출력을 끄고 UTF-8이 아닌 경로를 거절합니다.",
                validation:
                    "짧은 커밋 ID, 최초 커밋과 병합 커밋, 파일 이름 변경, 긴 커밋 메시지 분할 표시, 파일과 심볼릭 링크 사이의 전환을 테스트했습니다.",
                boundary:
                    "로컬 저장소에 존재하는 한 커밋만 검토합니다. 원격 CI 결과, 이슈와 토론 내용은 자동으로 수집하지 않습니다.",
            },
            {
                number: "02",
                title: "리뷰 크기 제한과 자격 증명 제외",
                constraint:
                    "대용량 변경은 AI 분석 입력을 지나치게 키우고, 자격 증명이 분석 입력과 HTML에 노출될 수 있습니다.",
                decision:
                    "파일 수, 줄 수와 본문 크기에 상한을 두고 비공개 경로와 자격 증명은 분석과 HTML에서 제외합니다.",
                validation:
                    "npm, PyPI, 네트워크 자격 증명 경로와 토큰 형식, 파일 크기와 추가 코드 조회 상한을 테스트했습니다. 바이너리 파일 499개가 제외되는 실제 커밋에서도 HTML 리뷰가 생성되는 것을 확인했습니다.",
                boundary:
                    "제외한 파일의 구현 내용은 분석하지 않습니다. 필요한 근거가 제한 범위 밖에 있으면 결과에 확인하지 못한 범위로 표시합니다.",
            },
            {
                number: "03",
                title: "리뷰가 참조한 파일과 코드 줄 검증",
                screenshotId: "review-evidence",
                constraint:
                    "분석 모델이 이전 대화나 추측을 섞으면 변경 코드에 근거가 없는 지적(환각)이 생길 수 있습니다.",
                decision:
                    "이전 대화를 전달하지 않은 별도 AI 분석에서 리뷰 설명을 받습니다. 각 설명을 실제 변경 파일과 줄에 연결해 JSON Schema와 수집 범위로 검증합니다.",
                validation:
                    "수집하지 않은 파일과 줄, 잘못된 범위와 형식, 과도하게 긴 설명을 거절하는지 테스트했습니다.",
                boundary: "이전 대화 없이 별도 AI 분석을 실행할 수 없으면 검토를 중단합니다.",
            },
            {
                number: "04",
                title: "검증을 통과한 리뷰만 저장하고 중단 작업 재개",
                constraint:
                    "상태 저장 중 중단되면 빈 파일이 남거나 수집을 다시 해야 합니다. 동시 실행은 기존 결과를 덮어쓸 수 있습니다.",
                decision:
                    "상태는 임시 파일에 쓴 뒤 원자적으로 교체하고 중단된 실행은 수집 지점부터 재개합니다. 저장 직전에는 실행 식별자와 검토 버전이 처음 확인한 값과 같은지 다시 확인합니다.",
                validation:
                    "상태 기록 단계별 중단과 재개, 검증 전후 대상 변경과 잠금 소유권 상실을 재현했습니다. 기존 출력 경로, 심볼릭 링크와 동시 저장에서도 다른 실행의 작업 디렉터리와 기존 HTML이 바뀌지 않는지 확인했습니다.",
                boundary:
                    "HTML은 로컬 파일로만 생성합니다. 원격 저장소 게시, 브랜치 생성, 푸시와 리뷰 댓글 작성은 하지 않습니다.",
            },
        ],
        stack: [
            "JavaScript",
            "Node.js 22 이상",
            "Git CLI",
            "JSON Schema",
            "HTML / CSS",
            "Node Test Runner",
            "Playwright",
        ],
        links: [
            {
                label: "Hope Commit GitHub 저장소",
                href: "https://github.com/ljkhyeong/hope-commit",
                note: "Commit Diff 구현, 자동화 테스트와 플러그인 패키지",
            },
            {
                label: "Hope Commit Node.js 22 CI 결과",
                href: "https://github.com/ljkhyeong/hope-commit/actions/runs/33632058777",
                note: "공개 v5.0.2에서 자동화 테스트 343개가 통과한 GitHub Actions 결과",
            },
            {
                label: "원본 Hope 저장소",
                href: "https://github.com/dkstm95/hope",
                note: "SeungIl 님이 개발한 원본 프로젝트",
            },
        ],
        linkNote:
            "SeungIl 님이 개발한 Hope 6.0.0을 개인 커밋 검토 용도에 맞게 보완한 비공식 포크입니다. 원본 Hope 프로젝트는 이 포크를 공식적으로 보증하거나 유지보수하지 않습니다.",
    },
    {
        ...projectSummariesById["intent-trace"],
        systemTitle: "기록 조회 화면",
        systemNavLabel: "화면",
        architecture: {
            label: "공개 기준",
            title: "변경 근거를 커밋과 코드 위치에 연결하고, 확인 후 코드가 바뀌면 기록 공개를 차단합니다.",
            description:
                "사용자 요청, 변경 근거와 출처, 전체 커밋 해시, 저장소 스냅샷, 파일과 줄의 내용 해시를 한 기록에 저장합니다. 검증은 실행한 명령, 종료 코드, 실행 시간, 출력 해시와 요약으로 남깁니다.",
            tradeoff:
                "공개 요청은 클라이언트가 제출한 코드 해시로 검사하고, GitHub 원본 코드 비교는 별도 조회에서 실행합니다. 이슈, PR, CI는 읽기만 하며, 서버는 테스트 실행 사실까지 검증하지 않습니다. 메모리 세션을 쓰는 단일 인스턴스만 지원합니다.",
        },
        featuredProblemNumbers: ["01", "02", "05", "07"],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "6",
            },
            {
                id: "adr",
                label: "ADR",
                count: "13",
            },
            {
                id: "operations",
                label: "운영 및 릴리스",
                count: "3",
            },
        ],
        documents: [
            {
                type: "README",
                label: "IntentTrace 사용 및 현재 범위",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/README.md",
                note: "기록 수명주기, REST와 MCP, GitHub 게시, IntelliJ 사용 방법",
            },
            {
                type: "PRD",
                label: "변경 의도 기록 MVP",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/PRD-0001-intent-trace-mvp.md",
                note: "원문 대화 없이 사용자 요청, 판단, 코드 근거와 검증을 저장하는 범위",
            },
            {
                type: "ADR",
                label: "커밋과 코드 근거에 묶인 변경 기록",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/ADR-0001-evidence-bound-change-record.md",
                note: "전체 커밋 해시, 스냅샷, 파일과 줄 해시를 기록에 묶는 결정",
            },
            {
                type: "ADR",
                label: "GitHub Check Run 게시",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/ADR-0002-github-check-run-publication.md",
                note: "PR HEAD 확인과 기존 Check Run 갱신 기준",
            },
            {
                type: "ADR",
                label: "GitHub OAuth와 메모리 세션",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/ADR-0005-github-web-oauth-memory-session.md",
                note: "사용자 승인, 토큰 갱신과 세션 저장 범위",
            },
            {
                type: "ADR",
                label: "GitHub 이슈, PR과 Actions 결과 조회",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/ADR-0012-github-context-read.md",
                note: "기존 GitHub 연결과 읽기 권한으로 초안 자료와 실행된 CI 결과만 조회하는 기준",
            },
            {
                type: "PRD",
                label: "IntelliJ 현재 줄 의도 조회",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/PRD-0004-intellij-line-intent.md",
                note: "커밋된 현재 파일의 한 줄에서 공개 변경 기록을 찾는 범위",
            },
            {
                type: "PRD",
                label: "IntelliJ 변경 기록 탐색",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/PRD-0005-record-browser.md",
                note: "저장소, 파일, 상태별로 팀 공개 기록과 내 비공개 기록을 조회하는 범위",
            },
            {
                type: "Runbook",
                label: "팀 단일 인스턴스 배포",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/operations/team-deployment.md",
                note: "PostgreSQL, Caddy, 백업, 복구와 롤백 절차",
            },
            {
                type: "Release",
                label: "릴리스 생성과 검증",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/operations/release.md",
                note: "버전 정합성, 실행 JAR과 SHA-256 게시 절차",
            },
            {
                type: "Security",
                label: "보안 정책",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/SECURITY.md",
                note: "원문 대화, 숨은 추론과 자격 증명을 저장하지 않는 공개 원칙",
            },
        ],
        category: "오픈소스 및 개발 도구",
        role: "Kotlin Spring 서버, 웹 기록 조회와 원본 비교, GitHub 인증과 게시, IntelliJ, Zed, MCP 연동 구현",
        oneLine:
            "사용자 요청, 변경 근거와 검증 결과를 코드 위치에 기록하고 작성자가 확인한 기록을 팀에 공개합니다.",
        status: {
            label: "그 밖의 구현",
            text: "공개 main 4be09d2에 Zed 편집기 hover와 PR 코드 줄 주석 게시를 추가하고, 웹 화면을 Thymeleaf로 바꿨습니다. 실제 Zed 앱과 GitHub 게시는 확인하지 않았습니다.",
        },
        visualCaption:
            "원문 대화와 숨은 추론은 저장하지 않습니다. 작성자 확인 뒤 코드가 바뀌면 공개를 차단합니다.",
        problems: [
            {
                number: "01",
                title: "사용자 요청, 변경 근거, 검증 요약만 저장",
                constraint:
                    "AI 대화 전체와 숨은 추론을 저장하면 개인정보와 자격 증명이 섞일 수 있고, 코드 변경 이유를 찾기도 어렵습니다.",
                decision:
                    "사용자 요청, 확인 가능한 변경 근거와 출처, 검증 요약만 정해진 필드에 저장했습니다. 원문 대화, 숨은 추론과 검증 원문 출력은 저장하지 않습니다.",
                validation:
                    "민감한 필드, 허용 길이, 중첩 값과 Markdown 출력에 원문이 포함되지 않는지 테스트했습니다.",
                boundary:
                    "변경 근거와 출처는 확인 가능한 사실만 담습니다. 설명할 수 없는 내부 추론을 복원하거나 저장하지 않습니다.",
            },
            {
                number: "02",
                title: "변경 기록에 커밋 해시, 파일 경로, 줄 범위 저장",
                screenshotId: "evidence",
                constraint:
                    "짧은 커밋 ID나 파일명만 남기면 이후 코드가 바뀌었을 때 어느 상태를 설명하는 기록인지 판단하기 어렵습니다.",
                decision:
                    "전체 커밋 해시, 저장소 스냅샷, 파일 경로, 줄 범위와 내용 해시를 저장합니다. 작성자가 확인한 뒤 코드가 바뀌면 공개하지 않습니다.",
                validation:
                    "불완전한 커밋 ID, 다른 스냅샷, 잘못된 줄 범위와 해시 형식을 거절하는 시나리오를 테스트했습니다.",
                boundary:
                    "공개 요청에는 클라이언트가 제출한 코드 해시를 사용합니다. 별도 근거 조회에서 GitHub 원본과 비교하며 테스트 실행 여부는 서버가 확인하지 않습니다.",
            },
            {
                number: "03",
                title: "초안과 GitHub Check Run의 중복 생성 방지",
                constraint:
                    "네트워크 재시도와 동시 요청이 같은 초안이나 GitHub Check Run을 여러 건 만들 수 있습니다.",
                decision:
                    "멱등 키(requestId)가 같은 요청은 본문을 비교하고 DB 유일 제약과 낙관적 잠금을 적용했습니다. 같은 PR에는 기존 Check Run ID를 저장해 갱신하고, 코드 줄 주석은 최대 50개까지 게시하며 다시 게시해도 중복 추가하지 않습니다.",
                validation:
                    "같은 요청 재전송, 같은 ID의 다른 요청 본문 충돌, 동시 상태 변경과 Check Run 반복 게시를 테스트했습니다.",
                boundary:
                    "Fork에서 만든 PR의 Check Run 게시는 지원하지 않습니다. 게시 요청 직렬화도 단일 앱 프로세스 안에서만 보장합니다.",
            },
            {
                number: "04",
                title: "GitHub 사용자와 저장소 권한을 요청마다 확인",
                constraint:
                    "팀 기록에는 저장소별 비공개 초안이 있어 단순 공유 토큰만으로 작성자, 읽기 권한, 쓰기 권한을 구분할 수 없습니다.",
                decision:
                    "GitHub OAuth로 사용자를 확인하고 저장소 권한을 요청마다 조회합니다. 토큰과 세션은 메모리에 보관하고 승인 취소 웹훅이나 사용자 요청으로 세션을 종료합니다.",
                validation:
                    "PKCE와 state, 토큰 갱신, 작성자 소유권, 저장소 읽기와 쓰기 권한을 테스트했습니다.",
                boundary:
                    "서버를 재시작하면 세션이 사라집니다. 공유 세션 저장소가 없어 다중 인스턴스와 무중단 배포는 지원하지 않습니다.",
            },
            {
                number: "05",
                title: "PR, 웹, IDE에서 코드 변경 이유와 검증 기록 조회",
                constraint:
                    "변경 기록이 별도 화면에만 있으면 PR 리뷰와 이후 코드 탐색 중 필요한 시점에 찾기 어렵습니다.",
                decision:
                    "PR HEAD가 기록 커밋과 같을 때 Check Run으로 게시합니다. 웹과 IntelliJ에서 검색어, 상태, 파일로 기록을 찾고, 검색 조건을 유지한 채 상세, 원본, 이력으로 이동합니다. Zed에서는 커밋된 줄의 hover로 공개 기록 요약을 보여 줍니다.",
                validation:
                    "웹의 권한 확인, 필터, 중단된 이력 조회의 이어 읽기 검증 기록과 IntelliJ, Zed 연결 검증 기록을 확인했습니다.",
                boundary:
                    "IntelliJ 검색, 이전 커밋 조회와 Zed hover는 자동화 테스트 기준이며 실제 IDE와 Zed 앱 확인은 남아 있습니다. IntelliJ 플러그인에서는 기록을 만들거나 고칠 수 없고, 로그인 토큰도 직접 입력해야 합니다.",
            },
            {
                number: "06",
                title: "GitHub 자료를 읽어 초안 근거로 사용하고 기록을 Markdown으로 저장",
                constraint:
                    "이슈나 PR의 요구사항과 이미 실행된 CI 결과를 기록 작성 때 다시 옮기면 출처가 빠지거나 다른 커밋의 결과가 섞일 수 있습니다.",
                decision:
                    "기존 GitHub 세션의 읽기 권한으로 이슈와 PR을 읽고, 전체 커밋 해시에 맞는 Actions 결과를 조회합니다. 웹 저장은 REST와 같은 Markdown 생성기와 기록 열람 권한을 사용합니다.",
                validation:
                    "저장소, 번호, 커밋 불일치, 권한 부족, 페이지 이동과 로그인 후 복귀를 테스트했습니다. Markdown 본문, 헤더, 파일명과 비공개 기록 차단도 확인했습니다.",
                boundary:
                    "CI를 새로 실행하지 않고, 로그와 아티팩트도 저장하지 않습니다. 실제 브라우저 저장 대화상자, 외부 GitHub 게시와 배포는 확인하지 않았습니다.",
            },
            {
                number: "07",
                title: "파일명과 줄이 바뀌어도 변경 근거 추적",
                constraint:
                    "파일 이름이나 줄 위치가 바뀌면 같은 코드에 남긴 변경 기록을 찾기 어렵습니다. 유사한 코드에 잘못 연결할 가능성도 있습니다.",
                decision:
                    "파일명이 바뀌어도 내용 해시가 같으면 연결하고, 줄이 이동한 코드는 전체 줄이 한 곳에서만 일치할 때 연결합니다. 원본 커밋과 조회 커밋의 위치를 함께 보여주고 과거 테스트를 현재 검증으로 표시하지 않습니다.",
                validation:
                    "이름 변경, 줄 이동, 중복 코드 조각, 페이지별 조회의 서버 통합 테스트를 확인했습니다. IntelliJ는 조회 당시의 서버, 커밋, 파일, 줄로 웹 이력 화면을 엽니다.",
                boundary:
                    "수정되거나 여러 곳에 중복된 코드는 유사도로 추정해 연결하지 않습니다. 작업 중인 파일이 HEAD와 다르면 현재 줄 조회를 중단합니다.",
            },
        ],
        stack: [
            "Kotlin 2.3.21",
            "JDK 21",
            "Spring Boot 4.1.1",
            "Spring AI MCP 2.0.1",
            "Spring MVC",
            "Thymeleaf",
            "Spring JDBC",
            "Flyway",
            "PostgreSQL 17 / H2",
            "Docker Compose / Caddy",
            "IntelliJ Platform 2025.3.2",
            "Zed / MCP stdio",
        ],
        links: [
            {
                label: "IntentTrace GitHub 저장소",
                href: "https://github.com/ljkhyeong/intent-trace",
                note: "서버, Codex 연동, IntelliJ 플러그인과 운영 문서",
            },
            {
                label: "공개 main 검증 결과",
                href: "https://github.com/ljkhyeong/intent-trace/actions/runs/37591867661",
                note: "공개 main 4be09d2의 서버, IntelliJ, Zed 검증",
            },
            {
                label: "v0.7.0 릴리스",
                href: "https://github.com/ljkhyeong/intent-trace/releases/tag/v0.7.0",
                note: "실행 JAR, IntelliJ 플러그인 ZIP과 SHA-256 파일",
            },
        ],
        screenshots: [
            projectSummariesById["intent-trace"].coverScreenshot,
            {
                id: "evidence",
                src: "intent-trace-evidence.webp",
                label: "GitHub 코드와 비교",
                caption: "저장소 스냅샷과 관련 코드 줄의 해시를 GitHub 커밋과 비교한 결과",
                alt: "스냅샷 해시와 관련 코드 줄 해시가 모두 일치한다고 표시한 비교 화면",
                width: 1440,
                height: 960,
            },
            {
                id: "github-context",
                src: "intent-trace-github-context.webp",
                label: "GitHub 이슈, PR, CI 조회",
                caption: "이슈와 PR의 요청 내용, 지정 커밋의 Actions 결과를 함께 확인하는 화면",
                alt: "IntentTrace에서 GitHub 이슈, PR, CI 결과를 조회하는 화면",
                width: 1440,
                height: 960,
            },
        ],
        screenshotNote:
            "공개 main의 서버 통합 테스트가 생성한 HTML을 2026년 10월 9일 로컬 Chrome에서 촬영했습니다. 저장소, 커밋, 기록은 테스트 데이터이며 실제 GitHub 게시 결과가 아닙니다.",
    },
    {
        ...projectSummariesById.warrant,
        category: "BEINTECH / LG CNS 컨소시엄 공공 SI",
        role: "형사사법정보시스템(KICS) 요청을 통신사와 영장집행포털 형식으로 변환해 보내고, 제출 자료를 KICS에 반영하는 서버와 Spring Batch 구현",
        oneLine:
            "KICS 요청을 통신사와 영장집행포털 규격으로 변환해 보내고, 제출 자료를 KICS에 반영했습니다.",
        status: {
            label: "공개 범위",
            text: "BEINTECH 소속으로 LG CNS 컨소시엄에 참여 중입니다. 담당 연계 구조, 역할과 성능 테스트 요약을 공개하며 접속 주소, 설정, 소스와 내부 문서는 제외했습니다.",
        },
        systemTitle: "KICS와 기관 간 요청 및 자료 연계 흐름",
        systemNavLabel: "업무 흐름",
        visualCaption: "KICS 요청과 기관 제출 자료가 분리된 망 사이를 오가는 흐름입니다.",
        problems: [
            {
                number: "01",
                title: "누적 전송 이력의 OFFSET 조회 비용 개선",
                constraint:
                    "전송 상태와 수신 자료가 계속 쌓이면 OFFSET이 커질수록 뒤쪽 페이지 조회 비용이 증가합니다. 기존 업무 화면은 번호 이동도 유지해야 했습니다.",
                decision:
                    "신규 화면은 마지막 전송 ID 다음부터 조회(No Offset)했습니다. 기존 번호 이동 화면은 키만 먼저 페이지 단위로 조회한 뒤 그 키로 본문을 조회했습니다.",
                validation:
                    "신규 화면은 다음 페이지가 마지막 전송 ID 이후부터 이어지는지, 기존 화면은 쿼리를 바꾼 뒤에도 페이지 이동과 목록 결과가 같은지 확인했습니다.",
                boundary:
                    "마지막 전송 ID 다음부터 조회하는 방식은 임의 페이지 이동이 어렵고, 키와 본문 조회를 나누면 SQL이 복잡해집니다. 조회량이 적은 화면은 기존 OFFSET 쿼리를 유지했습니다.",
            },
            {
                number: "02",
                title: "공통 처리와 기관별 변환 코드 분리",
                constraint:
                    "수신 자료와 통신사실확인자료의 화면, 인터페이스와 Spring Batch 흐름이 비슷해 기능마다 같은 분기와 변환 코드를 만들 가능성이 컸습니다.",
                decision:
                    "공통 처리 흐름은 공통 메서드와 상태값으로 묶고 조회, 변환과 전송은 역할별 클래스로 나눴습니다. 기관별로 다른 데이터 형식과 처리 규칙은 별도 구현으로 분리했습니다.",
                validation:
                    "후속 수신 자료 기능에서 공통 메서드, 상태값과 오류 코드를 재사용하고 기관별 조회, 변환, 전송 코드만 추가한 것을 구현 코드로 확인했습니다.",
                boundary: "공통 구조를 설계하는 동안 첫 기능의 개발 속도는 느려졌습니다.",
            },
            {
                number: "03",
                title: "요청 상태 저장보다 먼저 도착한 PDF 완료 응답 재조회",
                constraint:
                    "외부 PDF 변환을 요청한 뒤 애플리케이션이 요청 상태를 DB에 저장하기 전에 완료 응답이 도착하면, 대상 요청을 찾지 못해 정상 변환 결과가 누락될 수 있었습니다.",
                decision:
                    "Spring Retry로 요청 상태를 다시 조회하고, 백오프와 지터(무작위 지연)로 재조회 시점을 분산했습니다.",
                validation:
                    "완료 응답이 요청 상태 저장보다 먼저 도착해도 재조회 후 결과가 반영되는 것을 확인했습니다.",
                boundary:
                    "재시도는 정해진 횟수까지만 합니다. 재시도 후에도 요청 상태가 없으면 실패로 기록하고 운영자가 확인하는 절차가 필요합니다.",
            },
            {
                number: "04",
                title: "이중화 서버의 작업 선점과 중단 작업 재처리",
                constraint:
                    "인터페이스 서버가 이중화되면서 한 프로세스 안에서만 동작하는 ReentrantLock으로는 서버 간 중복 실행을 막을 수 없었습니다. 외부 API 대기 중 DB 커넥션을 오래 점유하는 문제도 피해야 했습니다.",
                decision:
                    "FOR UPDATE SKIP LOCKED로 잠긴 행을 건너뛰고 N(처리대상)을 P(처리 중)로 바꿔 선점했습니다. 외부 API는 트랜잭션 밖에서 호출했습니다. 선점 상태 저장과 완료 후 처리 상태 초기화는 각각 별도 트랜잭션으로 처리했습니다.",
                validation: warrantPerformanceSummary,
                boundary:
                    "서버가 중단되면 해당 작업은 설정한 경과 시간과 점검 주기가 지난 뒤에 재처리됩니다.",
            },
        ],
        stack: [
            "Java 11",
            "Spring Boot 2.6",
            "Spring Batch",
            "Oracle Database",
            "WebSquare",
            "Maven",
        ],
        links: [],
    },
    {
        ...projectSummariesById.defense,
        systemTitle: "수용자 인적정보 및 영장정보 연계 배치 흐름",
        systemNavLabel: "연계 흐름",
        category: "BEINTECH / 국방부 SI",
        role: "군교정 업무 화면, 세 기관 수용자 정보 연계 배치와 중단 배치 재실행",
        oneLine:
            "군사법원, 군검찰과 군사경찰의 수용자 자료를 군교정 DB에 반영하고, CSRF 토큰 검증과 Presigned URL 기반 대용량 파일 업로드를 구현했습니다.",
        status: {
            label: "공개 범위",
            text: "BEINTECH에서 수행한 국방부 SI입니다. 운영 데이터와 세부 연계 규격은 제외하고 담당한 개발과 운영 업무만 공개했습니다.",
        },
        problems: [
            {
                number: "01",
                title: "세 기관의 수용자 및 영장정보 연계 배치",
                constraint:
                    "군사법원, 군검찰, 군사경찰마다 수용 대상자의 인적정보와 영장정보의 형식과 전달 시점이 달랐고, 연계가 중단되면 수용과 후속 군교정 업무를 처리할 수 없었습니다.",
                decision:
                    "세 기관의 인적정보와 영장정보를 검증해 군교정 DB에 반영했습니다. Jenkins에서 실패 단계를 확인해 해당 기관 배치만 재실행했습니다.",
                validation:
                    "세 기관의 인적정보와 영장정보가 검증 후 군교정 DB에 반영되는 것을 확인했습니다.",
                boundary:
                    "기관별 자료 형식이 바뀌면 해당 기관의 검증과 변환 규칙을 함께 수정해야 합니다.",
            },
            {
                number: "02",
                title: "WebSquare 상태 변경 요청에 CSRF 토큰 적용",
                constraint:
                    "위조 요청으로 WebSquare의 저장 및 변경 기능이 실행되는 것을 막아야 했습니다. 모든 상태 변경 요청에 CSRF 토큰이 필요했습니다.",
                decision:
                    "CSRF 토큰을 WebSquare 공통 요청에 포함하고 누락되거나 일치하지 않는 요청은 필터에서 차단했습니다.",
                validation:
                    "정상 토큰, 토큰 누락과 불일치 요청을 각각 실행해 정상 요청만 처리되고 나머지는 필터에서 차단되는 것을 확인했습니다.",
                boundary:
                    "새 상태 변경 요청을 추가할 때마다 WebSquare 공통 요청 로직으로 토큰을 보내는지 확인해야 합니다.",
            },
            {
                number: "03",
                title: "Presigned URL로 대용량 파일 직접 업로드",
                constraint:
                    "대용량 파일 본문이 업무 서버를 거치면 요청마다 메모리, 디스크, 네트워크 입출력을 사용하고, 동시에 업로드할 때 서버 부하가 커질 수 있었습니다. 기존 파일 저장 시스템은 유지해야 했습니다.",
                decision:
                    "업로드 권한과 파일 정보를 검증한 뒤 Presigned URL을 발급해 브라우저가 파일 저장 시스템으로 직접 전송하게 했습니다.",
                validation:
                    "권한이 없는 요청에는 Presigned URL을 발급하지 않고, 허용된 파일은 업무 서버를 거치지 않고 저장되는 것을 확인했습니다.",
                boundary:
                    "Presigned URL의 만료 시간과 업로드 조건, 업로드 완료 상태를 별도로 관리해야 합니다. 브라우저와 파일 저장 시스템 사이에서 실패한 업로드를 다시 확인하는 절차도 필요합니다.",
            },
            {
                number: "04",
                title: "Jenkins, JEUS와 Tibero로 배치 중단 단계 확인",
                constraint:
                    "통합 모니터링이 없는 폐쇄망에서 화면 오류만으로는 장애 단계를 찾기 어려웠습니다.",
                decision:
                    "Jenkins에서 실패 시각과 단계를 확인하고 같은 시각의 JEUS 로그와 Tibero 상태를 대조했습니다. 필요할 때는 기관 송수신 시각도 확인했습니다.",
                validation:
                    "실제 운영 장애에서 기관 데이터 수신, 배치 시작과 종료, DB 상태 변경, 화면 조회 순서로 확인해 누락되거나 중단된 단계를 찾았습니다. 재처리 후 정상 반영까지 확인했습니다.",
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
    },
    {
        ...projectSummariesById.webrtc,
        category: "교육 프로젝트",
        role: "mediasoup RTP-HLS 변환 서버와 WebRTC, HLS React 재생 화면 구현",
        oneLine:
            "현재 강의는 WebRTC로 재생하고, mediasoup의 RTP 출력은 FFmpeg와 GStreamer로 HLS로 변환해 지난 구간 다시보기에 사용했습니다.",
        status: {
            label: "프로젝트 상태",
            text: "2023년 교육 팀 프로젝트로 개발과 시연을 완료했습니다. 현재 운영하지 않으며 구현은 공개 저장소에서 확인할 수 있습니다.",
        },
        problems: [
            {
                number: "01",
                title: "WebRTC 실시간 재생과 HLS 지난 구간 다시보기",
                constraint:
                    "현재 강의는 낮은 지연으로 재생하면서 수강자가 놓친 구간은 이전 시점으로 돌아가 볼 수 있어야 했습니다. WebRTC 실시간 경로와 저장 가능한 HLS 다시보기 경로를 별도로 구성해야 했습니다.",
                decision:
                    "현재 영상은 mediasoup와 WebRTC로 재생했습니다. mediasoup의 RTP 출력은 FFmpeg와 GStreamer를 이용해 HLS로 변환하고 지난 구간 다시보기에 사용했습니다.",
                validation:
                    "팀 시연에서 React 화면으로 현재 강의를 WebRTC로 시청하면서, 지나간 구간을 선택하면 생성된 HLS 영상이 재생되는 것을 확인했습니다.",
                boundary:
                    "HLS는 세그먼트를 일정 시간 모은 뒤 재생하므로 WebRTC보다 지연이 큽니다. 이 프로젝트는 교육용 시연까지 완료했으며 장기 운영과 대규모 동시 접속은 검증하지 않았습니다.",
            },
            {
                number: "02",
                title: "HLS 다시보기 재생 지연을 약 35초에서 약 17초로 단축",
                constraint:
                    "초기 설정에서는 RTP 영상이 React HLS 플레이어에서 재생되기까지 약 35초가 걸려, 방금 놓친 강의 구간을 다시 보려는 기능의 사용성이 떨어졌습니다.",
                decision:
                    "HLS 세그먼트 길이를 줄이고 FFmpeg 인코딩 설정을 조정해 첫 세그먼트가 더 빨리 생성되도록 했습니다.",
                validation:
                    "같은 시연 흐름에서 RTP 입력부터 React HLS 재생까지 걸리는 시간을 설정 변경 전후로 비교해 약 35초에서 약 17초로 줄어든 것을 확인했습니다.",
                boundary:
                    "시연 환경에서 측정한 결과이며 네트워크와 기기를 통제한 벤치마크는 아닙니다.",
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

export const webappCaseStudies = projectList.filter((project) => project.projectType === "webapp")

export const toolingCaseStudies = projectList.filter((project) => project.projectType === "tooling")

export const educationCaseStudies = projectList.filter(
    (project) => project.projectType === "education",
)

export const navigableCaseStudyGroups = [
    { id: "career", label: "경력", title: "경력 프로젝트", projects: careerCaseStudies },
    { id: "personal", label: "개인", title: "개인 프로젝트", projects: personalCaseStudies },
    {
        id: "webapp",
        label: "웹앱",
        title: "웹앱 프로젝트",
        projects: webappCaseStudies,
    },
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

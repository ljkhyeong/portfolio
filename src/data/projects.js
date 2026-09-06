import { projectSummaries, projectSummariesById } from "./projectSummaries"

const projects = [
    {
        ...projectSummariesById.baton,
        evidenceTitle: "검증 범위 및 현재 상태",
        systemTitle: "대표 화면과 서비스 구성",
        systemNavLabel: "화면 및 서비스",
        screenshotNote: "화면 검증용 테스트 데이터입니다.",
        screenshots: [
            {
                id: "today",
                src: "baton-core-today.webp",
                label: "오늘 할 일",
                caption: "이번 회차 업무, 내 담당 업무와 재확인할 자료",
                alt: "이번 회차 업무, 내 담당 업무와 재확인할 자료를 보는 BATON 오늘 화면",
                width: 1440,
                height: 960,
            },
            {
                id: "my-teams",
                src: "baton-core-my-teams.webp",
                label: "여러 팀의 내 할 일",
                caption: "참여한 여러 팀과 진행 중 시즌의 내 업무를 모아 보는 화면",
                alt: "참여한 여러 팀과 진행 중 시즌의 내 업무를 모아 보는 화면",
                width: 1440,
                height: 960,
            },
            {
                id: "continuity",
                src: "baton-core-continuity.webp",
                label: "담당자 공백 및 업무 지연",
                caption: "담당자가 없는 역할과 지연된 반복 업무",
                alt: "BATON 담당자 공백 및 업무 지연 화면에서 담당자 공백과 반복 업무 지연 신호를 확인하는 모습",
                width: 1440,
                height: 900,
            },
            {
                id: "search",
                src: "baton-core-search.webp",
                label: "통합 검색",
                caption: "결정, 인수인계 항목과 역할 자료 검색",
                alt: "BATON 탐색 화면에서 결정과 인수인계 항목 및 역할 자료를 검색하는 모습",
                width: 1440,
                height: 900,
            },
            {
                id: "batonbook",
                src: "baton-core-batonbook.webp",
                label: "인수인계 문서(바통북)",
                caption: "역할 책임, 반복 업무와 주요 결정 인쇄",
                alt: "BATON 인수인계 문서(바통북)에서 역할 책임과 반복 업무 및 주요 결정을 확인하는 모습",
                width: 1440,
                height: 900,
            },
        ],
        architecture: {
            label: "서비스 구성과 담당 업무",
            title: "조직과 인수인계는 Core에 두고, 6개 기능은 독립 서비스와 저장소로 분리했습니다.",
            description:
                "GO, WATCH, RELAY, BRIEF, CAL과 ROUND는 독립 실행하며 저장소를 공유하지 않습니다. ROUND의 방 상태는 메모리에 저장합니다.",
            tradeoff:
                "서비스를 개별 배포할 수 있으며, 배포 상태와 미전송 이벤트를 서비스별로 관리해야 합니다.",
        },
        featuredProblemNumbers: ["02", "03", "05", "07"],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "50",
                summary: "각 서비스가 받을 요청, 처리할 업무와 완료 판단 기준을 정리합니다.",
            },
            {
                id: "adr",
                label: "ADR",
                count: "87",
                summary: "기술 선택 이유, 검토한 대안과 적용 시 제약을 기록합니다.",
            },
            {
                id: "runbook",
                label: "Runbook",
                count: "24",
                summary: "배포, 중단 작업 복구와 공개 스테이징 전송 테스트 절차를 정리합니다.",
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
                label: "BRIEF 점검 상태 반영과 발행 보고서 수정 방지",
                href: "/docs/baton/brief-event-projection.md",
                note: "Core의 담당자 공백 및 업무 지연 등 5개 상태를 ACTIVE 또는 RESOLVED로 반영하고, 발행한 주간 보고서는 수정하지 않는 방식",
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
                label: "ROUND 방 입장 토큰 검증과 WebRTC 연결 관리",
                href: "/docs/baton/round-realtime-boundary.md",
                note: "Core가 발급한 입장 토큰 검증, 지연된 WebRTC 메시지 차단과 메모리에 저장하는 방 및 참가자 상태",
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
                    "조직의 역할·반복 업무·인수인계를 관리하고 여러 팀의 내 할 일과 자료 재확인 기한을 모아 보여 줍니다.",
                detail: "여러 팀·진행 시즌의 내 업무, 재확인할 자료, 시즌 간 기록 검색, 초안 복원과 인수인계 문서",
                evidence:
                    "인수인계 상태 전이, 역할별 진행 중 1건 제약과 BRIEF, CAL 및 ROUND 로컬 교차 서비스 테스트",
                input: "조직 및 역할 관리, 인수인계 상태 변경과 ROUND 참여 요청",
                inputRule:
                    "조직 요청은 공유 키와 소속을 확인하고, 입장 토큰 발급은 활동 중인 스터디 구성원인지 추가로 확인합니다.",
                output: "팀, 시즌, 역할, 반복 업무와 인수인계 데이터 및 ROUND 입장 토큰",
                recoveryBoundary:
                    "인수인계 수락과 역할 담당자 및 담당 기간 변경을 한 DB 트랜잭션에서 처리",
                database: "MySQL",
                primary: true,
                screenshotNote: "화면 검증용 테스트 데이터입니다.",
                visibility: "비공개 저장소 / 설계와 테스트 요약 공개",
                status: "2026년 9월 6일 로컬 소스에서 여러 팀 업무 조회, 자료 재확인, 개인 캘린더 구독과 주간 보고서 기능을 확인했습니다. CAL·BRIEF·ROUND 및 RELAY 이벤트 수신까지 로컬 연동 근거가 있으며 공개 환경 전체 연결은 미검증입니다.",
                screenshots: [
                    {
                        id: "today",
                        src: "baton-core-today.webp",
                        label: "오늘 할 일",
                        caption: "이번 회차 업무, 내 담당 업무와 재확인할 자료",
                        alt: "이번 회차 업무, 내 담당 업무와 재확인할 자료를 보는 BATON 오늘 화면",
                        width: 1440,
                        height: 960,
                    },
                    {
                        id: "my-teams",
                        src: "baton-core-my-teams.webp",
                        label: "여러 팀의 내 할 일",
                        caption: "참여한 여러 팀과 진행 중 시즌의 내 업무를 모아 보는 화면",
                        alt: "참여한 여러 팀과 진행 중 시즌의 내 업무를 모아 보는 화면",
                        width: 1440,
                        height: 960,
                    },
                    {
                        id: "continuity",
                        src: "baton-core-continuity.webp",
                        label: "담당자 공백 및 업무 지연",
                        caption: "담당자가 없는 역할과 지연된 반복 업무",
                        alt: "BATON 담당자 공백 및 업무 지연 화면에서 담당자 공백과 반복 업무 지연 신호를 확인하는 모습",
                        width: 1440,
                        height: 900,
                    },
                    {
                        id: "search",
                        src: "baton-core-search.webp",
                        label: "통합 검색",
                        caption: "결정, 인수인계 항목과 역할 자료 검색",
                        alt: "BATON 탐색 화면에서 결정과 인수인계 항목 및 역할 자료를 검색하는 모습",
                        width: 1440,
                        height: 900,
                    },
                    {
                        id: "batonbook",
                        src: "baton-core-batonbook.webp",
                        label: "인수인계 문서(바통북)",
                        caption: "역할 책임, 반복 업무와 주요 결정 인쇄",
                        alt: "BATON 인수인계 문서(바통북)에서 역할 책임과 반복 업무 및 주요 결정을 확인하는 모습",
                        width: 1440,
                        height: 900,
                    },
                ],
                documentation: [
                    {
                        label: "PRD",
                        count: "8",
                    },
                    {
                        label: "ADR",
                        count: "20",
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
                    "허용한 BATON 및 ROUND 경로에 짧은 링크를 발급합니다. 실제 접근 권한은 대상 서비스가 확인합니다.",
                contribution:
                    "링크 생성, 조회, 폐기와 리다이렉트를 구현했습니다. UUID로 중복 생성을 막고 HMAC 키 일치 여부와 관리 JWT의 issuer, audience 및 작업별 scope를 검사합니다.",
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
                detail: "UUID·요청 조건으로 중복 링크를 막고 Redis 공유 요청률 제한, HMAC 키 교체와 만료·폐기 링크 정리를 제공합니다.",
                evidence:
                    "같은 요청 8건을 동시에 보내도 링크 1건만 저장되고, HMAC 키 불일치 시 서버가 시작되지 않는지 검증",
                input: "허용된 BATON 또는 ROUND 대상, 사용 목적, 활성 및 만료 시각과 UUID",
                inputRule:
                    "대상 시스템, 경로, 사용 목적, 활성 및 만료 시각과 UUID를 확인하고 관리 요청은 JWT의 issuer, audience 및 작업별 scope를 검사합니다.",
                output: "활성 시작일, 만료일과 폐기 상태를 저장한 짧은 링크 코드",
                recoveryBoundary:
                    "같은 UUID와 링크 조건이면 기존 링크를 반환하고, 같은 UUID의 조건이 하나라도 다르면 충돌로 차단",
                database: "MySQL",
                visibility: "비공개 저장소 / 최신 로컬 구현 요약 공개",
                status: "로컬 main 08041e0에서 Redis 공유 요청률 제한, 버전별 HMAC 키 교체와 만료 링크 정리를 확인했습니다. 링크를 정리해도 중복 생성 방지 기록은 보존합니다. 실제 클러스터·공개 배포는 미검증입니다.",
                tradeoff:
                    "UUID 처리 기록과 HMAC 키를 함께 관리해야 합니다. DB를 복구할 때 같은 시점의 키가 없으면 기존 링크를 그대로 유지할 수 없습니다.",
                screenshots: [
                    {
                        id: "link-error",
                        src: "baton-go-link-error.webp",
                        label: "링크 오류 안내",
                        caption: "존재하지 않거나 아직 사용할 수 없는 링크, 만료 및 폐기 안내",
                        alt: "BATON GO가 사용할 수 없는 링크 상태를 한글로 안내하는 화면",
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
                        count: "10",
                    },
                    {
                        label: "Runbook",
                        count: "6",
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
                    "사설망 접근을 차단하고 공개 URL의 응답 상태·헤더로 연결 상태를 점검합니다. 상태 변경은 Core로 전달합니다.",
                contribution:
                    "점검 시도마다 처리 서버와 기한을 기록한 뒤 외부 HTTP 요청 중에는 DB 연결을 반환했습니다. 중단된 점검은 다시 실행하고, Core 응답을 받지 못한 상태 변경 이벤트는 DB에 남겨 다시 보냅니다.",
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
                detail: "응답 본문을 읽지 않는 URL 점검, 수동 재확인, 원본 스냅샷 대조와 독립 복원",
                evidence:
                    "사설망 차단·처리 기한이 지난 점검 재실행·이전 결과 차단과 원본 스냅샷 복원 절차의 검증 기록을 확인했습니다.",
                input: "점검 대상 URL과 점검 요청 시점의 URL 버전",
                inputRule:
                    "URL 형식과 통신 방식을 확인하고 사설망 및 로컬 주소로 해석되는 요청을 차단합니다.",
                output: "URL 상태와 상태 변경 이벤트",
                recoveryBoundary:
                    "한 서버의 처리 기한이 지나면 기존 시도를 닫고 새 점검 시도를 만들어 다른 서버가 처리",
                database: "PostgreSQL",
                visibility: "공개 원격 개발 브랜치",
                status: "로컬 main 97e6758에 본문 없는 연결 점검, 수동 재확인과 Core 스냅샷 대조·복원 도구를 반영했습니다. 공개 callback과 외부 알림을 포함한 전체 운영 연결은 미검증입니다.",
                tradeoff:
                    "처리 기한이 짧으면 중복 점검이 늘고, 길면 중단 작업의 재실행이 늦어집니다. 대기 및 실패 건수를 보고 기한을 조정해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-watch/tree/5a683430267590f7c30af6d267beb3a675b844a8",
                    label: "WATCH 개발 브랜치 고정 커밋",
                    note: "URL 점검, 복구, 자원 상한과 Prometheus 운영 지표를 확인한 원격 개발 브랜치 커밋입니다.",
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
                        count: "9",
                    },
                ],
            },
            {
                id: "relay",
                name: "RELAY",
                kind: "MICROSERVICE",
                route: "/projects/baton/relay",
                role: "Webhook 및 AWS SQS FIFO 이벤트 전달",
                summary:
                    "Core 이벤트를 Webhook 또는 AWS SQS FIFO로 전달하고 성공, 실패와 결과 미확인을 나눠 저장합니다.",
                contribution:
                    "이벤트 ID를 저장해 재수신 시 새 전송 작업을 만들지 않습니다. 중단 뒤에도 같은 시도 UUID와 제공자 멱등 키를 유지한 채 처리 권한만 인계합니다.",
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
                detail: "중복 이벤트 수신 방지, 결과 미확인 전송 보류, 누락 전달 복구, 제공자 한도·일시정지와 암호화 이력 보관",
                evidence:
                    "이벤트 재수신에도 전달 작업이 늘지 않고, 서버 중단 뒤 같은 시도 UUID와 제공자 멱등 키를 유지한 채 처리 권한만 다른 서버로 넘기는지 검증",
                input: "이벤트 ID, 이벤트 종류, 데이터 형식 버전, 대상 업무 식별자와 발생 시각",
                inputRule: "수신 값이 정해 둔 이벤트 형식과 데이터 형식 버전에 맞는지 확인합니다.",
                output: "Webhook 또는 AWS SQS FIFO 전달 성공, 실패 또는 결과 미확인 상태",
                recoveryBoundary:
                    "전송 전 일시 실패만 재시도합니다. 결과 미확인은 다시 보내지 않고 운영자가 외부 기록을 확인해 상태만 확정합니다.",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 최신 구현 공개 main",
                status: "공개 main 6f92cef에 누락 전달 미리보기·복구, 운영자 감사 조회, 제공자 한도·일시정지와 암호화 보관·복원을 구현했습니다. 경보 실패·복구는 모의 수신기로 검증했으며 실제 AWS·외부 운영 알림은 미검증입니다.",
                tradeoff:
                    "결과 미확인 건은 중복 전달을 막기 위해 자동 재전송하지 않습니다. 운영자가 외부 기록을 확인해 상태를 확정해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-relay/tree/f9645c2",
                    label: "RELAY 공개 main",
                    note: "RabbitMQ 수신, 외부 전달과 운영 조회가 반영된 공개 main입니다.",
                },
                documentation: [
                    {
                        label: "PRD",
                        count: "2",
                    },
                    {
                        label: "ADR",
                        count: "26",
                    },
                ],
            },
            {
                id: "brief",
                name: "BRIEF",
                screenshotNote: "화면 검증용 테스트 데이터입니다.",
                kind: "MICROSERVICE",
                route: "/projects/baton/brief",
                role: "담당자 공백 및 업무 지연 점검과 주간 보고서",
                summary:
                    "Core의 5개 점검 신호를 주간 보고서에 반영하고 이전부터 미해결·이번 주 신규·해결 항목을 구분합니다.",
                contribution:
                    "Core가 보낸 상태를 그대로 미해결(ACTIVE) 또는 해결됨(RESOLVED) 상태의 점검 항목에 저장했습니다. 같은 이벤트와 과거 개정을 차단하고, 한 번 발행한 주간 보고서는 수정하지 않습니다.",
                stack: [
                    "Kotlin 2.4.10",
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring MVC",
                    "Spring JDBC",
                    "PostgreSQL 18",
                    "Flyway",
                    "Testcontainers",
                ],
                detail: "Core 상태 반영, 주간 미해결 이월·신규·해결 구분, 해결 내역과 발행 보고서 이력 보존",
                evidence:
                    "중복 및 과거 이벤트 차단, 점검 항목 요약 및 필터와 발행 보고서 불변성을 PostgreSQL 및 Core 교차 서비스 테스트로 확인했습니다.",
                input: "Core가 판정한 담당 공백, 후임 공백, 역할 준비 부족, 반복 업무 지연 및 미완료 인수인계 신호",
                inputRule:
                    "이벤트 ID, 데이터 형식 버전, 개정 번호와 본문 해시가 기존 수신 기록과 충돌하지 않는지 확인합니다.",
                output: "미해결 및 해결된 점검 항목, 수신 이벤트 이력과 발행 후 수정하지 않는 주간 보고서",
                recoveryBoundary:
                    "같은 이벤트와 과거 개정은 반영하지 않고 저장한 이벤트 전체를 읽어 같은 점검 항목을 다시 생성",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 최신 기능은 로컬 구현 기준",
                status: "로컬 main 5e7cd53에 주간 미해결 이월·신규 구분과 해결 내역 조회를 추가했습니다. Core와 주간 보고서의 로컬 연동을 확인했으며 공인 DNS·원격 배포는 미검증입니다.",
                tradeoff:
                    "v1과 v2 이벤트를 함께 처리합니다. 신호가 늘면 Core 이벤트 계약과 BRIEF 반영 및 보고서 비교 규칙을 함께 변경해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-brief",
                    label: "BRIEF 공개 저장소",
                    note: "공개 main과 최신 로컬 main의 차이는 현재 상태 설명에 구분했습니다.",
                },
                screenshots: [
                    {
                        id: "weekly-summary",
                        src: "baton-brief-weekly-summary.webp",
                        label: "주간 운영 요약",
                        caption: "점검 항목 요약과 주간 보고서 생성",
                        alt: "BATON 오늘 화면에서 BRIEF 주간 운영 요약을 확인하는 모습",
                        width: 1440,
                        height: 900,
                    },
                ],
                documentation: [
                    {
                        label: "PRD",
                        count: "28",
                    },
                    {
                        label: "ADR",
                        count: "7",
                    },
                    {
                        label: "이벤트 형식 문서",
                        count: "1",
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
                    "Core 일정과 개정 번호를 저장해 iCalendar로 변환합니다. 구독 토큰 교체 및 폐기와 HTTP 캐시 응답도 구현했습니다.",
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
                detail: "개인 캘린더 구독·목록·일괄 해지, 응답 유실 시 구독 복구와 읽기 전용 .ics 캐시",
                evidence:
                    "Core 1.0.0 생성 코드의 일정 JSON으로 중복 및 과거 일정 차단과 iCalendar 변환 검증",
                input: "Core 일정의 최신 전체 데이터와 개정 번호, 구독 생성, 토큰 교체 및 구독 폐기 요청",
                inputRule:
                    "일정 ID, 이벤트 ID, 개정 번호와 시간대 값이 공개한 일정 JSON 형식에 맞는지 확인합니다.",
                output: "읽기 전용 iCalendar 피드와 일정이 바뀌지 않았음을 알리는 304 응답",
                recoveryBoundary:
                    "중복 및 과거 개정 번호는 반영하지 않고 DB에 저장한 일정으로 같은 iCalendar 피드를 다시 생성",
                database: "PostgreSQL",
                visibility: "공개 저장소 / 정식 JSON 규격 1.0.0 / 릴리스 후보 JSON 규격 1.1.0-rc.1",
                status: "로컬 main 30f88e7의 1.1.0-rc.2 개발 소스에 개인 구독·응답 유실 복구·진단을 구현했습니다. 게시된 후보는 1.1.0-rc.1, 정식 규격은 1.0.0이며 실제 캘린더 앱·공개 운영은 미검증입니다.",
                tradeoff:
                    "읽기 전용 구독은 외부 캘린더에서 쉽게 사용할 수 있지만, 비동기 반영 지연과 캘린더 앱별 동작 차이를 관리해야 합니다.",
                repository: {
                    href: "https://github.com/ljkhyeong/baton-cal/tree/978f0d4",
                    label: "CAL 공개 main 고정 커밋",
                    note: "정식 JSON 규격 1.0.0과 릴리스 후보 JSON 규격 1.1.0-rc.1의 BATON 호환성 근거를 확인할 수 있습니다.",
                },
                documentation: [
                    {
                        label: "PRD",
                        count: "2",
                    },
                    {
                        label: "ADR",
                        count: "2",
                    },
                    {
                        label: "JSON Schema",
                        count: "6",
                    },
                ],
            },
            {
                id: "round",
                name: "ROUND",
                screenshotNote:
                    "로컬 standalone 서버와 가상 카메라를 사용한 테스트 화면입니다. 실제 TURN 중계나 외부망 접속 결과가 아닙니다.",
                kind: "MICROSERVICE",
                route: "/projects/baton/round",
                role: "WebRTC 스터디룸",
                summary:
                    "Core 입장 토큰을 검증해 최대 6명의 WebRTC 연결 메시지를 전달하고, 직접 연결이 어려우면 Cloudflare TURN 접속 정보를 제공합니다.",
                contribution:
                    "React 입장 및 통화 화면, protocol v3, 재연결과 채팅 수신 확인을 처리하는 RTC 코어, Spring WebSocket 시그널링과 만료 시간이 짧은 Cloudflare TURN 자격 증명 발급을 구현했습니다.",
                stack: [
                    "TypeScript",
                    "React 19",
                    "Vite 8",
                    "WebRTC / RTCDataChannel",
                    "Java 21",
                    "Spring Boot 4.1",
                    "Spring WebSocket",
                    "Cloudflare TURN / Caddy",
                    "Playwright",
                ],
                detail: "최대 6명 WebRTC, 통합 입장 화면, 손들기 대기 순서·공용 타이머·주제, 채팅 검색과 화면 공유 확대",
                evidence:
                    "Chromium 카메라 및 마이크 제어와 화면 공유, WebKit 호환성, BATON edge와 배포 검증을 CI 작업으로 분리했습니다. WebKit mDNS와 restic 누락도 보완했습니다.",
                input: "Core가 방 ID, 참가자 ID와 만료 시각을 넣어 RSA 개인 키로 서명한 만료 시간이 짧은 RS256 입장 토큰",
                inputRule:
                    "입장 토큰의 서명, 발급자, 수신자, 방 ID와 만료 시각을 Core가 제공한 공개 키 목록으로 확인합니다.",
                output: "브라우저 사이의 WebRTC 연결 메시지 전달, DataChannel 채팅 수신 응답과 만료 시간이 짧은 Cloudflare TURN 접속 정보",
                recoveryBoundary:
                    "연결을 새로 만들 때마다 순번을 올리고 이전 연결에서 늦게 온 메시지는 버립니다. 같은 참가자가 새 입장 토큰으로 접속하면 이전 WebSocket 세션을 종료합니다.",
                database: "DB 없음 / 방과 참가자 연결 상태는 프로세스 메모리에 저장",
                visibility: "비공개 저장소 / 설계와 테스트 요약 공개",
                status: "로컬 main fd874e2에서 손들기·공용 타이머·주제, 채팅 검색, 참가자별 음량과 화면 공유 확대를 구현했습니다. 이번에는 가상 카메라 2명을 직접 연결해 촬영했습니다. 실제 TURN·Safari 실기기·외부망·6명 장시간 접속은 미검증입니다.",
                tradeoff:
                    "참가자끼리 직접 연결하는 mesh 구조는 인원이 늘수록 각 브라우저의 업로드와 CPU 사용량이 증가합니다. 방 상태가 프로세스 메모리에 있어 현재는 단일 시그널링 인스턴스로 운용해야 합니다.",
                screenshots: [
                    {
                        id: "study",
                        src: "baton-round-study.webp",
                        label: "스터디 진행 도구",
                        caption:
                            "두 참가자가 연결된 방에서 공용 타이머·주제와 손들기 순서를 확인하는 화면",
                        alt: "두 참가자가 연결된 방에서 공용 타이머·주제와 손들기 순서를 확인하는 화면",
                        width: 1440,
                        height: 960,
                    },
                    {
                        id: "prejoin",
                        src: "baton-round-prejoin.webp",
                        label: "입장 전 장치 확인",
                        caption: "카메라, 마이크와 입력 음량 확인",
                        alt: "BATON ROUND 입장 전 화면에서 카메라와 마이크를 확인하는 모습",
                        width: 1440,
                        height: 900,
                    },
                    {
                        id: "call-chat",
                        src: "baton-round-call-chat.webp",
                        label: "통화와 채팅",
                        caption: "영상 통화와 DataChannel 채팅",
                        alt: "BATON ROUND 통화 화면에서 참가자 영상과 채팅을 확인하는 모습",
                        width: 1440,
                        height: 900,
                    },
                    {
                        id: "screen-share",
                        src: "baton-round-screen-share.webp",
                        label: "화면 공유",
                        caption: "공유 화면 고정과 통화 제어",
                        alt: "BATON ROUND 통화 화면에서 공유 화면과 통화 제어를 확인하는 모습",
                        width: 1440,
                        height: 900,
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
                scope: "GO 최신 로컬 main 기준 · BATON 런타임 연결은 미검증",
            },
            {
                item: "WATCH 안전한 URL 점검",
                method: "자동화 테스트",
                rule: "사설망·DNS 변경 차단, 응답 본문 미수신, 이전 URL 버전 결과와 기한이 지난 점검의 복구를 확인",
                result: "공인 IP의 응답 상태·헤더만 확인하고 본문은 읽지 않습니다. 현재 URL 버전 결과만 저장하고 중단된 점검은 다시 실행합니다.",
                scope: "로컬 main 97e6758 · 기존 검증 기록과 현재 구현 대조",
            },
            {
                item: "RELAY DB 저장 후 RabbitMQ 재전달 중복 방지",
                method: "RabbitMQ 및 PostgreSQL Docker Compose 검증",
                rule: "PostgreSQL 저장은 끝났지만 RabbitMQ에 처리 완료 응답(ACK)을 보내기 전에 RabbitMQ와 RELAY를 중단하고 같은 이벤트를 재전달",
                result: "같은 이벤트 ID의 수신 이력을 1건으로 유지하고 RabbitMQ에 ACK를 보내며 별도 실패 큐(DLQ)에는 넣지 않음",
                scope: "RELAY 공개 main f9645c2 · RabbitMQ 4.3.4와 PostgreSQL 일회성 Compose 시나리오 및 main CI 성공",
            },
            {
                item: "BRIEF 점검 상태 반영과 발행 보고서 수정 방지",
                method: "PostgreSQL 통합 테스트와 실제 Core 실행 JAR 연동",
                rule: "Core의 담당자 공백 및 업무 지연 등 5개 상태를 ACTIVE 및 RESOLVED로 전환하고, 같은 이벤트와 과거 개정 및 점검 항목 요약, 필터와 보고서 동시 생성 요청을 실행",
                result: "신호를 다시 판정하지 않고 점검 항목과 요약에 반영했으며, 저장 이벤트로 같은 점검 목록을 재생성하고 같은 주간 보고서를 1건만 저장했습니다.",
                scope: "BRIEF 최신 로컬 main과 실제 Core 및 내부 Caddy HTTPS 교차 검증 · 공인 DNS와 원격 배포는 미검증",
            },
            {
                item: "CAL 일정 JSON 수신과 캘린더 구독",
                method: "PostgreSQL Testcontainers와 iCalendar 기대값 비교, Core의 실제 일정 JSON 생성 코드로 만든 데이터를 CAL 컨테이너에 전송",
                rule: "같은 일정의 최신 전체 데이터 재전달, 현재보다 낮은 개정 번호, 서머타임 전환(DST) 및 자정 경계 일정, 취소 일정과 구독 토큰 동시 교체를 각각 실행",
                result: "중복 및 과거 일정을 차단하고 DST, 자정 경계와 취소 일정을 변환하며 같은 일정에는 같은 ETag를 반환",
                scope: "릴리스 후보 JSON 규격 1.1.0-rc.1 및 BATON Core와 실제 CAL 컨테이너 교차 검증 · 실제 캘린더 앱과 공개 운영은 미검증",
            },
            {
                item: "ROUND 입장 토큰 검증과 브라우저 연결",
                method: "현재 main의 Chromium, WebKit, BATON edge 및 배포 검증 구성 확인",
                rule: "RS256 입장 토큰으로 최대 6명 mesh 연결, 카메라 및 마이크 제어, 화면 공유와 재연결 및 WebKit 장치 동의, 채팅과 모바일 화면 배치 시나리오를 실행",
                result: "이전 실패 원인이었던 WebKit 직접 연결용 mDNS와 배포 검증용 restic 설치를 현재 main에 추가하고 시그널링 및 RTC 상태 책임을 분리했습니다.",
                scope: "비공개 main 7c9218c 기준 · 실제 Cloudflare TURN 중계 전용 연결, Safari 실기기, 외부망과 6명 장시간 접속은 미검증",
            },
            {
                item: "여러 팀의 내 업무와 최근 서비스 확장",
                method: "각 저장소 소스·검증 기록과 로컬 화면 대조",
                rule: "Core 내 팀·자료 재확인, BRIEF 주간 이월·해결, CAL 개인 구독과 ROUND 스터디 도구를 확인",
                result: "여러 팀의 담당 업무를 모아 보고 개인 일정 구독과 주간 보고서로 이어집니다. ROUND에는 공용 타이머와 손들기 순서를 추가했습니다.",
                scope: "2026.09.06 로컬 소스 기준 · 화면별 테스트 데이터 및 외부 연동 범위 별도 표시",
            },
        ],
        category: "개인 프로젝트",
        role: "Core와 6개 서비스의 API, 개별 저장소, 이벤트 전달 및 중단 작업 재처리 흐름 설계와 구현",
        oneLine:
            "오늘 할 일과 인수인계를 중심으로 짧은 링크, URL 점검, 이벤트 전달, 주간 보고서, 캘린더와 WebRTC를 독립 서비스로 구현했습니다.",
        status: {
            label: "현재 상태",
            text: "Core와 6개 서비스에 여러 팀 업무 조회, 개인 캘린더, 주간 보고서와 운영 복구 기능을 추가했습니다. 일부 서비스는 실제 로컬 실행으로 연동을 확인했으며 GO·WATCH를 포함한 공개 환경 전체 연결과 장기 운영은 미검증입니다.",
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
                    "GO는 같은 UUID의 링크 1건, WATCH는 사설망 URL 차단, RELAY는 같은 이벤트 ID의 수신 이력 1건, BRIEF는 ACTIVE 및 RESOLVED 반영, CAL은 과거 개정 미반영, ROUND는 이전 연결 메시지 차단을 확인했습니다.",
                boundary:
                    "서비스별 구현과 일부 Core 교차 검증만 완료했으며, 실제 자격 증명을 쓴 Core와 6개 서비스의 공개 환경 종단 간 연결은 확인하지 않았습니다.",
            },
            {
                number: "02",
                serviceIds: ["core"],
                title: "인수인계 수락과 담당자 변경을 한 트랜잭션으로 처리",
                constraint:
                    "인수인계 수락과 담당자 변경이 따로 반영되면 역할 담당 정보가 어긋날 수 있었습니다.",
                decision:
                    "준비 때 다음 담당자와 기간을 고정하고 전달 때 누락 항목을 확인했습니다. 수락 시 담당자와 기간을 한 트랜잭션에서 바꾸고 역할별 진행 중 인수인계는 1건만 허용했습니다.",
                validation: "상태 전이, 취소, 중복 교대와 전달 후 수정을 테스트했습니다.",
                boundary:
                    "운영 화면에서 현재 상태와 수락 또는 취소 가능 여부를 보여주고, 준비 또는 전달 상태에서 멈춘 인수인계를 정리하는 절차가 필요합니다.",
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
                    "점검 시도마다 처리 서버와 기한을 기록한 뒤 DB 연결을 반환하고, 확인한 공인 IP로만 요청했습니다. 기한이 지나면 기존 시도를 종료하고 새로 점검하며 이전 시도나 URL 버전의 결과는 저장하지 않았습니다.",
                validation:
                    "사설망 접근, DNS 재조회 시 IP 변경, 과도한 응답, 서버 중단과 늦은 결과를 테스트했습니다.",
                boundary:
                    "한 서버가 가져간 점검의 처리 기한이 짧으면 중복 실행이 늘고, 길면 중단된 점검을 다시 실행하는 시점이 늦어집니다.",
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
                boundary: "현재 수신 서비스는 Core 하나이며 별도 메시지 큐 없이 HTTP로 전달합니다.",
            },
            {
                number: "07",
                serviceIds: ["relay"],
                title: "결과를 모르는 외부 전송의 중복 방지",
                constraint:
                    "외부 전송 뒤 응답을 잃으면 성공 여부를 모른 채 중복 전송할 수 있었습니다.",
                decision:
                    "호출 전에 시도 UUID와 외부 제공자 중복 방지 키를 저장했습니다. 서버가 바뀌어도 두 값을 유지하고, 결과 미확인 상태는 다시 보내지 않은 채 외부 기록 확인 후 상태만 확정합니다.",
                validation:
                    "전달 서버 중단 뒤 같은 시도 UUID와 중복 방지 키를 유지하는지, 이전 서버의 늦은 결과를 버리는지와 운영자 상태 확정을 확인했습니다.",
                boundary: "결과 미확인 건은 운영자가 외부 전송 기록을 확인해 확정해야 합니다.",
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
                    "Core가 판정한 5개 신호를 그대로 미해결(ACTIVE) 또는 해결됨(RESOLVED) 상태의 점검 항목에 반영했습니다. 이벤트 ID, 해시와 개정 번호로 중복 및 과거 이벤트도 차단했습니다.",
                validation:
                    "실제 Core와 내부 서비스용 Caddy HTTPS로 점검 항목, 요약 및 필터 조회와 주간 보고서 발행을 확인했습니다.",
                boundary:
                    "공인 DNS와 원격 배포는 미검증입니다. 검증한 연동 버전은 현재 상태에 정리했습니다.",
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
                    "v1과 v2 이벤트를 함께 지원하므로 신호가 늘면 Core JSON과 BRIEF 반영 규칙을 함께 바꿔야 합니다.",
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
                    "BATON과 CAL은 비동기로 연동하므로 일정 반영이 지연될 수 있습니다. 실제 운영 활성화 전에는 자격 증명 교체와 모든 일정의 최신 값을 다시 보내는 순서를 함께 검증해야 합니다.",
            },
            {
                number: "12",
                serviceIds: ["cal"],
                title: "iCalendar 시간대 및 취소 처리와 HTTP 캐시 적용",
                constraint:
                    "캘린더 앱마다 시간대와 취소 일정 및 캐시 처리 방식이 달라 일정이 중복되거나 변경 내용이 반영되지 않을 수 있습니다.",
                decision:
                    "일정 ID는 UID로 고정하고 개정 번호는 SEQUENCE로 사용했습니다. 조건부 요청의 ETag 또는 수정 시각을 검사해 캐시가 유효하면 304를 반환하고, 그 외에는 .ics 본문을 반환합니다.",
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
                boundary: "클라이언트와 서버의 연결 메시지 규격을 함께 배포해야 합니다.",
            },
            {
                number: "14",
                serviceIds: ["round"],
                title: "Core는 입장 권한, ROUND는 연결 중계 담당",
                constraint:
                    "ROUND가 연결마다 Core를 호출하거나 권한 정보를 복제하면 지연과 데이터 불일치가 생길 수 있습니다.",
                decision:
                    "Core가 스터디 구성원 자격을 확인해 RS256 입장 토큰을 발급합니다. ROUND는 입장 토큰 검증, WebSocket 중계와 TURN 접속 정보만 담당합니다.",
                validation:
                    "잘못된 입장 토큰 차단, 공개 키 교체와 같은 참가자의 이전 세션 종료를 확인했습니다.",
                boundary:
                    "권한 회수는 입장 토큰 만료까지 늦어질 수 있습니다. 실제 Cloudflare TURN 중계 전용 연결, Safari 실기기, 외부망과 6명 장시간 접속은 미검증입니다.",
            },
        ],
        stack: [
            "Java 21 / 25",
            "Kotlin 2.4.10",
            "TypeScript",
            "Spring Boot",
            "Spring MVC",
            "Spring Data JPA / Spring JDBC",
            "React 19 / Vite",
            "MySQL 8.4 / PostgreSQL 18",
            "Flyway",
            "RabbitMQ 4.3 / AWS SQS FIFO",
            "iCal4j 4.3",
            "WebRTC / Spring WebSocket",
            "Testcontainers / Playwright",
            "Docker / Kubernetes / Caddy",
        ],
        links: [
            {
                label: "BATON WATCH GitHub 저장소",
                shortLabel: "WATCH 저장소",
                href: "https://github.com/ljkhyeong/baton-watch",
                note: "안전한 URL 점검과 상태 변경 이벤트",
            },
            {
                label: "BATON RELAY GitHub 저장소",
                shortLabel: "RELAY 저장소",
                href: "https://github.com/ljkhyeong/baton-relay",
                note: "RabbitMQ 수신, Webhook 및 AWS SQS FIFO 전달",
            },
            {
                label: "BATON BRIEF GitHub 저장소",
                shortLabel: "BRIEF 저장소",
                href: "https://github.com/ljkhyeong/baton-brief",
                note: "담당자 공백 및 업무 지연 점검과 주간 보고서",
            },
            {
                label: "BATON CAL GitHub 저장소",
                shortLabel: "CAL 저장소",
                href: "https://github.com/ljkhyeong/baton-cal",
                note: "일정 스냅샷과 읽기 전용 iCalendar 구독",
            },
        ],
    },
    {
        ...projectSummariesById.happygallery,
        evidenceTitle: "테스트 범위 및 운영 이력",
        systemTitle: "대표 화면",
        systemNavLabel: "대표 화면",
        screenshotNote:
            "E2E 테스트용 모의 API 응답으로 확인한 화면입니다. 실제 결제 및 네이버 계정 연동은 미검증입니다.",
        screenshots: [
            {
                id: "product-options",
                src: "happygallery-product-options.webp",
                label: "상품 옵션",
                caption: "색상과 각인 선택, 옵션 조합별 가격 및 재고 확인",
                alt: "happyGallery 상품 상세에서 색상과 각인 옵션을 선택하고 조합별 가격과 재고를 확인하는 모습",
                width: 1440,
                height: 960,
            },
            {
                id: "smartstore-reconciliation",
                src: "happygallery-smartstore-reconciliation.webp",
                label: "스마트스토어 대사",
                caption: "결과 미확인 주문의 외부 내역 조회와 내부 기록 대조",
                alt: "happyGallery 관리자 화면에서 결과가 확정되지 않은 스마트스토어 요청을 확인하는 모습",
                width: 1440,
                height: 960,
            },
            {
                id: "smartstore-mapping",
                src: "happygallery-smartstore-mapping.webp",
                label: "스마트스토어 상품 연결",
                caption: "스마트스토어 상품 및 옵션 연결과 변경 이력",
                alt: "happyGallery 관리자 화면에서 스마트스토어 원상품 연결과 변경 이력을 확인하는 모습",
                width: 1440,
                height: 960,
            },
            {
                id: "classes",
                src: "happygallery-classes.webp",
                label: "클래스 목록",
                caption: "클래스 가격, 소요 시간, 정원과 예약",
                alt: "happyGallery 클래스 목록에서 수업과 예약 회차를 확인하는 모습",
                width: 1440,
                height: 960,
            },
            {
                id: "cart",
                src: "happygallery-cart.webp",
                label: "선택 구매와 결제수단",
                caption: "선택한 상품만 주문하고 미선택 상품은 장바구니에 보관하는 화면",
                alt: "선택한 상품만 주문하고 미선택 상품은 장바구니에 보관하는 화면",
                width: 1440,
                height: 1200,
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
        featuredProblemNumbers: ["02", "03", "12", "14"],
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
                count: "49",
                summary: "아키텍처, 동시성, 결제, 외부 채널과 보안 결정을 기록합니다.",
            },
            {
                id: "idea-poc",
                label: "Idea / POC",
                count: "40 / 1",
                summary: "개발 전에 선택할 방식과 외부 장애 대응안을 작은 검증 코드로 확인합니다.",
            },
            {
                id: "retrospective",
                label: "Retrospective",
                count: "11",
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
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0033_결제_confirm_트랜잭션과_보상_경계/adr.md",
                note: "결제사 호출과 상태 저장을 분리하고 실패 이력, 중복 방지 요청 ID와 복구 기준을 정한 기록",
            },
            {
                type: "ADR",
                label: "8회권 사용, 취소 및 환불 정책",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0011_이용권_사용_소모_환불_결정/adr.md",
                note: "미래 예약 자동 취소, 환불할 이용 횟수 계산과 동시 처리의 잠금 순서를 정한 기록",
            },
            {
                type: "ADR",
                label: "미전송 알림 저장과 재처리",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0032_%EC%95%8C%EB%A6%BC_Outbox_%EC%A0%84%EB%8B%AC_%EB%B3%B4%EC%9E%A5/adr.md",
                note: "같은 트랜잭션 저장과 커밋 후 미전송 알림 재처리 방식을 정한 기록",
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
                note: "상시 리소스 비용을 확인하고 운영 환경을 내린 과정",
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
                note: "주문 상태 갱신, 문의 조회 및 답변과 정산 내역 대조를 구분한 설계",
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
                rule: "미래 예약 2건에 이용 횟수 2회를 배정한 8회권에 전체 환불 요청",
                result: "미래 예약 2건을 취소하고 잔여 6회와 합쳐 8회분 환불 요청, 이용 횟수와 사용 이력 일치",
                scope: "PassCreditUsageUseCaseIT 통합 시나리오 · 2026.08.27 로컬 커밋 b50a9ef0 기준",
            },
            {
                item: "카드와 간편결제 선택",
                method: "결제 화면 E2E와 서버 결제수단 저장 흐름 확인",
                rule: "상품, 장바구니, 예약금과 8회권 구매에서 카드, 네이버페이 및 카카오페이를 각각 선택",
                result: "카드는 통합 결제창, 네이버페이와 카카오페이는 Toss 자체창으로 요청하고 승인 응답의 실제 결제수단을 저장하도록 구현했습니다.",
                scope: "공개 main 2e831500 기준 · 실제 가맹점 결제와 전체 및 부분취소는 운영 전 검증 필요",
            },
            {
                item: "기존 공개 CI 검증 이력",
                method: "GitHub Actions 백엔드 빌드 및 브라우저 스모크",
                rule: "백엔드 전체 검사와 주문, 결제, 예약 및 관리자 운영의 브라우저 시나리오를 실행",
                result: "초기 통합 브랜치의 백엔드 빌드와 브라우저 스모크 19개 통과 기록을 보존했습니다. 최신 기능은 아래 구현·시나리오 근거와 구분합니다.",
                scope: "GitHub Actions run 33636984895 · 통합 브랜치 cb37beaec가 공개 main 2e831500에 병합됨",
            },
            {
                item: "스마트스토어 주문과 공유 재고 반영",
                method: "공개 main 구현 코드와 ADR-0047 및 ADR-0048 대조",
                rule: "변경 주문 재수신, 부분취소, 재고 부족, 반품 검수와 7일 이상 정산 중단 뒤 재개 경계를 확인",
                result: "주문별 수량 변경분만 재고에 반영했습니다. 문의는 네이버 API로 조회하고 답변하며, 주문 상태는 변경 주문 수집 결과로 갱신합니다. 정산은 미처리 날짜부터 재개합니다.",
                scope: "공개 main 2e831500 기준 · 네이버 실제 자격 증명을 사용한 운영 연동은 미검증",
            },
            {
                item: "Toss 결제 대사와 NHN 알림 최종 결과",
                method: "공개 main 구현 코드와 ADR-0032 및 ADR-0033 대조",
                rule: "중복 Toss 웹훅, 최근 7일 승인 및 취소 정산과 NHN 발송 접수 뒤 최종 수신 결과 조회 흐름을 확인",
                result: "웹훅 본문만으로 결제를 확정하지 않고 기존 조회 대사를 실행하며, NHN 접수 성공은 최종 수신 결과와 분리해 저장하도록 구현했습니다.",
                scope: "공개 main 2e831500 기준 · Toss 및 NHN 실제 자격 증명 연동은 미검증",
            },
            {
                item: "공개 페이지는 서버 렌더링하고 회원 및 결제 화면은 검색 제외",
                method: "React Router 서버 HTML 및 HTTP 응답 시나리오",
                rule: "공개 상세, 존재하지 않는 경로, 회원 및 결제와 관리자 경로를 각각 요청하고 HTML 본문, 메타데이터, 색인 정책과 HTTP 상태를 확인",
                result: "공개 화면은 메타데이터와 JSON-LD를 포함해 렌더링하고, 비공개 화면은 검색 제외, 없는 주소는 404로 응답",
                scope: "공개 main 2e831500 기준 · 실제 Node SSR 운영은 미검증",
            },
            {
                item: "주문제작 옵션, 가격과 재고 일치",
                method: "서버 가격 계산 및 MySQL 동시 재고 통합 시나리오",
                rule: "같은 SKU가 포함된 여러 주문 항목과 옵션 변경 뒤 결제 및 환불을 실행",
                result: "SKU별 수량을 합산해 ID 순서로 잠그고, 저장한 옵션과 가격으로 결제 당시 주문을 재현",
                scope: "공개 main 2e831500 기준",
            },
            {
                item: "외부 배송조회 등록 실패 재처리와 서명된 배송 상태 수신",
                method: "주문 배송 통합 테스트, 배송조회 API 변환 및 웹훅 서명 검증 테스트",
                rule: "운송장 등록 뒤 외부 배송조회 등록이 실패한 경우와 정상 및 위조 웹훅, 택배사 배송 완료 후 관리자 주문 완료를 각각 실행",
                result: "외부 등록 실패는 재처리하고 서명된 웹훅만 반영하며, 배송 완료와 주문 완료를 분리",
                scope: "2026.08.27 로컬 커밋 b50a9ef0 기준 · 실제 Delivery API 운영 자격 증명 검증 전",
            },
            {
                item: "선택 구매·재주문과 재입고 알림",
                method: "최신 소스와 기존 브라우저 시나리오 대조·로컬 화면 확인",
                rule: "선택 상품 결제, 미선택 상품 유지, 이전 주문의 가격·옵션 재확인과 품절 상품 알림 신청 흐름을 확인",
                result: "선택한 상품만 결제하고 재주문 시 현재 가격·재고·옵션을 확인합니다. 재입고 알림 신청·해지와 관리자 수요 조회를 구현했습니다.",
                scope: "2026.09.06 공개 main 87e9987 · 선택 구매 화면은 모의 API · 실제 결제·외부 알림 미검증",
            },
        ],
        category: "개인 프로젝트",
        role: "요구사항 정리, Java 및 Spring Boot API, React 화면, 결제 및 스마트스토어 연동과 자동화 테스트",
        oneLine: "상품 주문, 결제, 클래스 예약과 스마트스토어 관리 기능을 구현했습니다.",
        status: {
            label: "운영 상태",
            text: "2026년 9월 6일 공개 main 87e9987을 확인했습니다. 선택 구매·재주문·재입고 알림·단체수업 문의와 스마트스토어 운영을 구현했습니다. 실제 외부 계정 연동은 미검증입니다. AWS 주요 리소스는 2026년 5월 3일 종료했고 k3s 노트북 운영은 아직 시작하지 않았습니다.",
        },
        visualCaption:
            "최신 UI에 E2E 테스트용 모의 API 응답을 넣은 화면입니다. 실제 네이버 판매자 계정이나 PG 운영 화면은 아닙니다.",
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
                    "결제사 호출을 DB 트랜잭션 밖으로 분리하고 전후 상태를 독립 트랜잭션으로 저장했습니다. 결과를 확인하지 못하면 결제 orderId와 환불을 생성할 때 저장한 UUID로 PG 처리 결과를 조회합니다.",
                validation:
                    "실패 이력 보존, 같은 orderId 및 환불 UUID의 결과 재사용, 늦은 응답 차단과 결과 재조회를 통합 테스트로 확인했습니다.",
                boundary:
                    "결제 및 환불 처리 상태와 결과 조회 경로가 늘어 운영자 확인 화면이 복잡해졌습니다. 실제 Toss Payments의 응답 지연과 장애를 포함한 연동 테스트는 남아 있습니다.",
            },
            {
                number: "03",
                title: "서버 중단 후 미전송 알림 재처리",
                constraint:
                    "주문이나 예약을 커밋한 직후 프로세스가 종료되면 알림 호출 자체가 사라질 수 있습니다.",
                decision:
                    "업무 상태와 알림 Outbox를 함께 저장하고 미전송 건은 스케줄러가 다시 처리합니다. NHN 접수 ID로 최종 수신 결과를 조회해 실제 전달 성공만 SENT로 확정하고, 알림톡 최종 실패 뒤에만 SMS를 요청합니다.",
                validation:
                    "알림 중복 저장 차단, 서버 중단 후 인계, 최종 수신 결과 반영과 알림톡 최종 실패 뒤 SMS 전환을 통합 테스트했습니다.",
                boundary:
                    "발송 요청 접수는 최종 전달 성공이 아닙니다. 운영 자격 증명을 사용한 장기 지연과 제공자 장애 검증은 남아 있습니다.",
            },
            {
                number: "04",
                title: "동시 예약 정원과 주문 재고 초과 방지",
                constraint:
                    "클래스마다 예약 정원이 다르고 한 번에 여러 명을 예약할 수 있어, 현재 예약 인원과 새 요청 인원의 합을 잠금 없이 확인하면 정원을 넘길 수 있습니다. 마지막 재고에도 같은 문제가 있었습니다.",
                decision:
                    "예약은 클래스와 예약 슬롯 행을 잠근 뒤 인원을 확인했습니다. 주문은 상품 또는 SKU 행을 정해진 순서로 잠그고 재고를 차감했습니다.",
                validation:
                    "동시 예약과 주문에서 정원 및 재고를 넘는 요청이 거절되는지 확인했습니다.",
                boundary:
                    "단일 MySQL 기준 설계입니다. 같은 예약 슬롯이나 재고에 요청이 집중되면 잠금 대기가 늘어납니다.",
            },
            {
                number: "05",
                title: "전화번호 및 주소 암호화와 전화번호 일치 검색",
                constraint:
                    "전화번호와 주소를 평문으로 저장하지 않으면서도 주문 조회와 비회원 이력 찾기를 지원해야 했습니다.",
                decision:
                    "복원이 필요한 값은 AES-GCM으로 암호화하고 일치 검색에는 HMAC 해시를 사용했습니다.",
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
                title: "8회권 환불 시 예약 취소와 이용 횟수 및 사용 이력 반영",
                constraint:
                    "8회권 전체 환불과 예약 사용 및 취소가 동시에 실행되면 환불할 이용 횟수, 미래 예약과 사용 이력이 서로 달라질 수 있었습니다.",
                decision:
                    "환불 횟수를 잔여 이용 횟수와 취소한 미래 예약 수의 합으로 계산했습니다. 이용권과 예약을 순서대로 잠그고 취소, 이용 횟수 차감과 사용 이력을 함께 저장했습니다.",
                validation:
                    "미래 예약 2건과 잔여 6회를 합쳐 8회분 환불이 생성되고 동시 예약에도 이용 횟수와 사용 이력이 일치하는지 확인했습니다.",
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
                    "공개 HTML에 본문과 경로별 메타데이터가 포함되는지, 없는 상세와 임의 경로가 실제 404인지, 비공개 경로가 검색 제외 지시를 유지하는지 서버 렌더링 및 라우트 시나리오로 확인했습니다.",
                boundary:
                    "프런트엔드가 정적 파일 서버가 아닌 Node 프로세스가 되어 CPU, 메모리와 상태 검사가 필요합니다. 공개 문서 요청도 백엔드 공개 API 가용성에 의존합니다.",
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
                    "SKU 조합은 500개로 제한했으며 관리자가 가격과 재고를 직접 관리해야 합니다.",
            },
            {
                number: "10",
                title: "운영시간과 휴일 규칙으로 예약 회차 자동 생성",
                constraint:
                    "예약 슬롯을 매번 등록하는 수고를 줄이면서, 기존 예약의 참조와 동시성 제어는 유지해야 했습니다.",
                decision:
                    "운영시간, 휴무와 차단 규칙을 저장하고 조회할 때 예약 슬롯을 자동 생성했습니다. 기존 예약과 비활성 슬롯은 유지했습니다.",
                validation:
                    "운영시간, 휴일, 차단 시간과 동시 예약 조건에서 슬롯이 중복 생성되지 않는지 통합 테스트로 확인했습니다.",
                boundary: "조회가 몰리면 클래스 행 잠금 대기를 관찰해야 합니다.",
            },
            {
                number: "11",
                title: "배송조회 재처리와 주문 완료 분리",
                constraint:
                    "배송조회 등록 실패는 고객 조회를 막고, 웹훅만으로 주문을 완료하면 후속 처리가 너무 일찍 실행될 수 있었습니다.",
                decision:
                    "배송조회 등록 실패는 DB 상태를 기준으로 배치가 재처리합니다. 서명을 검증한 웹훅은 배송 상태만 갱신하고 주문 완료는 관리자가 확정합니다.",
                validation:
                    "배송 전 과정을 통합 테스트했습니다. 서명된 웹훅만 반영하고 관리자 확인 전에는 주문을 완료 처리하지 않는지 검증했습니다.",
                boundary:
                    "Delivery API 한 곳만 지원하며 운영 자격 증명, 장시간 장애와 웹훅 재전달은 미검증입니다.",
            },
            {
                number: "12",
                title: "스마트스토어 주문을 공유 재고에 한 번만 반영",
                constraint:
                    "스마트스토어 판매분을 반영하기 전에 자사몰 재고 수량을 보내면, 이미 판매된 수량이 재고에 다시 잡힐 수 있습니다. 변경 주문 재전송과 부분취소도 재고를 중복 변경할 수 있습니다.",
                decision:
                    "스마트스토어 변경 주문을 먼저 수집하고 상품 주문 번호를 식별자로 저장했습니다. 이미 반영한 수량과 이번에 반영할 수량의 차이만 재고에 적용한 뒤 내부 재고를 채널에 전송합니다.",
                validation:
                    "부분취소, 같은 변경 재수신, 재고 부족과 반품 검수 흐름을 공개 main 구현 코드와 ADR-0047에서 대조했습니다.",
                boundary:
                    "실제 네이버 자격 증명을 사용한 주문 수집과 재고 전송은 미검증입니다. 매핑이 없거나 새 상태가 들어오면 재고를 추측하지 않고 관리자 확인 대상으로 남깁니다.",
            },
            {
                number: "13",
                title: "외부 결제와 알림의 접수 및 최종 결과 분리",
                constraint:
                    "Toss 웹훅이나 NHN 발송 접수 응답만으로 완료를 확정하면 중복 웹훅, 정산 차이와 실제 수신 실패를 놓칠 수 있습니다.",
                decision:
                    "Toss 웹훅은 전송 ID로 한 번만 저장하고 기존 결제 조회를 다시 실행합니다. 최근 7일 정산을 거래키로 대사하고, NHN 발송 접수는 최종 수신 결과 조회 전까지 별도 상태로 둡니다.",
                validation:
                    "중복 웹훅, 승인 및 취소 정산 불일치와 NHN 최종 결과 조회 흐름을 공개 main 구현 코드와 ADR-0032 및 ADR-0033에서 대조했습니다.",
                boundary:
                    "Toss와 NHN 실제 자격 증명, 장시간 외부 장애 및 운영 데이터 대사는 미검증입니다.",
            },
            {
                number: "14",
                title: "예약 부분취소 시 환불액 및 잔여석 반영과 빈자리 알림",
                constraint:
                    "만석 회차의 취소로 자리가 생겨도 고객이 알기 어렵고, 여러 명 예약의 일부만 취소할 때 취소 인원에 맞춰 환불액과 잔여석을 계산해야 했습니다.",
                decision:
                    "빈자리가 실제로 생긴 순간 대기 신청을 종료하고 알림 작업을 함께 저장했습니다. 다인 예약은 남은 인원 비율로 예약금과 잔금을 다시 계산하고 취소한 인원만큼 잔여석을 늘립니다.",
                validation:
                    "전체취소, 부분취소와 예약 변경의 빈자리 전환 및 최소 1명을 남기는 부분취소 흐름을 통합 테스트 코드와 PRD에서 확인했습니다.",
                boundary:
                    "빈자리 알림은 좌석을 선점하지 않습니다. 실제 NHN 발송과 Toss 부분환불 자격 증명 연동은 미검증입니다.",
            },
            {
                number: "15",
                title: "선택한 상품만 결제하고 재주문 조건을 다시 확인",
                constraint:
                    "장바구니 전체를 한 번에 결제하거나 이전 주문 가격을 그대로 쓰면 원하지 않는 상품이 포함되거나 현재 판매 조건과 어긋날 수 있습니다.",
                decision:
                    "선택한 항목과 장바구니 버전을 결제 요청에 묶고 미선택 상품은 유지합니다. 재주문은 현재 가격·재고·옵션을 확인한 뒤 다시 담습니다.",
                validation:
                    "선택 유지·결제 전 장바구니 변경·재주문 조건 변경의 기존 브라우저 시나리오를 확인하고 선택 구매 화면을 로컬 촬영했습니다.",
                boundary:
                    "이전 주문의 가격과 옵션을 보장하지 않습니다. 실제 Toss 결제는 별도 검증 대상입니다.",
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
                label: "기존 GitHub Actions 결과",
                href: "https://github.com/ljkhyeong/happyGallery/actions/runs/33636984895",
                note: "초기 통합 브랜치의 백엔드와 브라우저 검증 이력",
            },
        ],
    },
    {
        ...projectSummariesById["youth-policy-mate"],
        evidenceTitle: "구현 및 검증 범위",
        systemTitle: "현재 구현 화면",
        systemNavLabel: "화면",
        screenshotNote:
            "2026년 9월 6일 로컬 앱을 390px 모바일 화면으로 촬영했습니다. 정책 목록과 상세는 온통청년에서 수집해 저장한 공개 데이터입니다. 전체 정책 목록이나 최종 신청 자격을 보장하지 않습니다.",
        screenshots: [
            {
                id: "home",
                src: "youth-policy-mate-home.webp",
                label: "모바일 홈",
                caption: "조건 입력과 공개 정책 탐색을 시작하는 모바일 홈",
                alt: "조건 입력과 공개 정책 탐색을 시작하는 모바일 홈",
                width: 780,
                height: 1688,
            },
            {
                id: "policies",
                src: "youth-policy-mate-policies.webp",
                label: "실제 정책 목록",
                caption: "로컬 DB에 저장한 공개 정책 40건의 목록과 검색",
                alt: "로컬 DB에 저장한 공개 정책 40건의 목록과 검색",
                width: 780,
                height: 1688,
            },
            {
                id: "detail",
                src: "youth-policy-mate-detail.webp",
                label: "정책 상세",
                caption: "K-패스의 지원 내용과 신청 방법을 확인하는 화면",
                alt: "K-패스의 지원 내용과 신청 방법을 확인하는 화면",
                width: 780,
                height: 1688,
            },
            {
                id: "questions",
                src: "youth-policy-mate-questions.webp",
                label: "정책별 조건 질문",
                caption: "검토한 K-패스 조건 질문으로 일부 신청 요건을 확인하는 화면",
                alt: "검토한 K-패스 조건 질문으로 일부 신청 요건을 확인하는 화면",
                width: 780,
                height: 1688,
            },
        ],
        architecture: {
            label: "웹과 업무 모듈 분리 및 API 타입 생성",
            title: "Next.js와 Spring Boot를 분리하고, 서버 DTO에서 TypeScript API 타입을 생성합니다.",
            description:
                "정책 수집, 조건 판정, 회원 저장과 알림을 기능별로 나누고 JDBC·PostgreSQL 트랜잭션으로 처리합니다. 서버 DTO에서 OpenAPI와 TypeScript 타입을 생성합니다.",
            tradeoff:
                "수집한 정책은 40건이며 5종의 질문은 일부 공통 요건만 확인합니다. 실제 OAuth 계정, 외부 이메일 수신과 AI 공급자 호출은 별도 검증이 필요합니다.",
        },
        featuredProblemNumbers: ["01", "02", "03", "04"],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "1",
                summary:
                    "서울 청년 정책 탐색, 조건 판정, 저장 및 알림의 MVP 범위와 제외 항목을 정의합니다.",
            },
            {
                id: "adr",
                label: "ADR",
                count: "2",
                summary:
                    "웹, 서버와 DB의 역할 분리 및 서버 DTO 기반 API 타입 생성 방식을 기록합니다.",
            },
            {
                id: "design",
                label: "설계",
                count: "12",
                summary: "자격 판정 기준, 정책 개정, AI 비용과 복구 및 웹 화면 상태를 설계합니다.",
            },
            {
                id: "development",
                label: "구현 기록",
                count: "50",
                summary: "작은 단위의 구현 범위, 검증 결과와 아직 연결하지 않은 기능을 기록합니다.",
            },
        ],
        documentsIntro:
            "정책 수집, 조건 질문, 회원 저장·알림과 AI 요청 복구의 구현 범위 및 남은 외부 연동을 문서로 관리합니다.",
        documents: [
            {
                type: "README",
                label: "청년정책메이트 현재 구현 범위",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/README.md",
                note: "화면, 서버 모델, 자동화 검증과 아직 연결하지 않은 외부 기능",
            },
            {
                type: "PRD",
                label: "서울 청년정책 모바일 웹앱 MVP",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/PRD/0001_product-baseline/spec.md",
                note: "대상 사용자, 정책 범위, 자격 판정, 일정과 알림의 완료 기준 및 제외 항목",
            },
            {
                type: "ADR",
                label: "기술 스택과 책임 분리",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/ADR/0001_%EA%B8%B0%EC%88%A0%EC%8A%A4%ED%83%9D%EA%B3%BC_%EC%B1%85%EC%9E%84_%EB%B6%84%EB%A6%AC.md",
                note: "Next.js, Spring Boot 모듈과 PostgreSQL의 책임 경계",
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
                note: "서울 날짜 기준 D-7, D-3 및 D-1 후보와 발송 시각 확인 기준",
            },
            {
                type: "구현 기록",
                label: "AI 중단 작업 복구와 처리 기한 갱신",
                href: "https://github.com/ljkhyeong/youth-policy-mate/blob/main/docs/development/ai-reservation-recovery-heartbeat.md",
                note: "복구 작업의 처리 기한을 갱신하고 이전 작업자의 결과는 무시",
            },
        ],
        proofs: [
            {
                item: "공개 정책 조회와 정책별 조건 질문",
                method: "현재 로컬 앱과 서버 구현·테스트 대조",
                rule: "수집한 정책 목록·상세와 조건 질문 필터를 조회하고 검토 대상 정책을 확인",
                result: "공개 정책 40건을 조회하고 검토한 5종의 정책에만 조건 질문을 제공합니다. 확인하지 못한 요건은 추가 확인으로 남깁니다.",
                scope: "2026.09.06 로컬 d6ef9d2 · 전체 서울 정책과 최종 신청 자격 판정은 아님",
            },
            {
                item: "관심 정책 저장과 일정·알림",
                method: "회원 정책 흐름과 PostgreSQL 통합 테스트 기록",
                rule: "회원별 저장·해제, 신청 일정, 알림 읽음 처리와 예약 취소 흐름을 확인",
                result: "회원별 관심 정책과 일정을 연결하고 저장 해제·동의 변경에 따른 알림 취소 및 서비스 내 알림을 구현했습니다.",
                scope: "로컬 구현·자동화 검증 기준 · 실제 카카오·네이버 로그인은 미검증",
            },
            {
                item: "이메일 동의와 발송 작업 복구",
                method: "이메일 구현 문서와 Outbox 통합 테스트 기록",
                rule: "주소 확인, 수신 동의, 암호화 저장, 예약·취소와 중단된 발송 작업을 확인",
                result: "검증한 이메일과 수신 동의를 기준으로 발송 작업을 저장하고 SMTP 어댑터와 재처리를 구현했습니다.",
                scope: "모의 발송과 로컬 검증 기준 · 실제 발신 도메인·외부 수신함 전달은 미검증",
            },
            {
                item: "AI 비용 예약과 중단 작업 복구",
                method: "PostgreSQL 통합 테스트와 모의 AI 실행기",
                rule: "호출 전 비용 예약, 응답 미확인, 정산과 처리 기한이 지난 작업자의 늦은 결과를 확인",
                result: "예산을 먼저 예약하고 결과 미확인 시 유지합니다. 현재 요청·정책 개정과 맞지 않는 늦은 결과는 적용하지 않습니다.",
                scope: "실제 AI 공급자 요청·청구와 운영 작업자는 미연결",
            },
            {
                item: "서버 자동화 검증",
                method: "저장소 검증 기록과 결과 로그 확인",
                rule: "JPA·Modulith 제거 후 JDBC 구성의 서버 전체 테스트와 빌드를 확인",
                result: "서버 테스트 436개와 빌드가 통과했습니다. 이후 문서 변경에는 같은 검증을 반복하지 않았습니다.",
                scope: "c8cfc33 검증 기록 · 현재 d6ef9d2 · 이번 포트폴리오 작업에서 서버 전체 검사를 재실행한 결과는 아님",
            },
        ],
        category: "개인 모바일 웹앱 프로젝트",
        role: "제품 요구사항, Next.js 화면, Java 및 Spring Boot 서버, PostgreSQL 상태 모델과 자동화 테스트 구현",
        oneLine:
            "확인되지 않은 조건과 마감일은 확정하지 않습니다. 과거 정책 개정과 이전 AI 요청 결과가 최신 데이터를 덮지 않도록 처리하는 모바일 웹앱을 개발합니다.",
        status: {
            label: "현재 상태",
            text: "로컬에서 공개 정책 40건과 검토한 5종의 조건 질문을 제공합니다. 로그인, 관심 정책 저장, 일정, 서비스 내 알림과 이메일 발송 처리를 구현했습니다. 실제 OAuth 계정·외부 이메일 수신·AI 공급자는 미검증이며 공개 운영 전입니다.",
        },
        visualCaption:
            "실제 공개 정책을 저장한 로컬 DB로 촬영한 모바일 화면입니다. 조건 질문은 일부 요건을 확인하며 최종 신청 자격은 공식 안내에서 확인합니다.",
        problems: [
            {
                number: "01",
                title: "확인되지 않은 정책 조건을 신청 가능으로 단정하지 않음",
                constraint:
                    "정책 조건을 해석하지 못했거나 사용자 정보가 없을 때 단순 참과 거짓으로 처리하면 신청 가능 여부를 잘못 안내할 수 있습니다.",
                decision:
                    "연령, 거주, 취업과 소득을 항목별로 비교하고 가능, 불가, 추가 확인 필요로 집계했습니다. 판정에는 정책 개정, 조건 정의와 기준일을 함께 남깁니다.",
                validation:
                    "조건 충족·불충족·정보 누락의 집계 규칙을 테스트하고 실제 정책 5종의 검토한 질문과 연결했습니다.",
                boundary:
                    "질문은 검토한 정책의 일부 공통 요건만 다룹니다. 환급액·예외·모집 기간 등 최종 신청 조건은 공식 안내에서 확인해야 합니다.",
            },
            {
                number: "02",
                title: "날짜 마감과 시각 마감을 구분하고, 미확인 마감일은 제외",
                constraint:
                    "날짜 마감과 시각 마감을 같은 방식으로 비교하거나 상시 및 기간 미확인 정책에 임의 마감일을 만들면 잘못된 알림을 보낼 수 있습니다.",
                decision:
                    "마감의 날짜·시간대와 수신 동의를 확인해 D-7·D-3·D-1 알림을 예약합니다. 관심 정책 해제와 동의 변경 시 관련 예약을 취소합니다.",
                validation:
                    "미확인 마감 제외, 중복 예약 방지, 저장 해제와 동의 변경 뒤 취소를 서버 테스트로 확인했습니다.",
                boundary:
                    "서비스 내 알림과 SMTP 어댑터를 구현했으며 실제 이메일 수신함 전달은 검증하지 않았습니다.",
            },
            {
                number: "03",
                title: "과거 정책 개정과 늦은 AI 결과의 덮어쓰기 차단",
                constraint:
                    "수집과 AI 처리가 비동기로 끝나면 이전 정책 개정이나 오래된 요청의 결과가 최신 정책을 덮을 수 있습니다.",
                decision:
                    "AI 요약 및 조건 추출 후보의 원본, 정책 개정, 생성 방식과 요청 순번을 비교해 현재 상태와 맞는 후보만 반영합니다. 요청 실패나 예산 한도로 처리 보류 시 기존 후보를 유지합니다.",
                validation:
                    "실제 정책 수집·개정 저장과 모의 AI 후보 처리에서 이전 개정 및 오래된 요청 결과의 반영 차단을 확인했습니다.",
                boundary:
                    "정책 수집과 DB 저장은 연결했습니다. 실제 AI 공급자 호출과 청구 처리는 미연결입니다.",
            },
            {
                number: "04",
                title: "AI 호출 예산 예약과 중단 작업 복구 규칙",
                constraint:
                    "외부 AI 호출 전 비용을 확보하지 않으면 동시에 예산을 초과할 수 있고, 응답을 잃은 요청을 바로 다시 보내면 중복 과금될 수 있습니다.",
                decision:
                    "PostgreSQL에서 최대 비용을 먼저 예약하고 외부 호출은 트랜잭션 밖에서 실행합니다. 결과 미확인은 예약을 유지하며 복구 작업자의 처리 기한, 순번과 heartbeat로 늦은 결과를 차단합니다.",
                validation:
                    "예약 및 정산, 결과 미확인, 작업자 교체, heartbeat 갱신 실패와 이전 작업자의 늦은 결과를 PostgreSQL 통합 테스트와 모의 실행기로 확인했습니다.",
                boundary:
                    "비용 예약·복구 모델과 모의 공급자를 검증했습니다. 실제 AI 요청, 청구 조회와 운영 작업자는 연결하지 않았습니다.",
            },
            {
                number: "05",
                title: "서버 DTO와 웹 API 타입 일치",
                constraint:
                    "웹과 서버가 요청 및 응답 타입을 따로 관리하면 자격 상태나 날짜 의미가 한쪽에서만 바뀔 수 있습니다.",
                decision:
                    "서버 DTO에서 OpenAPI와 TypeScript 타입을 생성하고 생성 결과가 최신인지 CI에서 확인합니다.",
                validation:
                    "공개 정책·회원 저장·일정·알림 API의 생성 타입 검사와 웹 빌드 검증 기록을 확인했습니다.",
                boundary:
                    "개발 전용 예시 경로는 운영 빌드에서 제외합니다. 실제 OAuth와 SMTP 외부 연동은 별도 확인이 필요합니다.",
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
                note: "PRD, ADR와 기능별 설계 및 구현 범위",
            },
            {
                label: "초기 공개 CI 결과",
                href: "https://github.com/ljkhyeong/youth-policy-mate/actions/runs/33639454878",
                note: "초기 공개 버전의 CI 이력. 최신 로컬 검증은 현재 상태에 별도 표시합니다.",
            },
        ],
    },
    {
        ...projectSummariesById["hope-commit"],
        evidenceTitle: "구현 및 자동화 테스트",
        systemTitle: "커밋 검토 처리 흐름",
        systemNavLabel: "처리 흐름",
        screenshotNote: "실제로 생성한 HTML 리뷰 화면입니다.",
        screenshots: [
            {
                id: "review-summary",
                src: "hope-commit-review-summary.webp",
                label: "커밋 리뷰 요약",
                caption: "대상 커밋, 변경 범위와 검증 결과",
                alt: "Hope Commit HTML에서 대상 커밋과 변경 범위 및 검증 결과를 확인하는 모습",
                width: 1440,
                height: 900,
            },
            {
                id: "review-evidence",
                src: "hope-commit-review-evidence.webp",
                label: "참조한 변경 코드",
                caption: "리뷰 설명과 참조한 파일 및 코드 줄",
                alt: "Hope Commit HTML에서 리뷰 설명과 참조한 파일 및 코드 줄을 확인하는 모습",
                width: 1440,
                height: 900,
            },
        ],
        architecture: {
            label: "검토 범위",
            title: "지정한 커밋의 diff만 리뷰합니다.",
            description:
                "일반 커밋은 첫 부모, 최초 커밋은 빈 상태, 병합 커밋은 사용자가 고른 부모를 비교 기준으로 확정합니다. 작업 파일이 바뀌어도 입력한 커밋과 비교 기준에 저장된 코드만 사용합니다.",
            tradeoff:
                "같은 커밋의 변경 내용을 다시 수집하려면 해당 커밋이 로컬에 있어야 합니다. CI, 이슈와 토론은 자동으로 가져오지 않습니다.",
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
                href: "https://github.com/ljkhyeong/hope-commit/blob/main/plugins/hope/skills/commit/SKILL.md",
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
                item: "입력한 커밋과 비교 기준 확정",
                method: "테스트용 Git 저장소를 사용한 Commit Diff 코드 수집 테스트",
                rule: "짧은 커밋 ID, 일반 커밋의 첫 번째 부모, 최초 커밋의 빈 상태와 병합 커밋에서 사용자가 고른 부모를 각각 확정해 저장된 변경 파일을 수집",
                result: "수집기는 커밋 ID와 비교 기준을 고정했습니다. textconv와 색상 출력을 끈 상태에서 파일 이름 변경 정보와 추가 및 삭제 줄 수를 보존했고, UTF-8이 아닌 경로는 거절했습니다.",
                scope: "공개 v5.0.2 및 main 커밋 9d8392d의 commit-collector.test.mjs 기준",
            },
            {
                item: "비공개 파일과 토큰 제외 및 리뷰 근거 검증",
                method: "비공개 경로, 토큰 형태와 변경 파일 및 줄 위치 검증 테스트",
                rule: "분석 과정에서 추가로 요청한 파일도 본문을 읽기 전에 비공개 경로인지 검사. 변경 파일에서 발견한 토큰 및 인증 키 형태의 값은 분석 입력과 HTML에서 제외",
                result: "검증기는 비공개 경로와 자격 증명을 제외하고, 수집하지 않은 파일과 줄을 가리킨 리뷰를 거절했습니다.",
                scope: "공개 v5.0.2 및 main 커밋 9d8392d의 비공개 경로 및 토큰 차단 규칙 기준",
            },
            {
                item: "검증이 끝난 결과만 새 HTML로 저장",
                method: "커밋 선택부터 HTML 저장까지 전체 처리 테스트",
                rule: "입력 커밋과 비교 기준을 확정하고 리뷰 설명의 파일, 줄과 JSON 형식을 확인한 뒤, 저장 직전에 실행 식별자와 검토 버전이 처음 확인한 값과 같은지 다시 확인한 경우에만 새 HTML 파일 생성",
                result: "저장기는 중단 후 빈 파일을 남기지 않고 재개했으며, 다른 실행의 디렉터리와 기존 결과를 유지했습니다.",
                scope: "공개 v5.0.2 및 main 커밋 9d8392d의 commit-lifecycle.test.mjs 기준",
            },
            {
                item: "저장소 자동화 테스트",
                method: "Node.js 내장 테스트 러너로 npm test 실행",
                rule: "Commit Diff와 원본 Hope의 코드 수집, 결과 검증, HTML 생성 및 플러그인 설치 기능이 유지되는지 자동화 테스트 실행",
                result: "공개 v5.0.2의 GitHub Actions Node.js 22 환경에서 자동화 테스트 343개가 통과했습니다.",
                scope: "공개 main 커밋 9d8392d · GitHub Actions run 33632058777",
            },
        ],
        category: "오픈소스 및 개발 도구",
        role: "SeungIl 님의 Hope 6.0.0 포크에 로컬 커밋 비교, 참조한 코드를 표시하는 HTML 리뷰와 자동화 테스트 추가",
        oneLine:
            "지정한 커밋의 diff만 리뷰하고, 참조한 파일과 코드 줄을 검증한 결과를 새 HTML로 저장합니다.",
        status: {
            label: "공개 상태",
            text: "SeungIl 님의 Hope 6.0.0에서 파생한 비공식 포크이며, 제가 추가한 Commit Diff는 README와 NOTICE에 구분했습니다. 공개 릴리스와 main은 v5.0.2입니다. 현재 로컬 작업 브랜치는 긴 커밋 본문 분할, 파일과 심볼릭 링크 변경 지원 및 리뷰 한도 계산 보완 3건을 추가했지만 공개 main과 합치지 않았습니다.",
        },
        visualCaption: "커밋 확정 → 변경 수집 → 참조한 코드 줄 검증 → HTML 저장 순서입니다.",
        problems: [
            {
                number: "01",
                title: "지정한 커밋의 diff만 리뷰",
                constraint:
                    "스테이징한 파일, 수정 중인 파일과 추적하지 않는 파일을 함께 읽으면 특정 커밋에 없던 내용이 검토 결과에 섞일 수 있습니다.",
                decision:
                    "커밋 종류에 맞는 비교 기준을 확정하고 입력한 커밋과 비교 기준에 저장된 코드만 읽습니다. textconv와 색상 출력을 끄고 UTF-8이 아닌 경로를 거절합니다.",
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
                title: "리뷰가 참조한 파일과 코드 줄 검증",
                constraint:
                    "분석 모델이 이전 대화나 추측을 섞으면 실제 변경 코드가 뒷받침하지 않는 설명과 지적이 생성될 수 있습니다.",
                decision:
                    "이전 대화를 전달하지 않은 별도 AI 분석에서 리뷰 설명을 받습니다. 각 설명을 실제 변경 파일과 줄에 연결해 JSON Schema와 수집 범위로 검증합니다.",
                validation:
                    "수집하지 않은 파일 및 줄, 잘못된 범위와 형식, 과도하게 긴 설명을 거절하는지 테스트했습니다.",
                boundary:
                    "이전 대화 없이 별도 AI 분석을 실행할 수 없으면 검토를 중단합니다. 코드 줄 연결 여부는 확인할 수 있지만 리뷰 판단이 반드시 옳다는 뜻은 아니므로 사용자가 최종 확인해야 합니다.",
            },
            {
                number: "04",
                title: "검증을 통과한 리뷰만 저장하고 중단 작업 재개",
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
        evidenceTitle: "구현 및 공개 검증",
        systemTitle: "코드 변경 근거 기록",
        systemNavLabel: "기록 흐름",
        architecture: {
            label: "공개 기준",
            title: "변경 근거를 커밋과 코드 위치에 연결하고, 확인 후 코드가 바뀌면 기록 공개를 차단합니다.",
            description:
                "사용자 요청, 변경 근거와 출처, 전체 커밋 해시, 저장소 스냅샷과 파일 및 줄의 내용 해시를 한 기록에 저장합니다. 검증은 실행한 명령과 종료 코드, 실행 시간, 출력 해시 및 요약으로 남깁니다.",
            tradeoff:
                "기록 공개 시 제출한 해시를 확인하고, 별도 조회에서 GitHub 원본 코드와 비교합니다. 서버는 테스트 실행 사실까지 검증하지 않습니다. 메모리 세션을 쓰는 단일 인스턴스만 지원합니다.",
        },
        featuredProblemNumbers: ["01", "02", "03", "04"],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "5",
                summary:
                    "MVP, GitHub 게시, 팀 권한과 IntelliJ 조회 및 기록 탐색 범위를 정의합니다.",
            },
            {
                id: "adr",
                label: "ADR",
                count: "7",
                summary: "기록 형식, 게시, 인증, 배포와 클라이언트 역할을 기록합니다.",
            },
            {
                id: "operations",
                label: "운영 및 릴리스",
                count: "2",
                summary: "단일 인스턴스 배포, 백업, 복구와 릴리스 절차를 관리합니다.",
            },
        ],
        documentsIntro:
            "변경 기록·GitHub 게시·인증, 웹·IntelliJ·Zed 조회와 배포·복구 절차를 관리합니다.",
        documents: [
            {
                type: "README",
                label: "IntentTrace 사용 및 현재 범위",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/README.md",
                note: "기록 수명주기, REST 및 MCP, GitHub 게시와 IntelliJ 사용 방법",
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
                note: "전체 커밋 해시, 스냅샷과 파일 및 줄 해시를 기록에 묶는 결정",
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
                type: "PRD",
                label: "IntelliJ 현재 줄 의도 조회",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/PRD-0004-intellij-line-intent.md",
                note: "커밋된 현재 파일의 한 줄에서 공개 변경 기록을 찾는 범위",
            },
            {
                type: "PRD",
                label: "IntelliJ 변경 기록 탐색",
                href: "https://github.com/ljkhyeong/intent-trace/blob/main/docs/PRD-0005-record-browser.md",
                note: "저장소, 파일과 상태별 팀 공개 기록 및 내 비공개 기록 조회 범위",
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
        proofs: [
            {
                item: "작성자 확인 후 코드가 바뀌면 변경 기록 공개 차단",
                method: "서버 도메인 및 JDBC 통합 테스트",
                rule: "초안 생성, 다른 작성자의 확인 거절, 전체 커밋 해시 연결, 작성자 확인 후 코드가 바뀐 상태의 공개와 새 공개 기록으로 대체를 실행",
                result: "DRAFT → AUTHOR_CONFIRMED → PUBLISHED → SUPERSEDED 순서를 적용하고, 작성자가 확인한 코드 상태와 공개 요청 때 제출한 코드 상태가 다르면 게시를 거절합니다.",
                scope: "공개 main b641831의 서버 테스트 기준",
            },
            {
                item: "요청 및 GitHub 게시 중복 처리 방지",
                method: "REST, JDBC와 GitHub Check Run 통합 테스트",
                rule: "같은 requestId와 같은 또는 다른 payload를 재전송하고, 같은 PR HEAD에 게시 요청을 반복하며 동시 상태 변경을 실행",
                result: "같은 payload는 기존 결과를 반환하고 다른 payload는 충돌로 차단합니다. 유일 제약과 낙관적 잠금으로 상태 경쟁을 막고 기존 Check Run을 갱신합니다.",
                scope: "공개 main b641831의 서버 테스트 기준",
            },
            {
                item: "GitHub 사용자와 저장소 권한 확인",
                method: "OAuth, GitHub App 및 인증 필터 테스트",
                rule: "state와 PKCE 검증, user token 갱신, 저장소 읽기 및 쓰기 권한과 세션 재사용 및 폐기를 실행",
                result: "GitHub 사용자를 확인한 뒤 읽기와 쓰기 권한을 분리하고, access 및 refresh token과 its_ 세션을 프로세스 메모리에만 보관합니다.",
                scope: "공개 main b641831 기준 · 서버 재시작 시 세션 소멸 · 실제 공개 운영 미검증",
            },
            {
                item: "IntelliJ 현재 줄 및 변경 기록 조회",
                method: "IntelliJ 플러그인 자동화 테스트와 로컬 GitHub OAuth 연동 확인",
                rule: "GitHub remote, 전체 HEAD, 저장소 상대 경로와 현재 줄로 조회하고 저장소, 파일과 상태 조건으로 기록 목록을 탐색",
                result: "커밋된 현재 줄과 팀 공개 및 내 비공개 기록을 조회하고 its_ 세션 토큰을 PasswordSafe에 저장하도록 구현했습니다. 실제 GitHub OAuth 세션으로 목록 조회까지 로컬 확인했습니다.",
                scope: "IntelliJ IDEA 2025.3.2 대상, 일부 상태 필터와 커밋 없는 기록의 이동 버튼은 수동 검증 미완료, Marketplace 배포 및 공개 운영은 미검증",
            },
            {
                item: "실행 JAR과 체크섬 공개",
                method: "GitHub Release 자산 및 SHA-256 파일 확인",
                rule: "v0.7.0 태그의 실행 JAR 및 IntelliJ 플러그인 ZIP과 각 SHA-256 파일이 함께 게시됐는지 확인",
                result: "v0.7.0 실행 JAR, IntelliJ 플러그인 ZIP과 SHA-256 파일을 공개 릴리스에서 제공합니다.",
                scope: "공개 릴리스 v0.7.0 기준",
            },
            {
                item: "웹 기록 조회와 원본 코드 비교",
                method: "서버 통합 테스트 기록·생성 HTML 촬영",
                rule: "저장소·작성자·상태 필터, 파일·줄 조회, GitHub 코드 비교와 변경 이력을 확인",
                result: "웹에서 팀 공개 기록과 내 비공개 기록을 찾고 코드 해시를 비교합니다. 권한이 없는 기록은 노출하지 않고 조회 중단 사유와 재개 위치를 제공합니다.",
                scope: "로컬 a5b98ac · 서버 생성 HTML과 모의 GitHub 데이터 · 실제 GitHub 게시 미검증",
            },
            {
                item: "Zed MCP 연결과 최신 로컬 검증",
                method: "저장소 인계 문서·Zed 연결 테스트 기록",
                rule: "Zed JSONC 설정, 표준 MCP 중계, 연결 진단과 세션 폐기 후 재연결을 확인",
                result: "Zed 1.18.1에서 승인 인자 확인·기록 조회·세션 폐기 후 재연결을 확인했습니다. 서버와 IntelliJ·Zed 자동화 검증 기록도 유지합니다.",
                scope: "실제 Zed 앱 검증의 GitHub·모델 응답은 로컬 stub · 최신 정리 작업에서 IDE 검증은 재실행하지 않음",
            },
        ],
        category: "오픈소스 및 개발 도구",
        role: "Kotlin·Spring 서버, 웹 기록 조회·원본 비교, GitHub 인증·게시와 IntelliJ·Zed·MCP 연동 구현",
        oneLine:
            "사용자 요청, 변경 근거와 검증 결과를 코드 위치에 기록하고 작성자가 확인한 기록을 팀에 공개합니다.",
        status: {
            label: "현재 상태",
            text: "공개 릴리스는 v0.7.0이며 최신 로컬 서버·IntelliJ는 0.12.3-SNAPSHOT, Zed 연결 도구는 0.12.2입니다. 웹 기록 조회·코드 비교·연결 관리와 Zed MCP 연동을 추가했습니다. Marketplace와 최신 기능의 실제 GitHub 게시·공개 운영은 미검증입니다.",
        },
        visualCaption:
            "원문 대화와 숨은 추론은 저장하지 않습니다. 작성자 확인 뒤 코드가 바뀌면 공개를 차단합니다.",
        problems: [
            {
                number: "01",
                title: "원문 대화 대신 확인 가능한 요청과 판단만 저장",
                constraint:
                    "AI 대화 전체와 숨은 추론을 저장하면 개인정보와 자격 증명이 섞일 수 있고, 코드 변경 이유를 찾기도 어렵습니다.",
                decision:
                    "사용자 요청, 확인 가능한 변경 근거 및 출처, 검증 요약만 구조화했습니다. 원문 대화, 숨은 추론과 검증 원문 출력은 저장하지 않습니다.",
                validation:
                    "민감한 필드와 허용 길이, 중첩 값 및 Markdown 출력에서 원문이 포함되지 않는지 테스트했습니다.",
                boundary:
                    "변경 근거와 출처는 확인 가능한 사실만 담습니다. 설명할 수 없는 내부 추론을 복원하거나 저장하지 않습니다.",
            },
            {
                number: "02",
                title: "기록을 전체 커밋 해시와 코드 위치에 고정",
                constraint:
                    "짧은 커밋 ID나 파일명만 남기면 이후 코드가 바뀌었을 때 어느 상태를 설명하는 기록인지 판단하기 어렵습니다.",
                decision:
                    "전체 커밋 해시, 저장소 스냅샷, 파일 경로와 줄 범위 및 내용 해시를 저장합니다. 작성자가 확인한 뒤 코드가 바뀌면 공개하지 않습니다.",
                validation:
                    "불완전한 커밋 ID, 다른 스냅샷, 잘못된 줄 범위와 해시 형식을 거절하는 시나리오를 테스트했습니다.",
                boundary:
                    "공개 요청에는 클라이언트가 제출한 코드 해시를 사용합니다. 별도 근거 조회에서 GitHub 원본과 비교하며 테스트 실행 여부는 서버가 확인하지 않습니다.",
            },
            {
                number: "03",
                title: "같은 요청과 PR 게시를 한 건으로 유지",
                constraint:
                    "네트워크 재시도와 동시 요청이 같은 초안이나 GitHub Check Run을 여러 건 만들 수 있습니다.",
                decision:
                    "requestId의 payload를 비교하고 DB 유일 제약과 낙관적 잠금을 적용했습니다. 같은 PR에는 기존 Check Run ID를 저장해 갱신합니다.",
                validation:
                    "같은 요청 재전송, 다른 payload 충돌, 동시 상태 변경과 Check Run 반복 게시를 테스트했습니다.",
                boundary:
                    "Fork에서 만든 PR의 Check Run 게시는 지원하지 않습니다. 게시 요청 직렬화도 단일 앱 프로세스 안에서만 보장합니다.",
            },
            {
                number: "04",
                title: "GitHub 사용자와 저장소 권한을 요청마다 확인",
                constraint:
                    "팀 기록에는 저장소별 비공개 초안이 있어 단순 공유 토큰만으로 작성자와 읽기 및 쓰기 권한을 구분할 수 없습니다.",
                decision:
                    "GitHub OAuth로 사용자를 확인하고 저장소 권한을 요청마다 조회합니다. GitHub user token과 its_ 세션은 메모리에만 보관합니다.",
                validation:
                    "PKCE와 state, 토큰 갱신, 작성자 소유권 및 저장소 읽기와 쓰기 권한을 테스트했습니다.",
                boundary:
                    "서버를 재시작하면 세션이 사라집니다. 공유 세션 저장소가 없어 다중 인스턴스와 무중단 배포는 지원하지 않습니다.",
            },
            {
                number: "05",
                title: "PR, 현재 코드 줄과 기록 목록에서 같은 변경 근거 조회",
                constraint:
                    "변경 기록이 별도 화면에만 있으면 PR 리뷰와 이후 코드 탐색 중 필요한 시점에 찾기 어렵습니다.",
                decision:
                    "PR HEAD가 기록 커밋과 같을 때 Check Run으로 게시합니다. 웹·IntelliJ·Zed에서는 저장소·파일·줄을 기준으로 관련 기록을 찾고 코드 비교와 변경 이력을 확인합니다.",
                validation:
                    "웹의 권한·필터·부분 조회·재개와 IntelliJ·Zed 연결 검증 기록을 확인했습니다. 웹 화면은 서버 테스트가 생성한 HTML로 촬영했습니다.",
                boundary:
                    "IntelliJ에서 기록 생성과 callback token 자동 수신은 제공하지 않습니다. 일부 상태 필터와 커밋 없는 기록의 이동 버튼은 수동 검증을 마치지 못했습니다.",
            },
        ],
        stack: [
            "Kotlin 2.3.21",
            "JDK 21",
            "Spring Boot 4.1.1",
            "Spring AI MCP 2.0.1",
            "Spring MVC",
            "Spring Data JDBC",
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
                label: "main GitHub Actions 결과",
                href: "https://github.com/ljkhyeong/intent-trace/actions/runs/33634146017",
                note: "공개 main b641831의 서버, IntelliJ와 릴리스 자동화 검증",
            },
            {
                label: "v0.7.0 릴리스",
                href: "https://github.com/ljkhyeong/intent-trace/releases/tag/v0.7.0",
                note: "실행 JAR, IntelliJ 플러그인 ZIP과 SHA-256 파일",
            },
        ],
        linkNote:
            "공개 저장소와 자동화 결과만 연결했습니다. GitHub App 자격 증명과 운영 주소는 포함하지 않습니다.",
        screenshots: [
            {
                id: "history",
                src: "intent-trace-history.webp",
                label: "파일·줄로 기록 찾기",
                caption: "파일 경로와 코드 줄로 관련 변경 기록을 찾는 웹 화면",
                alt: "파일 경로와 코드 줄로 관련 변경 기록을 찾는 웹 화면",
                width: 1440,
                height: 960,
            },
            {
                id: "evidence",
                src: "intent-trace-evidence.webp",
                label: "GitHub 코드와 비교",
                caption: "저장소 스냅샷과 관련 코드의 해시 일치 여부를 확인하는 웹 화면",
                alt: "저장소 스냅샷과 관련 코드의 해시 일치 여부를 확인하는 웹 화면",
                width: 1440,
                height: 960,
            },
        ],
        screenshotNote:
            "서버 통합 테스트가 생성한 최신 HTML을 2026년 9월 6일 로컬 Chrome에서 촬영했습니다. 저장소·커밋·기록은 테스트 데이터이며 실제 GitHub 게시 결과가 아닙니다.",
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
                item: "PDF 완료 응답 순서 역전 처리",
                method: "PDF 변환 요청 상태 저장과 변환 완료 응답의 순서를 바꾼 시나리오 확인",
                rule: "PDF 변환 완료 응답이 요청 상태의 DB 저장보다 먼저 도착하도록 실행",
                result: "요청 상태를 간격을 늘려 재조회해 먼저 도착한 PDF 완료 결과를 반영했습니다.",
                scope: "보안상 운영 수치와 테스트 코드는 비공개",
            },
        ],
        category: "BEINTECH / LG CNS 컨소시엄 공공 SI",
        role: "KICS 요청을 통신사용 또는 포털용 형식으로 변환해 보내고, 제출 자료를 KICS에 반영하는 서버와 Spring Batch 구현",
        oneLine:
            "KICS 요청을 통신사와 집행포털 규격으로 변환해 보내고, 제출 자료를 KICS에 반영했습니다.",
        status: {
            label: "공개 범위",
            text: "BEINTECH 소속으로 LG CNS 컨소시엄에 참여 중입니다. 담당 연계 구조와 역할만 공개하며 접속 주소, 설정, 소스와 내부 문서는 제외했습니다.",
        },
        systemTitle: "KICS와 기관 간 요청 및 자료 연계 흐름",
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
        stack: [
            "Java 11",
            "Spring Boot 2.6",
            "Spring Batch",
            "Oracle Database",
            "WebSquare",
            "Maven",
        ],
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
                item: "기관별 수용자 자료 반영 배치의 중단 단계 확인 및 재실행",
                method: "기관별 배치 실행 결과, 업무 서버 로그와 Tibero 처리 상태 확인",
                rule: "군사법원, 군검찰 및 군사경찰 자료 반영 배치를 기관별로 실행하고, 중단되면 Jenkins 실행 이력과 JEUS 로그 및 Tibero 상태를 대조해 해당 기관 배치를 재실행",
                result: "중단된 기관 배치를 재실행해 인적정보와 영장정보의 군교정 DB 반영 확인",
                scope: "운영 건수, 내부 데이터와 세부 연계 규격은 비공개",
            },
            {
                item: "WebSquare 상태 변경 요청의 CSRF 차단",
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
        role: "군교정 업무 화면, 세 기관 수용자 정보 연계 배치와 중단 배치 재실행",
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
                    "기관별 수신 이력, Jenkins 실행 결과, 서버 로그와 Tibero 상태로 중단 단계를 찾았습니다. 재처리 후 인적정보와 영장정보의 군교정 DB 반영을 확인했습니다.",
                boundary:
                    "외부 모니터링 도구를 자유롭게 설치할 수 없어 일부 확인은 수동 절차와 기관 담당자 협업이 필요했습니다.",
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
        role: "mediasoup RTP-HLS 변환 서버와 WebRTC 및 HLS React 재생 화면 구현",
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
        label: "모바일 웹앱",
        title: "모바일 웹앱 프로젝트",
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

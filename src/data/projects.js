export const projectList = [
    {
        id: "baton",
        index: "01",
        presentation: "featured",
        title: "BATON",
        eyebrow: "조직 운영 플랫폼",
        summary:
            "조직 운영의 기준 데이터는 Core에 두고, 링크, URL 점검, 메시지 전송을 실패 특성에 따라 별도 마이크로서비스로 분리했습니다.",
        period: "2026.07.20 — 진행 중",
        evidenceAsOf: "2026.08.09 저장소 기준",
        route: "/projects/baton",
        tags: ["Java 21", "Spring Boot", "MySQL / PostgreSQL", "Outbox"],
        visual: "baton",
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
            title: "Core는 기준 데이터를, 연계 마이크로서비스는 외부 실패를 맡습니다.",
            description:
                "Core가 팀, 시즌, 권한, 루틴, 핸드오프의 기준 데이터를 관리합니다. GO, WATCH, RELAY는 서로 다른 보안, 지연, 재시도 요구를 독립된 저장소와 실행 환경으로 분리했습니다.",
            tradeoff:
                "서비스별 장애와 배포 범위는 분리되지만 저장소, 배포, 관측 지점이 늘고 서비스 사이 정합성을 별도로 관리해야 합니다.",
        },
        spotlights: [
            {
                serviceId: "go",
                label: "GO / 멱등성",
                title: "동시 요청 8건을 링크 1건으로 수렴",
                problem:
                    "응답이 유실되거나 여러 서버가 같은 요청을 받으면 링크가 중복 생성될 수 있었습니다.",
                solution:
                    "UUID 멱등 키와 요청 해시를 저장하고 HMAC-SHA256으로 링크 코드를 결정했습니다. 같은 키의 다른 요청은 거절합니다.",
                tradeoff:
                    "멱등 기록을 보관하는 비용이 들고, HMAC 키 교체와 DB 복구 시 기존 링크를 유지할 절차가 필요합니다.",
            },
            {
                serviceId: "watch",
                label: "WATCH / 안전한 점검",
                title: "네트워크 I/O와 DB 락을 분리",
                problem:
                    "느린 URL 점검 중 DB 락을 잡으면 경합이 커지고, 늦게 끝난 작업이 최신 결과를 덮을 수 있었습니다.",
                solution:
                    "DNS pinning과 SSRF 차단을 적용하고, lease와 source revision 펜싱으로 오래된 결과를 거절했습니다.",
                tradeoff:
                    "lease가 짧으면 중복 실행이 늘고 길면 장애 복구가 늦어져, 운영 지표에 맞춘 시간 조정이 필요합니다.",
            },
            {
                serviceId: "relay",
                label: "RELAY / 복구",
                title: "전송 결과를 모르면 다시 보내지 않음",
                problem:
                    "외부 전송은 성공했지만 응답만 잃으면 재시도가 중복 발송으로 이어질 수 있었습니다.",
                solution:
                    "inbox 중복 제거, SKIP LOCKED 작업 선점, lease token을 사용하고 처리 결과 미확인은 OUTCOME_UNKNOWN으로 남겼습니다.",
                tradeoff:
                    "중복 발송 방지를 우선해 자동 재전송을 멈추므로, 결과 조회나 수동 조정 절차가 추가로 필요합니다.",
            },
        ],
        documentGroups: [
            {
                id: "prd",
                label: "PRD",
                count: "14",
                summary: "서비스별 책임, 입력 계약과 완료 조건을 정의합니다.",
            },
            {
                id: "adr",
                label: "ADR",
                count: "43",
                summary: "기술 선택의 이유, 대안과 트레이드오프를 기록합니다.",
            },
            {
                id: "runbook",
                label: "Runbook",
                count: "5",
                summary: "배포, 복구와 공개 staging 검증 절차를 정리합니다.",
            },
            {
                id: "api",
                label: "API Contract",
                count: "1",
                summary: "Core OpenAPI를 서비스 계약의 기준으로 관리합니다.",
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
                note: "동시 요청과 재시도를 한 결과로 수렴시킨 결정 요약",
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
                label: "WATCH 공개 staging 전달 검증",
                href: "https://github.com/ljkhyeong/baton-watch/blob/main/docs/runbooks/public-staging-event-delivery.md",
                note: "최초 전달, 응답 유실 재전송과 적체 이벤트 복구를 검증하는 운영 절차",
            },
            {
                serviceId: "relay",
                type: "ADR 요약",
                label: "RELAY 전송 시도 복구",
                href: "/docs/baton/relay-attempt-recovery.md",
                note: "외부 호출 전 시도 의도를 저장하고 복구하는 결정 요약",
            },
        ],
        services: [
            {
                id: "core",
                name: "Core",
                kind: "SYSTEM OF RECORD",
                route: "/projects/baton",
                role: "조직 운영 기준 데이터",
                detail: "팀, 시즌, 역할, 루틴, 라운드, 의사결정, 자료, 핸드오프",
                evidence: "PRD 5 · ADR 17 · OpenAPI 계약",
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
                role: "정책 기반 링크",
                detail: "UUID 멱등 키, HMAC-SHA256 코드, 허용 경로만 처리",
                evidence: "374 tests · 동시 8 → 1",
                database: "MySQL",
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "핵심 링크 계약과 복구 검증을 마쳤고 BATON 전체 연동은 진행 중입니다.",
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
                detail: "DNS pinning, SSRF 방어, lease 및 revision 펜싱, 아웃박스",
                evidence: "354 tests",
                database: "PostgreSQL",
                visibility: "공개 저장소",
                status: "안전한 URL 점검과 이벤트 전달을 구현했으며 공개 staging 검증은 실행 전입니다.",
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
                role: "메시지 전달",
                detail: "inbox 중복 제거, 작업 선점, 재시도, 처리 결과 미확인 상태",
                evidence: "373 tests",
                database: "PostgreSQL",
                visibility: "비공개 저장소 / 공개 가능 요약",
                status: "전송 복구와 메시지 브로커 수신을 구현했고 실제 메시지 공급자 운영 검증은 남아 있습니다.",
                documentation: [
                    { label: "PRD", count: "2" },
                    { label: "ADR", count: "14" },
                ],
            },
        ],
        proofs: [
            {
                value: "374",
                label: "GO 테스트",
                detail: "멱등 링크 생성, 정책 검증과 동시 요청을 검증",
            },
            {
                value: "354",
                label: "WATCH 테스트",
                detail: "URL 보안, 작업 선점과 상태 변경 이벤트를 검증",
            },
            {
                value: "373",
                label: "RELAY 테스트",
                detail: "중복 제거, lease 복구와 처리 결과 미확인 상태를 검증",
            },
        ],
        category: "개인 프로젝트",
        role: "4개 저장소의 서비스 경계, 도메인 규칙, API, DB 계약, 테스트 및 운영 절차 설계와 구현",
        oneLine: "실패 특성이 다른 기능을 서비스와 저장소 단위로 분리",
        status: {
            label: "현재 상태",
            text: "각 서비스의 핵심 기능과 테스트는 구현했습니다. 서비스 간 전체 연동과 운영 환경 배포는 진행 중입니다. 문서와 테스트 수치는 2026.08.09 저장소 기준입니다.",
        },
        visualCaption:
            "Core는 기준 데이터의 주체이며 GO, WATCH, RELAY를 직접 제어하는 상위 서버는 아닙니다. 각 서비스는 독립된 책임과 장애 경계를 가집니다.",
        problems: [
            {
                number: "01",
                serviceIds: ["core", "go", "watch", "relay"],
                title: "기능이 아니라 실패와 복구 방식으로 서비스를 나눈다",
                constraint:
                    "링크 생성은 중복 요청, URL 점검은 느리고 위험한 네트워크 I/O, 메시지 전송은 외부 응답 유실을 다뤄야 합니다.",
                decision:
                    "Core는 조직 운영의 기준 데이터에 집중하고 GO, WATCH, RELAY를 별도 저장소와 실행 환경으로 분리했습니다. 상태 변경은 아웃박스와 커밋 이후 전달을 기준으로 설계했습니다.",
                validation:
                    "각 저장소의 계약 테스트와 통합 테스트를 독립 실행해 서비스별 규칙과 복구 경계를 확인했습니다.",
                boundary:
                    "개별 서비스 검증은 끝났지만 Core부터 RELAY까지의 전체 흐름과 실제 운영 배포는 아직 완료하지 않았습니다.",
            },
            {
                number: "02",
                serviceIds: ["core"],
                title: "역할 교대의 중간 상태를 한 트랜잭션으로 묶는다",
                constraint:
                    "바통 수락과 담당자 변경이 따로 반영되면 같은 역할에 이전 담당자와 다음 담당자가 섞일 수 있었습니다.",
                decision:
                    "PREPARING → TRANSFERRED → ACCEPTED 생명주기를 두고, 전달 순간의 바통북을 고정한 뒤 수락과 담당자 및 기간 변경을 한 트랜잭션에서 처리했습니다.",
                validation:
                    "역할별 열린 바통 1건 제약과 상태 전이 테스트로 중복 교대 및 전달 후 변경을 차단했습니다.",
                boundary:
                    "교대 모델은 명확해졌지만 상태와 이력이 늘어 운영자가 실패 지점을 이해할 화면과 복구 절차가 필요합니다.",
                print: {
                    label: "CORE / HANDOFF",
                    problem: "수락과 담당자 변경이 따로 반영되면 책임자가 섞일 수 있음",
                    solution: "PREPARING → TRANSFERRED → ACCEPTED와 열린 바통 1건 제약",
                    tradeoff: "상태와 이력이 늘어 운영 화면과 복구 절차가 필요",
                },
            },
            {
                number: "03",
                serviceIds: ["go"],
                title: "GO의 링크 생성은 재시도해도 같은 결과를 돌려준다",
                constraint:
                    "저장 후 응답이 유실되거나 여러 서버가 같은 요청을 동시에 받으면 링크가 중복 생성될 수 있습니다.",
                decision:
                    "UUID 멱등 키와 표준화한 요청 해시를 생성 예약에 저장했습니다. HMAC-SHA256으로 결정적인 링크 코드를 만들고 허용한 목적지 타입과 경로만 받습니다.",
                validation:
                    "같은 요청 8건을 동시에 보내도 링크와 예약이 각각 1건만 생성되는지 통합 테스트로 확인했습니다.",
                boundary:
                    "HMAC 키 교체와 DB 복구 시 기존 링크가 유지되도록 키 관리와 백업 절차가 함께 필요합니다.",
                print: {
                    label: "GO / IDEMPOTENCY",
                    problem: "응답 유실과 동시 요청으로 같은 링크가 중복 생성될 수 있음",
                    solution: "UUID 멱등 키, 요청 해시와 결정적 HMAC 코드",
                    tradeoff: "HMAC 키와 DB를 같은 시점에 복구해야 함",
                },
            },
            {
                number: "04",
                serviceIds: ["go"],
                title: "HMAC 키와 DB를 하나의 복구 단위로 묶는다",
                constraint:
                    "잘못된 HMAC 키로 서버가 시작되면 같은 목적지에 다른 링크 코드가 생겨 기존 링크 계약이 깨질 수 있었습니다.",
                decision:
                    "키에서 파생한 version과 fingerprint를 DB singleton identity에 결합하고, 기존 데이터와 키가 맞지 않으면 readiness 전에 시작을 막았습니다.",
                validation:
                    "서로 다른 identity의 동시 최초 결합에서 하나만 성공하고 잘못된 키가 링크를 생성하지 못하는지 통합 테스트로 확인했습니다.",
                boundary:
                    "키 교체가 단순 환경 변수 변경이 아니므로 DB 백업과 secret을 같은 시점에 복원하는 운영 절차가 필요합니다.",
            },
            {
                number: "05",
                serviceIds: ["watch"],
                title: "느린 URL 점검 중 DB 락을 잡지 않는다",
                constraint:
                    "외부 URL은 느리거나 사설망을 가리킬 수 있고, 늦게 끝난 작업이 최신 점검 결과를 덮을 수도 있었습니다.",
                decision:
                    "짧은 트랜잭션에서 SKIP LOCKED로 작업만 선점하고 네트워크 I/O를 분리했습니다. DNS pinning과 SSRF 방어, lease token과 source revision 펜싱을 적용했습니다.",
                validation:
                    "URL 보안, 작업 인계, 오래된 결과 거절과 제한된 redirect 및 응답 크기를 포함한 354개 테스트로 확인했습니다.",
                boundary:
                    "lease 시간은 중복 실행과 복구 속도 사이의 균형이므로 실제 지연 분포를 보고 계속 조정해야 합니다.",
                print: {
                    label: "WATCH / SAFE CHECK",
                    problem: "느린 I/O와 늦은 결과가 경합 및 최신 상태 덮어쓰기를 만듦",
                    solution: "SSRF 차단, DNS pinning, lease와 revision 펜싱",
                    tradeoff: "실제 지연 분포에 맞춰 lease 시간을 계속 조정해야 함",
                },
            },
            {
                number: "06",
                serviceIds: ["watch"],
                title: "상태 변경 이벤트를 아웃박스에 먼저 남긴다",
                constraint:
                    "URL 상태는 저장됐지만 Core 전달 호출이 실패하면 두 시스템이 서로 다른 상태를 볼 수 있었습니다.",
                decision:
                    "상태 변경과 전달할 이벤트를 같은 트랜잭션에 저장하고 HTTPS at-least-once 전달과 적체 이벤트 복구를 선택했습니다.",
                validation:
                    "동일 이벤트 재전송, acknowledgement 유실과 적체 이벤트 복구 절차를 자동 테스트와 공개 staging runbook에 고정했습니다.",
                boundary:
                    "단일 consumer 요구에 맞춰 broker를 생략했으므로 소비자가 늘면 전달 구조를 다시 검토해야 합니다.",
            },
            {
                number: "07",
                serviceIds: ["relay"],
                title: "전송 결과를 모르면 원본 기록을 바꾸지 않는다",
                constraint:
                    "외부 전송은 성공했지만 응답만 잃으면 자동 재시도가 중복 발송으로 이어질 수 있었습니다.",
                decision:
                    "외부 호출 전에 immutable attempt intent와 provider 멱등 키를 저장하고, 처리 결과 미확인 상태는 OUTCOME_UNKNOWN으로 보존한 채 별도 조정 이력으로만 현재 상태를 갱신했습니다.",
                validation:
                    "중단 뒤 같은 전송 식별자 복구, 오래된 token 거절과 조정 요청 재실행을 포함한 테스트로 확인했습니다.",
                boundary:
                    "중복 발송 방지를 우선해 자동 재전송을 멈추므로 결과 조회나 운영자 조정 절차가 필요합니다.",
                print: {
                    label: "RELAY / RECOVERY",
                    problem: "응답 유실 뒤 재시도가 중복 발송으로 이어질 수 있음",
                    solution: "immutable attempt, provider 멱등 키와 OUTCOME_UNKNOWN",
                    tradeoff: "자동 재전송 대신 결과 조회 및 운영자 조정 절차가 필요",
                },
            },
            {
                number: "08",
                serviceIds: ["relay"],
                title: "DB 커밋 뒤 broker 재전달을 한 건으로 수렴한다",
                constraint:
                    "PostgreSQL 커밋 뒤 RabbitMQ acknowledgement 전에 프로세스가 멈추면 같은 이벤트가 다시 전달됩니다.",
                decision:
                    "분산 트랜잭션 대신 event ID inbox 멱등성과 commit-before-ack를 적용하고 실패 메시지는 retry와 DLQ로 분리했습니다.",
                validation:
                    "메시지 브로커와 RELAY를 강제로 중단한 뒤 같은 이벤트가 재전달돼도 inbox가 1건인지 Docker Compose 통합 테스트로 확인했습니다.",
                boundary:
                    "메시지 보존과 DLQ 운영 지점이 늘어 broker 모니터링과 재처리 runbook이 필요합니다.",
            },
        ],
        stack: [
            "Java 21",
            "Spring Boot",
            "Gradle",
            "MySQL",
            "PostgreSQL",
            "Flyway",
            "RabbitMQ / SQS",
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
        id: "happygallery",
        index: "02",
        presentation: "featured",
        title: "happyGallery",
        eyebrow: "공방 상품 판매 및 예약 서비스",
        summary:
            "결제와 환불 결과를 확인할 수 없는 상태, 알림 프로세스 중단, 예약 및 재고 경쟁을 복구 가능한 상태로 저장했습니다.",
        period: "2026.02.21 — 진행 중",
        evidenceAsOf: "2026.08.09 저장소 기준",
        route: "/projects/happygallery",
        tags: ["Spring Boot", "React", "헥사고날 아키텍처", "MySQL / Redis"],
        visual: "gallery",
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
                "bootstrap, web 입력 어댑터, persistence 및 external 출력 어댑터, application, domain으로 의존 방향을 정했습니다. 모든 클래스에 인터페이스를 만들지 않고 결제와 알림처럼 교체 가능한 외부 경계에 포트를 뒀습니다.",
            tradeoff:
                "모듈과 타입 수는 늘지만 의존 위반을 빌드에서 잡을 수 있습니다. 현재 규모에서는 domain의 일부 JPA 어노테이션을 유지해 분리 비용을 제한했습니다.",
        },
        spotlights: [
            {
                label: "결제 및 환불 / 멱등성",
                title: "외부 응답을 잃어도 중복 승인과 환불을 막음",
                problem:
                    "PG 호출 뒤 응답만 유실되면 성공 여부를 모른 채 승인이나 환불을 반복할 수 있었습니다.",
                solution:
                    "결제는 orderId, 환불은 최초 UUID를 멱등 키로 재사용하고 processingToken 펜싱과 결과 조회 후 재시도를 적용했습니다.",
                tradeoff:
                    "PG 호출을 트랜잭션 밖으로 분리해 DB 점유는 줄지만, API 응답 시점에 환불 상태가 REQUESTED로 남을 수 있습니다.",
            },
            {
                label: "알림 / 아웃박스",
                title: "업무 커밋과 알림 작업을 함께 보존",
                problem:
                    "업무를 커밋한 직후 프로세스가 종료되면 메모리 이벤트와 알림 요청이 함께 사라질 수 있었습니다.",
                solution:
                    "업무 상태와 알림 아웃박스를 같은 트랜잭션에 저장하고 AFTER_COMMIT 즉시 전송과 스케줄러 복구를 함께 사용했습니다.",
                tradeoff:
                    "알림은 비동기로 처리되어 사용자 응답 시점에 발송이 끝나지 않을 수 있고, at-least-once 중복 가능성도 관리해야 합니다.",
            },
            {
                label: "예약 및 재고 / 동시성",
                title: "락 순서를 고정해 마지막 자리의 한 명만 성공",
                problem:
                    "마지막 자리나 재고에 요청이 몰리면 조회 시점에는 모두 가능해 보여 초과 처리될 수 있었습니다.",
                solution:
                    "비관적 락을 사용하고 클래스→슬롯, productId 오름차순으로 락 순서를 고정했습니다.",
                tradeoff:
                    "정합성은 단순해지지만 같은 행에 요청이 집중되면 대기 시간이 늘어, 운영 지표에 따라 경계를 다시 나눠야 합니다.",
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
                label: "환불 이력 트랜잭션 분리",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0018_%ED%99%98%EB%B6%88_%EC%9D%B4%EB%A0%A5_%ED%8A%B8%EB%9E%9C%EC%9E%AD%EC%85%98_%EB%B6%84%EB%A6%AC/adr.md",
                note: "PG 호출과 DB 트랜잭션 및 재시도 경계를 정한 기록",
            },
            {
                type: "ADR",
                label: "알림 Outbox 전달 보장",
                href: "https://github.com/ljkhyeong/happyGallery/blob/main/docs/ADR/0032_%EC%95%8C%EB%A6%BC_Outbox_%EC%A0%84%EB%8B%AC_%EB%B3%B4%EC%9E%A5/adr.md",
                note: "같은 트랜잭션 저장과 커밋 이후 복구 방식을 정한 기록",
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
                value: "AWS",
                label: "운영 환경 가동 후 종료",
                detail: "AWS 운영 배포 뒤 상시 리소스 비용을 확인하고 종료",
            },
            {
                value: "220",
                label: "OpenAPI operations",
                detail: "2026.08.09 API 스냅샷 기준 190 paths, 220 operations",
            },
            {
                value: "218",
                label: "REST Docs 테스트",
                detail: "2026.08.09 기준 8개 문서 테스트 스위트, 218개 테스트 완료",
            },
        ],
        category: "개인 프로젝트",
        role: "기획, 백엔드, 프론트엔드, 테스트 및 설계 문서",
        oneLine: "외부 I/O와 동시성 실패를 복구 가능한 상태로 설계",
        status: {
            label: "운영 상태",
            text: "AWS에 운영 배포했으나 트래픽과 무관한 상시 리소스 비용이 발생해 운영을 종료했습니다. 현재 공개 URL은 없으며 API와 테스트 수치는 2026.08.09 로컬 저장소 기준입니다.",
        },
        visualCaption:
            "헥사고날 아키텍처의 포트와 어댑터 원칙을 적용했고, domain 모듈에는 일부 JPA 어노테이션을 유지했습니다.",
        problems: [
            {
                number: "01",
                title: "계층 규칙은 코드 리뷰가 아니라 빌드에서 막는다",
                constraint:
                    "기능이 늘수록 web과 persistence 코드가 application과 domain 안으로 섞이기 쉽습니다.",
                decision:
                    "6개 운영 모듈로 의존 방향을 나누고 Gradle 의존성과 ArchUnit 정책 테스트로 bootstrap → adapter → application → domain 방향을 검사했습니다.",
                validation:
                    "LayerDependencyPolicyTest와 모듈별 컴파일로 금지한 의존이 빌드 단계에서 실패하는지 확인했습니다.",
                boundary:
                    "domain 모듈의 일부 JPA 의존은 유지했습니다. 현재 규모에서는 완전한 영속성 분리보다 일관된 의존 방향을 우선했습니다.",
                print: {
                    label: "ARCHITECTURE",
                    problem: "web과 persistence 코드가 도메인으로 섞이기 쉬움",
                    solution: "6개 모듈, Gradle 의존성과 ArchUnit 정책 테스트",
                    tradeoff: "타입 수는 늘고 domain의 일부 JPA 의존은 유지",
                },
            },
            {
                number: "02",
                title: "결제와 환불 결과를 모를 때 같은 작업을 무작정 반복하지 않는다",
                constraint:
                    "PG 호출 뒤 응답만 유실되면 성공 여부를 모른 채 승인이나 환불을 다시 요청할 수 있습니다.",
                decision:
                    "PG 호출은 DB 트랜잭션 밖에서 실행하고, 짧은 트랜잭션으로 작업을 선점합니다. orderId와 환불 UUID를 멱등 키로 재사용하고 processingToken으로 이전 작업자의 변경을 막습니다. 처리 결과를 확인할 수 없는 환불은 조회 후 재시도합니다.",
                validation:
                    "작업 선점과 인계, 이전 토큰 거절, 늦은 성공 보상, 처리 결과 미확인 환불 조회를 통합 테스트로 확인했습니다.",
                boundary:
                    "현재는 Fake PG로 검증했으며 실제 Toss Payments의 지연과 장애를 포함한 운영 검증은 남아 있습니다.",
                print: {
                    label: "PAYMENT / REFUND",
                    problem: "PG 응답 유실 뒤 중복 승인과 환불 위험",
                    solution: "멱등 키, processingToken, 결과 조회 후 재시도",
                    tradeoff: "API 응답 시 REQUESTED 상태가 남을 수 있음",
                },
            },
            {
                number: "03",
                title: "업무는 저장됐지만 알림 작업이 사라지는 틈을 없앤다",
                constraint:
                    "주문이나 예약을 커밋한 직후 프로세스가 종료되면 알림 호출 자체가 사라질 수 있습니다.",
                decision:
                    "업무 상태와 고유 멱등 키를 가진 알림 아웃박스를 같은 트랜잭션에 저장했습니다. AFTER_COMMIT 즉시 전송과 스케줄러 복구, processingToken과 낙관적 락을 함께 사용합니다.",
                validation:
                    "중복 아웃박스 방지, 작업 인계, 실패 후 재시도, 발송 직전 대상 재확인을 통합 테스트로 검증했습니다.",
                boundary:
                    "at-least-once 방식이라 외부 업체의 멱등 지원이 없으면 응답 유실 뒤 중복 알림 가능성은 남습니다.",
                print: {
                    label: "NOTIFICATION",
                    problem: "업무 커밋 직후 종료되면 알림 요청이 사라짐",
                    solution: "같은 트랜잭션 아웃박스, 즉시 전송과 스케줄러 복구",
                    tradeoff: "비동기 지연과 at-least-once 중복 가능성",
                },
            },
            {
                number: "04",
                title: "예약과 재고의 락 순서를 고정한다",
                constraint:
                    "마지막 자리나 재고에 요청이 몰리면 조회 시점에는 모두 가능해 보여 초과 처리될 수 있습니다.",
                decision:
                    "예약은 클래스 다음 슬롯 PK 순서, 재고는 productId 오름차순으로 비관적 락을 잡고 확인과 변경을 한 트랜잭션에서 처리했습니다.",
                validation:
                    "마지막 좌석과 재고의 동시 요청에서 한 건만 성공하고 나머지는 같은 업무 오류로 끝나는지 확인했습니다.",
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
                title: "개인정보 복원과 검색의 키를 분리한다",
                constraint:
                    "전화번호와 주소를 평문으로 저장하지 않으면서도 주문 조회와 비회원 이력 찾기를 지원해야 했습니다.",
                decision:
                    "복원이 필요한 값은 AES-GCM으로 암호화하고 정확 검색은 HMAC 블라인드 인덱스로 분리했습니다. 기존 데이터 전환과 키 회전도 별도 단계로 설계했습니다.",
                validation:
                    "암호화 round-trip, 잘못된 키 차단, 블라인드 인덱스 검색과 마이그레이션 재실행을 테스트했습니다.",
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
                title: "AWS 고정비를 확인하고 운영 구조를 다시 선택한다",
                constraint:
                    "CloudFront, ALB, ECS, RDS와 Valkey 기반 환경을 실제 가동했지만 트래픽과 무관한 상시 비용이 계속 발생했습니다.",
                decision:
                    "Cost Explorer로 비용 원인을 확인하고 주요 리소스를 중지 및 삭제했습니다. 이후 단일 노트북 k3s, 불변 이미지와 암호화 백업을 기준으로 운영 구조를 전환했습니다.",
                validation:
                    "AWS 리소스별 비용과 종료 상태를 회고에 남기고 k3s 배포, 롤백, 백업 및 복구 절차를 runbook으로 검증했습니다.",
                boundary:
                    "단일 노드는 비용과 통제에는 유리하지만 고가용성을 제공하지 않습니다. 저장소 기준 준비는 완료했으나 공개 운영은 아직 시작하지 않았습니다.",
                print: {
                    label: "OPERATIONS / COST",
                    problem: "트래픽과 무관한 상시 리소스 비용 발생",
                    solution: "비용 원인 확인, 리소스 종료, 단일 노트북 k3s 준비",
                    tradeoff: "비용은 줄지만 단일 노드는 고가용성을 제공하지 않음",
                },
            },
        ],
        stack: [
            "Java",
            "Spring Boot",
            "Gradle Multi-module",
            "JPA",
            "MyBatis",
            "MySQL",
            "Redis",
            "React",
            "TypeScript",
            "Testcontainers",
            "Playwright",
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
        id: "defense",
        index: "03",
        presentation: "career-case",
        title: "차세대 군사법 정보 시스템",
        eyebrow: "공공 SI / 백엔드 개발 및 운영",
        summary:
            "폐쇄망과 레거시 환경에서 기관 연계 배치와 보안 기능을 개발하고 운영 장애를 분석했습니다.",
        period: "2024.06.23 — 2026.01.30",
        route: "/projects/defense",
        tags: ["Java 8", "eGov", "MyBatis", "Tibero", "Jenkins"],
        visual: "defense",
        proofs: [
            {
                value: "3종",
                label: "기관 연계 배치",
                detail: "기관별 데이터 형식과 실행 순서에 맞춘 Jenkins 배치",
            },
            {
                value: "CSRF",
                label: "요청 위조 방지",
                detail: "기존 화면 흐름에 Spring Security 적용",
            },
            {
                value: "Tika",
                label: "파일 형식 검사",
                detail: "파일 확장자와 실제 형식을 함께 확인",
            },
        ],
        category: "경력 프로젝트",
        role: "군교정 기능 개발, 기관 연계 및 운영 대응",
        oneLine: "기관 연계 배치 개발 및 로그, DB 기반 장애 분석",
        status: {
            label: "공개 범위",
            text: "보안이 필요한 공공 프로젝트이므로 기관과 데이터는 공개하지 않고 직접 수행한 개발과 운영 업무만 정리했습니다.",
        },
        visualCaption:
            "공개 가능한 수준으로 단순화했습니다. 세 기관의 데이터가 연계 배치를 거쳐 군교정 업무에 반영됩니다.",
        problems: [
            {
                number: "01",
                title: "기관마다 다른 데이터 연계를 배치로 처리한다",
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
                title: "기존 화면에 요청 위조와 파일 검사를 추가한다",
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
                title: "화면 오류를 로그, DB, 배치 순서로 추적한다",
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
        id: "webrtc",
        index: "교육 프로젝트",
        presentation: "prior-experience",
        title: "WebRTC/HLS 현장강의 보조 서비스",
        eyebrow: "카카오 클라우드 스쿨 3기 / 6인 팀",
        summary:
            "HLS 서버와 React 화면을 맡아 WebSocket 제어와 WebRTC/RTP 미디어 경로를 분리하고, FFmpeg와 GStreamer로 HLS를 변환했습니다.",
        period: "2023.09.01 — 2023.11.10",
        route: "/projects/webrtc",
        tags: ["WebRTC", "HLS", "React", "FFmpeg", "GStreamer"],
        visual: "webrtc",
        proofs: [
            {
                value: "6인",
                label: "팀 구성",
                detail: "HLS 서버와 React 프론트엔드 담당",
            },
            {
                value: "약 30초 → 11초",
                label: "HLS 지연",
                detail: "세그먼트와 인코딩 설정 조정",
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

export const featuredProjects = projectList.filter((project) => project.presentation === "featured")

export const navigableCaseStudies = projectList.filter(
    (project) => project.presentation !== "prior-experience",
)

export const projectsById = Object.fromEntries(projectList.map((project) => [project.id, project]))

export const batonServicesById = Object.fromEntries(
    projectsById.baton.services.map((service) => [service.id, service]),
)

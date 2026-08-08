export const projectList = [
    {
        id: "baton",
        index: "01",
        presentation: "featured",
        title: "BATON",
        eyebrow: "조직 운영 플랫폼",
        summary:
            "조직 운영의 기준 데이터는 Core에 두고, 링크, URL 점검, 메시지 전송을 실패 특성에 따라 별도 마이크로서비스로 분리했습니다.",
        period: "진행 중",
        route: "/projects/baton",
        tags: ["Java 21", "Spring Boot", "MySQL / PostgreSQL", "Outbox"],
        visual: "baton",
        architecture: {
            label: "서비스 경계",
            title: "Core는 기준 데이터를, 하위 서비스는 외부 실패를 맡습니다.",
            description:
                "Core가 팀, 시즌, 권한, 루틴, 핸드오프의 기준 데이터를 관리합니다. GO, WATCH, RELAY는 서로 다른 보안, 지연, 재시도 요구를 독립된 저장소와 실행 환경으로 분리했습니다.",
        },
        spotlights: [
            {
                label: "GO / 멱등성",
                title: "동시 요청 8건을 링크 1건으로 수렴",
                text: "UUID 멱등 키와 요청 해시를 저장하고 HMAC-SHA256으로 링크 코드를 결정합니다. 같은 키의 다른 요청은 거절합니다.",
            },
            {
                label: "WATCH / 안전한 점검",
                title: "네트워크 I/O와 DB 락을 분리",
                text: "DNS pinning과 SSRF 차단을 적용하고, lease와 source revision 펜싱으로 늦게 끝난 점검 결과가 최신 상태를 덮지 못하게 했습니다.",
            },
            {
                label: "RELAY / 복구",
                title: "전송 결과를 모르면 다시 보내지 않음",
                text: "inbox 중복 제거, SKIP LOCKED 작업 선점, lease token을 사용합니다. 응답을 잃은 전송은 OUTCOME_UNKNOWN으로 남겨 중복 발송을 막습니다.",
            },
        ],
        services: [
            {
                name: "Core",
                role: "조직 운영 기준 데이터",
                detail: "팀, 시즌, 역할, 루틴, 라운드, 의사결정, 자료, 핸드오프",
                evidence: "OpenAPI 35 operations",
                database: "MySQL",
                primary: true,
            },
            {
                name: "GO",
                role: "정책 기반 링크",
                detail: "UUID 멱등 키, HMAC-SHA256 코드, 허용 경로만 처리",
                evidence: "374 tests · 동시 8 → 1",
                database: "MySQL",
            },
            {
                name: "WATCH",
                role: "URL 상태 점검",
                detail: "DNS pinning, SSRF 방어, lease 및 revision 펜싱, 아웃박스",
                evidence: "271 tests",
                database: "PostgreSQL",
            },
            {
                name: "RELAY",
                role: "메시지 전달",
                detail: "inbox 중복 제거, 작업 선점, 재시도, 결과 불명 상태",
                evidence: "373 tests",
                database: "PostgreSQL",
            },
        ],
        proofs: [
            {
                value: "374",
                label: "GO 테스트",
                detail: "멱등 링크 생성, 정책 검증과 동시 요청을 검증",
            },
            {
                value: "271",
                label: "WATCH 테스트",
                detail: "URL 보안, 작업 선점과 상태 변경 이벤트를 검증",
            },
            {
                value: "373",
                label: "RELAY 테스트",
                detail: "중복 제거, lease 복구와 결과 불명 처리를 검증",
            },
        ],
        category: "개인 프로젝트",
        role: "4개 저장소의 서비스 경계, 도메인 규칙, API, DB 계약, 테스트 및 운영 절차 설계와 구현",
        oneLine: "실패 특성이 다른 기능을 서비스와 저장소 단위로 분리",
        status: {
            label: "현재 상태",
            text: "각 서비스의 핵심 기능과 테스트는 구현했습니다. 서비스 간 전체 연동과 운영 환경 배포는 진행 중입니다.",
        },
        visualCaption:
            "Core는 기준 데이터의 주체이며 GO, WATCH, RELAY를 직접 제어하는 상위 서버는 아닙니다. 각 서비스는 독립된 책임과 장애 경계를 가집니다.",
        problems: [
            {
                number: "01",
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
                title: "GO의 링크 생성은 재시도해도 같은 결과를 돌려준다",
                constraint:
                    "저장 후 응답이 유실되거나 여러 서버가 같은 요청을 동시에 받으면 링크가 중복 생성될 수 있습니다.",
                decision:
                    "UUID 멱등 키와 표준화한 요청 해시를 생성 예약에 저장했습니다. HMAC-SHA256으로 결정적인 링크 코드를 만들고 허용한 목적지 타입과 경로만 받습니다.",
                validation:
                    "같은 요청 8건을 동시에 보내도 링크와 예약이 각각 1건만 생성되는지 통합 테스트로 확인했습니다.",
                boundary:
                    "HMAC 키 교체와 DB 복구 시 기존 링크가 유지되도록 키 관리와 백업 절차가 함께 필요합니다.",
            },
            {
                number: "03",
                title: "늦은 작업 결과와 결과를 모르는 전송을 안전하게 남긴다",
                constraint:
                    "URL 점검과 메시지 전송은 DB 트랜잭션 밖의 외부 I/O라서 작업자가 멈추거나 응답만 잃을 수 있습니다.",
                decision:
                    "WATCH는 lease와 source revision 펜싱으로 오래된 결과를 거절합니다. RELAY는 provider 멱등 키를 외부 호출 전에 저장하고 응답 유실 시 OUTCOME_UNKNOWN으로 남깁니다.",
                validation:
                    "WATCH 271개와 RELAY 373개 테스트로 작업 인계, 오래된 결과 거절, 중복 수신, 재시도와 결과 불명 상태를 확인했습니다.",
                boundary: "공개 콜백과 실제 메시지 공급자를 연결한 운영 환경 검증은 남아 있습니다.",
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
                label: "BATON Core GitHub 저장소",
                href: "https://github.com/ljkhyeong/baton",
                note: "조직 운영 기준 데이터와 React 업무 화면",
            },
            {
                label: "BATON GO GitHub 저장소",
                href: "https://github.com/ljkhyeong/baton-go",
                note: "정책 기반 멱등 링크 서비스",
            },
            {
                label: "BATON WATCH GitHub 저장소",
                href: "https://github.com/ljkhyeong/baton-watch",
                note: "안전한 URL 점검과 상태 변경 이벤트",
            },
            {
                label: "BATON RELAY GitHub 저장소",
                href: "https://github.com/ljkhyeong/baton-relay",
                note: "메시지 작업 선점, 전송 및 복구",
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
            "결제와 환불의 결과 불명, 알림 프로세스 중단, 예약 및 재고 경쟁을 복구 가능한 영속 상태로 모델링했습니다.",
        period: "2026.02.21 — 진행 중",
        route: "/projects/happygallery",
        tags: ["Spring Boot", "React", "Ports & Adapters", "MySQL / Redis"],
        visual: "gallery",
        architecture: {
            label: "모듈러 모놀리스",
            title: "포트와 어댑터 원칙을 적용한 6개 운영 모듈",
            description:
                "bootstrap, web 입력 어댑터, persistence 및 external 출력 어댑터, application, domain으로 의존 방향을 정했습니다. 모든 클래스에 인터페이스를 만들지 않고 결제와 알림처럼 교체 가능한 외부 경계에 포트를 뒀습니다.",
        },
        spotlights: [
            {
                label: "결제 및 환불 / 멱등성",
                title: "외부 응답을 잃어도 중복 승인과 환불을 막음",
                text: "결제는 orderId, 환불은 최초 UUID를 멱등 키로 재사용합니다. processingToken 펜싱과 결과 조회 후 재시도로 늦은 응답을 처리합니다.",
            },
            {
                label: "알림 / 아웃박스",
                title: "업무 커밋과 알림 작업을 함께 보존",
                text: "업무 상태와 알림 아웃박스를 같은 트랜잭션에 저장합니다. AFTER_COMMIT 즉시 전송과 스케줄러 복구를 함께 사용합니다.",
            },
            {
                label: "예약 및 재고 / 동시성",
                title: "락 순서를 고정해 마지막 자리의 한 명만 성공",
                text: "비관적 락을 사용하고 클래스→슬롯, productId 오름차순으로 락 순서를 고정해 초과 예약과 초과 판매를 막았습니다.",
            },
        ],
        proofs: [
            {
                value: "6",
                label: "운영 모듈",
                detail: "포트와 어댑터 원칙에 맞춘 Gradle 멀티모듈",
            },
            {
                value: "194",
                label: "OpenAPI operations",
                detail: "현재 API 스냅샷 기준 167 paths, 194 operations",
            },
            {
                value: "192",
                label: "REST Docs 테스트",
                detail: "8개 문서 테스트 스위트, 실패와 건너뜀 없이 완료",
            },
        ],
        category: "개인 프로젝트",
        role: "기획, 백엔드, 프론트엔드, 테스트 및 설계 문서",
        oneLine: "외부 I/O와 동시성 실패를 복구 가능한 상태로 설계",
        status: {
            label: "운영 상태",
            text: "실운영 전이며 공개 운영 URL은 없습니다. 수치는 로컬 테스트와 문서 스냅샷 기준이고 실제 사용자 지표는 아닙니다.",
        },
        visualCaption:
            "헥사고날 아키텍처의 포트와 어댑터 원칙을 적용했지만 domain에는 일부 JPA 어노테이션이 남아 있습니다. 이를 순수 헥사고날 구조로 과장하지 않았습니다.",
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
                    "domain에 JPA 어노테이션이 일부 남아 있어 순수한 도메인 모델은 아닙니다. 현재 규모에서는 분리 비용보다 일관된 의존 방향을 우선했습니다.",
            },
            {
                number: "02",
                title: "결제와 환불 결과를 모를 때 같은 작업을 무작정 반복하지 않는다",
                constraint:
                    "PG 호출 뒤 응답만 유실되면 성공 여부를 모른 채 승인이나 환불을 다시 요청할 수 있습니다.",
                decision:
                    "PG 호출은 DB 트랜잭션 밖에서 실행하고, 짧은 트랜잭션으로 작업을 선점합니다. orderId와 환불 UUID를 멱등 키로 재사용하고 processingToken으로 이전 작업자의 변경을 막습니다. 결과 불명 환불은 조회 후 재시도합니다.",
                validation:
                    "작업 선점과 인계, 이전 토큰 거절, 늦은 성공 보상, 결과 불명 환불 조회를 통합 테스트로 확인했습니다.",
                boundary:
                    "현재는 Fake PG로 검증했으며 실제 Toss Payments의 지연과 장애를 포함한 운영 검증은 남아 있습니다.",
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
        eyebrow: "공공 SI 실무",
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
        category: "실무 프로젝트",
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
        index: "이전 경험",
        presentation: "prior-experience",
        title: "WebRTC/HLS 현장강의 보조 서비스",
        eyebrow: "교육 과정 6인 팀 프로젝트",
        summary:
            "HLS 서버와 React 화면을 맡아 WebSocket 제어와 WebRTC/RTP 미디어 경로를 분리하고, FFmpeg와 GStreamer로 HLS를 변환했습니다.",
        period: "2023.09.01 — 2023.11.10",
        route: "/projects/webrtc",
        tags: ["WebRTC", "HLS", "React", "FFmpeg", "GStreamer"],
        visual: "webrtc",
        proofs: [
            {
                value: "6인",
                label: "교육 팀 프로젝트",
                detail: "HLS 서버와 React 프론트엔드 담당",
            },
            {
                value: "약 30초 → 11초",
                label: "HLS 지연",
                detail: "세그먼트와 인코딩 설정 조정",
            },
        ],
        category: "교육 팀 프로젝트",
        role: "HLS 서버 및 React 프론트엔드",
        oneLine: "WebRTC 실시간 시청과 HLS 지난 구간 재생 구현",
        status: {
            label: "프로젝트 상태",
            text: "개발자 교육 과정에서 진행한 팀 프로젝트이며 현재 운영하지 않습니다.",
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
                note: "교육 과정 프로젝트 시연",
            },
        ],
    },
]

export const featuredProjects = projectList.filter((project) => project.presentation === "featured")

export const navigableCaseStudies = projectList.filter(
    (project) => project.presentation !== "prior-experience",
)

export const projectsById = Object.fromEntries(projectList.map((project) => [project.id, project]))

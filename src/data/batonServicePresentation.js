export const batonServicePresentations = {
    go: {
        target: "재요청과 동시 요청으로 생기는 중복 링크",
        decision: "UUID와 요청 조건을 비교해 기존 링크 반환",
        result: "동시 요청 8건에도 링크와 처리 기록 각 1건",
        verification: [
            {
                kind: "verified",
                label: "확인됨",
                text: "같은 요청 8건의 동시 처리와 HMAC 키 불일치 시 기동 차단을 테스트했습니다.",
            },
            {
                kind: "unverified",
                label: "미검증",
                text: "BATON 호출자의 생성 및 폐기와 대상 서비스 권한까지 포함한 전체 흐름, 실제 클러스터와 공개 배포는 미검증입니다.",
            },
        ],
        flow: {
            title: "같은 UUID라도 요청 조건까지 비교합니다",
            description:
                "첫 요청은 링크를 저장하고, 같은 UUID와 조건의 재요청은 기존 링크를 반환하며, 조건이 바뀐 요청은 충돌로 차단합니다.",
            note: "짧은 링크는 접근 권한을 대신하지 않습니다. 실제 권한은 BATON 또는 ROUND에서 확인합니다.",
            compact: {
                input: ["링크 생성 요청", "UUID + 대상 + 기간"],
                action: ["UUID와 조건 비교", "중복 생성 방지"],
                outputs: [
                    ["첫 요청", "링크 1건 저장"],
                    ["조건 같음", "기존 링크 반환"],
                    ["조건 다름", "충돌로 차단"],
                ],
            },
        },
    },
    watch: {
        target: "위험한 URL 접근과 중단된 점검 작업",
        decision: "공인 IP만 점검하고 기한이 지난 시도 회수",
        result: "사설망과 DNS 변경 차단, 이전 결과 미저장 확인",
        verification: [
            {
                kind: "verified",
                label: "확인됨",
                text: "사설망 및 DNS 재조회 중 IP 변경 차단, 중단된 점검 회수와 이전 URL 버전의 늦은 결과 차단을 테스트했습니다.",
            },
            {
                kind: "unverified",
                label: "미검증",
                text: "공개 callback으로 Core까지 연결하는 스테이징 흐름과 외부 대시보드 및 알림은 미검증입니다.",
            },
        ],
        flow: {
            title: "공인 IP만 점검하고 중단된 시도는 회수합니다",
            description:
                "URL을 해석해 사설망과 로컬 주소를 차단하고 공인 IP로만 점검합니다. 처리 기한이 지나면 새 시도로 회수하며 이전 시도의 늦은 결과는 저장하지 않습니다.",
            note: "외부 HTTP 요청 중에는 DB 연결을 반환합니다. 이전 시도나 URL 버전의 늦은 결과는 저장하지 않습니다.",
            compact: {
                input: ["점검할 URL", "URL 버전 함께 저장"],
                action: ["공인 IP로만 점검", "사설망 및 로컬 주소 차단"],
                outputs: [
                    ["기한 내 완료", "최신 결과 저장"],
                    ["처리 기한 초과", "새 시도로 회수"],
                ],
            },
        },
    },
    relay: {
        target: "재수신 이벤트와 결과를 모르는 외부 전송",
        decision: "시도 UUID를 유지하고 결과 미확인은 재전송 중단",
        result: "중복 수신 차단과 서버 중단 후 시도 정보 유지 확인",
        verification: [
            {
                kind: "verified",
                label: "확인됨",
                text: "이벤트 재수신 차단, 서버 중단 후 같은 시도 UUID와 제공자 멱등 키 유지, 이전 서버의 늦은 결과 차단을 확인했습니다.",
            },
            {
                kind: "limited",
                label: "설계상 제한",
                text: "최신 구현과 ADR 20건은 비공개 작업 브랜치 3c504a6 기준입니다. 결과 미확인은 재전송하지 않고 운영자가 외부 기록을 확인해 상태만 확정합니다.",
            },
            {
                kind: "unverified",
                label: "미검증",
                text: "실제 AWS 전송과 큐 적체 및 실패 알림은 미검증입니다.",
            },
        ],
        flow: {
            title: "전송 실패와 결과 미확인을 다르게 처리합니다",
            description:
                "이벤트 ID로 중복 수신을 막고 시도 UUID와 제공자 멱등 키를 저장한 뒤 전송합니다. 성공, 실패와 결과 미확인을 구분하며 결과 미확인은 다시 보내지 않습니다.",
            note: "서버가 중단돼도 같은 시도 UUID와 제공자 멱등 키를 유지합니다. 전송 전 일시 실패만 재시도합니다.",
            compact: {
                input: ["Core 이벤트", "같은 이벤트 ID는 1건"],
                action: ["전송 시도 기록", "UUID + 제공자 멱등 키"],
                outputs: [
                    ["성공", "완료 확정"],
                    ["실패", "전송 전 실패만 재시도"],
                    ["결과 미확인", "재전송 금지"],
                ],
            },
        },
    },
    brief: {
        target: "Core 판정과 보고서 내용의 불일치",
        decision: "5개 신호를 그대로 반영하고 발행 보고서는 보존",
        result: "상태 반영, 보고서 수정 차단과 실제 Core 연동 확인",
        verification: [
            {
                kind: "verified",
                label: "확인됨",
                text: "중복 및 과거 이벤트 차단, ACTIVE 및 RESOLVED 반영과 발행 보고서 수정 방지를 PostgreSQL 통합 테스트로 확인했습니다. 2.0.0-rc.1 실제 Core JAR과 로컬 HTTP로 연동했습니다. 내부 서비스용 Caddy HTTPS도 실제 Core와 확인했습니다.",
            },
            {
                kind: "unverified",
                label: "미검증",
                text: "공개 2.0.0-rc.2 이벤트 경로용 Caddy, 공인 DNS 및 원격 배포는 미검증입니다.",
            },
        ],
        flow: {
            title: "Core 판정은 그대로, 발행 보고서는 변경 없이",
            description:
                "Core가 판정한 5개 운영 신호를 ACTIVE 또는 RESOLVED 관심 항목으로 반영합니다. 같은 조건의 주간 보고서는 재사용하고 변경된 내용은 새 보고서로 발행합니다.",
            note: "5개 신호: 담당 공백, 후임 공백, 역할 준비 부족, 반복 업무 지연, 미완료 인수인계. BRIEF가 판정 규칙을 다시 만들지 않습니다.",
            compact: {
                input: ["Core 운영 신호 5개", "Core에서 판정"],
                action: ["관심 항목 반영", "ACTIVE / RESOLVED"],
                outputs: [
                    ["같은 보고서 조건", "기존 보고서 반환"],
                    ["내용 변경", "새 보고서 발행"],
                ],
            },
        },
    },
    cal: {
        target: "늦은 일정이 최신 캘린더를 덮어쓰는 문제",
        decision: "개정 번호 검증, 읽기 전용 피드와 ETag 응답",
        result: "Core 일정 호환성, 과거 개정 차단과 304 응답 확인",
        verification: [
            {
                kind: "verified",
                label: "확인됨",
                text: "Core 1.0.0 일정 JSON과 CAL 컨테이너의 호환성을 확인했습니다. 공개 main의 미출시 1.1.0-rc.1은 입력 제한, HTTP 캐시, 동시 요청, 대표 OCI 백업 및 복구와 이전 복구 작업의 늦은 결과 차단을 로컬에서 검증했습니다.",
            },
            {
                kind: "unverified",
                label: "미검증",
                text: "공개 구독과 전체 시즌 재동기화는 미검증입니다.",
            },
        ],
        flow: {
            title: "최신 일정만 반영하고 변경 없으면 304 응답",
            description:
                "Core 일정의 개정 번호를 검사해 iCalendar를 만들고, 유효한 구독 토큰에만 피드를 제공합니다. 일정이 같으면 ETag로 304를 반환하며 토큰 회전 시 이전 토큰을 폐기합니다.",
            note: "일정 ID는 UID, 개정 번호는 SEQUENCE로 사용합니다. 토큰을 회전하면 이전 구독 주소는 더 이상 사용할 수 없습니다.",
            compact: {
                input: ["Core 일정", "일정 ID + 개정 번호"],
                action: ["iCalendar 변환", "과거 개정은 반영하지 않음"],
                outputs: [
                    ["내용 변경", "최신 .ics 피드"],
                    ["변경 없음", "ETag / 304 응답"],
                ],
            },
        },
    },
    round: {
        target: "스터디 입장 권한과 WebRTC 연결 처리 분리",
        decision: "Core 참여권 검증 후 시그널링, 필요하면 TURN",
        result: "Chromium과 Core 연동 통과, 일부 WebKit 실패",
        verification: [
            {
                kind: "verified",
                label: "확인됨",
                text: "일반 검사, Chromium 전체 미디어와 Core 연동 시나리오는 통과했습니다.",
            },
            {
                kind: "limited",
                label: "일부 실패 및 제한",
                text: "전체 CI는 WebKit 채팅과 모바일 배치 시나리오 2건, restic 실행 파일 부재로 통과하지 못했습니다. 방 상태는 프로세스 메모리에 있어 현재는 단일 시그널링 인스턴스로 운용해야 합니다.",
            },
            {
                kind: "unverified",
                label: "미검증",
                text: "실제 Cloudflare TURN 중계 전용 연결, Safari 실기기, 외부망과 6명 장시간 접속은 미검증입니다.",
            },
        ],
        flow: {
            title: "입장은 Core가, 연결 메시지는 ROUND가 담당합니다",
            description:
                "Core가 발급한 RS256 참여권을 ROUND가 검증한 뒤 WebSocket으로 연결 메시지를 전달합니다. 브라우저는 mesh로 직접 연결하고 직접 연결이 어려우면 Cloudflare TURN을 사용합니다.",
            note: "미디어는 시그널링 서버를 거치지 않습니다. 새 연결의 순번과 다른 이전 SDP 및 ICE 메시지는 버립니다.",
            compact: {
                input: ["Core 참여권", "RS256 서명 검증"],
                action: ["WebSocket 시그널링", "연결 메시지만 전달"],
                outputs: [
                    ["직접 연결", "mesh WebRTC"],
                    ["직접 연결 어려움", "Cloudflare TURN"],
                ],
            },
        },
    },
}

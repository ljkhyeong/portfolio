export const batonServicePresentations = {
    go: {
        target: "재요청과 동시 요청으로 생기는 중복 링크",
        decision: "UUID와 요청 조건을 비교해 기존 링크 반환",
        result: "동시 요청 8건에도 링크와 처리 기록 각 1건",
        verification: [
            {
                kind: "verified",
                label: "확인됨",
                text: "최신 로컬 main에서 같은 요청 8건의 동시 처리, HMAC 키 불일치 시 기동 차단, 한글 오류 화면과 요청률 제한을 테스트했습니다.",
            },
            {
                kind: "limited",
                label: "공개 상태",
                text: "최신 로컬 main은 공개 main보다 18개 커밋 앞서 있습니다. 화면과 기능 설명은 로컬 구현 기준입니다.",
            },
            {
                kind: "unverified",
                label: "미검증",
                text: "BATON의 링크 생성 및 폐기 요청부터 대상 서비스의 접근 권한 확인까지 이어지는 전체 연동, 실제 클러스터와 공개 배포는 미검증입니다.",
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
        decision: "공인 IP만 점검하고 기한이 지난 점검 재실행",
        result: "사설망 접근과 DNS 재조회 시 IP 변경 차단, 이전 결과 저장 방지 확인",
        verification: [
            {
                kind: "verified",
                label: "확인됨",
                text: "사설망 및 DNS 재조회 중 IP 변경 차단, 중단된 점검 재실행과 이전 URL 버전의 늦은 결과 차단을 테스트했습니다.",
            },
            {
                kind: "limited",
                label: "공개 상태",
                text: "복구 도구와 운영 대시보드는 공개 원격 개발 브랜치에 있으며 공개 main에는 아직 병합되지 않았습니다.",
            },
            {
                kind: "unverified",
                label: "미검증",
                text: "공개 callback으로 Core까지 연결하는 스테이징 흐름과 외부 대시보드 및 알림은 미검증입니다.",
            },
        ],
        flow: {
            title: "공인 IP만 점검하고 중단된 점검은 다시 실행합니다",
            description:
                "URL을 해석해 사설망과 로컬 주소를 차단하고 공인 IP로만 점검합니다. 처리 기한이 지나면 기존 시도를 종료하고 새로 점검하며 이전 시도의 늦은 결과는 저장하지 않습니다.",
            note: "외부 HTTP 요청 중에는 DB 연결을 반환합니다. 이전 시도나 URL 버전의 늦은 결과는 저장하지 않습니다.",
            compact: {
                input: ["점검할 URL", "URL 버전 함께 저장"],
                action: ["공인 IP로만 점검", "사설망 및 로컬 주소 차단"],
                outputs: [
                    ["기한 내 완료", "최신 결과 저장"],
                    ["처리 기한 초과", "새 점검 실행"],
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
                text: "공개 main에서 이벤트 재수신 차단, 서버 중단 후 같은 시도 UUID와 제공자 멱등 키 유지, 이전 서버의 늦은 결과 차단과 전송 결과 수동 확정 이력을 확인했습니다.",
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
                text: "원격 개발 브랜치에서 누락된 개정 번호 감지, 점검 항목의 상태 전이, 발행 보고서 이력 및 비교를 확인했습니다. Core 2.0.0-rc.1과 로컬 HTTP 및 내부 HTTPS 연동도 검증했습니다.",
            },
            {
                kind: "limited",
                label: "공개 상태",
                text: "최신 로컬 main은 공개 main보다 16개 커밋 앞서 있습니다. BRIEF 원격 개발 브랜치는 2.0.0-rc.4이며 Core 공개 main은 2.0.0-rc.1을 사용합니다. 최신 릴리스 후보 JSON 규격의 Core 반영은 아직 완료되지 않았습니다.",
            },
            {
                kind: "unverified",
                label: "미검증",
                text: "공인 DNS와 원격 환경의 전체 서비스 연결은 미검증입니다.",
            },
        ],
        flow: {
            title: "Core 판정은 그대로, 발행 보고서는 변경 없이",
            description:
                "Core의 점검 결과를 미해결(ACTIVE) 또는 해결됨(RESOLVED)으로 저장합니다. 같은 조건의 주간 보고서는 재사용하고 변경된 내용은 새 보고서로 발행합니다.",
            note: "5개 신호: 담당 공백, 후임 공백, 역할 준비 부족, 반복 업무 지연, 미완료 인수인계. BRIEF가 판정 규칙을 다시 만들지 않습니다.",
            compact: {
                input: ["담당 공백 등 5개 상태", "Core에서 판정"],
                action: ["점검 항목 반영", "ACTIVE / RESOLVED"],
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
                text: "Core 요청 형식 고정과 CAL 컨테이너 연동, 입력 제한, HTTP 캐시, 동시 요청, OCI 백업 및 복구와 이전 복구 작업의 늦은 결과 차단을 확인했습니다.",
            },
            {
                kind: "limited",
                label: "공개 상태",
                text: "정식 JSON 규격은 1.0.0입니다. 1.1.0-rc.1은 2026년 9월 2일 사전 릴리스로 게시했으며 정식 버전 전환 전입니다.",
            },
            {
                kind: "unverified",
                label: "미검증",
                text: "운영 활성화와 공개 배포는 아직 완료하지 않았습니다. 실제 캘린더 앱과 운영 환경의 구독 및 전체 일정 재전송은 미검증입니다.",
            },
        ],
        flow: {
            title: "캐시가 유효한 조건부 요청에 304 응답",
            description:
                "Core 일정의 개정 번호를 검사해 iCalendar를 만들고, 유효한 구독 토큰에만 피드를 제공합니다. 조건부 요청의 ETag 또는 수정 시각을 검사해 캐시가 유효하면 304를 반환합니다. 그 외에는 .ics 본문을 반환하며 토큰 교체 시 이전 토큰을 폐기합니다.",
            note: "일정 ID는 UID, 개정 번호는 SEQUENCE로 사용합니다. 토큰을 교체하면 이전 구독 주소는 더 이상 사용할 수 없습니다.",
            compact: {
                input: ["Core 일정", "일정 ID + 개정 번호"],
                action: ["개정 및 캐시 확인", "최신 일정과 요청 캐시 비교"],
                outputs: [
                    ["본문 필요", "200 및 .ics 본문"],
                    ["캐시 유효", "304 응답"],
                ],
            },
        },
    },
    round: {
        target: "스터디 입장 권한과 WebRTC 연결 처리 분리",
        decision: "Core 입장 토큰 검증 후 시그널링, 필요하면 TURN",
        result: "Chromium, WebKit 호환성과 Core 연동 검사 통과",
        verification: [
            {
                kind: "verified",
                label: "확인됨",
                text: "현재 main에서 Chromium의 카메라 및 마이크 제어와 화면 공유 테스트를 통과했습니다. WebKit 호환성, Core 연동과 배포 검사 시나리오도 통과했습니다.",
            },
            {
                kind: "limited",
                label: "설계상 제한",
                text: "방과 참가자 연결 상태는 프로세스 메모리에 있어 현재는 단일 시그널링 인스턴스로 운용해야 합니다.",
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
                "Core가 발급한 RS256 입장 토큰을 ROUND가 검증한 뒤 WebSocket으로 연결 메시지를 전달합니다. 브라우저는 mesh로 직접 연결하고 직접 연결이 어려우면 Cloudflare TURN을 사용합니다.",
            note: "미디어는 시그널링 서버를 거치지 않습니다. 새 연결의 순번과 다른 이전 SDP 및 ICE 메시지는 버립니다.",
            compact: {
                input: ["Core 입장 토큰", "RS256 서명 검증"],
                action: ["WebSocket 시그널링", "연결 메시지만 전달"],
                outputs: [
                    ["직접 연결", "mesh WebRTC"],
                    ["직접 연결 어려움", "Cloudflare TURN"],
                ],
            },
        },
    },
}

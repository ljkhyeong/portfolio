export const projectOgCards = [
    {
        id: "baton",
        route: "/projects/baton",
        title: ["BATON"],
        category: "개인 프로젝트 / 역할·업무·인수인계",
        description: "역할·업무·인수인계는 Core에,\n독립 기능은 6개 서비스에 저장합니다.",
        caption: "조직 업무를 맡는 Core와 6개 독립 서비스",
        labels: ["GO", "WATCH", "RELAY", "BRIEF", "CAL", "ROUND"],
    },
    {
        id: "e-warrant",
        route: "/projects/e-warrant",
        title: ["전송형", "전자영장 시스템"],
        category: "경력 프로젝트 / LG CNS 컨소시엄 / 5개 기관 연계",
        description: "기관별 요청 형식을 변환하고\n제출 자료를 KICS에 반영합니다.",
        caption: "요청 전달과 제출 자료 반영",
        steps: [
            ["KICS", "영장 및 자료 요청"],
            ["기관별 규격 변환", "연계 서버와 Spring Batch"],
            ["통신사 및 집행포털", "자료 제출 후 KICS 반영"],
        ],
    },
    {
        id: "happygallery",
        route: "/projects/happygallery",
        title: ["happyGallery"],
        category: "개인 프로젝트 / 공방 주문과 예약",
        description: "카드와 간편결제를 처리하고\n스마트스토어 주문과 재고를 맞춥니다.",
        caption: "자사몰과 외부 판매 채널의 주문 및 재고 운영",
        steps: [
            ["자사몰 결제", "카드, 네이버페이 및 카카오페이"],
            ["스마트스토어 주문", "변경 주문과 부분취소 수집"],
            ["공유 재고 반영", "주문 수량 변경분만 차감 또는 복원"],
        ],
    },
    {
        id: "youth-policy-mate",
        route: "/projects/youth-policy-mate",
        title: ["청년정책메이트"],
        category: "웹앱 / 서울 청년정책",
        description: "정책 상태와 신청 조건을 확인하고\n수집 실패 재처리와 일정 알림을 제공합니다.",
        caption: "조건 확인·수집 재처리·일정 알림",
        steps: [
            ["공개 정책 조회", "접수 상태·질문 제공 여부 검색"],
            ["검토한 조건 질문", "정책 9종의 일부 요건과 근거"],
            ["정책 상태 관리", "원문 충돌·수집 실패·일정·알림"],
        ],
    },
    {
        id: "hope-commit",
        route: "/projects/hope-commit",
        title: ["Hope Commit"],
        category: "개발 도구 / SeungIl 님의 Hope 비공식 포크",
        description: "지정한 커밋만 리뷰하고\n설명에 해당하는 코드 줄을 표시합니다.",
        caption: "검토 범위 고정부터 HTML 리뷰까지",
        steps: [
            ["대상 커밋 확정", "비교 기준과 커밋 범위 고정"],
            ["변경 줄 확인", "설명과 실제 diff 연결"],
            ["HTML 리뷰 생성", "파일과 변경 줄을 함께 확인"],
        ],
    },
    {
        id: "intent-trace",
        route: "/projects/intent-trace",
        title: ["IntentTrace"],
        category: "개발 도구 / AI 코드 변경 기록",
        description: "변경 근거와 검증을 코드 위치에 연결하고\nGitHub 자료와 함께 확인합니다.",
        caption: "기록 공개·GitHub 자료 조회·Markdown 저장",
        steps: [
            ["요청과 변경 기록", "변경 근거와 출처, 코드 위치, 검증 결과"],
            ["GitHub 자료 조회", "이슈·PR 내용과 기존 CI 결과"],
            ["팀 공개와 저장", "코드 변경 시 차단·Markdown 내려받기"],
        ],
    },
    {
        id: "defense",
        route: "/projects/defense",
        title: ["차세대", "군사법 정보 시스템"],
        category: "경력 프로젝트 / 국방부 산하 4개 기관 연계",
        description: "군사법 기관의 자료 검증 배치와\n대용량 파일 업로드를 개발했습니다.",
        caption: "수용자 자료 검증과 군교정 DB 반영",
        steps: [
            ["군사법원, 군검찰 및 군사경찰", "기관별 자료 수신"],
            ["자료 검증 배치", "인적정보와 영장정보 검증"],
            ["군교정 DB 반영", "검증한 수용자 정보 저장"],
        ],
    },
    {
        id: "webrtc",
        route: "/projects/webrtc",
        title: ["WebRTC / HLS", "현장강의 보조"],
        category: "교육 프로젝트 / 6인 팀 시연 환경",
        description: "실시간 강의와 다시보기를 제공하고\nHLS 재생 지연을 줄였습니다.",
        caption: "RTP 출력의 HLS 변환과 지난 구간 다시보기",
        steps: [
            ["mediasoup RTP 출력", "강의 영상 전달"],
            ["HLS 변환", "FFmpeg 및 GStreamer"],
            ["지난 구간 다시보기", "시연 환경 재생 지연 약 35초 → 17초"],
        ],
    },
    ...[
        [
            "go",
            "짧은 링크 발급",
            "같은 UUID의 재요청에는 기존 링크를 반환하고\n조건이 다르면 충돌로 차단합니다.",
        ],
        ["watch", "URL 상태 점검", "사설망 접근을 차단하고\n중단된 점검을 다시 실행합니다."],
        [
            "relay",
            "이벤트 전달",
            "같은 이벤트는 전달 작업을 다시 만들지 않고\n결과 미확인은 다시 보내지 않습니다.",
        ],
        [
            "brief",
            "업무 점검과 주간 보고서",
            "Core의 점검 결과를 반영하고\n발행한 주간 보고서는 유지합니다.",
        ],
        [
            "cal",
            "외부 캘린더 구독",
            "최신 일정만 읽기 전용 피드로 제공하고\n구독 토큰을 교체·폐기합니다.",
        ],
        [
            "round",
            "WebRTC 스터디룸",
            "Core 입장 토큰을 확인하고\n참가자 간 영상과 채팅을 연결합니다.",
        ],
    ].map(([serviceId, role, description]) => ({
        id: `baton-${serviceId}`,
        route: `/projects/baton/${serviceId}`,
        serviceId,
        title: ["BATON", serviceId.toUpperCase()],
        category: `BATON 마이크로서비스 / ${role}`,
        description,
        caption: role,
    })),
].map((card) => ({ ...card, image: `/og/${card.id}.png` }))

export const projectOgCardsById = Object.fromEntries(projectOgCards.map((card) => [card.id, card]))

export const projectOgImagesByRoute = Object.fromEntries(
    projectOgCards.map((card) => [card.route, card.image]),
)

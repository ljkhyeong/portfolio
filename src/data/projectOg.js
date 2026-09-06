export const projectOgCards = [
    {
        id: "baton",
        route: "/projects/baton",
        title: ["BATON"],
        category: "개인 프로젝트 / 조직 운영 플랫폼",
        description: "조직 운영은 Core에서,\n독립 기능은 6개 서비스에서.",
        caption: "Core와 서비스별 책임 분리",
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
        category: "모바일 웹앱 / 서울 청년정책",
        description: "공개 정책과 신청 조건을 확인하고\n관심 정책의 일정과 알림을 관리합니다.",
        caption: "정책 탐색·조건 확인·관심 정책 관리",
        steps: [
            ["공개 정책 조회", "수집한 정책 목록과 상세"],
            ["검토한 조건 질문", "확인한 요건과 추가 확인 구분"],
            ["관심 정책 관리", "저장·신청 일정·서비스 내 알림"],
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
        description: "변경 이유, 코드와 검증을 기록하고\n작성자가 확인한 기록을 팀에 공개합니다.",
        caption: "확인 뒤 코드가 바뀌면 공개 차단",
        steps: [
            ["요청과 변경 기록", "변경 근거와 출처, 코드 위치, 검증 결과"],
            ["작성자 확인", "커밋 ID와 코드 줄 해시 확인"],
            ["확인한 기록을 팀에 공개", "코드가 바뀐 기록은 공개 차단"],
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
            "같은 UUID의 재요청은 기존 링크로.\n조건이 다르면 충돌로 차단합니다.",
        ],
        ["watch", "URL 상태 점검", "사설망 접근을 차단하고\n중단된 점검을 다시 실행합니다."],
        [
            "relay",
            "이벤트 전달",
            "같은 이벤트는 같은 전달 작업으로.\n결과 미확인은 다시 보내지 않습니다.",
        ],
        [
            "brief",
            "업무 점검과 주간 보고서",
            "Core의 점검 결과를 반영하고\n발행한 주간 보고서는 유지합니다.",
        ],
        [
            "cal",
            "외부 캘린더 구독",
            "최신 일정만 읽기 전용 피드로.\n개정 번호와 구독 토큰을 관리합니다.",
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

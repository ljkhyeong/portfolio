export const siteUrl = "https://ljkportfolio.netlify.app"

export const defaultRouteMeta = {
    title: "임정규 | 백엔드 개발자",
    description:
        "BEINTECH에서 해양경찰 사건수사시스템(KICS) 요청을 통신사와 집행포털 규격으로 변환해 전송하고 제출 자료를 다시 KICS에 반영하는 서버 기능과 Spring Batch를 개발하고 있는 임정규의 포트폴리오",
    image: "/og-cover.png",
}

export const routeMeta = {
    "/": defaultRouteMeta,
    "/projects/baton": {
        title: "BATON | 임정규 포트폴리오",
        description:
            "조직의 역할, 반복 업무, 의사결정과 인수인계를 관리하고 링크 생성, URL 점검, 서비스 간 이벤트 전달, 주간 보고서, 캘린더와 최대 6명이 참여하는 WebRTC 스터디룸을 별도 서비스로 구현한 BATON 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/baton/go": {
        title: "BATON GO | 임정규 포트폴리오",
        description:
            "BATON 조직 화면과 ROUND WebRTC 스터디룸으로 연결되는 허용된 주소에 짧은 링크를 발급하고 리다이렉트하며 실제 접근 권한은 대상 서비스가 직접 확인하도록 구현한 GO 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/watch": {
        title: "BATON WATCH | 임정규 포트폴리오",
        description:
            "사설 IP와 내부망 주소 접근을 차단하면서 BATON 중앙 서비스에 등록된 외부 URL을 점검하고, 이전 결과와 달라진 상태를 중앙 서비스에 전달하는 WATCH 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/relay": {
        title: "BATON RELAY | 임정규 포트폴리오",
        description:
            "BATON 이벤트를 등록된 HTTP Webhook 또는 SQS FIFO 큐로 전달하고, 전송 요청의 성공 여부를 확인하지 못한 건은 자동 재전송하지 않고 별도 상태로 저장하는 RELAY 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/brief": {
        title: "BATON BRIEF | 임정규 포트폴리오",
        description:
            "BRIEF는 담당자 및 후임자 공백, 위험 요소가 있는 역할의 책임과 인수인계 자료 부족, 반복 마감 지연과 교대가 가까운 미완료 인수인계를 찾습니다. 결과는 운영 점검 목록과 주간 보고서로 정리합니다.",
        image: "/og-cover.png",
    },
    "/projects/baton/cal": {
        title: "BATON CAL | 임정규 포트폴리오",
        description:
            "BATON 중앙 서비스가 확정한 일정과 마감을 외부 캘린더에서 구독할 수 있는 읽기 전용 iCalendar 피드로 제공하는 CAL 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/round": {
        title: "BATON ROUND | 임정규 포트폴리오",
        description:
            "중앙 서비스가 발급한 WebRTC 스터디룸 참여권을 확인한 뒤 최대 6명의 WebRTC 연결 메시지를 전달하고, 직접 연결이 어려울 때 중계 서버 접속 정보를 제공하는 ROUND 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/e-warrant": {
        title: "전송형 전자영장 시스템 | 임정규 포트폴리오",
        description:
            "LG CNS 컨소시엄에서 해양경찰 사건수사시스템(KICS)의 자료 제공 요청을 통신사와 집행포털 규격으로 변환해 전송하고, 연계를 통해 수신한 제출 자료를 KICS에 반영하는 서버 기능과 Spring Batch를 개발하고 있는 사례",
        image: "/og-cover.png",
    },
    "/projects/happygallery": {
        title: "happyGallery | 임정규 포트폴리오",
        description:
            "결제 및 환불의 중복 처리를 막고 미전송 알림을 복구하며, 예약 정원과 옵션 재고 초과를 방지하고 외부 배송조회 등록 실패를 배치로 다시 처리한 happyGallery 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/hope-commit": {
        title: "Hope Commit | 임정규 포트폴리오",
        description:
            "SeungIl 님이 개발한 Hope 3.0.3을 포크해 입력한 커밋과 일반, 최초 및 병합 커밋별 규칙으로 확정한 비교 기준에 각각 저장된 코드만 대조하고, 리뷰 설명이 실제 변경 파일과 줄을 가리키는지 확인한 뒤 새 HTML로 저장하는 Commit Diff 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/defense": {
        title: "차세대 군사법 정보 시스템 | 임정규 포트폴리오",
        description:
            "BEINTECH에서 군사법원, 군검찰 및 군사경찰의 수용자 및 영장 자료를 검증해 군교정 DB에 반영하고, 상태 변경 요청 위조를 차단했으며, 대용량 파일의 저장소 직접 업로드와 폐쇄망 연계 장애 재처리를 담당한 경력 사례",
        image: "/og-cover.png",
    },
    "/projects/webrtc": {
        title: "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
        description:
            "2023년 6인 팀에서 WebRTC 실시간 화면과 mediasoup의 RTP 출력을 HLS로 변환하는 다시보기 서버 및 화면을 구현하고, 팀 시연 환경에서 HLS 재생 지연을 약 35초에서 약 17초로 줄인 교육 프로젝트",
        image: "/og-cover.png",
    },
    "/search": {
        title: "포트폴리오 문서 검색 | 임정규",
        description:
            "프로젝트별 담당 업무, 구현 방법, 테스트 결과와 공개 문서를 검색하고 사용한 문서 링크가 표시된 AI 답변을 확인할 수 있습니다.",
        image: "/og-cover.png",
    },
    "/portfolio/print": {
        title: "인쇄용 포트폴리오 | 임정규",
        description: defaultRouteMeta.description,
        image: "/og-cover.png",
        noindex: true,
    },
}

export const notFoundRouteMeta = {
    title: "페이지를 찾을 수 없습니다 | 임정규 포트폴리오",
    description: "요청한 포트폴리오 페이지를 찾을 수 없습니다.",
    image: "/og-cover.png",
    noindex: true,
}

export const normalizeRoutePath = (pathname) =>
    pathname === "/" ? "/" : pathname.replace(/\/+$/, "")

export const toCanonicalUrl = (pathname) => {
    const normalizedPathname = normalizeRoutePath(pathname)
    const canonicalPathname = normalizedPathname === "/" ? "/" : `${normalizedPathname}/`

    return new URL(canonicalPathname, siteUrl).toString()
}

export const toAbsoluteUrl = (value) => new URL(value, siteUrl).toString()

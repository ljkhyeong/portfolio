export const siteUrl = "https://ljkportfolio.netlify.app"

export const defaultRouteMeta = {
    title: "임정규 | 백엔드 개발자",
    description:
        "LG CNS 컨소시엄 전송형 전자영장 프로젝트의 독립망 간 기관 연계 경험과 결제 및 환불 멱등성, 알림 아웃박스 설계를 담은 백엔드 개발자 임정규의 포트폴리오",
    image: "/og-cover.png",
}

export const routeMeta = {
    "/": defaultRouteMeta,
    "/projects/baton": {
        title: "BATON | 임정규 포트폴리오",
        description:
            "조직 운영 기준을 담당하는 Core와 GO, WATCH, RELAY, BRIEF, CAL 마이크로서비스의 책임과 테스트 기준을 정리한 BATON 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/baton/go": {
        title: "BATON GO | 임정규 포트폴리오",
        description:
            "BATON의 업무 화면을 짧고 고정된 주소로 공유하고 허용된 내부 경로로 연결하는 GO 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/watch": {
        title: "BATON WATCH | 임정규 포트폴리오",
        description:
            "BATON에 등록된 외부 URL을 안전하게 점검하고 상태 변경을 Core에 전달하는 WATCH 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/relay": {
        title: "BATON RELAY | 임정규 포트폴리오",
        description:
            "BATON의 알림 요청을 외부 메시지 공급자에 전달하고 전송 상태를 관리하는 RELAY 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/brief": {
        title: "BATON BRIEF | 임정규 포트폴리오",
        description:
            "운영 이벤트를 모아 이번 주에 확인할 항목과 생성 시점의 주간 요약을 제공하는 BRIEF 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/cal": {
        title: "BATON CAL | 임정규 포트폴리오",
        description:
            "BATON에서 확정한 일정과 마감을 외부 캘린더에서 구독할 수 있는 읽기 전용 피드로 제공하는 CAL 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/e-warrant": {
        title: "전송형 전자영장 시스템 | 임정규 포트폴리오",
        description:
            "LG CNS 컨소시엄 참여 프로젝트에서 독립망 간 기관 연계 인터페이스와 Spring Batch, 대용량 조회 및 외부 연동의 실패 경계를 다룬 전송형 전자영장 시스템 사례",
        image: "/og-cover.png",
    },
    "/projects/happygallery": {
        title: "happyGallery | 임정규 포트폴리오",
        description:
            "AWS 실운영 경험과 결제 및 환불 멱등성, 알림 아웃박스, 예약 및 주문 상태 전이를 정리한 happyGallery 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/defense": {
        title: "차세대 군사법 정보 시스템 | 임정규 포트폴리오",
        description:
            "기관 연계 배치, 보안 기능과 운영 장애 대응 경험을 정리한 차세대 군사법 정보 시스템 경력 사례",
        image: "/og-cover.png",
    },
    "/projects/webrtc": {
        title: "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
        description:
            "WebRTC와 RTP 미디어를 HLS로 변환하고 재생 지연을 약 30초에서 11초로 줄인 교육 프로젝트",
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

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
            "정책을 적용한 단축 링크 생성과 조회, 리다이렉트, 멱등 처리를 담당하는 BATON GO 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/watch": {
        title: "BATON WATCH | 임정규 포트폴리오",
        description: "URL 점검 작업의 락 범위와 상태 전이를 설계한 BATON WATCH 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/relay": {
        title: "BATON RELAY | 임정규 포트폴리오",
        description:
            "전송 결과를 DB에 저장하고 중복 발송 방지와 재처리 기준을 설계한 BATON RELAY 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/brief": {
        title: "BATON BRIEF | 임정규 포트폴리오",
        description:
            "운영 이벤트를 중복 없이 처리하고 생성 후 수정하지 않는 주간 운영 브리프를 만드는 BATON BRIEF 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/cal": {
        title: "BATON CAL | 임정규 포트폴리오",
        description:
            "확정 일정을 읽기 전용 iCalendar 피드로 제공하고 구독 토큰과 조건부 조회를 처리하는 BATON CAL 마이크로서비스",
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

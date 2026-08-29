export const siteUrl = "https://ljkportfolio.netlify.app"

export const defaultRouteMeta = {
    title: "임정규 | 백엔드 개발자",
    description:
        "KICS와 통신사 및 전자영장 포털을 연계하는 서버와 배치를 개발하는 백엔드 개발자 임정규의 포트폴리오",
    image: "/og-cover.png",
}

export const routeMeta = {
    "/": defaultRouteMeta,
    "/projects/baton": {
        title: "BATON | 임정규 포트폴리오",
        description:
            "조직과 인수인계를 관리하는 Core와 링크, 점검, 이벤트, 보고서, 캘린더 및 WebRTC를 담당하는 6개 마이크로서비스로 구성한 BATON 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/baton/go": {
        title: "BATON GO | 임정규 포트폴리오",
        description:
            "허용된 BATON 및 ROUND 주소에 짧은 링크를 발급하고 이동을 처리하는 GO 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/watch": {
        title: "BATON WATCH | 임정규 포트폴리오",
        description:
            "내부망 접근을 차단하며 외부 URL을 점검하고 상태 변경을 Core에 전달하는 WATCH 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/relay": {
        title: "BATON RELAY | 임정규 포트폴리오",
        description:
            "BATON 이벤트를 Webhook과 SQS FIFO로 전달하고 중복 및 불확실한 재전송을 막는 RELAY 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/brief": {
        title: "BATON BRIEF | 임정규 포트폴리오",
        description:
            "담당 공백과 지연된 업무 및 인수인계를 찾아 운영 점검 목록과 주간 보고서를 만드는 BRIEF 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/cal": {
        title: "BATON CAL | 임정규 포트폴리오",
        description: "BATON 일정과 마감을 읽기 전용 iCalendar 구독으로 제공하는 CAL 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/round": {
        title: "BATON ROUND | 임정규 포트폴리오",
        description:
            "Core 참여권을 검증하고 최대 6명의 WebRTC 연결을 중계하는 ROUND 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/e-warrant": {
        title: "전송형 전자영장 시스템 | 임정규 포트폴리오",
        description:
            "KICS 요청을 통신사 및 전자영장 포털 규격으로 변환하고 제출 자료를 반영하는 서버와 Spring Batch 개발 사례",
        image: "/og-cover.png",
    },
    "/projects/happygallery": {
        title: "happyGallery | 임정규 포트폴리오",
        description:
            "중복 결제 및 환불, 알림 유실, 예약 정원 및 재고 초과를 방지한 공방 주문 및 예약 서비스",
        image: "/og-cover.png",
    },
    "/projects/hope-commit": {
        title: "Hope Commit | 임정규 포트폴리오",
        description:
            "SeungIl 님의 Hope 3.0.3을 포크해 지정한 커밋의 변경만 분석하는 HTML 리뷰 기능을 추가한 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/defense": {
        title: "차세대 군사법 정보 시스템 | 임정규 포트폴리오",
        description:
            "군사법원, 군검찰 및 군사경찰 자료 검증 배치와 요청 위조 차단 및 대용량 파일 직접 업로드를 개발한 경력 사례",
        image: "/og-cover.png",
    },
    "/projects/webrtc": {
        title: "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
        description:
            "WebRTC 실시간 강의와 HLS 다시보기를 구현하고 재생 지연을 약 35초에서 약 17초로 줄인 교육 프로젝트",
        image: "/og-cover.png",
    },
    "/search": {
        title: "포트폴리오 문서 검색 | 임정규",
        description:
            "프로젝트별 담당 업무, 구현 방법과 테스트 결과를 검색하고 출처가 포함된 답변을 확인할 수 있습니다.",
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

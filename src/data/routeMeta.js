export const siteUrl = "https://ljkportfolio.netlify.app"

export const defaultRouteMeta = {
    title: "임정규 | 백엔드 개발자",
    description:
        "KICS 요청을 기관별 규격으로 변환하고 제출 자료를 KICS에 반영하며, 결제 orderId와 환불 UUID를 재사용하고 DB 알림 작업을 다시 처리한 백엔드 개발자 임정규의 포트폴리오",
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
            "허용된 BATON 및 ROUND 경로에 짧은 링크를 발급하고 같은 UUID의 중복 생성을 막는 GO 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/watch": {
        title: "BATON WATCH | 임정규 포트폴리오",
        description:
            "사설망 접근을 차단하며 URL 상태를 점검하고 서버 중단 뒤 다른 서버가 처리 기한이 지난 점검을 이어받는 WATCH 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/relay": {
        title: "BATON RELAY | 임정규 포트폴리오",
        description:
            "같은 이벤트 ID의 전달 작업을 1건으로 유지하고 서버 중단 뒤 기존 전송 ID로 이어가는 RELAY 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/brief": {
        title: "BATON BRIEF | 임정규 포트폴리오",
        description:
            "담당 공백과 업무 지연을 점검하고 같은 주간 및 이벤트 순번과 항목의 보고서를 1건으로 유지하는 BRIEF 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/cal": {
        title: "BATON CAL | 임정규 포트폴리오",
        description:
            "BATON 일정과 마감을 읽기 전용 iCalendar로 제공하고 일정 개정 번호 및 구독 토큰을 관리하는 CAL 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/round": {
        title: "BATON ROUND | 임정규 포트폴리오",
        description:
            "Core 참여권을 검증해 최대 6명의 WebRTC 연결 메시지를 전달하고 TURN 접속 정보를 제공하는 ROUND 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/e-warrant": {
        title: "전송형 전자영장 시스템 | 임정규 포트폴리오",
        description:
            "KICS 요청을 기관별 규격으로 변환해 전달하고 제출 자료를 KICS에 반영하는 서버와 Spring Batch 개발 사례",
        image: "/og-cover.png",
    },
    "/projects/happygallery": {
        title: "happyGallery | 임정규 포트폴리오",
        description:
            "결제 orderId와 환불 UUID를 재사용하고 DB 알림 작업을 스케줄러가 처리하며 행 잠금으로 정원 및 재고 초과를 막는 서비스",
        image: "/og-cover.png",
    },
    "/projects/hope-commit": {
        title: "Hope Commit | 임정규 포트폴리오",
        description:
            "SeungIl 님의 Hope 3.0.3을 포크해 선택한 커밋과 확정한 비교 기준 사이의 변경만 검토하고 줄 근거를 확인한 HTML을 저장하는 프로젝트",
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
        title: "백엔드 프로젝트 문서 검색 | 임정규",
        description:
            "KICS 요청 변환과 제출 자료의 KICS 반영, 결제 및 환불 ID 재사용과 서버 중단 뒤 알림 작업 처리 경험을 공개 문서와 출처로 확인할 수 있습니다.",
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

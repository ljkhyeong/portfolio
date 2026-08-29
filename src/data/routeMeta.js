export const siteUrl = "https://ljkportfolio.netlify.app"

export const defaultRouteMeta = {
    title: "임정규 | 백엔드 개발자",
    description:
        "Java와 Spring으로 기관 연계 서버와 배치를 개발하고, 중복 처리 방지와 장애 복구를 구현한 백엔드 개발자 임정규의 포트폴리오",
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
            "같은 UUID와 조건은 링크 1건으로 유지하고 HMAC-SHA256 코드와 허용 경로를 검증하는 GO 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/watch": {
        title: "BATON WATCH | 임정규 포트폴리오",
        description:
            "사설망 및 DNS 재조회 중 IP 변경을 차단하고 이전 URL 버전의 늦은 결과를 버리는 WATCH 마이크로서비스",
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
            "중복 및 역순 이벤트를 차단하고 저장 이벤트로 점검 목록을 재생성하며 동일 조건의 주간 보고서를 1건만 저장하는 BRIEF 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/cal": {
        title: "BATON CAL | 임정규 포트폴리오",
        description:
            "일정 개정 번호를 검증하고 구독 토큰 회전 및 폐기와 읽기 전용 iCalendar를 제공하는 CAL 마이크로서비스",
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
            "SeungIl 님의 Hope 3.0.3을 포크해 일반, 최초 및 병합 커밋의 비교 기준을 확정하고 실제 변경 줄이 근거인 결과만 HTML로 저장하는 프로젝트",
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
            "기관 연계, 중복 처리 방지와 장애 복구 경험을 공개 프로젝트 문서에서 검색하고 출처와 함께 확인할 수 있습니다.",
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

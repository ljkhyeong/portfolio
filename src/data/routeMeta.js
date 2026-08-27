export const siteUrl = "https://ljkportfolio.netlify.app"

export const defaultRouteMeta = {
    title: "임정규 | 백엔드 개발자",
    description:
        "BEINTECH에서 2년 이상 공공 SI 백엔드를 개발하며 LG CNS 컨소시엄 전송형 전자영장 프로젝트의 독립망 간 기관 연계를 담당한 임정규의 포트폴리오",
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
            "BATON에 등록된 외부 URL을 SSRF 방어 기준으로 점검하고 이전 결과와 달라진 URL 상태를 Core에 전달하는 WATCH 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/relay": {
        title: "BATON RELAY | 임정규 포트폴리오",
        description:
            "BATON의 알림 이벤트를 외부 메시지 공급자에 전달하고 성공, 실패와 응답 유실 상태를 구분해 저장하는 RELAY 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/brief": {
        title: "BATON BRIEF | 임정규 포트폴리오",
        description:
            "인수인계 지연, 루틴 누락과 결정 후속 조치 지연 이벤트를 모아 이번 주 확인 항목과 주간 브리프를 제공하는 BRIEF 마이크로서비스",
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
            "LG CNS 컨소시엄에서 해양경찰 KICS 행정망, 통신사 전용망과 전자영장 집행포털 인터넷망 간 연계 인터페이스 및 Spring Batch를 개발한 사례",
        image: "/og-cover.png",
    },
    "/projects/happygallery": {
        title: "happyGallery | 임정규 포트폴리오",
        description:
            "AWS 실운영 경험과 결제 및 환불 멱등성, 알림 아웃박스, 예약 및 주문 상태 전이를 정리한 happyGallery 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/hope-commit": {
        title: "Hope Commit | 임정규 포트폴리오",
        description:
            "지정한 Git 커밋과 부모의 객체만 수집하고 근거 범위를 검증해 오프라인 HTML 리뷰를 생성하는 Hope Commit 플러그인",
        image: "/og-cover.png",
    },
    "/projects/defense": {
        title: "차세대 군사법 정보 시스템 | 임정규 포트폴리오",
        description:
            "BEINTECH에서 수용자 인적정보 및 영장정보 연계 배치, WebSquare 요청의 Spring Security CSRF 처리, Presigned URL 기반 대용량 파일 업로드와 폐쇄망 장애 대응을 담당한 차세대 군사법 정보 시스템 경력 사례",
        image: "/og-cover.png",
    },
    "/projects/webrtc": {
        title: "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
        description:
            "WebRTC와 RTP 미디어를 HLS로 변환하고 재생 지연을 약 30초에서 11초로 줄인 교육 프로젝트",
        image: "/og-cover.png",
    },
    "/search": {
        title: "포트폴리오 문서 검색 | 임정규",
        description:
            "임정규의 프로젝트 개요, 문제 해결, 설계 판단과 공개한 대표 문서를 검색하고 근거가 표시된 AI 답변을 확인할 수 있습니다.",
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

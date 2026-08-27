export const siteUrl = "https://ljkportfolio.netlify.app"

export const defaultRouteMeta = {
    title: "임정규 | 백엔드 개발자",
    description:
        "BEINTECH에서 2024년 6월부터 공공 SI 백엔드를 개발하며 LG CNS 컨소시엄 전송형 전자영장 프로젝트의 독립망 간 기관 연계를 담당한 임정규의 포트폴리오",
    image: "/og-cover.png",
}

export const routeMeta = {
    "/": defaultRouteMeta,
    "/projects/baton": {
        title: "BATON | 임정규 포트폴리오",
        description:
            "조직의 역할, 반복 업무, 의사결정과 인수인계를 관리하고 링크, URL 점검, 알림, 주간 보고서, 캘린더와 6인 화상방을 별도 서비스로 구현한 BATON 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/baton/go": {
        title: "BATON GO | 임정규 포트폴리오",
        description:
            "BATON과 ROUND의 허용된 화면에 짧은 링크를 발급하고 리다이렉트하며 실제 접근 권한은 대상 서비스가 직접 확인하도록 구현한 GO 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/watch": {
        title: "BATON WATCH | 임정규 포트폴리오",
        description:
            "사설 IP와 내부망 주소 접근을 차단하면서 BATON에 등록된 외부 URL을 점검하고, 이전 점검과 달라진 상태를 Core에 전달하는 WATCH 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/relay": {
        title: "BATON RELAY | 임정규 포트폴리오",
        description:
            "BATON 이벤트를 등록된 HTTP Webhook 또는 SQS FIFO 큐로 전달하고, 대상의 처리 결과를 확인하지 못한 건은 자동 재전송하지 않고 별도 상태로 저장하는 RELAY 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/brief": {
        title: "BATON BRIEF | 임정규 포트폴리오",
        description:
            "역할 미배정, 후임자 미지정, 인수인계 준비 미완료, 반복 지연 루틴과 미완료 인수인계 이벤트로 현재 확인 목록과 주간 보고서를 만드는 BRIEF 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/cal": {
        title: "BATON CAL | 임정규 포트폴리오",
        description:
            "BATON에서 확정한 일정과 마감을 외부 캘린더에서 구독할 수 있는 읽기 전용 iCalendar 피드로 제공하는 CAL 마이크로서비스",
        image: "/og-cover.png",
    },
    "/projects/baton/round": {
        title: "BATON ROUND | 임정규 포트폴리오",
        description:
            "Core가 발급한 방 참여권을 확인한 뒤 최대 6명이 참여할 수 있는 WebRTC 화상방의 연결 메시지를 중계하고 TURN 접속 정보를 제공하는 ROUND 마이크로서비스",
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
            "결제 및 환불 요청 ID로 중복 처리를 막고, 미전송 알림은 DB에서 다시 처리하며, 옵션 재고 행을 같은 순서로 잠가 초과 차감을 막은 happyGallery 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/hope-commit": {
        title: "Hope Commit | 임정규 포트폴리오",
        description:
            "SeungIl 님의 Hope 3.0.3을 포크해 입력 커밋과 부모에 저장된 코드만 비교하고, 리뷰 설명이 실제 변경 파일과 줄을 가리키는지 확인한 뒤 새 HTML로 저장하는 Commit Diff 프로젝트",
        image: "/og-cover.png",
    },
    "/projects/defense": {
        title: "차세대 군사법 정보 시스템 | 임정규 포트폴리오",
        description:
            "BEINTECH에서 수용자 정보 연계 배치, 상태 변경 요청 위조 차단, 파일 본문이 WAS를 거치지 않는 저장소 직접 업로드와 폐쇄망 장애 대응을 담당한 경력 사례",
        image: "/og-cover.png",
    },
    "/projects/webrtc": {
        title: "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
        description:
            "2023년 6인 팀에서 RTP 영상을 HLS로 변환하는 서버와 실시간 및 다시보기 React 화면을 구현하고 재생 지연을 약 35초에서 17초로 줄인 교육 프로젝트",
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

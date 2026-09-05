export const portfolioProfile = {
    name: "임정규",
    role: "백엔드 개발자",
    location: "서울",
    email: "jolri24@naver.com",
    phone: "010 3972 6284",
    phoneHref: "+821039726284",
    github: "https://github.com/ljkhyeong",
    site: "https://ljkportfolio.netlify.app",
}

export const education = {
    period: "교육 과정 2023.05 — 2023.11",
    organization: "카카오 클라우드 스쿨 개발자 과정 3기",
    meta: "6인 팀",
    projectId: "webrtc",
    description:
        "WebRTC 실시간 강의와 HLS 다시보기 화면을 구현했습니다. mediasoup RTP를 HLS로 변환했습니다. 팀 시연에서 HLS 재생 지연을 약 35초에서 약 17초로 줄였습니다.",
}

export const careers = [
    {
        id: "beintech",
        period: "2024.06 — 현재",
        organization: "BEINTECH",
        position: "백엔드 개발자",
        description:
            "차세대 군사법 정보 시스템에서 세 기관의 수용자 자료를 검증해 군교정 DB에 반영하는 배치를 개발했습니다. Jenkins 실행 이력, JEUS 로그와 Tibero 상태로 중단된 기관 배치를 찾아 필요한 배치만 재실행했습니다. 현재는 KICS 요청을 기관별 규격으로 변환해 전달하고 제출 자료를 KICS에 반영하는 서버와 Spring Batch를 개발합니다.",
        homeDescription: "공공 SI 연계 서버와 배치 개발 및 운영",
        projectResponsibilities: {
            warrant: "기관별 요청 변환 및 제출 자료 반영 서버 개발",
            defense: "기관 자료 검증 배치 개발 및 중단 배치 재실행",
        },
        projectIds: ["warrant", "defense"],
    },
]

export const personalActivities = [
    {
        id: "lns-http-study",
        title: "LnS (Learn & Share) — HTTP 완벽 가이드",
        type: "개발 서적 그룹 스터디",
        role: "발표 및 Q&A 정리",
        summary:
            "HTTP 메시지, 캐시, 프록시와 인증 등 실무에서 자주 확인하는 주제를 발표하고 질문과 답변을 문서로 정리했습니다.",
        links: [
            {
                label: "LnS 발표 및 Q&A 기록",
                href: "https://www.notion.so/LnS-Learn-Share-b3782d6639408242904501146ebbdfdf",
            },
        ],
    },
    {
        id: "effective-java-study",
        title: "Effective Java 스터디",
        type: "개발 서적 그룹 스터디",
        role: "아이템별 학습 내용 기록",
        summary:
            "객체 생성, 불변 객체 설계, 제네릭과 API 설계 원칙을 아이템별로 학습하고 적용 기준을 Notion에 기록했습니다.",
        links: [
            {
                label: "Effective Java 학습 기록",
                href: "https://www.notion.so/2bb82d6639408021aa64da7cb536ab64",
            },
        ],
    },
]

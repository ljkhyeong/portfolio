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
    period: "2023.05 — 2023.11",
    type: "교육 과정",
    organization: "카카오 클라우드 스쿨 개발자 과정 3기",
    summary: "6인 팀으로 WebRTC/HLS 현장강의 보조 서비스를 개발했습니다.",
    route: "/projects/webrtc",
}

export const careers = [
    {
        id: "beintech",
        period: "2024.06 — 현재",
        organization: "BEINTECH",
        position: "백엔드 개발자",
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
        role: "발표 및 Q&A 정리",
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
        role: "아이템별 학습 내용 기록",
        links: [
            {
                label: "Effective Java 학습 기록",
                href: "https://www.notion.so/2bb82d6639408021aa64da7cb536ab64",
            },
        ],
    },
]

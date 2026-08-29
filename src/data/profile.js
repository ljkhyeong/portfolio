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
        "WebRTC 실시간 강의와 HLS 다시보기 화면을 구현했습니다. mediasoup RTP를 HLS로 변환하고 재생 지연을 약 35초에서 약 17초로 줄였습니다.",
}

export const careers = [
    {
        id: "beintech",
        period: "2024.06 — 현재",
        organization: "BEINTECH",
        position: "백엔드 개발자",
        description:
            "차세대 군사법 정보 시스템에서 군사법원, 군검찰과 군사경찰 자료 검증 배치 및 장애 재처리를 담당했습니다. 현재 전송형 전자영장 시스템에서 KICS 연계 서버와 Spring Batch를 개발합니다.",
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
            "객체 생성, 변경할 수 없는 객체 설계, 제네릭과 API 설계 원칙을 아이템별로 학습하고 적용 기준을 Notion에 기록했습니다.",
        links: [
            {
                label: "Effective Java 학습 기록",
                href: "https://www.notion.so/2bb82d6639408021aa64da7cb536ab64",
            },
        ],
    },
]

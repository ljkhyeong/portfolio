export const homeHeroContent = {
    headline: {
        lead: "기관 간 요청과 제출 자료를 전달하고,",
        emphasis: "응답 유실과 서버 중단 뒤 남은 작업",
        tail: "을 다시 처리하는 백엔드를 개발합니다.",
    },
    summary:
        "공공 SI에서 해양경찰 사건수사시스템(KICS)의 자료 제공 요청을 통신사 업무망과 전자영장 집행포털로 전달하고, 기관이 제출한 자료를 다시 KICS에 반영하는 서버 기능과 Spring Batch를 개발하고 있습니다. 개인 프로젝트에서는 같은 결제나 링크 요청이 다시 들어오면 기존 결과를 반환하고, 보내지 못한 알림은 저장된 기록에서 찾아 다시 전송합니다.",
    signals: [
        {
            label: "현재 업무",
            title: "전송형 전자영장 시스템",
            evidence: "BEINTECH · LG CNS 컨소시엄 · KICS-통신사 및 집행포털 연계 · Spring Batch",
            route: "/projects/e-warrant",
        },
        {
            label: "마이크로서비스 개발",
            title: "BATON",
            evidence:
                "중앙 서비스가 조직 데이터와 조직 구성원이 작업 공간에 접속할 때 함께 사용하는 공유 키를 관리하고, 6개 서비스가 링크, URL 점검, 이벤트 전달, 보고서, 캘린더와 WebRTC 스터디룸을 처리",
            route: "/projects/baton",
        },
        {
            label: "개발 및 배포",
            title: "happyGallery",
            evidence:
                "AWS 배포 및 운영 이력 · 중복 결제 및 환불 방지 · 서버 중단으로 남은 알림 재전송",
            route: "/projects/happygallery",
        },
    ],
}

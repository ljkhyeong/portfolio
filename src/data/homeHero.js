export const homeHeroContent = {
    headline: {
        lead: "기관 간 데이터를 연결하고,",
        emphasis: "중단된 작업을 다시 처리하는 백엔드",
        tail: "를 개발합니다.",
    },
    summary:
        "공공 SI에서 KICS, 통신사 업무망과 전자영장 집행포털 사이의 요청 및 제출 자료를 연계하는 인터페이스와 Spring Batch를 개발하고 있습니다. 개인 프로젝트에서는 결제, 알림과 링크 생성처럼 중복되거나 중단될 수 있는 작업의 처리 상태를 DB에 저장하고, 다시 실행해도 같은 결과가 나오도록 구현합니다.",
    signals: [
        {
            label: "현재 업무",
            title: "전송형 전자영장 시스템",
            evidence: "BEINTECH · LG CNS 컨소시엄 · 독립망 기관 연계 · Spring Batch",
            route: "/projects/e-warrant",
        },
        {
            label: "마이크로서비스 개발",
            title: "BATON",
            evidence: "조직 데이터와 참여 권한은 Core · 부가 기능은 6개 서비스로 분리",
            route: "/projects/baton",
        },
        {
            label: "전체 서비스 개발",
            title: "happyGallery",
            evidence: "AWS 배포 및 운영 · 중복 결제 및 환불 방지 · 중단된 알림 재전송",
            route: "/projects/happygallery",
        },
    ],
}

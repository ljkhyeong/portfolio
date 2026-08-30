export const homeHeroContent = {
    headline:
        "재요청으로 인한 중복 실행을 막고, 서버 중단 후에도 작업을 이어가는 백엔드를 설계합니다.",
    summary:
        "공공 SI에서는 기관 연계 서버와 배치를 개발하고, 중단된 배치를 찾아 필요한 작업만 재실행했습니다. 개인 프로젝트에서는 결제와 환불의 중복 실행을 막고, DB에 저장한 알림을 서버 중단 후 다시 처리하도록 구현했습니다.",
    signals: [
        {
            label: "현재 업무",
            title: "전송형 전자영장 시스템",
            evidence: "KICS 요청을 기관별 규격으로 변환하고 제출 자료를 KICS에 반영",
            route: "/projects/e-warrant",
        },
        {
            label: "개인 프로젝트",
            title: "BATON",
            evidence:
                "같은 링크 요청과 이벤트는 기존 작업을 재사용하고, 중단된 전달은 시도 UUID와 외부 서비스 중복 방지 키를 유지해 재개",
            route: "/projects/baton",
        },
        {
            label: "개인 프로젝트",
            title: "happyGallery",
            evidence:
                "결제 orderId와 환불 UUID를 재사용해 중복 실행을 막고, 미전송 알림은 스케줄러가 재처리",
            route: "/projects/happygallery",
        },
    ],
}

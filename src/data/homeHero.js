export const homeHeroContent = {
    headline: "재요청에도 결과가 중복되지 않고, 서버가 중단돼도 작업이 이어지는 백엔드를 만듭니다.",
    summary:
        "공공 SI에서는 기관별 요청 변환과 제출 자료 반영을 처리하는 서버 및 배치를 개발했습니다. 개인 프로젝트에서는 결제 orderId와 환불 UUID를 재사용해 중복 실행을 막고, DB에 남은 알림 작업을 스케줄러가 다시 처리하도록 구현했습니다.",
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
            evidence: "같은 링크 요청은 1건만 저장하고 중단된 이벤트 전달은 기존 ID로 재개",
            route: "/projects/baton",
        },
        {
            label: "개인 프로젝트",
            title: "happyGallery",
            evidence: "결제 orderId와 환불 UUID를 재사용하고 DB의 미전송 알림은 스케줄러가 처리",
            route: "/projects/happygallery",
        },
    ],
}

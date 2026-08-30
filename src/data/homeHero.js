export const homeHeroContent = {
    headline: "중복 실행 방지와 중단 후 재처리 등 안정적인 설계를 추구하는 백엔드 개발자입니다.",
    headlineHighlight: "중복 실행 방지와 중단 후 재처리",
    summary:
        "공공 SI에서 기관 연계 서버와 배치를 개발합니다. 개인 프로젝트에서는 결제와 이벤트의 중복 실행을 막고, 중단된 작업을 이어서 처리하도록 구현했습니다.",
    flow: [
        {
            step: "01",
            title: "요청 수신",
            description: "요청 식별값과 처리 대상을 확인",
        },
        {
            step: "02",
            title: "중복 확인",
            description: "처리한 요청은 기존 결과를 재사용",
        },
        {
            step: "03",
            title: "상태 저장",
            description: "처리 상태와 재처리 기준을 DB에 기록",
        },
        {
            step: "04",
            title: "중단 후 재처리",
            description: "완료되지 않은 작업만 이어서 실행",
        },
    ],
    signals: [
        {
            label: "현재 업무",
            title: "전송형 전자영장 시스템",
            shortEvidence: "기관별 규격 변환",
            route: "/projects/e-warrant",
        },
        {
            label: "개인 프로젝트",
            title: "BATON",
            shortEvidence: "기존 작업 재사용",
            route: "/projects/baton",
        },
        {
            label: "개인 프로젝트",
            title: "happyGallery",
            shortEvidence: "결제 및 환불 중복 방지",
            route: "/projects/happygallery",
        },
    ],
}

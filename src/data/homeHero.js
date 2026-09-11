export const homeHeroContent = {
    headlineLines: ["중복 실행을 막고", "중단된 작업을 재처리하는", "백엔드 개발자입니다."],
    summary:
        "공공 SI에서 기관 연계 서버와 배치를 개발합니다. 개인 프로젝트에서는 결제·이벤트 중복 처리 방지와 중단 작업 재처리를 구현했습니다.",
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
            description: "미완료 작업을 재처리 기준에 따라 다시 실행",
        },
    ],
}

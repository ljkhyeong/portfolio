import { warrantPerformance } from "./warrantEvidence"

export const homeHeroContent = {
    headlineLines: ["중복 실행을 막고", "중단된 작업을 재처리하는", "백엔드 개발자입니다."],
    summary:
        "공공 SI에서 기관 연계 서버와 배치를 개발합니다. 개인 프로젝트에서는 결제·이벤트 중복 처리 방지와 중단 작업 재처리를 구현했습니다.",
    flow: [
        {
            step: "01",
            title: "요청 수신",
            description: "멱등 키와 처리 대상을 확인",
        },
        {
            step: "02",
            title: "중복 확인",
            description: "처리한 요청은 기존 결과를 재사용",
        },
        {
            step: "03",
            title: "상태 저장",
            description: "처리 상태와 처리 기한을 DB에 기록",
        },
        {
            step: "04",
            title: "중단 후 재처리",
            description: "처리 기한이 지난 작업만 다시 실행",
        },
    ],
    // 첫 화면에서 보여 주는 측정값. 측정 조건(환경)을 항상 함께 적는다.
    results: [
        {
            value: warrantPerformance.load,
            description: `${warrantPerformance.duration} 부하에서 ${warrantPerformance.result}`,
            source: "전송형 전자영장 시스템 · 성능 테스트 환경",
            route: "/projects/e-warrant",
        },
        {
            value: "약 35초 → 약 17초",
            description: "HLS 다시보기 재생 지연 단축",
            source: "WebRTC/HLS 교육 프로젝트 · 팀 시연 환경",
            route: "/projects/webrtc",
        },
        {
            value: "자동화 테스트 343개",
            description: "공개 릴리스 v5.0.2의 GitHub Actions 통과",
            source: "Hope Commit",
            route: "/projects/hope-commit",
        },
    ],
}

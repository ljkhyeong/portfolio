import { warrantOperationSummary, warrantPerformanceSummary } from "./warrantEvidence"

// 상세 첫 화면의 한 줄 소개
export const caseIntroductions = {
    baton: "여러 팀의 업무와 인수인계를 한곳에서 관리하는 서비스입니다.",
    happygallery:
        "공방의 상품 주문과 클래스 예약을 받고, 스마트스토어 주문과 재고를 동기화하는 서비스입니다.",
    "youth-policy-mate":
        "서울 청년 정책을 찾아보고, 저장한 정책이 바뀌거나 마감이 다가오면 알려 주는 웹앱입니다.",
    "hope-commit":
        "SeungIl 님의 Hope 6.0.0을 포크해 AI 커밋 리뷰를 추가했습니다. 리뷰 항목과 변경된 코드 줄을 HTML로 보여 줍니다.",
    "intent-trace":
        "AI가 바꾼 코드의 변경 이유와 검증 결과를 커밋과 코드 줄에 연결해 기록하는 도구입니다.",
    warrant: "법무부, 공수처, 검찰, 경찰, 해양경찰의 전자영장 업무를 연계하는 시스템입니다.",
    defense: "군사법원, 군검찰, 군사경찰, 군교정의 업무를 연계하는 시스템입니다.",
    webrtc: "강의를 실시간으로 보고 지난 구간을 다시 볼 수 있는 서비스입니다.",
}

// 상세 첫 화면의 확인한 범위. 어디까지 확인했는지와 확인하지 않은 범위를 문장으로 쓴다.
export const caseResults = {
    baton: "Core와 6개 서비스를 구현하고 통합 테스트했습니다. 보고서 비교, URL 점검 장애 구분과 통화 재연결은 공개 main에 반영했습니다. BRIEF, CAL, ROUND의 Core 연동은 로컬에서 확인했으며, 배포 환경의 전체 연동은 미검증입니다.",
    happygallery:
        "주문, 예약, 스마트스토어 연동을 Testcontainers와 E2E로 확인했습니다. main 2bd7012f의 GitHub Actions 검사와 k3s 롤링 배포가 성공했습니다. 네이버, Toss, NHN 실제 계정 연동은 미검증입니다.",
    "youth-policy-mate":
        "조건 질문, 관심 정책 일정과 알림을 구현하고 PostgreSQL 통합 테스트로 확인했습니다. 공개 main a7f4a69에서 웹과 서버 CI가 통과했습니다. OAuth, OpenAI, Resend 운영 연동은 아직 확인하지 않았습니다.",
    "hope-commit":
        "커밋 AI 리뷰 HTML(Commit Diff)을 구현해 Hope Commit v5.0.2(main 9d8392d)로 공개 릴리스했습니다. 커밋 종류별 비교 기준 확정, 변경 범위 밖을 가리키는 리뷰 항목 거절, 자격 증명 제외와 중단 후 재개를 GitHub Actions 자동화 테스트로 확인했습니다.",
    "intent-trace":
        "서버, 웹, IntelliJ, Zed 연동을 구현하고 main 4be09d2의 CI를 통과했습니다. v0.7.0 실행 JAR과 IntelliJ 플러그인을 공개했습니다. 실제 PR Check Run 게시와 서버 운영 배포는 미검증입니다.",
    // 운영 사실을 먼저 쓰고, 성능 테스트는 작업 선점 설계의 검증 근거로 끝에 둔다.
    warrant: `해양경찰 KICS의 연계 기능과 배치(Spring Batch)를 구현했습니다. ${warrantOperationSummary} 망 분리 구간 연계와 요청 저장 전에 PDF 완료 응답이 도착하는 경우를 검증했습니다. 성능 테스트 환경에서는 ${warrantPerformanceSummary}`,
    defense:
        "폐쇄망에서 수용자 자료 배치, CSRF 검증, Presigned URL 업로드를 확인했습니다. 운영 중단 배치는 이력, 로그, DB로 원인을 찾고 재처리 후 군교정 DB 반영까지 확인했습니다.",
    webrtc: "HLS 변환 서버와 React 화면을 만들고 팀 시연에서 실시간 시청과 지난 구간 재생을 확인했습니다. 팀 시연 환경에서 HLS 재생 지연을 약 35초에서 약 17초로 줄였습니다.",
}

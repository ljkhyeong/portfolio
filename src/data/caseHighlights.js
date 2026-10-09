import { warrantPerformanceSummary } from "./warrantEvidence"

// 상세 첫 화면의 한 줄 소개
export const caseIntroductions = {
    baton: "팀의 역할과 반복 업무, 인수인계 문서를 기록하고 여러 팀의 할 일을 한 화면에 모아 보는 서비스입니다.",
    happygallery:
        "공방의 상품 주문과 클래스 예약을 받고, 스마트스토어 주문과 재고를 동기화하는 서비스입니다.",
    "youth-policy-mate":
        "서울 청년 정책을 찾아보고, 저장한 정책이 바뀌거나 마감이 다가오면 알려 주는 웹앱입니다.",
    "hope-commit":
        "SeungIl 님의 Hope 6.0.0을 포크해, 지정한 커밋을 AI가 리뷰하고 각 리뷰 설명을 변경된 줄에 연결해 HTML로 보여 주는 기능을 추가했습니다.",
    "intent-trace":
        "AI가 바꾼 코드의 변경 이유와 검증 결과를 커밋과 코드 줄에 연결해 기록하는 도구입니다.",
    warrant: "법무부, 공수처, 검찰, 경찰, 해양경찰의 전자영장 업무를 잇는 시스템입니다.",
    defense: "군사법원, 군검찰, 군사경찰, 군교정의 업무를 잇는 시스템입니다.",
    webrtc: "강의를 실시간으로 보고 지난 구간을 다시 볼 수 있는 서비스입니다.",
}

// 상세 첫 화면의 확인한 범위. 어디까지 확인했는지와 확인하지 않은 범위를 문장으로 쓴다.
export const caseResults = {
    baton: "Core와 6개 서비스를 구현하고 서비스별 통합 테스트로 확인했습니다. Core와 BRIEF, CAL, ROUND의 연동은 로컬에서만 확인했습니다. 배포 환경에서 6개 서비스를 모두 연결하는 것은 아직 확인하지 않았습니다.",
    happygallery:
        "주문, 예약, 스마트스토어 연동을 구현하고 Testcontainers 통합 테스트와 E2E로 확인했습니다. main에 병합하면 GitHub Actions가 검사한 이미지를 k3s에 롤링 배포합니다. 네이버, Toss, NHN 실제 계정 연동은 아직 확인하지 않았습니다.",
    "youth-policy-mate":
        "조건 질문, 관심 정책 일정과 알림을 구현하고 PostgreSQL 통합 테스트로 확인했습니다. 공개 main 2065081에서 웹과 서버 CI가 통과했습니다. OAuth, OpenAI, Resend 운영 연동은 아직 확인하지 않았습니다.",
    "hope-commit":
        "커밋 AI 리뷰 HTML(Commit Diff)을 구현해 Hope Commit v5.0.2(main 9d8392d)로 공개 릴리스했고, GitHub Actions에서 자동화 테스트 343개가 통과했습니다.",
    "intent-trace":
        "서버, 웹 조회와 IntelliJ, Zed 연동을 구현했습니다. 공개 main 4be09d2의 GitHub Actions 검증과 서버 테스트 264개가 통과했습니다. v0.7.0 실행 JAR과 IntelliJ 플러그인을 공개 릴리스했습니다. 실제 PR Check Run 게시와 서버 운영 배포는 아직 확인하지 않았습니다.",
    warrant: `기관별 요청 변환과 Spring Batch를 구현했습니다. 망 분리 구간 연계와, PDF 완료 응답이 요청 상태 저장보다 먼저 도착하는 경우를 시나리오로 확인했습니다. 성능 테스트 환경에서는 ${warrantPerformanceSummary}`,
    defense:
        "수용자 자료 검증 배치, CSRF 토큰 검증, Presigned URL 기반 대용량 파일 업로드를 폐쇄망에서 확인했습니다. 운영 중 멈춘 배치는 중단 단계를 찾은 뒤 해당 기관 배치만 다시 실행했습니다.",
    webrtc: "HLS 변환 서버와 React 화면을 만들고 팀 시연에서 실시간 시청과 지난 구간 재생을 확인했습니다. 팀 시연 환경에서 HLS 재생 지연을 약 35초에서 약 17초로 줄였습니다.",
}

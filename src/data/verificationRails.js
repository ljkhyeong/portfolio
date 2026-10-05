import { warrantPerformance } from "./warrantEvidence"

// 프로젝트 상세 상단의 검증 단계. 각 단계는 projects.js의 상태·근거와 caseHighlights의 확인 결과에서 옮겼다.
// status: verified(확인됨), limited(로컬·시연·모의 응답 등 제한된 범위에서 확인), unverified(미검증)
export const verificationStatusLabels = {
    verified: "확인됨",
    limited: "제한된 범위에서 확인",
    unverified: "미검증",
}

export const verificationRails = {
    warrant: [
        { label: "구현", status: "verified", note: "기관별 요청 변환과 Spring Batch" },
        {
            label: "시나리오 확인",
            status: "verified",
            note: "독립망 연계와 PDF 응답 순서 역전 처리",
        },
        {
            label: "성능 테스트",
            status: "verified",
            note: `${warrantPerformance.load}, ${warrantPerformance.duration} 전량 처리`,
        },
    ],
    defense: [
        {
            label: "구현",
            status: "verified",
            note: "수용자 자료 검증 배치, CSRF 차단, 직접 업로드",
        },
        { label: "폐쇄망 확인", status: "verified", note: "토큰 누락·불일치 요청과 업로드 경로" },
        { label: "운영 대응", status: "verified", note: "중단 단계 확인 후 필요한 배치만 재실행" },
    ],
    baton: [
        { label: "구현", status: "verified", note: "Core와 6개 서비스" },
        { label: "자동화 테스트", status: "verified", note: "서비스별 통합 테스트" },
        { label: "서비스 연동", status: "limited", note: "Core–BRIEF·CAL·ROUND 로컬 확인" },
        { label: "공개 환경 연동", status: "unverified", note: "공개 환경 전체 연결" },
    ],
    happygallery: [
        { label: "구현", status: "verified", note: "주문·예약·스마트스토어 운영" },
        { label: "자동화 테스트", status: "verified", note: "Testcontainers 통합 테스트와 E2E" },
        { label: "공개 배포", status: "verified", note: "공개 서비스 HTTPS 접속 확인" },
        { label: "외부 계정 연동", status: "unverified", note: "네이버·Toss·NHN 실제 계정" },
    ],
    "youth-policy-mate": [
        { label: "구현", status: "verified", note: "조건 질문, 관심 정책 일정과 알림" },
        { label: "자동화 테스트", status: "verified", note: "PostgreSQL 통합 테스트" },
        {
            label: "공개 반영",
            status: "verified",
            note: "조건 버전 관리와 AI 초안 검토는 공개 main",
        },
        { label: "외부 연동", status: "unverified", note: "OAuth·OpenAI·Resend 운영 연동" },
    ],
    "hope-commit": [
        { label: "구현", status: "verified", note: "로컬 커밋 HTML 리뷰(Commit Diff)" },
        { label: "자동화 테스트", status: "verified", note: "자동화 테스트 343개 통과" },
        { label: "공개 릴리스", status: "verified", note: "v5.0.2" },
    ],
    "intent-trace": [
        { label: "구현", status: "verified", note: "서버, 웹 조회와 IntelliJ·Zed 연동" },
        { label: "자동화 테스트", status: "verified", note: "서버 테스트 180개 통과" },
        { label: "공개 릴리스", status: "verified", note: "v0.7.0 실행 JAR과 IntelliJ 플러그인" },
        {
            label: "GitHub 게시·공개 운영",
            status: "unverified",
            note: "실제 GitHub 게시와 공개 운영",
        },
    ],
    webrtc: [
        { label: "구현", status: "verified", note: "HLS 변환 서버와 React 화면" },
        { label: "팀 시연", status: "verified", note: "6인 팀 시연 완료" },
        { label: "지연 측정", status: "limited", note: "시연 환경에서 약 35초 → 약 17초" },
    ],
}

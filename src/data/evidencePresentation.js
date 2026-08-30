const evidencePresentation = {
    "Core 인수인계 상태 전이 및 중복 교대 차단": { methodLabel: "통합 테스트" },
    "GO 링크 중복 생성 방지": { methodLabel: "통합 테스트" },
    "WATCH 안전한 URL 점검": { methodLabel: "자동화 테스트" },
    "RELAY DB 저장 후 RabbitMQ 재전달 중복 방지": { methodLabel: "Compose 검증" },
    "BRIEF 운영 신호 반영과 발행 보고서 수정 방지": {
        methodLabel: "통합 테스트 및 Core 연동",
        scopeNote: "공개 2.0.0-rc.2 이벤트 경로용 Caddy, 공인 DNS와 원격 배포는 미검증",
    },
    "CAL 일정 JSON 수신과 캘린더 구독": {
        methodLabel: "통합 테스트",
        scopeNote: "실제 운영 활성화와 공개 배포 전",
    },
    "ROUND 참여권 검증과 브라우저 연결": {
        methodLabel: "CI 확인",
        scopeNote:
            "실제 Cloudflare TURN 중계 전용 연결, Safari 실기기, 외부망과 6명 장시간 접속은 미검증",
    },
    "AWS 운영 이력": { methodLabel: "운영 내역", scopeNote: "실운영 후 비용 문제로 종료" },
    "8회권 환불, 미래 예약과 잔여 횟수 일치": { methodLabel: "통합 테스트" },
    "OpenAPI 문서화 범위": { methodLabel: "산출물 집계" },
    "백엔드 테스트 산출물 집계": {
        methodLabel: "기존 테스트 산출물",
        scopeNote: "이번 갱신에서 전체 테스트나 CI를 다시 통과시켰다는 뜻은 아님",
    },
    "스마트스토어 주문과 공유 재고 반영": {
        methodLabel: "코드 대조",
        scopeNote: "네이버 실제 자격 증명을 사용한 운영 연동은 미검증",
    },
    "Toss 결제 대사와 NHN 알림 최종 결과": {
        methodLabel: "코드 대조",
        scopeNote: "Toss 및 NHN 실제 자격 증명 연동은 미검증",
    },
    "공개 페이지는 서버 렌더링하고 회원 및 결제 화면은 검색 제외": {
        methodLabel: "HTTP 응답 확인",
        scopeNote: "공개 main 반영 전",
    },
    "주문제작 옵션, 가격과 재고 일치": {
        methodLabel: "통합 시나리오",
        scopeNote: "공개 main 반영 전",
    },
    "외부 배송조회 등록 실패 재처리와 서명된 배송 상태 수신": {
        methodLabel: "통합 테스트",
        scopeNote: "실제 Delivery API 운영 자격 증명 검증 전",
    },
    "입력한 커밋과 비교 기준 확정": { methodLabel: "코드 수집 테스트" },
    "비공개 파일과 토큰 제외 및 리뷰 근거 검증": { methodLabel: "자동화 테스트" },
    "검증이 끝난 결과만 새 HTML로 저장": { methodLabel: "전체 처리 테스트" },
    "저장소 자동화 테스트": { methodLabel: "CI 확인" },
    "작성자 확인 뒤 변경되지 않은 코드만 공개": { methodLabel: "통합 테스트" },
    "요청 및 GitHub 게시 중복 처리 방지": { methodLabel: "통합 테스트" },
    "GitHub 사용자와 저장소 권한 확인": {
        methodLabel: "인증 테스트",
        scopeNote: "서버 재시작 시 세션 소멸, 실제 공개 운영 미검증",
    },
    "IntelliJ 현재 줄의 공개 기록 조회": {
        methodLabel: "단위 테스트 및 구조 검증",
        scopeNote: "Marketplace 배포 및 실사용 운영 미검증",
    },
    "공개 main 자동화 검증": { methodLabel: "CI 확인" },
    "실행 JAR과 체크섬 공개": {
        methodLabel: "릴리스 확인",
        scopeNote: "공개 릴리스 v0.6.0 기준, v0.7.0 릴리스는 미확인",
    },
    "해양경찰 KICS 독립망 연계": { methodLabel: "업무 확인" },
    "누적 전송 상태 조회": { methodLabel: "업무 확인" },
    "PDF 완료 응답 순서 역전 처리": { methodLabel: "순서 역전 시나리오" },
    "기관별 수용자 자료 반영 배치의 중단 단계 확인 및 재실행": { methodLabel: "운영 로그 대조" },
    "WebSquare 상태 변경 요청의 CSRF 차단": { methodLabel: "요청 차단 확인" },
    "대용량 파일 직접 업로드": { methodLabel: "전송 경로 확인" },
    "WebRTC 실시간 재생과 RTP 출력의 HLS 다시보기 변환": { methodLabel: "코드 검토 및 팀 시연" },
    "HLS 다시보기 재생 지연": {
        methodLabel: "팀 시연 비교",
        scopeNote: "네트워크와 기기를 통제한 정밀 벤치마크는 아님",
    },
}

export const getEvidencePresentation = (proof) =>
    evidencePresentation[proof.item] ?? { methodLabel: "확인 방법" }

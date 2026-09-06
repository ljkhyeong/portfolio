const evidencePresentation = {
    "Core 인수인계 상태 전이 및 중복 교대 차단": {
        methodLabel: "통합 테스트",
        resultSummary:
            "준비 → 전달 → 수락 순서 적용, 수락 전 취소 허용, 역할별 진행 중 인수인계 1건 유지",
    },
    "GO 링크 중복 생성 방지": { methodLabel: "통합 테스트" },
    "WATCH 안전한 URL 점검": {
        methodLabel: "자동화 테스트",
        resultSummary:
            "사설망 차단·응답 본문 미수신, 현재 URL 버전 결과만 저장, 기한이 지난 점검 재실행",
    },
    "RELAY DB 저장 후 RabbitMQ 재전달 중복 방지": {
        methodLabel: "Compose 검증",
        resultSummary: "재전달 시 수신 이력 1건 유지, RabbitMQ ACK 전송, DLQ 미전송",
    },
    "BRIEF 점검 상태 반영과 발행 보고서 수정 방지": {
        methodLabel: "통합 테스트 및 Core 연동",
        resultSummary: "Core 신호 반영, 저장 이벤트로 점검 목록 재생성, 같은 주간 보고서 1건 저장",
        scopeNote:
            "최신 로컬 main과 실제 Core 및 내부 Caddy HTTPS 기준, 공인 DNS와 원격 배포는 미검증",
    },
    "CAL 일정 JSON 수신과 캘린더 구독": {
        methodLabel: "통합 테스트",
        scopeNote: "실제 운영 활성화와 공개 배포 전",
    },
    "ROUND 입장 토큰 검증과 브라우저 연결": {
        methodLabel: "CI 확인",
        resultSummary:
            "Chromium 카메라 및 마이크 제어와 화면 공유 테스트, WebKit 호환성, Core 연동과 배포 검사 통과",
        scopeNote:
            "실제 Cloudflare TURN 중계 전용 연결, Safari 실기기, 외부망과 6명 장시간 접속은 미검증",
    },
    "AWS 운영 이력": { methodLabel: "운영 내역", scopeNote: "실운영 후 비용 문제로 종료" },
    "8회권 환불, 미래 예약과 잔여 횟수 일치": { methodLabel: "통합 테스트" },
    "OpenAPI 문서화 범위": { methodLabel: "산출물 집계" },
    "스마트스토어 주문과 공유 재고 반영": {
        methodLabel: "코드 대조",
        resultSummary:
            "주문별 수량 변경분 반영, 문의 조회 및 답변, 수집한 변경 주문으로 상태 갱신, 미처리 날짜부터 정산 재개",
        scopeNote: "네이버 실제 자격 증명을 사용한 운영 연동은 미검증",
    },
    "Toss 결제 대사와 NHN 알림 최종 결과": {
        methodLabel: "코드 대조",
        resultSummary: "결제 조회 대사와 NHN 접수 및 최종 수신 결과의 분리 저장 구현",
        scopeNote: "Toss 및 NHN 실제 자격 증명 연동은 미검증",
    },
    "공개 페이지는 서버 렌더링하고 회원 및 결제 화면은 검색 제외": {
        methodLabel: "HTTP 응답 확인",
        scopeNote: "초기 구현 검증 2e831500 기준, 실제 Node SSR 운영은 미검증",
    },
    "주문제작 옵션, 가격과 재고 일치": {
        methodLabel: "통합 시나리오",
        scopeNote: "초기 구현 검증 2e831500 기준",
    },
    "외부 배송조회 등록 실패 재처리와 서명된 배송 상태 수신": {
        methodLabel: "통합 테스트",
        scopeNote: "실제 Delivery API 운영 자격 증명 검증 전",
    },
    "입력한 커밋과 비교 기준 확정": {
        methodLabel: "코드 수집 테스트",
        resultSummary:
            "커밋 및 비교 기준 고정, 파일 이름 변경 정보와 추가 및 삭제 줄 수 보존, UTF-8이 아닌 경로 거절",
    },
    "비공개 파일과 토큰 제외 및 리뷰 근거 검증": { methodLabel: "자동화 테스트" },
    "검증이 끝난 결과만 새 HTML로 저장": { methodLabel: "전체 처리 테스트" },
    "저장소 자동화 테스트": { methodLabel: "CI 확인" },
    "작성자 확인 후 코드가 바뀌면 변경 기록 공개 차단": {
        methodLabel: "통합 테스트",
        resultSummary:
            "초안 → 작성자 확인 → 공개 → 대체 순서 적용, 확인 후 코드가 바뀌면 공개 차단",
    },
    "요청 및 GitHub 게시 중복 처리 방지": {
        methodLabel: "통합 테스트",
        resultSummary:
            "같은 요청 ID와 내용은 결과 재사용, 내용이 다르면 충돌 차단, 기존 Check Run 갱신",
    },
    "GitHub 사용자와 저장소 권한 확인": {
        methodLabel: "인증 테스트",
        resultSummary: "GitHub 읽기와 쓰기 권한 분리, 인증 토큰과 세션은 메모리에만 보관",
        scopeNote: "서버 재시작 시 세션 소멸, 실제 공개 운영 미검증",
    },
    "IntelliJ 현재 줄 및 변경 기록 조회": {
        methodLabel: "자동화 테스트 및 로컬 연동",
        resultSummary: "현재 줄과 팀 공개 및 내 비공개 기록 조회, 세션 토큰은 PasswordSafe에 보관",
        scopeNote:
            "일부 상태 필터와 커밋 없는 기록의 이동 버튼은 수동 검증 미완료, Marketplace 배포 및 공개 운영 미검증",
    },
    "공개 main 자동화 검증": {
        methodLabel: "CI 확인",
        resultSummary:
            "공개 main CI 통과, 서버 테스트 126개와 IntelliJ 테스트 32개 통과, PostgreSQL 필요 테스트 4개는 조건부 제외",
    },
    "실행 JAR과 체크섬 공개": {
        methodLabel: "릴리스 확인",
        scopeNote: "공개 릴리스 v0.7.0 기준",
    },
    "해양경찰 KICS 독립망 연계": {
        methodLabel: "업무 확인",
        resultSummary: "기관별 규격 변환과 요청 전달, 제출 자료의 KICS 반영 단계 확인",
    },
    "누적 전송 상태 조회": {
        methodLabel: "업무 확인",
        resultSummary:
            "신규 화면은 마지막 전송 ID 다음부터 조회, 기존 화면은 번호 이동을 유지하며 대상 키 먼저 조회",
    },
    "PDF 완료 응답 순서 역전 처리": { methodLabel: "순서 역전 시나리오" },
    "기관별 수용자 자료 반영 배치의 중단 단계 확인 및 재실행": {
        methodLabel: "운영 로그 대조",
        resultSummary: "실행 이력, 로그와 DB로 중단 단계를 찾고 재실행 후 군교정 DB 반영 확인",
    },
    "WebSquare 상태 변경 요청의 CSRF 차단": { methodLabel: "요청 차단 확인" },
    "대용량 파일 직접 업로드": { methodLabel: "전송 경로 확인" },
    "WebRTC 실시간 재생과 RTP 출력의 HLS 다시보기 변환": {
        methodLabel: "코드 검토 및 팀 시연",
        resultSummary: "현재 강의는 WebRTC로, 지난 구간은 HLS로 재생 확인",
    },
    "HLS 다시보기 재생 지연": {
        methodLabel: "팀 시연 비교",
        scopeNote: "네트워크와 기기를 통제한 정밀 벤치마크는 아님",
    },
}

export const getEvidencePresentation = (proof) =>
    evidencePresentation[proof.item] ?? { methodLabel: "확인 방법" }

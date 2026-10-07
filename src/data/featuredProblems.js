// 문제 해결의 대표 사례. 처리 순서와, 사례 제목 아래에 둘 한 문장(problem)만 둔다.
// 문제, 방법, 확인, 남은 일은 projects.js의 문제 데이터가 담는다.
const featuredProblems = {
    baton: {
        problemNumber: "02",
        problem: "인수인계만 수락되고 담당자가 바뀌지 않으면 역할 정보가 어긋납니다.",
        steps: [
            { title: "인수인계 준비", description: "다음 담당자와 담당 기간 고정" },
            { title: "전달 전 확인", description: "누락 항목 검사" },
            { title: "수락 및 담당자 변경", description: "담당자와 기간을 함께 반영" },
        ],
    },
    happygallery: {
        problemNumber: "02",
        problem: "결제사 응답을 잃어도 승인과 환불을 다시 실행해서는 안 됩니다.",
        steps: [
            { title: "호출 전 상태 저장", description: "결제 orderId와 환불 UUID 유지" },
            { title: "결제사 호출", description: "DB 트랜잭션 밖에서 실행" },
            { title: "결과 반영 또는 재조회", description: "응답 유실 시 같은 키로 결과 확인" },
        ],
    },
    "youth-policy-mate": {
        problemNumber: "01",
        problem:
            "조건을 확인할 수 없을 때도 신청 가능 또는 불가로 단정하면 잘못된 정책 안내가 됩니다.",
        steps: [
            { title: "정책 조건 확인", description: "조건 정의, 적용 범위, 기준일 확인" },
            { title: "사용자 답변 비교", description: "조건별 충족, 불충족과 미확인 판단" },
            { title: "근거와 함께 표시", description: "3단계 결과와 추가 확인 이유 제공" },
        ],
    },
    "hope-commit": {
        problemNumber: "03",
        problem: "실제 변경 코드에 없는 설명이나 지적이 리뷰에 섞일 수 있습니다.",
        steps: [
            { title: "이전 대화 없이 코드 분석", description: "AI 리뷰 설명과 지적 생성" },
            { title: "파일과 줄 연결", description: "실제 수집한 코드 범위인지 검사" },
            { title: "형식 및 길이 검증", description: "잘못된 근거와 형식 거절" },
        ],
    },
    "intent-trace": {
        problemNumber: "02",
        problem: "코드가 바뀌면 기존 변경 기록이 어느 상태를 설명하는지 불분명해집니다.",
        steps: [
            { title: "코드 상태 기록", description: "커밋 ID, 파일, 줄 범위와 해시 저장" },
            { title: "작성자 확인", description: "해당 코드의 기록 확정" },
            { title: "공개 전 변경 확인", description: "확인 뒤 코드가 바뀌면 공개 차단" },
        ],
    },
    warrant: {
        problemNumber: "04",
        problem:
            "서버 이중화로 프로세스 내부 잠금만으로는 같은 연계 작업의 중복 실행을 막을 수 없었습니다.",
        steps: [
            {
                title: "처리 대상 선점",
                description: "잠긴 행은 건너뛰고 처리대상(N)을 처리 중(P)으로 변경",
            },
            { title: "외부 API 호출", description: "DB 트랜잭션 밖에서 실행" },
            {
                title: "완료 또는 재처리",
                description: "완료 시 상태 초기화, 오래된 P는 N으로 복구",
            },
        ],
    },
    defense: {
        problemNumber: "01",
        problem:
            "기관별 자료 형식과 전달 시점이 달랐고, 연계가 중단되면 후속 군교정 업무를 처리할 수 없었습니다.",
        steps: [
            { title: "기관 자료 수신", description: "수용자 인적정보와 영장정보 확인" },
            { title: "검증 및 DB 반영", description: "기관별 자료를 군교정 DB에 저장" },
            { title: "중단 시 재처리", description: "실행 이력, 로그와 DB를 대조" },
        ],
    },
    webrtc: {
        problemNumber: "02",
        problem: "HLS 다시보기 재생까지 약 35초가 걸려 방금 놓친 구간을 바로 보기 어려웠습니다.",
        steps: [
            { title: "RTP 영상 입력", description: "mediasoup 출력 수신" },
            { title: "HLS 영상 생성", description: "세그먼트 길이와 인코딩 설정 조정" },
            { title: "React 화면 재생", description: "입력부터 재생까지 걸린 시간 비교" },
        ],
    },
    "baton-go": {
        problemNumber: "03",
        problem: "동시 요청이나 응답 유실 뒤 재요청이 같은 링크를 여러 건 만들 수 있습니다.",
        steps: [
            { title: "처리 이력 조회", description: "UUID 해시로 같은 요청 검색" },
            { title: "요청 조건 비교", description: "기존 요청과 다르면 거절" },
            { title: "링크 반환", description: "같은 조건이면 기존 링크 재사용" },
        ],
    },
    "baton-watch": {
        problemNumber: "05",
        problem:
            "느린 URL 점검이 DB 연결을 오래 점유하고 늦은 결과가 최신 상태를 덮을 수 있습니다.",
        steps: [
            { title: "점검 시도 기록", description: "처리 서버와 기한 저장 후 DB 연결 반환" },
            { title: "URL 점검", description: "확인한 공인 IP로만 요청" },
            { title: "현재 결과만 저장", description: "만료된 시도와 과거 URL 결과 차단" },
        ],
    },
    "baton-relay": {
        problemNumber: "07",
        problem:
            "외부 전송 뒤 응답을 잃으면 성공 여부를 모른 채 같은 내용을 다시 보낼 수 있습니다.",
        steps: [
            { title: "전송 시도 저장", description: "UUID와 외부 서비스 멱등 키 고정" },
            { title: "외부 전송", description: "서버가 바뀌어도 시도 UUID와 멱등 키 유지" },
            { title: "전송 결과 수동 확정", description: "재전송 없이 기록 확인 후 상태 확정" },
        ],
    },
    "baton-brief": {
        problemNumber: "09",
        problem: "BRIEF가 조직 상태를 다시 판정하면 Core와 결과가 달라질 수 있습니다.",
        steps: [
            { title: "Core 점검 결과 수신", description: "담당자 공백 및 업무 지연 등 5개 상태" },
            { title: "이벤트 검증", description: "저장 값과 버전 번호 비교" },
            {
                title: "점검 항목 반영",
                description: "미해결(ACTIVE) 또는 해결됨(RESOLVED)으로 반영",
            },
        ],
    },
    "baton-cal": {
        problemNumber: "11",
        problem: "이전 버전의 일정이 늦게 도착하면 최신 캘린더가 이전 상태로 돌아갈 수 있습니다.",
        steps: [
            { title: "일정 JSON 수신", description: "이벤트 ID와 일정 ID 확인" },
            { title: "버전 및 내용 비교", description: "이전 버전과 동일 버전의 내용 불일치 구분" },
            { title: "최신 일정 유지", description: "중복 일정과 과거 일정은 반영하지 않음" },
        ],
    },
    "baton-round": {
        problemNumber: "13",
        problem: "이전 연결의 SDP와 ICE가 늦게 도착하면 새 WebRTC 연결 상태가 손상될 수 있습니다.",
        steps: [
            { title: "새 연결 시도", description: "연결 순번 부여" },
            { title: "SDP 응답 및 ICE 후보 수신", description: "answer와 ICE의 연결 순번 확인" },
            { title: "현재 연결에만 반영", description: "이전 연결의 늦은 메시지 차단" },
        ],
    },
}

export default featuredProblems

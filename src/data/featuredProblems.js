const featuredProblems = {
    baton: {
        problemNumber: "02",
        problem: "인수인계만 수락되고 담당자가 바뀌지 않으면 역할 정보가 어긋납니다.",
        approach:
            "수락과 담당자 변경을 한 트랜잭션으로 묶고, 역할별 진행 중 인수인계를 1건으로 제한했습니다.",
        steps: [
            { title: "인수인계 준비", description: "다음 담당자와 담당 기간 고정" },
            { title: "전달 전 확인", description: "누락 항목 검사" },
            { title: "수락 및 담당자 변경", description: "담당자와 기간을 함께 반영" },
        ],
        evidenceLabel: "기능 테스트",
        result: "상태 전이, 취소, 중복 교대 차단과 전달 후 수정 제한을 확인했습니다.",
        limitation: "준비 또는 전달 상태에서 멈춘 인수인계를 정리하는 운영 절차는 필요합니다.",
    },
    happygallery: {
        problemNumber: "02",
        problem: "결제사 응답을 잃어도 승인과 환불을 다시 실행해서는 안 됩니다.",
        approach:
            "외부 호출 전후의 상태를 따로 저장하고, 응답이 없으면 같은 결제 및 환불 키로 처리 결과를 조회합니다.",
        steps: [
            { title: "호출 전 상태 저장", description: "결제 orderId와 환불 UUID 유지" },
            { title: "결제사 호출", description: "DB 트랜잭션 밖에서 실행" },
            { title: "결과 반영 또는 재조회", description: "응답 유실 시 같은 키로 결과 확인" },
        ],
        evidenceLabel: "통합 테스트",
        result: "실패 이력 보존, 같은 키의 결과 재사용, 늦은 응답 차단과 결과 재조회를 확인했습니다.",
        limitation: "실제 Toss Payments의 응답 지연과 장애를 포함한 연동 테스트는 남아 있습니다.",
    },
    "youth-policy-mate": {
        problemNumber: "01",
        problem:
            "조건을 확인할 수 없을 때도 신청 가능 또는 불가로 단정하면 잘못된 정책 안내가 됩니다.",
        approach:
            "연령, 거주, 취업과 소득을 항목별로 비교하고 가능, 불가, 추가 확인 필요로 집계합니다.",
        steps: [
            { title: "정책 조건 확인", description: "정의, 범위와 기준일 구분" },
            { title: "사용자 답변 비교", description: "조건별 충족, 불충족과 미확인 판단" },
            { title: "근거와 함께 표시", description: "3단계 결과와 추가 확인 이유 제공" },
        ],
        evidenceLabel: "서버 단위 테스트",
        result: "조건 충족 및 불충족, 정책 미해석, 사용자 정보 누락과 일부 구간 중첩을 구분했습니다.",
        limitation:
            "현재는 테스트 규칙과 답변만 사용하며 실제 정책 수집과 추천은 연결하지 않았습니다.",
    },
    "hope-commit": {
        problemNumber: "03",
        problem: "실제 변경 코드에 없는 설명이나 지적이 리뷰에 섞일 수 있습니다.",
        approach:
            "이전 대화를 전달하지 않은 별도 AI 분석 결과를 변경 파일과 줄에 연결하고, 수집 범위와 JSON 형식을 검사합니다.",
        steps: [
            { title: "이전 대화 없이 코드 분석", description: "변경에 대한 설명과 지적 수신" },
            { title: "파일과 줄 연결", description: "실제 수집한 코드 범위인지 검사" },
            { title: "형식 및 길이 검증", description: "잘못된 근거와 형식 거절" },
        ],
        evidenceLabel: "자동화 테스트",
        result: "수집하지 않은 파일과 줄, 잘못된 범위 및 형식과 과도하게 긴 설명을 거절했습니다.",
        limitation:
            "참조한 코드 줄이 유효하다는 것이 리뷰 판단의 정확성을 보장하지는 않습니다. 최종 판단은 사용자가 확인합니다.",
    },
    "intent-trace": {
        problemNumber: "02",
        problem: "코드가 바뀌면 기존 변경 기록이 어느 상태를 설명하는지 불분명해집니다.",
        approach:
            "기록을 전체 커밋 해시와 코드 위치에 묶고, 작성자 확인 뒤 코드가 바뀌면 공개를 차단합니다.",
        steps: [
            { title: "코드 상태 기록", description: "커밋 ID, 파일과 줄 범위 및 해시 저장" },
            { title: "작성자 확인", description: "해당 코드에 대한 기록 확정" },
            { title: "공개 전 변경 확인", description: "확인 뒤 코드가 바뀌면 공개 차단" },
        ],
        evidenceLabel: "자동화 테스트",
        result: "불완전한 커밋 ID, 다른 스냅샷과 잘못된 줄 범위 및 해시 형식을 거절했습니다.",
        limitation:
            "서버가 Git 객체를 직접 검증하지 않으므로 신뢰할 수 있는 클라이언트만 기록을 만들어야 합니다.",
    },
    warrant: {
        problemNumber: "03",
        problem:
            "요청 상태를 저장하기 전에 PDF 완료 응답이 도착하면 정상 결과가 누락될 수 있었습니다.",
        approach:
            "Spring Retry로 요청 상태를 다시 조회하고, 재시도 간격 증가와 무작위 지연을 적용했습니다.",
        steps: [
            { title: "PDF 완료 응답 수신", description: "요청 상태를 DB에서 조회" },
            { title: "요청 상태가 없으면 재조회", description: "간격을 늘려 요청 상태 재조회" },
            { title: "완료 결과 반영", description: "요청 상태가 확인되면 결과 저장" },
        ],
        evidenceLabel: "동작 확인",
        result: "요청 저장보다 먼저 도착한 PDF 완료 응답도 상태를 다시 조회한 뒤 반영되는 것을 확인했습니다.",
        limitation:
            "재시도 횟수는 제한했습니다. 계속 조회되지 않는 요청은 실패 기록과 운영자 확인이 필요합니다.",
    },
    defense: {
        problemNumber: "01",
        problem:
            "기관별 자료 형식과 전달 시점이 달랐고, 연계가 중단되면 후속 군교정 업무를 처리할 수 없었습니다.",
        approach:
            "기관별 자료를 검증해 DB에 반영하고, 중단 시 실행 이력과 로그로 실패 단계를 찾아 필요한 배치만 재처리했습니다.",
        steps: [
            { title: "기관 자료 수신", description: "수용자 인적정보와 영장정보 확인" },
            { title: "검증 및 DB 반영", description: "기관별 자료를 군교정 DB에 저장" },
            { title: "중단 시 재처리", description: "실행 이력, 로그와 DB를 대조" },
        ],
        evidenceLabel: "운영 확인",
        result: "중단 단계를 찾아 재처리한 뒤 인적정보와 영장정보가 군교정 DB에 반영되는 것까지 확인했습니다.",
        limitation: "폐쇄망 환경으로 일부 확인은 수동 절차와 기관 담당자 협업이 필요했습니다.",
    },
    webrtc: {
        problemNumber: "02",
        problem: "HLS 다시보기 재생까지 약 35초가 걸려 방금 놓친 구간을 바로 보기 어려웠습니다.",
        approach:
            "세그먼트 길이와 FFmpeg 인코딩 설정을 조정해 재생에 필요한 영상 데이터가 더 빨리 만들어지도록 했습니다.",
        steps: [
            { title: "RTP 영상 입력", description: "mediasoup 출력 수신" },
            { title: "HLS 영상 생성", description: "세그먼트 길이와 인코딩 설정 조정" },
            { title: "React 화면 재생", description: "입력부터 재생까지 걸린 시간 비교" },
        ],
        evidenceLabel: "팀 시연",
        result: "같은 시연 흐름에서 HLS 재생 지연을 약 35초에서 약 17초로 줄였습니다.",
        limitation: "시연 환경의 측정값이며 통제된 벤치마크는 아닙니다.",
    },
    "baton-go": {
        problemNumber: "03",
        problem: "동시 요청이나 응답 유실 뒤 재요청이 같은 링크를 여러 건 만들 수 있습니다.",
        approach: "UUID 해시로 처리 이력을 찾고 요청 조건까지 비교해 기존 결과를 재사용합니다.",
        steps: [
            { title: "처리 이력 조회", description: "UUID 해시로 같은 요청 검색" },
            { title: "요청 조건 비교", description: "기존 요청과 다르면 거절" },
            { title: "링크 반환", description: "같은 조건이면 기존 링크 재사용" },
        ],
        evidenceLabel: "통합 테스트",
        result: "같은 요청 8건을 동시에 보내도 링크와 처리 기록은 각각 1건만 생성됐습니다.",
        limitation: "기존 링크 유지를 위해 HMAC 키와 DB 백업을 함께 관리해야 합니다.",
    },
    "baton-watch": {
        problemNumber: "05",
        problem:
            "느린 URL 점검이 DB 연결을 오래 점유하고 늦은 결과가 최신 상태를 덮을 수 있습니다.",
        approach:
            "점검 시도와 처리 기한을 저장한 뒤 연결을 반환합니다. 이전 시도나 URL 버전의 결과는 저장하지 않습니다.",
        steps: [
            { title: "점검 시도 기록", description: "처리 서버와 기한 저장 후 DB 연결 반환" },
            { title: "URL 점검", description: "확인한 공인 IP로만 요청" },
            { title: "현재 결과만 저장", description: "만료된 시도와 과거 URL 결과 차단" },
        ],
        evidenceLabel: "자동화 테스트",
        result: "사설망 및 과도한 응답 차단, DNS 재조회 시 IP 변경과 서버 중단 및 늦은 결과 처리를 확인했습니다.",
        limitation: "처리 기한이 짧으면 중복 점검이 늘고, 길면 중단된 점검 재실행이 늦어집니다.",
    },
    "baton-relay": {
        problemNumber: "07",
        problem:
            "외부 전송 뒤 응답을 잃으면 성공 여부를 모른 채 같은 내용을 다시 보낼 수 있습니다.",
        approach:
            "호출 전에 시도 UUID와 중복 방지 키를 저장합니다. 결과 미확인은 재전송하지 않고 외부 기록을 확인해 상태만 확정합니다.",
        steps: [
            { title: "전송 시도 저장", description: "UUID와 외부 제공자 중복 방지 키 고정" },
            { title: "외부 전송", description: "서버가 바뀌어도 같은 시도 정보 유지" },
            { title: "전송 결과 수동 확정", description: "재전송 없이 기록 확인 후 상태 확정" },
        ],
        evidenceLabel: "장애 시나리오 확인",
        result: "서버 중단 뒤 시도 정보 유지, 이전 서버의 늦은 결과 차단과 운영자 상태 확정을 확인했습니다.",
        limitation:
            "중복 전송 방지를 우선하므로 결과 미확인 건은 외부 기록 확인과 운영자 수동 확정이 필요합니다.",
    },
    "baton-brief": {
        problemNumber: "09",
        problem: "BRIEF가 조직 상태를 다시 판정하면 Core와 결과가 달라질 수 있습니다.",
        approach:
            "Core가 판정한 5개 신호를 그대로 반영하고, 이벤트 ID와 개정 번호로 중복 및 과거 이벤트를 차단합니다.",
        steps: [
            { title: "Core 신호 수신", description: "담당자 공백 및 업무 지연 등 5개 상태" },
            { title: "이벤트 검증", description: "ID, 해시와 개정 번호 비교" },
            { title: "점검 항목 반영", description: "ACTIVE 또는 RESOLVED로 반영" },
        ],
        evidenceLabel: "로컬 연동 확인",
        result: "2.0.0-rc.1 실제 Core와 로컬 HTTP 및 내부 서비스용 Caddy HTTPS 연동을 확인했습니다.",
        limitation:
            "BRIEF의 최신 2.0.0-rc.4 릴리스 후보 JSON 규격은 Core에 아직 반영하지 않았고, 공인 DNS와 원격 배포는 미검증입니다.",
    },
    "baton-cal": {
        problemNumber: "11",
        problem: "과거 개정의 일정이 늦게 도착하면 최신 캘린더가 이전 상태로 돌아갈 수 있습니다.",
        approach:
            "이벤트와 일정의 ID, 개정 번호 및 내용 해시를 비교해 중복과 과거 일정 반영을 막습니다.",
        steps: [
            { title: "일정 JSON 수신", description: "이벤트 ID와 일정 ID 확인" },
            { title: "개정 및 내용 비교", description: "낮은 개정과 내용 충돌 구분" },
            { title: "최신 일정 유지", description: "중복 및 과거 일정은 반영하지 않음" },
        ],
        evidenceLabel: "PostgreSQL 통합 테스트",
        result: "재전송, 낮은 개정과 같은 개정의 내용 충돌 및 트랜잭션 실패 후 재시도를 확인했습니다.",
        limitation:
            "비동기 연동으로 반영이 지연될 수 있습니다. 운영 활성화 전 자격 증명 교체와 최신 일정 재전송 검증이 필요합니다.",
    },
    "baton-round": {
        problemNumber: "13",
        problem: "이전 연결의 SDP와 ICE가 늦게 도착하면 새 WebRTC 연결 상태가 손상될 수 있습니다.",
        approach:
            "연결마다 순번을 부여하고 answer와 ICE의 순번을 비교해 이전 연결의 메시지를 버립니다.",
        steps: [
            { title: "새 연결 시도", description: "연결 순번 부여" },
            { title: "응답 및 후보 수신", description: "answer와 ICE의 연결 순번 확인" },
            { title: "현재 연결에만 반영", description: "이전 연결의 늦은 메시지 차단" },
        ],
        evidenceLabel: "연결 모듈 자동화 테스트",
        result: "연결 중단과 재시작 후 이전 순번의 answer 및 ICE를 전달해도 현재 연결의 메시지만 반영됐습니다.",
        limitation:
            "WebKit CI 호환성은 보완했지만 Safari 실기기와 외부망 및 6명 장시간 접속은 미검증입니다.",
    },
}

export default featuredProblems

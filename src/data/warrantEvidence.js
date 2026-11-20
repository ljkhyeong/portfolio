// 이용 규모에 따른 부하 조건은 사용자 제공 설명(2026-11-20) 기준이다. 사용자 수로 환산하지 않는다.
export const warrantPerformance = {
    basis: "해양경찰 KICS 이용 규모",
    load: "100 RPS·300 TPS",
    duration: "1시간",
    result: "커넥션 풀 고갈, 오류, DB 잠금 문제 없이 전량 처리",
}

export const warrantPerformanceSummary =
    `${warrantPerformance.basis}를 기준으로 설정한 ${warrantPerformance.load} 부하로 ` +
    `${warrantPerformance.duration} 테스트해 ` +
    `${warrantPerformance.result}했습니다.`

// 개통일은 공개 보도, 운영 여부는 사용자 확인(2026-10-11) 기준이다. 처리량 같은 운영 지표는 근거가 없어 쓰지 않는다.
export const warrantOperation = {
    openedOn: "2026년 9월 28일",
}

export const warrantOperationSummary = `시스템은 ${warrantOperation.openedOn} 개통해 운영 중입니다.`

// 추가 연계의 개발 상태와 일정은 사용자 확인(2026-11-18) 기준이다.
export const warrantTelecom = {
    plannedOpening: "2026년 11월 27일",
    implementation:
        "업무 DB의 요청정보로 XML을 생성하고, 회신 XML을 파싱해 업무 테이블에 반영했습니다. 회신 파일의 압축 해제와 업로드도 구현했습니다.",
}

export const warrantTelecomStatus = `별정통신사 연계는 개발을 완료하고 통신사와 테스트 중입니다. ${warrantTelecom.plannedOpening} 오픈 예정입니다.`

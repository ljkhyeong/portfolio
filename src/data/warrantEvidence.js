export const warrantPerformance = {
    load: "100 RPS·300 TPS",
    duration: "1시간",
    result: "커넥션 풀 고갈, 오류, DB 잠금 문제 없이 전량 처리",
}

export const warrantPerformanceSummary =
    `${warrantPerformance.load} 부하로 ${warrantPerformance.duration} 테스트해 ` +
    `${warrantPerformance.result}했습니다.`

// 개통일은 공개 보도, 운영 여부는 사용자 확인(2026-10-11) 기준이다. 처리량 같은 운영 지표는 근거가 없어 쓰지 않는다.
export const warrantOperation = {
    openedOn: "2026년 9월 28일",
}

export const warrantOperationSummary = `시스템은 ${warrantOperation.openedOn} 개통해 운영 중입니다.`

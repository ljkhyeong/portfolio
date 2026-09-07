export const warrantPerformance = {
    load: "100 RPS·300 TPS",
    duration: "1시간",
    result: "커넥션 풀 고갈, 오류, DB 잠금 문제 없이 전량 처리",
}

export const warrantPerformanceSummary =
    `${warrantPerformance.load} 부하로 ${warrantPerformance.duration} 테스트해 ` +
    `${warrantPerformance.result}했습니다.`

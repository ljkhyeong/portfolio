// 팀 시연에서 측정한 근삿값이다. 운영 환경의 응답 시간과 구분한다.
const beforeSeconds = 35
const afterSeconds = 17
const reductionPercent = Math.round(((beforeSeconds - afterSeconds) / beforeSeconds) * 100)

export const hlsImpact = `HLS 재생 지연 약 ${reductionPercent}% 감소`
export const hlsTiming = `약 ${beforeSeconds}초 → 약 ${afterSeconds}초`
export const hlsResult = `${hlsImpact}(${hlsTiming}, 팀 시연 환경)`

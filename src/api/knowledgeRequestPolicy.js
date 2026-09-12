export const SEARCH_TIMEOUT_MS = 90_000
export const ANSWER_TIMEOUT_MS = 180_000

export const getRetryAfterSeconds = (response, now = Date.now()) => {
    if (![429, 503].includes(response.status)) return null

    const value = response.headers?.get("Retry-After")?.trim()
    if (!value) return null

    if (/^\d+$/.test(value)) {
        const seconds = Number(value)
        return Number.isSafeInteger(seconds) ? seconds : null
    }

    // Date.parse가 음수·소수·임의 문자열을 날짜로 해석하지 않도록 표준 HTTP 날짜만 받는다.
    const timestamp = Date.parse(value)
    if (!Number.isFinite(timestamp) || new Date(timestamp).toUTCString() !== value) return null

    return Math.max(0, Math.ceil((timestamp - now) / 1000))
}

import { getRetryAfterSeconds } from "./knowledgeRequestPolicy"

const now = Date.parse("Sat, 12 Sep 2026 03:00:00 GMT")
const response = (status, value) => ({
    status,
    headers: new Headers(value === undefined ? {} : { "Retry-After": value }),
})

test.each([429, 503])("HTTP %i의 초 단위 대기 시간을 읽는다", (status) => {
    expect(getRetryAfterSeconds(response(status, " 60 "), now)).toBe(60)
})

test("HTTP 날짜의 남은 초를 올림하고 지난 시간은 0으로 처리한다", () => {
    const headers = response(429, "Sat, 12 Sep 2026 03:00:30 GMT")
    expect(getRetryAfterSeconds(headers, now + 500)).toBe(30)
    expect(getRetryAfterSeconds(headers, now + 60_000)).toBe(0)
    expect(getRetryAfterSeconds(response(429, "0"), now)).toBe(0)
})

test.each([
    undefined,
    "",
    "later",
    "-1",
    "1.5",
    "1e3",
    "60, 120",
    "9007199254740992",
    "2026-09-12",
    "Sat, 31 Feb 2026 03:00:00 GMT",
])("누락되거나 잘못된 대기 시간(%s)은 무시한다", (value) => {
    expect(getRetryAfterSeconds(response(429, value), now)).toBeNull()
})

test.each([200, 400, 401, 500])("HTTP %i의 대기 시간은 사용하지 않는다", (status) => {
    expect(getRetryAfterSeconds(response(status, "60"), now)).toBeNull()
})

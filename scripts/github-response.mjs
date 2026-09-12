const unsignedSeconds = (value) => {
    const text = value?.trim()
    if (!text || !/^\d+$/.test(text)) return null
    const number = Number(text)
    return Number.isSafeInteger(number) ? number : null
}

export const githubResponseError = (response, message, now = Date.now()) => {
    let waitSeconds = null
    if ([403, 429, 503].includes(response.status)) {
        waitSeconds = unsignedSeconds(response.headers?.get("Retry-After"))
        if (
            [403, 429].includes(response.status) &&
            response.headers?.get("X-RateLimit-Remaining")?.trim() === "0"
        ) {
            const reset = unsignedSeconds(response.headers?.get("X-RateLimit-Reset"))
            if (reset !== null && reset > now / 1000) {
                waitSeconds = Math.max(waitSeconds ?? 0, Math.ceil(reset - now / 1000))
            }
        }
    }
    const hint = waitSeconds > 0 ? ` — ${waitSeconds}초 후 다시 실행하세요.` : ""
    return new Error(`${message}: HTTP ${response.status}${hint}`)
}

export async function cancelGitHubBody(body) {
    try {
        await body?.cancel()
    } catch {
        // 본문 정리 실패가 HTTP 오류나 본문 수신 실패 원인을 덮어쓰지 않게 한다.
    }
}

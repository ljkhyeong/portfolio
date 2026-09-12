import { useEffect, useRef, useState } from "react"

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script"
const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
const TURNSTILE_LOAD_TIMEOUT_MS = 20_000

export const turnstileSiteKey = (import.meta.env.VITE_KNOWLEDGE_TURNSTILE_SITE_KEY ?? "").trim()
export const turnstileAction = "knowledge_answer"

let turnstileLoadPromise

const isTurnstileReady = () =>
    ["render", "reset", "remove"].every(
        (method) => typeof window.turnstile?.[method] === "function",
    )

const loadTurnstile = () => {
    if (isTurnstileReady()) {
        return Promise.resolve(window.turnstile)
    }
    if (turnstileLoadPromise) {
        return turnstileLoadPromise
    }

    turnstileLoadPromise = new Promise((resolve, reject) => {
        const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID)
        const script = existingScript ?? document.createElement("script")
        const handleLoad = () => {
            if (isTurnstileReady()) {
                cleanup()
                resolve(window.turnstile)
                return
            }
            fail("Turnstile API를 찾을 수 없습니다.")
        }
        const handleError = () => fail("Turnstile API를 불러오지 못했습니다.")
        const fail = (message) => {
            cleanup()
            script.remove()
            reject(new Error(message))
        }
        const cleanup = () => {
            clearTimeout(timeout)
            script.removeEventListener("load", handleLoad)
            script.removeEventListener("error", handleError)
        }
        const timeout = setTimeout(
            () => fail("Turnstile API 로딩 시간이 초과됐습니다."),
            TURNSTILE_LOAD_TIMEOUT_MS,
        )

        script.addEventListener("load", handleLoad)
        script.addEventListener("error", handleError)
        if (!existingScript) {
            script.id = TURNSTILE_SCRIPT_ID
            script.src = TURNSTILE_SCRIPT_URL
            script.async = true
            script.defer = true
            document.head.append(script)
        }
    }).finally(() => {
        turnstileLoadPromise = undefined
    })

    return turnstileLoadPromise
}

const TurnstileWidget = ({
    siteKey = turnstileSiteKey,
    action = turnstileAction,
    resetKey = 0,
    onTokenChange,
}) => {
    const container = useRef(null)
    const widgetId = useRef(null)
    const onTokenChangeRef = useRef(onTokenChange)
    const [retryKey, setRetryKey] = useState(0)
    const [status, setStatus] = useState("loading")

    useEffect(() => {
        onTokenChangeRef.current = onTokenChange
    }, [onTokenChange])

    useEffect(() => {
        if (!siteKey) {
            return undefined
        }

        let active = true
        setStatus("loading")
        onTokenChangeRef.current("")

        loadTurnstile()
            .then((turnstile) => {
                if (!active || !container.current) return
                widgetId.current = turnstile.render(container.current, {
                    sitekey: siteKey,
                    action,
                    appearance: "interaction-only",
                    theme: "auto",
                    callback: (token) => {
                        if (!active) return
                        setStatus("verified")
                        onTokenChangeRef.current(token)
                    },
                    "expired-callback": () => {
                        if (!active) return
                        setStatus("expired")
                        onTokenChangeRef.current("")
                    },
                    "timeout-callback": () => {
                        if (!active) return
                        setStatus("expired")
                        onTokenChangeRef.current("")
                    },
                    "error-callback": () => {
                        if (!active) return
                        setStatus("error")
                        onTokenChangeRef.current("")
                    },
                })
            })
            .catch(() => {
                if (active) setStatus("error")
            })

        return () => {
            active = false
            if (widgetId.current !== null && window.turnstile) {
                window.turnstile.remove(widgetId.current)
            }
            widgetId.current = null
        }
    }, [action, retryKey, siteKey])

    useEffect(() => {
        if (!siteKey || resetKey === 0 || widgetId.current === null || !window.turnstile) {
            return
        }
        onTokenChangeRef.current("")
        setStatus("loading")
        window.turnstile.reset(widgetId.current)
    }, [resetKey, siteKey])

    if (!siteKey) {
        return null
    }

    return (
        <div className="knowledge-verification">
            <div ref={container} />
            {status === "loading" && <p role="status">자동 요청 방지 확인을 완료해 주세요.</p>}
            {status === "expired" && (
                <p role="status">확인 시간이 만료되었습니다. 다시 확인해 주세요.</p>
            )}
            {status === "error" && (
                <div role="alert">
                    <p>자동 요청 방지 확인을 불러오지 못했습니다.</p>
                    <button type="button" onClick={() => setRetryKey((key) => key + 1)}>
                        확인 다시 불러오기
                    </button>
                </div>
            )}
        </div>
    )
}

export default TurnstileWidget

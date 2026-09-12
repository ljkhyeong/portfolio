import { useEffect, useRef, useState } from "react"

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script"
const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

export const turnstileSiteKey = (import.meta.env.VITE_KNOWLEDGE_TURNSTILE_SITE_KEY ?? "").trim()
export const turnstileAction = "knowledge_answer"

let turnstileLoadPromise

const loadTurnstile = () => {
    if (window.turnstile) {
        return Promise.resolve(window.turnstile)
    }
    if (turnstileLoadPromise) {
        return turnstileLoadPromise
    }

    turnstileLoadPromise = new Promise((resolve, reject) => {
        const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID)
        const script = existingScript ?? document.createElement("script")
        const handleLoad = () => {
            cleanup()
            if (window.turnstile) {
                resolve(window.turnstile)
                return
            }
            turnstileLoadPromise = undefined
            reject(new Error("Turnstile API를 찾을 수 없습니다."))
        }
        const handleError = () => {
            cleanup()
            script.remove()
            turnstileLoadPromise = undefined
            reject(new Error("Turnstile API를 불러오지 못했습니다."))
        }
        const cleanup = () => {
            script.removeEventListener("load", handleLoad)
            script.removeEventListener("error", handleError)
        }

        script.addEventListener("load", handleLoad)
        script.addEventListener("error", handleError)
        if (!existingScript) {
            script.id = TURNSTILE_SCRIPT_ID
            script.src = TURNSTILE_SCRIPT_URL
            script.async = true
            script.defer = true
            document.head.append(script)
        }
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

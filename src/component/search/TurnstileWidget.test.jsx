import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import TurnstileWidget, { turnstileAction } from "./TurnstileWidget"

afterEach(() => {
    cleanup()
    document.getElementById("cloudflare-turnstile-script")?.remove()
    vi.useRealTimers()
    vi.unstubAllGlobals()
})

const createTurnstile = () => ({
    render: vi.fn().mockReturnValue("widget-1"),
    reset: vi.fn(),
    remove: vi.fn(),
})

test("검증 토큰을 전달하고 요청 후 같은 위젯을 초기화한다", async () => {
    const onTokenChange = vi.fn()
    const turnstile = createTurnstile()
    vi.stubGlobal("turnstile", turnstile)
    const { rerender, unmount } = render(
        <TurnstileWidget siteKey="public-site-key" onTokenChange={onTokenChange} />,
    )

    await waitFor(() => expect(turnstile.render).toHaveBeenCalledOnce())
    const options = turnstile.render.mock.calls[0][1]
    expect(options).toMatchObject({
        sitekey: "public-site-key",
        action: turnstileAction,
        appearance: "interaction-only",
    })

    act(() => options.callback("verified-token"))
    expect(onTokenChange).toHaveBeenLastCalledWith("verified-token")
    expect(screen.queryByText("자동 요청 방지 확인을 완료해 주세요.")).not.toBeInTheDocument()

    rerender(
        <TurnstileWidget siteKey="public-site-key" resetKey={1} onTokenChange={onTokenChange} />,
    )
    expect(turnstile.reset).toHaveBeenCalledWith("widget-1")
    expect(onTokenChange).toHaveBeenLastCalledWith("")

    unmount()
    expect(turnstile.remove).toHaveBeenCalledWith("widget-1")
})

test.each(["네트워크 오류", "API 누락", "시간 초과"])(
    "%s 뒤 다시 불러오면 새 스크립트로 검증을 진행한다",
    async (failure) => {
        vi.useFakeTimers()
        const onTokenChange = vi.fn()
        render(<TurnstileWidget siteKey="public-site-key" onTokenChange={onTokenChange} />)
        const firstScript = document.getElementById("cloudflare-turnstile-script")
        expect(firstScript).toHaveAttribute(
            "src",
            "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
        )

        await act(async () => {
            if (failure === "시간 초과") {
                await vi.advanceTimersByTimeAsync(20_000)
            } else {
                firstScript.dispatchEvent(new Event(failure === "API 누락" ? "load" : "error"))
            }
        })

        expect(screen.getByRole("alert")).toHaveTextContent(
            "자동 요청 방지 확인을 불러오지 못했습니다.",
        )
        expect(firstScript).not.toBeInTheDocument()
        expect(vi.getTimerCount()).toBe(0)

        fireEvent.click(screen.getByRole("button", { name: "확인 다시 불러오기" }))
        const retryScript = document.getElementById("cloudflare-turnstile-script")
        expect(retryScript).not.toBe(firstScript)
        const turnstile = createTurnstile()
        vi.stubGlobal("turnstile", turnstile)
        await act(async () => retryScript.dispatchEvent(new Event("load")))

        expect(turnstile.render).toHaveBeenCalledOnce()
        expect(screen.queryByRole("alert")).not.toBeInTheDocument()
        expect(vi.getTimerCount()).toBe(0)
        act(() => turnstile.render.mock.calls[0][1].callback("retried-token"))
        expect(onTokenChange).toHaveBeenLastCalledWith("retried-token")
    },
)

test("로딩 중 화면을 떠나면 늦게 로드된 위젯을 생성하지 않는다", async () => {
    const onTokenChange = vi.fn()
    const { unmount } = render(
        <TurnstileWidget siteKey="public-site-key" onTokenChange={onTokenChange} />,
    )
    const script = document.getElementById("cloudflare-turnstile-script")
    unmount()
    onTokenChange.mockClear()

    const turnstile = createTurnstile()
    vi.stubGlobal("turnstile", turnstile)
    await act(async () => script.dispatchEvent(new Event("load")))

    expect(turnstile.render).not.toHaveBeenCalled()
    expect(onTokenChange).not.toHaveBeenCalled()
})

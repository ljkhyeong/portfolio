import { act, render, screen, waitFor } from "@testing-library/react"
import TurnstileWidget, { turnstileAction } from "./TurnstileWidget"

afterEach(() => {
    vi.unstubAllGlobals()
})

test("검증 토큰을 전달하고 요청 후 같은 위젯을 초기화한다", async () => {
    const onTokenChange = vi.fn()
    const turnstile = {
        render: vi.fn().mockReturnValue("widget-1"),
        reset: vi.fn(),
        remove: vi.fn(),
    }
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

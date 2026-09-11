import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import CaseSectionNavigation from "./CaseSectionNavigation"

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

test("스크롤 위치에 맞는 섹션을 표시하고 클릭한 섹션도 즉시 표시한다", () => {
    let notifyIntersection
    const disconnect = vi.fn()
    vi.stubGlobal(
        "IntersectionObserver",
        class {
            constructor(callback) {
                notifyIntersection = callback
            }
            observe() {}
            disconnect = disconnect
        },
    )

    const { unmount } = render(
        <article>
            <CaseSectionNavigation
                sections={[
                    { id: "overview", label: "개요" },
                    { id: "proof", label: "확인 결과" },
                ]}
            />
            <section id="overview">개요 본문</section>
            <section id="proof">확인 결과 본문</section>
        </article>,
    )
    const overview = document.getElementById("overview")
    const proof = document.getElementById("proof")
    overview.getBoundingClientRect = () => ({ top: -300 })
    proof.getBoundingClientRect = () => ({ top: 240 })

    act(() => notifyIntersection())
    expect(screen.getByRole("link", { name: "개요" })).toHaveAttribute("aria-current", "location")
    expect(proof.style.scrollMarginTop).toBe("24px")
    document.documentElement.style.scrollPaddingTop = "24px"
    fireEvent.resize(window)
    expect(proof.style.scrollMarginTop).toBe("0px")
    document.documentElement.style.removeProperty("scroll-padding-top")
    fireEvent.resize(window)

    proof.getBoundingClientRect = () => ({ top: 24 })
    const navigationList = screen.getByRole("navigation").querySelector("ul")
    const proofLink = screen.getByRole("link", { name: "확인 결과" })
    Object.defineProperties(navigationList, {
        clientWidth: { value: 100 },
        scrollWidth: { value: 300 },
    })
    navigationList.getBoundingClientRect = () => ({ left: 0, right: 100 })
    proofLink.getBoundingClientRect = () => ({ left: 140, right: 200 })
    act(() => notifyIntersection())
    expect(screen.getByRole("link", { name: "확인 결과" })).toHaveAttribute(
        "aria-current",
        "location",
    )
    expect(navigationList.scrollLeft).toBe(108)

    fireEvent.click(screen.getByRole("link", { name: "개요" }))
    expect(screen.getByRole("link", { name: "개요" })).toHaveAttribute("aria-current", "location")
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(200)
    vi.stubGlobal("innerHeight", 100)
    vi.stubGlobal("scrollY", 100)
    proof.getBoundingClientRect = () => ({ top: 70 })
    fireEvent.scroll(window)
    expect(proofLink).toHaveAttribute("aria-current", "location")

    vi.stubGlobal("scrollY", 80)
    fireEvent.scroll(window)
    expect(screen.getByRole("link", { name: "개요" })).toHaveAttribute("aria-current", "location")
    unmount()
    expect(disconnect).toHaveBeenCalled()
})

test("현재 섹션의 공유 주소를 복사하고 결과를 알린다", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal("navigator", { clipboard: { writeText } })

    render(
        <article>
            <CaseSectionNavigation
                sections={[
                    { id: "overview", label: "개요" },
                    { id: "proof", label: "확인 결과" },
                ]}
            />
            <section id="overview">개요 본문</section>
            <section id="proof">확인 결과 본문</section>
        </article>,
    )

    fireEvent.click(screen.getByRole("link", { name: "확인 결과" }))
    await act(async () =>
        fireEvent.click(screen.getByRole("button", { name: "확인 결과 섹션 링크 복사" })),
    )

    await waitFor(() => expect(writeText).toHaveBeenCalledOnce())
    expect(new URL(writeText.mock.calls[0][0]).hash).toBe("#proof")
    expect(screen.getByRole("button", { name: "확인 결과 섹션 링크 복사" })).toHaveTextContent(
        "복사됨",
    )
    expect(screen.getByRole("status")).toHaveTextContent("확인 결과 섹션 링크를 복사했습니다.")
})

test("섹션 링크를 누르면 이동한 섹션 제목으로 초점을 옮긴다", () => {
    let runAnimationFrame
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
        runAnimationFrame = callback
        return 1
    })

    render(
        <article>
            <CaseSectionNavigation
                sections={[
                    { id: "overview", label: "개요" },
                    { id: "proof", label: "확인 결과" },
                ]}
            />
            <section id="overview">
                <h1>프로젝트 개요</h1>
            </section>
            <section id="proof">
                <h2>확인 결과</h2>
            </section>
        </article>,
    )

    fireEvent.click(screen.getByRole("link", { name: "확인 결과" }))
    act(() => runAnimationFrame())

    expect(screen.getByRole("heading", { name: "확인 결과" })).toHaveAttribute("tabindex", "-1")
    expect(screen.getByRole("heading", { name: "확인 결과" })).toHaveFocus()
})

test("해시로 진입했을 때 내비게이션 아래에 보이는 섹션을 현재 위치로 표시한다", () => {
    let notifyIntersection
    vi.stubGlobal(
        "IntersectionObserver",
        class {
            constructor(callback) {
                notifyIntersection = callback
            }
            observe() {}
            disconnect() {}
        },
    )

    render(
        <article>
            <CaseSectionNavigation
                sections={[
                    { id: "overview", label: "개요" },
                    { id: "proof", label: "확인 결과" },
                ]}
            />
            <section id="overview">개요 본문</section>
            <section id="proof">확인 결과 본문</section>
        </article>,
    )

    const navigation = screen.getByRole("navigation")
    const overview = document.getElementById("overview")
    const proof = document.getElementById("proof")
    navigation.getBoundingClientRect = () => ({ bottom: 112, height: 60 })
    overview.getBoundingClientRect = () => ({ top: -300 })
    proof.getBoundingClientRect = () => ({ top: 112 })

    act(() => notifyIntersection())

    expect(screen.getByRole("link", { name: "확인 결과" })).toHaveAttribute(
        "aria-current",
        "location",
    )
    expect(screen.getByRole("button", { name: "확인 결과 섹션 링크 복사" })).toBeVisible()
})

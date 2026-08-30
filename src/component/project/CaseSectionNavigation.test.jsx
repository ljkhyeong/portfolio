import { act, fireEvent, render, screen } from "@testing-library/react"
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

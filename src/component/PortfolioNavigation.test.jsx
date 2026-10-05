import { act, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { afterEach, expect, test, vi } from "vitest"
import PortfolioNavigation from "./PortfolioNavigation"

const scrollTo = (y) =>
    act(() => {
        Object.defineProperty(window, "scrollY", { configurable: true, value: y })
        window.dispatchEvent(new Event("scroll"))
    })

const renderNavigation = (props) =>
    render(
        <MemoryRouter>
            <PortfolioNavigation label="주요 메뉴" links={<a href="#career">경력</a>} {...props} />
        </MemoryRouter>,
    )

afterEach(() => {
    vi.unstubAllGlobals()
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 })
})

test("좁은 화면 메인에서는 아래로 스크롤하면 메뉴 윗줄을 접고 위로 스크롤하면 펼친다", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }))
    renderNavigation({ isHome: true })
    const navigation = screen.getByRole("navigation", { name: "주요 메뉴" })

    scrollTo(100)
    expect(navigation).not.toHaveClass("site-nav--compact")
    scrollTo(400)
    expect(navigation).toHaveClass("site-nav--compact")
    scrollTo(300)
    expect(navigation).not.toHaveClass("site-nav--compact")
})

test("넓은 화면과 상세 메뉴는 스크롤해도 접지 않는다", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }))
    renderNavigation({ isHome: true })
    scrollTo(600)
    expect(screen.getByRole("navigation", { name: "주요 메뉴" })).not.toHaveClass(
        "site-nav--compact",
    )
})

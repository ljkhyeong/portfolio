import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, expect, test, vi } from "vitest"
import ScrollToTopButton from "./ScrollToTopButton"

const setScrollPosition = (value) => {
    Object.defineProperty(window, "scrollY", {
        configurable: true,
        value,
    })
}

const mockReducedMotion = (matches) => {
    window.matchMedia = vi.fn().mockReturnValue({ matches })
}

beforeEach(() => {
    setScrollPosition(0)
    mockReducedMotion(false)
    window.scrollTo = vi.fn()
})

test("560px 이상 스크롤했을 때만 맨 위로 이동 버튼을 표시한다", () => {
    render(<ScrollToTopButton />)

    expect(screen.queryByRole("button", { name: "맨 위로 이동" })).not.toBeInTheDocument()

    setScrollPosition(559)
    fireEvent.scroll(window)
    expect(screen.queryByRole("button", { name: "맨 위로 이동" })).not.toBeInTheDocument()

    setScrollPosition(560)
    fireEvent.scroll(window)
    expect(screen.getByRole("button", { name: "맨 위로 이동" })).toBeInTheDocument()
})

test("버튼을 누르면 부드럽게 페이지 맨 위로 이동한다", () => {
    setScrollPosition(800)
    render(<ScrollToTopButton />)

    fireEvent.click(screen.getByRole("button", { name: "맨 위로 이동" }))

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" })
})

test("모션 감소 설정에서는 애니메이션 없이 페이지 맨 위로 이동한다", () => {
    setScrollPosition(800)
    mockReducedMotion(true)
    render(<ScrollToTopButton />)

    fireEvent.click(screen.getByRole("button", { name: "맨 위로 이동" }))

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" })
})

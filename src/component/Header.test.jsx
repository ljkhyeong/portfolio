import { act, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Header from "./Header"

let intersectionCallback
let disconnect

beforeEach(() => {
    disconnect = vi.fn()
    intersectionCallback = undefined

    class MockIntersectionObserver {
        constructor(callback) {
            intersectionCallback = callback
        }

        observe() {}

        disconnect() {
            disconnect()
        }
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
})

afterEach(() => {
    vi.unstubAllGlobals()
})

test("스크롤 위치에 맞는 홈 섹션을 현재 메뉴로 표시한다", () => {
    render(
        <MemoryRouter>
            <Header />
            <main>
                <section id="work" aria-label="프로젝트 영역" />
                <section id="experience" aria-label="경력 영역" />
                <section id="capabilities" aria-label="기술 영역" />
            </main>
        </MemoryRouter>,
    )

    const projectSection = screen.getByRole("region", { name: "프로젝트 영역" })

    act(() => {
        intersectionCallback([
            {
                target: projectSection,
                isIntersecting: true,
                boundingClientRect: { top: 80 },
            },
        ])
    })

    expect(screen.getByRole("link", { name: "프로젝트" })).toHaveAttribute(
        "aria-current",
        "location",
    )
    expect(screen.getByRole("link", { name: "포트폴리오 PDF 내려받기" })).toHaveAttribute(
        "download",
    )
    expect(screen.getByRole("link", { name: "연락처" })).toHaveAttribute("href", "#contact")
})

test("헤더를 제거하면 섹션 감지를 종료한다", () => {
    const { unmount } = render(
        <MemoryRouter>
            <Header />
            <main>
                <section id="work" />
                <section id="experience" />
                <section id="capabilities" />
            </main>
        </MemoryRouter>,
    )

    unmount()

    expect(disconnect).toHaveBeenCalledOnce()
})

import { act, render, screen, within } from "@testing-library/react"
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
                <section id="career" aria-label="경력 영역" />
                <section id="work" aria-label="개인 프로젝트 영역" />
                <section id="skills" aria-label="학습과 기술 영역" />
            </main>
        </MemoryRouter>,
    )

    const projectSection = screen.getByRole("region", { name: "개인 프로젝트 영역" })

    act(() => {
        intersectionCallback([
            {
                target: projectSection,
                isIntersecting: true,
                boundingClientRect: { top: 80 },
            },
        ])
    })

    expect(screen.getByRole("link", { name: "개인 프로젝트" })).toHaveAttribute(
        "aria-current",
        "location",
    )
    expect(screen.getByRole("link", { name: "이력서 PDF 내려받기" })).toHaveAttribute("download")
})

test("첫 화면은 어떤 개발자인지 한 문장으로 쓰고 회사 이름은 쓰지 않는다", () => {
    render(
        <MemoryRouter>
            <Header />
        </MemoryRouter>,
    )

    const intro = screen.getByRole("region", { name: /Java 백엔드 개발자입니다/ })
    expect(intro).not.toHaveTextContent("BEINTECH")
    expect(within(intro).getByRole("figure", { name: /지금까지 한 일의 연표/ })).toBeInTheDocument()
})

test("헤더를 제거하면 섹션 감지를 종료한다", () => {
    const { unmount } = render(
        <MemoryRouter>
            <Header />
            <main>
                <section id="career" />
                <section id="work" />
                <section id="skills" />
            </main>
        </MemoryRouter>,
    )

    unmount()

    expect(disconnect).toHaveBeenCalledOnce()
})

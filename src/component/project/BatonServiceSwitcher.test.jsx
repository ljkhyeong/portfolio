import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import BatonServiceSwitcher from "./BatonServiceSwitcher"

const services = [
    { id: "baton", name: "BATON", primary: true },
    { id: "go", name: "GO", route: "/projects/baton/go" },
    { id: "watch", name: "WATCH", route: "/projects/baton/watch" },
    { id: "relay", name: "RELAY", route: "/projects/baton/relay" },
    { id: "brief", name: "BRIEF", route: "/projects/baton/brief" },
    { id: "cal", name: "CAL", route: "/projects/baton/cal" },
    { id: "round", name: "ROUND", route: "/projects/baton/round" },
]

const scrollToDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollTo")

afterEach(() => {
    vi.restoreAllMocks()

    if (scrollToDescriptor) {
        Object.defineProperty(HTMLElement.prototype, "scrollTo", scrollToDescriptor)
    } else {
        delete HTMLElement.prototype.scrollTo
    }
})

test("현재 서비스가 가로 목록 중앙에 보이도록 스크롤 위치를 맞춘다", () => {
    const scrollTo = vi.fn()

    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
        configurable: true,
        value: scrollTo,
    })

    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(520)
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(280)
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(
        function getOffsetWidth() {
            return this.getAttribute("aria-current") === "page" ? 60 : 280
        },
    )
    vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(
        function getOffsetLeft() {
            return this.getAttribute("aria-current") === "page" ? 420 : 0
        },
    )

    render(
        <MemoryRouter>
            <BatonServiceSwitcher services={services} currentServiceId="cal" />
        </MemoryRouter>,
    )

    const navigation = screen.getByRole("navigation", { name: "BATON 서비스 바로가기" })

    expect(within(navigation).getByRole("link", { name: "CAL" })).toHaveAttribute(
        "aria-current",
        "page",
    )
    expect(scrollTo).toHaveBeenCalledWith({ left: 310, behavior: "auto" })
})

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import ProjectScreenshotGallery from "./ProjectScreenshotGallery"

const project = {
    title: "테스트 프로젝트",
    visual: "gallery",
    screenshots: [
        {
            id: "home",
            src: "/home.png",
            width: 1600,
            height: 900,
            alt: "홈 화면",
            label: "홈",
            caption: "서비스 진입 화면",
        },
        {
            id: "product",
            src: "/product.png",
            width: 1600,
            height: 900,
            alt: "상품 화면",
            label: "상품",
            caption: "상품 선택 화면",
        },
        {
            id: "checkout",
            src: "/checkout.png",
            width: 1600,
            height: 900,
            alt: "결제 화면",
            label: "결제",
            caption: "결제 요청 화면",
        },
    ],
}

test("모든 대표 화면을 버튼으로 열고 좌우 키로 전환한다", () => {
    render(<ProjectScreenshotGallery project={project} />)

    const gallery = screen.getByRole("group", { name: "테스트 프로젝트 대표 화면" })
    const triggers = within(gallery).getAllByRole("button")

    expect(triggers).toHaveLength(3)
    expect(within(gallery).getAllByRole("img")).toHaveLength(3)

    fireEvent.click(triggers[1])

    const dialog = screen.getByRole("dialog", { name: "상품" })

    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole("img", { name: "상품 화면" })).toBeInTheDocument()
    expect(within(dialog).getByText("2 / 3")).toBeInTheDocument()
    expect(dialog.querySelector('[aria-live="polite"]')).toHaveTextContent("상품")

    fireEvent.keyDown(window, { key: "ArrowRight" })
    expect(within(dialog).getByRole("img", { name: "결제 화면" })).toBeInTheDocument()
    expect(within(dialog).getByText("3 / 3")).toBeInTheDocument()
    expect(dialog.querySelector('[aria-live="polite"]')).toHaveTextContent("결제")

    fireEvent.keyDown(window, { key: "ArrowRight" })
    expect(within(dialog).getByRole("img", { name: "홈 화면" })).toBeInTheDocument()
    expect(within(dialog).getByText("1 / 3")).toBeInTheDocument()

    fireEvent.keyDown(window, { key: "ArrowLeft" })
    expect(within(dialog).getByRole("img", { name: "결제 화면" })).toBeInTheDocument()
})

test("닫을 때 body 스크롤과 썸네일 포커스를 복원한다", async () => {
    document.body.style.overflow = "scroll"
    render(<ProjectScreenshotGallery project={project} />)

    const trigger = screen.getByRole("button", {
        name: "테스트 프로젝트 상품 화면 확대해서 보기",
    })

    fireEvent.click(trigger)

    expect(document.body.style.overflow).toBe("hidden")
    expect(screen.getByRole("button", { name: "확대 화면 닫기" })).toHaveFocus()

    fireEvent.click(screen.getByRole("button", { name: "확대 화면 닫기" }))

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    expect(document.body.style.overflow).toBe("scroll")
    expect(trigger).toHaveFocus()

    document.body.style.overflow = ""
})

test("Escape와 배경 클릭으로 확대 화면을 닫는다", () => {
    render(<ProjectScreenshotGallery project={project} />)

    fireEvent.click(screen.getByRole("button", { name: "테스트 프로젝트 홈 화면 확대해서 보기" }))
    fireEvent.keyDown(window, { key: "Escape" })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "테스트 프로젝트 결제 화면 확대해서 보기" }))
    fireEvent.mouseDown(screen.getByRole("dialog"))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
})

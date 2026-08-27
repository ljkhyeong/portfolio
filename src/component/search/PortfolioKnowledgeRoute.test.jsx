import { render, screen, waitFor } from "@testing-library/react"
import App from "../../App"

test("검색 페이지 직접 진입 시 전용 화면과 메타데이터를 표시한다", async () => {
    window.history.pushState({}, "", "/search")

    render(<App />)

    expect(
        await screen.findByRole("heading", {
            name: /프로젝트\s+구현 내용과 공개 문서\s*를\s+검색해 보세요\./,
            level: 1,
        }),
    ).toBeInTheDocument()
    await waitFor(() => expect(document.title).toBe("포트폴리오 문서 검색 | 임정규"))
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://ljkportfolio.netlify.app/search/",
    )
})

test("홈 주요 메뉴에서 문서 검색 페이지로 이동할 수 있다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.getByRole("link", { name: "문서 검색" })).toHaveAttribute("href", "/search")
})

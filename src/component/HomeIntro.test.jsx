import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { expect, test } from "vitest"
import HomeIntro from "./HomeIntro"

test("첫 화면은 어떤 개발자인지 한 문장으로 쓰고 회사 이름은 쓰지 않는다", () => {
    render(
        <MemoryRouter>
            <HomeIntro />
        </MemoryRouter>,
    )

    const intro = screen.getByRole("region", { name: /Java 백엔드 개발자입니다/ })
    expect(intro).not.toHaveTextContent("BEINTECH")
    expect(within(intro).getByRole("figure", { name: /지금까지 한 일의 연표/ })).toBeInTheDocument()
})

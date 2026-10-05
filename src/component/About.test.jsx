import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import About from "./About"
import { careers } from "../data/profile"

const renderAbout = () =>
    render(
        <MemoryRouter>
            <About />
        </MemoryRouter>,
    )

test("학습 영역은 교육 과정과 그룹 스터디를 한 줄씩 보여주고 경력은 반복하지 않는다", () => {
    renderAbout()

    const learningSection = screen.getByRole("region", { name: "학습" })
    const rows = within(within(learningSection).getByRole("list", { name: "교육 및 그룹 스터디" }))
        .getAllByRole("listitem")
        .map((row) => within(row).getByRole("heading", { level: 3 }).textContent)

    expect(rows).toEqual([
        "카카오 클라우드 스쿨 개발자 과정 3기",
        "LnS (Learn & Share) — HTTP 완벽 가이드",
        "Effective Java 스터디",
    ])
    expect(screen.queryByRole("heading", { name: "경력 및 학습" })).not.toBeInTheDocument()
    expect(learningSection).not.toHaveTextContent(careers[0].organization)
    expect(learningSection).not.toHaveTextContent(careers[0].homeDescription)
})

test("기술은 묶음별 기술 이름과 사용 범위만 보여주고 구현 사례 목록을 반복하지 않는다", () => {
    renderAbout()

    const skills = screen.getByRole("region", { name: "기술" })

    for (const group of ["백엔드", "테스트 및 운영", "AI 활용 개발", "프론트엔드"]) {
        const list = within(skills).getByRole("list", { name: `${group} 기술` })
        expect(within(list).queryByRole("link")).not.toBeInTheDocument()
    }
    expect(within(skills).getAllByRole("link")).toHaveLength(1)
    expect(skills).not.toHaveTextContent("결제 및 환불 중복 실행 방지")
    expect(skills).not.toHaveTextContent("적용 사례: 군사법")
})

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

test("학습은 교육 과정과 그룹 스터디를 한 줄씩 보여주고 경력은 반복하지 않는다", () => {
    renderAbout()

    const section = screen.getByRole("region", { name: "학습과 기술" })
    const rows = within(within(section).getByRole("list", { name: "교육과 그룹 스터디" }))
        .getAllByRole("listitem")
        .map((row) => within(row).getByRole("heading", { level: 3 }).textContent)

    expect(rows).toEqual([
        "카카오 클라우드 스쿨 개발자 과정 3기",
        "LnS (Learn & Share) — HTTP 완벽 가이드",
        "Effective Java 스터디",
    ])
    expect(section).not.toHaveTextContent(careers[0].organization)
})

test("기술은 묶음별 기술 이름만 쉼표로 보여주고 AI 활용만 쓰는 방식을 한 문장으로 쓴다", () => {
    renderAbout()

    const skills = within(screen.getByRole("region", { name: "학습과 기술" })).getByRole("list", {
        name: "기술",
    })
    const groups = within(skills)
        .getAllByRole("listitem")
        .map((item) => within(item).getByRole("heading", { level: 3 }).textContent)

    expect(groups).toEqual(["백엔드", "테스트와 운영", "AI 활용", "프론트엔드"])
    expect(skills).toHaveTextContent("Java, Spring Boot, Spring MVC")
    expect(skills).toHaveTextContent("ESLint와 컴파일 검사를")
    expect(within(skills).getAllByRole("link")).toHaveLength(1)
    expect(skills).not.toHaveTextContent("·")
})

import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import BatonServiceCaseStudy from "./BatonServiceCaseStudy"
import ProjectCaseStudy from "./ProjectCaseStudy"

const renderWithRouter = (component) =>
    render(<MemoryRouter initialEntries={["/"]}>{component}</MemoryRouter>)

test("주요 프로젝트 상세는 페이지 순서와 섹션 바로가기를 명확히 보여준다", () => {
    renderWithRouter(<ProjectCaseStudy projectId="baton" />)

    expect(screen.getByText("주요 프로젝트 01 / 03")).toBeInTheDocument()

    const sectionNavigation = screen.getByRole("navigation", {
        name: "상세 섹션 바로가기",
    })

    expect(sectionNavigation).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "개요" })).toHaveAttribute("href", "#project-overview")
    expect(screen.getByRole("link", { name: "화면 및 구성" })).toHaveAttribute(
        "href",
        "#project-system",
    )
    expect(screen.getByRole("link", { name: "설계" })).toHaveAttribute(
        "href",
        "#project-architecture",
    )
    expect(screen.getByRole("link", { name: "문제 해결" })).toHaveAttribute(
        "href",
        "#project-problems",
    )
    expect(screen.getByRole("link", { name: "문서" })).toHaveAttribute("href", "#project-documents")

    const sectionIds = [
        "project-overview",
        "project-system",
        "project-architecture",
        "project-problems",
        "project-documents",
    ]

    sectionIds.forEach((id) => expect(document.getElementById(id)).toBeInTheDocument())
})

test("BATON 마이크로서비스 상세도 책임, 문제 해결과 문서로 바로 이동할 수 있다", () => {
    renderWithRouter(<BatonServiceCaseStudy serviceId="watch" />)

    expect(
        screen.getByRole("navigation", { name: "서비스 상세 섹션 바로가기" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "책임" })).toHaveAttribute("href", "#service-boundary")
    expect(screen.getByRole("link", { name: "문제 해결" })).toHaveAttribute(
        "href",
        "#service-problems",
    )
    expect(screen.getByRole("link", { name: "문서" })).toHaveAttribute("href", "#service-documents")
})

test("WebRTC/HLS 상세는 교육 프로젝트로 표시하고 제목 단위를 보존한다", () => {
    renderWithRouter(<ProjectCaseStudy projectId="webrtc" />)

    expect(screen.getByText("교육 프로젝트")).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            level: 1,
            name: "WebRTC/HLS 현장강의 보조 서비스",
        }),
    ).toBeInTheDocument()
    expect(screen.getByText("WebRTC/HLS")).toBeInTheDocument()
    expect(screen.getByText("현장강의 보조 서비스")).toBeInTheDocument()
})

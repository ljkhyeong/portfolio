import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Projects from "./Projects"

const renderProjects = () =>
    render(
        <MemoryRouter>
            <Projects />
        </MemoryRouter>,
    )

test("대표 프로젝트의 문제, 구현과 검증 범위를 함께 보여준다", () => {
    renderProjects()

    const batonFacts = screen.getByLabelText("BATON 문제, 구현과 검증")
    expect(batonFacts).toHaveTextContent("링크와 전달 작업이 중복 생성될 수 있음")
    expect(batonFacts).toHaveTextContent("결과 미확인 전송은 자동 재시도하지 않음")
    expect(batonFacts).toHaveTextContent("공개 환경 전체 연동은 미검증")
    expect(screen.getByLabelText("happyGallery 문제, 구현과 검증")).toHaveTextContent(
        "실제 네이버 및 PG 계정 연동은 미검증",
    )
    expect(screen.getByLabelText("BATON 진행 및 공개 상태")).toHaveTextContent("일부 저장소 공개")
    expect(screen.getByLabelText("전송형 전자영장 시스템 진행 및 공개 상태")).toHaveTextContent(
        "담당 범위만 공개",
    )
})

test("상세 링크와 공개된 저장소 링크를 구분한다", () => {
    renderProjects()

    const detailLink = screen.getByRole("link", { name: "BATON 프로젝트 상세 보기" })
    const repositoryLink = screen.getByRole("link", {
        name: "BATON WATCH GitHub 저장소 새 창에서 보기",
    })
    expect(detailLink).toHaveAttribute("href", "/projects/baton")
    expect(detailLink).not.toHaveAttribute("target")
    expect(repositoryLink).toHaveAttribute("href", "https://github.com/ljkhyeong/baton-watch")
    expect(repositoryLink).toHaveAttribute("target", "_blank")
    expect(repositoryLink).toHaveAttribute("rel", "noreferrer")
    expect(
        screen.getByRole("link", { name: "happyGallery GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/happyGallery")
    expect(
        screen.getByRole("link", { name: "Hope Commit GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/hope-commit")
    expect(screen.queryByRole("link", { name: /전자영장.*GitHub/ })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /군사법.*GitHub/ })).not.toBeInTheDocument()
})

test("추가 프로젝트는 짧은 소개와 진행 상태 및 상세 링크로 표시한다", () => {
    renderProjects()

    const projects = within(screen.getByRole("list", { name: "추가 프로젝트" }))
    const youth = projects.getByRole("link", { name: "청년정책메이트 프로젝트 상세 보기" })
    expect(youth).toHaveAttribute("href", "/projects/youth-policy-mate")
    expect(youth.closest("article")).toHaveTextContent("개발 중")
    expect(youth.closest("article")).toHaveTextContent("웹앱을 개발합니다")
    expect(
        projects.getByRole("link", { name: "Hope Commit 프로젝트 상세 보기" }).closest("article"),
    ).toHaveTextContent("SeungIl 님의 Hope 6.0.0을 포크")
    expect(projects.getAllByRole("heading", { level: 4 })).toHaveLength(5)
})

test("대표 프로젝트 순서를 유지하고 제목과 미리보기에서 상세로 이동한다", () => {
    renderProjects()

    expect(screen.getByRole("heading", { name: "대표 프로젝트", level: 2 })).toBeInTheDocument()
    expect(screen.queryByText("프로젝트", { exact: true })).not.toBeInTheDocument()
    const projects = within(screen.getByRole("list", { name: "대표 프로젝트" }))
    const headings = projects.getAllByRole("heading", { level: 3 })
    expect(headings.map((heading) => heading.textContent)).toEqual([
        "전송형 전자영장 시스템",
        "BATON",
        "happyGallery",
    ])
    expect(within(headings[1]).getByRole("link")).toHaveAttribute("href", "/projects/baton")
    expect(projects.getByRole("link", { name: "BATON 미리보기에서 상세 보기" })).toHaveAttribute(
        "href",
        "/projects/baton",
    )
})

test("BATON 서비스는 Core에서 분리된 하나의 서비스 맵으로 연결한다", () => {
    renderProjects()

    const serviceMap = screen.getByRole("navigation", { name: "BATON 마이크로서비스 상세" })
    const services = ["GO", "WATCH", "RELAY", "BRIEF", "CAL", "ROUND"]

    expect(serviceMap).toHaveTextContent("CORE")
    services.forEach((service) => {
        expect(
            within(serviceMap).getByRole("link", {
                name: `BATON ${service} 마이크로서비스 상세 보기`,
            }),
        ).toHaveAttribute("href", `/projects/baton/${service.toLowerCase()}`)
    })
})

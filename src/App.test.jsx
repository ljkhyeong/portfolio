import { act, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App"

test("대표 프로젝트를 확인하고 BATON 상세로 이동할 수 있다", async () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.getByText("임정규")).toBeInTheDocument()
    const heroHeading = screen.getByRole("heading", { level: 1 })

    expect(heroHeading).toHaveTextContent("복잡한 요구사항을")
    expect(heroHeading).toHaveTextContent("안정적인 백엔드")
    expect(document.title).toBe("임정규 | 백엔드 개발자")

    const batonHeading = screen.getByRole("heading", {
        name: "BATON",
        level: 3,
    })

    expect(batonHeading).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "happyGallery", level: 3 })).toBeInTheDocument()
    expect(
        screen.queryByRole("heading", { name: "차세대 군사법 정보 시스템", level: 3 }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText("WebRTC/HLS 현장강의 보조 서비스")).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "실무 사례 보기 →" })).toHaveAttribute(
        "href",
        "/projects/defense",
    )

    const batonProject = batonHeading.closest("article")

    expect(batonProject).not.toBeNull()
    await act(async () => {
        userEvent.click(
            within(batonProject).getByRole("link", {
                name: /문제 해결 과정 보기/,
            }),
        )
    })

    const detailHeading = await screen.findByRole("heading", { name: "BATON", level: 1 })

    expect(detailHeading).toBeInTheDocument()
    expect(document.activeElement).toBe(detailHeading)
    expect(document.title).toBe("BATON | 임정규 포트폴리오")
    expect(
        screen.getByRole("heading", {
            name: "기능이 아니라 실패와 복구 방식으로 서비스를 나눈다",
        }),
    ).toBeInTheDocument()
})

const projectLinkCases = [
    ["BATON", "/projects/baton"],
    ["happyGallery", "/projects/happygallery"],
]

test.each(projectLinkCases)("%s 카드가 %s 상세를 연결한다", (project, route) => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(
        screen.getByRole("link", { name: `${project} 설계와 문제 해결 과정 보기` }),
    ).toHaveAttribute("href", route)
})

test("WebRTC/HLS 경험은 대표 카드가 아닌 교육 이력으로만 보여준다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.getByText("이전 경험")).toBeInTheDocument()
    expect(screen.getByText(/WebSocket 제어와/)).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /WebRTC\/HLS.*과정 보기/ })).not.toBeInTheDocument()
})

const directRouteCases = [
    ["/projects/happygallery", "happyGallery", "happyGallery | 임정규 포트폴리오"],
    [
        "/projects/defense",
        "차세대 군사법 정보 시스템",
        "차세대 군사법 정보 시스템 | 임정규 포트폴리오",
    ],
    [
        "/projects/webrtc",
        "WebRTC/HLS 현장강의 보조 서비스",
        "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
    ],
    [
        "/project2",
        "WebRTC/HLS 현장강의 보조 서비스",
        "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
    ],
    ["/project3", "happyGallery", "happyGallery | 임정규 포트폴리오"],
    ["/project4", "차세대 군사법 정보 시스템", "차세대 군사법 정보 시스템 | 임정규 포트폴리오"],
    ["/project-baton", "BATON", "BATON | 임정규 포트폴리오"],
]

test.each(directRouteCases)("%s 경로에서 %s 상세를 연다", async (path, heading, title) => {
    window.history.pushState({}, "", path)

    render(<App />)

    const detailHeading = await screen.findByRole("heading", { name: heading, level: 1 })

    expect(detailHeading).toBeInTheDocument()
    expect(document.activeElement).toBe(detailHeading)
    expect(document.title).toBe(title)
})

test("대표 프로젝트 상세에서 아키텍처와 복구 결정을 확인할 수 있다", async () => {
    window.history.pushState({}, "", "/projects/happygallery")

    render(<App />)

    expect(await screen.findByRole("heading", { name: "설계 판단" })).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "결제와 환불 결과를 모를 때 같은 작업을 무작정 반복하지 않는다",
        }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/processingToken/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/알림 아웃박스/).length).toBeGreaterThan(0)
})

test("WebRTC/HLS 상세는 이전 경험용 간략 화면으로 유지한다", async () => {
    window.history.pushState({}, "", "/projects/webrtc")

    render(<App />)

    expect(
        await screen.findByRole("heading", { name: "WebRTC/HLS 현장강의 보조 서비스" }),
    ).toBeInTheDocument()
    expect(screen.getByText("이전 경험")).toBeInTheDocument()
    expect(screen.getAllByText(/WebSocket 제어/).length).toBeGreaterThan(0)
    expect(screen.queryByRole("heading", { name: "고민과 해결" })).not.toBeInTheDocument()
})

test("알 수 없는 경로는 홈으로 복구한다", async () => {
    window.history.pushState({}, "", "/not-a-project")

    render(<App />)

    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("복잡한 요구사항을")
    await waitFor(() => expect(window.location.pathname).toBe("/"))
    expect(document.title).toBe("임정규 | 백엔드 개발자")
})

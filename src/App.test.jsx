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
    expect(
        screen.getByRole("heading", {
            name: "WebRTC/HLS 현장강의 보조 서비스",
            level: 4,
        }),
    ).toBeInTheDocument()
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

test("BATON 비공개 ADR은 공개 Markdown 요약으로 연결한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(
        screen.getByRole("link", {
            name: "Core 헥사고날 아키텍처 대표 문서 새 창에서 보기",
        }),
    ).toHaveAttribute("href", "/docs/baton/core-hexagonal.md")
    expect(
        screen.getByRole("link", {
            name: "GO 멱등 링크 생성 대표 문서 새 창에서 보기",
        }),
    ).toHaveAttribute("href", "/docs/baton/go-idempotent-link.md")
    expect(
        screen.getByRole("link", {
            name: "RELAY 전송 시도 복구 대표 문서 새 창에서 보기",
        }),
    ).toHaveAttribute("href", "/docs/baton/relay-attempt-recovery.md")
})

test("BATON의 GO, WATCH, RELAY를 독립 마이크로서비스 상세로 연결한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const services = ["GO", "WATCH", "RELAY"]

    services.forEach((service) => {
        expect(
            screen.getByRole("link", {
                name: `BATON ${service} 마이크로서비스 상세 보기`,
            }),
        ).toHaveAttribute("href", `/projects/baton/${service.toLowerCase()}`)
    })
})

test("대표 프로젝트는 여러 실제 화면과 문서 분류를 함께 보여준다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const batonProject = screen.getByRole("heading", { name: "BATON", level: 3 }).closest("article")
    const galleryProject = screen
        .getByRole("heading", { name: "happyGallery", level: 3 })
        .closest("article")

    expect(batonProject).not.toBeNull()
    expect(galleryProject).not.toBeNull()
    expect(within(batonProject).getAllByRole("img")).toHaveLength(3)
    expect(within(galleryProject).getAllByRole("img")).toHaveLength(3)
    expect(within(batonProject).getByText("API Contract")).toBeInTheDocument()
    expect(within(galleryProject).getByText("Retrospective")).toBeInTheDocument()
    expect(within(galleryProject).getByText("Idea / POC")).toBeInTheDocument()
})

test("WebRTC/HLS 경험은 Education에서 이름과 성격을 명확히 보여준다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const educationHeading = screen.getByRole("heading", { name: "Education", level: 3 })
    const careerHeading = screen.getByRole("heading", { name: "Career", level: 3 })

    expect(educationHeading.compareDocumentPosition(careerHeading)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(
        screen.getByRole("heading", {
            name: "WebRTC/HLS 현장강의 보조 서비스",
            level: 4,
        }),
    ).toBeInTheDocument()
    expect(screen.getByText(/WebSocket 제어와/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "프로젝트 기록 보기 →" })).toHaveAttribute(
        "href",
        "/projects/webrtc",
    )
})

const directRouteCases = [
    ["/projects/baton/go", "GO", "BATON GO | 임정규 포트폴리오"],
    ["/projects/baton/watch", "WATCH", "BATON WATCH | 임정규 포트폴리오"],
    ["/projects/baton/relay", "RELAY", "BATON RELAY | 임정규 포트폴리오"],
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
    expect(screen.getByText(/AWS에 운영 배포했으나/)).toBeInTheDocument()
    expect(
        screen.getByRole("link", {
            name: /헥사고날 아키텍처 전환 대표 문서 새 창에서 보기/,
        }),
    ).toHaveAttribute("href", expect.stringContaining("ADR/0021"))
    expect(screen.getAllByText("트레이드오프").length).toBeGreaterThan(0)
})

test("BATON 마이크로서비스 상세는 책임, 대표 문제 해결과 문서를 분리해 보여준다", async () => {
    window.history.pushState({}, "", "/projects/baton/watch")

    render(<App />)

    expect(await screen.findByRole("heading", { name: "WATCH", level: 1 })).toBeInTheDocument()
    expect(screen.getByText("BATON / MICROSERVICE")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "BATON 안에서의 책임" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "대표 문제 해결" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "문서 분류와 대표 문서" })).toBeInTheDocument()
    expect(screen.getByText("공개 저장소")).toBeInTheDocument()
    expect(screen.getByText("느린 URL 점검 중 DB 락을 잡지 않는다")).toBeInTheDocument()
    expect(screen.queryByText("HMAC 키와 DB를 하나의 복구 단위로 묶는다")).not.toBeInTheDocument()
    expect(
        screen.queryByText("전송 결과를 모르면 원본 기록을 바꾸지 않는다"),
    ).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: /WATCH 상태 변경 이벤트 전달/ })).toHaveAttribute(
        "href",
        expect.stringContaining("baton-watch"),
    )
})

test("WebRTC/HLS 상세는 이전 경험용 간략 화면으로 유지한다", async () => {
    window.history.pushState({}, "", "/projects/webrtc")

    render(<App />)

    expect(
        await screen.findByRole("heading", { name: "WebRTC/HLS 현장강의 보조 서비스" }),
    ).toBeInTheDocument()
    expect(screen.getByText("이전 경험")).toBeInTheDocument()
    expect(screen.getAllByText(/WebSocket 제어/).length).toBeGreaterThan(0)
    expect(screen.queryByRole("heading", { name: "대표 문제 해결" })).not.toBeInTheDocument()
})

test("인쇄본은 React 경로에서 공용 프로젝트 데이터로 8쪽을 렌더링한다", async () => {
    window.history.pushState({}, "", "/portfolio/print")

    render(<App />)

    await screen.findByRole("heading", { name: "실패 이후까지 설계하는 백엔드 개발자" })
    expect(document.title).toBe("인쇄용 포트폴리오 | 임정규")
    expect(document.querySelectorAll("[data-print-page]")).toHaveLength(8)
    expect(screen.getAllByText("BATON").length).toBeGreaterThan(0)
    expect(screen.getAllByText("happyGallery").length).toBeGreaterThan(0)
    expect(screen.getByText("WebRTC/HLS 현장강의 보조 서비스")).toBeInTheDocument()
    expect(screen.getByText(/AWS에 운영 배포했으나/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "BATON GO" })).toHaveAttribute(
        "href",
        "https://ljkportfolio.netlify.app/projects/baton/go",
    )
})

test("알 수 없는 경로는 홈으로 복구한다", async () => {
    window.history.pushState({}, "", "/not-a-project")

    render(<App />)

    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("복잡한 요구사항을")
    await waitFor(() => expect(window.location.pathname).toBe("/"))
    expect(document.title).toBe("임정규 | 백엔드 개발자")
})

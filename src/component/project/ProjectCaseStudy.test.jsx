import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import BatonServiceCaseStudy from "./BatonServiceCaseStudy"
import ProjectCaseStudy from "./ProjectCaseStudy"

const renderWithRouter = (component) =>
    render(<MemoryRouter initialEntries={["/"]}>{component}</MemoryRouter>)

test("주요 프로젝트 상세는 페이지 순서와 섹션 바로가기를 명확히 보여준다", () => {
    renderWithRouter(<ProjectCaseStudy projectId="baton" />)

    expect(screen.getByText("주요 프로젝트 01 / 04")).toBeInTheDocument()

    const sectionNavigation = screen.getByRole("navigation", {
        name: "상세 섹션 바로가기",
    })

    expect(sectionNavigation).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "개요" })).toHaveAttribute("href", "#project-overview")
    expect(screen.getByRole("link", { name: "화면 및 서비스" })).toHaveAttribute(
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

    const evidenceLinks = screen.getByRole("list", { name: "프로젝트 근거 바로가기" })

    expect(evidenceLinks).toHaveTextContent("BATON WATCH GitHub 저장소")
    expect(evidenceLinks).toHaveTextContent("대표 문서: Core 헥사고날 아키텍처")

    const additionalProblems = screen.getByText("추가 문제 해결 4건 보기").closest("details")

    expect(additionalProblems).not.toHaveAttribute("open")

    const projectSwitcher = screen.getByRole("navigation", {
        name: "다른 주요 프로젝트 상세",
    })

    expect(
        within(projectSwitcher).getByRole("link", { name: "BATON 프로젝트로 이동" }),
    ).toHaveAttribute("aria-current", "page")
    expect(
        within(projectSwitcher).getByRole("link", {
            name: "전송형 전자영장 시스템 프로젝트로 이동",
        }),
    ).toHaveAttribute("href", "/projects/e-warrant")
    expect(
        within(projectSwitcher).getByRole("link", { name: "happyGallery 프로젝트로 이동" }),
    ).toHaveAttribute("href", "/projects/happygallery")
    expect(
        within(projectSwitcher).getByRole("link", {
            name: "차세대 군사법 정보 시스템 프로젝트로 이동",
        }),
    ).toHaveAttribute("href", "/projects/defense")

    const serviceSwitcher = screen.getByRole("navigation", {
        name: "BATON 서비스 바로가기",
    })

    expect(within(serviceSwitcher).getByRole("link", { name: "Core" })).toHaveAttribute(
        "aria-current",
        "page",
    )
    const serviceRoutes = ["GO", "WATCH", "RELAY"]

    serviceRoutes.forEach((service) => {
        expect(within(serviceSwitcher).getByRole("link", { name: service })).toHaveAttribute(
            "href",
            `/projects/baton/${service.toLowerCase()}`,
        )
    })
})

test("happyGallery는 공개 근거를 상단에서 연결하고 보조 문제를 접어 둔다", () => {
    renderWithRouter(<ProjectCaseStudy projectId="happygallery" />)

    const evidenceLinks = screen.getByRole("list", { name: "프로젝트 근거 바로가기" })

    expect(evidenceLinks).toHaveTextContent("GitHub 저장소")
    expect(evidenceLinks).toHaveTextContent("대표 문서: 제품 기준 스펙")
    expect(screen.getByText("추가 문제 해결 2건 보기").closest("details")).not.toHaveAttribute(
        "open",
    )
    expect(screen.getByRole("heading", { name: "대표 화면" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "대표 화면" })).toHaveAttribute(
        "href",
        "#project-system",
    )
})

test("전자영장 상세는 LG CNS 컨소시엄의 독립망 연계 흐름과 기술 판단을 보여준다", () => {
    renderWithRouter(<ProjectCaseStudy projectId="warrant" />)

    expect(screen.getByText("주요 프로젝트 02 / 04")).toBeInTheDocument()
    expect(
        screen.getByRole("heading", { name: "전송형 전자영장 시스템", level: 1 }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("heading", { name: "독립망 간 업무 흐름 및 시스템 구성" }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: /사법기관 KICS의 전자영장 요청이 독립망 간 집행포털 연계 계층을 거쳐 금융기관 및 통신사로 전달/,
        }),
    ).toBeInTheDocument()
    expect(screen.getByText("LG CNS 컨소시엄 / 독립망 간 기관 연계")).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "먼저 도착한 PDF 콜백을 재조회로 복구한다",
        }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/REQUIRES_NEW/).length).toBeGreaterThan(0)
    expect(screen.queryByText("군교정 업무")).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "문서 분류와 대표 문서" })).not.toBeInTheDocument()
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

    const serviceSwitcher = screen.getByRole("navigation", {
        name: "BATON 서비스 바로가기",
    })

    expect(within(serviceSwitcher).getByRole("link", { name: "WATCH" })).toHaveAttribute(
        "aria-current",
        "page",
    )
    expect(within(serviceSwitcher).getByRole("link", { name: "Core" })).toHaveAttribute(
        "href",
        "/projects/baton",
    )
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

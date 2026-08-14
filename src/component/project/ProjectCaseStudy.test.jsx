import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import BatonServiceCaseStudy from "./BatonServiceCaseStudy"
import ProjectCaseStudy from "./ProjectCaseStudy"

const renderWithRouter = (component) =>
    render(<MemoryRouter initialEntries={["/"]}>{component}</MemoryRouter>)

test("개인 프로젝트 상세는 유형별 이동과 섹션 바로가기를 명확히 보여준다", async () => {
    renderWithRouter(<ProjectCaseStudy projectId="baton" />)

    expect(screen.getByText("개인 프로젝트 01 / 02")).toBeInTheDocument()

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
    expect(screen.getByRole("link", { name: "검증" })).toHaveAttribute("href", "#project-proof")
    expect(screen.getByRole("link", { name: "문서" })).toHaveAttribute("href", "#project-documents")

    const sectionIds = [
        "project-overview",
        "project-system",
        "project-architecture",
        "project-problems",
        "project-proof",
        "project-documents",
    ]

    sectionIds.forEach((id) => expect(document.getElementById(id)).toBeInTheDocument())

    const evidenceLinks = screen.getByRole("list", { name: "프로젝트 근거 바로가기" })

    expect(evidenceLinks).toHaveTextContent("GitHub 저장소")
    expect(evidenceLinks).toHaveTextContent("대표 문서")
    expect(
        within(evidenceLinks).getByRole("link", {
            name: "BATON WATCH GitHub 저장소 새 창에서 보기",
        }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/baton-watch")

    const additionalProblems = screen.getByText("추가 문제 해결 8건 보기").closest("details")
    const featuredProblemList = screen.getByRole("list", { name: "대표 문제 해결 목록" })

    expect(additionalProblems).not.toHaveAttribute("open")
    expect(within(featuredProblemList).getAllByRole("listitem")).toHaveLength(4)

    await userEvent.click(screen.getByText("추가 문제 해결 8건 보기"))

    expect(additionalProblems).toHaveAttribute("open")
    expect(screen.getByRole("list", { name: "추가 문제 해결 목록" })).toBeInTheDocument()

    const projectSwitcher = screen.getByRole("group", {
        name: "경력 및 개인 프로젝트 바로가기",
    })
    const projectMenu = within(projectSwitcher).getByText("프로젝트 이동").closest("details")

    expect(within(projectSwitcher).getByText("개인 프로젝트 01 / 02")).toBeInTheDocument()
    expect(within(projectMenu).queryByText("개인 프로젝트 01 / 02")).not.toBeInTheDocument()
    expect(projectMenu).not.toHaveAttribute("open")
    await userEvent.click(within(projectSwitcher).getByText("프로젝트 이동"))
    expect(projectMenu).toHaveAttribute("open")

    expect(
        within(projectSwitcher).getByRole("list", { name: "경력 프로젝트 바로가기" }),
    ).toBeInTheDocument()
    expect(
        within(projectSwitcher).getByRole("list", { name: "개인 프로젝트 바로가기" }),
    ).toBeInTheDocument()

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

    await userEvent.click(
        within(projectSwitcher).getByRole("link", { name: "BATON 프로젝트로 이동" }),
    )
    expect(projectMenu).not.toHaveAttribute("open")

    const serviceSwitcher = screen.getByRole("navigation", {
        name: "BATON 서비스 바로가기",
    })

    expect(within(serviceSwitcher).getByRole("link", { name: "Core" })).toHaveAttribute(
        "aria-current",
        "page",
    )
    const serviceRoutes = ["GO", "WATCH", "RELAY", "BRIEF", "CAL"]

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
    expect(evidenceLinks).toHaveTextContent("대표 문서")
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

    expect(screen.getByText("경력 프로젝트 01 / 02")).toBeInTheDocument()
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
            name: "상태 저장보다 먼저 도착한 콜백 재처리",
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
    expect(screen.getByRole("list", { name: "WATCH 대표 문제 해결 목록" })).toBeInTheDocument()
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
    const serviceFacts = screen.getByLabelText("서비스 정보")
    expect(within(serviceFacts).getByText("DB")).toBeInTheDocument()
    expect(within(serviceFacts).getByText("공개 범위")).toBeInTheDocument()
    expect(within(serviceFacts).getByText("검증 근거")).toBeInTheDocument()
})

test.each([
    [
        "brief",
        "BRIEF",
        "중복 및 순서가 바뀐 운영 이벤트 처리",
        "https://github.com/ljkhyeong/baton-brief",
    ],
    [
        "cal",
        "CAL",
        "중복 및 순서가 바뀐 일정 스냅샷 처리",
        "https://github.com/ljkhyeong/baton-cal",
    ],
])(
    "BATON %s 상세는 구현 범위와 공개 저장소 상태를 정확히 보여준다",
    (id, name, problem, repository) => {
        renderWithRouter(<BatonServiceCaseStudy serviceId={id} />)

        expect(screen.getByRole("heading", { name, level: 1 })).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: problem })).toBeInTheDocument()
        expect(screen.getByText(/BATON.*연동.*배포/)).toBeInTheDocument()
        expect(
            screen.getByRole("link", { name: new RegExp(`${name} 공개 저장소 보기`) }),
        ).toHaveAttribute("href", repository)
        expect(screen.getByText(/공개 저장소 동기화 전/)).toBeInTheDocument()
    },
)

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

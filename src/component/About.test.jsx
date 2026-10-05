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

test("학습 영역은 교육과 개인 활동만 보여주고 경력은 반복하지 않는다", () => {
    renderAbout()

    const learningSection = screen
        .getByRole("heading", { level: 2, name: "학습" })
        .closest("section")

    expect(screen.queryByRole("heading", { name: "경력 및 학습" })).not.toBeInTheDocument()
    expect(
        within(learningSection).getByRole("heading", { level: 3, name: "교육" }),
    ).toBeInTheDocument()
    expect(
        within(learningSection).getByRole("heading", { level: 3, name: "개인 활동" }),
    ).toBeInTheDocument()
    expect(learningSection).not.toHaveTextContent(careers[0].organization)
    expect(learningSection).not.toHaveTextContent(careers[0].homeDescription)
})

test("공통 기술은 이름만 표시하고 구체적인 구현 경험에 프로젝트 사례를 연결한다", () => {
    const { container } = renderAbout()

    expect(screen.queryByText("설계 기준")).not.toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: "기술" })).toBeInTheDocument()
    expect(screen.queryByText("사용 기술과 적용 경험")).not.toBeInTheDocument()

    const examples = [
        ["결제 및 환불 중복 실행 방지 적용 사례: happyGallery", "/projects/happygallery"],
        ["서버 중단 후 알림 재처리 적용 사례: happyGallery", "/projects/happygallery"],
        ["정원 및 재고 초과 방지 적용 사례: happyGallery", "/projects/happygallery"],
        [
            "서버 중단 후 URL 점검 및 이벤트 전달 재개 적용 사례: BATON WATCH",
            "/projects/baton/watch",
        ],
        [
            "서버 중단 후 URL 점검 및 이벤트 전달 재개 적용 사례: BATON RELAY",
            "/projects/baton/relay",
        ],
        ["배포 구성 및 중단 배치 확인 적용 사례: 군사법", "/projects/defense"],
    ]

    container.querySelectorAll(".capability-list").forEach((layout) => {
        for (const group of ["백엔드", "프론트엔드"]) {
            const skills = within(layout).getByRole("list", { name: `${group} 기술 및 적용 사례` })
            expect(within(skills).queryByRole("link")).not.toBeInTheDocument()
        }
        examples.forEach(([name, href]) => {
            expect(within(layout).getByLabelText(name)).toHaveAttribute("href", href)
        })
        expect(within(layout).getAllByText("결제 및 환불 중복 실행 방지")).toHaveLength(1)
    })
})

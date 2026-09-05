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

test("경력은 회사 소개를 줄이고 각 프로젝트의 담당 업무와 상세 링크를 보여준다", () => {
    renderAbout()

    const projectList = screen.getByLabelText("BEINTECH 수행 프로젝트")
    const careerSection = projectList.closest("section")
    const projects = within(projectList).getAllByRole("listitem", { hidden: true })

    expect(careerSection).toHaveTextContent(careers[0].homeDescription)
    expect(careerSection).not.toHaveTextContent(careers[0].description)
    expect(screen.queryByText("경력과 학습")).not.toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: "경력 및 학습" })).toBeInTheDocument()
    expect(projects[0]).toHaveTextContent("기관별 요청 변환 및 제출 자료 반영 서버 개발")
    expect(projects[1]).toHaveTextContent("기관 자료 검증 배치 개발 및 중단 배치 재실행")
    expect(
        within(projects[0]).getByLabelText("전송형 전자영장 시스템 담당 업무 상세 보기"),
    ).toHaveAttribute("href", "/projects/e-warrant")
    expect(
        within(projects[1]).getByLabelText("차세대 군사법 정보 시스템 담당 업무 상세 보기"),
    ).toHaveAttribute("href", "/projects/defense")
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
        ["배포 상태 및 중단 배치 확인 적용 사례: 군사법", "/projects/defense"],
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

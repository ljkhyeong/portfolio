import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { projectsById } from "../../data/projects"
import BatonServiceCaseStudy from "./BatonServiceCaseStudy"

const renderService = (serviceId) =>
    render(
        <MemoryRouter initialEntries={[`/projects/baton/${serviceId}`]}>
            <BatonServiceCaseStudy serviceId={serviceId} />
        </MemoryRouter>,
    )

test.each(["go", "watch", "relay", "brief", "cal", "round"])(
    "BATON %s 상세는 공통 설계 대신 서비스 고유 근거를 보여준다",
    (serviceId) => {
        const project = projectsById.baton
        const service = project.services.find((candidate) => candidate.id === serviceId)

        renderService(serviceId)

        const problems = screen.getByRole("list", {
            name: `${service.name} 문제와 해결 방법 목록`,
        })

        expect(within(problems).getAllByRole("listitem")).toHaveLength(2)
        expect(
            screen.queryByRole("heading", {
                name: "Core와 6개 서비스의 담당 업무, 실행 환경과 데이터 저장 방식 분리",
            }),
        ).not.toBeInTheDocument()
        expect(screen.queryByText(project.architecture.tradeoff)).not.toBeInTheDocument()
        expect(screen.getByText(`${service.name}의 적용 범위와 제약`)).toBeInTheDocument()
        expect(screen.getByText(service.tradeoff)).toBeInTheDocument()
        expect(screen.getByText(service.contribution)).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "사용 기술" })).toHaveAttribute(
            "href",
            "#service-stack",
        )
    },
)

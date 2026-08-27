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
            name: `${service.name} 대표 문제 해결 목록`,
        })

        expect(within(problems).getAllByRole("listitem")).toHaveLength(2)
        expect(
            screen.queryByRole("heading", { name: "서비스별 데이터와 처리 경계 분리" }),
        ).not.toBeInTheDocument()
        expect(screen.queryByText(project.architecture.tradeoff)).not.toBeInTheDocument()
        expect(screen.getByText(`${service.name}의 트레이드오프`)).toBeInTheDocument()
        expect(screen.getByText(service.tradeoff)).toBeInTheDocument()
        expect(screen.getByText(service.contribution)).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "사용 기술" })).toHaveAttribute(
            "href",
            "#service-stack",
        )
    },
)

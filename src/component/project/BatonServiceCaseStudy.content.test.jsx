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

        expect(within(problems).getAllByRole("listitem")).toHaveLength(1)
        expect(screen.getByText("대표 사례")).toBeVisible()
        const problemSection = problems.closest("section")
        const flowSection = document.getElementById("service-boundary")
        expect(
            problemSection.compareDocumentPosition(flowSection) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
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

test("ROUND의 통과, 일부 실패와 미검증 범위를 나눠 표시한다", () => {
    renderService("round")

    const status = screen.getByLabelText("구현 상태")
    const verified = within(status).getByText("확인됨").closest("div")
    const limited = within(status).getByText("일부 실패 및 제한").closest("div")
    const unverified = within(status).getByText("미검증").closest("div")

    expect(verified).toHaveClass("baton-service-status__item--verified")
    expect(verified).toHaveTextContent("Chromium 전체 미디어와 Core 연동")
    expect(limited).toHaveClass("baton-service-status__item--limited")
    expect(limited).toHaveTextContent("WebKit 채팅과 모바일 배치 시나리오 2건")
    expect(limited).toHaveTextContent("restic 실행 파일 부재")
    expect(unverified).toHaveClass("baton-service-status__item--unverified")
    expect(unverified).toHaveTextContent("Safari 실기기")
})

test("GO의 동시 요청 검증을 전체 배포 검증으로 표시하지 않는다", () => {
    renderService("go")

    const status = screen.getByLabelText("구현 상태")
    const verified = within(status).getByText("확인됨").closest("div")
    const unverified = within(status).getByText("미검증").closest("div")

    expect(verified).toHaveTextContent("같은 요청 8건의 동시 처리")
    expect(unverified).toHaveTextContent("실제 클러스터와 공개 배포는 미검증")
})

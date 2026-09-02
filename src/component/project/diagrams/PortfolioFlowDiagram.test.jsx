import { render, screen } from "@testing-library/react"
import PortfolioFlowDiagram from "./PortfolioFlowDiagram"

test.each(["defense", "webrtc", "intent-trace", "youth-policy-mate"])(
    "%s 구조도는 제목, 설명과 키보드 스크롤 영역을 제공한다",
    (variant) => {
        const { container } = render(<PortfolioFlowDiagram variant={variant} />)
        const diagram = screen.getByRole("img")
        const region = screen.getByRole("region")
        const [titleId, descriptionId] = diagram.getAttribute("aria-labelledby").split(" ")

        expect(container.querySelector(`[id="${titleId}"]`)).not.toBeEmptyDOMElement()
        expect(container.querySelector(`[id="${descriptionId}"]`)).not.toBeEmptyDOMElement()
        expect(region).toHaveAttribute("tabindex", "0")
        expect(diagram.querySelectorAll(".portfolio-flow__node").length).toBeGreaterThanOrEqual(5)
        expect(diagram.querySelectorAll(".editorial-diagram__connector").length).toBeGreaterThan(0)
    },
)

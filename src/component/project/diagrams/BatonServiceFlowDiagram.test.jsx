import { render, screen } from "@testing-library/react"
import { BatonServiceFlowSvg } from "./BatonServiceFlowDiagram"

test.each(["go", "watch", "relay", "brief", "cal", "round"])(
    "%s 흐름의 본문과 OG 변형은 접근성 제목을 서로 구분한다",
    (serviceId) => {
        const { container } = render(
            <>
                <BatonServiceFlowSvg serviceId={serviceId} />
                <BatonServiceFlowSvg serviceId={serviceId} compact />
            </>,
        )

        const diagrams = screen.getAllByRole("img", {
            name: new RegExp(`^${serviceId.toUpperCase()} 처리 흐름`),
        })

        expect(diagrams).toHaveLength(2)
        diagrams.forEach((diagram) => {
            expect(diagram.firstElementChild.tagName).toBe("title")
            const [titleId, descriptionId] = diagram.getAttribute("aria-labelledby").split(" ")
            expect(container.querySelector(`[id="${titleId}"]`)).toHaveTextContent("처리 흐름")
            expect(container.querySelector(`[id="${descriptionId}"]`)).not.toBeEmptyDOMElement()
        })
        expect(diagrams[0].getAttribute("aria-labelledby")).not.toBe(
            diagrams[1].getAttribute("aria-labelledby"),
        )
    },
)

test("RELAY 공유 이미지도 결과 미확인의 재전송 금지를 표시한다", () => {
    render(<BatonServiceFlowSvg serviceId="relay" compact />)

    expect(screen.getByText("결과 미확인")).toBeInTheDocument()
    expect(screen.getByText("재전송 금지")).toBeInTheDocument()
    expect(screen.getByText("전송 전 실패만 재시도")).toBeInTheDocument()
})

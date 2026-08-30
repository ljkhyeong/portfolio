import { fireEvent, render } from "@testing-library/react"
import useCenteredDiagramViewport from "./useCenteredDiagramViewport"

const Diagram = () => <div data-testid="viewport" ref={useCenteredDiagramViewport()} />

test("화면이 좁아져 넘칠 때 중앙 정렬하고 이후 크기 변경에는 사용자 위치를 유지한다", () => {
    const { getByTestId } = render(<Diagram />)
    const viewport = getByTestId("viewport")
    let width = 1000
    Object.defineProperties(viewport, {
        clientWidth: { get: () => width },
        scrollWidth: { get: () => 880 },
    })
    fireEvent.resize(window)
    expect(viewport.scrollLeft).toBe(0)

    width = 360
    fireEvent.resize(window)
    expect(viewport.scrollLeft).toBe(260)

    viewport.scrollLeft = 80
    width = 390
    fireEvent.resize(window)
    expect(viewport.scrollLeft).toBe(80)
})

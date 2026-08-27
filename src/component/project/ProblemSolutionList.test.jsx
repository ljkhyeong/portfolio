import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ProblemSolutionList from "./ProblemSolutionList"

const problems = [
    {
        number: "01",
        title: "중복 요청을 한 번만 처리한다",
        constraint: "같은 요청이 동시에 들어올 수 있습니다.",
        decision: "멱등 키로 처리 결과를 재사용합니다.",
        validation: "동시 요청 테스트에서 결과가 한 건만 생성됐습니다.",
        boundary: "멱등 키 보관 기간을 별도로 관리해야 합니다.",
    },
    {
        number: "02",
        title: "실패한 전송을 다시 처리한다",
        constraint: "외부 전송이 중간에 실패할 수 있습니다.",
        decision: "아웃박스 상태를 기준으로 재처리합니다.",
        validation: "재시작 뒤 미완료 건이 다시 처리됐습니다.",
        boundary: "계속 실패한 건은 운영 확인이 필요합니다.",
    },
]

test("문제를 접힌 목록으로 먼저 보여주고 선택한 근거를 펼친다", async () => {
    render(<ProblemSolutionList problems={problems} label="문제와 해결 방법 목록" />)

    const list = screen.getByRole("list", { name: "문제와 해결 방법 목록" })
    const items = within(list).getAllByRole("listitem")
    const firstDetails = items[0].querySelector("details")

    expect(items).toHaveLength(2)
    expect(firstDetails).not.toHaveAttribute("open")
    expect(
        within(items[0]).getByRole("heading", { name: "중복 요청을 한 번만 처리한다" }),
    ).toBeInTheDocument()

    await userEvent.click(within(items[0]).getByText("중복 요청을 한 번만 처리한다"))

    expect(firstDetails).toHaveAttribute("open")
    expect(within(firstDetails).getByText("멱등 키로 처리 결과를 재사용합니다.")).toBeVisible()
    expect(within(firstDetails).getByText("문제 상황")).toBeVisible()
    expect(within(firstDetails).getByText("적용한 방법")).toBeVisible()
    expect(within(firstDetails).getByText("테스트 및 확인")).toBeVisible()
    expect(within(firstDetails).getByText("제약과 남은 작업")).toBeVisible()
})

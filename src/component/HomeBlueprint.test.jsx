import { render, screen } from "@testing-library/react"
import activity from "../data/githubActivity.json"
import { projectSummariesById } from "../data/projectSummaries"
import BatonBlueprint from "./BatonBlueprint"
import GithubActivity from "./GithubActivity"

test("기여 히트맵은 저장한 기록의 합계와 활동한 날을 보여준다", () => {
    render(<GithubActivity />)

    const total = activity.days.reduce((sum, count) => sum + count, 0)
    const activeDays = activity.days.filter((count) => count > 0).length
    const summary = `${total.toLocaleString("ko-KR")}회 · 활동한 날 ${activeDays}일`

    expect(total).toBe(activity.total)
    expect(screen.getByRole("heading", { name: "최근 1년 GitHub 기여" })).toBeInTheDocument()
    expect(screen.getByRole("img", { name: new RegExp(summary) })).toBeInTheDocument()
})

test("BATON 구조도는 Core와 6개 서비스의 이름과 역할을 데이터에서 그린다", () => {
    const { container } = render(
        <>
            <BatonBlueprint captionId="caption" />
            <p id="caption">Fig. 1 BATON</p>
        </>,
    )
    const baton = projectSummariesById.baton
    const drawing = screen.getByRole("img", { name: "Fig. 1 BATON" })

    expect(container.querySelectorAll(".blueprint-drawing__box")).toHaveLength(7)
    expect(drawing).toHaveTextContent(baton.coreRole)
    baton.serviceLinks.forEach((service) => {
        expect(drawing).toHaveTextContent(service.name)
        expect(drawing).toHaveTextContent(service.role)
    })
})

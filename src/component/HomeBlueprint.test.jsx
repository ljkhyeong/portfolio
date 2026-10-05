import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
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
    expect(
        screen.getByRole("heading", { level: 3, name: "최근 1년 GitHub 기여" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("img", { name: new RegExp(summary) })).toBeInTheDocument()
})

test("BATON 구조도는 Core와 6개 서비스를 데이터에서 그리고 각 상세로 연결한다", () => {
    const { container } = render(
        <MemoryRouter>
            <BatonBlueprint captionId="caption" />
            <p id="caption">Fig. 1 BATON</p>
        </MemoryRouter>,
    )
    const baton = projectSummariesById.baton
    const drawing = container.querySelector("svg")

    expect(drawing).toHaveAccessibleName("Fig. 1 BATON")
    expect(container.querySelectorAll(".blueprint-drawing__box")).toHaveLength(7)
    expect(within(drawing).getByRole("link", { name: "BATON Core 상세 보기" })).toHaveAttribute(
        "href",
        baton.route,
    )
    expect(drawing).toHaveTextContent(baton.coreRole)
    baton.serviceLinks.forEach((service) => {
        const link = within(drawing).getByRole("link", {
            name: `BATON ${service.name} 마이크로서비스 상세 보기`,
        })

        expect(link).toHaveAttribute("href", service.route)
        expect(link).toHaveTextContent(service.role)
    })
})

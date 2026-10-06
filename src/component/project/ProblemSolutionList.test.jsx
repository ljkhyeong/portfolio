import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ProblemCases from "./ProblemCases"
import ProblemSolutionList from "./ProblemSolutionList"
import featuredProblems from "../../data/featuredProblems"
import { projectsById } from "../../data/projects"

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

test("다른 문제 해결은 번호와 제목만 펼쳐 두고 누르면 네 칸을 연다", async () => {
    render(<ProblemSolutionList problems={problems} label="다른 문제와 해결 방법 목록" />)

    const list = screen.getByRole("list", { name: "다른 문제와 해결 방법 목록" })
    const items = within(list).getAllByRole("listitem")
    const firstDetails = items[0].querySelector("details")

    expect(items).toHaveLength(2)
    expect(firstDetails).not.toHaveAttribute("open")
    expect(within(items[0]).getByText("01")).toBeVisible()
    expect(within(items[0]).getByText(problems[0].validation)).not.toBeVisible()

    await userEvent.click(within(items[0]).getByText("중복 요청을 한 번만 처리한다"))

    expect(firstDetails).toHaveAttribute("open")
    ;["문제", "방법", "확인", "남은 일"].forEach((term) =>
        expect(within(firstDetails).getByText(term)).toBeVisible(),
    )
    expect(within(firstDetails).getByText("멱등 키로 처리 결과를 재사용합니다.")).toBeVisible()
})

test("대표 사례는 네 칸을 펼쳐 보여주고, 처리 순서가 있는 사례에 순서와 한 문장을 둔다", () => {
    const featured = {
        problemNumber: "01",
        problem: "한 요청이 여러 번 들어옵니다.",
        steps: [
            { title: "요청 수신", description: "멱등 키 확인" },
            { title: "중복 확인", description: "처리 이력 조회" },
            { title: "결과 반환", description: "기존 결과 재사용" },
        ],
    }
    render(<ProblemCases project={{ title: "예시" }} problems={problems} featured={featured} />)

    const first = screen.getByRole("article", { name: problems[0].title })
    const second = screen.getByRole("article", { name: problems[1].title })

    expect(within(first).getByText(featured.problem)).toBeVisible()
    expect(
        within(within(first).getByRole("list", { name: `${problems[0].title} 처리 순서` }))
            .getAllByRole("listitem")
            .map((step) => step.querySelector("strong").textContent),
    ).toEqual(["요청 수신", "중복 확인", "결과 반환"])
    ;[first, second].forEach((article) => {
        ;["문제", "방법", "확인", "남은 일"].forEach((term) =>
            expect(within(article).getByText(term)).toBeVisible(),
        )
    })
    expect(within(second).getByText(problems[1].boundary)).toBeVisible()
    expect(within(second).queryByRole("list")).not.toBeInTheDocument()
})

test("모든 대표 사례가 실제 프로젝트의 문제를 가리킨다", () => {
    expect(featuredProblems).toHaveProperty("youth-policy-mate")

    for (const [key, featured] of Object.entries(featuredProblems)) {
        const project = projectsById[key.startsWith("baton-") ? "baton" : key]
        const problem = project.problems.find((entry) => entry.number === featured.problemNumber)
        expect(problem, key).toBeDefined()
        if (key.startsWith("baton-")) {
            expect(problem.serviceIds).toContain(key.slice("baton-".length))
        }
        expect(featured.problem).toBeTruthy()
        expect(featured.steps.length).toBeGreaterThanOrEqual(3)
        expect(featured.steps.length).toBeLessThanOrEqual(4)
    }
})

test("문제와 짝지은 화면은 그 프로젝트의 실제 화면을 가리킨다", () => {
    Object.values(projectsById).forEach((project) => {
        project.problems
            .filter((problem) => problem.screenshotId)
            .forEach((problem) => {
                expect(
                    project.screenshots.map((screenshot) => screenshot.id),
                    `${project.id} ${problem.number}`,
                ).toContain(problem.screenshotId)
                expect(project.featuredProblemNumbers).toContain(problem.number)
            })
    })
})

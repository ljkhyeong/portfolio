import { render, screen } from "@testing-library/react"
import { createMemoryRouter, RouterProvider } from "react-router-dom"
import { generatePortfolioAnswer, searchPortfolioKnowledge } from "../../api/knowledgeSearch"
import { searchLocalKnowledge } from "../../api/localKnowledgeSearch"
import PortfolioKnowledgePage from "./PortfolioKnowledgePage"

// 검색 API 주소를 설정하지 않은 빌드(현재 공개 사이트)의 동작이다.
vi.mock("../../api/knowledgeSearch", () => ({
    knowledgeApiConfigured: false,
    searchPortfolioKnowledge: vi.fn(),
    generatePortfolioAnswer: vi.fn(),
}))

vi.mock("../../api/localKnowledgeSearch", () => ({
    searchLocalKnowledge: vi.fn(),
}))

const searchResult = {
    chunkId: "defense#batch#000",
    projectId: "defense",
    projectName: "차세대 군사법 정보 시스템",
    documentType: "problem_solution",
    title: "Jenkins, JEUS와 Tibero로 배치 중단 단계 확인",
    heading: "문제와 해결 방법",
    snippet: "Jenkins에서 실패 시각과 단계를 확인했습니다.",
    route: "/projects/defense",
}

test("검색 API 주소가 없으면 API를 부르지 않고 브라우저에서 검색한다", async () => {
    searchLocalKnowledge.mockResolvedValue({ results: [searchResult], total: 1 })
    const router = createMemoryRouter([{ path: "/search", element: <PortfolioKnowledgePage /> }], {
        initialEntries: ["/search?q=배치 중단"],
    })
    render(<RouterProvider router={router} />)

    expect(await screen.findByRole("heading", { name: searchResult.title })).toBeVisible()
    expect(searchLocalKnowledge).toHaveBeenCalledWith(
        expect.objectContaining({ query: "배치 중단" }),
    )
    expect(searchPortfolioKnowledge).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: /검색 결과로 답변 생성/ })).toBeDisabled()
    expect(generatePortfolioAnswer).not.toHaveBeenCalled()
})

import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { generatePortfolioAnswer, searchPortfolioKnowledge } from "../../api/knowledgeSearch"
import PortfolioKnowledgePage from "./PortfolioKnowledgePage"

vi.mock("../../api/knowledgeSearch", () => ({
    searchPortfolioKnowledge: vi.fn(),
    generatePortfolioAnswer: vi.fn(),
}))

const searchResult = {
    chunkId: "happygallery#payment#0",
    projectId: "happygallery",
    projectName: "happyGallery",
    documentType: "problem_solution",
    title: "결제 및 환불 재요청의 중복 처리 방지",
    heading: "문제와 해결 방법",
    snippet: "결제 승인과 환불 요청에 멱등 키를 적용했습니다.",
    route: "/projects/happygallery",
    score: 0.92,
}

const renderPage = () =>
    render(
        <MemoryRouter>
            <PortfolioKnowledgePage />
        </MemoryRouter>,
    )

beforeEach(() => {
    vi.clearAllMocks()
})

test("본문 인용 번호를 누르면 해당 출처의 발췌문을 열고 키보드 초점을 옮긴다", async () => {
    searchPortfolioKnowledge.mockResolvedValue({ results: [searchResult], total: 1 })
    generatePortfolioAnswer.mockResolvedValue({
        status: "GENERATED",
        answer: "같은 키를 재사용합니다. [1]",
        citations: [{ ...searchResult, excerpt: "환불 요청의 UUID를 재사용합니다." }],
    })
    renderPage()
    await act(async () => {
        userEvent.click(
            screen.getByRole("button", { name: "결제와 환불 중복 처리를 어떻게 막았나요?" }),
        )
    })
    await screen.findByRole("heading", { name: searchResult.title })
    await act(async () => {
        userEvent.click(screen.getByRole("button", { name: /검색 결과로 답변 생성/ }))
    })
    const reference = await screen.findByRole("button", { name: "근거 1 보기" })
    expect(screen.getByText("근거 1 발췌문").closest("details")).not.toHaveAttribute("open")
    await act(async () => {
        userEvent.click(reference)
    })
    expect(screen.getByText("근거 1 발췌문").closest("details")).toHaveAttribute("open")
    expect(screen.getByText("근거 1 발췌문")).toHaveFocus()
    expect(screen.getByText("환불 요청의 UUID를 재사용합니다.")).toBeVisible()
})

test("검색 결과를 먼저 보여주고 사용자가 요청한 뒤에만 AI 답변을 생성한다", async () => {
    searchPortfolioKnowledge.mockResolvedValue({
        query: "결제와 환불 중복 처리를 어떻게 막았나요?",
        total: 1,
        results: [searchResult],
    })
    generatePortfolioAnswer.mockResolvedValue({
        question: "결제와 환불 중복 처리를 어떻게 막았나요?",
        status: "GENERATED",
        answer: "결제 승인과 환불에 멱등 키를 적용해 같은 요청의 중복 처리를 막았습니다.",
        citations: [searchResult],
        results: [searchResult],
    })

    renderPage()

    await act(async () => {
        userEvent.selectOptions(screen.getByLabelText("프로젝트"), "happygallery")
        userEvent.selectOptions(screen.getByLabelText("문서 종류"), "problem_solution")
        userEvent.click(
            screen.getByRole("button", {
                name: "결제와 환불 중복 처리를 어떻게 막았나요?",
            }),
        )
    })

    expect(
        await screen.findByRole("heading", {
            name: "결제 및 환불 재요청의 중복 처리 방지",
        }),
    ).toBeInTheDocument()
    expect(searchPortfolioKnowledge).toHaveBeenCalledWith(
        expect.objectContaining({
            query: "결제와 환불 중복 처리를 어떻게 막았나요?",
            projectId: "happygallery",
            documentType: "problem_solution",
        }),
    )
    expect(generatePortfolioAnswer).not.toHaveBeenCalled()

    await act(async () => {
        userEvent.click(screen.getByRole("button", { name: /검색 결과로 답변 생성/ }))
    })

    expect(
        await screen.findByText(
            "결제 승인과 환불에 멱등 키를 적용해 같은 요청의 중복 처리를 막았습니다.",
        ),
    ).toBeInTheDocument()
    expect(generatePortfolioAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
            question: "결제와 환불 중복 처리를 어떻게 막았나요?",
            projectId: "happygallery",
            documentType: "problem_solution",
        }),
    )
    expect(screen.getByRole("link", { name: /결제 및 환불 재요청/ })).toHaveAttribute(
        "href",
        "/projects/happygallery",
    )
})

test("검색 결과가 없으면 검색 범위를 바꾸는 방법을 안내하고 답변 버튼을 비활성화한다", async () => {
    searchPortfolioKnowledge.mockResolvedValue({ query: "없는 자료", total: 0, results: [] })

    renderPage()

    await act(async () => {
        userEvent.type(screen.getByLabelText("확인하고 싶은 내용을 입력하세요."), "없는 자료")
        userEvent.click(screen.getByRole("button", { name: "문서 검색" }))
    })

    expect(await screen.findByText("일치하는 공개 자료가 없습니다.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /검색 결과로 답변 생성/ })).toBeDisabled()
})

test.each([
    [429, "검색 요청이 많습니다. 잠시 후 다시 시도해 주세요."],
    [503, "현재 검색 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요."],
])("검색 API가 %s를 반환하면 다시 시도할 방법을 안내한다", async (status, message) => {
    searchPortfolioKnowledge.mockRejectedValue(
        Object.assign(new Error("요청 실패"), { status, code: "REQUEST_FAILED" }),
    )

    renderPage()

    await act(async () => {
        userEvent.type(screen.getByLabelText("확인하고 싶은 내용을 입력하세요."), "검색 질문")
        userEvent.click(screen.getByRole("button", { name: "문서 검색" }))
    })

    expect(await screen.findByRole("alert")).toHaveTextContent(message)
})

import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router-dom"
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

const renderPage = (initialEntries = ["/search"]) => {
    const router = createMemoryRouter([{ path: "/search", element: <PortfolioKnowledgePage /> }], {
        initialEntries,
    })
    render(<RouterProvider router={router} />)
    return router
}

beforeEach(() => {
    vi.resetAllMocks()
})

test("공유 주소의 검색어와 필터를 복원하고 AI 답변은 자동 생성하지 않는다", async () => {
    searchPortfolioKnowledge.mockResolvedValue({ results: [searchResult], total: 1 })
    renderPage(["/search?q=결제&project=happygallery&type=problem_solution"])

    await screen.findByRole("heading", { name: searchResult.title })
    expect(screen.getByRole("searchbox")).toHaveValue("결제")
    expect(screen.getByLabelText("프로젝트")).toHaveValue("happygallery")
    expect(screen.getByLabelText("문서 종류")).toHaveValue("problem_solution")
    expect(searchPortfolioKnowledge).toHaveBeenCalledWith(
        expect.objectContaining({
            query: "결제",
            projectId: "happygallery",
            documentType: "problem_solution",
        }),
    )
    expect(generatePortfolioAnswer).not.toHaveBeenCalled()
})

test("프로젝트만 지정한 주소는 검색어 입력을 기다린다", () => {
    renderPage(["/search?project=warrant"])
    expect(screen.getByLabelText("프로젝트")).toHaveValue("warrant")
    expect(
        screen.getByRole("button", {
            name: "전송형 전자영장 시스템 주요 기능과 담당 범위는 무엇인가요?",
        }),
    ).toBeVisible()
    expect(screen.getByRole("searchbox")).toHaveAttribute(
        "placeholder",
        "예: 전송형 전자영장 시스템 주요 기능과 담당 범위는 무엇인가요?",
    )
    expect(
        screen.queryByRole("button", { name: "결제와 환불 중복 처리를 어떻게 막았나요?" }),
    ).not.toBeInTheDocument()
    expect(searchPortfolioKnowledge).not.toHaveBeenCalled()
})

test("BATON 서비스 범위를 주소에서 복원하고 변경한 서비스도 주소와 API에 반영한다", async () => {
    searchPortfolioKnowledge.mockResolvedValue({
        results: [{ ...searchResult, projectId: "baton", projectName: "BATON", serviceId: "go" }],
        total: 1,
    })
    const router = renderPage(["/search?q=링크 중복&project=baton&service=go"])

    await screen.findByRole("heading", { name: searchResult.title })
    expect(screen.getByLabelText("BATON 서비스")).toHaveValue("go")
    expect(
        screen.getByRole("button", {
            name: "BATON GO 주요 기능과 담당 범위는 무엇인가요?",
        }),
    ).toBeVisible()
    expect(screen.getByRole("searchbox")).toHaveAttribute(
        "placeholder",
        "예: BATON GO 주요 기능과 담당 범위는 무엇인가요?",
    )
    expect(searchPortfolioKnowledge).toHaveBeenLastCalledWith(
        expect.objectContaining({ projectId: "baton", serviceId: "go" }),
    )

    await act(async () => userEvent.selectOptions(screen.getByLabelText("BATON 서비스"), "watch"))
    await screen.findByRole("heading", { name: searchResult.title })
    expect(new URLSearchParams(router.state.location.search).get("service")).toBe("watch")
    expect(
        screen.getByRole("button", {
            name: "BATON WATCH 주요 기능과 담당 범위는 무엇인가요?",
        }),
    ).toBeVisible()
    expect(searchPortfolioKnowledge).toHaveBeenLastCalledWith(
        expect.objectContaining({ projectId: "baton", serviceId: "watch" }),
    )
})

test("BATON이 아닌 프로젝트로 바꾸면 서비스 범위를 제거한다", async () => {
    searchPortfolioKnowledge.mockResolvedValue({ results: [searchResult], total: 1 })
    const router = renderPage(["/search?q=결제&project=baton&service=go"])
    await screen.findByRole("heading", { name: searchResult.title })

    await act(async () =>
        userEvent.selectOptions(screen.getByLabelText("프로젝트"), "happygallery"),
    )
    await screen.findByRole("heading", { name: searchResult.title })

    expect(screen.queryByLabelText("BATON 서비스")).not.toBeInTheDocument()
    expect(new URLSearchParams(router.state.location.search).has("service")).toBe(false)
    expect(searchPortfolioKnowledge).toHaveBeenLastCalledWith(
        expect.objectContaining({ projectId: "happygallery", serviceId: "" }),
    )
})

test("검색 범위 초기화는 검색어를 유지하고 프로젝트와 문서 종류를 모두 제거한다", async () => {
    searchPortfolioKnowledge.mockResolvedValue({ results: [searchResult], total: 1 })
    const router = renderPage(["/search?q=결제&project=happygallery&type=problem_solution"])
    await screen.findByRole("heading", { name: searchResult.title })

    await act(async () => userEvent.click(screen.getByRole("button", { name: "범위 초기화" })))
    await screen.findByRole("heading", { name: searchResult.title })

    const nextParams = new URLSearchParams(router.state.location.search)
    expect(nextParams.get("q")).toBe("결제")
    expect(nextParams.has("project")).toBe(false)
    expect(nextParams.has("type")).toBe(false)
    expect(screen.getByLabelText("프로젝트")).toHaveValue("")
    expect(screen.getByLabelText("문서 종류")).toHaveValue("")
    expect(screen.queryByRole("button", { name: "범위 초기화" })).not.toBeInTheDocument()
    expect(searchPortfolioKnowledge).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: "결제", projectId: "", serviceId: "", documentType: "" }),
    )
})

test("주소에 없는 프로젝트와 문서 종류가 지정되면 전체 범위로 검색한다", async () => {
    searchPortfolioKnowledge.mockResolvedValue({ results: [], total: 0 })
    renderPage(["/search?q=결제&project=unknown&type=unknown"])
    await screen.findByText("일치하는 공개 자료가 없습니다.")
    expect(screen.getByLabelText("프로젝트")).toHaveValue("")
    expect(screen.getByLabelText("문서 종류")).toHaveValue("")
    expect(searchPortfolioKnowledge).toHaveBeenCalledWith(
        expect.objectContaining({
            query: "결제",
            projectId: "",
            documentType: "",
        }),
    )
})

test("검색과 필터 변경을 주소에 남기고 뒤로 가면 이전 조건으로 다시 검색한다", async () => {
    searchPortfolioKnowledge.mockResolvedValue({ results: [searchResult], total: 1 })
    const router = renderPage()

    await act(async () => {
        userEvent.type(screen.getByRole("searchbox"), "결제 & 환불")
        userEvent.click(screen.getByRole("button", { name: "문서 검색" }))
    })
    await screen.findByRole("heading", { name: searchResult.title })
    expect(new URLSearchParams(router.state.location.search).get("q")).toBe("결제 & 환불")

    await act(async () =>
        userEvent.selectOptions(screen.getByLabelText("프로젝트"), "happygallery"),
    )
    await screen.findByRole("heading", { name: searchResult.title })
    expect(new URLSearchParams(router.state.location.search).get("project")).toBe("happygallery")
    await act(async () =>
        userEvent.selectOptions(screen.getByLabelText("문서 종류"), "problem_solution"),
    )
    await screen.findByRole("heading", { name: searchResult.title })
    expect(new URLSearchParams(router.state.location.search).get("type")).toBe("problem_solution")

    await act(async () => {
        userEvent.clear(screen.getByRole("searchbox"))
        userEvent.type(screen.getByRole("searchbox"), "아직 검색하지 않은 질문")
    })
    await act(async () => router.navigate(-1))
    await screen.findByRole("heading", { name: searchResult.title })
    expect(screen.getByRole("searchbox")).toHaveValue("결제 & 환불")
    expect(screen.getByLabelText("프로젝트")).toHaveValue("happygallery")
    expect(screen.getByLabelText("문서 종류")).toHaveValue("")
    expect(searchPortfolioKnowledge).toHaveBeenLastCalledWith(
        expect.objectContaining({
            query: "결제 & 환불",
            projectId: "happygallery",
            documentType: "",
        }),
    )
})

test("같은 검색어로 오류 후 다시 시도할 수 있다", async () => {
    searchPortfolioKnowledge
        .mockRejectedValueOnce(new Error("연결 실패"))
        .mockResolvedValueOnce({ results: [searchResult], total: 1 })
    const router = renderPage(["/search?project=happygallery&q=결제"])
    await screen.findByRole("alert")
    const initialKey = router.state.location.key

    await act(async () => userEvent.click(screen.getByRole("button", { name: "문서 검색" })))
    await screen.findByRole("heading", { name: searchResult.title })
    expect(searchPortfolioKnowledge).toHaveBeenCalledTimes(2)
    expect(router.state.location.key).toBe(initialKey)
})

test("필터를 바꾸면 이전 검색을 취소하고 늦게 온 결과를 무시한다", async () => {
    let resolvePrevious
    searchPortfolioKnowledge
        .mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    resolvePrevious = resolve
                }),
        )
        .mockResolvedValueOnce({ results: [], total: 0 })
    renderPage(["/search?q=결제"])
    const previousSignal = searchPortfolioKnowledge.mock.calls[0][0].signal

    await act(async () => userEvent.selectOptions(screen.getByLabelText("프로젝트"), "warrant"))
    await screen.findByText("일치하는 공개 자료가 없습니다.")
    expect(previousSignal.aborted).toBe(true)
    await act(async () => resolvePrevious({ results: [searchResult], total: 1 }))
    expect(screen.queryByRole("heading", { name: searchResult.title })).not.toBeInTheDocument()
})

test("필터 변경으로 취소한 AI 답변을 새 검색 결과에 표시하지 않는다", async () => {
    let resolveAnswer
    searchPortfolioKnowledge.mockResolvedValue({ results: [searchResult], total: 1 })
    generatePortfolioAnswer.mockImplementation(
        () =>
            new Promise((resolve) => {
                resolveAnswer = resolve
            }),
    )
    renderPage(["/search?q=결제"])
    await screen.findByRole("heading", { name: searchResult.title })
    await act(async () =>
        userEvent.click(screen.getByRole("button", { name: /검색 결과로 답변 생성/ })),
    )
    const previousSignal = generatePortfolioAnswer.mock.calls[0][0].signal

    await act(async () =>
        userEvent.selectOptions(screen.getByLabelText("문서 종류"), "problem_solution"),
    )
    await screen.findByRole("heading", { name: searchResult.title })
    expect(previousSignal.aborted).toBe(true)
    await act(async () =>
        resolveAnswer({
            status: "GENERATED",
            answer: "이전 조건의 답변",
            citations: [searchResult],
        }),
    )
    await waitFor(() => expect(screen.queryByText("이전 조건의 답변")).not.toBeInTheDocument())
    expect(screen.getByRole("button", { name: /검색 결과로 답변 생성/ })).toBeEnabled()
})

test("본문 인용 번호를 누르면 280자 뒤의 근거까지 펼치고 키보드 초점을 옮긴다", async () => {
    const fullEvidence =
        "결제 승인과 환불 요청을 구분하고 처리 상태를 저장합니다. ".repeat(12) +
        "환불 요청의 UUID를 재사용합니다."
    searchPortfolioKnowledge.mockResolvedValue({ results: [searchResult], total: 1 })
    generatePortfolioAnswer.mockResolvedValue({
        status: "GENERATED",
        answer: "같은 키를 재사용합니다. [1]",
        citations: [{ ...searchResult, excerpt: fullEvidence }],
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
    expect(screen.getByText("근거 1 전체 문단").closest("details")).not.toHaveAttribute("open")
    expect(screen.getByText(fullEvidence)).not.toBeVisible()
    await act(async () => {
        userEvent.click(reference)
    })
    expect(screen.getByText("근거 1 전체 문단").closest("details")).toHaveAttribute("open")
    expect(screen.getByText("근거 1 전체 문단")).toHaveFocus()
    expect(screen.getByText(fullEvidence)).toBeVisible()
})

test("검색 결과를 먼저 보여주고 사용자가 요청한 뒤에만 AI 답변을 생성한다", async () => {
    searchPortfolioKnowledge.mockResolvedValue({
        query: "happyGallery 문제 해결 방법을 알려주세요.",
        total: 1,
        results: [searchResult],
    })
    generatePortfolioAnswer.mockResolvedValue({
        question: "happyGallery 문제 해결 방법을 알려주세요.",
        status: "GENERATED",
        answer: "결제 승인과 환불에 멱등 키를 적용해 같은 요청의 중복 처리를 막았습니다.",
        citations: [searchResult],
        results: [searchResult],
    })

    renderPage()

    await act(async () => {
        userEvent.selectOptions(screen.getByLabelText("프로젝트"), "happygallery")
    })
    await act(async () => {
        userEvent.selectOptions(screen.getByLabelText("문서 종류"), "problem_solution")
    })
    await act(async () => {
        userEvent.click(
            screen.getByRole("button", {
                name: "happyGallery 문제 해결 방법을 알려주세요.",
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
            query: "happyGallery 문제 해결 방법을 알려주세요.",
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
            question: "happyGallery 문제 해결 방법을 알려주세요.",
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

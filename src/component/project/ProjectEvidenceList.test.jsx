import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import ProjectEvidenceList from "./ProjectEvidenceList"
import ProjectCaseStudy from "./ProjectCaseStudy"

const proofs = [
    {
        item: "링크 생성 멱등성",
        method: "통합 테스트",
        rule: "같은 멱등 키로 동시에 요청해도 링크는 하나만 생성되어야 함",
        result: "동시 요청 8건에서 링크 1건 생성 확인",
        scope: "BATON GO",
    },
    {
        item: "결제 승인 재요청",
        method: "Testcontainers 기반 통합 테스트",
        rule: "PG 응답이 유실돼도 같은 결제 키로 중복 승인되지 않아야 함",
        result: "재요청 시 기존 승인 결과 반환 확인",
    },
]

test("확인 항목과 결과를 먼저 보여주고 방법 및 조건은 펼쳐서 확인한다", async () => {
    render(<ProjectEvidenceList proofs={proofs} label="테스트 방법 및 결과 목록" />)

    const list = screen.getByRole("list", { name: "테스트 방법 및 결과 목록" })
    const rows = within(list).getAllByRole("listitem")

    expect(rows).toHaveLength(2)
    const firstEvidence = rows[0].querySelector("details")
    const firstSummary = rows[0].querySelector("summary")

    expect(firstEvidence).not.toHaveAttribute("open")
    expect(firstSummary).toHaveTextContent("확인 항목")
    expect(firstSummary).toHaveTextContent("링크 생성 멱등성")
    expect(firstSummary).toHaveTextContent("확인 결과")
    expect(firstSummary).toHaveTextContent("동시 요청 8건에서 링크 1건 생성 확인")
    expect(firstSummary).toHaveTextContent("확인 범위")
    expect(firstSummary).toHaveTextContent("BATON GO")
    expect(firstSummary).not.toHaveTextContent("확인 방법 및 조건")
    expect(firstSummary).not.toHaveTextContent(
        "같은 멱등 키로 동시에 요청해도 링크는 하나만 생성되어야 함",
    )

    await userEvent.click(firstSummary)

    expect(firstEvidence).toHaveAttribute("open")
    expect(rows[0]).toHaveTextContent("확인 방법 및 조건")
    expect(rows[0]).toHaveTextContent("같은 멱등 키로 동시에 요청해도 링크는 하나만 생성되어야 함")
    expect(rows[0]).toHaveTextContent("BATON GO")
})

test("BATON 상세에서 서비스별 테스트 조건과 결과 바로가기를 보여준다", () => {
    render(
        <MemoryRouter>
            <ProjectCaseStudy projectId="baton" />
        </MemoryRouter>,
    )

    expect(screen.getByRole("link", { name: "테스트 및 결과" })).toHaveAttribute(
        "href",
        "#project-proof",
    )

    const list = screen.getByRole("list", { name: "검증 범위 및 현재 상태 목록" })
    const rows = within(list).getAllByRole("listitem")

    expect(rows).toHaveLength(7)
    expect(rows[0]).toHaveTextContent("Core 인수인계 상태 전이 및 중복 교대 차단")
    expect(rows[1]).toHaveTextContent("GO 링크 중복 생성 방지")
    expect(rows[1]).toHaveTextContent("같은 UUID와 요청으로 8건을 동시에 실행")
    expect(rows[1]).toHaveTextContent(
        "같은 UUID에 대한 공유 링크 1건과 링크 생성 처리 기록 1건만 DB에 저장",
    )
    expect(rows[4]).toHaveTextContent("BRIEF 운영 점검 목록 다시 생성과 주간 보고서 중복 생성 방지")
    expect(rows[5]).toHaveTextContent("CAL 일정 JSON 수신과 캘린더 구독")
    expect(rows[6]).toHaveTextContent("Core가 발급한 참여권 검증과 WebRTC 방 입장")
})

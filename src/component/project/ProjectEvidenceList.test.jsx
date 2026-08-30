import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ProjectEvidenceList from "./ProjectEvidenceList"
import { projectsById } from "../../data/projects"

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
    expect(firstSummary).toHaveTextContent("확인 방법")
    expect(firstSummary).toHaveTextContent("링크 생성 멱등성")
    expect(firstSummary).not.toHaveTextContent("확인 항목")
    expect(firstSummary).not.toHaveTextContent("확인 결과")
    expect(firstSummary).toHaveTextContent("동시 요청 8건에서 링크 1건 생성 확인")
    expect(firstSummary).not.toHaveTextContent("확인 범위")
    expect(firstSummary).not.toHaveTextContent("BATON GO")
    expect(firstSummary).not.toHaveTextContent("확인 방법 및 조건")
    expect(firstSummary).not.toHaveTextContent(
        "같은 멱등 키로 동시에 요청해도 링크는 하나만 생성되어야 함",
    )
    expect(within(rows[0]).queryByText("상세 결과")).not.toBeInTheDocument()
    expect(within(rows[0]).getAllByText(proofs[0].result)).toHaveLength(1)

    await userEvent.click(firstSummary)

    expect(firstEvidence).toHaveAttribute("open")
    expect(rows[0]).toHaveTextContent("확인 방법 및 조건")
    expect(rows[0]).toHaveTextContent("같은 멱등 키로 동시에 요청해도 링크는 하나만 생성되어야 함")
    expect(rows[0]).toHaveTextContent("확인 범위")
    expect(rows[0]).toHaveTextContent("BATON GO")
})

test("긴 결과는 성공과 실패를 함께 요약하고 원문 및 실행 조건은 펼쳐서 확인한다", async () => {
    render(
        <ProjectEvidenceList
            proofs={projectsById.baton.proofs}
            label="검증 범위 및 현재 상태 목록"
        />,
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
    expect(rows[4]).toHaveTextContent("BRIEF 운영 신호 반영과 발행 보고서 수정 방지")
    expect(rows[5]).toHaveTextContent("CAL 일정 JSON 수신과 캘린더 구독")
    expect(rows[6]).toHaveTextContent("ROUND 참여권 검증과 브라우저 연결")
    expect(rows[1].querySelector("summary")).toHaveTextContent("통합 테스트")
    expect(rows[6].querySelector("summary")).toHaveTextContent("CI 확인")
    expect(rows[6].querySelector("summary")).toHaveTextContent("Safari 실기기")
    expect(rows[6].querySelector("summary")).toHaveTextContent("미검증")
    const roundSummary = rows[6].querySelector("summary")
    const roundResult = within(rows[6]).getByText(projectsById.baton.proofs[6].result)

    expect(roundSummary).toHaveTextContent(
        "Chromium 및 Core 연동 통과, WebKit 1건 통과 및 2건 실패, 배포 검증 실패",
    )
    expect(roundSummary).not.toHaveTextContent("restic")
    expect(roundResult).not.toBeVisible()

    await userEvent.click(roundSummary)

    expect(roundResult).toBeVisible()
    expect(rows[6]).toHaveTextContent("상세 결과")
    expect(rows[6]).toHaveTextContent("restic 실행 파일 부재로 실패")
})

test("코드 대조와 기존 테스트 산출물을 구분하고 미검증 조건을 접기 전에 표시한다", () => {
    const selectedProofs = projectsById.happygallery.proofs.filter((proof) =>
        ["백엔드 테스트 산출물 집계", "스마트스토어 주문과 공유 재고 반영"].includes(proof.item),
    )
    render(<ProjectEvidenceList proofs={selectedProofs} label="근거 구분" />)

    const rows = within(screen.getByRole("list", { name: "근거 구분" })).getAllByRole("listitem")
    const artifactSummary = rows[0].querySelector("summary")
    const codeSummary = rows[1].querySelector("summary")

    expect(rows[0].querySelector("details")).not.toHaveAttribute("open")
    expect(artifactSummary).toHaveTextContent("기존 테스트 산출물")
    expect(artifactSummary).toHaveTextContent("전체 테스트나 CI를 다시 통과시켰다는 뜻은 아님")
    expect(codeSummary).toHaveTextContent("코드 대조")
    expect(codeSummary).toHaveTextContent("네이버 실제 자격 증명을 사용한 운영 연동은 미검증")
    expect(codeSummary).not.toHaveTextContent("통합 테스트")
    expect(rows[1]).toHaveTextContent(selectedProofs[1].method)
    expect(rows[1]).toHaveTextContent(selectedProofs[1].scope)
})

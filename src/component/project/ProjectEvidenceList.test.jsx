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

const getEvidenceRow = (list, item) =>
    within(list).getByText(item, { selector: "strong" }).closest("li")

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

test("서비스별 결과를 먼저 요약하고 최신 ROUND 근거와 실행 조건은 펼쳐서 확인한다", async () => {
    render(
        <ProjectEvidenceList
            proofs={projectsById.baton.proofs}
            label="검증 범위 및 현재 상태 목록"
        />,
    )

    const list = screen.getByRole("list", { name: "검증 범위 및 현재 상태 목록" })
    const rows = within(list).getAllByRole("listitem")
    const coreRow = getEvidenceRow(list, "Core 인수인계 상태 전이 및 중복 교대 차단")
    const goRow = getEvidenceRow(list, "GO 링크 중복 생성 방지")
    const briefRow = getEvidenceRow(list, "BRIEF 운영 신호 반영과 발행 보고서 수정 방지")
    const calRow = getEvidenceRow(list, "CAL 일정 JSON 수신과 캘린더 구독")
    const roundRow = getEvidenceRow(list, "ROUND 참여권 검증과 브라우저 연결")

    expect(rows).toHaveLength(7)
    expect(coreRow).toHaveTextContent("준비 → 전달 → 수락 순서 적용")
    expect(goRow).toHaveTextContent("GO 링크 중복 생성 방지")
    expect(goRow).toHaveTextContent("같은 UUID와 요청으로 8건을 동시에 실행")
    expect(goRow).toHaveTextContent(
        "같은 UUID에 대한 공유 링크 1건과 링크 생성 처리 기록 1건만 DB에 저장",
    )
    expect(briefRow).toHaveTextContent("Core 신호 반영")
    expect(calRow).toHaveTextContent("실제 운영 활성화와 공개 배포 전")
    expect(goRow.querySelector("summary")).toHaveTextContent("통합 테스트")

    const roundSummary = roundRow.querySelector("summary")
    const roundProof = projectsById.baton.proofs.find(
        (proof) => proof.item === "ROUND 참여권 검증과 브라우저 연결",
    )
    const roundResult = within(roundRow).getByText(roundProof.result)

    expect(roundSummary).toHaveTextContent("CI 확인")
    expect(roundSummary).toHaveTextContent("Safari 실기기")
    expect(roundSummary).toHaveTextContent("미검증")
    expect(roundSummary).not.toHaveTextContent("restic")
    expect(roundResult).not.toBeVisible()

    await userEvent.click(roundSummary)

    expect(roundResult).toBeVisible()
    expect(roundRow).toHaveTextContent("상세 결과")
    expect(roundRow).toHaveTextContent("WebKit 직접 연결용 mDNS")
    expect(roundRow).toHaveTextContent("배포 검증용 restic 설치")
    expect(roundRow).toHaveTextContent("시그널링 및 RTC 상태 책임을 분리")
    expect(roundRow).not.toHaveTextContent("restic 실행 파일 부재로 실패")
})

test("GitHub Actions 실행 결과와 코드 대조를 구분하고 외부 연동 한계를 먼저 표시한다", async () => {
    const selectedProofs = projectsById.happygallery.proofs.filter((proof) =>
        ["백엔드와 주요 화면 자동화", "스마트스토어 주문과 공유 재고 반영"].includes(proof.item),
    )
    render(<ProjectEvidenceList proofs={selectedProofs} label="근거 구분" />)

    const list = screen.getByRole("list", { name: "근거 구분" })
    const rows = within(list).getAllByRole("listitem")
    const automationRow = getEvidenceRow(list, "백엔드와 주요 화면 자동화")
    const smartStoreRow = getEvidenceRow(list, "스마트스토어 주문과 공유 재고 반영")
    const automationSummary = automationRow.querySelector("summary")
    const smartStoreSummary = smartStoreRow.querySelector("summary")

    expect(rows).toHaveLength(2)
    expect(automationRow.querySelector("details")).not.toHaveAttribute("open")
    expect(automationSummary).toHaveTextContent("백엔드 빌드와 브라우저 스모크 19개가 통과")
    expect(automationSummary).not.toHaveTextContent("기존 테스트 산출물")
    expect(smartStoreSummary).toHaveTextContent("코드 대조")
    expect(smartStoreSummary).toHaveTextContent("네이버 실제 자격 증명을 사용한 운영 연동은 미검증")
    expect(smartStoreSummary).not.toHaveTextContent("GitHub Actions")

    await userEvent.click(automationSummary)

    expect(automationRow.querySelector("details")).toHaveAttribute("open")
    expect(automationRow).toHaveTextContent("GitHub Actions 백엔드 빌드 및 브라우저 스모크")
    expect(automationRow).toHaveTextContent("주문, 결제, 예약 및 관리자 운영")
    expect(automationRow).toHaveTextContent("GitHub Actions run 33636984895")
    expect(smartStoreRow).toHaveTextContent(selectedProofs[1].method)
    expect(smartStoreRow).toHaveTextContent(selectedProofs[1].scope)
})

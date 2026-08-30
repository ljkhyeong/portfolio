import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Projects from "./Projects"

const renderProjects = () =>
    render(
        <MemoryRouter>
            <Projects />
        </MemoryRouter>,
    )

test("대표 프로젝트는 상태, 검증, 문서와 공개 범위를 같은 순서로 보여준다", () => {
    renderProjects()

    const batonEvidence = screen.getByLabelText("BATON 확인 근거")

    expect(batonEvidence).toHaveTextContent("상태개발 중")
    expect(batonEvidence).toHaveTextContent("검증서비스별 자동화 및 연동 테스트")
    expect(batonEvidence).toHaveTextContent("문서PRD 44 / ADR 63 / Runbook 7")
    expect(batonEvidence).toHaveTextContent("공개일부 저장소 공개")

    const warrantEvidence = screen.getByLabelText("전송형 전자영장 시스템 확인 근거")

    expect(warrantEvidence).toHaveTextContent("자료 변환 및 배치 단계 확인")
    expect(warrantEvidence).toHaveTextContent("내부 문서 비공개")
})

test("추가 프로젝트는 관계, 구현, 확인 근거와 상세 링크로 압축한다", () => {
    renderProjects()

    const supportingProjects = screen.getByRole("list", { name: "추가 프로젝트" })
    const defenseLink = within(supportingProjects).getByRole("link", {
        name: "차세대 군사법 정보 시스템 프로젝트 상세 보기",
    })
    const defenseProject = defenseLink.closest("article")

    expect(defenseProject).toHaveTextContent("경력 프로젝트")
    expect(defenseProject).toHaveTextContent("BEINTECH / 국방부 SI / 백엔드 개발 및 운영")
    expect(defenseProject).toHaveTextContent("구현")
    expect(defenseProject).toHaveTextContent(
        "군교정 업무 화면, 수용자 인적정보 및 영장정보 연계 배치",
    )
    expect(defenseProject).toHaveTextContent("기관별 배치 결과, JEUS 로그 및 Tibero 상태 확인")
    expect(defenseProject).toHaveTextContent("상세 보기")
    expect(defenseProject).not.toHaveTextContent("문제")
    expect(defenseProject).not.toHaveTextContent("해결")

    const flowCases = [
        ["차세대 군사법 정보 시스템", "기관 자료검증 배치업무 반영"],
        ["Hope Commit", "대상 커밋변경 줄HTML 리뷰"],
        ["IntentTrace", "커밋코드 줄 해시공개 판단"],
        ["WebRTC/HLS 현장강의 보조 서비스", "RTPHLS 변환다시보기"],
    ]

    flowCases.forEach(([title, flow]) => {
        expect(screen.getByRole("list", { name: `${title} 처리 흐름` })).toHaveTextContent(flow)
    })
})

test("BATON 서비스는 Core에서 분리된 하나의 서비스 맵으로 연결한다", () => {
    renderProjects()

    const serviceMap = screen.getByRole("navigation", { name: "BATON 마이크로서비스 상세" })
    const services = ["GO", "WATCH", "RELAY", "BRIEF", "CAL", "ROUND"]

    expect(serviceMap).toHaveTextContent("CORE")
    services.forEach((service) => {
        expect(
            within(serviceMap).getByRole("link", {
                name: `BATON ${service} 마이크로서비스 상세 보기`,
            }),
        ).toHaveAttribute("href", `/projects/baton/${service.toLowerCase()}`)
    })
})

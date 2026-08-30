import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Projects from "./Projects"

const renderProjects = () =>
    render(
        <MemoryRouter>
            <Projects />
        </MemoryRouter>,
    )

test("대표 프로젝트는 서비스 소개와 핵심 구현 두 가지를 먼저 보여준다", () => {
    renderProjects()

    const batonHighlights = screen.getByRole("list", { name: "BATON 핵심 구현" })
    expect(within(batonHighlights).getAllByRole("listitem")).toHaveLength(2)
    expect(batonHighlights).toHaveTextContent("Core와 6개 마이크로서비스의 API 및 데이터 분리")
    expect(batonHighlights).toHaveTextContent("링크와 전달 작업 중복 생성 방지")
    expect(
        screen.getByText("조직의 역할, 반복 업무와 인수인계를 관리하는 플랫폼입니다."),
    ).toBeInTheDocument()

    const batonStatus = screen.getByLabelText("BATON 진행 및 공개 상태")
    expect(batonStatus).toHaveTextContent("개발 중")
    expect(batonStatus).toHaveTextContent("일부 저장소 공개")
    expect(screen.queryByText("PRD 44 / ADR 63 / Runbook 7")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("BATON 담당, 문제와 해결")).not.toBeInTheDocument()
    expect(screen.getByLabelText("전송형 전자영장 시스템 진행 및 공개 상태")).toHaveTextContent(
        "담당 범위만 공개",
    )
})

test("상세 링크와 공개된 저장소 링크를 구분한다", () => {
    renderProjects()

    expect(screen.getByRole("link", { name: "BATON 프로젝트 상세 보기" })).toHaveAttribute(
        "href",
        "/projects/baton",
    )
    expect(
        screen.getByRole("link", { name: "BATON WATCH GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/baton-watch")
    expect(
        screen.getByRole("link", { name: "happyGallery GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/happyGallery")
    expect(
        screen.getByRole("link", { name: "Hope Commit GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/hope-commit")
    expect(screen.queryByRole("link", { name: /전자영장.*GitHub/ })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /군사법.*GitHub/ })).not.toBeInTheDocument()
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
    expect(supportingProjects).toHaveTextContent("SeungIl 님의 Hope 3.0.3 포크")
    expect(supportingProjects).toHaveTextContent("HLS 지연 약 35초 → 약 17초 (팀 시연 환경)")

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

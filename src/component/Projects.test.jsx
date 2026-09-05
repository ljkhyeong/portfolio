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
    expect(batonHighlights).toHaveTextContent(
        "할 일 관리, 담당자 공백 및 업무 지연 확인, 통합 검색, 인수인계 문서 생성",
    )
    expect(batonHighlights).toHaveTextContent("Core와 6개 마이크로서비스의 API 및 저장소 분리")
    expect(
        screen.getByText("조직의 역할, 반복 업무, 결정과 인수인계를 관리하는 플랫폼입니다."),
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

    const detailLink = screen.getByRole("link", { name: "BATON 프로젝트 상세 보기" })
    const repositoryLink = screen.getByRole("link", {
        name: "BATON WATCH GitHub 저장소 새 창에서 보기",
    })
    expect(detailLink).toHaveAttribute("href", "/projects/baton")
    expect(detailLink).not.toHaveAttribute("target")
    expect(repositoryLink).toHaveAttribute("href", "https://github.com/ljkhyeong/baton-watch")
    expect(repositoryLink).toHaveAttribute("target", "_blank")
    expect(repositoryLink).toHaveAttribute("rel", "noreferrer")
    expect(
        screen.getByRole("link", { name: "happyGallery GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/happyGallery")
    expect(
        screen.getByRole("link", { name: "Hope Commit GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/hope-commit")
    expect(screen.queryByRole("link", { name: /전자영장.*GitHub/ })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /군사법.*GitHub/ })).not.toBeInTheDocument()
})

test("추가 프로젝트는 구현, 확인 근거와 상세 링크로 표시한다", () => {
    renderProjects()

    const supportingProjects = screen.getByRole("list", { name: "추가 프로젝트" })
    const defenseLink = within(supportingProjects).getByRole("link", {
        name: "차세대 군사법 정보 시스템 프로젝트 상세 보기",
    })
    const defenseProject = defenseLink.closest("article")
    const youthPolicyLink = within(supportingProjects).getByRole("link", {
        name: "청년정책메이트 프로젝트 상세 보기",
    })
    const youthPolicyProject = youthPolicyLink.closest("article")

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
    expect(youthPolicyProject).toHaveTextContent("웹앱")
    expect(youthPolicyProject).toHaveTextContent(
        "제품 요구사항, Next.js 화면, Java 및 Spring Boot 서버",
    )
    expect(youthPolicyProject).toHaveTextContent(
        "공개 main CI 통과 및 서버 자동화 테스트 341개 통과",
    )
    expect(youthPolicyLink).toHaveAttribute("href", "/projects/youth-policy-mate")
    expect(supportingProjects).toHaveTextContent("SeungIl 님의 Hope 6.0.0 포크")
    expect(supportingProjects).toHaveTextContent("v5.0.2 공개 및 자동화 테스트 343개 통과")
    expect(supportingProjects).toHaveTextContent("HLS 지연 약 35초 → 약 17초 (팀 시연 환경)")

    expect(
        within(supportingProjects).queryByRole("list", { name: /처리 흐름/ }),
    ).not.toBeInTheDocument()
})

test("대표 프로젝트 순서를 유지하고 제목과 미리보기에서 상세로 이동한다", () => {
    renderProjects()

    expect(screen.getByRole("heading", { name: "대표 프로젝트", level: 2 })).toBeInTheDocument()
    expect(screen.queryByText("프로젝트", { exact: true })).not.toBeInTheDocument()
    const projects = within(screen.getByRole("list", { name: "대표 프로젝트" }))
    const headings = projects.getAllByRole("heading", { level: 3 })
    expect(headings.map((heading) => heading.textContent)).toEqual([
        "전송형 전자영장 시스템",
        "BATON",
        "happyGallery",
    ])
    expect(within(headings[1]).getByRole("link")).toHaveAttribute("href", "/projects/baton")
    expect(projects.getByRole("link", { name: "BATON 미리보기에서 상세 보기" })).toHaveAttribute(
        "href",
        "/projects/baton",
    )
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

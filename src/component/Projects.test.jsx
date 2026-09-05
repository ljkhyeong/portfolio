import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Projects from "./Projects"
import { projectSummaries } from "../data/projectSummaries"

const renderProjects = () =>
    render(
        <MemoryRouter>
            <Projects />
        </MemoryRouter>,
    )

test("대표 프로젝트의 문제, 구현과 검증 범위를 함께 보여준다", () => {
    renderProjects()

    const batonFacts = screen.getByLabelText("BATON 문제, 구현과 검증")
    expect(batonFacts).toHaveTextContent("링크와 전달 작업이 중복 생성될 수 있음")
    expect(batonFacts).toHaveTextContent("결과 미확인 전송은 자동 재시도하지 않음")
    expect(batonFacts).toHaveTextContent("공개 환경 전체 연동은 미검증")
    expect(screen.getByLabelText("happyGallery 문제, 구현과 검증")).toHaveTextContent(
        "실제 네이버 및 PG 계정 연동은 미검증",
    )
    expect(screen.getByLabelText("BATON 진행 및 공개 상태")).toHaveTextContent("일부 저장소 공개")
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

test("프로젝트 유형별로 빠짐없이 한 번씩 표시하고 바로가기를 연결한다", () => {
    renderProjects()

    const categories = [
        ["career", "경력 프로젝트", ["전송형 전자영장 시스템", "차세대 군사법 정보 시스템"]],
        ["web", "웹", ["BATON", "happyGallery", "WebRTC/HLS 현장강의 보조 서비스"]],
        ["mobile-webapp", "모바일 웹앱", ["청년정책메이트"]],
        ["plugin", "플러그인", ["IntentTrace"]],
        ["ai-skill", "AI 스킬", ["Hope Commit"]],
    ]
    const navigation = within(screen.getByRole("navigation", { name: "프로젝트 유형 바로가기" }))
    categories.forEach(([id, label, titles]) => {
        const group = screen.getByRole("region", { name: label })
        expect(group).toHaveAttribute("id", `projects-${id}`)
        expect(
            navigation.getByRole("link", { name: `${label} ${titles.length}개` }),
        ).toHaveAttribute("href", `#projects-${id}`)
        expect(
            within(group)
                .getAllByRole("heading", { level: 4 })
                .map((heading) => heading.textContent),
        ).toEqual(titles)
    })
    const detailLinks = screen.getAllByRole("link", { name: /프로젝트 상세 보기$/ })
    expect(detailLinks.map((link) => link.getAttribute("href")).sort()).toEqual(
        projectSummaries.map((project) => project.route).sort(),
    )
})

test("간단한 소개에도 진행 상태와 원작 포크 출처를 표시한다", () => {
    renderProjects()

    const youth = screen.getByRole("link", { name: "청년정책메이트 프로젝트 상세 보기" })
    expect(youth).toHaveAttribute("href", "/projects/youth-policy-mate")
    expect(youth.closest("article")).toHaveTextContent("개발 중")
    expect(youth.closest("article")).toHaveTextContent("모바일 웹앱을 개발합니다")
    expect(
        screen.getByRole("link", { name: "Hope Commit 프로젝트 상세 보기" }).closest("article"),
    ).toHaveTextContent("SeungIl 님의 Hope 6.0.0을 포크")
})

test("전자영장의 소속 회사와 컨소시엄 참여를 표시하고 제목과 미리보기를 연결한다", () => {
    renderProjects()

    const warrant = screen
        .getByRole("heading", { name: "전송형 전자영장 시스템", level: 4 })
        .closest("article")
    expect(warrant).toHaveTextContent("BEINTECH / 공공 SI")
    expect(warrant).toHaveTextContent("LG CNS 컨소시엄 참여")
    expect(warrant).toHaveTextContent("5개 기관 연계 시스템")
    expect(warrant).toHaveTextContent("법무부, 공수처, 검찰, 경찰, 해양경찰")
    const defense = screen
        .getByRole("heading", { name: "차세대 군사법 정보 시스템", level: 4 })
        .closest("article")
    expect(defense).toHaveTextContent("국방부 산하 4개 기관 연계 시스템")
    expect(defense).toHaveTextContent("군사법원, 군검찰, 군경찰, 군교정")
    const baton = screen.getByRole("heading", { name: "BATON", level: 4 })
    expect(within(baton).getByRole("link")).toHaveAttribute("href", "/projects/baton")
    expect(screen.getByRole("link", { name: "BATON 미리보기에서 상세 보기" })).toHaveAttribute(
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

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

// 검증 범위는 상세 화면과 같은 검증 단계로 보여 주고, 미검증 단계도 글자로 표시한다.
test("대표 프로젝트의 문제, 구현과 검증 단계를 함께 보여준다", () => {
    renderProjects()

    const batonFacts = screen.getByLabelText("BATON 문제, 구현과 검증")
    expect(batonFacts).toHaveTextContent("링크와 전달 작업이 중복 생성될 수 있음")
    expect(batonFacts).toHaveTextContent("결과 미확인 건은 자동 재전송하지 않음")
    const batonStages = within(batonFacts)
        .getAllByRole("listitem")
        .map((stage) => stage.textContent)
    expect(batonStages).toEqual([
        expect.stringMatching(/^구현확인됨/),
        expect.stringMatching(/^자동화 테스트확인됨/),
        expect.stringMatching(/^서비스 연동제한된 범위에서 확인/),
        expect.stringMatching(/^공개 환경 연동미검증/),
    ])
    expect(screen.getByLabelText("happyGallery 검증 단계")).toHaveTextContent(
        "외부 계정 연동미검증네이버·Toss·NHN 실제 계정",
    )
    expect(screen.getByLabelText("BATON 진행 및 공개 상태")).toHaveTextContent("공개 저장소 6개")
})

test("상세 링크와 공개된 저장소 링크를 구분한다", () => {
    renderProjects()

    const detailLink = screen.getByRole("link", { name: "BATON 프로젝트 상세 보기" })
    const repositoryLink = screen.getByRole("link", {
        name: "BATON GitHub 저장소 새 창에서 보기",
    })
    expect(detailLink).toHaveAttribute("href", "/projects/baton")
    expect(detailLink).not.toHaveAttribute("target")
    expect(detailLink).toHaveTextContent("상세 보기 →")
    expect(repositoryLink).toHaveAttribute("href", "https://github.com/ljkhyeong/baton")
    expect(repositoryLink).toHaveAttribute("target", "_blank")
    expect(repositoryLink).toHaveAttribute("rel", "noreferrer")
    expect(repositoryLink).toHaveTextContent("GitHub ↗")
    expect(
        screen.getByRole("link", { name: "happyGallery GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/happyGallery")
    expect(
        screen.getByRole("link", { name: "Hope Commit GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/hope-commit")
    expect(screen.queryByRole("link", { name: /전자영장.*GitHub/ })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /군사법.*GitHub/ })).not.toBeInTheDocument()
})

// 경력 프로젝트는 메인 상단 경력 영역에서 한 번만 보여 준다.
test("개인과 그 밖의 프로젝트를 빠짐없이 한 번씩 표시하고 경력 프로젝트는 반복하지 않는다", () => {
    renderProjects()

    expect(screen.queryByRole("region", { name: "경력 프로젝트" })).not.toBeInTheDocument()
    const categories = [
        ["personal", "개인 프로젝트", ["BATON", "happyGallery"]],
        [
            "more",
            "그 밖의 프로젝트",
            ["청년정책메이트", "Hope Commit", "IntentTrace", "WebRTC/HLS 현장강의 보조 서비스"],
        ],
    ]
    categories.forEach(([id, label, titles]) => {
        const group = screen.getByRole("region", { name: label })
        expect(group).toHaveAttribute("id", `projects-${id}`)
        expect(within(group).getByText(`${titles.length}개`)).toBeInTheDocument()
        expect(
            within(group)
                .getAllByRole("heading", { level: 4 })
                .map((heading) => heading.textContent),
        ).toEqual(titles)
    })
    const detailLinks = screen.getAllByRole("link", { name: /프로젝트 상세 보기$/ })
    expect(detailLinks.map((link) => link.getAttribute("href")).sort()).toEqual(
        projectSummaries
            .filter((project) => project.homeCategory !== "career")
            .map((project) => project.route)
            .sort(),
    )
})

test("간단한 소개에도 유형, 진행 상태와 원작 포크 출처를 표시한다", () => {
    renderProjects()

    const articleOf = (title) =>
        screen.getByRole("link", { name: `${title} 프로젝트 상세 보기` }).closest("article")
    const youth = screen.getByRole("link", { name: "청년정책메이트 프로젝트 상세 보기" })
    expect(youth).toHaveAttribute("href", "/projects/youth-policy-mate")
    expect(youth.closest("article")).toHaveTextContent("모바일 웹앱 / 개발 중")
    expect(youth.closest("article")).toHaveTextContent("웹앱입니다")
    expect(articleOf("IntentTrace")).toHaveTextContent("IDE 플러그인")
    expect(articleOf("Hope Commit")).toHaveTextContent("AI 스킬")
    expect(articleOf("Hope Commit")).toHaveTextContent("SeungIl 님의 Hope 6.0.0을 포크")
})

test("프로젝트 제목을 상세로 연결한다", () => {
    renderProjects()

    const baton = screen.getByRole("heading", { name: "BATON", level: 4 })
    expect(within(baton).getByRole("link")).toHaveAttribute("href", "/projects/baton")
})

test("BATON 서비스는 Core에서 분리된 하나의 서비스 맵으로 연결한다", () => {
    renderProjects()

    const serviceMap = screen.getByRole("navigation", { name: "BATON 마이크로서비스 상세" })
    const services = ["GO", "WATCH", "RELAY", "BRIEF", "CAL", "ROUND"]

    expect(serviceMap).toHaveTextContent("Core")
    expect(serviceMap).toHaveTextContent("조직, 역할 및 인수인계")
    services.forEach((service) => {
        expect(
            within(serviceMap).getByRole("link", {
                name: `BATON ${service} 마이크로서비스 상세 보기`,
            }),
        ).toHaveAttribute("href", `/projects/baton/${service.toLowerCase()}`)
    })
})

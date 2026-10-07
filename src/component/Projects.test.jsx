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

const articleOf = (title) =>
    screen.getByRole("link", { name: `${title} 프로젝트 상세 보기` }).closest("article")

// 개인 프로젝트는 실제 화면, 소개, 해결한 문제와 확인한 범위를 한 카드에 둔다.
test("개인 프로젝트는 실제 화면과 촬영 조건, 확인한 범위를 함께 보여준다", () => {
    renderProjects()

    const baton = articleOf("BATON")
    expect(within(baton).getByRole("img", { name: /BATON 할 일 화면/ })).toHaveAttribute(
        "src",
        expect.stringContaining("baton-core-today.webp"),
    )
    expect(baton).toHaveTextContent("내 할 일 테스트 데이터로 찍은 화면")
    expect(baton).toHaveTextContent("링크 생성과 외부 전송을 한 번만 실행합니다")
    expect(baton).toHaveTextContent("확인한 범위")
    expect(baton).toHaveTextContent("아직 확인하지 않았습니다")
    expect(baton).toHaveTextContent("2026.07 — 현재, 개발 중, 공개 저장소 6개")

    const gallery = articleOf("happyGallery")
    expect(gallery).toHaveTextContent("E2E 테스트용 모의 응답으로 찍은 화면")
    expect(gallery).toHaveTextContent("네이버, Toss, NHN 실제 계정 연동은 아직 확인하지 않았습니다")
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

// 경력 프로젝트는 메인 경력 영역에서 한 번만 보여 준다.
test("개인과 그 밖의 프로젝트를 빠짐없이 한 번씩 표시하고 경력 프로젝트는 반복하지 않는다", () => {
    renderProjects()

    const categories = [
        ["work", "개인 프로젝트", ["BATON", "happyGallery"]],
        [
            "more",
            "그 밖의 프로젝트",
            ["청년정책메이트", "Hope Commit", "IntentTrace", "WebRTC/HLS 현장강의 보조 서비스"],
        ],
    ]
    categories.forEach(([id, label, titles]) => {
        const group = screen.getByRole("region", { name: label })
        expect(group).toHaveAttribute("id", id)
        expect(
            within(group)
                .getAllByRole("heading", { level: 3 })
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

test("그 밖의 프로젝트에도 기간, 확인한 범위와 원작 포크 출처를 표시한다", () => {
    renderProjects()

    const youth = articleOf("청년정책메이트")
    expect(youth).toHaveTextContent("2026.08 — 현재")
    expect(youth).toHaveTextContent("웹앱입니다")
    expect(youth).toHaveTextContent("OAuth, OpenAI, Resend 운영 연동은 아직 확인하지 않았습니다")
    expect(articleOf("Hope Commit")).toHaveTextContent("SeungIl 님의 Hope 6.0.0을 포크")
    expect(articleOf("Hope Commit")).toHaveTextContent("v5.0.2로 공개 릴리스했고")
    // 화면 캡처가 없는 교육 프로젝트는 맡은 처리 흐름을 글자로 보여 준다.
    expect(
        within(articleOf("WebRTC/HLS 현장강의 보조 서비스")).getByRole("img", {
            name: "RTP → HLS → React",
        }),
    ).toBeInTheDocument()
})

test("프로젝트 제목을 상세로 연결한다", () => {
    renderProjects()

    const baton = screen.getByRole("heading", { name: "BATON", level: 3 })
    expect(within(baton).getByRole("link")).toHaveAttribute("href", "/projects/baton")
})

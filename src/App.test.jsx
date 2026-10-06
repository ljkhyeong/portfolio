import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import App from "./App"
import { homeHeroContent } from "./data/homeHero"
import { projectsById } from "./data/projects"

const lazyRouteLoadOptions = { timeout: 30000 }

test("프로젝트 목록을 확인하고 BATON 상세로 이동할 수 있다", async () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.getByRole("contentinfo")).toHaveTextContent("jolri24@naver.com")
    const heroHeading = screen.getByRole("heading", { level: 1 })

    expect(heroHeading).toHaveTextContent(homeHeroContent.headline)
    expect(screen.getByText(homeHeroContent.summary)).toBeInTheDocument()
    expect(screen.getByRole("region", { name: "경력" })).toHaveTextContent(
        "BEINTECH 백엔드 개발자, 2024년 6월부터",
    )
    // 첫 화면 연표는 실제 기간과 확인한 결과를 함께 보여 준다.
    const timeline = screen.getByRole("figure", { name: /지금까지 한 일의 연표/ })
    expect(
        within(within(timeline).getByRole("group", { name: "경력 기간" })).getAllByRole("link"),
    ).toHaveLength(2)
    expect(timeline).toHaveTextContent(
        "성능 테스트 환경에서 100 RPS·300 TPS로 1시간 동안 모두 처리",
    )
    expect(document.title).toBe("임정규 | 백엔드 개발자")

    const projects = screen.getByRole("region", { name: "개인 프로젝트" })
    const more = screen.getByRole("region", { name: "그 밖의 프로젝트" })

    expect(
        within(projects).getByRole("link", { name: "happyGallery 프로젝트 상세 보기" }),
    ).toBeInTheDocument()
    ;["Hope Commit", "IntentTrace", "WebRTC/HLS 현장강의 보조 서비스"].forEach((title) =>
        expect(
            within(more).getByRole("link", { name: `${title} 프로젝트 상세 보기` }),
        ).toBeInTheDocument(),
    )
    expect(
        within(more).getByRole("link", { name: "청년정책메이트 프로젝트 상세 보기" }),
    ).toHaveAttribute("href", "/projects/youth-policy-mate")
    fireEvent.click(within(projects).getByRole("link", { name: "BATON 프로젝트 상세 보기" }))

    const detailHeading = await screen.findByRole(
        "heading",
        { name: "BATON", level: 1 },
        lazyRouteLoadOptions,
    )

    expect(detailHeading).toBeInTheDocument()
    await waitFor(() => expect(document.activeElement).toBe(detailHeading))
    expect(document.title).toBe("BATON | 임정규 포트폴리오")
    expect(
        screen.getByRole("heading", {
            name: projectsById.baton.architecture.title,
        }),
    ).toBeInTheDocument()
}, 15000)

// 경력 프로젝트는 경력 영역의 제목 링크로, 나머지는 프로젝트 카드의 상세 보기 링크로 연결한다.
const projectLinkCases = [
    ["BATON", "/projects/baton", "BATON 프로젝트 상세 보기"],
    ["전송형 전자영장 시스템", "/projects/e-warrant", "전송형 전자영장 시스템"],
    ["happyGallery", "/projects/happygallery", "happyGallery 프로젝트 상세 보기"],
    ["Hope Commit", "/projects/hope-commit", "Hope Commit 프로젝트 상세 보기"],
    ["IntentTrace", "/projects/intent-trace", "IntentTrace 프로젝트 상세 보기"],
    ["청년정책메이트", "/projects/youth-policy-mate", "청년정책메이트 프로젝트 상세 보기"],
    ["차세대 군사법 정보 시스템", "/projects/defense", "차세대 군사법 정보 시스템"],
    [
        "WebRTC/HLS 현장강의 보조 서비스",
        "/projects/webrtc",
        "WebRTC/HLS 현장강의 보조 서비스 프로젝트 상세 보기",
    ],
]

test("상세에서 프로젝트 목록으로 돌아가면 해당 섹션으로 스크롤하고 포커스를 옮긴다", async () => {
    window.history.pushState({}, "", "/projects/baton")
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView
    const scrollIntoView = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoView

    try {
        render(<App />)
        await screen.findByRole("heading", { name: "BATON", level: 1 }, lazyRouteLoadOptions)

        fireEvent.click(screen.getByRole("link", { name: "프로젝트 목록" }))

        const work = await screen.findByRole("region", { name: "개인 프로젝트" })
        await waitFor(() => expect(work).toHaveFocus())
        expect(window.location.pathname).toBe("/")
        expect(window.location.hash).toBe("#work")
        expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" })
        expect(scrollIntoView.mock.contexts).toContain(work)
    } finally {
        if (originalScrollIntoView) {
            HTMLElement.prototype.scrollIntoView = originalScrollIntoView
        } else {
            delete HTMLElement.prototype.scrollIntoView
        }
    }
})

test("프로필 사진과 실명을 포트폴리오 식별 정보로 사용한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const brand = screen.getByRole("link", { name: "임정규 포트폴리오 홈" })
    const avatar = brand.querySelector("img")
    const navigation = screen.getByRole("navigation", { name: "주요 메뉴" })
    const pdfDownload = within(navigation).getByRole("link", { name: "이력서 PDF 내려받기" })

    expect(brand).toHaveTextContent("임정규")
    expect(avatar).toHaveAttribute("src", expect.stringContaining("ljkhyeong-avatar.png"))
    expect(avatar).toHaveAttribute("alt", "")
    expect(screen.getByRole("img", { name: "임정규 프로필 사진" })).toHaveAttribute(
        "src",
        expect.stringContaining("ljkhyeong-avatar.png"),
    )
    expect(decodeURI(pdfDownload.getAttribute("href"))).toBe("/임정규_포트폴리오.pdf")
    expect(pdfDownload).toHaveAttribute("download")
    expect(brand).toHaveAttribute("href", "#top")
    expect(within(navigation).getByRole("link", { name: "개인 프로젝트" })).toHaveAttribute(
        "href",
        "#work",
    )
    expect(within(navigation).getByRole("link", { name: "문서 검색" })).toHaveAttribute(
        "href",
        "/search",
    )
})

// 구현 사례는 프로젝트에서 설명하므로 기술은 이름만 나열한다.
test("기술은 묶음별 기술 이름만 보여주고 AI 활용 적용 사례를 연결한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const skills = within(
        within(screen.getByRole("region", { name: "학습과 기술" })).getByRole("list", {
            name: "기술",
        }),
    )
    const headings = skills
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent)

    expect(headings).toEqual(["백엔드", "테스트와 운영", "AI 활용", "프론트엔드"])
    expect(
        skills.getByText(/Java, Spring Boot, Spring MVC, Spring Batch, JPA, MyBatis/),
    ).toBeInTheDocument()
    expect(skills.getByText(/Jenkins, JEUS, Tibero/)).toBeInTheDocument()
    expect(skills.getByRole("link", { name: /happyGallery 적용 사례/ })).toHaveAttribute(
        "href",
        "/projects/happygallery#project-problems",
    )
})

test.each(projectLinkCases)("%s 목록이 %s 상세를 연결한다", (project, route, linkName) => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.getByRole("link", { name: linkName })).toHaveAttribute("href", route)
})

// 처리 순서, 문서와 BATON 서비스 구성은 상세에서 보여 주고 메인에서 반복하지 않는다.
test("메인은 상세의 문제 해결, 문서와 서비스 구성을 반복하지 않는다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.queryByRole("heading", { name: "문제와 해결 방법" })).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "대표 문서" })).not.toBeInTheDocument()
    expect(
        screen.queryByRole("navigation", { name: "BATON 마이크로서비스 상세" }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole("region", { name: "경력" })).toHaveTextContent(
        "SKIP LOCKED로 다른 서버가 잡은 작업은 건너뛰게 하고",
    )
})

// 교육 프로젝트 설명은 그 밖의 프로젝트에 있으므로 학습에는 과정과 팀 프로젝트 링크만 둔다.
test("학습은 교육 과정과 그룹 스터디를 보여주고 팀 프로젝트와 기록을 연결한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const section = screen.getByRole("region", { name: "학습과 기술" })
    const learning = within(within(section).getByRole("list", { name: "교육과 그룹 스터디" }))
    const educationRow = learning
        .getByRole("heading", { name: "카카오 클라우드 스쿨 개발자 과정 3기", level: 3 })
        .closest("li")

    expect(screen.getByRole("region", { name: "경력" }).compareDocumentPosition(section)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(educationRow).toHaveTextContent("2023.05 — 2023.11")
    expect(educationRow).toHaveTextContent("팀 프로젝트로 WebRTC/HLS 현장강의 보조 서비스")
    expect(within(educationRow).getByRole("link", { name: /프로젝트 보기/ })).toHaveAttribute(
        "href",
        "/projects/webrtc",
    )
    expect(
        learning.getByRole("link", { name: "LnS 발표 및 Q&A 기록 보기 (새 창)" }),
    ).toHaveAttribute(
        "href",
        "https://www.notion.so/LnS-Learn-Share-b3782d6639408242904501146ebbdfdf",
    )
    expect(
        learning.getByRole("link", { name: "Effective Java 학습 기록 보기 (새 창)" }),
    ).toHaveAttribute("href", "https://www.notion.so/2bb82d6639408021aa64da7cb536ab64")
    expect(section).not.toHaveTextContent("BEINTECH")
})

test("경력은 메인 한 곳에서 회사, 기간, 맡은 일과 상세 링크를 보여준다", () => {
    window.history.pushState({}, "", "/")
    render(<App />)

    const summary = screen.getByRole("region", { name: "경력" })
    const projects = screen.getByRole("region", { name: "개인 프로젝트" })
    const currentCareer = within(summary).getByRole("heading", {
        name: "전송형 전자영장 시스템",
        level: 3,
    })
    const previousCareer = within(summary).getByRole("heading", {
        name: "차세대 군사법 정보 시스템",
        level: 3,
    })
    const [currentRow, previousRow] = Array.from(
        within(summary).getByRole("list", { name: "BEINTECH 수행 프로젝트" }).children,
    )

    expect(summary.compareDocumentPosition(projects)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(summary).toHaveTextContent("BEINTECH 백엔드 개발자, 2024년 6월부터")
    expect(currentRow).toHaveTextContent("2026.03 — 현재, 진행 중")
    expect(currentRow).toHaveTextContent("LG CNS 컨소시엄 참여, 5개 기관 연계 시스템")
    expect(previousRow).toHaveTextContent("2024.06 — 2026.01, 종료")
    expect(previousRow).toHaveTextContent("국방부 산하 4개 기관 연계 시스템")
    expect(currentCareer.compareDocumentPosition(previousCareer)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(within(currentCareer).getByRole("link")).toHaveAttribute("href", "/projects/e-warrant")
    expect(within(previousCareer).getByRole("link")).toHaveAttribute("href", "/projects/defense")
    // 측정 결과는 첫 화면 연표에만 두고 경력 카드에서 반복하지 않는다.
    expect(summary).not.toHaveTextContent("100 RPS·300 TPS")
    expect(within(projects).queryByText("전송형 전자영장 시스템")).not.toBeInTheDocument()
    expect(within(projects).queryByText("차세대 군사법 정보 시스템")).not.toBeInTheDocument()
})

const canonicalRouteCases = [
    ["/projects/baton/go", "GO", "BATON GO | 임정규 포트폴리오"],
    ["/projects/baton/watch", "WATCH", "BATON WATCH | 임정규 포트폴리오"],
    ["/projects/baton/relay", "RELAY", "BATON RELAY | 임정규 포트폴리오"],
    ["/projects/baton/brief", "BRIEF", "BATON BRIEF | 임정규 포트폴리오"],
    ["/projects/baton/cal", "CAL", "BATON CAL | 임정규 포트폴리오"],
    ["/projects/baton/round", "ROUND", "BATON ROUND | 임정규 포트폴리오"],
    ["/projects/happygallery", "happyGallery", "happyGallery | 임정규 포트폴리오"],
    ["/projects/hope-commit", "Hope Commit", "Hope Commit | 임정규 포트폴리오"],
    ["/projects/intent-trace", "IntentTrace", "IntentTrace | 임정규 포트폴리오"],
    ["/projects/youth-policy-mate", "청년정책메이트", "청년정책메이트 | 임정규 포트폴리오"],
    ["/projects/e-warrant", "전송형 전자영장 시스템", "전송형 전자영장 시스템 | 임정규 포트폴리오"],
    [
        "/projects/defense",
        "차세대 군사법 정보 시스템",
        "차세대 군사법 정보 시스템 | 임정규 포트폴리오",
    ],
    [
        "/projects/webrtc",
        "WebRTC/HLS 현장강의 보조 서비스",
        "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
    ],
]

test.each(canonicalRouteCases)(
    "%s 직접 진입 시 %s 상세를 열고 탐색 순서를 강제로 바꾸지 않는다",
    async (path, heading, title) => {
        window.history.pushState({}, "", path)

        render(<App />)

        const detailHeading = await screen.findByRole(
            "heading",
            { name: heading, level: 1 },
            lazyRouteLoadOptions,
        )

        expect(detailHeading).toBeInTheDocument()
        expect(detailHeading).not.toHaveFocus()
        await waitFor(() => expect(document.title).toBe(title))
    },
)

test("끝 슬래시가 붙은 상세 주소도 정식 메타데이터와 canonical을 유지한다", async () => {
    window.history.pushState({}, "", "/projects/happygallery/")

    render(<App />)

    expect(
        await screen.findByRole(
            "heading",
            { name: "happyGallery", level: 1 },
            lazyRouteLoadOptions,
        ),
    ).toBeInTheDocument()
    await waitFor(() => expect(document.title).toBe("happyGallery | 임정규 포트폴리오"))
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "index, follow",
    )
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://ljkportfolio.netlify.app/projects/happygallery/",
    )
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute(
        "content",
        "https://ljkportfolio.netlify.app/projects/happygallery/",
    )
})

const legacyRouteCases = [
    [
        "/project2",
        "/projects/webrtc",
        "WebRTC/HLS 현장강의 보조 서비스",
        "WebRTC/HLS 현장강의 보조 서비스 | 임정규 포트폴리오",
    ],
    ["/project3", "/projects/happygallery", "happyGallery", "happyGallery | 임정규 포트폴리오"],
    [
        "/project4",
        "/projects/defense",
        "차세대 군사법 정보 시스템",
        "차세대 군사법 정보 시스템 | 임정규 포트폴리오",
    ],
    ["/project-baton", "/projects/baton", "BATON", "BATON | 임정규 포트폴리오"],
]

test.each(legacyRouteCases)(
    "%s 구주소를 %s 정식 주소로 이동한다",
    async (path, canonicalPath, heading, title) => {
        window.history.pushState({}, "", path)

        render(<App />)

        expect(
            await screen.findByRole("heading", { name: heading, level: 1 }, lazyRouteLoadOptions),
        ).toBeInTheDocument()
        await waitFor(() => expect(window.location.pathname).toBe(canonicalPath))
        expect(document.title).toBe(title)
    },
)

test("대표 프로젝트 상세에서 최신 화면, 아키텍처와 복구 결정을 확인할 수 있다", async () => {
    window.history.pushState({}, "", "/projects/happygallery")

    render(<App />)

    expect(
        await screen.findByRole("heading", { name: "구현 방법과 선택 이유" }, lazyRouteLoadOptions),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "결제 및 환불 재요청의 중복 처리 방지",
        }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/NHN 접수 ID로 최종 수신 결과/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/미전송 알림/).length).toBeGreaterThan(0)
    expect(
        screen.getByRole("img", {
            name: "happyGallery 상품 상세에서 색상과 각인 옵션을 선택하고 조합별 가격과 재고를 확인하는 모습",
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: "선택한 상품만 주문하고 미선택 상품은 장바구니에 보관하는 화면",
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: "happyGallery 관리자 화면에서 결과가 확정되지 않은 스마트스토어 요청을 확인하는 모습",
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: "happyGallery 관리자 화면에서 자사몰 옵션 조합을 스마트스토어 옵션에 연결하고 변경 이력을 확인하는 모습",
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: "happyGallery 클래스 목록에서 수업과 예약 회차를 확인하는 모습",
        }),
    ).toBeInTheDocument()
    expect(screen.getByText(/카드는 Toss 통합 결제창/)).toBeInTheDocument()
    expect(
        screen.getByRole("link", {
            name: /업무 규칙과 웹 및 DB 코드 분리 대표 문서 새 창에서 보기/,
        }),
    ).toHaveAttribute("href", expect.stringContaining("ADR/0021"))
    expect(screen.getAllByText("적용 범위와 제약").length).toBeGreaterThan(0)
})

test("청년정책메이트 상세는 웹앱 구현 화면과 미구현 외부 기능을 구분한다", async () => {
    window.history.pushState({}, "", "/projects/youth-policy-mate")

    render(<App />)

    expect(
        await screen.findByRole(
            "heading",
            { name: "청년정책메이트", level: 1 },
            lazyRouteLoadOptions,
        ),
    ).toBeInTheDocument()

    // 조건 질문 화면은 조건 판정 사례 옆에 두고 대표 화면 묶음에서는 뺀다.
    const screenshots = screen.getByRole("group", { name: "청년정책메이트 대표 화면" })
    const conditionScreen = screen.getByRole("group", { name: "청년정책메이트 관련 화면" })
    expect(within(screenshots).getAllByRole("img")).toHaveLength(3)
    expect(
        within(screenshots).getByRole("img", {
            name: "조건 입력과 공개 정책 탐색을 시작하는 청년정책메이트 홈",
        }),
    ).toBeInTheDocument()
    expect(
        within(screenshots).getByRole("img", {
            name: "공개 정책 40건을 접수 상태와 질문 제공 여부로 검색하는 화면",
        }),
    ).toBeInTheDocument()
    expect(
        within(screenshots).getByRole("img", {
            name: "청년내일저축계좌 상세에서 지원 내용과 공식 공고와의 차이를 확인하는 화면",
        }),
    ).toBeInTheDocument()
    expect(
        within(conditionScreen).getByRole("img", {
            name: "햇살론유스 조건 질문으로 연령, 이용 대상, 소득 조건을 확인하는 화면",
        }),
    ).toBeInTheDocument()
    expect(screenshots).toHaveAccessibleDescription(/온통청년에서 수집해 저장한 공개 데이터/)
    expect(
        screen.getByText(/OAuth, OpenAI, Resend 운영 연동은 아직 확인하지 않았습니다/),
    ).toBeInTheDocument()
})

test("Hope Commit 상세는 원본 포크와 직접 추가한 커밋 검토 범위를 구분한다", async () => {
    window.history.pushState({}, "", "/projects/hope-commit")

    render(<App />)

    expect(
        await screen.findByRole("heading", { name: "Hope Commit", level: 1 }, lazyRouteLoadOptions),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/SeungIl 님이 개발한 Hope 6\.0\.0/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/제가 추가한 Commit Diff/).length).toBeGreaterThan(0)
    expect(
        screen.getByRole("heading", {
            name: "지정한 커밋의 diff만 리뷰",
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: /Hope Commit의 커밋 검토 및 저장 흐름.*입력한 커밋을 확정하고 일반, 최초 및 병합 커밋별 비교 기준/,
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByText(/입력한 커밋과 확정한 비교 기준 사이의 변경만 읽고/),
    ).toBeInTheDocument()
    expect(screen.getByText("사용자가 고른 부모")).toBeInTheDocument()
    expect(screen.getByText("저장하지 않고 중단")).toBeInTheDocument()
    expect(screen.getByRole("region", { name: "확인한 범위" })).toHaveTextContent(
        /v5\.0\.2.*GitHub Actions에서 자동화 테스트 343개가 통과/,
    )
    expect(
        screen.getByRole("link", { name: "Hope Commit GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/hope-commit")
    expect(
        screen.getByText(
            /개인 커밋 검토 용도에 맞게 보완한 비공식 포크입니다.*원본 Hope 프로젝트는 이 포크를 공식적으로 보증하거나 유지보수하지 않습니다/,
        ),
    ).toBeInTheDocument()
})

test("BATON 마이크로서비스 상세는 입력과 처리 결과, 문제 해결과 문서를 분리해 보여준다", async () => {
    window.history.pushState({}, "", "/projects/baton/watch")

    render(<App />)

    expect(
        await screen.findByRole("heading", { name: "WATCH", level: 1 }, lazyRouteLoadOptions),
    ).toBeInTheDocument()
    expect(screen.getByText("BATON / MICROSERVICE")).toBeInTheDocument()
    expect(
        screen.getByText(
            "사설망 접근을 차단하고, 공개 URL의 응답 상태와 헤더로 연결 상태를 점검합니다. 상태 변경은 Core로 전달합니다.",
        ),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "처리 흐름", level: 2 })).toBeInTheDocument()
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
        "content",
        "https://ljkportfolio.netlify.app/og/baton-watch.png",
    )
    expect(document.querySelector('meta[property="og:image:alt"]')).toHaveAttribute(
        "content",
        "BATON WATCH의 핵심 처리 흐름",
    )
    expect(screen.getByRole("heading", { name: "문제와 해결 방법" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "대표 문서" })).toBeInTheDocument()
    expect(screen.getByText("공개 저장소")).toBeInTheDocument()
    expect(screen.getByText("URL 점검 중 DB 연결 반환과 늦은 결과 차단")).toBeInTheDocument()
    expect(screen.queryByText("HMAC 키와 링크 데이터의 복구 시점 일치")).not.toBeInTheDocument()
    expect(screen.queryByText("전송 결과 미확인 시 중복 발송 방지")).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: /WATCH 상태 변경 이벤트 전달/ })).toHaveAttribute(
        "href",
        expect.stringContaining("baton-watch"),
    )
})

test("WebRTC/HLS 상세는 담당 흐름, 문제 해결과 확인 결과를 보여준다", async () => {
    window.history.pushState({}, "", "/projects/webrtc")

    render(<App />)

    expect(
        await screen.findByRole(
            "heading",
            { name: "WebRTC/HLS 현장강의 보조 서비스" },
            lazyRouteLoadOptions,
        ),
    ).toBeInTheDocument()
    expect(screen.getAllByText("교육 프로젝트").length).toBeGreaterThan(0)
    expect(
        screen.getByRole("img", {
            name: /강의 영상을 WebRTC 실시간 시청과 HLS 다시보기로 분리.*mediasoup.*RTP.*FFmpeg.*GStreamer/,
        }),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "문제와 해결 방법" })).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "HLS 다시보기 재생 지연을 약 35초에서 약 17초로 단축",
        }),
    ).toBeInTheDocument()
})

test("인쇄본은 현재 웹 포트폴리오의 구성과 링크를 그대로 렌더링한다", async () => {
    window.history.pushState({}, "", "/portfolio/print")
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => undefined)

    render(<App />)

    const printDocument = await waitFor(() => {
        const element = document.querySelector(".portfolio-web-print__document .portfolio-page")
        expect(element).toBeInTheDocument()
        return element
    }, lazyRouteLoadOptions)

    await waitFor(() => expect(document.title).toBe("인쇄용 포트폴리오 | 임정규"))
    expect(screen.getByText("웹 포트폴리오의 인쇄용 페이지")).toBeInTheDocument()
    expect(document.querySelectorAll("[data-print-page]")).toHaveLength(0)
    expect(within(printDocument).getByRole("heading", { level: 1 })).toHaveTextContent(
        homeHeroContent.headline,
    )
    ;["경력", "개인 프로젝트", "그 밖의 프로젝트", "학습과 기술"].forEach((name) =>
        expect(within(printDocument).getByRole("heading", { name, level: 2 })).toBeInTheDocument(),
    )
    expect(within(printDocument).getAllByText(/BEINTECH/).length).toBeGreaterThan(0)
    ;["BATON", "happyGallery", "Hope Commit", "IntentTrace", "청년정책메이트"].forEach((title) =>
        expect(within(printDocument).getAllByText(title).length).toBeGreaterThan(0),
    )
    expect(within(printDocument).getByRole("heading", { name: "연락처" })).toBeInTheDocument()

    // 인쇄본의 링크는 공개 주소로 바꿔 PDF에서도 열 수 있게 한다.
    await waitFor(() => {
        const warrantLinks = within(printDocument).getAllByRole("link", {
            name: /전송형 전자영장 시스템/,
        })

        warrantLinks.forEach((link) =>
            expect(link).toHaveAttribute(
                "href",
                "https://ljkportfolio.netlify.app/projects/e-warrant",
            ),
        )
    })
    await waitFor(() =>
        expect(document.documentElement).toHaveAttribute("data-print-ready", "true"),
    )

    fireEvent.click(screen.getByRole("button", { name: "인쇄 또는 PDF 저장" }))
    expect(printSpy).toHaveBeenCalledTimes(1)
    printSpy.mockRestore()
})

test("알 수 없는 경로는 주소를 숨기지 않고 404 안내를 제공한다", async () => {
    window.history.pushState({}, "", "/not-a-project")

    render(<App />)

    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
        "페이지를 찾을 수 없습니다.",
    )
    expect(window.location.pathname).toBe("/not-a-project")
    expect(document.title).toBe("페이지를 찾을 수 없습니다 | 임정규 포트폴리오")
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
    )
    expect(screen.getByRole("link", { name: /홈으로 돌아가기/ })).toHaveAttribute("href", "/")
})

test("끝 슬래시가 붙은 미등록 주소로 이동하면 404 제목에 포커스를 둔다", async () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    await act(async () => {
        window.history.pushState({}, "", "/not-a-project/")
        window.dispatchEvent(new PopStateEvent("popstate"))
    })

    const notFoundHeading = await screen.findByRole("heading", {
        name: "페이지를 찾을 수 없습니다.",
        level: 1,
    })

    await waitFor(() => expect(notFoundHeading).toHaveFocus())
    expect(notFoundHeading).toHaveAttribute("data-route-heading", "/not-a-project")
})

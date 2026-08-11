import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App"

test("프로젝트 목록을 확인하고 BATON 상세로 이동할 수 있다", async () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.getAllByText("임정규 · 백엔드 개발자").length).toBeGreaterThan(0)
    const heroHeading = screen.getByRole("heading", { level: 1 })

    expect(heroHeading).toHaveTextContent("복잡한 요구사항을")
    expect(heroHeading).toHaveTextContent("안정적인 백엔드")
    expect(screen.getByRole("list", { name: "대표 검증 근거" })).toHaveTextContent(
        "GO 동시 요청 8 → 링크 1",
    )
    expect(document.title).toBe("임정규 | 백엔드 개발자")

    const batonHeading = screen.getByRole("heading", {
        name: "BATON",
        level: 3,
    })

    expect(batonHeading).toBeInTheDocument()
    expect(
        screen.getByRole("heading", { name: "전송형 전자영장 시스템", level: 3 }),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "happyGallery", level: 3 })).toBeInTheDocument()
    expect(
        screen.getByRole("heading", { name: "차세대 군사법 정보 시스템", level: 3 }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "WebRTC/HLS 현장강의 보조 서비스",
            level: 3,
        }),
    ).toBeInTheDocument()
    await act(async () => {
        userEvent.click(screen.getByRole("link", { name: "BATON 프로젝트 상세 보기" }))
    })

    const detailHeading = await screen.findByRole("heading", { name: "BATON", level: 1 })

    expect(detailHeading).toBeInTheDocument()
    await waitFor(() => expect(document.activeElement).toBe(detailHeading))
    expect(document.title).toBe("BATON | 임정규 포트폴리오")
    expect(
        screen.getByRole("heading", {
            name: "기능이 아니라 실패와 복구 방식으로 서비스를 나눈다",
        }),
    ).toBeInTheDocument()
})

const projectLinkCases = [
    ["BATON", "/projects/baton"],
    ["전송형 전자영장 시스템", "/projects/e-warrant"],
    ["happyGallery", "/projects/happygallery"],
    ["차세대 군사법 정보 시스템", "/projects/defense"],
    ["WebRTC/HLS 현장강의 보조 서비스", "/projects/webrtc"],
]

test("GitHub 프로필 이미지와 아이디를 포트폴리오 식별 정보로 사용한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const brand = screen.getByRole("link", { name: "ljkhyeong 포트폴리오 홈" })
    const avatar = brand.querySelector("img")

    expect(brand).toHaveTextContent("ljkhyeong")
    expect(avatar).toHaveAttribute("src", expect.stringContaining("ljkhyeong-avatar.png"))
    expect(avatar).toHaveAttribute("alt", "")
})

test.each(projectLinkCases)("%s 목록이 %s 상세를 연결한다", (project, route) => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.getByRole("link", { name: `${project} 프로젝트 상세 보기` })).toHaveAttribute(
        "href",
        route,
    )
})

test("홈은 상세 근거를 펼치지 않고 프로젝트 선택에 집중한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.queryByRole("heading", { name: "대표 문제 해결" })).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "문서 분류와 대표 문서" })).not.toBeInTheDocument()
    expect(screen.queryByText("API Contract")).not.toBeInTheDocument()
    expect(screen.queryAllByRole("img")).toHaveLength(0)
})

test("BATON의 GO, WATCH, RELAY를 독립 마이크로서비스 상세로 연결한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const services = ["GO", "WATCH", "RELAY"]

    services.forEach((service) => {
        expect(
            screen.getByRole("link", {
                name: `BATON ${service} 마이크로서비스 상세 보기`,
            }),
        ).toHaveAttribute("href", `/projects/baton/${service.toLowerCase()}`)
    })
})

test("WebRTC/HLS 경험은 Education에서 이름과 성격을 명확히 보여준다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const educationHeading = screen.getByRole("heading", { name: "교육", level: 3 })
    const careerHeading = screen.getByRole("heading", { name: "경력", level: 3 })

    expect(educationHeading.compareDocumentPosition(careerHeading)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(
        screen.getByRole("heading", {
            name: "WebRTC/HLS 현장강의 보조 서비스",
            level: 4,
        }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/WebSocket 제어와/).length).toBeGreaterThan(0)
    expect(screen.getByRole("link", { name: "교육 프로젝트 상세 보기 →" })).toHaveAttribute(
        "href",
        "/projects/webrtc",
    )
})

test("현재 경력 프로젝트를 이전 경력보다 먼저 보여주고 상세로 연결한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const currentCareer = screen.getByRole("heading", {
        name: "전송형 전자영장 시스템",
        level: 4,
    })
    const previousCareer = screen.getByRole("heading", {
        name: "차세대 군사법 정보 시스템",
        level: 4,
    })
    const careerLinks = screen.getAllByRole("link", { name: "경력 프로젝트 상세 보기 →" })

    expect(currentCareer.compareDocumentPosition(previousCareer)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(careerLinks.map((link) => link.getAttribute("href"))).toEqual([
        "/projects/e-warrant",
        "/projects/defense",
    ])
    expect(screen.getAllByText(/LG CNS 컨소시엄 참여 프로젝트/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/독립된 망 사이/).length).toBeGreaterThan(0)
    expect(screen.getByLabelText("프로젝트 상태: 진행 중, 공개 가능 범위")).toBeInTheDocument()
})

test("기존 그룹 스터디를 개인 활동으로 분리하고 대표 기록을 연결한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.getByRole("heading", { name: "개인 활동", level: 3 })).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "LnS (Learn & Share) — HTTP 완벽 가이드",
            level: 4,
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("heading", { name: "Effective Java 스터디", level: 4 }),
    ).toBeInTheDocument()
    expect(screen.getByText(/HTTP 메시지, 캐시, 프록시와 인증/)).toBeInTheDocument()
    expect(screen.getByText(/객체 생성, 불변성, 제네릭과 API 설계 원칙/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "LnS 발표 및 Q&A 기록 ↗" })).toHaveAttribute(
        "href",
        "https://www.notion.so/LnS-Learn-Share-b3782d6639408242904501146ebbdfdf",
    )
    expect(screen.getByRole("link", { name: "Effective Java 학습 기록 ↗" })).toHaveAttribute(
        "href",
        "https://www.notion.so/2bb82d6639408021aa64da7cb536ab64",
    )
})

const canonicalRouteCases = [
    ["/projects/baton/go", "GO", "BATON GO | 임정규 포트폴리오"],
    ["/projects/baton/watch", "WATCH", "BATON WATCH | 임정규 포트폴리오"],
    ["/projects/baton/relay", "RELAY", "BATON RELAY | 임정규 포트폴리오"],
    ["/projects/happygallery", "happyGallery", "happyGallery | 임정규 포트폴리오"],
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

        const detailHeading = await screen.findByRole("heading", { name: heading, level: 1 })

        expect(detailHeading).toBeInTheDocument()
        expect(detailHeading).not.toHaveFocus()
        await waitFor(() => expect(document.title).toBe(title))
    },
)

test("끝 슬래시가 붙은 상세 주소도 정식 메타데이터와 canonical을 유지한다", async () => {
    window.history.pushState({}, "", "/projects/happygallery/")

    render(<App />)

    expect(
        await screen.findByRole("heading", { name: "happyGallery", level: 1 }),
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

        expect(await screen.findByRole("heading", { name: heading, level: 1 })).toBeInTheDocument()
        await waitFor(() => expect(window.location.pathname).toBe(canonicalPath))
        expect(document.title).toBe(title)
    },
)

test("대표 프로젝트 상세에서 아키텍처와 복구 결정을 확인할 수 있다", async () => {
    window.history.pushState({}, "", "/projects/happygallery")

    render(<App />)

    expect(await screen.findByRole("heading", { name: "설계 판단" })).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "결제와 환불 결과를 모를 때 같은 작업을 무작정 반복하지 않는다",
        }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/processingToken/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/알림 아웃박스/).length).toBeGreaterThan(0)
    expect(screen.getByText(/AWS에 운영 배포했으나/)).toBeInTheDocument()
    expect(
        screen.getByRole("link", {
            name: /헥사고날 아키텍처 전환 대표 문서 새 창에서 보기/,
        }),
    ).toHaveAttribute("href", expect.stringContaining("ADR/0021"))
    expect(screen.getAllByText("트레이드오프").length).toBeGreaterThan(0)
})

test("BATON 마이크로서비스 상세는 책임, 대표 문제 해결과 문서를 분리해 보여준다", async () => {
    window.history.pushState({}, "", "/projects/baton/watch")

    render(<App />)

    expect(await screen.findByRole("heading", { name: "WATCH", level: 1 })).toBeInTheDocument()
    expect(screen.getByText("BATON / MICROSERVICE")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "BATON 안에서의 책임" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "대표 문제 해결" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "문서 분류와 대표 문서" })).toBeInTheDocument()
    expect(screen.getByText("공개 저장소")).toBeInTheDocument()
    expect(screen.getByText("느린 URL 점검 중 DB 락을 잡지 않는다")).toBeInTheDocument()
    expect(screen.queryByText("HMAC 키와 DB를 하나의 복구 단위로 묶는다")).not.toBeInTheDocument()
    expect(
        screen.queryByText("전송 결과를 모르면 원본 기록을 바꾸지 않는다"),
    ).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: /WATCH 상태 변경 이벤트 전달/ })).toHaveAttribute(
        "href",
        expect.stringContaining("baton-watch"),
    )
})

test("WebRTC/HLS 상세는 교육 프로젝트용 간략 화면으로 유지한다", async () => {
    window.history.pushState({}, "", "/projects/webrtc")

    render(<App />)

    expect(
        await screen.findByRole("heading", { name: "WebRTC/HLS 현장강의 보조 서비스" }),
    ).toBeInTheDocument()
    expect(screen.getByText("교육 프로젝트")).toBeInTheDocument()
    expect(screen.getAllByText(/WebSocket 제어/).length).toBeGreaterThan(0)
    expect(screen.queryByRole("heading", { name: "대표 문제 해결" })).not.toBeInTheDocument()
})

test("인쇄본은 React 경로에서 공용 프로젝트 데이터로 읽기 쉬운 11쪽을 렌더링한다", async () => {
    window.history.pushState({}, "", "/portfolio/print")

    render(<App />)

    await screen.findByRole("heading", { name: "실패 이후까지 설계하는 백엔드 개발자" })
    await waitFor(() => expect(document.title).toBe("인쇄용 포트폴리오 | 임정규"))
    expect(document.querySelectorAll("[data-print-page]")).toHaveLength(11)
    expect(screen.getAllByText("BATON").length).toBeGreaterThan(0)
    expect(screen.getAllByText("전송형 전자영장 시스템").length).toBeGreaterThan(0)
    expect(screen.getAllByText(/LG CNS 컨소시엄/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/독립망/).length).toBeGreaterThan(0)
    expect(screen.getAllByText("happyGallery").length).toBeGreaterThan(0)
    expect(screen.getByText("WebRTC/HLS 현장강의 보조 서비스")).toBeInTheDocument()
    expect(screen.getByText("LnS (Learn & Share) — HTTP 완벽 가이드")).toBeInTheDocument()
    expect(screen.getByText("Effective Java 스터디")).toBeInTheDocument()
    expect(screen.getByText(/AWS에 운영 배포했으나/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "GO" })).toHaveAttribute(
        "href",
        "https://ljkportfolio.netlify.app/projects/baton/go",
    )
    expect(screen.getByRole("link", { name: "WATCH" })).toHaveAttribute(
        "href",
        "https://ljkportfolio.netlify.app/projects/baton/watch",
    )
    expect(screen.getByRole("link", { name: "RELAY" })).toHaveAttribute(
        "href",
        "https://ljkportfolio.netlify.app/projects/baton/relay",
    )
    expect(screen.getByRole("link", { name: "전송형 전자영장" })).toHaveAttribute(
        "href",
        "https://ljkportfolio.netlify.app/projects/e-warrant",
    )
})

test("알 수 없는 경로는 주소를 숨기지 않고 404 안내를 제공한다", async () => {
    window.history.pushState({}, "", "/not-a-project")

    render(<App />)

    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
        "요청한 페이지를 찾을 수 없습니다.",
    )
    expect(window.location.pathname).toBe("/not-a-project")
    expect(document.title).toBe("페이지를 찾을 수 없습니다 | 임정규 포트폴리오")
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
    )
    expect(screen.getByRole("link", { name: /프로젝트 목록으로 돌아가기/ })).toHaveAttribute(
        "href",
        "/",
    )
})

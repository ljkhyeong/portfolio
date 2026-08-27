import { act, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App"

test("프로젝트 목록을 확인하고 BATON 상세로 이동할 수 있다", async () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.getAllByText("임정규 · 백엔드 개발자").length).toBeGreaterThan(0)
    const heroHeading = screen.getByRole("heading", { level: 1 })

    expect(heroHeading).toHaveTextContent("기관 간 데이터를 연결하고")
    expect(heroHeading).toHaveTextContent("중단된 작업을 다시 처리하는 백엔드")
    const heroHighlights = screen.getByRole("list", { name: "대표 경험 프로젝트" })

    expect(heroHighlights).toHaveTextContent("전송형 전자영장 시스템")
    expect(heroHighlights).toHaveTextContent("BEINTECH · LG CNS 컨소시엄")
    expect(heroHighlights).toHaveTextContent("독립망 기관 연계 · Spring Batch")
    expect(heroHighlights).toHaveTextContent("BATON")
    expect(heroHighlights).toHaveTextContent("Core가 조직, 역할과 접근 권한 관리")
    expect(heroHighlights).toHaveTextContent(
        "6개 서비스가 링크, URL 점검, 이벤트 전달, 보고서, 캘린더와 화상방 처리",
    )
    expect(heroHighlights).toHaveTextContent("happyGallery")
    expect(heroHighlights).toHaveTextContent(
        "AWS 배포 및 운영 이력 · 중복 결제 및 환불 방지 · 중단된 알림 재전송",
    )
    expect(
        within(heroHighlights).getByRole("link", { name: /전송형 전자영장 시스템/ }),
    ).toHaveAttribute("href", "/projects/e-warrant")
    expect(
        within(heroHighlights).getByRole("link", {
            name: /BATON/,
        }),
    ).toHaveAttribute("href", "/projects/baton")
    expect(
        within(heroHighlights).getByRole("link", {
            name: /happyGallery/,
        }),
    ).toHaveAttribute("href", "/projects/happygallery")
    expect(document.title).toBe("임정규 | 백엔드 개발자")

    const careerProjects = screen.getByRole("list", { name: "경력 프로젝트" })
    const personalProjects = screen.getByRole("list", { name: "개인 프로젝트" })
    const toolingProjects = screen.getByRole("list", { name: "오픈소스 및 개발 도구" })
    const educationProjects = screen.getByRole("list", { name: "교육 프로젝트" })
    const batonHeading = within(personalProjects).getByRole("heading", {
        name: "BATON",
        level: 4,
    })

    expect(batonHeading).toBeInTheDocument()
    expect(
        within(careerProjects).getByRole("heading", {
            name: "전송형 전자영장 시스템",
            level: 4,
        }),
    ).toBeInTheDocument()
    expect(
        within(personalProjects).getByRole("heading", { name: "happyGallery", level: 4 }),
    ).toBeInTheDocument()
    expect(
        within(toolingProjects).getByRole("heading", { name: "Hope Commit", level: 4 }),
    ).toBeInTheDocument()
    expect(
        within(careerProjects).getByRole("heading", {
            name: "차세대 군사법 정보 시스템",
            level: 4,
        }),
    ).toBeInTheDocument()
    expect(
        within(careerProjects).getByText("BEINTECH / 국방부 SI / 백엔드 개발 및 운영"),
    ).toBeInTheDocument()
    expect(
        within(educationProjects).getByRole("heading", {
            name: "WebRTC/HLS 현장강의 보조 서비스",
            level: 4,
        }),
    ).toBeInTheDocument()
    expect(careerProjects.compareDocumentPosition(personalProjects)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(personalProjects.compareDocumentPosition(toolingProjects)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(toolingProjects.compareDocumentPosition(educationProjects)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    await act(async () => {
        userEvent.click(screen.getByRole("link", { name: "BATON 프로젝트 상세 보기" }))
    })

    const detailHeading = await screen.findByRole("heading", { name: "BATON", level: 1 })

    expect(detailHeading).toBeInTheDocument()
    await waitFor(() => expect(document.activeElement).toBe(detailHeading))
    expect(document.title).toBe("BATON | 임정규 포트폴리오")
    expect(
        screen.getByRole("heading", {
            name: /Core는 조직 정보와 접근 권한을 관리하고/,
        }),
    ).toBeInTheDocument()
})

const projectLinkCases = [
    ["BATON", "/projects/baton"],
    ["전송형 전자영장 시스템", "/projects/e-warrant"],
    ["happyGallery", "/projects/happygallery"],
    ["Hope Commit", "/projects/hope-commit"],
    ["차세대 군사법 정보 시스템", "/projects/defense"],
    ["WebRTC/HLS 현장강의 보조 서비스", "/projects/webrtc"],
]

test("GitHub 프로필 이미지와 아이디를 포트폴리오 식별 정보로 사용한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const brand = screen.getByRole("link", { name: "ljkhyeong 포트폴리오 홈" })
    const avatar = brand.querySelector("img")
    const pdfDownload = screen.getByRole("link", { name: "PDF 내려받기" })

    expect(brand).toHaveTextContent("ljkhyeong")
    expect(avatar).toHaveAttribute("src", expect.stringContaining("ljkhyeong-avatar.png"))
    expect(avatar).toHaveAttribute("alt", "")
    expect(decodeURI(pdfDownload.getAttribute("href"))).toBe("/임정규_포트폴리오.pdf")
})

test("기술 섹션은 핵심 스택과 해결한 운영 문제를 구체적으로 보여준다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const skills = screen.getByRole("region", { name: "기술" })
    const desktopSkills = skills.querySelector(".capability-list--desktop")

    expect(desktopSkills).not.toBeNull()
    const desktop = within(desktopSkills)
    expect(desktop.getByRole("heading", { name: "백엔드" })).toBeInTheDocument()
    expect(desktop.getByText("Java")).toBeInTheDocument()
    expect(desktop.getByText("Spring Boot / Spring MVC")).toBeInTheDocument()
    expect(desktop.getByText("Spring Batch")).toBeInTheDocument()
    expect(desktop.getByText("JPA / MyBatis")).toBeInTheDocument()
    expect(desktop.getByText("RabbitMQ / SQS")).toBeInTheDocument()
    expect(desktop.getByRole("heading", { name: "프론트엔드" })).toBeInTheDocument()
    expect(desktop.getByText("JavaScript")).toBeInTheDocument()
    expect(desktop.getByText("TypeScript")).toBeInTheDocument()
    expect(desktop.getByText("React")).toBeInTheDocument()
    expect(desktop.getByText("WebSquare")).toBeInTheDocument()

    expect(
        desktop.getByRole("heading", { name: "중복 처리 방지 및 장애 복구" }),
    ).toBeInTheDocument()
    expect(desktop.getByText("중복 결제 및 환불 방지")).toBeInTheDocument()
    expect(desktop.getByText("중단된 알림 재전송")).toBeInTheDocument()
    expect(desktop.getByText("동시 예약 및 재고 초과 차감 방지")).toBeInTheDocument()
    expect(desktop.getByText("중단 작업 재처리")).toBeInTheDocument()

    expect(skills).not.toHaveTextContent("Java 21 / 11 / 8")
    expect(skills).not.toHaveTextContent("Spring JDBC")
    expect(skills).not.toHaveTextContent("전자영장, BATON, happyGallery, 공공 SI")
    expect(skills).not.toHaveTextContent("Prometheus / Grafana")
})

test("모바일 기술 그룹은 필요한 항목만 펼쳐볼 수 있다", async () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const skills = screen.getByRole("region", { name: "기술" })
    const mobileSkills = skills.querySelector(".capability-list--mobile")

    expect(mobileSkills).not.toBeNull()
    const frontendTitle = within(mobileSkills).getByText("프론트엔드", { exact: true })
    const frontendDetails = frontendTitle.closest("details")

    expect(frontendDetails).not.toHaveAttribute("open")
    await act(async () => {
        userEvent.click(frontendTitle)
    })
    expect(frontendDetails).toHaveAttribute("open")
    expect(within(frontendDetails).getByText("WebSquare")).toBeInTheDocument()
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

    expect(screen.queryByRole("heading", { name: "문제와 해결 방법" })).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "문서 분류와 대표 문서" })).not.toBeInTheDocument()
    expect(screen.queryByText("API Contract")).not.toBeInTheDocument()
    expect(screen.queryAllByRole("img")).toHaveLength(0)
})

test("BATON의 6개 마이크로서비스를 독립 상세로 연결한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const services = ["GO", "WATCH", "RELAY", "BRIEF", "CAL", "ROUND"]

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
    const educationSection = educationHeading.closest("section")

    expect(educationHeading.compareDocumentPosition(careerHeading)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(
        within(educationSection).getByRole("heading", {
            name: "WebRTC/HLS 현장강의 보조 서비스",
            level: 4,
        }),
    ).toBeInTheDocument()
    expect(
        within(educationSection).getByText(/RTP 영상을 FFmpeg와 GStreamer로 HLS 세그먼트/),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "교육 프로젝트 상세 보기 →" })).toHaveAttribute(
        "href",
        "/projects/webrtc",
    )
})

test("BEINTECH 단일 경력 아래 현재와 이전 프로젝트를 연결한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const careerSection = screen.getByRole("heading", { name: "경력", level: 3 }).closest("section")
    const careerProjects = within(careerSection).getByRole("list", {
        name: "BEINTECH 수행 프로젝트",
    })
    const currentCareer = within(careerSection).getByRole("heading", {
        name: "전송형 전자영장 시스템",
        level: 4,
    })
    const previousCareer = within(careerSection).getByRole("heading", {
        name: "차세대 군사법 정보 시스템",
        level: 4,
    })
    const careerLinks = within(careerProjects).getAllByRole("link")

    expect(within(careerSection).getByText("백엔드 개발자 · 재직 중")).toBeInTheDocument()
    expect(within(careerSection).getByText("BEINTECH")).toBeInTheDocument()
    expect(within(careerSection).getByText("2024.06 — 현재")).toBeInTheDocument()
    expect(currentCareer.compareDocumentPosition(previousCareer)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(careerLinks.map((link) => link.getAttribute("href"))).toEqual([
        "/projects/e-warrant",
        "/projects/defense",
    ])
    expect(within(careerProjects).getByText("2026.03.24 — 진행 중")).toBeInTheDocument()
    expect(within(careerProjects).getByText("2024.06.23 — 2026.01.30")).toBeInTheDocument()
    expect(within(careerProjects).getAllByText("문제")).toHaveLength(2)
    expect(within(careerSection).queryByText(/소속사 비공개/)).not.toBeInTheDocument()
    expect(screen.getByLabelText("프로젝트 상태: 진행 중, 공개 가능 범위")).toBeInTheDocument()
})

test("프로젝트 목록은 담당, 문제와 해결을 구체적인 문장으로 보여준다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const warrantFacts = screen.getByLabelText("전송형 전자영장 시스템 담당, 문제와 해결")
    const galleryFacts = screen.getByLabelText("happyGallery 담당, 문제와 해결")

    expect(within(warrantFacts).getByText("담당")).toBeInTheDocument()
    expect(within(warrantFacts).getByText("문제")).toBeInTheDocument()
    expect(within(warrantFacts).getByText("해결")).toBeInTheDocument()
    expect(warrantFacts).toHaveTextContent(
        "KICS-통신사 및 KICS-집행포털 연계 인터페이스와 Spring Batch",
    )
    expect(warrantFacts).toHaveTextContent(
        "KICS, 통신사 및 집행포털의 서로 다른 연계 규격과 계속 누적되는 전송 이력",
    )
    expect(warrantFacts).toHaveTextContent(
        "기관별 변환 코드와 배치 공통 단계를 분리하고, 누적 이력은 커서로 조회하며, DB 저장보다 먼저 온 PDF 완료 콜백은 상태를 다시 조회해 반영",
    )

    expect(galleryFacts).toHaveTextContent(
        "결제 승인 결과 미수신, 서버 중단 시 알림 유실과 동시 주문 시 옵션 재고 초과 차감",
    )
    expect(galleryFacts).toHaveTextContent(
        "결제 요청 ID로 중복 승인을 막고, 미전송 알림은 DB에서 다시 처리하며, 옵션 재고는 항상 같은 순서로 잠근 뒤 차감",
    )
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
    expect(
        screen.getByText(/객체 생성, 변경할 수 없는 객체 설계, 제네릭과 API 설계 원칙/),
    ).toBeInTheDocument()
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
    ["/projects/baton/brief", "BRIEF", "BATON BRIEF | 임정규 포트폴리오"],
    ["/projects/baton/cal", "CAL", "BATON CAL | 임정규 포트폴리오"],
    ["/projects/baton/round", "ROUND", "BATON ROUND | 임정규 포트폴리오"],
    ["/projects/happygallery", "happyGallery", "happyGallery | 임정규 포트폴리오"],
    ["/projects/hope-commit", "Hope Commit", "Hope Commit | 임정규 포트폴리오"],
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

    expect(
        await screen.findByRole("heading", { name: "구현 구조와 선택 이유" }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "결제사 응답을 받지 못한 재요청의 중복 승인 및 환불 방지",
        }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/처리 서버와 만료 시간을 기록/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/미전송 알림/).length).toBeGreaterThan(0)
    expect(screen.getByText(/AWS 운영 환경에 배포했으나/)).toBeInTheDocument()
    expect(
        screen.getByRole("link", {
            name: /업무 규칙과 웹 및 DB 코드 분리 대표 문서 새 창에서 보기/,
        }),
    ).toHaveAttribute("href", expect.stringContaining("ADR/0021"))
    expect(screen.getAllByText("적용 범위와 제약").length).toBeGreaterThan(0)
})

test("Hope Commit 상세는 원본 포크와 직접 추가한 커밋 검토 범위를 구분한다", async () => {
    window.history.pushState({}, "", "/projects/hope-commit")

    render(<App />)

    expect(
        await screen.findByRole("heading", { name: "Hope Commit", level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/SeungIl 님이 개발한 Hope 3\.0\.3/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/제가 추가한 Commit Diff/).length).toBeGreaterThan(0)
    expect(
        screen.getByRole("heading", { name: "현재 수정 파일을 제외하고 입력 커밋만 비교" }),
    ).toBeInTheDocument()
    expect(screen.getByText("자동화 테스트 245개 통과, 실패 0개")).toBeInTheDocument()
    expect(
        screen.getByRole("link", { name: "Hope Commit GitHub 저장소 새 창에서 보기" }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/hope-commit")
    expect(
        screen.getByText(
            /개인적인 커밋 검토 필요에 맞게 수정 및 보완했습니다.*원본 프로젝트가 이 포크를 보증하거나 유지보수하지 않습니다/,
        ),
    ).toBeInTheDocument()
})

test("BATON 마이크로서비스 상세는 입력과 처리 결과, 문제 해결과 문서를 분리해 보여준다", async () => {
    window.history.pushState({}, "", "/projects/baton/watch")

    render(<App />)

    expect(await screen.findByRole("heading", { name: "WATCH", level: 1 })).toBeInTheDocument()
    expect(screen.getByText("BATON / MICROSERVICE")).toBeInTheDocument()
    expect(
        screen.getByText(
            "BATON에 등록된 외부 URL이 사설망이나 로컬 주소로 연결되지 않는지 확인한 뒤 상태를 점검합니다. 저장된 이전 결과와 달라지면 URL 상태 변경 이벤트를 Core에 전달합니다.",
        ),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("heading", { name: "이 서비스가 받는 데이터와 처리 결과" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "문제와 해결 방법" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "문서 분류와 대표 문서" })).toBeInTheDocument()
    expect(screen.getByText("공개 저장소")).toBeInTheDocument()
    expect(
        screen.getByText("외부 URL을 확인하는 동안 DB 연결을 반환하고 늦은 결과 차단"),
    ).toBeInTheDocument()
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
        await screen.findByRole("heading", { name: "WebRTC/HLS 현장강의 보조 서비스" }),
    ).toBeInTheDocument()
    expect(screen.getAllByText("교육 프로젝트").length).toBeGreaterThan(0)
    expect(screen.getByText("mediasoup → WebRTC")).toBeInTheDocument()
    expect(screen.getByText("RTP 출력 → FFmpeg / GStreamer")).toBeInTheDocument()
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
    })

    await waitFor(() => expect(document.title).toBe("인쇄용 포트폴리오 | 임정규"))
    expect(
        screen.getByText("웹 포트폴리오와 같은 내용을 인쇄용으로 배치한 페이지"),
    ).toBeInTheDocument()
    expect(document.querySelectorAll("[data-print-page]")).toHaveLength(0)
    expect(within(printDocument).getByRole("heading", { level: 1 })).toHaveTextContent(
        "기관 간 데이터를 연결하고",
    )
    expect(within(printDocument).getByRole("heading", { name: "프로젝트" })).toBeInTheDocument()
    expect(within(printDocument).getByRole("heading", { name: "경력 및 학습" })).toBeInTheDocument()
    expect(within(printDocument).getByRole("heading", { name: "기술" })).toBeInTheDocument()
    expect(within(printDocument).getAllByText("BEINTECH").length).toBeGreaterThan(0)
    expect(within(printDocument).getAllByText("BATON").length).toBeGreaterThan(0)
    expect(within(printDocument).getAllByText("happyGallery").length).toBeGreaterThan(0)
    expect(within(printDocument).getAllByText("Hope Commit").length).toBeGreaterThan(0)
    expect(
        within(printDocument).getByRole("heading", {
            name: /백엔드 개발자 포지션이나/,
        }),
    ).toBeInTheDocument()

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
    expect(
        within(printDocument).getByRole("link", {
            name: "BATON GO 마이크로서비스 상세 보기",
        }),
    ).toHaveAttribute("href", "https://ljkportfolio.netlify.app/projects/baton/go")
    expect(
        within(printDocument).getByRole("link", {
            name: "BATON ROUND 마이크로서비스 상세 보기",
        }),
    ).toHaveAttribute("href", "https://ljkportfolio.netlify.app/projects/baton/round")
    await waitFor(() =>
        expect(document.documentElement).toHaveAttribute("data-print-ready", "true"),
    )

    await userEvent.click(screen.getByRole("button", { name: "인쇄 또는 PDF 저장" }))
    expect(printSpy).toHaveBeenCalledTimes(1)
    printSpy.mockRestore()
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

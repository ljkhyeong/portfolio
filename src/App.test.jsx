import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import App from "./App"
import { homeHeroContent } from "./data/homeHero"
import { projectsById } from "./data/projects"

const lazyRouteLoadOptions = { timeout: 30000 }

test("프로젝트 목록을 확인하고 BATON 상세로 이동할 수 있다", async () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.getAllByText("임정규 · 백엔드 개발자").length).toBeGreaterThan(0)
    const heroHeading = screen.getByRole("heading", { level: 1 })

    expect(heroHeading).toHaveTextContent(
        "중복 실행 방지와 중단 후 재처리 등 안정적인 설계를 추구하는 백엔드 개발자입니다.",
    )
    expect(screen.getByText("BEINTECH · 2024.06 — 현재")).toBeInTheDocument()
    expect(
        screen.getByText(
            "공공 SI에서 기관 연계 서버와 배치를 개발합니다. 개인 프로젝트에서는 결제와 이벤트의 중복 실행을 막고, 중단된 작업을 이어서 처리하도록 구현했습니다.",
        ),
    ).toBeInTheDocument()
    const reliabilityFlow = screen.getByRole("list", { name: "안정적인 요청 처리 흐름" })

    expect(reliabilityFlow).toHaveTextContent("요청 수신")
    expect(reliabilityFlow).toHaveTextContent("중복 확인")
    expect(reliabilityFlow).toHaveTextContent("상태 저장")
    expect(reliabilityFlow).toHaveTextContent("중단 후 재처리")
    const heroHighlights = screen.getByRole("list", { name: "대표 경험 프로젝트" })

    expect(heroHighlights).toHaveTextContent("전송형 전자영장 시스템")
    expect(heroHighlights).toHaveTextContent("기관별 규격 변환")
    expect(heroHighlights).toHaveTextContent("BATON")
    expect(heroHighlights).toHaveTextContent("기존 작업 재사용")
    expect(heroHighlights).toHaveTextContent("happyGallery")
    expect(heroHighlights).toHaveTextContent("결제 및 환불 중복 방지")
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

    const featuredProjects = screen.getByRole("list", { name: "대표 프로젝트" })
    const supportingProjects = screen.getByRole("list", { name: "추가 프로젝트" })

    expect(
        within(featuredProjects).getByRole("link", {
            name: "전송형 전자영장 시스템 프로젝트 상세 보기",
        }),
    ).toBeInTheDocument()
    expect(
        within(featuredProjects).getByRole("link", {
            name: "BATON 프로젝트 상세 보기",
        }),
    ).toBeInTheDocument()
    expect(
        within(featuredProjects).getByRole("link", {
            name: "happyGallery 프로젝트 상세 보기",
        }),
    ).toBeInTheDocument()
    expect(
        within(supportingProjects).getByRole("link", {
            name: "Hope Commit 프로젝트 상세 보기",
        }),
    ).toBeInTheDocument()
    expect(
        within(supportingProjects).getByRole("link", {
            name: "IntentTrace 프로젝트 상세 보기",
        }),
    ).toBeInTheDocument()
    expect(
        within(supportingProjects).getByText("BEINTECH / 국방부 SI / 백엔드 개발 및 운영"),
    ).toBeInTheDocument()
    expect(
        within(supportingProjects).getByRole("link", {
            name: "WebRTC/HLS 현장강의 보조 서비스 프로젝트 상세 보기",
        }),
    ).toBeInTheDocument()
    expect(featuredProjects.compareDocumentPosition(supportingProjects)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    fireEvent.click(
        within(featuredProjects).getByRole("link", { name: "BATON 프로젝트 상세 보기" }),
    )

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

const projectLinkCases = [
    ["BATON", "/projects/baton"],
    ["전송형 전자영장 시스템", "/projects/e-warrant"],
    ["happyGallery", "/projects/happygallery"],
    ["Hope Commit", "/projects/hope-commit"],
    ["IntentTrace", "/projects/intent-trace"],
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
    expect(desktop.getByText("RabbitMQ / AWS SQS FIFO")).toBeInTheDocument()
    expect(desktop.getByRole("heading", { name: "프론트엔드" })).toBeInTheDocument()
    expect(desktop.getByText("JavaScript")).toBeInTheDocument()
    expect(desktop.getByText("TypeScript")).toBeInTheDocument()
    expect(desktop.getByText("React")).toBeInTheDocument()
    expect(desktop.getByText("WebSquare")).toBeInTheDocument()

    expect(desktop.getByRole("heading", { name: "안정성 설계" })).toBeInTheDocument()
    expect(desktop.getByText("결제 및 환불 중복 실행 방지")).toBeInTheDocument()
    expect(desktop.getByText("서버 중단 후 알림 재처리")).toBeInTheDocument()
    expect(desktop.getByText("정원 및 재고 초과 방지")).toBeInTheDocument()
    expect(
        desktop.getByText(
            "클래스와 예약 시간, 재고 행을 잠가 동시 요청의 정원 및 재고 초과를 막습니다.",
        ),
    ).toBeInTheDocument()
    expect(desktop.getByText("서버 중단 후 URL 점검 및 이벤트 전달 재개")).toBeInTheDocument()

    const backendHeading = desktop.getByRole("heading", { name: "백엔드" })
    const reliabilityHeading = desktop.getByRole("heading", {
        name: "안정성 설계",
    })
    const deliveryHeading = desktop.getByRole("heading", { name: "테스트 및 운영" })
    const frontendHeading = desktop.getByRole("heading", { name: "프론트엔드" })

    expect(backendHeading.compareDocumentPosition(reliabilityHeading)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(reliabilityHeading.compareDocumentPosition(deliveryHeading)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(deliveryHeading.compareDocumentPosition(frontendHeading)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )

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
    fireEvent.click(frontendTitle)
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

test("홈은 상세 문서 대신 대표 시각 자료와 프로젝트 선택에 집중한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    expect(screen.queryByRole("heading", { name: "문제와 해결 방법" })).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "문서 분류와 대표 문서" })).not.toBeInTheDocument()
    expect(screen.queryByText("API Contract")).not.toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: "KICS 요청을 연계 서버가 기관 규격으로 변환해 통신사와 전자영장 포털에 전달하는 흐름",
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: "BATON 오늘 화면에서 인수인계 타임라인과 최근 결정을 확인하는 모습",
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: "happyGallery 상품 목록 화면에서 공방 상품을 확인하는 모습",
        }),
    ).toBeInTheDocument()
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

    expect(careerHeading.compareDocumentPosition(educationHeading)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(
        within(educationSection).getByRole("heading", {
            name: "WebRTC/HLS 현장강의 보조 서비스",
            level: 4,
        }),
    ).toBeInTheDocument()
    expect(
        within(educationSection).getByText(/mediasoup RTP를 HLS로 변환하고 재생 지연을/),
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
    expect(within(careerProjects).queryByText("문제")).not.toBeInTheDocument()
    expect(within(careerSection).queryByText(/소속사 비공개/)).not.toBeInTheDocument()
    expect(screen.getByLabelText("전송형 전자영장 시스템 확인 근거")).toHaveTextContent(
        "상태진행 중검증자료 변환 및 배치 단계 확인문서내부 문서 비공개공개담당 범위만 공개",
    )
})

test("대표 프로젝트는 담당, 문제와 해결을 보여주고 추가 프로젝트는 구현과 근거를 요약한다", () => {
    window.history.pushState({}, "", "/")

    render(<App />)

    const warrantFacts = screen.getByLabelText("전송형 전자영장 시스템 담당, 문제와 해결")
    const galleryFacts = screen.getByLabelText("happyGallery 담당, 문제와 해결")
    const defenseProject = screen
        .getByRole("link", {
            name: "차세대 군사법 정보 시스템 프로젝트 상세 보기",
        })
        .closest("article")

    expect(within(warrantFacts).getByText("담당")).toBeInTheDocument()
    expect(within(warrantFacts).getByText("문제")).toBeInTheDocument()
    expect(within(warrantFacts).getByText("해결")).toBeInTheDocument()
    expect(warrantFacts).toHaveTextContent(
        "KICS 요청 변환 및 전송, 제출 자료의 KICS 반영 서버와 Spring Batch 개발",
    )
    expect(warrantFacts).toHaveTextContent(
        "기관별 요청 및 제출 형식이 다르고, PDF 완료 응답이 요청 상태 저장보다 먼저 도착할 수 있음",
    )
    expect(warrantFacts).toHaveTextContent(
        "기관별 변환 코드를 분리하고, 먼저 도착한 PDF 완료 응답은 요청 상태를 다시 조회해 반영",
    )

    expect(galleryFacts).toHaveTextContent(
        "결제사 응답 유실, 서버 중단에 따른 알림 유실과 동시 요청의 정원 및 재고 초과",
    )
    expect(galleryFacts).toHaveTextContent("결제 orderId와 환불 UUID를 재사용")
    expect(galleryFacts).toHaveTextContent("행 잠금으로 정원과 재고 초과를 차단")
    expect(defenseProject).toHaveTextContent(
        "군교정 업무 화면, 수용자 인적정보 및 영장정보 연계 배치, CSRF 차단과 대용량 파일 직접 업로드 개발",
    )
    expect(defenseProject).toHaveTextContent("기관별 배치 결과, JEUS 로그 및 Tibero 상태 확인")
    expect(defenseProject).not.toHaveTextContent("문제")
    expect(defenseProject).not.toHaveTextContent("해결")
    expect(galleryFacts).toHaveTextContent(
        "요구사항 정리, Java 및 Spring Boot API, React 화면, 자동화 테스트, AWS 운영과 k3s 배포 준비",
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
    ["/projects/intent-trace", "IntentTrace", "IntentTrace | 임정규 포트폴리오"],
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

test("대표 프로젝트 상세에서 아키텍처와 복구 결정을 확인할 수 있다", async () => {
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
    expect(screen.getByText(/AWS 주요 리소스는 2026년 5월 3일 종료/)).toBeInTheDocument()
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
        await screen.findByRole("heading", { name: "Hope Commit", level: 1 }, lazyRouteLoadOptions),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/SeungIl 님이 개발한 Hope 3\.0\.3/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/제가 추가한 Commit Diff/).length).toBeGreaterThan(0)
    expect(
        screen.getByRole("heading", {
            name: "입력한 커밋과 확정한 비교 기준 사이의 변경만 검토",
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
    expect(
        screen.getByText(
            /공개 main 4\.0\.0의 GitHub Actions Node\.js 22 환경에서 275개 통과, 실패 및 건너뜀 0개/,
        ),
    ).toBeInTheDocument()
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
            "URL이 사설망 또는 로컬 주소로 해석되면 차단하고, 공개 URL의 상태를 점검해 변경 이벤트를 Core에 전달합니다.",
        ),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("heading", { name: "이 서비스가 받는 데이터와 처리 결과" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "문제와 해결 방법" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "문서 분류와 대표 문서" })).toBeInTheDocument()
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
    }, lazyRouteLoadOptions)

    await waitFor(() => expect(document.title).toBe("인쇄용 포트폴리오 | 임정규"))
    expect(screen.getByText("웹 포트폴리오의 인쇄용 페이지")).toBeInTheDocument()
    expect(document.querySelectorAll("[data-print-page]")).toHaveLength(0)
    expect(within(printDocument).getByRole("heading", { level: 1 })).toHaveTextContent(
        homeHeroContent.headline,
    )
    expect(
        within(printDocument).getByRole("heading", { name: "주요 프로젝트" }),
    ).toBeInTheDocument()
    expect(within(printDocument).getByRole("heading", { name: "경력 및 학습" })).toBeInTheDocument()
    expect(within(printDocument).getByRole("heading", { name: "기술" })).toBeInTheDocument()
    expect(within(printDocument).getAllByText("BEINTECH").length).toBeGreaterThan(0)
    expect(within(printDocument).getAllByText("BATON").length).toBeGreaterThan(0)
    expect(within(printDocument).getAllByText("happyGallery").length).toBeGreaterThan(0)
    expect(within(printDocument).getAllByText("Hope Commit").length).toBeGreaterThan(0)
    expect(within(printDocument).getAllByText("IntentTrace").length).toBeGreaterThan(0)
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

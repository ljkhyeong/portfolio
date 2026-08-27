import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import BatonServiceCaseStudy from "./BatonServiceCaseStudy"
import ProjectCaseStudy from "./ProjectCaseStudy"

const renderWithRouter = (component) =>
    render(<MemoryRouter initialEntries={["/"]}>{component}</MemoryRouter>)

test("개인 프로젝트 상세는 유형별 이동과 섹션 바로가기를 명확히 보여준다", async () => {
    renderWithRouter(<ProjectCaseStudy projectId="baton" />)

    expect(screen.getByText("개인 프로젝트 01 / 02")).toBeInTheDocument()

    const sectionNavigation = screen.getByRole("navigation", {
        name: "상세 섹션 바로가기",
    })

    expect(sectionNavigation).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "개요" })).toHaveAttribute("href", "#project-overview")
    expect(screen.getByRole("link", { name: "화면 및 서비스" })).toHaveAttribute(
        "href",
        "#project-system",
    )
    expect(screen.getByRole("link", { name: "설계" })).toHaveAttribute(
        "href",
        "#project-architecture",
    )
    expect(screen.getByRole("link", { name: "문제 해결" })).toHaveAttribute(
        "href",
        "#project-problems",
    )
    expect(screen.getByRole("link", { name: "테스트 및 결과" })).toHaveAttribute(
        "href",
        "#project-proof",
    )
    expect(screen.getByRole("list", { name: "BATON 기술 스택" }).closest("section")).toHaveClass(
        "case-meta",
    )
    expect(screen.getByRole("link", { name: "문서" })).toHaveAttribute("href", "#project-documents")
    expect(screen.getByRole("link", { name: "사용 기술" })).toHaveAttribute(
        "href",
        "#project-stack",
    )

    const sectionIds = [
        "project-overview",
        "project-system",
        "project-architecture",
        "project-problems",
        "project-proof",
        "project-documents",
        "project-stack",
    ]

    sectionIds.forEach((id) => expect(document.getElementById(id)).toBeInTheDocument())

    const evidenceLinks = screen.getByRole("list", { name: "프로젝트 자료 바로가기" })

    expect(evidenceLinks).toHaveTextContent("GitHub 저장소")
    expect(evidenceLinks).toHaveTextContent("대표 문서")
    expect(
        within(evidenceLinks).getByRole("link", {
            name: "BATON WATCH GitHub 저장소 새 창에서 보기",
        }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/baton-watch")

    const additionalProblems = screen.getByText("추가 문제 해결 10건 보기").closest("details")
    const featuredProblemList = screen.getByRole("list", { name: "대표 문제 해결 목록" })

    expect(additionalProblems).not.toHaveAttribute("open")
    expect(within(featuredProblemList).getAllByRole("listitem")).toHaveLength(4)

    await userEvent.click(screen.getByText("추가 문제 해결 10건 보기"))

    expect(additionalProblems).toHaveAttribute("open")
    expect(screen.getByRole("list", { name: "추가 문제 해결 목록" })).toBeInTheDocument()

    const projectSwitcher = screen.getByRole("group", {
        name: "프로젝트 바로가기",
    })
    const projectMenu = within(projectSwitcher).getByText("프로젝트 이동").closest("details")

    expect(within(projectSwitcher).getByText("개인 프로젝트 01 / 02")).toBeInTheDocument()
    expect(within(projectMenu).queryByText("개인 프로젝트 01 / 02")).not.toBeInTheDocument()
    expect(projectMenu).not.toHaveAttribute("open")
    await userEvent.click(within(projectSwitcher).getByText("프로젝트 이동"))
    expect(projectMenu).toHaveAttribute("open")

    expect(
        within(projectSwitcher).getByRole("list", { name: "경력 프로젝트 바로가기" }),
    ).toBeInTheDocument()
    expect(
        within(projectSwitcher).getByRole("list", { name: "개인 프로젝트 바로가기" }),
    ).toBeInTheDocument()
    expect(
        within(projectSwitcher).getByRole("list", {
            name: "오픈소스 및 개발 도구 바로가기",
        }),
    ).toBeInTheDocument()

    expect(
        within(projectSwitcher).getByRole("link", { name: "BATON 프로젝트로 이동" }),
    ).toHaveAttribute("aria-current", "page")
    expect(
        within(projectSwitcher).getByRole("link", {
            name: "전송형 전자영장 시스템 프로젝트로 이동",
        }),
    ).toHaveAttribute("href", "/projects/e-warrant")
    expect(
        within(projectSwitcher).getByRole("link", { name: "happyGallery 프로젝트로 이동" }),
    ).toHaveAttribute("href", "/projects/happygallery")
    expect(
        within(projectSwitcher).getByRole("link", {
            name: "차세대 군사법 정보 시스템 프로젝트로 이동",
        }),
    ).toHaveAttribute("href", "/projects/defense")

    await userEvent.click(
        within(projectSwitcher).getByRole("link", { name: "BATON 프로젝트로 이동" }),
    )
    expect(projectMenu).not.toHaveAttribute("open")

    const serviceSwitcher = screen.getByRole("navigation", {
        name: "BATON 서비스 바로가기",
    })

    expect(within(serviceSwitcher).getByRole("link", { name: "Core" })).toHaveAttribute(
        "aria-current",
        "page",
    )
    const serviceRoutes = ["GO", "WATCH", "RELAY", "BRIEF", "CAL", "ROUND"]

    serviceRoutes.forEach((service) => {
        expect(within(serviceSwitcher).getByRole("link", { name: service })).toHaveAttribute(
            "href",
            `/projects/baton/${service.toLowerCase()}`,
        )
    })
})

test("happyGallery는 공개 근거를 상단에서 연결하고 보조 문제를 접어 둔다", () => {
    renderWithRouter(<ProjectCaseStudy projectId="happygallery" />)

    const evidenceLinks = screen.getByRole("list", { name: "프로젝트 자료 바로가기" })

    expect(
        screen.getByText(/공방의 작품 판매와 클래스 예약을 온라인으로 처리하는 서비스입니다/),
    ).toBeInTheDocument()
    expect(screen.queryByText(/^결제 응답 누락,/)).not.toBeInTheDocument()
    expect(evidenceLinks).toHaveTextContent("GitHub 저장소")
    expect(evidenceLinks).toHaveTextContent("대표 문서")
    expect(screen.getByText("추가 문제 해결 6건 보기").closest("details")).not.toHaveAttribute(
        "open",
    )
    expect(screen.getByRole("heading", { name: "대표 화면" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "대표 화면" })).toHaveAttribute(
        "href",
        "#project-system",
    )
})

test("전자영장 상세는 BEINTECH 소속 LG CNS 컨소시엄의 연계 흐름과 기술 판단을 보여준다", () => {
    renderWithRouter(<ProjectCaseStudy projectId="warrant" />)

    expect(screen.getByText("경력 프로젝트 01 / 02")).toBeInTheDocument()
    expect(
        screen.getByRole("heading", { name: "전송형 전자영장 시스템", level: 1 }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("heading", { name: "독립망 간 업무 흐름 및 시스템 구성" }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: /해양경찰 사건수사시스템 KICS 업무망의 자료 제공 요청이 LG CNS가 주관하는 집행포털 인터넷망을 거쳐 금융기관 업무망과 통신사 전용망으로 전달/,
        }),
    ).toBeInTheDocument()
    expect(screen.getByText("BEINTECH / LG CNS 컨소시엄 / 독립망 기관 연계")).toBeInTheDocument()
    expect(screen.getByText("BEINTECH / LG CNS 컨소시엄 / 독립망 간 기관 연계")).toBeInTheDocument()
    expect(screen.getByText("BEINTECH / LG CNS 컨소시엄 공공 SI")).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "PDF 변환 요청 상태 저장 전 도착한 완료 콜백 재처리",
        }),
    ).toBeInTheDocument()
    expect(screen.getAllByText("자료 제공 요청").length).toBeGreaterThan(0)
    expect(screen.getAllByText("제출 자료").length).toBeGreaterThan(0)
    expect(screen.getAllByText("행정망").length).toBeGreaterThan(0)
    expect(screen.getAllByText("인터넷망 / LG CNS 주관").length).toBeGreaterThan(0)
    expect(
        screen.getByRole("list", { name: "전송형 전자영장 시스템 기술 스택" }),
    ).toHaveTextContent("Oracle DB")
    expect(screen.getByText(/^\* 사법기관 KICS,/)).toBeInTheDocument()
    expect(screen.getAllByText(/REQUIRES_NEW/).length).toBeGreaterThan(0)
    expect(
        screen.getByText(
            /인터페이스 동시호출을 제한하기 위해 사용한 ReentrantLock은 단일 서버 싱글톤 빈 기준/,
        ),
    ).toHaveTextContent("서버를 여러 대로 늘리면 분산 락 방식이 필요합니다")
    expect(screen.queryByText("군교정 업무")).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "문서 분류와 대표 문서" })).not.toBeInTheDocument()
})

test("군사법 상세는 세 기관의 데이터 연계와 레거시 환경의 보안 및 장애 대응을 구체적으로 보여준다", () => {
    renderWithRouter(<ProjectCaseStudy projectId="defense" />)

    expect(
        screen.getByRole("heading", {
            name: "수용자 인적정보 및 영장정보 연계 배치 흐름",
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: /군사법원, 군검찰 및 군사경찰에서 수용 대상자의 인적정보와 영장정보를 전달하고, 기관별 배치가 필수값과 형식을 검증한 뒤 군교정 DB에 반영/,
        }),
    ).toBeInTheDocument()
    expect(screen.getAllByText("군사법원").length).toBeGreaterThan(0)
    expect(screen.getAllByText("군검찰").length).toBeGreaterThan(0)
    expect(screen.getAllByText("군사경찰").length).toBeGreaterThan(0)
    expect(screen.getByText("수용자 정보 검증 배치")).toBeInTheDocument()
    expect(screen.getByRole("list", { name: "배치 처리 단계" })).toHaveTextContent(
        "기관별 데이터 수신인적정보 및 영장정보 검증군교정 DB 반영",
    )

    const problems = screen.getByRole("list", { name: "대표 문제 해결 목록" })

    expect(problems).toHaveTextContent("Spring Security가 생성한 CSRF 토큰")
    expect(problems).toHaveTextContent("WebSquare 화면 데이터 규격")
    expect(problems).toHaveTextContent("Spring Security 필터에서 차단")
    expect(problems).toHaveTextContent("WAS 업로드 요청 검증")
    expect(problems).toHaveTextContent("Presigned URL")
    expect(problems).toHaveTextContent("파일 본문은 수신하거나 중계하지 않아")
    expect(problems).toHaveTextContent("기존 파일 솔루션 로직을 수정하지 않으면서")
    expect(problems).toHaveTextContent("WAS 메모리 및 I/O 부하와 OOM 위험을 방지")
    expect(problems).toHaveTextContent("Jenkins 실행 이력")
    expect(problems).toHaveTextContent("JEUS 및 WAS 로그")
    expect(problems).toHaveTextContent("Tibero의 입력 데이터")

    expect(document.body).not.toHaveTextContent("기관 A")
    expect(document.body).not.toHaveTextContent("기관 B")
    expect(document.body).not.toHaveTextContent("기관 C")
    expect(document.body).not.toHaveTextContent("연계 배치 3종")
    expect(document.body).not.toHaveTextContent("log → DB → batch")
    expect(document.body).not.toHaveTextContent("WebSquare 보안 연동")
    expect(document.body).not.toHaveTextContent("Apache Tika")
})

test("BATON 마이크로서비스 상세도 책임, 문제 해결과 문서로 바로 이동할 수 있다", () => {
    renderWithRouter(<BatonServiceCaseStudy serviceId="watch" />)

    expect(
        screen.getByRole("navigation", { name: "서비스 상세 섹션 바로가기" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("list", { name: "WATCH 대표 문제 해결 목록" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "책임" })).toHaveAttribute("href", "#service-boundary")
    expect(screen.getByRole("link", { name: "문제 해결" })).toHaveAttribute(
        "href",
        "#service-problems",
    )
    expect(screen.getByRole("link", { name: "문서" })).toHaveAttribute("href", "#service-documents")
    expect(screen.getByRole("link", { name: "사용 기술" })).toHaveAttribute(
        "href",
        "#service-stack",
    )

    const serviceSwitcher = screen.getByRole("navigation", {
        name: "BATON 서비스 바로가기",
    })

    expect(within(serviceSwitcher).getByRole("link", { name: "WATCH" })).toHaveAttribute(
        "aria-current",
        "page",
    )
    expect(within(serviceSwitcher).getByRole("link", { name: "Core" })).toHaveAttribute(
        "href",
        "/projects/baton",
    )
    const serviceFacts = screen.getByLabelText("서비스 정보")
    expect(within(serviceFacts).getByText("DB")).toBeInTheDocument()
    expect(within(serviceFacts).getByText("공개 범위")).toBeInTheDocument()
    expect(within(serviceFacts).getByText("문서 및 테스트")).toBeInTheDocument()
})

test.each([
    [
        "go",
        "GO",
        "BATON과 ROUND의 허용된 화면만 짧고 고정된 주소로 연결하고, 최종 접근 권한은 각 대상 서비스가 계속 판정하도록 경계를 유지합니다.",
        "UUID 멱등 키, HMAC-SHA256 코드, BATON 및 ROUND의 정확한 대상 계약",
    ],
    [
        "watch",
        "WATCH",
        "BATON에 등록된 외부 URL을 SSRF 방어 기준으로 점검하고, 저장된 이전 점검 결과와 달라진 경우 URL 상태 변경 이벤트를 Core에 전달합니다.",
        "SSRF 방어, 작업 선점 만료 후 다른 서버의 재처리, 이전 작업 결과 반영 차단, 아웃박스",
    ],
    [
        "relay",
        "RELAY",
        "BATON의 알림 이벤트를 외부 메시지 공급자에 전달하고 전송 성공, 실패와 공급자 응답 유실로 결과를 확인할 수 없는 경우를 구분해 저장합니다.",
        "수신 이력(Inbox) 중복 제거, 작업 선점, 재시도와 전송 결과 미확인 상태",
    ],
    [
        "brief",
        "BRIEF",
        "BATON의 다섯 연속성 신호를 설명 가능한 현재 관심 항목으로 투영하고, 일정 시점의 상태를 수정하지 않는 주간 운영 브리프로 고정합니다.",
        "운영 이벤트 멱등 수신, 관심 항목 투영 및 재구축, 수정하지 않는 주간 에디션",
    ],
    [
        "cal",
        "CAL",
        "BATON에서 확정한 일정과 마감을 외부 캘린더 앱에서 구독할 수 있는 읽기 전용 피드로 제공합니다.",
        "iCalendar(.ics) 피드, 구독 토큰 회전 및 폐기, ETag 조건부 조회",
    ],
    [
        "round",
        "ROUND",
        "BATON Core가 계정과 스터디 멤버십을 확인해 발급한 참여권을 검증하고, 최대 6명의 WebRTC 방과 피어, 시그널링과 TURN 자격 증명을 관리합니다.",
        "6인 mesh WebRTC, 협상 세대, DataChannel ACK, RS256 및 JWK 참여권, 짧은 TURN 자격 증명",
    ],
])("BATON %s 상세 상단은 %s의 서비스 목적을 먼저 설명한다", (id, name, summary, detail) => {
    renderWithRouter(<BatonServiceCaseStudy serviceId={id} />)

    const heading = screen.getByRole("heading", { name, level: 1 })
    const hero = heading.closest("header")

    expect(within(hero).getByText(summary)).toBeInTheDocument()
    expect(within(hero).queryByText(detail)).not.toBeInTheDocument()
    expect(screen.getByText(detail)).toBeInTheDocument()
})

test.each([
    ["go", "GO", ["Java 21", "Spring Data JPA", "MySQL 8.4"]],
    ["watch", "WATCH", ["Spring JDBC", "PostgreSQL 18", "Apache HttpClient 5"]],
    ["relay", "RELAY", ["RabbitMQ / Spring AMQP", "AWS SQS FIFO", "PostgreSQL 18"]],
    ["brief", "BRIEF", ["Kotlin 2.3", "Java 21", "Spring JDBC"]],
    ["cal", "CAL", ["Kotlin 2.3", "Java 25", "iCal4j 4.2"]],
    ["round", "ROUND", ["React 19", "WebRTC / RTCDataChannel", "Raw WebSocket"]],
])(
    "BATON %s 상세는 %s 구현에 실제 사용한 기술을 Core와 같은 위치에 보여준다",
    (id, name, stack) => {
        renderWithRouter(<BatonServiceCaseStudy serviceId={id} />)

        const stackList = screen.getByRole("list", { name: `${name} 기술 스택` })
        const stackSection = stackList.closest("section")
        const documentsSection = screen
            .getByRole("heading", { name: "문서 분류와 대표 문서" })
            .closest("section")
        const renderedStack = within(stackList)
            .getAllByRole("listitem")
            .map((item) => item.textContent)

        expect(renderedStack).toEqual(expect.arrayContaining(stack))
        expect(stackSection).toHaveClass("case-meta")
        expect(within(stackSection).getByRole("heading", { name: "사용 기술" })).toBeInTheDocument()
        expect(within(stackSection).getByRole("heading", { name: "관련 링크" })).toBeInTheDocument()
        expect(
            documentsSection.compareDocumentPosition(stackSection) &
                Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
    },
)

test.each([
    [
        "brief",
        "BRIEF",
        "중복 및 순서가 바뀐 운영 이벤트 처리",
        "https://github.com/ljkhyeong/baton-brief",
        /공개 main 반영 전/,
        /공개 main은 초기 스캐폴드/,
    ],
    [
        "cal",
        "CAL",
        "중복 및 순서가 바뀐 일정 스냅샷 처리",
        "https://github.com/ljkhyeong/baton-cal",
        /실제 BATON 직렬화 및 CAL 컨테이너 교차 검증/,
        /안정 계약 1.0.0과 Core 생산자 계약 검증/,
    ],
])(
    "BATON %s 상세는 구현 범위와 공개 저장소 상태를 정확히 보여준다",
    (id, name, problem, repository, status, repositoryNote) => {
        renderWithRouter(<BatonServiceCaseStudy serviceId={id} />)

        expect(screen.getByRole("heading", { name, level: 1 })).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: problem })).toBeInTheDocument()
        expect(screen.getByLabelText("구현 상태")).toHaveTextContent(status)
        expect(
            screen.getByRole("link", { name: new RegExp(`${name} 공개 저장소 보기`) }),
        ).toHaveAttribute("href", repository)
        expect(screen.getByText(repositoryNote)).toBeInTheDocument()
    },
)

test("BATON ROUND 상세는 비공개 서비스의 참여권 경계와 남은 파일럿 범위를 구분한다", () => {
    renderWithRouter(<BatonServiceCaseStudy serviceId="round" />)

    expect(screen.getByRole("heading", { name: "ROUND", level: 1 })).toBeInTheDocument()
    expect(
        screen.getByRole("heading", { name: "BATON 권한 판정과 WebRTC 실시간 경로 분리" }),
    ).toBeInTheDocument()
    expect(screen.getByText(/공인 DNS 및 ACME/)).toBeInTheDocument()
    expect(screen.getByText("비공개 저장소 / 공개 가능 요약")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /ROUND.*저장소/ })).not.toBeInTheDocument()
})

test("WebRTC/HLS 상세는 교육 프로젝트로 표시하고 제목 단위를 보존한다", () => {
    renderWithRouter(<ProjectCaseStudy projectId="webrtc" />)

    expect(screen.getByText("교육 프로젝트")).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            level: 1,
            name: "WebRTC/HLS 현장강의 보조 서비스",
        }),
    ).toBeInTheDocument()
    expect(screen.getByText("WebRTC/HLS")).toBeInTheDocument()
    expect(screen.getByText("현장강의 보조 서비스")).toBeInTheDocument()
})

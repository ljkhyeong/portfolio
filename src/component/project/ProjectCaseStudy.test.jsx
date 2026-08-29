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
    expect(screen.getByRole("link", { name: "구현 방법" })).toHaveAttribute(
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

    expect(
        screen.getByRole("img", {
            name: /BATON 서비스 아키텍처.*BATON Core가 허용 경로, URL 버전, 운영 및 일정 이벤트와 RS256 참여권/,
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("region", { name: "BATON 서비스 아키텍처 가로 스크롤 영역" }),
    ).toHaveAttribute("tabindex", "0")
    expect(
        screen.getByRole("heading", { name: "서비스별 책임과 검증 근거" }),
    ).toBeInTheDocument()

    const evidenceLinks = screen.getByRole("list", { name: "프로젝트 자료 바로가기" })

    expect(evidenceLinks).toHaveTextContent("GitHub 저장소")
    expect(evidenceLinks).toHaveTextContent("대표 문서")
    expect(
        within(evidenceLinks).getByRole("link", {
            name: "BATON WATCH GitHub 저장소 새 창에서 보기",
        }),
    ).toHaveAttribute("href", "https://github.com/ljkhyeong/baton-watch")

    const additionalProblems = screen.getByText("추가 문제 해결 10건 보기").closest("details")
    const featuredProblemList = screen.getByRole("list", { name: "주요 문제와 해결 방법 목록" })

    expect(additionalProblems).not.toHaveAttribute("open")
    expect(within(featuredProblemList).getAllByRole("listitem")).toHaveLength(4)

    await userEvent.click(screen.getByText("추가 문제 해결 10건 보기"))

    expect(additionalProblems).toHaveAttribute("open")
    expect(screen.getByRole("list", { name: "추가 문제와 해결 방법 목록" })).toBeInTheDocument()

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
        expect(
            screen.getByRole("link", {
                name: `BATON ${service} 마이크로서비스 상세 보기`,
            }),
        ).toHaveAttribute("href", `/projects/baton/${service.toLowerCase()}`)
    })
})

test("happyGallery는 공개 근거를 상단에서 연결하고 보조 문제를 접어 둔다", () => {
    renderWithRouter(<ProjectCaseStudy projectId="happygallery" />)

    const evidenceLinks = screen.getByRole("list", { name: "프로젝트 자료 바로가기" })

    expect(screen.getByText(/공방 고객이 작품을 주문하고 클래스를 예약하며/)).toBeInTheDocument()
    expect(screen.getByText("주요 구현 및 해결")).toBeInTheDocument()
    expect(
        screen.getByText(/요구사항, 기술 선택, 테스트, 배포 및 장애 재처리 절차별로/),
    ).toBeInTheDocument()
    expect(screen.queryByText(/^결제 응답 누락,/)).not.toBeInTheDocument()
    expect(evidenceLinks).toHaveTextContent("GitHub 저장소")
    expect(evidenceLinks).toHaveTextContent("대표 문서")
    expect(screen.getByText("추가 문제 해결 7건 보기").closest("details")).not.toHaveAttribute(
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
            name: /전송형 전자영장 기관 연계 흐름.*해양경찰 KICS의 자료 제공 요청이 전자영장 집행포털에서 기관별 형식으로 변환/,
        }),
    ).toBeInTheDocument()
    expect(screen.getByText("FIG 03 / BEINTECH × LG CNS")).toBeInTheDocument()
    expect(
        screen.getByRole("region", { name: "전자영장 기관 연계 흐름 가로 스크롤 영역" }),
    ).toHaveAttribute("tabindex", "0")
    expect(screen.getByText("BEINTECH / LG CNS 컨소시엄 공공 SI")).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "PDF 변환 요청 상태가 저장되기 전에 도착한 완료 응답 재처리",
        }),
    ).toBeInTheDocument()
    expect(screen.getAllByText("자료 제공 요청").length).toBeGreaterThan(0)
    expect(screen.getAllByText("제출 자료").length).toBeGreaterThan(0)
    expect(screen.getAllByText("행정망").length).toBeGreaterThan(0)
    expect(screen.getAllByText("인터넷망 / LG CNS 주관").length).toBeGreaterThan(0)
    expect(
        screen.getByRole("list", { name: "전송형 전자영장 시스템 기술 스택" }),
    ).toHaveTextContent("Oracle DB")
    expect(
        screen.getByText(/전체 시스템은 KICS, 집행포털, 금융기관 및 통신사의 독립망 사이에서/),
    ).toBeInTheDocument()
    expect(
        screen.getByText(/이 가운데 KICS 요청을 통신사와 집행포털 규격으로 변환해 보내고/),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/REQUIRES_NEW/).length).toBeGreaterThan(0)
    expect(screen.getByText(/ReentrantLock은 한 서버 프로세스 안에서만 유효/)).toHaveTextContent(
        "서버를 여러 대로 확장하면 DB 잠금이나 분산 잠금",
    )
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

    const problems = screen.getByRole("list", { name: "주요 문제와 해결 방법 목록" })

    expect(problems).toHaveTextContent("Spring Security가 생성한 CSRF 토큰")
    expect(problems).toHaveTextContent("WebSquare 화면 데이터 규격")
    expect(problems).toHaveTextContent("Spring Security 필터에서 차단")
    expect(problems).toHaveTextContent("업무 서버에 업로드 권한과 파일 정보를 요청")
    expect(problems).toHaveTextContent("Presigned URL")
    expect(problems).toHaveTextContent("업무 서버는 파일 본문을 받거나 중계하지 않았습니다")
    expect(problems).toHaveTextContent("대용량 파일을 업무 서버를 거치지 않고 저장소로 직접 업로드")
    expect(problems).toHaveTextContent("Jenkins 실행 이력")
    expect(problems).toHaveTextContent("JEUS 및 업무 서버 로그")
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
    expect(screen.getByRole("list", { name: "WATCH 문제와 해결 방법 목록" })).toBeInTheDocument()
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
        "허용 목록에 등록한 BATON 및 ROUND 경로만 짧은 코드와 연결합니다. GO는 목적지로 이동시키는 역할만 하고 실제 접근 허용 여부는 BATON 또는 ROUND가 직접 확인합니다.",
        "UUID 처리 기록, 저장된 링크 조건 직접 비교, HMAC-SHA256 링크 코드와 허용 대상 및 경로 확인",
    ],
    [
        "watch",
        "WATCH",
        "Core에 등록된 외부 URL이 사설망이나 로컬 주소로 연결되지 않는지 확인한 뒤 상태를 점검합니다. 저장된 이전 결과와 달라지면 URL 상태 변경 이벤트를 Core에 전달합니다.",
        "사설망 및 로컬 주소 접근 차단, 중단된 점검 재처리, 이전 점검 결과의 덮어쓰기 차단과 미전송 이벤트 보관",
    ],
    [
        "relay",
        "RELAY",
        "Core가 발행한 BATON 이벤트를 등록된 HTTP Webhook 또는 SQS FIFO 큐로 전달합니다. Webhook 호출 또는 SQS 전송 요청의 성공, 전송 전 실패와 요청 결과를 확인할 수 없는 경우를 구분해 저장합니다.",
        "같은 이벤트 재수신 시 전송 대상별 새 작업 생성 차단, DB에서 다른 서버가 처리하지 않은 작업 선택, 제한 횟수 재시도와 전송 성공 여부를 모르는 작업의 별도 보관",
    ],
    [
        "brief",
        "BRIEF",
        [
            "두 번째 이벤트 형식(v2)을 받아 운영 점검 목록",
            "담당자가 없는 역할과 담당 종료가 임박했지만 후임자가 없는 역할",
            "책임 목록, 인수인계에 포함할 업무 항목과 역할 수행 자료",
            "마지막으로 받은 이벤트 순번과 포함 항목",
            "이미 만든 보고서는 수정하지 않습니다",
        ],
        "이벤트 중복 및 구버전 차단, 저장 이벤트로 운영 점검 목록 다시 생성, 생성 후 수정하지 않는 주간 보고서",
    ],
    [
        "cal",
        "CAL",
        "Core가 확정한 일정과 마감을 외부 캘린더 앱에서 구독할 수 있는 읽기 전용 피드로 제공합니다.",
        "외부 캘린더용 .ics 피드, 구독 주소의 토큰 교체 및 폐기, 일정이 바뀌지 않았을 때 304를 반환하는 캐시 처리",
    ],
    [
        "round",
        "ROUND",
        "Core가 계정에 연결된 활동 중인 스터디 구성원인지 확인해 발급한 방 참여권을 검증합니다. 최대 6명의 브라우저가 영상 및 음성 연결을 만들 때 교환하는 연결 설명(offer 및 answer)과 네트워크 경로 후보(ICE)를 WebSocket으로 전달하고, 직접 연결할 수 없을 때 사용할 TURN 서버의 짧은 접속 정보도 발급합니다.",
        "참가자마다 나머지 최대 5명과 직접 연결하는 mesh WebRTC, 이전 연결의 늦은 메시지 차단, DataChannel 채팅이 상대 브라우저 애플리케이션에 도착했는지 확인하는 응답, Core가 RSA 개인 키로 서명하고 ROUND가 공개 키로 검증하는 RS256 참여권과 짧은 TURN 접속 정보",
    ],
])("BATON %s 상세 상단은 %s의 서비스 목적을 먼저 설명한다", (id, name, summary, detail) => {
    renderWithRouter(<BatonServiceCaseStudy serviceId={id} />)

    const heading = screen.getByRole("heading", { name, level: 1 })
    const hero = heading.closest("header")
    const summaryParagraph = hero.querySelector("p")

    if (Array.isArray(summary)) {
        summary.forEach((expected) => expect(summaryParagraph).toHaveTextContent(expected))
    } else {
        expect(within(hero).getByText(summary)).toBeInTheDocument()
    }
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
        "중복되거나 순서가 바뀐 BATON 이벤트 차단",
        "https://github.com/ljkhyeong/baton-brief/tree/61584199a5caaa15cdb65ab071977cde74029d08",
        /BRIEF 개발 브랜치 고정 커밋 보기/,
        /공개 main 반영 전/,
        /최신 구현은 원격 개발 브랜치에 있으며 공개 main에는 아직 반영하지 않았습니다/,
    ],
    [
        "cal",
        "CAL",
        "중복되거나 순서가 바뀐 일정 JSON 차단",
        "https://github.com/ljkhyeong/baton-cal/tree/fba74a22c9d62e940ccb5287947051f7a8d31f89",
        /CAL 개발 브랜치 고정 커밋 보기/,
        /Core의 실제 일정 JSON 생성 코드로 만든 데이터를 CAL 컨테이너에 보내 정상 반영/,
        /안정 계약 1.0.0의 Core 호환성 근거와 미공개 개발 후보 1.1.0-rc.1/,
    ],
])(
    "BATON %s 상세는 구현 범위와 공개 저장소 상태를 정확히 보여준다",
    (id, name, problem, repository, repositoryLinkName, status, repositoryNote) => {
        renderWithRouter(<BatonServiceCaseStudy serviceId={id} />)

        expect(screen.getByRole("heading", { name, level: 1 })).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: problem })).toBeInTheDocument()
        expect(screen.getByLabelText("구현 상태")).toHaveTextContent(status)
        expect(screen.getByRole("link", { name: repositoryLinkName })).toHaveAttribute(
            "href",
            repository,
        )
        expect(screen.getByText(repositoryNote)).toBeInTheDocument()
    },
)

test("BATON ROUND 상세는 Core의 방 입장 확인과 ROUND의 WebRTC 처리를 구분한다", () => {
    renderWithRouter(<BatonServiceCaseStudy serviceId="round" />)

    expect(screen.getByRole("heading", { name: "ROUND", level: 1 })).toBeInTheDocument()
    expect(
        screen.getByRole("heading", {
            name: "Core는 방 입장 권한을 확인하고 ROUND는 WebRTC 메시지만 처리",
        }),
    ).toBeInTheDocument()
    expect(screen.getByText(/공인 DNS와 자동 발급 TLS 인증서/)).toBeInTheDocument()
    expect(screen.getByText("비공개 저장소 / 설계와 테스트 요약 공개")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /ROUND.*저장소/ })).not.toBeInTheDocument()
})

test("WebRTC/HLS 상세는 RTP 입력부터 실시간 및 다시보기 구현과 지연 개선을 보여준다", async () => {
    renderWithRouter(<ProjectCaseStudy projectId="webrtc" />)

    expect(screen.getAllByText("교육 프로젝트")).toHaveLength(2)
    expect(
        screen.getByRole("heading", {
            level: 1,
            name: "WebRTC/HLS 현장강의 보조 서비스",
        }),
    ).toBeInTheDocument()
    expect(screen.getByText("WebRTC/HLS")).toBeInTheDocument()
    expect(screen.getByText("현장강의 보조 서비스")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "미디어 처리 흐름" })).toHaveAttribute(
        "href",
        "#project-system",
    )
    expect(
        screen.getByRole("heading", {
            name: "WebRTC 실시간 재생과 RTP 출력의 HLS 다시보기 흐름",
        }),
    ).toBeInTheDocument()
    expect(
        screen.getByRole("img", {
            name: /강의 영상을 mediasoup에서 WebRTC로 React 실시간 화면에 전달하고, mediasoup의 RTP 출력은 FFmpeg와 GStreamer에서 HLS로 변환/,
        }),
    ).toBeInTheDocument()
    expect(screen.getByText("mediasoup → WebRTC")).toBeInTheDocument()
    expect(screen.getByText("RTP 출력 → FFmpeg / GStreamer")).toBeInTheDocument()
    expect(screen.getByText("React 실시간 시청")).toBeInTheDocument()
    expect(screen.getByText("React 지난 구간 재생")).toBeInTheDocument()

    const problems = screen.getByRole("list", { name: "주요 문제와 해결 방법 목록" })
    const [mediaFlowProblem] = within(problems).getAllByRole("listitem")

    expect(within(problems).getAllByRole("listitem")).toHaveLength(2)
    expect(problems).toHaveTextContent(
        "현재 강의는 WebRTC로 실시간 재생하고 지난 구간은 HLS로 다시보기 제공",
    )
    expect(problems).toHaveTextContent("HLS 다시보기 재생 지연을 약 35초에서 약 17초로 단축")

    await userEvent.click(
        within(mediaFlowProblem).getByText(
            "현재 강의는 WebRTC로 실시간 재생하고 지난 구간은 HLS로 다시보기 제공",
        ),
    )

    expect(mediaFlowProblem).toHaveTextContent("문제 상황")
    expect(mediaFlowProblem).toHaveTextContent("적용한 방법")
    expect(mediaFlowProblem).toHaveTextContent("테스트 및 확인")
    expect(mediaFlowProblem).toHaveTextContent(
        "mediasoup의 RTP 출력을 입력받고 FFmpeg와 GStreamer로 HLS 세그먼트 및 재생 목록을 생성",
    )

    const proofs = screen.getByRole("list", { name: "구현 범위 및 확인 결과 목록" })

    expect(proofs).toHaveTextContent("WebRTC 실시간 재생과 RTP 출력의 HLS 다시보기 변환")
    expect(proofs).toHaveTextContent("HLS 다시보기 재생 지연을 약 35초에서 약 17초로 단축")
    expect(
        screen.getByRole("list", { name: "WebRTC/HLS 현장강의 보조 서비스 기술 스택" }),
    ).toHaveTextContent("mediasoupFFmpegGStreamer")
})

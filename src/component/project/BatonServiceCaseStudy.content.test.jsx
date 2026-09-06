import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { projectsById } from "../../data/projects"
import BatonServiceCaseStudy from "./BatonServiceCaseStudy"

const renderService = (serviceId) =>
    render(
        <MemoryRouter initialEntries={[`/projects/baton/${serviceId}`]}>
            <BatonServiceCaseStudy serviceId={serviceId} />
        </MemoryRouter>,
    )

test.each(["go", "watch", "relay", "brief", "cal", "round"])(
    "BATON %s 상세는 공통 설계 대신 서비스 고유 근거를 보여준다",
    (serviceId) => {
        const project = projectsById.baton
        const service = project.services.find((candidate) => candidate.id === serviceId)

        renderService(serviceId)

        const problems = screen.getByRole("list", {
            name: `${service.name} 문제와 해결 방법 목록`,
        })

        expect(within(problems).getAllByRole("listitem")).toHaveLength(1)
        expect(screen.getByText("대표 사례")).toBeVisible()
        const problemSection = problems.closest("section")
        const flowSection = document.getElementById("service-boundary")
        expect(
            flowSection.compareDocumentPosition(problemSection) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
        expect(
            screen.queryByRole("heading", {
                name: "Core와 6개 서비스의 담당 업무, 실행 환경과 데이터 저장 방식 분리",
            }),
        ).not.toBeInTheDocument()
        expect(screen.queryByText(project.architecture.tradeoff)).not.toBeInTheDocument()
        expect(screen.getByText(`${service.name}의 적용 범위와 제약`)).toBeInTheDocument()
        expect(screen.getByText(service.tradeoff)).toBeInTheDocument()
        expect(screen.getByText(service.contribution)).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "사용 기술" })).toHaveAttribute(
            "href",
            "#service-stack",
        )

        const documents = document.getElementById("service-documents")
        project.documents
            .filter((entry) => entry.serviceId === serviceId)
            .forEach((entry) => {
                const link = within(documents).getByRole("link", { name: entry.label })
                const type = within(link.closest("article")).getByText(entry.type)
                expect(link).not.toHaveTextContent(entry.type)
                expect(
                    link.compareDocumentPosition(type) & Node.DOCUMENT_POSITION_FOLLOWING,
                ).toBeTruthy()
            })
    },
)

test("ROUND의 통과 범위, 설계상 제한과 미검증 범위를 나눠 표시한다", () => {
    renderService("round")

    const status = screen.getByLabelText("구현 상태")
    const verified = within(status).getByText("확인됨").closest("div")
    const limited = within(status).getByText("설계상 제한").closest("div")
    const unverified = within(status).getByText("미검증").closest("div")

    expect(verified).toHaveClass("baton-service-status__item--verified")
    expect(verified).toHaveTextContent("가상 카메라 2명을 로컬 서버에 연결")
    expect(verified).toHaveTextContent("Core 연동")
    expect(verified).toHaveTextContent("손들기·공용 타이머·주제")
    expect(verified).toHaveTextContent("화면을 확인")
    expect(limited).toHaveClass("baton-service-status__item--limited")
    expect(limited).toHaveTextContent("방과 참가자 연결 상태는 프로세스 메모리")
    expect(limited).toHaveTextContent("단일 시그널링 인스턴스")
    expect(unverified).toHaveClass("baton-service-status__item--unverified")
    expect(unverified).toHaveTextContent("Cloudflare TURN 중계 전용 연결")
    expect(unverified).toHaveTextContent("Safari 실기기")
    expect(unverified).toHaveTextContent("외부망과 6명 장시간 접속")
    expect(status).not.toHaveTextContent("restic 실행 파일 부재")
})

test("ROUND의 입장 확인, 통화와 화면 공유를 현재 대표 화면으로 연다", () => {
    renderService("round")

    const gallery = screen.getByRole("group", { name: "BATON ROUND 대표 화면" })
    const expectedScreens = [
        {
            label: "스터디 진행 도구",
            src: "baton-round-study.webp",
            height: 960,
            alt: "두 참가자가 연결된 방에서 공용 타이머·주제와 손들기 순서를 확인하는 화면",
        },
        {
            label: "입장 전 장치 확인",
            src: "baton-round-prejoin.webp",
            alt: "BATON ROUND 입장 전 화면에서 카메라와 마이크를 확인하는 모습",
        },
        {
            label: "통화와 채팅",
            src: "baton-round-call-chat.webp",
            alt: "BATON ROUND 통화 화면에서 참가자 영상과 채팅을 확인하는 모습",
        },
        {
            label: "화면 공유",
            src: "baton-round-screen-share.webp",
            alt: "BATON ROUND 통화 화면에서 공유 화면과 통화 제어를 확인하는 모습",
        },
    ]

    expect(within(gallery).getAllByRole("button")).toHaveLength(expectedScreens.length)

    expectedScreens.forEach(({ label, src, alt, height = 900 }) => {
        expect(
            within(gallery).getByRole("button", {
                name: `BATON ROUND ${label} 화면 확대해서 보기`,
            }),
        ).toBeVisible()

        const image = within(gallery).getByRole("img", { name: alt })
        expect(image).toHaveAttribute("src", expect.stringContaining(src))
        expect(image).toHaveAttribute("width", "1440")
        expect(image).toHaveAttribute("height", String(height))
    })
})

test("GO의 동시 요청 검증을 전체 배포 검증으로 표시하지 않는다", () => {
    renderService("go")

    const status = screen.getByLabelText("구현 상태")
    const verified = within(status).getByText("확인됨").closest("div")
    const unverified = within(status).getByText("미검증").closest("div")

    expect(verified).toHaveTextContent("같은 요청 8건의 동시 처리")
    expect(unverified).toHaveTextContent("실제 클러스터와 공개 배포는 미검증")
})

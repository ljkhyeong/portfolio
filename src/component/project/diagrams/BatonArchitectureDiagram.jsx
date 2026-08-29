import useCenteredDiagramViewport from "./useCenteredDiagramViewport"

const NODE_DEFINITIONS = [
    {
        id: "go",
        fallbackName: "GO",
        shortRole: "허용 경로의 짧은 링크",
        x: 40,
        y: 48,
    },
    {
        id: "watch",
        fallbackName: "WATCH",
        shortRole: "외부 URL 상태 점검",
        x: 40,
        y: 232,
    },
    {
        id: "relay",
        fallbackName: "RELAY",
        shortRole: "서비스 간 이벤트 전달",
        x: 40,
        y: 400,
    },
    {
        id: "core",
        fallbackName: "Core",
        shortRole: "조직, 역할 및 인수인계",
        x: 380,
        y: 232,
        focal: true,
    },
    {
        id: "brief",
        fallbackName: "BRIEF",
        shortRole: "운영 점검 및 주간 보고서",
        x: 720,
        y: 48,
    },
    {
        id: "cal",
        fallbackName: "CAL",
        shortRole: "읽기 전용 캘린더 구독",
        x: 720,
        y: 232,
    },
    {
        id: "round",
        fallbackName: "ROUND",
        shortRole: "WebRTC 스터디룸",
        x: 720,
        y: 400,
    },
]

const CONNECTIONS = [
    {
        id: "go",
        path: "M380 244 H332 Q324 244 324 236 V104 Q324 96 316 96 H240",
        label: "허용 경로 / 링크 코드",
        labelX: 390,
        labelY: 180,
        maskX: 332,
        maskY: 164,
        maskWidth: 116,
        maskHeight: 24,
        markerStart: "url(#baton-arrow-link)",
        markerEnd: "url(#baton-arrow-link)",
        variant: "link",
    },
    {
        id: "watch-request",
        path: "M380 264 H240",
        label: "URL 버전",
        labelX: 310,
        labelY: 248,
        maskX: 272,
        maskY: 240,
        maskWidth: 76,
        maskHeight: 12,
        markerEnd: "url(#baton-arrow)",
        variant: "default",
    },
    {
        id: "watch-event",
        path: "M240 296 H380",
        label: "상태 이벤트",
        labelX: 310,
        labelY: 284,
        maskX: 272,
        maskY: 276,
        maskWidth: 76,
        maskHeight: 12,
        markerEnd: "url(#baton-arrow)",
        variant: "async",
    },
    {
        id: "relay",
        path: "M380 316 H348 Q340 316 340 324 V440 Q340 448 332 448 H240",
        label: "BATON 이벤트",
        labelX: 278,
        labelY: 368,
        maskX: 224,
        maskY: 352,
        maskWidth: 108,
        maskHeight: 24,
        markerEnd: "url(#baton-arrow)",
        variant: "async",
    },
    {
        id: "brief",
        path: "M580 244 H628 Q636 244 636 236 V104 Q636 96 644 96 H720",
        label: "v2 운영 이벤트",
        labelX: 570,
        labelY: 180,
        maskX: 512,
        maskY: 164,
        maskWidth: 116,
        maskHeight: 24,
        markerEnd: "url(#baton-arrow)",
        variant: "async",
    },
    {
        id: "cal",
        path: "M580 280 H720",
        label: "일정 스냅샷",
        labelX: 650,
        labelY: 264,
        maskX: 608,
        maskY: 256,
        maskWidth: 84,
        maskHeight: 12,
        markerEnd: "url(#baton-arrow)",
        variant: "async",
    },
    {
        id: "round",
        path: "M580 316 H612 Q620 316 620 324 V440 Q620 448 628 448 H720",
        label: "RS256 참여권",
        labelX: 686,
        labelY: 368,
        maskX: 628,
        maskY: 352,
        maskWidth: 116,
        maskHeight: 24,
        markerEnd: "url(#baton-arrow)",
        variant: "default",
    },
]

const createServiceIndex = (services) =>
    new Map(services.map((service) => [service.primary ? "core" : service.id, service]))

const BatonArchitectureDiagram = ({ services = [] }) => {
    const serviceIndex = createServiceIndex(services)
    const viewportRef = useCenteredDiagramViewport()

    return (
        <figure className="editorial-diagram baton-architecture">
            <figcaption className="editorial-diagram__header baton-architecture__header">
                <span className="editorial-diagram__eyebrow baton-architecture__eyebrow">
                    SYSTEM ARCHITECTURE
                </span>
                <h3 className="editorial-diagram__title baton-architecture__title">
                    Core와 6개 서비스의 책임 및 연동 계약
                </h3>
                <p className="editorial-diagram__summary baton-architecture__summary">
                    Core는 조직, 역할 및 인수인계를 관리하고 6개 서비스는 허용 경로의 짧은 링크,
                    외부 URL 상태 점검, 서비스 간 이벤트 전달, 운영 점검과 주간 보고서, 읽기 전용
                    캘린더 구독 및 WebRTC 스터디룸을 각각 담당합니다. 선은 서비스 사이의 요청과
                    이벤트 계약을 나타내며 공개 환경 전체 연동 완료를 뜻하지 않습니다.
                </p>
            </figcaption>

            <div
                ref={viewportRef}
                className="editorial-diagram__viewport baton-architecture__viewport"
                role="region"
                aria-label="BATON 서비스 아키텍처 가로 스크롤 영역"
                tabIndex={0}
            >
                <svg
                    className="editorial-diagram__canvas baton-architecture__canvas"
                    viewBox="0 0 960 560"
                    role="img"
                    aria-labelledby="baton-architecture-title baton-architecture-desc"
                >
                    <title id="baton-architecture-title">
                        Core와 6개 서비스의 책임 및 연동 계약
                    </title>
                    <desc id="baton-architecture-desc">
                        Core가 조직, 역할 및 인수인계를 관리하고 6개 서비스가 허용 경로의 짧은 링크,
                        외부 URL 상태 점검, 서비스 간 이벤트 전달, 운영 점검과 주간 보고서, 읽기
                        전용 캘린더 구독 및 WebRTC 스터디룸을 맡는 구조입니다. 선은 서비스 사이의
                        요청과 이벤트 계약이며 공개 환경 전체 연동 완료를 뜻하지 않습니다.
                    </desc>
                    <defs>
                        <marker
                            id="baton-arrow"
                            markerWidth="8"
                            markerHeight="8"
                            refX="8"
                            refY="4"
                            orient="auto"
                        >
                            <path
                                className="baton-architecture__marker baton-architecture__marker--default"
                                d="M0 0 L8 4 L0 8 Z"
                            />
                        </marker>
                        <marker
                            id="baton-arrow-accent"
                            markerWidth="8"
                            markerHeight="8"
                            refX="8"
                            refY="4"
                            orient="auto"
                        >
                            <path
                                className="baton-architecture__marker baton-architecture__marker--accent"
                                d="M0 0 L8 4 L0 8 Z"
                            />
                        </marker>
                        <marker
                            id="baton-arrow-link"
                            markerWidth="8"
                            markerHeight="8"
                            refX="8"
                            refY="4"
                            orient="auto-start-reverse"
                        >
                            <path
                                className="baton-architecture__marker baton-architecture__marker--link"
                                d="M0 0 L8 4 L0 8 Z"
                            />
                        </marker>
                    </defs>

                    <rect
                        className="editorial-diagram__paper baton-architecture__background"
                        width="960"
                        height="560"
                    />

                    <g className="baton-architecture__connectors">
                        {CONNECTIONS.map((connection) => (
                            <path
                                key={connection.id}
                                className={`baton-architecture__connector baton-architecture__connector--${connection.variant}`}
                                d={connection.path}
                                markerStart={connection.markerStart}
                                markerEnd={connection.markerEnd}
                            />
                        ))}
                    </g>

                    <g className="baton-architecture__connection-labels">
                        {CONNECTIONS.map((connection) => (
                            <g key={connection.id} className="baton-architecture__connection-label">
                                <rect
                                    className="baton-architecture__label-mask"
                                    x={connection.maskX}
                                    y={connection.maskY}
                                    width={connection.maskWidth}
                                    height={connection.maskHeight}
                                />
                                <text
                                    className="baton-architecture__label"
                                    x={connection.labelX}
                                    y={connection.labelY}
                                    textAnchor="middle"
                                >
                                    {connection.label}
                                </text>
                            </g>
                        ))}
                    </g>

                    <g className="baton-architecture__nodes">
                        {NODE_DEFINITIONS.map((definition) => {
                            const service = serviceIndex.get(definition.id) ?? {
                                id: definition.id,
                                name: definition.fallbackName,
                                primary: definition.id === "core",
                            }

                            return (
                                <g
                                    key={definition.id}
                                    className={`baton-architecture__node${
                                        definition.focal ? " baton-architecture__node--focal" : ""
                                    }`}
                                    aria-label={`${service.name}: ${definition.shortRole}`}
                                >
                                    <rect
                                        className="baton-architecture__node-mask"
                                        x={definition.x}
                                        y={definition.y}
                                        width="200"
                                        height="96"
                                        rx="8"
                                    />
                                    <rect
                                        className="baton-architecture__node-surface"
                                        x={definition.x}
                                        y={definition.y}
                                        width="200"
                                        height="96"
                                        rx="8"
                                    />
                                    <rect
                                        className="baton-architecture__node-tag"
                                        x={definition.x + 12}
                                        y={definition.y + 12}
                                        width="68"
                                        height="16"
                                        rx="4"
                                    />
                                    <text
                                        className="baton-architecture__node-kind"
                                        x={definition.x + 46}
                                        y={definition.y + 24}
                                        textAnchor="middle"
                                    >
                                        {service.primary ? "CORE" : "SERVICE"}
                                    </text>
                                    <text
                                        className="baton-architecture__node-name"
                                        x={definition.x + 100}
                                        y={definition.y + 52}
                                        textAnchor="middle"
                                    >
                                        {service.name}
                                    </text>
                                    <text
                                        className="baton-architecture__node-role"
                                        x={definition.x + 100}
                                        y={definition.y + 76}
                                        textAnchor="middle"
                                    >
                                        {definition.shortRole}
                                    </text>
                                </g>
                            )
                        })}
                    </g>

                    <g className="editorial-diagram__legend baton-architecture__legend">
                        <line x1="40" y1="508" x2="920" y2="508" />
                        <text className="editorial-diagram__legend-title" x="40" y="536">
                            LEGEND
                        </text>
                        <rect
                            className="baton-architecture__legend-focal"
                            x="132"
                            y="524"
                            width="28"
                            height="16"
                            rx="4"
                        />
                        <text x="172" y="536">
                            Core 관리 데이터
                        </text>
                        <line
                            className="baton-architecture__connector baton-architecture__connector--default"
                            x1="296"
                            y1="532"
                            x2="332"
                            y2="532"
                        />
                        <text x="344" y="536">
                            동기 요청 계약
                        </text>
                        <line
                            className="baton-architecture__connector baton-architecture__connector--async"
                            x1="464"
                            y1="532"
                            x2="500"
                            y2="532"
                        />
                        <text x="512" y="536">
                            이벤트 및 비동기 계약
                        </text>
                        <line
                            className="baton-architecture__connector baton-architecture__connector--link"
                            x1="712"
                            y1="532"
                            x2="748"
                            y2="532"
                        />
                        <text x="760" y="536">
                            요청 및 응답 계약
                        </text>
                    </g>
                </svg>
            </div>
        </figure>
    )
}

export default BatonArchitectureDiagram

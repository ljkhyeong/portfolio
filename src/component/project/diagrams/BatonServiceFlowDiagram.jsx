import { useId } from "react"
import { batonServicePresentations } from "../../../data/batonServicePresentation"
import useCenteredDiagramViewport from "./useCenteredDiagramViewport"
import "../../../css/BatonServiceFlowDiagram.css"

const node = (id, x, y, width, height, title, detail, kind = "step") => ({
    id,
    x,
    y,
    width,
    height,
    title,
    detail,
    kind,
})
const edge = (path, label, x, y, dashed = false, kind = "default") => ({
    path,
    label,
    x,
    y,
    dashed,
    kind,
})

const diagramTypes = {
    go: "FLOWCHART / IDEMPOTENCY",
    watch: "DATA FLOW / LEASE RECOVERY",
    relay: "DATA FLOW / DELIVERY ATTEMPT",
    brief: "DATA FLOW / EVENT PROJECTION",
    cal: "PROCESS / REVISION CONTROL",
    round: "ARCHITECTURE / REALTIME MEDIA",
}

const fullFlows = {
    go: {
        nodes: [
            node(
                "request",
                24,
                152,
                192,
                96,
                "링크 생성 요청",
                ["UUID + 대상", "활성 및 만료"],
                "input",
            ),
            node("compare", 328, 120, 176, 160, "UUID와 조건", "비교", "decision"),
            node("create", 672, 16, 256, 96, "링크 1건 저장", "새 처리 기록 생성", "result"),
            node("reuse", 672, 152, 256, 96, "기존 링크 반환", "추가 저장 없음", "focal"),
            node("conflict", 672, 288, 256, 96, "충돌로 차단", "기존 링크 변경 없음", "result"),
        ],
        edges: [
            edge("M216 200 H328"),
            edge("M416 120 V72 Q416 64 424 64 H672", "첫 요청", 576, 48),
            edge("M504 200 H672", "조건 같음", 584, 184, false, "accent"),
            edge("M416 280 V328 Q416 336 424 336 H672", "조건 다름", 576, 320),
        ],
    },
    watch: {
        nodes: [
            node("url", 24, 116, 160, 80, "URL 입력", "요청 시점 버전", "input"),
            node("guard", 248, 80, 176, 152, "주소 해석", "접근 가능 여부", "decision"),
            node("attempt", 528, 116, 184, 80, "URL 점검 시도", "처리 서버 + 기한", "focal"),
            node("result", 776, 116, 160, 80, "결과 저장", "최신 시도만 반영", "result"),
            node("block", 248, 280, 176, 72, "접근 차단", "사설망 및 로컬", "result"),
            node("recover", 528, 280, 184, 72, "새 점검 실행", "이전 시도 종료", "step"),
        ],
        edges: [
            edge("M184 156 H248"),
            edge("M424 156 H528", "공인 IP", 476, 140, false, "accent"),
            edge("M336 232 V280", "차단 주소", 384, 256),
            edge("M712 156 H776"),
            edge("M620 196 V280", "기한 초과", 668, 244),
            edge(
                "M528 316 H504 Q496 316 496 308 V188 Q496 180 504 180 H528",
                undefined,
                undefined,
                undefined,
                true,
            ),
        ],
    },
    relay: {
        nodes: [
            node("event", 24, 152, 208, 96, "이벤트 수신", "event ID로 중복 차단", "input"),
            node(
                "attempt",
                344,
                152,
                224,
                96,
                "전송 시도 기록",
                ["시도 UUID", "제공자 멱등 키"],
                "focal",
            ),
            node("success", 736, 16, 200, 96, "성공", "완료 상태 확정", "result"),
            node("failure", 736, 152, 200, 96, "실패", ["전송 전 일시 실패만", "재시도"], "result"),
            node(
                "unknown",
                736,
                288,
                200,
                96,
                "결과 미확인",
                ["자동 재전송 없이", "외부 기록 확인"],
                "result",
            ),
        ],
        edges: [
            edge("M232 200 H344", undefined, undefined, undefined, false, "accent"),
            edge("M568 184 H616 Q624 184 624 176 V72 Q624 64 632 64 H736", "성공 확인", 680, 48),
            edge("M568 200 H736", "실패 확인", 648, 184),
            edge(
                "M568 216 H616 Q624 216 624 224 V328 Q624 336 632 336 H736",
                "응답 유실",
                680,
                320,
            ),
        ],
    },
    brief: {
        nodes: [
            node(
                "signals",
                24,
                160,
                224,
                80,
                "담당 공백 등 5개 상태",
                "Core가 판정한 상태",
                "input",
            ),
            node("apply", 336, 160, 192, 80, "점검 항목 반영", "중복 및 과거 개정 차단", "focal"),
            node("active", 616, 48, 160, 80, "ACTIVE", "점검 항목 유지", "result"),
            node("resolved", 616, 272, 160, 80, "RESOLVED", "해소 상태 반영", "result"),
            node("report", 824, 136, 112, 128, ["주간", "보고서"], "발행 후 보존", "step"),
        ],
        edges: [
            edge("M248 200 H336", undefined, undefined, undefined, false, "accent"),
            edge("M528 184 H560 Q568 184 568 176 V96 Q568 88 576 88 H616"),
            edge("M528 216 H576 Q584 216 584 224 V304 Q584 312 592 312 H616"),
            edge("M776 88 H800 Q808 88 808 96 V160 Q808 168 816 168 H824"),
            edge("M776 312 H792 Q800 312 800 304 V232 Q800 224 808 224 H824"),
        ],
    },
    cal: {
        nodes: [
            node("schedule", 24, 72, 192, 96, "Core 일정", "일정 ID + 개정 번호", "input"),
            node(
                "revision",
                280,
                72,
                192,
                96,
                "최신 개정만 반영",
                "과거 및 중복 개정 차단",
                "focal",
            ),
            node("ical", 552, 72, 168, 96, "iCalendar", "UID + SEQUENCE", "step"),
            node("feed", 792, 72, 144, 96, ".ics 피드", "읽기 전용", "result"),
            node("cache", 792, 272, 144, 96, "304 응답", "ETag 일치", "result"),
            node(
                "token",
                552,
                272,
                168,
                96,
                "구독 토큰 검증",
                ["회전 시 이전", "토큰 폐기"],
                "step",
            ),
        ],
        edges: [
            edge("M216 120 H280", undefined, undefined, undefined, false, "accent"),
            edge("M472 120 H552"),
            edge("M720 104 H792"),
            edge(
                "M720 136 H744 Q752 136 752 144 V312 Q752 320 760 320 H792",
                "변경 없음",
                800,
                224,
            ),
            edge("M636 280 V160", "유효한 토큰", 684, 224),
        ],
    },
    round: {
        nodes: [
            node(
                "ticket",
                24,
                152,
                160,
                96,
                "Core 입장 토큰",
                ["방 + 참가자", "만료 시각"],
                "input",
            ),
            node("verify", 216, 152, 160, 96, "RS256 검증", "Core 공개 키", "step"),
            node("signal", 408, 152, 160, 96, "WebSocket", "SDP / ICE만 중계", "step"),
            node("peers", 600, 152, 160, 96, "브라우저 피어", "미디어 송수신", "focal"),
            node("direct", 800, 48, 136, 96, "직접 연결", "mesh WebRTC", "result"),
            node(
                "turn",
                800,
                256,
                136,
                96,
                "TURN 중계",
                ["직접 연결 실패 시", "미디어 대체 경로"],
                "result",
            ),
        ],
        edges: [
            edge("M184 200 H216"),
            edge("M376 200 H408"),
            edge("M568 200 H600"),
            edge(
                "M760 184 H776 Q784 184 784 176 V104 Q784 96 792 96 H800",
                undefined,
                undefined,
                undefined,
                false,
                "accent",
            ),
            edge(
                "M760 216 H776 Q784 216 784 224 V296 Q784 304 792 304 H800",
                undefined,
                undefined,
                undefined,
                true,
            ),
        ],
    },
}

const compactFlow = ({ input, action, outputs }) => {
    const count = outputs.length
    const width = count === 3 ? 160 : 232
    const gap = count === 3 ? 16 : 32
    const start = count === 3 ? 16 : 24

    return {
        nodes: [
            node("input", 24, 24, 208, 80, input[0], input[1], "input"),
            node("action", 304, 24, 216, 80, action[0], action[1], "focal"),
            ...outputs.map(([title, detail], index) =>
                node(
                    `result-${index}`,
                    start + index * (width + gap),
                    224,
                    width,
                    88,
                    title,
                    detail,
                    "result",
                ),
            ),
        ],
        edges: [
            edge("M232 64 H304", undefined, undefined, undefined, false, "accent"),
            ...outputs.map((_, index) => {
                const fromX = count === 2 ? 360 + index * 96 : 360 + index * 32
                const toX = start + index * (width + gap) + width / 2
                const midY = 136 + index * 32
                const turn = toX > fromX ? 8 : -8
                return edge(
                    `M${fromX} 104 V${midY - 8} Q${fromX} ${midY} ${fromX + turn} ${midY} H${toX - turn} Q${toX} ${midY} ${toX} ${midY + 8} V224`,
                )
            }),
        ],
    }
}

const FlowNode = ({ x, y, width, height, title, detail, kind }) => {
    const titles = Array.isArray(title) ? title : [title]
    const details = Array.isArray(detail) ? detail : [detail]
    const centerX = x + width / 2
    const centerY = y + height / 2
    const tagY = kind === "decision" ? centerY - 36 : y + 18
    const titleY = kind === "decision" ? centerY - 8 : y + (titles.length > 1 ? 42 : 46)
    const detailY = kind === "decision" ? centerY + 24 : titleY + titles.length * 20 + 2
    const kindLabel = {
        input: "INPUT",
        decision: "DECISION",
        focal: "FOCAL",
        result: "RESULT",
        step: "PROCESS",
    }[kind]

    return (
        <g className={`service-flow-node service-flow-node--${kind}`}>
            {kind === "decision" ? (
                <polygon
                    points={`${centerX},${y} ${x + width},${centerY} ${centerX},${y + height} ${x},${centerY}`}
                />
            ) : (
                <rect x={x} y={y} width={width} height={height} rx="8" />
            )}
            <text x={centerX} y={tagY} textAnchor="middle" className="service-flow-node__tag">
                {kindLabel}
            </text>
            <text x={centerX} y={titleY} textAnchor="middle" className="service-flow-node__title">
                {titles.map((line, index) => (
                    <tspan x={centerX} dy={index ? 22 : 0} key={line}>
                        {line}
                    </tspan>
                ))}
            </text>
            <text x={centerX} y={detailY} textAnchor="middle" className="service-flow-node__detail">
                {details.map((line, index) => (
                    <tspan x={centerX} dy={index ? 16 : 0} key={line}>
                        {line}
                    </tspan>
                ))}
            </text>
        </g>
    )
}

export const BatonServiceFlowSvg = ({ serviceId, compact = false }) => {
    const instanceId = useId().replaceAll(":", "")
    const prefix = `baton-${serviceId}-flow-${compact ? "compact" : "full"}-${instanceId}`
    const presentation = batonServicePresentations[serviceId]

    if (!presentation) return null

    const flow = compact ? compactFlow(presentation.flow.compact) : fullFlows[serviceId]

    return (
        <svg
            className={`service-flow-svg${compact ? " service-flow-svg--compact" : ""}`}
            viewBox={compact ? "0 0 544 340" : "0 0 960 400"}
            role="img"
            aria-labelledby={`${prefix}-title ${prefix}-desc`}
        >
            <title id={`${prefix}-title`}>{serviceId.toUpperCase()} 처리 흐름</title>
            <desc id={`${prefix}-desc`}>{presentation.flow.description}</desc>
            <defs>
                {["default", "accent", "link"].map((kind) => (
                    <marker
                        key={kind}
                        id={`${prefix}-arrow-${kind}`}
                        markerWidth="8"
                        markerHeight="8"
                        refX="8"
                        refY="4"
                        orient="auto"
                    >
                        <path
                            d="M0 0 L8 4 L0 8 Z"
                            className={`service-flow-marker service-flow-marker--${kind}`}
                        />
                    </marker>
                ))}
            </defs>
            <rect className="service-flow-paper" width="100%" height="100%" />
            {flow.edges.map((connection, index) => (
                <g key={index}>
                    <path
                        d={connection.path}
                        className={`service-flow-edge service-flow-edge--${connection.kind}${connection.dashed ? " service-flow-edge--dashed" : ""}`}
                        markerEnd={`url(#${prefix}-arrow-${connection.kind === "accent" ? "accent" : "default"})`}
                    />
                    {connection.label && (
                        <g className="service-flow-edge__label">
                            <rect
                                x={connection.x - 40}
                                y={connection.y - 16}
                                width="80"
                                height="24"
                                rx="4"
                            />
                            <text x={connection.x} y={connection.y} textAnchor="middle">
                                {connection.label}
                            </text>
                        </g>
                    )}
                </g>
            ))}
            {flow.nodes.map((item) => (
                <FlowNode key={item.id} {...item} />
            ))}
        </svg>
    )
}

const BatonServiceFlowDiagram = ({ serviceId }) => {
    const viewportRef = useCenteredDiagramViewport()
    const presentation = batonServicePresentations[serviceId]

    if (!presentation) return null

    return (
        <figure className="baton-service-flow">
            <header className="baton-service-flow__header">
                <span>{diagramTypes[serviceId]}</span>
                <h3>{presentation.flow.title}</h3>
            </header>
            <div
                className="baton-service-flow__viewport"
                ref={viewportRef}
                tabIndex={0}
                role="region"
                aria-label={`${serviceId.toUpperCase()} 처리 흐름, 가로로 스크롤 가능`}
            >
                <BatonServiceFlowSvg serviceId={serviceId} />
            </div>
            <figcaption>
                <span className="baton-service-flow__legend">
                    <span>입력 및 처리</span>
                    <span>핵심 설계</span>
                    <span>처리 결과</span>
                    {["watch", "round"].includes(serviceId) && (
                        <span className="baton-service-flow__legend-retry">
                            재실행 또는 대체 경로
                        </span>
                    )}
                </span>
                <p>{presentation.flow.note}</p>
            </figcaption>
        </figure>
    )
}

export default BatonServiceFlowDiagram

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
const edge = (path, label, x, y, dashed = false) => ({ path, label, x, y, dashed })

const fullFlows = {
    go: {
        nodes: [
            node("request", 24, 160, 192, 80, "링크 생성 요청", "UUID + 대상 + 기간", "input"),
            node("compare", 328, 120, 176, 160, "UUID와 조건", "비교", "decision"),
            node("create", 672, 24, 256, 80, "링크 1건 저장", "새 처리 기록 생성", "result"),
            node("reuse", 672, 160, 256, 80, "기존 링크 반환", "추가 저장 없음", "focal"),
            node("conflict", 672, 296, 256, 80, "충돌로 차단", "기존 링크 변경 없음", "result"),
        ],
        edges: [
            edge("M216 200 H328"),
            edge("M416 120 V72 Q416 64 424 64 H672", "첫 요청", 576, 48),
            edge("M504 200 H672", "조건 같음", 584, 184),
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
            node("recover", 528, 280, 184, 72, "새 시도로 회수", "이전 시도 종료", "step"),
        ],
        edges: [
            edge("M184 156 H248"),
            edge("M424 156 H528", "공인 IP", 476, 140),
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
            node("event", 24, 160, 208, 80, "이벤트 수신", "event ID로 중복 차단", "input"),
            node(
                "attempt",
                344,
                160,
                224,
                80,
                "전송 시도 기록",
                "시도 UUID + 제공자 멱등 키",
                "focal",
            ),
            node("success", 736, 24, 200, 80, "성공", "완료 상태 확정", "result"),
            node("failure", 736, 160, 200, 80, "실패", "전송 전 일시 실패만 재시도", "result"),
            node(
                "unknown",
                736,
                296,
                200,
                80,
                "결과 미확인",
                "재전송 없이 외부 기록 확인",
                "result",
            ),
        ],
        edges: [
            edge("M232 200 H344"),
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
            node("signals", 24, 160, 224, 80, "Core 운영 신호 5개", "Core가 판정한 상태", "input"),
            node("apply", 336, 160, 192, 80, "관심 항목 반영", "중복 및 과거 개정 차단", "focal"),
            node("active", 616, 48, 160, 80, "ACTIVE", "관심 항목 유지", "result"),
            node("resolved", 616, 272, 160, 80, "RESOLVED", "해소 상태 반영", "result"),
            node("report", 824, 136, 112, 128, ["주간", "보고서"], "발행 후 보존", "step"),
        ],
        edges: [
            edge("M248 200 H336"),
            edge("M528 184 H560 Q568 184 568 176 V96 Q568 88 576 88 H616"),
            edge("M528 216 H576 Q584 216 584 224 V304 Q584 312 592 312 H616"),
            edge("M776 88 H800 Q808 88 808 96 V160 Q808 168 816 168 H824"),
            edge("M776 312 H792 Q800 312 800 304 V232 Q800 224 808 224 H824"),
        ],
    },
    cal: {
        nodes: [
            node("schedule", 24, 80, 192, 80, "Core 일정", "일정 ID + 개정 번호", "input"),
            node(
                "revision",
                280,
                80,
                192,
                80,
                "최신 개정만 반영",
                "과거 및 중복 개정 차단",
                "focal",
            ),
            node("ical", 552, 80, 168, 80, "iCalendar", "UID + SEQUENCE", "step"),
            node("feed", 792, 80, 144, 80, ".ics 피드", "읽기 전용", "result"),
            node("cache", 792, 280, 144, 80, "304 응답", "ETag 일치", "result"),
            node("token", 552, 280, 168, 80, "구독 토큰 검증", "회전 시 이전 토큰 폐기", "step"),
        ],
        edges: [
            edge("M216 120 H280"),
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
            node("ticket", 24, 160, 176, 80, "Core 참여권", "방 + 참가자 + 만료 시각", "input"),
            node("verify", 264, 160, 184, 80, "RS256 서명 검증", "Core 공개 키 사용", "step"),
            node("signal", 512, 160, 184, 80, "WebSocket 중계", "SDP + ICE 메시지", "focal"),
            node("mesh", 768, 48, 168, 80, "mesh WebRTC", "브라우저 간 직접 연결", "result"),
            node("turn", 768, 272, 168, 80, "Cloudflare TURN", "직접 연결 어려울 때", "result"),
        ],
        edges: [
            edge("M200 200 H264"),
            edge("M448 200 H512"),
            edge("M696 184 H720 Q728 184 728 176 V96 Q728 88 736 88 H768"),
            edge(
                "M696 216 H736 Q744 216 744 224 V304 Q744 312 752 312 H768",
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
            edge("M232 64 H304"),
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
    const centerX = x + width / 2
    const centerY = y + height / 2
    const titleY = centerY - (titles.length > 1 ? 16 : 4)

    return (
        <g className={`service-flow-node service-flow-node--${kind}`}>
            {kind === "decision" ? (
                <polygon
                    points={`${centerX},${y} ${x + width},${centerY} ${centerX},${y + height} ${x},${centerY}`}
                />
            ) : (
                <rect x={x} y={y} width={width} height={height} rx={kind === "result" ? 20 : 8} />
            )}
            <text x={centerX} y={titleY} textAnchor="middle" className="service-flow-node__title">
                {titles.map((line, index) => (
                    <tspan x={centerX} dy={index ? 24 : 0} key={line}>
                        {line}
                    </tspan>
                ))}
            </text>
            <text
                x={centerX}
                y={titleY + titles.length * 24}
                textAnchor="middle"
                className="service-flow-node__detail"
            >
                {detail}
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
            {flow.edges.map((connection, index) => (
                <g key={index}>
                    <path
                        d={connection.path}
                        className={`service-flow-edge${connection.dashed ? " service-flow-edge--dashed" : ""}`}
                        markerEnd={`url(#${prefix}-arrow-default)`}
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
            <h3>{presentation.flow.title}</h3>
            <div
                className="baton-service-flow__viewport"
                ref={viewportRef}
                tabIndex={0}
                role="group"
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
                            회수 또는 대체 경로
                        </span>
                    )}
                </span>
                <p>{presentation.flow.note}</p>
            </figcaption>
        </figure>
    )
}

export default BatonServiceFlowDiagram

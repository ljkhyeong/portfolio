import { useId } from "react"
import useCenteredDiagramViewport from "./useCenteredDiagramViewport"

const diagrams = {
    defense: {
        eyebrow: "ARCHITECTURE / CLOSED NETWORK",
        title: "기관별 수용자 정보를 검증해 군교정 DB에 반영",
        summary:
            "군사법원, 군검찰과 군사경찰의 자료를 기관별 배치에서 검증하고, 중단 시 확인된 단계부터 다시 실행합니다.",
        description:
            "세 기관에서 수신한 인적정보와 영장정보를 연계 배치가 검증해 군교정 데이터베이스에 반영하고, 중단된 경우 확인한 단계부터 다시 실행하는 흐름입니다.",
        height: 480,
        zones: [
            { x: 24, y: 40, width: 216, height: 352, label: "요청 기관", labelWidth: 88 },
            { x: 296, y: 40, width: 248, height: 352, label: "연계 및 배치", labelWidth: 104 },
            { x: 600, y: 40, width: 336, height: 352, label: "군교정 업무망", labelWidth: 112 },
        ],
        nodes: [
            {
                id: "court",
                x: 56,
                y: 88,
                width: 152,
                height: 72,
                tag: "SOURCE 01",
                title: ["군사법원"],
            },
            {
                id: "prosecution",
                x: 56,
                y: 196,
                width: 152,
                height: 72,
                tag: "SOURCE 02",
                title: ["군검찰"],
            },
            {
                id: "police",
                x: 56,
                y: 304,
                width: 152,
                height: 72,
                tag: "SOURCE 03",
                title: ["군사경찰"],
            },
            {
                id: "batch",
                x: 320,
                y: 136,
                width: 200,
                height: 160,
                tag: "BATCH / FOCAL",
                title: ["수용자 정보", "검증 배치"],
                detail: ["필수값 및 형식 확인", "기관별 자료 변환"],
                kind: "focal",
            },
            {
                id: "database",
                x: 624,
                y: 136,
                width: 128,
                height: 160,
                tag: "DURABLE STATE",
                title: ["군교정 DB"],
                detail: ["검증 완료 자료", "처리 단계 기록"],
            },
            {
                id: "result",
                x: 784,
                y: 136,
                width: 128,
                height: 160,
                tag: "RESULT",
                title: ["수용 업무", "후속 처리"],
                detail: ["업무 시스템 반영"],
            },
        ],
        edges: [
            { d: "M208 124 H272 Q280 124 280 132 V192 Q280 200 288 200 H320" },
            { d: "M208 232 H320", kind: "accent" },
            { d: "M208 340 H272 Q280 340 280 332 V272 Q280 264 288 264 H320" },
            { d: "M520 216 H624" },
            { d: "M752 216 H784" },
            {
                d: "M688 296 V336 Q688 344 680 344 H428 Q420 344 420 336 V296",
                dashed: true,
                label: "중단 단계 확인 후 재실행",
                labelX: 554,
                labelY: 326,
                labelWidth: 168,
            },
        ],
        note: "실선은 정상 처리, 점선은 중단된 배치의 재실행 경로입니다.",
    },
    webrtc: {
        eyebrow: "DATA FLOW / LIVE AND REPLAY",
        title: "실시간 WebRTC와 HLS 다시보기를 한 입력에서 분리",
        summary:
            "mediasoup의 실시간 전송과 RTP 출력을 나눠 React의 실시간 화면과 지난 구간 재생에 각각 제공합니다.",
        description:
            "강의 영상 입력을 mediasoup에서 WebRTC 실시간 전송과 RTP 출력으로 나누고, RTP는 FFmpeg와 GStreamer에서 HLS로 변환해 React 다시보기 화면에 제공하는 흐름입니다.",
        height: 480,
        zones: [
            { x: 24, y: 40, width: 208, height: 352, label: "미디어 라우터", labelWidth: 104 },
            { x: 280, y: 40, width: 400, height: 352, label: "미디어 처리", labelWidth: 96 },
            { x: 728, y: 40, width: 208, height: 352, label: "React 클라이언트", labelWidth: 128 },
        ],
        nodes: [
            {
                id: "mediasoup",
                x: 56,
                y: 160,
                width: 144,
                height: 112,
                tag: "SOURCE / FOCAL",
                title: ["mediasoup"],
                detail: ["강의 영상 입력"],
                kind: "focal",
            },
            {
                id: "webrtc",
                x: 312,
                y: 72,
                width: 160,
                height: 96,
                tag: "LIVE STREAM",
                title: ["WebRTC 전송"],
                detail: ["낮은 지연 재생"],
            },
            {
                id: "live-client",
                x: 760,
                y: 72,
                width: 144,
                height: 96,
                tag: "RESULT",
                title: ["실시간 시청"],
                detail: ["React 화면"],
            },
            {
                id: "rtp",
                x: 312,
                y: 272,
                width: 160,
                height: 96,
                tag: "RTP OUTPUT",
                title: ["RTP 출력"],
                detail: ["다시보기 원본"],
            },
            {
                id: "transcode",
                x: 504,
                y: 272,
                width: 160,
                height: 96,
                tag: "TRANSCODE",
                title: ["FFmpeg /", "GStreamer"],
                detail: ["HLS 세그먼트 생성"],
            },
            {
                id: "replay-client",
                x: 760,
                y: 272,
                width: 144,
                height: 96,
                tag: "RESULT",
                title: ["지난 구간 재생"],
                detail: ["React HLS 화면"],
            },
        ],
        edges: [
            {
                d: "M200 188 H248 Q256 188 256 180 V128 Q256 120 264 120 H312",
                kind: "accent",
            },
            { d: "M472 120 H760", label: "WebRTC", labelX: 616, labelY: 108 },
            { d: "M200 244 H248 Q256 244 256 252 V312 Q256 320 264 320 H312" },
            { d: "M472 320 H504" },
            { d: "M664 320 H760", label: "HLS", labelX: 712, labelY: 308 },
        ],
        note: "실시간 영상은 WebRTC로, 지난 구간은 HLS 재생 목록과 세그먼트로 제공합니다.",
    },
    "intent-trace": {
        eyebrow: "PROCESS / PUBLICATION LIFECYCLE",
        title: "요청과 코드 변경을 검증 가능한 기록으로 연결",
        summary:
            "요청과 코드 근거를 기록하고, 작성자가 확인한 코드 상태가 유지될 때만 GitHub와 IntelliJ에서 조회합니다.",
        description:
            "사용자 요청과 판단 출처를 전체 길이 커밋 식별자, 파일 및 줄 근거와 검증 결과에 연결합니다. 작성자 확인과 현재 코드 상태 일치를 확인해 공개하고, 이후 코드가 바뀌면 공개 상태를 다시 검사해 기존 기록을 차단하는 흐름입니다.",
        height: 520,
        zones: [
            { x: 24, y: 40, width: 176, height: 400, label: "입력", labelWidth: 56 },
            { x: 232, y: 40, width: 464, height: 400, label: "변경 기록", labelWidth: 88 },
            { x: 728, y: 40, width: 208, height: 400, label: "공개 경계", labelWidth: 88 },
        ],
        nodes: [
            {
                id: "request",
                x: 48,
                y: 104,
                width: 128,
                height: 96,
                tag: "REQUEST",
                title: ["사용자 요청"],
                detail: ["작업 범위"],
            },
            {
                id: "code-change",
                x: 48,
                y: 312,
                width: 128,
                height: 96,
                tag: "CHANGE",
                title: ["후속 코드 변경"],
                detail: ["근거 위치 변경"],
                kind: "external",
            },
            {
                id: "record",
                x: 264,
                y: 104,
                width: 168,
                height: 96,
                tag: "RECORD",
                title: ["변경 기록"],
                detail: ["커밋 및 코드 위치", "검증 결과"],
            },
            {
                id: "publish-gate",
                x: 496,
                y: 104,
                width: 168,
                height: 96,
                tag: "PUBLISH GATE",
                title: ["작성자 확인"],
                detail: ["코드 상태 일치"],
                kind: "focal",
            },
            {
                id: "validity-check",
                x: 496,
                y: 312,
                width: 168,
                height: 96,
                tag: "VALIDITY CHECK",
                title: ["공개 상태 재검증"],
                detail: ["현재 코드와 비교"],
            },
            {
                id: "published",
                x: 760,
                y: 104,
                width: 144,
                height: 96,
                tag: "RESULT",
                title: ["기록 조회"],
                detail: ["GitHub / IntelliJ"],
            },
            {
                id: "invalidated",
                x: 760,
                y: 312,
                width: 144,
                height: 96,
                tag: "SUPERSEDED",
                title: ["공개 차단"],
                detail: ["기존 기록 무효화"],
                kind: "external",
            },
        ],
        edges: [
            { d: "M176 152 H264" },
            { d: "M432 152 H496" },
            { d: "M664 152 H760", kind: "accent" },
            { d: "M176 360 H496", dashed: true },
            {
                d: "M832 200 V248 Q832 256 824 256 H588 Q580 256 580 264 V312",
                dashed: true,
                label: "공개 후 코드 변경",
                labelX: 708,
                labelY: 244,
                labelWidth: 128,
            },
            { d: "M664 360 H760", dashed: true },
        ],
        note: "작성자 확인 뒤 공개하며, 공개한 코드의 근거 위치가 달라지면 기존 기록을 SUPERSEDED 상태로 바꿉니다.",
    },
    "youth-policy-mate": {
        eyebrow: "ARCHITECTURE / WEB APP",
        title: "조건 입력부터 자격 근거와 일정까지 연결",
        summary:
            "비회원 조건과 개발용 정책 예시를 서버 규칙으로 비교하고, 판정 근거와 마감 알림 후보를 웹 화면에 표시합니다.",
        description:
            "웹앱의 비회원 조건과 개발용 정책 예시를 Spring 서버의 자격 판정 및 마감 후보 계산 규칙에 연결해 결과와 근거를 화면에 표시하는 현재 구조입니다. 실제 정책 수집, 회원 저장, 알림 예약과 외부 발송은 연결하지 않았습니다.",
        height: 520,
        zones: [
            { x: 24, y: 40, width: 192, height: 400, label: "웹 입력", labelWidth: 72 },
            { x: 248, y: 40, width: 440, height: 400, label: "Spring 서버 규칙", labelWidth: 120 },
            { x: 720, y: 40, width: 216, height: 400, label: "웹 결과", labelWidth: 72 },
        ],
        nodes: [
            {
                id: "conditions",
                x: 48,
                y: 112,
                width: 144,
                height: 96,
                tag: "INPUT",
                title: ["조건 입력"],
                detail: ["비회원 세션"],
            },
            {
                id: "development-data",
                x: 48,
                y: 304,
                width: 144,
                height: 96,
                tag: "DEV DATA",
                title: ["정책 예시"],
                detail: ["화면 검증용 고정값"],
                kind: "external",
            },
            {
                id: "api",
                x: 280,
                y: 112,
                width: 160,
                height: 96,
                tag: "API",
                title: ["개발 API"],
                detail: ["조건 및 예시 전달"],
            },
            {
                id: "schedule",
                x: 280,
                y: 304,
                width: 160,
                height: 96,
                tag: "DOMAIN MODEL",
                title: ["모집 기간 규칙"],
                detail: ["서울 날짜 기준"],
            },
            {
                id: "eligibility",
                x: 496,
                y: 112,
                width: 160,
                height: 96,
                tag: "RULE / FOCAL",
                title: ["자격 판정"],
                detail: ["가능 및 추가 확인", "불가 구분"],
                kind: "focal",
            },
            {
                id: "reminder-candidates",
                x: 496,
                y: 304,
                width: 160,
                height: 96,
                tag: "CALCULATION",
                title: ["알림 후보 계산"],
                detail: ["예약 및 발송 아님"],
            },
            {
                id: "result",
                x: 752,
                y: 112,
                width: 152,
                height: 96,
                tag: "WEB RESULT",
                title: ["판정 및 근거"],
                detail: ["개발 화면 표시"],
            },
            {
                id: "reminder-view",
                x: 752,
                y: 304,
                width: 152,
                height: 96,
                tag: "WEB PREVIEW",
                title: ["마감 후보"],
                detail: ["개발 화면 표시"],
            },
        ],
        edges: [
            { d: "M192 160 H280" },
            { d: "M440 160 H496", kind: "accent" },
            { d: "M656 160 H752" },
            { d: "M192 352 H280" },
            { d: "M440 352 H496" },
            { d: "M656 352 H752" },
        ],
        note: "구현 범위는 개발용 예시의 자격 판정과 알림 후보 계산까지입니다. 실제 온통청년 수집, 회원 저장, 알림 예약과 외부 발송은 아직 연결하지 않았습니다.",
    },
}

const DiagramNode = ({ node }) => {
    const titleY = node.y + 48
    const detailY = titleY + node.title.length * 20 + 6

    return (
        <g
            className={`editorial-diagram__node editorial-diagram__node--${node.kind ?? "default"} portfolio-flow__node`}
        >
            <rect x={node.x} y={node.y} width={node.width} height={node.height} rx="8" />
            <text className="editorial-diagram__tag" x={node.x + 16} y={node.y + 24}>
                {node.tag}
            </text>
            <text className="editorial-diagram__node-title" x={node.x + 16} y={titleY}>
                {node.title.map((line, index) => (
                    <tspan x={node.x + 16} dy={index === 0 ? 0 : 20} key={line}>
                        {line}
                    </tspan>
                ))}
            </text>
            {node.detail ? (
                <text className="editorial-diagram__node-meta" x={node.x + 16} y={detailY}>
                    {node.detail.map((line, index) => (
                        <tspan x={node.x + 16} dy={index === 0 ? 0 : 18} key={line}>
                            {line}
                        </tspan>
                    ))}
                </text>
            ) : null}
        </g>
    )
}

const PortfolioFlowDiagram = ({ variant }) => {
    const viewportRef = useCenteredDiagramViewport()
    const instanceId = useId().replaceAll(":", "")
    const diagram = diagrams[variant]

    if (!diagram) {
        return null
    }

    const titleId = `${instanceId}-${variant}-title`
    const descriptionId = `${instanceId}-${variant}-description`
    const markerPrefix = `${instanceId}-${variant}-arrow`

    return (
        <figure className={`editorial-diagram portfolio-flow portfolio-flow--${variant}`}>
            <figcaption className="editorial-diagram__header">
                <span className="editorial-diagram__eyebrow">{diagram.eyebrow}</span>
                <h3 className="editorial-diagram__title">{diagram.title}</h3>
                <p>{diagram.summary}</p>
            </figcaption>
            <div
                className="editorial-diagram__viewport"
                role="region"
                aria-label={`${diagram.title} 가로 스크롤 영역`}
                tabIndex={0}
                ref={viewportRef}
            >
                <svg
                    className="editorial-diagram__canvas portfolio-flow__canvas"
                    viewBox={`0 0 960 ${diagram.height}`}
                    role="img"
                    aria-labelledby={`${titleId} ${descriptionId}`}
                >
                    <title id={titleId}>{diagram.title}</title>
                    <desc id={descriptionId}>{diagram.description}</desc>
                    <defs>
                        {[
                            ["default", "editorial-diagram__marker--muted"],
                            ["accent", "editorial-diagram__marker--accent"],
                        ].map(([kind, className]) => (
                            <marker
                                id={`${markerPrefix}-${kind}`}
                                key={kind}
                                markerWidth="8"
                                markerHeight="8"
                                refX="7"
                                refY="4"
                                orient="auto"
                            >
                                <path className={className} d="M0,0 L8,4 L0,8 Z" />
                            </marker>
                        ))}
                    </defs>

                    <rect
                        className="editorial-diagram__paper"
                        width="960"
                        height={diagram.height}
                    />
                    <g className="editorial-diagram__zones">
                        {diagram.zones.map((zone) => (
                            <g key={zone.label}>
                                <rect
                                    className="editorial-diagram__zone"
                                    x={zone.x}
                                    y={zone.y}
                                    width={zone.width}
                                    height={zone.height}
                                    rx="8"
                                />
                                <rect
                                    className="editorial-diagram__label-mask"
                                    x={zone.x + 16}
                                    y={zone.y - 4}
                                    width={zone.labelWidth}
                                    height="24"
                                    rx="2"
                                />
                                <text
                                    className="editorial-diagram__zone-label"
                                    x={zone.x + 24}
                                    y={zone.y + 13}
                                >
                                    {zone.label}
                                </text>
                            </g>
                        ))}
                    </g>

                    <g className="portfolio-flow__edges" aria-hidden="true">
                        {diagram.edges.map((edge, index) => (
                            <g key={`${edge.d}-${index}`}>
                                <path
                                    className={`editorial-diagram__connector editorial-diagram__connector--${edge.kind === "accent" ? "accent" : "muted"}${edge.dashed ? " editorial-diagram__connector--dashed" : ""}`}
                                    d={edge.d}
                                    markerEnd={`url(#${markerPrefix}-${edge.kind === "accent" ? "accent" : "default"})`}
                                />
                                {edge.label ? (
                                    <g className="portfolio-flow__edge-label">
                                        <rect
                                            className="editorial-diagram__label-mask"
                                            x={edge.labelX - (edge.labelWidth ?? 72) / 2}
                                            y={edge.labelY - 18}
                                            width={edge.labelWidth ?? 72}
                                            height="24"
                                            rx="2"
                                        />
                                        <text
                                            className="editorial-diagram__connector-label"
                                            x={edge.labelX}
                                            y={edge.labelY}
                                            textAnchor="middle"
                                        >
                                            {edge.label}
                                        </text>
                                    </g>
                                ) : null}
                            </g>
                        ))}
                    </g>

                    <g className="portfolio-flow__nodes">
                        {diagram.nodes.map((node) => (
                            <DiagramNode key={node.id} node={node} />
                        ))}
                    </g>
                </svg>
            </div>
            <p className="portfolio-flow__note">{diagram.note}</p>
        </figure>
    )
}

export default PortfolioFlowDiagram

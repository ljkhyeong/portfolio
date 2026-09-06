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
        title: "변경 기록 공개와 기존 기록 대체",
        summary:
            "공개 요청 시 작성자 확인과 코드 상태 일치를 검사합니다. 새 기록으로 대체한 뒤에도 기존 기록을 조회할 수 있습니다.",
        description:
            "사용자 요청과 코드 근거를 기록하고, 작성자 확인 뒤 공개 요청 때 제출된 코드 상태를 비교해 일치하면 공개하고 다르면 거절합니다. 새 기록으로 대체한 기존 기록에는 대체 상태와 새 기록의 링크를 남깁니다.",
        height: 552,
        zones: [
            { x: 24, y: 40, width: 912, height: 288, label: "기록 공개", labelWidth: 88 },
            { x: 24, y: 360, width: 912, height: 152, label: "기록 대체", labelWidth: 88 },
        ],
        nodes: [
            {
                id: "record",
                x: 48,
                y: 88,
                width: 168,
                height: 104,
                tag: "RECORD",
                title: ["변경 기록"],
                detail: ["사용자 요청 및 코드 위치", "검증 결과"],
            },
            {
                id: "author-confirmation",
                x: 288,
                y: 88,
                width: 152,
                height: 104,
                tag: "CONFIRM",
                title: ["작성자 확인"],
                detail: ["확인한 코드 상태"],
            },
            {
                id: "publish-gate",
                x: 496,
                y: 88,
                width: 192,
                height: 104,
                tag: "PUBLISH GATE",
                title: ["공개 요청 검증"],
                detail: ["제출된 코드 상태 비교"],
                kind: "focal",
            },
            {
                id: "published",
                x: 760,
                y: 88,
                width: 144,
                height: 104,
                tag: "PUBLISHED",
                title: ["기록 조회"],
                detail: ["GitHub / IntelliJ"],
            },
            {
                id: "rejected",
                x: 496,
                y: 232,
                width: 192,
                height: 72,
                tag: "REJECTED",
                title: ["공개 거절"],
                kind: "external",
            },
            {
                id: "replacement",
                x: 48,
                y: 392,
                width: 208,
                height: 96,
                tag: "NEW RECORD",
                title: ["새 기록 공개"],
                detail: ["대체할 기록을 먼저 공개"],
            },
            {
                id: "supersede-request",
                x: 360,
                y: 392,
                width: 208,
                height: 96,
                tag: "SUPERSEDE REQUEST",
                title: ["기존 기록 대체 요청"],
                detail: ["작성자의 별도 요청"],
            },
            {
                id: "superseded",
                x: 712,
                y: 392,
                width: 192,
                height: 96,
                tag: "SUPERSEDED",
                title: ["새 기록으로 대체"],
                detail: ["기존 기록 조회 가능"],
            },
        ],
        edges: [
            { d: "M216 140 H288" },
            { d: "M440 140 H496" },
            {
                d: "M688 140 H760",
                kind: "accent",
                label: "일치",
                labelX: 724,
                labelY: 128,
                labelWidth: 48,
            },
            {
                d: "M592 192 V232",
                label: "불일치",
                labelX: 636,
                labelY: 216,
                labelWidth: 64,
            },
            { d: "M256 440 H360" },
            { d: "M568 440 H712" },
        ],
        note: "기존 기록을 대체하려면 새 기록을 먼저 공개해야 합니다. 대체된 기록에는 SUPERSEDED 상태와 새 기록의 링크를 남깁니다.",
    },
    "youth-policy-mate": {
        eyebrow: "ARCHITECTURE / WEB APP",
        title: "공개 정책 조회와 조건 확인·일정·알림",
        summary:
            "수집한 정책과 검토한 질문으로 조건을 확인하고, 관심 정책 저장과 신청 일정·알림을 연결합니다.",
        description:
            "Next.js에서 정책과 조건을 확인하고 Spring API가 판정 근거, 회원 저장, 일정과 알림을 처리합니다. 정책·회원·알림 상태는 JDBC와 PostgreSQL로 관리합니다.",
        height: 608,
        zones: [
            { x: 24, y: 40, width: 912, height: 160, label: "조건 입력 화면", labelWidth: 120 },
            {
                x: 24,
                y: 236,
                width: 912,
                height: 328,
                label: "정책 API와 회원 기능",
                labelWidth: 168,
            },
        ],
        nodes: [
            {
                id: "conditions",
                x: 48,
                y: 80,
                width: 224,
                height: 104,
                tag: "INPUT",
                title: ["조건 입력"],
                detail: ["화면 입력 상태"],
            },
            {
                id: "condition-confirmation",
                x: 384,
                y: 80,
                width: 256,
                height: 104,
                tag: "WEB VIEW",
                title: ["입력 내용 확인"],
                detail: ["확인 후 요청 · 회원 저장 선택"],
            },
            {
                id: "development-data",
                x: 48,
                y: 364,
                width: 224,
                height: 104,
                tag: "PUBLIC DATA",
                title: ["수집한 정책·검토한 질문"],
                detail: ["공개 정책 40건 · 질문 5종"],
                kind: "external",
            },
            {
                id: "eligibility",
                x: 360,
                y: 288,
                width: 232,
                height: 104,
                tag: "SPRING API",
                title: ["조건별 판정"],
                detail: ["요건 확인 · 추가 확인 구분"],
                kind: "focal",
            },
            {
                id: "reminder-candidates",
                x: 360,
                y: 432,
                width: 232,
                height: 104,
                tag: "SPRING API",
                title: ["일정·알림 처리"],
                detail: ["마감·수신 동의 확인", "예약·취소·Outbox"],
            },
            {
                id: "result",
                x: 712,
                y: 288,
                width: 192,
                height: 104,
                tag: "WEB RESULT",
                title: ["판정 및 근거"],
                detail: ["실제 웹 화면"],
            },
            {
                id: "reminder-view",
                x: 712,
                y: 432,
                width: 192,
                height: 104,
                tag: "MEMBER VIEW",
                title: ["관심 정책 일정·알림"],
                detail: ["실제 웹 화면"],
            },
        ],
        edges: [
            { d: "M272 132 H384" },
            { d: "M512 184 V252 H476 V288", kind: "accent" },
            { d: "M272 392 H304 Q312 392 312 384 V348 Q312 340 320 340 H360", kind: "accent" },
            { d: "M272 440 H304 Q312 440 312 448 V476 Q312 484 320 484 H360" },
            { d: "M592 340 H712" },
            { d: "M592 484 H712" },
        ],
        note: "조건 질문은 일부 요건만 확인합니다. 실제 OAuth 계정·외부 이메일 수신·AI 공급자 호출은 미검증입니다.",
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

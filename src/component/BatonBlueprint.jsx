import { Link } from "react-router-dom"
import { projectSummariesById } from "../data/projectSummaries"

// BATON의 Core와 6개 서비스를 등각 투영 선화로 그린다.
// 화면 좌표는 x = (X − Y)·cos30°, y = (X + Y)·sin30° − Z 로 계산한다.
// 소개 옆 칸(최대 560px)에 들어가도록 상자를 작게 하고, 투영하면 납작해지는 고리에서
// 상자가 겹치지 않게 좌우 끝과 대각선 네 곳에 서비스를 둔다.
const COS30 = Math.cos(Math.PI / 6)
const VIEW_BOX = { width: 592, height: 336 }
const ORIGIN = { x: 296, y: 178 }
const RING_RADIUS = 170
const SERVICE_BOX = { size: 88, height: 18 }
const CORE_BOX = { size: 112, height: 32 }

const project = (x, y, z = 0) => [ORIGIN.x + (x - y) * COS30, ORIGIN.y + (x + y) * 0.5 - z]
const toPoints = (...points) => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")

const boxFaces = ({ x, y }, { size, height }) => {
    const half = size / 2
    const [x0, x1, y0, y1] = [x - half, x + half, y - half, y + half]
    return {
        top: toPoints(
            project(x0, y0, height),
            project(x1, y0, height),
            project(x1, y1, height),
            project(x0, y1, height),
        ),
        right: toPoints(
            project(x1, y0),
            project(x1, y1),
            project(x1, y1, height),
            project(x1, y0, height),
        ),
        left: toPoints(
            project(x0, y1),
            project(x1, y1),
            project(x1, y1, height),
            project(x0, y1, height),
        ),
    }
}

const createNodes = () => {
    const baton = projectSummariesById.baton
    const services = baton.serviceLinks.map((service, index) => {
        const angle = ((-105 + index * 60) * Math.PI) / 180
        return {
            id: service.id,
            name: service.name,
            role: service.role,
            route: service.route,
            label: `BATON ${service.name} 마이크로서비스 상세 보기`,
            position: { x: RING_RADIUS * Math.cos(angle), y: RING_RADIUS * Math.sin(angle) },
            box: SERVICE_BOX,
        }
    })
    const core = {
        id: "core",
        name: "Core",
        role: baton.coreRole,
        route: baton.route,
        label: "BATON Core 상세 보기",
        position: { x: 0, y: 0 },
        box: CORE_BOX,
    }
    // 이 배치에서는 상자끼리 겹치지 않으므로 그리는 순서를 키보드 이동 순서에 맞춘다.
    // Core 다음에 GO부터 시계 방향으로 서비스를 지난다.
    return [core, ...services]
}

// 상자마다 해당 상세로 이동한다. 링크를 담으므로 그림 전체를 img 역할로 묶지 않는다.
const BatonBlueprint = ({ captionId }) => {
    const nodes = createNodes()
    const [coreX, coreY] = project(0, 0)

    return (
        <svg
            className="blueprint-drawing"
            viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
            aria-labelledby={captionId}
            aria-describedby="baton-blueprint-desc"
        >
            <desc id="baton-blueprint-desc">
                {nodes.map((node) => `${node.name}: ${node.role}`).join(", ")}
            </desc>
            <g className="blueprint-drawing__links" aria-hidden="true">
                {nodes
                    .filter((node) => node.id !== "core")
                    .map((node) => {
                        const [x, y] = project(node.position.x, node.position.y)
                        return <line key={node.id} x1={coreX} y1={coreY} x2={x} y2={y} />
                    })}
            </g>
            {nodes.map((node) => {
                const faces = boxFaces(node.position, node.box)
                const [labelX, labelY] = project(node.position.x, node.position.y, node.box.height)
                const isCore = node.id === "core"
                return (
                    <Link
                        className={`blueprint-drawing__box${isCore ? " is-core" : ""}`}
                        to={node.route}
                        aria-label={node.label}
                        key={node.id}
                    >
                        <polygon className="blueprint-drawing__face--left" points={faces.left} />
                        <polygon className="blueprint-drawing__face--right" points={faces.right} />
                        <polygon className="blueprint-drawing__face--top" points={faces.top} />
                        <text className="blueprint-drawing__name" x={labelX} y={labelY - 3}>
                            {node.name}
                        </text>
                        <text className="blueprint-drawing__role" x={labelX} y={labelY + 13}>
                            {node.role}
                        </text>
                    </Link>
                )
            })}
        </svg>
    )
}

export default BatonBlueprint

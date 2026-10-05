import { projectSummariesById } from "../data/projectSummaries"

// BATON의 Core와 6개 서비스를 등각 투영 선화로 그린다.
// 화면 좌표는 x = (X − Y)·cos30°, y = (X + Y)·sin30° − Z 로 계산한다.
const COS30 = Math.cos(Math.PI / 6)
const ORIGIN = { x: 480, y: 244 }
const RING_RADIUS = 225
const SERVICE_BOX = { size: 100, height: 28 }
const CORE_BOX = { size: 160, height: 60 }

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
        const angle = ((-120 + index * 60) * Math.PI) / 180
        return {
            id: service.id,
            name: service.name,
            role: service.role,
            position: { x: RING_RADIUS * Math.cos(angle), y: RING_RADIUS * Math.sin(angle) },
            box: SERVICE_BOX,
        }
    })
    const core = {
        id: "core",
        name: "Core",
        role: baton.coreRole,
        position: { x: 0, y: 0 },
        box: CORE_BOX,
    }
    // 화면 뒤쪽(X + Y가 작은 쪽)부터 그려야 앞의 상자가 뒤 상자를 가린다.
    return [...services, core].sort(
        (left, right) => left.position.x + left.position.y - (right.position.x + right.position.y),
    )
}

const BatonBlueprint = ({ captionId }) => {
    const nodes = createNodes()
    const [coreX, coreY] = project(0, 0)

    return (
        <svg
            className="blueprint-drawing"
            viewBox="0 0 960 460"
            role="img"
            aria-labelledby={captionId}
            aria-describedby="baton-blueprint-desc"
        >
            <desc id="baton-blueprint-desc">
                {nodes.map((node) => `${node.name}: ${node.role}`).join(", ")}
            </desc>
            <g className="blueprint-drawing__links">
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
                    <g
                        className={`blueprint-drawing__box${isCore ? " is-core" : ""}`}
                        key={node.id}
                    >
                        <polygon className="blueprint-drawing__face--left" points={faces.left} />
                        <polygon className="blueprint-drawing__face--right" points={faces.right} />
                        <polygon className="blueprint-drawing__face--top" points={faces.top} />
                        <text className="blueprint-drawing__name" x={labelX} y={labelY - 2}>
                            {node.name}
                        </text>
                        <text className="blueprint-drawing__role" x={labelX} y={labelY + 15}>
                            {node.role}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

export default BatonBlueprint

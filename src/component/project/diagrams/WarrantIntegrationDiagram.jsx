const WarrantIntegrationDiagram = () => (
    <figure className="editorial-diagram warrant-integration">
        <figcaption className="editorial-diagram__header">
            <span className="editorial-diagram__eyebrow">FIG 03 / BEINTECH × LG CNS</span>
            <strong>독립망 사이에서 요청과 제출 자료를 변환해 전달</strong>
            <p>
                행정망, 인터넷망과 기관 업무망의 경계를 유지하면서 집행포털이 기관별 형식 변환과
                전송 상태를 관리합니다.
            </p>
        </figcaption>
        <div
            className="editorial-diagram__viewport"
            role="region"
            aria-label="전자영장 기관 연계 흐름 가로 스크롤 영역"
            tabIndex={0}
        >
            <svg
                className="editorial-diagram__canvas warrant-integration__canvas"
                viewBox="0 0 960 560"
                role="img"
                aria-labelledby="warrant-integration-title warrant-integration-desc"
            >
                <title id="warrant-integration-title">전송형 전자영장 기관 연계 흐름</title>
                <desc id="warrant-integration-desc">
                    해양경찰 KICS의 자료 제공 요청이 전자영장 집행포털에서 기관별 형식으로 변환되어
                    금융기관과 통신사에 전달되고, 제출 자료가 포털을 거쳐 KICS에 반영되는
                    흐름입니다.
                </desc>
                <defs>
                    <marker
                        id="warrant-arrow-request"
                        markerWidth="8"
                        markerHeight="8"
                        refX="7"
                        refY="4"
                        orient="auto"
                    >
                        <path className="editorial-diagram__marker--accent" d="M0,0 L8,4 L0,8 Z" />
                    </marker>
                    <marker
                        id="warrant-arrow-submission"
                        markerWidth="8"
                        markerHeight="8"
                        refX="7"
                        refY="4"
                        orient="auto"
                    >
                        <path className="editorial-diagram__marker--muted" d="M0,0 L8,4 L0,8 Z" />
                    </marker>
                </defs>

                <rect className="editorial-diagram__paper" width="960" height="560" />

                <g className="editorial-diagram__zones">
                    <rect
                        className="editorial-diagram__zone"
                        x="32"
                        y="40"
                        width="248"
                        height="424"
                        rx="8"
                    />
                    <rect
                        className="editorial-diagram__zone"
                        x="356"
                        y="40"
                        width="248"
                        height="424"
                        rx="8"
                    />
                    <rect
                        className="editorial-diagram__zone"
                        x="680"
                        y="40"
                        width="248"
                        height="424"
                        rx="8"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="48"
                        y="44"
                        width="72"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__zone-label"
                        x="84"
                        y="56"
                        textAnchor="middle"
                    >
                        행정망
                    </text>
                    <rect
                        className="editorial-diagram__label-mask"
                        x="372"
                        y="44"
                        width="160"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__zone-label"
                        x="452"
                        y="56"
                        textAnchor="middle"
                    >
                        인터넷망 / LG CNS 주관
                    </text>
                    <rect
                        className="editorial-diagram__label-mask"
                        x="696"
                        y="44"
                        width="112"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__zone-label"
                        x="752"
                        y="56"
                        textAnchor="middle"
                    >
                        기관 업무망
                    </text>
                </g>

                <g className="warrant-integration__paths">
                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--accent"
                        x1="240"
                        y1="224"
                        x2="396"
                        y2="224"
                        markerEnd="url(#warrant-arrow-request)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="252"
                        y="196"
                        width="132"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="318"
                        y="208"
                        textAnchor="middle"
                    >
                        자료 제공 요청
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--muted editorial-diagram__connector--dashed"
                        x1="396"
                        y1="304"
                        x2="240"
                        y2="304"
                        markerEnd="url(#warrant-arrow-submission)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="260"
                        y="276"
                        width="116"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="318"
                        y="288"
                        textAnchor="middle"
                    >
                        KICS 반영
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--accent"
                        x1="564"
                        y1="168"
                        x2="720"
                        y2="168"
                        markerEnd="url(#warrant-arrow-request)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="576"
                        y="140"
                        width="132"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="642"
                        y="152"
                        textAnchor="middle"
                    >
                        기관별 요청 전달
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--muted editorial-diagram__connector--dashed"
                        x1="720"
                        y1="216"
                        x2="564"
                        y2="216"
                        markerEnd="url(#warrant-arrow-submission)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="584"
                        y="188"
                        width="116"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="642"
                        y="200"
                        textAnchor="middle"
                    >
                        제출 자료
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--accent"
                        x1="564"
                        y1="344"
                        x2="720"
                        y2="344"
                        markerEnd="url(#warrant-arrow-request)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="576"
                        y="316"
                        width="132"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="642"
                        y="328"
                        textAnchor="middle"
                    >
                        기관별 요청 전달
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--muted editorial-diagram__connector--dashed"
                        x1="720"
                        y1="392"
                        x2="564"
                        y2="392"
                        markerEnd="url(#warrant-arrow-submission)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="584"
                        y="364"
                        width="116"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="642"
                        y="376"
                        textAnchor="middle"
                    >
                        제출 자료
                    </text>
                </g>

                <g className="warrant-integration__nodes">
                    <g className="editorial-diagram__node">
                        <rect x="72" y="196" width="168" height="136" rx="8" />
                        <text className="editorial-diagram__tag" x="88" y="220">
                            KICS
                        </text>
                        <text className="editorial-diagram__node-title" x="88" y="252">
                            <tspan x="88" dy="0">
                                해양경찰
                            </tspan>
                            <tspan x="88" dy="20">
                                사건수사시스템
                            </tspan>
                        </text>
                        <text className="editorial-diagram__node-meta" x="88" y="304">
                            요청 생성 / 자료 반영
                        </text>
                    </g>

                    <g className="editorial-diagram__node editorial-diagram__node--focal">
                        <rect x="396" y="120" width="168" height="304" rx="8" />
                        <text className="editorial-diagram__tag" x="412" y="144">
                            PORTAL
                        </text>
                        <text className="editorial-diagram__node-title" x="412" y="180">
                            <tspan x="412" dy="0">
                                전자영장
                            </tspan>
                            <tspan x="412" dy="20">
                                집행포털
                            </tspan>
                        </text>
                        <line
                            className="editorial-diagram__node-rule"
                            x1="412"
                            y1="224"
                            x2="548"
                            y2="224"
                        />
                        <text className="editorial-diagram__node-meta" x="412" y="252">
                            <tspan x="412" dy="0">
                                요청 수신
                            </tspan>
                            <tspan x="412" dy="20">
                                기관별 형식 변환
                            </tspan>
                            <tspan x="412" dy="20">
                                전송 상태 관리
                            </tspan>
                        </text>
                        <line
                            className="editorial-diagram__node-rule"
                            x1="412"
                            y1="328"
                            x2="548"
                            y2="328"
                        />
                        <text className="editorial-diagram__node-meta" x="412" y="356">
                            <tspan x="412" dy="0">
                                제출 자료 수신
                            </tspan>
                            <tspan x="412" dy="20">
                                연계 변환 / KICS 반영
                            </tspan>
                        </text>
                    </g>

                    <g className="editorial-diagram__node editorial-diagram__node--external">
                        <rect x="720" y="120" width="168" height="120" rx="8" />
                        <text className="editorial-diagram__tag" x="736" y="144">
                            INSTITUTION
                        </text>
                        <text className="editorial-diagram__node-title" x="736" y="180">
                            금융기관 업무망
                        </text>
                        <text className="editorial-diagram__node-meta" x="736" y="208">
                            요청 접수 / 자료 제출
                        </text>
                    </g>

                    <g className="editorial-diagram__node editorial-diagram__node--external">
                        <rect x="720" y="304" width="168" height="120" rx="8" />
                        <text className="editorial-diagram__tag" x="736" y="328">
                            INSTITUTION
                        </text>
                        <text className="editorial-diagram__node-title" x="736" y="364">
                            통신사 업무망
                        </text>
                        <text className="editorial-diagram__node-meta" x="736" y="392">
                            전용망 / 자료 제출
                        </text>
                    </g>
                </g>

                <g className="editorial-diagram__legend">
                    <line x1="32" y1="488" x2="928" y2="488" />
                    <text className="editorial-diagram__legend-title" x="32" y="520">
                        LEGEND
                    </text>
                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--accent"
                        x1="128"
                        y1="516"
                        x2="164"
                        y2="516"
                    />
                    <text x="176" y="520">
                        자료 제공 요청
                    </text>
                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--muted editorial-diagram__connector--dashed"
                        x1="320"
                        y1="516"
                        x2="356"
                        y2="516"
                    />
                    <text x="368" y="520">
                        제출 자료
                    </text>
                    <rect
                        className="editorial-diagram__legend-zone"
                        x="480"
                        y="504"
                        width="28"
                        height="20"
                        rx="4"
                    />
                    <text x="520" y="520">
                        독립망 경계
                    </text>
                </g>
            </svg>
        </div>
    </figure>
)

export default WarrantIntegrationDiagram

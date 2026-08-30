const WarrantIntegrationDiagram = () => (
    <figure className="editorial-diagram warrant-integration">
        <figcaption className="editorial-diagram__header">
            <span className="editorial-diagram__eyebrow">FIG 03 / BEINTECH / LG CNS 컨소시엄</span>
            <h3 className="editorial-diagram__title">KICS 요청 변환 및 제출 자료 반영</h3>
            <p>요청은 통신사 및 포털 형식으로 전달하고, 제출 자료는 KICS에 반영합니다.</p>
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
                <title id="warrant-integration-title">KICS 요청 변환 및 기관 연계 흐름</title>
                <desc id="warrant-integration-desc">
                    KICS 연계 서버와 배치는 요청을 통신사용 또는 포털용 형식으로 변환해 전달하고,
                    통신사와 금융기관의 제출 자료를 KICS에 반영합니다.
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
                        width="96"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__zone-label"
                        x="96"
                        y="56"
                        textAnchor="middle"
                    >
                        KICS 행정망
                    </text>
                    <rect
                        className="editorial-diagram__label-mask"
                        x="372"
                        y="44"
                        width="176"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__zone-label"
                        x="460"
                        y="56"
                        textAnchor="middle"
                    >
                        인터넷망 / 전자영장 포털
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
                        y1="168"
                        x2="396"
                        y2="168"
                        markerEnd="url(#warrant-arrow-request)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="260"
                        y="140"
                        width="116"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="320"
                        y="152"
                        textAnchor="middle"
                    >
                        포털용 요청
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--muted editorial-diagram__connector--dashed"
                        x1="396"
                        y1="216"
                        x2="240"
                        y2="216"
                        markerEnd="url(#warrant-arrow-submission)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="276"
                        y="188"
                        width="84"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="320"
                        y="200"
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
                        x="568"
                        y="140"
                        width="144"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="640"
                        y="152"
                        textAnchor="middle"
                    >
                        금융기관 요청
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
                        width="112"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="640"
                        y="200"
                        textAnchor="middle"
                    >
                        금융기관 제출 자료
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--accent"
                        x1="240"
                        y1="344"
                        x2="720"
                        y2="344"
                        markerEnd="url(#warrant-arrow-request)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="416"
                        y="316"
                        width="128"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="480"
                        y="328"
                        textAnchor="middle"
                    >
                        통신사용 요청
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--muted editorial-diagram__connector--dashed"
                        x1="720"
                        y1="392"
                        x2="240"
                        y2="392"
                        markerEnd="url(#warrant-arrow-submission)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="412"
                        y="364"
                        width="136"
                        height="16"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="480"
                        y="376"
                        textAnchor="middle"
                    >
                        통신사 제출 자료
                    </text>
                </g>

                <g className="warrant-integration__nodes">
                    <g
                        className="editorial-diagram__node editorial-diagram__node--focal"
                        role="group"
                        aria-label="KICS 연계 서버 및 배치"
                    >
                        <rect x="72" y="120" width="168" height="304" rx="8" />
                        <text className="editorial-diagram__tag" x="88" y="144">
                            KICS SERVER
                        </text>
                        <text className="editorial-diagram__node-title" x="88" y="180">
                            <tspan x="88" dy="0">
                                KICS 연계 서버
                            </tspan>
                            <tspan x="88" dy="20">
                                및 배치
                            </tspan>
                        </text>
                        <line
                            className="editorial-diagram__node-rule"
                            x1="88"
                            y1="224"
                            x2="224"
                            y2="224"
                        />
                        <text className="editorial-diagram__node-meta" x="88" y="252">
                            <tspan x="88" dy="0">
                                요청 수신
                            </tspan>
                            <tspan x="88" dy="20">
                                기관별 형식 변환
                            </tspan>
                            <tspan x="88" dy="20">
                                전송 요청 생성
                            </tspan>
                        </text>
                        <line
                            className="editorial-diagram__node-rule"
                            x1="88"
                            y1="328"
                            x2="224"
                            y2="328"
                        />
                        <text className="editorial-diagram__node-meta" x="88" y="356">
                            <tspan x="88" dy="0">
                                제출 자료 수신
                            </tspan>
                            <tspan x="88" dy="20">
                                KICS 반영
                            </tspan>
                            <tspan x="88" dy="20">
                                Spring Batch
                            </tspan>
                        </text>
                    </g>

                    <g className="editorial-diagram__node" role="group" aria-label="전자영장 포털">
                        <rect x="396" y="112" width="168" height="136" rx="8" />
                        <text className="editorial-diagram__tag" x="412" y="136">
                            PORTAL
                        </text>
                        <text className="editorial-diagram__node-title" x="412" y="168">
                            <tspan x="412" dy="0">
                                전자영장
                            </tspan>
                            <tspan x="412" dy="20">
                                포털
                            </tspan>
                        </text>
                        <text className="editorial-diagram__node-meta" x="412" y="216">
                            <tspan x="412" dy="0">
                                요청 및 제출 자료 중계
                            </tspan>
                        </text>
                    </g>

                    <g
                        className="editorial-diagram__node editorial-diagram__node--external"
                        role="group"
                        aria-label="금융기관 업무망"
                    >
                        <rect x="720" y="120" width="168" height="120" rx="8" />
                        <text className="editorial-diagram__tag" x="736" y="144">
                            INSTITUTION
                        </text>
                        <text className="editorial-diagram__node-title" x="736" y="180">
                            금융기관 업무망
                        </text>
                        <text className="editorial-diagram__node-meta" x="736" y="208">
                            포털 경유 / 자료 제출
                        </text>
                    </g>

                    <g
                        className="editorial-diagram__node editorial-diagram__node--external"
                        role="group"
                        aria-label="통신사 업무망"
                    >
                        <rect x="720" y="304" width="168" height="120" rx="8" />
                        <text className="editorial-diagram__tag" x="736" y="328">
                            INSTITUTION
                        </text>
                        <text className="editorial-diagram__node-title" x="736" y="364">
                            통신사 업무망
                        </text>
                        <text className="editorial-diagram__node-meta" x="736" y="392">
                            요청 접수 / 자료 제출
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
                        x="560"
                        y="504"
                        width="28"
                        height="20"
                        rx="4"
                    />
                    <text x="600" y="520">
                        독립망 경계
                    </text>
                </g>
            </svg>
        </div>
    </figure>
)

export default WarrantIntegrationDiagram

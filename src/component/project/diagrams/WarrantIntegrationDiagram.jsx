// 맡은 부분은 해양경찰 쪽 연계 기능과 배치다. 연계는 KICS 서버와 분리된 해양경찰 연계 서버(이중화)가 처리한다.
// 5개 기관 연계 시스템은 영장집행포털이며, 5개 기관과 피집행기관(금융기관, 통신사)을 연결한다
// (2026-10-11~12 사용자 정정). 포털은 맡은 부분이 아니므로 강조하지 않는다.
const WarrantIntegrationDiagram = () => (
    <figure className="editorial-diagram warrant-integration">
        <figcaption className="editorial-diagram__header">
            <h3 className="editorial-diagram__title">해양경찰 연계 서버와 영장집행포털</h3>
            <p>
                해양경찰 쪽 연계 기능과 배치를 맡았습니다. KICS 서버와 분리된 이중화 연계 서버가
                영장집행포털과 연계하고, 포털이 5개 기관과 피집행기관을 연결합니다.
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
                <title id="warrant-integration-title">해양경찰 KICS와 기관 간 자료 연계 흐름</title>
                <desc id="warrant-integration-desc">
                    KICS 서버와 분리된 해양경찰 연계 서버가 영장집행포털로 자료 제공 요청을 보내고
                    제출 자료를 받습니다. 영장집행포털은 5개 기관과 피집행기관을 연결하는 연계
                    시스템으로, 금융기관과 통신사에 요청을 전달하고 제출 자료를 받습니다. 맡은
                    부분은 해양경찰 쪽 연계 기능과 배치입니다.
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
                        width="400"
                        height="424"
                        rx="8"
                    />
                    <rect
                        className="editorial-diagram__zone"
                        x="496"
                        y="40"
                        width="168"
                        height="424"
                        rx="8"
                    />
                    <rect
                        className="editorial-diagram__zone"
                        x="744"
                        y="40"
                        width="184"
                        height="424"
                        rx="8"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="48"
                        y="36"
                        width="96"
                        height="24"
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
                        x="512"
                        y="36"
                        width="80"
                        height="24"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__zone-label"
                        x="552"
                        y="56"
                        textAnchor="middle"
                    >
                        인터넷망
                    </text>
                    <rect
                        className="editorial-diagram__label-mask"
                        x="760"
                        y="36"
                        width="112"
                        height="24"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__zone-label"
                        x="816"
                        y="56"
                        textAnchor="middle"
                    >
                        기관 업무망
                    </text>
                </g>

                <g className="warrant-integration__paths">
                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--accent"
                        x1="184"
                        y1="256"
                        x2="280"
                        y2="256"
                        markerEnd="url(#warrant-arrow-request)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="206"
                        y="220"
                        width="52"
                        height="24"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="232"
                        y="240"
                        textAnchor="middle"
                    >
                        요청
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--muted editorial-diagram__connector--dashed"
                        x1="280"
                        y1="312"
                        x2="184"
                        y2="312"
                        markerEnd="url(#warrant-arrow-submission)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="190"
                        y="276"
                        width="84"
                        height="24"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="232"
                        y="296"
                        textAnchor="middle"
                    >
                        제출 자료
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--accent"
                        x1="416"
                        y1="256"
                        x2="512"
                        y2="256"
                        markerEnd="url(#warrant-arrow-request)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="438"
                        y="220"
                        width="52"
                        height="24"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="464"
                        y="240"
                        textAnchor="middle"
                    >
                        요청
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--muted editorial-diagram__connector--dashed"
                        x1="512"
                        y1="312"
                        x2="416"
                        y2="312"
                        markerEnd="url(#warrant-arrow-submission)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="422"
                        y="276"
                        width="84"
                        height="24"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="464"
                        y="296"
                        textAnchor="middle"
                    >
                        제출 자료
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--accent"
                        x1="648"
                        y1="168"
                        x2="768"
                        y2="168"
                        markerEnd="url(#warrant-arrow-request)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="682"
                        y="132"
                        width="52"
                        height="24"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="708"
                        y="152"
                        textAnchor="middle"
                    >
                        요청
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--muted editorial-diagram__connector--dashed"
                        x1="768"
                        y1="216"
                        x2="648"
                        y2="216"
                        markerEnd="url(#warrant-arrow-submission)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="666"
                        y="180"
                        width="84"
                        height="24"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="708"
                        y="200"
                        textAnchor="middle"
                    >
                        제출 자료
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--accent"
                        x1="648"
                        y1="344"
                        x2="768"
                        y2="344"
                        markerEnd="url(#warrant-arrow-request)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="682"
                        y="308"
                        width="52"
                        height="24"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="708"
                        y="328"
                        textAnchor="middle"
                    >
                        요청
                    </text>

                    <line
                        className="editorial-diagram__connector editorial-diagram__connector--muted editorial-diagram__connector--dashed"
                        x1="768"
                        y1="392"
                        x2="648"
                        y2="392"
                        markerEnd="url(#warrant-arrow-submission)"
                    />
                    <rect
                        className="editorial-diagram__label-mask"
                        x="666"
                        y="356"
                        width="84"
                        height="24"
                        rx="2"
                    />
                    <text
                        className="editorial-diagram__connector-label"
                        x="708"
                        y="376"
                        textAnchor="middle"
                    >
                        제출 자료
                    </text>
                </g>

                <g className="warrant-integration__nodes">
                    <g className="editorial-diagram__node">
                        <rect x="48" y="224" width="136" height="112" rx="8" />
                        <text className="editorial-diagram__tag" x="64" y="248">
                            해양경찰
                        </text>
                        <text className="editorial-diagram__node-title" x="64" y="280">
                            KICS 서버
                        </text>
                        <text className="editorial-diagram__node-meta" x="64" y="308">
                            영장 업무
                        </text>
                    </g>

                    <g className="editorial-diagram__node editorial-diagram__node--focal">
                        <rect x="280" y="184" width="136" height="192" rx="8" />
                        <text className="editorial-diagram__tag" x="296" y="208">
                            맡은 부분
                        </text>
                        <text className="editorial-diagram__node-title" x="296" y="240">
                            <tspan x="296" dy="0">
                                해양경찰
                            </tspan>
                            <tspan x="296" dy="28">
                                연계 서버
                            </tspan>
                        </text>
                        <line
                            className="editorial-diagram__node-rule"
                            x1="296"
                            y1="288"
                            x2="400"
                            y2="288"
                        />
                        <text className="editorial-diagram__node-meta" x="296" y="312">
                            <tspan x="296" dy="0">
                                연계 기능
                            </tspan>
                            <tspan x="296" dy="20">
                                Spring Batch
                            </tspan>
                            <tspan x="296" dy="20">
                                이중화 구성
                            </tspan>
                        </text>
                    </g>

                    <g className="editorial-diagram__node">
                        <rect x="512" y="120" width="136" height="304" rx="8" />
                        <text className="editorial-diagram__tag" x="528" y="144">
                            5개 기관 연계
                        </text>
                        <text className="editorial-diagram__node-title" x="528" y="176">
                            <tspan x="528" dy="0">
                                영장집행
                            </tspan>
                            <tspan x="528" dy="28">
                                포털
                            </tspan>
                        </text>
                        <line
                            className="editorial-diagram__node-rule"
                            x1="528"
                            y1="224"
                            x2="632"
                            y2="224"
                        />
                        <text className="editorial-diagram__node-meta" x="528" y="248">
                            <tspan x="528" dy="0">
                                5개 기관과
                            </tspan>
                            <tspan x="528" dy="20">
                                피집행기관
                            </tspan>
                            <tspan x="528" dy="20">
                                연결
                            </tspan>
                        </text>
                    </g>

                    <g className="editorial-diagram__node editorial-diagram__node--external">
                        <rect x="768" y="120" width="136" height="152" rx="8" />
                        <text className="editorial-diagram__tag" x="784" y="144">
                            피집행기관
                        </text>
                        <text className="editorial-diagram__node-title" x="784" y="176">
                            <tspan x="784" dy="0">
                                금융기관
                            </tspan>
                            <tspan x="784" dy="28">
                                업무망
                            </tspan>
                        </text>
                        <text className="editorial-diagram__node-meta" x="784" y="228">
                            <tspan x="784" dy="0">
                                요청 접수
                            </tspan>
                            <tspan x="784" dy="20">
                                자료 제출
                            </tspan>
                        </text>
                    </g>

                    <g className="editorial-diagram__node editorial-diagram__node--external">
                        <rect x="768" y="304" width="136" height="144" rx="8" />
                        <text className="editorial-diagram__tag" x="784" y="328">
                            피집행기관
                        </text>
                        <text className="editorial-diagram__node-title" x="784" y="356">
                            <tspan x="784" dy="0">
                                통신사
                            </tspan>
                            <tspan x="784" dy="28">
                                업무망
                            </tspan>
                        </text>
                        <text className="editorial-diagram__node-meta" x="784" y="412">
                            <tspan x="784" dy="0">
                                요청 접수
                            </tspan>
                            <tspan x="784" dy="20">
                                자료 제출
                            </tspan>
                        </text>
                    </g>
                </g>

                <g className="editorial-diagram__legend">
                    <line x1="32" y1="488" x2="928" y2="488" />
                    <text className="editorial-diagram__legend-title" x="32" y="520">
                        범례
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
                        망 경계
                    </text>
                </g>
            </svg>
        </div>
    </figure>
)

export default WarrantIntegrationDiagram

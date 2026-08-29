import useCenteredDiagramViewport from "./useCenteredDiagramViewport"

const HopeCommitFlowDiagram = () => {
    const viewportRef = useCenteredDiagramViewport()

    return (
        <figure className="editorial-diagram hope-commit-flow">
            <figcaption className="editorial-diagram__header">
                <span className="editorial-diagram__eyebrow">COMMIT DIFF / LOCAL GIT OBJECTS</span>
                <h3 className="editorial-diagram__title">검증을 통과한 커밋 리뷰만 저장</h3>
                <p className="editorial-diagram__summary">
                    선택한 커밋과 확정한 비교 기준 사이의 변경만 읽고, 실제 변경 파일과 줄에 연결된
                    결과만 새 HTML로 저장합니다.
                </p>
            </figcaption>

            <div
                ref={viewportRef}
                className="editorial-diagram__viewport"
                role="region"
                aria-label="Hope Commit 처리 흐름 가로 스크롤 영역"
                tabIndex={0}
            >
                <svg
                    className="editorial-diagram__canvas hope-commit-flow__svg"
                    viewBox="0 0 960 680"
                    role="img"
                    aria-labelledby="hope-commit-flow-title hope-commit-flow-desc"
                >
                    <title id="hope-commit-flow-title">Hope Commit의 커밋 검토 및 저장 흐름</title>
                    <desc id="hope-commit-flow-desc">
                        선택한 커밋을 확정하고 일반, 최초 및 병합 커밋별 비교 기준과의 변경을 수집한
                        뒤 파일과 줄 및 JSON 근거를 검증해, 통과하면 새 HTML을 저장하고 실패하면
                        저장하지 않고 중단하는 흐름입니다.
                    </desc>
                    <defs>
                        <marker
                            id="hope-commit-flow-arrow"
                            markerWidth="8"
                            markerHeight="8"
                            refX="7"
                            refY="4"
                            orient="auto"
                        >
                            <path
                                className="hope-commit-flow__arrow-head"
                                d="M 0 0 L 8 4 L 0 8 Z"
                            />
                        </marker>
                    </defs>

                    <rect className="editorial-diagram__paper" width="960" height="680" />

                    <g className="hope-commit-flow__connections" aria-hidden="true">
                        <path
                            className="hope-commit-flow__connector"
                            d="M 480 80 V 104"
                            markerEnd="url(#hope-commit-flow-arrow)"
                        />
                        <path
                            className="hope-commit-flow__connector"
                            d="M 360 144 H 200 Q 192 144 192 152 V 244"
                            markerEnd="url(#hope-commit-flow-arrow)"
                        />
                        <path
                            className="hope-commit-flow__connector"
                            d="M 480 184 V 244"
                            markerEnd="url(#hope-commit-flow-arrow)"
                        />
                        <path
                            className="hope-commit-flow__connector"
                            d="M 600 144 H 760 Q 768 144 768 152 V 244"
                            markerEnd="url(#hope-commit-flow-arrow)"
                        />
                        <path
                            className="hope-commit-flow__connector"
                            d="M 192 308 V 332 Q 192 340 200 340 H 412 Q 420 340 420 348 V 364"
                            markerEnd="url(#hope-commit-flow-arrow)"
                        />
                        <path
                            className="hope-commit-flow__connector"
                            d="M 480 308 V 364"
                            markerEnd="url(#hope-commit-flow-arrow)"
                        />
                        <path
                            className="hope-commit-flow__connector"
                            d="M 768 308 V 332 Q 768 340 760 340 H 548 Q 540 340 540 348 V 364"
                            markerEnd="url(#hope-commit-flow-arrow)"
                        />
                        <path
                            className="hope-commit-flow__connector"
                            d="M 480 428 V 452"
                            markerEnd="url(#hope-commit-flow-arrow)"
                        />
                        <path
                            className="hope-commit-flow__connector hope-commit-flow__connector--success"
                            d="M 624 496 H 688"
                            markerEnd="url(#hope-commit-flow-arrow)"
                        />
                        <path
                            className="hope-commit-flow__connector hope-commit-flow__connector--failure"
                            d="M 480 540 V 580"
                            markerEnd="url(#hope-commit-flow-arrow)"
                        />

                        <g className="hope-commit-flow__connector-label">
                            <rect x="264" y="116" width="48" height="12" rx="2" />
                            <text x="288" y="124">
                                일반
                            </text>
                        </g>
                        <g className="hope-commit-flow__connector-label">
                            <rect x="500" y="200" width="48" height="16" rx="2" />
                            <text x="524" y="212">
                                최초
                            </text>
                        </g>
                        <g className="hope-commit-flow__connector-label">
                            <rect x="648" y="116" width="48" height="12" rx="2" />
                            <text x="672" y="124">
                                병합
                            </text>
                        </g>
                        <g className="hope-commit-flow__connector-label">
                            <rect x="636" y="468" width="40" height="12" rx="2" />
                            <text x="656" y="476">
                                통과
                            </text>
                        </g>
                        <g className="hope-commit-flow__connector-label">
                            <rect x="500" y="548" width="40" height="16" rx="2" />
                            <text x="520" y="560">
                                실패
                            </text>
                        </g>
                    </g>

                    <g className="hope-commit-flow__nodes">
                        <g className="hope-commit-flow__node hope-commit-flow__node--start">
                            <rect x="360" y="24" width="240" height="56" rx="28" />
                            <text className="hope-commit-flow__node-title" x="480" y="48">
                                입력 커밋 확정
                            </text>
                            <text className="hope-commit-flow__node-detail" x="480" y="68">
                                짧은 ID를 전체 ID로 고정
                            </text>
                        </g>

                        <g className="hope-commit-flow__node hope-commit-flow__node--decision">
                            <path d="M 480 104 L 600 144 L 480 184 L 360 144 Z" />
                            <text className="hope-commit-flow__node-title" x="480" y="140">
                                커밋 종류
                            </text>
                            <text className="hope-commit-flow__node-detail" x="480" y="156">
                                부모 수 확인
                            </text>
                        </g>

                        <g className="hope-commit-flow__node hope-commit-flow__node--action">
                            <rect x="72" y="244" width="240" height="64" rx="6" />
                            <text className="hope-commit-flow__node-tag" x="192" y="264">
                                일반 커밋
                            </text>
                            <text className="hope-commit-flow__node-title" x="192" y="288">
                                첫 번째 부모
                            </text>
                            <text className="hope-commit-flow__node-detail" x="192" y="300">
                                비교 기준
                            </text>
                        </g>

                        <g className="hope-commit-flow__node hope-commit-flow__node--action">
                            <rect x="360" y="244" width="240" height="64" rx="6" />
                            <text className="hope-commit-flow__node-tag" x="480" y="264">
                                최초 커밋
                            </text>
                            <text className="hope-commit-flow__node-title" x="480" y="288">
                                Git 빈 상태
                            </text>
                            <text className="hope-commit-flow__node-detail" x="480" y="300">
                                비교 기준
                            </text>
                        </g>

                        <g className="hope-commit-flow__node hope-commit-flow__node--action">
                            <rect x="648" y="244" width="240" height="64" rx="6" />
                            <text className="hope-commit-flow__node-tag" x="768" y="264">
                                병합 커밋
                            </text>
                            <text className="hope-commit-flow__node-title" x="768" y="288">
                                사용자가 고른 부모
                            </text>
                            <text className="hope-commit-flow__node-detail" x="768" y="300">
                                비교 기준
                            </text>
                        </g>

                        <g className="hope-commit-flow__node hope-commit-flow__node--action">
                            <rect x="360" y="364" width="240" height="64" rx="6" />
                            <text className="hope-commit-flow__node-tag" x="480" y="384">
                                GIT OBJECTS
                            </text>
                            <text className="hope-commit-flow__node-title" x="480" y="404">
                                변경 코드 수집
                            </text>
                            <text className="hope-commit-flow__node-detail" x="480" y="420">
                                커밋에 저장된 파일만 읽기
                            </text>
                        </g>

                        <g className="hope-commit-flow__node hope-commit-flow__node--decision">
                            <path d="M 480 452 L 624 496 L 480 540 L 336 496 Z" />
                            <text className="hope-commit-flow__node-title" x="480" y="492">
                                근거가 유효한가?
                            </text>
                            <text className="hope-commit-flow__node-detail" x="480" y="508">
                                파일·줄 및 JSON 형식 확인
                            </text>
                        </g>

                        <g className="hope-commit-flow__node hope-commit-flow__node--end-success">
                            <rect x="688" y="468" width="208" height="56" rx="28" />
                            <text className="hope-commit-flow__node-title" x="792" y="492">
                                새 HTML 저장
                            </text>
                            <text className="hope-commit-flow__node-detail" x="792" y="512">
                                검증된 결과만 생성
                            </text>
                        </g>

                        <g className="hope-commit-flow__node hope-commit-flow__node--end-failure">
                            <rect x="376" y="580" width="208" height="56" rx="28" />
                            <text className="hope-commit-flow__node-title" x="480" y="604">
                                저장하지 않고 중단
                            </text>
                            <text className="hope-commit-flow__node-detail" x="480" y="624">
                                근거 또는 형식 오류
                            </text>
                        </g>
                    </g>

                    <g className="hope-commit-flow__scope-boundary" aria-hidden="true">
                        <rect x="48" y="648" width="864" height="24" rx="4" />
                        <text className="hope-commit-flow__scope-title" x="64" y="664">
                            검토 범위 밖
                        </text>
                        <text x="208" y="664">
                            현재 수정 파일
                        </text>
                        <text x="360" y="664">
                            이전 대화
                        </text>
                        <text x="480" y="664">
                            원격 CI
                        </text>
                        <text x="584" y="664">
                            원격 이슈 및 토론
                        </text>
                    </g>
                </svg>
            </div>
        </figure>
    )
}

export default HopeCommitFlowDiagram

import { type CSSProperties, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import { tokenizeCodeLine } from "../../sorting/code/syntaxHighlight";
import type { SortingCodeExample } from "../../sorting/code/types";
import {
  DIJKSTRA_EXAMPLE_IDS,
  dijkstraExamples,
  formatDistance,
  generateDijkstraTrace,
  getDijkstraDescription,
  getDijkstraInputSummary,
  getDijkstraPathResult,
  getDijkstraTitle
} from "../algorithms/dijkstra";
import { dijkstraCodeExamples } from "../code/dijkstraExamples";
import type {
  DijkstraDistanceRow,
  DijkstraEdgeRenderState,
  DijkstraEdgeStatus,
  DijkstraExampleId,
  DijkstraNodeRenderState,
  DijkstraNodeStatus,
  DijkstraPathResult,
  DijkstraTraceState
} from "../types";

const pseudoCode = [
  "시작 노드의 거리를 0, 나머지는 무한대로 둔다.",
  "미확정 후보 중 가장 작은 임시 거리 노드를 선택한다.",
  "현재 노드의 나가는 간선을 하나씩 검사한다.",
  "후보 거리가 더 짧으면 거리와 이전 노드를 갱신한다.",
  "더 짧지 않거나 이미 확정된 노드는 기존 거리를 유지한다.",
  "현재 노드를 확정하고 다음 후보로 이동한다.",
  "predecessor를 따라 선택한 도착 노드의 경로를 복원한다."
];

const dijkstraConcepts = DIJKSTRA_EXAMPLE_IDS.map((id) => {
  const example = dijkstraExamples.find((item) => item.id === id)!;

  return {
    id,
    title: getDijkstraTitle(id),
    intro: getDijkstraDescription(id),
    inputSummary: getDijkstraInputSummary(id),
    defaultDestinationId: example.defaultDestinationId,
    nodes: example.nodes,
    trace: generateDijkstraTrace(id)
  };
});

const directionLabels: Record<DijkstraExampleId, string> = {
  undirected: "무방향 그래프",
  directed: "방향 그래프"
};

const motionLabels: Record<DijkstraTraceState["motion"], string> = {
  initialize: "초기화",
  "select-current": "현재 선택",
  "inspect-edge": "간선 검사",
  relax: "거리 갱신",
  skip: "갱신 없음",
  settle: "확정",
  complete: "완료"
};

const nodeStatusLabels: Record<DijkstraNodeStatus, string> = {
  unreached: "미도달",
  frontier: "후보",
  current: "현재",
  updated: "갱신됨",
  skipped: "유지",
  settled: "확정",
  "final-path": "최종 경로"
};

const edgeStatusLabels: Record<DijkstraEdgeStatus, string> = {
  idle: "대기",
  inspected: "검사 중",
  relaxed: "갱신",
  skipped: "유지",
  "final-path": "최종 경로"
};

export function DijkstraPage() {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const [selectedDestinationId, setSelectedDestinationId] = useState(
    dijkstraConcepts[0].defaultDestinationId
  );
  const activeConcept = dijkstraConcepts[activeConceptIndex];
  const activeCodeExample = dijkstraCodeExamples[activeCodeIndex];
  const trace = activeConcept.trace;
  const controller = useStepController(trace.length, 900);
  const currentIndex = Math.min(controller.currentIndex, trace.length - 1);
  const currentStep = trace[currentIndex];
  const isCompleteStep = currentStep.state.motion === "complete";
  const pathResult = isCompleteStep
    ? getDijkstraPathResult(currentStep.state, selectedDestinationId)
    : undefined;
  const activeLines =
    currentStep.codeLineHighlights?.[activeCodeExample.language] ?? [];
  const progressPercent =
    trace.length <= 1 ? 100 : (currentIndex / (trace.length - 1)) * 100;

  function selectConcept(index: number) {
    const nextConcept = dijkstraConcepts[index];

    setActiveConceptIndex(index);
    setActiveCodeIndex(0);
    setSelectedDestinationId(nextConcept.defaultDestinationId);
    controller.reset();
  }

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="dijkstra-title">
        <p className="eyebrow">그래프 알고리즘</p>
        <h1 id="dijkstra-title">다익스트라 최단 경로</h1>
        <p className="intro-copy">{activeConcept.intro}</p>
        <div
          className="algorithm-tabs"
          role="tablist"
          aria-label="다익스트라 예제 선택"
        >
          {dijkstraConcepts.map((concept, index) => (
            <button
              aria-selected={activeConceptIndex === index}
              className="algorithm-tab"
              key={concept.id}
              onClick={() => selectConcept(index)}
              role="tab"
              type="button"
            >
              {directionLabels[concept.id]}
            </button>
          ))}
        </div>
        <p className="input-summary">{activeConcept.inputSummary}</p>
      </section>

      <section className="graph-workbench dijkstra-workbench" aria-label="다익스트라 작업 영역">
        <section className="graph-stage-panel dijkstra-stage-panel" aria-label="다익스트라 그래프 도표">
          <div className="stage-header">
            <div>
              <p className="eyebrow">
                {directionLabels[currentStep.state.exampleId]} ·{" "}
                {motionLabels[currentStep.state.motion]}
              </p>
              <h2>스테이지: {currentStep.title}</h2>
            </div>
            <span className="stage-counter">
              {currentIndex + 1} / {trace.length}
            </span>
          </div>

          <DijkstraDiagram state={currentStep.state} pathResult={pathResult} />

          <div className="stage-state-list" aria-label="현재 다익스트라 단계 요약">
            {(currentStep.state.summaryItems ?? []).map((item) => (
              <div className="stage-state-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <DijkstraDistanceTable rows={currentStep.state.distanceRows} />

          <div className="stage-legend" aria-label="다익스트라 상태 범례">
            <span className="legend-title">상태 범례</span>
            <span className="legend-item">
              <span className="legend-swatch is-current" />
              현재
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-range" />
              후보
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-updated" />
              갱신/확정
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-comparing" />
              검사 간선
            </span>
          </div>

          <div className="timeline-controls" aria-label="다익스트라 단계 재생 컨트롤">
            <div className="timeline-row">
              <button
                type="button"
                onClick={controller.goPrevious}
                disabled={controller.isFirstStep}
              >
                이전
              </button>
              <button type="button" onClick={controller.reset}>
                처음으로
              </button>
              <button
                className="primary-control"
                type="button"
                onClick={controller.goNext}
                disabled={controller.isLastStep}
              >
                다음
              </button>
              <button
                type="button"
                onClick={controller.togglePlay}
                disabled={controller.isLastStep}
              >
                {controller.isPlaying ? "정지" : "자동 재생"}
              </button>
            </div>

            <label className="timeline-slider-label" htmlFor="dijkstra-step-slider">
              <span>수동 단계 이동</span>
              <input
                id="dijkstra-step-slider"
                type="range"
                min="0"
                max={trace.length - 1}
                value={currentIndex}
                onChange={(event) =>
                  controller.goToStep(Number(event.currentTarget.value))
                }
                aria-label="다익스트라 단계 슬라이더"
                style={{ "--progress": `${progressPercent}%` } as CSSProperties}
              />
            </label>
          </div>
        </section>

        <DijkstraCodePanel
          activeCodeExample={activeCodeExample}
          activeCodeIndex={activeCodeIndex}
          activeLines={activeLines}
          codeExamples={dijkstraCodeExamples}
          onSelectCode={setActiveCodeIndex}
        />

        <aside className="graph-side-panel dijkstra-side-panel" aria-label="현재 다익스트라 단계 설명">
          <section className="step-panel">
            <h2>현재 단계</h2>
            <p className="step-count">
              {currentIndex + 1} / {trace.length}
            </p>
            <h3>{currentStep.title}</h3>
            <p>{currentStep.description}</p>
          </section>

          <section className="dijkstra-frontier-panel" aria-label="다익스트라 후보 목록">
            <h2>frontier 후보</h2>
            <div className="dijkstra-candidate-list">
              {currentStep.state.frontierCandidates.length ? (
                currentStep.state.frontierCandidates.map((candidate) => (
                  <div
                    className={
                      candidate.isSelected
                        ? "dijkstra-candidate is-selected"
                        : "dijkstra-candidate"
                    }
                    key={candidate.nodeId}
                  >
                    <strong>{candidate.label}</strong>
                    <span>거리 {candidate.distance}</span>
                    <small>{candidate.reason}</small>
                  </div>
                ))
              ) : (
                <span className="traversal-empty">후보 없음</span>
              )}
            </div>
          </section>

          <section className="dijkstra-comparison-panel" aria-label="거리 비교">
            <h2>거리 비교</h2>
            {currentStep.state.comparison ? (
              <dl>
                <div>
                  <dt>계산</dt>
                  <dd>
                    {currentStep.state.comparison.currentDistance} +{" "}
                    {currentStep.state.comparison.edgeWeight} ={" "}
                    {currentStep.state.comparison.candidateDistance}
                  </dd>
                </div>
                <div>
                  <dt>기존 거리</dt>
                  <dd>
                    {formatDistance(currentStep.state.comparison.previousDistance)}
                  </dd>
                </div>
                <div>
                  <dt>결과</dt>
                  <dd>{currentStep.state.comparison.reason}</dd>
                </div>
              </dl>
            ) : (
              <p>간선을 검사하는 단계에서 후보 거리 계산이 표시됩니다.</p>
            )}
          </section>

          <section className="dijkstra-final-panel" aria-label="최종 최단 경로">
            <h2>최종 경로</h2>
            <label htmlFor="dijkstra-destination-select">
              도착 노드
              <select
                id="dijkstra-destination-select"
                value={selectedDestinationId}
                onChange={(event) => setSelectedDestinationId(event.currentTarget.value)}
                disabled={!isCompleteStep}
                aria-label="도착 노드 선택"
              >
                {activeConcept.nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
            </label>
            {isCompleteStep && pathResult ? (
              <div className="dijkstra-path-result">
                <p>
                  총 비용: <strong>{pathResult.totalCostLabel}</strong>
                </p>
                <p>
                  경로:{" "}
                  <strong>
                    {pathResult.isReachable
                      ? pathResult.pathNodeIds.join(" → ")
                      : "도달 불가"}
                  </strong>
                </p>
              </div>
            ) : (
              <p>마지막 단계에서 도착 노드를 선택해 경로를 확인합니다.</p>
            )}
          </section>
        </aside>
      </section>

      <section className="step-pseudo-layout" aria-label="다익스트라 의사 코드">
        <div className="pseudo-panel">
          <h2>다익스트라 절차</h2>
          <ol className="pseudo-code">
            {pseudoCode.map((line, index) => (
              <li
                className={
                  currentStep.pseudoCodeLine === index + 1 ? "is-active" : ""
                }
                aria-current={
                  currentStep.pseudoCodeLine === index + 1 ? "step" : undefined
                }
                key={line}
              >
                {line}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}

function DijkstraDistanceTable({ rows }: { rows: DijkstraDistanceRow[] }) {
  return (
    <div className="dijkstra-table-scroll">
      <table className="dijkstra-distance-table" aria-label="다익스트라 거리 표">
        <thead>
          <tr>
            <th>노드</th>
            <th>현재 거리</th>
            <th>이전 노드</th>
            <th>상태</th>
            <th>후보 비교</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className={`is-${row.status}`} key={row.nodeId}>
              <th scope="row">{row.label}</th>
              <td>{formatDistance(row.distance)}</td>
              <td>{row.previousNodeId ?? "-"}</td>
              <td>{nodeStatusLabels[row.status]}</td>
              <td>
                {row.candidateDistance === undefined
                  ? "-"
                  : `${formatDistance(row.previousDistance ?? "Infinity")} → ${row.candidateDistance}${
                      row.changed ? " 갱신" : " 유지"
                    }`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type DijkstraCodePanelProps = {
  activeCodeExample: SortingCodeExample;
  activeCodeIndex: number;
  activeLines: number[];
  codeExamples: SortingCodeExample[];
  onSelectCode: (index: number) => void;
};

function DijkstraCodePanel({
  activeCodeExample,
  activeCodeIndex,
  activeLines,
  codeExamples,
  onSelectCode
}: DijkstraCodePanelProps) {
  return (
    <section className="code-example-section" aria-label="다익스트라 코드">
      <div className="code-example-header">
        <div>
          <h2>코드 예제</h2>
          <p>현재 단계와 같은 초기화, 선택, 간선 검사, 갱신, 확정 줄을 강조합니다.</p>
        </div>
        <span className="code-file-name">{activeCodeExample.fileName}</span>
      </div>

      <div className="code-tabs" role="tablist" aria-label="코드 언어">
        {codeExamples.map((example, index) => (
          <button
            aria-selected={activeCodeIndex === index}
            className="code-tab"
            key={example.language}
            onClick={() => onSelectCode(index)}
            role="tab"
            type="button"
          >
            {example.language}
          </button>
        ))}
      </div>

      <div className="code-panel" role="tabpanel">
        <ol className="code-lines">
          {activeCodeExample.code.split("\n").map((line, index) => {
            const lineNumber = index + 1;
            const isActive = activeLines.includes(lineNumber);

            return (
              <li
                aria-label={
                  isActive
                    ? `현재 코드 ${lineNumber}: ${line.trim()}`
                    : `코드 ${lineNumber}: ${line.trim()}`
                }
                className={isActive ? "code-line is-active" : "code-line"}
                key={`${activeCodeExample.language}-${lineNumber}-${line}`}
              >
                <span className="code-line-number">{lineNumber}</span>
                <code className="code-line-text">
                  {tokenizeCodeLine(activeCodeExample.language, line).map(
                    (token, tokenIndex) => (
                      <span
                        className={`token-${token.type}`}
                        key={`${activeCodeExample.language}-${lineNumber}-${tokenIndex}`}
                      >
                        {token.text}
                      </span>
                    )
                  )}
                </code>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function DijkstraDiagram({
  pathResult,
  state
}: {
  pathResult?: DijkstraPathResult;
  state: DijkstraTraceState;
}) {
  const finalPathNodeIds = pathResult?.pathNodeIds ?? state.finalPathNodeIds ?? [];
  const finalPathEdgeIds = pathResult?.pathEdgeIds ?? state.finalPathEdgeIds ?? [];

  return (
    <div className="graph-visual-scroll">
      <svg
        aria-label={`${directionLabels[state.exampleId]} 다익스트라 상태`}
        className={`graph-visual dijkstra-visual motion-${state.motion}`}
        role="img"
        viewBox={`0 0 ${state.viewport.width} ${state.viewport.height}`}
      >
        <defs>
          <GraphArrowMarker color="#2f6fbb" id={`dijkstra-arrow-${state.exampleId}`} />
          <GraphArrowMarker
            color="#c94f37"
            id={`dijkstra-arrow-active-${state.exampleId}`}
          />
          <GraphArrowMarker
            color="#3f7d58"
            id={`dijkstra-arrow-final-${state.exampleId}`}
          />
        </defs>
        <g className="graph-edges">
          {state.edges.map((edge) => (
            <DijkstraEdge
              edge={edge}
              finalPathEdgeIds={finalPathEdgeIds}
              key={edge.id}
              state={state}
            />
          ))}
        </g>
        <g className="graph-nodes">
          {state.nodes.map((node) => (
            <g
              aria-label={getDijkstraNodeAriaLabel(node, finalPathNodeIds)}
              className={getDijkstraNodeClassName(node, finalPathNodeIds)}
              key={node.id}
              transform={`translate(${node.x} ${node.y})`}
            >
              <circle r="25" />
              <text dy="5">{node.label}</text>
              <text className="graph-node-note" dy="42">
                {getDijkstraNodeNote(node, finalPathNodeIds)}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function GraphArrowMarker({ color, id }: { color: string; id: string }) {
  return (
    <marker
      id={id}
      markerHeight="9"
      markerWidth="9"
      orient="auto"
      refX="8"
      refY="4.5"
    >
      <path d="M0,0 L9,4.5 L0,9 Z" fill={color} />
    </marker>
  );
}

function DijkstraEdge({
  edge,
  finalPathEdgeIds,
  state
}: {
  edge: DijkstraEdgeRenderState;
  finalPathEdgeIds: string[];
  state: DijkstraTraceState;
}) {
  const geometry = getTrimmedEdgeGeometry(edge);
  const midX = (geometry.x1 + geometry.x2) / 2;
  const midY = (geometry.y1 + geometry.y2) / 2;
  const isFinalPath = finalPathEdgeIds.includes(edge.id);

  return (
    <g
      aria-label={`${edge.fromId}에서 ${edge.toId} 비용 ${edge.weight} ${edgeStatusLabels[isFinalPath ? "final-path" : edge.status]} 간선`}
      className={getDijkstraEdgeClassName(edge, isFinalPath)}
    >
      <line
        markerEnd={
          edge.directed
            ? `url(#${getDijkstraArrowMarkerId(edge, state, isFinalPath)})`
            : undefined
        }
        x1={geometry.x1}
        y1={geometry.y1}
        x2={geometry.x2}
        y2={geometry.y2}
      />
      <g className="graph-edge-weight" transform={`translate(${midX} ${midY})`}>
        <rect height="24" rx="6" width="34" x="-17" y="-12" />
        <text dy="5">{edge.weight}</text>
      </g>
    </g>
  );
}

function getTrimmedEdgeGeometry(edge: DijkstraEdgeRenderState) {
  const radius = 30;
  const dx = edge.toX - edge.fromX;
  const dy = edge.toY - edge.fromY;
  const length = Math.max(Math.hypot(dx, dy), 1);
  const offsetX = (dx / length) * radius;
  const offsetY = (dy / length) * radius;

  return {
    x1: edge.fromX + offsetX,
    y1: edge.fromY + offsetY,
    x2: edge.toX - offsetX,
    y2: edge.toY - offsetY
  };
}

function getDijkstraArrowMarkerId(
  edge: DijkstraEdgeRenderState,
  state: DijkstraTraceState,
  isFinalPath: boolean
): string {
  if (isFinalPath) {
    return `dijkstra-arrow-final-${state.exampleId}`;
  }

  if (edge.status === "inspected" || edge.status === "relaxed" || edge.status === "skipped") {
    return `dijkstra-arrow-active-${state.exampleId}`;
  }

  return `dijkstra-arrow-${state.exampleId}`;
}

function getDijkstraNodeClassName(
  node: DijkstraNodeRenderState,
  finalPathNodeIds: string[]
): string {
  const status = finalPathNodeIds.includes(node.id) ? "final-path" : node.status;
  const classNames = ["graph-node", "dijkstra-node", `is-${status}`];

  if (node.group !== undefined) {
    classNames.push(`group-${node.group}`);
  }

  return classNames.join(" ");
}

function getDijkstraEdgeClassName(
  edge: DijkstraEdgeRenderState,
  isFinalPath: boolean
): string {
  const status = isFinalPath ? "final-path" : edge.status;
  const classNames = ["graph-edge", "dijkstra-edge", `is-${status}`];

  if (edge.directed) {
    classNames.push("is-directed");
  }

  if (edge.weight !== undefined) {
    classNames.push("is-weighted");
  }

  return classNames.join(" ");
}

function getDijkstraNodeAriaLabel(
  node: DijkstraNodeRenderState,
  finalPathNodeIds: string[]
): string {
  const status = finalPathNodeIds.includes(node.id) ? "final-path" : node.status;

  return `${node.label} ${nodeStatusLabels[status]} 노드, 거리 ${node.distanceLabel}`;
}

function getDijkstraNodeNote(
  node: DijkstraNodeRenderState,
  finalPathNodeIds: string[]
): string {
  if (finalPathNodeIds.includes(node.id)) {
    return "경로";
  }

  if (node.role === "start") {
    return "시작";
  }

  return nodeStatusLabels[node.status];
}

import { type CSSProperties, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import {
  GRAPH_STRUCTURE_KINDS,
  generateGraphStructureTrace,
  getGraphStructureDescription,
  getGraphStructureInputSummary,
  getGraphStructureTitle
} from "../algorithms/graphStructures";
import { graphStructuresCodeExample } from "../code/graphStructuresExample";
import type {
  GraphEdgeState,
  GraphKind,
  GraphNodeGroup,
  GraphNodeState,
  GraphTraceState
} from "../types";

const pseudoCode = [
  "그래프를 빈 인접 리스트로 준비한다.",
  "노드를 그래프의 정점 집합에 추가한다.",
  "간선을 인접 관계로 추가한다.",
  "가중치 그래프는 간선 비용을 함께 저장한다.",
  "이분 그래프는 노드를 두 파티션으로 나눈다.",
  "이분 그래프 간선은 서로 다른 파티션 사이에만 둔다.",
  "완성된 그래프의 인접 리스트를 확인한다."
];

const graphConcepts = GRAPH_STRUCTURE_KINDS.map((kind) => ({
  id: kind,
  title: getGraphStructureTitle(kind),
  intro: getGraphStructureDescription(kind),
  inputSummary: getGraphStructureInputSummary(kind),
  trace: generateGraphStructureTrace(kind)
}));

const kindLabels: Record<GraphKind, string> = {
  undirected: "무방향",
  directed: "방향",
  weighted: "가중치",
  dag: "DAG",
  bipartite: "이분"
};

const groupLabels: Partial<Record<GraphNodeGroup, string>> = {
  left: "왼쪽 파티션",
  right: "오른쪽 파티션",
  source: "시작",
  sink: "끝"
};

export function GraphPage() {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const activeConcept = graphConcepts[activeConceptIndex];
  const trace = activeConcept.trace;
  const controller = useStepController(trace.length, 900);
  const currentIndex = Math.min(controller.currentIndex, trace.length - 1);
  const currentStep = trace[currentIndex];
  const activeLines =
    currentStep.codeLineHighlights?.[graphStructuresCodeExample.language] ?? [];
  const progressPercent =
    trace.length <= 1
      ? 100
      : (currentIndex / (trace.length - 1)) * 100;

  function selectConcept(index: number) {
    setActiveConceptIndex(index);
    controller.reset();
  }

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="graph-title">
        <p className="eyebrow">그래프 자료구조</p>
        <h1 id="graph-title">{activeConcept.title}</h1>
        <p className="intro-copy">{activeConcept.intro}</p>
        <div
          className="algorithm-tabs"
          role="tablist"
          aria-label="그래프 구조 선택"
        >
          {graphConcepts.map((concept, index) => (
            <button
              aria-selected={activeConceptIndex === index}
              className="algorithm-tab"
              key={concept.id}
              onClick={() => selectConcept(index)}
              role="tab"
              type="button"
            >
              {concept.title}
            </button>
          ))}
        </div>
        <p className="input-summary">{activeConcept.inputSummary}</p>
      </section>

      <section className="graph-workbench" aria-label="그래프 실습 작업 영역">
        <section className="graph-stage-panel" aria-label="그래프 도표">
          <div className="stage-header">
            <div>
              <p className="eyebrow">
                {kindLabels[currentStep.state.kind]} · {currentStep.state.motion}
              </p>
              <h2>스테이지: {currentStep.title}</h2>
            </div>
            <span className="stage-counter">
              {currentIndex + 1} / {trace.length}
            </span>
          </div>

          <GraphDiagram state={currentStep.state} />

          <div className="stage-state-list" aria-label="현재 그래프 단계 요약">
            {(currentStep.state.summaryItems ?? []).map((item) => (
              <div className="stage-state-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="stage-legend" aria-label="그래프 상태 범례">
            <span className="legend-title">상태 범례</span>
            <span className="legend-item">
              <span className="legend-swatch is-current" />
              현재
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-comparing" />
              활성 간선
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-range" />
              방향/가중치
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-updated" />
              파티션
            </span>
          </div>

          <div className="timeline-controls" aria-label="그래프 단계 재생 컨트롤">
            <div className="timeline-row">
              <button
                type="button"
                onClick={controller.goPrevious}
                disabled={controller.isFirstStep}
              >
                이전
              </button>
              <button
                className="primary-control"
                type="button"
                onClick={controller.togglePlay}
                disabled={controller.isLastStep}
              >
                {controller.isPlaying ? "정지" : "자동 재생"}
              </button>
              <button
                aria-label="그래프 다음 단계"
                disabled={controller.isLastStep}
                onClick={controller.goNext}
                type="button"
              >
                다음
              </button>
            </div>

            <label className="timeline-slider-label" htmlFor="graph-step-slider">
              <span>수동 단계 이동</span>
              <input
                id="graph-step-slider"
                type="range"
                min="0"
                max={trace.length - 1}
                value={currentIndex}
                onChange={(event) =>
                  controller.goToStep(Number(event.currentTarget.value))
                }
                aria-label="그래프 단계 슬라이더"
                style={{ "--progress": `${progressPercent}%` } as CSSProperties}
              />
            </label>
          </div>
        </section>

        <aside className="graph-side-panel" aria-label="현재 그래프 단계 설명">
          <section className="step-panel">
            <h2>현재 단계</h2>
            <p className="step-count">
              {currentIndex + 1} / {trace.length}
            </p>
            <h3>{currentStep.title}</h3>
            <p>{currentStep.description}</p>
          </section>

          <section className="adjacency-panel" aria-label="인접 리스트">
            <h2>인접 리스트</h2>
            <div className="adjacency-list">
              {currentStep.state.adjacencyRows.map((row) => (
                <div
                  className={
                    currentStep.state.activeNodeIds?.includes(row.nodeId)
                      ? "adjacency-row is-active"
                      : "adjacency-row"
                  }
                  key={row.nodeId}
                >
                  <span>{row.label}</span>
                  <strong>{row.neighbors}</strong>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="step-pseudo-layout" aria-label="그래프 의사 코드와 코드">
        <div className="pseudo-panel">
          <h2>그래프 구성 순서</h2>
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

        <section className="code-example-section" aria-label="그래프 코드">
          <div className="code-example-header">
            <div>
              <h2>코드 예제</h2>
              <p>그래프 유형에 따라 노드, 간선, 가중치, 파티션 코드가 강조됩니다.</p>
            </div>
            <span className="code-file-name">
              {graphStructuresCodeExample.fileName}
            </span>
          </div>

          <div className="code-panel" role="tabpanel">
            <ol className="code-lines">
              {graphStructuresCodeExample.code.split("\n").map((line, index) => {
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
                    key={`${lineNumber}-${line}`}
                  >
                    <span className="code-line-number">{lineNumber}</span>
                    <code className="code-line-text">{line}</code>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </section>
    </main>
  );
}

function GraphDiagram({ state }: { state: GraphTraceState }) {
  return (
    <div className="graph-visual-scroll">
      <svg
        aria-label={`${getGraphStructureTitle(state.kind)} 상태`}
        className={`graph-visual motion-${state.motion}`}
        role="img"
        viewBox={`0 0 ${state.viewport.width} ${state.viewport.height}`}
      >
        <defs>
          <GraphArrowMarker
            color="#2f6fbb"
            id={`graph-arrow-${state.kind}-directed`}
          />
          <GraphArrowMarker
            color="#6f5bb8"
            id={`graph-arrow-${state.kind}-weighted`}
          />
          <GraphArrowMarker
            color="#c94f37"
            id={`graph-arrow-${state.kind}-active`}
          />
        </defs>
        <g className="graph-edges">
          {state.edges.map((edge) => (
            <GraphEdge edge={edge} key={edge.id} state={state} />
          ))}
        </g>
        <g className="graph-nodes">
          {state.nodes.map((node) => (
            <g
              aria-label={getGraphNodeAriaLabel(node)}
              className={getGraphNodeClassName(node, state)}
              key={node.id}
              transform={`translate(${node.x} ${node.y})`}
            >
              <circle r="25" />
              <text dy="6">{node.label}</text>
              {node.group !== undefined && node.group !== "neutral" ? (
                <text className="graph-node-note" dy="43">
                  {groupLabels[node.group] ?? node.group}
                </text>
              ) : null}
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

function GraphEdge({
  edge,
  state
}: {
  edge: GraphEdgeState;
  state: GraphTraceState;
}) {
  const geometry = getTrimmedEdgeGeometry(edge);
  const midX = (geometry.x1 + geometry.x2) / 2;
  const midY = (geometry.y1 + geometry.y2) / 2;

  return (
    <g className={getGraphEdgeClassName(edge, state)}>
      <line
        markerEnd={
          edge.directed ? `url(#${getGraphArrowMarkerId(edge, state)})` : undefined
        }
        x1={geometry.x1}
        y1={geometry.y1}
        x2={geometry.x2}
        y2={geometry.y2}
      />
      {edge.weight !== undefined ? (
        <g className="graph-edge-weight" transform={`translate(${midX} ${midY})`}>
          <rect height="24" rx="6" width="34" x="-17" y="-12" />
          <text dy="5">{edge.weight}</text>
        </g>
      ) : null}
    </g>
  );
}

function getTrimmedEdgeGeometry(edge: GraphEdgeState) {
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

function getGraphArrowMarkerId(
  edge: GraphEdgeState,
  state: GraphTraceState
): string {
  if (state.activeEdgeIds?.includes(edge.id)) {
    return `graph-arrow-${state.kind}-active`;
  }

  if (edge.weight !== undefined) {
    return `graph-arrow-${state.kind}-weighted`;
  }

  return `graph-arrow-${state.kind}-directed`;
}

function getGraphNodeClassName(
  node: GraphNodeState,
  state: GraphTraceState
): string {
  const classNames = ["graph-node"];

  if (state.activeNodeIds?.includes(node.id)) {
    classNames.push("is-active");
  }

  if (node.group !== undefined) {
    classNames.push(`group-${node.group}`);
  }

  if (state.highlightedGroup === node.group) {
    classNames.push("is-highlighted-group");
  }

  return classNames.join(" ");
}

function getGraphEdgeClassName(
  edge: GraphEdgeState,
  state: GraphTraceState
): string {
  const classNames = ["graph-edge"];

  if (edge.directed) {
    classNames.push("is-directed");
  }

  if (edge.weight !== undefined) {
    classNames.push("is-weighted");
  }

  if (state.activeEdgeIds?.includes(edge.id)) {
    classNames.push("is-active");
  }

  return classNames.join(" ");
}

function getGraphNodeAriaLabel(node: GraphNodeState): string {
  const groupLabel = node.group === undefined ? undefined : groupLabels[node.group];

  return groupLabel === undefined
    ? `${node.label} 노드`
    : `${node.label} ${groupLabel} 노드`;
}

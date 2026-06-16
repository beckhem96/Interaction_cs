import { type CSSProperties, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import {
  GRAPH_TRAVERSAL_MODES,
  generateGraphTraversalTrace,
  getGraphTraversalDescription,
  getGraphTraversalInputSummary,
  getGraphTraversalTitle
} from "../algorithms/graphTraversal";
import { graphTraversalCodeExamples } from "../code/graphTraversalExample";
import { tokenizeCodeLine } from "../../sorting/code/syntaxHighlight";
import type { SortingCodeExample } from "../../sorting/code/types";
import type {
  GraphEdgeState,
  GraphNodeState,
  GraphTraversalMode,
  GraphTraversalState
} from "../types";

const pseudoCode = [
  "시작 노드를 대기 목록에 넣고 발견 처리한다.",
  "대기 목록에서 다음 노드를 꺼낸다.",
  "꺼낸 노드를 방문 순서에 추가한다.",
  "현재 노드의 인접 노드를 확인한다.",
  "처음 발견한 이웃을 대기 목록에 넣는다.",
  "대기 목록이 빌 때까지 반복한다.",
  "방문 순서를 반환한다."
];

const traversalConcepts = GRAPH_TRAVERSAL_MODES.map((mode) => ({
  id: mode,
  title: getGraphTraversalTitle(mode),
  intro: getGraphTraversalDescription(mode),
  inputSummary: getGraphTraversalInputSummary(),
  trace: generateGraphTraversalTrace(mode)
}));

const modeLabels: Record<GraphTraversalMode, string> = {
  bfs: "BFS",
  dfs: "DFS"
};

export function GraphTraversalPage() {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const activeConcept = traversalConcepts[activeConceptIndex];
  const activeCodeExample = graphTraversalCodeExamples[activeCodeIndex];
  const trace = activeConcept.trace;
  const controller = useStepController(trace.length, 850);
  const currentIndex = Math.min(controller.currentIndex, trace.length - 1);
  const currentStep = trace[currentIndex];
  const activeLines =
    currentStep.codeLineHighlights?.[activeCodeExample.language] ?? [];
  const progressPercent =
    trace.length <= 1
      ? 100
      : (currentIndex / (trace.length - 1)) * 100;

  function selectConcept(index: number) {
    setActiveConceptIndex(index);
    setActiveCodeIndex(0);
    controller.reset();
  }

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="graph-traversal-title">
        <p className="eyebrow">그래프 알고리즘</p>
        <h1 id="graph-traversal-title">{activeConcept.title}</h1>
        <p className="intro-copy">{activeConcept.intro}</p>
        <div
          className="algorithm-tabs"
          role="tablist"
          aria-label="그래프 탐색 알고리즘 선택"
        >
          {traversalConcepts.map((concept, index) => (
            <button
              aria-selected={activeConceptIndex === index}
              className="algorithm-tab"
              key={concept.id}
              onClick={() => selectConcept(index)}
              role="tab"
              type="button"
            >
              {modeLabels[concept.id]}
            </button>
          ))}
        </div>
        <p className="input-summary">{activeConcept.inputSummary}</p>
      </section>

      <section className="graph-workbench" aria-label="그래프 탐색 작업 영역">
        <section className="graph-stage-panel" aria-label="그래프 탐색 도표">
          <div className="stage-header">
            <div>
              <p className="eyebrow">
                {modeLabels[currentStep.state.mode]} · {currentStep.state.motion}
              </p>
              <h2>스테이지: {currentStep.title}</h2>
            </div>
            <span className="stage-counter">
              {currentIndex + 1} / {trace.length}
            </span>
          </div>

          <GraphTraversalDiagram state={currentStep.state} />

          <div className="stage-state-list" aria-label="현재 탐색 단계 요약">
            {(currentStep.state.summaryItems ?? []).map((item) => (
              <div className="stage-state-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="stage-legend" aria-label="그래프 탐색 상태 범례">
            <span className="legend-title">상태 범례</span>
            <span className="legend-item">
              <span className="legend-swatch is-current" />
              현재
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-updated" />
              방문 완료
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-range" />
              대기
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-comparing" />
              확인 간선
            </span>
          </div>

          <div className="timeline-controls" aria-label="그래프 탐색 단계 재생 컨트롤">
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
                aria-label="그래프 탐색 다음 단계"
                disabled={controller.isLastStep}
                onClick={controller.goNext}
                type="button"
              >
                다음
              </button>
            </div>

            <label
              className="timeline-slider-label"
              htmlFor="graph-traversal-step-slider"
            >
              <span>수동 단계 이동</span>
              <input
                id="graph-traversal-step-slider"
                type="range"
                min="0"
                max={trace.length - 1}
                value={currentIndex}
                onChange={(event) =>
                  controller.goToStep(Number(event.currentTarget.value))
                }
                aria-label="그래프 탐색 단계 슬라이더"
                style={{ "--progress": `${progressPercent}%` } as CSSProperties}
              />
            </label>
          </div>
        </section>

        <GraphTraversalCodePanel
          activeCodeExample={activeCodeExample}
          activeCodeIndex={activeCodeIndex}
          activeLines={activeLines}
          codeExamples={graphTraversalCodeExamples}
          onSelectCode={setActiveCodeIndex}
        />

        <aside className="graph-side-panel" aria-label="현재 그래프 탐색 단계 설명">
          <section className="step-panel">
            <h2>현재 단계</h2>
            <p className="step-count">
              {currentIndex + 1} / {trace.length}
            </p>
            <h3>{currentStep.title}</h3>
            <p>{currentStep.description}</p>
          </section>

          <section className="traversal-frontier-panel" aria-label="탐색 대기 상태">
            <h2>{currentStep.state.frontierLabel}</h2>
            <div className="traversal-chip-list">
              {currentStep.state.frontierItems.length ? (
                currentStep.state.frontierItems.map((nodeId) => (
                  <span className="traversal-chip is-frontier" key={nodeId}>
                    {nodeId}
                  </span>
                ))
              ) : (
                <span className="traversal-empty">비어 있음</span>
              )}
            </div>
            <p className="traversal-order-text">
              방문 순서:{" "}
              {currentStep.state.visitedOrder.length
                ? currentStep.state.visitedOrder.join(" → ")
                : "-"}
            </p>
          </section>

          <section className="adjacency-panel" aria-label="탐색 인접 리스트">
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

      <section className="step-pseudo-layout" aria-label="그래프 탐색 의사 코드와 코드">
        <div className="pseudo-panel">
          <h2>탐색 절차</h2>
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

type GraphTraversalCodePanelProps = {
  activeCodeExample: SortingCodeExample;
  activeCodeIndex: number;
  activeLines: number[];
  codeExamples: SortingCodeExample[];
  onSelectCode: (index: number) => void;
};

function GraphTraversalCodePanel({
  activeCodeExample,
  activeCodeIndex,
  activeLines,
  codeExamples,
  onSelectCode
}: GraphTraversalCodePanelProps) {
  return (
    <section className="code-example-section" aria-label="그래프 탐색 코드">
      <div className="code-example-header">
        <div>
          <h2>코드 예제</h2>
          <p>대기 목록에서 꺼내고, 이웃을 발견하고, 방문 순서를 반환하는 줄을 강조합니다.</p>
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

function GraphTraversalDiagram({ state }: { state: GraphTraversalState }) {
  return (
    <div className="graph-visual-scroll">
      <svg
        aria-label={`${modeLabels[state.mode]} 탐색 상태`}
        className={`graph-visual motion-${state.motion}`}
        role="img"
        viewBox={`0 0 ${state.viewport.width} ${state.viewport.height}`}
      >
        <g className="graph-edges">
          {state.edges.map((edge) => (
            <GraphTraversalEdge edge={edge} key={edge.id} state={state} />
          ))}
        </g>
        <g className="graph-nodes">
          {state.nodes.map((node) => (
            <g
              aria-label={getGraphTraversalNodeAriaLabel(node, state)}
              className={getGraphTraversalNodeClassName(node, state)}
              key={node.id}
              transform={`translate(${node.x} ${node.y})`}
            >
              <circle r="25" />
              <text dy="6">{node.label}</text>
              <text className="graph-node-note" dy="43">
                {getGraphTraversalNodeNote(node, state)}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function GraphTraversalEdge({
  edge,
  state
}: {
  edge: GraphEdgeState;
  state: GraphTraversalState;
}) {
  const geometry = getTrimmedEdgeGeometry(edge);

  return (
    <g className={getGraphTraversalEdgeClassName(edge, state)}>
      <line
        x1={geometry.x1}
        y1={geometry.y1}
        x2={geometry.x2}
        y2={geometry.y2}
      />
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

function getGraphTraversalNodeClassName(
  node: GraphNodeState,
  state: GraphTraversalState
): string {
  const classNames = ["graph-node"];

  if (state.visitedNodeIds.includes(node.id)) {
    classNames.push("is-visited");
  } else if (state.frontierItems.includes(node.id)) {
    classNames.push("is-frontier");
  } else if (state.discoveredNodeIds.includes(node.id)) {
    classNames.push("is-discovered");
  }

  if (state.skippedNodeIds?.includes(node.id)) {
    classNames.push("is-skipped");
  }

  if (state.currentNodeId === node.id || state.activeNodeIds?.includes(node.id)) {
    classNames.push("is-active");
  }

  return classNames.join(" ");
}

function getGraphTraversalEdgeClassName(
  edge: GraphEdgeState,
  state: GraphTraversalState
): string {
  const classNames = ["graph-edge"];

  if (state.treeEdgeIds.includes(edge.id)) {
    classNames.push("is-tree-edge");
  }

  if (state.activeEdgeIds?.includes(edge.id)) {
    classNames.push("is-active");
  }

  return classNames.join(" ");
}

function getGraphTraversalNodeAriaLabel(
  node: GraphNodeState,
  state: GraphTraversalState
): string {
  const orderIndex = state.visitedOrder.indexOf(node.id);

  if (state.currentNodeId === node.id) {
    return `${node.label} 현재 노드`;
  }

  if (orderIndex >= 0) {
    return `${node.label} ${orderIndex + 1}번째 방문 노드`;
  }

  if (state.frontierItems.includes(node.id)) {
    return `${node.label} 대기 노드`;
  }

  return `${node.label} 노드`;
}

function getGraphTraversalNodeNote(
  node: GraphNodeState,
  state: GraphTraversalState
): string {
  const orderIndex = state.visitedOrder.indexOf(node.id);

  if (orderIndex >= 0) {
    return `#${orderIndex + 1}`;
  }

  if (state.frontierItems.includes(node.id)) {
    return "대기";
  }

  return "";
}

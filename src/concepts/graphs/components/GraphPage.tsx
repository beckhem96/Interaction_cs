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
import { graphStructureCodeExamples } from "../code/graphStructuresExample";
import { tokenizeCodeLine } from "../../sorting/code/syntaxHighlight";
import type { SortingCodeExample } from "../../sorting/code/types";
import type {
  GraphEdgeState,
  GraphKind,
  GraphNodeGroup,
  GraphNodeState,
  GraphTraceState
} from "../types";
import { InteractiveGraphCanvas } from "./InteractiveGraphCanvas";

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
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const activeConcept = graphConcepts[activeConceptIndex];
  const activeCodeExample = graphStructureCodeExamples[activeCodeIndex];
  const trace = activeConcept.trace;
  const controller = useStepController(trace.length, 900);
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

        <GraphCodePanel
          activeCodeExample={activeCodeExample}
          activeCodeIndex={activeCodeIndex}
          activeLines={activeLines}
          codeExamples={graphStructureCodeExamples}
          description="그래프 유형에 따라 노드, 간선, 가중치, 파티션 코드가 강조됩니다."
          onSelectCode={setActiveCodeIndex}
          title="그래프 코드"
        />

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

      </section>
    </main>
  );
}

type GraphCodePanelProps = {
  activeCodeExample: SortingCodeExample;
  activeCodeIndex: number;
  activeLines: number[];
  codeExamples: SortingCodeExample[];
  description: string;
  onSelectCode: (index: number) => void;
  title: string;
};

function GraphCodePanel({
  activeCodeExample,
  activeCodeIndex,
  activeLines,
  codeExamples,
  description,
  onSelectCode,
  title
}: GraphCodePanelProps) {
  return (
    <section className="code-example-section" aria-label={title}>
      <div className="code-example-header">
        <div>
          <h2>코드 예제</h2>
          <p>{description}</p>
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

function GraphDiagram({ state }: { state: GraphTraceState }) {
  const nodes = state.nodes.map((node) => ({
    id: node.id,
    label: node.label,
    note:
      node.group !== undefined && node.group !== "neutral"
        ? groupLabels[node.group] ?? node.group
        : undefined,
    className: getGraphNodeClassName(node, state),
    ariaLabel: getGraphNodeAriaLabel(node),
    x: node.x,
    y: node.y
  }));
  const edges = state.edges.map((edge) => {
    const isActive = state.activeEdgeIds?.includes(edge.id) ?? false;
    const color = isActive
      ? "#c94f37"
      : edge.weight !== undefined
        ? "#6f5bb8"
        : edge.directed
          ? "#2f6fbb"
          : "#9aa9b1";

    return {
      id: edge.id,
      source: edge.fromId,
      target: edge.toId,
      label: edge.weight,
      labelClassName: "graph-edge-weight",
      className: getGraphEdgeClassName(edge, state),
      ariaLabel: `${edge.fromId}에서 ${edge.toId}로 연결된${
        edge.weight === undefined ? "" : ` 가중치 ${edge.weight}`
      } 간선`,
      directed: edge.directed,
      color,
      labelBorderColor: color,
      strokeWidth: isActive ? 5 : 3,
      animated: isActive
    };
  });

  return (
    <InteractiveGraphCanvas
      ariaLabel={`${getGraphStructureTitle(state.kind)} 상태`}
      className={`motion-${state.motion}`}
      layoutAlgorithm={state.kind === "dag" || state.kind === "bipartite" ? "layered" : "stress"}
      nodes={nodes}
      edges={edges}
    />
  );
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

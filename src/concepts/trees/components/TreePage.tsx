import { type CSSProperties } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import {
  BST_DEFAULT_VALUES,
  BST_SEARCH_TARGET,
  generateBinarySearchTreeTrace
} from "../algorithms/binarySearchTree";
import { binarySearchTreeCodeExample } from "../code/binarySearchTreeExample";
import type { TreeEdgeState, TreeNodeState, TreeTraceState } from "../types";

const trace = generateBinarySearchTreeTrace();

const pseudoCode = [
  "빈 트리에 첫 값을 루트로 넣는다.",
  "현재 노드와 삽입할 값을 비교한다.",
  "작으면 왼쪽 서브트리로 내려간다.",
  "크거나 같으면 오른쪽 서브트리로 내려간다.",
  "탐색할 값을 현재 노드와 비교한다.",
  "값이 같으면 탐색을 종료한다.",
  "중위 순회를 시작한다.",
  "왼쪽, 현재, 오른쪽 순서로 방문한다.",
  "방문 결과가 오름차순인지 확인한다."
];

const operationLabels = {
  insert: "삽입",
  search: "탐색",
  traversal: "순회"
} as const;

export function TreePage() {
  const controller = useStepController(trace.length, 900);
  const currentIndex = Math.min(controller.currentIndex, trace.length - 1);
  const currentStep = trace[currentIndex];
  const progressPercent =
    trace.length <= 1
      ? 100
      : (currentIndex / (trace.length - 1)) * 100;

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="tree-title">
        <p className="eyebrow">트리 자료구조</p>
        <h1 id="tree-title">BST 삽입과 탐색</h1>
        <p className="intro-copy">
          이진 탐색 트리가 값을 비교하며 내려가고, 새 노드를 붙이고, 탐색 경로와
          중위 순회 결과를 만드는 과정을 단계별로 확인합니다.
        </p>
        <p className="input-summary">
          삽입 값: [{BST_DEFAULT_VALUES.join(", ")}] · 탐색 값: {BST_SEARCH_TARGET}
        </p>
      </section>

      <section className="tree-workbench" aria-label="트리 실습 작업 영역">
        <section className="visualization-layout" aria-label="BST 도표">
          <div className="visualization-panel cinematic-panel tree-stage-panel">
            <div className="stage-header">
              <div>
                <p className="eyebrow">
                  {operationLabels[currentStep.state.operation]} 단계
                </p>
                <h2>스테이지: {currentStep.title}</h2>
              </div>
              <span className="stage-counter">
                {currentIndex + 1} / {trace.length}
              </span>
            </div>

            <TreeDiagram state={currentStep.state} />

            <div className="stage-state-list" aria-label="현재 트리 단계 요약">
              {(currentStep.state.summaryItems ?? []).map((item) => (
                <div className="stage-state-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="stage-legend" aria-label="트리 상태 범례">
              <span className="legend-title">상태 범례</span>
              <span className="legend-item">
                <span className="legend-swatch is-current" />
                현재
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-comparing" />
                비교
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-write" />
                삽입
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-sorted" />
                방문
              </span>
            </div>

            <div className="timeline-controls" aria-label="트리 단계 재생 컨트롤">
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
                  aria-label="트리 다음 단계"
                  disabled={controller.isLastStep}
                  onClick={controller.goNext}
                  type="button"
                >
                  다음
                </button>
              </div>

              <label className="timeline-slider-label" htmlFor="tree-step-slider">
                <span>수동 단계 이동</span>
                <input
                  id="tree-step-slider"
                  type="range"
                  min="0"
                  max={trace.length - 1}
                  value={currentIndex}
                  onChange={(event) =>
                    controller.goToStep(Number(event.currentTarget.value))
                  }
                  aria-label="트리 단계 슬라이더"
                  style={{ "--progress": `${progressPercent}%` } as CSSProperties}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="code-example-section" aria-label="BST 코드">
          <div className="code-example-header">
            <div>
              <h2>코드 예제</h2>
              <p>단계가 바뀌면 비교, 재귀 이동, 방문 코드가 함께 강조됩니다.</p>
            </div>
            <span className="code-file-name">{binarySearchTreeCodeExample.fileName}</span>
          </div>

          <div className="code-panel" role="tabpanel">
            <ol className="code-lines">
              {binarySearchTreeCodeExample.code.split("\n").map((line, index) => {
                const lineNumber = index + 1;
                const activeLines =
                  currentStep.codeLineHighlights?.[
                    binarySearchTreeCodeExample.language
                  ] ?? [];
                const isActive = activeLines.includes(lineNumber);

                return (
                  <li
                    aria-label={
                      isActive
                        ? `현재 코드 ${lineNumber}: ${line.trim()}`
                        : `코드 ${lineNumber}: ${line.trim()}`
                    }
                    className={isActive ? "code-line is-active" : "code-line"}
                    key={lineNumber}
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

      <section className="step-pseudo-layout" aria-label="트리 의사 코드와 요약">
        <div className="pseudo-panel">
          <h2>트리 처리 순서</h2>
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

        <aside className="step-panel" aria-label="현재 트리 단계 설명">
          <h2>현재 단계</h2>
          <p className="step-count">
            {currentIndex + 1} / {trace.length}
          </p>
          <h3>{currentStep.title}</h3>
          <p>{currentStep.description}</p>
          {currentStep.state.traversalValues?.length ? (
            <p className="tree-traversal-output">
              순회 결과: {currentStep.state.traversalValues.join(" → ")}
            </p>
          ) : null}

          <div className="step-controls" aria-label="트리 단계 컨트롤">
            <button
              type="button"
              onClick={controller.goPrevious}
              disabled={controller.isFirstStep}
            >
              이전
            </button>
            <button
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
              {controller.isPlaying ? "정지" : "재생"}
            </button>
            <button type="button" onClick={controller.reset}>
              초기화
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

type TreeDiagramProps = {
  state: TreeTraceState;
};

function TreeDiagram({ state }: TreeDiagramProps) {
  return (
    <div className="tree-visual-scroll">
      <svg
        aria-label="BST 트리 상태"
        className={`tree-visual motion-${state.motion}`}
        role="img"
        viewBox={`0 0 ${state.viewport.width} ${state.viewport.height}`}
      >
        <g className="tree-edges">
          {state.edges.map((edge) => (
            <line
              className={getEdgeClassName(edge, state)}
              key={edge.id}
              x1={edge.fromX}
              y1={edge.fromY}
              x2={edge.toX}
              y2={edge.toY}
            />
          ))}
        </g>
        <g className="tree-nodes">
          {state.nodes.map((node) => (
            <g
              aria-label={`${node.value} 노드`}
              className={getNodeClassName(node, state)}
              key={node.id}
              transform={`translate(${node.x} ${node.y})`}
            >
              <circle r="23" />
              <text dy="6">{node.value}</text>
            </g>
          ))}
        </g>
        {state.nodes.length === 0 ? (
          <text className="tree-empty-label" x="50%" y="50%">
            빈 트리
          </text>
        ) : null}
      </svg>
    </div>
  );
}

function getNodeClassName(node: TreeNodeState, state: TreeTraceState): string {
  const classNames = ["tree-node"];

  if (node.depth === 0) {
    classNames.push("is-root");
  }

  if (state.pathNodeIds?.includes(node.id)) {
    classNames.push("is-path");
  }

  if (state.visitedNodeIds?.includes(node.id)) {
    classNames.push("is-visited");
  }

  if (state.activeNodeId === node.id) {
    classNames.push("is-active");
  }

  if (state.comparedNodeId === node.id) {
    classNames.push("is-compared");
  }

  if (state.insertedNodeId === node.id) {
    classNames.push("is-inserted");
  }

  if (state.foundNodeId === node.id) {
    classNames.push("is-found");
  }

  return classNames.join(" ");
}

function getEdgeClassName(edge: TreeEdgeState, state: TreeTraceState): string {
  const classNames = ["tree-edge"];
  const path = state.pathNodeIds ?? [];

  if (path.includes(edge.fromId) && path.includes(edge.toId)) {
    classNames.push("is-path");
  }

  return classNames.join(" ");
}

import { type CSSProperties, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import { tokenizeCodeLine } from "../../sorting/code/syntaxHighlight";
import type { SortingCodeExample } from "../../sorting/code/types";
import {
  generateStronglyConnectedComponentsTrace,
  getSccDescription,
  getSccInputSummary
} from "../algorithms/stronglyConnectedComponents";
import { stronglyConnectedComponentsCodeExamples } from "../code/stronglyConnectedComponentsExamples";
import type {
  SccEdgeRenderState,
  SccEdgeStatus,
  SccGroup,
  SccNodeRenderState,
  SccNodeStatus,
  SccTraceState
} from "../types";
import { InteractiveGraphCanvas } from "./InteractiveGraphCanvas";

const pseudoCode = [
  "모든 노드를 미방문으로 두고 finish stack을 비운다.",
  "아직 방문하지 않은 노드에서 첫 번째 DFS를 시작한다.",
  "outgoing edge를 따라가고, 모두 확인한 노드를 finish stack에 push한다.",
  "그래프의 모든 방향 간선을 뒤집는다.",
  "finish stack의 top에서 노드를 하나 꺼낸다.",
  "뒤집힌 그래프에서 DFS로 도달한 노드를 현재 SCC에 모은다.",
  "더 도달할 노드가 없으면 현재 SCC를 확정한다.",
  "SCC를 하나의 노드로 압축하고 컴포넌트 사이 간선만 남긴다."
];

const trace = generateStronglyConnectedComponentsTrace("kosaraju-basic");
const intro = getSccDescription("kosaraju-basic");
const inputSummary = getSccInputSummary("kosaraju-basic");

const phaseLabels: Record<SccTraceState["phase"], string> = {
  "original-dfs": "첫 DFS",
  "reverse-graph": "간선 뒤집기",
  "reversed-dfs": "두 번째 DFS",
  condensation: "압축 그래프",
  complete: "완료"
};

const motionLabels: Record<SccTraceState["motion"], string> = {
  initialize: "초기화",
  "start-dfs": "DFS 시작",
  "visit-node": "노드 방문",
  "inspect-edge": "간선 확인",
  "skip-edge": "건너뜀",
  "finish-node": "종료 push",
  "reverse-edges": "간선 반전",
  "pop-stack": "스택 pop",
  "add-to-component": "SCC 후보 추가",
  "finalize-component": "SCC 확정",
  "build-condensation": "압축",
  complete: "완료"
};

const nodeStatusLabels: Record<SccNodeStatus, string> = {
  unvisited: "미방문",
  "first-active": "첫 DFS 현재",
  "first-finished": "종료됨",
  "stack-top": "스택 top",
  "second-active": "두 번째 DFS 현재",
  "current-component": "현재 SCC",
  finalized: "확정 SCC",
  singleton: "단일 SCC"
};

const edgeStatusLabels: Record<SccEdgeStatus, string> = {
  normal: "원래 방향",
  "active-original": "첫 DFS 확인",
  "skipped-original": "이미 방문",
  reversed: "뒤집힌 방향",
  "active-reversed": "두 번째 DFS 확인",
  internal: "SCC 내부",
  condensation: "컴포넌트 간선"
};

const speedOptions = [
  { label: "느리게", value: 1100 },
  { label: "보통", value: 750 },
  { label: "빠르게", value: 450 }
];

export function StronglyConnectedComponentsPage() {
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const [playDelayMs, setPlayDelayMs] = useState(speedOptions[1].value);
  const activeCodeExample = stronglyConnectedComponentsCodeExamples[activeCodeIndex];
  const controller = useStepController(trace.length, playDelayMs);
  const currentIndex = Math.min(controller.currentIndex, trace.length - 1);
  const currentStep = trace[currentIndex];
  const activeLines =
    currentStep.codeLineHighlights?.[activeCodeExample.language] ?? [];
  const progressPercent =
    trace.length <= 1 ? 100 : (currentIndex / (trace.length - 1)) * 100;

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="scc-title">
        <p className="eyebrow">그래프 알고리즘</p>
        <h1 id="scc-title">강한 연결 요소: SCC</h1>
        <p className="intro-copy">{intro}</p>
        <p className="input-summary">{inputSummary}</p>
      </section>

      <section className="graph-workbench scc-workbench" aria-label="SCC 작업 영역">
        <section className="graph-stage-panel scc-stage-panel" aria-label="SCC 그래프 도표">
          <div className="stage-header">
            <div>
              <p className="eyebrow">
                Kosaraju · {phaseLabels[currentStep.state.phase]} ·{" "}
                {motionLabels[currentStep.state.motion]}
              </p>
              <h2>스테이지: {currentStep.title}</h2>
            </div>
            <span className="stage-counter">
              {currentIndex + 1} / {trace.length}
            </span>
          </div>

          <SccDiagram state={currentStep.state} />

          <div className="stage-state-list" aria-label="현재 SCC 단계 요약">
            {(currentStep.state.summaryItems ?? []).map((item) => (
              <div className="stage-state-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <SccStackPanel state={currentStep.state} />

          <div className="stage-legend" aria-label="SCC 상태 범례">
            <span className="legend-title">상태 범례</span>
            <span className="legend-item">
              <span className="legend-swatch is-current" />
              현재 DFS
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-range" />
              finish stack
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-updated" />
              현재 SCC
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-comparing" />
              컴포넌트 간선
            </span>
          </div>

          <div className="timeline-controls" aria-label="SCC 단계 재생 컨트롤">
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
              <label className="speed-control">
                <span>재생 속도</span>
                <select
                  aria-label="재생 속도"
                  value={playDelayMs}
                  onChange={(event) => setPlayDelayMs(Number(event.currentTarget.value))}
                >
                  {speedOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="timeline-slider-label" htmlFor="scc-step-slider">
              <span>수동 단계 이동</span>
              <input
                id="scc-step-slider"
                type="range"
                min="0"
                max={trace.length - 1}
                value={currentIndex}
                onChange={(event) =>
                  controller.goToStep(Number(event.currentTarget.value))
                }
                aria-label="SCC 단계 슬라이더"
                style={{ "--progress": `${progressPercent}%` } as CSSProperties}
              />
            </label>
          </div>
        </section>

        <SccCodePanel
          activeCodeExample={activeCodeExample}
          activeCodeIndex={activeCodeIndex}
          activeLines={activeLines}
          codeExamples={stronglyConnectedComponentsCodeExamples}
          onSelectCode={setActiveCodeIndex}
        />

        <aside className="graph-side-panel scc-side-panel" aria-label="현재 SCC 단계 설명">
          <section className="step-panel">
            <h2>현재 단계</h2>
            <p className="step-count">
              {currentIndex + 1} / {trace.length}
            </p>
            <h3>{currentStep.title}</h3>
            <p>{currentStep.description}</p>
          </section>

          <SccComponentPanel state={currentStep.state} />
          <SccCondensationPanel state={currentStep.state} />
        </aside>
      </section>

      <section className="step-pseudo-layout" aria-label="SCC 의사 코드">
        <div className="pseudo-panel">
          <h2>Kosaraju SCC 절차</h2>
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

function SccDiagram({ state }: { state: SccTraceState }) {
  const nodes = state.nodes.map((node) => ({
    id: node.id,
    label: node.label,
    note: nodeStatusLabels[node.status],
    className: getNodeClassName(node),
    ariaLabel: getNodeAriaLabel(node),
    x: node.x,
    y: node.y
  }));
  const edges = state.edges.map((edge) => {
    const appearance = getSccEdgeAppearance(edge.status);
    return {
      id: edge.id,
      source: edge.fromId,
      target: edge.toId,
      label: edge.label,
      labelClassName: `scc-edge-label is-${edge.status}`,
      className: getEdgeClassName(edge),
      ariaLabel: `${edge.label} ${edgeStatusLabels[edge.status]} 간선`,
      directed: true,
      color: appearance.color,
      labelBorderColor: appearance.color,
      strokeWidth: appearance.strokeWidth,
      dashed: appearance.dashed,
      animated: appearance.animated
    };
  });

  return (
    <InteractiveGraphCanvas
      ariaLabel="SCC 방향 그래프 상태"
      className={`scc-visual motion-${state.motion}`}
      layoutAlgorithm="manual"
      nodes={nodes}
      edges={edges}
    />
  );
}

function getSccEdgeAppearance(status: SccEdgeStatus) {
  switch (status) {
    case "active-original":
      return { color: "#c94f37", strokeWidth: 5, dashed: false, animated: true };
    case "skipped-original":
      return { color: "#8a6f2a", strokeWidth: 4, dashed: true, animated: false };
    case "reversed":
      return { color: "#496f91", strokeWidth: 3, dashed: true, animated: false };
    case "active-reversed":
      return { color: "#7b4b8a", strokeWidth: 5, dashed: false, animated: true };
    case "internal":
      return { color: "#8b949e", strokeWidth: 3, dashed: true, animated: false };
    case "condensation":
      return { color: "#2f855a", strokeWidth: 5, dashed: false, animated: true };
    default:
      return { color: "#73818a", strokeWidth: 3, dashed: false, animated: false };
  }
}

function SccStackPanel({ state }: { state: SccTraceState }) {
  const stackLabels = state.finishStack.items.map(
    (nodeId) => state.nodes.find((node) => node.id === nodeId)?.label ?? nodeId
  );
  const pathLabels = state.dfs.pathNodeIds.map(
    (nodeId) => state.nodes.find((node) => node.id === nodeId)?.label ?? nodeId
  );

  return (
    <section className="scc-stack-panel" aria-label="finish stack과 DFS 경로">
      <div>
        <h2>finish stack</h2>
        <p>
          top:{" "}
          <strong>
            {state.finishStack.topNodeId ??
              state.finishStack.lastPoppedNodeId ??
              "비어 있음"}
          </strong>
        </p>
        <div className="scc-stack-list">
          {stackLabels.length ? (
            stackLabels.map((label, index) => (
              <span
                className={index === stackLabels.length - 1 ? "is-top" : ""}
                key={`${label}-${index}`}
              >
                {label}
              </span>
            ))
          ) : (
            <span className="scc-empty">비어 있음</span>
          )}
        </div>
      </div>
      <div>
        <h2>DFS 경로</h2>
        <p>{state.dfs.pass === "first" ? "첫 DFS" : state.dfs.pass === "second" ? "두 번째 DFS" : "대기"}</p>
        <div className="scc-path-list">
          {pathLabels.length ? pathLabels.join(" → ") : "현재 경로 없음"}
        </div>
      </div>
    </section>
  );
}

type SccCodePanelProps = {
  activeCodeExample: SortingCodeExample;
  activeCodeIndex: number;
  activeLines: number[];
  codeExamples: SortingCodeExample[];
  onSelectCode: (index: number) => void;
};

function SccCodePanel({
  activeCodeExample,
  activeCodeIndex,
  activeLines,
  codeExamples,
  onSelectCode
}: SccCodePanelProps) {
  return (
    <section className="code-example-section" aria-label="SCC 코드">
      <div className="code-example-header">
        <div>
          <h2>코드 예제</h2>
          <p>현재 단계와 같은 DFS, stack, graph reversal, SCC 확정 줄을 강조합니다.</p>
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

function SccComponentPanel({ state }: { state: SccTraceState }) {
  return (
    <section className="scc-component-panel" aria-label="SCC 목록">
      <h2>SCC 목록</h2>
      {state.currentComponent ? (
        <SccGroupView group={state.currentComponent} title="현재 SCC 후보" />
      ) : (
        <p>두 번째 DFS가 시작되면 현재 SCC 후보가 표시됩니다.</p>
      )}
      <div className="scc-finalized-list">
        {state.finalizedComponents.length ? (
          state.finalizedComponents.map((group) => (
            <SccGroupView group={group} key={group.id} title={group.label} />
          ))
        ) : (
          <p>아직 확정된 SCC가 없습니다.</p>
        )}
      </div>
    </section>
  );
}

function SccGroupView({ group, title }: { group: SccGroup; title: string }) {
  return (
    <div className={`scc-group-card is-${group.status}`}>
      <h3>{title}</h3>
      <p>{group.nodeIds.length ? group.nodeIds.join(", ") : "비어 있음"}</p>
      <span>
        대표 시작 노드: <strong>{group.representativeNodeId}</strong>
      </span>
    </div>
  );
}

function SccCondensationPanel({ state }: { state: SccTraceState }) {
  const validation = state.validation;
  const condensationEdges = state.condensationEdges.length
    ? state.condensationEdges
    : validation?.condensationEdges ?? [];

  return (
    <section className="scc-condensation-panel" aria-label="SCC 최종 검증과 압축 그래프">
      <h2>최종 검증</h2>
      {validation ? (
        <div className="scc-validation is-valid">
          <p>{validation.summaryText}</p>
          <p>
            SCC 개수: <strong>{validation.componentCount}</strong>
          </p>
          <p>
            노드 포함:{" "}
            <strong>
              {validation.allNodesCovered ? "모든 노드 1회 포함" : "누락 있음"}
            </strong>
          </p>
          <p>
            중복 소속:{" "}
            <strong>{validation.hasDuplicateMembership ? "있음" : "없음"}</strong>
          </p>
        </div>
      ) : (
        <p>완료 단계에서 SCC 개수와 노드 포함 검증이 표시됩니다.</p>
      )}

      {condensationEdges.length ? (
        <div className="scc-condensation-edges">
          <h3>condensation DAG</h3>
          <ul>
            {condensationEdges.map((edge) => (
              <li key={edge.id}>
                <strong>
                  {edge.fromComponentId} → {edge.toComponentId}
                </strong>
                <span>근거: {edge.sourceEdgeIds.join(", ")}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>컴포넌트 사이 간선은 완료 단계에서 요약됩니다.</p>
      )}
    </section>
  );
}

function getNodeClassName(node: SccNodeRenderState): string {
  return ["graph-node", "scc-node", `is-${node.status}`].join(" ");
}

function getEdgeClassName(edge: SccEdgeRenderState): string {
  return ["graph-edge", "scc-edge", `is-${edge.status}`].join(" ");
}

function getNodeAriaLabel(node: SccNodeRenderState): string {
  return `${node.label} ${nodeStatusLabels[node.status]} 노드`;
}

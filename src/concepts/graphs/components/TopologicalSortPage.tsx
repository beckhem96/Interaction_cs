import { type CSSProperties, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import { tokenizeCodeLine } from "../../sorting/code/syntaxHighlight";
import type { SortingCodeExample } from "../../sorting/code/types";
import {
  generateTopologicalSortTrace,
  getTopologicalSortDescription,
  getTopologicalSortInputSummary
} from "../algorithms/topologicalSort";
import { topologicalSortCodeExamples } from "../code/topologicalSortExamples";
import type {
  TopologicalSortCandidateQueue,
  TopologicalSortEdgeRenderState,
  TopologicalSortEdgeStatus,
  TopologicalSortInDegreeRow,
  TopologicalSortNodeRenderState,
  TopologicalSortNodeStatus,
  TopologicalSortTraceState
} from "../types";
import { InteractiveGraphCanvas } from "./InteractiveGraphCanvas";

const pseudoCode = [
  "모든 노드의 진입 차수를 계산한다.",
  "진입 차수가 0인 노드를 후보 큐에 넣는다.",
  "후보 중 결정 규칙으로 다음 노드를 고른다.",
  "선택한 노드를 결과 순서에 추가한다.",
  "선택한 노드의 나가는 간선을 제거한다.",
  "도착 노드의 진입 차수를 줄이고 0이면 후보에 넣는다.",
  "모든 노드를 처리하면 순서를 검증하고, 후보가 없으면 순환을 알린다."
];

const trace = generateTopologicalSortTrace("dag-basic");
const intro = getTopologicalSortDescription("dag-basic");
const inputSummary = getTopologicalSortInputSummary("dag-basic");

const motionLabels: Record<TopologicalSortTraceState["motion"], string> = {
  initialize: "초기화",
  "inspect-candidates": "후보 확인",
  "select-node": "노드 선택",
  "remove-edge": "간선 제거",
  "update-indegree": "진입 차수 감소",
  "enqueue-candidate": "후보 추가",
  complete: "완료",
  "cycle-blocked": "순환 감지"
};

const nodeStatusLabels: Record<TopologicalSortNodeStatus, string> = {
  pending: "대기",
  candidate: "후보",
  selected: "선택",
  processed: "처리됨",
  opened: "새 후보",
  blocked: "막힘",
  complete: "완료"
};

const edgeStatusLabels: Record<TopologicalSortEdgeStatus, string> = {
  pending: "대기",
  active: "처리 중",
  removed: "해소됨",
  blocking: "의존성",
  "cycle-blocked": "순환 의심"
};

const rowStatusLabels: Record<TopologicalSortInDegreeRow["status"], string> = {
  waiting: "대기",
  candidate: "후보",
  selected: "선택",
  processed: "처리됨",
  opened: "새 후보",
  blocked: "막힘"
};

const speedOptions = [
  { label: "느리게", value: 1100 },
  { label: "보통", value: 750 },
  { label: "빠르게", value: 450 }
];

export function TopologicalSortPage() {
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const [playDelayMs, setPlayDelayMs] = useState(speedOptions[1].value);
  const activeCodeExample = topologicalSortCodeExamples[activeCodeIndex];
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

      <section className="learning-header" aria-labelledby="topological-title">
        <p className="eyebrow">그래프 알고리즘</p>
        <h1 id="topological-title">위상 정렬: DAG</h1>
        <p className="intro-copy">{intro}</p>
        <p className="input-summary">{inputSummary}</p>
      </section>

      <section className="graph-workbench topological-workbench" aria-label="위상 정렬 작업 영역">
        <section className="graph-stage-panel topological-stage-panel" aria-label="위상 정렬 그래프 도표">
          <div className="stage-header">
            <div>
              <p className="eyebrow">
                Kahn · {motionLabels[currentStep.state.motion]}
              </p>
              <h2>스테이지: {currentStep.title}</h2>
            </div>
            <span className="stage-counter">
              {currentIndex + 1} / {trace.length}
            </span>
          </div>

          <TopologicalDiagram state={currentStep.state} />

          <div className="stage-state-list" aria-label="현재 위상 정렬 단계 요약">
            {(currentStep.state.summaryItems ?? []).map((item) => (
              <div className="stage-state-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <TopologicalCandidatePanel queue={currentStep.state.candidateQueue} />
          <TopologicalInDegreeTable rows={currentStep.state.inDegreeRows} />

          <div className="stage-legend" aria-label="위상 정렬 상태 범례">
            <span className="legend-title">상태 범례</span>
            <span className="legend-item">
              <span className="legend-swatch is-range" />
              후보
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-current" />
              선택/처리 중
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-updated" />
              새 후보
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-comparing" />
              의존성 간선
            </span>
          </div>

          <div className="timeline-controls" aria-label="위상 정렬 단계 재생 컨트롤">
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

            <label className="timeline-slider-label" htmlFor="topological-step-slider">
              <span>수동 단계 이동</span>
              <input
                id="topological-step-slider"
                type="range"
                min="0"
                max={trace.length - 1}
                value={currentIndex}
                onChange={(event) =>
                  controller.goToStep(Number(event.currentTarget.value))
                }
                aria-label="위상 정렬 단계 슬라이더"
                style={{ "--progress": `${progressPercent}%` } as CSSProperties}
              />
            </label>
          </div>
        </section>

        <TopologicalCodePanel
          activeCodeExample={activeCodeExample}
          activeCodeIndex={activeCodeIndex}
          activeLines={activeLines}
          codeExamples={topologicalSortCodeExamples}
          onSelectCode={setActiveCodeIndex}
        />

        <aside className="graph-side-panel topological-side-panel" aria-label="현재 위상 정렬 단계 설명">
          <section className="step-panel">
            <h2>현재 단계</h2>
            <p className="step-count">
              {currentIndex + 1} / {trace.length}
            </p>
            <h3>{currentStep.title}</h3>
            <p>{currentStep.description}</p>
          </section>

          <TopologicalResultPanel state={currentStep.state} />
          <TopologicalValidationPanel state={currentStep.state} />
        </aside>
      </section>

      <section className="step-pseudo-layout" aria-label="위상 정렬 의사 코드">
        <div className="pseudo-panel">
          <h2>Kahn 위상 정렬 절차</h2>
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

function TopologicalCandidatePanel({ queue }: { queue: TopologicalSortCandidateQueue }) {
  return (
    <section className="topological-candidate-panel" aria-label="진입 차수 0 후보 큐">
      <div>
        <h2>후보 큐</h2>
        <p>{queue.tieReason}</p>
      </div>
      <div className="topological-candidate-list">
        {queue.items.length > 0 ? (
          queue.items.map((item) => (
            <div
              className={
                item.isSelected
                  ? "topological-candidate is-selected"
                  : "topological-candidate"
              }
              key={item.nodeId}
            >
              <strong>{item.label}</strong>
              <span>{item.reason}</span>
            </div>
          ))
        ) : (
          <span className="topological-empty">후보 없음</span>
        )}
      </div>
    </section>
  );
}

function TopologicalInDegreeTable({ rows }: { rows: TopologicalSortInDegreeRow[] }) {
  return (
    <div className="topological-table-scroll">
      <table className="topological-indegree-table" aria-label="진입 차수 표">
        <thead>
          <tr>
            <th>노드</th>
            <th>이전</th>
            <th>현재</th>
            <th>변화</th>
            <th>상태</th>
            <th>근거 간선</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className={`topological-row is-${row.status}`} key={row.nodeId}>
              <th scope="row">{row.label}</th>
              <td>{row.previousValue}</td>
              <td>{row.currentValue}</td>
              <td>{row.delta === 0 ? "0" : row.delta}</td>
              <td>{rowStatusLabels[row.status]}</td>
              <td>{row.sourceEdgeIds.length ? row.sourceEdgeIds.join(", ") : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type TopologicalCodePanelProps = {
  activeCodeExample: SortingCodeExample;
  activeCodeIndex: number;
  activeLines: number[];
  codeExamples: SortingCodeExample[];
  onSelectCode: (index: number) => void;
};

function TopologicalCodePanel({
  activeCodeExample,
  activeCodeIndex,
  activeLines,
  codeExamples,
  onSelectCode
}: TopologicalCodePanelProps) {
  return (
    <section className="code-example-section" aria-label="위상 정렬 코드">
      <div className="code-example-header">
        <div>
          <h2>코드 예제</h2>
          <p>현재 단계와 같은 진입 차수 계산, 큐 처리, 간선 처리 줄을 강조합니다.</p>
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

function TopologicalDiagram({ state }: { state: TopologicalSortTraceState }) {
  const nodes = state.nodes.map((node) => ({
    id: node.id,
    label: node.label,
    note: `${nodeStatusLabels[node.status]} · in ${node.inDegree}`,
    className: getNodeClassName(node),
    ariaLabel: getNodeAriaLabel(node),
    x: node.x,
    y: node.y
  }));
  const edges = state.edges.map((edge) => {
    const appearance = getTopologicalEdgeAppearance(edge.status);
    return {
      id: edge.id,
      source: edge.fromId,
      target: edge.toId,
      label: edge.label,
      labelClassName: `topological-edge-label is-${edge.status}`,
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
      ariaLabel="DAG 위상 정렬 상태"
      className={`topological-visual motion-${state.motion}`}
      nodes={nodes}
      edges={edges}
    />
  );
}

function getTopologicalEdgeAppearance(status: TopologicalSortEdgeStatus) {
  switch (status) {
    case "active":
      return { color: "#c94f37", strokeWidth: 5, dashed: false, animated: true };
    case "removed":
      return { color: "#3f7d58", strokeWidth: 4, dashed: false, animated: false };
    case "blocking":
      return { color: "#c28a1d", strokeWidth: 4, dashed: false, animated: false };
    case "cycle-blocked":
      return { color: "#8a4b5f", strokeWidth: 4, dashed: true, animated: false };
    default:
      return { color: "#7a8b93", strokeWidth: 3, dashed: false, animated: false };
  }
}

function TopologicalResultPanel({ state }: { state: TopologicalSortTraceState }) {
  return (
    <section className="topological-result-panel" aria-label="위상 정렬 결과">
      <h2>결과 순서</h2>
      {state.resultOrder.length ? (
        <p className="topological-order">{state.resultOrder.join(" → ")}</p>
      ) : (
        <p>선택한 노드가 결과 순서에 차례대로 표시됩니다.</p>
      )}
      <p className="topological-progress">
        처리 노드 <strong>{state.processedNodeIds.length} / {state.nodes.length}</strong>
      </p>
    </section>
  );
}

function TopologicalValidationPanel({ state }: { state: TopologicalSortTraceState }) {
  const validation = state.validation;

  return (
    <section className="topological-validation-panel" aria-label="위상 정렬 검증">
      <h2>{state.motion === "cycle-blocked" ? "순환 의존성" : "최종 검증"}</h2>
      {validation ? (
        <div className={validation.isValid ? "topological-validation is-valid" : "topological-validation is-invalid"}>
          <p>{validation.summaryText}</p>
          <p>
            처리: <strong>{validation.processedCount} / {validation.nodeCount}</strong>
          </p>
          {validation.edgeChecks.length ? (
            <ul className="topological-edge-checks">
              {validation.edgeChecks.map((check) => (
                <li className={check.isValid ? "is-valid" : "is-invalid"} key={check.edgeId}>
                  <span>{check.label}</span>
                  <strong>{check.isValid ? "통과" : "실패"}</strong>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <p>완료 단계에서 모든 간선의 선후관계 검증 결과가 표시됩니다.</p>
      )}
    </section>
  );
}

function getNodeClassName(node: TopologicalSortNodeRenderState): string {
  return ["graph-node", "topological-node", `is-${node.status}`].join(" ");
}

function getEdgeClassName(edge: TopologicalSortEdgeRenderState): string {
  return ["graph-edge", "topological-edge", `is-${edge.status}`].join(" ");
}

function getNodeAriaLabel(node: TopologicalSortNodeRenderState): string {
  return `${node.label} ${nodeStatusLabels[node.status]} 노드, 진입 차수 ${node.inDegree}`;
}

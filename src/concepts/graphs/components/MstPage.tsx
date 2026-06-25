import { type CSSProperties, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import { tokenizeCodeLine } from "../../sorting/code/syntaxHighlight";
import type { SortingCodeExample } from "../../sorting/code/types";
import {
  generateMstTrace,
  getMstDescription,
  getMstInputSummary
} from "../algorithms/mst";
import { mstCodeExamples } from "../code/mstExamples";
import type {
  MstComponentGroup,
  MstEdgeRenderState,
  MstEdgeStatus,
  MstNodeRenderState,
  MstNodeStatus,
  MstSortedEdgeRow,
  MstTraceState
} from "../types";
import { InteractiveGraphCanvas } from "./InteractiveGraphCanvas";

const pseudoCode = [
  "각 노드를 독립된 연결 성분으로 준비한다.",
  "모든 간선을 가중치 오름차순으로 정렬한다.",
  "현재 후보 간선의 두 끝점 성분을 찾는다.",
  "서로 다른 성분이면 간선을 선택하고 성분을 병합한다.",
  "같은 성분이면 사이클이 생기므로 간선을 건너뛴다.",
  "선택 간선이 노드 수 - 1개가 되면 MST를 완성한다."
];

const mstTrace = generateMstTrace("kruskal-basic");
const mstIntro = getMstDescription("kruskal-basic");
const mstInputSummary = getMstInputSummary("kruskal-basic");

const motionLabels: Record<MstTraceState["motion"], string> = {
  initialize: "초기화",
  "sort-edges": "정렬",
  "inspect-edge": "후보 검사",
  "select-edge": "간선 선택",
  "skip-cycle": "사이클 제외",
  complete: "완료"
};

const nodeStatusLabels: Record<MstNodeStatus, string> = {
  idle: "대기",
  candidate: "후보",
  selected: "선택",
  merged: "병합됨",
  complete: "완료"
};

const edgeStatusLabels: Record<MstEdgeStatus, string> = {
  pending: "대기",
  candidate: "현재 후보",
  selected: "선택됨",
  "skipped-cycle": "사이클로 건너뜀",
  "not-needed": "불필요"
};

export function MstPage() {
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const activeCodeExample = mstCodeExamples[activeCodeIndex];
  const controller = useStepController(mstTrace.length, 900);
  const currentIndex = Math.min(controller.currentIndex, mstTrace.length - 1);
  const currentStep = mstTrace[currentIndex];
  const activeLines =
    currentStep.codeLineHighlights?.[activeCodeExample.language] ?? [];
  const progressPercent =
    mstTrace.length <= 1 ? 100 : (currentIndex / (mstTrace.length - 1)) * 100;

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="mst-title">
        <p className="eyebrow">그래프 알고리즘</p>
        <h1 id="mst-title">최소 신장 트리: Kruskal</h1>
        <p className="intro-copy">{mstIntro}</p>
        <p className="input-summary">{mstInputSummary}</p>
      </section>

      <section className="graph-workbench mst-workbench" aria-label="MST 작업 영역">
        <section className="graph-stage-panel mst-stage-panel" aria-label="MST 그래프 도표">
          <div className="stage-header">
            <div>
              <p className="eyebrow">Kruskal · {motionLabels[currentStep.state.motion]}</p>
              <h2>스테이지: {currentStep.title}</h2>
            </div>
            <span className="stage-counter">
              {currentIndex + 1} / {mstTrace.length}
            </span>
          </div>

          <MstDiagram state={currentStep.state} />

          <div className="stage-state-list" aria-label="현재 MST 단계 요약">
            {(currentStep.state.summaryItems ?? []).map((item) => (
              <div className="stage-state-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <MstEdgeTable rows={currentStep.state.sortedEdges} />

          <div className="stage-legend" aria-label="MST 상태 범례">
            <span className="legend-title">상태 범례</span>
            <span className="legend-item">
              <span className="legend-swatch is-comparing" />
              후보
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-updated" />
              선택
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-current" />
              사이클 제외
            </span>
          </div>

          <div className="timeline-controls" aria-label="MST 단계 재생 컨트롤">
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

            <label className="timeline-slider-label" htmlFor="mst-step-slider">
              <span>수동 단계 이동</span>
              <input
                id="mst-step-slider"
                type="range"
                min="0"
                max={mstTrace.length - 1}
                value={currentIndex}
                onChange={(event) =>
                  controller.goToStep(Number(event.currentTarget.value))
                }
                aria-label="MST 단계 슬라이더"
                style={{ "--progress": `${progressPercent}%` } as CSSProperties}
              />
            </label>
          </div>
        </section>

        <MstCodePanel
          activeCodeExample={activeCodeExample}
          activeCodeIndex={activeCodeIndex}
          activeLines={activeLines}
          codeExamples={mstCodeExamples}
          onSelectCode={setActiveCodeIndex}
        />

        <aside className="graph-side-panel mst-side-panel" aria-label="현재 MST 단계 설명">
          <section className="step-panel">
            <h2>현재 단계</h2>
            <p className="step-count">
              {currentIndex + 1} / {mstTrace.length}
            </p>
            <h3>{currentStep.title}</h3>
            <p>{currentStep.description}</p>
          </section>

          <MstComponentPanel components={currentStep.state.components} />
          <MstDecisionPanel state={currentStep.state} />
          <MstFinalPanel state={currentStep.state} />
        </aside>
      </section>

      <section className="step-pseudo-layout" aria-label="Kruskal 의사 코드">
        <div className="pseudo-panel">
          <h2>Kruskal 절차</h2>
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

function MstEdgeTable({ rows }: { rows: MstSortedEdgeRow[] }) {
  return (
    <div className="mst-table-scroll">
      <table className="mst-edge-table" aria-label="Kruskal 정렬 간선 목록">
        <thead>
          <tr>
            <th>순서</th>
            <th>간선</th>
            <th>가중치</th>
            <th>상태</th>
            <th>판단</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className={`is-${row.status}`} key={row.edgeId}>
              <td>{row.order}</td>
              <th scope="row">{row.label}</th>
              <td>{row.weight}</td>
              <td>{edgeStatusLabels[row.status]}</td>
              <td>{row.componentRelation ?? row.decisionLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type MstCodePanelProps = {
  activeCodeExample: SortingCodeExample;
  activeCodeIndex: number;
  activeLines: number[];
  codeExamples: SortingCodeExample[];
  onSelectCode: (index: number) => void;
};

function MstCodePanel({
  activeCodeExample,
  activeCodeIndex,
  activeLines,
  codeExamples,
  onSelectCode
}: MstCodePanelProps) {
  return (
    <section className="code-example-section" aria-label="Kruskal 코드">
      <div className="code-example-header">
        <div>
          <h2>코드 예제</h2>
          <p>현재 단계와 같은 정렬, find, 선택, union, cycle skip 줄을 강조합니다.</p>
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

function MstDiagram({ state }: { state: MstTraceState }) {
  const nodes = state.nodes.map((node) => ({
    id: node.id,
    label: node.label,
    note: nodeStatusLabels[node.status],
    className: getMstNodeClassName(node),
    ariaLabel: getMstNodeAriaLabel(node),
    x: node.x,
    y: node.y
  }));
  const edges = state.edges.map((edge) => {
    const appearance = getMstEdgeAppearance(edge.status);
    return {
      id: edge.id,
      source: edge.fromId,
      target: edge.toId,
      label: edge.weight,
      labelClassName: "graph-edge-weight",
      className: getMstEdgeClassName(edge),
      ariaLabel: `${edge.label} 비용 ${edge.weight} ${edgeStatusLabels[edge.status]} 간선`,
      color: appearance.color,
      labelBorderColor: appearance.color,
      strokeWidth: appearance.strokeWidth,
      dashed: appearance.dashed,
      animated: appearance.animated
    };
  });

  return (
    <InteractiveGraphCanvas
      ariaLabel="Kruskal MST 상태"
      className={`mst-visual motion-${state.motion}`}
      layoutAlgorithm="stress"
      nodes={nodes}
      edges={edges}
    />
  );
}

function getMstEdgeAppearance(status: MstEdgeStatus) {
  switch (status) {
    case "candidate":
      return { color: "#c94f37", strokeWidth: 5, dashed: false, animated: true };
    case "selected":
      return { color: "#3f7d58", strokeWidth: 5, dashed: false, animated: false };
    case "skipped-cycle":
      return { color: "#c28a1d", strokeWidth: 4, dashed: true, animated: false };
    case "not-needed":
      return { color: "#b8c3c8", strokeWidth: 3, dashed: true, animated: false };
    default:
      return { color: "#6f5bb8", strokeWidth: 3, dashed: false, animated: false };
  }
}

function MstComponentPanel({ components }: { components: MstComponentGroup[] }) {
  return (
    <section className="mst-component-panel" aria-label="연결 성분">
      <h2>연결 성분</h2>
      <div className="mst-component-list">
        {components.map((component) => (
          <div
            className={
              component.isMergedThisStep
                ? "mst-component is-merged"
                : "mst-component"
            }
            key={component.id}
          >
            <strong>{component.label}</strong>
            <span>{component.isMergedThisStep ? "이번 단계 병합" : "현재 성분"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MstDecisionPanel({ state }: { state: MstTraceState }) {
  const decision = state.candidateDecision;

  return (
    <section className="mst-decision-panel" aria-label="후보 간선 판단">
      <h2>후보 판단</h2>
      {decision ? (
        <dl>
          <div>
            <dt>후보 간선</dt>
            <dd>
              {decision.edgeId} · 비용 {decision.weight}
            </dd>
          </div>
          <div>
            <dt>성분 관계</dt>
            <dd>
              {decision.fromComponentLabel} ↔ {decision.toComponentLabel}
            </dd>
          </div>
          <div>
            <dt>결과</dt>
            <dd>{decision.willSelect ? "선택" : "건너뜀 · 사이클"}</dd>
          </div>
          <div>
            <dt>이유</dt>
            <dd>{decision.reason}</dd>
          </div>
        </dl>
      ) : (
        <p>후보 간선을 검사하는 단계에서 성분 관계와 선택 이유가 표시됩니다.</p>
      )}
    </section>
  );
}

function MstFinalPanel({ state }: { state: MstTraceState }) {
  const result = state.result;
  const expectedCount = state.nodes.length - 1;

  return (
    <section className="mst-final-panel" aria-label="최종 MST 결과">
      <h2>최종 결과</h2>
      {result ? (
        <div className="mst-result">
          <p>
            선택 간선: <strong>{result.selectedEdgeIds.length} / {expectedCount}</strong>
          </p>
          <p>
            총 비용: <strong>{result.totalCost}</strong>
          </p>
          <p>
            계산식: <strong>{result.costFormulaLabel}</strong>
          </p>
          <p>
            선택 순서: <strong>{result.selectedEdgeLabels.join(" → ")}</strong>
          </p>
          <p>
            포함 노드: <strong>{result.coveredNodeIds.join(", ")}</strong>
          </p>
        </div>
      ) : (
        <p>완료 단계에서 선택 간선 수, 비용 계산식, 포함 노드를 확인합니다.</p>
      )}
    </section>
  );
}

function getMstNodeClassName(node: MstNodeRenderState): string {
  return ["graph-node", "mst-node", `is-${node.status}`].join(" ");
}

function getMstEdgeClassName(edge: MstEdgeRenderState): string {
  return ["graph-edge", "mst-edge", "is-weighted", `is-${edge.status}`].join(" ");
}

function getMstNodeAriaLabel(node: MstNodeRenderState): string {
  return `${node.label} ${nodeStatusLabels[node.status]} 노드, 성분 ${node.componentLabel}`;
}

import { type CSSProperties, useMemo, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import { tokenizeCodeLine } from "../../sorting/code/syntaxHighlight";
import type { SortingCodeExample } from "../../sorting/code/types";
import {
  KNAPSACK_DEFAULT_CAPACITY,
  KNAPSACK_DEFAULT_ITEMS,
  generateKnapsackTrace,
} from "../algorithms/knapsack";
import { knapsackCodeExamples } from "../code/knapsackExamples";
import type { DpCellRef, KnapsackDpState } from "../types";

const pseudoCode = [
  "dp 표를 0으로 초기화한다.",
  "물건을 하나씩 추가하며 행을 채운다.",
  "각 용량을 왼쪽부터 확인한다.",
  "물건이 너무 무거우면 위 칸을 복사한다.",
  "담지 않는 값과 담는 값을 계산한다.",
  "담지 않는 값이 크면 그 값을 유지한다.",
  "담는 값이 크면 그 값을 기록한다.",
  "마지막 칸이 최대 가치다.",
];

export function DynamicProgrammingPage() {
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const [playDelayMs, setPlayDelayMs] = useState(850);
  const trace = useMemo(
    () => generateKnapsackTrace(KNAPSACK_DEFAULT_ITEMS, KNAPSACK_DEFAULT_CAPACITY),
    [],
  );
  const controller = useStepController(trace.length, playDelayMs);
  const currentIndex = Math.min(controller.currentIndex, trace.length - 1);
  const currentStep = trace[currentIndex];
  const activeCodeExample = knapsackCodeExamples[activeCodeIndex];
  const activeLines =
    currentStep.codeLineHighlights?.[activeCodeExample.language] ?? [];
  const progressPercent =
    trace.length <= 1 ? 100 : (currentIndex / (trace.length - 1)) * 100;

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="dp-title">
        <p className="eyebrow">코딩 테스트 필수 알고리즘</p>
        <h1 id="dp-title">동적 계획법: 0/1 배낭</h1>
        <p className="intro-copy">
          큰 문제를 작은 상태로 나누고, 이미 계산한 값을 표에 저장해 다시 쓰는
          방식입니다. 이 예시는 물건을 담거나 빼는 두 선택 중 더 큰 가치를 표에
          기록합니다.
        </p>
        <p className="input-summary">
          용량 {KNAPSACK_DEFAULT_CAPACITY} · 물건{" "}
          {KNAPSACK_DEFAULT_ITEMS.map(
            (item) => `${item.name}(무게 ${item.weight}, 가치 ${item.value})`,
          ).join(", ")}
        </p>
      </section>

      <section className="dp-workbench" aria-label="동적 계획법 실습 작업 영역">
        <section className="dp-stage-panel" aria-label="0/1 배낭 DP 인터랙션 스테이지">
          <div className="stage-header">
            <div>
              <p className="eyebrow">인터랙션 스테이지</p>
              <h2>스테이지: {currentStep.title}</h2>
            </div>
            <span className="stage-counter">
              {currentIndex + 1} / {trace.length}
            </span>
          </div>

          <div className="timeline-controls" aria-label="동적 계획법 단계 재생 컨트롤">
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
                aria-label="동적 계획법 다음 단계"
                disabled={controller.isLastStep}
                onClick={controller.goNext}
                type="button"
              >
                다음
              </button>
            </div>

            <label className="timeline-slider-label" htmlFor="dp-step-slider">
              <span>수동 단계 이동</span>
              <input
                id="dp-step-slider"
                type="range"
                min="0"
                max={trace.length - 1}
                value={currentIndex}
                onChange={(event) =>
                  controller.goToStep(Number(event.currentTarget.value))
                }
                aria-label="동적 계획법 단계 슬라이더"
                style={{ "--progress": `${progressPercent}%` } as CSSProperties}
              />
            </label>

            <label className="speed-control" htmlFor="dp-speed">
              <span>속도</span>
              <select
                id="dp-speed"
                value={playDelayMs}
                onChange={(event) => setPlayDelayMs(Number(event.currentTarget.value))}
              >
                <option value="1300">느리게</option>
                <option value="850">보통</option>
                <option value="480">빠르게</option>
              </select>
            </label>
          </div>

          <KnapsackItems state={currentStep.state} />
          <KnapsackTable state={currentStep.state} />

          <div className="stage-state-list" aria-label="현재 DP 상태">
            {currentStep.state.summaryItems.map((item) => (
              <div className="stage-state-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="stage-legend" aria-label="DP 표 상태 범례">
            <span className="legend-title">상태 범례</span>
            <span className="legend-item">
              <span className="legend-swatch is-current" />
              기록
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-comparing" />
              참조
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-updated" />
              선택
            </span>
          </div>
        </section>

        <DpCodePanel
          activeCodeExample={activeCodeExample}
          activeCodeIndex={activeCodeIndex}
          activeLines={activeLines}
          onSelectCode={setActiveCodeIndex}
        />
      </section>

      <section className="step-pseudo-layout" aria-label="동적 계획법 의사 코드와 현재 단계">
        <div className="pseudo-panel">
          <h2>의사 코드</h2>
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

        <aside className="step-panel" aria-label="현재 DP 단계 설명">
          <h2>현재 단계</h2>
          <p className="step-count">
            {currentIndex + 1} / {trace.length}
          </p>
          <h3>{currentStep.title}</h3>
          <p>{currentStep.description}</p>
        </aside>
      </section>

      <section className="summary-section" aria-label="동적 계획법 핵심 요약">
        <div className="summary-panel">
          <h2>핵심 요약</h2>
          <dl className="complexity-list">
            <div>
              <dt>시간 복잡도</dt>
              <dd>O(n × capacity)</dd>
            </div>
            <div>
              <dt>공간 복잡도</dt>
              <dd>2차원 표 구현은 O(n × capacity)</dd>
            </div>
            <div>
              <dt>관찰 포인트</dt>
              <dd>
                같은 용량에서 위 행의 값을 그대로 쓸지, 현재 물건의 가치와 남은 용량
                값을 더할지 비교합니다. 이 참조 관계가 DP 점화식입니다.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}

function KnapsackItems({ state }: { state: KnapsackDpState }) {
  return (
    <div className="knapsack-items" aria-label="0/1 배낭 물건 목록">
      {state.items.map((item, index) => (
        <div className={getItemClassName(state, index)} key={item.id}>
          <strong>{item.name}</strong>
          <span>무게 {item.weight}</span>
          <span>가치 {item.value}</span>
        </div>
      ))}
    </div>
  );
}

function KnapsackTable({ state }: { state: KnapsackDpState }) {
  const templateColumns = `minmax(94px, 0.95fr) repeat(${state.capacity + 1}, minmax(46px, 1fr))`;

  return (
    <div className="dp-table-scroll">
      <div
        className="dp-table"
        role="table"
        style={{ gridTemplateColumns: templateColumns }}
      >
        <div className="dp-table-header" role="columnheader">
          물건 / 용량
        </div>
        {Array.from({ length: state.capacity + 1 }, (_, col) => (
          <div className="dp-table-header" key={`capacity-${col}`} role="columnheader">
            {col}
          </div>
        ))}

        {state.table.map((row, rowIndex) => (
          <DpRow key={`row-${rowIndex}`} row={row} rowIndex={rowIndex} state={state} />
        ))}
      </div>
    </div>
  );
}

function DpRow({
  row,
  rowIndex,
  state,
}: {
  row: number[];
  rowIndex: number;
  state: KnapsackDpState;
}) {
  const rowLabel =
    rowIndex === 0 ? "0개" : `${rowIndex}. ${state.items[rowIndex - 1]?.name}`;

  return (
    <>
      <div className="dp-row-header" role="rowheader">
        {rowLabel}
      </div>
      {row.map((value, colIndex) => (
        <div
          className={getCellClassName(state, rowIndex, colIndex)}
          key={`${rowIndex}-${colIndex}`}
          role="cell"
        >
          {value}
        </div>
      ))}
    </>
  );
}

function DpCodePanel({
  activeCodeExample,
  activeCodeIndex,
  activeLines,
  onSelectCode,
}: {
  activeCodeExample: SortingCodeExample;
  activeCodeIndex: number;
  activeLines: number[];
  onSelectCode: (index: number) => void;
}) {
  return (
    <section className="code-example-section" aria-label="동적 계획법 코드">
      <div className="code-example-header">
        <div>
          <h2>코드 예제</h2>
          <p>현재 채우는 DP 셀과 연결된 코드 라인을 함께 표시합니다.</p>
        </div>
        <span className="code-file-name">{activeCodeExample.fileName}</span>
      </div>

      <div className="code-tabs" role="tablist" aria-label="코드 언어">
        {knapsackCodeExamples.map((example, index) => (
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
                aria-current={isActive ? "step" : undefined}
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
                    ),
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

function getItemClassName(state: KnapsackDpState, index: number): string {
  const classNames = ["knapsack-item"];

  if (state.activeItemIndex === index) {
    classNames.push("is-active");
  }

  if (state.selectedItemIndices?.includes(index)) {
    classNames.push("is-selected");
  }

  if (state.skippedItemIndices?.includes(index)) {
    classNames.push("is-skipped");
  }

  return classNames.join(" ");
}

function getCellClassName(
  state: KnapsackDpState,
  row: number,
  col: number,
): string {
  const classNames = ["dp-cell"];

  if (state.activeRow === row) {
    classNames.push("is-active-row");
  }

  if (state.activeRow === row && state.activeCol === col) {
    classNames.push("is-active");
    classNames.push(`decision-${state.decision}`);
  }

  if (hasCell(state.compareCells, row, col)) {
    classNames.push("is-reference");
  }

  if (hasCell(state.selectedCells, row, col)) {
    classNames.push("is-selected");
  }

  return classNames.join(" ");
}

function hasCell(cells: DpCellRef[] | undefined, row: number, col: number): boolean {
  return cells?.some((cell) => cell.row === row && cell.col === col) ?? false;
}

import { type CSSProperties, useMemo, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import { tokenizeCodeLine } from "../../sorting/code/syntaxHighlight";
import type { SortingCodeExample } from "../../sorting/code/types";
import {
  BINARY_SEARCH_MISSING_INPUT,
  BINARY_SEARCH_SUCCESS_INPUT,
  generateBinarySearchTrace,
} from "../algorithms/binarySearch";
import { binarySearchCodeExamples } from "../code/binarySearchExamples";
import type { BinarySearchState } from "../types";

type BinarySearchCase = {
  id: string;
  label: string;
  target: number;
  values: readonly number[];
  summary: string;
};

const binarySearchCases: BinarySearchCase[] = [
  {
    id: "found",
    label: "성공 예시",
    target: 42,
    values: BINARY_SEARCH_SUCCESS_INPUT,
    summary:
      "target이 배열 안에 있는 경우입니다. 후보 구간이 절반씩 줄어들다가 index 9에서 42를 찾습니다.",
  },
  {
    id: "missing",
    label: "실패 예시",
    target: 40,
    values: BINARY_SEARCH_MISSING_INPUT,
    summary:
      "target이 배열 안에 없는 경우입니다. 후보 구간이 완전히 비면 -1을 반환합니다.",
  },
];

const pseudoCode = [
  "정렬된 배열에서 left와 right를 둔다.",
  "left <= right 동안 반복한다.",
  "mid를 계산한다.",
  "values[mid]와 target을 비교한다.",
  "같으면 mid를 반환한다.",
  "values[mid]가 작으면 left = mid + 1",
  "values[mid]가 크면 right = mid - 1",
  "후보가 없으면 -1을 반환한다.",
];

export function BinarySearchPage() {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const [playDelayMs, setPlayDelayMs] = useState(900);
  const activeCase = binarySearchCases[activeCaseIndex];
  const trace = useMemo(
    () => generateBinarySearchTrace(activeCase.values, activeCase.target),
    [activeCase],
  );
  const controller = useStepController(trace.length, playDelayMs);
  const currentIndex = Math.min(controller.currentIndex, trace.length - 1);
  const currentStep = trace[currentIndex];
  const activeCodeExample = binarySearchCodeExamples[activeCodeIndex];
  const activeLines =
    currentStep.codeLineHighlights?.[activeCodeExample.language] ?? [];
  const progressPercent =
    trace.length <= 1 ? 100 : (currentIndex / (trace.length - 1)) * 100;

  function selectCase(index: number) {
    setActiveCaseIndex(index);
    setActiveCodeIndex(0);
    controller.reset();
  }

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="binary-search-title">
        <p className="eyebrow">코딩 테스트 필수 알고리즘</p>
        <h1 id="binary-search-title">이진 탐색</h1>
        <p className="intro-copy">
          정렬된 배열의 가운데 값을 기준으로 후보 구간을 절반씩 줄여 target의 위치를
          찾는 탐색 알고리즘입니다.
        </p>
        <div
          className="algorithm-tabs"
          role="tablist"
          aria-label="이진 탐색 예시 선택"
        >
          {binarySearchCases.map((example, index) => (
            <button
              aria-selected={activeCaseIndex === index}
              className="algorithm-tab"
              key={example.id}
              onClick={() => selectCase(index)}
              role="tab"
              type="button"
            >
              {example.label}
            </button>
          ))}
        </div>
        <p className="variant-summary">
          <strong>{activeCase.label}</strong> {activeCase.summary}
        </p>
        <p className="input-summary">
          target {activeCase.target} · 배열 [{activeCase.values.join(", ")}]
        </p>
      </section>

      <section className="search-workbench" aria-label="이진 탐색 실습 작업 영역">
        <section className="search-stage-panel" aria-label="이진 탐색 인터랙션 스테이지">
          <div className="stage-header">
            <div>
              <p className="eyebrow">인터랙션 스테이지</p>
              <h2>스테이지: {currentStep.title}</h2>
            </div>
            <span className="stage-counter">
              {currentIndex + 1} / {trace.length}
            </span>
          </div>

          <div className="timeline-controls" aria-label="이진 탐색 단계 재생 컨트롤">
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
                aria-label="이진 탐색 다음 단계"
                disabled={controller.isLastStep}
                onClick={controller.goNext}
                type="button"
              >
                다음
              </button>
            </div>

            <label className="timeline-slider-label" htmlFor="binary-search-step-slider">
              <span>수동 단계 이동</span>
              <input
                id="binary-search-step-slider"
                type="range"
                min="0"
                max={trace.length - 1}
                value={currentIndex}
                onChange={(event) =>
                  controller.goToStep(Number(event.currentTarget.value))
                }
                aria-label="이진 탐색 단계 슬라이더"
                style={{ "--progress": `${progressPercent}%` } as CSSProperties}
              />
            </label>

            <label className="speed-control" htmlFor="binary-search-speed">
              <span>속도</span>
              <select
                id="binary-search-speed"
                value={playDelayMs}
                onChange={(event) => setPlayDelayMs(Number(event.currentTarget.value))}
              >
                <option value="1300">느리게</option>
                <option value="900">보통</option>
                <option value="500">빠르게</option>
              </select>
            </label>
          </div>

          <BinarySearchTable state={currentStep.state} />

          <div className="stage-state-list" aria-label="현재 이진 탐색 상태">
            {currentStep.state.summaryItems.map((item) => (
              <div className="stage-state-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="stage-legend" aria-label="이진 탐색 상태 범례">
            <span className="legend-title">상태 범례</span>
            <span className="legend-item">
              <span className="legend-swatch is-range" />
              후보
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-current" />
              mid
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-removing" />
              제거
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-updated" />
              발견
            </span>
          </div>
        </section>

        <BinarySearchCodePanel
          activeCodeExample={activeCodeExample}
          activeCodeIndex={activeCodeIndex}
          activeLines={activeLines}
          onSelectCode={setActiveCodeIndex}
        />
      </section>

      <section className="step-pseudo-layout" aria-label="이진 탐색 의사 코드와 현재 단계">
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

        <aside className="step-panel" aria-label="현재 이진 탐색 단계 설명">
          <h2>현재 단계</h2>
          <p className="step-count">
            {currentIndex + 1} / {trace.length}
          </p>
          <h3>{currentStep.title}</h3>
          <p>{currentStep.description}</p>
        </aside>
      </section>

      <section className="summary-section" aria-label="이진 탐색 핵심 요약">
        <div className="summary-panel">
          <h2>핵심 요약</h2>
          <dl className="complexity-list">
            <div>
              <dt>시간 복잡도</dt>
              <dd>O(log n)</dd>
            </div>
            <div>
              <dt>공간 복잡도</dt>
              <dd>반복문 구현은 O(1)</dd>
            </div>
            <div>
              <dt>관찰 포인트</dt>
              <dd>
                배열이 정렬되어 있을 때만 후보 구간을 버릴 수 있습니다. mid 값이
                target보다 작은지 큰지에 따라 제거되는 구간을 확인하세요.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}

function BinarySearchTable({ state }: { state: BinarySearchState }) {
  return (
    <div className="binary-search-visual" aria-label="이진 탐색 배열 표">
      <div className="binary-search-target">
        <span>target</span>
        <strong>{state.target}</strong>
      </div>
      <div className="binary-search-table" role="table">
        {state.values.map((value, index) => (
          <div
            className={getCellClassName(state, index)}
            key={`${index}-${value}`}
            role="cell"
          >
            <span className="binary-search-index">{index}</span>
            <strong>{value}</strong>
            <span className="binary-search-pointer">{getPointerLabel(state, index)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BinarySearchCodePanel({
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
    <section className="code-example-section" aria-label="이진 탐색 코드">
      <div className="code-example-header">
        <div>
          <h2>코드 예제</h2>
          <p>현재 단계가 바뀌면 실행 중인 코드 라인이 함께 강조됩니다.</p>
        </div>
        <span className="code-file-name">{activeCodeExample.fileName}</span>
      </div>

      <div className="code-tabs" role="tablist" aria-label="코드 언어">
        {binarySearchCodeExamples.map((example, index) => (
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

function getCellClassName(state: BinarySearchState, index: number): string {
  const classNames = ["binary-search-cell"];

  if (state.activeRange !== undefined && index >= state.left && index <= state.right) {
    classNames.push("is-range");
  }

  if (state.discardedIndices.includes(index)) {
    classNames.push("is-discarded");
  }

  if (state.mid === index) {
    classNames.push("is-mid");
  }

  if (state.foundIndex === index) {
    classNames.push("is-found");
  }

  return classNames.join(" ");
}

function getPointerLabel(state: BinarySearchState, index: number): string {
  const labels: string[] = [];

  if (state.left === index) {
    labels.push("L");
  }

  if (state.mid === index) {
    labels.push("M");
  }

  if (state.right === index) {
    labels.push("R");
  }

  return labels.join(" · ");
}

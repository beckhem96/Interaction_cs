import { useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import {
  BUBBLE_SORT_DEFAULT_INPUT,
  generateBubbleSortTrace
} from "../algorithms/bubbleSort";
import {
  SELECTION_SORT_DEFAULT_INPUT,
  generateSelectionSortTrace
} from "../algorithms/selectionSort";
import { bubbleSortCodeExamples } from "../code/bubbleSortExamples";
import { selectionSortCodeExamples } from "../code/selectionSortExamples";
import { SortingBars } from "./SortingBars";

const sortingAlgorithms = [
  {
    id: "bubble",
    title: "버블 정렬",
    summary:
      "인접한 두 값을 비교하고 필요한 경우 교환하면서 큰 값을 오른쪽으로 밀어내는 정렬 방식입니다.",
    inputSummary: "입력 배열: [5, 3, 8, 4, 2]",
    trace: generateBubbleSortTrace(BUBBLE_SORT_DEFAULT_INPUT),
    codeExamples: bubbleSortCodeExamples,
    pseudoCode: [
      "배열을 준비한다.",
      "끝 위치를 왼쪽으로 줄이며 반복한다.",
      "인접한 두 값을 비교한다.",
      "왼쪽 값이 작거나 같으면 유지한다.",
      "왼쪽 값이 크면 교환한다.",
      "다음 인접 쌍으로 이동한다.",
      "가장 큰 값의 위치를 확정한다.",
      "모든 위치가 확정되면 종료한다."
    ],
    observation: "비교, 교환, 정렬 완료 구간이 어떻게 바뀌는지 확인합니다."
  },
  {
    id: "selection",
    title: "선택 정렬",
    summary:
      "정렬되지 않은 구간에서 가장 작은 값을 찾아 현재 위치로 옮기는 정렬 방식입니다.",
    inputSummary: "입력 배열: [5, 3, 8, 4, 2]",
    trace: generateSelectionSortTrace(SELECTION_SORT_DEFAULT_INPUT),
    codeExamples: selectionSortCodeExamples,
    pseudoCode: [
      "배열을 준비한다.",
      "현재 위치를 최소값 위치로 가정한다.",
      "남은 구간을 왼쪽에서 오른쪽으로 훑는다.",
      "남은 구간에서 더 작은 값을 찾는다.",
      "더 작은 값이면 최소값 위치를 갱신한다.",
      "현재 위치와 최소값 위치를 교환한다.",
      "현재 위치를 정렬 완료 구간에 포함한다.",
      "모든 위치가 확정되면 종료한다."
    ],
    observation: "현재 위치, 최소값 위치, 탐색 위치가 어떻게 바뀌는지 확인합니다."
  }
];

export function SortingPage() {
  const [activeAlgorithmIndex, setActiveAlgorithmIndex] = useState(0);
  const activeAlgorithm = sortingAlgorithms[activeAlgorithmIndex];
  const controller = useStepController(activeAlgorithm.trace.length);
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const currentStep = activeAlgorithm.trace[controller.currentIndex];
  const activeCodeExample = activeAlgorithm.codeExamples[activeCodeIndex];
  const activeCodeLines =
    currentStep.codeLineHighlights?.[activeCodeExample.language] ?? [];

  function selectAlgorithm(index: number) {
    setActiveAlgorithmIndex(index);
    setActiveCodeIndex(0);
    controller.reset();
  }

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="sorting-title">
        <p className="eyebrow">정렬 알고리즘</p>
        <h1 id="sorting-title">{activeAlgorithm.title}</h1>
        <p className="intro-copy">{activeAlgorithm.summary}</p>
        <div
          className="algorithm-tabs"
          role="tablist"
          aria-label="정렬 알고리즘 선택"
        >
          {sortingAlgorithms.map((algorithm, index) => (
            <button
              aria-selected={activeAlgorithmIndex === index}
              className="algorithm-tab"
              key={algorithm.id}
              onClick={() => selectAlgorithm(index)}
              role="tab"
              type="button"
            >
              {algorithm.title}
            </button>
          ))}
        </div>
        <p className="input-summary">{activeAlgorithm.inputSummary}</p>
      </section>

      <section
        className="visualization-layout"
        aria-label={`${activeAlgorithm.title} 도표`}
      >
        <div className="visualization-panel">
          <SortingBars state={currentStep.state} />
        </div>
      </section>

      <section
        className="code-example-section"
        aria-label={`${activeAlgorithm.title} 코드`}
      >
        <div className="code-example-header">
          <div>
            <h2 id="code-title">코드 예제</h2>
            <p>단계가 바뀌면 관련 코드 줄도 함께 표시됩니다.</p>
          </div>
          <span className="code-file-name">{activeCodeExample.fileName}</span>
        </div>

        <div className="code-tabs" role="tablist" aria-label="코드 언어">
          {activeAlgorithm.codeExamples.map((example, index) => (
            <button
              aria-controls="bubble-sort-code-panel"
              aria-selected={activeCodeIndex === index}
              className="code-tab"
              key={example.language}
              onClick={() => setActiveCodeIndex(index)}
              role="tab"
              type="button"
            >
              {example.language}
            </button>
          ))}
        </div>

        <div className="code-panel" id="bubble-sort-code-panel" role="tabpanel">
          <ol className="code-lines">
            {activeCodeExample.code.split("\n").map((line, index) => {
              const lineNumber = index + 1;
              const isActive = activeCodeLines.includes(lineNumber);

              return (
                <li
                  aria-label={
                    isActive
                      ? `현재 코드 ${lineNumber}: ${line.trim()}`
                      : `코드 ${lineNumber}: ${line.trim()}`
                  }
                  className={isActive ? "code-line is-active" : "code-line"}
                  key={`${activeAlgorithm.id}-${activeCodeExample.language}-${lineNumber}`}
                >
                  <span className="code-line-number">{lineNumber}</span>
                  <code className="code-line-text">{line || " "}</code>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="step-pseudo-layout" aria-label="단계와 의사 코드">
        <div className="pseudo-panel">
          <h2>의사 코드</h2>
          <ol className="pseudo-code">
            {activeAlgorithm.pseudoCode.map((line, index) => (
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

        <aside className="step-panel" aria-label="현재 단계 설명">
          <h2>현재 단계</h2>
          <p className="step-count">
            {controller.currentIndex + 1} / {activeAlgorithm.trace.length}
          </p>
          <h3>{currentStep.title}</h3>
          <p>{currentStep.description}</p>

          <div className="step-controls" aria-label="단계 컨트롤">
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

      <section className="summary-section" aria-label="핵심 요약">
        <div className="summary-panel">
          <h2>핵심 요약</h2>
          <dl className="complexity-list">
            <div>
              <dt>시간 복잡도</dt>
              <dd>시간 복잡도 O(n²)</dd>
            </div>
            <div>
              <dt>공간 복잡도</dt>
              <dd>공간 복잡도 O(1)</dd>
            </div>
            <div>
              <dt>관찰 포인트</dt>
              <dd>{activeAlgorithm.observation}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}

import { describe, expect, it } from "vitest";

import { generateSelectionSortTrace } from "../algorithms/selectionSort";

describe("generateSelectionSortTrace", () => {
  it("generates explainable selection sort trace steps for the MVP input", () => {
    const trace = generateSelectionSortTrace([5, 3, 8, 4, 2]);

    expect(trace[0]).toMatchObject({
      id: "selection-initial",
      title: "초기 배열",
      state: {
        array: [5, 3, 8, 4, 2],
        sortedIndices: []
      },
      pseudoCodeLine: 1
    });

    expect(trace[1]).toMatchObject({
      title: "0번 위치에서 최소값 탐색 시작",
      state: {
        array: [5, 3, 8, 4, 2],
        currentIndex: 0,
        minimumIndex: 0
      },
      pseudoCodeLine: 2,
      codeLineHighlights: {
        C: [4, 5],
        JavaScript: [4, 5],
        Python: [4, 5]
      }
    });

    expect(trace[2]).toMatchObject({
      title: "3과 현재 최소값 5 비교",
      state: {
        comparingIndices: [1, 0],
        scanningIndex: 1,
        minimumIndex: 0
      },
      pseudoCodeLine: 4
    });

    expect(
      trace.some(
        (step) =>
          step.title === "새 최소값 2 발견" &&
          step.state.minimumIndex === 4 &&
          step.pseudoCodeLine === 5
      )
    ).toBe(true);

    expect(trace.at(-1)).toMatchObject({
      title: "정렬 완료",
      state: {
        array: [2, 3, 4, 5, 8],
        sortedIndices: [0, 1, 2, 3, 4]
      }
    });
  });

  it("does not mutate the input array", () => {
    const input = [5, 3, 8, 4, 2];

    generateSelectionSortTrace(input);

    expect(input).toEqual([5, 3, 8, 4, 2]);
  });
});

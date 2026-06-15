import { describe, expect, it } from "vitest";

import { generateQuickSortTrace } from "../algorithms/quickSort";

describe("generateQuickSortTrace", () => {
  it("generates explainable quick sort trace steps for the MVP input", () => {
    const trace = generateQuickSortTrace([5, 3, 8, 4, 2]);

    expect(trace[0]).toMatchObject({
      id: "quick-initial",
      title: "초기 배열",
      state: {
        array: [5, 3, 8, 4, 2],
        partitionRange: [0, 4]
      },
      pseudoCodeLine: 1
    });

    expect(trace[1]).toMatchObject({
      title: "0~4 구간 피벗 선택",
      state: {
        array: [5, 3, 8, 4, 2],
        pivotIndex: 4,
        partitionRange: [0, 4]
      },
      pseudoCodeLine: 2
    });

    expect(
      trace.some(
        (step) =>
          step.title === "5와 피벗 2 비교" &&
          step.state.comparingIndices?.join(",") === "0,4" &&
          step.pseudoCodeLine === 4
      )
    ).toBe(true);

    expect(
      trace.some(
        (step) =>
          step.title === "피벗 2를 0번 위치에 배치" &&
          step.state.array.join(",") === "2,3,8,4,5" &&
          step.state.sortedIndices?.includes(0) &&
          step.pseudoCodeLine === 6
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

    generateQuickSortTrace(input);

    expect(input).toEqual([5, 3, 8, 4, 2]);
  });
});

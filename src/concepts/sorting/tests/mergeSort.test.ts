import { describe, expect, it } from "vitest";

import { generateMergeSortTrace } from "../algorithms/mergeSort";

describe("generateMergeSortTrace", () => {
  it("generates explainable merge sort trace steps for the MVP input", () => {
    const trace = generateMergeSortTrace([5, 3, 8, 4, 2]);

    expect(trace[0]).toMatchObject({
      id: "merge-initial",
      title: "초기 배열",
      state: {
        array: [5, 3, 8, 4, 2],
        mergeRange: [0, 4]
      },
      pseudoCodeLine: 1
    });

    expect(
      trace.some(
        (step) =>
          step.title === "0~4 구간 분할" &&
          step.state.mergeRange?.join(",") === "0,4" &&
          step.pseudoCodeLine === 2
      )
    ).toBe(true);

    expect(
      trace.some(
        (step) =>
          step.title === "3과 5 비교" &&
          step.state.comparingIndices?.join(",") === "1,0" &&
          step.pseudoCodeLine === 4
      )
    ).toBe(true);

    expect(
      trace.some(
        (step) =>
          step.title === "3을 0번 위치에 기록" &&
          step.state.array.join(",") === "3,3,8,4,2" &&
          step.state.writeIndex === 0 &&
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

    generateMergeSortTrace(input);

    expect(input).toEqual([5, 3, 8, 4, 2]);
  });
});

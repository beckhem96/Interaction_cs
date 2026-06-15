import { describe, expect, it } from "vitest";

import { generateBubbleSortTrace } from "../algorithms/bubbleSort";

describe("generateBubbleSortTrace", () => {
  it("generates explainable bubble sort trace steps for the MVP input", () => {
    const trace = generateBubbleSortTrace([5, 3, 8, 4, 2]);

    expect(trace[0]).toMatchObject({
      id: "bubble-initial",
      title: "초기 배열",
      state: {
        array: [5, 3, 8, 4, 2],
        sortedIndices: []
      }
    });

    expect(trace[1]).toMatchObject({
      title: "5와 3 비교",
      state: {
        array: [5, 3, 8, 4, 2],
        comparingIndices: [0, 1]
      },
      pseudoCodeLine: 3,
      codeLineHighlights: {
        C: [6],
        JavaScript: [6],
        Python: [6]
      }
    });

    expect(trace[2]).toMatchObject({
      title: "5와 3 교환",
      state: {
        array: [3, 5, 8, 4, 2],
        swappingIndices: [0, 1]
      },
      pseudoCodeLine: 5,
      codeLineHighlights: {
        C: [7, 8, 9],
        JavaScript: [7, 8, 9],
        Python: [7]
      }
    });

    expect(
      trace.some(
        (step) =>
          step.title === "5와 8 유지" &&
          step.state.array.join(",") === "3,5,8,4,2"
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

    generateBubbleSortTrace(input);

    expect(input).toEqual([5, 3, 8, 4, 2]);
  });
});

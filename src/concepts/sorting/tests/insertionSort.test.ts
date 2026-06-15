import { describe, expect, it } from "vitest";

import { generateInsertionSortTrace } from "../algorithms/insertionSort";

describe("generateInsertionSortTrace", () => {
  it("generates explainable insertion sort trace steps for the MVP input", () => {
    const trace = generateInsertionSortTrace([5, 3, 8, 4, 2]);

    expect(trace[0]).toMatchObject({
      id: "insertion-initial",
      title: "초기 배열",
      state: {
        array: [5, 3, 8, 4, 2],
        sortedIndices: [0]
      },
      pseudoCodeLine: 1
    });

    expect(trace[1]).toMatchObject({
      title: "3을 삽입할 위치 찾기",
      state: {
        array: [5, 3, 8, 4, 2],
        keyIndex: 1,
        sortedIndices: [0]
      },
      pseudoCodeLine: 2,
      codeLineHighlights: {
        C: [4, 5],
        JavaScript: [4, 5],
        Python: [4, 5]
      }
    });

    expect(trace[2]).toMatchObject({
      title: "5와 key 3 비교",
      state: {
        comparingIndices: [0, 1],
        keyIndex: 1
      },
      pseudoCodeLine: 4
    });

    expect(
      trace.some(
        (step) =>
          step.title === "5를 오른쪽으로 이동" &&
          step.state.array.join(",") === "5,5,8,4,2" &&
          step.pseudoCodeLine === 5
      )
    ).toBe(true);

    expect(
      trace.some(
        (step) =>
          step.title === "3을 0번 위치에 삽입" &&
          step.state.array.join(",") === "3,5,8,4,2" &&
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

    generateInsertionSortTrace(input);

    expect(input).toEqual([5, 3, 8, 4, 2]);
  });
});

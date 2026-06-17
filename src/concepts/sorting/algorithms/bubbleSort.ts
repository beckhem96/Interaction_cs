import type { TraceStep } from "../../shared/types";
import type { SortingState } from "../types";

export const BUBBLE_SORT_DEFAULT_INPUT = [
  14, 3, 17, 8, 6, 12, 1, 19, 4, 10
] as const;

const codeLineHighlights = {
  initial: {
    C: [3],
    Java: [2],
    "C++": [4],
    JavaScript: [1, 2],
    Python: [1, 2]
  },
  outerLoop: {
    C: [4],
    Java: [3],
    "C++": [5],
    JavaScript: [4],
    Python: [4]
  },
  compare: {
    C: [6],
    Java: [5],
    "C++": [7],
    JavaScript: [6],
    Python: [6]
  },
  swap: {
    C: [7, 8, 9],
    Java: [6, 7, 8],
    "C++": [8, 9, 10],
    JavaScript: [7, 8, 9],
    Python: [7]
  },
  complete: {
    C: [13],
    Java: [12],
    "C++": [14],
    JavaScript: [14],
    Python: [9]
  }
} satisfies Record<string, Record<string, number[]>>;

export function generateBubbleSortTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "bubble-initial",
      title: "초기 배열",
      description: "아직 정렬되지 않은 배열에서 버블 정렬을 시작합니다.",
      state: {
        array: [...array],
        sortedIndices: []
      },
      pseudoCodeLine: 1,
      codeLineHighlights: codeLineHighlights.initial
    }
  ];

  let stepIndex = 1;

  for (let end = array.length - 1; end > 0; end -= 1) {
    for (let index = 0; index < end; index += 1) {
      const left = array[index];
      const right = array[index + 1];
      const settledIndices = range(end + 1, array.length);

      trace.push({
        id: `bubble-${stepIndex++}-compare-${index}-${index + 1}`,
        title: `${left}와 ${right} 비교`,
        description: `${left}와 ${right}를 비교합니다. 왼쪽 값이 더 크면 두 값을 교환합니다.`,
        state: {
          array: [...array],
          comparingIndices: [index, index + 1],
          sortedIndices: settledIndices
        },
        pseudoCodeLine: 3,
        codeLineHighlights: codeLineHighlights.compare
      });

      if (left > right) {
        array[index] = right;
        array[index + 1] = left;

        trace.push({
          id: `bubble-${stepIndex++}-swap-${index}-${index + 1}`,
          title: `${left}와 ${right} 교환`,
          description: `${left}가 ${right}보다 크므로 두 값을 교환합니다.`,
          state: {
            array: [...array],
            swappingIndices: [index, index + 1],
            sortedIndices: settledIndices
          },
          pseudoCodeLine: 5,
          codeLineHighlights: codeLineHighlights.swap
        });
      } else {
        trace.push({
          id: `bubble-${stepIndex++}-keep-${index}-${index + 1}`,
          title: `${left}와 ${right} 유지`,
          description: `${left}가 ${right}보다 작거나 같으므로 순서를 유지합니다.`,
          state: {
            array: [...array],
            comparingIndices: [index, index + 1],
            sortedIndices: settledIndices
          },
          pseudoCodeLine: 4,
          codeLineHighlights: codeLineHighlights.compare
        });
      }
    }

    trace.push({
      id: `bubble-${stepIndex++}-settled-${end}`,
      title: `${array[end]} 위치 확정`,
      description: `이번 반복에서 가장 큰 값 ${array[end]}가 정렬된 구간에 들어갔습니다.`,
      state: {
        array: [...array],
        sortedIndices: range(end, array.length)
      },
      pseudoCodeLine: 7,
      codeLineHighlights: codeLineHighlights.outerLoop
    });
  }

  trace.push({
    id: "bubble-complete",
    title: "정렬 완료",
    description: "모든 값이 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length)
    },
    pseudoCodeLine: 8,
    codeLineHighlights: codeLineHighlights.complete
  });

  return trace;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(end - start, 0) }, (_, index) => {
    return start + index;
  });
}

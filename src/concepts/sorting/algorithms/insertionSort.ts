import type { TraceStep } from "../../shared/types";
import type { SortingState } from "../types";

export const INSERTION_SORT_DEFAULT_INPUT = [5, 3, 8, 4, 2] as const;

const codeLineHighlights = {
  initial: {
    C: [3],
    Java: [2],
    "C++": [4],
    JavaScript: [1, 2],
    Python: [1, 2]
  },
  pickKey: {
    C: [4, 5],
    Java: [3, 4],
    "C++": [5, 6],
    JavaScript: [4, 5],
    Python: [4, 5]
  },
  compare: {
    C: [7],
    Java: [6],
    "C++": [8],
    JavaScript: [7],
    Python: [7]
  },
  shift: {
    C: [8, 9],
    Java: [7, 8],
    "C++": [9, 10],
    JavaScript: [8, 9],
    Python: [8, 9]
  },
  insert: {
    C: [11],
    Java: [10],
    "C++": [12],
    JavaScript: [11],
    Python: [11]
  },
  complete: {
    C: [13],
    Java: [12],
    "C++": [14],
    JavaScript: [15],
    Python: [13]
  }
} satisfies Record<string, Record<string, number[]>>;

export function generateInsertionSortTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "insertion-initial",
      title: "초기 배열",
      description: "첫 번째 값은 이미 정렬된 구간으로 보고 삽입 정렬을 시작합니다.",
      state: {
        array: [...array],
        sortedIndices: array.length > 0 ? [0] : []
      },
      pseudoCodeLine: 1,
      codeLineHighlights: codeLineHighlights.initial
    }
  ];

  let stepIndex = 1;

  for (let current = 1; current < array.length; current += 1) {
    const key = array[current];
    let scan = current - 1;

    trace.push({
      id: `insertion-${stepIndex++}-pick-key-${current}`,
      title: `${key}을 삽입할 위치 찾기`,
      description: `${key}을 key로 선택하고, 왼쪽의 정렬된 구간에서 들어갈 위치를 찾습니다.`,
      state: {
        array: [...array],
        currentIndex: current,
        keyIndex: current,
        sortedIndices: range(0, current)
      },
      pseudoCodeLine: 2,
      codeLineHighlights: codeLineHighlights.pickKey
    });

    while (scan >= 0) {
      trace.push({
        id: `insertion-${stepIndex++}-compare-${scan}-${current}`,
        title: `${array[scan]}와 key ${key} 비교`,
        description: `정렬된 구간의 ${array[scan]}와 key ${key}을 비교합니다. 왼쪽 값이 더 크면 오른쪽으로 이동합니다.`,
        state: {
          array: [...array],
          currentIndex: current,
          keyIndex: scan + 1,
          scanningIndex: scan,
          comparingIndices: [scan, scan + 1],
          sortedIndices: range(0, current)
        },
        pseudoCodeLine: 4,
        codeLineHighlights: codeLineHighlights.compare
      });

      if (array[scan] <= key) {
        break;
      }

      const shiftedValue = array[scan];
      array[scan + 1] = array[scan];

      trace.push({
        id: `insertion-${stepIndex++}-shift-${scan}`,
        title: `${shiftedValue}를 오른쪽으로 이동`,
        description: `${shiftedValue}가 key ${key}보다 크므로 한 칸 오른쪽으로 이동합니다.`,
        state: {
          array: [...array],
          currentIndex: current,
          keyIndex: scan,
          scanningIndex: scan,
          shiftedIndices: [scan + 1],
          sortedIndices: range(0, current)
        },
        pseudoCodeLine: 5,
        codeLineHighlights: codeLineHighlights.shift
      });

      scan -= 1;
    }

    array[scan + 1] = key;

    trace.push({
      id: `insertion-${stepIndex++}-insert-${scan + 1}`,
      title: `${key}을 ${scan + 1}번 위치에 삽입`,
      description: `비어 있는 위치에 key ${key}을 넣어 정렬된 구간을 한 칸 넓힙니다.`,
      state: {
        array: [...array],
        currentIndex: current,
        keyIndex: scan + 1,
        sortedIndices: range(0, current + 1)
      },
      pseudoCodeLine: 6,
      codeLineHighlights: codeLineHighlights.insert
    });
  }

  trace.push({
    id: "insertion-complete",
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

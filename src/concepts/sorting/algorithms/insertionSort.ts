import type { TraceStep } from "../../shared/types";
import type { SortingState } from "../types";
import { sameLineHighlights } from "./codeLineMaps";

export const INSERTION_SORT_DEFAULT_INPUT = [
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

const binaryInsertionCodeLineHighlights = {
  initial: sameLineHighlights(1, 2),
  pickKey: sameLineHighlights(2, 3),
  search: sameLineHighlights(4, 5, 6),
  narrow: sameLineHighlights(7, 8),
  shift: sameLineHighlights(10),
  insert: sameLineHighlights(11),
  complete: sameLineHighlights(12),
};

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

export function generateBinaryInsertionSortTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "binary-insertion-initial",
      title: "초기 배열",
      description: "삽입 위치를 이진 탐색으로 찾는 삽입 정렬을 시작합니다.",
      state: {
        array: [...array],
        sortedIndices: array.length > 0 ? [0] : [],
      },
      pseudoCodeLine: 1,
      codeLineHighlights: binaryInsertionCodeLineHighlights.initial,
    },
  ];

  let stepIndex = 1;

  for (let current = 1; current < array.length; current += 1) {
    const key = array[current]!;
    let left = 0;
    let right = current;

    trace.push({
      id: `binary-insertion-${stepIndex++}-pick-key-${current}`,
      title: `${key}의 삽입 위치 이진 탐색`,
      description: "왼쪽 정렬 구간에서 key가 들어갈 위치를 이진 탐색으로 찾습니다.",
      state: {
        array: [...array],
        currentIndex: current,
        keyIndex: current,
        searchRange: [left, right - 1],
        sortedIndices: range(0, current),
      },
      pseudoCodeLine: 2,
      codeLineHighlights: binaryInsertionCodeLineHighlights.pickKey,
    });

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      trace.push({
        id: `binary-insertion-${stepIndex++}-search-${current}-${mid}`,
        title: `중앙 ${mid}번 값 ${array[mid]}와 key ${key} 비교`,
        description: "중앙 값이 key보다 작거나 같으면 오른쪽 절반, 더 크면 왼쪽 절반을 탐색합니다.",
        state: {
          array: [...array],
          currentIndex: current,
          keyIndex: current,
          scanningIndex: mid,
          comparingIndices: [mid, current],
          searchRange: [left, right - 1],
          sortedIndices: range(0, current),
        },
        pseudoCodeLine: 3,
        codeLineHighlights: binaryInsertionCodeLineHighlights.search,
      });

      if (array[mid]! <= key) {
        left = mid + 1;
      } else {
        right = mid;
      }

      if (left < right) {
        trace.push({
          id: `binary-insertion-${stepIndex++}-narrow-${left}-${right}`,
          title: `탐색 구간을 ${left}~${right - 1}로 축소`,
          description: "비교 결과에 따라 삽입 위치 후보 구간을 절반으로 줄입니다.",
          state: {
            array: [...array],
            currentIndex: current,
            keyIndex: current,
            searchRange: [left, right - 1],
            sortedIndices: range(0, current),
          },
          pseudoCodeLine: 4,
          codeLineHighlights: binaryInsertionCodeLineHighlights.narrow,
        });
      }
    }

    for (let shift = current; shift > left; shift -= 1) {
      array[shift] = array[shift - 1]!;
      trace.push({
        id: `binary-insertion-${stepIndex++}-shift-${shift}`,
        title: `${array[shift]}를 오른쪽으로 이동`,
        description: "찾아낸 삽입 위치를 비우기 위해 값들을 한 칸씩 오른쪽으로 이동합니다.",
        state: {
          array: [...array],
          currentIndex: current,
          keyIndex: left,
          shiftedIndices: [shift],
          searchRange: [left, current - 1],
          sortedIndices: range(0, current),
        },
        pseudoCodeLine: 5,
        codeLineHighlights: binaryInsertionCodeLineHighlights.shift,
      });
    }

    array[left] = key;

    trace.push({
      id: `binary-insertion-${stepIndex++}-insert-${left}`,
      title: `${key}를 ${left}번 위치에 삽입`,
      description: "이진 탐색으로 찾은 위치에 key를 넣어 정렬 구간을 넓힙니다.",
      state: {
        array: [...array],
        currentIndex: current,
        keyIndex: left,
        sortedIndices: range(0, current + 1),
      },
      pseudoCodeLine: 6,
      codeLineHighlights: binaryInsertionCodeLineHighlights.insert,
    });
  }

  trace.push({
    id: "binary-insertion-complete",
    title: "정렬 완료",
    description: "모든 key가 이진 탐색으로 찾은 위치에 삽입되어 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length),
    },
    pseudoCodeLine: 7,
    codeLineHighlights: binaryInsertionCodeLineHighlights.complete,
  });

  return trace;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(end - start, 0) }, (_, index) => {
    return start + index;
  });
}

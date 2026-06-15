import type { TraceStep } from "../../shared/types";
import type { SortingState } from "../types";

export const SELECTION_SORT_DEFAULT_INPUT = [5, 3, 8, 4, 2] as const;

const codeLineHighlights = {
  initial: {
    C: [3],
    Java: [2],
    "C++": [4],
    JavaScript: [1, 2],
    Python: [1, 2]
  },
  startPosition: {
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
  newMinimum: {
    C: [8],
    Java: [7],
    "C++": [9],
    JavaScript: [8],
    Python: [8]
  },
  swap: {
    C: [11, 12, 13, 14],
    Java: [10, 11, 12, 13],
    "C++": [12, 13, 14, 15],
    JavaScript: [11, 12, 13, 14],
    Python: [11]
  },
  complete: {
    C: [17],
    Java: [16],
    "C++": [18],
    JavaScript: [18],
    Python: [13]
  }
} satisfies Record<string, Record<string, number[]>>;

export function generateSelectionSortTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "selection-initial",
      title: "초기 배열",
      description: "아직 정렬되지 않은 배열에서 선택 정렬을 시작합니다.",
      state: {
        array: [...array],
        sortedIndices: []
      },
      pseudoCodeLine: 1,
      codeLineHighlights: codeLineHighlights.initial
    }
  ];

  let stepIndex = 1;

  for (let current = 0; current < array.length - 1; current += 1) {
    let minimumIndex = current;

    trace.push({
      id: `selection-${stepIndex++}-start-${current}`,
      title: `${current}번 위치에서 최소값 탐색 시작`,
      description: `${current}번 위치를 정렬할 차례입니다. 우선 이 위치의 값을 최소값으로 가정합니다.`,
      state: {
        array: [...array],
        currentIndex: current,
        minimumIndex,
        sortedIndices: range(0, current)
      },
      pseudoCodeLine: 2,
      codeLineHighlights: codeLineHighlights.startPosition
    });

    for (let scan = current + 1; scan < array.length; scan += 1) {
      trace.push({
        id: `selection-${stepIndex++}-compare-${scan}-${minimumIndex}`,
        title: `${array[scan]}과 현재 최소값 ${array[minimumIndex]} 비교`,
        description: `${scan}번 값을 현재 최소값과 비교합니다. 더 작으면 최소값 위치를 갱신합니다.`,
        state: {
          array: [...array],
          currentIndex: current,
          minimumIndex,
          scanningIndex: scan,
          comparingIndices: [scan, minimumIndex],
          sortedIndices: range(0, current)
        },
        pseudoCodeLine: 4,
        codeLineHighlights: codeLineHighlights.compare
      });

      if (array[scan] < array[minimumIndex]) {
        minimumIndex = scan;

        trace.push({
          id: `selection-${stepIndex++}-new-minimum-${scan}`,
          title: `새 최소값 ${array[minimumIndex]} 발견`,
          description: `${array[minimumIndex]}가 현재 정렬되지 않은 구간에서 가장 작은 값 후보입니다.`,
          state: {
            array: [...array],
            currentIndex: current,
            minimumIndex,
            scanningIndex: scan,
            sortedIndices: range(0, current)
          },
          pseudoCodeLine: 5,
          codeLineHighlights: codeLineHighlights.newMinimum
        });
      }
    }

    if (minimumIndex !== current) {
      const currentValue = array[current];
      array[current] = array[minimumIndex];
      array[minimumIndex] = currentValue;

      trace.push({
        id: `selection-${stepIndex++}-swap-${current}-${minimumIndex}`,
        title: `${array[current]}를 ${current}번 위치로 교환`,
        description: `찾아낸 최소값을 정렬되지 않은 구간의 맨 앞 위치로 옮깁니다.`,
        state: {
          array: [...array],
          currentIndex: current,
          minimumIndex,
          swappingIndices: [current, minimumIndex],
          sortedIndices: range(0, current)
        },
        pseudoCodeLine: 6,
        codeLineHighlights: codeLineHighlights.swap
      });
    }

    trace.push({
      id: `selection-${stepIndex++}-settled-${current}`,
      title: `${array[current]} 위치 확정`,
      description: `${current}번 위치까지 정렬된 구간으로 확정합니다.`,
      state: {
        array: [...array],
        currentIndex: current,
        sortedIndices: range(0, current + 1)
      },
      pseudoCodeLine: 7,
      codeLineHighlights: codeLineHighlights.startPosition
    });
  }

  trace.push({
    id: "selection-complete",
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

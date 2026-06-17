import type { TraceStep } from "../../shared/types";
import type { SortingState } from "../types";
import { sameLineHighlights } from "./codeLineMaps";

export const SELECTION_SORT_DEFAULT_INPUT = [
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

const maxSelectionCodeLineHighlights = {
  initial: sameLineHighlights(1),
  startPosition: sameLineHighlights(2, 3),
  compare: sameLineHighlights(4, 5),
  newMaximum: sameLineHighlights(5),
  swap: sameLineHighlights(7),
  complete: sameLineHighlights(8),
};

const bidirectionalSelectionCodeLineHighlights = {
  initial: sameLineHighlights(1, 2),
  startPosition: sameLineHighlights(3, 4),
  scan: sameLineHighlights(5),
  swapMin: sameLineHighlights(6),
  swapMax: sameLineHighlights(8),
  complete: sameLineHighlights(10),
};

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

export function generateSelectionSortMaxTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "selection-max-initial",
      title: "초기 배열",
      description: "남은 구간에서 가장 큰 값을 찾아 오른쪽 끝으로 보내는 선택 정렬을 시작합니다.",
      state: {
        array: [...array],
        sortedIndices: [],
      },
      pseudoCodeLine: 1,
      codeLineHighlights: maxSelectionCodeLineHighlights.initial,
    },
  ];

  let stepIndex = 1;

  for (let end = array.length - 1; end > 0; end -= 1) {
    let maximumIndex = 0;

    trace.push({
      id: `selection-max-${stepIndex++}-start-${end}`,
      title: `0~${end} 구간 최대값 탐색 시작`,
      description: "정렬되지 않은 구간의 오른쪽 끝에 가장 큰 값을 배치할 차례입니다.",
      state: {
        array: [...array],
        currentIndex: end,
        maximumIndex,
        sortedIndices: range(end + 1, array.length),
      },
      pseudoCodeLine: 2,
      codeLineHighlights: maxSelectionCodeLineHighlights.startPosition,
    });

    for (let scan = 1; scan <= end; scan += 1) {
      trace.push({
        id: `selection-max-${stepIndex++}-compare-${scan}-${maximumIndex}`,
        title: `${array[scan]}와 현재 최대값 ${array[maximumIndex]} 비교`,
        description: "더 큰 값을 발견하면 최대값 후보 위치를 갱신합니다.",
        state: {
          array: [...array],
          currentIndex: end,
          maximumIndex,
          scanningIndex: scan,
          comparingIndices: [scan, maximumIndex],
          sortedIndices: range(end + 1, array.length),
        },
        pseudoCodeLine: 4,
        codeLineHighlights: maxSelectionCodeLineHighlights.compare,
      });

      if (array[scan]! > array[maximumIndex]!) {
        maximumIndex = scan;

        trace.push({
          id: `selection-max-${stepIndex++}-new-maximum-${scan}`,
          title: `새 최대값 ${array[maximumIndex]} 발견`,
          description: "현재 정렬되지 않은 구간에서 가장 큰 값 후보를 갱신합니다.",
          state: {
            array: [...array],
            currentIndex: end,
            maximumIndex,
            scanningIndex: scan,
            sortedIndices: range(end + 1, array.length),
          },
          pseudoCodeLine: 5,
          codeLineHighlights: maxSelectionCodeLineHighlights.newMaximum,
        });
      }
    }

    const endValue = array[end]!;
    array[end] = array[maximumIndex]!;
    array[maximumIndex] = endValue;

    trace.push({
      id: `selection-max-${stepIndex++}-swap-${maximumIndex}-${end}`,
      title: `${array[end]}를 ${end}번 위치로 이동`,
      description: "찾아낸 최대값을 정렬되지 않은 구간의 맨 오른쪽에 배치합니다.",
      state: {
        array: [...array],
        currentIndex: end,
        maximumIndex: end,
        swappingIndices: maximumIndex === end ? [end] : [maximumIndex, end],
        sortedIndices: range(end, array.length),
      },
      pseudoCodeLine: 6,
      codeLineHighlights: maxSelectionCodeLineHighlights.swap,
    });
  }

  trace.push({
    id: "selection-max-complete",
    title: "정렬 완료",
    description: "큰 값을 오른쪽부터 확정해 배열 전체가 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length),
    },
    pseudoCodeLine: 8,
    codeLineHighlights: maxSelectionCodeLineHighlights.complete,
  });

  return trace;
}

export function generateSelectionSortBidirectionalTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "selection-bi-initial",
      title: "초기 배열",
      description: "한 패스에서 최소값은 왼쪽, 최대값은 오른쪽에 동시에 배치하는 선택 정렬을 시작합니다.",
      state: {
        array: [...array],
        sortedIndices: [],
      },
      pseudoCodeLine: 1,
      codeLineHighlights: bidirectionalSelectionCodeLineHighlights.initial,
    },
  ];

  let start = 0;
  let end = array.length - 1;
  let stepIndex = 1;

  while (start < end) {
    let minimumIndex = start;
    let maximumIndex = start;

    trace.push({
      id: `selection-bi-${stepIndex++}-start-${start}-${end}`,
      title: `${start}~${end} 구간 최소/최대 탐색`,
      description: "남은 구간에서 가장 작은 값과 가장 큰 값을 한 번에 찾습니다.",
      state: {
        array: [...array],
        currentIndex: start,
        minimumIndex,
        maximumIndex,
        sortedIndices: [...range(0, start), ...range(end + 1, array.length)],
      },
      pseudoCodeLine: 2,
      codeLineHighlights: bidirectionalSelectionCodeLineHighlights.startPosition,
    });

    for (let scan = start; scan <= end; scan += 1) {
      if (array[scan]! < array[minimumIndex]!) {
        minimumIndex = scan;
      }
      if (array[scan]! > array[maximumIndex]!) {
        maximumIndex = scan;
      }

      trace.push({
        id: `selection-bi-${stepIndex++}-scan-${scan}`,
        title: `${scan}번 값으로 최소/최대 후보 갱신`,
        description: "현재 값이 최소 후보인지, 최대 후보인지 동시에 확인합니다.",
        state: {
          array: [...array],
          currentIndex: start,
          minimumIndex,
          maximumIndex,
          scanningIndex: scan,
          comparingIndices: [scan, minimumIndex, maximumIndex],
          sortedIndices: [...range(0, start), ...range(end + 1, array.length)],
        },
        pseudoCodeLine: 3,
        codeLineHighlights: bidirectionalSelectionCodeLineHighlights.scan,
      });
    }

    const startValue = array[start]!;
    array[start] = array[minimumIndex]!;
    array[minimumIndex] = startValue;
    if (maximumIndex === start) {
      maximumIndex = minimumIndex;
    }

    trace.push({
      id: `selection-bi-${stepIndex++}-swap-min-${start}`,
      title: `최소값 ${array[start]}를 왼쪽에 배치`,
      description: "찾아낸 최소값을 남은 구간의 맨 왼쪽으로 옮깁니다.",
      state: {
        array: [...array],
        currentIndex: start,
        minimumIndex: start,
        maximumIndex,
        swappingIndices: minimumIndex === start ? [start] : [start, minimumIndex],
        sortedIndices: [...range(0, start + 1), ...range(end + 1, array.length)],
      },
      pseudoCodeLine: 4,
      codeLineHighlights: bidirectionalSelectionCodeLineHighlights.swapMin,
    });

    const endValue = array[end]!;
    array[end] = array[maximumIndex]!;
    array[maximumIndex] = endValue;

    trace.push({
      id: `selection-bi-${stepIndex++}-swap-max-${end}`,
      title: `최대값 ${array[end]}를 오른쪽에 배치`,
      description: "찾아낸 최대값을 남은 구간의 맨 오른쪽으로 옮깁니다.",
      state: {
        array: [...array],
        currentIndex: end,
        maximumIndex: end,
        swappingIndices: maximumIndex === end ? [end] : [maximumIndex, end],
        sortedIndices: [...range(0, start + 1), ...range(end, array.length)],
      },
      pseudoCodeLine: 5,
      codeLineHighlights: bidirectionalSelectionCodeLineHighlights.swapMax,
    });

    start += 1;
    end -= 1;
  }

  trace.push({
    id: "selection-bi-complete",
    title: "정렬 완료",
    description: "양쪽 끝을 동시에 확정해 배열 전체가 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length),
    },
    pseudoCodeLine: 6,
    codeLineHighlights: bidirectionalSelectionCodeLineHighlights.complete,
  });

  return trace;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(end - start, 0) }, (_, index) => {
    return start + index;
  });
}

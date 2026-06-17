import type { TraceStep } from "../../shared/types";
import type { SortingState } from "../types";
import { sameLineHighlights } from "./codeLineMaps";

export const QUICK_SORT_DEFAULT_INPUT = [
  14, 3, 17, 8, 6, 12, 1, 19, 4, 10,
] as const;

const codeLineHighlights = {
  initial: {
    C: [20],
    Java: [19],
    "C++": [17],
    JavaScript: [1, 2],
    Python: [1, 2],
  },
  base: {
    C: [21],
    Java: [20],
    "C++": [18],
    JavaScript: [8],
    Python: [5, 6],
  },
  choosePivot: {
    C: [5],
    Java: [4],
    "C++": [6],
    JavaScript: [9],
    Python: [7],
  },
  compare: {
    C: [7],
    Java: [6],
    "C++": [8],
    JavaScript: [12],
    Python: [10],
  },
  swap: {
    C: [8, 9, 10],
    Java: [7, 8, 9],
    "C++": [9],
    JavaScript: [13],
    Python: [11],
  },
  placePivot: {
    C: [14, 15, 16],
    Java: [13, 14, 15],
    "C++": [13, 14],
    JavaScript: [16],
    Python: [13],
  },
  recurse: {
    C: [23, 24],
    Java: [22, 23],
    "C++": [20, 21],
    JavaScript: [17, 18],
    Python: [14, 15],
  },
  complete: {
    C: [25],
    Java: [24],
    "C++": [22],
    JavaScript: [4],
    Python: [18],
  },
} satisfies Record<string, Record<string, number[]>>;

const firstPivotCodeLineHighlights = {
  initial: sameLineHighlights(1),
  base: sameLineHighlights(10),
  choosePivot: sameLineHighlights(2),
  movePivot: sameLineHighlights(3),
  compare: sameLineHighlights(6, 7),
  swap: sameLineHighlights(7, 8),
  placePivot: sameLineHighlights(9),
  recurse: sameLineHighlights(10),
  complete: sameLineHighlights(10),
};

const medianPivotCodeLineHighlights = {
  initial: sameLineHighlights(1),
  base: sameLineHighlights(11),
  choosePivot: sameLineHighlights(2, 3),
  movePivot: sameLineHighlights(4),
  compare: sameLineHighlights(7, 8),
  swap: sameLineHighlights(8, 9),
  placePivot: sameLineHighlights(10),
  recurse: sameLineHighlights(11),
  complete: sameLineHighlights(11),
};

export type QuickSortPivotStrategy = "last" | "first" | "median";

export function generateQuickSortTrace(
  input: readonly number[],
  pivotStrategy: QuickSortPivotStrategy = "last",
): TraceStep<SortingState>[] {
  const array = [...input];
  const sortedIndices = new Set<number>();
  const activeCodeLineHighlights: Record<string, Record<string, number[]>> =
    pivotStrategy === "last"
      ? codeLineHighlights
      : pivotStrategy === "first"
        ? firstPivotCodeLineHighlights
        : medianPivotCodeLineHighlights;
  const idPrefix = pivotStrategy === "last" ? "quick" : `quick-${pivotStrategy}`;
  const strategyLabel =
    pivotStrategy === "last"
      ? "마지막 원소"
      : pivotStrategy === "first"
        ? "첫 원소"
        : "세 값의 중앙값";
  const trace: TraceStep<SortingState>[] = [
    {
      id: `${idPrefix}-initial`,
      title: "초기 배열",
      description: `전체 배열을 첫 파티션 구간으로 두고 ${strategyLabel} 피벗 퀵 정렬을 시작합니다.`,
      state: {
        array: [...array],
        partitionRange: array.length > 0 ? [0, array.length - 1] : undefined,
      },
      pseudoCodeLine: 1,
      codeLineHighlights: activeCodeLineHighlights.initial,
    },
  ];

  let stepIndex = 1;

  function quickSort(start: number, end: number) {
    if (start > end) {
      return;
    }

    if (start === end) {
      sortedIndices.add(start);
      trace.push({
        id: `${idPrefix}-${stepIndex++}-single-${start}`,
        title: `${start}번 위치 확정`,
        description: "한 칸짜리 구간은 이미 정렬된 상태입니다.",
        state: {
          array: [...array],
          currentIndex: start,
          sortedIndices: sortedList(),
        },
        pseudoCodeLine: 7,
        codeLineHighlights: activeCodeLineHighlights.base,
      });

      return;
    }

    let pivotIndex = choosePivotIndex(array, start, end, pivotStrategy);
    const selectedPivotValue = array[pivotIndex]!;
    let storeIndex = start;
    const medianCandidates =
      pivotStrategy === "median" ? [start, Math.floor((start + end) / 2), end] : undefined;

    trace.push({
      id: `${idPrefix}-${stepIndex++}-choose-pivot-${start}-${end}`,
      title: `${start}~${end} 구간 피벗 선택`,
      description: `${strategyLabel} 전략으로 ${pivotIndex}번 값 ${selectedPivotValue}을 피벗으로 선택합니다.`,
      state: {
        array: [...array],
        pivotIndex,
        partitionRange: [start, end],
        currentIndex: storeIndex,
        comparingIndices: medianCandidates,
        sortedIndices: sortedList(),
      },
      pseudoCodeLine: 2,
      codeLineHighlights: activeCodeLineHighlights.choosePivot,
    });

    if (pivotIndex !== end) {
      const endValue = array[end]!;
      array[end] = array[pivotIndex]!;
      array[pivotIndex] = endValue;

      trace.push({
        id: `${idPrefix}-${stepIndex++}-move-pivot-${pivotIndex}-${end}`,
        title: `피벗 ${selectedPivotValue}을 파티션 끝으로 이동`,
        description: "같은 Lomuto 파티션 흐름으로 비교하기 위해 선택한 피벗을 구간 끝으로 옮깁니다.",
        state: {
          array: [...array],
          pivotIndex: end,
          partitionRange: [start, end],
          swappingIndices: [pivotIndex, end],
          currentIndex: storeIndex,
          sortedIndices: sortedList(),
        },
        pseudoCodeLine: 2,
        codeLineHighlights:
          activeCodeLineHighlights.movePivot ?? activeCodeLineHighlights.choosePivot,
      });

      pivotIndex = end;
    }

    const pivot = array[pivotIndex]!;

    for (let scan = start; scan < end; scan += 1) {
      trace.push({
        id: `${idPrefix}-${stepIndex++}-compare-${scan}-${pivotIndex}`,
        title: `${array[scan]}와 피벗 ${pivot} 비교`,
        description: `${scan}번 값을 피벗 ${pivot}과 비교합니다. 피벗보다 작거나 같으면 왼쪽 구간으로 보냅니다.`,
        state: {
          array: [...array],
          pivotIndex,
          partitionRange: [start, end],
          currentIndex: storeIndex,
          scanningIndex: scan,
          comparingIndices: [scan, pivotIndex],
          sortedIndices: sortedList(),
        },
        pseudoCodeLine: 4,
        codeLineHighlights: activeCodeLineHighlights.compare,
      });

      if (array[scan]! <= pivot) {
        const leftValue = array[storeIndex]!;
        const scanValue = array[scan]!;
        array[storeIndex] = scanValue;
        array[scan] = leftValue;

        trace.push({
          id: `${idPrefix}-${stepIndex++}-swap-${storeIndex}-${scan}`,
          title: `${scanValue}를 작은 값 구간으로 이동`,
          description: `${scanValue}가 피벗 ${pivot}보다 작거나 같으므로 ${storeIndex}번 위치와 교환합니다.`,
          state: {
            array: [...array],
            pivotIndex,
            partitionRange: [start, end],
            currentIndex: storeIndex,
            scanningIndex: scan,
            swappingIndices: storeIndex === scan ? [scan] : [storeIndex, scan],
            sortedIndices: sortedList(),
          },
          pseudoCodeLine: 5,
          codeLineHighlights: activeCodeLineHighlights.swap,
        });

        storeIndex += 1;
      }
    }

    const pivotValue = array[pivotIndex]!;
    const boundaryValue = array[storeIndex]!;
    array[storeIndex] = pivotValue;
    array[pivotIndex] = boundaryValue;
    sortedIndices.add(storeIndex);

    trace.push({
      id: `${idPrefix}-${stepIndex++}-place-pivot-${storeIndex}`,
      title: `피벗 ${pivotValue}를 ${storeIndex}번 위치에 배치`,
      description: "피벗 왼쪽에는 피벗보다 작거나 같은 값, 오른쪽에는 더 큰 값이 오도록 피벗 위치를 확정합니다.",
      state: {
        array: [...array],
        pivotIndex: storeIndex,
        partitionRange: [start, end],
        swappingIndices:
          storeIndex === pivotIndex ? [storeIndex] : [storeIndex, pivotIndex],
        sortedIndices: sortedList(),
      },
      pseudoCodeLine: 6,
      codeLineHighlights: activeCodeLineHighlights.placePivot,
    });

    trace.push({
      id: `${idPrefix}-${stepIndex++}-recurse-${start}-${end}`,
      title: `${start}~${storeIndex - 1}, ${storeIndex + 1}~${end} 구간 재귀`,
      description: "피벗을 제외한 왼쪽 구간과 오른쪽 구간을 같은 방식으로 다시 정렬합니다.",
      state: {
        array: [...array],
        pivotIndex: storeIndex,
        partitionRange: [start, end],
        sortedIndices: sortedList(),
      },
      pseudoCodeLine: 7,
      codeLineHighlights: activeCodeLineHighlights.recurse,
    });

    quickSort(start, storeIndex - 1);
    quickSort(storeIndex + 1, end);
  }

  if (array.length > 0) {
    quickSort(0, array.length - 1);
  }

  trace.push({
    id: `${idPrefix}-complete`,
    title: "정렬 완료",
    description: "모든 피벗 위치가 확정되어 배열 전체가 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length),
    },
    pseudoCodeLine: 8,
    codeLineHighlights: activeCodeLineHighlights.complete,
  });

  return trace;

  function sortedList() {
    return [...sortedIndices].sort((left, right) => left - right);
  }
}

function choosePivotIndex(
  array: readonly number[],
  start: number,
  end: number,
  strategy: QuickSortPivotStrategy,
): number {
  if (strategy === "first") {
    return start;
  }

  if (strategy === "median") {
    const middle = Math.floor((start + end) / 2);
    const candidates = [
      { index: start, value: array[start]! },
      { index: middle, value: array[middle]! },
      { index: end, value: array[end]! },
    ].sort((left, right) => left.value - right.value);

    return candidates[1]!.index;
  }

  return end;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(end - start, 0) }, (_, index) => {
    return start + index;
  });
}

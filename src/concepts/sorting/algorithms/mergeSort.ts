import type { TraceStep } from "../../shared/types";
import type { SortingState } from "../types";
import { sameLineHighlights } from "./codeLineMaps";

export const MERGE_SORT_DEFAULT_INPUT = [
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
  split: {
    C: [4],
    Java: [3],
    "C++": [5],
    JavaScript: [4],
    Python: [4]
  },
  base: {
    C: [3],
    Java: [2],
    "C++": [4],
    JavaScript: [3],
    Python: [3]
  },
  compare: {
    C: [8],
    Java: [7],
    "C++": [9],
    JavaScript: [8],
    Python: [8]
  },
  write: {
    C: [9],
    Java: [8],
    "C++": [10],
    JavaScript: [9],
    Python: [9]
  },
  remainder: {
    C: [10],
    Java: [9],
    "C++": [11],
    JavaScript: [10],
    Python: [10]
  },
  merged: {
    C: [11],
    Java: [10],
    "C++": [12],
    JavaScript: [11],
    Python: [11]
  },
  complete: {
    C: [12],
    Java: [11],
    "C++": [13],
    JavaScript: [12],
    Python: [12]
  }
} satisfies Record<string, Record<string, number[]>>;

const bottomUpCodeLineHighlights = {
  initial: sameLineHighlights(1),
  width: sameLineHighlights(2),
  pair: sameLineHighlights(3, 4, 5),
  compare: sameLineHighlights(6),
  write: sameLineHighlights(6),
  merged: sameLineHighlights(6),
  complete: sameLineHighlights(8),
};

export function generateMergeSortTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "merge-initial",
      title: "초기 배열",
      description: "전체 배열을 하나의 병합 정렬 구간으로 보고 시작합니다.",
      state: {
        array: [...array],
        mergeRange: array.length > 0 ? [0, array.length - 1] : undefined
      },
      pseudoCodeLine: 1,
      codeLineHighlights: codeLineHighlights.initial
    }
  ];

  let stepIndex = 1;

  function mergeSort(start: number, end: number) {
    if (start >= end) {
      trace.push({
        id: `merge-${stepIndex++}-base-${start}`,
        title: `${start}번 구간 확정`,
        description: "한 칸짜리 구간은 이미 정렬된 상태입니다.",
        state: {
          array: [...array],
          mergeRange: [start, end]
        },
        pseudoCodeLine: 3,
        codeLineHighlights: codeLineHighlights.base
      });

      return;
    }

    const mid = Math.floor((start + end) / 2);

    trace.push({
      id: `merge-${stepIndex++}-split-${start}-${end}`,
      title: `${start}~${end} 구간 분할`,
      description: `${start}번부터 ${end}번까지의 구간을 ${start}~${mid}, ${mid + 1}~${end}로 나눕니다.`,
      state: {
        array: [...array],
        mergeRange: [start, end],
        leftRange: [start, mid],
        rightRange: [mid + 1, end]
      },
      pseudoCodeLine: 2,
      codeLineHighlights: codeLineHighlights.split
    });

    mergeSort(start, mid);
    mergeSort(mid + 1, end);
    merge(start, mid, end);
  }

  function merge(start: number, mid: number, end: number) {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let leftPointer = 0;
    let rightPointer = 0;
    let writeIndex = start;

    while (leftPointer < left.length && rightPointer < right.length) {
      const leftValue = left[leftPointer]!;
      const rightValue = right[rightPointer]!;
      const leftIndex = start + leftPointer;
      const rightIndex = mid + 1 + rightPointer;

      trace.push({
        id: `merge-${stepIndex++}-compare-${rightIndex}-${leftIndex}`,
        title: `${rightValue}과 ${leftValue} 비교`,
        description: `왼쪽 구간의 ${leftValue}와 오른쪽 구간의 ${rightValue} 중 더 작은 값을 기록합니다.`,
        state: {
          array: [...array],
          mergeRange: [start, end],
          leftRange: [start, mid],
          rightRange: [mid + 1, end],
          comparingIndices: [rightIndex, leftIndex],
          writeIndex
        },
        pseudoCodeLine: 4,
        codeLineHighlights: codeLineHighlights.compare
      });

      if (leftValue <= rightValue) {
        array[writeIndex] = leftValue;
        leftPointer += 1;
      } else {
        array[writeIndex] = rightValue;
        rightPointer += 1;
      }

      trace.push({
        id: `merge-${stepIndex++}-write-${writeIndex}`,
        title: `${array[writeIndex]}을 ${writeIndex}번 위치에 기록`,
        description: `선택한 값을 현재 병합 결과의 ${writeIndex}번 위치에 씁니다.`,
        state: {
          array: [...array],
          mergeRange: [start, end],
          leftRange: [start, mid],
          rightRange: [mid + 1, end],
          writeIndex
        },
        pseudoCodeLine: 5,
        codeLineHighlights: codeLineHighlights.write
      });

      writeIndex += 1;
    }

    while (leftPointer < left.length) {
      const leftValue = left[leftPointer]!;
      array[writeIndex] = leftValue;

      trace.push({
        id: `merge-${stepIndex++}-left-remainder-${writeIndex}`,
        title: `${leftValue}을 ${writeIndex}번 위치에 기록`,
        description: "오른쪽 구간을 모두 사용했으므로 왼쪽 구간의 남은 값을 순서대로 기록합니다.",
        state: {
          array: [...array],
          mergeRange: [start, end],
          leftRange: [start, mid],
          rightRange: [mid + 1, end],
          writeIndex
        },
        pseudoCodeLine: 6,
        codeLineHighlights: codeLineHighlights.remainder
      });

      leftPointer += 1;
      writeIndex += 1;
    }

    while (rightPointer < right.length) {
      const rightValue = right[rightPointer]!;
      array[writeIndex] = rightValue;

      trace.push({
        id: `merge-${stepIndex++}-right-remainder-${writeIndex}`,
        title: `${rightValue}을 ${writeIndex}번 위치에 기록`,
        description: "왼쪽 구간을 모두 사용했으므로 오른쪽 구간의 남은 값을 순서대로 기록합니다.",
        state: {
          array: [...array],
          mergeRange: [start, end],
          leftRange: [start, mid],
          rightRange: [mid + 1, end],
          writeIndex
        },
        pseudoCodeLine: 6,
        codeLineHighlights: codeLineHighlights.remainder
      });

      rightPointer += 1;
      writeIndex += 1;
    }

    trace.push({
      id: `merge-${stepIndex++}-merged-${start}-${end}`,
      title: `${start}~${end} 구간 병합 완료`,
      description: `${start}번부터 ${end}번까지의 구간이 정렬된 상태로 합쳐졌습니다.`,
      state: {
        array: [...array],
        mergeRange: [start, end],
        sortedIndices: range(start, end + 1)
      },
      pseudoCodeLine: 7,
      codeLineHighlights: codeLineHighlights.merged
    });
  }

  if (array.length > 0) {
    mergeSort(0, array.length - 1);
  }

  trace.push({
    id: "merge-complete",
    title: "정렬 완료",
    description: "모든 분할 구간이 병합되어 배열 전체가 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length)
    },
    pseudoCodeLine: 8,
    codeLineHighlights: codeLineHighlights.complete
  });

  return trace;
}

export function generateMergeSortBottomUpTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "merge-bottom-initial",
      title: "초기 배열",
      description: "한 칸짜리 구간부터 시작해 폭을 두 배씩 키우는 bottom-up 병합 정렬을 시작합니다.",
      state: {
        array: [...array],
        mergeRange: array.length > 0 ? [0, 0] : undefined,
      },
      pseudoCodeLine: 1,
      codeLineHighlights: bottomUpCodeLineHighlights.initial,
    },
  ];

  let stepIndex = 1;

  for (let width = 1; width < array.length; width *= 2) {
    trace.push({
      id: `merge-bottom-${stepIndex++}-width-${width}`,
      title: `폭 ${width} 구간 병합 시작`,
      description: `이미 정렬된 폭 ${width}짜리 구간들을 둘씩 묶어 병합합니다.`,
      state: {
        array: [...array],
        mergeRange: [0, Math.min(width - 1, array.length - 1)],
      },
      pseudoCodeLine: 2,
      codeLineHighlights: bottomUpCodeLineHighlights.width,
    });

    for (let start = 0; start < array.length; start += width * 2) {
      const mid = Math.min(start + width - 1, array.length - 1);
      const end = Math.min(start + width * 2 - 1, array.length - 1);

      if (mid >= end) {
        continue;
      }

      trace.push({
        id: `merge-bottom-${stepIndex++}-pair-${start}-${end}`,
        title: `${start}~${mid}, ${mid + 1}~${end} 구간 선택`,
        description: "인접한 두 정렬 구간을 하나의 더 큰 정렬 구간으로 병합합니다.",
        state: {
          array: [...array],
          mergeRange: [start, end],
          leftRange: [start, mid],
          rightRange: [mid + 1, end],
        },
        pseudoCodeLine: 3,
        codeLineHighlights: bottomUpCodeLineHighlights.pair,
      });

      merge(start, mid, end);
    }
  }

  trace.push({
    id: "merge-bottom-complete",
    title: "정렬 완료",
    description: "반복적으로 병합 폭을 키워 배열 전체가 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length),
    },
    pseudoCodeLine: 7,
    codeLineHighlights: bottomUpCodeLineHighlights.complete,
  });

  return trace;

  function merge(start: number, mid: number, end: number) {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let leftPointer = 0;
    let rightPointer = 0;
    let writeIndex = start;

    while (leftPointer < left.length && rightPointer < right.length) {
      const leftValue = left[leftPointer]!;
      const rightValue = right[rightPointer]!;
      const leftIndex = start + leftPointer;
      const rightIndex = mid + 1 + rightPointer;

      trace.push({
        id: `merge-bottom-${stepIndex++}-compare-${rightIndex}-${leftIndex}`,
        title: `${leftValue}와 ${rightValue} 비교`,
        description: "두 구간의 앞 값을 비교해 더 작은 값을 현재 write 위치에 기록합니다.",
        state: {
          array: [...array],
          mergeRange: [start, end],
          leftRange: [start, mid],
          rightRange: [mid + 1, end],
          comparingIndices: [leftIndex, rightIndex],
          writeIndex,
        },
        pseudoCodeLine: 4,
        codeLineHighlights: bottomUpCodeLineHighlights.compare,
      });

      if (leftValue <= rightValue) {
        array[writeIndex] = leftValue;
        leftPointer += 1;
      } else {
        array[writeIndex] = rightValue;
        rightPointer += 1;
      }

      trace.push({
        id: `merge-bottom-${stepIndex++}-write-${writeIndex}`,
        title: `${array[writeIndex]}를 ${writeIndex}번 위치에 기록`,
        description: "선택한 값을 병합 결과 위치에 씁니다.",
        state: {
          array: [...array],
          mergeRange: [start, end],
          leftRange: [start, mid],
          rightRange: [mid + 1, end],
          writeIndex,
        },
        pseudoCodeLine: 5,
        codeLineHighlights: bottomUpCodeLineHighlights.write,
      });

      writeIndex += 1;
    }

    while (leftPointer < left.length) {
      array[writeIndex] = left[leftPointer]!;
      trace.push({
        id: `merge-bottom-${stepIndex++}-left-${writeIndex}`,
        title: `${array[writeIndex]}를 ${writeIndex}번 위치에 기록`,
        description: "왼쪽 구간에 남은 값을 순서대로 기록합니다.",
        state: {
          array: [...array],
          mergeRange: [start, end],
          leftRange: [start, mid],
          rightRange: [mid + 1, end],
          writeIndex,
        },
        pseudoCodeLine: 5,
        codeLineHighlights: bottomUpCodeLineHighlights.write,
      });
      leftPointer += 1;
      writeIndex += 1;
    }

    while (rightPointer < right.length) {
      array[writeIndex] = right[rightPointer]!;
      trace.push({
        id: `merge-bottom-${stepIndex++}-right-${writeIndex}`,
        title: `${array[writeIndex]}를 ${writeIndex}번 위치에 기록`,
        description: "오른쪽 구간에 남은 값을 순서대로 기록합니다.",
        state: {
          array: [...array],
          mergeRange: [start, end],
          leftRange: [start, mid],
          rightRange: [mid + 1, end],
          writeIndex,
        },
        pseudoCodeLine: 5,
        codeLineHighlights: bottomUpCodeLineHighlights.write,
      });
      rightPointer += 1;
      writeIndex += 1;
    }

    trace.push({
      id: `merge-bottom-${stepIndex++}-merged-${start}-${end}`,
      title: `${start}~${end} 구간 병합 완료`,
      description: "선택한 두 구간이 하나의 정렬된 구간으로 합쳐졌습니다.",
      state: {
        array: [...array],
        mergeRange: [start, end],
        sortedIndices: range(start, end + 1),
      },
      pseudoCodeLine: 6,
      codeLineHighlights: bottomUpCodeLineHighlights.merged,
    });
  }
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(end - start, 0) }, (_, index) => {
    return start + index;
  });
}

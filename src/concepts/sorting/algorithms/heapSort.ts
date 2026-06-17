import type { TraceStep } from "../../shared/types";
import type { SortingState } from "../types";
import { sameLineHighlights } from "./codeLineMaps";

export const HEAP_SORT_DEFAULT_INPUT = [
  14, 3, 17, 8, 6, 12, 1, 19, 4, 10,
] as const;

const floydCodeLineHighlights = {
  initial: sameLineHighlights(1),
  build: sameLineHighlights(2),
  compare: sameLineHighlights(2),
  swap: sameLineHighlights(2),
  extract: sameLineHighlights(4),
  siftDown: sameLineHighlights(5),
  complete: sameLineHighlights(6),
};

const insertionBuildCodeLineHighlights = {
  initial: sameLineHighlights(1),
  build: sameLineHighlights(2),
  compare: sameLineHighlights(2),
  swap: sameLineHighlights(2),
  extract: sameLineHighlights(4),
  siftDown: sameLineHighlights(5),
  complete: sameLineHighlights(6),
};

export type HeapSortBuildStrategy = "floyd" | "insertion";

export function generateHeapSortTrace(
  input: readonly number[],
  buildStrategy: HeapSortBuildStrategy = "floyd",
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: `heap-${buildStrategy}-initial`,
      title: "초기 배열",
      description:
        buildStrategy === "floyd"
          ? "마지막 내부 노드부터 아래로 내리며 max heap을 만드는 힙 정렬을 시작합니다."
          : "값을 하나씩 heap에 삽입하듯 올리며 max heap을 만드는 힙 정렬을 시작합니다.",
      state: {
        array: [...array],
        heapRange: array.length > 0 ? [0, array.length - 1] : undefined,
        sortedIndices: [],
      },
      pseudoCodeLine: 1,
      codeLineHighlights: lineMap(buildStrategy).initial,
    },
  ];
  let stepIndex = 1;

  if (buildStrategy === "floyd") {
    for (let root = Math.floor(array.length / 2) - 1; root >= 0; root -= 1) {
      trace.push({
        id: `heap-floyd-${stepIndex++}-heapify-root-${root}`,
        title: `${root}번 노드에서 sift down`,
        description: "아래쪽 부분 heap을 믿고 현재 노드를 알맞은 위치로 내려 max heap 조건을 맞춥니다.",
        state: {
          array: [...array],
          currentIndex: root,
          heapRange: [0, array.length - 1],
          sortedIndices: [],
        },
        pseudoCodeLine: 2,
        codeLineHighlights: floydCodeLineHighlights.build,
      });
      siftDown(root, array.length, "build");
    }
  } else {
    for (let index = 1; index < array.length; index += 1) {
      trace.push({
        id: `heap-insertion-${stepIndex++}-insert-${index}`,
        title: `${index}번 값을 heap에 삽입`,
        description: "새 값을 heap 끝에 둔 뒤 부모와 비교하며 위로 올립니다.",
        state: {
          array: [...array],
          currentIndex: index,
          heapRange: [0, index],
          sortedIndices: [],
        },
        pseudoCodeLine: 2,
        codeLineHighlights: insertionBuildCodeLineHighlights.build,
      });
      siftUp(index);
    }
  }

  trace.push({
    id: `heap-${buildStrategy}-${stepIndex++}-built`,
    title: "max heap 구성 완료",
    description: "루트에는 현재 heap에서 가장 큰 값이 놓입니다.",
    state: {
      array: [...array],
      currentIndex: 0,
      heapRange: array.length > 0 ? [0, array.length - 1] : undefined,
    },
    pseudoCodeLine: 3,
    codeLineHighlights: lineMap(buildStrategy).build,
  });

  for (let end = array.length - 1; end > 0; end -= 1) {
    const maxValue = array[0]!;
    array[0] = array[end]!;
    array[end] = maxValue;

    trace.push({
      id: `heap-${buildStrategy}-${stepIndex++}-extract-${end}`,
      title: `최대값 ${maxValue}를 ${end}번 위치에 확정`,
      description: "루트의 최대값을 heap 끝으로 보내 정렬 완료 구간에 넣습니다.",
      state: {
        array: [...array],
        heapRange: end - 1 >= 0 ? [0, end - 1] : undefined,
        swappingIndices: [0, end],
        sortedIndices: range(end, array.length),
      },
      pseudoCodeLine: 4,
      codeLineHighlights: lineMap(buildStrategy).extract,
    });

    siftDown(0, end, "sort");
  }

  trace.push({
    id: `heap-${buildStrategy}-complete`,
    title: "정렬 완료",
    description: "heap의 최대값을 하나씩 뒤로 보내 배열 전체가 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length),
    },
    pseudoCodeLine: 6,
    codeLineHighlights: lineMap(buildStrategy).complete,
  });

  return trace;

  function siftUp(index: number) {
    let child = index;

    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      trace.push({
        id: `heap-insertion-${stepIndex++}-compare-${child}-${parent}`,
        title: `자식 ${array[child]}와 부모 ${array[parent]} 비교`,
        description: "자식이 부모보다 크면 위로 올려 max heap 조건을 복구합니다.",
        state: {
          array: [...array],
          heapRange: [0, index],
          currentIndex: child,
          comparingIndices: [child, parent],
          sortedIndices: [],
        },
        pseudoCodeLine: 2,
        codeLineHighlights: insertionBuildCodeLineHighlights.compare,
      });

      if (array[parent]! >= array[child]!) {
        break;
      }

      const parentValue = array[parent]!;
      array[parent] = array[child]!;
      array[child] = parentValue;

      trace.push({
        id: `heap-insertion-${stepIndex++}-swap-${child}-${parent}`,
        title: `${array[parent]}를 부모 위치로 올림`,
        description: "더 큰 자식 값을 부모 위치로 올립니다.",
        state: {
          array: [...array],
          heapRange: [0, index],
          swappingIndices: [child, parent],
          sortedIndices: [],
        },
        pseudoCodeLine: 2,
        codeLineHighlights: insertionBuildCodeLineHighlights.swap,
      });

      child = parent;
    }
  }

  function siftDown(root: number, heapSize: number, phase: "build" | "sort") {
    let parent = root;

    while (true) {
      const left = parent * 2 + 1;
      const right = left + 1;
      let largest = parent;

      if (left < heapSize && array[left]! > array[largest]!) {
        largest = left;
      }
      if (right < heapSize && array[right]! > array[largest]!) {
        largest = right;
      }

      const compared = [parent, left, right].filter((index) => index < heapSize);

      trace.push({
        id: `heap-${buildStrategy}-${stepIndex++}-${phase}-compare-${parent}`,
        title: `${parent}번 노드와 자식 비교`,
        description: "부모와 두 자식 중 가장 큰 값을 찾아 parent 위치에 올릴지 판단합니다.",
        state: {
          array: [...array],
          currentIndex: parent,
          maximumIndex: largest,
          comparingIndices: compared,
          heapRange: heapSize > 0 ? [0, heapSize - 1] : undefined,
          sortedIndices: range(heapSize, array.length),
        },
        pseudoCodeLine: phase === "build" ? 2 : 5,
        codeLineHighlights:
          phase === "build"
            ? lineMap(buildStrategy).compare
            : lineMap(buildStrategy).siftDown,
      });

      if (largest === parent) {
        break;
      }

      const parentValue = array[parent]!;
      array[parent] = array[largest]!;
      array[largest] = parentValue;

      trace.push({
        id: `heap-${buildStrategy}-${stepIndex++}-${phase}-swap-${parent}-${largest}`,
        title: `${array[parent]}를 위로 올림`,
        description: "가장 큰 자식과 부모를 교환해 max heap 조건을 복구합니다.",
        state: {
          array: [...array],
          heapRange: heapSize > 0 ? [0, heapSize - 1] : undefined,
          swappingIndices: [parent, largest],
          sortedIndices: range(heapSize, array.length),
        },
        pseudoCodeLine: phase === "build" ? 2 : 5,
        codeLineHighlights: lineMap(buildStrategy).swap,
      });

      parent = largest;
    }
  }
}

function lineMap(strategy: HeapSortBuildStrategy) {
  return strategy === "floyd" ? floydCodeLineHighlights : insertionBuildCodeLineHighlights;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(end - start, 0) }, (_, index) => start + index);
}

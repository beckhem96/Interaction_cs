import type { TraceStep } from "../../shared/types";
import type {
  TreeEdgeState,
  TreeMotion,
  TreeNodeState,
  TreeOperation,
  TreeTraceState
} from "../types";
import { createTreeCodeHighlights } from "./codeHighlights";

export const HEAP_INSERT_VALUES = [45, 32, 18, 27, 12, 9, 14, 50, 41];

type HeapStepOptions = {
  activeNodeId?: string;
  codeLines: number[];
  comparedNodeId?: string;
  description: string;
  heap: number[];
  id: string;
  insertedNodeId?: string;
  motion: TreeMotion;
  operation: TreeOperation;
  pathNodeIds?: string[];
  pseudoCodeLine: number;
  removedNodeId?: string;
  swappedNodeIds?: string[];
  targetValue?: number;
  title: string;
  traversalValues?: number[];
};

export function generateHeapTrace(
  values: readonly number[] = HEAP_INSERT_VALUES
): TraceStep<TreeTraceState>[] {
  const heap: number[] = [];
  const trace: TraceStep<TreeTraceState>[] = [
    createStep({
      id: "heap-start",
      title: "빈 최대 힙 준비",
      description: "최대 힙은 부모가 자식보다 크거나 같도록 배열과 완전 이진트리 구조를 함께 유지합니다.",
      heap,
      operation: "insert",
      motion: "idle",
      targetValue: values[0],
      pseudoCodeLine: 1,
      codeLines: [1]
    })
  ];

  for (const value of values) {
    appendInsertTrace(trace, heap, value);
  }

  appendExtractMaxTrace(trace, heap);

  trace.push(
    createStep({
      id: "heap-complete",
      title: "최대 힙 실습 완료",
      description: "삽입과 최대값 삭제가 끝났습니다. 모든 부모 노드가 자식보다 크거나 같은 상태입니다.",
      heap,
      operation: "rebalance",
      motion: "complete",
      traversalValues: [...heap],
      pseudoCodeLine: 8,
      codeLines: [21]
    })
  );

  return trace;
}

function appendInsertTrace(
  trace: TraceStep<TreeTraceState>[],
  heap: number[],
  value: number
) {
  heap.push(value);
  let index = heap.length - 1;

  trace.push(
    createStep({
      id: `heap-insert-${value}-append`,
      title: `${value}를 마지막 위치에 삽입`,
      description: `${value}를 배열 끝에 넣어 완전 이진트리 모양을 먼저 유지합니다.`,
      heap,
      operation: "insert",
      motion: "insert",
      activeNodeId: getNodeId(index),
      insertedNodeId: getNodeId(index),
      targetValue: value,
      pseudoCodeLine: 1,
      codeLines: [2, 3]
    })
  );

  while (index > 0) {
    const parentIndex = getParentIndex(index);
    const childValue = heap[index];
    const parentValue = heap[parentIndex];

    trace.push(
      createStep({
        id: `heap-compare-up-${value}-${index}-${parentIndex}`,
        title: `${childValue}와 부모 ${parentValue} 비교`,
        description: `새 값 ${childValue}가 부모 ${parentValue}보다 큰지 확인합니다.`,
        heap,
        operation: "rebalance",
        motion: "compare",
        activeNodeId: getNodeId(index),
        comparedNodeId: getNodeId(parentIndex),
        pathNodeIds: [getNodeId(parentIndex), getNodeId(index)],
        targetValue: value,
        pseudoCodeLine: 2,
        codeLines: [4, 5, 6]
      })
    );

    if (parentValue >= childValue) {
      trace.push(
        createStep({
          id: `heap-stable-up-${value}-${index}`,
          title: `${childValue} 위치 확정`,
          description: `부모 ${parentValue}가 더 크거나 같으므로 bubble-up을 멈춥니다.`,
          heap,
          operation: "rebalance",
          motion: "balance",
          activeNodeId: getNodeId(index),
          comparedNodeId: getNodeId(parentIndex),
          pathNodeIds: [getNodeId(parentIndex), getNodeId(index)],
          targetValue: value,
          pseudoCodeLine: 3,
          codeLines: [6]
        })
      );
      return;
    }

    swap(heap, parentIndex, index);
    trace.push(
      createStep({
        id: `heap-swap-up-${value}-${index}-${parentIndex}`,
        title: `${childValue}를 부모와 교환`,
        description: `${childValue}가 부모 ${parentValue}보다 커서 두 위치를 바꿉니다.`,
        heap,
        operation: "rebalance",
        motion: "swap",
        activeNodeId: getNodeId(parentIndex),
        swappedNodeIds: [getNodeId(parentIndex), getNodeId(index)],
        targetValue: value,
        pseudoCodeLine: 4,
        codeLines: [7, 8]
      })
    );
    index = parentIndex;
  }
}

function appendExtractMaxTrace(
  trace: TraceStep<TreeTraceState>[],
  heap: number[]
) {
  if (heap.length === 0) {
    return;
  }

  const maxValue = heap[0];
  const lastValue = heap.at(-1)!;

  trace.push(
    createStep({
      id: `heap-extract-start-${maxValue}`,
      title: `최대값 ${maxValue} 삭제 시작`,
      description: `루트 ${maxValue}가 최대값이므로 먼저 루트를 제거 대상으로 표시합니다.`,
      heap,
      operation: "delete",
      motion: "remove",
      activeNodeId: getNodeId(0),
      removedNodeId: getNodeId(0),
      targetValue: maxValue,
      pseudoCodeLine: 5,
      codeLines: [11, 12]
    })
  );

  if (heap.length === 1) {
    heap.pop();
    return;
  }

  heap[0] = lastValue;
  heap.pop();

  trace.push(
    createStep({
      id: `heap-extract-replace-root-${lastValue}`,
      title: `마지막 값 ${lastValue}를 루트로 이동`,
      description: "완전 이진트리 모양을 유지하기 위해 마지막 값을 루트 자리로 옮깁니다.",
      heap,
      operation: "delete",
      motion: "replace",
      activeNodeId: getNodeId(0),
      targetValue: maxValue,
      pseudoCodeLine: 6,
      codeLines: [13, 14]
    })
  );

  let index = 0;

  while (true) {
    const childIndex = getLargerChildIndex(heap, index);

    if (childIndex === undefined) {
      trace.push(
        createStep({
          id: `heap-leaf-after-extract-${heap[index]}`,
          title: `${heap[index]} 위치 확정`,
          description: "더 내려갈 자식이 없으므로 heapify-down을 끝냅니다.",
          heap,
          operation: "rebalance",
          motion: "balance",
          activeNodeId: getNodeId(index),
          targetValue: maxValue,
          pseudoCodeLine: 8,
          codeLines: [15]
        })
      );
      return;
    }

    trace.push(
      createStep({
        id: `heap-compare-down-${heap[index]}-${index}-${childIndex}`,
        title: `${heap[index]}와 더 큰 자식 ${heap[childIndex]} 비교`,
        description: `두 자식 중 더 큰 값 ${heap[childIndex]}와 현재 노드 ${heap[index]}를 비교합니다.`,
        heap,
        operation: "rebalance",
        motion: "compare",
        activeNodeId: getNodeId(index),
        comparedNodeId: getNodeId(childIndex),
        pathNodeIds: [getNodeId(index), getNodeId(childIndex)],
        targetValue: maxValue,
        pseudoCodeLine: 7,
        codeLines: [15, 16, 17]
      })
    );

    if (heap[index] >= heap[childIndex]) {
      trace.push(
        createStep({
          id: `heap-stable-down-${heap[index]}-${index}`,
          title: `${heap[index]} 위치 확정`,
          description: `${heap[index]}가 더 큰 자식 ${heap[childIndex]}보다 크거나 같으므로 힙 속성이 회복되었습니다.`,
          heap,
          operation: "rebalance",
          motion: "balance",
          activeNodeId: getNodeId(index),
          comparedNodeId: getNodeId(childIndex),
          pathNodeIds: [getNodeId(index), getNodeId(childIndex)],
          targetValue: maxValue,
          pseudoCodeLine: 8,
          codeLines: [17]
        })
      );
      return;
    }

    const parentValue = heap[index];
    const childValue = heap[childIndex];

    swap(heap, index, childIndex);
    trace.push(
      createStep({
        id: `heap-swap-down-${parentValue}-${index}-${childIndex}`,
        title: `${parentValue}를 더 큰 자식과 교환`,
        description: `${parentValue}보다 자식 ${childValue}가 더 크므로 아래로 내려보냅니다.`,
        heap,
        operation: "rebalance",
        motion: "swap",
        activeNodeId: getNodeId(childIndex),
        swappedNodeIds: [getNodeId(index), getNodeId(childIndex)],
        targetValue: maxValue,
        pseudoCodeLine: 7,
        codeLines: [18, 19]
      })
    );
    index = childIndex;
  }
}

function createStep({
  activeNodeId,
  codeLines,
  comparedNodeId,
  description,
  heap,
  id,
  insertedNodeId,
  motion,
  operation,
  pathNodeIds,
  pseudoCodeLine,
  removedNodeId,
  swappedNodeIds,
  targetValue,
  title,
  traversalValues
}: HeapStepOptions): TraceStep<TreeTraceState> {
  const renderedTree = renderHeap(heap);

  return {
    id,
    title,
    description,
    state: {
      operation,
      motion,
      nodes: renderedTree.nodes,
      edges: renderedTree.edges,
      viewport: renderedTree.viewport,
      activeNodeId,
      comparedNodeId,
      heapArrayValues: [...heap],
      insertedNodeId,
      pathNodeIds,
      removedNodeId,
      swappedNodeIds,
      targetValue,
      traversalValues,
      summaryItems: createSummaryItems({
        heap,
        motion,
        nodes: renderedTree.nodes,
        operation,
        targetValue,
        traversalValues
      })
    },
    pseudoCodeLine,
    codeLineHighlights: createTreeCodeHighlights(codeLines)
  };
}

function renderHeap(heap: readonly number[]): {
  edges: TreeEdgeState[];
  nodes: TreeNodeState[];
  viewport: { width: number; height: number };
} {
  if (heap.length === 0) {
    return {
      nodes: [],
      edges: [],
      viewport: { width: 720, height: 260 }
    };
  }

  const maxDepth = getDepth(heap.length - 1);
  const width = Math.max(720, 2 ** maxDepth * 92);
  const yGap = 86;
  const height = Math.max(300, (maxDepth + 1) * yGap + 80);
  const nodes: TreeNodeState[] = heap.map((value, index) => {
    const depth = getDepth(index);
    const firstIndexAtDepth = 2 ** depth - 1;
    const positionInDepth = index - firstIndexAtDepth;
    const nodesInDepth = 2 ** depth;

    return {
      id: getNodeId(index),
      value,
      x: ((positionInDepth + 1) * width) / (nodesInDepth + 1),
      y: 56 + depth * yGap,
      depth,
      leftId: getLeftIndex(index) < heap.length ? getNodeId(getLeftIndex(index)) : undefined,
      rightId: getRightIndex(index) < heap.length ? getNodeId(getRightIndex(index)) : undefined
    };
  });
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edges: TreeEdgeState[] = [];

  for (const node of nodes) {
    for (const toId of [node.leftId, node.rightId]) {
      if (toId === undefined) {
        continue;
      }

      const child = nodeById.get(toId);

      if (child === undefined) {
        continue;
      }

      edges.push({
        id: `${node.id}-${child.id}`,
        fromId: node.id,
        toId: child.id,
        fromX: node.x,
        fromY: node.y,
        toX: child.x,
        toY: child.y
      });
    }
  }

  return { nodes, edges, viewport: { width, height } };
}

function getLargerChildIndex(
  heap: readonly number[],
  index: number
): number | undefined {
  const leftIndex = getLeftIndex(index);
  const rightIndex = getRightIndex(index);

  if (leftIndex >= heap.length) {
    return undefined;
  }

  if (rightIndex >= heap.length) {
    return leftIndex;
  }

  return heap[leftIndex] >= heap[rightIndex] ? leftIndex : rightIndex;
}

function createSummaryItems({
  heap,
  motion,
  nodes,
  operation,
  targetValue,
  traversalValues
}: {
  heap: readonly number[];
  motion: TreeMotion;
  nodes: readonly TreeNodeState[];
  operation: TreeOperation;
  targetValue?: number;
  traversalValues?: readonly number[];
}) {
  const operationLabel: Record<TreeOperation, string> = {
    insert: "삽입",
    search: "탐색",
    traversal: "순회",
    rebalance: "힙 복구",
    delete: "삭제"
  };

  const motionLabel: Record<TreeMotion, string> = {
    idle: "준비",
    compare: "비교",
    descend: "이동",
    insert: "삽입",
    balance: "규칙 확인",
    rotate: "회전",
    recolor: "색 변경",
    swap: "교환",
    remove: "제거",
    replace: "대체",
    found: "발견",
    visit: "방문",
    complete: "완료"
  };

  const displayedValues = traversalValues ?? heap;

  return [
    { label: "연산", value: operationLabel[operation] },
    { label: "상태", value: motionLabel[motion] },
    { label: "노드 수", value: `${nodes.length}개` },
    {
      label: traversalValues?.length
        ? "최종 힙"
        : heap.length
          ? "힙 배열"
          : "삽입 값",
      value: displayedValues.length
        ? displayedValues.join(", ")
        : targetValue === undefined
          ? "-"
          : String(targetValue)
    }
  ];
}

function getNodeId(index: number): string {
  return `heap-index-${index}`;
}

function getParentIndex(index: number): number {
  return Math.floor((index - 1) / 2);
}

function getLeftIndex(index: number): number {
  return index * 2 + 1;
}

function getRightIndex(index: number): number {
  return index * 2 + 2;
}

function getDepth(index: number): number {
  return Math.floor(Math.log2(index + 1));
}

function swap(heap: number[], leftIndex: number, rightIndex: number) {
  [heap[leftIndex], heap[rightIndex]] = [heap[rightIndex], heap[leftIndex]];
}

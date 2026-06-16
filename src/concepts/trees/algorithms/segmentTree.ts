import type { TraceStep } from "../../shared/types";
import type {
  TreeEdgeState,
  TreeMotion,
  TreeNodeState,
  TreeOperation,
  TreeTraceState
} from "../types";
import { createTreeCodeHighlights } from "./codeHighlights";

export const SEGMENT_TREE_VALUES = [5, 8, 6, 3, 7, 2, 9, 4];
export const SEGMENT_TREE_QUERY_RANGE = [2, 6] as const;
export const SEGMENT_TREE_UPDATE = { index: 3, value: 10 };

type SegmentNode = {
  id: string;
  left: number;
  right: number;
  depth: number;
  sum: number;
  leftId?: string;
  rightId?: string;
};

type RuntimeSegmentTree = {
  nodes: Map<string, SegmentNode>;
  values: number[];
};

type QueryPhase = "initial" | "after-update";

type SegmentStepOptions = {
  activeArrayIndices?: number[];
  activeNodeId?: string;
  codeLines: number[];
  comparedNodeId?: string;
  description: string;
  foundNodeId?: string;
  id: string;
  insertedNodeId?: string;
  motion: TreeMotion;
  operation: TreeOperation;
  pathNodeIds?: string[];
  pseudoCodeLine: number;
  queryRange?: readonly [number, number];
  segmentResult?: number;
  segmentTree: RuntimeSegmentTree;
  title: string;
  update?: { index: number; value: number };
  visitedNodeIds?: string[];
};

export function generateSegmentTreeTrace(
  values: readonly number[] = SEGMENT_TREE_VALUES,
  queryRange: readonly [number, number] = SEGMENT_TREE_QUERY_RANGE,
  update: { index: number; value: number } = SEGMENT_TREE_UPDATE
): TraceStep<TreeTraceState>[] {
  const segmentTree: RuntimeSegmentTree = {
    nodes: new Map(),
    values: [...values]
  };
  const trace: TraceStep<TreeTraceState>[] = [
    createStep({
      id: "segment-start",
      title: "세그먼트 트리 준비",
      description:
        "세그먼트 트리는 배열을 구간으로 나누고 각 노드에 해당 구간의 합을 저장합니다.",
      segmentTree,
      operation: "insert",
      motion: "idle",
      queryRange,
      pseudoCodeLine: 1,
      codeLines: [1]
    })
  ];

  if (values.length === 0) {
    return trace;
  }

  buildSegmentNode(trace, segmentTree, 0, values.length - 1, 0);
  appendRangeQueryTrace(trace, segmentTree, queryRange, "initial");
  appendUpdateTrace(trace, segmentTree, update);
  const updatedResult = appendRangeQueryTrace(
    trace,
    segmentTree,
    queryRange,
    "after-update"
  );

  trace.push(
    createStep({
      id: "segment-complete",
      title: "세그먼트 트리 실습 완료",
      description: `점 갱신 후 [${queryRange.join(", ")}] 구간 합은 ${updatedResult}입니다.`,
      segmentTree,
      operation: "search",
      motion: "complete",
      queryRange,
      update,
      segmentResult: updatedResult,
      pseudoCodeLine: 8,
      codeLines: [16, 17]
    })
  );

  return trace;
}

function buildSegmentNode(
  trace: TraceStep<TreeTraceState>[],
  segmentTree: RuntimeSegmentTree,
  left: number,
  right: number,
  depth: number
): number {
  const node = createNode(left, right, depth);
  segmentTree.nodes.set(node.id, node);

  trace.push(
    createStep({
      id: `segment-build-create-${left}-${right}`,
      title: `[${left}, ${right}] 구간 노드 생성`,
      description: `[${left}, ${right}] 범위를 담당할 노드를 만들고 자식 구간을 준비합니다.`,
      segmentTree,
      operation: "insert",
      motion: "insert",
      activeNodeId: node.id,
      insertedNodeId: node.id,
      pseudoCodeLine: 1,
      codeLines: [1]
    })
  );

  if (left === right) {
    node.sum = segmentTree.values[left];
    trace.push(
      createStep({
        id: `segment-build-leaf-${left}`,
        title: `배열 ${left}번 값을 리프에 저장`,
        description: `리프 노드 [${left}, ${right}]는 배열 값 ${node.sum}을 그대로 저장합니다.`,
        segmentTree,
        operation: "insert",
        motion: "found",
        activeArrayIndices: [left],
        activeNodeId: node.id,
        foundNodeId: node.id,
        pseudoCodeLine: 2,
        codeLines: [2, 3, 4]
      })
    );

    return node.sum;
  }

  const mid = getMid(left, right);
  node.leftId = getNodeId(left, mid);
  node.rightId = getNodeId(mid + 1, right);
  const leftSum = buildSegmentNode(trace, segmentTree, left, mid, depth + 1);
  const rightSum = buildSegmentNode(
    trace,
    segmentTree,
    mid + 1,
    right,
    depth + 1
  );
  node.sum = leftSum + rightSum;

  trace.push(
    createStep({
      id: `segment-build-combine-${left}-${right}`,
      title: `[${left}, ${right}] 구간 합 ${node.sum} 계산`,
      description: `왼쪽 합 ${leftSum}와 오른쪽 합 ${rightSum}를 더해 [${left}, ${right}] 노드에 ${node.sum}을 저장합니다.`,
      segmentTree,
      operation: "insert",
      motion: "balance",
      activeNodeId: node.id,
      pathNodeIds: [node.id, node.leftId, node.rightId],
      visitedNodeIds: [node.leftId, node.rightId],
      segmentResult: node.sum,
      pseudoCodeLine: 3,
      codeLines: [6, 7, 8, 9]
    })
  );

  return node.sum;
}

function appendRangeQueryTrace(
  trace: TraceStep<TreeTraceState>[],
  segmentTree: RuntimeSegmentTree,
  queryRange: readonly [number, number],
  phase: QueryPhase
): number {
  const phaseLabel = phase === "initial" ? "초기" : "갱신 후";

  trace.push(
    createStep({
      id: `segment-query-${phase}-start`,
      title: `${phaseLabel} 구간 합 질의 시작`,
      description: `[${queryRange.join(", ")}] 범위와 각 노드 구간이 겹치는지 확인합니다.`,
      segmentTree,
      operation: "search",
      motion: "idle",
      queryRange,
      pseudoCodeLine: 4,
      codeLines: [12]
    })
  );

  return querySegmentNode(
    trace,
    segmentTree,
    0,
    segmentTree.values.length - 1,
    queryRange,
    phase,
    []
  );
}

function querySegmentNode(
  trace: TraceStep<TreeTraceState>[],
  segmentTree: RuntimeSegmentTree,
  left: number,
  right: number,
  queryRange: readonly [number, number],
  phase: QueryPhase,
  pathNodeIds: string[]
): number {
  const node = getNode(segmentTree, left, right);
  const currentPath = [...pathNodeIds, node.id];
  const [queryLeft, queryRight] = queryRange;

  trace.push(
    createStep({
      id: `segment-query-${phase}-check-${left}-${right}`,
      title: `[${left}, ${right}] 구간 겹침 확인`,
      description: `[${left}, ${right}] 노드가 질의 범위 [${queryLeft}, ${queryRight}]와 어떻게 겹치는지 확인합니다.`,
      segmentTree,
      operation: "search",
      motion: "compare",
      activeNodeId: node.id,
      comparedNodeId: node.id,
      pathNodeIds: currentPath,
      queryRange,
      pseudoCodeLine: 4,
      codeLines: [13, 14]
    })
  );

  if (right < queryLeft || queryRight < left) {
    trace.push(
      createStep({
        id: `segment-query-${phase}-skip-${left}-${right}`,
        title: `[${left}, ${right}] 구간 제외`,
        description: "질의 범위와 겹치지 않으므로 이 노드는 0을 반환합니다.",
        segmentTree,
        operation: "search",
        motion: "compare",
        activeNodeId: node.id,
        pathNodeIds: currentPath,
        queryRange,
        segmentResult: 0,
        pseudoCodeLine: 5,
        codeLines: [13]
      })
    );

    return 0;
  }

  if (queryLeft <= left && right <= queryRight) {
    trace.push(
      createStep({
        id: `segment-query-${phase}-take-${left}-${right}`,
        title: `[${left}, ${right}] 구간 전체 사용`,
        description: `[${left}, ${right}]가 질의 범위에 완전히 포함되므로 저장된 합 ${node.sum}을 그대로 사용합니다.`,
        segmentTree,
        operation: "search",
        motion: "found",
        activeNodeId: node.id,
        foundNodeId: node.id,
        pathNodeIds: currentPath,
        queryRange,
        segmentResult: node.sum,
        pseudoCodeLine: 6,
        codeLines: [14]
      })
    );

    return node.sum;
  }

  const mid = getMid(left, right);
  const leftResult = querySegmentNode(
    trace,
    segmentTree,
    left,
    mid,
    queryRange,
    phase,
    currentPath
  );
  const rightResult = querySegmentNode(
    trace,
    segmentTree,
    mid + 1,
    right,
    queryRange,
    phase,
    currentPath
  );
  const total = leftResult + rightResult;

  trace.push(
    createStep({
      id: `segment-query-${phase}-combine-${left}-${right}`,
      title: `[${left}, ${right}] 부분 결과 ${total} 결합`,
      description: `왼쪽 결과 ${leftResult}와 오른쪽 결과 ${rightResult}를 더해 ${total}을 반환합니다.`,
      segmentTree,
      operation: "search",
      motion: "found",
      activeNodeId: node.id,
      foundNodeId: node.id,
      pathNodeIds: currentPath,
      queryRange,
      segmentResult: total,
      pseudoCodeLine: 7,
      codeLines: [16, 17]
    })
  );

  return total;
}

function appendUpdateTrace(
  trace: TraceStep<TreeTraceState>[],
  segmentTree: RuntimeSegmentTree,
  update: { index: number; value: number }
) {
  trace.push(
    createStep({
      id: `segment-update-start-${update.index}`,
      title: `인덱스 ${update.index} 점 갱신 시작`,
      description: `${update.index}번 값을 ${update.value}로 바꾸기 위해 루트부터 해당 리프까지 내려갑니다.`,
      segmentTree,
      operation: "rebalance",
      motion: "idle",
      activeArrayIndices: [update.index],
      update,
      pseudoCodeLine: 8,
      codeLines: [20]
    })
  );

  updateSegmentNode(
    trace,
    segmentTree,
    0,
    segmentTree.values.length - 1,
    update,
    []
  );
}

function updateSegmentNode(
  trace: TraceStep<TreeTraceState>[],
  segmentTree: RuntimeSegmentTree,
  left: number,
  right: number,
  update: { index: number; value: number },
  pathNodeIds: string[]
): number {
  const node = getNode(segmentTree, left, right);
  const currentPath = [...pathNodeIds, node.id];

  trace.push(
    createStep({
      id: `segment-update-check-${left}-${right}`,
      title: `[${left}, ${right}] 갱신 경로 확인`,
      description: `인덱스 ${update.index}가 [${left}, ${right}] 구간 안에 있는지 확인합니다.`,
      segmentTree,
      operation: "rebalance",
      motion: "compare",
      activeArrayIndices: [update.index],
      activeNodeId: node.id,
      comparedNodeId: node.id,
      pathNodeIds: currentPath,
      update,
      pseudoCodeLine: 8,
      codeLines: [25, 26, 27]
    })
  );

  if (left === right) {
    segmentTree.values[update.index] = update.value;
    node.sum = update.value;

    trace.push(
      createStep({
        id: `segment-update-leaf-${update.index}`,
        title: `인덱스 ${update.index} 값을 ${update.value}으로 갱신`,
        description: `리프 [${left}, ${right}]의 합을 새 값 ${update.value}로 바꿉니다.`,
        segmentTree,
        operation: "rebalance",
        motion: "replace",
        activeArrayIndices: [update.index],
        activeNodeId: node.id,
        foundNodeId: node.id,
        pathNodeIds: currentPath,
        segmentResult: update.value,
        update,
        pseudoCodeLine: 9,
        codeLines: [21, 22, 23]
      })
    );

    return node.sum;
  }

  const mid = getMid(left, right);

  if (update.index <= mid) {
    updateSegmentNode(trace, segmentTree, left, mid, update, currentPath);
  } else {
    updateSegmentNode(trace, segmentTree, mid + 1, right, update, currentPath);
  }

  const leftChild = getNode(segmentTree, left, mid);
  const rightChild = getNode(segmentTree, mid + 1, right);
  const previousSum = node.sum;
  node.sum = leftChild.sum + rightChild.sum;

  trace.push(
    createStep({
      id: `segment-update-recompute-${left}-${right}`,
      title: `[${left}, ${right}] 구간 합 ${previousSum} → ${node.sum}`,
      description: `자식 합이 바뀌었으므로 [${left}, ${right}] 노드를 ${leftChild.sum} + ${rightChild.sum} = ${node.sum}으로 갱신합니다.`,
      segmentTree,
      operation: "rebalance",
      motion: "balance",
      activeArrayIndices: [update.index],
      activeNodeId: node.id,
      pathNodeIds: currentPath,
      segmentResult: node.sum,
      update,
      visitedNodeIds: [leftChild.id, rightChild.id],
      pseudoCodeLine: 10,
      codeLines: [28, 29]
    })
  );

  return node.sum;
}

function createStep({
  activeArrayIndices,
  activeNodeId,
  codeLines,
  comparedNodeId,
  description,
  foundNodeId,
  id,
  insertedNodeId,
  motion,
  operation,
  pathNodeIds,
  pseudoCodeLine,
  queryRange,
  segmentResult,
  segmentTree,
  title,
  update,
  visitedNodeIds
}: SegmentStepOptions): TraceStep<TreeTraceState> {
  const renderedTree = renderSegmentTree(segmentTree);

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
      activeArrayIndices,
      activeNodeId,
      comparedNodeId,
      foundNodeId,
      insertedNodeId,
      pathNodeIds,
      segmentArrayValues: [...segmentTree.values],
      segmentQueryRange: queryRange,
      segmentResult,
      segmentUpdate: update,
      visitedNodeIds,
      summaryItems: createSummaryItems({
        motion,
        nodeCount: renderedTree.nodes.length,
        operation,
        queryRange,
        segmentResult,
        update
      })
    },
    pseudoCodeLine,
    codeLineHighlights: createTreeCodeHighlights(codeLines)
  };
}

function renderSegmentTree(segmentTree: RuntimeSegmentTree): {
  edges: TreeEdgeState[];
  nodes: TreeNodeState[];
  viewport: { width: number; height: number };
} {
  const valuesLength = Math.max(segmentTree.values.length, 1);
  const leafGap = 88;
  const yGap = 92;
  const width = Math.max(720, (valuesLength - 1) * leafGap + 120);
  const nodes = [...segmentTree.nodes.values()]
    .sort((left, right) => left.depth - right.depth || left.left - right.left)
    .map<TreeNodeState>((node) => ({
      id: node.id,
      value: node.sum,
      subLabel: `[${node.left},${node.right}]`,
      x: 60 + ((node.left + node.right) / 2) * leafGap,
      y: 56 + node.depth * yGap,
      depth: node.depth,
      leftId: node.leftId,
      rightId: node.rightId
    }));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edges: TreeEdgeState[] = [];

  for (const node of nodes) {
    for (const toId of [node.leftId, node.rightId]) {
      const child = toId === undefined ? undefined : nodeById.get(toId);

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

  const maxDepth = Math.max(0, ...nodes.map((node) => node.depth));

  return {
    nodes,
    edges,
    viewport: {
      width,
      height: Math.max(340, (maxDepth + 1) * yGap + 100)
    }
  };
}

function createSummaryItems({
  motion,
  nodeCount,
  operation,
  queryRange,
  segmentResult,
  update
}: {
  motion: TreeMotion;
  nodeCount: number;
  operation: TreeOperation;
  queryRange?: readonly [number, number];
  segmentResult?: number;
  update?: { index: number; value: number };
}) {
  const operationLabel: Record<TreeOperation, string> = {
    insert: "구축",
    search: "구간 질의",
    traversal: "순회",
    rebalance: "점 갱신",
    delete: "삭제"
  };

  const motionLabel: Record<TreeMotion, string> = {
    idle: "준비",
    compare: "구간 비교",
    descend: "이동",
    insert: "노드 생성",
    balance: "합 갱신",
    rotate: "회전",
    recolor: "색 변경",
    swap: "교환",
    remove: "제거",
    replace: "값 교체",
    found: "구간 사용",
    visit: "방문",
    complete: "완료"
  };

  const target = update
    ? `index ${update.index} → ${update.value}`
    : queryRange
      ? `[${queryRange.join(", ")}]`
      : "-";

  return [
    { label: "연산", value: operationLabel[operation] },
    { label: "상태", value: motionLabel[motion] },
    { label: "노드 수", value: `${nodeCount}개` },
    {
      label: segmentResult === undefined ? "대상" : "결과",
      value: segmentResult === undefined ? target : String(segmentResult)
    }
  ];
}

function createNode(left: number, right: number, depth: number): SegmentNode {
  return {
    id: getNodeId(left, right),
    left,
    right,
    depth,
    sum: 0
  };
}

function getNode(
  segmentTree: RuntimeSegmentTree,
  left: number,
  right: number
): SegmentNode {
  const node = segmentTree.nodes.get(getNodeId(left, right));

  if (node === undefined) {
    throw new Error(`Missing segment node [${left}, ${right}]`);
  }

  return node;
}

function getNodeId(left: number, right: number): string {
  return `segment-${left}-${right}`;
}

function getMid(left: number, right: number): number {
  return Math.floor((left + right) / 2);
}

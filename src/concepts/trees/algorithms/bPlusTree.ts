import type { TraceStep } from "../../shared/types";
import type {
  TreeEdgeState,
  TreeMotion,
  TreeNodeState,
  TreeOperation,
  TreeTraceState
} from "../types";
import {
  createTreeCodeHighlights,
  type TreeCodeHighlightMap,
} from "./codeHighlights";

export const BPLUS_TREE_INSERT_VALUES = [10, 20, 5, 6, 12, 30, 7, 17, 4, 3, 2];
export const BPLUS_TREE_RANGE = [6, 20] as const;
export const BPLUS_TREE_MAX_KEYS = 3;

const bPlusTreeLineMap = {
  "5,6,7,8,9": { Python: [5, 6, 7, 8, 9] },
  "14,15": { Python: [12, 13] },
  "16,17": { Python: [14, 15] },
  "20,21": { Python: [17, 18] },
  "23,24,31,32,33,34": { Python: [20, 21, 27, 28, 29, 30] },
  "23,24,26": { Python: [20, 21, 23] },
  "25,26": { Python: [22, 23] },
  "37,38": { Python: [32, 33] },
  "38": { Python: [33] },
  "40,41": { Python: [35, 36] },
  "42,43": { Python: [37, 38] },
  "45": { Python: [39] },
} satisfies TreeCodeHighlightMap;

type MutableBPlusNode = {
  id: string;
  keys: number[];
  children: MutableBPlusNode[];
  leaf: boolean;
  next?: MutableBPlusNode;
};

type RuntimeBPlusTree = {
  nextId: number;
  root: MutableBPlusNode;
};

type SplitResult = {
  kind: "leaf" | "internal";
  left: MutableBPlusNode;
  right: MutableBPlusNode;
  separator: number;
};

type BPlusStepOptions = {
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
  targetText?: string;
  targetValue?: number;
  title: string;
  traversalValues?: number[];
  tree: RuntimeBPlusTree;
  visitedNodeIds?: string[];
};

export function generateBPlusTreeTrace(
  values: readonly number[] = BPLUS_TREE_INSERT_VALUES,
  range: readonly [number, number] = BPLUS_TREE_RANGE
): TraceStep<TreeTraceState>[] {
  const tree: RuntimeBPlusTree = {
    nextId: 1,
    root: createNode(1, true)
  };
  const trace: TraceStep<TreeTraceState>[] = [
    createStep({
      id: "bplus-start",
      title: "빈 B+Tree 준비",
      description:
        "B+Tree는 내부 노드에 separator를 두고, 실제 데이터 key는 leaf 노드에 모아 leaf link로 range scan을 빠르게 처리합니다.",
      tree,
      operation: "insert",
      motion: "idle",
      targetValue: values[0],
      pseudoCodeLine: 1,
      codeLines: [1]
    })
  ];

  for (const value of values) {
    appendInsertTrace(trace, tree, value);
  }

  appendRangeScanTrace(trace, tree, range);

  return trace;
}

function appendInsertTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeBPlusTree,
  value: number
) {
  trace.push(
    createStep({
      id: `bplus-insert-start-${value}`,
      title: `${value} 삽입 시작`,
      description: `${value}가 들어갈 leaf를 separator key와 비교하며 찾습니다.`,
      tree,
      operation: "insert",
      motion: "compare",
      activeNodeId: tree.root.id,
      comparedNodeId: tree.root.id,
      targetValue: value,
      pseudoCodeLine: 1,
      codeLines: [3, 4]
    })
  );

  const split = insertRecursive(trace, tree, tree.root, value, []);

  if (split === undefined) {
    return;
  }

  const oldRoot = tree.root;
  const newRoot = createRuntimeNode(tree, false);
  newRoot.keys = [split.separator];
  newRoot.children = [oldRoot, split.right];
  tree.root = newRoot;

  trace.push(
    createStep({
      id: `bplus-root-split-apply-${value}-${split.separator}`,
      title: `${split.separator}를 새 루트 separator로 승격`,
      description: `루트가 넘쳤으므로 ${split.separator}를 새 루트 separator로 두고 왼쪽과 오른쪽 자식을 연결합니다.`,
      tree,
      operation: "rebalance",
      motion: "balance",
      activeNodeId: newRoot.id,
      insertedNodeId: split.right.id,
      pathNodeIds: [newRoot.id, split.left.id, split.right.id],
      targetValue: value,
      visitedNodeIds: [split.left.id, split.right.id],
      pseudoCodeLine: 2,
      codeLines: [5, 6, 7, 8, 9]
    })
  );
}

function insertRecursive(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeBPlusTree,
  node: MutableBPlusNode,
  value: number,
  pathNodeIds: string[]
): SplitResult | undefined {
  const currentPath = [...pathNodeIds, node.id];

  trace.push(
    createStep({
      id: `bplus-insert-check-${value}-${node.id}`,
      title: `${value} 삽입 위치 확인`,
      description: node.leaf
        ? `leaf [${node.keys.join(", ") || "빈 노드"}]에서 ${value}가 들어갈 위치를 찾습니다.`
        : `separator [${node.keys.join(", ")}]를 기준으로 ${value}가 내려갈 자식을 고릅니다.`,
      tree,
      operation: "insert",
      motion: "compare",
      activeNodeId: node.id,
      comparedNodeId: node.id,
      pathNodeIds: currentPath,
      targetValue: value,
      pseudoCodeLine: node.leaf ? 3 : 4,
      codeLines: node.leaf ? [14, 15] : [20, 21]
    })
  );

  if (node.leaf) {
    insertSorted(node.keys, value);

    trace.push(
      createStep({
        id: `bplus-insert-leaf-${value}-${node.id}`,
        title: `${value}를 leaf에 삽입`,
        description: `${value}를 정렬된 위치에 넣어 leaf를 [${node.keys.join(", ")}]로 만듭니다.`,
        tree,
        operation: "insert",
        motion: "insert",
        activeNodeId: node.id,
        insertedNodeId: node.id,
        pathNodeIds: currentPath,
        targetValue: value,
        pseudoCodeLine: 3,
        codeLines: [14, 15]
      })
    );

    if (!isOverflow(node)) {
      return undefined;
    }

    trace.push(
      createStep({
        id: `bplus-leaf-overflow-${value}-${node.id}`,
        title: `leaf [${node.keys.join(", ")}] split 필요`,
        description:
          "leaf key가 최대 3개를 넘어섰으므로 오른쪽 leaf를 만들고 첫 key를 부모 separator로 복사합니다.",
        tree,
        operation: "rebalance",
        motion: "compare",
        activeNodeId: node.id,
        comparedNodeId: node.id,
        pathNodeIds: currentPath,
        targetValue: value,
        pseudoCodeLine: 5,
        codeLines: [16, 17]
      })
    );

    return splitLeaf(tree, node);
  }

  const childIndex = findChildIndex(node.keys, value);
  const child = node.children[childIndex];

  trace.push(
    createStep({
      id: `bplus-descend-${value}-${node.id}-${child.id}`,
      title: `${value}가 내려갈 자식 선택`,
      description: `${value}는 separator 구간상 ${childIndex}번 자식 [${child.keys.join(", ")}]로 내려갑니다.`,
      tree,
      operation: "insert",
      motion: "descend",
      activeNodeId: node.id,
      comparedNodeId: child.id,
      pathNodeIds: [...currentPath, child.id],
      targetValue: value,
      pseudoCodeLine: 4,
      codeLines: [20, 21]
    })
  );

  const split = insertRecursive(trace, tree, child, value, currentPath);

  if (split === undefined) {
    return undefined;
  }

  node.keys.splice(childIndex, 0, split.separator);
  node.children.splice(childIndex + 1, 0, split.right);

  trace.push(
    createStep({
      id: `bplus-${split.kind}-split-apply-${value}-${split.separator}`,
      title: `${split.separator} separator 부모에 복사`,
      description:
        split.kind === "leaf"
          ? `leaf split 후 오른쪽 leaf의 첫 key ${split.separator}를 부모 separator로 복사합니다.`
          : `internal split 후 ${split.separator}를 부모 separator로 올립니다.`,
      tree,
      operation: "rebalance",
      motion: "balance",
      activeNodeId: node.id,
      insertedNodeId: split.right.id,
      pathNodeIds: [...currentPath, split.left.id, split.right.id],
      targetValue: value,
      visitedNodeIds: [split.left.id, split.right.id],
      pseudoCodeLine: 6,
      codeLines:
        split.kind === "leaf" ? [23, 24, 31, 32, 33, 34] : [23, 24, 26]
    })
  );

  if (!isOverflow(node)) {
    return undefined;
  }

  trace.push(
    createStep({
      id: `bplus-internal-overflow-${value}-${node.id}`,
      title: `internal [${node.keys.join(", ")}] split 필요`,
      description:
        "부모 separator도 최대 개수를 넘었으므로 internal 노드를 나누고 중간 separator를 위로 올립니다.",
      tree,
      operation: "rebalance",
      motion: "compare",
      activeNodeId: node.id,
      comparedNodeId: node.id,
      pathNodeIds: currentPath,
      targetValue: value,
      pseudoCodeLine: 7,
      codeLines: [25, 26]
    })
  );

  return splitInternal(tree, node);
}

function splitLeaf(
  tree: RuntimeBPlusTree,
  leaf: MutableBPlusNode
): SplitResult {
  const right = createRuntimeNode(tree, true);
  const splitIndex = Math.ceil(leaf.keys.length / 2);

  right.keys = leaf.keys.splice(splitIndex);
  right.next = leaf.next;
  leaf.next = right;

  return {
    kind: "leaf",
    left: leaf,
    right,
    separator: right.keys[0]
  };
}

function splitInternal(
  tree: RuntimeBPlusTree,
  node: MutableBPlusNode
): SplitResult {
  const right = createRuntimeNode(tree, false);
  const promoteIndex = Math.floor(node.keys.length / 2);
  const separator = node.keys[promoteIndex];

  right.keys = node.keys.slice(promoteIndex + 1);
  right.children = node.children.slice(promoteIndex + 1);
  node.keys = node.keys.slice(0, promoteIndex);
  node.children = node.children.slice(0, promoteIndex + 1);

  return {
    kind: "internal",
    left: node,
    right,
    separator
  };
}

function appendRangeScanTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeBPlusTree,
  range: readonly [number, number]
) {
  const [rangeStart, rangeEnd] = range;
  const rangeLabel = `[${rangeStart}, ${rangeEnd}]`;
  let node = tree.root;
  const pathNodeIds = [node.id];
  const results: number[] = [];

  trace.push(
    createStep({
      id: "bplus-range-start",
      title: `${rangeLabel} range scan 시작`,
      description:
        "B+Tree range scan은 먼저 시작 key가 들어갈 leaf를 찾고, 이후 leaf link를 따라 오른쪽으로 이동합니다.",
      tree,
      operation: "traversal",
      motion: "idle",
      targetText: rangeLabel,
      pseudoCodeLine: 8,
      codeLines: [37, 38]
    })
  );

  while (!node.leaf) {
    const childIndex = findChildIndex(node.keys, rangeStart);
    const child = node.children[childIndex];

    trace.push(
      createStep({
        id: `bplus-range-descend-${node.id}-${child.id}`,
        title: `${rangeStart} 시작 leaf 경로 선택`,
        description: `[${node.keys.join(", ")}] separator를 보고 ${rangeStart}가 들어갈 자식 [${child.keys.join(", ")}]로 내려갑니다.`,
        tree,
        operation: "traversal",
        motion: "descend",
        activeNodeId: node.id,
        comparedNodeId: child.id,
        pathNodeIds: [...pathNodeIds, child.id],
        targetText: rangeLabel,
        pseudoCodeLine: 8,
        codeLines: [38]
      })
    );

    node = child;
    pathNodeIds.push(node.id);
  }

  while (node !== undefined) {
    const collected = node.keys.filter(
      (key) => rangeStart <= key && key <= rangeEnd
    );
    results.push(...collected);

    trace.push(
      createStep({
        id: `bplus-range-visit-${node.id}`,
        title: `leaf [${node.keys.join(", ")}] 스캔`,
        description: collected.length
          ? `현재 leaf에서 범위 안의 key ${collected.join(", ")}를 결과에 추가합니다.`
          : "현재 leaf에는 범위 안의 key가 없어 다음 leaf link를 확인합니다.",
        tree,
        operation: "traversal",
        motion: collected.length ? "found" : "visit",
        activeNodeId: node.id,
        foundNodeId: collected.length ? node.id : undefined,
        pathNodeIds: [...pathNodeIds],
        targetText: rangeLabel,
        traversalValues: [...results],
        pseudoCodeLine: 9,
        codeLines: [40, 41]
      })
    );

    if (node.keys.some((key) => key > rangeEnd) || node.next === undefined) {
      break;
    }

    trace.push(
      createStep({
        id: `bplus-range-link-${node.id}-${node.next.id}`,
        title: "leaf link로 다음 leaf 이동",
        description: `아직 범위 끝 ${rangeEnd}에 도달하지 않았으므로 leaf link를 따라 [${node.next.keys.join(", ")}]로 이동합니다.`,
        tree,
        operation: "traversal",
        motion: "descend",
        activeNodeId: node.id,
        comparedNodeId: node.next.id,
        pathNodeIds: [node.id, node.next.id],
        targetText: rangeLabel,
        traversalValues: [...results],
        pseudoCodeLine: 10,
        codeLines: [42, 43]
      })
    );

    node = node.next;
  }

  trace.push(
    createStep({
      id: "bplus-range-complete",
      title: `${rangeLabel} range scan 완료`,
      description: `leaf link scan 결과는 ${results.join(", ")}입니다.`,
      tree,
      operation: "traversal",
      motion: "complete",
      targetText: rangeLabel,
      traversalValues: [...results],
      pseudoCodeLine: 10,
      codeLines: [45]
    })
  );
}

function createStep({
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
  targetText,
  targetValue,
  title,
  traversalValues,
  tree,
  visitedNodeIds
}: BPlusStepOptions): TraceStep<TreeTraceState> {
  const renderedTree = renderBPlusTree(tree.root);

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
      foundNodeId,
      insertedNodeId,
      pathNodeIds,
      targetText,
      targetValue,
      traversalValues,
      visitedNodeIds,
      summaryItems: createSummaryItems({
        motion,
        nodeCount: renderedTree.nodes.length,
        operation,
        rootKeys: tree.root.keys,
        targetText,
        targetValue,
        traversalValues
      })
    },
    pseudoCodeLine,
    codeLineHighlights: createTreeCodeHighlights(codeLines, bPlusTreeLineMap)
  };
}

function renderBPlusTree(root: MutableBPlusNode): {
  edges: TreeEdgeState[];
  nodes: TreeNodeState[];
  viewport: { width: number; height: number };
} {
  const nodes: TreeNodeState[] = [];
  const edges: TreeEdgeState[] = [];
  const xById = new Map<string, number>();
  const leafGap = 132;
  const yGap = 104;
  let nextLeafX = 70;

  function place(node: MutableBPlusNode) {
    if (node.leaf) {
      xById.set(node.id, nextLeafX);
      nextLeafX += leafGap;
      return;
    }

    for (const child of node.children) {
      place(child);
    }

    const childXs = node.children.map((child) => xById.get(child.id) ?? nextLeafX);
    xById.set(node.id, (Math.min(...childXs) + Math.max(...childXs)) / 2);
  }

  function walk(node: MutableBPlusNode, depth: number) {
    const x = xById.get(node.id) ?? 70;
    const y = 58 + depth * yGap;
    const width = getNodeWidth(node.keys);

    nodes.push({
      id: node.id,
      value: node.keys[0] ?? 0,
      keyValues: [...node.keys],
      label: node.keys.length ? node.keys.join(" | ") : "빈",
      subLabel: node.leaf ? "leaf data" : "separator",
      shape: "key-list",
      width,
      x,
      y,
      depth
    });

    for (const child of node.children) {
      const childX = xById.get(child.id) ?? x;
      const childY = 58 + (depth + 1) * yGap;

      edges.push({
        id: `${node.id}-${child.id}`,
        fromId: node.id,
        toId: child.id,
        fromX: x,
        fromY: y,
        toX: childX,
        toY: childY
      });
      walk(child, depth + 1);
    }
  }

  place(root);
  walk(root, 0);

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  for (const leaf of getLinkedLeaves(root)) {
    if (leaf.next === undefined) {
      continue;
    }

    const from = nodeById.get(leaf.id);
    const to = nodeById.get(leaf.next.id);

    if (from === undefined || to === undefined) {
      continue;
    }

    edges.push({
      id: `bplus-leaf-link-${leaf.id}-${leaf.next.id}`,
      fromId: leaf.id,
      toId: leaf.next.id,
      fromX: from.x + (from.width ?? getNodeWidth(leaf.keys)) / 2 + 8,
      fromY: from.y + 36,
      toX: to.x - (to.width ?? getNodeWidth(leaf.next.keys)) / 2 - 8,
      toY: to.y + 36
    });
  }

  const maxDepth = Math.max(0, ...nodes.map((node) => node.depth));
  const width = Math.max(720, nextLeafX + 40);
  const height = Math.max(320, (maxDepth + 1) * yGap + 120);

  return { nodes, edges, viewport: { width, height } };
}

function createSummaryItems({
  motion,
  nodeCount,
  operation,
  rootKeys,
  targetText,
  targetValue,
  traversalValues
}: {
  motion: TreeMotion;
  nodeCount: number;
  operation: TreeOperation;
  rootKeys: readonly number[];
  targetText?: string;
  targetValue?: number;
  traversalValues?: readonly number[];
}) {
  const operationLabel: Record<TreeOperation, string> = {
    insert: "삽입",
    search: "탐색",
    traversal: "range scan",
    rebalance: "split",
    delete: "삭제"
  };

  const motionLabel: Record<TreeMotion, string> = {
    idle: "준비",
    compare: "separator 비교",
    descend: "leaf 이동",
    insert: "key 삽입",
    balance: "split 적용",
    rotate: "회전",
    recolor: "색 변경",
    swap: "교환",
    remove: "제거",
    replace: "대체",
    found: "수집",
    visit: "방문",
    complete: "완료"
  };

  return [
    { label: "연산", value: operationLabel[operation] },
    { label: "상태", value: motionLabel[motion] },
    { label: "노드 수", value: `${nodeCount}개` },
    {
      label: traversalValues?.length
        ? "스캔 결과"
        : targetValue === undefined
          ? "범위"
          : "대상",
      value: traversalValues?.length
        ? traversalValues.join(", ")
        : targetValue === undefined
          ? (targetText ?? rootKeys.join(", ")) || "-"
          : String(targetValue)
    }
  ];
}

function createRuntimeNode(
  tree: RuntimeBPlusTree,
  leaf: boolean
): MutableBPlusNode {
  tree.nextId += 1;
  return createNode(tree.nextId, leaf);
}

function createNode(id: number, leaf: boolean): MutableBPlusNode {
  return {
    id: `bplus-node-${id}`,
    keys: [],
    children: [],
    leaf
  };
}

function getLinkedLeaves(root: MutableBPlusNode): MutableBPlusNode[] {
  let leaf = root;

  while (!leaf.leaf) {
    leaf = leaf.children[0];
  }

  const leaves: MutableBPlusNode[] = [];
  let current: MutableBPlusNode | undefined = leaf;

  while (current !== undefined) {
    leaves.push(current);
    current = current.next;
  }

  return leaves;
}

function findChildIndex(keys: readonly number[], value: number): number {
  let index = 0;

  while (index < keys.length && value >= keys[index]) {
    index += 1;
  }

  return index;
}

function insertSorted(keys: number[], value: number) {
  let index = 0;

  while (index < keys.length && value > keys[index]) {
    index += 1;
  }

  keys.splice(index, 0, value);
}

function isOverflow(node: MutableBPlusNode): boolean {
  return node.keys.length > BPLUS_TREE_MAX_KEYS;
}

function getNodeWidth(keys: readonly number[]): number {
  return Math.max(92, keys.length * 42 + 24);
}

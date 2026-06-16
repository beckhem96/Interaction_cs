import type { TraceStep } from "../../shared/types";
import type {
  TreeEdgeState,
  TreeMotion,
  TreeNodeState,
  TreeOperation,
  TreeTraceState
} from "../types";
import { createTreeCodeHighlights } from "./codeHighlights";

export const BTREE_INSERT_VALUES = [10, 20, 5, 6, 12, 30, 7, 17];
export const BTREE_SEARCH_TARGET = 17;
export const BTREE_MAX_KEYS = 3;

type MutableBTreeNode = {
  id: string;
  keys: number[];
  children: MutableBTreeNode[];
  leaf: boolean;
};

type RuntimeBTree = {
  nextId: number;
  root: MutableBTreeNode;
};

type BTreeStepOptions = {
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
  targetValue?: number;
  title: string;
  tree: RuntimeBTree;
  visitedNodeIds?: string[];
};

export function generateBTreeTrace(
  values: readonly number[] = BTREE_INSERT_VALUES,
  searchTarget: number = BTREE_SEARCH_TARGET
): TraceStep<TreeTraceState>[] {
  const tree: RuntimeBTree = {
    nextId: 1,
    root: createNode(1, true)
  };
  const trace: TraceStep<TreeTraceState>[] = [
    createStep({
      id: "btree-start",
      title: "빈 B-Tree 준비",
      description:
        "B-Tree는 한 노드에 여러 key를 저장하고, 노드가 가득 차면 중간 key를 부모로 올려 split합니다.",
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

  appendSearchTrace(trace, tree, searchTarget);

  trace.push(
    createStep({
      id: "btree-complete",
      title: "B-Tree 실습 완료",
      description:
        "삽입 중 split이 필요한 노드는 중간 key를 부모로 올리고, 탐색은 key 구간에 맞는 자식으로 내려갑니다.",
      tree,
      operation: "search",
      motion: "complete",
      targetValue: searchTarget,
      pseudoCodeLine: 8,
      codeLines: [37, 38, 39]
    })
  );

  return trace;
}

function appendInsertTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeBTree,
  value: number
) {
  trace.push(
    createStep({
      id: `btree-insert-start-${value}`,
      title: `${value} 삽입 시작`,
      description: `${value}가 들어갈 리프를 찾기 전에 루트가 가득 찼는지 확인합니다.`,
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

  if (isFull(tree.root)) {
    const oldRoot = tree.root;
    const newRoot = createRuntimeNode(tree, false);
    newRoot.children.push(oldRoot);
    tree.root = newRoot;

    trace.push(
      createStep({
        id: `btree-root-full-${value}`,
        title: "루트가 가득 차 새 루트 생성",
        description:
          "루트에 key가 3개 있어 먼저 빈 새 루트를 만들고 기존 루트를 첫 자식으로 내려둡니다.",
        tree,
        operation: "rebalance",
        motion: "insert",
        activeNodeId: newRoot.id,
        comparedNodeId: oldRoot.id,
        pathNodeIds: [newRoot.id, oldRoot.id],
        targetValue: value,
        pseudoCodeLine: 2,
        codeLines: [4, 5, 6]
      })
    );

    splitChild(trace, tree, newRoot, 0, value, "root");

    trace.push(
      createStep({
        id: `btree-root-split-ready-${value}`,
        title: `${value} 삽입 재개`,
        description:
          "루트 split이 끝났으므로 이제 가득 차지 않은 루트에서 삽입 위치를 찾습니다.",
        tree,
        operation: "insert",
        motion: "descend",
        activeNodeId: tree.root.id,
        targetValue: value,
        pseudoCodeLine: 2,
        codeLines: [7, 8, 10]
      })
    );
  }

  insertNonFull(trace, tree, tree.root, value, []);
}

function insertNonFull(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeBTree,
  node: MutableBTreeNode,
  value: number,
  pathNodeIds: string[]
) {
  const currentPath = [...pathNodeIds, node.id];

  trace.push(
    createStep({
      id: `btree-insert-check-${value}-${node.id}`,
      title: `${value} 삽입 위치 확인`,
      description: `[${node.keys.join(", ") || "빈 노드"}] 안에서 ${value}가 들어갈 위치를 찾습니다.`,
      tree,
      operation: "insert",
      motion: "compare",
      activeNodeId: node.id,
      comparedNodeId: node.id,
      pathNodeIds: currentPath,
      targetValue: value,
      pseudoCodeLine: node.leaf ? 3 : 4,
      codeLines: node.leaf ? [24, 25] : [24, 29]
    })
  );

  if (node.leaf) {
    insertSorted(node.keys, value);

    trace.push(
      createStep({
        id: `btree-insert-leaf-${value}-${node.id}`,
        title: `${value}를 리프 노드에 삽입`,
        description: `${value}를 정렬된 key 위치에 넣어 노드를 [${node.keys.join(", ")}]로 만듭니다.`,
        tree,
        operation: "insert",
        motion: "insert",
        activeNodeId: node.id,
        insertedNodeId: node.id,
        pathNodeIds: currentPath,
        targetValue: value,
        pseudoCodeLine: 3,
        codeLines: [25, 26, 27]
      })
    );
    return;
  }

  let childIndex = findChildIndex(node.keys, value);
  let child = node.children[childIndex];

  trace.push(
    createStep({
      id: `btree-descend-${value}-${node.id}-${child.id}`,
      title: `${value}가 내려갈 자식 선택`,
      description: `${value}는 key 구간상 ${childIndex}번 자식 [${child.keys.join(", ")}]로 내려갑니다.`,
      tree,
      operation: "insert",
      motion: "descend",
      activeNodeId: node.id,
      comparedNodeId: child.id,
      pathNodeIds: [...currentPath, child.id],
      targetValue: value,
      pseudoCodeLine: 4,
      codeLines: [29, 34]
    })
  );

  if (isFull(child)) {
    trace.push(
      createStep({
        id: `btree-child-full-${value}-${child.id}`,
        title: `자식 노드 [${child.keys.join(", ")}] split 필요`,
        description:
          "내려갈 자식이 가득 찼으므로 먼저 split해서 부모에 중간 key를 올립니다.",
        tree,
        operation: "rebalance",
        motion: "compare",
        activeNodeId: child.id,
        comparedNodeId: child.id,
        pathNodeIds: [...currentPath, child.id],
        targetValue: value,
        pseudoCodeLine: 5,
        codeLines: [30, 31]
      })
    );

    const median = splitChild(trace, tree, node, childIndex, value, "child");

    if (value > median) {
      childIndex += 1;
      child = node.children[childIndex];

      trace.push(
        createStep({
          id: `btree-after-split-go-right-${value}-${child.id}`,
          title: `${value}가 승격 key 오른쪽으로 이동`,
          description: `${value}가 승격된 ${median}보다 크므로 새 오른쪽 자식 [${child.keys.join(", ")}]로 내려갑니다.`,
          tree,
          operation: "insert",
          motion: "descend",
          activeNodeId: node.id,
          comparedNodeId: child.id,
          pathNodeIds: [...currentPath, child.id],
          targetValue: value,
          pseudoCodeLine: 6,
          codeLines: [32, 34]
        })
      );
    } else {
      child = node.children[childIndex];

      trace.push(
        createStep({
          id: `btree-after-split-stay-left-${value}-${child.id}`,
          title: `${value}가 승격 key 왼쪽에 남음`,
          description: `${value}가 승격된 ${median}보다 작으므로 왼쪽 자식 [${child.keys.join(", ")}]로 내려갑니다.`,
          tree,
          operation: "insert",
          motion: "descend",
          activeNodeId: node.id,
          comparedNodeId: child.id,
          pathNodeIds: [...currentPath, child.id],
          targetValue: value,
          pseudoCodeLine: 6,
          codeLines: [32, 34]
        })
      );
    }
  }

  insertNonFull(trace, tree, child, value, currentPath);
}

function splitChild(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeBTree,
  parent: MutableBTreeNode,
  childIndex: number,
  targetValue: number,
  splitKind: "root" | "child"
): number {
  const child = parent.children[childIndex];
  const median = child.keys[1];

  trace.push(
    createStep({
      id: `btree-split-prepare-${splitKind}-${targetValue}-${child.id}`,
      title: `${median} 승격 준비`,
      description: `가득 찬 자식 [${child.keys.join(", ")}]에서 중간 key ${median}를 부모로 올릴 준비를 합니다.`,
      tree,
      operation: "rebalance",
      motion: "compare",
      activeNodeId: parent.id,
      comparedNodeId: child.id,
      pathNodeIds: [parent.id, child.id],
      targetValue,
      pseudoCodeLine: 5,
      codeLines: [14, 15, 16]
    })
  );

  const right = createRuntimeNode(tree, child.leaf);
  right.keys = child.keys.splice(2);
  child.keys.pop();

  if (!child.leaf) {
    right.children = child.children.splice(2);
  }

  parent.keys.splice(childIndex, 0, median);
  parent.children.splice(childIndex + 1, 0, right);
  parent.leaf = false;

  trace.push(
    createStep({
      id: `btree-split-apply-${splitKind}-${targetValue}-${median}`,
      title: `${median} 승격 후 노드 split`,
      description: `${median}를 부모에 올리고 왼쪽 [${child.keys.join(", ")}], 오른쪽 [${right.keys.join(", ")}] 노드로 나눕니다.`,
      tree,
      operation: "rebalance",
      motion: "balance",
      activeNodeId: parent.id,
      insertedNodeId: right.id,
      pathNodeIds: [parent.id, child.id, right.id],
      targetValue,
      visitedNodeIds: [child.id, right.id],
      pseudoCodeLine: 5,
      codeLines: [17, 18, 19, 20, 21]
    })
  );

  return median;
}

function appendSearchTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeBTree,
  targetValue: number
) {
  let node: MutableBTreeNode | undefined = tree.root;
  const pathNodeIds: string[] = [];

  while (node !== undefined) {
    pathNodeIds.push(node.id);
    const index = lowerBound(node.keys, targetValue);

    trace.push(
      createStep({
        id: `btree-search-check-${targetValue}-${node.id}`,
        title: `${targetValue} 탐색: [${node.keys.join(", ")}] 확인`,
        description: `[${node.keys.join(", ")}]에서 ${targetValue}가 있는지 확인하고, 없으면 내려갈 key 구간을 고릅니다.`,
        tree,
        operation: "search",
        motion: "compare",
        activeNodeId: node.id,
        comparedNodeId: node.id,
        pathNodeIds: [...pathNodeIds],
        targetValue,
        pseudoCodeLine: 7,
        codeLines: [37, 38, 39]
      })
    );

    if (node.keys[index] === targetValue) {
      trace.push(
        createStep({
          id: `btree-search-found-${targetValue}-${node.id}`,
          title: `${targetValue} 탐색 성공`,
          description: `${targetValue}를 현재 B-Tree 노드 안에서 찾았습니다.`,
          tree,
          operation: "search",
          motion: "found",
          activeNodeId: node.id,
          foundNodeId: node.id,
          pathNodeIds: [...pathNodeIds],
          targetValue,
          pseudoCodeLine: 7,
          codeLines: [39]
        })
      );
      return;
    }

    if (node.leaf) {
      trace.push(
        createStep({
          id: `btree-search-missing-${targetValue}-${node.id}`,
          title: `${targetValue} 탐색 실패`,
          description:
            "리프 노드까지 내려왔지만 대상 key가 없으므로 탐색을 종료합니다.",
          tree,
          operation: "search",
          motion: "complete",
          activeNodeId: node.id,
          pathNodeIds: [...pathNodeIds],
          targetValue,
          pseudoCodeLine: 8,
          codeLines: [40]
        })
      );
      return;
    }

    node = node.children[index];

    trace.push(
      createStep({
        id: `btree-search-descend-${targetValue}-${node.id}`,
        title: `${targetValue} 탐색 경로 이동`,
        description: `${targetValue}가 들어갈 수 있는 자식 노드 [${node.keys.join(", ")}]로 내려갑니다.`,
        tree,
        operation: "search",
        motion: "descend",
        activeNodeId: node.id,
        pathNodeIds: [...pathNodeIds, node.id],
        targetValue,
        pseudoCodeLine: 8,
        codeLines: [41]
      })
    );
  }
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
  targetValue,
  title,
  tree,
  visitedNodeIds
}: BTreeStepOptions): TraceStep<TreeTraceState> {
  const renderedTree = renderBTree(tree.root);

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
      targetValue,
      visitedNodeIds,
      summaryItems: createSummaryItems({
        motion,
        nodeCount: renderedTree.nodes.length,
        operation,
        rootKeys: tree.root.keys,
        targetValue
      })
    },
    pseudoCodeLine,
    codeLineHighlights: createTreeCodeHighlights(codeLines)
  };
}

function renderBTree(root: MutableBTreeNode): {
  edges: TreeEdgeState[];
  nodes: TreeNodeState[];
  viewport: { width: number; height: number };
} {
  const nodes: TreeNodeState[] = [];
  const edges: TreeEdgeState[] = [];
  const xById = new Map<string, number>();
  const leafGap = 128;
  const yGap = 104;
  let nextLeafX = 70;

  function place(node: MutableBTreeNode) {
    if (node.children.length === 0) {
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

  function walk(node: MutableBTreeNode, depth: number) {
    const x = xById.get(node.id) ?? 70;
    const y = 58 + depth * yGap;
    const width = getNodeWidth(node.keys);

    nodes.push({
      id: node.id,
      value: node.keys[0] ?? 0,
      keyValues: [...node.keys],
      label: node.keys.length ? node.keys.join(" | ") : "빈",
      subLabel: node.leaf ? "leaf" : "internal",
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

  const maxDepth = Math.max(0, ...nodes.map((node) => node.depth));
  const width = Math.max(720, nextLeafX + 40);
  const height = Math.max(300, (maxDepth + 1) * yGap + 110);

  return { nodes, edges, viewport: { width, height } };
}

function createSummaryItems({
  motion,
  nodeCount,
  operation,
  rootKeys,
  targetValue
}: {
  motion: TreeMotion;
  nodeCount: number;
  operation: TreeOperation;
  rootKeys: readonly number[];
  targetValue?: number;
}) {
  const operationLabel: Record<TreeOperation, string> = {
    insert: "삽입",
    search: "탐색",
    traversal: "순회",
    rebalance: "split",
    delete: "삭제"
  };

  const motionLabel: Record<TreeMotion, string> = {
    idle: "준비",
    compare: "key 비교",
    descend: "자식 이동",
    insert: "key 삽입",
    balance: "split 적용",
    rotate: "회전",
    recolor: "색 변경",
    swap: "교환",
    remove: "제거",
    replace: "대체",
    found: "발견",
    visit: "방문",
    complete: "완료"
  };

  return [
    { label: "연산", value: operationLabel[operation] },
    { label: "상태", value: motionLabel[motion] },
    { label: "노드 수", value: `${nodeCount}개` },
    {
      label: targetValue === undefined ? "루트 key" : "대상",
      value:
        targetValue === undefined
          ? rootKeys.join(", ") || "-"
          : String(targetValue)
    }
  ];
}

function createRuntimeNode(tree: RuntimeBTree, leaf: boolean): MutableBTreeNode {
  tree.nextId += 1;
  return createNode(tree.nextId, leaf);
}

function createNode(id: number, leaf: boolean): MutableBTreeNode {
  return {
    id: `btree-node-${id}`,
    keys: [],
    children: [],
    leaf
  };
}

function findChildIndex(keys: readonly number[], value: number): number {
  return lowerBound(keys, value);
}

function lowerBound(keys: readonly number[], value: number): number {
  let index = 0;

  while (index < keys.length && value > keys[index]) {
    index += 1;
  }

  return index;
}

function insertSorted(keys: number[], value: number) {
  keys.splice(lowerBound(keys, value), 0, value);
}

function isFull(node: MutableBTreeNode): boolean {
  return node.keys.length >= BTREE_MAX_KEYS;
}

function getNodeWidth(keys: readonly number[]): number {
  return Math.max(86, keys.length * 42 + 24);
}

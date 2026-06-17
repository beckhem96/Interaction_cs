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

export const AVL_ROTATION_VALUES = [30, 20, 10, 40, 50, 25, 27];

const avlTreeLineMap = {
  "21": { Python: [19] },
  "10,11": { Python: [9, 10] },
  "13": { Python: [12] },
  "14": { Python: [13] },
  "15,16,17": { Python: [14, 15, 16] },
  "19,20,21": { Python: [17, 18, 19] },
} satisfies TreeCodeHighlightMap;

type MutableAvlNode = {
  id: string;
  value: number;
  height: number;
  left?: MutableAvlNode;
  right?: MutableAvlNode;
};

type RuntimeAvlTree = {
  root?: MutableAvlNode;
};

export function generateAvlRotationTrace(
  values: readonly number[] = AVL_ROTATION_VALUES
): TraceStep<TreeTraceState>[] {
  const tree: RuntimeAvlTree = {};
  const trace: TraceStep<TreeTraceState>[] = [
    createStep({
      id: "avl-start",
      title: "빈 AVL 트리 준비",
      description: "AVL 트리는 삽입 후 각 노드의 balance factor를 확인하고 필요하면 회전합니다.",
      tree,
      operation: "insert",
      motion: "idle",
      targetValue: values[0],
      pseudoCodeLine: 1,
      codeLines: [1]
    })
  ];

  for (const value of values) {
    appendAvlInsertTrace(trace, tree, value);
  }

  trace.push(
    createStep({
      id: "avl-complete",
      title: "AVL 회전 실습 완료",
      description: "삽입과 균형 복구가 끝났습니다. 모든 노드의 balance factor가 -1, 0, 1 범위에 머무는지 확인합니다.",
      tree,
      operation: "rebalance",
      motion: "complete",
      pseudoCodeLine: 8,
      codeLines: [21]
    })
  );

  return trace;
}

function appendAvlInsertTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeAvlTree,
  value: number
) {
  if (tree.root === undefined) {
    tree.root = createMutableNode(value);
    refreshHeights(tree.root);
    trace.push(
      createStep({
        id: `avl-insert-${value}-root`,
        title: `${value} 루트 삽입`,
        description: `트리가 비어 있으므로 ${value}를 루트로 삽입합니다.`,
        tree,
        operation: "insert",
        motion: "insert",
        insertedNodeId: tree.root.id,
        targetValue: value,
        pseudoCodeLine: 1,
        codeLines: [2]
      })
    );
    return;
  }

  const pathNodeIds: string[] = [];
  let current = tree.root;

  while (current !== undefined) {
    pathNodeIds.push(current.id);
    trace.push(
      createStep({
        id: `avl-compare-${value}-${current.value}`,
        title: `${value}와 ${current.value} 비교`,
        description: `${value}를 삽입할 위치를 찾기 위해 ${current.value}와 비교합니다.`,
        tree,
        operation: "insert",
        motion: "compare",
        activeNodeId: current.id,
        comparedNodeId: current.id,
        pathNodeIds: [...pathNodeIds],
        targetValue: value,
        pseudoCodeLine: 2,
        codeLines: [4]
      })
    );

    if (value < current.value) {
      if (current.left === undefined) {
        current.left = createMutableNode(value);
        refreshHeights(tree.root);
        trace.push(
          createStep({
            id: `avl-insert-${value}-left-of-${current.value}`,
            title: `${value} 왼쪽 삽입`,
            description: `${value}는 ${current.value}보다 작아 왼쪽 자식으로 들어갑니다.`,
            tree,
            operation: "insert",
            motion: "insert",
            activeNodeId: current.id,
            insertedNodeId: current.left.id,
            pathNodeIds: [...pathNodeIds, current.left.id],
            targetValue: value,
            pseudoCodeLine: 3,
            codeLines: [5]
          })
        );
        break;
      }

      trace.push(
        createStep({
          id: `avl-descend-${value}-left-from-${current.value}`,
          title: `${value} 왼쪽으로 이동`,
          description: `${value}는 ${current.value}보다 작으므로 왼쪽 서브트리로 내려갑니다.`,
          tree,
          operation: "insert",
          motion: "descend",
          activeNodeId: current.left.id,
          pathNodeIds: [...pathNodeIds, current.left.id],
          targetValue: value,
          pseudoCodeLine: 3,
          codeLines: [5]
        })
      );
      current = current.left;
      continue;
    }

    if (current.right === undefined) {
      current.right = createMutableNode(value);
      refreshHeights(tree.root);
      trace.push(
        createStep({
          id: `avl-insert-${value}-right-of-${current.value}`,
          title: `${value} 오른쪽 삽입`,
          description: `${value}는 ${current.value}보다 크거나 같아 오른쪽 자식으로 들어갑니다.`,
          tree,
          operation: "insert",
          motion: "insert",
          activeNodeId: current.id,
          insertedNodeId: current.right.id,
          pathNodeIds: [...pathNodeIds, current.right.id],
          targetValue: value,
          pseudoCodeLine: 4,
          codeLines: [7]
        })
      );
      break;
    }

    trace.push(
      createStep({
        id: `avl-descend-${value}-right-from-${current.value}`,
        title: `${value} 오른쪽으로 이동`,
        description: `${value}는 ${current.value}보다 크거나 같으므로 오른쪽 서브트리로 내려갑니다.`,
        tree,
        operation: "insert",
        motion: "descend",
        activeNodeId: current.right.id,
        pathNodeIds: [...pathNodeIds, current.right.id],
        targetValue: value,
        pseudoCodeLine: 4,
        codeLines: [7]
      })
    );
    current = current.right;
  }

  appendRebalanceTrace(trace, tree, value);
}

function appendRebalanceTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeAvlTree,
  insertedValue: number
) {
  refreshHeights(tree.root);
  const unbalancedNode = findDeepestUnbalancedNode(tree.root);

  if (unbalancedNode === undefined) {
    trace.push(
      createStep({
        id: `avl-balanced-after-${insertedValue}`,
        title: `${insertedValue} 삽입 후 균형 유지`,
        description: "모든 노드의 balance factor가 -1, 0, 1 범위라 회전하지 않습니다.",
        tree,
        operation: "rebalance",
        motion: "balance",
        targetValue: insertedValue,
        pseudoCodeLine: 5,
        codeLines: [10, 11]
      })
    );
    return;
  }

  const rotationCase = getRotationCase(unbalancedNode, insertedValue);
  trace.push(
    createStep({
      id: `avl-unbalanced-${insertedValue}-${unbalancedNode.value}`,
      title: `${rotationCase} 불균형 감지`,
      description: `${unbalancedNode.value} 노드의 balance factor가 ${getBalanceFactor(unbalancedNode)}가 되어 ${rotationCase} 회전이 필요합니다.`,
      tree,
      operation: "rebalance",
      motion: "balance",
      activeNodeId: unbalancedNode.id,
      rotatedNodeIds: getRotationNodeIds(unbalancedNode),
      rotationLabel: rotationCase,
      targetValue: insertedValue,
      pseudoCodeLine: 5,
      codeLines: [10, 11]
    })
  );

  if (rotationCase === "LL") {
    const rotatedRoot = rotateRight(unbalancedNode);
    tree.root = replaceSubtreeRoot(tree.root, unbalancedNode, rotatedRoot);
    refreshHeights(tree.root);
    appendRotationStep(trace, tree, insertedValue, "LL", rotatedRoot, [
      rotatedRoot.id,
      rotatedRoot.right?.id
    ]);
    return;
  }

  if (rotationCase === "RR") {
    const rotatedRoot = rotateLeft(unbalancedNode);
    tree.root = replaceSubtreeRoot(tree.root, unbalancedNode, rotatedRoot);
    refreshHeights(tree.root);
    appendRotationStep(trace, tree, insertedValue, "RR", rotatedRoot, [
      rotatedRoot.id,
      rotatedRoot.left?.id
    ]);
    return;
  }

  if (rotationCase === "LR" && unbalancedNode.left !== undefined) {
    const oldLeft = unbalancedNode.left;
    unbalancedNode.left = rotateLeft(oldLeft);
    refreshHeights(tree.root);
    appendRotationStep(trace, tree, insertedValue, "LR 1차", unbalancedNode.left, [
      oldLeft.id,
      unbalancedNode.left.id
    ]);

    const rotatedRoot = rotateRight(unbalancedNode);
    tree.root = replaceSubtreeRoot(tree.root, unbalancedNode, rotatedRoot);
    refreshHeights(tree.root);
    appendRotationStep(trace, tree, insertedValue, "LR 2차", rotatedRoot, [
      rotatedRoot.id,
      rotatedRoot.right?.id
    ]);
    return;
  }

  if (rotationCase === "RL" && unbalancedNode.right !== undefined) {
    const oldRight = unbalancedNode.right;
    unbalancedNode.right = rotateRight(oldRight);
    refreshHeights(tree.root);
    appendRotationStep(trace, tree, insertedValue, "RL 1차", unbalancedNode.right, [
      oldRight.id,
      unbalancedNode.right.id
    ]);

    const rotatedRoot = rotateLeft(unbalancedNode);
    tree.root = replaceSubtreeRoot(tree.root, unbalancedNode, rotatedRoot);
    refreshHeights(tree.root);
    appendRotationStep(trace, tree, insertedValue, "RL 2차", rotatedRoot, [
      rotatedRoot.id,
      rotatedRoot.left?.id
    ]);
  }
}

function appendRotationStep(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeAvlTree,
  insertedValue: number,
  rotationLabel: string,
  activeNode: MutableAvlNode,
  rotatedNodeIds: (string | undefined)[]
) {
  trace.push(
    createStep({
      id: `avl-rotation-${insertedValue}-${rotationLabel}`,
      title: `${rotationLabel} 회전 적용`,
      description: `${rotationLabel} 회전으로 서브트리의 높이 차이를 다시 1 이하로 맞춥니다.`,
      tree,
      operation: "rebalance",
      motion: "rotate",
      activeNodeId: activeNode.id,
      rotatedNodeIds: rotatedNodeIds.filter((id): id is string => id !== undefined),
      rotationLabel,
      targetValue: insertedValue,
      pseudoCodeLine: 6,
      codeLines: getRotationCodeLines(rotationLabel)
    })
  );
}

function getRotationCodeLines(rotationLabel: string): number[] {
  if (rotationLabel.startsWith("LL")) {
    return [13];
  }

  if (rotationLabel.startsWith("RR")) {
    return [14];
  }

  if (rotationLabel.startsWith("LR")) {
    return [15, 16, 17];
  }

  return [19, 20, 21];
}

function createStep({
  activeNodeId,
  codeLines,
  comparedNodeId,
  description,
  id,
  insertedNodeId,
  motion,
  operation,
  pathNodeIds,
  pseudoCodeLine,
  rotatedNodeIds,
  rotationLabel,
  targetValue,
  title,
  tree
}: {
  activeNodeId?: string;
  codeLines: number[];
  comparedNodeId?: string;
  description: string;
  id: string;
  insertedNodeId?: string;
  motion: TreeMotion;
  operation: TreeOperation;
  pathNodeIds?: string[];
  pseudoCodeLine: number;
  rotatedNodeIds?: string[];
  rotationLabel?: string;
  targetValue?: number;
  title: string;
  tree: RuntimeAvlTree;
}): TraceStep<TreeTraceState> {
  const renderedTree = renderTree(tree.root);

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
      insertedNodeId,
      rotatedNodeIds,
      rotationLabel,
      targetValue,
      pathNodeIds,
      balanceFactors: renderedTree.balanceFactors,
      summaryItems: createSummaryItems({
        motion,
        nodes: renderedTree.nodes,
        operation,
        rotationLabel,
        targetValue
      })
    },
    pseudoCodeLine,
    codeLineHighlights: createTreeCodeHighlights(codeLines, avlTreeLineMap)
  };
}

function renderTree(root: MutableAvlNode | undefined): {
  balanceFactors: Record<string, number>;
  edges: TreeEdgeState[];
  nodes: TreeNodeState[];
  viewport: { width: number; height: number };
} {
  if (root === undefined) {
    return {
      balanceFactors: {},
      nodes: [],
      edges: [],
      viewport: { width: 720, height: 260 }
    };
  }

  const nodes: TreeNodeState[] = [];
  const edges: TreeEdgeState[] = [];
  const orderedNodes = getInOrderNodes(root);
  const orderById = new Map(orderedNodes.map((node, index) => [node.id, index]));
  const maxDepth = getMaxDepth(root);
  const xGap = orderedNodes.length > 8 ? 78 : 92;
  const yGap = 88;
  const width = Math.max(720, (orderedNodes.length - 1) * xGap + 120);
  const height = Math.max(300, maxDepth * yGap + 150);
  const balanceFactors = Object.fromEntries(
    orderedNodes.map((node) => [node.id, getBalanceFactor(node)])
  );

  function visit(node: MutableAvlNode, depth: number) {
    const order = orderById.get(node.id) ?? 0;
    const stateNode: TreeNodeState = {
      id: node.id,
      value: node.value,
      x: 60 + order * xGap,
      y: 56 + depth * yGap,
      depth,
      leftId: node.left?.id,
      rightId: node.right?.id
    };

    nodes.push(stateNode);

    if (node.left !== undefined) {
      visit(node.left, depth + 1);
    }

    if (node.right !== undefined) {
      visit(node.right, depth + 1);
    }
  }

  visit(root, 0);

  const nodeById = new Map(nodes.map((node) => [node.id, node]));

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

  return { balanceFactors, nodes, edges, viewport: { width, height } };
}

function rotateLeft(node: MutableAvlNode): MutableAvlNode {
  const pivot = node.right;

  if (pivot === undefined) {
    return node;
  }

  node.right = pivot.left;
  pivot.left = node;
  refreshHeights(node);
  refreshHeights(pivot);

  return pivot;
}

function rotateRight(node: MutableAvlNode): MutableAvlNode {
  const pivot = node.left;

  if (pivot === undefined) {
    return node;
  }

  node.left = pivot.right;
  pivot.right = node;
  refreshHeights(node);
  refreshHeights(pivot);

  return pivot;
}

function replaceSubtreeRoot(
  root: MutableAvlNode | undefined,
  oldSubtreeRoot: MutableAvlNode,
  nextSubtreeRoot: MutableAvlNode
): MutableAvlNode | undefined {
  if (root === undefined || root.id === oldSubtreeRoot.id) {
    return nextSubtreeRoot;
  }

  const parent = findParent(root, oldSubtreeRoot.id);

  if (parent?.left?.id === oldSubtreeRoot.id) {
    parent.left = nextSubtreeRoot;
  }

  if (parent?.right?.id === oldSubtreeRoot.id) {
    parent.right = nextSubtreeRoot;
  }

  return root;
}

function findParent(
  root: MutableAvlNode | undefined,
  childId: string
): MutableAvlNode | undefined {
  if (root === undefined) {
    return undefined;
  }

  if (root.left?.id === childId || root.right?.id === childId) {
    return root;
  }

  return findParent(root.left, childId) ?? findParent(root.right, childId);
}

function findDeepestUnbalancedNode(
  root: MutableAvlNode | undefined
): MutableAvlNode | undefined {
  if (root === undefined) {
    return undefined;
  }

  return (
    findDeepestUnbalancedNode(root.left) ??
    findDeepestUnbalancedNode(root.right) ??
    (Math.abs(getBalanceFactor(root)) > 1 ? root : undefined)
  );
}

function getRotationCase(node: MutableAvlNode, insertedValue: number): "LL" | "RR" | "LR" | "RL" {
  const balanceFactor = getBalanceFactor(node);

  if (balanceFactor > 1 && node.left !== undefined) {
    return insertedValue < node.left.value ? "LL" : "LR";
  }

  if (balanceFactor < -1 && node.right !== undefined) {
    return insertedValue > node.right.value ? "RR" : "RL";
  }

  return "LL";
}

function getRotationNodeIds(node: MutableAvlNode): string[] {
  return [node.id, node.left?.id, node.right?.id].filter(
    (id): id is string => id !== undefined
  );
}

function createMutableNode(value: number): MutableAvlNode {
  return {
    id: `avl-node-${value}`,
    value,
    height: 1
  };
}

function refreshHeights(root: MutableAvlNode | undefined): number {
  if (root === undefined) {
    return 0;
  }

  root.height = 1 + Math.max(refreshHeights(root.left), refreshHeights(root.right));

  return root.height;
}

function getHeight(node: MutableAvlNode | undefined): number {
  return node?.height ?? 0;
}

function getBalanceFactor(node: MutableAvlNode): number {
  return getHeight(node.left) - getHeight(node.right);
}

function getInOrderNodes(root: MutableAvlNode | undefined): MutableAvlNode[] {
  if (root === undefined) {
    return [];
  }

  return [
    ...getInOrderNodes(root.left),
    root,
    ...getInOrderNodes(root.right)
  ];
}

function getMaxDepth(root: MutableAvlNode | undefined): number {
  if (root === undefined) {
    return 0;
  }

  return 1 + Math.max(getMaxDepth(root.left), getMaxDepth(root.right));
}

function createSummaryItems({
  motion,
  nodes,
  operation,
  rotationLabel,
  targetValue
}: {
  motion: TreeMotion;
  nodes: readonly TreeNodeState[];
  operation: TreeOperation;
  rotationLabel?: string;
  targetValue?: number;
}) {
  const operationLabel: Record<TreeOperation, string> = {
    insert: "삽입",
    search: "탐색",
    traversal: "순회",
    rebalance: "균형",
    delete: "삭제"
  };

  const motionLabel: Record<TreeMotion, string> = {
    idle: "준비",
    compare: "비교",
    descend: "이동",
    insert: "삽입",
    balance: "균형 확인",
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
    { label: "노드 수", value: `${nodes.length}개` },
    {
      label: rotationLabel === undefined ? "삽입 값" : "회전",
      value: rotationLabel ?? (targetValue === undefined ? "-" : String(targetValue))
    }
  ];
}

import type { TraceStep } from "../../shared/types";
import type {
  TreeEdgeState,
  TreeMotion,
  TreeNodeColor,
  TreeNodeState,
  TreeOperation,
  TreeTraceState
} from "../types";

export const RED_BLACK_INSERT_VALUES = [41, 38, 31, 12, 19, 8];

type MutableRedBlackNode = {
  id: string;
  value: number;
  color: TreeNodeColor;
  parent?: MutableRedBlackNode;
  left?: MutableRedBlackNode;
  right?: MutableRedBlackNode;
};

type RuntimeRedBlackTree = {
  root?: MutableRedBlackNode;
};

export function generateRedBlackInsertionTrace(
  values: readonly number[] = RED_BLACK_INSERT_VALUES
): TraceStep<TreeTraceState>[] {
  const tree: RuntimeRedBlackTree = {};
  const trace: TraceStep<TreeTraceState>[] = [
    createStep({
      id: "rb-start",
      title: "빈 Red-Black 트리 준비",
      description: "새 노드는 빨간색으로 삽입하고, 루트와 연속 빨간 노드 규칙을 단계별로 복구합니다.",
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

  trace.push(
    createStep({
      id: "rb-complete",
      title: "Red-Black 삽입 실습 완료",
      description: "루트는 검정이고, 빨간 노드의 자식은 모두 검정인 상태로 삽입 복구가 끝났습니다.",
      tree,
      operation: "rebalance",
      motion: "complete",
      traversalValues: getInOrderNodes(tree.root).map((node) => node.value),
      pseudoCodeLine: 8,
      codeLines: [22]
    })
  );

  return trace;
}

function appendInsertTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeRedBlackTree,
  value: number
) {
  const insertedNode = insertAsBinarySearchTreeNode(trace, tree, value);
  appendFixupTrace(trace, tree, insertedNode, value);
}

function insertAsBinarySearchTreeNode(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeRedBlackTree,
  value: number
): MutableRedBlackNode {
  if (tree.root === undefined) {
    tree.root = createMutableNode(value, "black");
    trace.push(
      createStep({
        id: `rb-insert-${value}-root`,
        title: `${value} 루트 삽입`,
        description: `트리가 비어 있으므로 ${value}를 루트로 넣고 즉시 검정으로 만듭니다.`,
        tree,
        operation: "insert",
        motion: "insert",
        insertedNodeId: tree.root.id,
        recoloredNodeIds: [tree.root.id],
        targetValue: value,
        pseudoCodeLine: 8,
        codeLines: [2, 3, 22]
      })
    );

    return tree.root;
  }

  const pathNodeIds: string[] = [];
  let current = tree.root;

  while (current !== undefined) {
    pathNodeIds.push(current.id);
    trace.push(
      createStep({
        id: `rb-compare-${value}-${current.value}`,
        title: `${value}와 ${current.value} 비교`,
        description: `${value}를 BST 규칙에 맞춰 넣기 위해 ${current.value}와 비교합니다.`,
        tree,
        operation: "insert",
        motion: "compare",
        activeNodeId: current.id,
        comparedNodeId: current.id,
        pathNodeIds: [...pathNodeIds],
        targetValue: value,
        pseudoCodeLine: 1,
        codeLines: [3]
      })
    );

    if (value < current.value) {
      if (current.left === undefined) {
        current.left = createMutableNode(value, "red", current);
        trace.push(
          createStep({
            id: `rb-insert-${value}-left-of-${current.value}`,
            title: `${value} 빨간 노드 삽입`,
            description: `${value}는 ${current.value}보다 작아 왼쪽 자식으로 삽입됩니다. 새 노드는 항상 빨간색입니다.`,
            tree,
            operation: "insert",
            motion: "insert",
            activeNodeId: current.id,
            insertedNodeId: current.left.id,
            pathNodeIds: [...pathNodeIds, current.left.id],
            targetValue: value,
            pseudoCodeLine: 1,
            codeLines: [2, 3]
          })
        );
        return current.left;
      }

      trace.push(
        createStep({
          id: `rb-descend-${value}-left-from-${current.value}`,
          title: `${value} 왼쪽으로 이동`,
          description: `${value}는 ${current.value}보다 작으므로 왼쪽 서브트리로 내려갑니다.`,
          tree,
          operation: "insert",
          motion: "descend",
          activeNodeId: current.left.id,
          pathNodeIds: [...pathNodeIds, current.left.id],
          targetValue: value,
          pseudoCodeLine: 1,
          codeLines: [3]
        })
      );
      current = current.left;
      continue;
    }

    if (current.right === undefined) {
      current.right = createMutableNode(value, "red", current);
      trace.push(
        createStep({
          id: `rb-insert-${value}-right-of-${current.value}`,
          title: `${value} 빨간 노드 삽입`,
          description: `${value}는 ${current.value}보다 크거나 같아 오른쪽 자식으로 삽입됩니다. 새 노드는 항상 빨간색입니다.`,
          tree,
          operation: "insert",
          motion: "insert",
          activeNodeId: current.id,
          insertedNodeId: current.right.id,
          pathNodeIds: [...pathNodeIds, current.right.id],
          targetValue: value,
          pseudoCodeLine: 1,
          codeLines: [2, 3]
        })
      );
      return current.right;
    }

    trace.push(
      createStep({
        id: `rb-descend-${value}-right-from-${current.value}`,
        title: `${value} 오른쪽으로 이동`,
        description: `${value}는 ${current.value}보다 크거나 같으므로 오른쪽 서브트리로 내려갑니다.`,
        tree,
        operation: "insert",
        motion: "descend",
        activeNodeId: current.right.id,
        pathNodeIds: [...pathNodeIds, current.right.id],
        targetValue: value,
        pseudoCodeLine: 1,
        codeLines: [3]
      })
    );
    current = current.right;
  }

  return tree.root;
}

function appendFixupTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeRedBlackTree,
  insertedNode: MutableRedBlackNode,
  insertedValue: number
) {
  let node = insertedNode;

  while (node.parent?.color === "red") {
    const parent = node.parent;
    const grandparent = parent.parent;

    if (grandparent === undefined) {
      break;
    }

    const parentIsLeft = grandparent.left?.id === parent.id;
    const uncle = parentIsLeft ? grandparent.right : grandparent.left;
    const caseLabel = getCaseLabel(node, parent, parentIsLeft);

    trace.push(
      createStep({
        id: `rb-conflict-${insertedValue}-${parent.value}-${grandparent.value}`,
        title: `연속 빨간 노드 감지`,
        description: `${node.value}와 부모 ${parent.value}가 모두 빨간색이어서 Red-Black 규칙을 복구해야 합니다.`,
        tree,
        operation: "rebalance",
        motion: "balance",
        activeNodeId: node.id,
        pathNodeIds: [grandparent.id, parent.id, node.id],
        targetValue: insertedValue,
        pseudoCodeLine: 2,
        codeLines: [4, 7]
      })
    );

    if (uncle?.color === "red") {
      parent.color = "black";
      uncle.color = "black";
      grandparent.color = "red";

      trace.push(
        createStep({
          id: `rb-recolor-${insertedValue}-${parent.value}-${uncle.value}-${grandparent.value}`,
          title: `부모와 삼촌 재색칠`,
          description: `부모 ${parent.value}와 삼촌 ${uncle.value}를 검정으로, 조부모 ${grandparent.value}를 빨강으로 바꿉니다.`,
          tree,
          operation: "rebalance",
          motion: "recolor",
          activeNodeId: grandparent.id,
          recoloredNodeIds: [parent.id, uncle.id, grandparent.id],
          targetValue: insertedValue,
          pseudoCodeLine: 3,
          codeLines: [8, 9, 10, 11, 12]
        })
      );

      node = grandparent;
      continue;
    }

    if (caseLabel === "LR") {
      node = parent;
      rotateLeft(tree, parent);
      trace.push(
        createStep({
          id: `rb-rotation-${insertedValue}-LR-1`,
          title: `LR 1차 회전 적용`,
          description: `꺾인 모양을 직선으로 만들기 위해 부모 ${parent.value}를 기준으로 좌회전합니다.`,
          tree,
          operation: "rebalance",
          motion: "rotate",
          activeNodeId: node.parent?.id,
          rotatedNodeIds: [parent.id, node.parent?.id].filter(
            (id): id is string => id !== undefined
          ),
          rotationLabel: "LR 1차",
          targetValue: insertedValue,
          pseudoCodeLine: 5,
          codeLines: [15, 16, 17]
        })
      );
    }

    if (caseLabel === "RL") {
      node = parent;
      rotateRight(tree, parent);
      trace.push(
        createStep({
          id: `rb-rotation-${insertedValue}-RL-1`,
          title: `RL 1차 회전 적용`,
          description: `꺾인 모양을 직선으로 만들기 위해 부모 ${parent.value}를 기준으로 우회전합니다.`,
          tree,
          operation: "rebalance",
          motion: "rotate",
          activeNodeId: node.parent?.id,
          rotatedNodeIds: [parent.id, node.parent?.id].filter(
            (id): id is string => id !== undefined
          ),
          rotationLabel: "RL 1차",
          targetValue: insertedValue,
          pseudoCodeLine: 5,
          codeLines: [15, 16, 17]
        })
      );
    }

    const lineParent = node.parent;
    const lineGrandparent = lineParent?.parent;

    if (lineParent === undefined || lineGrandparent === undefined) {
      break;
    }

    lineParent.color = "black";
    lineGrandparent.color = "red";

    trace.push(
      createStep({
        id: `rb-recolor-line-${insertedValue}-${lineParent.value}-${lineGrandparent.value}`,
        title: `회전 전 색상 교환`,
        description: `부모 ${lineParent.value}를 검정으로, 조부모 ${lineGrandparent.value}를 빨강으로 바꿔 회전 후 규칙이 맞게 합니다.`,
        tree,
        operation: "rebalance",
        motion: "recolor",
        activeNodeId: lineParent.id,
        recoloredNodeIds: [lineParent.id, lineGrandparent.id],
        targetValue: insertedValue,
        pseudoCodeLine: 6,
        codeLines: [18, 19]
      })
    );

    if (lineGrandparent.left?.id === lineParent.id) {
      rotateRight(tree, lineGrandparent);
      trace.push(
        createStep({
          id: `rb-rotation-${insertedValue}-${caseLabel === "LR" ? "LR-2" : "LL"}`,
          title: `${caseLabel === "LR" ? "LR 2차" : "LL"} 회전 적용`,
          description: `조부모 ${lineGrandparent.value}를 기준으로 우회전하여 빨간 노드가 연속되지 않게 합니다.`,
          tree,
          operation: "rebalance",
          motion: "rotate",
          activeNodeId: lineParent.id,
          rotatedNodeIds: [lineParent.id, lineGrandparent.id],
          rotationLabel: caseLabel === "LR" ? "LR 2차" : "LL",
          targetValue: insertedValue,
          pseudoCodeLine: 7,
          codeLines: [20]
        })
      );
    } else {
      rotateLeft(tree, lineGrandparent);
      trace.push(
        createStep({
          id: `rb-rotation-${insertedValue}-${caseLabel === "RL" ? "RL-2" : "RR"}`,
          title: `${caseLabel === "RL" ? "RL 2차" : "RR"} 회전 적용`,
          description: `조부모 ${lineGrandparent.value}를 기준으로 좌회전하여 빨간 노드가 연속되지 않게 합니다.`,
          tree,
          operation: "rebalance",
          motion: "rotate",
          activeNodeId: lineParent.id,
          rotatedNodeIds: [lineParent.id, lineGrandparent.id],
          rotationLabel: caseLabel === "RL" ? "RL 2차" : "RR",
          targetValue: insertedValue,
          pseudoCodeLine: 7,
          codeLines: [20]
        })
      );
    }

    break;
  }

  if (tree.root?.color === "red") {
    tree.root.color = "black";
    trace.push(
      createStep({
        id: `rb-root-black-${insertedValue}`,
        title: `루트를 검정으로 고정`,
        description: "Red-Black 트리의 루트는 항상 검정이어야 하므로 루트 색을 다시 검정으로 맞춥니다.",
        tree,
        operation: "rebalance",
        motion: "recolor",
        activeNodeId: tree.root.id,
        recoloredNodeIds: [tree.root.id],
        targetValue: insertedValue,
        pseudoCodeLine: 8,
        codeLines: [22]
      })
    );
  } else if (insertedNode.parent?.color === "black") {
    trace.push(
      createStep({
        id: `rb-parent-black-${insertedValue}`,
        title: `부모가 검정이라 복구 불필요`,
        description: `${insertedValue}의 부모가 검정이므로 빨간 노드가 연속되지 않습니다.`,
        tree,
        operation: "rebalance",
        motion: "balance",
        activeNodeId: insertedNode.id,
        targetValue: insertedValue,
        pseudoCodeLine: 2,
        codeLines: [4]
      })
    );
  }
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
  recoloredNodeIds,
  rotatedNodeIds,
  rotationLabel,
  targetValue,
  title,
  traversalValues,
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
  recoloredNodeIds?: string[];
  rotatedNodeIds?: string[];
  rotationLabel?: string;
  targetValue?: number;
  title: string;
  traversalValues?: number[];
  tree: RuntimeRedBlackTree;
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
      recoloredNodeIds,
      rotatedNodeIds,
      rotationLabel,
      targetValue,
      pathNodeIds,
      traversalValues,
      summaryItems: createSummaryItems({
        motion,
        nodes: renderedTree.nodes,
        operation,
        rotationLabel,
        targetValue,
        traversalValues
      })
    },
    pseudoCodeLine,
    codeLineHighlights: {
      TypeScript: codeLines
    }
  };
}

function renderTree(root: MutableRedBlackNode | undefined): {
  edges: TreeEdgeState[];
  nodes: TreeNodeState[];
  viewport: { width: number; height: number };
} {
  if (root === undefined) {
    return {
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
  const yGap = 86;
  const width = Math.max(720, (orderedNodes.length - 1) * xGap + 120);
  const height = Math.max(300, maxDepth * yGap + 150);

  function visit(node: MutableRedBlackNode, depth: number) {
    const order = orderById.get(node.id) ?? 0;
    const stateNode: TreeNodeState = {
      id: node.id,
      value: node.value,
      color: node.color,
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

  return { nodes, edges, viewport: { width, height } };
}

function rotateLeft(
  tree: RuntimeRedBlackTree,
  node: MutableRedBlackNode
): MutableRedBlackNode {
  const pivot = node.right;

  if (pivot === undefined) {
    return node;
  }

  node.right = pivot.left;
  if (pivot.left !== undefined) {
    pivot.left.parent = node;
  }

  pivot.parent = node.parent;
  if (node.parent === undefined) {
    tree.root = pivot;
  } else if (node.parent.left?.id === node.id) {
    node.parent.left = pivot;
  } else {
    node.parent.right = pivot;
  }

  pivot.left = node;
  node.parent = pivot;

  return pivot;
}

function rotateRight(
  tree: RuntimeRedBlackTree,
  node: MutableRedBlackNode
): MutableRedBlackNode {
  const pivot = node.left;

  if (pivot === undefined) {
    return node;
  }

  node.left = pivot.right;
  if (pivot.right !== undefined) {
    pivot.right.parent = node;
  }

  pivot.parent = node.parent;
  if (node.parent === undefined) {
    tree.root = pivot;
  } else if (node.parent.left?.id === node.id) {
    node.parent.left = pivot;
  } else {
    node.parent.right = pivot;
  }

  pivot.right = node;
  node.parent = pivot;

  return pivot;
}

function getCaseLabel(
  node: MutableRedBlackNode,
  parent: MutableRedBlackNode,
  parentIsLeft: boolean
): "LL" | "LR" | "RL" | "RR" {
  if (parentIsLeft) {
    return parent.right?.id === node.id ? "LR" : "LL";
  }

  return parent.left?.id === node.id ? "RL" : "RR";
}

function createMutableNode(
  value: number,
  color: TreeNodeColor,
  parent?: MutableRedBlackNode
): MutableRedBlackNode {
  return {
    id: `rb-node-${value}`,
    value,
    color,
    parent
  };
}

function getInOrderNodes(
  root: MutableRedBlackNode | undefined
): MutableRedBlackNode[] {
  if (root === undefined) {
    return [];
  }

  return [
    ...getInOrderNodes(root.left),
    root,
    ...getInOrderNodes(root.right)
  ];
}

function getMaxDepth(root: MutableRedBlackNode | undefined): number {
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
  targetValue,
  traversalValues
}: {
  motion: TreeMotion;
  nodes: readonly TreeNodeState[];
  operation: TreeOperation;
  rotationLabel?: string;
  targetValue?: number;
  traversalValues?: readonly number[];
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

  const redCount = nodes.filter((node) => node.color === "red").length;
  const blackCount = nodes.filter((node) => node.color === "black").length;

  return [
    { label: "연산", value: operationLabel[operation] },
    { label: "상태", value: motionLabel[motion] },
    { label: "색상", value: `빨강 ${redCount} · 검정 ${blackCount}` },
    {
      label: traversalValues?.length ? "중위 순서" : rotationLabel === undefined ? "삽입 값" : "회전",
      value: traversalValues?.length
        ? traversalValues.join(", ")
        : rotationLabel ?? (targetValue === undefined ? "-" : String(targetValue))
    }
  ];
}

import type { TraceStep } from "../../shared/types";
import type {
  TreeEdgeState,
  TreeMotion,
  TreeNodeState,
  TreeOperation,
  TreeTraceState
} from "../types";
import { createTreeCodeHighlights } from "./codeHighlights";

export const BST_DELETE_INITIAL_VALUES = [42, 23, 61, 15, 31, 54, 72, 28, 37, 67];
export const BST_DELETE_TARGETS = [15, 72, 42];

type MutableTreeNode = {
  id: string;
  value: number;
  left?: MutableTreeNode;
  right?: MutableTreeNode;
};

type RuntimeTree = {
  root?: MutableTreeNode;
};

export function generateBinarySearchTreeDeletionTrace(
  values: readonly number[] = BST_DELETE_INITIAL_VALUES,
  targets: readonly number[] = BST_DELETE_TARGETS
): TraceStep<TreeTraceState>[] {
  const tree: RuntimeTree = {};

  for (const value of values) {
    insertValue(tree, value);
  }

  const trace: TraceStep<TreeTraceState>[] = [
    createStep({
      id: "bst-delete-start",
      title: "삭제용 BST 준비",
      description: "삭제 케이스를 비교하기 위해 리프, 자식 1개, 자식 2개 노드가 모두 있는 BST를 준비합니다.",
      tree,
      operation: "delete",
      motion: "idle",
      targetValue: targets[0],
      pseudoCodeLine: 1,
      codeLines: [1]
    })
  ];

  for (const target of targets) {
    appendDeleteTrace(trace, tree, target);
  }

  trace.push(
    createStep({
      id: "bst-delete-complete",
      title: "BST 삭제 실습 완료",
      description: "세 삭제 케이스가 모두 끝났습니다. 남은 트리도 BST 정렬 규칙을 유지합니다.",
      tree,
      operation: "delete",
      motion: "complete",
      traversalValues: getInOrderNodes(tree.root).map((node) => node.value),
      pseudoCodeLine: 8,
      codeLines: [17]
    })
  );

  return trace;
}

function appendDeleteTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeTree,
  target: number
) {
  const pathNodeIds: string[] = [];
  let current = tree.root;
  let parent: MutableTreeNode | undefined;

  while (current !== undefined) {
    pathNodeIds.push(current.id);
    trace.push(
      createStep({
        id: `bst-delete-compare-${target}-${current.value}`,
        title: `삭제 탐색: ${target}와 ${current.value} 비교`,
        description: `삭제할 값 ${target}를 찾기 위해 현재 노드 ${current.value}와 비교합니다.`,
        tree,
        operation: "delete",
        motion: "compare",
        activeNodeId: current.id,
        comparedNodeId: current.id,
        pathNodeIds: [...pathNodeIds],
        targetValue: target,
        pseudoCodeLine: 2,
        codeLines: [3, 7]
      })
    );

    if (target === current.value) {
      trace.push(
        createStep({
          id: `bst-delete-found-${target}`,
          title: `삭제 대상 발견: ${target}`,
          description: `${target} 노드를 찾았습니다. 이제 자식 개수에 따라 삭제 방법을 고릅니다.`,
          tree,
          operation: "delete",
          motion: "found",
          activeNodeId: current.id,
          foundNodeId: current.id,
          pathNodeIds: [...pathNodeIds],
          targetValue: target,
          pseudoCodeLine: 3,
          codeLines: [11, 12, 13, 14]
        })
      );
      deleteFoundNode(trace, tree, current, parent, target, pathNodeIds);
      return;
    }

    parent = current;
    current = target < current.value ? current.left : current.right;

    if (current !== undefined) {
      trace.push(
        createStep({
          id: `bst-delete-descend-${target}-${current.value}`,
          title: `${target} 쪽 서브트리로 이동`,
          description: `${target}가 이전 노드보다 ${target < parent.value ? "작아 왼쪽" : "커서 오른쪽"}으로 내려갑니다.`,
          tree,
          operation: "delete",
          motion: "descend",
          activeNodeId: current.id,
          pathNodeIds: [...pathNodeIds, current.id],
          targetValue: target,
          pseudoCodeLine: 2,
          codeLines: target < parent.value ? [4] : [8]
        })
      );
    }
  }
}

function deleteFoundNode(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeTree,
  node: MutableTreeNode,
  parent: MutableTreeNode | undefined,
  target: number,
  pathNodeIds: readonly string[]
) {
  if (node.left === undefined && node.right === undefined) {
    trace.push(
      createStep({
        id: `bst-delete-leaf-${target}`,
        title: `${target} 리프 노드 제거`,
        description: `${target}는 자식이 없으므로 부모의 연결만 끊으면 됩니다.`,
        tree,
        operation: "delete",
        motion: "remove",
        activeNodeId: node.id,
        removedNodeId: node.id,
        pathNodeIds,
        targetValue: target,
        pseudoCodeLine: 4,
        codeLines: [11]
      })
    );
    replaceChild(tree, parent, node, undefined);
    trace.push(
      createStep({
        id: `bst-delete-leaf-${target}-done`,
        title: `${target} 삭제 완료`,
        description: `${target} 리프 노드가 제거되었습니다.`,
        tree,
        operation: "delete",
        motion: "remove",
        targetValue: target,
        pseudoCodeLine: 4,
        codeLines: [11]
      })
    );
    return;
  }

  if (node.left === undefined || node.right === undefined) {
    const child = node.left ?? node.right;

    trace.push(
      createStep({
        id: `bst-delete-one-child-${target}`,
        title: `${target}를 자식으로 대체`,
        description: `${target}는 자식이 하나뿐이므로 부모가 그 자식을 바로 가리키게 합니다.`,
        tree,
        operation: "delete",
        motion: "replace",
        activeNodeId: node.id,
        removedNodeId: node.id,
        successorNodeId: child?.id,
        pathNodeIds,
        targetValue: target,
        pseudoCodeLine: 5,
        codeLines: [12, 13]
      })
    );
    replaceChild(tree, parent, node, child);
    trace.push(
      createStep({
        id: `bst-delete-one-child-${target}-done`,
        title: `${target} 삭제 완료`,
        description: `${target} 자리를 자식 노드 ${child?.value}가 이어받았습니다.`,
        tree,
        operation: "delete",
        motion: "replace",
        activeNodeId: child?.id,
        successorNodeId: child?.id,
        targetValue: target,
        pseudoCodeLine: 5,
        codeLines: [12, 13]
      })
    );
    return;
  }

  const successorPathIds = [...pathNodeIds];
  let successorParent = node;
  let successor = node.right;
  successorPathIds.push(successor.id);

  trace.push(
    createStep({
      id: `bst-delete-successor-start-${target}`,
      title: `${target}의 successor 찾기`,
      description: "자식이 둘이면 오른쪽 서브트리에서 가장 작은 값을 찾아 현재 노드를 대체합니다.",
      tree,
      operation: "delete",
      motion: "descend",
      activeNodeId: successor.id,
      pathNodeIds: successorPathIds,
      targetValue: target,
      pseudoCodeLine: 6,
      codeLines: [14, 20, 21]
    })
  );

  while (successor.left !== undefined) {
    successorParent = successor;
    successor = successor.left;
    successorPathIds.push(successor.id);
    trace.push(
      createStep({
        id: `bst-delete-successor-descend-${target}-${successor.value}`,
        title: `successor 후보 ${successor.value}로 이동`,
        description: "더 작은 successor를 찾기 위해 왼쪽으로 계속 내려갑니다.",
        tree,
        operation: "delete",
        motion: "descend",
        activeNodeId: successor.id,
        pathNodeIds: [...successorPathIds],
        targetValue: target,
        pseudoCodeLine: 6,
        codeLines: [21]
      })
    );
  }

  trace.push(
    createStep({
      id: `bst-delete-successor-found-${target}-${successor.value}`,
      title: `successor ${successor.value} 선택`,
      description: `${successor.value}가 오른쪽 서브트리에서 가장 작은 값이므로 ${target} 자리를 대체합니다.`,
      tree,
      operation: "delete",
      motion: "found",
      activeNodeId: successor.id,
      successorNodeId: successor.id,
      pathNodeIds: [...successorPathIds],
      targetValue: target,
      pseudoCodeLine: 6,
      codeLines: [14, 15]
    })
  );

  const replacementValue = successor.value;
  const replacementId = successor.id;
  const successorRight = successor.right;

  node.value = replacementValue;
  node.id = replacementId;
  replaceChild(tree, successorParent, successor, successorRight);

  trace.push(
    createStep({
      id: `bst-delete-two-children-${target}-done`,
      title: `${target}를 successor로 대체`,
      description: `${target} 자리에 ${replacementValue}를 올리고, 원래 successor 노드는 제거했습니다.`,
      tree,
      operation: "delete",
      motion: "replace",
      activeNodeId: replacementId,
      successorNodeId: replacementId,
      targetValue: target,
      pseudoCodeLine: 7,
      codeLines: [15, 16, 17]
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
  motion,
  operation,
  pathNodeIds,
  pseudoCodeLine,
  removedNodeId,
  successorNodeId,
  targetValue,
  title,
  traversalValues,
  tree
}: {
  activeNodeId?: string;
  codeLines: number[];
  comparedNodeId?: string;
  description: string;
  foundNodeId?: string;
  id: string;
  motion: TreeMotion;
  operation: TreeOperation;
  pathNodeIds?: readonly string[];
  pseudoCodeLine: number;
  removedNodeId?: string;
  successorNodeId?: string;
  targetValue?: number;
  title: string;
  traversalValues?: number[];
  tree: RuntimeTree;
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
      foundNodeId,
      removedNodeId,
      successorNodeId,
      targetValue,
      pathNodeIds: pathNodeIds === undefined ? undefined : [...pathNodeIds],
      traversalValues,
      summaryItems: createSummaryItems({
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

function insertValue(tree: RuntimeTree, value: number) {
  if (tree.root === undefined) {
    tree.root = createMutableNode(value);
    return;
  }

  let current = tree.root;

  while (current !== undefined) {
    if (value < current.value) {
      if (current.left === undefined) {
        current.left = createMutableNode(value);
        return;
      }

      current = current.left;
      continue;
    }

    if (current.right === undefined) {
      current.right = createMutableNode(value);
      return;
    }

    current = current.right;
  }
}

function replaceChild(
  tree: RuntimeTree,
  parent: MutableTreeNode | undefined,
  node: MutableTreeNode,
  nextNode: MutableTreeNode | undefined
) {
  if (parent === undefined) {
    tree.root = nextNode;
    return;
  }

  if (parent.left?.id === node.id) {
    parent.left = nextNode;
  }

  if (parent.right?.id === node.id) {
    parent.right = nextNode;
  }
}

function renderTree(root: MutableTreeNode | undefined): {
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
  const yGap = 82;
  const width = Math.max(720, (orderedNodes.length - 1) * xGap + 120);
  const height = Math.max(280, maxDepth * yGap + 140);

  function visit(node: MutableTreeNode, depth: number) {
    const order = orderById.get(node.id) ?? 0;
    const stateNode: TreeNodeState = {
      id: node.id,
      value: node.value,
      x: 60 + order * xGap,
      y: 52 + depth * yGap,
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

function createMutableNode(value: number): MutableTreeNode {
  return {
    id: `delete-node-${value}`,
    value
  };
}

function getInOrderNodes(root: MutableTreeNode | undefined): MutableTreeNode[] {
  if (root === undefined) {
    return [];
  }

  return [
    ...getInOrderNodes(root.left),
    root,
    ...getInOrderNodes(root.right)
  ];
}

function getMaxDepth(root: MutableTreeNode | undefined): number {
  if (root === undefined) {
    return 0;
  }

  return 1 + Math.max(getMaxDepth(root.left), getMaxDepth(root.right));
}

function createSummaryItems({
  motion,
  nodes,
  operation,
  targetValue,
  traversalValues
}: {
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
      label: traversalValues?.length ? "남은 값" : "삭제 값",
      value: traversalValues?.length
        ? traversalValues.join(", ")
        : targetValue === undefined
          ? "-"
          : String(targetValue)
    }
  ];
}

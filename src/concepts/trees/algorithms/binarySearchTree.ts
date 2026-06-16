import type { TraceStep } from "../../shared/types";
import type {
  TreeEdgeState,
  TreeMotion,
  TreeNodeState,
  TreeOperation,
  TreeTraceState
} from "../types";

export const BST_DEFAULT_VALUES = [42, 23, 61, 15, 31, 54, 72, 28, 37, 67];
export const BST_SEARCH_TARGET = 37;

type MutableTreeNode = {
  id: string;
  value: number;
  left?: MutableTreeNode;
  right?: MutableTreeNode;
};

type RuntimeTree = {
  root?: MutableTreeNode;
};

export function generateBinarySearchTreeTrace(
  values: readonly number[] = BST_DEFAULT_VALUES,
  searchTarget = BST_SEARCH_TARGET
): TraceStep<TreeTraceState>[] {
  const tree: RuntimeTree = {};
  const trace: TraceStep<TreeTraceState>[] = [
    createStep({
      id: "bst-start",
      title: "빈 BST 준비",
      description: "아직 노드가 없는 이진 탐색 트리에서 삽입을 시작합니다.",
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
  appendInOrderTrace(trace, tree);

  trace.push(
    createStep({
      id: "bst-complete",
      title: "BST 실습 완료",
      description: "삽입, 탐색, 중위 순회가 모두 끝났습니다. 중위 순회 결과가 오름차순인지 확인합니다.",
      tree,
      operation: "traversal",
      motion: "complete",
      visitedNodeIds: getInOrderNodes(tree.root).map((node) => node.id),
      traversalValues: getInOrderNodes(tree.root).map((node) => node.value),
      pseudoCodeLine: 9,
      codeLines: [23]
    })
  );

  return trace;
}

function appendInsertTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeTree,
  value: number
) {
  if (tree.root === undefined) {
    tree.root = createMutableNode(value);
    trace.push(
      createStep({
        id: `bst-insert-${value}-root`,
        title: `${value} 루트 삽입`,
        description: `트리가 비어 있으므로 ${value}를 루트 노드로 삽입합니다.`,
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
        id: `bst-compare-${value}-${current.value}`,
        title: `${value}와 ${current.value} 비교`,
        description: `${value}가 현재 노드 ${current.value}보다 작은지 큰지 비교합니다.`,
        tree,
        operation: "insert",
        motion: "compare",
        activeNodeId: current.id,
        comparedNodeId: current.id,
        pathNodeIds,
        targetValue: value,
        pseudoCodeLine: 2,
        codeLines: [4]
      })
    );

    if (value < current.value) {
      if (current.left === undefined) {
        const node = createMutableNode(value);
        current.left = node;
        trace.push(
          createStep({
            id: `bst-insert-${value}-left-of-${current.value}`,
            title: `${value} 왼쪽 자식 삽입`,
            description: `${value}는 ${current.value}보다 작고 왼쪽 자리가 비어 있어 왼쪽 자식으로 들어갑니다.`,
            tree,
            operation: "insert",
            motion: "insert",
            activeNodeId: current.id,
            insertedNodeId: node.id,
            pathNodeIds: [...pathNodeIds, node.id],
            targetValue: value,
            pseudoCodeLine: 3,
            codeLines: [4, 5]
          })
        );
        return;
      }

      trace.push(
        createStep({
          id: `bst-descend-${value}-left-from-${current.value}`,
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
      const node = createMutableNode(value);
      current.right = node;
      trace.push(
        createStep({
          id: `bst-insert-${value}-right-of-${current.value}`,
          title: `${value} 오른쪽 자식 삽입`,
          description: `${value}는 ${current.value}보다 크거나 같고 오른쪽 자리가 비어 있어 오른쪽 자식으로 들어갑니다.`,
          tree,
          operation: "insert",
          motion: "insert",
          activeNodeId: current.id,
          insertedNodeId: node.id,
          pathNodeIds: [...pathNodeIds, node.id],
          targetValue: value,
          pseudoCodeLine: 4,
          codeLines: [6, 7]
        })
      );
      return;
    }

    trace.push(
      createStep({
        id: `bst-descend-${value}-right-from-${current.value}`,
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
}

function appendSearchTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeTree,
  targetValue: number
) {
  const pathNodeIds: string[] = [];
  let current = tree.root;

  while (current !== undefined) {
    pathNodeIds.push(current.id);
    trace.push(
      createStep({
        id: `bst-search-compare-${targetValue}-${current.value}`,
        title: `탐색: ${targetValue}와 ${current.value} 비교`,
        description: `찾는 값 ${targetValue}와 현재 노드 ${current.value}를 비교합니다.`,
        tree,
        operation: "search",
        motion: "compare",
        activeNodeId: current.id,
        comparedNodeId: current.id,
        pathNodeIds,
        targetValue,
        pseudoCodeLine: 5,
        codeLines: [15, 16]
      })
    );

    if (targetValue === current.value) {
      trace.push(
        createStep({
          id: `bst-search-found-${targetValue}`,
          title: `탐색 성공: ${targetValue} 발견`,
          description: `${targetValue}를 경로 ${formatPath(pathNodeIds, tree.root)}에서 찾았습니다.`,
          tree,
          operation: "search",
          motion: "found",
          activeNodeId: current.id,
          foundNodeId: current.id,
          pathNodeIds,
          targetValue,
          pseudoCodeLine: 6,
          codeLines: [15]
        })
      );
      return;
    }

    current = targetValue < current.value ? current.left : current.right;
  }
}

function appendInOrderTrace(
  trace: TraceStep<TreeTraceState>[],
  tree: RuntimeTree
) {
  const visitedNodeIds: string[] = [];
  const traversalValues: number[] = [];

  for (const node of getInOrderNodes(tree.root)) {
    visitedNodeIds.push(node.id);
    traversalValues.push(node.value);
    trace.push(
      createStep({
        id: `bst-traversal-visit-${node.value}`,
        title: `중위 순회: ${node.value} 방문`,
        description: "왼쪽 서브트리, 현재 노드, 오른쪽 서브트리 순서로 방문하면 값이 오름차순으로 나옵니다.",
        tree,
        operation: "traversal",
        motion: "visit",
        activeNodeId: node.id,
        visitedNodeIds: [...visitedNodeIds],
        traversalValues: [...traversalValues],
        pseudoCodeLine: 8,
        codeLines: [22, 23, 24]
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
  traversalValues,
  tree,
  visitedNodeIds
}: {
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
  traversalValues?: number[];
  tree: RuntimeTree;
  visitedNodeIds?: string[];
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
      foundNodeId,
      targetValue,
      pathNodeIds,
      visitedNodeIds,
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
    codeLineHighlights: {
      TypeScript: codeLines
    }
  };
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
    id: `node-${value}`,
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

function formatPath(pathNodeIds: readonly string[], root: MutableTreeNode | undefined): string {
  const nodeById = new Map(getInOrderNodes(root).map((node) => [node.id, node]));
  const values = pathNodeIds.flatMap((nodeId) => {
    const node = nodeById.get(nodeId);

    return node === undefined ? [] : [node.value];
  });

  return values.join(" → ");
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
    rebalance: "균형"
  };

  const motionLabel: Record<TreeMotion, string> = {
    idle: "준비",
    compare: "비교",
    descend: "이동",
    insert: "삽입",
    balance: "균형 확인",
    rotate: "회전",
    found: "발견",
    visit: "방문",
    complete: "완료"
  };

  return [
    { label: "연산", value: operationLabel[operation] },
    { label: "상태", value: motionLabel[motion] },
    { label: "노드 수", value: `${nodes.length}개` },
    {
      label: traversalValues?.length ? "순회 결과" : "목표 값",
      value: traversalValues?.length
        ? traversalValues.join(", ")
        : targetValue === undefined
          ? "-"
          : String(targetValue)
    }
  ];
}

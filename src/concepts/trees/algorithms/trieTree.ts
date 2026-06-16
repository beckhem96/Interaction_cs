import type { TraceStep } from "../../shared/types";
import type {
  TreeEdgeState,
  TreeMotion,
  TreeNodeState,
  TreeOperation,
  TreeTraceState
} from "../types";

export const TRIE_WORDS = ["cat", "car", "cart", "dog", "dot"];
export const TRIE_PREFIX_TARGET = "car";

type MutableTrieNode = {
  id: string;
  label: string;
  path: string;
  isWord: boolean;
  children: Map<string, MutableTrieNode>;
};

type RuntimeTrie = {
  root: MutableTrieNode;
};

type TrieStepOptions = {
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
  title: string;
  trie: RuntimeTrie;
  wordResults?: string[];
};

export function generateTrieTrace(
  words: readonly string[] = TRIE_WORDS,
  prefix: string = TRIE_PREFIX_TARGET
): TraceStep<TreeTraceState>[] {
  const trie: RuntimeTrie = { root: createNode("루트", "") };
  const trace: TraceStep<TreeTraceState>[] = [
    createStep({
      id: "trie-start",
      title: "빈 트라이 준비",
      description: "트라이는 한 글자씩 내려가며 공통 prefix를 노드로 공유합니다.",
      trie,
      operation: "insert",
      motion: "idle",
      targetText: words[0],
      pseudoCodeLine: 1,
      codeLines: [1]
    })
  ];

  for (const word of words) {
    appendInsertTrace(trace, trie, word);
  }

  appendPrefixSearchTrace(trace, trie, prefix);

  trace.push(
    createStep({
      id: "trie-complete",
      title: "트라이 실습 완료",
      description: "단어 삽입과 prefix 검색이 끝났습니다. 공통 접두사가 하나의 경로로 공유되는지 확인합니다.",
      trie,
      operation: "search",
      motion: "complete",
      targetText: prefix,
      wordResults: collectWords(getNodeByPath(trie.root, prefix)),
      pseudoCodeLine: 8,
      codeLines: [18]
    })
  );

  return trace;
}

function appendInsertTrace(
  trace: TraceStep<TreeTraceState>[],
  trie: RuntimeTrie,
  word: string
) {
  let current = trie.root;
  const pathNodeIds = [current.id];

  for (const character of word) {
    trace.push(
      createStep({
        id: `trie-check-${word}-${current.path || "root"}-${character}`,
        title: `"${character}" 문자 확인`,
        description: `"${word}"를 넣기 위해 현재 노드에서 "${character}" 간선이 있는지 확인합니다.`,
        trie,
        operation: "insert",
        motion: "compare",
        activeNodeId: current.id,
        comparedNodeId: current.id,
        pathNodeIds: [...pathNodeIds],
        targetText: word,
        pseudoCodeLine: 2,
        codeLines: [3, 4]
      })
    );

    const existingChild = current.children.get(character);

    if (existingChild !== undefined) {
      current = existingChild;
      pathNodeIds.push(current.id);
      trace.push(
        createStep({
          id: `trie-descend-${word}-${current.path}`,
          title: `"${current.path}" 경로로 이동`,
          description: `"${character}" 노드가 이미 있으므로 새 노드를 만들지 않고 공유 경로로 내려갑니다.`,
          trie,
          operation: "insert",
          motion: "descend",
          activeNodeId: current.id,
          pathNodeIds: [...pathNodeIds],
          targetText: word,
          pseudoCodeLine: 3,
          codeLines: [7]
        })
      );
      continue;
    }

    const child = createNode(character, `${current.path}${character}`);
    current.children.set(character, child);
    current = child;
    pathNodeIds.push(current.id);

    trace.push(
      createStep({
        id: `trie-insert-${word}-${current.path}`,
        title: `"${character}" 노드 생성`,
        description: `"${current.path}" 경로가 없으므로 "${character}" 노드를 새로 만들고 연결합니다.`,
        trie,
        operation: "insert",
        motion: "insert",
        activeNodeId: current.id,
        insertedNodeId: current.id,
        pathNodeIds: [...pathNodeIds],
        targetText: word,
        pseudoCodeLine: 4,
        codeLines: [4, 5]
      })
    );
  }

  current.isWord = true;
  trace.push(
    createStep({
      id: `trie-mark-word-${word}`,
      title: `"${word}" 단어 종료 표시`,
      description: `"${word}"의 마지막 노드를 단어 끝으로 표시합니다.`,
      trie,
      operation: "insert",
      motion: "found",
      activeNodeId: current.id,
      foundNodeId: current.id,
      pathNodeIds: [...pathNodeIds],
      targetText: word,
      pseudoCodeLine: 5,
      codeLines: [9]
    })
  );
}

function appendPrefixSearchTrace(
  trace: TraceStep<TreeTraceState>[],
  trie: RuntimeTrie,
  prefix: string
) {
  let current = trie.root;
  const pathNodeIds = [current.id];

  trace.push(
    createStep({
      id: `trie-prefix-start-${prefix}`,
      title: `"${prefix}" prefix 검색 시작`,
      description: "prefix의 각 문자를 따라 내려가며 해당 경로가 존재하는지 확인합니다.",
      trie,
      operation: "search",
      motion: "idle",
      activeNodeId: current.id,
      pathNodeIds: [...pathNodeIds],
      targetText: prefix,
      pseudoCodeLine: 6,
      codeLines: [12, 13]
    })
  );

  for (const character of prefix) {
    trace.push(
      createStep({
        id: `trie-prefix-check-${prefix}-${current.path || "root"}-${character}`,
        title: `prefix 문자 "${character}" 확인`,
        description: `현재 노드에서 "${character}" 자식이 있는지 확인합니다.`,
        trie,
        operation: "search",
        motion: "compare",
        activeNodeId: current.id,
        comparedNodeId: current.id,
        pathNodeIds: [...pathNodeIds],
        targetText: prefix,
        pseudoCodeLine: 6,
        codeLines: [14, 15]
      })
    );

    const next = current.children.get(character);

    if (next === undefined) {
      trace.push(
        createStep({
          id: `trie-prefix-missing-${prefix}-${character}`,
          title: `prefix "${prefix}" 없음`,
          description: `"${character}" 경로가 없어 prefix 검색을 실패합니다.`,
          trie,
          operation: "search",
          motion: "complete",
          activeNodeId: current.id,
          pathNodeIds: [...pathNodeIds],
          targetText: prefix,
          pseudoCodeLine: 8,
          codeLines: [15]
        })
      );
      return;
    }

    current = next;
    pathNodeIds.push(current.id);
    trace.push(
      createStep({
        id: `trie-prefix-descend-${prefix}-${current.path}`,
        title: `"${current.path}" 경로로 이동`,
        description: `"${character}" 노드가 있으므로 prefix 경로를 한 글자 확장합니다.`,
        trie,
        operation: "search",
        motion: "descend",
        activeNodeId: current.id,
        pathNodeIds: [...pathNodeIds],
        targetText: prefix,
        pseudoCodeLine: 6,
        codeLines: [16]
      })
    );
  }

  const wordResults = collectWords(current);
  trace.push(
    createStep({
      id: `trie-prefix-found-${prefix}`,
      title: `prefix "${prefix}" 결과 수집`,
      description: `"${prefix}" 경로 아래의 단어를 모으면 ${wordResults.join(", ")}를 찾을 수 있습니다.`,
      trie,
      operation: "search",
      motion: "found",
      activeNodeId: current.id,
      foundNodeId: current.id,
      pathNodeIds: [...pathNodeIds],
      targetText: prefix,
      wordResults,
      pseudoCodeLine: 7,
      codeLines: [18, 19]
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
  title,
  trie,
  wordResults
}: TrieStepOptions): TraceStep<TreeTraceState> {
  const renderedTree = renderTrie(trie.root);

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
      terminalNodeIds: getTerminalNodeIds(trie.root),
      wordResults,
      summaryItems: createSummaryItems({
        motion,
        nodes: renderedTree.nodes,
        operation,
        targetText,
        wordResults
      })
    },
    pseudoCodeLine,
    codeLineHighlights: {
      TypeScript: codeLines
    }
  };
}

function renderTrie(root: MutableTrieNode): {
  edges: TreeEdgeState[];
  nodes: TreeNodeState[];
  viewport: { width: number; height: number };
} {
  const orderedNodes = getPreOrderNodes(root);
  const leafCounts = new Map<string, number>();
  const xById = new Map<string, number>();
  const nodes: TreeNodeState[] = [];
  const edges: TreeEdgeState[] = [];
  const xGap = 82;
  const yGap = 86;
  const maxDepth = Math.max(...orderedNodes.map((node) => node.path.length), 0);
  let nextLeafX = 60;

  function measure(node: MutableTrieNode): number {
    if (node.children.size === 0) {
      leafCounts.set(node.id, 1);
      return 1;
    }

    const count = [...node.children.values()].reduce(
      (sum, child) => sum + measure(child),
      0
    );
    leafCounts.set(node.id, count);

    return count;
  }

  function place(node: MutableTrieNode) {
    if (node.children.size === 0) {
      xById.set(node.id, nextLeafX);
      nextLeafX += xGap;
      return;
    }

    for (const child of node.children.values()) {
      place(child);
    }

    const childXs = [...node.children.values()].map(
      (child) => xById.get(child.id) ?? nextLeafX
    );
    xById.set(
      node.id,
      (Math.min(...childXs) + Math.max(...childXs)) / 2
    );
  }

  measure(root);
  place(root);

  for (const node of orderedNodes) {
    nodes.push({
      id: node.id,
      value: node.path.length,
      label: node.label,
      x: xById.get(node.id) ?? 60,
      y: 56 + node.path.length * yGap,
      depth: node.path.length
    });

    for (const child of node.children.values()) {
      const fromX = xById.get(node.id) ?? 60;
      const toX = xById.get(child.id) ?? 60;

      edges.push({
        id: `${node.id}-${child.id}`,
        fromId: node.id,
        toId: child.id,
        fromX,
        fromY: 56 + node.path.length * yGap,
        toX,
        toY: 56 + child.path.length * yGap
      });
    }
  }

  const leafCount = leafCounts.get(root.id) ?? 1;
  const width = Math.max(720, leafCount * xGap + 120);
  const height = Math.max(300, (maxDepth + 1) * yGap + 90);

  return { nodes, edges, viewport: { width, height } };
}

function createSummaryItems({
  motion,
  nodes,
  operation,
  targetText,
  wordResults
}: {
  motion: TreeMotion;
  nodes: readonly TreeNodeState[];
  operation: TreeOperation;
  targetText?: string;
  wordResults?: readonly string[];
}) {
  const operationLabel: Record<TreeOperation, string> = {
    insert: "삽입",
    search: "검색",
    traversal: "순회",
    rebalance: "균형",
    delete: "삭제"
  };

  const motionLabel: Record<TreeMotion, string> = {
    idle: "준비",
    compare: "문자 확인",
    descend: "이동",
    insert: "노드 생성",
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

  return [
    { label: "연산", value: operationLabel[operation] },
    { label: "상태", value: motionLabel[motion] },
    { label: "노드 수", value: `${nodes.length}개` },
    {
      label: wordResults?.length ? "검색 결과" : "대상",
      value: wordResults?.length
        ? wordResults.join(", ")
        : targetText ?? "-"
    }
  ];
}

function createNode(label: string, path: string): MutableTrieNode {
  return {
    id: path === "" ? "trie-root" : `trie-node-${path}`,
    label,
    path,
    isWord: false,
    children: new Map()
  };
}

function getPreOrderNodes(root: MutableTrieNode): MutableTrieNode[] {
  return [
    root,
    ...[...root.children.values()].flatMap((child) => getPreOrderNodes(child))
  ];
}

function getTerminalNodeIds(root: MutableTrieNode): string[] {
  return getPreOrderNodes(root)
    .filter((node) => node.isWord)
    .map((node) => node.id);
}

function getNodeByPath(
  root: MutableTrieNode,
  path: string
): MutableTrieNode | undefined {
  let current: MutableTrieNode | undefined = root;

  for (const character of path) {
    current = current?.children.get(character);
  }

  return current;
}

function collectWords(root: MutableTrieNode | undefined): string[] {
  if (root === undefined) {
    return [];
  }

  const words = root.isWord ? [root.path] : [];

  return [
    ...words,
    ...[...root.children.values()].flatMap((child) => collectWords(child))
  ];
}

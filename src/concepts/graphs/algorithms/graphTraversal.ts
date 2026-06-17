import type { TraceStep } from "../../shared/types";
import type { CodeLanguage } from "../../sorting/code/types";
import type {
  GraphAdjacencyRow,
  GraphEdgeState,
  GraphNodeState,
  GraphTraversalMode,
  GraphTraversalMotion,
  GraphTraversalState
} from "../types";

type ExampleEdge = {
  fromId: string;
  toId: string;
};

type StepOptions = {
  activeEdgeIds?: string[];
  activeNodeIds?: string[];
  codeLines: number[];
  currentNodeId?: string;
  description: string;
  discoveredNodeIds: Iterable<string>;
  frontier: readonly string[];
  id: string;
  mode: GraphTraversalMode;
  motion: GraphTraversalMotion;
  pseudoCodeLine: number;
  skippedNodeIds?: string[];
  title: string;
  treeEdgeIds: readonly string[];
  visitedOrder: readonly string[];
};

const traversalNodes: GraphNodeState[] = [
  { id: "A", label: "A", x: 95, y: 190, group: "source" },
  { id: "B", label: "B", x: 245, y: 90, group: "neutral" },
  { id: "C", label: "C", x: 250, y: 200, group: "neutral" },
  { id: "D", label: "D", x: 245, y: 315, group: "neutral" },
  { id: "E", label: "E", x: 405, y: 70, group: "neutral" },
  { id: "F", label: "F", x: 415, y: 150, group: "neutral" },
  { id: "G", label: "G", x: 430, y: 260, group: "neutral" },
  { id: "H", label: "H", x: 420, y: 345, group: "neutral" },
  { id: "I", label: "I", x: 595, y: 205, group: "sink" }
];

const traversalEdges: ExampleEdge[] = [
  { fromId: "A", toId: "B" },
  { fromId: "A", toId: "C" },
  { fromId: "A", toId: "D" },
  { fromId: "B", toId: "E" },
  { fromId: "B", toId: "F" },
  { fromId: "C", toId: "G" },
  { fromId: "D", toId: "H" },
  { fromId: "E", toId: "I" },
  { fromId: "F", toId: "I" },
  { fromId: "G", toId: "H" },
  { fromId: "H", toId: "I" }
];

const adjacency = createAdjacencyMap(traversalNodes, traversalEdges);

export const GRAPH_TRAVERSAL_MODES = ["bfs", "dfs"] as const satisfies readonly GraphTraversalMode[];

export function generateGraphTraversalTrace(
  mode: GraphTraversalMode
): TraceStep<GraphTraversalState>[] {
  return mode === "bfs" ? generateBfsTrace() : generateDfsTrace();
}

export function getGraphTraversalTitle(mode: GraphTraversalMode): string {
  return mode === "bfs" ? "그래프 탐색: BFS" : "그래프 탐색: DFS";
}

export function getGraphTraversalDescription(mode: GraphTraversalMode): string {
  return mode === "bfs"
    ? "BFS는 시작 노드에서 가까운 레벨부터 넓게 방문하므로 큐의 앞에서 꺼내고 뒤에 넣습니다."
    : "DFS는 한 경로를 끝까지 파고든 뒤 되돌아오므로 스택의 맨 위 노드를 먼저 처리합니다.";
}

export function getGraphTraversalInputSummary(): string {
  return `노드 ${traversalNodes.length}개 · 간선 ${traversalEdges.length}개 · 시작 A`;
}

function generateBfsTrace(): TraceStep<GraphTraversalState>[] {
  const mode: GraphTraversalMode = "bfs";
  const trace: TraceStep<GraphTraversalState>[] = [];
  const queue = ["A"];
  const discovered = new Set(["A"]);
  const visitedOrder: string[] = [];
  const treeEdgeIds: string[] = [];

  trace.push(
    createStep({
      id: "bfs-start",
      title: "A를 큐에 넣고 시작",
      description: "시작 노드 A를 발견 처리하고 BFS 큐의 첫 원소로 둡니다.",
      mode,
      motion: "idle",
      frontier: queue,
      discoveredNodeIds: discovered,
      visitedOrder,
      treeEdgeIds,
      activeNodeIds: ["A"],
      currentNodeId: "A",
      pseudoCodeLine: 1,
      codeLines: [14, 15]
    })
  );

  while (queue.length > 0) {
    const current = queue.shift()!;

    visitedOrder.push(current);
    trace.push(
      createStep({
        id: `bfs-visit-${current}`,
        title: `${current} 방문`,
        description: `큐 앞에서 ${current}를 꺼내 방문 순서에 추가합니다.`,
        mode,
        motion: "visit",
        frontier: queue,
        discoveredNodeIds: discovered,
        visitedOrder,
        treeEdgeIds,
        activeNodeIds: [current],
        currentNodeId: current,
        pseudoCodeLine: 3,
        codeLines: [18, 19, 20]
      })
    );

    for (const next of adjacency.get(current) ?? []) {
      const edgeId = getEdgeId(current, next);

      if (discovered.has(next)) {
        trace.push(
          createStep({
            id: `bfs-skip-${current}-${next}`,
            title: `${next}는 이미 발견됨`,
            description: `${current}에서 ${next}를 확인했지만 이미 대기 목록이나 방문 순서에 있으므로 건너뜁니다.`,
            mode,
            motion: "skip",
            frontier: queue,
            discoveredNodeIds: discovered,
            visitedOrder,
            treeEdgeIds,
            activeNodeIds: [current, next],
            activeEdgeIds: [edgeId],
            currentNodeId: current,
            skippedNodeIds: [next],
            pseudoCodeLine: 4,
            codeLines: [22]
          })
        );
        continue;
      }

      discovered.add(next);
      queue.push(next);
      treeEdgeIds.push(edgeId);

      trace.push(
        createStep({
          id: `bfs-discover-${next}-from-${current}`,
          title: `${next} 발견 후 큐에 추가`,
          description: `${current}와 연결된 ${next}를 새로 발견했으므로 큐 뒤에 넣습니다.`,
          mode,
          motion: "enqueue",
          frontier: queue,
          discoveredNodeIds: discovered,
          visitedOrder,
          treeEdgeIds,
          activeNodeIds: [current, next],
          activeEdgeIds: [edgeId],
          currentNodeId: current,
          pseudoCodeLine: 5,
          codeLines: [24, 25]
        })
      );
    }
  }

  trace.push(createCompleteStep(mode, discovered, visitedOrder, treeEdgeIds));

  return trace;
}

function generateDfsTrace(): TraceStep<GraphTraversalState>[] {
  const mode: GraphTraversalMode = "dfs";
  const trace: TraceStep<GraphTraversalState>[] = [];
  const stack = ["A"];
  const discovered = new Set(["A"]);
  const visitedOrder: string[] = [];
  const treeEdgeIds: string[] = [];

  trace.push(
    createStep({
      id: "dfs-start",
      title: "A를 스택에 넣고 시작",
      description: "시작 노드 A를 발견 처리하고 DFS 스택의 첫 원소로 둡니다.",
      mode,
      motion: "idle",
      frontier: stack,
      discoveredNodeIds: discovered,
      visitedOrder,
      treeEdgeIds,
      activeNodeIds: ["A"],
      currentNodeId: "A",
      pseudoCodeLine: 1,
      codeLines: [33, 34]
    })
  );

  while (stack.length > 0) {
    const current = stack.pop()!;

    visitedOrder.push(current);
    trace.push(
      createStep({
        id: `dfs-visit-${current}`,
        title: `${current} 방문`,
        description: `스택 맨 위에서 ${current}를 꺼내 방문 순서에 추가합니다.`,
        mode,
        motion: "visit",
        frontier: stack,
        discoveredNodeIds: discovered,
        visitedOrder,
        treeEdgeIds,
        activeNodeIds: [current],
        currentNodeId: current,
        pseudoCodeLine: 3,
        codeLines: [37, 38, 39]
      })
    );

    const neighbors = [...(adjacency.get(current) ?? [])].reverse();

    for (const next of neighbors) {
      const edgeId = getEdgeId(current, next);

      if (discovered.has(next)) {
        trace.push(
          createStep({
            id: `dfs-skip-${current}-${next}`,
            title: `${next}는 이미 발견됨`,
            description: `${current}에서 ${next}를 확인했지만 이미 stack이나 방문 순서에 있으므로 건너뜁니다.`,
            mode,
            motion: "skip",
            frontier: stack,
            discoveredNodeIds: discovered,
            visitedOrder,
            treeEdgeIds,
            activeNodeIds: [current, next],
            activeEdgeIds: [edgeId],
            currentNodeId: current,
            skippedNodeIds: [next],
            pseudoCodeLine: 4,
            codeLines: [41]
          })
        );
        continue;
      }

      discovered.add(next);
      stack.push(next);
      treeEdgeIds.push(edgeId);

      trace.push(
        createStep({
          id: `dfs-discover-${next}-from-${current}`,
          title: `${next} 발견 후 스택에 추가`,
          description: `${current}와 연결된 ${next}를 새로 발견했으므로 스택 위에 올립니다.`,
          mode,
          motion: "push",
          frontier: stack,
          discoveredNodeIds: discovered,
          visitedOrder,
          treeEdgeIds,
          activeNodeIds: [current, next],
          activeEdgeIds: [edgeId],
          currentNodeId: current,
          pseudoCodeLine: 5,
          codeLines: [43, 44]
        })
      );
    }
  }

  trace.push(createCompleteStep(mode, discovered, visitedOrder, treeEdgeIds));

  return trace;
}

function createCompleteStep(
  mode: GraphTraversalMode,
  discovered: Iterable<string>,
  visitedOrder: readonly string[],
  treeEdgeIds: readonly string[]
): TraceStep<GraphTraversalState> {
  return createStep({
    id: `${mode}-complete`,
    title: `${mode.toUpperCase()} 탐색 완료`,
    description: `${mode.toUpperCase()} 방문 순서가 ${visitedOrder.join(" → ")}로 확정되었습니다.`,
    mode,
    motion: "complete",
    frontier: [],
    discoveredNodeIds: discovered,
    visitedOrder,
    treeEdgeIds,
    pseudoCodeLine: 7,
    codeLines: mode === "bfs" ? [28] : [47]
  });
}

function createStep({
  activeEdgeIds,
  activeNodeIds,
  codeLines,
  currentNodeId,
  description,
  discoveredNodeIds,
  frontier,
  id,
  mode,
  motion,
  pseudoCodeLine,
  skippedNodeIds,
  title,
  treeEdgeIds,
  visitedOrder
}: StepOptions): TraceStep<GraphTraversalState> {
  const visitedNodeIds = [...visitedOrder];
  const discoveredIds = [...discoveredNodeIds];
  const frontierItems = mode === "dfs" ? [...frontier].reverse() : [...frontier];
  const frontierLabel = mode === "dfs" ? "스택 위 → 아래" : "큐 앞 → 뒤";

  return {
    id,
    title,
    description,
    state: {
      mode,
      motion,
      nodes: traversalNodes,
      edges: renderEdges(),
      adjacencyRows: createAdjacencyRows(),
      activeEdgeIds,
      activeNodeIds,
      currentNodeId,
      discoveredNodeIds: discoveredIds,
      frontierItems,
      frontierLabel,
      skippedNodeIds,
      treeEdgeIds: [...treeEdgeIds],
      visitedNodeIds,
      visitedOrder: [...visitedOrder],
      summaryItems: [
        { label: "알고리즘", value: mode.toUpperCase() },
        { label: "방문", value: `${visitedOrder.length}개` },
        { label: "대기", value: `${frontier.length}개` },
        {
          label: "순서",
          value: visitedOrder.length ? visitedOrder.join(" → ") : "-"
        }
      ],
      viewport: { width: 720, height: 410 }
    },
    pseudoCodeLine,
    codeLineHighlights: createLanguageHighlights(codeLines)
  };
}

function renderEdges(): GraphEdgeState[] {
  const nodeById = new Map(traversalNodes.map((node) => [node.id, node]));

  return traversalEdges.map((edge) => {
    const fromNode = nodeById.get(edge.fromId)!;
    const toNode = nodeById.get(edge.toId)!;

    return {
      id: getEdgeId(edge.fromId, edge.toId),
      fromId: edge.fromId,
      toId: edge.toId,
      fromX: fromNode.x,
      fromY: fromNode.y,
      toX: toNode.x,
      toY: toNode.y
    };
  });
}

function createAdjacencyRows(): GraphAdjacencyRow[] {
  return traversalNodes.map((node) => ({
    nodeId: node.id,
    label: node.label,
    neighbors: adjacency.get(node.id)?.join(", ") ?? "-"
  }));
}

function createAdjacencyMap(
  nodes: readonly GraphNodeState[],
  edges: readonly ExampleEdge[]
): Map<string, string[]> {
  const result = new Map(nodes.map((node) => [node.id, [] as string[]]));

  for (const edge of edges) {
    result.get(edge.fromId)?.push(edge.toId);
    result.get(edge.toId)?.push(edge.fromId);
  }

  return result;
}

function getEdgeId(firstId: string, secondId: string): string {
  return [firstId, secondId].sort().join("-");
}

const graphTraversalLineHighlights: Record<string, Record<CodeLanguage, number[]>> = {
  "14,15": {
    C: [14, 15],
    "C++": [14, 15],
    Java: [14, 15],
    Python: [10, 11],
    JavaScript: [14, 15],
  },
  "18,19,20": {
    C: [18, 19, 20],
    "C++": [18, 19, 20],
    Java: [18, 19, 20],
    Python: [14, 15, 16],
    JavaScript: [18, 19, 20],
  },
  "22": {
    C: [22],
    "C++": [22],
    Java: [22],
    Python: [18],
    JavaScript: [22],
  },
  "24,25": {
    C: [24, 25],
    "C++": [24, 25],
    Java: [24, 25],
    Python: [20, 21],
    JavaScript: [24, 25],
  },
  "28": {
    C: [28],
    "C++": [28],
    Java: [28],
    Python: [22],
    JavaScript: [28],
  },
  "33,34": {
    C: [33, 34],
    "C++": [33, 34],
    Java: [33, 34],
    Python: [25, 26],
    JavaScript: [33, 34],
  },
  "37,38,39": {
    C: [37, 38, 39],
    "C++": [37, 38, 39],
    Java: [37, 38, 39],
    Python: [29, 30, 31],
    JavaScript: [37, 38, 39],
  },
  "41": {
    C: [41],
    "C++": [42],
    Java: [42],
    Python: [33],
    JavaScript: [41],
  },
  "43,44": {
    C: [43, 44],
    "C++": [44, 45],
    Java: [44, 45],
    Python: [35, 36],
    JavaScript: [43, 44],
  },
  "47": {
    C: [47],
    "C++": [48],
    Java: [48],
    Python: [37],
    JavaScript: [47],
  },
};

function createLanguageHighlights(codeLines: number[]): Record<CodeLanguage, number[]> {
  const mappedHighlights = graphTraversalLineHighlights[codeLines.join(",")];

  if (mappedHighlights !== undefined) {
    return mappedHighlights;
  }

  return {
    C: codeLines,
    "C++": codeLines,
    Java: codeLines,
    Python: codeLines,
    JavaScript: codeLines,
  };
}

import type { TraceStep } from "../../shared/types";
import type { CodeLanguage } from "../../sorting/code/types";
import type {
  GraphAdjacencyRow,
  GraphEdgeState,
  GraphKind,
  GraphMotion,
  GraphNodeGroup,
  GraphNodeState,
  GraphTraceState
} from "../types";

export const GRAPH_STRUCTURE_KINDS = [
  "undirected",
  "directed",
  "weighted",
  "dag",
  "bipartite"
] as const satisfies readonly GraphKind[];

type ExampleNode = GraphNodeState;

type ExampleEdge = {
  fromId: string;
  toId: string;
  directed?: boolean;
  weight?: number;
};

type GraphExample = {
  description: string;
  edges: ExampleEdge[];
  kind: GraphKind;
  nodes: ExampleNode[];
  title: string;
};

type StepOptions = {
  activeEdgeIds?: string[];
  activeNodeIds?: string[];
  codeLines: number[];
  description: string;
  edgeLimit?: number;
  highlightedGroup?: GraphNodeGroup;
  id: string;
  kind: GraphKind;
  motion: GraphMotion;
  nodeLimit?: number;
  pseudoCodeLine: number;
  title: string;
};

const graphExamples: Record<GraphKind, GraphExample> = {
  undirected: {
    kind: "undirected",
    title: "무방향 그래프",
    description:
      "관계에 방향이 없어서 A-B 간선은 A에서 B, B에서 A 양쪽 인접 관계로 해석합니다.",
    nodes: [
      { id: "A", label: "A", x: 120, y: 95, group: "neutral" },
      { id: "B", label: "B", x: 300, y: 70, group: "neutral" },
      { id: "C", label: "C", x: 470, y: 145, group: "neutral" },
      { id: "D", label: "D", x: 235, y: 245, group: "neutral" },
      { id: "E", label: "E", x: 430, y: 305, group: "neutral" },
      { id: "F", label: "F", x: 90, y: 300, group: "neutral" }
    ],
    edges: [
      { fromId: "A", toId: "B" },
      { fromId: "A", toId: "D" },
      { fromId: "B", toId: "C" },
      { fromId: "B", toId: "D" },
      { fromId: "C", toId: "E" },
      { fromId: "D", toId: "E" },
      { fromId: "D", toId: "F" }
    ]
  },
  directed: {
    kind: "directed",
    title: "방향 그래프",
    description:
      "간선마다 방향이 있어 A → B는 A의 outgoing, B의 incoming 관계로 구분합니다.",
    nodes: [
      { id: "A", label: "A", x: 115, y: 105, group: "source" },
      { id: "B", label: "B", x: 300, y: 80, group: "neutral" },
      { id: "C", label: "C", x: 485, y: 120, group: "neutral" },
      { id: "D", label: "D", x: 235, y: 270, group: "neutral" },
      { id: "E", label: "E", x: 430, y: 305, group: "sink" }
    ],
    edges: [
      { fromId: "A", toId: "B", directed: true },
      { fromId: "A", toId: "D", directed: true },
      { fromId: "B", toId: "C", directed: true },
      { fromId: "C", toId: "B", directed: true },
      { fromId: "D", toId: "C", directed: true },
      { fromId: "C", toId: "E", directed: true }
    ]
  },
  weighted: {
    kind: "weighted",
    title: "가중치 그래프",
    description:
      "간선에 비용이 붙어 최단 경로, 최소 신장 트리처럼 비용을 비교하는 알고리즘의 입력이 됩니다.",
    nodes: [
      { id: "S", label: "S", x: 90, y: 190, group: "source" },
      { id: "A", label: "A", x: 250, y: 90, group: "neutral" },
      { id: "B", label: "B", x: 250, y: 285, group: "neutral" },
      { id: "C", label: "C", x: 430, y: 110, group: "neutral" },
      { id: "D", label: "D", x: 430, y: 300, group: "neutral" },
      { id: "T", label: "T", x: 580, y: 200, group: "sink" }
    ],
    edges: [
      { fromId: "S", toId: "A", directed: true, weight: 4 },
      { fromId: "S", toId: "B", directed: true, weight: 2 },
      { fromId: "A", toId: "C", directed: true, weight: 5 },
      { fromId: "A", toId: "D", directed: true, weight: 10 },
      { fromId: "B", toId: "A", directed: true, weight: 1 },
      { fromId: "B", toId: "D", directed: true, weight: 7 },
      { fromId: "C", toId: "T", directed: true, weight: 3 },
      { fromId: "D", toId: "T", directed: true, weight: 1 }
    ]
  },
  dag: {
    kind: "dag",
    title: "DAG",
    description:
      "DAG는 방향이 있지만 사이클이 없는 그래프라 선후 관계, 빌드 순서, 작업 의존성을 표현하기 좋습니다.",
    nodes: [
      { id: "Spec", label: "Spec", x: 90, y: 95, group: "source" },
      { id: "API", label: "API", x: 270, y: 75, group: "neutral" },
      { id: "UI", label: "UI", x: 270, y: 205, group: "neutral" },
      { id: "Test", label: "Test", x: 455, y: 140, group: "neutral" },
      { id: "Build", label: "Build", x: 610, y: 90, group: "neutral" },
      { id: "Deploy", label: "Deploy", x: 610, y: 245, group: "sink" }
    ],
    edges: [
      { fromId: "Spec", toId: "API", directed: true },
      { fromId: "Spec", toId: "UI", directed: true },
      { fromId: "API", toId: "Test", directed: true },
      { fromId: "UI", toId: "Test", directed: true },
      { fromId: "API", toId: "Build", directed: true },
      { fromId: "Test", toId: "Deploy", directed: true },
      { fromId: "Build", toId: "Deploy", directed: true }
    ]
  },
  bipartite: {
    kind: "bipartite",
    title: "이분 그래프",
    description:
      "노드를 두 그룹으로 나누고 같은 그룹 안에는 간선을 두지 않아 매칭 문제를 표현하기 좋습니다.",
    nodes: [
      { id: "U1", label: "U1", x: 140, y: 80, group: "left" },
      { id: "U2", label: "U2", x: 140, y: 190, group: "left" },
      { id: "U3", label: "U3", x: 140, y: 300, group: "left" },
      { id: "T1", label: "T1", x: 500, y: 80, group: "right" },
      { id: "T2", label: "T2", x: 500, y: 190, group: "right" },
      { id: "T3", label: "T3", x: 500, y: 300, group: "right" }
    ],
    edges: [
      { fromId: "U1", toId: "T1" },
      { fromId: "U1", toId: "T2" },
      { fromId: "U2", toId: "T1" },
      { fromId: "U2", toId: "T3" },
      { fromId: "U3", toId: "T2" },
      { fromId: "U3", toId: "T3" }
    ]
  }
};

export function generateGraphStructureTrace(
  kind: GraphKind
): TraceStep<GraphTraceState>[] {
  const example = graphExamples[kind];
  const trace: TraceStep<GraphTraceState>[] = [
    createStep(example, {
      id: `${kind}-start`,
      title: `${example.title} 준비`,
      description: example.description,
      kind,
      motion: "idle",
      nodeLimit: 0,
      edgeLimit: 0,
      pseudoCodeLine: 1,
      codeLines: getCodeLinesForKind(kind, "start")
    })
  ];

  example.nodes.forEach((node, index) => {
    trace.push(
      createStep(example, {
        id: `${kind}-node-${node.id}`,
        title: `${node.label} 노드 추가`,
        description:
          node.group === "left" || node.group === "right"
            ? `${node.label}를 ${node.group === "left" ? "왼쪽" : "오른쪽"} 파티션에 배치합니다.`
            : `${node.label} 노드를 그래프에 배치합니다.`,
        kind,
        motion: kind === "bipartite" ? "partition" : "add-node",
        nodeLimit: index + 1,
        edgeLimit: 0,
        activeNodeIds: [node.id],
        highlightedGroup: node.group,
        pseudoCodeLine: kind === "bipartite" ? 5 : 2,
        codeLines: getCodeLinesForKind(kind, "node")
      })
    );
  });

  example.edges.forEach((edge, index) => {
    const edgeId = getEdgeId(edge);
    const motion = getEdgeMotion(kind, edge);

    trace.push(
      createStep(example, {
        id: `${kind}-edge-${edgeId}`,
        title: getEdgeTitle(example, edge),
        description: getEdgeDescription(kind, edge),
        kind,
        motion,
        nodeLimit: example.nodes.length,
        edgeLimit: index + 1,
        activeNodeIds: [edge.fromId, edge.toId],
        activeEdgeIds: [edgeId],
        pseudoCodeLine: getPseudoCodeLineForEdge(kind),
        codeLines: getCodeLinesForKind(kind, "edge")
      })
    );
  });

  trace.push(
    createStep(example, {
      id: `${kind}-complete`,
      title: `${example.title} 구조 완성`,
      description: getCompleteDescription(kind, example),
      kind,
      motion: "complete",
      nodeLimit: example.nodes.length,
      edgeLimit: example.edges.length,
      activeNodeIds: kind === "bipartite" ? ["U1", "U2", "U3", "T1", "T2", "T3"] : undefined,
      activeEdgeIds: example.edges.map(getEdgeId),
      highlightedGroup: kind === "bipartite" ? "left" : undefined,
      pseudoCodeLine: 7,
      codeLines: getCodeLinesForKind(kind, "complete")
    })
  );

  return trace;
}

export function getGraphStructureTitle(kind: GraphKind): string {
  return graphExamples[kind].title;
}

export function getGraphStructureDescription(kind: GraphKind): string {
  return graphExamples[kind].description;
}

export function getGraphStructureInputSummary(kind: GraphKind): string {
  const example = graphExamples[kind];
  const edgeLabel = kind === "weighted" ? "가중치 간선" : "간선";

  return `노드 ${example.nodes.length}개 · ${edgeLabel} ${example.edges.length}개`;
}

function createStep(
  example: GraphExample,
  {
    activeEdgeIds,
    activeNodeIds,
    codeLines,
    description,
    edgeLimit = example.edges.length,
    highlightedGroup,
    id,
    kind,
    motion,
    nodeLimit = example.nodes.length,
    pseudoCodeLine,
    title
  }: StepOptions
): TraceStep<GraphTraceState> {
  const nodes = example.nodes.slice(0, nodeLimit);
  const edges = renderEdges(nodes, example.edges.slice(0, edgeLimit));

  return {
    id,
    title,
    description,
    state: {
      kind,
      motion,
      nodes,
      edges,
      activeEdgeIds,
      activeNodeIds,
      highlightedGroup,
      adjacencyRows: createAdjacencyRows(nodes, edges),
      viewport: { width: 720, height: 390 },
      summaryItems: createSummaryItems(kind, nodes, edges)
    },
    pseudoCodeLine,
    codeLineHighlights: createLanguageHighlights(codeLines)
  };
}

function renderEdges(
  nodes: readonly GraphNodeState[],
  edges: readonly ExampleEdge[]
): GraphEdgeState[] {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  return edges.flatMap((edge) => {
    const fromNode = nodeById.get(edge.fromId);
    const toNode = nodeById.get(edge.toId);

    if (fromNode === undefined || toNode === undefined) {
      return [];
    }

    return [
      {
        id: getEdgeId(edge),
        fromId: edge.fromId,
        toId: edge.toId,
        fromX: fromNode.x,
        fromY: fromNode.y,
        toX: toNode.x,
        toY: toNode.y,
        directed: edge.directed,
        weight: edge.weight
      }
    ];
  });
}

function createAdjacencyRows(
  nodes: readonly GraphNodeState[],
  edges: readonly GraphEdgeState[]
): GraphAdjacencyRow[] {
  return nodes.map((node) => {
    const neighbors = edges.flatMap((edge) => {
      if (edge.fromId === node.id) {
        return [formatNeighbor(edge.toId, edge.weight)];
      }

      if (!edge.directed && edge.toId === node.id) {
        return [formatNeighbor(edge.fromId, edge.weight)];
      }

      return [];
    });

    return {
      nodeId: node.id,
      label: node.label,
      neighbors: neighbors.length ? neighbors.join(", ") : "-"
    };
  });
}

function formatNeighbor(nodeId: string, weight?: number): string {
  return weight === undefined ? nodeId : `${nodeId}(${weight})`;
}

function createSummaryItems(
  kind: GraphKind,
  nodes: readonly GraphNodeState[],
  edges: readonly GraphEdgeState[]
) {
  const directedCount = edges.filter((edge) => edge.directed).length;
  const weightedCount = edges.filter((edge) => edge.weight !== undefined).length;

  return [
    { label: "유형", value: graphExamples[kind].title },
    { label: "노드", value: `${nodes.length}개` },
    { label: "간선", value: `${edges.length}개` },
    {
      label: kind === "weighted" ? "가중치" : "방향",
      value:
        kind === "weighted"
          ? `${weightedCount}개`
          : directedCount
            ? `${directedCount}개`
            : "없음"
    }
  ];
}

function getEdgeMotion(kind: GraphKind, edge: ExampleEdge): GraphMotion {
  if (kind === "weighted") {
    return "weight";
  }

  if (edge.directed) {
    return "orient";
  }

  return kind === "bipartite" ? "partition" : "connect";
}

function getEdgeTitle(example: GraphExample, edge: ExampleEdge): string {
  const fromLabel = getNodeLabel(example, edge.fromId);
  const toLabel = getNodeLabel(example, edge.toId);
  const connector = edge.directed ? "→" : "-";

  return `${fromLabel} ${connector} ${toLabel} 연결`;
}

function getEdgeDescription(kind: GraphKind, edge: ExampleEdge): string {
  if (kind === "weighted") {
    return `${edge.fromId}에서 ${edge.toId}로 가는 비용 ${edge.weight}를 간선 위에 표시합니다.`;
  }

  if (kind === "directed" || kind === "dag") {
    return `${edge.fromId}에서 ${edge.toId}로만 이동할 수 있는 방향 간선을 추가합니다.`;
  }

  if (kind === "bipartite") {
    return `${edge.fromId}와 ${edge.toId}처럼 서로 다른 파티션 사이에만 간선을 둡니다.`;
  }

  return `${edge.fromId}와 ${edge.toId} 사이의 양방향 관계를 하나의 무방향 간선으로 표현합니다.`;
}

function getCompleteDescription(kind: GraphKind, example: GraphExample): string {
  if (kind === "dag") {
    return "모든 간선이 왼쪽에서 오른쪽 의존 방향으로만 흐르므로 사이클이 없는 DAG 구조입니다.";
  }

  if (kind === "bipartite") {
    return "왼쪽 그룹과 오른쪽 그룹 사이에만 간선이 있으므로 이분 그래프 조건을 만족합니다.";
  }

  return `${example.title} 예제가 완성되었습니다. 인접 리스트와 시각화를 함께 비교합니다.`;
}

function getPseudoCodeLineForEdge(kind: GraphKind): number {
  if (kind === "weighted") {
    return 4;
  }

  if (kind === "bipartite") {
    return 6;
  }

  return 3;
}

function getCodeLinesForKind(
  kind: GraphKind,
  phase: "start" | "node" | "edge" | "complete"
): number[] {
  if (phase === "start") {
    return [1];
  }

  if (phase === "node") {
    return kind === "bipartite" ? [20, 21] : [3, 4];
  }

  if (phase === "edge") {
    const lines: Record<GraphKind, number[]> = {
      undirected: [7, 8, 9],
      directed: [12, 13],
      weighted: [16, 17],
      dag: [12, 13],
      bipartite: [22, 23, 24]
    };

    return lines[kind];
  }

  const completeLines: Record<GraphKind, number[]> = {
    undirected: [7, 8, 9],
    directed: [27, 28, 29],
    weighted: [16, 17],
    dag: [27, 28, 29],
    bipartite: [32, 33]
  };

  return completeLines[kind];
}

function getNodeLabel(example: GraphExample, nodeId: string): string {
  return example.nodes.find((node) => node.id === nodeId)?.label ?? nodeId;
}

function getEdgeId(edge: ExampleEdge): string {
  return `${edge.fromId}-${edge.toId}`;
}

const graphStructureLineHighlights: Record<string, Record<CodeLanguage, number[]>> = {
  "1": {
    C: [1],
    "C++": [1],
    Java: [1],
    Python: [1],
    JavaScript: [1],
  },
  "3,4": {
    C: [3, 4],
    "C++": [3, 4],
    Java: [3, 4],
    Python: [3, 4],
    JavaScript: [3, 4],
  },
  "7,8,9": {
    C: [7, 8, 9],
    "C++": [7, 8, 9],
    Java: [7, 8, 9],
    Python: [6, 7, 8],
    JavaScript: [7, 8, 9],
  },
  "12,13": {
    C: [12, 13],
    "C++": [12, 13],
    Java: [12, 13],
    Python: [10, 11],
    JavaScript: [12, 13],
  },
  "16,17": {
    C: [16, 17],
    "C++": [16, 17],
    Java: [16, 17],
    Python: [13, 14],
    JavaScript: [16, 17],
  },
  "20,21": {
    C: [20, 21],
    "C++": [20, 21],
    Java: [20, 21],
    Python: [16, 17],
    JavaScript: [20, 21],
  },
  "22,23,24": {
    C: [22, 23, 24],
    "C++": [22, 23, 24],
    Java: [22, 23, 24],
    Python: [18, 19, 20],
    JavaScript: [22, 23, 24],
  },
  "27,28,29": {
    C: [27, 28, 29],
    "C++": [27, 28, 29],
    Java: [27, 28, 29],
    Python: [22, 23, 24],
    JavaScript: [27, 28, 29],
  },
  "32,33": {
    C: [32, 33],
    "C++": [32, 33],
    Java: [32, 33],
    Python: [26, 27],
    JavaScript: [32, 33],
  },
};

function createLanguageHighlights(codeLines: number[]): Record<CodeLanguage, number[]> {
  const mappedHighlights = graphStructureLineHighlights[codeLines.join(",")];

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

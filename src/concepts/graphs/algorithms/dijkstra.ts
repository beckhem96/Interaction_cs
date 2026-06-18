import type { TraceStep } from "../../shared/types";
import { getDijkstraCodeLineHighlights } from "../code/dijkstraExamples";
import type {
  DijkstraCodeAction,
  DijkstraDirectionMode,
  DijkstraDistanceComparison,
  DijkstraDistanceRow,
  DijkstraDistanceValue,
  DijkstraEdge,
  DijkstraEdgeRenderState,
  DijkstraEdgeStatus,
  DijkstraExample,
  DijkstraExampleId,
  DijkstraFrontierCandidate,
  DijkstraMotion,
  DijkstraNode,
  DijkstraNodeRenderState,
  DijkstraNodeStatus,
  DijkstraPathResult,
  DijkstraTraceState
} from "../types";

type AdjacencyItem = {
  edgeId: string;
  fromId: string;
  toId: string;
  weight: number;
};

type StepOptions = {
  action: DijkstraCodeAction;
  comparison?: DijkstraDistanceComparison;
  description: string;
  distances: Map<string, number>;
  edgeStatusOverrides?: Map<string, DijkstraEdgeStatus>;
  frontierSelectedNodeId?: string;
  id: string;
  inspectedEdgeId?: string;
  motion: DijkstraMotion;
  nodeStatusOverrides?: Map<string, DijkstraNodeStatus>;
  predecessors: Map<string, string | null>;
  pseudoCodeLine: number;
  selectedDestinationId?: string;
  settled: Set<string>;
  title: string;
};

export const DIJKSTRA_EXAMPLE_IDS = [
  "undirected",
  "directed"
] as const satisfies readonly DijkstraExampleId[];

const viewport = { width: 720, height: 410 };

export const dijkstraExamples: DijkstraExample[] = [
  {
    id: "undirected",
    title: "무방향 그래프",
    description:
      "양방향으로 이동할 수 있는 가중 그래프에서 같은 거리 후보가 생길 때 라벨 알파벳순으로 다음 노드를 고릅니다.",
    directionMode: "undirected",
    startNodeId: "A",
    defaultDestinationId: "F",
    nodes: [
      { id: "A", label: "A", x: 90, y: 205, role: "start" },
      { id: "B", label: "B", x: 235, y: 95, role: "normal" },
      { id: "C", label: "C", x: 235, y: 305, role: "normal" },
      { id: "D", label: "D", x: 395, y: 210, role: "normal" },
      { id: "E", label: "E", x: 530, y: 105, role: "normal" },
      { id: "F", label: "F", x: 625, y: 230, role: "destination" },
      { id: "G", label: "G", x: 530, y: 335, role: "normal" }
    ],
    edges: [
      createExampleEdge("undirected", "A", "B", 2),
      createExampleEdge("undirected", "A", "C", 2),
      createExampleEdge("undirected", "B", "D", 4),
      createExampleEdge("undirected", "B", "E", 7),
      createExampleEdge("undirected", "C", "D", 1),
      createExampleEdge("undirected", "C", "E", 5),
      createExampleEdge("undirected", "D", "F", 3),
      createExampleEdge("undirected", "E", "F", 1)
    ]
  },
  {
    id: "directed",
    title: "방향 그래프",
    description:
      "간선 방향이 최단 경로와 도달 가능성에 어떤 영향을 주는지 확인하는 방향 가중 그래프입니다.",
    directionMode: "directed",
    startNodeId: "A",
    defaultDestinationId: "F",
    nodes: [
      { id: "A", label: "A", x: 90, y: 210, role: "start" },
      { id: "B", label: "B", x: 250, y: 120, role: "normal" },
      { id: "C", label: "C", x: 250, y: 300, role: "normal" },
      { id: "D", label: "D", x: 410, y: 180, role: "normal" },
      { id: "E", label: "E", x: 540, y: 250, role: "normal" },
      { id: "F", label: "F", x: 650, y: 155, role: "destination" },
      { id: "G", label: "G", x: 630, y: 340, role: "normal" }
    ],
    edges: [
      createExampleEdge("directed", "A", "B", 4),
      createExampleEdge("directed", "A", "C", 1),
      createExampleEdge("directed", "C", "B", 2),
      createExampleEdge("directed", "C", "D", 5),
      createExampleEdge("directed", "C", "F", 12),
      createExampleEdge("directed", "B", "D", 1),
      createExampleEdge("directed", "B", "E", 7),
      createExampleEdge("directed", "D", "E", 3),
      createExampleEdge("directed", "E", "F", 1)
    ]
  }
];

export function generateDijkstraTrace(
  exampleId: DijkstraExampleId
): TraceStep<DijkstraTraceState>[] {
  const example = getDijkstraExample(exampleId);
  validateExample(example);

  const adjacency = createAdjacency(example);
  const distances = new Map(example.nodes.map((node) => [node.id, Infinity]));
  const predecessors = new Map(
    example.nodes.map((node) => [node.id, null as string | null])
  );
  const settled = new Set<string>();
  const trace: TraceStep<DijkstraTraceState>[] = [];

  distances.set(example.startNodeId, 0);

  trace.push(
    createStep(example, {
      id: `${example.id}-initialize`,
      title: "시작 거리 초기화",
      description: `시작 노드 ${example.startNodeId}의 거리를 0으로 두고 나머지 노드는 아직 도달하지 못한 상태로 둡니다.`,
      motion: "initialize",
      action: "initialize",
      distances,
      predecessors,
      settled,
      nodeStatusOverrides: new Map([[example.startNodeId, "current"]]),
      frontierSelectedNodeId: example.startNodeId,
      pseudoCodeLine: 1
    })
  );

  while (true) {
    const candidates = getFrontierCandidates(example, distances, settled);
    const current = candidates[0];

    if (current === undefined) {
      break;
    }

    trace.push(
      createStep(example, {
        id: `${example.id}-select-${current.nodeId}`,
        title: `${current.nodeId}를 현재 노드로 선택`,
        description: getSelectionDescription(candidates, current.nodeId),
        motion: "select-current",
        action: "select-current",
        distances,
        predecessors,
        settled,
        nodeStatusOverrides: new Map([[current.nodeId, "current"]]),
        frontierSelectedNodeId: current.nodeId,
        pseudoCodeLine: 2
      })
    );

    for (const edge of adjacency.get(current.nodeId) ?? []) {
      const previousDistance = toDistanceValue(distances.get(edge.toId));
      const currentDistance = distances.get(current.nodeId) ?? Infinity;
      const candidateDistance = currentDistance + edge.weight;
      const canUpdate =
        !settled.has(edge.toId) && candidateDistance < (distances.get(edge.toId) ?? Infinity);
      const comparison: DijkstraDistanceComparison = {
        fromNodeId: edge.fromId,
        toNodeId: edge.toId,
        edgeWeight: edge.weight,
        currentDistance,
        candidateDistance,
        previousDistance,
        didUpdate: canUpdate,
        reason: canUpdate
          ? `${edge.toId}까지의 더 짧은 거리 ${candidateDistance}를 찾았습니다.`
          : getSkipReason(edge.toId, candidateDistance, previousDistance, settled)
      };

      trace.push(
        createStep(example, {
          id: `${example.id}-inspect-${edge.fromId}-${edge.toId}`,
          title: `${edge.fromId} → ${edge.toId} 간선 검사`,
          description: `${edge.fromId}의 거리 ${currentDistance}에 간선 가중치 ${edge.weight}를 더해 ${edge.toId} 후보 거리 ${candidateDistance}를 계산합니다.`,
          motion: "inspect-edge",
          action: "inspect-edge",
          comparison,
          distances,
          predecessors,
          settled,
          inspectedEdgeId: edge.edgeId,
          edgeStatusOverrides: new Map([[edge.edgeId, "inspected"]]),
          nodeStatusOverrides: new Map([
            [edge.fromId, "current"],
            [edge.toId, settled.has(edge.toId) ? "settled" : "frontier"]
          ]),
          frontierSelectedNodeId: current.nodeId,
          pseudoCodeLine: 3
        })
      );

      if (canUpdate) {
        distances.set(edge.toId, candidateDistance);
        predecessors.set(edge.toId, current.nodeId);

        trace.push(
          createStep(example, {
            id: `${example.id}-relax-${edge.fromId}-${edge.toId}`,
            title: `${edge.toId} 거리 갱신`,
            description: `${edge.toId}의 기존 거리 ${formatDistance(previousDistance)}보다 후보 거리 ${candidateDistance}가 더 작으므로 거리와 이전 노드를 갱신합니다.`,
            motion: "relax",
            action: "relax",
            comparison,
            distances,
            predecessors,
            settled,
            inspectedEdgeId: edge.edgeId,
            edgeStatusOverrides: new Map([[edge.edgeId, "relaxed"]]),
            nodeStatusOverrides: new Map([
              [edge.fromId, "current"],
              [edge.toId, "updated"]
            ]),
            frontierSelectedNodeId: current.nodeId,
            pseudoCodeLine: 4
          })
        );
      } else {
        trace.push(
          createStep(example, {
            id: `${example.id}-skip-${edge.fromId}-${edge.toId}`,
            title: `${edge.toId} 거리 유지`,
            description: comparison.reason,
            motion: "skip",
            action: "skip",
            comparison,
            distances,
            predecessors,
            settled,
            inspectedEdgeId: edge.edgeId,
            edgeStatusOverrides: new Map([[edge.edgeId, "skipped"]]),
            nodeStatusOverrides: new Map([
              [edge.fromId, "current"],
              [edge.toId, settled.has(edge.toId) ? "settled" : "skipped"]
            ]),
            frontierSelectedNodeId: current.nodeId,
            pseudoCodeLine: 5
          })
        );
      }
    }

    settled.add(current.nodeId);
    trace.push(
      createStep(example, {
        id: `${example.id}-settle-${current.nodeId}`,
        title: `${current.nodeId} 최단 거리 확정`,
        description: `${current.nodeId}보다 더 짧은 미확정 후보가 없으므로 ${current.nodeId}의 최단 거리를 ${formatDistance(toDistanceValue(distances.get(current.nodeId)))}로 확정합니다.`,
        motion: "settle",
        action: "settle",
        distances,
        predecessors,
        settled,
        nodeStatusOverrides: new Map([[current.nodeId, "settled"]]),
        pseudoCodeLine: 6
      })
    );
  }

  const completeStatePreview = createFinalRecords(example, distances, predecessors);
  const defaultPath = buildPathResult(
    example,
    completeStatePreview.finalDistances,
    completeStatePreview.predecessors,
    example.defaultDestinationId
  );

  trace.push(
    createStep(example, {
      id: `${example.id}-complete`,
      title: "최단 경로 계산 완료",
      description: `도달 가능한 모든 노드의 최단 거리가 확정되었습니다. 도착 노드를 선택하면 predecessor를 따라 경로를 복원합니다.`,
      motion: "complete",
      action: "complete",
      distances,
      predecessors,
      settled,
      selectedDestinationId: example.defaultDestinationId,
      nodeStatusOverrides: new Map(
        defaultPath.pathNodeIds.map((nodeId) => [nodeId, "final-path" as const])
      ),
      edgeStatusOverrides: new Map(
        defaultPath.pathEdgeIds.map((edgeId) => [edgeId, "final-path" as const])
      ),
      pseudoCodeLine: 7
    })
  );

  return trace;
}

export function getDijkstraExample(
  exampleId: DijkstraExampleId
): DijkstraExample {
  const example = dijkstraExamples.find((item) => item.id === exampleId);

  if (example === undefined) {
    throw new Error(`Unknown Dijkstra example: ${exampleId}`);
  }

  return example;
}

export function getDijkstraTitle(exampleId: DijkstraExampleId): string {
  return getDijkstraExample(exampleId).title;
}

export function getDijkstraDescription(exampleId: DijkstraExampleId): string {
  return getDijkstraExample(exampleId).description;
}

export function getDijkstraInputSummary(exampleId: DijkstraExampleId): string {
  const example = getDijkstraExample(exampleId);
  const directionLabel = example.directionMode === "directed" ? "방향" : "무방향";

  return `${directionLabel} · 노드 ${example.nodes.length}개 · 간선 ${example.edges.length}개 · 시작 ${example.startNodeId}`;
}

export function getDijkstraPathResult(
  state: Pick<
    DijkstraTraceState,
    "exampleId" | "finalDistances" | "predecessors"
  >,
  destinationNodeId: string
): DijkstraPathResult {
  const example = getDijkstraExample(state.exampleId);

  return buildPathResult(
    example,
    state.finalDistances ?? {},
    state.predecessors ?? {},
    destinationNodeId
  );
}

function createExampleEdge(
  directionMode: DijkstraDirectionMode,
  fromId: string,
  toId: string,
  weight: number
): DijkstraEdge {
  return {
    id: getEdgeId(directionMode, fromId, toId),
    fromId,
    toId,
    weight,
    directed: directionMode === "directed"
  };
}

function validateExample(example: DijkstraExample) {
  const nodeIds = new Set(example.nodes.map((node) => node.id));

  if (nodeIds.size !== example.nodes.length) {
    throw new Error(`${example.id} Dijkstra example has duplicate node ids.`);
  }

  if (!nodeIds.has(example.startNodeId) || !nodeIds.has(example.defaultDestinationId)) {
    throw new Error(`${example.id} Dijkstra example has invalid start or destination.`);
  }

  for (const edge of example.edges) {
    if (edge.weight < 0 || !Number.isFinite(edge.weight)) {
      throw new Error("Dijkstra examples must use finite non-negative weights.");
    }

    if (!nodeIds.has(edge.fromId) || !nodeIds.has(edge.toId) || edge.fromId === edge.toId) {
      throw new Error(`${example.id} Dijkstra example has an invalid edge.`);
    }
  }
}

function createAdjacency(example: DijkstraExample): Map<string, AdjacencyItem[]> {
  const adjacency = new Map(example.nodes.map((node) => [node.id, [] as AdjacencyItem[]]));

  for (const edge of example.edges) {
    adjacency.get(edge.fromId)?.push({
      edgeId: edge.id,
      fromId: edge.fromId,
      toId: edge.toId,
      weight: edge.weight
    });

    if (example.directionMode === "undirected") {
      adjacency.get(edge.toId)?.push({
        edgeId: edge.id,
        fromId: edge.toId,
        toId: edge.fromId,
        weight: edge.weight
      });
    }
  }

  for (const items of adjacency.values()) {
    items.sort((left, right) => left.toId.localeCompare(right.toId));
  }

  return adjacency;
}

function getFrontierCandidates(
  example: DijkstraExample,
  distances: Map<string, number>,
  settled: Set<string>
) {
  return example.nodes
    .filter((node) => !settled.has(node.id) && Number.isFinite(distances.get(node.id)))
    .map((node) => ({
      nodeId: node.id,
      label: node.label,
      distance: distances.get(node.id) ?? Infinity,
      tieBreakLabel: node.label
    }))
    .sort(
      (left, right) =>
        left.distance - right.distance ||
        left.tieBreakLabel.localeCompare(right.tieBreakLabel)
    );
}

function createStep(
  example: DijkstraExample,
  {
    action,
    comparison,
    description,
    distances,
    edgeStatusOverrides = new Map(),
    frontierSelectedNodeId,
    id,
    inspectedEdgeId,
    motion,
    nodeStatusOverrides = new Map(),
    predecessors,
    pseudoCodeLine,
    selectedDestinationId,
    settled,
    title
  }: StepOptions
): TraceStep<DijkstraTraceState> {
  const finalRecords =
    motion === "complete" ? createFinalRecords(example, distances, predecessors) : undefined;
  const selectedPath =
    finalRecords !== undefined
      ? buildPathResult(
          example,
          finalRecords.finalDistances,
          finalRecords.predecessors,
          selectedDestinationId ?? example.defaultDestinationId
        )
      : undefined;

  return {
    id,
    title,
    description,
    state: {
      exampleId: example.id,
      directionMode: example.directionMode,
      motion,
      nodes: renderNodes(example, distances, settled, nodeStatusOverrides),
      edges: renderEdges(example, edgeStatusOverrides),
      distanceRows: createDistanceRows(
        example,
        distances,
        predecessors,
        settled,
        nodeStatusOverrides,
        comparison
      ),
      frontierCandidates: createFrontierCandidateStates(
        example,
        distances,
        settled,
        frontierSelectedNodeId
      ),
      currentNodeId: comparison?.fromNodeId ?? frontierSelectedNodeId,
      inspectedEdgeId,
      comparison,
      finalDistances: finalRecords?.finalDistances,
      predecessors: finalRecords?.predecessors,
      finalPathNodeIds: selectedPath?.pathNodeIds,
      finalPathEdgeIds: selectedPath?.pathEdgeIds,
      reachableDestinationIds: finalRecords?.reachableDestinationIds,
      selectedDestinationId,
      summaryItems: createSummaryItems(example, distances, settled),
      viewport
    },
    pseudoCodeLine,
    codeLineHighlights: getDijkstraCodeLineHighlights(action)
  };
}

function renderNodes(
  example: DijkstraExample,
  distances: Map<string, number>,
  settled: Set<string>,
  overrides: Map<string, DijkstraNodeStatus>
): DijkstraNodeRenderState[] {
  return example.nodes.map((node) => ({
    ...node,
    group:
      node.role === "start"
        ? "source"
        : node.role === "destination"
          ? "sink"
          : "neutral",
    status: getNodeStatus(node, distances, settled, overrides),
    distanceLabel: formatDistance(toDistanceValue(distances.get(node.id)))
  }));
}

function renderEdges(
  example: DijkstraExample,
  overrides: Map<string, DijkstraEdgeStatus>
): DijkstraEdgeRenderState[] {
  const nodeById = new Map(example.nodes.map((node) => [node.id, node]));

  return example.edges.map((edge) => {
    const fromNode = nodeById.get(edge.fromId)!;
    const toNode = nodeById.get(edge.toId)!;

    return {
      id: edge.id,
      fromId: edge.fromId,
      toId: edge.toId,
      fromX: fromNode.x,
      fromY: fromNode.y,
      toX: toNode.x,
      toY: toNode.y,
      directed: edge.directed,
      weight: edge.weight,
      status: overrides.get(edge.id) ?? "idle"
    };
  });
}

function createDistanceRows(
  example: DijkstraExample,
  distances: Map<string, number>,
  predecessors: Map<string, string | null>,
  settled: Set<string>,
  overrides: Map<string, DijkstraNodeStatus>,
  comparison?: DijkstraDistanceComparison
): DijkstraDistanceRow[] {
  return example.nodes.map((node) => {
    const status = getNodeStatus(node, distances, settled, overrides);
    const isComparedTarget = comparison?.toNodeId === node.id;

    return {
      nodeId: node.id,
      label: node.label,
      distance: toDistanceValue(distances.get(node.id)),
      previousNodeId: predecessors.get(node.id) ?? null,
      status,
      candidateDistance: isComparedTarget ? comparison.candidateDistance : undefined,
      previousDistance: isComparedTarget ? comparison.previousDistance : undefined,
      changed: isComparedTarget ? comparison.didUpdate : false
    };
  });
}

function createFrontierCandidateStates(
  example: DijkstraExample,
  distances: Map<string, number>,
  settled: Set<string>,
  selectedNodeId?: string
): DijkstraFrontierCandidate[] {
  const candidates = getFrontierCandidates(example, distances, settled);
  const selected = selectedNodeId ?? candidates[0]?.nodeId;
  const minDistance = candidates[0]?.distance;
  const minTieCount = candidates.filter(
    (candidate) => candidate.distance === minDistance
  ).length;

  return candidates.map((candidate) => ({
    ...candidate,
    isSelected: candidate.nodeId === selected,
    reason:
      candidate.nodeId === selected
        ? minTieCount > 1
          ? `거리 ${candidate.distance} 후보 중 라벨 알파벳순으로 ${candidate.label} 선택`
          : `가장 작은 임시 거리 ${candidate.distance}`
        : `임시 거리 ${candidate.distance}`
  }));
}

function getNodeStatus(
  node: DijkstraNode,
  distances: Map<string, number>,
  settled: Set<string>,
  overrides: Map<string, DijkstraNodeStatus>
): DijkstraNodeStatus {
  const override = overrides.get(node.id);

  if (override !== undefined) {
    return override;
  }

  if (settled.has(node.id)) {
    return "settled";
  }

  return Number.isFinite(distances.get(node.id)) ? "frontier" : "unreached";
}

function createSummaryItems(
  example: DijkstraExample,
  distances: Map<string, number>,
  settled: Set<string>
) {
  const frontierCount = getFrontierCandidates(example, distances, settled).length;
  const directionLabel = example.directionMode === "directed" ? "방향" : "무방향";

  return [
    { label: "예제", value: directionLabel },
    { label: "확정", value: `${settled.size}개` },
    { label: "후보", value: `${frontierCount}개` },
    { label: "시작", value: example.startNodeId }
  ];
}

function createFinalRecords(
  example: DijkstraExample,
  distances: Map<string, number>,
  predecessors: Map<string, string | null>
) {
  const finalDistances = Object.fromEntries(
    example.nodes.map((node) => [node.id, toDistanceValue(distances.get(node.id))])
  ) as Record<string, DijkstraDistanceValue>;
  const predecessorRecord = Object.fromEntries(
    example.nodes.map((node) => [node.id, predecessors.get(node.id) ?? null])
  ) as Record<string, string | null>;
  const reachableDestinationIds = example.nodes
    .filter((node) => finalDistances[node.id] !== "Infinity")
    .map((node) => node.id);

  return {
    finalDistances,
    predecessors: predecessorRecord,
    reachableDestinationIds
  };
}

function buildPathResult(
  example: DijkstraExample,
  finalDistances: Record<string, DijkstraDistanceValue>,
  predecessors: Record<string, string | null>,
  destinationNodeId: string
): DijkstraPathResult {
  const distance = finalDistances[destinationNodeId] ?? "Infinity";

  if (distance === "Infinity") {
    return {
      destinationNodeId,
      distance,
      pathNodeIds: [],
      pathEdgeIds: [],
      totalCostLabel: "도달 불가",
      isReachable: false
    };
  }

  const pathNodeIds: string[] = [];
  let cursor: string | null = destinationNodeId;

  while (cursor !== null) {
    pathNodeIds.unshift(cursor);

    if (cursor === example.startNodeId) {
      break;
    }

    cursor = predecessors[cursor] ?? null;
  }

  const pathEdgeIds = pathNodeIds.slice(1).map((nodeId, index) =>
    getEdgeId(example.directionMode, pathNodeIds[index], nodeId)
  );

  return {
    destinationNodeId,
    distance,
    pathNodeIds,
    pathEdgeIds,
    totalCostLabel: String(distance),
    isReachable: true
  };
}

function getSelectionDescription(
  candidates: ReturnType<typeof getFrontierCandidates>,
  selectedNodeId: string
): string {
  const selected = candidates.find((candidate) => candidate.nodeId === selectedNodeId)!;
  const tiedCandidates = candidates.filter(
    (candidate) => candidate.distance === selected.distance
  );

  if (tiedCandidates.length > 1) {
    return `가장 작은 임시 거리는 ${selected.distance}이고 ${tiedCandidates.map((candidate) => candidate.nodeId).join(", ")}가 같으므로 라벨 알파벳순으로 ${selected.nodeId}를 선택합니다.`;
  }

  return `미확정 후보 중 임시 거리가 가장 작은 ${selected.nodeId}를 현재 노드로 선택합니다.`;
}

function getSkipReason(
  nodeId: string,
  candidateDistance: number,
  previousDistance: DijkstraDistanceValue,
  settled: Set<string>
): string {
  if (settled.has(nodeId)) {
    return `${nodeId}는 이미 최단 거리로 확정되었으므로 후보 거리 ${candidateDistance}를 적용하지 않습니다.`;
  }

  return `후보 거리 ${candidateDistance}가 기존 거리 ${formatDistance(previousDistance)}보다 작지 않으므로 거리 표를 유지합니다.`;
}

function getEdgeId(
  directionMode: DijkstraDirectionMode,
  fromId: string,
  toId: string
): string {
  return directionMode === "directed"
    ? `${fromId}->${toId}`
    : [fromId, toId].sort().join("-");
}

function toDistanceValue(distance: number | undefined): DijkstraDistanceValue {
  return distance === undefined || !Number.isFinite(distance)
    ? "Infinity"
    : distance;
}

export function formatDistance(distance: DijkstraDistanceValue): string {
  return distance === "Infinity" ? "∞" : String(distance);
}

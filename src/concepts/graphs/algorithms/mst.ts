import type { TraceStep } from "../../shared/types";
import { getMstCodeLineHighlights } from "../code/mstExamples";
import type {
  MstCandidateDecision,
  MstCodeAction,
  MstComponentGroup,
  MstEdge,
  MstEdgeRenderState,
  MstEdgeStatus,
  MstExample,
  MstExampleId,
  MstMotion,
  MstNode,
  MstNodeRenderState,
  MstNodeStatus,
  MstResult,
  MstSortedEdgeRow,
  MstTraceState
} from "../types";

type ComponentSnapshot = string[][];

type StepOptions = {
  action: MstCodeAction;
  candidateDecision?: MstCandidateDecision;
  components: ComponentSnapshot;
  description: string;
  id: string;
  mergedNodeIds?: string[];
  motion: MstMotion;
  pseudoCodeLine: number;
  selectedEdgeIds: string[];
  skippedEdgeIds: string[];
  sortedEdges: MstEdge[];
  title: string;
};

const viewport = { width: 720, height: 410 };

export const MST_EXAMPLE_IDS = [
  "kruskal-basic"
] as const satisfies readonly MstExampleId[];

export const mstExamples: MstExample[] = [
  {
    id: "kruskal-basic",
    title: "Kruskal MST",
    description:
      "가중치가 낮은 간선부터 보면서 서로 다른 연결 성분을 잇는 간선만 선택합니다.",
    nodes: [
      { id: "A", label: "A", x: 90, y: 210 },
      { id: "B", label: "B", x: 230, y: 95 },
      { id: "C", label: "C", x: 230, y: 340 },
      { id: "D", label: "D", x: 420, y: 115 },
      { id: "E", label: "E", x: 420, y: 340 },
      { id: "F", label: "F", x: 620, y: 230 }
    ],
    edges: [
      createMstEdge("A", "B", 4),
      createMstEdge("A", "C", 3),
      createMstEdge("B", "C", 2),
      createMstEdge("B", "D", 5),
      createMstEdge("B", "E", 8),
      createMstEdge("C", "D", 4),
      createMstEdge("C", "E", 6),
      createMstEdge("D", "E", 1),
      createMstEdge("E", "F", 2)
    ]
  }
];

export function generateMstTrace(
  exampleId: MstExampleId = "kruskal-basic"
): TraceStep<MstTraceState>[] {
  const example = getMstExample(exampleId);
  validateMstExample(example);

  const sortedEdges = sortMstEdges(example.edges);
  let components = createInitialComponents(example);
  const selectedEdgeIds: string[] = [];
  const skippedEdgeIds: string[] = [];
  const trace: TraceStep<MstTraceState>[] = [];

  trace.push(
    createStep(example, {
      id: `${example.id}-initialize`,
      title: "각 노드를 독립 성분으로 준비",
      description:
        "Kruskal은 처음에 모든 노드를 서로 연결되지 않은 성분으로 보고, 간선을 하나씩 선택하며 성분을 합칩니다.",
      motion: "initialize",
      action: "initialize",
      components,
      selectedEdgeIds,
      skippedEdgeIds,
      sortedEdges,
      pseudoCodeLine: 1
    })
  );

  trace.push(
    createStep(example, {
      id: `${example.id}-sort-edges`,
      title: "간선을 비용순으로 정렬",
      description:
        "모든 간선을 가중치 오름차순으로 정렬합니다. 같은 가중치이면 간선 라벨 순서로 후보 순서를 고정합니다.",
      motion: "sort-edges",
      action: "sort-edges",
      components,
      selectedEdgeIds,
      skippedEdgeIds,
      sortedEdges,
      pseudoCodeLine: 2
    })
  );

  for (const edge of sortedEdges) {
    if (selectedEdgeIds.length === example.nodes.length - 1) {
      break;
    }

    const decision = createCandidateDecision(edge, components);

    trace.push(
      createStep(example, {
        id: `${example.id}-inspect-${edge.id}`,
        title: `${edge.label} 후보 간선 검사`,
        description: `${edge.label} 간선의 비용은 ${edge.weight}입니다. 두 끝점이 같은 성분인지 먼저 확인합니다.`,
        motion: "inspect-edge",
        action: "inspect-edge",
        candidateDecision: decision,
        components,
        selectedEdgeIds,
        skippedEdgeIds,
        sortedEdges,
        pseudoCodeLine: 3
      })
    );

    if (decision.willSelect) {
      selectedEdgeIds.push(edge.id);
      components = mergeComponents(components, edge.fromId, edge.toId);

      trace.push(
        createStep(example, {
          id: `${example.id}-select-${edge.id}`,
          title: `${edge.label} 간선 선택`,
          description: `${decision.fromComponentLabel}와 ${decision.toComponentLabel}는 서로 다른 성분이므로 ${edge.label}을 MST에 넣고 총 비용에 ${edge.weight}를 더합니다.`,
          motion: "select-edge",
          action: "select-edge",
          candidateDecision: decision,
          components,
          mergedNodeIds: getComponentForNode(components, edge.fromId),
          selectedEdgeIds,
          skippedEdgeIds,
          sortedEdges,
          pseudoCodeLine: 4
        })
      );
    } else {
      skippedEdgeIds.push(edge.id);

      trace.push(
        createStep(example, {
          id: `${example.id}-skip-${edge.id}`,
          title: `${edge.label} 간선 건너뛰기`,
          description: decision.reason,
          motion: "skip-cycle",
          action: "skip-cycle",
          candidateDecision: decision,
          components,
          selectedEdgeIds,
          skippedEdgeIds,
          sortedEdges,
          pseudoCodeLine: 5
        })
      );
    }
  }

  trace.push(
    createStep(example, {
      id: `${example.id}-complete`,
      title: "최소 신장 트리 완성",
      description:
        "선택된 간선 수가 노드 수보다 하나 적어졌으므로 모든 노드를 연결하는 최소 신장 트리가 완성되었습니다.",
      motion: "complete",
      action: "complete",
      components,
      selectedEdgeIds,
      skippedEdgeIds,
      sortedEdges,
      pseudoCodeLine: 6
    })
  );

  return trace;
}

export function getMstExample(exampleId: MstExampleId): MstExample {
  const example = mstExamples.find((item) => item.id === exampleId);

  if (example === undefined) {
    throw new Error(`Unknown MST example: ${exampleId}`);
  }

  return example;
}

export function getMstTitle(exampleId: MstExampleId): string {
  return getMstExample(exampleId).title;
}

export function getMstDescription(exampleId: MstExampleId): string {
  return getMstExample(exampleId).description;
}

export function getMstInputSummary(exampleId: MstExampleId): string {
  const example = getMstExample(exampleId);

  return `무방향 · 노드 ${example.nodes.length}개 · 간선 ${example.edges.length}개 · 목표 간선 ${example.nodes.length - 1}개`;
}

export function sortMstEdges(edges: readonly MstEdge[]): MstEdge[] {
  return [...edges].sort(
    (left, right) => left.weight - right.weight || left.orderKey.localeCompare(right.orderKey)
  );
}

function createMstEdge(fromId: string, toId: string, weight: number): MstEdge {
  const [left, right] = [fromId, toId].sort();
  const label = `${left}-${right}`;

  return {
    id: label,
    fromId: left,
    toId: right,
    weight,
    label,
    orderKey: label
  };
}

function validateMstExample(example: MstExample) {
  const nodeIds = new Set(example.nodes.map((node) => node.id));
  const edgeIds = new Set<string>();

  if (nodeIds.size !== example.nodes.length) {
    throw new Error(`${example.id} MST example has duplicate node ids.`);
  }

  for (const edge of example.edges) {
    if (edgeIds.has(edge.id)) {
      throw new Error(`${example.id} MST example has duplicate edge ids.`);
    }

    edgeIds.add(edge.id);

    if (!Number.isFinite(edge.weight)) {
      throw new Error(`${example.id} MST example has invalid edge weight.`);
    }

    if (!nodeIds.has(edge.fromId) || !nodeIds.has(edge.toId) || edge.fromId === edge.toId) {
      throw new Error(`${example.id} MST example has invalid edge endpoints.`);
    }
  }

  if (!isConnected(example)) {
    throw new Error(`${example.id} MST example must be connected.`);
  }
}

function isConnected(example: MstExample) {
  const adjacency = new Map(example.nodes.map((node) => [node.id, [] as string[]]));

  for (const edge of example.edges) {
    adjacency.get(edge.fromId)?.push(edge.toId);
    adjacency.get(edge.toId)?.push(edge.fromId);
  }

  const start = example.nodes[0]?.id;
  const visited = new Set<string>();
  const queue = start === undefined ? [] : [start];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;

    if (visited.has(nodeId)) {
      continue;
    }

    visited.add(nodeId);

    for (const next of adjacency.get(nodeId) ?? []) {
      if (!visited.has(next)) {
        queue.push(next);
      }
    }
  }

  return visited.size === example.nodes.length;
}

function createInitialComponents(example: MstExample): ComponentSnapshot {
  return example.nodes.map((node) => [node.id]);
}

function createCandidateDecision(
  edge: MstEdge,
  components: ComponentSnapshot
): MstCandidateDecision {
  const fromComponent = getComponentForNode(components, edge.fromId);
  const toComponent = getComponentForNode(components, edge.toId);
  const fromComponentId = getComponentId(fromComponent);
  const toComponentId = getComponentId(toComponent);
  const willSelect = fromComponentId !== toComponentId;

  return {
    edgeId: edge.id,
    fromNodeId: edge.fromId,
    toNodeId: edge.toId,
    weight: edge.weight,
    fromComponentId,
    toComponentId,
    fromComponentLabel: formatComponentLabel(fromComponent),
    toComponentLabel: formatComponentLabel(toComponent),
    willSelect,
    reason: willSelect
      ? `${edge.fromId}와 ${edge.toId}는 서로 다른 성분에 있어 선택해도 사이클이 생기지 않습니다.`
      : `${edge.fromId}와 ${edge.toId}는 이미 ${formatComponentLabel(fromComponent)} 성분 안에 있어 이 간선을 더하면 사이클이 생깁니다.`
  };
}

function mergeComponents(
  components: ComponentSnapshot,
  fromNodeId: string,
  toNodeId: string
): ComponentSnapshot {
  const fromComponent = getComponentForNode(components, fromNodeId);
  const toComponent = getComponentForNode(components, toNodeId);
  const mergedId = getComponentId([...fromComponent, ...toComponent]);

  return components
    .filter((component) => {
      const id = getComponentId(component);

      return id !== getComponentId(fromComponent) && id !== getComponentId(toComponent);
    })
    .concat([mergedId.split("-")])
    .sort((left, right) => left[0].localeCompare(right[0]));
}

function getComponentForNode(components: ComponentSnapshot, nodeId: string): string[] {
  const component = components.find((items) => items.includes(nodeId));

  if (component === undefined) {
    throw new Error(`Unknown component for node ${nodeId}`);
  }

  return [...component].sort();
}

function createStep(
  example: MstExample,
  {
    action,
    candidateDecision,
    components,
    description,
    id,
    mergedNodeIds = [],
    motion,
    pseudoCodeLine,
    selectedEdgeIds,
    skippedEdgeIds,
    sortedEdges,
    title
  }: StepOptions
): TraceStep<MstTraceState> {
  const totalCost = selectedEdgeIds.reduce(
    (sum, edgeId) => sum + getEdgeById(example, edgeId).weight,
    0
  );
  const result =
    motion === "complete"
      ? createMstResult(example, selectedEdgeIds, totalCost)
      : undefined;

  return {
    id,
    title,
    description,
    state: {
      exampleId: example.id,
      motion,
      nodes: renderNodes(example, components, candidateDecision, mergedNodeIds, motion),
      edges: renderEdges(example, sortedEdges, selectedEdgeIds, skippedEdgeIds, candidateDecision, motion),
      sortedEdges: createSortedEdgeRows(
        example,
        sortedEdges,
        selectedEdgeIds,
        skippedEdgeIds,
        candidateDecision,
        motion
      ),
      components: createComponentGroups(components, mergedNodeIds),
      candidateDecision,
      selectedEdgeIds: [...selectedEdgeIds],
      skippedEdgeIds: [...skippedEdgeIds],
      totalCost,
      selectedEdgeCount: selectedEdgeIds.length,
      result,
      summaryItems: createSummaryItems(example, selectedEdgeIds, skippedEdgeIds, totalCost),
      viewport
    },
    pseudoCodeLine,
    codeLineHighlights: getMstCodeLineHighlights(action)
  };
}

function renderNodes(
  example: MstExample,
  components: ComponentSnapshot,
  candidateDecision: MstCandidateDecision | undefined,
  mergedNodeIds: string[],
  motion: MstMotion
): MstNodeRenderState[] {
  return example.nodes.map((node) => {
    const component = getComponentForNode(components, node.id);

    return {
      ...node,
      group: "neutral",
      componentId: getComponentId(component),
      componentLabel: formatComponentLabel(component),
      status: getNodeStatus(node, candidateDecision, mergedNodeIds, motion)
    };
  });
}

function renderEdges(
  example: MstExample,
  sortedEdges: MstEdge[],
  selectedEdgeIds: string[],
  skippedEdgeIds: string[],
  candidateDecision: MstCandidateDecision | undefined,
  motion: MstMotion
): MstEdgeRenderState[] {
  const nodeById = new Map(example.nodes.map((node) => [node.id, node]));
  const sortedOrder = new Map(sortedEdges.map((edge, index) => [edge.id, index + 1]));

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
      label: edge.label,
      directed: false,
      weight: edge.weight,
      order: sortedOrder.get(edge.id) ?? 0,
      status: getEdgeStatus(edge.id, selectedEdgeIds, skippedEdgeIds, candidateDecision, motion)
    };
  });
}

function createSortedEdgeRows(
  example: MstExample,
  sortedEdges: MstEdge[],
  selectedEdgeIds: string[],
  skippedEdgeIds: string[],
  candidateDecision: MstCandidateDecision | undefined,
  motion: MstMotion
): MstSortedEdgeRow[] {
  return sortedEdges.map((edge, index) => {
    const status = getEdgeStatus(edge.id, selectedEdgeIds, skippedEdgeIds, candidateDecision, motion);
    const isCandidate = candidateDecision?.edgeId === edge.id;

    return {
      edgeId: edge.id,
      label: edge.label,
      weight: edge.weight,
      order: index + 1,
      status,
      decisionLabel: getDecisionLabel(status, edge, example),
      componentRelation: isCandidate
        ? `${candidateDecision.fromComponentLabel} ↔ ${candidateDecision.toComponentLabel}`
        : undefined
    };
  });
}

function createComponentGroups(
  components: ComponentSnapshot,
  mergedNodeIds: string[]
): MstComponentGroup[] {
  const mergedId = mergedNodeIds.length ? getComponentId(mergedNodeIds) : undefined;

  return components.map((component) => ({
    id: getComponentId(component),
    nodeIds: [...component].sort(),
    label: formatComponentLabel(component),
    isMergedThisStep: mergedId === getComponentId(component)
  }));
}

function getNodeStatus(
  node: MstNode,
  candidateDecision: MstCandidateDecision | undefined,
  mergedNodeIds: string[],
  motion: MstMotion
): MstNodeStatus {
  if (motion === "complete") {
    return "complete";
  }

  if (mergedNodeIds.includes(node.id)) {
    return "merged";
  }

  if (
    candidateDecision !== undefined &&
    (candidateDecision.fromNodeId === node.id || candidateDecision.toNodeId === node.id)
  ) {
    return candidateDecision.willSelect && motion === "select-edge"
      ? "selected"
      : "candidate";
  }

  return "idle";
}

function getEdgeStatus(
  edgeId: string,
  selectedEdgeIds: string[],
  skippedEdgeIds: string[],
  candidateDecision: MstCandidateDecision | undefined,
  motion: MstMotion
): MstEdgeStatus {
  if (selectedEdgeIds.includes(edgeId)) {
    return "selected";
  }

  if (skippedEdgeIds.includes(edgeId)) {
    return "skipped-cycle";
  }

  if (candidateDecision?.edgeId === edgeId) {
    return "candidate";
  }

  if (motion === "complete") {
    return "not-needed";
  }

  return "pending";
}

function getDecisionLabel(status: MstEdgeStatus, edge: MstEdge, example: MstExample): string {
  if (status === "selected") {
    return `선택됨 · 비용 ${edge.weight}`;
  }

  if (status === "skipped-cycle") {
    return "건너뜀 · 사이클";
  }

  if (status === "candidate") {
    return "현재 후보";
  }

  if (status === "not-needed") {
    return `불필요 · 이미 ${example.nodes.length - 1}개 선택`;
  }

  return "대기";
}

function createSummaryItems(
  example: MstExample,
  selectedEdgeIds: string[],
  skippedEdgeIds: string[],
  totalCost: number
) {
  return [
    { label: "선택", value: `${selectedEdgeIds.length} / ${example.nodes.length - 1}` },
    { label: "건너뜀", value: `${skippedEdgeIds.length}개` },
    { label: "총 비용", value: String(totalCost) },
    { label: "간선", value: `${example.edges.length}개` }
  ];
}

function createMstResult(
  example: MstExample,
  selectedEdgeIds: string[],
  totalCost: number
): MstResult {
  const selectedEdges = selectedEdgeIds.map((edgeId) => getEdgeById(example, edgeId));
  const coveredNodeIds = Array.from(
    new Set(selectedEdges.flatMap((edge) => [edge.fromId, edge.toId]))
  ).sort();
  const formula = selectedEdges.map((edge) => edge.weight).join(" + ");

  return {
    selectedEdgeIds: [...selectedEdgeIds],
    selectedEdgeLabels: selectedEdges.map((edge) => edge.label),
    coveredNodeIds,
    totalCost,
    costFormulaLabel: `${formula} = ${totalCost}`,
    isComplete:
      selectedEdgeIds.length === example.nodes.length - 1 &&
      coveredNodeIds.length === example.nodes.length
  };
}

function getEdgeById(example: MstExample, edgeId: string): MstEdge {
  const edge = example.edges.find((item) => item.id === edgeId);

  if (edge === undefined) {
    throw new Error(`Unknown MST edge: ${edgeId}`);
  }

  return edge;
}

function getComponentId(component: string[]): string {
  return [...component].sort().join("-");
}

function formatComponentLabel(component: string[]): string {
  return `{${[...component].sort().join(", ")}}`;
}

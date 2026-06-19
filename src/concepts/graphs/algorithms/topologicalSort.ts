import type { TraceStep } from "../../shared/types";
import { getTopologicalSortCodeLineHighlights } from "../code/topologicalSortExamples";
import type {
  TopologicalSortCandidate,
  TopologicalSortCodeAction,
  TopologicalSortEdge,
  TopologicalSortEdgeCheck,
  TopologicalSortEdgeRenderState,
  TopologicalSortEdgeStatus,
  TopologicalSortExample,
  TopologicalSortExampleId,
  TopologicalSortInDegreeRow,
  TopologicalSortMotion,
  TopologicalSortNode,
  TopologicalSortNodeRenderState,
  TopologicalSortNodeStatus,
  TopologicalSortResult,
  TopologicalSortTraceState
} from "../types";

type InDegreeSnapshot = Map<string, number>;

type StepOptions = {
  action: TopologicalSortCodeAction;
  affectedEdgeIds?: string[];
  candidateIds: string[];
  description: string;
  id: string;
  inDegrees: InDegreeSnapshot;
  motion: TopologicalSortMotion;
  newCandidateNodeIds?: string[];
  previousInDegrees?: InDegreeSnapshot;
  processedNodeIds: Set<string>;
  pseudoCodeLine: number;
  removedEdgeIds: Set<string>;
  resultOrderNodeIds: string[];
  selectedNodeId?: string;
  sourceEdgeIds?: string[];
  title: string;
  validation?: TopologicalSortResult;
};

const viewport = { width: 700, height: 430 };

export const TOPOLOGICAL_SORT_EXAMPLE_IDS = [
  "dag-basic"
] as const satisfies readonly TopologicalSortExampleId[];

export const topologicalSortExamples: TopologicalSortExample[] = [
  {
    id: "dag-basic",
    title: "DAG 위상 정렬",
    description:
      "방향 간선이 나타내는 선후관계를 따라 진입 차수 0 후보를 하나씩 결과 순서에 넣습니다.",
    candidateTieRule: "진입 차수 0 후보가 여러 개이면 노드 라벨 알파벳순으로 선택합니다.",
    nodes: [
      { id: "A", label: "A", x: 80, y: 120, description: "요구사항 정리" },
      { id: "B", label: "B", x: 80, y: 310, description: "환경 준비" },
      { id: "C", label: "C", x: 260, y: 70, description: "데이터 모델" },
      { id: "D", label: "D", x: 260, y: 220, description: "핵심 로직" },
      { id: "E", label: "E", x: 260, y: 370, description: "UI 준비" },
      { id: "F", label: "F", x: 480, y: 150, description: "검증" },
      { id: "G", label: "G", x: 480, y: 330, description: "배포 준비" }
    ],
    edges: [
      createTopologicalEdge("A", "C", 170, 72),
      createTopologicalEdge("A", "D", 156, 178),
      createTopologicalEdge("B", "D", 160, 282),
      createTopologicalEdge("B", "E", 165, 357),
      createTopologicalEdge("C", "F", 370, 78),
      createTopologicalEdge("D", "F", 380, 218),
      createTopologicalEdge("D", "G", 370, 302),
      createTopologicalEdge("E", "G", 370, 378)
    ]
  }
];

export function generateTopologicalSortTrace(
  exampleId: TopologicalSortExampleId = "dag-basic"
): TraceStep<TopologicalSortTraceState>[] {
  return generateTopologicalSortTraceForExample(getTopologicalSortExample(exampleId));
}

export function generateTopologicalSortTraceForExample(
  example: TopologicalSortExample
): TraceStep<TopologicalSortTraceState>[] {
  validateTopologicalSortExample(example);

  const inDegrees = computeInitialInDegrees(example);
  const removedEdgeIds = new Set<string>();
  const processedNodeIds = new Set<string>();
  const resultOrderNodeIds: string[] = [];
  const trace: TraceStep<TopologicalSortTraceState>[] = [];
  let candidateIds = getZeroInDegreeCandidateIds(example, inDegrees, processedNodeIds);

  trace.push(
    createStep(example, {
      id: `${example.id}-initialize`,
      title: "진입 차수 계산",
      description:
        "모든 방향 간선을 세어 각 노드로 들어오는 간선 수를 계산합니다. 진입 차수가 0이면 아직 필요한 선행 노드가 없다는 뜻입니다.",
      motion: "initialize",
      action: "initialize-indegree",
      candidateIds,
      inDegrees,
      processedNodeIds,
      removedEdgeIds,
      resultOrderNodeIds,
      pseudoCodeLine: 1
    })
  );

  while (resultOrderNodeIds.length < example.nodes.length) {
    candidateIds = getZeroInDegreeCandidateIds(example, inDegrees, processedNodeIds);

    if (candidateIds.length === 0) {
      const validation = createCycleBlockedResult(example, resultOrderNodeIds);

      trace.push(
        createStep(example, {
          id: `${example.id}-cycle-blocked`,
          title: "후보가 없어 위상 정렬 중단",
          description:
            "처리하지 않은 노드가 남아 있지만 진입 차수 0 후보가 없습니다. 이 상태는 순환 의존성이 있어 위상 정렬을 완료할 수 없다는 신호입니다.",
          motion: "cycle-blocked",
          action: "cycle-blocked",
          candidateIds: [],
          inDegrees,
          processedNodeIds,
          removedEdgeIds,
          resultOrderNodeIds,
          validation,
          pseudoCodeLine: 7
        })
      );
      break;
    }

    const selectedNodeId = candidateIds[0];
    const selectedNode = getTopologicalNode(example, selectedNodeId);
    const candidateLabels = candidateIds.map((nodeId) => getTopologicalNode(example, nodeId).label);
    const inspectDescription =
      candidateIds.length > 1
        ? `현재 후보는 ${candidateLabels.join(", ")}입니다. ${example.candidateTieRule} 그래서 ${selectedNode.label}를 먼저 고릅니다.`
        : `${selectedNode.label}의 진입 차수가 0이므로 지금 처리할 수 있습니다.`;

    trace.push(
      createStep(example, {
        id: `${example.id}-inspect-${resultOrderNodeIds.length}`,
        title: "진입 차수 0 후보 확인",
        description: inspectDescription,
        motion: "inspect-candidates",
        action: "inspect-candidates",
        candidateIds,
        inDegrees,
        processedNodeIds,
        removedEdgeIds,
        resultOrderNodeIds,
        selectedNodeId,
        pseudoCodeLine: 3
      })
    );

    processedNodeIds.add(selectedNodeId);
    resultOrderNodeIds.push(selectedNodeId);

    trace.push(
      createStep(example, {
        id: `${example.id}-select-${selectedNodeId}`,
        title: `${selectedNode.label} 선택`,
        description: `${selectedNode.label}를 결과 순서에 추가합니다. 이제 ${selectedNode.label}에서 나가는 간선을 처리해 다음 후보를 열 수 있는지 확인합니다.`,
        motion: "select-node",
        action: "append-result",
        candidateIds,
        inDegrees,
        processedNodeIds,
        removedEdgeIds,
        resultOrderNodeIds,
        selectedNodeId,
        pseudoCodeLine: 4
      })
    );

    const outgoingEdges = getOutgoingEdges(example, selectedNodeId).filter(
      (edge) => !removedEdgeIds.has(edge.id)
    );

    if (outgoingEdges.length > 0) {
      trace.push(
        createStep(example, {
          id: `${example.id}-remove-${selectedNodeId}-outgoing`,
          title: `${selectedNode.label}의 나가는 간선 처리`,
          description: `${selectedNode.label}에서 나가는 간선 ${outgoingEdges
            .map((edge) => edge.label)
            .join(", ")}을 제거하는 것처럼 처리합니다. 각 도착 노드의 진입 차수가 줄어듭니다.`,
          motion: "remove-edge",
          action: "iterate-edge",
          affectedEdgeIds: outgoingEdges.map((edge) => edge.id),
          candidateIds: getZeroInDegreeCandidateIds(example, inDegrees, processedNodeIds),
          inDegrees,
          processedNodeIds,
          removedEdgeIds,
          resultOrderNodeIds,
          selectedNodeId,
          pseudoCodeLine: 5
        })
      );
    }

    for (const edge of outgoingEdges) {
      const previousInDegrees = cloneInDegrees(inDegrees);
      const previousValue = inDegrees.get(edge.toId) ?? 0;
      const nextValue = Math.max(previousValue - 1, 0);
      inDegrees.set(edge.toId, nextValue);
      removedEdgeIds.add(edge.id);

      const opened = nextValue === 0 && !processedNodeIds.has(edge.toId);
      const targetNode = getTopologicalNode(example, edge.toId);
      const nextCandidateIds = getZeroInDegreeCandidateIds(example, inDegrees, processedNodeIds);

      trace.push(
        createStep(example, {
          id: `${example.id}-${opened ? "open" : "update"}-${edge.fromId}-${edge.toId}`,
          title: opened
            ? `${targetNode.label}가 새 후보로 열림`
            : `${targetNode.label}의 진입 차수 감소`,
          description: opened
            ? `${edge.label} 간선을 처리해 ${targetNode.label}의 진입 차수가 ${previousValue}에서 0이 되었습니다. 이제 ${targetNode.label}도 후보 큐에 들어갑니다.`
            : `${edge.label} 간선을 처리해 ${targetNode.label}의 진입 차수가 ${previousValue}에서 ${nextValue}이 되었지만, 아직 남은 선행 노드가 있습니다.`,
          motion: opened ? "enqueue-candidate" : "update-indegree",
          action: opened ? "enqueue-candidate" : "decrement-indegree",
          affectedEdgeIds: [edge.id],
          candidateIds: nextCandidateIds,
          inDegrees,
          newCandidateNodeIds: opened ? [edge.toId] : [],
          previousInDegrees,
          processedNodeIds,
          removedEdgeIds,
          resultOrderNodeIds,
          selectedNodeId,
          sourceEdgeIds: [edge.id],
          pseudoCodeLine: 6
        })
      );
    }
  }

  if (resultOrderNodeIds.length === example.nodes.length) {
    const validation = createTopologicalSortResult(example, resultOrderNodeIds);

    trace.push(
      createStep(example, {
        id: `${example.id}-complete`,
        title: "위상 정렬 완료",
        description:
          "모든 노드를 한 번씩 처리했습니다. 이제 각 방향 간선의 시작 노드가 끝 노드보다 먼저 등장하는지 확인합니다.",
        motion: "complete",
        action: "complete",
        candidateIds: [],
        inDegrees,
        processedNodeIds,
        removedEdgeIds,
        resultOrderNodeIds,
        validation,
        pseudoCodeLine: 7
      })
    );
  }

  return trace;
}

export function getTopologicalSortExample(
  exampleId: TopologicalSortExampleId
): TopologicalSortExample {
  const example = topologicalSortExamples.find((item) => item.id === exampleId);

  if (example === undefined) {
    throw new Error(`Unknown topological sort example: ${exampleId}`);
  }

  return example;
}

export function getTopologicalSortTitle(exampleId: TopologicalSortExampleId): string {
  return getTopologicalSortExample(exampleId).title;
}

export function getTopologicalSortDescription(exampleId: TopologicalSortExampleId): string {
  return getTopologicalSortExample(exampleId).description;
}

export function getTopologicalSortInputSummary(exampleId: TopologicalSortExampleId): string {
  const example = getTopologicalSortExample(exampleId);

  return `DAG · 노드 ${example.nodes.length}개 · 방향 간선 ${example.edges.length}개 · 후보 규칙: 라벨순`;
}

export function computeInitialInDegrees(
  example: TopologicalSortExample
): InDegreeSnapshot {
  const inDegrees = new Map(example.nodes.map((node) => [node.id, 0]));

  for (const edge of example.edges) {
    inDegrees.set(edge.toId, (inDegrees.get(edge.toId) ?? 0) + 1);
  }

  return inDegrees;
}

export function getZeroInDegreeCandidateIds(
  example: TopologicalSortExample,
  inDegrees: InDegreeSnapshot,
  processedNodeIds: Set<string>
): string[] {
  return example.nodes
    .filter((node) => !processedNodeIds.has(node.id) && (inDegrees.get(node.id) ?? 0) === 0)
    .map((node) => node.id)
    .sort((left, right) =>
      getTopologicalNode(example, left).label.localeCompare(getTopologicalNode(example, right).label)
    );
}

export function isTopologicalSortDag(example: TopologicalSortExample): boolean {
  const inDegrees = computeInitialInDegrees(example);
  const processed = new Set<string>();

  while (processed.size < example.nodes.length) {
    const candidates = getZeroInDegreeCandidateIds(example, inDegrees, processed);

    if (candidates.length === 0) {
      return false;
    }

    const nodeId = candidates[0];
    processed.add(nodeId);

    for (const edge of getOutgoingEdges(example, nodeId)) {
      inDegrees.set(edge.toId, Math.max((inDegrees.get(edge.toId) ?? 0) - 1, 0));
    }
  }

  return true;
}

function createTopologicalEdge(
  fromId: string,
  toId: string,
  labelX: number,
  labelY: number
): TopologicalSortEdge {
  return {
    id: `${fromId}->${toId}`,
    fromId,
    toId,
    label: `${fromId} → ${toId}`,
    labelX,
    labelY
  };
}

function validateTopologicalSortExample(example: TopologicalSortExample) {
  const nodeIds = new Set(example.nodes.map((node) => node.id));
  const edgeIds = new Set<string>();

  if (nodeIds.size !== example.nodes.length) {
    throw new Error(`${example.id} topological sort example has duplicate node ids.`);
  }

  for (const edge of example.edges) {
    if (edgeIds.has(edge.id)) {
      throw new Error(`${example.id} topological sort example has duplicate edge ids.`);
    }

    edgeIds.add(edge.id);

    if (!nodeIds.has(edge.fromId) || !nodeIds.has(edge.toId) || edge.fromId === edge.toId) {
      throw new Error(`${example.id} topological sort example has invalid edge endpoints.`);
    }
  }
}

function createStep(
  example: TopologicalSortExample,
  {
    action,
    affectedEdgeIds = [],
    candidateIds,
    description,
    id,
    inDegrees,
    motion,
    newCandidateNodeIds = [],
    previousInDegrees,
    processedNodeIds,
    pseudoCodeLine,
    removedEdgeIds,
    resultOrderNodeIds,
    selectedNodeId,
    sourceEdgeIds = [],
    title,
    validation
  }: StepOptions
): TraceStep<TopologicalSortTraceState> {
  const remainingNodeIds = example.nodes
    .map((node) => node.id)
    .filter((nodeId) => !processedNodeIds.has(nodeId));

  return {
    id,
    title,
    description,
    state: {
      exampleId: example.id,
      motion,
      nodes: renderNodes(
        example,
        inDegrees,
        candidateIds,
        processedNodeIds,
        selectedNodeId,
        newCandidateNodeIds,
        motion
      ),
      edges: renderEdges(example, inDegrees, affectedEdgeIds, removedEdgeIds, motion),
      candidateQueue: createCandidateQueue(example, candidateIds, selectedNodeId),
      inDegreeRows: createInDegreeRows(
        example,
        inDegrees,
        previousInDegrees,
        candidateIds,
        processedNodeIds,
        selectedNodeId,
        newCandidateNodeIds,
        sourceEdgeIds,
        motion
      ),
      resultOrder: resultOrderNodeIds.map((nodeId) => getTopologicalNode(example, nodeId).label),
      resultOrderNodeIds: [...resultOrderNodeIds],
      selectedNodeId,
      affectedEdgeIds: [...affectedEdgeIds],
      removedEdgeIds: Array.from(removedEdgeIds),
      newCandidateNodeIds: [...newCandidateNodeIds],
      processedNodeIds: Array.from(processedNodeIds),
      remainingNodeIds,
      validation,
      summaryItems: createSummaryItems(example, candidateIds, processedNodeIds, remainingNodeIds, removedEdgeIds),
      viewport
    },
    pseudoCodeLine,
    codeLineHighlights: getTopologicalSortCodeLineHighlights(action)
  };
}

function renderNodes(
  example: TopologicalSortExample,
  inDegrees: InDegreeSnapshot,
  candidateIds: string[],
  processedNodeIds: Set<string>,
  selectedNodeId: string | undefined,
  newCandidateNodeIds: string[],
  motion: TopologicalSortMotion
): TopologicalSortNodeRenderState[] {
  return example.nodes.map((node) => ({
    ...node,
    group: "neutral",
    inDegree: inDegrees.get(node.id) ?? 0,
    status: getNodeStatus(
      node.id,
      candidateIds,
      processedNodeIds,
      selectedNodeId,
      newCandidateNodeIds,
      motion
    )
  }));
}

function renderEdges(
  example: TopologicalSortExample,
  inDegrees: InDegreeSnapshot,
  affectedEdgeIds: string[],
  removedEdgeIds: Set<string>,
  motion: TopologicalSortMotion
): TopologicalSortEdgeRenderState[] {
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
      directed: true,
      label: edge.label,
      labelX: edge.labelX,
      labelY: edge.labelY,
      status: getEdgeStatus(edge, inDegrees, affectedEdgeIds, removedEdgeIds, motion)
    };
  });
}

function createCandidateQueue(
  example: TopologicalSortExample,
  candidateIds: string[],
  selectedNodeId: string | undefined
) {
  const items: TopologicalSortCandidate[] = candidateIds.map((nodeId) => {
    const node = getTopologicalNode(example, nodeId);

    return {
      nodeId,
      label: node.label,
      isSelected: selectedNodeId === nodeId,
      reason:
        selectedNodeId === nodeId && candidateIds.length > 1
          ? "라벨순 tie-break로 선택"
          : "진입 차수 0"
    };
  });
  const labels = items.map((item) => item.label);

  return {
    items,
    selectedNodeId,
    tieReason:
      labels.length > 1
        ? `동시 후보 ${labels.join(", ")} · 라벨 알파벳순`
        : labels.length === 1
          ? `${labels[0]}만 현재 처리 가능`
          : "현재 후보 없음"
  };
}

function createInDegreeRows(
  example: TopologicalSortExample,
  inDegrees: InDegreeSnapshot,
  previousInDegrees: InDegreeSnapshot | undefined,
  candidateIds: string[],
  processedNodeIds: Set<string>,
  selectedNodeId: string | undefined,
  newCandidateNodeIds: string[],
  sourceEdgeIds: string[],
  motion: TopologicalSortMotion
): TopologicalSortInDegreeRow[] {
  return example.nodes.map((node) => {
    const currentValue = inDegrees.get(node.id) ?? 0;
    const previousValue = previousInDegrees?.get(node.id) ?? currentValue;

    return {
      nodeId: node.id,
      label: node.label,
      previousValue,
      currentValue,
      delta: currentValue - previousValue,
      status: getRowStatus(
        node.id,
        candidateIds,
        processedNodeIds,
        selectedNodeId,
        newCandidateNodeIds,
        motion
      ),
      sourceEdgeIds: sourceEdgeIds.filter((edgeId) => getTopologicalEdge(example, edgeId).toId === node.id)
    };
  });
}

function getNodeStatus(
  nodeId: string,
  candidateIds: string[],
  processedNodeIds: Set<string>,
  selectedNodeId: string | undefined,
  newCandidateNodeIds: string[],
  motion: TopologicalSortMotion
): TopologicalSortNodeStatus {
  if (motion === "complete") {
    return "complete";
  }

  if (motion === "cycle-blocked" && !processedNodeIds.has(nodeId)) {
    return "blocked";
  }

  if (newCandidateNodeIds.includes(nodeId)) {
    return "opened";
  }

  if (selectedNodeId === nodeId && motion !== "inspect-candidates") {
    return "selected";
  }

  if (processedNodeIds.has(nodeId)) {
    return "processed";
  }

  if (candidateIds.includes(nodeId)) {
    return "candidate";
  }

  return "pending";
}

function getRowStatus(
  nodeId: string,
  candidateIds: string[],
  processedNodeIds: Set<string>,
  selectedNodeId: string | undefined,
  newCandidateNodeIds: string[],
  motion: TopologicalSortMotion
): TopologicalSortInDegreeRow["status"] {
  if (motion === "cycle-blocked" && !processedNodeIds.has(nodeId)) {
    return "blocked";
  }

  if (newCandidateNodeIds.includes(nodeId)) {
    return "opened";
  }

  if (selectedNodeId === nodeId && motion !== "inspect-candidates") {
    return "selected";
  }

  if (processedNodeIds.has(nodeId)) {
    return "processed";
  }

  if (candidateIds.includes(nodeId)) {
    return "candidate";
  }

  return "waiting";
}

function getEdgeStatus(
  edge: TopologicalSortEdge,
  inDegrees: InDegreeSnapshot,
  affectedEdgeIds: string[],
  removedEdgeIds: Set<string>,
  motion: TopologicalSortMotion
): TopologicalSortEdgeStatus {
  if (motion === "cycle-blocked" && !removedEdgeIds.has(edge.id)) {
    return "cycle-blocked";
  }

  if (affectedEdgeIds.includes(edge.id)) {
    return "active";
  }

  if (removedEdgeIds.has(edge.id)) {
    return "removed";
  }

  return (inDegrees.get(edge.toId) ?? 0) > 0 ? "blocking" : "pending";
}

function createSummaryItems(
  example: TopologicalSortExample,
  candidateIds: string[],
  processedNodeIds: Set<string>,
  remainingNodeIds: string[],
  removedEdgeIds: Set<string>
) {
  return [
    { label: "후보", value: `${candidateIds.length}개` },
    { label: "처리", value: `${processedNodeIds.size} / ${example.nodes.length}` },
    { label: "남은 노드", value: `${remainingNodeIds.length}개` },
    { label: "처리 간선", value: `${removedEdgeIds.size} / ${example.edges.length}` }
  ];
}

function createTopologicalSortResult(
  example: TopologicalSortExample,
  orderNodeIds: string[]
): TopologicalSortResult {
  const edgeChecks = createEdgeChecks(example, orderNodeIds);
  const hasUniqueNodes = new Set(orderNodeIds).size === orderNodeIds.length;
  const isValid =
    orderNodeIds.length === example.nodes.length &&
    hasUniqueNodes &&
    edgeChecks.every((check) => check.isValid);

  return {
    orderNodeIds: [...orderNodeIds],
    orderLabels: orderNodeIds.map((nodeId) => getTopologicalNode(example, nodeId).label),
    nodeCount: example.nodes.length,
    processedCount: orderNodeIds.length,
    edgeChecks,
    isValid,
    summaryText: isValid
      ? "모든 방향 간선에서 시작 노드가 끝 노드보다 먼저 등장합니다."
      : "일부 방향 간선의 선후관계를 만족하지 못했습니다."
  };
}

function createCycleBlockedResult(
  example: TopologicalSortExample,
  orderNodeIds: string[]
): TopologicalSortResult {
  return {
    orderNodeIds: [...orderNodeIds],
    orderLabels: orderNodeIds.map((nodeId) => getTopologicalNode(example, nodeId).label),
    nodeCount: example.nodes.length,
    processedCount: orderNodeIds.length,
    edgeChecks: createEdgeChecks(example, orderNodeIds),
    isValid: false,
    summaryText: "처리하지 않은 노드가 남아 있지만 후보가 없어 순환 의존성이 의심됩니다."
  };
}

function createEdgeChecks(
  example: TopologicalSortExample,
  orderNodeIds: string[]
): TopologicalSortEdgeCheck[] {
  const orderIndex = new Map(orderNodeIds.map((nodeId, index) => [nodeId, index]));

  return example.edges.map((edge) => {
    const fromIndex = orderIndex.get(edge.fromId) ?? -1;
    const toIndex = orderIndex.get(edge.toId) ?? -1;

    return {
      edgeId: edge.id,
      label: edge.label,
      fromNodeId: edge.fromId,
      toNodeId: edge.toId,
      fromIndex,
      toIndex,
      isValid: fromIndex >= 0 && toIndex >= 0 && fromIndex < toIndex
    };
  });
}

function getOutgoingEdges(
  example: TopologicalSortExample,
  nodeId: string
): TopologicalSortEdge[] {
  return example.edges.filter((edge) => edge.fromId === nodeId);
}

function getTopologicalNode(
  example: TopologicalSortExample,
  nodeId: string
): TopologicalSortNode {
  const node = example.nodes.find((item) => item.id === nodeId);

  if (node === undefined) {
    throw new Error(`Unknown topological sort node: ${nodeId}`);
  }

  return node;
}

function getTopologicalEdge(
  example: TopologicalSortExample,
  edgeId: string
): TopologicalSortEdge {
  const edge = example.edges.find((item) => item.id === edgeId);

  if (edge === undefined) {
    throw new Error(`Unknown topological sort edge: ${edgeId}`);
  }

  return edge;
}

function cloneInDegrees(inDegrees: InDegreeSnapshot): InDegreeSnapshot {
  return new Map(inDegrees);
}

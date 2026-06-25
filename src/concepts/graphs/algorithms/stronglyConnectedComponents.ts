import type { TraceStep } from "../../shared/types";
import { getStronglyConnectedComponentsCodeLineHighlights } from "../code/stronglyConnectedComponentsExamples";
import type {
  SccCodeAction,
  SccCondensationEdge,
  SccDfsPassState,
  SccEdge,
  SccEdgeRenderState,
  SccEdgeStatus,
  SccExample,
  SccExampleId,
  SccGroup,
  SccMotion,
  SccNode,
  SccNodeRenderState,
  SccNodeStatus,
  SccPhase,
  SccTraceState,
  SccValidationResult
} from "../types";

type MutableState = {
  assignedNodeIds: Set<string>;
  currentComponent?: SccGroup;
  dfs: SccDfsPassState;
  finalizedComponents: SccGroup[];
  finishStack: string[];
  firstFinishedNodeIds: Set<string>;
  firstVisitedNodeIds: Set<string>;
  isReversedGraph: boolean;
  lastPoppedNodeId?: string;
  lastPushedNodeId?: string;
  secondVisitedNodeIds: Set<string>;
};

type StepOptions = {
  action: SccCodeAction;
  activeEdgeId?: string;
  activeNodeId?: string;
  condensationEdges?: SccCondensationEdge[];
  description: string;
  id: string;
  motion: SccMotion;
  phase: SccPhase;
  pseudoCodeLine: number;
  skippedEdgeReason?: string;
  title: string;
  validation?: SccValidationResult;
};

const viewport = { width: 740, height: 380 };
const emptyDfs: SccDfsPassState = {
  pass: "none",
  visitedNodeIds: [],
  pathNodeIds: []
};

export const SCC_EXAMPLE_IDS = ["kosaraju-basic"] as const satisfies readonly SccExampleId[];

export const sccExamples: SccExample[] = [
  {
    id: "kosaraju-basic",
    title: "강한 연결 요소: SCC",
    description:
      "방향 그래프에서 서로 도달 가능한 노드들을 하나의 강한 연결 요소로 묶습니다.",
    nodes: [
      {
        id: "A",
        label: "A",
        x: 100,
        y: 130,
        description: "순환 그룹 시작",
        expectedComponentId: "C1"
      },
      {
        id: "B",
        label: "B",
        x: 250,
        y: 70,
        description: "3-node SCC",
        expectedComponentId: "C1"
      },
      {
        id: "C",
        label: "C",
        x: 250,
        y: 220,
        description: "3-node SCC",
        expectedComponentId: "C1"
      },
      {
        id: "D",
        label: "D",
        x: 430,
        y: 140,
        description: "2-node SCC",
        expectedComponentId: "C2"
      },
      {
        id: "E",
        label: "E",
        x: 530,
        y: 260,
        description: "2-node SCC",
        expectedComponentId: "C2"
      },
      {
        id: "F",
        label: "F",
        x: 650,
        y: 165,
        description: "singleton SCC",
        expectedComponentId: "C3"
      }
    ],
    edges: [
      createSccEdge("A", "B", 170, 83),
      createSccEdge("B", "C", 216, 145),
      createSccEdge("C", "A", 170, 225),
      createSccEdge("B", "D", 342, 83),
      createSccEdge("C", "D", 342, 220),
      createSccEdge("D", "E", 452, 232, 18),
      createSccEdge("E", "D", 508, 170, -18),
      createSccEdge("E", "F", 596, 228)
    ],
    traversalOrder: ["A", "B", "C", "D", "E", "F"],
    adjacencyOrder: {
      A: ["B"],
      B: ["C", "D"],
      C: ["A", "D"],
      D: ["E"],
      E: ["D", "F"],
      F: []
    }
  }
];

export function generateStronglyConnectedComponentsTrace(
  exampleId: SccExampleId = "kosaraju-basic"
): TraceStep<SccTraceState>[] {
  return generateStronglyConnectedComponentsTraceForExample(getSccExample(exampleId));
}

export function generateStronglyConnectedComponentsTraceForExample(
  example: SccExample
): TraceStep<SccTraceState>[] {
  validateSccExample(example);

  const trace: TraceStep<SccTraceState>[] = [];
  const state: MutableState = {
    assignedNodeIds: new Set(),
    dfs: emptyDfs,
    finalizedComponents: [],
    finishStack: [],
    firstFinishedNodeIds: new Set(),
    firstVisitedNodeIds: new Set(),
    isReversedGraph: false,
    secondVisitedNodeIds: new Set()
  };

  pushStep(trace, example, state, {
    id: `${example.id}-initialize`,
    title: "방향 그래프 준비",
    description:
      "첫 번째 DFS를 시작하기 전 모든 노드를 미방문으로 둡니다. 종료 순서 스택은 아직 비어 있습니다.",
    phase: "original-dfs",
    motion: "initialize",
    action: "initialize",
    pseudoCodeLine: 1
  });

  for (const nodeId of example.traversalOrder) {
    if (state.firstVisitedNodeIds.has(nodeId)) {
      continue;
    }

    runFirstPassDfs(example, trace, state, nodeId, []);
  }

  state.isReversedGraph = true;
  state.dfs = emptyDfs;
  pushStep(trace, example, state, {
    id: `${example.id}-reverse-edges`,
    title: "모든 간선 방향 뒤집기",
    description:
      "첫 DFS가 만든 종료 순서를 보존한 채, 모든 방향 간선을 반대로 뒤집어 두 번째 DFS를 준비합니다.",
    phase: "reverse-graph",
    motion: "reverse-edges",
    action: "reverse-graph",
    pseudoCodeLine: 4
  });

  let componentIndex = 1;
  while (state.finishStack.length > 0) {
    const rootId = state.finishStack.pop()!;
    state.lastPoppedNodeId = rootId;
    const root = getSccNode(example, rootId);

    pushStep(trace, example, state, {
      id: `${example.id}-pop-${rootId}`,
      title: `${root.label}를 스택에서 꺼냄`,
      description: `${root.label}를 두 번째 DFS 시작 후보로 꺼냅니다. 이미 SCC에 들어간 노드라면 새 탐색을 시작하지 않습니다.`,
      phase: "reversed-dfs",
      motion: "pop-stack",
      action: "second-pass-pop",
      activeNodeId: rootId,
      pseudoCodeLine: 5
    });

    if (state.assignedNodeIds.has(rootId)) {
      state.dfs = {
        pass: "second",
        startedNodeId: rootId,
        activeNodeId: rootId,
        visitedNodeIds: Array.from(state.secondVisitedNodeIds),
        pathNodeIds: [],
        skippedEdgeReason: `${root.label}는 이미 확정된 SCC에 포함되어 건너뜁니다.`
      };
      pushStep(trace, example, state, {
        id: `${example.id}-skip-pop-${rootId}`,
        title: `${root.label}는 이미 확정됨`,
        description: `${root.label}는 앞선 두 번째 DFS에서 이미 SCC로 모였습니다. 같은 노드는 정확히 하나의 SCC에만 속합니다.`,
        phase: "reversed-dfs",
        motion: "skip-edge",
        action: "skip-edge",
        activeNodeId: rootId,
        skippedEdgeReason: `${root.label}는 이미 SCC에 있습니다.`,
        pseudoCodeLine: 5
      });
      continue;
    }

    state.currentComponent = {
      id: `C${componentIndex}`,
      label: `SCC ${componentIndex}`,
      nodeIds: [],
      representativeNodeId: rootId,
      status: "candidate"
    };

    pushStep(trace, example, state, {
      id: `${example.id}-second-start-${rootId}`,
      title: `${root.label}에서 역방향 DFS 시작`,
      description: `${root.label}에서 뒤집힌 그래프를 따라 도달하는 노드를 현재 SCC 후보에 모읍니다.`,
      phase: "reversed-dfs",
      motion: "start-dfs",
      action: "second-pass-visit",
      activeNodeId: rootId,
      pseudoCodeLine: 6
    });

    runSecondPassDfs(example, trace, state, rootId, rootId, []);

    const finalized: SccGroup = {
      ...state.currentComponent,
      status: "finalized"
    };
    state.finalizedComponents.push(finalized);
    for (const nodeId of finalized.nodeIds) {
      state.assignedNodeIds.add(nodeId);
    }

    pushStep(trace, example, state, {
      id: `${example.id}-finalize-${finalized.id}`,
      title: `${finalized.label} 확정`,
      description: `${finalized.nodeIds
        .map((nodeId) => getSccNode(example, nodeId).label)
        .join(", ")}는 서로 도달 가능하므로 하나의 SCC로 확정합니다.`,
      phase: "reversed-dfs",
      motion: "finalize-component",
      action: "finalize-component",
      activeNodeId: rootId,
      pseudoCodeLine: 7
    });

    state.currentComponent = undefined;
    componentIndex += 1;
  }

  state.dfs = emptyDfs;
  const condensationEdges = createCondensationEdges(example, state.finalizedComponents);
  pushStep(trace, example, state, {
    id: `${example.id}-build-condensation`,
    title: "SCC를 압축한 그래프 만들기",
    description:
      "같은 SCC 내부 간선은 접고, 서로 다른 SCC 사이의 방향 간선만 남겨 condensation DAG로 요약합니다.",
    phase: "condensation",
    motion: "build-condensation",
    action: "build-condensation",
    condensationEdges,
    pseudoCodeLine: 8
  });

  const validation = createSccValidationResult(example, state.finalizedComponents, condensationEdges);
  pushStep(trace, example, state, {
    id: `${example.id}-complete`,
    title: "SCC 분석 완료",
    description:
      "모든 노드가 정확히 하나의 SCC에 포함되는지 확인하고, 컴포넌트 사이 방향 관계만 남긴 결과를 검증합니다.",
    phase: "complete",
    motion: "complete",
    action: "complete",
    condensationEdges,
    validation,
    pseudoCodeLine: 8
  });

  return trace;
}

export function getSccExample(exampleId: SccExampleId): SccExample {
  const example = sccExamples.find((item) => item.id === exampleId);

  if (example === undefined) {
    throw new Error(`Unknown SCC example: ${exampleId}`);
  }

  return example;
}

export function getSccDescription(exampleId: SccExampleId): string {
  return getSccExample(exampleId).description;
}

export function getSccInputSummary(exampleId: SccExampleId): string {
  const example = getSccExample(exampleId);

  return `방향 그래프 · 노드 ${example.nodes.length}개 · 방향 간선 ${example.edges.length}개 · Kosaraju 두 번 DFS`;
}

export function getReversedSccEdges(example: SccExample): SccEdge[] {
  return example.edges.map((edge) => ({
    ...edge,
    id: `${edge.id}:reversed`,
    fromId: edge.toId,
    toId: edge.fromId,
    label: `${edge.toId} → ${edge.fromId}`
  }));
}

export function createCondensationEdges(
  example: SccExample,
  components: SccGroup[]
): SccCondensationEdge[] {
  const componentByNode = new Map<string, string>();

  for (const component of components) {
    for (const nodeId of component.nodeIds) {
      componentByNode.set(nodeId, component.id);
    }
  }

  const edgeByPair = new Map<string, SccCondensationEdge>();

  for (const edge of example.edges) {
    const fromComponentId = componentByNode.get(edge.fromId);
    const toComponentId = componentByNode.get(edge.toId);

    if (
      fromComponentId === undefined ||
      toComponentId === undefined ||
      fromComponentId === toComponentId
    ) {
      continue;
    }

    const id = `${fromComponentId}->${toComponentId}`;
    const existing = edgeByPair.get(id);

    if (existing) {
      existing.sourceEdgeIds.push(edge.id);
      continue;
    }

    edgeByPair.set(id, {
      id,
      fromComponentId,
      toComponentId,
      sourceEdgeIds: [edge.id]
    });
  }

  return Array.from(edgeByPair.values());
}

function runFirstPassDfs(
  example: SccExample,
  trace: TraceStep<SccTraceState>[],
  state: MutableState,
  nodeId: string,
  path: string[]
) {
  const node = getSccNode(example, nodeId);
  const nextPath = [...path, nodeId];
  state.firstVisitedNodeIds.add(nodeId);
  state.dfs = {
    pass: "first",
    startedNodeId: path[0] ?? nodeId,
    activeNodeId: nodeId,
    visitedNodeIds: Array.from(state.firstVisitedNodeIds),
    pathNodeIds: nextPath
  };

  pushStep(trace, example, state, {
    id: `${example.id}-first-visit-${nodeId}`,
    title: `${node.label} 방문`,
    description: `${node.label}를 첫 번째 DFS에서 방문합니다. 아직 종료된 것은 아니므로 finish stack에는 들어가지 않습니다.`,
    phase: "original-dfs",
    motion: path.length === 0 ? "start-dfs" : "visit-node",
    action: path.length === 0 ? "first-pass-start" : "first-pass-visit",
    activeNodeId: nodeId,
    pseudoCodeLine: path.length === 0 ? 2 : 3
  });

  for (const edge of getOutgoingEdges(example, nodeId)) {
    const target = getSccNode(example, edge.toId);
    const alreadyVisited = state.firstVisitedNodeIds.has(edge.toId);
    state.dfs = {
      pass: "first",
      startedNodeId: nextPath[0],
      activeNodeId: nodeId,
      activeEdgeId: edge.id,
      visitedNodeIds: Array.from(state.firstVisitedNodeIds),
      pathNodeIds: nextPath,
      skippedEdgeReason: alreadyVisited
        ? `${target.label}는 이미 첫 DFS에서 방문되어 다시 들어가지 않습니다.`
        : undefined
    };

    pushStep(trace, example, state, {
      id: `${example.id}-first-inspect-${edge.fromId}-${edge.toId}`,
      title: `${edge.label} 확인`,
      description: alreadyVisited
        ? `${edge.label}를 확인했지만 ${target.label}는 이미 방문된 노드입니다. DFS 경로를 중복해서 만들지 않습니다.`
        : `${edge.label}를 따라 아직 방문하지 않은 ${target.label}로 깊게 들어갑니다.`,
      phase: "original-dfs",
      motion: alreadyVisited ? "skip-edge" : "inspect-edge",
      action: alreadyVisited ? "skip-edge" : "inspect-edge",
      activeEdgeId: edge.id,
      activeNodeId: nodeId,
      skippedEdgeReason: alreadyVisited ? `${target.label}는 이미 방문됨` : undefined,
      pseudoCodeLine: 3
    });

    if (!alreadyVisited) {
      runFirstPassDfs(example, trace, state, edge.toId, nextPath);
    }
  }

  state.firstFinishedNodeIds.add(nodeId);
  state.finishStack.push(nodeId);
  state.lastPushedNodeId = nodeId;
  state.dfs = {
    pass: "first",
    startedNodeId: nextPath[0],
    activeNodeId: nodeId,
    visitedNodeIds: Array.from(state.firstVisitedNodeIds),
    pathNodeIds: nextPath
  };

  pushStep(trace, example, state, {
    id: `${example.id}-finish-${nodeId}`,
    title: `${node.label} 종료`,
    description: `${node.label}에서 더 확인할 outgoing edge가 없습니다. 이제 ${node.label}를 finish stack에 push합니다.`,
    phase: "original-dfs",
    motion: "finish-node",
    action: "finish-stack-push",
    activeNodeId: nodeId,
    pseudoCodeLine: 3
  });
}

function runSecondPassDfs(
  example: SccExample,
  trace: TraceStep<SccTraceState>[],
  state: MutableState,
  nodeId: string,
  rootId: string,
  path: string[]
) {
  const node = getSccNode(example, nodeId);
  const nextPath = [...path, nodeId];
  state.secondVisitedNodeIds.add(nodeId);
  state.currentComponent?.nodeIds.push(nodeId);
  state.dfs = {
    pass: "second",
    startedNodeId: rootId,
    activeNodeId: nodeId,
    visitedNodeIds: Array.from(state.secondVisitedNodeIds),
    pathNodeIds: nextPath
  };

  pushStep(trace, example, state, {
    id: `${example.id}-component-add-${nodeId}`,
    title: `${node.label}를 현재 SCC에 추가`,
    description: `${node.label}는 뒤집힌 그래프에서 ${getSccNode(example, rootId).label}로부터 도달되었습니다. 현재 SCC 후보에 추가합니다.`,
    phase: "reversed-dfs",
    motion: "add-to-component",
    action: path.length === 0 ? "second-pass-visit" : "add-to-component",
    activeNodeId: nodeId,
    pseudoCodeLine: 6
  });

  for (const edge of getReversedOutgoingEdges(example, nodeId)) {
    const target = getSccNode(example, edge.toId);
    const alreadyAssigned = state.assignedNodeIds.has(edge.toId);
    const alreadyVisited = state.secondVisitedNodeIds.has(edge.toId);
    state.dfs = {
      pass: "second",
      startedNodeId: rootId,
      activeNodeId: nodeId,
      activeEdgeId: edge.originalId,
      visitedNodeIds: Array.from(state.secondVisitedNodeIds),
      pathNodeIds: nextPath,
      skippedEdgeReason:
        alreadyAssigned || alreadyVisited
          ? `${target.label}는 이미 현재 또는 이전 SCC에서 처리되었습니다.`
          : undefined
    };

    pushStep(trace, example, state, {
      id: `${example.id}-second-inspect-${edge.fromId}-${edge.toId}`,
      title: `${edge.fromId} → ${edge.toId} 역방향 간선 확인`,
      description:
        alreadyAssigned || alreadyVisited
          ? `${edge.fromId} → ${edge.toId}를 확인했지만 ${target.label}는 이미 처리된 노드라 현재 SCC에 중복 추가하지 않습니다.`
          : `${edge.fromId} → ${edge.toId}를 따라 ${target.label}도 같은 SCC 후보인지 확인합니다.`,
      phase: "reversed-dfs",
      motion: alreadyAssigned || alreadyVisited ? "skip-edge" : "inspect-edge",
      action: alreadyAssigned || alreadyVisited ? "skip-edge" : "inspect-edge",
      activeEdgeId: edge.originalId,
      activeNodeId: nodeId,
      skippedEdgeReason:
        alreadyAssigned || alreadyVisited ? `${target.label}는 이미 처리됨` : undefined,
      pseudoCodeLine: 6
    });

    if (!alreadyAssigned && !alreadyVisited) {
      runSecondPassDfs(example, trace, state, edge.toId, rootId, nextPath);
    }
  }
}

function pushStep(
  trace: TraceStep<SccTraceState>[],
  example: SccExample,
  state: MutableState,
  options: StepOptions
) {
  trace.push(createStep(example, state, options));
}

function createStep(
  example: SccExample,
  state: MutableState,
  {
    action,
    activeEdgeId,
    activeNodeId,
    condensationEdges = [],
    description,
    id,
    motion,
    phase,
    pseudoCodeLine,
    skippedEdgeReason,
    title,
    validation
  }: StepOptions
): TraceStep<SccTraceState> {
  const dfs: SccDfsPassState = {
    ...state.dfs,
    activeEdgeId: activeEdgeId ?? state.dfs.activeEdgeId,
    activeNodeId: activeNodeId ?? state.dfs.activeNodeId,
    skippedEdgeReason: skippedEdgeReason ?? state.dfs.skippedEdgeReason
  };

  return {
    id,
    title,
    description,
    state: {
      exampleId: example.id,
      phase,
      motion,
      nodes: renderNodes(example, state, phase, activeNodeId),
      edges: renderEdges(example, phase, motion, activeEdgeId, condensationEdges),
      dfs,
      finishStack: {
        items: [...state.finishStack],
        topNodeId: state.finishStack.at(-1),
        lastPushedNodeId: state.lastPushedNodeId,
        lastPoppedNodeId: state.lastPoppedNodeId
      },
      currentComponent: state.currentComponent
        ? { ...state.currentComponent, nodeIds: [...state.currentComponent.nodeIds] }
        : undefined,
      finalizedComponents: state.finalizedComponents.map((component) => ({
        ...component,
        nodeIds: [...component.nodeIds]
      })),
      condensationEdges: [...condensationEdges],
      validation,
      isReversedGraph: state.isReversedGraph,
      summaryItems: createSummaryItems(example, state, phase),
      viewport
    },
    pseudoCodeLine,
    codeLineHighlights: getStronglyConnectedComponentsCodeLineHighlights(action)
  };
}

function renderNodes(
  example: SccExample,
  state: MutableState,
  phase: SccPhase,
  activeNodeId?: string
): SccNodeRenderState[] {
  const componentByNode = new Map<string, SccGroup>();
  for (const component of state.finalizedComponents) {
    for (const nodeId of component.nodeIds) {
      componentByNode.set(nodeId, component);
    }
  }
  if (state.currentComponent) {
    for (const nodeId of state.currentComponent.nodeIds) {
      componentByNode.set(nodeId, state.currentComponent);
    }
  }

  return example.nodes.map((node) => {
    const component = componentByNode.get(node.id);

    return {
      ...node,
      group: "neutral",
      componentId: component?.id,
      componentLabel: component?.label,
      status: getNodeStatus(node.id, state, phase, activeNodeId)
    };
  });
}

function renderEdges(
  example: SccExample,
  phase: SccPhase,
  motion: SccMotion,
  activeEdgeId?: string,
  condensationEdges: SccCondensationEdge[] = []
): SccEdgeRenderState[] {
  const nodeById = new Map(example.nodes.map((node) => [node.id, node]));
  const condensationSourceEdges = new Set(
    condensationEdges.flatMap((edge) => edge.sourceEdgeIds)
  );

  return example.edges.map((edge) => {
    const isReversed = phase === "reverse-graph" || phase === "reversed-dfs";
    const fromId = isReversed ? edge.toId : edge.fromId;
    const toId = isReversed ? edge.fromId : edge.toId;
    const fromNode = nodeById.get(fromId)!;
    const toNode = nodeById.get(toId)!;

    return {
      id: edge.id,
      fromId,
      toId,
      fromX: fromNode.x,
      fromY: fromNode.y,
      toX: toNode.x,
      toY: toNode.y,
      directed: true,
      label: isReversed ? `${fromId} → ${toId}` : edge.label,
      labelX: edge.labelX,
      labelY: edge.labelY,
      curve: isReversed ? -(edge.curve ?? 0) : edge.curve ?? 0,
      originalFromId: edge.fromId,
      originalToId: edge.toId,
      status: getEdgeStatus(edge.id, phase, motion, activeEdgeId, condensationSourceEdges)
    };
  });
}

function getNodeStatus(
  nodeId: string,
  state: MutableState,
  phase: SccPhase,
  activeNodeId?: string
): SccNodeStatus {
  const currentComponent = state.currentComponent;
  const finalizedComponent = state.finalizedComponents.find((component) =>
    component.nodeIds.includes(nodeId)
  );

  if (currentComponent?.nodeIds.includes(nodeId)) {
    return "current-component";
  }

  if (finalizedComponent) {
    return finalizedComponent.nodeIds.length === 1 ? "singleton" : "finalized";
  }

  if (phase === "reversed-dfs" && activeNodeId === nodeId) {
    return "second-active";
  }

  if (phase === "original-dfs" && activeNodeId === nodeId) {
    return "first-active";
  }

  if (state.finishStack.at(-1) === nodeId && phase !== "complete") {
    return "stack-top";
  }

  if (state.firstFinishedNodeIds.has(nodeId)) {
    return "first-finished";
  }

  return "unvisited";
}

function getEdgeStatus(
  edgeId: string,
  phase: SccPhase,
  motion: SccMotion,
  activeEdgeId: string | undefined,
  condensationSourceEdges: Set<string>
): SccEdgeStatus {
  if (phase === "condensation" || phase === "complete") {
    return condensationSourceEdges.has(edgeId) ? "condensation" : "internal";
  }

  if (phase === "reverse-graph") {
    return "reversed";
  }

  if (phase === "reversed-dfs") {
    return activeEdgeId === edgeId ? "active-reversed" : "reversed";
  }

  if (activeEdgeId === edgeId) {
    return motion === "skip-edge" ? "skipped-original" : "active-original";
  }

  return "normal";
}

function createSummaryItems(example: SccExample, state: MutableState, phase: SccPhase) {
  return [
    {
      label: "단계",
      value:
        phase === "original-dfs"
          ? "첫 DFS"
          : phase === "reverse-graph"
            ? "간선 뒤집기"
            : phase === "reversed-dfs"
              ? "두 번째 DFS"
              : phase === "condensation"
                ? "압축"
                : "완료"
    },
    { label: "finish stack", value: `${state.finishStack.length}개` },
    { label: "확정 SCC", value: `${state.finalizedComponents.length}개` },
    { label: "노드", value: `${state.assignedNodeIds.size} / ${example.nodes.length}` }
  ];
}

function createSccValidationResult(
  example: SccExample,
  components: SccGroup[],
  condensationEdges: SccCondensationEdge[]
): SccValidationResult {
  const nodeCoverage = components.flatMap((component) => component.nodeIds);
  const uniqueNodeIds = new Set(nodeCoverage);
  const allNodesCovered =
    uniqueNodeIds.size === example.nodes.length &&
    example.nodes.every((node) => uniqueNodeIds.has(node.id));
  const hasDuplicateMembership = uniqueNodeIds.size !== nodeCoverage.length;

  return {
    componentCount: components.length,
    nodeCoverage,
    components: components.map((component) => ({
      ...component,
      nodeIds: [...component.nodeIds]
    })),
    condensationEdges,
    allNodesCovered,
    hasDuplicateMembership,
    summaryText:
      allNodesCovered && !hasDuplicateMembership
        ? "모든 노드가 정확히 하나의 SCC에 포함되었습니다. 내부 순환은 접고 컴포넌트 사이 방향 간선만 남깁니다."
        : "일부 노드의 SCC 소속이 누락되었거나 중복되었습니다."
  };
}

function createSccEdge(
  fromId: string,
  toId: string,
  labelX: number,
  labelY: number,
  curve = 0
): SccEdge {
  return {
    id: `${fromId}->${toId}`,
    fromId,
    toId,
    label: `${fromId} → ${toId}`,
    labelX,
    labelY,
    curve
  };
}

function validateSccExample(example: SccExample) {
  const nodeIds = new Set(example.nodes.map((node) => node.id));
  const edgeIds = new Set<string>();

  if (nodeIds.size !== example.nodes.length) {
    throw new Error(`${example.id} SCC example has duplicate node ids.`);
  }

  for (const edge of example.edges) {
    if (edgeIds.has(edge.id)) {
      throw new Error(`${example.id} SCC example has duplicate edge ids.`);
    }
    edgeIds.add(edge.id);

    if (!nodeIds.has(edge.fromId) || !nodeIds.has(edge.toId)) {
      throw new Error(`${example.id} SCC example has invalid edge endpoints.`);
    }
  }

  const expectedComponents = new Set(example.nodes.map((node) => node.expectedComponentId));
  if (expectedComponents.size < 3) {
    throw new Error(`${example.id} SCC example must include at least three SCCs.`);
  }
}

type ReversedRuntimeEdge = {
  id: string;
  originalId: string;
  fromId: string;
  toId: string;
};

function getOutgoingEdges(example: SccExample, nodeId: string): SccEdge[] {
  const order = example.adjacencyOrder[nodeId] ?? [];
  const edges = example.edges.filter((edge) => edge.fromId === nodeId);

  return [...edges].sort(
    (left, right) => order.indexOf(left.toId) - order.indexOf(right.toId)
  );
}

function getReversedOutgoingEdges(
  example: SccExample,
  nodeId: string
): ReversedRuntimeEdge[] {
  const edges = example.edges
    .filter((edge) => edge.toId === nodeId)
    .map((edge) => ({
      id: `${edge.toId}->${edge.fromId}`,
      originalId: edge.id,
      fromId: edge.toId,
      toId: edge.fromId
    }));

  return edges.sort((left, right) =>
    getSccNode(example, left.toId).label.localeCompare(getSccNode(example, right.toId).label)
  );
}

function getSccNode(example: SccExample, nodeId: string): SccNode {
  const node = example.nodes.find((item) => item.id === nodeId);

  if (node === undefined) {
    throw new Error(`Unknown SCC node: ${nodeId}`);
  }

  return node;
}

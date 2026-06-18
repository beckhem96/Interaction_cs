export type GraphKind =
  | "undirected"
  | "directed"
  | "weighted"
  | "dag"
  | "bipartite";

export type GraphMotion =
  | "idle"
  | "add-node"
  | "connect"
  | "orient"
  | "weight"
  | "partition"
  | "complete";

export type GraphNodeGroup = "left" | "right" | "neutral" | "source" | "sink";

export type GraphNodeState = {
  id: string;
  label: string;
  x: number;
  y: number;
  group?: GraphNodeGroup;
};

export type GraphEdgeState = {
  id: string;
  fromId: string;
  toId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  directed?: boolean;
  weight?: number;
};

export type GraphAdjacencyRow = {
  nodeId: string;
  label: string;
  neighbors: string;
};

export type GraphTraceState = {
  kind: GraphKind;
  motion: GraphMotion;
  nodes: GraphNodeState[];
  edges: GraphEdgeState[];
  activeNodeIds?: string[];
  activeEdgeIds?: string[];
  highlightedGroup?: GraphNodeGroup;
  adjacencyRows: GraphAdjacencyRow[];
  summaryItems?: { label: string; value: string }[];
  viewport: {
    width: number;
    height: number;
  };
};

export type GraphTraversalMode = "bfs" | "dfs";

export type GraphTraversalMotion =
  | "idle"
  | "visit"
  | "inspect"
  | "enqueue"
  | "push"
  | "skip"
  | "complete";

export type GraphTraversalState = {
  mode: GraphTraversalMode;
  motion: GraphTraversalMotion;
  nodes: GraphNodeState[];
  edges: GraphEdgeState[];
  adjacencyRows: GraphAdjacencyRow[];
  activeNodeIds?: string[];
  activeEdgeIds?: string[];
  currentNodeId?: string;
  discoveredNodeIds: string[];
  frontierItems: string[];
  frontierLabel: string;
  skippedNodeIds?: string[];
  treeEdgeIds: string[];
  visitedNodeIds: string[];
  visitedOrder: string[];
  summaryItems?: { label: string; value: string }[];
  viewport: {
    width: number;
    height: number;
  };
};

export type DijkstraExampleId = "undirected" | "directed";

export type DijkstraDirectionMode = "undirected" | "directed";

export type DijkstraNodeRole = "start" | "normal" | "destination";

export type DijkstraNodeStatus =
  | "unreached"
  | "frontier"
  | "current"
  | "updated"
  | "skipped"
  | "settled"
  | "final-path";

export type DijkstraEdgeStatus =
  | "idle"
  | "inspected"
  | "relaxed"
  | "skipped"
  | "final-path";

export type DijkstraMotion =
  | "initialize"
  | "select-current"
  | "inspect-edge"
  | "relax"
  | "skip"
  | "settle"
  | "complete";

export type DijkstraCodeAction =
  | "initialize"
  | "select-current"
  | "inspect-edge"
  | "relax"
  | "skip"
  | "settle"
  | "complete";

export type DijkstraNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  role: DijkstraNodeRole;
};

export type DijkstraEdge = {
  id: string;
  fromId: string;
  toId: string;
  weight: number;
  directed: boolean;
};

export type DijkstraExample = {
  id: DijkstraExampleId;
  title: string;
  description: string;
  directionMode: DijkstraDirectionMode;
  startNodeId: string;
  defaultDestinationId: string;
  nodes: DijkstraNode[];
  edges: DijkstraEdge[];
};

export type DijkstraNodeRenderState = GraphNodeState & {
  role: DijkstraNodeRole;
  status: DijkstraNodeStatus;
  distanceLabel: string;
};

export type DijkstraEdgeRenderState = GraphEdgeState & {
  status: DijkstraEdgeStatus;
  directed: boolean;
  weight: number;
};

export type DijkstraDistanceValue = number | "Infinity";

export type DijkstraDistanceRow = {
  nodeId: string;
  label: string;
  distance: DijkstraDistanceValue;
  previousNodeId: string | null;
  status: DijkstraNodeStatus;
  candidateDistance?: number;
  previousDistance?: DijkstraDistanceValue;
  changed?: boolean;
};

export type DijkstraFrontierCandidate = {
  nodeId: string;
  label: string;
  distance: number;
  tieBreakLabel: string;
  isSelected: boolean;
  reason: string;
};

export type DijkstraDistanceComparison = {
  fromNodeId: string;
  toNodeId: string;
  edgeWeight: number;
  currentDistance: number;
  candidateDistance: number;
  previousDistance: DijkstraDistanceValue;
  didUpdate: boolean;
  reason: string;
};

export type DijkstraPathResult = {
  destinationNodeId: string;
  distance: DijkstraDistanceValue;
  pathNodeIds: string[];
  pathEdgeIds: string[];
  totalCostLabel: string;
  isReachable: boolean;
};

export type DijkstraTraceState = {
  exampleId: DijkstraExampleId;
  directionMode: DijkstraDirectionMode;
  motion: DijkstraMotion;
  nodes: DijkstraNodeRenderState[];
  edges: DijkstraEdgeRenderState[];
  distanceRows: DijkstraDistanceRow[];
  frontierCandidates: DijkstraFrontierCandidate[];
  currentNodeId?: string;
  inspectedEdgeId?: string;
  comparison?: DijkstraDistanceComparison;
  finalDistances?: Record<string, DijkstraDistanceValue>;
  predecessors?: Record<string, string | null>;
  finalPathNodeIds?: string[];
  finalPathEdgeIds?: string[];
  reachableDestinationIds?: string[];
  selectedDestinationId?: string;
  summaryItems?: { label: string; value: string }[];
  viewport: {
    width: number;
    height: number;
  };
};

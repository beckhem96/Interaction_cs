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

export type MstExampleId = "kruskal-basic";

export type MstMotion =
  | "initialize"
  | "sort-edges"
  | "inspect-edge"
  | "select-edge"
  | "skip-cycle"
  | "complete";

export type MstCodeAction = MstMotion;

export type MstNodeStatus =
  | "idle"
  | "candidate"
  | "selected"
  | "merged"
  | "complete";

export type MstEdgeStatus =
  | "pending"
  | "candidate"
  | "selected"
  | "skipped-cycle"
  | "not-needed";

export type MstNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type MstEdge = {
  id: string;
  fromId: string;
  toId: string;
  weight: number;
  label: string;
  orderKey: string;
};

export type MstExample = {
  id: MstExampleId;
  title: string;
  description: string;
  nodes: MstNode[];
  edges: MstEdge[];
};

export type MstNodeRenderState = GraphNodeState & {
  componentId: string;
  componentLabel: string;
  status: MstNodeStatus;
};

export type MstEdgeRenderState = GraphEdgeState & {
  label: string;
  order: number;
  status: MstEdgeStatus;
  weight: number;
};

export type MstSortedEdgeRow = {
  edgeId: string;
  label: string;
  weight: number;
  order: number;
  status: MstEdgeStatus;
  decisionLabel: string;
  componentRelation?: string;
};

export type MstComponentGroup = {
  id: string;
  nodeIds: string[];
  label: string;
  isMergedThisStep: boolean;
};

export type MstCandidateDecision = {
  edgeId: string;
  fromNodeId: string;
  toNodeId: string;
  weight: number;
  fromComponentId: string;
  toComponentId: string;
  fromComponentLabel: string;
  toComponentLabel: string;
  willSelect: boolean;
  reason: string;
};

export type MstResult = {
  selectedEdgeIds: string[];
  selectedEdgeLabels: string[];
  coveredNodeIds: string[];
  totalCost: number;
  costFormulaLabel: string;
  isComplete: boolean;
};

export type MstTraceState = {
  exampleId: MstExampleId;
  motion: MstMotion;
  nodes: MstNodeRenderState[];
  edges: MstEdgeRenderState[];
  sortedEdges: MstSortedEdgeRow[];
  components: MstComponentGroup[];
  candidateDecision?: MstCandidateDecision;
  selectedEdgeIds: string[];
  skippedEdgeIds: string[];
  totalCost: number;
  selectedEdgeCount: number;
  result?: MstResult;
  summaryItems?: { label: string; value: string }[];
  viewport: {
    width: number;
    height: number;
  };
};

export type TopologicalSortExampleId = "dag-basic";

export type TopologicalSortMotion =
  | "initialize"
  | "inspect-candidates"
  | "select-node"
  | "remove-edge"
  | "update-indegree"
  | "enqueue-candidate"
  | "complete"
  | "cycle-blocked";

export type TopologicalSortCodeAction =
  | "initialize-indegree"
  | "seed-queue"
  | "inspect-candidates"
  | "select-node"
  | "append-result"
  | "iterate-edge"
  | "decrement-indegree"
  | "enqueue-candidate"
  | "complete"
  | "cycle-blocked";

export type TopologicalSortNodeStatus =
  | "pending"
  | "candidate"
  | "selected"
  | "processed"
  | "opened"
  | "blocked"
  | "complete";

export type TopologicalSortEdgeStatus =
  | "pending"
  | "active"
  | "removed"
  | "blocking"
  | "cycle-blocked";

export type TopologicalSortNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  description?: string;
};

export type TopologicalSortEdge = {
  id: string;
  fromId: string;
  toId: string;
  label: string;
  labelX: number;
  labelY: number;
};

export type TopologicalSortExample = {
  id: TopologicalSortExampleId;
  title: string;
  description: string;
  candidateTieRule: string;
  nodes: TopologicalSortNode[];
  edges: TopologicalSortEdge[];
};

export type TopologicalSortNodeRenderState = GraphNodeState & {
  description?: string;
  status: TopologicalSortNodeStatus;
  inDegree: number;
};

export type TopologicalSortEdgeRenderState = GraphEdgeState & {
  label: string;
  labelX: number;
  labelY: number;
  status: TopologicalSortEdgeStatus;
};

export type TopologicalSortCandidate = {
  nodeId: string;
  label: string;
  isSelected: boolean;
  reason: string;
};

export type TopologicalSortCandidateQueue = {
  items: TopologicalSortCandidate[];
  selectedNodeId?: string;
  tieReason?: string;
};

export type TopologicalSortInDegreeRow = {
  nodeId: string;
  label: string;
  previousValue: number;
  currentValue: number;
  delta: number;
  status: "waiting" | "candidate" | "selected" | "processed" | "opened" | "blocked";
  sourceEdgeIds: string[];
};

export type TopologicalSortEdgeCheck = {
  edgeId: string;
  label: string;
  fromNodeId: string;
  toNodeId: string;
  fromIndex: number;
  toIndex: number;
  isValid: boolean;
};

export type TopologicalSortResult = {
  orderNodeIds: string[];
  orderLabels: string[];
  nodeCount: number;
  processedCount: number;
  edgeChecks: TopologicalSortEdgeCheck[];
  isValid: boolean;
  summaryText: string;
};

export type TopologicalSortTraceState = {
  exampleId: TopologicalSortExampleId;
  motion: TopologicalSortMotion;
  nodes: TopologicalSortNodeRenderState[];
  edges: TopologicalSortEdgeRenderState[];
  candidateQueue: TopologicalSortCandidateQueue;
  inDegreeRows: TopologicalSortInDegreeRow[];
  resultOrder: string[];
  resultOrderNodeIds: string[];
  selectedNodeId?: string;
  affectedEdgeIds: string[];
  removedEdgeIds: string[];
  newCandidateNodeIds: string[];
  processedNodeIds: string[];
  remainingNodeIds: string[];
  validation?: TopologicalSortResult;
  summaryItems?: { label: string; value: string }[];
  viewport: {
    width: number;
    height: number;
  };
};

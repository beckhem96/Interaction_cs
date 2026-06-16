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

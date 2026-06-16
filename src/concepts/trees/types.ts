export type TreeOperation = "insert" | "search" | "traversal";

export type TreeMotion =
  | "idle"
  | "compare"
  | "descend"
  | "insert"
  | "found"
  | "visit"
  | "complete";

export type TreeNodeState = {
  id: string;
  value: number;
  x: number;
  y: number;
  depth: number;
  leftId?: string;
  rightId?: string;
};

export type TreeEdgeState = {
  id: string;
  fromId: string;
  toId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

export type TreeTraceState = {
  operation: TreeOperation;
  motion: TreeMotion;
  nodes: TreeNodeState[];
  comparedNodeId?: string;
  activeNodeId?: string;
  insertedNodeId?: string;
  foundNodeId?: string;
  targetValue?: number;
  pathNodeIds?: string[];
  visitedNodeIds?: string[];
  traversalValues?: number[];
  edges: TreeEdgeState[];
  viewport: {
    width: number;
    height: number;
  };
  summaryItems?: { label: string; value: string }[];
};

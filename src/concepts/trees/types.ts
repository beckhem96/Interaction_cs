export type TreeOperation =
  | "insert"
  | "search"
  | "traversal"
  | "rebalance"
  | "delete";

export type TreeMotion =
  | "idle"
  | "compare"
  | "descend"
  | "insert"
  | "balance"
  | "rotate"
  | "recolor"
  | "swap"
  | "remove"
  | "replace"
  | "found"
  | "visit"
  | "complete";

export type TreeNodeColor = "red" | "black";

export type TreeNodeState = {
  id: string;
  value: number;
  x: number;
  y: number;
  depth: number;
  color?: TreeNodeColor;
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
  removedNodeId?: string;
  successorNodeId?: string;
  recoloredNodeIds?: string[];
  rotatedNodeIds?: string[];
  swappedNodeIds?: string[];
  targetValue?: number;
  rotationLabel?: string;
  balanceFactors?: Record<string, number>;
  pathNodeIds?: string[];
  visitedNodeIds?: string[];
  traversalValues?: number[];
  heapArrayValues?: number[];
  edges: TreeEdgeState[];
  viewport: {
    width: number;
    height: number;
  };
  summaryItems?: { label: string; value: string }[];
};

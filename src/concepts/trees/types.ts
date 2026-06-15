export type TreeNodeState = {
  id: string;
  value: number;
  leftId?: string;
  rightId?: string;
};

export type TreeTraceState = {
  nodes: TreeNodeState[];
  activeNodeId?: string;
  comparedNodeId?: string;
};

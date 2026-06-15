export type SqlLogicalPhase =
  | "from"
  | "where"
  | "groupBy"
  | "having"
  | "select"
  | "orderBy";

export type DatabaseTraceState = {
  phase: SqlLogicalPhase;
  query: string;
  rows: Record<string, string | number | boolean | null>[];
};

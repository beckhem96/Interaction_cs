export type SqlLogicalPhase =
  | "from"
  | "where"
  | "groupBy"
  | "having"
  | "select"
  | "orderBy";

export type DatabaseCellValue = string | number | boolean | null;

export type DatabaseTraceState = {
  phase: SqlLogicalPhase;
  query: string;
  rows: Record<string, DatabaseCellValue>[];
};

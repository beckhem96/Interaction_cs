import type { TraceStep } from "../shared/types";

export type SqlLogicalPhase =
  | "from"
  | "join"
  | "where"
  | "groupBy"
  | "having"
  | "select"
  | "union"
  | "orderBy"
  | "limit";

export type DatabaseCellValue = string | number | boolean | null;

export type DatabaseRow = Record<string, DatabaseCellValue>;

export type DatabaseRowMotion =
  | "source"
  | "candidate"
  | "matched"
  | "joined"
  | "filtered"
  | "rejected"
  | "grouped"
  | "aggregated"
  | "projected"
  | "unioned"
  | "deduped"
  | "sorted"
  | "limited"
  | "cutoff";

export type DatabaseCellHighlightTone =
  | "active"
  | "join"
  | "match"
  | "output"
  | "reject";

export type DatabaseCellHighlight = {
  scope: "input" | "output";
  tableName?: string;
  rowKey: string;
  column: string;
  tone: DatabaseCellHighlightTone;
};

export type DatabaseInputTableState = {
  name: string;
  rows: DatabaseRow[];
  activeColumns?: string[];
  activeRowKeys?: string[];
  rowMotionByKey?: Record<string, DatabaseRowMotion>;
  cellHighlights?: DatabaseCellHighlight[];
};

export type DatabaseTraceState = {
  phase: SqlLogicalPhase;
  query: string;
  activeQueryLines: number[];
  inputTables?: DatabaseInputTableState[];
  rows: DatabaseRow[];
  activeColumns?: string[];
  activeRowKeys?: string[];
  rowMotionByKey?: Record<string, DatabaseRowMotion>;
  cellHighlights?: DatabaseCellHighlight[];
  summaryItems?: { label: string; value: string }[];
};

export type SqlOperationExampleId =
  | "sub-query"
  | "join"
  | "group-by"
  | "having"
  | "union"
  | "order-limit";

export type DatabaseExample = {
  id: SqlOperationExampleId;
  title: string;
  tabLabel: string;
  intro: string;
  query: string;
  pseudoCode: string[];
  trace: TraceStep<DatabaseTraceState>[];
};

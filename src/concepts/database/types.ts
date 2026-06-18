import type { TraceStep } from "../shared/types";

export type SqlLogicalPhase =
  | "from"
  | "join"
  | "where"
  | "groupBy"
  | "having"
  | "select"
  | "union"
  | "window"
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
  | "cutoff"
  | "ranked"
  | "tie"
  | "retainedDuplicate";

export type DatabaseCellHighlightTone =
  | "active"
  | "join"
  | "match"
  | "output"
  | "reject"
  | "rank"
  | "duplicate"
  | "tie";

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
  | "union-all"
  | "order-limit"
  | "window-rank";

export type DatabaseTopicCategory = {
  id: SqlOperationExampleId;
  label: string;
  description: string;
  isInteractive: boolean;
  exampleIds: SqlOperationExampleId[];
};

export type DatabaseExample = {
  id: SqlOperationExampleId;
  title: string;
  tabLabel: string;
  intro: string;
  query: string;
  pseudoCode: string[];
  trace: TraceStep<DatabaseTraceState>[];
};

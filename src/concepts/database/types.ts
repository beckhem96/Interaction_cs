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
  | "joined"
  | "filtered"
  | "grouped"
  | "projected"
  | "unioned"
  | "sorted"
  | "limited";

export type DatabaseInputTableState = {
  name: string;
  rows: DatabaseRow[];
  activeColumns?: string[];
  activeRowKeys?: string[];
};

export type DatabaseTraceState = {
  phase: SqlLogicalPhase;
  query: string;
  activeQueryLines: number[];
  inputTables?: DatabaseInputTableState[];
  rows: DatabaseRow[];
  activeColumns?: string[];
  rowMotionByKey?: Record<string, DatabaseRowMotion>;
  summaryItems?: { label: string; value: string }[];
};

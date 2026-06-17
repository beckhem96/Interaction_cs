export type DpDecision = "init" | "copy" | "take" | "skip" | "complete";

export type KnapsackItem = {
  id: string;
  name: string;
  weight: number;
  value: number;
};

export type DpCellRef = {
  row: number;
  col: number;
};

export type KnapsackDpState = {
  capacity: number;
  items: KnapsackItem[];
  table: number[][];
  activeRow?: number;
  activeCol?: number;
  activeItemIndex?: number;
  compareCells?: DpCellRef[];
  selectedCells?: DpCellRef[];
  skippedItemIndices?: number[];
  selectedItemIndices?: number[];
  decision: DpDecision;
  takeValue?: number;
  skipValue?: number;
  summaryItems: { label: string; value: string }[];
};

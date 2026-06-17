export type BinarySearchMotion =
  | "init"
  | "check-range"
  | "choose-mid"
  | "compare"
  | "move-right"
  | "move-left"
  | "found"
  | "not-found";

export type BinarySearchState = {
  values: number[];
  target: number;
  left: number;
  right: number;
  mid?: number;
  foundIndex?: number;
  discardedIndices: number[];
  activeRange?: [number, number];
  motion: BinarySearchMotion;
  summaryItems: { label: string; value: string }[];
};

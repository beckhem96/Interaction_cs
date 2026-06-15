export type SortingState = {
  array: number[];
  currentIndex?: number;
  keyIndex?: number;
  minimumIndex?: number;
  scanningIndex?: number;
  shiftedIndices?: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  pivotIndex?: number;
  partitionRange?: [number, number];
  mergeRange?: [number, number];
  leftRange?: [number, number];
  rightRange?: [number, number];
  writeIndex?: number;
};

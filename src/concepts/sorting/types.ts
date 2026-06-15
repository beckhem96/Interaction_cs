export type SortingState = {
  array: number[];
  currentIndex?: number;
  minimumIndex?: number;
  scanningIndex?: number;
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  pivotIndex?: number;
  partitionRange?: [number, number];
  mergeRange?: [number, number];
};

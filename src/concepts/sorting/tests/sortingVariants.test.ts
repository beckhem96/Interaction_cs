import { describe, expect, it } from "vitest";

import {
  generateBubbleSortEarlyExitTrace,
  generateCocktailSortTrace,
} from "../algorithms/bubbleSort";
import { generateHeapSortTrace } from "../algorithms/heapSort";
import { generateBinaryInsertionSortTrace } from "../algorithms/insertionSort";
import { generateMergeSortBottomUpTrace } from "../algorithms/mergeSort";
import { generateQuickSortTrace } from "../algorithms/quickSort";
import {
  generateSelectionSortBidirectionalTrace,
  generateSelectionSortMaxTrace,
} from "../algorithms/selectionSort";

const input = [5, 3, 8, 4, 2];
const sorted = [2, 3, 4, 5, 8];

describe("sorting algorithm variants", () => {
  it.each([
    ["bubble early exit", () => generateBubbleSortEarlyExitTrace(input)],
    ["cocktail sort", () => generateCocktailSortTrace(input)],
    ["selection max", () => generateSelectionSortMaxTrace(input)],
    ["selection bidirectional", () => generateSelectionSortBidirectionalTrace(input)],
    ["binary insertion", () => generateBinaryInsertionSortTrace(input)],
    ["bottom-up merge", () => generateMergeSortBottomUpTrace(input)],
    ["quick first pivot", () => generateQuickSortTrace(input, "first")],
    ["quick median pivot", () => generateQuickSortTrace(input, "median")],
    ["heap Floyd", () => generateHeapSortTrace(input, "floyd")],
    ["heap insertion build", () => generateHeapSortTrace(input, "insertion")],
  ])("sorts with %s", (_name, generateTrace) => {
    const trace = generateTrace();

    expect(trace.at(-1)?.state.array).toEqual(sorted);
    expect(trace.at(-1)?.state.sortedIndices).toEqual([0, 1, 2, 3, 4]);
  });

  it("shows different quick sort pivot selection strategies", () => {
    const firstPivot = generateQuickSortTrace(input, "first");
    const medianPivot = generateQuickSortTrace(input, "median");

    expect(firstPivot.find((step) => step.id.includes("choose-pivot"))?.state.pivotIndex).toBe(0);
    expect(medianPivot.find((step) => step.id.includes("choose-pivot"))?.state.pivotIndex).toBe(0);
    expect(firstPivot.some((step) => step.id.includes("move-pivot-0-4"))).toBe(true);
    expect(medianPivot.some((step) => step.state.comparingIndices?.join(",") === "0,2,4")).toBe(true);
  });

  it("shows different heap build strategies", () => {
    const floyd = generateHeapSortTrace(input, "floyd");
    const insertion = generateHeapSortTrace(input, "insertion");

    expect(floyd.some((step) => step.id.includes("heapify-root"))).toBe(true);
    expect(insertion.some((step) => step.id.includes("insert"))).toBe(true);
    expect(floyd.at(-1)?.state.array).toEqual(insertion.at(-1)?.state.array);
  });
});

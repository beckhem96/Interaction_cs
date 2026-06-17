import { describe, expect, it } from "vitest";

import {
  KNAPSACK_DEFAULT_CAPACITY,
  KNAPSACK_DEFAULT_ITEMS,
  generateKnapsackTrace,
} from "../algorithms/knapsack";

describe("generateKnapsackTrace", () => {
  it("fills the DP table and returns the optimal knapsack value", () => {
    const trace = generateKnapsackTrace(KNAPSACK_DEFAULT_ITEMS, KNAPSACK_DEFAULT_CAPACITY);
    const finalStep = trace.at(-1);

    expect(trace.length).toBeGreaterThan(50);
    expect(finalStep?.id).toBe("knapsack-complete");
    expect(finalStep?.state.table[KNAPSACK_DEFAULT_ITEMS.length]?.[KNAPSACK_DEFAULT_CAPACITY]).toBe(26);
    expect(finalStep?.state.selectedItemIndices).toEqual([0, 1, 3]);
  });

  it("records copy, take, and skip decisions", () => {
    const trace = generateKnapsackTrace(KNAPSACK_DEFAULT_ITEMS, KNAPSACK_DEFAULT_CAPACITY);
    const decisions = new Set(trace.map((step) => step.state.decision));

    expect(decisions.has("copy")).toBe(true);
    expect(decisions.has("take")).toBe(true);
    expect(decisions.has("skip")).toBe(true);
  });

  it("provides code line highlights for every step", () => {
    const trace = generateKnapsackTrace();

    for (const step of trace) {
      expect(Object.keys(step.codeLineHighlights ?? {}).sort()).toEqual(
        ["C", "C++", "Java", "JavaScript", "Python"].sort(),
      );
    }
  });
});

import { describe, expect, it } from "vitest";

import {
  BINARY_SEARCH_MISSING_INPUT,
  BINARY_SEARCH_SUCCESS_INPUT,
  generateBinarySearchTrace,
} from "../algorithms/binarySearch";

describe("generateBinarySearchTrace", () => {
  it("narrows the candidate range until it finds the target", () => {
    const trace = generateBinarySearchTrace(BINARY_SEARCH_SUCCESS_INPUT, 42);
    const finalStep = trace.at(-1);

    expect(trace.length).toBeGreaterThanOrEqual(10);
    expect(finalStep?.id).toBe("binary-search-found-9");
    expect(finalStep?.state.foundIndex).toBe(9);
    expect(finalStep?.state.values[finalStep.state.foundIndex ?? -1]).toBe(42);
    expect(
      trace.some((step) => step.state.motion === "move-right"),
    ).toBe(true);
    expect(
      trace.some((step) => step.state.motion === "move-left"),
    ).toBe(true);
  });

  it("returns a not-found step when the candidate range becomes empty", () => {
    const trace = generateBinarySearchTrace(BINARY_SEARCH_MISSING_INPUT, 40);
    const finalStep = trace.at(-1);

    expect(finalStep?.id).toBe("binary-search-not-found");
    expect(finalStep?.state.motion).toBe("not-found");
    expect(finalStep?.state.activeRange).toBeUndefined();
    expect(finalStep?.state.discardedIndices).toHaveLength(
      BINARY_SEARCH_MISSING_INPUT.length,
    );
  });

  it("provides code line highlights for every step", () => {
    const trace = generateBinarySearchTrace(BINARY_SEARCH_SUCCESS_INPUT, 42);

    for (const step of trace) {
      expect(Object.keys(step.codeLineHighlights ?? {}).sort()).toEqual(
        ["C", "C++", "Java", "JavaScript", "Python"].sort(),
      );
    }
  });
});

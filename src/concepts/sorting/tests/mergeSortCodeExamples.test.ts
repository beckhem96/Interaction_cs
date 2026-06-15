import { describe, expect, it } from "vitest";

import { mergeSortCodeExamples } from "../code/mergeSortExamples";

describe("mergeSortCodeExamples", () => {
  it("provides Merge Sort examples for the required languages", () => {
    expect(mergeSortCodeExamples.map((example) => example.language)).toEqual([
      "C",
      "Java",
      "C++",
      "JavaScript",
      "Python"
    ]);
  });

  it("keeps code examples as display text with merge sort identifiers", () => {
    for (const example of mergeSortCodeExamples) {
      expect(example.code.toLowerCase()).toContain("merge");
      expect(example.code.length).toBeGreaterThan(120);
      expect(example.fileName).toMatch(/^mergeSort\./);
    }
  });
});

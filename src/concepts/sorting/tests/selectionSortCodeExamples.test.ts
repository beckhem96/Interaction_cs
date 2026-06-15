import { describe, expect, it } from "vitest";

import { selectionSortCodeExamples } from "../code/selectionSortExamples";

describe("selectionSortCodeExamples", () => {
  it("provides Selection Sort examples for the required languages", () => {
    expect(selectionSortCodeExamples.map((example) => example.language)).toEqual([
      "C",
      "Java",
      "C++",
      "JavaScript",
      "Python"
    ]);
  });

  it("keeps code examples as display text with selection sort identifiers", () => {
    for (const example of selectionSortCodeExamples) {
      expect(example.code.toLowerCase()).toContain("selection");
      expect(example.code.length).toBeGreaterThan(100);
      expect(example.fileName).toMatch(/^selectionSort\./);
    }
  });
});

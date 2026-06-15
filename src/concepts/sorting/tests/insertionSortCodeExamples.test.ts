import { describe, expect, it } from "vitest";

import { insertionSortCodeExamples } from "../code/insertionSortExamples";

describe("insertionSortCodeExamples", () => {
  it("provides Insertion Sort examples for the required languages", () => {
    expect(insertionSortCodeExamples.map((example) => example.language)).toEqual([
      "C",
      "Java",
      "C++",
      "JavaScript",
      "Python"
    ]);
  });

  it("keeps code examples as display text with insertion sort identifiers", () => {
    for (const example of insertionSortCodeExamples) {
      expect(example.code.toLowerCase()).toContain("insertion");
      expect(example.code.length).toBeGreaterThan(100);
      expect(example.fileName).toMatch(/^insertionSort\./);
    }
  });
});

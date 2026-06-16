import { describe, expect, it } from "vitest";

import { bubbleSortCodeExamples } from "../code/bubbleSortExamples";

describe("bubbleSortCodeExamples", () => {
  it("provides Bubble Sort examples for the required languages", () => {
    expect(bubbleSortCodeExamples.map((example) => example.language)).toEqual([
      "C",
      "C++",
      "Java",
      "Python",
      "JavaScript"
    ]);
  });

  it("keeps code examples as display text without execution helpers", () => {
    for (const example of bubbleSortCodeExamples) {
      expect(example.code).toContain("bubble");
      expect(example.code.length).toBeGreaterThan(80);
      expect(example.fileName).toMatch(/^bubbleSort\./);
    }
  });
});

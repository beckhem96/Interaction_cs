import { describe, expect, it } from "vitest";

import { quickSortCodeExamples } from "../code/quickSortExamples";

describe("quickSortCodeExamples", () => {
  it("provides examples in every supported language", () => {
    expect(quickSortCodeExamples.map((example) => example.language)).toEqual([
      "C",
      "Java",
      "C++",
      "JavaScript",
      "Python"
    ]);
  });

  it("keeps examples named for quick sort and long enough to teach from", () => {
    for (const example of quickSortCodeExamples) {
      expect(example.fileName).toMatch(/^quickSort\./);
      expect(example.code.toLowerCase()).toContain("quick");
      expect(example.code.length).toBeGreaterThan(120);
    }
  });
});

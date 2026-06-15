import { describe, expect, it } from "vitest";

import { tokenizeCodeLine } from "./syntaxHighlight";

describe("tokenizeCodeLine", () => {
  it("classifies C-like keywords, numbers, and operators", () => {
    const tokens = tokenizeCodeLine("C", "  if (values[index] > 2) return;");

    expect(tokens).toEqual(
      expect.arrayContaining([
        { text: "if", type: "keyword" },
        { text: "2", type: "number" },
        { text: ">", type: "operator" },
        { text: "return", type: "keyword" }
      ])
    );
  });

  it("classifies Python keywords and builtins", () => {
    const tokens = tokenizeCodeLine("Python", "    for index in range(length):");

    expect(tokens).toEqual(
      expect.arrayContaining([
        { text: "for", type: "keyword" },
        { text: "in", type: "keyword" },
        { text: "range", type: "builtin" }
      ])
    );
  });
});

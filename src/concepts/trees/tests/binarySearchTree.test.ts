import { describe, expect, it } from "vitest";

import {
  BST_DEFAULT_VALUES,
  BST_SEARCH_TARGET,
  generateBinarySearchTreeTrace
} from "../algorithms/binarySearchTree";

describe("generateBinarySearchTreeTrace", () => {
  it("generates insertion, search, and traversal steps for a BST", () => {
    const trace = generateBinarySearchTreeTrace();

    expect(trace[0]).toMatchObject({
      id: "bst-start",
      title: "빈 BST 준비",
      state: {
        operation: "insert",
        motion: "idle",
        nodes: []
      },
      pseudoCodeLine: 1
    });

    expect(trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "bst-insert-42-root",
          state: expect.objectContaining({
            insertedNodeId: "node-42",
            nodes: [expect.objectContaining({ value: 42, depth: 0 })]
          })
        }),
        expect.objectContaining({
          id: "bst-compare-23-42",
          state: expect.objectContaining({
            comparedNodeId: "node-42",
            targetValue: 23
          })
        }),
        expect.objectContaining({
          id: "bst-search-found-37",
          state: expect.objectContaining({
            foundNodeId: "node-37",
            targetValue: BST_SEARCH_TARGET
          })
        })
      ])
    );

    const finalStep = trace.at(-1)!;

    expect(finalStep).toMatchObject({
      id: "bst-complete",
      state: {
        motion: "complete",
        traversalValues: [...BST_DEFAULT_VALUES].sort((left, right) => left - right)
      },
      pseudoCodeLine: 9
    });
    expect(finalStep.state.nodes).toHaveLength(BST_DEFAULT_VALUES.length);
    expect(finalStep.state.edges).toHaveLength(BST_DEFAULT_VALUES.length - 1);
  });
});

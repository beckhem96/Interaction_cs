import { describe, expect, it } from "vitest";

import {
  generateBinarySearchTreeDeletionTrace,
  BST_DELETE_INITIAL_VALUES
} from "../algorithms/binarySearchTreeDeletion";

describe("generateBinarySearchTreeDeletionTrace", () => {
  it("generates leaf, one-child, and two-child deletion cases", () => {
    const trace = generateBinarySearchTreeDeletionTrace();

    expect(trace[0]).toMatchObject({
      id: "bst-delete-start",
      title: "삭제용 BST 준비",
      state: {
        operation: "delete",
        motion: "idle",
        nodes: expect.arrayContaining([
          expect.objectContaining({ value: 42, depth: 0 })
        ])
      },
      pseudoCodeLine: 1
    });
    expect(trace[0].state.nodes).toHaveLength(BST_DELETE_INITIAL_VALUES.length);

    expect(trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "bst-delete-leaf-15",
          state: expect.objectContaining({
            motion: "remove",
            removedNodeId: "delete-node-15",
            targetValue: 15
          })
        }),
        expect.objectContaining({
          id: "bst-delete-one-child-72",
          state: expect.objectContaining({
            motion: "replace",
            removedNodeId: "delete-node-72",
            successorNodeId: "delete-node-67",
            targetValue: 72
          })
        }),
        expect.objectContaining({
          id: "bst-delete-successor-found-42-54",
          state: expect.objectContaining({
            motion: "found",
            successorNodeId: "delete-node-54",
            targetValue: 42
          })
        }),
        expect.objectContaining({
          id: "bst-delete-two-children-42-done",
          state: expect.objectContaining({
            motion: "replace",
            successorNodeId: "delete-node-54",
            targetValue: 42
          })
        })
      ])
    );

    const finalStep = trace.at(-1)!;

    expect(finalStep).toMatchObject({
      id: "bst-delete-complete",
      state: {
        motion: "complete",
        traversalValues: [23, 28, 31, 37, 54, 61, 67]
      },
      pseudoCodeLine: 8
    });
    expect(finalStep.state.nodes.map((node) => node.value)).toEqual([
      54,
      23,
      31,
      28,
      37,
      61,
      67
    ]);
    expect(finalStep.state.nodes).toHaveLength(7);
    expect(finalStep.state.edges).toHaveLength(6);
  });
});

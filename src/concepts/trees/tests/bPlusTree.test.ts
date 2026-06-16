import { describe, expect, it } from "vitest";

import {
  BPLUS_TREE_INSERT_VALUES,
  BPLUS_TREE_RANGE,
  generateBPlusTreeTrace
} from "../algorithms/bPlusTree";

describe("generateBPlusTreeTrace", () => {
  it("generates B+Tree leaf splits, leaf links, and range scan steps", () => {
    const trace = generateBPlusTreeTrace();

    expect(trace[0]).toMatchObject({
      id: "bplus-start",
      title: "빈 B+Tree 준비",
      state: {
        operation: "insert",
        motion: "idle",
        targetValue: BPLUS_TREE_INSERT_VALUES[0]
      },
      pseudoCodeLine: 1
    });

    const firstLeafSplit = trace.find(
      (step) => step.id === "bplus-root-split-apply-6-10"
    )!;
    const childLeafSplit = trace.find(
      (step) => step.id === "bplus-leaf-split-apply-30-20"
    )!;
    const rootInternalSplit = trace.find(
      (step) => step.id === "bplus-root-split-apply-2-10"
    )!;
    const rangeComplete = trace.find(
      (step) => step.id === "bplus-range-complete"
    )!;

    expect(firstLeafSplit.state.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "bplus-node-3", keyValues: [10] }),
        expect.objectContaining({ id: "bplus-node-1", keyValues: [5, 6] }),
        expect.objectContaining({ id: "bplus-node-2", keyValues: [10, 20] })
      ])
    );
    expect(childLeafSplit).toMatchObject({
      state: {
        operation: "rebalance",
        motion: "balance",
        insertedNodeId: "bplus-node-4"
      },
      pseudoCodeLine: 6
    });
    expect(childLeafSplit.state.edges.some((edge) =>
      edge.id.startsWith("bplus-leaf-link-bplus-node-2-bplus-node-4")
    )).toBe(true);

    expect(rootInternalSplit.state.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "bplus-node-8", keyValues: [10] }),
        expect.objectContaining({ id: "bplus-node-3", keyValues: [4, 6] }),
        expect.objectContaining({ id: "bplus-node-7", keyValues: [20] })
      ])
    );

    expect(rangeComplete).toMatchObject({
      state: {
        operation: "traversal",
        motion: "complete",
        targetText: `[${BPLUS_TREE_RANGE.join(", ")}]`,
        traversalValues: [6, 7, 10, 12, 17, 20]
      },
      pseudoCodeLine: 10
    });
  });
});

import { describe, expect, it } from "vitest";

import {
  BTREE_INSERT_VALUES,
  BTREE_SEARCH_TARGET,
  generateBTreeTrace
} from "../algorithms/bTree";

describe("generateBTreeTrace", () => {
  it("generates B-Tree insertion split and search steps", () => {
    const trace = generateBTreeTrace();

    expect(trace[0]).toMatchObject({
      id: "btree-start",
      title: "빈 B-Tree 준비",
      state: {
        operation: "insert",
        motion: "idle",
        targetValue: BTREE_INSERT_VALUES[0]
      },
      pseudoCodeLine: 1
    });

    const rootSplit = trace.find(
      (step) => step.id === "btree-split-apply-root-6-10"
    )!;
    const childSplit = trace.find(
      (step) => step.id === "btree-split-apply-child-17-20"
    )!;
    const insert17 = trace.find(
      (step) => step.id === "btree-insert-leaf-17-btree-node-3"
    )!;
    const found17 = trace.find(
      (step) => step.id === "btree-search-found-17-btree-node-3"
    )!;

    expect(rootSplit).toMatchObject({
      state: {
        operation: "rebalance",
        motion: "balance",
        activeNodeId: "btree-node-2",
        insertedNodeId: "btree-node-3"
      },
      pseudoCodeLine: 5
    });
    expect(rootSplit.state.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "btree-node-2", keyValues: [10] }),
        expect.objectContaining({ id: "btree-node-1", keyValues: [5] }),
        expect.objectContaining({ id: "btree-node-3", keyValues: [20] })
      ])
    );

    expect(childSplit.state.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "btree-node-2", keyValues: [10, 20] }),
        expect.objectContaining({ id: "btree-node-3", keyValues: [12] }),
        expect.objectContaining({ id: "btree-node-4", keyValues: [30] })
      ])
    );
    expect(insert17.state.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "btree-node-3", keyValues: [12, 17] })
      ])
    );
    expect(found17).toMatchObject({
      state: {
        operation: "search",
        motion: "found",
        targetValue: BTREE_SEARCH_TARGET,
        foundNodeId: "btree-node-3",
        pathNodeIds: ["btree-node-2", "btree-node-3"]
      },
      pseudoCodeLine: 7
    });
  });
});

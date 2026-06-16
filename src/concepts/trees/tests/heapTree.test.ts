import { describe, expect, it } from "vitest";

import {
  HEAP_INSERT_VALUES,
  generateHeapTrace
} from "../algorithms/heapTree";

describe("generateHeapTrace", () => {
  it("generates max-heap insertion and extract-max heapify steps", () => {
    const trace = generateHeapTrace();

    expect(trace[0]).toMatchObject({
      id: "heap-start",
      title: "빈 최대 힙 준비",
      state: {
        operation: "insert",
        motion: "idle",
        heapArrayValues: []
      },
      pseudoCodeLine: 1
    });

    expect(trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "heap-insert-50-append",
          state: expect.objectContaining({
            insertedNodeId: "heap-index-7",
            targetValue: 50
          })
        }),
        expect.objectContaining({
          id: "heap-swap-up-50-7-3",
          state: expect.objectContaining({
            motion: "swap",
            swappedNodeIds: ["heap-index-3", "heap-index-7"]
          })
        }),
        expect.objectContaining({
          id: "heap-swap-up-50-1-0",
          state: expect.objectContaining({
            motion: "swap",
            swappedNodeIds: ["heap-index-0", "heap-index-1"]
          })
        }),
        expect.objectContaining({
          id: "heap-extract-start-50",
          state: expect.objectContaining({
            operation: "delete",
            motion: "remove",
            removedNodeId: "heap-index-0"
          })
        }),
        expect.objectContaining({
          id: "heap-swap-down-32-1-3",
          state: expect.objectContaining({
            motion: "swap",
            swappedNodeIds: ["heap-index-1", "heap-index-3"]
          })
        })
      ])
    );

    const finalStep = trace.at(-1)!;
    const finalHeap = finalStep.state.heapArrayValues ?? [];

    expect(finalStep).toMatchObject({
      id: "heap-complete",
      state: {
        motion: "complete",
        traversalValues: [45, 41, 18, 32, 12, 9, 14, 27]
      },
      pseudoCodeLine: 8
    });
    expect(finalHeap).toEqual([45, 41, 18, 32, 12, 9, 14, 27]);
    expect(finalStep.state.nodes).toHaveLength(HEAP_INSERT_VALUES.length - 1);
    expect(finalStep.state.edges).toHaveLength(HEAP_INSERT_VALUES.length - 2);

    for (let index = 0; index < finalHeap.length; index += 1) {
      const leftIndex = index * 2 + 1;
      const rightIndex = index * 2 + 2;

      if (leftIndex < finalHeap.length) {
        expect(finalHeap[index]).toBeGreaterThanOrEqual(finalHeap[leftIndex]);
      }

      if (rightIndex < finalHeap.length) {
        expect(finalHeap[index]).toBeGreaterThanOrEqual(finalHeap[rightIndex]);
      }
    }
  });
});

import { describe, expect, it } from "vitest";

import {
  SEGMENT_TREE_QUERY_RANGE,
  SEGMENT_TREE_UPDATE,
  SEGMENT_TREE_VALUES,
  generateSegmentTreeTrace
} from "../algorithms/segmentTree";

describe("generateSegmentTreeTrace", () => {
  it("generates build, range query, point update, and updated query steps", () => {
    const trace = generateSegmentTreeTrace();

    expect(trace[0]).toMatchObject({
      id: "segment-start",
      title: "세그먼트 트리 준비",
      state: {
        operation: "insert",
        motion: "idle",
        segmentArrayValues: SEGMENT_TREE_VALUES,
        segmentQueryRange: SEGMENT_TREE_QUERY_RANGE
      },
      pseudoCodeLine: 1
    });

    expect(trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "segment-build-combine-0-7",
          state: expect.objectContaining({
            activeNodeId: "segment-0-7",
            segmentResult: 44
          })
        }),
        expect.objectContaining({
          id: "segment-query-initial-combine-0-7",
          state: expect.objectContaining({
            operation: "search",
            foundNodeId: "segment-0-7",
            segmentResult: 27
          })
        }),
        expect.objectContaining({
          id: "segment-update-leaf-3",
          state: expect.objectContaining({
            motion: "replace",
            segmentArrayValues: [5, 8, 6, 10, 7, 2, 9, 4],
            segmentResult: SEGMENT_TREE_UPDATE.value,
            segmentUpdate: SEGMENT_TREE_UPDATE
          })
        }),
        expect.objectContaining({
          id: "segment-update-recompute-0-7",
          state: expect.objectContaining({
            activeNodeId: "segment-0-7",
            segmentResult: 51
          })
        }),
        expect.objectContaining({
          id: "segment-query-after-update-combine-0-7",
          state: expect.objectContaining({
            segmentResult: 34,
            segmentQueryRange: SEGMENT_TREE_QUERY_RANGE
          })
        })
      ])
    );

    const finalStep = trace.at(-1)!;

    expect(finalStep).toMatchObject({
      id: "segment-complete",
      state: {
        motion: "complete",
        segmentArrayValues: [5, 8, 6, 10, 7, 2, 9, 4],
        segmentResult: 34
      },
      pseudoCodeLine: 8
    });
    expect(finalStep.state.nodes).toHaveLength(15);
    expect(finalStep.state.nodes.map((node) => node.subLabel)).toEqual(
      expect.arrayContaining(["[0,7]", "[2,3]", "[6,6]"])
    );
  });
});

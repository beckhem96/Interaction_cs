import { describe, expect, it } from "vitest";

import {
  RED_BLACK_INSERT_VALUES,
  generateRedBlackInsertionTrace
} from "../algorithms/redBlackTree";

describe("generateRedBlackInsertionTrace", () => {
  it("generates recoloring and rotation steps while preserving Red-Black rules", () => {
    const trace = generateRedBlackInsertionTrace();
    const finalStep = trace.at(-1)!;
    const finalNodes = finalStep.state.nodes;
    const nodeById = new Map(finalNodes.map((node) => [node.id, node]));
    const root = finalNodes.find((node) => node.depth === 0);

    expect(trace[0]).toMatchObject({
      id: "rb-start",
      state: {
        operation: "insert",
        motion: "idle"
      },
      pseudoCodeLine: 1
    });

    expect(trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "rb-rotation-31-LL",
          state: expect.objectContaining({
            motion: "rotate",
            rotationLabel: "LL"
          })
        }),
        expect.objectContaining({
          id: "rb-recolor-12-31-41-38",
          state: expect.objectContaining({
            motion: "recolor",
            recoloredNodeIds: ["rb-node-31", "rb-node-41", "rb-node-38"]
          })
        }),
        expect.objectContaining({
          id: "rb-root-black-12",
          state: expect.objectContaining({
            motion: "recolor",
            recoloredNodeIds: ["rb-node-38"]
          })
        }),
        expect.objectContaining({
          id: "rb-rotation-19-LR-1",
          state: expect.objectContaining({
            motion: "rotate",
            rotationLabel: "LR 1차"
          })
        }),
        expect.objectContaining({
          id: "rb-rotation-19-LR-2",
          state: expect.objectContaining({
            motion: "rotate",
            rotationLabel: "LR 2차"
          })
        })
      ])
    );

    expect(root).toEqual(expect.objectContaining({ value: 38, color: "black" }));
    expect(finalStep).toMatchObject({
      id: "rb-complete",
      state: {
        motion: "complete",
        traversalValues: [...RED_BLACK_INSERT_VALUES].sort(
          (left, right) => left - right
        )
      },
      pseudoCodeLine: 8
    });
    expect(finalNodes).toHaveLength(RED_BLACK_INSERT_VALUES.length);
    expect(finalStep.state.edges).toHaveLength(RED_BLACK_INSERT_VALUES.length - 1);

    for (const node of finalNodes) {
      if (node.color !== "red") {
        continue;
      }

      const left = node.leftId === undefined ? undefined : nodeById.get(node.leftId);
      const right = node.rightId === undefined ? undefined : nodeById.get(node.rightId);

      expect(left?.color).not.toBe("red");
      expect(right?.color).not.toBe("red");
    }
  });
});

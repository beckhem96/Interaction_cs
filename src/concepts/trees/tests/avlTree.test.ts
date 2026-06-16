import { describe, expect, it } from "vitest";

import {
  AVL_ROTATION_VALUES,
  generateAvlRotationTrace
} from "../algorithms/avlTree";

describe("generateAvlRotationTrace", () => {
  it("generates AVL insertion and rotation steps", () => {
    const trace = generateAvlRotationTrace();
    const rotationTitles = trace
      .filter((step) => step.state.motion === "rotate")
      .map((step) => step.title);
    const finalStep = trace.at(-1)!;
    const finalBalanceFactors = Object.values(
      finalStep.state.balanceFactors ?? {}
    );

    expect(trace[0]).toMatchObject({
      id: "avl-start",
      state: {
        operation: "insert",
        motion: "idle"
      },
      pseudoCodeLine: 1
    });
    expect(rotationTitles).toEqual(
      expect.arrayContaining([
        "LL 회전 적용",
        "RR 회전 적용",
        "RL 1차 회전 적용",
        "RL 2차 회전 적용"
      ])
    );
    expect(finalStep).toMatchObject({
      id: "avl-complete",
      state: {
        operation: "rebalance",
        motion: "complete"
      },
      pseudoCodeLine: 8
    });
    expect(finalStep.state.nodes).toHaveLength(AVL_ROTATION_VALUES.length);
    expect(finalBalanceFactors.every((factor) => Math.abs(factor) <= 1)).toBe(true);
  });
});

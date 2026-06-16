import { describe, expect, it } from "vitest";

import {
  GRAPH_TRAVERSAL_MODES,
  generateGraphTraversalTrace,
  getGraphTraversalInputSummary
} from "../algorithms/graphTraversal";
import type { GraphTraversalMode, GraphTraversalState } from "../types";

describe("generateGraphTraversalTrace", () => {
  it("creates BFS and DFS traces over the same example graph", () => {
    for (const mode of GRAPH_TRAVERSAL_MODES) {
      const trace = generateGraphTraversalTrace(mode);

      expect(trace[0].id).toBe(`${mode}-start`);
      expect(trace.at(-1)?.id).toBe(`${mode}-complete`);
      expect(trace.length).toBeGreaterThan(25);
      expect(trace.every((step) => step.state.mode === mode)).toBe(true);
      expect(trace[0].state.nodes).toHaveLength(9);
      expect(trace[0].state.edges).toHaveLength(11);
    }

    expect(getGraphTraversalInputSummary()).toBe("노드 9개 · 간선 11개 · 시작 A");
  });

  it("visits BFS nodes level by level with a queue", () => {
    const trace = generateGraphTraversalTrace("bfs");
    const discoverB = trace.find((step) => step.id === "bfs-discover-B-from-A");
    const complete = getCompleteStep("bfs");

    expect(discoverB?.state.motion).toBe("enqueue");
    expect(discoverB?.state.frontierLabel).toBe("큐 앞 → 뒤");
    expect(discoverB?.state.frontierItems).toEqual(["B"]);
    expect(discoverB?.state.treeEdgeIds).toContain("A-B");
    expect(discoverB?.codeLineHighlights?.C).toEqual([24, 25]);
    expect(complete.state.visitedOrder).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I"
    ]);
    expect(complete.state.frontierItems).toEqual([]);
    expect(complete.state.treeEdgeIds).toHaveLength(8);
  });

  it("uses stack order for DFS while preserving deterministic neighbor order", () => {
    const trace = generateGraphTraversalTrace("dfs");
    const discoverD = trace.find((step) => step.id === "dfs-discover-D-from-A");
    const complete = getCompleteStep("dfs");

    expect(discoverD?.state.motion).toBe("push");
    expect(discoverD?.state.frontierLabel).toBe("스택 위 → 아래");
    expect(discoverD?.state.frontierItems).toEqual(["D"]);
    expect(discoverD?.state.treeEdgeIds).toContain("A-D");
    expect(discoverD?.codeLineHighlights?.C).toEqual([44, 45]);
    expect(complete.state.visitedOrder).toEqual([
      "A",
      "B",
      "E",
      "I",
      "H",
      "G",
      "F",
      "C",
      "D"
    ]);
    expect(complete.state.treeEdgeIds).toHaveLength(8);
  });

  it("marks repeated neighbors as skip steps without changing the traversal tree", () => {
    const trace = generateGraphTraversalTrace("bfs");
    const skipA = trace.find((step) => step.id === "bfs-skip-B-A");

    expect(skipA?.state.motion).toBe("skip");
    expect(skipA?.state.activeEdgeIds).toEqual(["A-B"]);
    expect(skipA?.state.skippedNodeIds).toEqual(["A"]);
    expect(skipA?.state.treeEdgeIds).toEqual(["A-B", "A-C", "A-D"]);
  });
});

function getCompleteStep(mode: GraphTraversalMode) {
  const complete = generateGraphTraversalTrace(mode).at(-1);

  expect(complete).toBeDefined();

  return complete as { state: GraphTraversalState };
}

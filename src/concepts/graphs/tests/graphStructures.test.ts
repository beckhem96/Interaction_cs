import { describe, expect, it } from "vitest";

import {
  GRAPH_STRUCTURE_KINDS,
  generateGraphStructureTrace,
  getGraphStructureInputSummary
} from "../algorithms/graphStructures";
import type { GraphKind, GraphTraceState } from "../types";

describe("generateGraphStructureTrace", () => {
  it("creates a non-trivial trace for every graph structure kind", () => {
    for (const kind of GRAPH_STRUCTURE_KINDS) {
      const trace = generateGraphStructureTrace(kind);

      expect(trace[0].id).toBe(`${kind}-start`);
      expect(trace.at(-1)?.id).toBe(`${kind}-complete`);
      expect(trace.length).toBeGreaterThan(8);
      expect(trace.every((step) => step.state.kind === kind)).toBe(true);
    }
  });

  it("builds undirected adjacency in both directions", () => {
    const complete = getCompleteStep("undirected");
    const aRow = complete.state.adjacencyRows.find((row) => row.nodeId === "A");
    const dRow = complete.state.adjacencyRows.find((row) => row.nodeId === "D");
    const firstEdge = complete.state.edges[0];

    expect(aRow?.neighbors).toBe("B, D");
    expect(dRow?.neighbors).toBe("A, B, E, F");
    expect(firstEdge.directed).toBeUndefined();
    expect(complete.state.summaryItems).toContainEqual({
      label: "방향",
      value: "없음"
    });
  });

  it("keeps directed adjacency one-way", () => {
    const complete = getCompleteStep("directed");
    const bRow = complete.state.adjacencyRows.find((row) => row.nodeId === "B");
    const cRow = complete.state.adjacencyRows.find((row) => row.nodeId === "C");

    expect(bRow?.neighbors).toBe("C");
    expect(cRow?.neighbors).toBe("B, E");
    expect(complete.state.edges.every((edge) => edge.directed)).toBe(true);
  });

  it("records weighted edges and renders weighted adjacency labels", () => {
    const trace = generateGraphStructureTrace("weighted");
    const firstWeightedEdge = trace.find(
      (step) => step.id === "weighted-edge-S-A"
    );

    expect(firstWeightedEdge?.title).toBe("S → A 연결");
    expect(firstWeightedEdge?.state.motion).toBe("weight");
    expect(firstWeightedEdge?.state.edges).toContainEqual(
      expect.objectContaining({
        id: "S-A",
        directed: true,
        weight: 4
      })
    );
    expect(
      firstWeightedEdge?.state.adjacencyRows.find((row) => row.nodeId === "S")
        ?.neighbors
    ).toBe("A(4)");
    expect(getGraphStructureInputSummary("weighted")).toBe(
      "노드 6개 · 가중치 간선 8개"
    );
  });

  it("models DAG edges as directed dependency edges", () => {
    const complete = getCompleteStep("dag");
    const specRow = complete.state.adjacencyRows.find(
      (row) => row.nodeId === "Spec"
    );
    const deployRow = complete.state.adjacencyRows.find(
      (row) => row.nodeId === "Deploy"
    );

    expect(specRow?.neighbors).toBe("API, UI");
    expect(deployRow?.neighbors).toBe("-");
    expect(complete.state.edges.every((edge) => edge.directed)).toBe(true);
    expect(complete.description).toContain("사이클이 없는 DAG");
  });

  it("separates bipartite nodes into left and right partitions", () => {
    const complete = getCompleteStep("bipartite");
    const nodeGroupById = new Map(
      complete.state.nodes.map((node) => [node.id, node.group])
    );

    expect(complete.state.highlightedGroup).toBe("left");
    expect(
      complete.state.edges.every(
        (edge) => nodeGroupById.get(edge.fromId) !== nodeGroupById.get(edge.toId)
      )
    ).toBe(true);
    expect(
      complete.state.nodes.filter((node) => node.group === "left")
    ).toHaveLength(3);
    expect(
      complete.state.nodes.filter((node) => node.group === "right")
    ).toHaveLength(3);
  });
});

function getCompleteStep(kind: GraphKind) {
  const complete = generateGraphStructureTrace(kind).at(-1);

  expect(complete).toBeDefined();

  return complete as { state: GraphTraceState; description: string };
}

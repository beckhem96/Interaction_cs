import { describe, expect, it } from "vitest";

import {
  MST_EXAMPLE_IDS,
  generateMstTrace,
  mstExamples,
  sortMstEdges
} from "../algorithms/mst";
import type { MstTraceState } from "../types";

const languages = ["C", "C++", "Java", "Python", "JavaScript"];

describe("generateMstTrace", () => {
  it("creates a complete MST trace for the curated Kruskal example", () => {
    for (const exampleId of MST_EXAMPLE_IDS) {
      const trace = generateMstTrace(exampleId);

      expect(trace[0].id).toBe(`${exampleId}-initialize`);
      expect(trace.at(-1)?.id).toBe(`${exampleId}-complete`);
      expect(trace.length).toBeGreaterThan(10);
      expect(trace.every((step) => step.state.exampleId === exampleId)).toBe(true);
      expect(trace.every((step) => /[가-힣]/.test(step.description))).toBe(true);
      expect(trace.every((step) => hasAllLanguageHighlights(step))).toBe(true);
    }
  });

  it("sorts edges by weight and resolves equal weights by edge label", () => {
    const example = mstExamples[0];
    const sortedLabels = sortMstEdges(example.edges).map((edge) => edge.label);
    const sortStep = generateMstTrace("kruskal-basic").find(
      (step) => step.id === "kruskal-basic-sort-edges"
    );

    expect(sortedLabels).toEqual([
      "D-E",
      "B-C",
      "E-F",
      "A-C",
      "A-B",
      "C-D",
      "B-D",
      "C-E",
      "B-E"
    ]);
    expect(sortStep?.description).toContain("간선 라벨 순서");
    expect(sortStep?.state.sortedEdges.map((row) => row.label)).toEqual(sortedLabels);
  });

  it("keeps the MST example connected and visually clear", () => {
    const example = mstExamples[0];
    const nodeIds = new Set(example.nodes.map((node) => node.id));

    expect(nodeIds.size).toBe(example.nodes.length);
    expect(example.nodes.length).toBeGreaterThanOrEqual(5);
    expect(example.edges.length).toBeGreaterThanOrEqual(7);

    for (const edge of example.edges) {
      const from = example.nodes.find((node) => node.id === edge.fromId)!;
      const to = example.nodes.find((node) => node.id === edge.toId)!;
      const midpoint = {
        x: (from.x + to.x) / 2,
        y: (from.y + to.y) / 2
      };

      for (const node of example.nodes) {
        if (node.id === edge.fromId || node.id === edge.toId) {
          continue;
        }

        expect(
          distanceFromPointToSegment(node, from, to),
          `edge ${edge.id} overlaps node ${node.id}`
        ).toBeGreaterThanOrEqual(48);
        expect(
          Math.hypot(node.x - midpoint.x, node.y - midpoint.y),
          `edge ${edge.id} weight label overlaps node ${node.id}`
        ).toBeGreaterThanOrEqual(48);
      }
    }
  });

  it("records candidate inspection, selected edges, skipped cycles, and total cost changes", () => {
    const trace = generateMstTrace("kruskal-basic");
    const inspect = getStep(trace, "kruskal-basic-inspect-D-E");
    const select = getStep(trace, "kruskal-basic-select-D-E");
    const skip = getStep(trace, "kruskal-basic-skip-A-B");

    expect(inspect.state.motion).toBe("inspect-edge");
    expect(inspect.state.candidateDecision).toEqual(
      expect.objectContaining({
        edgeId: "D-E",
        willSelect: true,
        fromComponentLabel: "{D}",
        toComponentLabel: "{E}"
      })
    );

    expect(select.state.motion).toBe("select-edge");
    expect(select.state.selectedEdgeIds).toContain("D-E");
    expect(select.state.totalCost).toBe(1);
    expect(select.state.components).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "{D, E}", isMergedThisStep: true })
      ])
    );

    expect(skip.state.motion).toBe("skip-cycle");
    expect(skip.state.skippedEdgeIds).toContain("A-B");
    expect(skip.state.totalCost).toBe(8);
    expect(skip.state.candidateDecision?.reason).toContain("사이클");
  });

  it("preserves component groups and total cost when skipping a cycle edge", () => {
    const trace = generateMstTrace("kruskal-basic");
    const inspect = getStep(trace, "kruskal-basic-inspect-A-B");
    const skip = getStep(trace, "kruskal-basic-skip-A-B");

    expect(inspect.state.components.map((component) => component.label)).toEqual(
      skip.state.components.map((component) => component.label)
    );
    expect(inspect.state.totalCost).toBe(skip.state.totalCost);
    expect(skip.state.candidateDecision).toEqual(
      expect.objectContaining({
        edgeId: "A-B",
        willSelect: false,
        fromComponentLabel: "{A, B, C}",
        toComponentLabel: "{A, B, C}"
      })
    );
  });

  it("produces a complete MST result with node count minus one edges and correct cost", () => {
    const complete = getCompleteState();

    expect(complete.motion).toBe("complete");
    expect(complete.result).toEqual(
      expect.objectContaining({
        selectedEdgeIds: ["D-E", "B-C", "E-F", "A-C", "C-D"],
        selectedEdgeLabels: ["D-E", "B-C", "E-F", "A-C", "C-D"],
        coveredNodeIds: ["A", "B", "C", "D", "E", "F"],
        totalCost: 12,
        costFormulaLabel: "1 + 2 + 2 + 3 + 4 = 12",
        isComplete: true
      })
    );
    expect(complete.selectedEdgeCount).toBe(complete.nodes.length - 1);
    expect(complete.sortedEdges.find((row) => row.edgeId === "B-D")?.status).toBe(
      "not-needed"
    );
  });
});

function hasAllLanguageHighlights(step: {
  codeLineHighlights?: Record<string, number[]>;
}) {
  return languages.every(
    (language) => (step.codeLineHighlights?.[language] ?? []).length > 0
  );
}

function getStep(trace: ReturnType<typeof generateMstTrace>, id: string) {
  const step = trace.find((item) => item.id === id);

  expect(step).toBeDefined();

  return step!;
}

function getCompleteState(): MstTraceState {
  const state = generateMstTrace("kruskal-basic").at(-1)?.state;

  expect(state).toBeDefined();

  return state!;
}

function distanceFromPointToSegment(
  point: { x: number; y: number },
  start: { x: number; y: number },
  end: { x: number; y: number }
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  const t = Math.max(
    0,
    Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared)
  );
  const projection = {
    x: start.x + t * dx,
    y: start.y + t * dy
  };

  return Math.hypot(point.x - projection.x, point.y - projection.y);
}

import { describe, expect, it } from "vitest";

import {
  DIJKSTRA_EXAMPLE_IDS,
  dijkstraExamples,
  formatDistance,
  generateDijkstraTrace,
  getDijkstraPathResult
} from "../algorithms/dijkstra";
import type { DijkstraExampleId, DijkstraTraceState } from "../types";

const languages = ["C", "C++", "Java", "Python", "JavaScript"];

describe("generateDijkstraTrace", () => {
  it("creates complete traces for undirected and directed examples", () => {
    for (const exampleId of DIJKSTRA_EXAMPLE_IDS) {
      const trace = generateDijkstraTrace(exampleId);

      expect(trace[0].id).toBe(`${exampleId}-initialize`);
      expect(trace.at(-1)?.id).toBe(`${exampleId}-complete`);
      expect(trace.length).toBeGreaterThan(20);
      expect(trace.every((step) => step.state.exampleId === exampleId)).toBe(true);
      expect(trace.every((step) => /[가-힣]/.test(step.description))).toBe(true);
      expect(trace.every((step) => hasAllLanguageHighlights(step))).toBe(true);
    }
  });

  it("initializes the start node and unreached nodes", () => {
    const first = generateDijkstraTrace("undirected")[0];
    const start = getRow(first.state, "A");
    const unreachable = getRow(first.state, "G");

    expect(start.distance).toBe(0);
    expect(start.status).toBe("current");
    expect(unreachable.distance).toBe("Infinity");
    expect(unreachable.status).toBe("unreached");
    expect(formatDistance(unreachable.distance)).toBe("∞");
  });

  it("uses alphabetic tie-break for equal tentative distances", () => {
    const trace = generateDijkstraTrace("undirected");
    const selectB = trace.find((step) => step.id === "undirected-select-B");

    expect(selectB).toBeDefined();
    expect(selectB?.description).toContain("라벨 알파벳순");
    expect(selectB?.state.frontierCandidates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ nodeId: "B", distance: 2, isSelected: true }),
        expect.objectContaining({ nodeId: "C", distance: 2, isSelected: false })
      ])
    );
  });

  it("records successful relaxation with previous and new distances", () => {
    const trace = generateDijkstraTrace("undirected");
    const relaxD = trace.find((step) => step.id === "undirected-relax-C-D");

    expect(relaxD).toBeDefined();
    expect(relaxD?.state.motion).toBe("relax");
    expect(relaxD?.state.comparison).toEqual(
      expect.objectContaining({
        fromNodeId: "C",
        toNodeId: "D",
        previousDistance: 6,
        candidateDistance: 3,
        didUpdate: true
      })
    );
    expect(getRow(relaxD!.state, "D")).toEqual(
      expect.objectContaining({
        distance: 3,
        previousNodeId: "C",
        status: "updated",
        changed: true
      })
    );
  });

  it("records no-update and settled persistence without mutating distances", () => {
    const trace = generateDijkstraTrace("undirected");
    const skipE = trace.find((step) => step.id === "undirected-skip-F-E");
    const skipA = trace.find((step) => step.id === "undirected-skip-C-A");

    expect(skipE).toBeDefined();
    expect(skipE?.state.motion).toBe("skip");
    expect(skipE?.state.comparison).toEqual(
      expect.objectContaining({
        toNodeId: "E",
        previousDistance: 7,
        candidateDistance: 7,
        didUpdate: false
      })
    );
    expect(getRow(skipE!.state, "E")).toEqual(
      expect.objectContaining({
        distance: 7,
        previousNodeId: "C",
        status: "skipped",
        changed: false
      })
    );
    expect(getRow(skipA!.state, "A").status).toBe("settled");
  });

  it("produces final distances and paths for the undirected example", () => {
    const complete = getCompleteState("undirected");

    expect(complete.finalDistances).toMatchObject({
      A: 0,
      B: 2,
      C: 2,
      D: 3,
      E: 7,
      F: 6,
      G: "Infinity"
    });
    expect(complete.predecessors).toMatchObject({
      C: "A",
      D: "C",
      F: "D"
    });

    const pathToF = getDijkstraPathResult(complete, "F");
    const pathToA = getDijkstraPathResult(complete, "A");
    const pathToG = getDijkstraPathResult(complete, "G");

    expect(pathToF.pathNodeIds).toEqual(["A", "C", "D", "F"]);
    expect(pathToF.totalCostLabel).toBe("6");
    expect(pathToA.pathNodeIds).toEqual(["A"]);
    expect(pathToA.totalCostLabel).toBe("0");
    expect(pathToG.isReachable).toBe(false);
    expect(pathToG.totalCostLabel).toBe("도달 불가");
  });

  it("keeps directed adjacency one-way and computes directed shortest paths", () => {
    const complete = getCompleteState("directed");
    const pathToF = getDijkstraPathResult(complete, "F");

    expect(complete.finalDistances).toMatchObject({
      A: 0,
      C: 1,
      B: 3,
      D: 4,
      E: 7,
      F: 8,
      G: "Infinity"
    });
    expect(pathToF.pathNodeIds).toEqual(["A", "C", "B", "D", "E", "F"]);
    expect(pathToF.pathEdgeIds).toEqual([
      "A->C",
      "C->B",
      "B->D",
      "D->E",
      "E->F"
    ]);
  });

  it("keeps example edges visually clear of unrelated nodes", () => {
    for (const example of dijkstraExamples) {
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
            `${example.id} edge ${edge.id} overlaps node ${node.id}`
          ).toBeGreaterThanOrEqual(48);
          expect(
            Math.hypot(node.x - midpoint.x, node.y - midpoint.y),
            `${example.id} edge ${edge.id} weight label overlaps node ${node.id}`
          ).toBeGreaterThanOrEqual(48);
        }
      }
    }
  });
});

function hasAllLanguageHighlights(step: {
  codeLineHighlights?: Record<string, number[]>;
}) {
  return languages.every(
    (language) => (step.codeLineHighlights?.[language] ?? []).length > 0
  );
}

function getRow(state: DijkstraTraceState, nodeId: string) {
  const row = state.distanceRows.find((item) => item.nodeId === nodeId);

  expect(row).toBeDefined();

  return row!;
}

function getCompleteState(exampleId: DijkstraExampleId) {
  const state = generateDijkstraTrace(exampleId).at(-1)?.state;

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

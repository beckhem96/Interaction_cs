import { describe, expect, it } from "vitest";

import {
  TOPOLOGICAL_SORT_EXAMPLE_IDS,
  computeInitialInDegrees,
  generateTopologicalSortTrace,
  generateTopologicalSortTraceForExample,
  getZeroInDegreeCandidateIds,
  isTopologicalSortDag,
  topologicalSortExamples
} from "../algorithms/topologicalSort";
import { topologicalSortLineHighlights } from "../code/topologicalSortExamples";
import type { CodeLanguage } from "../../sorting/code/types";
import type { TopologicalSortExample, TopologicalSortTraceState } from "../types";

const languages: CodeLanguage[] = ["C", "C++", "Java", "Python", "JavaScript"];

describe("generateTopologicalSortTrace", () => {
  it("creates a complete topological sort trace for the curated DAG example", () => {
    for (const exampleId of TOPOLOGICAL_SORT_EXAMPLE_IDS) {
      const trace = generateTopologicalSortTrace(exampleId);

      expect(trace[0].id).toBe(`${exampleId}-initialize`);
      expect(trace.at(-1)?.id).toBe(`${exampleId}-complete`);
      expect(trace.length).toBeGreaterThan(20);
      expect(trace.every((step) => step.state.exampleId === exampleId)).toBe(true);
      expect(trace.every((step) => /[가-힣]/.test(step.title))).toBe(true);
      expect(trace.every((step) => /[가-힣]/.test(step.description))).toBe(true);
      expect(trace.every((step) => hasAllLanguageHighlights(step))).toBe(true);
    }
  });

  it("keeps the main example acyclic with deterministic initial in-degree values", () => {
    const example = topologicalSortExamples[0];
    const inDegrees = computeInitialInDegrees(example);

    expect(isTopologicalSortDag(example)).toBe(true);
    expect(Object.fromEntries(inDegrees)).toMatchObject({
      A: 0,
      B: 0,
      C: 1,
      D: 2,
      E: 1,
      F: 2,
      G: 2
    });
    expect(getZeroInDegreeCandidateIds(example, inDegrees, new Set())).toEqual([
      "A",
      "B"
    ]);
  });

  it("keeps the curated DAG visually clear", () => {
    const example = topologicalSortExamples[0];
    const nodeIds = new Set(example.nodes.map((node) => node.id));

    expect(nodeIds.size).toBe(example.nodes.length);
    expect(example.nodes.length).toBeGreaterThanOrEqual(6);
    expect(example.edges.length).toBeGreaterThanOrEqual(7);

    for (const edge of example.edges) {
      const from = example.nodes.find((node) => node.id === edge.fromId)!;
      const to = example.nodes.find((node) => node.id === edge.toId)!;

      for (const node of example.nodes) {
        if (node.id === edge.fromId || node.id === edge.toId) {
          continue;
        }

        expect(
          distanceFromPointToSegment(node, from, to),
          `edge ${edge.id} overlaps node ${node.id}`
        ).toBeGreaterThanOrEqual(48);
        expect(
          Math.hypot(node.x - edge.labelX, node.y - edge.labelY),
          `edge ${edge.id} label overlaps node ${node.id}`
        ).toBeGreaterThanOrEqual(48);
      }
    }
  });

  it("maps every required code action to all supported languages", () => {
    const actions = [
      "initialize-indegree",
      "seed-queue",
      "inspect-candidates",
      "select-node",
      "append-result",
      "iterate-edge",
      "decrement-indegree",
      "enqueue-candidate",
      "complete",
      "cycle-blocked"
    ] as const;

    for (const action of actions) {
      for (const language of languages) {
        expect(
          topologicalSortLineHighlights[action][language],
          `${action} missing ${language} highlight`
        ).not.toHaveLength(0);
      }
    }
  });

  it("records candidate queue tie ordering, selection, and result append", () => {
    const trace = generateTopologicalSortTrace("dag-basic");
    const inspectInitial = getStep(trace, "dag-basic-inspect-0");
    const selectA = getStep(trace, "dag-basic-select-A");

    expect(inspectInitial.state.candidateQueue.items.map((item) => item.nodeId)).toEqual([
      "A",
      "B"
    ]);
    expect(inspectInitial.state.candidateQueue.selectedNodeId).toBe("A");
    expect(inspectInitial.description).toContain("라벨 알파벳순");

    expect(selectA.state.motion).toBe("select-node");
    expect(selectA.state.selectedNodeId).toBe("A");
    expect(selectA.state.resultOrder).toEqual(["A"]);
    expect(selectA.state.nodes.find((node) => node.id === "A")?.status).toBe("selected");
  });

  it("records outgoing edge processing, in-degree decrement, and no-new-candidate steps", () => {
    const trace = generateTopologicalSortTrace("dag-basic");
    const removeA = getStep(trace, "dag-basic-remove-A-outgoing");
    const openC = getStep(trace, "dag-basic-open-A-C");
    const updateD = getStep(trace, "dag-basic-update-A-D");

    expect(removeA.state.motion).toBe("remove-edge");
    expect(removeA.state.affectedEdgeIds).toEqual(["A->C", "A->D"]);

    expect(openC.state.motion).toBe("enqueue-candidate");
    expect(openC.state.newCandidateNodeIds).toEqual(["C"]);
    expect(getRow(openC.state, "C")).toEqual(
      expect.objectContaining({
        previousValue: 1,
        currentValue: 0,
        delta: -1,
        status: "opened"
      })
    );
    expect(openC.state.candidateQueue.items.map((item) => item.nodeId)).toEqual([
      "B",
      "C"
    ]);

    expect(updateD.state.motion).toBe("update-indegree");
    expect(updateD.state.newCandidateNodeIds).toEqual([]);
    expect(getRow(updateD.state, "D")).toEqual(
      expect.objectContaining({
        previousValue: 2,
        currentValue: 1,
        delta: -1,
        status: "waiting"
      })
    );
  });

  it("enqueues newly opened candidates in deterministic order after edge removal", () => {
    const trace = generateTopologicalSortTrace("dag-basic");
    const openD = getStep(trace, "dag-basic-open-B-D");
    const openE = getStep(trace, "dag-basic-open-B-E");

    expect(openD.state.candidateQueue.items.map((item) => item.nodeId)).toEqual([
      "C",
      "D"
    ]);
    expect(openE.state.candidateQueue.items.map((item) => item.nodeId)).toEqual([
      "C",
      "D",
      "E"
    ]);
  });

  it("produces a complete valid topological order and deterministic replay", () => {
    const firstComplete = getCompleteState(generateTopologicalSortTrace("dag-basic"));
    const secondComplete = getCompleteState(generateTopologicalSortTrace("dag-basic"));

    expect(firstComplete.resultOrderNodeIds).toEqual(["A", "B", "C", "D", "E", "F", "G"]);
    expect(firstComplete.validation).toEqual(
      expect.objectContaining({
        nodeCount: 7,
        processedCount: 7,
        isValid: true
      })
    );
    expect(firstComplete.validation?.edgeChecks.every((check) => check.isValid)).toBe(true);
    expect(firstComplete.resultOrderNodeIds).toEqual(secondComplete.resultOrderNodeIds);
  });

  it("emits a cycle-blocked step for cyclic input fixtures", () => {
    const cyclicExample: TopologicalSortExample = {
      ...topologicalSortExamples[0],
      id: "dag-basic",
      nodes: [
        { id: "A", label: "A", x: 80, y: 120 },
        { id: "B", label: "B", x: 240, y: 120 },
        { id: "C", label: "C", x: 400, y: 120 }
      ],
      edges: [
        { id: "A->B", fromId: "A", toId: "B", label: "A → B", labelX: 160, labelY: 90 },
        { id: "B->C", fromId: "B", toId: "C", label: "B → C", labelX: 320, labelY: 90 },
        { id: "C->A", fromId: "C", toId: "A", label: "C → A", labelX: 240, labelY: 160 }
      ]
    };
    const trace = generateTopologicalSortTraceForExample(cyclicExample);
    const blocked = trace.at(-1);

    expect(isTopologicalSortDag(cyclicExample)).toBe(false);
    expect(blocked?.state.motion).toBe("cycle-blocked");
    expect(blocked?.state.validation).toEqual(
      expect.objectContaining({
        isValid: false,
        processedCount: 0
      })
    );
    expect(blocked?.description).toContain("순환");
  });
});

function hasAllLanguageHighlights(step: {
  codeLineHighlights?: Record<string, number[]>;
}) {
  return languages.every(
    (language) => (step.codeLineHighlights?.[language] ?? []).length > 0
  );
}

function getStep(trace: ReturnType<typeof generateTopologicalSortTrace>, id: string) {
  const step = trace.find((item) => item.id === id);

  expect(step).toBeDefined();

  return step!;
}

function getRow(state: TopologicalSortTraceState, nodeId: string) {
  const row = state.inDegreeRows.find((item) => item.nodeId === nodeId);

  expect(row).toBeDefined();

  return row!;
}

function getCompleteState(state: ReturnType<typeof generateTopologicalSortTrace>) {
  const complete = state.at(-1)?.state;

  expect(complete).toBeDefined();

  return complete!;
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

import { describe, expect, it } from "vitest";

import type { CodeLanguage } from "../../sorting/code/types";
import {
  SCC_EXAMPLE_IDS,
  createCondensationEdges,
  generateStronglyConnectedComponentsTrace,
  getReversedSccEdges,
  sccExamples
} from "../algorithms/stronglyConnectedComponents";
import { stronglyConnectedComponentsLineHighlights } from "../code/stronglyConnectedComponentsExamples";
import type { SccTraceState } from "../types";

const languages: CodeLanguage[] = ["C", "C++", "Java", "Python", "JavaScript"];

describe("generateStronglyConnectedComponentsTrace", () => {
  it("creates a deterministic SCC trace for the curated Kosaraju example", () => {
    for (const exampleId of SCC_EXAMPLE_IDS) {
      const trace = generateStronglyConnectedComponentsTrace(exampleId);

      expect(trace[0].id).toBe(`${exampleId}-initialize`);
      expect(trace.at(-1)?.id).toBe(`${exampleId}-complete`);
      expect(trace.length).toBeGreaterThan(35);
      expect(trace.every((step) => step.state.exampleId === exampleId)).toBe(true);
      expect(trace.every((step) => /[가-힣]/.test(step.title))).toBe(true);
      expect(trace.every((step) => /[가-힣]/.test(step.description))).toBe(true);
      expect(trace.every((step) => hasAllLanguageHighlights(step))).toBe(true);
      expect(trace.map((step) => step.id)).toEqual(
        generateStronglyConnectedComponentsTrace(exampleId).map((step) => step.id)
      );
    }
  });

  it("keeps the curated example shape and visual spacing clear", () => {
    const example = sccExamples[0];
    const nodeIds = new Set(example.nodes.map((node) => node.id));
    const componentSizes = Object.values(
      example.nodes.reduce<Record<string, number>>((counts, node) => {
        counts[node.expectedComponentId] = (counts[node.expectedComponentId] ?? 0) + 1;
        return counts;
      }, {})
    ).sort((left, right) => right - left);

    expect(nodeIds.size).toBe(example.nodes.length);
    expect(example.nodes.length).toBe(6);
    expect(example.edges).toHaveLength(8);
    expect(componentSizes).toEqual([3, 2, 1]);

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
        ).toBeGreaterThanOrEqual(42);
        expect(
          Math.hypot(node.x - edge.labelX, node.y - edge.labelY),
          `edge ${edge.id} label overlaps node ${node.id}`
        ).toBeGreaterThanOrEqual(46);
      }
    }
  });

  it("maps every SCC code action to all supported languages", () => {
    const actions = [
      "initialize",
      "first-pass-start",
      "first-pass-visit",
      "inspect-edge",
      "skip-edge",
      "finish-stack-push",
      "reverse-graph",
      "second-pass-pop",
      "second-pass-visit",
      "add-to-component",
      "finalize-component",
      "build-condensation",
      "complete"
    ] as const;

    for (const action of actions) {
      for (const language of languages) {
        expect(
          stronglyConnectedComponentsLineHighlights[action][language],
          `${action} missing ${language} highlight`
        ).not.toHaveLength(0);
      }
    }
  });

  it("records first-pass DFS visit, edge inspection, skip, and finish stack push behavior", () => {
    const trace = generateStronglyConnectedComponentsTrace("kosaraju-basic");
    const visitA = getStep(trace, "kosaraju-basic-first-visit-A");
    const inspectAB = getStep(trace, "kosaraju-basic-first-inspect-A-B");
    const skipCA = getStep(trace, "kosaraju-basic-first-inspect-C-A");
    const finishA = getStep(trace, "kosaraju-basic-finish-A");
    const reverse = getStep(trace, "kosaraju-basic-reverse-edges");

    expect(visitA.state.dfs.pass).toBe("first");
    expect(visitA.state.dfs.pathNodeIds).toEqual(["A"]);
    expect(inspectAB.state.dfs.activeEdgeId).toBe("A->B");
    expect(skipCA.state.motion).toBe("skip-edge");
    expect(skipCA.description).toContain("이미 방문");
    expect(finishA.state.finishStack.lastPushedNodeId).toBe("A");
    expect(reverse.state.finishStack.items).toEqual(["F", "E", "D", "C", "B", "A"]);
  });

  it("shows reversed edges before second-pass DFS starts", () => {
    const example = sccExamples[0];
    const reversedEdges = getReversedSccEdges(example);
    const reverseStep = getStep(
      generateStronglyConnectedComponentsTrace("kosaraju-basic"),
      "kosaraju-basic-reverse-edges"
    );

    expect(reversedEdges.map((edge) => `${edge.fromId}->${edge.toId}`)).toEqual(
      example.edges.map((edge) => `${edge.toId}->${edge.fromId}`)
    );
    expect(reverseStep.state.isReversedGraph).toBe(true);
    expect(reverseStep.state.edges.find((edge) => edge.id === "A->B")).toEqual(
      expect.objectContaining({
        fromId: "B",
        toId: "A",
        status: "reversed"
      })
    );
  });

  it("groups the expected SCCs during the second pass", () => {
    const trace = generateStronglyConnectedComponentsTrace("kosaraju-basic");
    const popA = getStep(trace, "kosaraju-basic-pop-A");
    const finalizeC1 = getStep(trace, "kosaraju-basic-finalize-C1");
    const finalizeC2 = getStep(trace, "kosaraju-basic-finalize-C2");
    const finalizeC3 = getStep(trace, "kosaraju-basic-finalize-C3");
    const skipB = getStep(trace, "kosaraju-basic-skip-pop-B");

    expect(popA.state.finishStack.lastPoppedNodeId).toBe("A");
    expect(finalizeC1.state.finalizedComponents[0].nodeIds).toEqual(["A", "C", "B"]);
    expect(finalizeC2.state.finalizedComponents[1].nodeIds).toEqual(["D", "E"]);
    expect(finalizeC3.state.finalizedComponents[2].nodeIds).toEqual(["F"]);
    expect(skipB.description).toContain("이미 SCC");
  });

  it("builds condensation edges without merging one-way cross-component edges", () => {
    const complete = getCompleteState(generateStronglyConnectedComponentsTrace("kosaraju-basic"));
    const validation = complete.validation!;
    const condensationEdges = createCondensationEdges(sccExamples[0], validation.components);

    expect(validation.componentCount).toBe(3);
    expect(validation.allNodesCovered).toBe(true);
    expect(validation.hasDuplicateMembership).toBe(false);
    expect(validation.nodeCoverage.sort()).toEqual(["A", "B", "C", "D", "E", "F"]);
    expect(condensationEdges).toEqual([
      {
        id: "C1->C2",
        fromComponentId: "C1",
        toComponentId: "C2",
        sourceEdgeIds: ["B->D", "C->D"]
      },
      {
        id: "C2->C3",
        fromComponentId: "C2",
        toComponentId: "C3",
        sourceEdgeIds: ["E->F"]
      }
    ]);
    expect(complete.condensationEdges).toEqual(condensationEdges);
  });
});

function hasAllLanguageHighlights(step: {
  codeLineHighlights?: Record<string, number[]>;
}) {
  return languages.every(
    (language) => (step.codeLineHighlights?.[language] ?? []).length > 0
  );
}

function getStep(
  trace: ReturnType<typeof generateStronglyConnectedComponentsTrace>,
  id: string
) {
  const step = trace.find((item) => item.id === id);

  expect(step).toBeDefined();

  return step!;
}

function getCompleteState(
  trace: ReturnType<typeof generateStronglyConnectedComponentsTrace>
): SccTraceState {
  const complete = trace.at(-1)?.state;

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

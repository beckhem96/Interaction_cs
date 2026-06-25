import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  InteractiveGraphCanvas,
  layoutLearningGraph,
  type LearningGraphEdge,
  type LearningGraphNode
} from "./InteractiveGraphCanvas";

const nodes: LearningGraphNode[] = [
  { id: "A", label: "A", className: "graph-node", ariaLabel: "A 노드", x: 80, y: 80 },
  { id: "B", label: "B", className: "graph-node", ariaLabel: "B 노드", x: 240, y: 80 },
  { id: "C", label: "C", className: "graph-node", ariaLabel: "C 노드", x: 400, y: 80 }
];

const edges: LearningGraphEdge[] = [
  {
    id: "A-B",
    source: "A",
    target: "B",
    className: "graph-edge",
    ariaLabel: "A에서 B 간선",
    directed: true,
    color: "#2f6fbb"
  },
  {
    id: "B-C",
    source: "B",
    target: "C",
    className: "graph-edge",
    ariaLabel: "B에서 C 간선",
    directed: true,
    color: "#2f6fbb"
  }
];

describe("InteractiveGraphCanvas", () => {
  it("renders a reusable interactive graph surface and node labels", () => {
    render(
      <InteractiveGraphCanvas
        ariaLabel="테스트 그래프"
        nodes={nodes}
        edges={edges}
      />
    );

    expect(screen.getByRole("application", { name: "테스트 그래프" })).toBeInTheDocument();
    expect(screen.getByLabelText("A 노드")).toBeInTheDocument();
    expect(screen.getByLabelText("C 노드")).toBeInTheDocument();
  });

  it("produces deterministic non-overlapping ELK positions", async () => {
    const first = await layoutLearningGraph(nodes, edges);
    const second = await layoutLearningGraph(nodes, edges);

    expect(second).toEqual(first);
    expect(new Set(Object.values(first).map(({ x, y }) => `${x}:${y}`)).size).toBe(nodes.length);
    expect(first.A.x).toBeLessThan(first.B.x);
    expect(first.B.x).toBeLessThan(first.C.x);
  });
});

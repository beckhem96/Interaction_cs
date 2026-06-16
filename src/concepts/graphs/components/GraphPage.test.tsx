import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { generateGraphStructureTrace } from "../algorithms/graphStructures";
import { GraphPage } from "./GraphPage";

describe("GraphPage", () => {
  it("renders the graph structure learning surface", () => {
    const { container } = render(
      <MemoryRouter>
        <GraphPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "무방향 그래프" })
    ).toBeInTheDocument();
    expect(screen.getByText("노드 6개 · 간선 7개")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "무방향 그래프 상태" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "그래프 다음 단계" })).toBeEnabled();
    expect(screen.getByRole("slider", { name: "그래프 단계 슬라이더" })).toHaveValue("0");
    for (const language of ["C", "C++", "Java", "Python", "JavaScript"]) {
      expect(screen.getByRole("tab", { name: language })).toBeInTheDocument();
    }
    expect(container.querySelector(".graph-visual.motion-idle")).not.toBeNull();
  });

  it("supports manual scrubbing to a weighted edge step", () => {
    const { container } = render(
      <MemoryRouter>
        <GraphPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "가중치 그래프" }));

    const trace = generateGraphStructureTrace("weighted");
    const weightedEdgeIndex = trace.findIndex(
      (step) => step.id === "weighted-edge-S-A"
    );
    const slider = screen.getByRole("slider", { name: "그래프 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(weightedEdgeIndex) } });

    expect(screen.getAllByText("S → A 연결").length).toBeGreaterThan(0);
    expect(screen.getByText("노드 6개 · 가중치 간선 8개")).toBeInTheDocument();
    expect(screen.getAllByText("A(4)").length).toBeGreaterThan(0);
    expect(container.querySelector(".graph-edge.is-weighted.is-active")).not.toBeNull();
    expect(
      screen.getByRole("listitem", {
        name: "현재 코드 17: graphAddWeightedEdge(graph, from, to, weight);"
      })
    ).toBeInTheDocument();
  });

  it("switches to DAG mode and shows one-way dependency edges", () => {
    const { container } = render(
      <MemoryRouter>
        <GraphPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "DAG" }));

    const trace = generateGraphStructureTrace("dag");
    const completeIndex = trace.findIndex((step) => step.id === "dag-complete");
    const slider = screen.getByRole("slider", { name: "그래프 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(completeIndex) } });

    expect(screen.getAllByText("DAG 구조 완성").length).toBeGreaterThan(0);
    expect(screen.getByRole("img", { name: "DAG 상태" })).toBeInTheDocument();
    expect(screen.getByText("API, UI")).toBeInTheDocument();
    expect(container.querySelector(".graph-edge.is-directed.is-active")).not.toBeNull();
    expect(container.querySelectorAll(".graph-edge.is-directed")).toHaveLength(7);
  });

  it("switches to bipartite mode and highlights partitions", () => {
    const { container } = render(
      <MemoryRouter>
        <GraphPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "이분 그래프" }));

    const trace = generateGraphStructureTrace("bipartite");
    const completeIndex = trace.findIndex(
      (step) => step.id === "bipartite-complete"
    );
    const slider = screen.getByRole("slider", { name: "그래프 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(completeIndex) } });

    expect(screen.getAllByText("이분 그래프 구조 완성").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("U1 왼쪽 파티션 노드")).toBeInTheDocument();
    expect(screen.getByLabelText("T1 오른쪽 파티션 노드")).toBeInTheDocument();
    expect(container.querySelectorAll(".graph-node.group-left")).toHaveLength(3);
    expect(container.querySelectorAll(".graph-node.group-right")).toHaveLength(3);
    expect(container.querySelectorAll(".graph-edge.is-active")).toHaveLength(6);
  });
});

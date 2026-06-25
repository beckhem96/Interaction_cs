import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { generateTopologicalSortTrace } from "../algorithms/topologicalSort";
import { TopologicalSortPage } from "./TopologicalSortPage";

describe("TopologicalSortPage", () => {
  it("renders the topological sort workbench with graph, queue, table, controls, and code tabs", () => {
    const { container } = render(
      <MemoryRouter>
        <TopologicalSortPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "위상 정렬: DAG" })
    ).toBeInTheDocument();
    expect(screen.getByRole("application", { name: "DAG 위상 정렬 상태" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "진입 차수 0 후보 큐" })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "진입 차수 표" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("slider", { name: "위상 정렬 단계 슬라이더" })).toHaveValue("0");

    for (const language of ["C", "C++", "Java", "Python", "JavaScript"]) {
      expect(screen.getByRole("tab", { name: language })).toBeInTheDocument();
    }

    expect(container.querySelector(".topological-visual.motion-initialize")).not.toBeNull();
  });

  it("supports manual next, reset, slider navigation, and code tab switching", () => {
    const { container } = render(
      <MemoryRouter>
        <TopologicalSortPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getAllByText("진입 차수 0 후보 확인").length).toBeGreaterThan(0);
    expect(screen.getByText(/동시 후보 A, B/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "처음으로" }));

    expect(screen.getAllByText("진입 차수 계산").length).toBeGreaterThan(0);

    const trace = generateTopologicalSortTrace("dag-basic");
    const openIndex = trace.findIndex((step) => step.id === "dag-basic-open-A-C");
    const slider = screen.getByRole("slider", { name: "위상 정렬 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(openIndex) } });

    expect(screen.getAllByText("C가 새 후보로 열림").length).toBeGreaterThan(0);
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
    expect(container.querySelector(".topological-node.is-opened")).not.toBeNull();
    expect(container.querySelector(".code-line.is-active")).not.toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "Python" }));

    expect(screen.getByText("topological_sort.py")).toBeInTheDocument();
    expect(container.querySelector(".code-line.is-active")).not.toBeNull();
  });

  it("renders edge updates, in-degree deltas, and newly opened candidate labels", () => {
    const { container } = render(
      <MemoryRouter>
        <TopologicalSortPage />
      </MemoryRouter>
    );

    const trace = generateTopologicalSortTrace("dag-basic");
    const updateIndex = trace.findIndex((step) => step.id === "dag-basic-open-B-D");
    const slider = screen.getByRole("slider", { name: "위상 정렬 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(updateIndex) } });

    expect(screen.getAllByText("D가 새 후보로 열림").length).toBeGreaterThan(0);
    expect(screen.getAllByText("-1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("새 후보").length).toBeGreaterThan(0);
    expect(container.querySelector(".topological-row.is-opened")).not.toBeNull();
  });

  it("renders final validation and preserves deterministic replay", () => {
    render(
      <MemoryRouter>
        <TopologicalSortPage />
      </MemoryRouter>
    );

    const trace = generateTopologicalSortTrace("dag-basic");
    const completeIndex = trace.findIndex((step) => step.id === "dag-basic-complete");
    const slider = screen.getByRole("slider", { name: "위상 정렬 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(completeIndex) } });

    expect(screen.getByText("A → B → C → D → E → F → G")).toBeInTheDocument();
    expect(screen.getAllByText("7 / 7").length).toBeGreaterThan(0);
    expect(screen.getByText(/모든 방향 간선/)).toBeInTheDocument();
    expect(screen.getAllByText("통과").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "이전" }));
    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getByText("A → B → C → D → E → F → G")).toBeInTheDocument();
  });

  it("exposes automatic playback controls with speed selection", () => {
    render(
      <MemoryRouter>
        <TopologicalSortPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "자동 재생" })).toBeEnabled();
    fireEvent.change(screen.getByLabelText("재생 속도"), { target: { value: "450" } });

    expect(screen.getByLabelText("재생 속도")).toHaveValue("450");
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { generateDijkstraTrace } from "../algorithms/dijkstra";
import { DijkstraPage } from "./DijkstraPage";

describe("DijkstraPage", () => {
  it("renders the Dijkstra workbench with graph, distance table, controls, and code tabs", () => {
    const { container } = render(
      <MemoryRouter>
        <DijkstraPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "다익스트라 최단 경로" })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "무방향 그래프" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "방향 그래프" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "무방향 그래프 다익스트라 상태" })
    ).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "다익스트라 거리 표" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("slider", { name: "다익스트라 단계 슬라이더" })).toHaveValue("0");

    for (const language of ["C", "C++", "Java", "Python", "JavaScript"]) {
      expect(screen.getByRole("tab", { name: language })).toBeInTheDocument();
    }

    expect(container.querySelector(".dijkstra-visual.motion-initialize")).not.toBeNull();
  });

  it("supports manual next, reset, and slider navigation with synchronized labels", () => {
    const { container } = render(
      <MemoryRouter>
        <DijkstraPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getAllByText("A를 현재 노드로 선택").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "이전" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "처음으로" }));

    expect(screen.getAllByText("시작 거리 초기화").length).toBeGreaterThan(0);

    const trace = generateDijkstraTrace("undirected");
    const relaxIndex = trace.findIndex((step) => step.id === "undirected-relax-C-D");
    const slider = screen.getByRole("slider", { name: "다익스트라 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(relaxIndex) } });

    expect(screen.getAllByText("D 거리 갱신").length).toBeGreaterThan(0);
    expect(screen.getByText("6 → 3 갱신")).toBeInTheDocument();
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
    expect(container.querySelector(".dijkstra-edge.is-relaxed")).not.toBeNull();
    expect(container.querySelector(".code-line.is-active")).not.toBeNull();
  });

  it("shows no-update and settled state labels without relying only on color", () => {
    render(
      <MemoryRouter>
        <DijkstraPage />
      </MemoryRouter>
    );

    const trace = generateDijkstraTrace("undirected");
    const skipIndex = trace.findIndex((step) => step.id === "undirected-skip-F-E");
    const slider = screen.getByRole("slider", { name: "다익스트라 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(skipIndex) } });

    expect(screen.getAllByText("E 거리 유지").length).toBeGreaterThan(0);
    expect(screen.getByText("7 → 7 유지")).toBeInTheDocument();
    expect(screen.getAllByText(/후보 거리 7/).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/E 유지 노드/)).toBeInTheDocument();
  });

  it("updates final path when the learner selects a destination", () => {
    const { container } = render(
      <MemoryRouter>
        <DijkstraPage />
      </MemoryRouter>
    );

    const trace = generateDijkstraTrace("undirected");
    const completeIndex = trace.findIndex((step) => step.id === "undirected-complete");
    const slider = screen.getByRole("slider", { name: "다익스트라 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(completeIndex) } });

    expect(screen.getByText("경로:")).toBeInTheDocument();
    expect(screen.getByText("A → C → D → F")).toBeInTheDocument();
    expect(screen.getAllByText("6").length).toBeGreaterThan(0);

    fireEvent.change(screen.getByRole("combobox", { name: "도착 노드 선택" }), {
      target: { value: "E" }
    });

    expect(screen.getByText("A → C → E")).toBeInTheDocument();
    expect(screen.getAllByText("7").length).toBeGreaterThan(0);
    expect(container.querySelector(".dijkstra-edge.is-final-path")).not.toBeNull();

    fireEvent.change(screen.getByRole("combobox", { name: "도착 노드 선택" }), {
      target: { value: "G" }
    });

    expect(screen.getAllByText("도달 불가").length).toBeGreaterThan(0);
  });

  it("switches to the directed example and resets the workbench", () => {
    render(
      <MemoryRouter>
        <DijkstraPage />
      </MemoryRouter>
    );

    const directedTrace = generateDijkstraTrace("directed");
    const completeIndex = directedTrace.findIndex(
      (step) => step.id === "directed-complete"
    );

    fireEvent.click(screen.getByRole("tab", { name: "방향 그래프" }));

    const slider = screen.getByRole("slider", { name: "다익스트라 단계 슬라이더" });
    expect(slider).toHaveValue("0");
    expect(
      screen.getByRole("img", { name: "방향 그래프 다익스트라 상태" })
    ).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: String(completeIndex) } });

    expect(screen.getByText("A → C → B → D → E → F")).toBeInTheDocument();
    expect(screen.getAllByText("8").length).toBeGreaterThan(0);
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { generateMstTrace } from "../algorithms/mst";
import { MstPage } from "./MstPage";

describe("MstPage", () => {
  it("renders the MST workbench with graph, edge list, controls, and code tabs", () => {
    const { container } = render(
      <MemoryRouter>
        <MstPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "최소 신장 트리: Kruskal" })
    ).toBeInTheDocument();
    expect(screen.getByRole("application", { name: "Kruskal MST 상태" })).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Kruskal 정렬 간선 목록" })
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "연결 성분" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("slider", { name: "MST 단계 슬라이더" })).toHaveValue("0");

    for (const language of ["C", "C++", "Java", "Python", "JavaScript"]) {
      expect(screen.getByRole("tab", { name: language })).toBeInTheDocument();
    }

    expect(container.querySelector(".mst-visual.motion-initialize")).not.toBeNull();
  });

  it("supports manual next, reset, and slider navigation with synchronized labels", () => {
    const { container } = render(
      <MemoryRouter>
        <MstPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getAllByText("간선을 비용순으로 정렬").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "이전" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "처음으로" }));

    expect(screen.getAllByText("각 노드를 독립 성분으로 준비").length).toBeGreaterThan(0);

    const trace = generateMstTrace("kruskal-basic");
    const selectIndex = trace.findIndex((step) => step.id === "kruskal-basic-select-A-C");
    const slider = screen.getByRole("slider", { name: "MST 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(selectIndex) } });

    expect(screen.getAllByText("A-C 간선 선택").length).toBeGreaterThan(0);
    expect(screen.getAllByText("8").length).toBeGreaterThan(0);
    expect(screen.getByText("{A, B, C}")).toBeInTheDocument();
    expect(container.querySelector(".code-line.is-active")).not.toBeNull();
  });

  it("shows component merge and skipped-cycle reasons without relying only on color", () => {
    render(
      <MemoryRouter>
        <MstPage />
      </MemoryRouter>
    );

    const trace = generateMstTrace("kruskal-basic");
    const skipIndex = trace.findIndex((step) => step.id === "kruskal-basic-skip-A-B");
    const slider = screen.getByRole("slider", { name: "MST 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(skipIndex) } });

    expect(screen.getAllByText("A-B 간선 건너뛰기").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/사이클/).length).toBeGreaterThan(0);
    expect(screen.getByText("건너뜀 · 사이클")).toBeInTheDocument();
    expect(screen.getByLabelText(/A 후보 노드/)).toBeInTheDocument();
  });

  it("renders the final MST result and preserves deterministic replay", () => {
    render(
      <MemoryRouter>
        <MstPage />
      </MemoryRouter>
    );

    const trace = generateMstTrace("kruskal-basic");
    const completeIndex = trace.findIndex((step) => step.id === "kruskal-basic-complete");
    const slider = screen.getByRole("slider", { name: "MST 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(completeIndex) } });

    expect(screen.getAllByText("5 / 5").length).toBeGreaterThan(0);
    expect(screen.getByText("1 + 2 + 2 + 3 + 4 = 12")).toBeInTheDocument();
    expect(screen.getByText("D-E → B-C → E-F → A-C → C-D")).toBeInTheDocument();
    expect(screen.getByText("A, B, C, D, E, F")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "이전" }));
    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getAllByText("5 / 5").length).toBeGreaterThan(0);
    expect(screen.getAllByText("12").length).toBeGreaterThan(0);
  });

  it("preserves the current step highlight when switching code languages", () => {
    const { container } = render(
      <MemoryRouter>
        <MstPage />
      </MemoryRouter>
    );

    const trace = generateMstTrace("kruskal-basic");
    const selectIndex = trace.findIndex((step) => step.id === "kruskal-basic-select-D-E");
    const slider = screen.getByRole("slider", { name: "MST 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(selectIndex) } });
    fireEvent.click(screen.getByRole("tab", { name: "Python" }));

    expect(screen.getByText("kruskal.py")).toBeInTheDocument();
    expect(container.querySelector(".code-line.is-active")).not.toBeNull();
  });
});

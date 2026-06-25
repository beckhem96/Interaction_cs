import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { generateStronglyConnectedComponentsTrace } from "../algorithms/stronglyConnectedComponents";
import { StronglyConnectedComponentsPage } from "./StronglyConnectedComponentsPage";

const trace = generateStronglyConnectedComponentsTrace("kosaraju-basic");

function renderPage() {
  render(
    <MemoryRouter>
      <StronglyConnectedComponentsPage />
    </MemoryRouter>
  );
}

describe("StronglyConnectedComponentsPage", () => {
  it("renders the SCC workbench shell with graph, stack, controls, slider, and code tabs", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "강한 연결 요소: SCC" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("application", { name: "SCC 방향 그래프 상태" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("SCC 방향 그래프 상태")).toBeInTheDocument();
    expect(screen.getByLabelText("finish stack과 DFS 경로")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "자동 재생" })).toBeEnabled();
    expect(screen.getByRole("slider", { name: "SCC 단계 슬라이더" })).toHaveValue("0");
    expect(screen.getByRole("tab", { name: "C" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "JavaScript" })).toBeInTheDocument();
  });

  it("supports manual next, reset, slider navigation, and code tab switching", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(screen.getByRole("heading", { name: "A 방문" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Python" }));
    expect(screen.getByText("kosaraju.py")).toBeInTheDocument();

    const reverseIndex = trace.findIndex((step) => step.id === "kosaraju-basic-reverse-edges");
    const slider = screen.getByRole("slider", { name: "SCC 단계 슬라이더" });
    fireEvent.change(slider, { target: { value: String(reverseIndex) } });

    expect(slider).toHaveValue(String(reverseIndex));
    expect(screen.getByRole("heading", { name: "모든 간선 방향 뒤집기" })).toBeInTheDocument();
    expect(screen.getAllByText(/간선 뒤집기/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "처음으로" }));
    expect(screen.getByRole("slider", { name: "SCC 단계 슬라이더" })).toHaveValue("0");
  });

  it("renders current SCC candidate and finalized SCC labels in second-pass steps", () => {
    renderPage();

    const addIndex = trace.findIndex((step) => step.id === "kosaraju-basic-component-add-C");
    fireEvent.change(screen.getByRole("slider", { name: "SCC 단계 슬라이더" }), {
      target: { value: String(addIndex) }
    });

    expect(screen.getByRole("heading", { name: "C를 현재 SCC에 추가" })).toBeInTheDocument();
    expect(screen.getByText("현재 SCC 후보")).toBeInTheDocument();
    expect(screen.getByText("A, C")).toBeInTheDocument();

    const finalizedIndex = trace.findIndex((step) => step.id === "kosaraju-basic-finalize-C2");
    fireEvent.change(screen.getByRole("slider", { name: "SCC 단계 슬라이더" }), {
      target: { value: String(finalizedIndex) }
    });

    const sccList = screen.getByLabelText("SCC 목록");
    expect(within(sccList).getByText("SCC 1")).toBeInTheDocument();
    expect(within(sccList).getByText("SCC 2")).toBeInTheDocument();
    expect(within(sccList).getAllByText("D, E").length).toBeGreaterThan(0);
  });

  it("renders final validation and condensation DAG on the complete step", () => {
    renderPage();

    const completeIndex = trace.findIndex((step) => step.id === "kosaraju-basic-complete");
    fireEvent.change(screen.getByRole("slider", { name: "SCC 단계 슬라이더" }), {
      target: { value: String(completeIndex) }
    });

    expect(screen.getByRole("heading", { name: "SCC 분석 완료" })).toBeInTheDocument();
    expect(screen.getByText(/SCC 개수:/)).toBeInTheDocument();
    expect(screen.getByText("모든 노드 1회 포함")).toBeInTheDocument();
    expect(screen.getByText("condensation DAG")).toBeInTheDocument();
    expect(screen.getByText("C1 → C2")).toBeInTheDocument();
    expect(screen.getByText("C2 → C3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "자동 재생" })).toBeDisabled();
  });
});

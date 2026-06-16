import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { generateGraphTraversalTrace } from "../algorithms/graphTraversal";
import { GraphTraversalPage } from "./GraphTraversalPage";

describe("GraphTraversalPage", () => {
  it("renders the BFS traversal learning surface", () => {
    const { container } = render(
      <MemoryRouter>
        <GraphTraversalPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "그래프 탐색: BFS" })
    ).toBeInTheDocument();
    expect(screen.getByText("노드 9개 · 간선 11개 · 시작 A")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "BFS 탐색 상태" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "그래프 탐색 다음 단계" })
    ).toBeEnabled();
    expect(
      screen.getByRole("slider", { name: "그래프 탐색 단계 슬라이더" })
    ).toHaveValue("0");
    for (const language of ["C", "C++", "Java", "Python", "JavaScript"]) {
      expect(screen.getByRole("tab", { name: language })).toBeInTheDocument();
    }
    expect(screen.getByLabelText("A 현재 노드")).toBeInTheDocument();
    expect(container.querySelector(".graph-visual.motion-idle")).not.toBeNull();
  });

  it("supports manual scrubbing to a BFS discovery step", () => {
    const { container } = render(
      <MemoryRouter>
        <GraphTraversalPage />
      </MemoryRouter>
    );

    const trace = generateGraphTraversalTrace("bfs");
    const discoverIndex = trace.findIndex(
      (step) => step.id === "bfs-discover-B-from-A"
    );
    const slider = screen.getByRole("slider", {
      name: "그래프 탐색 단계 슬라이더"
    });

    fireEvent.change(slider, { target: { value: String(discoverIndex) } });

    expect(
      screen.getAllByText("B 발견 후 큐에 추가").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("큐 앞 → 뒤")).toBeInTheDocument();
    expect(screen.getByLabelText("B 대기 노드")).toBeInTheDocument();
    expect(container.querySelector(".graph-edge.is-tree-edge.is-active")).not.toBeNull();
    expect(
      screen.getByRole("listitem", {
        name: "현재 코드 25: queuePush(&queue, next);"
      })
    ).toBeInTheDocument();
  });

  it("switches to DFS and shows stack-based completion order", () => {
    const { container } = render(
      <MemoryRouter>
        <GraphTraversalPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "DFS" }));

    const trace = generateGraphTraversalTrace("dfs");
    const completeIndex = trace.findIndex((step) => step.id === "dfs-complete");
    const slider = screen.getByRole("slider", {
      name: "그래프 탐색 단계 슬라이더"
    });

    fireEvent.change(slider, { target: { value: String(completeIndex) } });

    expect(
      screen.getByRole("heading", { name: "그래프 탐색: DFS" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("DFS 탐색 완료").length).toBeGreaterThan(0);
    expect(
      screen.getByText("방문 순서: A → B → E → I → H → G → F → C → D")
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".graph-node.is-visited")).toHaveLength(9);
    expect(container.querySelectorAll(".graph-edge.is-tree-edge")).toHaveLength(8);
    expect(
      screen.getByRole("listitem", {
        name: "현재 코드 47: return visited;"
      })
    ).toBeInTheDocument();
  });
});

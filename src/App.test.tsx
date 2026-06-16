import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App routes", () => {
  it("routes to the Bubble Sort learning page", () => {
    render(
      <MemoryRouter initialEntries={["/sorting"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "버블 정렬" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("입력 배열: [14, 3, 17, 8, 6, 12, 1, 19, 4, 10]")
    ).toBeInTheDocument();
  });

  it("routes to the tree learning page", () => {
    render(
      <MemoryRouter initialEntries={["/trees"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "BST 삽입과 탐색" })
    ).toBeInTheDocument();
    expect(screen.getByText(/삽입 값: \[42, 23, 61/)).toBeInTheDocument();
  });

  it("routes to the graph learning page", () => {
    render(
      <MemoryRouter initialEntries={["/graphs"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "무방향 그래프" })
    ).toBeInTheDocument();
    expect(screen.getByText("노드 6개 · 간선 7개")).toBeInTheDocument();
  });

  it("routes to the graph traversal learning page", () => {
    render(
      <MemoryRouter initialEntries={["/graphs/traversal"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "그래프 탐색: BFS" })
    ).toBeInTheDocument();
    expect(screen.getByText("노드 9개 · 간선 11개 · 시작 A")).toBeInTheDocument();
  });
});

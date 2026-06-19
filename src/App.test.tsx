import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App routes", () => {
  it("routes to the sorting learning page", () => {
    render(
      <MemoryRouter initialEntries={["/sorting"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /버블 정렬/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/입력 배열/)).toBeInTheDocument();
  });

  it("routes to the tree learning page", () => {
    render(
      <MemoryRouter initialEntries={["/trees"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "BST 삽입과 탐색" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/삽입 값/)).toBeInTheDocument();
  });

  it("routes to the graph learning page", () => {
    render(
      <MemoryRouter initialEntries={["/graphs"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "무방향 그래프" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/노드 6개/)).toBeInTheDocument();
  });

  it("routes to the graph traversal learning page", () => {
    render(
      <MemoryRouter initialEntries={["/graphs/traversal"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /그래프 탐색: BFS/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/시작 A/)).toBeInTheDocument();
  });

  it("routes to the Dijkstra learning page", () => {
    render(
      <MemoryRouter initialEntries={["/graphs/dijkstra"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "다익스트라 최단 경로" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/무방향 · 노드/)).toBeInTheDocument();
  });

  it("routes to the MST learning page", () => {
    render(
      <MemoryRouter initialEntries={["/graphs/mst"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "최소 신장 트리: Kruskal" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/목표 간선 5개/)).toBeInTheDocument();
  });

  it("routes to the binary search learning page", () => {
    render(
      <MemoryRouter initialEntries={["/binary-search"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "이진 탐색" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/target 42/)).toBeInTheDocument();
  });

  it("routes to the dynamic programming learning page", () => {
    render(
      <MemoryRouter initialEntries={["/dynamic-programming"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "동적 계획법: 0/1 배낭" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/용량 10/)).toBeInTheDocument();
  });
});

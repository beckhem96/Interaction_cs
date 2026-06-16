import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { generateBinarySearchTreeTrace } from "../algorithms/binarySearchTree";
import { TreePage } from "./TreePage";

describe("TreePage", () => {
  it("renders the BST learning surface and initial visual state", () => {
    const { container } = render(
      <MemoryRouter>
        <TreePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "BST 삽입과 탐색" })
    ).toBeInTheDocument();
    expect(screen.getByText(/삽입 값: \[42, 23, 61/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "BST 트리 상태" })).toBeInTheDocument();
    expect(screen.getByText("빈 트리")).toBeInTheDocument();
    for (const button of screen.getAllByRole("button", { name: "이전" })) {
      expect(button).toBeDisabled();
    }
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
    expect(screen.getByRole("slider", { name: "트리 단계 슬라이더" })).toHaveValue("0");
    expect(container.querySelector(".tree-visual.motion-idle")).not.toBeNull();
  });

  it("advances through insertion and comparison states", () => {
    const { container } = render(
      <MemoryRouter>
        <TreePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "트리 다음 단계" }));

    expect(screen.getByText("42 루트 삽입")).toBeInTheDocument();
    expect(container.querySelector(".tree-node.is-inserted")).not.toBeNull();
    expect(screen.getByLabelText("42 노드")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "트리 다음 단계" }));

    expect(screen.getByText("23와 42 비교")).toBeInTheDocument();
    expect(container.querySelector(".tree-node.is-compared")).not.toBeNull();
    expect(
      screen.getByRole("listitem", {
        name: "현재 코드 4: if (value < node.value) {"
      })
    ).toBeInTheDocument();
  });

  it("supports manual scrubbing to search and traversal steps", () => {
    const { container } = render(
      <MemoryRouter>
        <TreePage />
      </MemoryRouter>
    );

    const trace = generateBinarySearchTreeTrace();
    const searchIndex = trace.findIndex((step) =>
      step.id.startsWith("bst-search-compare")
    );
    const traversalIndex = trace.findIndex((step) =>
      step.id.startsWith("bst-traversal-visit")
    );
    const slider = screen.getByRole("slider", { name: "트리 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(searchIndex) } });

    expect(screen.getAllByText(/탐색:/).length).toBeGreaterThan(0);
    expect(container.querySelector(".tree-node.is-compared")).not.toBeNull();

    fireEvent.change(slider, { target: { value: String(traversalIndex) } });

    expect(screen.getAllByText(/중위 순회:/).length).toBeGreaterThan(0);
    expect(container.querySelector(".tree-node.is-visited")).not.toBeNull();
    expect(screen.getByText(/순회 결과:/)).toBeInTheDocument();
  });
});

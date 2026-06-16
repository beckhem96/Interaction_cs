import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { generateAvlRotationTrace } from "../algorithms/avlTree";
import { generateBinarySearchTreeTrace } from "../algorithms/binarySearchTree";
import { generateBinarySearchTreeDeletionTrace } from "../algorithms/binarySearchTreeDeletion";
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

  it("switches to AVL rotation mode and highlights rotation steps", () => {
    const { container } = render(
      <MemoryRouter>
        <TreePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "AVL 회전" }));

    expect(
      screen.getByRole("heading", { name: "AVL 회전" })
    ).toBeInTheDocument();
    expect(screen.getByText(/포함 회전: LL, RR, RL/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "AVL 트리 상태" })).toBeInTheDocument();

    const trace = generateAvlRotationTrace();
    const firstRotationIndex = trace.findIndex((step) =>
      step.title.includes("LL 회전 적용")
    );
    const slider = screen.getByRole("slider", { name: "트리 단계 슬라이더" });
    fireEvent.change(slider, { target: { value: String(firstRotationIndex) } });

    expect(screen.getAllByText(/LL 회전 적용/).length).toBeGreaterThan(0);
    expect(container.querySelector(".tree-node.is-rotated")).not.toBeNull();
    expect(screen.getAllByText(/BF/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("listitem", {
        name: "현재 코드 13: if (balance > 1 && value < node.left.value) return rotateRight(node);"
      })
    ).toBeInTheDocument();
  });

  it("switches to BST deletion mode and highlights delete cases", () => {
    const { container } = render(
      <MemoryRouter>
        <TreePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "BST 삭제" }));

    expect(screen.getByRole("heading", { name: "BST 삭제" })).toBeInTheDocument();
    expect(screen.getByText(/삭제 값: \[15, 72, 42\]/)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "BST 삭제 트리 상태" })
    ).toBeInTheDocument();

    const trace = generateBinarySearchTreeDeletionTrace();
    const leafDeleteIndex = trace.findIndex((step) =>
      step.id.startsWith("bst-delete-leaf-15")
    );
    const successorIndex = trace.findIndex((step) =>
      step.id.startsWith("bst-delete-successor-found-42-54")
    );
    const slider = screen.getByRole("slider", { name: "트리 단계 슬라이더" });

    fireEvent.change(slider, { target: { value: String(leafDeleteIndex) } });

    expect(screen.getAllByText("15 리프 노드 제거").length).toBeGreaterThan(0);
    expect(container.querySelector(".tree-node.is-removing")).not.toBeNull();
    expect(
      screen.getByRole("listitem", {
        name: "현재 코드 11: if (node.left === null && node.right === null) return null;"
      })
    ).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: String(successorIndex) } });

    expect(screen.getAllByText("successor 54 선택").length).toBeGreaterThan(0);
    expect(container.querySelector(".tree-node.is-successor")).not.toBeNull();
    expect(
      screen.getByRole("listitem", {
        name: "현재 코드 15: node.value = successor.value;"
      })
    ).toBeInTheDocument();
  });
});

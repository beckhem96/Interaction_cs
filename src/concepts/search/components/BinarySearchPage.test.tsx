import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { BinarySearchPage } from "./BinarySearchPage";

describe("BinarySearchPage", () => {
  it("renders the binary search learning surface", () => {
    render(
      <MemoryRouter>
        <BinarySearchPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "이진 탐색" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/target 42/)).toBeInTheDocument();
    expect(screen.getByText("binarySearch.c")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "C++" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Java" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Python" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "JavaScript" })).toBeInTheDocument();
  });

  it("moves to the next step and highlights the active code line", () => {
    render(
      <MemoryRouter>
        <BinarySearchPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("정렬된 배열과 target 준비")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "이진 탐색 다음 단계" }));

    expect(screen.getByText("0~13 범위 확인")).toBeInTheDocument();
    expect(screen.getByLabelText(/현재 코드 5:/)).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("switches to the missing target example", () => {
    render(
      <MemoryRouter>
        <BinarySearchPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("tab", { name: "실패 예시" }));

    expect(screen.getByText(/target 40/)).toBeInTheDocument();
    expect(screen.getByText(/배열 안에 없는 경우/)).toBeInTheDocument();
  });
});

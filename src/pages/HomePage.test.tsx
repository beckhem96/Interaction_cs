import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("renders the Phase 0 category cards", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "CS Visual Lab" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /정렬 알고리즘/ })).toHaveAttribute(
      "href",
      "/sorting"
    );
    expect(screen.getByRole("link", { name: /데이터베이스/ })).toHaveAttribute(
      "href",
      "/database"
    );
    expect(screen.getByRole("link", { name: /트리 자료구조/ })).toHaveAttribute(
      "href",
      "/trees"
    );
    expect(screen.getByRole("link", { name: /그래프 자료구조/ })).toHaveAttribute(
      "href",
      "/graphs"
    );
  });
});

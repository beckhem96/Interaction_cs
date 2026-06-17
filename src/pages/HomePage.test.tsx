import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("renders the concept category links", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "CS Visual Lab" }),
    ).toBeInTheDocument();

    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(hrefs).toEqual(
      expect.arrayContaining([
        "/sorting",
        "/database",
        "/trees",
        "/graphs",
        "/graphs/traversal",
        "/binary-search",
        "/dynamic-programming",
      ]),
    );
  });
});

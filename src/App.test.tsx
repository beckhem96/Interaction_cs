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
    expect(screen.getByText("입력 배열: [5, 3, 8, 4, 2]")).toBeInTheDocument();
  });
});

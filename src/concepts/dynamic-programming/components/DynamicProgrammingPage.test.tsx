import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { DynamicProgrammingPage } from "./DynamicProgrammingPage";

describe("DynamicProgrammingPage", () => {
  it("renders the 0/1 knapsack learning surface", () => {
    render(
      <MemoryRouter>
        <DynamicProgrammingPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "동적 계획법: 0/1 배낭" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/용량 10/)).toBeInTheDocument();
    expect(screen.getByText("knapsack.c")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "C++" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Java" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Python" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "JavaScript" })).toBeInTheDocument();
  });

  it("moves to the next DP step and highlights active code", () => {
    render(
      <MemoryRouter>
        <DynamicProgrammingPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("DP 표 초기화")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "동적 계획법 다음 단계" }));

    expect(screen.getByText("카메라 고려 시작")).toBeInTheDocument();
    expect(screen.getByLabelText(/현재 코드 3:/)).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("switches displayed code language", () => {
    render(
      <MemoryRouter>
        <DynamicProgrammingPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Python" }));

    expect(screen.getByText("knapsack.py")).toBeInTheDocument();
    expect(screen.getByLabelText(/현재 코드 2:/)).toHaveTextContent(
      "dp = [[0]",
    );
  });
});
